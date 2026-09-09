import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";
import { dateTypeOptions } from "@/config/inviteDateTypes";
import { DateTypeId } from "@/types/invite";
import { OptionCard } from "../components/OptionCard";
import { useInviteWizard } from "../InviteWizardContext";

export function DateTypeStep() {
  const { t } = useLanguage();
  const { form, setDateType, goNext } = useInviteWizard();
  const [primary, setPrimary] = useState<DateTypeId | null>(form.dateType.primary);
  const [secondary, setSecondary] = useState<DateTypeId | undefined>(form.dateType.secondary);
  const [otherText, setOtherText] = useState(form.dateType.otherText ?? "");

  const handleSelectPrimary = (id: DateTypeId) => {
    setPrimary(id);
    if (secondary === id) setSecondary(undefined);
  };

  const handleSelectSecondary = (id: DateTypeId) => {
    setSecondary((current) => (current === id ? undefined : id));
  };

  const handleContinue = () => {
    if (!primary) return;
    setDateType({ primary, secondary, otherText: otherText.trim() || undefined });
    goNext();
  };

  const showOtherInput = primary === "other" || secondary === "other";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-2">{t("invite.dateType.title")}</h2>
      <p className="text-muted-foreground mb-6">{t("invite.dateType.subtitle")}</p>

      <p className="text-sm font-medium mb-3">{t("invite.dateType.primaryLabel")}</p>
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {dateTypeOptions.map((option) => (
          <OptionCard
            key={option.id}
            emoji={option.emoji}
            label={t(option.labelKey)}
            description={t(option.descriptionKey)}
            selected={primary === option.id}
            onSelect={() => handleSelectPrimary(option.id)}
          />
        ))}
      </div>

      <p className="text-sm font-medium mb-3">{t("invite.dateType.secondaryLabel")}</p>
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {dateTypeOptions
          .filter((option) => option.id !== primary)
          .map((option) => (
            <OptionCard
              key={option.id}
              emoji={option.emoji}
              label={t(option.labelKey)}
              selected={secondary === option.id}
              onSelect={() => handleSelectSecondary(option.id)}
            />
          ))}
      </div>

      {showOtherInput && (
        <Input
          value={otherText}
          onChange={(e) => setOtherText(e.target.value)}
          placeholder={t("invite.dateType.otherPlaceholder")}
          className="mb-6"
        />
      )}

      <Button onClick={handleContinue} disabled={!primary} className="w-full">
        {t("invite.nav.continue")}
      </Button>
    </div>
  );
}
