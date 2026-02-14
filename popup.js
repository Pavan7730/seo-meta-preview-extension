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

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files: ["content.js"]
  });
});

chrome.runtime.onMessage.addListener((data) => {
  document.getElementById("meta-title").textContent =
    `${data.title} (${data.title.length} characters)`;

  document.getElementById("meta-description").textContent =
    `${data.description} (${data.description.length} characters)`;

  document.getElementById("robots").textContent = data.robots;
  document.getElementById("url").textContent = data.url;
  document.getElementById("canonical").textContent = data.canonical;

  document.getElementById("desktop-title").textContent = data.title;
  document.getElementById("desktop-url").textContent = data.url;
  document.getElementById("desktop-desc").textContent = data.description;

  document.getElementById("mobile-title").textContent = data.title;
  document.getElementById("mobile-url").textContent = data.url;
  document.getElementById("mobile-desc").textContent = data.description;
});
