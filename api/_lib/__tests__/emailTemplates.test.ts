import { describe, expect, test } from "vitest";
import { buildGuestEmail, buildHugoEmail } from "../emailTemplates";
import { InviteDocument } from "../../../src/types/invite";

const baseInvite: InviteDocument = {
  id: "invite-1",
  identity: { name: "Ana Silva", instagram: "@anasilva", email: "ana@example.com" },
  intention: "funDate",
  dateType: { primary: "dinner", secondary: "games" },
  availability: {
    whoDecides: "hugo",
    slots: [
      { day: "fri", period: "evening" },
      { day: "sat", period: "afternoon" },
    ],
    note: "Only after 6pm",
  },
  compatibilityScore: 82,
  language: "EN",
  status: "submitted",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("buildHugoEmail", () => {
  test("selects English copy and includes key invite details", () => {
    const email = buildHugoEmail(baseInvite, "EN");
    expect(email.subject).toBe("New invite response from Ana Silva");
    expect(email.text).toContain("Hey Hugo,");
    expect(email.text).toContain("Ana Silva (@anasilva)");
    expect(email.text).toContain("Just a fun date");
    expect(email.text).toContain("Dinner / Games");
    expect(email.text).toContain("82%");
    expect(email.text).toContain("Only after 6pm");
    expect(email.html).toContain("Ana Silva");
  });

  test("selects Portuguese copy for the same invite", () => {
    const email = buildHugoEmail(baseInvite, "PT");
    expect(email.subject).toBe("Nova resposta do convite de Ana Silva");
    expect(email.text).toContain("E aí, Hugo,");
    expect(email.text).toContain("Só um date divertido");
    expect(email.text).toContain("Jantar / Games");
  });

  test("omits optional rows that weren't answered", () => {
    const minimal: InviteDocument = {
      id: "invite-2",
      identity: { name: "Bea", instagram: "@bea" },
      language: "EN",
      status: "submitted",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    const email = buildHugoEmail(minimal, "EN");
    expect(email.text).not.toContain("Intention:");
    expect(email.text).not.toContain("Date type:");
    expect(email.text).not.toContain("Compatibility:");
  });
});

describe("buildGuestEmail", () => {
  test("greets the guest by first name in English", () => {
    const email = buildGuestEmail(baseInvite, "EN");
    expect(email.subject).toBe("Got it — thanks for the invite answers!");
    expect(email.text).toContain("Hey Ana,");
    expect(email.text).toContain("Hugo will reach out");
  });

  test("greets the guest by first name in Portuguese", () => {
    const email = buildGuestEmail(baseInvite, "PT");
    expect(email.subject).toBe("Recebi — obrigado pelas respostas do convite!");
    expect(email.text).toContain("Oi, Ana,");
    expect(email.text).toContain("O Hugo vai chamar");
  });
});
