# yuT0aa — Cyber Neon GitHub Profile

This folder contains a GitHub profile README and a GitHub Actions workflow that refreshes the recent public repository table daily and on demand.

## Install

1. Create a **public** GitHub repository named exactly `yuT0aa` (the username) if you do not already have one.
2. If the repository already exists, back up its README and copy these files into it. Keep the repository name exactly `yuT0aa`.
3. Commit and push `README.md`, `scripts/update_readme.py`, and `.github/workflows/refresh-profile.yml`.
4. In the repository, open **Settings → Actions → General → Workflow permissions**.
5. Ensure workflows have permission to read and write repository contents. The workflow declares `contents: write`; repository/organization policy can still restrict it.
6. Open **Actions → Refresh profile README → Run workflow** to test it manually.
7. Visit `https://github.com/yuT0aa` and check the profile README.

## What refreshes?

- The “recent repositories” table is rebuilt from GitHub's public REST API. It shows up to six non-fork public repositories sorted by latest push/update, including description, primary language, stars and a sync timestamp.
- The workflow runs daily at 08:17 UTC and supports manual runs.
- Other stats, streak, language and activity cards are rendered by third-party image services. Those services refresh on their own schedules and can occasionally be unavailable or cached.

## Security and behavior

- No personal access token or extra secret is required for this public-data updater.
- `GITHUB_TOKEN` is used by GitHub Actions to push the README update, with `contents: write` permission only.
- The script updates only the section between `<!-- REPOSITORIES:START -->` and `<!-- REPOSITORIES:END -->`.
- If the repository API fails, the job fails rather than replacing the section with fabricated data.
- GitHub scheduled workflows may start late during busy periods. Manual refresh remains available.

## Local test

From the repository root with Python 3 installed:

```bash
python scripts/update_readme.py
git diff -- README.md
```

## Customize

Edit the profile text, links and skill icons in `README.md`. Keep the repository markers exactly as they are so the updater can safely replace only the generated table.
