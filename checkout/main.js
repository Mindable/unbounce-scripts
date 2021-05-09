const app = Vue.createApp({
    template: `<checkout-form :productVariant="productVariant" :user="user" :physicalCheckout="physicalCheckout" :submitButtonText="submitButtonText" @checkout-form-submit="processCheckout"></checkout-form>
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
                'price': 0
            },
            utm_params: null,
            submitButtonText: 'Buy Me',
            paymentSuccessRedirect: '',
            device_id: '1',
            tag: '',
            tag2: '',
            order_page_url: ''
        }
    },
    computed: {
        physicalCheckout() {
            return this.checkoutFormType === 'physical'
        }
    },
    methods: {
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
            console.log('Process Checkout');
            console.log(formData);
            console.log('If successful, redirect to ' + this.paymentSuccessRedirect);
        }
    },
});