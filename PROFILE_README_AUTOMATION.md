# Profile README automation

This profile repository uses `.github/workflows/update-profile-readme.yml` to refresh the **Latest Public Repositories** table in `README.md` once a day at 06:17 UTC. The workflow can also be started manually. It reads public repository data for `yuT0aa` from the GitHub REST API and uses the workflow's built-in `GITHUB_TOKEN`; no personal access token, dependency install, or secret configuration is needed.

The updater changes only the content between `<!-- profile-readme:repositories:start -->` and `<!-- profile-readme:repositories:end -->`. It lists up to six most recently updated public repositories, excluding this profile repository. Missing descriptions and languages receive readable placeholders, and an empty repository list produces a friendly message. API, network, and malformed-response errors fail the workflow instead of silently replacing good content. A commit is created and pushed only when the generated README content changes.

The statistics, language, contribution activity, and streak images in `README.md` are live embeds from public GitHub profile-statistics services. They are separate from the API-generated repository table and update when those image services refresh their data.

## Enable and test

1. Ensure this repository is the public profile repository named `yuT0aa` and that GitHub Actions is enabled for it.
2. In **Settings → Actions → General → Workflow permissions**, select **Read and write permissions** if repository policy requires it. The workflow itself declares only `contents: write`, which is needed to push a changed README; the `GITHUB_TOKEN` is scoped to this repository and is not printed or saved.
3. Open **Actions → Update profile README → Run workflow**, select the default branch, and click **Run workflow**.
4. Open that run and confirm **Update repository section** and **Commit README changes if needed** succeeded. If repository data changed, the commit appears on the default branch and updates the table. If not, the log says the README has no generated changes and there is no commit.
5. To verify a subsequent automatic run, leave the workflow enabled and check the workflow runs after the next 06:17 UTC schedule. Scheduled runs may be delayed by GitHub during high load.

For a local dry check, run `node scripts/update-profile-readme.mjs` with Node.js 20 or newer. The script works anonymously for public data; setting `GITHUB_TOKEN` is optional locally and is supplied automatically in Actions.

## Troubleshooting

- **Workflow cannot push:** Check the repository's workflow permissions and organization policy. Keep `contents: write` at the workflow level; do not grant broader permissions.
- **API rate limit or HTTP error:** Inspect the `Update repository section` log for the status and rate-limit reset time. The updater exits without overwriting README content; retry after the limit resets.
- **No table rows:** Confirm `yuT0aa` has public repositories other than the profile repository. No repositories is handled without failing the workflow.
- **Malformed marker error:** Restore exactly one correctly ordered repository marker pair in `README.md`; content outside that pair is not managed by the script.
- **No commit:** This is expected when the generated table already matches `README.md`.
- **Images do not load:** The statistics and activity graphics are hosted by third-party services and are independent of the Actions workflow; check their availability or remove/replace the corresponding image links in `README.md`.
