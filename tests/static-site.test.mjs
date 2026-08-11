import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../dist/", import.meta.url);
const talks = new URL("talks/", root);

test("builds the homepage and every archived talk", async () => {
  const homepage = await readFile(new URL("index.html", root), "utf8");
  assert.match(homepage, /Political economy,/);
  assert.match(homepage, /Interdepartmental Political Economy Group/);
  assert.match(homepage, /The Bush School of Government &amp; Public Service · Texas A&amp;M University/);
  assert.match(homepage, /forum for Texas A&amp;M faculty and graduate students/);
  assert.doesNotMatch(homepage, /Bush School faculty and graduate students/);
  assert.doesNotMatch(homepage, /forum for anyone interested/);
  assert.doesNotMatch(homepage, /hero-art|hero-monogram|core-ring|secondary-concept/);
  assert.match(homepage, /Thursdays · 12:30–2:00 p\.m\./);
  assert.match(homepage, /<dt>Location<\/dt>\s*<dd>TBD<\/dd>/);
  assert.match(homepage, /There is room here for work in progress/);
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
  assert.match(homepage, /\/ipeg-seminar\/talks\/cody-tuttle-school-desegregation\//);

  const entries = await readdir(talks, { withFileTypes: true });
  const talkDirectories = entries.filter((entry) => entry.isDirectory());
  assert.equal(talkDirectories.length, 14);

  const addedTalk = await readFile(
    new URL("talks/matt-malis-diplomatic-capacity/index.html", root),
    "utf8",
  );
  assert.match(addedTalk, /Diplomatic Capacity and International Cooperation/);
  assert.match(addedTalk, /October 22, 2025/);
  assert.match(addedTalk, /4:00 p\.m\./);
  assert.match(addedTalk, /Allen 3072/);

  for (const entry of talkDirectories) {
    await access(new URL(`${entry.name}/index.html`, talks));
  }
});

test("produces portable public pages with no preview-host references", async () => {
  const homepage = await readFile(new URL("index.html", root), "utf8");
  const detail = await readFile(
    new URL("talks/cody-tuttle-school-desegregation/index.html", root),
    "utf8",
  );

  assert.doesNotMatch(homepage, /chatgpt\.site|OpenAI account|sign[ -]?in/i);
  assert.doesNotMatch(detail, /chatgpt\.site|OpenAI account|sign[ -]?in/i);
  assert.match(detail, /Cody Tuttle · IPEG/);
  assert.match(detail, /Speaker website/);
});
