let _checkoutFormId = 'aa-checkout-div';

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
                prefillField: 'cc_cvv',
                attributes: [
                    ['minlength', 3],
                    ['maxlength', 4]
                ]
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
    const createTextInputFromComponent = function (c, form) {
        const result = document.createElement('div');
        form.appendChild(result);
        result.outerHTML = `<div class='checkout-row'>
                                <div class='checkout-col'><input class='checkout-input' type='${c.type}' id='${c.name}' name='${c.name}' placeholder='${c.label}' required></div>
                            </div>`;
    };
    const componentBuilderMap = {
        'header': (c, form) => {
            console.log('wat');
            const result = document.createElement('div');
            form.appendChild(result);
            result.outerHTML = `<div class='checkout-header'>${c.label}</div>`;
        },
        'text': (c, form) => createTextInputFromComponent(c, form),
        'email': (c, form) => createTextInputFromComponent(c, form),
        'select': (c, form) => {
            const result = document.createElement('div');
            form.appendChild(result);
            result.outerHTML = `<div class='checkout-row'>
                                    <div class='checkout-col'><select class='checkout-input' id='${c.name}' name='${c.name}' required></select></div>
                                </div>`;
        },
        'submit': (c, form) => {
            const result = document.createElement('div');
            form.appendChild(result);
            result.outerHTML = `<div class='checkout-errror' id='checkout_error'></div>
                                <button class='checkout-submit' id='${c.name}' type='submit'> ${c.label} </button>`;
        }
    };
    var formElement = document.createElement('form');
    formElement.id = 'aa-checkout-form';
    components.forEach(c => {
        componentBuilderMap[c.type](c, formElement);
    });
    components.forEach(c => {
        if (c.prefillField) formElement.querySelector(`#${c.name}`).setAttribute('checkout-prefill', c.prefillField);
        if (c.options) c.options().forEach(o => {
            const option = document.createElement('option');
            option.text = o.text;
            option.value = o.value;
            if (o.isPlaceholder) {
                option.disabled = true;
                option.selected = true;
            }

            formElement.querySelector(`#${c.name}`).appendChild(option);
        });
        if (c.attributes) c.attributes.forEach(a => formElement.querySelector(`#${c.name}`).setAttribute(a[0], a[1]))
        if (c.onChange) formElement.querySelector(`#${c.name}`).addEventListener('change', c.onChange);
    });
    return formElement;
}

function addDefaultFormCss() {
    const defaultFormCss = `
.checkout-row {
    display: flex;
    margin: 0px;
}
.checkout-col {
}
.checkout-input {
}
.checkout-header {
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
                    var countryData = data['address']['countries'];
                    const placeholder = document.createElement('option');
                    placeholder.text = 'Country';
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
