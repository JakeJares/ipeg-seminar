import type { APIRoute } from "astro";
import { events, type EventRecord } from "../../data/events";
import {
  escapeIcs,
  foldIcsLine,
  formatCalendarUtc,
  getCalendarDescription,
  getCalendarSummary,
  hasCalendarInfo,
} from "../../lib/calendar";

export function getStaticPaths() {
  return events.filter(hasCalendarInfo).map((event) => ({
    params: { slug: event.slug },
    props: { event },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const event = props.event as EventRecord;

  if (!event.start || !event.end) {
    return new Response("Calendar information is not available.", { status: 404 });
  }

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IPEC Seminar//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-TIMEZONE:America/Chicago",
    "BEGIN:VEVENT",
    `UID:${event.slug}@ipecseminar.org`,
    `DTSTAMP:${formatCalendarUtc(new Date().toISOString())}`,
    `DTSTART:${formatCalendarUtc(event.start)}`,
    `DTEND:${formatCalendarUtc(event.end)}`,
    `SUMMARY:${escapeIcs(getCalendarSummary(event))}`,
    `DESCRIPTION:${escapeIcs(getCalendarDescription(event))}`,
    `LOCATION:${escapeIcs(event.location)}`,
    `URL:https://ipecseminar.org/talks/${event.slug}/`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ];

  return new Response(lines.map(foldIcsLine).join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="ipec-${event.slug}.ics"`,
    },
  });
};
