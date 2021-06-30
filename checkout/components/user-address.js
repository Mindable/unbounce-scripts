app.component('user-address',{
  props: {
    addressType: String,
    address: Object,
    countriesList: Object,
    inputToggle: {
      type: Boolean,
      default: true
    }
  },
  template: `<div>
    <label>Street Address: *</label>
    <input type="text" v-model.trim="address.streetAddress" :disabled="!inputToggle">
  </div>
  <div>
    <label>City: *</label>
    <input type="text" v-model.trim="address.city" :disabled="!inputToggle">
  </div>
  <div>
    <label>Zip/Postal Code: *</label>
    <input type="text" v-model.trim="address.zip" :disabled="!inputToggle">
  </div>
  <div>
    <label>Country: *</label>
    <select v-model.trim="address.country" @change="fetchState" :disabled="!inputToggle">
      <option value="" selected>Select a Country</option>
      <option v-for="(item,key) in countriesList" :value="key">
        {{item}}
      </option>
    </select>
  </div>
  <div v-if="states">
    <label>State/Province: *</label>
    <select v-model.trim="address.state">
      <option value="" disabled selected>Select a State/Province</option>
      <option v-for="(item,key) in states" :value="key">
        {{item}}
      </option>
    </select>
  </div>`,
  data() {
    return {
      states: null
    };
  },
  methods: {
    fetchState(){
      fetch(`https://aaproxyapis.astrologyanswers.com/countries/${this.address.country}/states`).then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            this.states = data;
          });
        }
        else {
          console.log('Error with API. Status code : ' + response.status);
          this.states = null;
        }
      });
    }
  }
});
