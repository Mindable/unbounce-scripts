app.component('product-pricing', {
  props: {
    productVariant: Object,
    billingAddress: Object
  },
  template: `<h3>Product Information</h3>
  <div>
  <p>Product : {{ productVariant.name }}</p>
  <p v-if="taxPrc > 0">Price : $ {{productVariant.price}}</p>
  <p v-if="taxPrc > 0">Tax ({{taxPrc}}%) : $ {{tax}}</p>
  <p>Total : $ {{amount}}</p>
  </div>`,
  data() {
    return {
      canadianTaxMap: {
        'AB': 5,
        'BC': 12,
        'MB': 12,
        'NB': 15,
        'NL': 15,
        'NT': 5,
        'NS': 15,
        'NU': 5,
        'ON': 13,
        'PE': 15,
        'QC': 14.975,
        'SK': 11,
        'YT': 5
      }
    }
  },
  computed: {
    amount() {
      return (parseFloat(this.productVariant.price) + parseFloat(this.tax)).toFixed(2);
    },
    taxPrc() {
      if(this.billingAddress.country === 'CA') {
        return (this.canadianTaxMap[this.billingAddress.state] ?? 0).toFixed(2);
      }else{
        return 0;
      }
    },
    tax() {
      return (this.productVariant.price * this.taxPrc /100 ).toFixed(2);
    }
  }
});