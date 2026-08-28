import type { EventRecord } from "../data/events";

const siteUrl = "https://ipecseminar.org";

export function hasCalendarInfo(event: EventRecord) {
  return Boolean(event.start && event.end);
}

export function getCalendarSummary(event: EventRecord) {
  if (event.calendarTitle) return event.calendarTitle;
  if (event.title) return `IPEC: ${event.speaker} — ${event.title}`;
  return `IPEC: ${event.speaker}`;
}

export function getCalendarDescription(event: EventRecord) {
  const primary = event.title
    ? `${event.speaker}: ${event.title}`
    : event.speaker;
  const supporting = [event.affiliation, event.note].filter(Boolean).join(" · ");

  return [
    primary,
    supporting,
    "Interdepartmental Political Economy Community at Texas A&M University",
    `Event details: ${siteUrl}/talks/${event.slug}/`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function formatCalendarUtc(value: string) {
  return new Date(value)
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(".000", "");
}

export function getGoogleCalendarUrl(event: EventRecord) {
  if (!event.start || !event.end) return "";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: getCalendarSummary(event),
    dates: `${formatCalendarUtc(event.start)}/${formatCalendarUtc(event.end)}`,
    ctz: "America/Chicago",
    location: event.location,
    details: getCalendarDescription(event),
  });

  return `https://calendar.google.com/calendar/render?${params}`;
}

export function getOutlookCalendarUrl(event: EventRecord) {
  if (!event.start || !event.end) return "";

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: getCalendarSummary(event),
    startdt: new Date(event.start).toISOString(),
    enddt: new Date(event.end).toISOString(),
    location: event.location,
    body: getCalendarDescription(event),
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params}`;
}

export function getIcalHref(event: EventRecord, base: string) {
  return `${base}calendar/${event.slug}.ics`;
}

export function escapeIcs(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("\r\n", "\\n")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

export function foldIcsLine(line: string) {
  const chunks: string[] = [];
  let remaining = line;

  while (remaining.length > 74) {
    chunks.push(remaining.slice(0, 74));
    remaining = remaining.slice(74);
  }

  return chunks.length
    ? `${chunks.join("\r\n ")}\r\n ${remaining}`
    : remaining;
}
