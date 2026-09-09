import { ReactNode, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useInviteProfile } from "@/hooks/useInviteProfile";
import { computeCompatibility } from "@/lib/compatibility";
import { intentionOptions } from "@/config/inviteIntentions";
import { dateTypeOptions } from "@/config/inviteDateTypes";
import { getQuizQuestion } from "@/config/inviteQuizOptions";
import { QuizTopic } from "@/types/invite";
import { useInviteWizard } from "../InviteWizardContext";

function SummarySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{title}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function SummaryStep() {
  const { t } = useLanguage();
  const { form, submit, submitted } = useInviteWizard();
  const { profile } = useInviteProfile();

  const compatibility = useMemo(
    () =>
      computeCompatibility(
        form.quizAnswers,
        profile.baselineAnswers,
        form.intention,
        profile.baselineIntention,
      ),
    [form.quizAnswers, form.intention, profile.baselineAnswers, profile.baselineIntention],
  );

  const intention = intentionOptions.find((option) => option.id === form.intention);
  const primaryDateType = dateTypeOptions.find((option) => option.id === form.dateType.primary);
  const secondaryDateType = dateTypeOptions.find((option) => option.id === form.dateType.secondary);
  const answeredQuizEntries = Object.entries(form.quizAnswers).filter(([, value]) => !!value);

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-3">{t("invite.summary.confirmedTitle")}</h2>
        <p className="text-muted-foreground">{t("invite.summary.confirmedBody")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-2">{t("invite.summary.title")}</h2>
      <p className="text-muted-foreground mb-6">{t("invite.summary.subtitle")}</p>

      <Card className="mb-4 border-primary/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span>{t("invite.compat.title")}</span>
            <span className="text-primary text-lg">{compatibility.score}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {t(`invite.compat.summary.${compatibility.summaryBucket}`)}
        </CardContent>
      </Card>

      <div className="space-y-4 mb-6">
        <SummarySection title={t("invite.summary.section.identity")}>
          <p>
            {form.identity.name} · {form.identity.instagram}
          </p>
        </SummarySection>

        <SummarySection title={t("invite.summary.section.intentions")}>
          <p>
            {intention ? `${intention.emoji} ${t(intention.labelKey)}` : t("invite.summary.noAnswer")}
          </p>
        </SummarySection>

        <SummarySection title={t("invite.summary.section.quiz")}>
          {answeredQuizEntries.length === 0 ? (
            <p>{t("invite.summary.noAnswer")}</p>
          ) : (
            <ul className="space-y-1">
              {answeredQuizEntries.map(([topic, optionId]) => {
                const question = getQuizQuestion(topic as QuizTopic);
                const option = question.options.find((o) => o.id === optionId);
                return (
                  <li key={topic}>
                    {option ? `${option.emoji} ${t(option.labelKey)}` : t("invite.summary.noAnswer")}
                  </li>
                );
              })}
            </ul>
          )}
        </SummarySection>

        <SummarySection title={t("invite.summary.section.dateType")}>
          <p>
            {primaryDateType
              ? `${primaryDateType.emoji} ${t(primaryDateType.labelKey)}`
              : t("invite.summary.noAnswer")}
            {secondaryDateType && ` · ${secondaryDateType.emoji} ${t(secondaryDateType.labelKey)}`}
            {form.dateType.otherText && ` — "${form.dateType.otherText}"`}
          </p>
        </SummarySection>

        <SummarySection title={t("invite.summary.section.whoDecides")}>
          <p>{t(`invite.availability.whoDecides.${form.availability.whoDecides}`)}</p>
        </SummarySection>

        <SummarySection title={t("invite.summary.section.availability")}>
          {form.availability.slots.length === 0 ? (
            <p>{t("invite.summary.noAnswer")}</p>
          ) : (
            <p>
              {Array.from(
                new Set(form.availability.slots.map((slot) => t(`invite.availability.day.${slot.day}`))),
              ).join(", ")}
              {" · "}
              {Array.from(
                new Set(
                  form.availability.slots.map((slot) => t(`invite.availability.period.${slot.period}`)),
                ),
              ).join(", ")}
            </p>
          )}
          {form.availability.note && <p className="text-xs mt-1 italic">"{form.availability.note}"</p>}
        </SummarySection>
      </div>

      <p className="text-xs text-muted-foreground mb-6">{t("invite.summary.disclaimer")}</p>

      <Button onClick={submit} className="w-full">
        {t("invite.summary.cta")}
      </Button>
    </div>
  );
}
