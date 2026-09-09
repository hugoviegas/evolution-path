import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { IdentityInfo } from "@/types/invite";
import { useInviteWizard } from "../InviteWizardContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  name?: string;
  instagram?: string;
  email?: string;
}

export function IdentityStep() {
  const { t } = useLanguage();
  const { form, setIdentity, goNext } = useInviteWizard();
  const [values, setValues] = useState<IdentityInfo>(form.identity);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleContinue = () => {
    const nextErrors: FormErrors = {};
    if (!values.name.trim()) nextErrors.name = t("invite.identity.error.name");
    if (!values.instagram.trim()) nextErrors.instagram = t("invite.identity.error.instagram");
    if (values.email && !EMAIL_PATTERN.test(values.email)) {
      nextErrors.email = t("invite.identity.error.email");
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIdentity(values);
    goNext();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-2">{t("invite.identity.title")}</h2>
      <p className="text-muted-foreground mb-6">{t("invite.identity.subtitle")}</p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="invite-name">{t("invite.identity.name.label")}</Label>
          <Input
            id="invite-name"
            value={values.name}
            placeholder={t("invite.identity.name.placeholder")}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="invite-instagram">{t("invite.identity.instagram.label")}</Label>
          <Input
            id="invite-instagram"
            value={values.instagram}
            placeholder={t("invite.identity.instagram.placeholder")}
            onChange={(e) => setValues((v) => ({ ...v, instagram: e.target.value }))}
          />
          {errors.instagram && <p className="text-sm text-destructive mt-1">{errors.instagram}</p>}
        </div>

        <div>
          <Label htmlFor="invite-email">{t("invite.identity.email.label")}</Label>
          <Input
            id="invite-email"
            type="email"
            value={values.email ?? ""}
            placeholder={t("invite.identity.email.placeholder")}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="invite-phone">{t("invite.identity.phone.label")}</Label>
          <Input
            id="invite-phone"
            value={values.phone ?? ""}
            placeholder={t("invite.identity.phone.placeholder")}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">{t("invite.identity.privacyNote")}</p>

      <Button onClick={handleContinue} className="w-full mt-6">
        {t("invite.nav.continue")}
      </Button>
    </div>
  );
}
