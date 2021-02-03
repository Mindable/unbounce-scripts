let _checkoutFormId = 'aa-checkout-div';
let _offerData;

function getCheckoutElem() {
    return document.querySelector(`#${_checkoutFormId}`);
}

function getCheckoutConfig(_checkoutElem) {
    let _config = {};
    let _urlParams = new URLSearchParams(window.location.search);
    _config.checkoutFormType = _checkoutElem.getAttribute('checkoutFormType') ?? 'digital';
    _config.offerId = _urlParams.get('offerId') ?? _checkoutElem.getAttribute('offerId');
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
                label: 'First Name*',
                name: 'firstname',
                prefillField: 'firstname'
            },
            {
                type: 'text',
                label: 'Last Name*',
                name: 'lastname',
                prefillField: 'lastname'
            },
            {
                type: 'email',
                label: 'Email*',
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
                prefillField: 'phone',
                optional: true
            },
            {
                type: 'header',
                label: 'Billing Address'
            },
            {
                type: 'text',
                label: 'Address*',
                name: 'adr'
            },
            {
                type: 'text',
                label: 'City*',
                name: 'city',
                prefillField: 'city'
            },
            {
                type: 'select',
                label: 'Country*',
                name: 'country',
                prefillField: 'country',
                onChange: countrySelectChanged,
                options: () => [
                    { text: '', value: undefined, isPlaceholder: true },
                ]
            },
            {
                type: 'select',
                label: 'State*',
                name: 'state',
                prefillField: 'state',
                onChange: onStateSelectChanged,
                options: () => [
                    { text: '', value: undefined, isPlaceholder: true },
                ]
            },
            {
                type: 'text',
                label: 'Zip/Postal Code*',
                name: 'zip',
                prefillField: 'zip',
                attributes: [
                    ['maxlength', 10]
                ]
            },
            {
                type: 'header',
                label: 'Payment Information'
            },
            {
                type: 'select',
                label: 'Card Type*',
                name: 'cc_type',
                options: () => [
                    { text: '', value: undefined, isPlaceholder: true },
                    { text: 'VISA', value: 'visa' },
                    // TODO This makes NO sense, fix in backend
                    { text: 'MasterCard', value: 'master' },
                ]
            },
            {
                type: 'text',
                label: 'Card Number*',
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
                label: 'CVV*',
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
            },
            {
                type: 'after-submit'
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
                                <label for='${c.name}'>${c.label}</label>
                                <div class='checkout-col'>
                                    <input class='checkout-input' type='${c.type}' id='${c.name}' name='${c.name}' ${c.optional===true?'':'required'}>
                                </div>
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
                                <label>Expires*</label>
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
                                    <label for='${c.name}'>${c.label}</label>
                                    <div class='checkout-col'>    
                                        <select class='checkout-input' id='${c.name}' name='${c.name}' required></select>
                                    </div>
                                </div>`;
        },
        'cc_expiry': createCcExpiryFromComponent,
        'pricing': createPricingFromComponent,
        'submit': (c, form) => {
            const result = document.createElement('div');
            form.appendChild(result);
            result.outerHTML = `<p class="terms">By submitting your request, you agree to the <a href="https://astrologyanswers.com/info/terms-of-service/" target="blank" title="Terms Of Service">Terms of Service.</a></p>
                                <div class='checkout-error' id='checkout_error'></div>
                                <input class='checkout-input' id='${c.name}' value='${c.label}' type='submit'></input>`;
        },
        'after-submit': (c, form) => {
            const result = document.createElement('div');
            result.id = 'after-submit';
            form.appendChild(result);
            result.innerHTML = `
            <p class="after-submit">
                <img src="https://mindable.github.io/unbounce-scripts/assets/lock_icon.jpg" alt="Italian Trulli">&nbsp;<b>Privacy & Security</b> - All your information is safe and secure.<br>
                The entire transaction will take place on a<br>
                secure server using SSL technology.
            </p>
            <div class="after-submit">
                <img src="https://mindable.github.io/unbounce-scripts/assets/mcafee_badge.png" alt="McAfee">&nbsp;
                <img src="https://mindable.github.io/unbounce-scripts/assets/truste_badge.png" alt="TRUSTe">
            </div>
            <p class="after-submit"><span class="heavy">Questions?</span> Call Toll Free: 1-866-329-7640</p>
            `;
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
        font-family: Montserrat, sans-serif;
    }
    .checkout-header {
        display: block;
        font-weight: bold;
        padding:1rem 0;
        text-align:left;
        font-family: Montserrat, sans-serif;
        clear:both; 
    }
    .checkout-row{
        display:inline-block;
        width:50%;
        float:left; 
    }
    .checkout-row:nth-of-type(11){
        width:50%;
    }
    .checkout-row:nth-of-type(13){
        width:35%;
    }
    .checkout-row:nth-of-type(14){
        width:65%;
    }
    .checkout-row:nth-of-type(15){
        width:100%;
    }
    .checkout-row .checkout-input{
        width:100%;
    }
    .checkout-row .checkout-col{
        padding-right:0.5rem;
    }
    .checkout-row {
        margin-bottom: 0.1rem;
        text-align:left;
    }
    .checkout-input {
        max-width:100%;
        border: 0.1rem solid #A3BAC6;
        border-radius: 0.2rem;
        margin-bottom:0.5rem;
        padding:0.5rem 0.625rem 0.5625rem;
        background:#fff;
        font-family: Montserrat, sans-serif;
        height: 2.6875rem;
        color:#5E6C7B;
    }
    input[readonly].checkout-input {
        background-color: #eee;
    }
    select.checkout-input{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color:#5E6C7B;  
        padding:0.5rem 0.625rem 0.5625rem;
        padding-left:0.5625rem!important;
        width:100%;
    }
    select.checkout-input{
        padding:0;
    }
    .checkout-error {
    }
    .checkout-submit {
    }
    #submit{
        background: linear-gradient(to bottom, rgba(98, 78, 151, 1) 0%, rgba(98, 78, 151, 1) 0%, rgba(98, 78, 151, 1) 0%, rgba(98, 78, 151, 1) 31%, rgba(73, 51, 135, 1) 58%, rgba(73, 51, 135, 1) 100%);
        padding:0.85rem 1rem;
        height:auto;
        color:#fff;
        text-transform:uppercase;
        font-weight:bold;
        border:0;
        border-radius:1.5rem;
        box-shadow:1px 2px 2px rgba(0,0,0,0.5);
        font-size:18px;
        max-width: 100%;
        width: 570px;
        margin-left:auto;
        margin-right:auto;
        white-space: normal;  
        margin-bottom:15px;  
        cursor:pointer;
    }
    #submit:hover{
        background:#472f85;
    }
    #submit:focus{
        outline:none;
    }
    ::-webkit-input-placeholder, :-ms-input-placeholder, ::placeholder{ 
        color: #5E6C7B;
    }
    #cc_month, #cc_year, #cc_cvv{
        width:95px;
        margin-right: 0.25rem;
    }
    .pricing-row.message {
        font-style: italic;
    }
    .pricing-row.offer-name {
        font-weight: bold;
        border-bottom: 1px solid #ccc;
        margin-bottom: 5px;
        padding-bottom: 5px;
        color:#472f85;
    }
    .pricing-row .price {
        font-weight: bold;
        float: right;
    }
    .message{
        color:red;
        font-size:12px;
    }
    #pricing{
        padding:1rem;
        background:#f3f4f6;
        border-radius:0.5rem;
        width:100%;
        max-width:100%;
        margin-bottom:1rem;
    }
    .terms{
        font-size:12px;
        clear:both;
        margin-bottom:1rem;
    }
    .terms a{
        color:#656565;
        text-decoration:underline;
    }
    @media screen and (max-width:767px){
        #submit{
            width:100%;
            margin-bottom:1rem;
        }
        .checkout-row{
            width:100%;
        }
        .terms{
            text-align:center;
            display:block;
            font-size:10px;
        }
    }
    #after-submit{
        width:570px;
        max-width:100%;
    }
    .after-submit{
        text-align: center;
        font-size:12px;
        width:100%;
        margin-bottom:1rem;
    }
    .after-submit .heavy{
        font-weight: bold;
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
    let _offerId = getCheckoutConfig(getCheckoutElem())['offerId'];
    //Add UTM parameters to Checkout Parameters for trigerring Cart Abandon
    let _utm_source = _urlParams.get('utm_source')??'';
    let _utm_campaign = _urlParams.get('utm_campaign')??'';
    let _utm_content = _urlParams.get('utm_content')??'';
    let _utm_term = _urlParams.get('utm_term')??'';
    let _utm_medium = _urlParams.get('utm_medium')??'';
    fetch(`https://aaproxyapis.astrologyanswerstest.com/checkout/params?hash=${_userHash}&token=${_token}&offer_id=${_offerId}&utm_source=${_utm_source}&utm_campaign=${_utm_campaign}&utm_content=${_utm_content}&utm_term=${_utm_term}&utm_medium=${_utm_medium}`)
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
                _offerData = data['offerData'];
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
    const stateLabel = form.querySelector('label[for="state"]');
    const stateSelect = form.querySelector('#state');
    fetch(`https://aaproxyapis.astrologyanswerstest.com/countries/${e.target.value}/states`).then(response => {
        if (response.status == 200) {
            response.json().then(data => {
                stateSelect.innerHTML = '';
                const placeholder = document.createElement('option');
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
                stateLabel.style.display = 'initial';
                stateSelect.style.display = 'initial';
                updatePricing();
            });
        }
        else {
            console.log('Error with API. Status code : ' + response.status);
            stateLabel.style.display = 'none';
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

    const addPricingRow = function (name, value) {
        const element = document.createElement('div');
        pricingDiv.appendChild(element);
        element.outerHTML = `<div class='pricing-row'>${name}: <span class='price'>$${value.toFixed(2)}</span></div>`;
    };
    const addMessageRow = function (message) {
        const element = document.createElement('div');
        element.className = 'pricing-row message';
        element.innerText = message;
        pricingDiv.appendChild(element);
    };

    const offerNameElement = document.createElement('div');
    offerNameElement.className = 'pricing-row offer-name';
    offerNameElement.innerText = _offerData['offer_name'];
    pricingDiv.appendChild(offerNameElement);

    const offerSubtotal = Number.parseFloat(_offerData['offer_price']);
    if (country == 'undefined') {
        addMessageRow('Please select country');
    }
    else if (country != 'CA') {
        // If the country is not Canada, then no tax
        addPricingRow('Total', offerSubtotal);
    }
    else if (state == 'undefined') {
        addMessageRow('Please select state');
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
        addPricingRow('Subtotal', offerSubtotal);
        addPricingRow('Taxes', tax);
        addPricingRow('Total', total);
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

    //Adding utm parameters
    let _urlParams = new URLSearchParams(window.location.search);
    formData.append('utm_source', _urlParams.get('utm_source') ?? '');
    formData.append('utm_campaign', _urlParams.get('utm_campaign') ?? '');
    formData.append('utm_content', _urlParams.get('utm_content') ?? '');
    formData.append('utm_term', _urlParams.get('utm_term') ?? '');
    //Add device Id, we should have it added to URL parameters from go-links
    formData.append('device_id', _urlParams.get('device_id') ?? 1);
    //Adding Tag & Tag2
    formData.append('tag', _urlParams.get('tag') ?? '');
    formData.append('tag2', _urlParams.get('tag2') ?? '');
    //Adding Order page url
    formData.append('order_page_url', `${window.location.protocol}//${window.location.host}/${window.location.pathname}`);

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
