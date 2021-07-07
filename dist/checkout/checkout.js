const app = Vue.createApp({
    template: `<checkout-form :productVariant="productVariant" :user="user" :countriesList="countriesList" :physicalCheckout="physicalCheckout" :submitButtonText="submitButtonText" :userIdentified="userIdentified" :validationErrors="checkoutErrors" @checkout-form-submit="processCheckout"></checkout-form>`,
    data() {
        return {
            checkoutFormType: 'digital',
            userHash: null,
            token: null,
            user: {
                firstname: '',
                lastname: '',
                email: '',
                hash: '',
                phone: ''
            },
            productVariantId: 0,
            productVariant: {
                'id': 0,
                'name': '',
                'price': 0,
            },
            shippingTag: 0,
            utmParams: null,
            submitButtonText: 'Buy Me',
            paymentSuccessRedirect: '',
            deviceId: '1',
            tag: '',
            tag2: '',
            orderPageUrl: '',
            checkoutErrors: [],
            countriesList: null,
            checkoutProcessing: false,
            userIdentified: false,
        }
    },
    computed: {
        physicalCheckout() {
            return this.checkoutFormType === 'physical'
        }
    },
    methods: {
        changeProductVariantId(id) {
            this.productVariantId = id;
            this.updateCheckoutForm(false,true);
        },
        changeHashToken(hash,token) {
            this.userHash = hash;
            this.token = token;
            this.updateCheckoutForm(true,false);
        },
        moveOrderBumpElement(elementId) {
            if(document.getElementById(elementId)){
                document.getElementById('checkoutProductSelectionDiv').appendChild(
                    document.getElementById(elementId)
                );
            }else{
                console.error(`Unable to find element #${elementId}`);
            }
        },
        updateCheckoutForm(updateUser=true,updateProductVariant=true) {
            fetch(`https://aaproxyapis.astrologyanswers.com/checkout/params?hash=${this.userHash}&token=${this.token}&offer_id=${this.productVariantId}`)
                .then(response => {
                    if (response.status !== 200) {
                        this.productVariant =  {
                            id: 0,
                            name: '',
                            price: 0
                        };
                        this.user = {
                            firstname: '',
                            lastname: '',
                            email: '',
                            hash: '',
                            phone: ''
                        }
                    } else {
                        response.json().then(data => {
                            if(updateProductVariant) {
                                if(data['offerData'] === null) {
                                    this.productVariant = {
                                        id: 0,
                                        name: '',
                                        price: 0
                                    }
                                }else{
                                    this.productVariant = {
                                        id: data['offerData']['offer_id'],
                                        name: data['offerData']['offer_name'],
                                        price: data['offerData']['offer_price']
                                    }
                                }
                            }

                            if(updateUser) {
                                if(data['user'] === null) {
                                    this.user = {
                                        firstname: '',
                                        lastname: '',
                                        email: '',
                                        hash: '',
                                        phone: ''
                                    }
                                }else{
                                    this.user = {
                                        firstname: data['user']['firstname'],
                                        lastname: data['user']['lastname'],
                                        email: data['user']['email'],
                                        hash: data['user']['hash'],
                                        phone: ''
                                    }
                                    this.userIdentified = true;
                                }
                            }

                            this.countriesList = data["address"]["countries"];
                        })
                    }
                });
        },
        processCheckout(formData) {
            if(this.checkoutProcessing) {
                console.log('Cannot submit since Checkout is already under Processing');
                return;
            }
            this.checkoutProcessing = true;
            let _checkoutPayload = {
                checkoutFormType: this.physicalCheckout ? 'physical' : 'digital',

                firstname: this.user.firstname,
                lastname: this.user.lastname,
                email: this.user.email,
                phone: this.user.phone,
                hash: this.userHash,
                token: this.token,

                adr: formData.billing.streetAddress,
                city: formData.billing.city,
                zip: formData.billing.city,
                country: formData.billing.country,
                state: formData.billing.state,

                shipping_adr: formData.shipping.streetAddress,
                shipping_city: formData.shipping.city,
                shipping_zip: formData.shipping.city,
                shipping_country: formData.shipping.country,
                shipping_state: formData.shipping.state,
                shipping_tag: this.shippingTag,

                offer_id: this.productVariant.id,
                cc_type: formData.payment.cardType,
                cc_number: formData.payment.cardNumber,
                cc_month: formData.payment.expMonth,
                cc_year: formData.payment.expYear,
                cc_cvv: formData.payment.cardCvv,

                utm_source: this.utmParams.utm_source,
                utm_campaign: this.utmParams.utm_campaign,
                utm_content: this.utmParams.utm_content,
                utm_term: this.utmParams.utm_term,

                device_id: this.deviceId,

                tag: this.tag,
                tag2: this.tag2,

                order_page_url: this.orderPageUrl,
            }
            this.checkoutErrors.push('Processing Payment');

            fetch("https://aaproxyapis.astrologyanswers.com/checkout",
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'text/plain'
                    },
                    body: JSON.stringify(_checkoutPayload)
                })
                .then(resp => {
                    this.checkoutProcessing = false;
                    this.checkoutErrors.splice(0,this.checkoutErrors.length);
                    if (resp.status !== 200) {
                        console.log(`Error on checkout API: ${resp.status}`);
                        this.checkoutErrors.push('Error in processing Payment. Try again, if you are unsuccessful 3 times, Please contact Customer Service');
                        return;
                    }
                    resp.json().then(data => {
                        if (data['status'] !== 'success') {
                            this.checkoutErrors.push(`unsuccessful: ${data['message']}`);
                            return;
                        }
                        let _token = data['token'];
                        let _hash = data['hash'];
                        window.location.href = `${this.paymentSuccessRedirect}&token=${_token}&hash=${_hash}`;
                    });
                });
        }
    },
});

