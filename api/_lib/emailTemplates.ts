import { getTranslation } from "../../src/config/translations";
import { dateTypeOptions } from "../../src/config/inviteDateTypes";
import { intentionOptions } from "../../src/config/inviteIntentions";
import { InviteDocument, LanguageCode } from "../../src/types/invite";

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

const t = (key: string, language: LanguageCode) => getTranslation(key, language);

const withName = (template: string, name: string) => template.replace("{name}", name);

const firstName = (fullName?: string) => (fullName ?? "").trim().split(/\s+/)[0] || fullName || "";

const intentionLabel = (invite: InviteDocument, language: LanguageCode): string | null => {
  const option = intentionOptions.find((o) => o.id === invite.intention);
  return option ? t(option.labelKey, language) : null;
};

const dateTypeLabel = (invite: InviteDocument, language: LanguageCode): string | null => {
  const primary = dateTypeOptions.find((o) => o.id === invite.dateType?.primary);
  if (!primary) return null;
  const secondary = dateTypeOptions.find((o) => o.id === invite.dateType?.secondary);
  let label = t(primary.labelKey, language);
  if (secondary) label += ` / ${t(secondary.labelKey, language)}`;
  if (invite.dateType?.otherText) label += ` ("${invite.dateType.otherText}")`;
  return label;
};

const availabilitySummary = (invite: InviteDocument, language: LanguageCode): string | null => {
  const slots = invite.availability?.slots ?? [];
  if (slots.length === 0) return null;
  const days = Array.from(new Set(slots.map((s) => t(`invite.availability.day.${s.day}`, language))));
  const periods = Array.from(
    new Set(slots.map((s) => t(`invite.availability.period.${s.period}`, language))),
  );
  return `${days.join(", ")} — ${periods.join(", ")}`;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

interface Row {
  label: string;
  value: string;
}

const renderRowsHtml = (rows: Row[]) =>
  rows
    .map(
      (row) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b6b6b;white-space:nowrap;">${escapeHtml(
          row.label,
        )}</td><td style="padding:4px 0;">${escapeHtml(row.value)}</td></tr>`,
    )
    .join("");

const renderRowsText = (rows: Row[]) => rows.map((row) => `${row.label}: ${row.value}`).join("\n");

/** Email to Hugo summarizing a completed invite. */
export function buildHugoEmail(invite: InviteDocument, language: LanguageCode): EmailContent {
  const name = invite.identity?.name ?? "";
  const subject = withName(t("email.hugo.subject", language), name);
  const greeting = t("email.hugo.greeting", language);
  const intro = withName(t("email.hugo.intro", language), name);
  const cta = t("email.hugo.cta", language);
  const signature = t("email.hugo.signature", language);

  const rows: Row[] = [
    { label: t("email.hugo.fields.identity", language), value: `${name} (${invite.identity?.instagram ?? "—"})` },
  ];
  const intention = intentionLabel(invite, language);
  if (intention) rows.push({ label: t("email.hugo.fields.intention", language), value: intention });
  const dateType = dateTypeLabel(invite, language);
  if (dateType) rows.push({ label: t("email.hugo.fields.dateType", language), value: dateType });
  if (typeof invite.compatibilityScore === "number") {
    rows.push({ label: t("email.hugo.fields.compatibility", language), value: `${invite.compatibilityScore}%` });
  }
  if (invite.availability?.whoDecides) {
    rows.push({
      label: t("email.hugo.fields.whoDecides", language),
      value: t(`invite.availability.whoDecides.${invite.availability.whoDecides}`, language),
    });
  }
  const availability = availabilitySummary(invite, language);
  if (availability) rows.push({ label: t("email.hugo.fields.availability", language), value: availability });
  if (invite.availability?.note) {
    rows.push({ label: t("email.hugo.fields.note", language), value: invite.availability.note });
  }

  const html = `
    <div style="font-family:sans-serif;font-size:15px;color:#1a1a1a;line-height:1.5;">
      <p>${escapeHtml(greeting)}</p>
      <p>${escapeHtml(intro)}</p>
      <table style="border-collapse:collapse;margin:16px 0;">${renderRowsHtml(rows)}</table>
      <p>${escapeHtml(cta)}</p>
      <p style="color:#9a9a9a;font-size:12px;margin-top:24px;">${escapeHtml(signature)}</p>
    </div>
  `.trim();

  const text = [greeting, "", intro, "", renderRowsText(rows), "", cta, "", signature].join("\n");

  return { subject, html, text };
}

/** Confirmation email to the guest, only sent when she provided an email address. */
export function buildGuestEmail(invite: InviteDocument, language: LanguageCode): EmailContent {
  const name = firstName(invite.identity?.name);
  const subject = t("email.guest.subject", language);
  const greeting = withName(t("email.guest.greeting", language), name);
  const body = t("email.guest.body", language);
  const signature = t("email.guest.signature", language);

  const html = `
    <div style="font-family:sans-serif;font-size:15px;color:#1a1a1a;line-height:1.5;">
      <p>${escapeHtml(greeting)}</p>
      <p>${escapeHtml(body)}</p>
      <p style="white-space:pre-line;">${escapeHtml(signature)}</p>
    </div>
  `.trim();

  const text = [greeting, "", body, "", signature].join("\n");

  return { subject, html, text };
}
