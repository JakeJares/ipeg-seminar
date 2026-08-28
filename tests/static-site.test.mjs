import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../dist/", import.meta.url);
const talks = new URL("talks/", root);
const calendar = new URL("calendar/", root);

test("builds the homepage and every archived talk", async () => {
  const homepage = await readFile(new URL("index.html", root), "utf8");
  const weeklyMeetingDetails = homepage.match(/<dl class="meeting-details"[\s\S]*?<\/dl>/)?.[0];
  assert.match(homepage, /Political economy,/);
  assert.match(homepage, /Interdepartmental Political Economy Community/);
  assert.doesNotMatch(homepage, /\bIPEG\b|Political Economy Group/);
  assert.match(homepage, /The Bush School of Government &amp; Public Service · Texas A&amp;M University/);
  assert.doesNotMatch(homepage, /class="eyebrow hero-institution"/);
  assert.match(homepage, /class="hero-lower"/);
  assert.match(homepage, /class="hero-identity"/);
  assert.match(homepage, /class="hero-practical"/);
  assert.match(homepage, /class="hero-statement"/);
  assert.match(homepage, /<h2 class="eyebrow about-heading" id="about-heading">About IPEC<\/h2>/);
  assert.match(homepage, /href="#next">Fall 2026 Schedule<\/a>/);
  assert.match(homepage, /href="#program">Explore Past Talks<\/a>/);
  assert.doesNotMatch(homepage, />How IPEC works<\/a>/);
  assert.doesNotMatch(homepage, /IPEC brings together Texas A&amp;M faculty/);
  assert.match(homepage, /political economy, broadly defined\./);
  assert.doesNotMatch(homepage, /broadly defined—bringing/);
  assert.doesNotMatch(homepage, /Bush School faculty and graduate students/);
  assert.doesNotMatch(homepage, /forum for anyone interested/);
  assert.doesNotMatch(homepage, /hero-art|hero-monogram|core-ring|secondary-concept/);
  assert.match(homepage, /Thursdays · 12:30–2:00 p\.m\./);
  assert.ok(weeklyMeetingDetails);
  assert.match(weeklyMeetingDetails, /<dt>Location<\/dt>\s*<dd>Usually Allen 3125; see the schedule below<\/dd>/);
  assert.doesNotMatch(weeklyMeetingDetails, /Allen 3025/);
  assert.match(homepage, /IPEC is an interdisciplinary forum for Texas A&amp;M faculty and\s*graduate students who study political economy, broadly defined\./);
  assert.match(homepage, /There is room here for work in progress, visiting speakers, and\s*reading and discussion\./);
  assert.match(homepage, /Earlier program/);
  assert.doesNotMatch(homepage, /The archive begins|A room for work in progress\./);
  assert.ok(homepage.indexOf('id="about"') < homepage.indexOf('class="metrics"'));
  assert.match(homepage, /Share work in progress/);
  assert.match(homepage, /Welcome visiting scholars/);
  assert.match(homepage, /Read and think together/);
  for (const organizer of ["William Roberts Clark", "Thomas Flaherty", "Ben Helms", "Jake Jares"]) {
    assert.match(homepage, new RegExp(organizer));
  }
  for (const url of [
    "https://bush.tamu.edu/faculty/wclark/",
    "https://www.thomasflaherty.com/",
    "https://www.benjaminhelms.com/",
    "https://jakejares.com/",
  ]) {
    assert.match(homepage, new RegExp(url.replaceAll(".", "\\.")));
  }
  assert.match(homepage, /John H\. Lindsey ’44 Chair,/);
  assert.match(homepage, /Bush School of Government and Public Service/);
  assert.match(homepage, /Professor of Political Science/);
  assert.doesNotMatch(homepage, /Charles Puryear Professor of Liberal Arts/);
  assert.match(homepage, /Department of International Affairs/);
  assert.match(homepage, /href="\/talks\/cody-tuttle-school-desegregation\/"/);
  assert.match(homepage, /Fall 2026 Welcome Meeting/);
  assert.match(homepage, /August 27, 2026/);
  assert.match(homepage, /IPEC co-organizers/);
  assert.match(homepage, /href="\/talks\/fall-2026-welcome-meeting\/"/);
  assert.match(homepage, /<dl class="schedule-details" aria-label="Meeting details">[\s\S]*<dt>Time<\/dt>[\s\S]*12:30–1:30 p\.m\.[\s\S]*<dt>Location<\/dt>[\s\S]*Allen 3125[\s\S]*<\/dl>/);
  for (const meeting of [
    "Will Norris",
    "Five-Minute Fiesta",
    "Anil Menon",
    "Jiyeong Jeon",
    "Yunus C. Aybas",
    "Chen Shen",
    "Kyle Chun Chiang",
  ]) {
    assert.match(homepage, new RegExp(meeting));
  }
  for (const date of [
    "September 10, 2026",
    "September 24, 2026",
    "October 1, 2026",
    "October 8, 2026",
    "October 22, 2026",
    "October 29, 2026",
    "November 5, 2026",
  ]) {
    assert.match(homepage, new RegExp(date));
  }
  assert.doesNotMatch(homepage, /Paper title:\s*TBD|Title:\s*TBD/);
  assert.match(homepage, /Stay connected to IPEC\./);
  assert.match(homepage, /Open the signup form/);
  assert.match(homepage, /docs\.google\.com\/forms\/d\/e\/1FAIpQLSeo4W8PJqWesZmlXiIoQzSWkV3dKT6YgZe_axHrrUYstb4H2Q\/viewform/);
  assert.equal(homepage.match(/class="calendar-actions"/g)?.length, 8);
  const scheduleRows = homepage.match(/<article class="schedule-row(?: [^"]*)?">[\s\S]*?<\/article>/g) ?? [];
  const anilRow = scheduleRows.find((row) => row.includes("Anil Menon"));
  assert.ok(anilRow);
  assert.match(anilRow, /<dt>Location<\/dt><dd>TBD<\/dd>/);
  assert.doesNotMatch(anilRow, /Allen 3125/);
  const yunusRow = scheduleRows.find((row) => row.includes("Yunus C. Aybas"));
  assert.ok(yunusRow);
  assert.match(yunusRow, /Representation in District-Based Elections/);
  assert.match(yunusRow, /Texas A&amp;M University · Economics/);
  assert.match(yunusRow, /<dt>Location<\/dt><dd>TBD<\/dd>/);
  assert.doesNotMatch(yunusRow, /Allen 3125/);
  assert.match(homepage, /dates=20260910T173000Z%2F20260910T190000Z/);
  assert.match(homepage, /startdt=2026-11-05T18%3A30%3A00\.000Z/);
  assert.match(homepage, /href="\/calendar\/kyle-chun-chiang-fall-2026\.ics" download/);
  assert.doesNotMatch(homepage, /meeting formats/);
  assert.match(homepage, /<link rel="canonical" href="https:\/\/ipecseminar\.org\/"/);
  assert.match(homepage, /<link rel="icon" href="\/ipec-favicon\.svg" type="image\/svg\+xml" sizes="any">/);
  assert.match(homepage, /<source media="\(max-width: 680px\)" srcset="\/ipec-logo-mobile\.svg">/);
  assert.match(homepage, /<img src="\/ipec-logo\.svg" alt="IPEC — Interdepartmental Political Economy Community">/);
  await access(new URL("ipec-favicon.svg", root));
  await access(new URL("ipec-logo.svg", root));
  await access(new URL("ipec-logo-mobile.svg", root));

  const mobileLogo = await readFile(new URL("ipec-logo-mobile.svg", root), "utf8");
  assert.match(mobileLogo, /INTERDEPARTMENTAL POLITICAL ECONOMY COMMUNITY/);
  assert.match(mobileLogo, /fill="#500000"/);
  assert.match(mobileLogo, /fill="#BF5700"/);
  assert.match(mobileLogo, /stroke="#2B2620"/);
  assert.doesNotMatch(mobileLogo, />IPEC<\/text>/);

  const entries = await readdir(talks, { withFileTypes: true });
  const talkDirectories = entries.filter((entry) => entry.isDirectory());
  assert.equal(talkDirectories.length, 22);

  const welcomeMeeting = await readFile(
    new URL("talks/fall-2026-welcome-meeting/index.html", root),
    "utf8",
  );
  assert.match(welcomeMeeting, /Fall 2026 Welcome Meeting/);
  assert.match(welcomeMeeting, /August 27, 2026/);
  assert.match(welcomeMeeting, /12:30–1:30 p\.m\./);
  assert.match(welcomeMeeting, /Allen 3125/);
  assert.match(welcomeMeeting, /About this meeting/);
  assert.match(welcomeMeeting, /<title>Fall 2026 Welcome Meeting · IPEC<\/title>/);
  assert.match(welcomeMeeting, /← Fall 2026 meetings/);

  const addedTalk = await readFile(
    new URL("talks/matt-malis-diplomatic-capacity/index.html", root),
    "utf8",
  );
  assert.match(addedTalk, /Diplomatic Capacity and International Cooperation/);
  assert.match(addedTalk, /October 22, 2025/);
  assert.match(addedTalk, /4:00 p\.m\./);
  assert.match(addedTalk, /Allen 3072/);

  const yunusTalk = await readFile(
    new URL("talks/yunus-aybas-fall-2026/index.html", root),
    "utf8",
  );
  assert.match(yunusTalk, /Yunus C\. Aybas/);
  assert.match(yunusTalk, /Representation in District-Based Elections/);
  assert.match(yunusTalk, /October 22, 2026/);
  assert.match(yunusTalk, /12:30–2:00 p\.m\./);
  assert.match(yunusTalk, /<dt>Location<\/dt><dd>TBD<\/dd>/);
  assert.match(yunusTalk, /Oguzhan Celebi, Surabhi Dutt/);
  assert.match(yunusTalk, /Interactive explorer/);
  assert.match(yunusTalk, /representation\.yunusaybas\.com/);
  assert.match(yunusTalk, /drive\.google\.com\/file\/d\/1lGinlMF8TiZx1wEAuEEwgNYEI-z4Ip7o\/view/);

  for (const entry of talkDirectories) {
    await access(new URL(`${entry.name}/index.html`, talks));
  }

  const calendarEntries = (await readdir(calendar)).filter((name) => name.endsWith(".ics"));
  assert.equal(calendarEntries.length, 8);
  const standardTimeEvent = await readFile(
    new URL("kyle-chun-chiang-fall-2026.ics", calendar),
    "utf8",
  );
  assert.match(standardTimeEvent, /DTSTART:20261105T183000Z/);
  assert.match(standardTimeEvent, /DTEND:20261105T200000Z/);
  assert.match(standardTimeEvent, /SUMMARY:IPEC: Kyle Chun Chiang/);
  assert.match(standardTimeEvent, /LOCATION:Allen 3125/);
  for (const line of standardTimeEvent.split("\r\n")) {
    assert.ok(line.length <= 75, `iCalendar line is too long: ${line}`);
  }
  const anilCalendar = await readFile(
    new URL("anil-menon-fall-2026.ics", calendar),
    "utf8",
  );
  assert.match(anilCalendar, /LOCATION:TBD/);
  const yunusCalendar = await readFile(
    new URL("yunus-aybas-fall-2026.ics", calendar),
    "utf8",
  );
  assert.match(yunusCalendar, /DTSTART:20261022T173000Z/);
  assert.match(yunusCalendar, /DTEND:20261022T190000Z/);
  assert.match(yunusCalendar, /SUMMARY:IPEC: Yunus C\. Aybas — Representation in District-Based Elections/);
  assert.match(yunusCalendar, /LOCATION:TBD/);
});

test("produces portable public pages with no preview-host references", async () => {
  const homepage = await readFile(new URL("index.html", root), "utf8");
  const detail = await readFile(
    new URL("talks/cody-tuttle-school-desegregation/index.html", root),
    "utf8",
  );

  assert.doesNotMatch(homepage, /chatgpt\.site|OpenAI account|sign[ -]?in/i);
  assert.doesNotMatch(detail, /chatgpt\.site|OpenAI account|sign[ -]?in/i);
  assert.match(detail, /Cody Tuttle · IPEC/);
  assert.match(detail, /Speaker website/);
});
