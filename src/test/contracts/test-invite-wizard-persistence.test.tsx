import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { InviteWizardProvider, useInviteWizard } from "@/features/invite/InviteWizardContext";

vi.mock("@/lib/inviteRepository", async () => {
  const actual = await vi.importActual<typeof import("@/lib/inviteRepository")>(
    "@/lib/inviteRepository",
  );
  return {
    ...actual,
    saveInvite: vi.fn().mockRejectedValue(new actual.FirestoreUnavailableError()),
  };
});

vi.mock("@/lib/notifyHugo", () => ({
  notifyHugoOfInvite: vi.fn().mockResolvedValue(undefined),
}));

describe("InviteWizardContext draft persistence resilience", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("setIdentity updates local state without throwing when Firestore is unavailable", async () => {
    const { result } = renderHook(() => useInviteWizard(), { wrapper: InviteWizardProvider });

    await act(async () => {
      result.current.setIdentity({ name: "Ana", instagram: "@ana" });
      await Promise.resolve();
    });

    expect(result.current.form.identity.name).toBe("Ana");
  });

  test("submit still reaches the confirmation screen when Firestore is unavailable", async () => {
    const { result } = renderHook(() => useInviteWizard(), { wrapper: InviteWizardProvider });

    await act(async () => {
      await result.current.submit(80);
    });

    expect(result.current.submitted).toBe(true);
    expect(result.current.submitError).toBeNull();
  });
});
