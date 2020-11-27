let _checkoutFormId = 'aa-checkout-div';

function getCheckoutElem() {
    return document.querySelector(`#${_checkoutFormId}`);
}

function getCheckoutConfig(_checkoutElem) {
    let _config = [];
    _config.checkoutFormType = _checkoutElem.dataset.checkoutFormType??'digital';
    _config.successfulCheckoutUrl = _checkoutElem.dataset.successfulCheckoutUrl??'astrologyanswers.com';
    _config.checkoutButtonText = _checkoutElem.dataset.checkoutButtonText??'Buy Now!';
    return _config;
}

function getCheckoutFormBody(_config) {
    return "<form id='aa-checkout-form' method='POST'>" +
    "<h2><span style='font-family: lato; font-size: 24px; color: rgb(0, 0, 0); text-decoration: underline;'>Contact Details</span></h2>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='firstName' class='checkout-label'>First Name :</label>" +
    "</div><div class='checkout-col'><input type='text' id='firstname' checkout-prefill='user/firstname' required></div></div>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='lastName' class='checkout-label'>Last Name :</label>" +
    "</div><div class='checkout-col'><input type='text' id='lastname' checkout-prefill='user/lastname' required></div></div>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='emailId' class='checkout-label'>Email Address :</label>" +
    "</div><div class='checkout-col'><input type='email' id='email' checkout-prefill='user/email' readonly required></div></div>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='phone' class='checkout-label'>Contact Number :</label>" +
    "</div><div class='checkout-col'><input type='text' id='phone' checkout-prefill='user/phone'></div></div>" +
    "<br><br><h2><span style='font-family: lato; font-size: 24px; color: rgb(0, 0, 0); text-decoration: underline;'>Current Billing Address</span></h2>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='adr' class='checkout-label'>Address :</label>" +
    "</div><div class='checkout-col'><input type='text' id='adr' checkout-prefill='user/address' required></div></div>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='city' class='checkout-label'>City :</label>" +
    "</div><div class='checkout-col'><input type='text' id='city' checkout-prefill='user/city'></div></div>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='postal-code'' class='checkout-label'>Zip/Postal Code :</label>" +
    "</div><div class='checkout-col'><input type='text' id='postal-code' checkout-prefill='user/postal-code' required></div></div>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='country' class='checkout-label'>Country :</label>" +
    "</div><div class='checkout-col'><input id='country' checkout-prefill='user/country' list='countriesList'>" +
    "<datalist id='countriesList'>" +
    "</datalist></div></div>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='state' class='checkout-label'>State/Province :</label>" +
    "</div><div class='checkout-col'><input id='state' list='statesList'>" +
    "<datalist id='statesList'>" +
    "</datalist></div></div>" +
    "<br><br><h2><span style='font-family: lato; font-size: 24px; color: rgb(0, 0, 0); text-decoration: underline;'>Credit Card Information</span></h2>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='cc_type' class='checkout-label'>Credit card Type :</label>" +
    "</div><div class='checkout-col'><select id='cc_type'><option value=0>Select One</option><option value='mastercard'>MasterCard</option><option value='visa'>VISA</option></select></div></div>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='cc_number' class='checkout-label'>Credit card Number :</label>" +
    "</div><div class='checkout-col'><input type='text' id='cc_number' required></div></div>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='cc_number' class='checkout-label'>CVV :</label>" +
    "</div><div class='checkout-col'><input type='text' id='cc_cvv' required minlength='3' maxlength='4'></div></div>" +
    "<div class='checkout-row'><div class='checkout-col'><label for='cc_month' class='checkout-label'>Expiry Month: </label>" +
    "</div><div class='checkout-col'><select id='cc_month' required list='ccMonthList'>" +
    "<datalist id='ccMonthList'>" +
    "</datalist></div></div>" +
    "<button class='lp-element lp-pom-button' type='submit'>" + _config.checkoutButtonText + "</button>" +
    "</form>";
}

function addCheckoutForm() {
    const _checkoutElem = getCheckoutElem();
    _checkoutElem.innerHTML = getCheckoutFormBody(getCheckoutConfig(_checkoutElem));
    const form = _checkoutElem.querySelector('#aa-checkout-form');
    setupForm(form);
    prefillForm(form);
    _checkoutElem.addEventListener("submit", function(event){
        event.preventDefault();
        console.log('Form Submit Avoided');
    });
}

function setupForm(form) {
    const ccMonthSelect = form.querySelector('#cc_month');
    [1,2,3,4,5,6,7,8,9,10,11,12].forEach(i => {
        const option = document.createElement('option');
        option.text = i;
        ccMonthSelect.appendChild(option);
    });
}

function prefillForm(form) {
    let _urlParams = new URLSearchParams(window.location.search);
    let _token = _urlParams.get('token');
    let _userHash = _urlParams.get('hash');
    // TODO pass in token
    fetch(`https://aaproxyapis.astrologyanswerstest.com/checkout/params?hash=${_userHash}`)
        .then(response => {
            if(response.status !== 200){
                console.log('Error with API. Status code : ' + response.status);
                return;
            }
            response.json().then(data => {
                const inputs = Array.from(form.getElementsByTagName('input'));
                inputs.forEach(input => {
                    /**
                     * Because the `data` is nested, we use `checkout-prefill` value as a \-separated key to navigated `data`
                     * e.g. key 'user/firstname' -> {user: {firstname: Han}} -> Han
                     */
                    const dataFieldKey = input.getAttribute('checkout-prefill');
                    if (!dataFieldKey) return;
                    const keySegments = dataFieldKey.split('/');
                    let value = data;
                    while (keySegments.length > 0) {
                        const segment = keySegments.shift();
                        value = value[segment];
                    }
                    if (!value || typeof(value) == 'object') return;
                    input.value = value;
                });
            });
        });
}

window.addEventListener('DOMContentLoaded', (e) => {
    if(!getCheckoutElem()) return ;
    addCheckoutForm();
});