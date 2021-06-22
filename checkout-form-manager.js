const _urlParams = new URLSearchParams(window.location.search);

const checkout = {
    upsell : {
        processing: false,
        className: 'upsell-link',

        registerElements: function (elmIdentityCollection, actionUrl, offerId='0') {
            let _upsell_registrations = 0;
            let _upsell_registration_requests = (elmIdentityCollection.match(/,/g) || []).length + 1;
            document.querySelectorAll(elmIdentityCollection).forEach(elm => {
                elm.classList.add(this.className);
                if(elm.tagName === 'A') {
                    elm.href = 'javascript:void(0);';
                }
                elm.dataset.actionUrl = actionUrl;
                elm.dataset.offerId = offerId;
                _upsell_registrations++ ;
            });
            if(_upsell_registrations) {
                console.log(`Successfully registered ${_upsell_registrations} Upsell Links`);
            }
            if(_upsell_registrations<_upsell_registration_requests) {
                console.error(`Unable to process ${_upsell_registration_requests-_upsell_registrations} upsell registrations.`);
            }
        },

        verify: function () {
            this.verifyLinks();
            this.verifyURLParameters();
        },

        verifyLinks: function () {
            console.log('Verifying Upsell Links');
            let _upsell_links = document.getElementsByClassName(this.className);
            if (_upsell_links.length === 0) {
                console.info('No Upsell Links found on this page');
                return;
            }

            console.info(`Found ${_upsell_links.length} Upsell Links on this page`);

            [..._upsell_links].forEach(elm => {

                if (!elm.dataset.actionUrl) {
                    console.error(`Action URL missing for '${elm.innerHTML}'`);
                }

                if (!elm.dataset.offerId) {
                    console.error(`Offer Id missing for '${elm.innerHTML}'`);
                }
            });
        },

        verifyURLParameters: function () {
            console.log('Verify extra inputs in Payload');

            if (!_urlParams.get('hash')) {
                console.error('Unable to fetch Hash from URL');
            }

            if (!_urlParams.get('token')) {
                console.error('Unable to fetch Token from URL');
            }
        },

        process: function (elm) {
            if(this.processing) {
                console.error('Cannot process multiple Upsells');
                return;
            }
            this.processing = true;
            const tempForm = document.createElement('form');

            tempForm.style.display = 'none';
            tempForm.action = elm.dataset.actionUrl;
            tempForm.method = 'POST';

            let formParams = [
                {
                    name: 'offer_id',
                    value: elm.dataset.offerId
                }, {
                    name: 'hash',
                    value: _urlParams.get('hash')
                }, {
                    name: 'token',
                    value: _urlParams.get('token')
                }, {
                    name: 'order_page_url',
                    value: `${window.location.protocol}//${window.location.host}/${window.location.pathname}`
                }
            ];

            formParams.forEach(p => {
                const input = document.createElement('input');
                input.name = p.name;
                input.value = p.value;
                tempForm.appendChild(input);
            });

            document.body.appendChild(tempForm);
            tempForm.submit();
        }
    }
}

document.addEventListener('click', function (event) {
    let _upsell_ClassName = checkout.upsell.className;
    if(event.target.classList.contains(_upsell_ClassName)){
        checkout.upsell.process(event.target);
    }
});
