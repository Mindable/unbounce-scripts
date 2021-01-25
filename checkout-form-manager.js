let _checkoutFormId = 'aa-checkout-div';
let _offerData;

function getCheckoutElem() {
    return document.querySelector(`#${_checkoutFormId}`);
}

function getCheckoutConfig(_checkoutElem) {
    let _config = {};
    _config.checkoutFormType = _checkoutElem.getAttribute('checkoutFormType') ?? 'digital';
    _config.offerId = _checkoutElem.getAttribute('offerId');
    _config.successfulCheckoutUrl = _checkoutElem.getAttribute('successfulCheckoutUrl') ?? 'astrologyanswers.com';
    _config.checkoutButtonText = _checkoutElem.getAttribute('checkoutButtonText') ?? 'Buy Now!';
    _config.disableDefaultCss = _checkoutElem.getAttribute('disableDefaultCss') ?? false;
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
                attributes: [
                    ['readonly', 'true']
                ]
            },
            {
                type: 'text',
                label: 'Contact Number',
                name: 'phone',
                prefillField: 'phone'
            },
            {
                type: 'header',
                label: 'Billing Address'
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
                onChange: countrySelectChanged,
                options: () => [
                    { text: 'Country', value: undefined, isPlaceholder: true },
                ]
            },
            {
                type: 'select',
                label: 'State',
                name: 'state',
                prefillField: 'state',
                onChange: onStateSelectChanged,
                options: () => [
                    { text: 'State', value: undefined, isPlaceholder: true },
                ]
            },
            {
                type: 'header',
                label: 'Payment Information'
            },
            {
                type: 'select',
                label: 'Card Type',
                name: 'cc_type',
                options: () => [
                    { text: 'Card Type', value: undefined, isPlaceholder: true },
                    { text: 'VISA', value: 'visa' },
                    { text: 'MasterCard', value: 'mastercard' },
                ]
            },
            {
                type: 'text',
                label: 'Card Number',
                name: 'cc_number',
                prefillField: 'cc_number',
                attributes: [
                    ['minlength', 16],
                    ['maxlength', 16]
                ]
            },
            {
                type: 'cc_expiry'
            },
            {
                type: 'text',
                label: 'CVV',
                name: 'cc_cvv',
                prefillField: 'cc_cvv',
                attributes: [
                    ['minlength', 3],
                    ['maxlength', 4]
                ]
            },
            {
                type: 'header',
                label: 'Review'
            },
            {
                type: 'pricing',
            },
            {
                type: 'submit',
                name: 'submit',
                label: config.checkoutButtonText
            }
        ],
        'physical': [
            {
                type: 'text',
                label: 'TODO',
                name: 'todo',
                prefillField: 'todo'
            },
            {
                type: 'submit',
                name: 'submit',
                label: config.checkoutButtonText
            }
        ]
    };
    const components = formTypeLookup[config.checkoutFormType];
    const addOptionsToSelectElement = function (id, options) {
        options.forEach(o => {
            const option = document.createElement('option');
            option.text = o.text;
            option.value = o.value;
            if (o.isPlaceholder) {
                option.disabled = true;
                option.selected = true;
            }
            formElement.querySelector(`#${id}`).appendChild(option);
        });
    };
    const createTextInputFromComponent = function (c, form) {
        const result = document.createElement('div');
        form.appendChild(result);
        result.outerHTML = `<div class='checkout-row'>
                                <div class='checkout-col'><input class='checkout-input' type='${c.type}' id='${c.name}' name='${c.name}' placeholder='${c.label}' required></div>
                            </div>`;
    };
    const createPricingFromComponent = function (c, form) {
        const result = document.createElement('div');
        result.id = 'pricing';
        result.className = 'checkout-row';
        form.appendChild(result);
    };
    const createCcExpiryFromComponent = function (c, form) {
        const result = document.createElement('div');
        form.appendChild(result);
        // TODO Refactor the builder to allow for nested components so we don't have to hardcode html here,
        // and use leverage how `select` components are built instead 
        result.outerHTML = `<div class='checkout-row'>
                                <div class='checkout-col'>
                                    <select class='checkout-input' id='cc_month' name='cc_month' required></select>
                                    <select class='checkout-input' id='cc_year' name='cc_year' required></select>
                                </div>
                            </div>`;
        addOptionsToSelectElement('cc_month', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            .map(i => { return { text: i, value: i } }));
        addOptionsToSelectElement('cc_year', Array(10).fill().map((_, i) => new Date().getFullYear() + i).map(year => {
            const option = document.createElement('option');
            option.text = year;
            option.value = year;
            return option;
        }));
    };
    const componentBuilderMap = {
        'header': (c, form) => {
            const result = document.createElement('div');
            form.appendChild(result);
            result.outerHTML = `<div class='checkout-header'>${c.label}</div>`;
        },
        'text': createTextInputFromComponent,
        'email': createTextInputFromComponent,
        'select': (c, form) => {
            const result = document.createElement('div');
            form.appendChild(result);
            result.outerHTML = `<div class='checkout-row'>
                                    <div class='checkout-col'><select class='checkout-input' id='${c.name}' name='${c.name}' required></select></div>
                                </div>`;
        },
        'cc_expiry': createCcExpiryFromComponent,
        'pricing': createPricingFromComponent,
        'submit': (c, form) => {
            const result = document.createElement('div');
            form.appendChild(result);
            result.outerHTML = `<div class='checkout-error' id='checkout_error'></div>
                                <input class='checkout-input' id='${c.name}' value='${c.label}' type='submit'></input>`;
        }
    };
    var formElement = document.createElement('form');
    formElement.id = 'aa-checkout-form';
    formElement.className = 'checkout-form';
    components.forEach(c => {
        componentBuilderMap[c.type](c, formElement);
    });
    components.forEach(c => {
        if (c.prefillField) formElement.querySelector(`#${c.name}`).setAttribute('checkout-prefill', c.prefillField);
        if (c.options) addOptionsToSelectElement(c.name, c.options());
        if (c.attributes) c.attributes.forEach(a => formElement.querySelector(`#${c.name}`).setAttribute(a[0], a[1]))
        if (c.onChange) formElement.querySelector(`#${c.name}`).addEventListener('change', c.onChange);
    });
    return formElement;
}

