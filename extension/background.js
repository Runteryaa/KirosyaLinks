async function updateLinksData() {
  try {
    const response = await fetch('https://kirosya.online/links.json');
    const data = await response.json();
    
    // Validate and store links with proper error handling
    const validatedLinks = data.links.filter(link => {
      try {
        new URL(link.url);
        return true;
      } catch {
        console.warn('Invalid URL skipped:', link.url);
        return false;
      }
    });
    
    await chrome.storage.local.set({ links: validatedLinks });
  } catch (error) {
    console.error('Error updating links:', error);
  }
}

async function updateIconState(tab) {
  try {
    if (!tab.url || !tab.url.startsWith('http')) return;

    const { links = [] } = await chrome.storage.local.get('links');
    const currentHost = new URL(tab.url).hostname;
    
    const isAffiliate = links.some(link => {
      try {
        return new URL(link.url).hostname === currentHost;
      } catch {
        return false;
      }
    });

    const iconPath = isAffiliate ? 'green' : 'gray';
    
    // Set all icon sizes explicitly
    chrome.action.setIcon({
      path: {
        "16": `${iconPath}.png`,
        "48": `${iconPath}.png`,
        "128": `${iconPath}.png`
      }
    });
  } catch (error) {
    console.error('Icon update error:', error);
  }
}

// Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') updateIconState(tab);
});

// Listener for tab switches
chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, updateIconState);
});

// Initial setup
chrome.runtime.onInstalled.addListener(() => {
  updateLinksData();
  chrome.alarms.create('refreshLinks', { periodInMinutes: 1440 });
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'refreshLinks') updateLinksData();
});