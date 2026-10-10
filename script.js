const USERNAME = "yuT0aa";
const repoGrid = document.querySelector("#repo-grid");
const projectCount = document.querySelector("#project-count");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelector("#year").textContent = new Date().getFullYear();

const typeWords = ["digital experiences.", "thoughtful interfaces.", "creative web projects."];
const typeTarget = document.querySelector(".type-line");
if (!reducedMotion && typeTarget) {
  let wordIndex = 0, charIndex = typeWords[0].length, deleting = true;
  const type = () => {
    const word = typeWords[wordIndex];
    if (deleting) {
      charIndex--;
      typeTarget.textContent = word.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) { deleting = false; wordIndex = (wordIndex + 1) % typeWords.length; }
      setTimeout(type, 42);
    } else {
      const nextWord = typeWords[wordIndex];
      charIndex++;
      typeTarget.textContent = nextWord.slice(0, charIndex);
      if (charIndex >= nextWord.length) { deleting = true; setTimeout(type, 1700); }
      else setTimeout(type, 65);
    }
  };
  setTimeout(type, 1800);
}

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

const languageColors = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26",
  CSS: "#563d7c", Python: "#3572A5", Java: "#b07219", PHP: "#4F5D95",
  "C++": "#f34b7d", C: "#555555", Vue: "#41b883", Shell: "#89e051"
};

function renderRepositories(repositories) {
  if (!repositories.length) {
    repoGrid.innerHTML = '<div class="loading-card">No public repositories were found for this account.</div>';
    return;
  }
  repoGrid.innerHTML = repositories.slice(0, 6).map(repo => {
    const language = repo.language || "Various";
    const description = repo.description || "A public repository. Open it to explore the code.";
    return `<article class="repo-card">
      <div class="repo-top"><span class="repo-icon">⌘_</span><span class="repo-visibility">PUBLIC</span></div>
      <h3><a href="${escapeHTML(repo.html_url)}" target="_blank" rel="noreferrer">${escapeHTML(repo.name)}</a></h3>
      <p>${escapeHTML(description)}</p>
      <div class="repo-meta">
        <span class="repo-language" style="--language-color:${languageColors[language] || "#00f5d4"}">${escapeHTML(language)}</span>
        <span>★ ${Number(repo.stargazers_count || 0)}</span>
        <span>⑂ ${Number(repo.forks_count || 0)}</span>
      </div>
    </article>`;
  }).join("");
  document.querySelectorAll(".repo-language").forEach(el => {
    const color = el.textContent === "Various" ? "#8b9ab1" : (languageColors[el.textContent] || "#00f5d4");
    el.style.setProperty("--unused", color);
    el.style.color = color;
  });
}

async function loadGitHubData() {
  const status = document.querySelector("#activity-status");
  try {
    const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?type=owner&sort=updated&per_page=100`, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const repos = await response.json();
    const publicRepos = repos.filter(repo => !repo.fork && !repo.private);
    publicRepos.sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at));
    renderRepositories(publicRepos);
    projectCount.textContent = `${Math.min(publicRepos.length, 6).toString().padStart(2, "0")} PROJECTS / LIVE`;
    document.querySelector("#repo-total").textContent = publicRepos.length;
    document.querySelector("#star-total").textContent = publicRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const languages = {};
    publicRepos.forEach(repo => { if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1; });
    const topLanguage = Object.entries(languages).sort((a, b) => b[1] - a[1])[0];
    document.querySelector("#top-language").textContent = topLanguage ? topLanguage[0] : "—";
    status.textContent = `Synced from GitHub public API · ${new Date().toLocaleString()}`;
  } catch (error) {
    projectCount.textContent = "GITHUB DATA UNAVAILABLE";
    repoGrid.innerHTML = `<div class="loading-card">Could not load repositories right now. <a class="text-link" href="https://github.com/${USERNAME}?tab=repositories">Browse them on GitHub ↗</a></div>`;
    status.textContent = "Live API unavailable or rate-limited. Please try again later.";
    console.error("GitHub profile data error:", error);
  }
}

loadGitHubData();
