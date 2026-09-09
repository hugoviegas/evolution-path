import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useInviteProfile } from "@/hooks/useInviteProfile";
import { useInviteWizard } from "../InviteWizardContext";

export function BioStep() {
  const { t, language } = useLanguage();
  const { profile } = useInviteProfile();
  const { goNext } = useInviteWizard();
  const { bio } = profile;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{t("invite.bio.title")}</h2>
        <p className="text-muted-foreground">{t("invite.bio.subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("invite.bio.who.title")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{bio.role[language]}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("invite.bio.what.title")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>{bio.city[language]}</p>
            <p className="text-xs">
              {t("invite.bio.techStackLabel")}: {bio.techStack.join(", ")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("invite.bio.likes.title")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{bio.vibe[language]}</CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-2">{t("invite.bio.photosCaption")}</p>
        <div className="grid grid-cols-3 gap-3">
          {bio.photos.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt=""
              className="aspect-square w-full rounded-lg object-cover border border-border"
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground/70 italic mb-6">
        {t("invite.bio.editableNote")}
      </p>

      <Button onClick={goNext} className="w-full">
        {t("invite.nav.continue")}
      </Button>
    </div>
  );
}
