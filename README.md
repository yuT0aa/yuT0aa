# yuT0aa Cyber Neon Profile Website

A responsive cyber-neon developer profile built with plain HTML, CSS, and JavaScript. It fetches public repositories directly from GitHub's public API.

## Files

- `index.html` — page structure and content
- `style.css` — responsive neon design, animations and hover effects
- `script.js` — typewriter effect, mobile navigation and live GitHub repository/statistics loading

## Run locally

Open `index.html` in your browser. For a local server, run this from the project folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish it

### Option A: GitHub Pages from this repository

1. Upload `index.html`, `style.css`, and `script.js` to the root of a public repository.
2. Open **Settings → Pages**.
3. Under Build and deployment, select **Deploy from a branch**.
4. Select your default branch and `/ (root)`, then save.
5. Wait for the published Pages URL shown in Settings → Pages.

You can use a separate repository such as `yuT0aa.github.io` for the website. Keep `yuT0aa/yuT0aa` for the profile README if you want both.

### Option B: Link it from your profile README

Add a link to the published website in the `yuT0aa/yuT0aa` README, for example:

```md
[Open my interactive developer profile](YOUR_PUBLISHED_PAGES_URL)
```

Replace the placeholder with the actual Pages URL after publishing.

## Live data and limitations

- Public repositories are fetched from `https://api.github.com/users/yuT0aa/repos`.
- The page filters out forks and shows up to six repositories, ordered by latest push/update.
- Repository count, total stars and the most common primary language are calculated from the returned public repository list.
- GitHub API rate limits may temporarily prevent loading data. The page then shows a fallback link to your repositories.
- This website is interactive; GitHub README files themselves cannot run custom JavaScript. The website must be hosted separately.
- The animated typing effect and navigation run in the browser. Reduced-motion preferences are respected.
