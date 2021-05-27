app.component('user-payment', {
  props: {
    paymentDetails: Object
  },
  template: `
  <div>
    <label>Card Type: *</label>
    <select v-model.trim="paymentDetails.cardType">
      <option value="" selected>Select a Card Type</option>
      <option v-for="(item,key) in cardTypes" :value="key">
        {{item}}
      </option>
    </select>
  </div>
  <div>
    <label>Card Number: *</label>
    <input type="text" maxlength="16" v-model.trim="paymentDetails.cardNumber">
  </div>
  <div class="split split-first">
    <label>Expiration Month: *</label>
    <select v-model.trim="paymentDetails.expMonth">
      <option value="" selected>Select a Month</option>
      <option v-for="(item,key) in expMonths" :value="key">
        {{item}}
      </option>
    </select>
  </div>
  <div class="split">
    <label>Expiration Year: *</label>
    <select v-model.trim="paymentDetails.expYear">
      <option value="" selected>Select a Year</option>
      <option v-for="year in expYears" :value="year">
        {{year}}
      </option>
    </select>
  </div>
  <div>
    <label>CVV Code: *</label>
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
