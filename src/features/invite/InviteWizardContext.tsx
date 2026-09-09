import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { notifyHugoOfInvite } from "@/lib/notifyHugo";
import { FirestoreUnavailableError, saveInvite } from "@/lib/inviteRepository";
import {
  AvailabilityInfo,
  DateTypeSelection,
  IdentityInfo,
  IntentionId,
  InviteDocument,
  InviteFormState,
  QuizTopic,
} from "@/types/invite";

export const inviteSteps = [
  "hero",
  "identity",
  "intentions",
  "quiz",
  "bio",
  "dateType",
  "availability",
  "summary",
] as const;

export type InviteStep = (typeof inviteSteps)[number];

const emptyForm: InviteFormState = {
  identity: { name: "", instagram: "", email: "", phone: "" },
  intention: null,
  quizAnswers: {},
  dateType: { primary: null },
  availability: { whoDecides: "hugo", slots: [] },
};

interface InviteWizardContextValue {
  step: InviteStep;
  stepIndex: number;
  goNext: () => void;
  goBack: () => void;
  form: InviteFormState;
  setIdentity: (identity: IdentityInfo) => void;
  setIntention: (intention: IntentionId) => void;
  setQuizAnswer: (topic: QuizTopic, optionId: string) => void;
  setDateType: (selection: DateTypeSelection) => void;
  setAvailability: (availability: AvailabilityInfo) => void;
  submitted: boolean;
  submitting: boolean;
  submitError: string | null;
  submit: (compatibilityScore: number) => Promise<void>;
}

const InviteWizardContext = createContext<InviteWizardContextValue | undefined>(undefined);

export function InviteWizardProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<InviteFormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // One id per wizard session, generated once and reused for every draft
  // save so all of a guest's partial progress lands in the same document.
  const inviteIdRef = useRef<string>(crypto.randomUUID());

  const step = inviteSteps[stepIndex];

  // Best-effort, non-blocking draft save: never throws to the caller. When
  // Firestore isn't configured yet, this is a silent no-op (expected until
  // Hugo sets the env vars) rather than a broken step.
  const persistDraft = useCallback(
    (patch: Partial<InviteDocument>) => {
      saveInvite(inviteIdRef.current, { status: "draft", language, ...patch }).catch((e) => {
        if (e instanceof FirestoreUnavailableError) return;
        console.error("Error saving invite draft:", e);
      });
    },
    [language],
  );

  const goNext = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, inviteSteps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const setIdentity = useCallback(
    (identity: IdentityInfo) => {
      setForm((f) => ({ ...f, identity }));
      persistDraft({ identity });
    },
    [persistDraft],
  );

  const setIntention = useCallback(
    (intention: IntentionId) => {
      setForm((f) => ({ ...f, intention }));
      persistDraft({ intention });
    },
    [persistDraft],
  );

  const setQuizAnswer = useCallback(
    (topic: QuizTopic, optionId: string) => {
      setForm((f) => {
        const quizAnswers = { ...f.quizAnswers, [topic]: optionId };
        persistDraft({ quizAnswers });
        return { ...f, quizAnswers };
      });
    },
    [persistDraft],
  );

  const setDateType = useCallback(
    (selection: DateTypeSelection) => {
      setForm((f) => ({ ...f, dateType: selection }));
      persistDraft({ dateType: selection });
    },
    [persistDraft],
  );

  const setAvailability = useCallback(
    (availability: AvailabilityInfo) => {
      setForm((f) => ({ ...f, availability }));
      persistDraft({ availability });
    },
    [persistDraft],
  );

  const submit = useCallback(
    async (compatibilityScore: number) => {
      setSubmitting(true);
      setSubmitError(null);

      const submittedAt = new Date().toISOString();
      const invite: InviteDocument = {
        id: inviteIdRef.current,
        ...form,
        compatibilityScore,
        language,
        status: "submitted",
        createdAt: submittedAt,
        updatedAt: submittedAt,
        submittedAt,
      };

      try {
        await saveInvite(inviteIdRef.current, invite);
      } catch (e) {
        if (!(e instanceof FirestoreUnavailableError)) {
          console.error("Error submitting invite:", e);
          setSubmitError("submit");
          setSubmitting(false);
          return;
        }
        // Not configured yet — degrade gracefully so the flow still works
        // for guests before Hugo finishes the Firebase setup.
        console.warn("Firestore not configured — invite not persisted:", invite.id);
      }

      notifyHugoOfInvite(invite).catch(() => undefined);
      setSubmitting(false);
      setSubmitted(true);
    },
    [form, language],
  );

  const value = useMemo<InviteWizardContextValue>(
    () => ({
      step,
      stepIndex,
      goNext,
      goBack,
      form,
      setIdentity,
      setIntention,
      setQuizAnswer,
      setDateType,
      setAvailability,
      submitted,
      submitting,
      submitError,
      submit,
    }),
    [
      step,
      stepIndex,
      goNext,
      goBack,
      form,
      setIdentity,
      setIntention,
      setQuizAnswer,
      setDateType,
      setAvailability,
      submitted,
      submitting,
      submitError,
      submit,
    ],
  );

  return <InviteWizardContext.Provider value={value}>{children}</InviteWizardContext.Provider>;
}

export function useInviteWizard() {
  const ctx = useContext(InviteWizardContext);
  if (!ctx) {
    throw new Error("useInviteWizard must be used within InviteWizardProvider");
  }
  return ctx;
}
