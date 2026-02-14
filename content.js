(() => {
  const getMeta = (name, prop = false) => {
    if (prop) {
      return document.querySelector(`meta[property="${name}"]`)?.content || null;
    }
    return document.querySelector(`meta[name="${name}"]`)?.content || null;
  };

  const data = {
    title: document.title || "",
    description: getMeta("description") || "",
    robots: getMeta("robots") || "Not specified",
    canonical: document.querySelector('link[rel="canonical"]')?.href || "",
    url: window.location.href,

    ogImage: getMeta("og:image", true),

    headings: {
      h1: document.querySelectorAll("h1").length,
      h2: document.querySelectorAll("h2").length,
      h3: document.querySelectorAll("h3").length,
      h4: document.querySelectorAll("h4").length
    }
  };

  chrome.runtime.sendMessage(data);
})();
