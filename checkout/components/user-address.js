app.component('user-address',{
  props: {
    addressType: String,
    address: Object,
    countriesList: Object
  },
  template: `<div>
    <label>Street Address: *</label><br>
    <input type="text" v-model.trim="address.streetAddress">
  </div>
  <div>
    <label>City: *</label><br>
    <input type="text" v-model.trim="address.city">
  </div>
  <div>
    <label>Zip/Postal Code: *</label><br>
    <input type="text" v-model.trim="address.zip">
  </div>
  <div>
    <label>Country: *</label><br>
    <select v-model.trim="address.country" @change="fetchState">
      <option value="" selected>Select your option</option>
      <option v-for="(item,key) in countriesList" :value="key">
        {{item}}
      </option>
    </select>
  </div>
  <div v-if="states">
    <label>State/Province: *</label><br>
    <select v-model.trim="address.state">
      <option value="" disabled selected>Select your Country</option>
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
