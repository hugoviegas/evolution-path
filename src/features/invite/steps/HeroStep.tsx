import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useInviteWizard } from "../InviteWizardContext";

export function HeroStep() {
  const { t } = useLanguage();
  const { goNext } = useInviteWizard();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-24 max-w-xl mx-auto">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
        <Sparkles className="h-4 w-4 text-primary" />
        {t("invite.hero.badge")}
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
        {t("invite.hero.title")}
      </h1>
      <p className="text-muted-foreground text-base sm:text-lg mb-10 leading-relaxed">
        {t("invite.hero.subtitle")}
      </p>
      <Button size="lg" onClick={goNext} className="px-8">
        {t("invite.hero.cta")}
      </Button>
    </div>
  );
}
