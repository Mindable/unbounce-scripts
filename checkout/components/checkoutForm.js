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
        <input type="checkbox" v-model="shippingToggle">&nbsp;Check this box if your shipping address is different from your billing address
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
