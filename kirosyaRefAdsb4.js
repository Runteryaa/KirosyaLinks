document.addEventListener('DOMContentLoaded', () => {
    const kirosyaRefAdsSettings = window.kirosyaRefAdsSettings || {};
    const kirosyaRefAdsCustomLinks = kirosyaRefAdsSettings.kirosyaRefAdsCustomLinks || 'https://runbase.glitch.me/links.json';
    const kirosyaRefAdsAdLocation = kirosyaRefAdsSettings.kirosyaRefAdsAdsLocation || 'bottom';
    const kirosyaRefAdsOUO = kirosyaRefAdsSettings.kirosyaRefAdsOUO || true;
    const kirosyaRefAdsOUOToken = kirosyaRefAdsSettings.kirosyaRefAdsOUOToken || 'iLw8gjsf';


    function kirosyaRefAdsCreateAd() {
        const kirosyaRefAdsAdContainer = document.createElement('div')
        kirosyaRefAdsAdContainer.style.zIndex = '99999999'
        kirosyaRefAdsAdContainer.style.position = 'fixed'
        kirosyaRefAdsAdContainer.style.bottom = '20px'
        kirosyaRefAdsAdContainer.style.backgroundColor = 'blue'
        kirosyaRefAdsAdContainer.style.padding = '5px'
        kirosyaRefAdsAdContainer.style.borderRadius = '10px'
        // kirosyaRefAdsAdContainer.style.
        kirosyaRefAdsAdContainer.id = 'kirosya-refads-container'

        const kirosyaRefAdsAdImg = document.createElement('img');
        kirosyaRefAdsAdImg.id = 'kirosya-refads-img';
        kirosyaRefAdsAdImg.alt = 'KirosyaRefAds Referral Image';

        const kirosyaRefAdsAdLink = document.createElement('a');
        kirosyaRefAdsAdLink.id = 'kirosya-refads-link';
        kirosyaRefAdsAdLink.href = 'https://kirosya.online';
        kirosyaRefAdsAdLink.target = '_blank';
        kirosyaRefAdsAdLink.textContent = 'Check this offer!';

        const kirosyaRefAdsAdClose = document.createElement('button');
        kirosyaRefAdsAdClose.id = 'kirosya-refads-close';
        kirosyaRefAdsAdClose.innerHTML = '✖';

        kirosyaRefAdsAdClose.addEventListener('click', () => {
            kirosyaRefAdsAdContainer.style.display = 'none';
        });

        kirosyaRefAdsAdContainer.appendChild(kirosyaRefAdsAdImg);
        kirosyaRefAdsAdContainer.appendChild(kirosyaRefAdsAdLink);
        kirosyaRefAdsAdContainer.appendChild(kirosyaRefAdsAdClose);
        document.body.appendChild(kirosyaRefAdsAdContainer);

        return kirosyaRefAdsAdContainer;
    }

    function kirosyaRefAdsShowAd(kirosyaRefAdsAdContainer, kirosyaRefAdsAdLinks) {

        const kirosyaRefAdsRandomIndex = Math.floor(Math.random() * kirosyaRefAdsAdLinks.length);
        const kirosyaRefAdsRandomLink = kirosyaRefAdsAdLinks[kirosyaRefAdsRandomIndex];

        const kirosyaRefAdsAdLink = kirosyaRefAdsAdContainer.querySelector('#kirosya-refads-link');
        const kirosyaRefAdsAdImg = kirosyaRefAdsAdContainer.querySelector('#kirosya-refads-img');

        kirosyaRefAdsAdLink.href = kirosyaRefAdsRandomLink.url;
        kirosyaRefAdsAdLink.textContent = `${kirosyaRefAdsRandomLink.title}: ${kirosyaRefAdsRandomLink.description || 'Check this out!'}`;
        //
        kirosyaRefAdsAdContainer.style.display = 'flex';
    }



    function kirosyaRefAdsFetchAds() {
        if (kirosyaRefAdsCustomLinks) {
            return fetch(kirosyaRefAdsCustomLinks)
                .then(response => response.json())
                .then(data => data.links)
                .catch(() =>
                    fetch('https://runbase.glitch.me/links.json')
                        .then(response => response.json())
                        .then(data => data.links)
                        .catch(() => console.log("failed"))
                );
        } else {
            return fetch('https://runbase.glitch.me/links.json')
                .then(response => response.json())
                .then(data => data.links)
                .then(console.log(data))
                .catch(() => console.log("failed"));
        }
    }

    const kirosyaRefAdsAdContainer = kirosyaRefAdsCreateAd();


    kirosyaRefAdsFetchAds().then(kirosyaRefAdsAdLinks => {
        setTimeout(() => kirosyaRefAdsShowAd(kirosyaRefAdsAdContainer, kirosyaRefAdsAdLinks), 5000);
    });
})