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
            if(this.user.firstname.trim() === '') {
                this.validationErrors.push('Please enter First Name');
                _validate = false;
            }
            if(this.user.lastname.trim() === '') {
                this.validationErrors.push('Please enter Last Name');
                _validate = false;
            }
            if(this.user.email.trim() === '') {
                this.validationErrors.push('Error with retrieving Email ID, please contact Customer Service');
                _validate = false;
            }
            return _validate;
        },
        validateBillingInformation() {
            let _validate = true;
            if(this.billingAddress.streetAddress.trim() === '') {
                this.validationErrors.push('Please enter Billing Address');
                _validate = false;
            }
            if(this.billingAddress.city.trim() === '') {
                this.validationErrors.push('Please enter Billing City');
                _validate = false;
            }
            if(this.billingAddress.city.trim() === '') {
                this.validationErrors.push('Please enter Billing Zip/Postal Code');
                _validate = false;
            }
            if(this.billingAddress.country.trim() === '') {
                this.validationErrors.push('Please choose Billing Country');
                _validate = false;
            }
            if(this.billingAddress.state.trim() === '') {
                this.validationErrors.push('Please choose Billing State/Province');
                _validate = false;
            }
            return _validate;
        },
        validateShippingInformation() {
            let _validate = true;
            if(this.physicalCheckout && this.shippingToggle) {
                if(this.shippingAddress.streetAddress.trim() === '') {
                    this.validationErrors.push('Please enter Shipping Address');
                    _validate = false;
                }
                if(this.shippingAddress.city.trim() === '') {
                    this.validationErrors.push('Please enter Shipping City');
                    _validate = false;
                }
                if(this.shippingAddress.city.trim() === '') {
                    this.validationErrors.push('Please enter Shipping Zip/Postal Code');
                    _validate = false;
                }
                if(this.shippingAddress.country.trim() === '') {
                    this.validationErrors.push('Please choose Shipping Country');
                    _validate = false;
                }
                if(this.shippingAddress.state.trim() === '') {
                    this.validationErrors.push('Please choose Shipping State/Province');
                    _validate = false;
                }
            }
            return _validate;
        },
        validatePaymentInformation() {
            let _validate = true;
            if(this.paymentDetails.cardType.trim() === '') {
                this.validationErrors.push('Please choose Credit Card Type');
                _validate = false;
            }
            if(this.paymentDetails.cardNumber.trim() === '') {
                this.validationErrors.push('Please enter Credit Card Number');
                _validate = false;
            }
            if(this.paymentDetails.expMonth.trim() === '') {
                this.validationErrors.push('Please choose Credit Card Expiration Month');
                _validate = false;
            }
            if(this.paymentDetails.expYear.trim() === '') {
                this.validationErrors.push('Please choose Credit Card Expiration Year');
                _validate = false;
            }
            if(this.paymentDetails.cardCvv.trim() === '') {
                this.validationErrors.push('Please enter Credit Card CVV Code');
                _validate = false;
            }
            return _validate;
        },
    }
});
