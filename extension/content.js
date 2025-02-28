// Override the OUO setting
window.useOuo = false;

// Optional: Force update existing buttons
document.querySelectorAll('.popup-button').forEach(button => {
  button.onclick = function() {
    window.open(window.useOuo ? `http://ouo.io/qs/iLw8gjsf?s=${link.url}` : link.url, '_blank');
  };
});

async function detectAffiliateSite() {
  try {
    const response = await fetch('https://kirosya.online/links.json');
    const { links } = await response.json();
    const currentHost = new URL(window.location.href).hostname;

    const matchedLink = links.find(link => {
      try {
        return new URL(link.url).hostname === currentHost;
      } catch {
        return false;
      }
    });

    if (matchedLink) {
      // Store matched link and update icon
      chrome.storage.local.set({ currentAffiliate: matchedLink });
      chrome.runtime.sendMessage({ action: "updateIcon", state: "green" });
    } else {
      chrome.runtime.sendMessage({ action: "updateIcon", state: "gray" });
    }
  } catch (error) {
    console.error('Detection error:', error);
  }
}

// Run on initial load and subsequent navigation
detectAffiliateSite();
window.addEventListener('load', detectAffiliateSite);
window.addEventListener('popstate', detectAffiliateSite);
window.addEventListener('pushstate', detectAffiliateSite);
window.addEventListener('replacestate', detectAffiliateSite);

// Add this to content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateIcon") {
    chrome.action.setIcon({
      path: {
        "16": `${message.state}.png`,
        "48": `${message.state}.png`,
        "128": `${message.state}.png`
      }
    });
  }
});