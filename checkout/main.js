const app = Vue.createApp({
    template: `<checkout-form :productVariant="productVariant" :user="user" :physicalCheckout="physicalCheckout" :submitButtonText="submitButtonText"></checkout-form>
    <p>EXTRA INFORMATION ON CHECKOUT PAGE LIKE BADGES ETC.</p>`,
    data() {
        return {
            productVariantId: 0,
            physicalCheckout: false,
            hash: null,
            token: null,
            // user: {},
            utm_params: null,
            submitButtonText: 'Buy Me',
            paymentSuccessRedirect: ''
        }
    },
    computed: {
        user() {
            return {
                firstname: 'Gaurav',
                lastname: 'Bains',
                email: 'gaurav@mindable.com',
                hash: '',
                phone: '5878894694'
            };
        },
        productVariant() {
            return {
                'id': 608,
                'name': 'Experts 97 Credits $97',
                'price': 97
            };
        },
        productVariant2() {
            if(this.productVariantId === 0) {
                return {
                    'id': 0,
                    'name': '',
                    'price': 0
                };
            }else{
                fetch(`https://aaproxyapis.astrologyanswerstest.com/checkout/params?hash=${this.hash}&token=${this.token}&offer_id=${this.productVariantId}`)
                    .then(response => {
                        if (response.status !== 200) {
                            // console.log('Error with API. Status code : ' + response.status);
                            return  {
                                'id': 0,
                                'name': '',
                                'price': 0
                            };
                        } else {
                            response.json().then(data => {
                                console.log(data['offerData'])
                                let offer_data = {
                                    'id': data['offerData']['offer_id'] ?? 0,
                                    'name': data['offerData']['offer_name'] ?? 'Unable to load from XHR',
                                    'price': data['offerData']['offer_price'] ?? 0
                                }
                                console.log(offer_data);
                                return offer_data;
                            })
                        }
                    });
            }
        }
    },
    methods: {},
});