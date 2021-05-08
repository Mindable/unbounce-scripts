app.component('user-payment', {
  props: {
    paymentDetails: Object
  },
  template: `<h3>Credit Card Information</h3>
  <div>
    <label>Card Type: *</label><br>
    <select v-model="paymentDetails.cardType">
      <option value="" selected>Select a Card Type</option>
      <option v-for="(item,key) in cardTypes" :value="key">
        {{item}}
      </option>
    </select>
  </div>
  <div>
    <label>Card Number: *</label><br>
    <input type="text" maxlength="16" v-model="paymentDetails.cardNumber">
  </div>
  <div>
    <label>Expiration Month: *</label><br>
    <select v-model="paymentDetails.expMonth">
      <option value="" selected>Select a Month</option>
      <option v-for="(item,key) in expMonths" :value="key">
        {{item}}
      </option>
    </select>
  </div>
  <div>
    <label>Expiration Year: *</label><br>
    <select v-model="paymentDetails.expYear">
      <option value="" selected>Select a Year</option>
      <option v-for="year in expYears" :value="year">
        {{year}}
      </option>
    </select>
  </div>
  <div>
    <label>CVV Code: *</label><br>
    <input type="text" maxlength="4" v-model="paymentDetails.cardCvv"><br>
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