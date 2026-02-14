/* ---------------- Tabs ---------------- */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");

    if (tab.dataset.tab === "desktop") renderDesktop();
  });
});

/* ---------------- Pixel Truncation ---------------- */
function truncateByPixel(text, maxWidth, font) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = font;

  if (ctx.measureText(text).width <= maxWidth) return text;

  let result = "";
  for (const char of text) {
    if (ctx.measureText(result + char + "…").width > maxWidth) {
      return result + "…";
    }
    result += char;
  }
  return result;
}

/* ---------------- Device List (20+) ---------------- */
const devices = {
  "iphone14": { name: "iPhone 14", width: 390, titlePx: 320, descPx: 680, titleFont: "15px Arial", descFont: "13px Arial" },
  "iphone14pro": { name: "iPhone 14 Pro", width: 393, titlePx: 325, descPx: 690, titleFont: "15px Arial", descFont: "13px Arial" },
  "iphone13": { name: "iPhone 13", width: 390, titlePx: 320, descPx: 680, titleFont: "15px Arial", descFont: "13px Arial" },
  "iphone12": { name: "iPhone 12", width: 390, titlePx: 320, descPx: 680, titleFont: "15px Arial", descFont: "13px Arial" },
  "pixel7": { name: "Pixel 7", width: 412, titlePx: 340, descPx: 700, titleFont: "15px Arial", descFont: "13px Arial" },
  "pixel7pro": { name: "Pixel 7 Pro", width: 412, titlePx: 340, descPx: 700, titleFont: "15px Arial", descFont: "13px Arial" },
  "pixel6": { name: "Pixel 6", width: 412, titlePx: 340, descPx: 700, titleFont: "15px Arial", descFont: "13px Arial" },
  "pixel5": { name: "Pixel 5", width: 393, titlePx: 325, descPx: 690, titleFont: "15px Arial", descFont: "13px Arial" },
  "s23": { name: "Galaxy S23", width: 360, titlePx: 300, descPx: 650, titleFont: "14px Arial", descFont: "12.5px Arial" },
  "s22": { name: "Galaxy S22", width: 360, titlePx: 300, descPx: 650, titleFont: "14px Arial", descFont: "12.5px Arial" },
  "s21": { name: "Galaxy S21", width: 360, titlePx: 300, descPx: 650, titleFont: "14px Arial", descFont: "12.5px Arial" },
  "s20": { name: "Galaxy S20", width: 360, titlePx: 300, descPx: 650, titleFont: "14px Arial", descFont: "12.5px Arial" },
  "oneplus11": { name: "OnePlus 11", width: 412, titlePx: 340, descPx: 700, titleFont: "15px Arial", descFont: "13px Arial" },
  "oneplus10": { name: "OnePlus 10", width: 412, titlePx: 340, descPx: 700, titleFont: "15px Arial", descFont: "13px Arial" },
  "mi13": { name: "Xiaomi 13", width: 393, titlePx: 325, descPx: 690, titleFont: "15px Arial", descFont: "13px Arial" },
  "mi12": { name: "Xiaomi 12", width: 393, titlePx: 325, descPx: 690, titleFont: "15px Arial", descFont: "13px Arial" },
  "realme11": { name: "Realme 11", width: 360, titlePx: 300, descPx: 650, titleFont: "14px Arial", descFont: "12.5px Arial" },
  "oppoReno8": { name: "Oppo Reno 8", width: 360, titlePx: 300, descPx: 650, titleFont: "14px Arial", descFont: "12.5px Arial" },
  "vivoV27": { name: "Vivo V27", width: 360, titlePx: 300, descPx: 650, titleFont: "14px Arial", descFont: "12.5px Arial" },
  "iphoneSE": { name: "iPhone SE", width: 375, titlePx: 310, descPx: 660, titleFont: "14px Arial", descFont: "12.5px Arial" }
};

let seoData = null;

/* ---------------- Inject Content Script ---------------- */
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files: ["content.js"]
  });
});

/* ---------------- Receive Data ---------------- */
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

  populateDeviceDropdown();
  renderDesktop();
  renderMobile(document.getElementById("deviceSelect").value);
});

/* ---------------- Populate Devices ---------------- */
function populateDeviceDropdown() {
  const select = document.getElementById("deviceSelect");
  select.innerHTML = "";

  Object.entries(devices).forEach(([key, device]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = device.name;
    select.appendChild(opt);
  });
}

/* ---------------- Desktop Render (FIXED) ---------------- */
function renderDesktop() {
  if (!seoData) return;

  document.getElementById("desktop-title").textContent =
    truncateByPixel(seoData.title, 580, "16px Arial");

  document.getElementById("desktop-desc").textContent =
    truncateByPixel(seoData.description, 920, "13px Arial");

  document.getElementById("desktop-url").textContent = seoData.url;
}

/* ---------------- Mobile Render ---------------- */
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
}
