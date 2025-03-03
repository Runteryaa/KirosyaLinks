
document.addEventListener('DOMContentLoaded', () => {
    const linksContainer = document.getElementById('links-container');
    const loadingMessage = document.getElementById('loading-message');
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-button');
    const container = document.querySelector('.container');
    let allLinks = [];
    const primaryURL = 'https://kirosya.xyz/links.json';
    const fallbackURL = 'https://raw.githubusercontent.com/Runteryaa/KirosyaLinks/refs/heads/main/links.json';

    function fetchLinks(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            });
    }

    fetchLinks(primaryURL)
        .then(data => {
            loadingMessage.textContent = '';
            allLinks = data.links;
            displayLinks(allLinks);
	    adjustBodyHeight();
        })
        .catch(error => {
            console.warn('Primary fetch failed, trying fallback URL:', error);
            loadingMessage.textContent = 'The main data source is unavailable. You may have fewer links...';
            fetchLinks(fallbackURL)
                .then(data => {
                    allLinks = data.links;
                    displayLinks(allLinks);
		    adjustBodyHeight();
                })
                .catch(fallbackError => {
                    console.error('Error fetching from fallback URL:', fallbackError);
                    loadingMessage.textContent = 'Failed to load links. Please try again later.';
                    loadingMessage.id = 'error-message';
		    adjustBodyHeight();
                });
        });

    function adjustBodyHeight() {
        const containerHeight = container.offsetHeight + 25;
        document.body.style.height = `${containerHeight}px`;
    }
    setInterval(() => adjustBodyHeight(), 2000);

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredLinks = allLinks.filter(link =>
            link.title.toLowerCase().includes(searchTerm) ||
            (link.description && link.description.toLowerCase().includes(searchTerm))
        );
        displayLinks(filteredLinks);
        clearButton.style.display = searchInput.value ? 'inline' : 'none';
	adjustBodyHeight();
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        displayLinks(allLinks);
	adjustBodyHeight();
    });

    function displayLinks(links) {
        linksContainer.innerHTML = '';
        if (links.length === 0) {
            linksContainer.innerHTML = '<p>No links found.</p>';
            return;
        }
        links.forEach(link => {
            const linkButton = document.createElement('button');
            linkButton.className = 'link-button';
            const buttonContent = document.createElement('div');
            buttonContent.style.display = 'flex';
            buttonContent.style.alignItems = 'center';
            if (link.url) {
                const favicon = document.createElement('img');
                favicon.src = `https://www.google.com/s2/favicons?sz=64&domain=${link.url}`;
                favicon.alt = 'Favicon';
                favicon.style.width = '24px';
                favicon.style.height = '24px';
                favicon.style.marginRight = '0.5rem';
                buttonContent.appendChild(favicon);
            }
            buttonContent.appendChild(document.createTextNode(link.title));
            linkButton.appendChild(buttonContent);
            linkButton.addEventListener('click', () => showPopup(link));
            linksContainer.appendChild(linkButton);
        });
	adjustBodyHeight();
    }
  
    function showPopup(link) {
	const useOuo = true;
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <div class="popup-content">
                <div style="display: flex; justify-content: space-between;">
                    <h2 class="popup-title">${link.title}</h2>
                    <p class="popup-close">✖</p>
                </div>
                <p class="popup-description">${link.description || 'No description available.'}</p>
                <div class="popup-images" style="display: flex; overflow-x: auto; gap: 1rem; padding-bottom: 1rem;"></div>
                <div class="popup-buttons">
		    <button class="popup-button popup-button-primary" onclick="window.open('http://ouo.io/qs/iLw8gjsf?s=${link.url}', '_blank')">Go to Link</button>
    ${link.refcode ? `
        <button class="popup-button popup-button-secondary" 
            onclick="copyRefCode(this, '${link.refcode}')">
            Copy Code: ${link.refcode}
        </button>` 
    : ''}
</div>
            </div>`;
        if (link.imgs && link.imgs.length > 0) {
            const imageContainer = popup.querySelector('.popup-images');
            link.imgs.forEach(imgUrl => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = link.title;
                img.style.height = '200px';
                img.style.flexShrink = '0';
                imageContainer.appendChild(img);
            });
        }
        document.body.appendChild(popup);
        popup.addEventListener('click', (e) => {
            if (e.target === popup) popup.remove();
        });
        const closeButton = popup.querySelector('.popup-close');
        closeButton.addEventListener('click', () => popup.remove());
	adjustBodyHeight();
    }

    function copyRefCode(button, refcode) {
        navigator.clipboard.writeText(refcode).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.disabled = true;
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy ref code: ', err);
            alert('Failed to copy ref code. Please try again.');
        });
	adjustBodyHeight();
    }
});