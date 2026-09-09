import { useCallback, useEffect, useState } from "react";
import { defaultInviteProfile } from "@/config/inviteBaseline";
import {
  FirestoreUnavailableError,
  fetchProfileAnswers,
  saveProfileAnswers,
} from "@/lib/inviteRepository";
import { InviteProfileConfig } from "@/types/invite";

const STORAGE_KEY = "invite.profile.v1";

const mergeWithDefaults = (partial: Partial<InviteProfileConfig>): InviteProfileConfig => ({
  ...defaultInviteProfile,
  ...partial,
  bio: { ...defaultInviteProfile.bio, ...partial.bio },
  baselineAnswers: { ...defaultInviteProfile.baselineAnswers, ...partial.baselineAnswers },
  defaultDateTypes: { ...defaultInviteProfile.defaultDateTypes, ...partial.defaultDateTypes },
});

const readCachedProfile = (): InviteProfileConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultInviteProfile;
    return mergeWithDefaults(JSON.parse(raw) as Partial<InviteProfileConfig>);
  } catch {
    return defaultInviteProfile;
  }
};

const writeCachedProfile = (profile: InviteProfileConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Error caching invite profile locally:", e);
  }
};

/**
 * Hugo's editable invite profile (bio, baseline quiz answers, default date
 * types). Reads from Firestore (`profileAnswers/hugo`) when configured,
 * falling back to a localStorage cache and finally to the built-in seed —
 * so /invite keeps working even before Firebase env vars are set, and
 * /invite/profile keeps working offline.
 */
export function useInviteProfile() {
  const [profile, setProfile] = useState<InviteProfileConfig>(() => readCachedProfile());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchProfileAnswers()
      .then((remote) => {
        if (cancelled || !remote) return;
        const merged = mergeWithDefaults(remote);
        setProfile(merged);
        writeCachedProfile(merged);
      })
      .catch((e) => {
        console.error("Error fetching invite profile from Firestore:", e);
        if (!cancelled) setError("fetch");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const saveProfile = useCallback(async (next: InviteProfileConfig) => {
    setProfile(next);
    writeCachedProfile(next);
    setError(null);
    try {
      await saveProfileAnswers(next);
    } catch (e) {
      // Firestore not configured yet is expected (local-only mode) — the
      // localStorage write above already succeeded, so don't surface it as
      // an error. Any other failure is a real Firestore problem.
      if (e instanceof FirestoreUnavailableError) return;
      console.error("Error saving invite profile to Firestore:", e);
      setError("save");
      throw e;
    }
  }, []);

  const resetProfile = useCallback(async () => {
    await saveProfile(defaultInviteProfile);
  }, [saveProfile]);

  return { profile, loading, error, saveProfile, resetProfile };
}
