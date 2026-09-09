import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { quizQuestions } from "@/config/inviteQuizOptions";
import { OptionCard } from "../components/OptionCard";
import { useInviteWizard } from "../InviteWizardContext";

export function QuizStep() {
  const { t } = useLanguage();
  const { form, setQuizAnswer, goNext, goBack } = useInviteWizard();
  const [subIndex, setSubIndex] = useState(0);

  const question = quizQuestions[subIndex];
  const isFirst = subIndex === 0;
  const isLast = subIndex === quizQuestions.length - 1;
  const currentAnswer = form.quizAnswers[question.topic];

  const handleNext = () => {
    if (isLast) {
      goNext();
    } else {
      setSubIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (isFirst) {
      goBack();
    } else {
      setSubIndex((i) => i - 1);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-1">{t("invite.quiz.title")}</h2>
      <p className="text-muted-foreground mb-1">{t("invite.quiz.subtitle")}</p>
      <p className="text-xs text-muted-foreground mb-6">
        {subIndex + 1} / {quizQuestions.length}
      </p>

      <p className="text-lg font-medium flex items-center gap-2 mb-4">
        <span className="text-2xl">{question.emoji}</span>
        {t(question.questionKey)}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {question.options.map((option) => (
          <OptionCard
            key={option.id}
            emoji={option.emoji}
            label={t(option.labelKey)}
            selected={currentAnswer === option.id}
            onSelect={() => setQuizAnswer(question.topic, option.id)}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          {t("invite.nav.back")}
        </Button>
        <Button onClick={handleNext} disabled={!currentAnswer} className="flex-1">
          {isLast ? t("invite.nav.continue") : t("invite.nav.next")}
        </Button>
      </div>
    </div>
  );
}