const _urlParams = new URLSearchParams(window.location.search);

function getCheckoutConfig(_checkoutElementId='checkout-div-not-defined') {
    let config = {};

    let _checkoutElement = document.querySelector(`#${_checkoutElementId}`);

    if(_checkoutElement) {
        config.productVariantId = _checkoutElement.dataset.productVariantId ?? 0;
        config.shippingTag = _checkoutElement.dataset.shippingTag ?? 0;
        config.submitButtonText = _checkoutElement.dataset.checkoutButtonText ?? 'Buy Me';
        config.checkoutFormType = _checkoutElement.dataset.checkoutFormType ?? 'digital';
        config.paymentSuccessRedirect = _checkoutElement.dataset.successfulCheckoutUrl ?? 'https://astrologyanswers.com';
    }else{
        config.productVariantId = 0;
        config.shippingTag = 0;
        config.submitButtonText = 'Buy Me';
        config.checkoutFormType = 'digital';
        config.paymentSuccessRedirect = 'https://astrologyanswers.com';
    }

    config.token = _urlParams.get('token') ?? '';
    config.userHash = _urlParams.get('hash') ?? '';

    config.utmParams = {
        utm_source: _urlParams.get('utm_source') ?? '',
        utm_campaign: _urlParams.get('utm_campaign') ?? '',
        utm_content: _urlParams.get('utm_content') ?? '',
        utm_term: _urlParams.get('utm_term') ?? '',
        utm_medium: _urlParams.get('utm_medium') ?? '',
    } ;

    config.deviceId = _urlParams.get('device_id') ?? 1;

    config.tag = _urlParams.get('tag') ?? '';
    config.tag2 = _urlParams.get('tag2') ?? '';

    config.orderPageUrl = `${window.location.protocol}//${window.location.host}/${window.location.pathname}`;

    return config;
}

