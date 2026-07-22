// ============================================================
// Iranian Business Reports — app logic
// ============================================================

const REPO = "https://github.com/MahdiMajidzadeh/iranian-businesses-data-reports";
const TAG_VISIBLE_LIMIT = 14;

// ---- helpers ----
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Escape HTML special characters to prevent XSS from report data
function escapeHtml(string) {
  return String(string)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---- theme ----
function setupTheme() {
  const toggle = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeLabel");
  const root = document.documentElement;

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function paint(theme) {
    // When dark is active, offer "Light" (a sun); otherwise offer "Dark" (a moon).
    icon.textContent = theme === "dark" ? "☀" : "☾";
    label.textContent = theme === "dark" ? "Light" : "Dark";
  }

  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  paint(currentTheme());

  toggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    paint(next);
  });
}

// ---- main ----
async function loadData() {
  const titleList = document.getElementById("titleList");
  const tagList = document.getElementById("tagList");
  const yearSelect = document.getElementById("yearSelect");
  const searchInput = document.getElementById("searchInput");
  const resultCount = document.getElementById("resultCount");

  setupTheme();

  titleList.innerHTML = '<div class="loading"></div>';

  let data;
  try {
    // Bypass the browser cache so newly added reports show up immediately.
    const response = await fetch("output.json", { cache: "no-store" });
    data = await response.json();
  } catch (error) {
    console.error("Error loading the JSON data", error);
    titleList.innerHTML =
      '<div class="empty-state"><h3>Could not load reports</h3><p>Please try again later.</p></div>';
    return;
  }

  data.sort((a, b) => b.year - a.year);

  // Filter state
  let activeTag = "";
  let tagsExpanded = false;

  // Populate year selector (newest first)
  const years = [...new Set(data.map((item) => item.year))].sort((a, b) => b - a);
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });

  // Unique category tags, sorted
  const allTags = [...new Set(data.flatMap((item) => item.tags))].sort();

  function getFiltered() {
    const q = searchInput.value.trim().toLowerCase();
    const selectedYear = yearSelect.value;

    return data.filter((item) => {
      if (selectedYear && item.year !== selectedYear) return false;
      if (activeTag && !item.tags.includes(activeTag)) return false;
      if (q) {
        const hay = (
          item.title +
          " " +
          item.year +
          " " +
          item.tags.join(" ")
        ).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function renderTags() {
    tagList.innerHTML = "";

    const noFilters = !activeTag && !yearSelect.value && searchInput.value.trim() === "";
    const showAll = document.createElement("button");
    showAll.type = "button";
    showAll.className = "chip" + (noFilters ? " active" : "");
    showAll.textContent = "Show All";
    showAll.setAttribute("aria-pressed", String(noFilters));
    showAll.addEventListener("click", resetAll);
    tagList.appendChild(showAll);

    const shown = tagsExpanded ? allTags : allTags.slice(0, TAG_VISIBLE_LIMIT);
    shown.forEach((tag) => {
      const chip = document.createElement("button");
      chip.type = "button";
      const isActive = activeTag === tag;
      chip.className = "chip" + (isActive ? " active" : "");
      chip.textContent = capitalizeFirstLetter(tag);
      chip.setAttribute("aria-pressed", String(isActive));
      chip.addEventListener("click", () => {
        activeTag = activeTag === tag ? "" : tag;
        render();
      });
      tagList.appendChild(chip);
    });

    if (allTags.length > TAG_VISIBLE_LIMIT) {
      const more = document.createElement("button");
      more.type = "button";
      more.className = "chip-more";
      more.textContent = tagsExpanded ? "Show less" : `Show more (${allTags.length - TAG_VISIBLE_LIMIT})`;
      more.addEventListener("click", () => {
        tagsExpanded = !tagsExpanded;
        renderTags();
      });
      tagList.appendChild(more);
    }
  }

  function renderCards(items) {
    if (items.length === 0) {
      titleList.classList.remove("reports-grid");
      titleList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="7" r="5"/><path d="m14 14-3.5-3.5" stroke-linecap="round"/></svg>
          </div>
          <h3>No reports found</h3>
          <p>Try a different search term, year, or category.</p>
          <button type="button" id="clearFilters" class="btn btn-accent">Clear filters</button>
        </div>`;
      document.getElementById("clearFilters").addEventListener("click", resetAll);
      return;
    }

    titleList.classList.add("reports-grid");
    titleList.innerHTML = items
      .map((item) => {
        const downloadUrl = `${REPO}/blob/main/reports/${encodeURIComponent(item.url)}?raw=true`;
        const tags = item.tags;
        const tagHtml = tags
          .map(
            (t, i) =>
              `<span class="card-tag">${escapeHtml(capitalizeFirstLetter(t))}${
                i < tags.length - 1 ? " ·" : ""
              }</span>`
          )
          .join("");
        // Omit the tags row entirely for uncategorized reports (no dead gap).
        const tagsBlock = tags.length ? `<div class="card-tags">${tagHtml}</div>` : "";

        return `
          <article class="report-card">
            <div class="card-top">
              <span class="card-year">${escapeHtml(item.year)}</span>
              <span class="pdf-badge">PDF</span>
            </div>
            <h3 class="card-title">${escapeHtml(item.title)}</h3>
            ${tagsBlock}
            <a href="${escapeHtml(downloadUrl)}" target="_blank" rel="noopener" class="download-btn">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v8m0 0 3-3M8 10 5 7"/><path d="M2.5 11v1.5A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V11"/></svg>
              Download Report
            </a>
          </article>`;
      })
      .join("");
  }

  function updateResultCount(count) {
    resultCount.textContent = `${count} report${count !== 1 ? "s" : ""} found`;
  }

  function render() {
    const filtered = getFiltered();
    renderTags();
    renderCards(filtered);
    updateResultCount(filtered.length);
  }

  function resetAll() {
    activeTag = "";
    searchInput.value = "";
    yearSelect.value = "";
    render();
  }

  searchInput.addEventListener("input", render);
  yearSelect.addEventListener("change", render);

  render();
}

document.addEventListener("DOMContentLoaded", loadData);
