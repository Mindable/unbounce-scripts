let _checkoutFormId = 'aa-checkout-div';

function getCheckoutElem() {
    return document.querySelector(`#${_checkoutFormId}`);
}

function getCheckoutConfig(_checkoutElem) {
    let _config = {};
    _config.checkoutFormType = _checkoutElem.getAttribute('checkoutFormType') ?? 'digital';
    _config.successfulCheckoutUrl = _checkoutElem.getAttribute('successfulCheckoutUrl') ?? 'astrologyanswers.com';
    _config.checkoutButtonText = _checkoutElem.getAttribute('checkoutButtonText') ?? 'Buy Now!';
    return _config;
}

function buildForm(config) {
    const formTypeLookup = {
        'digital': [
            {
                type: 'header',
                label: 'Contact Details'
            },
            {
                type: 'text',
                label: 'First Name',
                name: 'firstname',
                prefillField: 'firstname'
            },
            {
                type: 'text',
                label: 'Last Name',
                name: 'lastname',
                prefillField: 'lastname'
            },
            {
                type: 'email',
                label: 'Email',
                name: 'email',
                prefillField: 'email',
                readonly: true
            },
            {
                type: 'text',
                label: 'Contact Number',
                name: 'phone',
                prefillField: 'phone'
            },
            {
                type: 'header',
                label: 'Current Billing Address'
            },
            {
                type: 'text',
                label: 'Address',
                name: 'adr'
            },
            {
                type: 'text',
                label: 'City',
                name: 'city',
                prefillField: 'city'
            },
            {
                type: 'select',
                label: 'Country',
                name: 'country',
                prefillField: 'country',
                onChange: countrySelectChanged
            },
            {
                type: 'select',
                label: 'State',
                name: 'state',
                prefillField: 'state'
            },
            {
                type: 'header',
                label: 'Credit Card Information'
            },
            {
                type: 'select',
                label: 'Card Type',
                name: 'cc_type',
                options: () => [
                    { text: 'Select One', value: null },
                    { text: 'VISA', value: 'visa' },
                    { text: 'MasterCard', value: 'mastercard' },
                ]
            },
            {
                type: 'text',
                label: 'Card Number',
                name: 'cc_number',
                prefillField: 'cc_number'
            },
            {
                type: 'select',
                label: 'Expiry Month',
                name: 'cc_month',
                options: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                    .map(i => { return { text: i, value: i } })
            },
            {
                type: 'select',
                label: 'Expiry Year',
                name: 'cc_year',
                options: () => {
                    const currentYear = new Date().getFullYear();
                    return Array(10).fill().map((_, i) => currentYear + i).map(year => {
                        const option = document.createElement('option');
                        option.text = year;
                        option.value = year;
                        return option;
                    });
                }
            },
            {
                type: 'text',
                label: 'CVV',
                name: 'cc_cvv',
                prefillField: 'cc_cvv'
            },
            {
                type: 'submit',
                name: 'submit',
                label: config.checkoutButtonText
            }
        ],
        'upsell': [
            {
                type: 'text',
                label: 'Offer ID',
                name: 'offer_id',
                prefillField: 'offer_id'
            },
            {
                type: 'submit',
                name: 'submit',
                label: config.checkoutButtonText
            }
        ]
    };
    const components = formTypeLookup[config.checkoutFormType];
    const createFromTextCompononent = function (c, form) {
        const result = document.createElement('div');
        form.appendChild(result);
        result.outerHTML = `<div class='checkout-row'>
                                <div class='checkout-col'><label for='${c.name}' class='checkout-label'>${c.label}:</label></div>
                                <div class='checkout-col'><input type='${c.type}' id='${c.name}' name='${c.name}' required></div>
                            </div>`;
    };
    const componentBuilderMap = {
        'header': (c, form) => {
            const result = document.createElement('div');
            form.appendChild(result);
            result.outerHTML = `<h2><span style='font-family: lato; font-size: 24px; color: rgb(0, 0, 0); text-decoration: underline;'>${c.label}</span></h2>`;
        },
        'text': (c, form) => createFromTextCompononent(c, form),
        'email': (c, form) => createFromTextCompononent(c, form),
        'select': (c, form) => {
            const result = document.createElement('div');
            form.appendChild(result);
            result.outerHTML = `<div class='checkout-row'>
                                    <div class='checkout-col'><label for='${c.name}' class='checkout-label'>${c.label}:</label></div>
                                    <div class='checkout-col'><select id='${c.name}' name='${c.name}' required></select></div>
                                </div>`;
        },
        'submit': (c, form) => {
            const result = document.createElement('div');
            form.appendChild(result);
            result.outerHTML = `<div class='checkout-errror' id='checkout_error'></div>
                                <button class='lp-element lp-pom-button' id='${c.name}' type='submit'> ${c.label} </button>`;
        }
    };
    var formElement = document.createElement('form');
    formElement.id = 'aa-checkout-form';
    components.forEach(c => {
        componentBuilderMap[c.type](c, formElement);
    });
    components.forEach(c => {
        if (c.readonly) formElement.querySelector(`#${c.name}`).setAttribute('readonly', 'true');
        if (c.prefillField) formElement.querySelector(`#${c.name}`).setAttribute('checkout-prefill', c.prefillField);
        if (c.options) c.options().forEach(o => {
            const option = document.createElement('option');
            option.text = o.text;
            option.value = o.value;
            formElement.querySelector(`#${c.name}`).appendChild(option);
        });
        if (c.onChange) formElement.querySelector(`#${c.name}`).addEventListener('change', c.onChange);
    });
    return formElement;
}

