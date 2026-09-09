import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { intentionOptions } from "@/config/inviteIntentions";
import { IntentionId } from "@/types/invite";
import { OptionCard } from "../components/OptionCard";
import { useInviteWizard } from "../InviteWizardContext";

export function IntentionsStep() {
  const { t } = useLanguage();
  const { form, setIntention, goNext } = useInviteWizard();
  const [selected, setSelected] = useState<IntentionId | null>(form.intention);

  const handleContinue = () => {
    if (!selected) return;
    setIntention(selected);
    goNext();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-2">{t("invite.intentions.title")}</h2>
      <p className="text-muted-foreground mb-6">{t("invite.intentions.subtitle")}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {intentionOptions.map((option) => (
          <OptionCard
            key={option.id}
            emoji={option.emoji}
            label={t(option.labelKey)}
            selected={selected === option.id}
            onSelect={() => setSelected(option.id)}
          />
        ))}
      </div>

      <Button onClick={handleContinue} disabled={!selected} className="w-full mt-6">
        {t("invite.nav.continue")}
      </Button>
    </div>
  );
}