let checkoutApp;
function renderCheckoutForm(_checkoutElementId,_checkoutConfig=null) {
    if(!_checkoutConfig) {
        _checkoutConfig = getCheckoutConfig(_checkoutElementId);
    }

    checkoutApp = app.mount(`#${_checkoutElementId}`);

    checkoutApp.productVariantId = _checkoutConfig.productVariantId;
    checkoutApp.shippingTag = _checkoutConfig.shippingTag;
    checkoutApp.submitButtonText = _checkoutConfig.submitButtonText;
    checkoutApp.checkoutFormType = _checkoutConfig.checkoutFormType;
    checkoutApp.paymentSuccessRedirect = _checkoutConfig.paymentSuccessRedirect;
    checkoutApp.userHash = _checkoutConfig.userHash;
    checkoutApp.token = _checkoutConfig.token;
    checkoutApp.utmParams = _checkoutConfig.utmParams;
    checkoutApp.deviceId = _checkoutConfig.deviceId;
    checkoutApp.tag = _checkoutConfig.tag;
    checkoutApp.tag2 = _checkoutConfig.tag2;
    checkoutApp.orderPageUrl = _checkoutConfig.orderPageUrl;

    checkoutApp.updateCheckoutForm();
}
app.component('user-contact',{
  props: {
    user: {
      type: Object,
      required: true,
    },
    userIdentified : {
      type: Boolean,
      default: false,
    }
  },
  template: `
    <div>
      <label>First Name: *</label>
      <input type="text" v-model.trim="user.firstname">
    </div>
    <div>
      <label>Last Name: *</label>
      <input type="text" v-model.trim="user.lastname">
    </div>
    <div>
      <label>Email: *</label>
      <input type="email" :disabled="userIdentified" v-model.trim="user.email">
    </div>
    <div>
      <label>Phone Number:</label>
      <input type="text" v-model.trim="user.phone">
    </div>`
});
app.component('user-payment', {
  props: {
    paymentDetails: Object
  },
  template: `
  <div>
    <label>Card Type: *</label>
    <select v-model.trim="paymentDetails.cardType">
      <option value="" selected>Select a Card Type</option>
      <option v-for="(item,key) in cardTypes" :value="key">
        {{item}}
      </option>
    </select>
  </div>
  <div>
    <label>Card Number: *</label>
    <input type="text" maxlength="16" v-model.trim="paymentDetails.cardNumber">
  </div>
  <div class="split split-first">
    <label>Expiration Month: *</label>
    <select v-model.trim="paymentDetails.expMonth">
      <option value="" selected>Select a Month</option>
      <option v-for="expMonth in expMonths" :value="expMonth">
        {{expMonth}}
      </option>
    </select>
  </div>
  <div class="split">
    <label>Expiration Year: *</label>
    <select v-model.trim="paymentDetails.expYear">
      <option value="" selected>Select a Year</option>
      <option v-for="year in expYears" :value="year">
        {{year}}
      </option>
    </select>
  </div>
  <div>
    <label>CVV Code: *</label>
    <input type="text" maxlength="4" v-model.trim="paymentDetails.cardCvv">
    <small><a target="_blank" href="https://legacy.astrologyanswers.com/info/cvv.html">What's This?</a></small>
  </div>
  `,
  data() {
    return {
      cardTypes: {master: 'MasterCard', visa: 'VISA'}
    }
  },
  computed: {
    expMonths() {
      let start = 1, end = 12;
      if( parseInt(this.paymentDetails.expYear) ===  new Date().getFullYear()) {
        start = new Date().getMonth() + 1;
        end = 12 - start + 1;
      }
      if(this.paymentDetails.expMonth < start) {
        this.paymentDetails.expMonth = "";
      }
      return Array.from({length:end},(v,k)=>k+start)
    },
    expYears() {
      return Array.from({length:10},(v,k)=>k+ new Date().getFullYear())
    }
  }
});
app.component('product-pricing', {
  props: {
    productVariant: {
      type: Object,
      default: {
        id: 0,
        name: 'Default Product',
        price: 1
      }
    },
    billingAddress: Object
  },
  template: `<h3>Product Information</h3>
  <div>
  <p><strong>{{ productVariant.name }}</strong></p>
  <p v-if="taxPrc > 0"><strong>Price : $ {{productVariant.price}}</strong></p>
  <p v-if="taxPrc > 0">Tax ({{taxPrc}}%) : $ {{tax}}</p>
  <p><strong>Total : $ {{amount}}</strong></p>
  </div>`,
  data() {
    return {
      canadianTaxMap: {
        'AB': 5,
        'BC': 12,
        'MB': 12,
        'NB': 15,
        'NL': 15,
        'NT': 5,
        'NS': 15,
        'NU': 5,
        'ON': 13,
        'PE': 15,
        'QC': 14.975,
        'SK': 11,
        'YT': 5
      }
    }
  },
  computed: {
    amount() {
      return (parseFloat(this.productVariant.price) + parseFloat(this.tax)).toFixed(2);
    },
    taxPrc() {
      if(this.billingAddress.country === 'CA') {
        return (this.canadianTaxMap[this.billingAddress.state] ?? 0).toFixed(2);
      }else{
        return 0;
      }
    },
    tax() {
      return (this.productVariant.price * this.taxPrc /100 ).toFixed(2);
    }
  }
});
app.component('checkout-form',{
    emits: ['checkoutFormSubmit'],
    props: {
        productVariant: Object,
        user: Object,
        physicalCheckout: Boolean,
        submitButtonText: String,
        validationErrors: Array,
        countriesList: Object,
        userIdentified: Boolean,
    },
    template: `
      <h3>Contact Information</h3>
      <user-contact :user="user" :userIdentified="userIdentified"></user-contact>
      <h3>Current Billing Address</h3>
      <user-address addressType="Billing" :address="billingAddress" :countriesList="countriesList"></user-address>
      <div v-if="physicalCheckout" class="physicalCheckoutDiv">
        <h3>Shipping Address:</h3>
        <input type="checkbox" v-model="shippingToggle"><strong>&nbsp;Check this box if your shipping address is different from your billing address</strong>
        <user-address addressType="Shipping" :address="shippingAddress" :inputToggle="shippingToggle" :countriesList="countriesList"></user-address>
      </div>
      <h3>Credit Card Information</h3>
      <user-payment :paymentDetails="paymentDetails"></user-payment>
      <div id="checkoutProductSelectionDiv"></div>
      <p class="checkoutErrors" v-if="validationErrors.length>0">
        <span v-for="validationError in validationErrors">
          {{validationError}}<br>
        </span>
      </p>
      <div class="summary">
        <product-pricing :productVariant="productVariant" :billingAddress="billingAddress"></product-pricing>
        <p class="terms">By submitting your request, you agree to the <a target="_blank" href="https://astrologyanswers.com/info/terms-of-service/">Terms of Service.</a></p>
        <button @click="processCheckout">{{submitButtonText}}</button>
        <p class="privacy">
          <img src="https://mindable.github.io/unbounce-scripts/assets/lock_icon.jpg" alt="Italian Trulli">&nbsp;<b>Privacy &amp; Security</b> - All your information is safe and secure.
          The entire transaction will take place on a
          secure server using SSL technology.
        </p>
        <div>
          <img src="https://mindable.github.io/unbounce-scripts/assets/mcafee_badge.png" alt="McAfee">&nbsp; <img src="https://mindable.github.io/unbounce-scripts/assets/truste_badge.png" alt="TRUSTe">
        </div>
        <p class="questions">
          <strong>Questions?</strong> Call Toll Free: 1-866-329-7640
        </p>
      </div>`,
    data() {
        return {
            billingAddress: {
                streetAddress: '',
                city: '',
                zip: '',
                country: '',
                state: ''
            },
            shippingToggle: false,
            shippingAddress: {
                streetAddress: '',
                city: '',
                zip: '',
                country: '',
                state: ''
            },
            paymentDetails: {
                cardType: '',
                cardNumber: '',
                expMonth: '',
                expYear: '',
                cardCvv: ''
            },
        }
    },
    methods: {
        processCheckout() {
            this.validationErrors.splice(0,this.validationErrors.length);
            if(this.validateUserInformation() && this.validateBillingInformation() && this.validateShippingInformation() && this.validatePaymentInformation()) {
                if(!this.shippingToggle) {
                    this.shippingAddress = this.billingAddress;
                }
                let _formData = {
                    billing: this.billingAddress,
                    shipping: this.shippingAddress,
                    payment: this.paymentDetails
                }
                this.$emit('checkoutFormSubmit',_formData);
            }else{
                console.log('There is validation Error');
            }
        },
        validateUserInformation() {
            if(this.user.firstname === '') {
                this.validationErrors.push('Please enter First Name');
            }
            if(this.user.lastname === '') {
                this.validationErrors.push('Please enter Last Name');
            }
            if(this.user.email === '') {
                this.validationErrors.push('Error with retrieving Email, please contact Customer Service');
            }
            return this.validationErrors.length === 0;
        },
        validateBillingInformation() {
            if(this.billingAddress.streetAddress === '') {
                this.validationErrors.push('Please enter Billing Address');
            }
            if(this.billingAddress.city === '') {
                this.validationErrors.push('Please enter Billing City');
            }
            if(this.billingAddress.zip === '') {
                this.validationErrors.push('Please enter Billing Zip/Postal Code');
            }
            if(this.billingAddress.country === '') {
                this.validationErrors.push('Please choose Billing Country');
            }
            if(this.billingAddress.state === '') {
                this.validationErrors.push('Please choose Billing State/Province');
            }
            return this.validationErrors.length === 0;
        },
        validateShippingInformation() {
            if(this.physicalCheckout && this.shippingToggle) {
                if(this.shippingAddress.streetAddress === '') {
                    this.validationErrors.push('Please enter Shipping Address');
                }
                if(this.shippingAddress.city === '') {
                    this.validationErrors.push('Please enter Shipping City');
                }
                if(this.shippingAddress.zip === '') {
                    this.validationErrors.push('Please enter Shipping Zip/Postal Code');
                }
                if(this.shippingAddress.country === '') {
                    this.validationErrors.push('Please choose Shipping Country');
                }
                if(this.shippingAddress.state === '') {
                    this.validationErrors.push('Please choose Shipping State/Province');
                }
            }
            return this.validationErrors.length === 0;
        },
        validatePaymentInformation() {
            if(this.paymentDetails.cardType === '') {
                this.validationErrors.push('Please choose Credit Card Type');
            }
            if(this.paymentDetails.cardNumber === '') {
                this.validationErrors.push('Please enter Credit Card Number');
            }
            if(this.paymentDetails.expMonth === '') {
                this.validationErrors.push('Please choose Credit Card Expiration Month');
            }
            if(this.paymentDetails.expYear === '') {
                this.validationErrors.push('Please choose Credit Card Expiration Year');
            }
            if(this.paymentDetails.cardCvv === '') {
                this.validationErrors.push('Please enter Credit Card CVV Code');
            }
            return this.validationErrors.length === 0;
        },
    }
});
app.component('user-address',{
  props: {
    addressType: String,
    address: Object,
    countriesList: Object,
    inputToggle: {
      type: Boolean,
      default: true
    }
  },
  template: `<fieldset :disabled="!inputToggle">
  <div>
    <label>Street Address: *</label>
    <input type="text" v-model.trim="address.streetAddress" >
  </div>
  <div>
    <label>City: *</label>
    <input type="text" v-model.trim="address.city">
  </div>
  <div>
    <label>Zip/Postal Code: *</label>
    <input type="text" v-model.trim="address.zip">
  </div>
  <div>
    <label>Country: *</label>
    <select v-model.trim="address.country" @change="fetchState">
      <option value="" selected>Select a Country</option>
      <option v-for="(item,key) in countriesList" :value="key">
        {{item}}
      </option>
    </select>
  </div>
  <div v-if="states">
    <label>State/Province: *</label>
    <select v-model.trim="address.state">
      <option value="" disabled selected>Select a State/Province</option>
      <option v-for="(item,key) in states" :value="key">
        {{item}}
      </option>
    </select>
  </div>
</fieldset>`,
  data() {
    return {
      states: null
    };
  },
  methods: {
    fetchState(){
      fetch(`https://aaproxyapis.astrologyanswers.com/countries/${this.address.country}/states`).then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            this.states = data;
          });
        }
        else {
          console.log('Error with API. Status code : ' + response.status);
          this.states = null;
        }
      });
    }
  }
});
window.addEventListener('DOMContentLoaded', (event) => {
    let _checkoutElementId = 'aa-checkout-div';
    if (document.querySelector(`#${_checkoutElementId}`)) {
        renderCheckoutForm(_checkoutElementId);
    }
});