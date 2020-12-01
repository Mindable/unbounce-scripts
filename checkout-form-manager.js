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

function getCheckoutFormBody(_config) {
    return `<form id='aa-checkout-form' method='POST'>
    <h2><span style='font-family: lato; font-size: 24px; color: rgb(0, 0, 0); text-decoration: underline;'>Contact
        Details</span></h2>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='firstName' class='checkout-label'>First Name :</label>
      </div>
      <div class='checkout-col'><input type='text' id='firstname' name='firstname' checkout-prefill='firstname' required></div>
    </div>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='lastName' class='checkout-label'>Last Name :</label>
      </div>
      <div class='checkout-col'><input type='text' id='lastname' name='lastname' checkout-prefill='lastname' required></div>
    </div>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='email' class='checkout-label'>Email Address :</label>
      </div>
      <div class='checkout-col'><input type='email' id='email' name='email' checkout-prefill='email' readonly required></div>
    </div>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='phone' class='checkout-label'>Contact Number :</label>
      </div>
      <div class='checkout-col'><input type='text' id='phone' name='phone' checkout-prefill='phone'></div>
    </div>
    <br><br>
    <h2><span style='font-family: lato; font-size: 24px; color: rgb(0, 0, 0); text-decoration: underline;'>Current Billing
        Address</span></h2>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='adr' class='checkout-label'>Address :</label>
      </div>
      <div class='checkout-col'><input type='text' id='adr' name='adr' checkout-prefill='address' required></div>
    </div>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='city' class='checkout-label'>City :</label>
      </div>
      <div class='checkout-col'><input type='text' id='city' name='city' checkout-prefill='city'></div>
    </div>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='postal-code'' class=' checkout-label'>Zip/Postal Code :</label>
      </div>
      <div class='checkout-col'><input type='text' id='postal- name='postal'code' checkout-prefill='postal-code' required></div>
    </div>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='country' class='checkout-label'>Country :</label>
      </div>
      <div class='checkout-col'><select id='country' name='country' checkout-prefill='country'></select></div>
    </div>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='state' class='checkout-label'>State/Province :</label>
      </div>
      <div class='checkout-col'><select id='state' name='state'></select></div>
    </div>
    <br><br>
    <h2><span style='font-family: lato; font-size: 24px; color: rgb(0, 0, 0); text-decoration: underline;'>Credit Card
        Information</span></h2>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='cc_type' class='checkout-label'>Credit card Type :</label>
      </div>
      <div class='checkout-col'><select id='cc_type' name='cc_type'>
          <option value=0>Select One</option>
          <option value='mastercard'>MasterCard</option>
          <option value='visa'>VISA</option>
        </select></div>
    </div>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='cc_number' class='checkout-label'>Credit card Number :</label>
      </div>
      <div class='checkout-col'><input type='text' id='cc_number' name='cc_number' required></div>
    </div>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='cc_number' class='checkout-label'>CVV :</label>
      </div>
      <div class='checkout-col'><input type='text' id='cc_cvv' name='cc_cvv' required minlength='3' maxlength='4'></div>
    </div>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='cc_month' class='checkout-label'>Expiry Month: </label></div>
      <div class='checkout-col'><select id='cc_month' name='cc_month'></select></div>
    </div>
    <div class='checkout-row'>
      <div class='checkout-col'><label for='cc_year' class='checkout-label'>Expiry Year: </label></div>
      <div class='checkout-col'><select id='cc_year' name='cc_year'></select></div>
    </div>
    <div class='checkout-errror' id='checkout_error'></div>
    <button class='lp-element lp-pom-button' type='submit'> ${_config.checkoutButtonText} </button>
  </form>`;
}

function addCheckoutForm() {
    const _checkoutElem = getCheckoutElem();
    _checkoutElem.innerHTML = getCheckoutFormBody(getCheckoutConfig(_checkoutElem));
    const form = _checkoutElem.querySelector('#aa-checkout-form');
    setupForm(form);
    prefillForm(form);
    _checkoutElem.addEventListener("submit", function (event) {
        event.preventDefault();
        submitCheckout(event);
    });
}

function setupForm(form) {
    const ccMonthSelect = form.querySelector('#cc_month');
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(i => {
        const option = document.createElement('option');
        option.text = i;
        option.value = i;
        ccMonthSelect.appendChild(option);
    });

    const ccYearSelect = form.querySelector('#cc_year');
    const currentYear = new Date().getFullYear();
    Array(10).fill().map((_, i) => currentYear + i).forEach(year => {
        const option = document.createElement('option');
        option.text = year;
        option.value = year;
        ccYearSelect.appendChild(option);
    });

    const countrySelect = form.querySelector('#country');
    countrySelect.addEventListener('change', e => {
        const stateSelect = form.querySelector('#state');
        fetch(`https://aaproxyapis.astrologyanswerstest.com/countries/${countrySelect.value}/states`).then(response => {
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
    });
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
                // Set input ranges for address->country
                const countrySelect = form.querySelector('#country');
                var countryData = data['address']['countries'];
                for (let key in countryData) {
                    const option = document.createElement('option');
                    option.text = countryData[key];
                    option.value = key;
                    countrySelect.appendChild(option);
                }

                // Trigger the inital update of the states list
                countrySelect.dispatchEvent(new Event('change'));

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

function submitCheckout(event) {
    const config = getCheckoutConfig(getCheckoutElem());
    const form = getCheckoutElem().querySelector('#aa-checkout-form');

    const formData = new FormData(form);
    // TODO get product_id from url
    formData.append('product_id', 123);
    
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
            window.location.href = config.successfulCheckoutUrl;
        });
    });
}

window.addEventListener('DOMContentLoaded', (e) => {
    if (!getCheckoutElem()) return;
    addCheckoutForm();
});