function addDefaultFormCss() {
    const defaultFormCss = `
    .checkout-form {
        width: 100%;
        margin-bottom:2rem;
        position:relative;
    }
    .checkout-header {
        display: block;
        font-weight: bold;
        padding:1rem 0;
        text-align:left;
    }
    .checkout-row {
        margin-bottom: 0.1rem;
        display: block;
        text-align:left;
    }
    .checkout-col {
    }
    .checkout-input {
        max-width:100%;
        border: 0.1rem solid #999;
        border-radius: 0.2rem;
        margin-bottom:0.5rem;
        padding:0.15rem 0.25rem;
        background:#f1f1f1;
    }
    select.checkout-input {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;  
    }
    select.checkout-input{
        padding:0;
    }
    .checkout-error {]
    }
    .checkout-submit {
    }
    #submit{
        background: linear-gradient(to bottom,#31aadd,#278fc1,#1c75a5,#105c89,#03446d)!important;
        padding:0.75rem 1rem;
        color:#fff;
        width:100%;
        text-transform:uppercase;
        font-weight:bold;
        border:0;
        border-radius:1.5rem;
        margin-top:1rem;
    }
`;
    const styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    styleElement.innerHTML = defaultFormCss;
    document.head.appendChild(styleElement);
}

function addCheckoutForm() {
    const checkoutElem = getCheckoutElem();
    const checkoutConfig = getCheckoutConfig(checkoutElem);
    if (!validateCheckoutConfig(checkoutConfig, checkoutElem)) return;
    if (!checkoutConfig.disableDefaultCss) addDefaultFormCss();
    const form = buildForm(checkoutConfig);
    checkoutElem.appendChild(form);
    prefillForm(form);
    form.addEventListener('submit', submitCheckout);
}

function validateCheckoutConfig(config, element) {
    if (!config.offerId) {
        element.innerHTML = 'Missing attribute: offerId';
        return false;
    }
    return true;
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
                    countrySelect.innerHTML = '';
                    var countryData = data['address']['countries'];
                    const placeholder = document.createElement('option');
                    placeholder.text = 'Country';
                    placeholder.value = undefined;
                    placeholder.disabled = true;
                    placeholder.selected = true;
                    countrySelect.appendChild(placeholder);
                    for (let key in countryData) {
                        const option = document.createElement('option');
                        option.text = countryData[key];
                        option.value = key;
                        countrySelect.appendChild(option);
                    }
                }

                // Set pricing info
                // TODO Get from data
                _offerData = {
                    "offer_id": "1358",
                    "offer_name": "Essential Year Forecast 3 Month - $37",
                    "offer_price": "37.00"
                };
                updatePricing();

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
                const placeholder = document.createElement('option');
                placeholder.text = 'State';
                placeholder.value = undefined;
                placeholder.disabled = true;
                placeholder.selected = true;
                stateSelect.appendChild(placeholder);
                for (let key in data) {
                    const option = document.createElement('option');
                    option.text = data[key];
                    option.value = key;
                    stateSelect.appendChild(option);
                }
                stateSelect.style.display = 'initial';
                updatePricing();
            });
        }
        else {
            console.log('Error with API. Status code : ' + response.status);
            stateSelect.style.display = 'none';
        }
    });
}

