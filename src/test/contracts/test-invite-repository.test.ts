import { beforeEach, describe, expect, test, vi } from "vitest";

const setDocMock = vi.fn();
const getDocMock = vi.fn();

vi.mock("firebase/firestore", () => ({
  doc: vi.fn((_db: unknown, ...segments: string[]) => segments.join("/")),
  setDoc: (...args: unknown[]) => setDocMock(...args),
  getDoc: (...args: unknown[]) => getDocMock(...args),
  serverTimestamp: () => "SERVER_TIMESTAMP",
}));

const getDbMock = vi.fn();
vi.mock("@/lib/firebase", () => ({
  getDb: () => getDbMock(),
}));

const { FirestoreUnavailableError, saveInvite, fetchProfileAnswers, saveProfileAnswers } = await import(
  "@/lib/inviteRepository"
);

describe("inviteRepository", () => {
  beforeEach(() => {
    setDocMock.mockReset();
    getDocMock.mockReset();
    getDbMock.mockReset();
  });

  test("saveInvite throws FirestoreUnavailableError when Firestore isn't configured", async () => {
    getDbMock.mockReturnValue(null);
    await expect(saveInvite("invite-1", { status: "draft" })).rejects.toBeInstanceOf(
      FirestoreUnavailableError,
    );
    expect(setDocMock).not.toHaveBeenCalled();
  });

  test("saveInvite merge-writes the given fields when Firestore is configured", async () => {
    getDbMock.mockReturnValue({});
    setDocMock.mockResolvedValue(undefined);

    await saveInvite("invite-1", { status: "draft", intention: "youDecide" });

    expect(setDocMock).toHaveBeenCalledTimes(1);
    const [, data, options] = setDocMock.mock.calls[0];
    expect(data).toMatchObject({ status: "draft", intention: "youDecide" });
    expect(options).toEqual({ merge: true });
  });

  test("fetchProfileAnswers returns null (not a rejection) when Firestore isn't configured", async () => {
    getDbMock.mockReturnValue(null);
    await expect(fetchProfileAnswers()).resolves.toBeNull();
    expect(getDocMock).not.toHaveBeenCalled();
  });

  test("fetchProfileAnswers returns null when the document doesn't exist yet", async () => {
    getDbMock.mockReturnValue({});
    getDocMock.mockResolvedValue({ exists: () => false });
    await expect(fetchProfileAnswers()).resolves.toBeNull();
  });

  test("fetchProfileAnswers returns the stored profile fields when the document exists", async () => {
    getDbMock.mockReturnValue({});
    const stored = {
      bio: { role: { EN: "a", PT: "b" }, city: { EN: "c", PT: "d" }, techStack: [], vibe: { EN: "e", PT: "f" }, photos: [] },
      baselineAnswers: { hobbies: "tech_games" },
      baselineIntention: "youDecide",
      defaultDateTypes: { primary: "dinner" },
    };
    getDocMock.mockResolvedValue({ exists: () => true, data: () => stored });

    await expect(fetchProfileAnswers()).resolves.toEqual(stored);
  });

  test("saveProfileAnswers throws FirestoreUnavailableError when Firestore isn't configured", async () => {
    getDbMock.mockReturnValue(null);
    await expect(
      saveProfileAnswers({
        bio: { role: { EN: "", PT: "" }, city: { EN: "", PT: "" }, techStack: [], vibe: { EN: "", PT: "" }, photos: [] },
        baselineAnswers: {},
        baselineIntention: "youDecide",
        defaultDateTypes: { primary: null },
      }),
    ).rejects.toBeInstanceOf(FirestoreUnavailableError);
    expect(setDocMock).not.toHaveBeenCalled();
  });
});
