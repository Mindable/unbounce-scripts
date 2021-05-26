app.component('checkout-form',{
    emits: ['checkoutFormSubmit'],
    props: {
        productVariant: Object,
        user: Object,
        physicalCheckout: Boolean,
        submitButtonText: String,
        validationErrors: Array,
        countriesList: Object,
    },
    template: `
      <h3>Contact Information</h3>
      <user-contact :user="user"></user-contact>
      <h3>Current Billing Address</h3>
      <user-address addressType="Billing" :address="billingAddress" :countriesList="countriesList"></user-address>
      <div v-if="physicalCheckout" class="physicalCheckoutDiv">
        <h3>Shipping Address:</h3>
        <input type="checkbox" v-model="shippingToggle">Check this box if your shipping address is different from your billing address
        <user-address v-if="shippingToggle" addressType="Shipping" :address="shippingAddress" :countriesList="countriesList"></user-address>
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
            if(this.user.firstname === '') {
                this.validationErrors.push('Please enter First Name');
            }
            if(this.user.lastname === '') {
                this.validationErrors.push('Please enter Last Name');
            }
            if(this.user.email === '') {
                this.validationErrors.push('Error with retrieving Email ID, please contact Customer Service');
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
            if(this.billingAddress.city === '') {
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
                if(this.shippingAddress.city === '') {
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