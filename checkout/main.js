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
                'shipping_tag' : ''
            },
            utm_params: null,
            submitButtonText: 'Buy Me',
            paymentSuccessRedirect: '',
            device_id: '1',
            tag: '',
            tag2: '',
            order_page_url: '',
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
            fetch(`https://aaproxyapis.astrologyanswerstest.com/checkout/params?hash=${this.hash}&token=${this.token}&offer_id=${this.productVariantId}`)
                .then(response => {
                    if (response.status !== 200) {
                        this.productVariant =  {
                            'id': 0,
                            'name': '',
                            'price': 0
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
                                        'id': 0,
                                        'name': '',
                                        'price': 0
                                    }
                                }else{
                                    this.productVariant = {
                                        'id': data['offerData']['offer_id'],
                                        'name': data['offerData']['offer_name'],
                                        'price': data['offerData']['offer_price']
                                    }
                                }
                            }

                            if(updateUser) {
                            }

                        })
                    }
                });
        },
        processCheckout(formData) {
            let _checkoutPayload = {
                firstname: this.user.firstname,
                lastname: this.user.lastname,
                email: this.user.email,
                hash: this.userHash,
                token: this.token,

                adr: formData.billing.streetAddress,
                city: formData.billing.city,
                zip: formData.billing.city,
                country: formData.billing.country,
                state: formData.billing.state,

                shipping_address: formData.shipping.streetAddress,
                shipping_city: formData.shipping.city,
                shipping_zip: formData.shipping.city,
                shipping_country: formData.shipping.country,
                shipping_state: formData.shipping.state,
                shipping_tag: this.productVariant.shipping_tag,

                offer_id: this.productVariant.id,
                cc_type: formData.payment.cardType,
                cc_number: formData.payment.cardNumber,
                cc_month: formData.payment.expMonth,
                cc_year: formData.payment.expYear,
                cc_cvv: formData.payment.cardCvv,

                utm_source: this.utm_source,
                utm_campaign: this.utm_campaign,
                utm_content: this.utm_content,
                utm_term: this.utm_term,

                device_id: this.device_id,

                tag: this.tag,
                tag2: this.tag2,

                order_page_url: this.order_page_url,
            }
            console.log(JSON.stringify(_checkoutPayload));

            let data = new FormData();
            data.append( "json", JSON.stringify( _checkoutPayload ) );

            fetch("https://aaproxyapis.astrologyanswerstest.com/checkout",
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
        config.submitButtonText = _checkoutElement.dataset.checkoutButtonText ?? 'Buy Me';
        config.checkoutFormType = _checkoutElement.dataset.checkoutFormType ?? 'digital';
        config.paymentSuccessRedirect = _checkoutElement.dataset.successfulCheckoutUrl ?? 'https://astrologyanswers.com';
    }else{
        config.productVariantId = 0;
        config.submitButtonText = 'Buy Me';
        config.checkoutFormType = 'digital';
        config.paymentSuccessRedirect = 'https://astrologyanswers.com';
    }

    config.token = _urlParams.get('token') ?? '';
    config.userHash = _urlParams.get('hash') ?? '';

    config.utm_params = {
        utm_source: _urlParams.get('utm_source') ?? '',
        utm_campaign: _urlParams.get('utm_campaign') ?? '',
        utm_content: _urlParams.get('utm_content') ?? '',
        utm_term: _urlParams.get('utm_term') ?? '',
        utm_medium: _urlParams.get('utm_medium') ?? '',
    } ;

    config.device_id = _urlParams.get('device_id') ?? 1;

    config.tag = _urlParams.get('tag') ?? '';
    config.tag2 = _urlParams.get('tag2') ?? '';

    config.order_page_url = `${window.location.protocol}//${window.location.host}/${window.location.pathname}`;

    return config;
}

let checkoutApp;
function renderCheckoutForm(_checkoutElementId,_checkoutConfig=null) {
    if(!_checkoutConfig) {
        _checkoutConfig = getCheckoutConfig(_checkoutElementId);
    }

    checkoutApp = app.mount(`#${_checkoutElementId}`);

    checkoutApp.productVariantId = _checkoutConfig.productVariantId;
    checkoutApp.submitButtonText = _checkoutConfig.submitButtonText;
    checkoutApp.checkoutFormType = _checkoutConfig.checkoutFormType;
    checkoutApp.paymentSuccessRedirect = _checkoutConfig.paymentSuccessRedirect;
    checkoutApp.userHash = _checkoutConfig.userHash;
    checkoutApp.token = _checkoutConfig.token;
    checkoutApp.utm_params = _checkoutConfig.utm_params;
    checkoutApp.device_id = _checkoutConfig.device_id;
    checkoutApp.tag = _checkoutConfig.tag;
    checkoutApp.tag2 = _checkoutConfig.tag2;
    checkoutApp.order_page_url = _checkoutConfig.order_page_url;

    checkoutApp.updateCheckoutForm();
}
