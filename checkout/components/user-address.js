app.component('user-address',{
  props: {
    addressType: String,
    address: Object
  },
  template: `<div>
  <label>Street Address: *</label><br>
  <input type="text" v-model="address.streetAddress">
  </div>
  <div>
  <label>City: *</label><br>
  <input type="text" v-model="address.city">
  </div>
  <div>
  <label>Zip/Postal Code: *</label><br>
  <input type="text" v-model="address.zip">
  </div>
  <div>
  <label>Country: *</label><br>
  <select v-model="address.country" @change="fetchState">
    <option value="" selected>Select your option</option>
    <option v-for="(item,key) in countries" :value="key">
      {{item}}
    </option>
  </select>
  </div>
  <div v-if="states">
  <label>State/Province: *</label><br>
  <select v-model="address.state">
    <option value="" disabled selected>Select your Country</option>
    <option v-for="(item,key) in states" :value="key">
      {{item}}
    </option>
  </select>
  </div>`,
  data() {
    return {
      states: null,
      countries: {"US":"United States","CA":"Canada","AU":"Australia","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua and Barbuda","AR":"Argentina","AW":"Aruba","AT":"Austria","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnia and Herzegovina","BW":"Botswana","BV":"Bouvet Island","BR":"Brazil","BQ":"British Antarctic Territory","IO":"British Indian Ocean Territory","VG":"British Virgin Islands","BN":"Brunei","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodia","CM":"Cameroon","CT":"Canton and Enderbury Islands","CV":"Cape Verde","KY":"Cayman Islands","CF":"Central African Republic","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos [Keeling] Islands","CO":"Colombia","KM":"Comoros","CK":"Cook Islands","CR":"Costa Rica","HR":"Croatia","CY":"Cyprus","DK":"Denmark","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","NQ":"Dronning Maud Land","DD":"East Germany","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","ET":"Ethiopia","FK":"Falkland Islands","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","TF":"French Southern Territories","FQ":"French Southern and Antarctic Territories","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard Island and McDonald Islands","HN":"Honduras","HK":"Hong Kong SAR China","HU":"Hungary","IS":"Iceland","IE":"Ireland","IM":"Isle of Man","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JE":"Jersey","JT":"Johnston Island","JO":"Jordan","KE":"Kenya","KI":"Kiribati","KG":"Kyrgyzstan","LA":"Laos","LV":"Latvia","LS":"Lesotho","LI":"Liechtenstein","LU":"Luxembourg","MO":"Macau SAR China","MG":"Madagascar","MW":"Malawi","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","FX":"Metropolitan France","MX":"Mexico","FM":"Micronesia","MI":"Midway Islands","MD":"Moldova","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","AN":"Netherlands Antilles","NT":"Neutral Zone","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk Island","VD":"North Vietnam","MP":"Northern Mariana Islands","NO":"Norway","OM":"Oman","PC":"Pacific Islands Trust Territory","PW":"Palau","PS":"Palestinian Territories","PA":"Panama","PZ":"Panama Canal Zone","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn Islands","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RW":"Rwanda","RE":"Reunion","BL":"Saint Barthelemy","SH":"Saint Helena","KN":"Saint Kitts and Nevis","LC":"Saint Lucia","MF":"Saint Martin","PM":"Saint Pierre and Miquelon","VC":"Saint Vincent and the Grenadines","WS":"Samoa","SM":"San Marino","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","CS":"Serbia and Montenegro","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","ZA":"South Africa","GS":"South Georgia and the South Sandwich Islands","KR":"South Korea","ES":"Spain","LK":"Sri Lanka","SR":"Suriname","SJ":"Svalbard and Jan Mayen","SZ":"Swaziland","SE":"Sweden","CH":"Switzerland","ST":"Sao Tome and Principe","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad and Tobago","TN":"Tunisia","TM":"Turkmenistan","TC":"Turks and Caicos Islands","TV":"Tuvalu","UM":"U.S. Minor Outlying Islands","PU":"U.S. Miscellaneous Pacific Islands","VI":"U.S. Virgin Islands","UG":"Uganda","SU":"Union of Soviet Socialist Republics","AE":"United Arab Emirates","GB":"United Kingdom","ZZ":"Unknown or Invalid Region","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VA":"Vatican City","VE":"Venezuela","WK":"Wake Island","WF":"Wallis and Futuna","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","AX":"Aland Islands"}
    };
  },
  methods: {
    fetchState(){
      fetch(`https://aaproxyapis.astrologyanswerstest.com/countries/${this.address.country}/states`).then(response => {
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
