import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { AvailabilityPeriod, WhoDecides } from "@/types/invite";
import { OptionCard } from "../components/OptionCard";
import { useInviteWizard } from "../InviteWizardContext";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const PERIODS: AvailabilityPeriod[] = ["morning", "afternoon", "evening"];

export function AvailabilityStep() {
  const { t } = useLanguage();
  const { form, setAvailability, goNext } = useInviteWizard();
  const [whoDecides, setWhoDecides] = useState<WhoDecides>(form.availability.whoDecides);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    Array.from(new Set(form.availability.slots.map((slot) => slot.day))),
  );
  const [selectedPeriods, setSelectedPeriods] = useState<AvailabilityPeriod[]>(
    Array.from(new Set(form.availability.slots.map((slot) => slot.period))),
  );
  const [note, setNote] = useState(form.availability.note ?? "");

  const toggleDay = (day: string) => {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day],
    );
  };

  const togglePeriod = (period: AvailabilityPeriod) => {
    setSelectedPeriods((current) =>
      current.includes(period) ? current.filter((p) => p !== period) : [...current, period],
    );
  };

  const handleContinue = () => {
    const slots = selectedDays.flatMap((day) =>
      selectedPeriods.map((period) => ({ day, period })),
    );
    setAvailability({ whoDecides, slots, note: note.trim() || undefined });
    goNext();
  };

  const chipClass = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-1.5 text-sm transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border hover:bg-accent",
    );

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-2">{t("invite.availability.title")}</h2>
      <p className="text-muted-foreground mb-6">{t("invite.availability.subtitle")}</p>

      <p className="text-sm font-medium mb-3">{t("invite.availability.whoDecides.title")}</p>
      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        <OptionCard
          label={t("invite.availability.whoDecides.guest")}
          emoji="🙋"
          selected={whoDecides === "guest"}
          onSelect={() => setWhoDecides("guest")}
        />
        <OptionCard
          label={t("invite.availability.whoDecides.hugo")}
          emoji="🎁"
          selected={whoDecides === "hugo"}
          onSelect={() => setWhoDecides("hugo")}
        />
      </div>

      <p className="text-sm font-medium mb-3">{t("invite.availability.daysLabel")}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={chipClass(selectedDays.includes(day))}
          >
            {t(`invite.availability.day.${day}`)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {PERIODS.map((period) => (
          <button
            key={period}
            type="button"
            onClick={() => togglePeriod(period)}
            className={chipClass(selectedPeriods.includes(period))}
          >
            {t(`invite.availability.period.${period}`)}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label htmlFor="invite-availability-note" className="text-sm font-medium mb-2 block">
          {t("invite.availability.note.label")}
        </label>
        <Textarea
          id="invite-availability-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("invite.availability.note.placeholder")}
        />
      </div>

      <Button onClick={handleContinue} className="w-full">
        {t("invite.nav.continue")}
      </Button>
    </div>
  );
}
