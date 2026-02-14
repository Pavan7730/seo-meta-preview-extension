(() => {
  const getMeta = (name) =>
    document.querySelector(`meta[name="${name}"]`)?.content || "Not specified";

  const data = {
    title: document.title || "Not specified",
    description: getMeta("description"),
    robots: getMeta("robots"),
    canonical:
      document.querySelector('link[rel="canonical"]')?.href || "Not specified",
    url: window.location.href
  };

  chrome.runtime.sendMessage(data);
})();
