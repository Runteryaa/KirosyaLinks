document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const contentDiv = document.getElementById('content');
  
  try {
    const { links } = await chrome.storage.local.get('links');
    const currentUrl = new URL(tab.url);
    
    const affiliateLink = links.find(link => {
      try {
        return new URL(link.url).hostname === currentUrl.hostname;
      } catch {
        return false;
      }
    });

    if (affiliateLink) {
      contentDiv.innerHTML = `
        <div class="affiliate-info">
          <div class="title">${affiliateLink.title}</div>
          <div class="field">
            <span class="label">URL:</span>
            <span class="value">${affiliateLink.url}</span>
          </div>
          ${affiliateLink.description ? `
          <div class="field">
            <span class="label">Description:</span>
            <span class="value">${affiliateLink.description}</span>
          </div>` : ''}
          ${affiliateLink.refcode ? `
          <div class="field">
            <span class="label">Affiliate Code:</span>
            <span class="value">${affiliateLink.refcode}</span>
          </div>` : ''}
        </div>
      `;
    } else {
      window.open('https://kirosya.online', '_blank');
      window.close();
    }
  } catch (error) {
    contentDiv.textContent = 'Error loading affiliate information';
    console.error('Popup error:', error);
  }
});