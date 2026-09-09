import { describe, expect, test } from "vitest";
import { alreadySent, isDuplicateSubmission } from "../emailGuards";

describe("alreadySent", () => {
  test("true only when emailStatus is exactly 'sent'", () => {
    expect(alreadySent({ emailStatus: "sent" })).toBe(true);
    expect(alreadySent({ emailStatus: "pending" })).toBe(false);
    expect(alreadySent({ emailStatus: "failed" })).toBe(false);
    expect(alreadySent({})).toBe(false);
  });
});

describe("isDuplicateSubmission", () => {
  const base = {
    id: "invite-1",
    identity: { name: "Ana", instagram: "@ana" },
    submittedAt: "2026-01-01T12:00:00.000Z",
  };

  test("false when there are no other submissions", () => {
    expect(isDuplicateSubmission(base, [])).toBe(false);
  });

  test("false when the only match is itself", () => {
    expect(isDuplicateSubmission(base, [base])).toBe(false);
  });

  test("true for a same-handle submission inside the window (case/whitespace-insensitive)", () => {
    const other = {
      id: "invite-2",
      identity: { name: "Ana", instagram: " @ANA " },
      submittedAt: "2026-01-01T12:02:00.000Z", // 2 minutes later
    };
    expect(isDuplicateSubmission(base, [other])).toBe(true);
  });

  test("false for a same-handle submission outside the window", () => {
    const other = {
      id: "invite-2",
      identity: { name: "Ana", instagram: "@ana" },
      submittedAt: "2026-01-01T12:30:00.000Z", // 30 minutes later
    };
    expect(isDuplicateSubmission(base, [other], 5 * 60 * 1000)).toBe(false);
  });

  test("false for a different handle inside the window", () => {
    const other = {
      id: "invite-2",
      identity: { name: "Bea", instagram: "@bea" },
      submittedAt: "2026-01-01T12:01:00.000Z",
    };
    expect(isDuplicateSubmission(base, [other])).toBe(false);
  });

  test("false when the current submission has no instagram handle", () => {
    const noHandle = { id: "invite-1", identity: { name: "Ana", instagram: "" }, submittedAt: base.submittedAt };
    const other = { id: "invite-2", identity: { name: "Ana", instagram: "" }, submittedAt: base.submittedAt };
    expect(isDuplicateSubmission(noHandle, [other])).toBe(false);
  });
});
