import { useCallback, useState } from "react";
import { defaultInviteProfile } from "@/config/inviteBaseline";
import { InviteProfileConfig } from "@/types/invite";

const STORAGE_KEY = "invite.profile.v1";

const readStoredProfile = (): InviteProfileConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultInviteProfile;
    const parsed = JSON.parse(raw) as Partial<InviteProfileConfig>;
    return {
      ...defaultInviteProfile,
      ...parsed,
      bio: { ...defaultInviteProfile.bio, ...parsed.bio },
      baselineAnswers: { ...defaultInviteProfile.baselineAnswers, ...parsed.baselineAnswers },
      defaultDateTypes: { ...defaultInviteProfile.defaultDateTypes, ...parsed.defaultDateTypes },
    };
  } catch {
    return defaultInviteProfile;
  }
};

/**
 * Hugo's editable invite profile (bio, baseline quiz answers, default date
 * types). Sprint 1 persists it to localStorage only; Sprint 2 swaps this for
 * a `profileAnswers/hugo` Firestore read/write behind the same interface.
 */
export function useInviteProfile() {
  const [profile, setProfileState] = useState<InviteProfileConfig>(() => readStoredProfile());

  const saveProfile = useCallback((next: InviteProfileConfig) => {
    setProfileState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Error saving invite profile:", e);
    }
  }, []);

  const resetProfile = useCallback(() => {
    saveProfile(defaultInviteProfile);
  }, [saveProfile]);

  return { profile, saveProfile, resetProfile };
}
