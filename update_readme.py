#!/usr/bin/env python3
"""Update the profile README's repository section using GitHub's public API."""
import json
import os
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

USERNAME = "yuT0aa"
README = Path("README.md")
START = "<!-- REPOSITORIES:START -->"
END = "<!-- REPOSITORIES:END -->"
API = f"https://api.github.com/users/{USERNAME}/repos?sort=updated&direction=desc&per_page=100&type=owner"


def fetch_repositories():
    request = urllib.request.Request(
        API,
        headers={
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": f"{USERNAME}-profile-readme-updater",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        repos = json.load(response)

    # Only show non-fork public repositories, newest activity first.
    repos = [r for r in repos if not r.get("fork") and not r.get("private")]
    repos.sort(key=lambda r: r.get("pushed_at") or r.get("updated_at") or "", reverse=True)
    return repos[:6]


def render(repos):
    if not repos:
        return "_No public repositories found yet. Check back after publishing a project._"

    lines = [
        "<table>",
        "<thead><tr><th>PROJECT</th><th>DESCRIPTION</th><th>LANGUAGE</th><th>STARS</th></tr></thead>",
        "<tbody>",
    ]
    for repo in repos:
        name = repo.get("name", "repository").replace("|", "\\|")
        description = (repo.get("description") or "No description added yet.").replace("|", "\\|")
        if len(description) > 120:
            description = description[:117].rstrip() + "..."
        language = repo.get("language") or "—"
        stars = repo.get("stargazers_count", 0)
        url = repo.get("html_url", f"https://github.com/{USERNAME}")
        lines.append(
            f'<tr><td><a href="{url}"><b>{name}</b></a></td>'
            f"<td>{description}</td><td>{language}</td><td>★ {stars}</td></tr>"
        )
    lines += ["</tbody>", "</table>", ""]
    lines.append(f"_Last synced: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}_")
    return "\n".join(lines)


def main():
    if not README.exists():
        raise SystemExit("README.md was not found. Run this script from the repository root.")
    original = README.read_text(encoding="utf-8")
    if START not in original or END not in original:
        raise SystemExit("README markers are missing; refusing to overwrite unmarked content.")
    if original.count(START) != 1 or original.count(END) != 1:
        raise SystemExit("Expected exactly one pair of repository markers.")

    updated_section = render(fetch_repositories())
    before, remainder = original.split(START, 1)
    _, after = remainder.split(END, 1)
    updated = before + START + "\n" + updated_section + "\n" + END + after
    if updated != original:
        README.write_text(updated, encoding="utf-8")
        print("README repository section updated.")
    else:
        print("README is already up to date.")


if __name__ == "__main__":
    main()
