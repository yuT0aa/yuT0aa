const username = process.env.GITHUB_USERNAME || "yuT0aa";
const token = process.env.GITHUB_TOKEN;
const readmePath = new URL("../README.md", import.meta.url);
const startMarker = "<!-- profile-readme:repositories:start -->";
const endMarker = "<!-- profile-readme:repositories:end -->";
const repositoryLimit = 6;

function fail(message) {
  throw new Error(message);
}

function markdownCell(value) {
  return String(value)
    .replace(/[\r\n]+/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/[|`*_{}\[\]<>]/g, "\\$&")
    .trim();
}

async function fetchRepositories() {
  const repositories = [];
  let url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&direction=desc`;
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "profile-readme-updater",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  while (url) {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const remaining = response.headers.get("x-ratelimit-remaining");
      const reset = response.headers.get("x-ratelimit-reset");
      const rateLimitNote =
        response.status === 403 && remaining === "0"
          ? ` GitHub API rate limit exhausted; reset at ${reset ? new Date(Number(reset) * 1000).toISOString() : "an unknown time"}.`
          : "";
      fail(`GitHub API request failed (${response.status} ${response.statusText}).${rateLimitNote}`);
    }

    const page = await response.json();
    if (!Array.isArray(page)) {
      fail("GitHub API returned an unexpected repository response.");
    }
    repositories.push(...page);

    const link = response.headers.get("link") || "";
    const next = link.match(/<([^>]+)>;\s*rel="next"/);
    url = next ? next[1] : "";
  }

  return repositories;
}

function renderRepositories(repositories) {
  const profileRepository = `${username.toLowerCase()}/${username.toLowerCase()}`;
  const rows = repositories
    .filter((repository) => {
      if (!repository || repository.private || !repository.name) {
        return false;
      }
      return String(repository.full_name || "").toLowerCase() !== profileRepository;
    })
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, repositoryLimit)
    .map((repository) => {
      const name = markdownCell(repository.name);
      const description = markdownCell(repository.description || "No description provided.");
      const language = markdownCell(repository.language || "Not specified");
      const fullName = encodeURIComponent(repository.full_name || `${username}/${repository.name}`)
        .replace(/%2F/gi, "/");

      return `| [${name}](https://github.com/${fullName}) | ${description} | ${language} |`;
    });

  if (rows.length === 0) {
    return "_No public repositories to display yet._";
  }

  return [
    "| Repository | Description | Primary language |",
    "| --- | --- | --- |",
    ...rows,
  ].join("\n");
}

async function main() {
  const { readFile, writeFile } = await import("node:fs/promises");
  const readme = await readFile(readmePath, "utf8");
  const start = readme.indexOf(startMarker);
  const end = readme.indexOf(endMarker);

  if (start === -1 || end === -1 || end < start || readme.indexOf(startMarker, start + 1) !== -1 || readme.indexOf(endMarker, end + 1) !== -1) {
    fail("README.md must contain exactly one correctly ordered repository marker pair.");
  }

  const repositories = await fetchRepositories();
  const contentStart = start + startMarker.length;
  const updated = `${readme.slice(0, contentStart)}\n${renderRepositories(repositories)}\n${readme.slice(end)}`;

  if (updated !== readme) {
    await writeFile(readmePath, updated, "utf8");
    console.log("Updated README.md with the latest public repositories.");
  } else {
    console.log("README.md is already up to date.");
  }
}

main().catch((error) => {
  console.error(`Profile README update failed: ${error.message}`);
  process.exitCode = 1;
});
