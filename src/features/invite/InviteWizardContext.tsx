import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  AvailabilityInfo,
  DateTypeSelection,
  IdentityInfo,
  IntentionId,
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
  submit: () => void;
}

const InviteWizardContext = createContext<InviteWizardContextValue | undefined>(undefined);

export function InviteWizardProvider({ children }: { children: ReactNode }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<InviteFormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  const step = inviteSteps[stepIndex];

  const goNext = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, inviteSteps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const setIdentity = useCallback((identity: IdentityInfo) => {
    setForm((f) => ({ ...f, identity }));
  }, []);

  const setIntention = useCallback((intention: IntentionId) => {
    setForm((f) => ({ ...f, intention }));
  }, []);

  const setQuizAnswer = useCallback((topic: QuizTopic, optionId: string) => {
    setForm((f) => ({ ...f, quizAnswers: { ...f.quizAnswers, [topic]: optionId } }));
  }, []);

  const setDateType = useCallback((selection: DateTypeSelection) => {
    setForm((f) => ({ ...f, dateType: selection }));
  }, []);

  const setAvailability = useCallback((availability: AvailabilityInfo) => {
    setForm((f) => ({ ...f, availability }));
  }, []);

  const submit = useCallback(() => {
    setSubmitted(true);
  }, []);

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
