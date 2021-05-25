const app = Vue.createApp({
    template: `<checkout-form :productVariant="productVariant" :user="user" :physicalCheckout="physicalCheckout" :submitButtonText="submitButtonText" :validationErrors="checkoutErrors" @checkout-form-submit="processCheckout"></checkout-form>
    <p>
      <img src="https://mindable.github.io/unbounce-scripts/assets/lock_icon.jpg" alt="Italian Trulli">&nbsp;<b>Privacy & Security</b> - All your information is safe and secure.<br>The entire transaction will take place on a<br>secure server using SSL technology.
    </p>
    <div>
      <img src="https://mindable.github.io/unbounce-scripts/assets/mcafee_badge.png" alt="McAfee">&nbsp;
      <img src="https://mindable.github.io/unbounce-scripts/assets/truste_badge.png" alt="TRUSTe">
    </div>
    <p><b>Questions?</b> Call Toll Free: 1-866-329-7640</p>`,
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
            checkoutErrors: []
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
                            console.log(data);
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
                                }
                            }

                        })
                    }
                });
        },
        processCheckout(formData) {
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
            console.log(JSON.stringify(_checkoutPayload));

            let data = new FormData();
            data.append( "json", JSON.stringify( _checkoutPayload ) );

            fetch("https://aaproxyapis.astrologyanswers.com/checkout",
                {
                    method: "POST",
                    body: data
                })
                .then(resp => {
                    if (resp.status !== 200) {
                        console.log(`Error on checkout API: ${resp.status}`);
                        return;
                    }
                    resp.json().then(data => {
                        if (data['status'] !== 'success') {
                            this.checkoutErrors.push(`unsuccessful: ${data['message']}`);
                            return;
                        }
                        window.location.href = `${this.paymentSuccessRedirect}&token=${data['token']}`;
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
    }
  },
  template: `
    <div>
      <label>First Name: *</label><br>
      <input type="text" v-model.trim="user.firstname">
    </div>
    <div>
      <label>Last Name: *</label><br>
      <input type="text" v-model.trim="user.lastname">
    </div>
    <div>
      <label>Email ID: *</label><br>
      <input type="email" disabled v-model.trim="user.email">
    </div>
    <div>
      <label>Phone Number:</label><br>
      <input type="text" v-model.trim="user.phone">
    </div>`
});
app.component('user-payment', {
  props: {
    paymentDetails: Object
  },
  template: `
  <div>
    <label>Card Type: *</label><br>
    <select v-model.trim="paymentDetails.cardType">
      <option value="" selected>Select a Card Type</option>
      <option v-for="(item,key) in cardTypes" :value="key">
        {{item}}
      </option>
    </select>
  </div>
  <div>
    <label>Card Number: *</label><br>
    <input type="text" maxlength="16" v-model.trim="paymentDetails.cardNumber">
  </div>
  <div>
    <label>Expiration Month: *</label><br>
    <select v-model.trim="paymentDetails.expMonth">
      <option value="" selected>Select a Month</option>
      <option v-for="(item,key) in expMonths" :value="key">
        {{item}}
      </option>
    </select>
  </div>
  <div>
    <label>Expiration Year: *</label><br>
    <select v-model.trim="paymentDetails.expYear">
      <option value="" selected>Select a Year</option>
      <option v-for="year in expYears" :value="year">
        {{year}}
      </option>
    </select>
  </div>
  <div>
    <label>CVV Code: *</label><br>
    <input type="text" maxlength="4" v-model.trim="paymentDetails.cardCvv"><br>
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
  <p>Product : {{ productVariant.name }}</p>
  <p v-if="taxPrc > 0">Price : $ {{productVariant.price}}</p>
  <p v-if="taxPrc > 0">Tax ({{taxPrc}}%) : $ {{tax}}</p>
  <p>Total : $ {{amount}}</p>
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
        validationErrors: Array
    },
    template: `
      <h3>Contact Information</h3>
      <user-contact :user="user"></user-contact>
      <h3>Current Billing Address</h3>
      <user-address addressType="Billing" :address="billingAddress"></user-address>
      <div v-if="physicalCheckout" class="physicalCheckoutDiv">
        <h3>Shipping Address:</h3>
        <input type="checkbox" v-model="shippingToggle">Check this box if your shipping address is different from your billing address
        <user-address v-if="shippingToggle" addressType="Shipping" :address="shippingAddress"></user-address>
      </div>
      <h3>Credit Card Information</h3>
      <user-payment :paymentDetails="paymentDetails"></user-payment>
      <p class="checkoutErrors" v-if="validationErrors">
        <span v-for="validationError in validationErrors">
          {{validationError}}<br>
        </span>
      </p>
      <product-pricing :productVariant="productVariant" :billingAddress="billingAddress"></product-pricing>
      <p>By submitting your request, you agree to the <a href="https://astrologyanswers.com/info/terms-of-service/">Terms of Service.</a></p>
      <button @click="processCheckout">{{submitButtonText}}</button>`,
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
            let _validate = true;
            if(this.user.firstname === '') {
                this.validationErrors.push('Please enter First Name');
                _validate = false;
            }
            if(this.user.lastname === '') {
                this.validationErrors.push('Please enter Last Name');
                _validate = false;
            }
            if(this.user.email === '') {
                this.validationErrors.push('Error with retrieving Email ID, please contact Customer Service');
                _validate = false;
            }
            return _validate;
        },
        validateBillingInformation() {
            let _validate = true;
            if(this.billingAddress.streetAddress === '') {
                this.validationErrors.push('Please enter Billing Address');
                _validate = false;
            }
            if(this.billingAddress.city === '') {
                this.validationErrors.push('Please enter Billing City');
                _validate = false;
            }
            if(this.billingAddress.city === '') {
                this.validationErrors.push('Please enter Billing Zip/Postal Code');
                _validate = false;
            }
            if(this.billingAddress.country === '') {
                this.validationErrors.push('Please choose Billing Country');
                _validate = false;
            }
            if(this.billingAddress.state === '') {
                this.validationErrors.push('Please choose Billing State/Province');
                _validate = false;
            }
            return _validate;
        },
        validateShippingInformation() {
            let _validate = true;
            if(this.physicalCheckout && this.shippingToggle) {
                if(this.shippingAddress.streetAddress === '') {
                    this.validationErrors.push('Please enter Shipping Address');
                    _validate = false;
                }
                if(this.shippingAddress.city === '') {
                    this.validationErrors.push('Please enter Shipping City');
                    _validate = false;
                }
                if(this.shippingAddress.city === '') {
                    this.validationErrors.push('Please enter Shipping Zip/Postal Code');
                    _validate = false;
                }
                if(this.shippingAddress.country === '') {
                    this.validationErrors.push('Please choose Shipping Country');
                    _validate = false;
                }
                if(this.shippingAddress.state === '') {
                    this.validationErrors.push('Please choose Shipping State/Province');
                    _validate = false;
                }
            }
            return _validate;
        },
        validatePaymentInformation() {
            let _validate = true;
            if(this.paymentDetails.cardType === '') {
                this.validationErrors.push('Please choose Credit Card Type');
                _validate = false;
            }
            if(this.paymentDetails.cardNumber === '') {
                this.validationErrors.push('Please enter Credit Card Number');
                _validate = false;
            }
            if(this.paymentDetails.expMonth === '') {
                this.validationErrors.push('Please choose Credit Card Expiration Month');
                _validate = false;
            }
            if(this.paymentDetails.expYear === '') {
                this.validationErrors.push('Please choose Credit Card Expiration Year');
                _validate = false;
            }
            if(this.paymentDetails.cardCvv === '') {
                this.validationErrors.push('Please enter Credit Card CVV Code');
                _validate = false;
            }
            return _validate;
        },
    }
});
app.component('user-address',{
  props: {
    addressType: String,
    address: Object
  },
  template: `<div>
    <label>Street Address: *</label><br>
    <input type="text" v-model.trim="address.streetAddress">
  </div>
  <div>
    <label>City: *</label><br>
    <input type="text" v-model.trim="address.city">
  </div>
  <div>
    <label>Zip/Postal Code: *</label><br>
    <input type="text" v-model.trim="address.zip">
  </div>
  <div>
    <label>Country: *</label><br>
    <select v-model.trim="address.country" @change="fetchState">
      <option value="" selected>Select your option</option>
      <option v-for="(item,key) in countries" :value="key">
        {{item}}
      </option>
    </select>
  </div>
  <div v-if="states">
    <label>State/Province: *</label><br>
    <select v-model.trim="address.state">
      <option value="" disabled selected>Select your Country</option>
      <option v-for="(item,key) in states" :value="key">
        {{item}}
      </option>
    </select>
  </div>`,
  data() {
    return {
      states: null,
      countries: {"US":"United States","CA":"Canada","AU":"Australia","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua and Barbuda","AR":"Argentina","AW":"Aruba","AT":"Austria","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnia and Herzegovina","BW":"Botswana","BV":"Bouvet Island","BR":"Brazil","BQ":"British Antarctic Territory","IO":"British Indian Ocean Territory","VG":"British Virgin Islands","BN":"Brunei","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodia","CM":"Cameroon","CT":"Canton and Enderbury Islands","CV":"Cape Verde","KY":"Cayman Islands","CF":"Central African Republic","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos [Keeling] Islands","CO":"Colombia","KM":"Comoros","CK":"Cook Islands","CR":"Costa Rica","HR":"Croatia","CY":"Cyprus","DK":"Denmark","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","NQ":"Dronning Maud Land","DD":"East Germany","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","ET":"Ethiopia","FK":"Falkland Islands","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","TF":"French Southern Territories","FQ":"French Southern and Antarctic Territories","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard Island and McDonald Islands","HN":"Honduras","HK":"Hong Kong SAR China","HU":"Hungary","IS":"Iceland","IE":"Ireland","IM":"Isle of Man","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JE":"Jersey","JT":"Johnston Island","JO":"Jordan","KE":"Kenya","KI":"Kiribati","KG":"Kyrgyzstan","LA":"Laos","LV":"Latvia","LS":"Lesotho","LI":"Liechtenstein","LU":"Luxembourg","MO":"Macau SAR China","MG":"Madagascar","MW":"Malawi","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","FX":"Metropolitan France","MX":"Mexico","FM":"Micronesia","MI":"Midway Islands","MD":"Moldova","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","AN":"Netherlands Antilles","NT":"Neutral Zone","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk Island","VD":"North Vietnam","MP":"Northern Mariana Islands","NO":"Norway","OM":"Oman","PC":"Pacific Islands Trust Territory","PW":"Palau","PS":"Palestinian Territories","PA":"Panama","PZ":"Panama Canal Zone","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn Islands","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RW":"Rwanda","RE":"Reunion","BL":"Saint Barthelemy","SH":"Saint Helena","KN":"Saint Kitts and Nevis","LC":"Saint Lucia","MF":"Saint Martin","PM":"Saint Pierre and Miquelon","VC":"Saint Vincent and the Grenadines","WS":"Samoa","SM":"San Marino","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","CS":"Serbia and Montenegro","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","ZA":"South Africa","GS":"South Georgia and the South Sandwich Islands","KR":"South Korea","ES":"Spain","LK":"Sri Lanka","SR":"Suriname","SJ":"Svalbard and Jan Mayen","SZ":"Swaziland","SE":"Sweden","CH":"Switzerland","ST":"Sao Tome and Principe","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad and Tobago","TN":"Tunisia","TM":"Turkmenistan","TC":"Turks and Caicos Islands","TV":"Tuvalu","UM":"U.S. Minor Outlying Islands","PU":"U.S. Miscellaneous Pacific Islands","VI":"U.S. Virgin Islands","UG":"Uganda","SU":"Union of Soviet Socialist Republics","AE":"United Arab Emirates","GB":"United Kingdom","ZZ":"Unknown or Invalid Region","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VA":"Vatican City","VE":"Venezuela","WK":"Wake Island","WF":"Wallis and Futuna","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","AX":"Aland Islands"}
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