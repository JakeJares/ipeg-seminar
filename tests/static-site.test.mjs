import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../dist/", import.meta.url);
const talks = new URL("talks/", root);

test("builds the homepage and every archived talk", async () => {
  const homepage = await readFile(new URL("index.html", root), "utf8");
  assert.match(homepage, /Political economy,/);
  assert.match(homepage, /Interdepartmental Political Economy Group/);
  assert.match(homepage, /Share work in progress/);
  assert.match(homepage, /Welcome visiting scholars/);
  assert.match(homepage, /Read and think together/);
  for (const organizer of ["Bill Clark", "Thomas Flaherty", "Ben Helms", "Jake Jares"]) {
    assert.match(homepage, new RegExp(organizer));
  }
  assert.match(homepage, /\/ipeg-seminar\/talks\/cody-tuttle-school-desegregation\//);

  const entries = await readdir(talks, { withFileTypes: true });
  const talkDirectories = entries.filter((entry) => entry.isDirectory());
  assert.equal(talkDirectories.length, 13);

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
