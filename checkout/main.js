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
                zip: formData.billing.zip,
                country: formData.billing.country,
                state: formData.billing.state,

                shipping_adr: formData.shipping.streetAddress,
                shipping_city: formData.shipping.city,
                shipping_zip: formData.shipping.zip,
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
