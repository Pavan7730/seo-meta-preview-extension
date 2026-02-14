/* Tabs */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab, .content").forEach(el =>
      el.classList.remove("active")
    );
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

/* Truncate by pixel */
function truncateByPixel(text, maxWidth, font) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = font;

  if (ctx.measureText(text).width <= maxWidth) return text;

  let out = "";
  for (const ch of text) {
    if (ctx.measureText(out + ch + "…").width > maxWidth) return out + "…";
    out += ch;
  }
  return out;
}

/* Mobile presets */
const devices = {
  iphone: { width: 390, titleFont: "15px Arial", descFont: "13px Arial", titlePx: 320, descPx: 680 },
  pixel: { width: 412, titleFont: "15px Arial", descFont: "13px Arial", titlePx: 340, descPx: 700 },
  samsung: { width: 360, titleFont: "14px Arial", descFont: "12.5px Arial", titlePx: 300, descPx: 650 }
};

let seoData = null;

/* Inject content.js */
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files: ["content.js"]
  });
});

/* Receive data */
chrome.runtime.onMessage.addListener(data => {
  seoData = data;

  document.getElementById("meta-title").textContent = `${data.title} (${data.title.length})`;
  document.getElementById("meta-description").textContent = `${data.description} (${data.description.length})`;
  document.getElementById("robots").textContent = data.robots;
  document.getElementById("url").textContent = data.url;
  document.getElementById("canonical").textContent = data.canonical || "Not specified";

  if (data.ogImage) document.getElementById("og-image").src = data.ogImage;

  document.getElementById("h1-count").textContent = data.headings.h1;
  document.getElementById("h2-count").textContent = data.headings.h2;
  document.getElementById("h3-count").textContent = data.headings.h3;
  document.getElementById("h4-count").textContent = data.headings.h4;

  renderMobile("iphone");
});

/* Device change */
document.getElementById("deviceSelect").addEventListener("change", e => {
  renderMobile(e.target.value);
});

function renderMobile(deviceKey) {
  if (!seoData) return;

  const d = devices[deviceKey];
  const serp = document.getElementById("mobileSerp");
  serp.style.width = d.width + "px";

  document.getElementById("mobile-title").textContent =
    truncateByPixel(seoData.title, d.titlePx, d.titleFont);

  document.getElementById("mobile-desc").textContent =
    truncateByPixel(seoData.description, d.descPx, d.descFont);

  document.getElementById("mobile-url").textContent = seoData.url;

  document.getElementById("mobile-title").style.fontSize = d.titleFont;
  document.getElementById("mobile-desc").style.fontSize = d.descFont;
}
