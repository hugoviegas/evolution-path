import TopControls from "@/components/TopControls";
import { InviteProgressHeader } from "@/features/invite/components/InviteProgressHeader";
import { InviteWizardProvider, useInviteWizard } from "@/features/invite/InviteWizardContext";
import { HeroStep } from "@/features/invite/steps/HeroStep";
import { IdentityStep } from "@/features/invite/steps/IdentityStep";
import { IntentionsStep } from "@/features/invite/steps/IntentionsStep";
import { QuizStep } from "@/features/invite/steps/QuizStep";
import { BioStep } from "@/features/invite/steps/BioStep";
import { DateTypeStep } from "@/features/invite/steps/DateTypeStep";
import { AvailabilityStep } from "@/features/invite/steps/AvailabilityStep";
import { SummaryStep } from "@/features/invite/steps/SummaryStep";

function InviteFlow() {
  const { step } = useInviteWizard();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopControls />
      {step !== "hero" && <InviteProgressHeader />}

      {step === "hero" && <HeroStep />}
      {step === "identity" && <IdentityStep />}
      {step === "intentions" && <IntentionsStep />}
      {step === "quiz" && <QuizStep />}
      {step === "bio" && <BioStep />}
      {step === "dateType" && <DateTypeStep />}
      {step === "availability" && <AvailabilityStep />}
      {step === "summary" && <SummaryStep />}
    </div>
  );
}

const Invite = () => {
  return (
    <InviteWizardProvider>
      <InviteFlow />
    </InviteWizardProvider>
  );
};

export default Invite;
