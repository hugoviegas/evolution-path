import { beforeEach, describe, expect, test, vi } from "vitest";

vi.hoisted(() => {
  process.env.INVITE_NOTIFY_EMAIL = "hugo@example.com";
  process.env.INVITE_FROM_EMAIL = "invite@example.com";
});

const getAdminDbMock = vi.fn();
vi.mock("../_lib/firebaseAdmin", () => ({
  getAdminDb: () => getAdminDbMock(),
}));

const getResendClientMock = vi.fn();
vi.mock("../_lib/resend", () => ({
  getResendClient: () => getResendClientMock(),
}));

const { default: handler } = await import("../send-invite-email");

interface FakeInvite {
  id: string;
  [key: string]: unknown;
}

function makeFakeDb(invite: FakeInvite, otherDocs: FakeInvite[] = []) {
  const inviteRef = {
    get: vi.fn().mockResolvedValue({ exists: true, id: invite.id, data: () => invite }),
    update: vi.fn().mockResolvedValue(undefined),
  };
  const whereChain: { where: ReturnType<typeof vi.fn>; get: ReturnType<typeof vi.fn> } = {
    where: vi.fn(() => whereChain),
    get: vi.fn().mockResolvedValue({ docs: otherDocs.map((doc) => ({ id: doc.id, data: () => doc })) }),
  };
  const collectionApi = {
    doc: vi.fn(() => inviteRef),
    where: vi.fn(() => whereChain),
  };
  const db = { collection: vi.fn(() => collectionApi) };
  return { db, inviteRef };
}

function makeReqRes(body: unknown, method = "POST") {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { req: { method, body } as never, res: { status } as never, status, json };
}

const baseInvite: FakeInvite = {
  id: "invite-1",
  identity: { name: "Ana", instagram: "@ana", email: "ana@example.com" },
  language: "EN",
  status: "submitted",
  submittedAt: "2026-01-01T12:00:00.000Z",
};

describe("send-invite-email handler", () => {
  beforeEach(() => {
    getAdminDbMock.mockReset();
    getResendClientMock.mockReset();
  });

  test("rejects non-POST methods", async () => {
    getAdminDbMock.mockReturnValue(null);
    const { req, res, status, json } = makeReqRes({}, "GET");
    await handler(req, res);
    expect(status).toHaveBeenCalledWith(405);
    expect(json).toHaveBeenCalledWith({ status: "method_not_allowed" });
  });

  test("rejects an invalid body", async () => {
    const { req, res, status, json } = makeReqRes({});
    await handler(req, res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ status: "invalid_body" });
  });

  test("skips gracefully when Firebase Admin isn't configured", async () => {
    getAdminDbMock.mockReturnValue(null);
    const { req, res, status, json } = makeReqRes({ inviteId: "invite-1" });
    await handler(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ status: "skipped_not_configured" });
  });

  test("sends both emails and marks the invite sent on the happy path", async () => {
    const { db, inviteRef } = makeFakeDb(baseInvite);
    getAdminDbMock.mockReturnValue(db);
    const sendMock = vi.fn().mockResolvedValue({ data: { id: "email-1" }, error: null });
    getResendClientMock.mockReturnValue({ emails: { send: sendMock } });

    const { req, res, status, json } = makeReqRes({ inviteId: "invite-1" });
    await handler(req, res);

    expect(sendMock).toHaveBeenCalledTimes(2);
    expect(sendMock.mock.calls[0][0]).toMatchObject({ to: "hugo@example.com" });
    expect(sendMock.mock.calls[1][0]).toMatchObject({ to: "ana@example.com" });
    expect(inviteRef.update).toHaveBeenCalledWith(
      expect.objectContaining({ emailStatus: "sent", emailSentAt: expect.any(String) }),
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ status: "sent" });
  });

  test("skips the guest email when no email address was provided", async () => {
    const noEmailInvite = { ...baseInvite, identity: { name: "Ana", instagram: "@ana" } };
    const { db } = makeFakeDb(noEmailInvite);
    getAdminDbMock.mockReturnValue(db);
    const sendMock = vi.fn().mockResolvedValue({ data: { id: "email-1" }, error: null });
    getResendClientMock.mockReturnValue({ emails: { send: sendMock } });

    const { req, res } = makeReqRes({ inviteId: "invite-1" });
    await handler(req, res);

    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  test("is idempotent — never resends once emailStatus is 'sent'", async () => {
    const { db, inviteRef } = makeFakeDb({ ...baseInvite, emailStatus: "sent" });
    getAdminDbMock.mockReturnValue(db);
    const sendMock = vi.fn();
    getResendClientMock.mockReturnValue({ emails: { send: sendMock } });

    const { req, res, status, json } = makeReqRes({ inviteId: "invite-1" });
    await handler(req, res);

    expect(sendMock).not.toHaveBeenCalled();
    expect(inviteRef.update).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ status: "already_sent" });
  });

  test("skips sending for a duplicate submission within the abuse window", async () => {
    const duplicate: FakeInvite = {
      id: "invite-2",
      identity: { name: "Ana", instagram: "@ana" },
      status: "submitted",
      submittedAt: "2026-01-01T12:01:00.000Z",
    };
    const { db, inviteRef } = makeFakeDb(baseInvite, [duplicate]);
    getAdminDbMock.mockReturnValue(db);
    const sendMock = vi.fn();
    getResendClientMock.mockReturnValue({ emails: { send: sendMock } });

    const { req, res, status, json } = makeReqRes({ inviteId: "invite-1" });
    await handler(req, res);

    expect(sendMock).not.toHaveBeenCalled();
    expect(inviteRef.update).toHaveBeenCalledWith({ emailStatus: "skipped_duplicate" });
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ status: "skipped_duplicate" });
  });

  test("retries once on failure, then marks the invite failed without a 500", async () => {
    const { db, inviteRef } = makeFakeDb(baseInvite);
    getAdminDbMock.mockReturnValue(db);
    const sendMock = vi.fn().mockRejectedValue(new Error("network error"));
    getResendClientMock.mockReturnValue({ emails: { send: sendMock } });

    const { req, res, status, json } = makeReqRes({ inviteId: "invite-1" });
    await handler(req, res);

    expect(sendMock).toHaveBeenCalledTimes(2); // 1 attempt + 1 retry
    expect(inviteRef.update).toHaveBeenCalledWith({ emailStatus: "failed" });
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ status: "failed" });
  });
});
