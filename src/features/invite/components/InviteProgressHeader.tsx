import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguage";
import { inviteSteps, useInviteWizard } from "../InviteWizardContext";

/** The quiz step manages its own internal back navigation across sub-questions. */
const STEPS_WITH_OWN_BACK: Array<(typeof inviteSteps)[number]> = ["quiz"];

export function InviteProgressHeader() {
  const { t } = useLanguage();
  const { step, stepIndex, goBack } = useInviteWizard();
  const total = inviteSteps.length;
  const current = stepIndex + 1;
  const percent = Math.round((current / total) * 100);
  const stepLabel = t("invite.progress.stepOf")
    .replace("{current}", String(current))
    .replace("{total}", String(total));

  const showBack = stepIndex > 0 && !STEPS_WITH_OWN_BACK.includes(step);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20 pb-2">
      <div className="flex items-center justify-between mb-2">
        {showBack ? (
          <Button variant="ghost" size="sm" onClick={goBack} className="gap-1 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            {t("invite.nav.back")}
          </Button>
        ) : (
          <span />
        )}
        <span className="text-xs text-muted-foreground">{stepLabel}</span>
      </div>
      <Progress value={percent} className="h-1.5" />
    </div>
  );
}