function onStateSelectChanged(e) {
    updatePricing();
}

function updatePricing() {
    const form = getCheckoutElem().querySelector('#aa-checkout-form');
    const pricingDiv = form.querySelector('#pricing');
    pricingDiv.innerHTML = '';
    const country = form.querySelector('#country').value;
    const state = form.querySelector('#state').value;


    const offerNameElement = document.createElement('div');
    offerNameElement.className = 'pricing-row offer-name';
    offerNameElement.innerText = _offerData['offer_name'];
    pricingDiv.appendChild(offerNameElement);

    // TODO Not a fan of the copypasta of html elements
    const offerSubtotal = Number.parseFloat(_offerData['offer_price']);
    if (country == 'undefined') {
        const element = document.createElement('div');
        element.className = 'pricing-row';
        element.innerText = 'Please select country';
        pricingDiv.appendChild(element);
    }
    else if (country != 'CA') {
        // If the country is not Canada, then no tax
        const element = document.createElement('div');
        element.className = 'pricing-row';
        element.innerHTML = `Total: <span class='price'>$${offerSubtotal}</span>`;
        pricingDiv.appendChild(element);

    }
    else if (state == 'undefined') {
        const element = document.createElement('div');
        element.className = 'pricing-row';
        element.innerText = 'Please select state';
        pricingDiv.appendChild(element);
    }
    else {
        // If the country is Canada, and a valid state is selected, present subtotal & tax separately
        // https://www.taxtips.ca/salestaxes/sales-tax-rates-2020.htm
        const canadianTaxMap = {
            'AB': 0.05,
            'BC': 0.12,
            'MB': 0.12,
            'NB': 0.15,
            'NL': 0.15,
            'NT': 0.05,
            'NS': 0.15,
            'NU': 0.05,
            'ON': 0.13,
            'PE': 0.15,
            'QC': 0.14975,
            'SK': 0.11,
            'YT': 0.05
        };
        const tax = offerSubtotal * canadianTaxMap[state];
        const total = offerSubtotal + tax;
        pricingDiv.innerHTML = `
        <div class='pricing-row'>Subtotal: <span class='price'>$${offerSubtotal}</span></div>
        <div class='pricing-row'>Taxes: <span class='price'>$${tax.toFixed(2)}</span></div>
        <div class='pricing-row'>Total: <span class='price'>$${total.toFixed(2)}</span></div>
        `;
    }
}

function submitCheckout(e) {
    e.preventDefault();
    const checkoutElement = getCheckoutElem();
    const config = getCheckoutConfig(checkoutElement);
    const form = checkoutElement.querySelector('#aa-checkout-form');

    const formData = new FormData(form);
    formData.append('hash', (new URL(document.location)).searchParams.get('hash'));
    formData.append('offer_id', checkoutElement.getAttribute('offerId'));

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
    // design-time href: `//funnel/upsell?offer_id=OFFER_ID&callbackUrl=https://flux.astrologyanswers.com/?flux_action=1&flux_f=1&flux_ffn=2`
    // rendered href: `https://flux.astrologyanswers.com/?flux_action=1&flux_f=1&flux_ffn=2&offer_id=OFFER_ID&hash=HASH&token=TOKEN`
    Array.from(document.getElementsByTagName('a')).forEach(a => {
        const hrefPattern = /.*\/\/funnel\/upsell\?([^&]*)&?callbackUrl=(.*)/;
        const match = hrefPattern.exec(a.href);
        if (!match) return;

        const hrefParams = match[1].split('&').reduce((acc, cur) => {
            const tuple = cur.split('=');
            acc.push({ name: tuple[0], value: tuple[1] });
            return acc;
        }, []);

        urlParams = new URLSearchParams(window.location.search);
        hrefParams.push({ name: 'hash', value: urlParams.get('hash') });
        hrefParams.push({ name: 'token', value: urlParams.get('token') });

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
