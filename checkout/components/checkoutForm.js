app.component('checkout-form',{
    props: {
        productVariant: Object,
        user: Object,
        physicalCheckout: Boolean,
        submitButtonText: String
    },
    template: `<user-contact :user="user"></user-contact>
    <user-address addressType="Billing" :address="billingAddress"></user-address>
    <user-address v-if="physicalCheckout" addressType="Shipping" :address="shippingAddress"></user-address>
    <user-payment :paymentDetails="paymentDetails"></user-payment>
    <product-pricing :productVariant="productVariant" :billingAddress="billingAddress"></product-pricing>
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
            console.log(this.productVariant,this.user,this.billingAddress,this.shippingAddress,this.paymentDetails);
        }
    }
});