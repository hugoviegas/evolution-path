import { useState } from "react";
import { toast } from "sonner";
import TopControls from "@/components/TopControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";
import { useInviteProfile } from "@/hooks/useInviteProfile";
import { intentionOptions } from "@/config/inviteIntentions";
import { dateTypeOptions } from "@/config/inviteDateTypes";
import { quizQuestions } from "@/config/inviteQuizOptions";
import { OptionCard } from "@/features/invite/components/OptionCard";
import { PRIVATE_ANSWER_ID, DateTypeId, InviteProfileConfig, IntentionId } from "@/types/invite";

const InviteProfile = () => {
  const { t } = useLanguage();
  const { profile, saveProfile, resetProfile } = useInviteProfile();
  const [draft, setDraft] = useState<InviteProfileConfig>(profile);

  const updateBio = <K extends keyof InviteProfileConfig["bio"]>(
    key: K,
    value: InviteProfileConfig["bio"][K],
  ) => {
    setDraft((d) => ({ ...d, bio: { ...d.bio, [key]: value } }));
  };

  const handleSave = () => {
    saveProfile(draft);
    toast.success(t("invite.profile.saved"));
  };

  const handleReset = () => {
    resetProfile();
    setDraft(profile);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopControls />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        <h1 className="text-2xl font-bold mb-2">{t("invite.profile.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("invite.profile.subtitle")}</p>

        {/* Bio */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">{t("invite.profile.bio.title")}</h2>

          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            <div>
              <Label>{t("invite.profile.bio.roleLabel")} — {t("english")}</Label>
              <Input value={draft.bio.role.EN} onChange={(e) => updateBio("role", { ...draft.bio.role, EN: e.target.value })} />
            </div>
            <div>
              <Label>{t("invite.profile.bio.roleLabel")} — {t("portuguese")}</Label>
              <Input value={draft.bio.role.PT} onChange={(e) => updateBio("role", { ...draft.bio.role, PT: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            <div>
              <Label>{t("invite.profile.bio.cityLabel")} — {t("english")}</Label>
              <Input value={draft.bio.city.EN} onChange={(e) => updateBio("city", { ...draft.bio.city, EN: e.target.value })} />
            </div>
            <div>
              <Label>{t("invite.profile.bio.cityLabel")} — {t("portuguese")}</Label>
              <Input value={draft.bio.city.PT} onChange={(e) => updateBio("city", { ...draft.bio.city, PT: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            <div>
              <Label>{t("invite.profile.bio.vibeLabel")} — {t("english")}</Label>
              <Textarea value={draft.bio.vibe.EN} onChange={(e) => updateBio("vibe", { ...draft.bio.vibe, EN: e.target.value })} />
            </div>
            <div>
              <Label>{t("invite.profile.bio.vibeLabel")} — {t("portuguese")}</Label>
              <Textarea value={draft.bio.vibe.PT} onChange={(e) => updateBio("vibe", { ...draft.bio.vibe, PT: e.target.value })} />
            </div>
          </div>

          <div>
            <Label>{t("invite.profile.bio.techStackLabel")}</Label>
            <Input
              value={draft.bio.techStack.join(", ")}
              onChange={(e) =>
                updateBio(
                  "techStack",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                )
              }
            />
          </div>
        </section>

        {/* Baseline quiz answers */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-1">{t("invite.profile.baseline.title")}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t("invite.profile.baseline.subtitle")}</p>

          <div className="space-y-6">
            {quizQuestions.map((question) => (
              <div key={question.topic}>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <span>{question.emoji}</span>
                  {t(question.questionKey)}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {question.options
                    .filter((option) => option.id !== PRIVATE_ANSWER_ID)
                    .map((option) => (
                      <OptionCard
                        key={option.id}
                        emoji={option.emoji}
                        label={t(option.labelKey)}
                        selected={draft.baselineAnswers[question.topic] === option.id}
                        onSelect={() =>
                          setDraft((d) => ({
                            ...d,
                            baselineAnswers: { ...d.baselineAnswers, [question.topic]: option.id },
                          }))
                        }
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Baseline intention */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">{t("invite.profile.baseline.intentionLabel")}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {intentionOptions.map((option) => (
              <OptionCard
                key={option.id}
                emoji={option.emoji}
                label={t(option.labelKey)}
                selected={draft.baselineIntention === option.id}
                onSelect={() =>
                  setDraft((d) => ({ ...d, baselineIntention: option.id as IntentionId }))
                }
              />
            ))}
          </div>
        </section>

        {/* Default date types */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-1">{t("invite.profile.dateDefaults.title")}</h2>
          <p className="text-sm font-medium mt-4 mb-2">{t("invite.dateType.primaryLabel")}</p>
          <div className="grid gap-2 sm:grid-cols-3 mb-4">
            {dateTypeOptions.map((option) => (
              <OptionCard
                key={option.id}
                emoji={option.emoji}
                label={t(option.labelKey)}
                selected={draft.defaultDateTypes.primary === option.id}
                onSelect={() =>
                  setDraft((d) => ({
                    ...d,
                    defaultDateTypes: { ...d.defaultDateTypes, primary: option.id as DateTypeId },
                  }))
                }
              />
            ))}
          </div>
          <p className="text-sm font-medium mb-2">{t("invite.dateType.secondaryLabel")}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {dateTypeOptions
              .filter((option) => option.id !== draft.defaultDateTypes.primary)
              .map((option) => (
                <OptionCard
                  key={option.id}
                  emoji={option.emoji}
                  label={t(option.labelKey)}
                  selected={draft.defaultDateTypes.secondary === option.id}
                  onSelect={() =>
                    setDraft((d) => ({
                      ...d,
                      defaultDateTypes: {
                        ...d.defaultDateTypes,
                        secondary: d.defaultDateTypes.secondary === option.id ? undefined : (option.id as DateTypeId),
                      },
                    }))
                  }
                />
              ))}
          </div>
        </section>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            {t("invite.profile.reset")}
          </Button>
          <Button onClick={handleSave} className="flex-1">
            {t("invite.profile.save")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteProfile;
