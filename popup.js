/* Tabs */
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

/* Pixel truncation */
function truncateByPixel(text, maxWidth, font) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = font;

  if (ctx.measureText(text).width <= maxWidth) return text;

  let truncated = "";
  for (const char of text) {
    if (ctx.measureText(truncated + char + "…").width > maxWidth) {
      return truncated + "…";
    }
    truncated += char;
  }
  return truncated;
}

/* Inject content script */
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files: ["content.js"]
  });
});

/* Receive data */
chrome.runtime.onMessage.addListener((data) => {
  // Meta
  document.getElementById("meta-title").textContent =
    `${data.title} (${data.title.length} chars)`;

  document.getElementById("meta-description").textContent =
    `${data.description} (${data.description.length} chars)`;

  document.getElementById("robots").textContent = data.robots;
  document.getElementById("url").textContent = data.url;
  document.getElementById("canonical").textContent = data.canonical || "Not specified";

  // OG Image
  if (data.ogImage) {
    document.getElementById("og-image").src = data.ogImage;
  }

  // Headings
  document.getElementById("h1-count").textContent = data.headings.h1;
  document.getElementById("h2-count").textContent = data.headings.h2;
  document.getElementById("h3-count").textContent = data.headings.h3;
  document.getElementById("h4-count").textContent = data.headings.h4;

  // Desktop SERP
  document.getElementById("desktop-title").textContent =
    truncateByPixel(data.title, 580, "16px Arial");

  document.getElementById("desktop-desc").textContent =
    truncateByPixel(data.description, 920, "13px Arial");

  document.getElementById("desktop-url").textContent = data.url;

  // Mobile SERP
  document.getElementById("mobile-title").textContent =
    truncateByPixel(data.title, 320, "15px Arial");

  document.getElementById("mobile-desc").textContent =
    truncateByPixel(data.description, 680, "13px Arial");

  document.getElementById("mobile-url").textContent = data.url;
});