function addCheckoutForm() {
    const _checkoutElem = getCheckoutElem();
    const form = buildForm(getCheckoutConfig(_checkoutElem));
    _checkoutElem.appendChild(form);
    prefillForm(form);
    form.addEventListener('submit', submitCheckout);
}

function prefillForm(form) {
    let _urlParams = new URLSearchParams(window.location.search);
    let _token = _urlParams.get('token');
    let _userHash = _urlParams.get('hash');
    fetch(`https://aaproxyapis.astrologyanswerstest.com/checkout/params?hash=${_userHash}&token=${_token}`)
        .then(response => {
            if (response.status !== 200) {
                console.log('Error with API. Status code : ' + response.status);
                return;
            }
            response.json().then(data => {
                // Set countrySelect options from address->country
                const countrySelect = form.querySelector('#country');
                if (countrySelect) {
                    var countryData = data['address']['countries'];
                    for (let key in countryData) {
                        const option = document.createElement('option');
                        option.text = countryData[key];
                        option.value = key;
                        countrySelect.appendChild(option);
                    }
                    // Trigger the inital update of the states list
                    countrySelect.dispatchEvent(new Event('change'));
                }

                // Prefill input values from user
                const userData = data['user'];
                if (!userData) return;
                const inputs = Array.from(form.getElementsByTagName('input'));
                inputs.forEach(input => {
                    const dataFieldKey = input.getAttribute('checkout-prefill');
                    if (!dataFieldKey) return;
                    const value = userData[dataFieldKey];
                    if (!value || typeof (value) == 'object') return;
                    input.value = value;
                });
            });
        });
}

function countrySelectChanged(e) {
    const form = getCheckoutElem().querySelector('#aa-checkout-form');
    const stateSelect = form.querySelector('#state');
    fetch(`https://aaproxyapis.astrologyanswerstest.com/countries/${e.target.value}/states`).then(response => {
        if (response.status == 200) {
            response.json().then(data => {
                stateSelect.innerHTML = '';
                for (let key in data) {
                    const option = document.createElement('option');
                    option.text = data[key];
                    option.value = key;
                    stateSelect.appendChild(option);
                }
                stateSelect.style.display = 'initial';
            });
        }
        else {
            console.log('Error with API. Status code : ' + response.status);
            stateSelect.style.display = 'none';
        }
    });
}

function submitCheckout(e) {
    e.preventDefault();
    const config = getCheckoutConfig(getCheckoutElem());
    const form = getCheckoutElem().querySelector('#aa-checkout-form');

    const formData = new FormData(form);
    formData.append('hash', (new URL(document.location)).searchParams.get('hash'));
    // TODO get offer_id from url
    formData.append('offer_id', 123);

    const formDataJson = Array.from(formData).reduce((acc, cur) => {
        acc[cur[0]] = cur[1];
        return acc;
    }, {});

    fetch(`https://aaproxyapis.astrologyanswerstest.com/checkout`, {
        method: 'POST',
        body: JSON.stringify(formDataJson)
    }).then(response => {
        if (response.status != 200) {
            console.log(`Error on checkout API: ${response.status}`);
            return;
        }
        response.json().then(data => {
            if (data['status'] != 'success') {
                form.querySelector('#checkout_error').innerHTML = `Checkout unsuccessful: ${data['message']}`;
                return;
            }
            window.location.href = `${config.successfulCheckoutUrl}&token=${data['token']}`;
        });
    });
}

function registerUpsellLinks() {
    // design-time href: `//funnel/upsell?offerId=OFFER_ID&callbackUrl=https://flux.astrologyanswers.com/?flux_action=1&flux_f=1&flux_ffn=2`
    // rendered href: `https://flux.astrologyanswers.com/?flux_action=1&flux_f=1&flux_ffn=2&offerId=OFFER_ID&hash=HASH&token=TOKEN`
    Array.from(document.getElementsByTagName('a')).forEach(a => {
        const hrefPattern = /.*\/\/funnel\/upsell\?([^&]*)&?callbackUrl=(.*)/;
        const match = hrefPattern.exec(a.href);
        if (!match) return;
        
        const hrefParams = match[1].split('&').reduce((acc, cur) => {
            const tuple = cur.split('=');
            acc.push({name: tuple[0], value: tuple[1]});
            return acc;
        }, []);

        urlParams = new URLSearchParams(window.location.search);
        hrefParams.push({name: 'hash', value: urlParams.get('hash')});
        hrefParams.push({name: 'token', value: urlParams.get('token')});

        const callbackUrl = match[2];
        a.addEventListener('click', e => {
            e.preventDefault();
            submitUpsell(callbackUrl, hrefParams);
        })
    });
}

function submitUpsell(callbackUrl, additionalParams) {
    const url = new URL(callbackUrl);
    additionalParams.forEach(p => url.searchParams.append(p.name, p.value));
    window.location.href = url.toString();
}

window.addEventListener('DOMContentLoaded', (e) => {
    if (getCheckoutElem()) addCheckoutForm();
    registerUpsellLinks();
});
