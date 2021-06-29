const app = Vue.createApp({
    template:`<birth-details :user="user" :birthData="birthData" :birthDetailValidationError="birthDetailErrors" @update-birth-details="updateBirthDetails"> </birth-details>`,
    data(){
        return{
            user:{
                firstname:'',
                email:''
            },
            birthData : {
                year:'',
                month:'',
                day:'',
                hour:'',
                minute:'',
                ampm:'',
                city:'',
                birthPlaceId:0,
                countryShort:'',
                usState:'',
                unsure:false,
                wowId:0
            },
            nextUrl:'',
            birthDetailErrors:[]
        }
    },
    methods:{
        updateBirthDetails(){
            if(this.validateBirthDetails()){
                console.log(`this is in main class ${JSON.stringify(this.birthData)}`);
                let _birthPayload = {
                    Email: this.user.email,
                    Contact0FirstName: this.user.firstname,
                    month: this.birthData.month,
                    day: this.birthData.day,
                    year: this.birthData.year,
                    tobhr: this.birthData.hour,
                    tobmin:this.birthData.minute,
                    tobam: this.birthData.ampm,
                    unsure: (this.birthData.unsure)?'on':'off',
                    AutocompleteTarget: (this.birthData.countryShort === "USA")?this.birthData.usState:this.birthData.countryShort,
                    Contact0City3: this.birthData.city,
                    Contact0_birthplaceid:this.birthData.birthPlaceId
                };
                fetch(`https://services.astrologyanswers.com/aa/update_birth_details`,
                    {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'text/plain'
                        },
                        body: JSON.stringify(_birthPayload)
                    }).then(response => {
                    if (response.status === 200) {
                        response.json().then(data => {
                            if (data['status'] === 'success') {
                                window.location.href = this.nextUrl;
                                return;
                            }
                        });
                    }
                    else {
                        console.log('Error in birth update api : ' + response.status);
                        this.cities=[];
                    }
                });

            }
        },
        validateBirthDetails() {
            this.birthDetailErrors.splice(0,this.birthDetailErrors.length);
            if(this.user.firstname === '') {
                this.birthDetailErrors.push('Please enter First Name');
            }
            if(this.birthData.year === '' || this.birthData.month === '' || this.birthData.day === '') {
                this.birthDetailErrors.push('Please enter Date of Birth');
            }
            if(this.birthData.countryShort === '') {
                this.birthDetailErrors.push('Please Select Country');
            }else if(this.birthData.countryShort === 'USA' && this.birthData.usState === '') {
                this.birthDetailErrors.push('Please Select State');
            }
            if(this.birthData.city === ''){
                this.birthDetailErrors.push('Please Select City');
            }
            return this.birthDetailErrors.length === 0;
        },
        fetchBirthDetails(_nextUrl){
            if(_nextUrl === '' || typeof _nextUrl === 'undefined'){
                console.log('NextUrl required');
                return;
            }
            const _urlParams = new URLSearchParams(window.location.search);
            this.user.email = _urlParams.get('email') ?? '';
            if(this.user.email === ''){
                console.log('email required');
                return;
            }
            this.nextUrl = _nextUrl;
            fetch(`https://services.astrologyanswers.com/aa/get_birth_details?Email=${this.user.email}`).then(response => {
                if (response.status === 200) {
                    response.json().then(data => {
                        this.user.firstname = data.Contact0FirstName;
                        this.birthData.year=data.year;
                        this.birthData.month=data.month;
                        this.birthData.day=data.day;
                        this.birthData.hour=data.leadhour;
                        this.birthData.minute=data.leadmin;
                        this.birthData.ampm=data.leadap;
                        this.birthData.city=data.birtcity;
                        this.birthData.birthPlaceId=data.Birthplaceid;
                        this.birthData.countryShort=(data.wow_id >= 227 && data.wow_id <= 277)?"USA":data.birtcountry;
                        this.birthData.usState=(data.wow_id >= 227 && data.wow_id <= 277)?data.birtcountry:'';
                        this.birthData.wowId = data.wow_id;

                    });
                }
                else {
                    console.log('Error in birth details api : ' + response.status);
                    this.cities=[];
                }
            });
        }

    }
});


app.component('birth-details',{
    emits:['updateBirthDetails'],
    template:`
        
        <div>
            <label>Your First Name*:</label>
            <input type="text" v-model.trim="user.firstname">
        </div>
        <div>
            <label>Your Date of Birth*:</label>
            <div>
                <select v-model.trim="birthData.month">
                    <option value="">Month</option>
                    <option v-for="(month,key) in months" :key="key" :value="key">{{month}}</option>
                </select>
            </div>
            <div>
                <select v-model.trim="birthData.day">
                    <option value="">Day</option>
                    <option v-for="(day) in days" :key="day" :value=day>{{day}}</option>
                </select>
            </div>
            <div>
                <select v-model.trim="birthData.year">
                    <option value="">Year</option>
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
        </div>
        <div>
            <label>Your Time of Birth:</label>
            <div>
                <select v-model.trim="birthData.hour">
                    <option value="">Hour</option>
                    <option v-for="h in 12" :key="h" :value=h>{{h}}</option>
                </select>
            </div>
            <div>
                <select v-model.trim="birthData.minute">
                    <option value="">Minutes</option>
                    <option v-for="m in minutes" :key="m" :value=m>{{m}}</option>
                </select>
            </div>
            <div>
                <select v-model.trim="birthData.ampm">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        </div>
        <div>
            <input type="checkbox" v-model="birthData.unsure" /> Check the box if unsure
        </div>
        <div>
            <label>Your Country of Birth*:</label>
            <select @change="resetState" v-model.trim="birthData.countryShort">
                <option value="">Please Select</option>
                <option v-for="(countryFull,countryShort) in countries" :key="countryShort" :value=countryShort>{{countryFull}}</option>
            </select>
        </div>
        
        <div v-if="isCountryUsa">
            <label>State of Birth:</label>
            <select @change="resetCityAndBirthPlace" v-model.trim="birthData.usState">
                <option value="">Please Select</option>
                <option  v-for="(usStateFull,usStateShort) in usstates" :key="usStateShort" :value=usStateShort>{{usStateFull}}</option>
            </select>
        </div>
        <search-dropdown :birthData="birthData"> </search-dropdown>
        <div>
            <span v-for="validationError in birthDetailValidationError">
              {{validationError}}<br>
            </span>
        </div>
        <div>
            <button @click="submitData">Continue <i class="fa fa-angle-right" aria-hidden="true"></i></button>
        </div>
    `,
    props:{
        user:Object,
        birthData:Object,
        birthDetailValidationError:Array
    },
    computed : {
        years () {
            const year = new Date().getFullYear()-19;
            return Array.from({length: year - 1919}, (value, index) => 1920 + index)
        },
        isCountryUsa(){
            return this.birthData.countryShort==="USA";
        }
    },
    data(){
        return{
            months:{"01":"January","02":"February","03":"March","04":"April","05":"May","06":"June","07":"July","08":"August","09":"September","10":"October","11":"November","12":"December"},
            minutes:["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"],
            days:["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"],
            countries: {
                "USA": "UNITED STATES", "AN": "AUSTRALIA", "BL": "CANADA",
                "JX": "UNITED KINGDOM", "GV": "NEW ZEALAND", "AA": "Afghanistan",
                "AD": "Albania", "AE": "Algeria", "AF": "Andorra",
                "AG": "Angola", "AH": "Anguilla", "AI": "Antigua & Barbuda",
                "AJ": "Argentina", "AM": "Armenia", "AO": "Austria",
                "AP": "Azerbaijan", "AQ": "Bahamas", "AR": "Bahrain",
                "AS": "Bangladesh", "AT": "Barbados", "AU": "Belarus",
                "AV": "Belgium", "AW": "Belize", "AX": "Benin",
                "AY": "Bermuda", "AZ": "Bhutan", "BA": "Bolivia",
                "BB": "Bosnia & Herzegovina", "BC": "Botswana", "BD": "Brazil",
                "BE": "Brunei", "BF": "Bulgaria", "BG": "Burkina Faso",
                "BH": "Burundi", "BJ": "Cambodia", "BK": "Cameroon",
                "BM": "Cape Verde", "BN": "Cayman Islands", "BO": "Central African Republic",
                "BP": "Chad", "BQ": "Chile", "BR": "China",
                "BS": "Colombia", "BU": "Comoros", "BV": "Congo",
                "BW": "Congo Democratic Republic", "BY": "Cook Islands", "BZ": "Costa Rica",
                "CA": "Croatia", "CB": "Cuba", "CC": "Cyprus",
                "CD": "Czech Republic", "CF": "Denmark", "CH": "Djibouti",
                "CI": "Dominica", "CJ": "Dominican Republic", "CK": "East Timor",
                "CL": "Ecuador", "CM": "Egypt", "CN": "El Salvador",
                "CO": "Equatorial Guinea", "CP": "Eritrea", "CQ": "Estonia",
                "CR": "Ethiopia", "CS": "Faeroe Islands", "CT": "Falkland Islands",
                "CU": "Fiji", "CV": "Finland", "CX": "France",
                "CY": "French Guiana", "CZ": "French Polynesia", "DA": "Gabon",
                "DB": "Gambia", "DD": "Germany", "DE": "Ghana",
                "DF": "Gibraltar", "DG": "Greece", "DH": "Greenland",
                "DI": "Grenada", "DJ": "Guadeloupe", "DK": "Guam",
                "DL": "Guatemala", "DM": "Guernsey", "DN": "Guinea",
                "DO": "Guinea-Bissau", "DP": "Guyana", "DQ": "Haiti",
                "DS": "Honduras", "DT": "Hungary", "DU": "Iceland",
                "DX": "India", "DZ": "Indonesia", "EB": "Iran",
                "EC": "Iraq", "ED": "Ireland", "EE": "Israel",
                "EF": "Italy", "EG": "Ivory Coast", "EH": "Jamaica",
                "EI": "Japan", "EJ": "Jersey", "EK": "Jordan",
                "EM": "Kazakhstan", "EO": "Kenya", "EP": "Kiribati",
                "EQ": "Korea, North", "ER": "Korea, South", "ES": "Kuwait",
                "ET": "Kyrgyzstan", "EU": "Laos", "EV": "Latvia",
                "EW": "Lebanon", "EX": "Lesotho", "EY": "Liberia",
                "EZ": "Libya", "FA": "Liechtenstein", "FB": "Lithuania",
                "FD": "Luxembourg", "FE": "Macedonia", "FF": "Madagascar",
                "FH": "Malawi", "FI": "Malaysia", "FJ": "Maldives",
                "FK": "Mali", "FL": "Malta", "FM": "Man, Isle of",
                "FN": "Marshall Islands", "FO": "Martinique", "FR": "Mauritania",
                "FS": "Mauritius", "FT": "Mayotte", "FU": "Mexico",
                "FW": "Micronesia", "FX": "Midway Islands", "GB": "Moldova",
                "GC": "Monaco", "GD": "Mongolia", "GF": "Montserrat",
                "GG": "Morocco", "GH": "Mozambique", "GI": "Myanmar",
                "GJ": "Namibia", "GK": "Nauru", "GM": "Nepal",
                "GN": "Netherlands", "GO": "Netherlands Antilles", "GQ": "New Caledonia",
                "GW": "Nicaragua", "GX": "Niger", "GY": "Nigeria",
                "GZ": "Niue", "HA": "Norfolk Island", "HD": "Northern Mariana Islands",
                "HE": "Norway", "HH": "Oman", "HJ": "Pakistan",
                "HK": "Palau", "HL": "Panama", "HM": "Papua New Guinea",
                "HN": "Paraguay", "HP": "Peru", "HQ": "Philippines",
                "HR": "Pitcairn", "HS": "Poland", "HT": "Portugal",
                "HU": "Puerto Rico", "HV": "Qatar", "HW": "Reunion",
                "HY": "Romania", "HZ": "Russia", "IA": "Rwanda",
                "IB": "Saint Helena", "IC": "Saint Kitts-Nevis", "ID": "Saint Lucia",
                "IE": "Saint Pierre and Miquelon", "IF": "Saint Vincent and Grenadines", "IG": "Samoa, American",
                "IH": "Samoa, Western", "II": "San Marino", "IJ": "Sao Tome and Principe",
                "IK": "Saudi Arabia", "IL": "Senegal", "IM": "Seychelles",
                "IN": "Sierra Leone", "IO": "Singapore", "IP": "Slovakia",
                "IQ": "Slovenia", "IR": "Solomon Islands", "IS": "Somalia",
                "IT": "South Africa", "IW": "South Georgia", "IX": "Spain",
                "IY": "Sri Lanka", "IZ": "Sudan", "JA": "Surilabel",
                "JB": "Swaziland", "JC": "Sweden", "JD": "Switzerland",
                "JE": "Syria", "JF": "Taiwan", "JG": "Tajikistan",
                "JH": "Tanzania", "JK": "Thailand", "JL": "Togo",
                "JM": "Tokelau Islands", "JN": "Tonga", "JO": "Trinidad and Tobago",
                "JP": "Tunisia", "JQ": "Turkey", "JR": "Turkmenistan",
                "JS": "Turks and Caicos", "JT": "Tuvalu", "JU": "Uganda",
                "JV": "Ukraine", "JW": "United Arab Emirates", "JY": "Uruguay",
                "KA": "Uzbekistan", "KB": "Vanuatu", "KC": "Venezuela",
                "KE": "Vietnam", "KF": "Virgin Islands", "KH": "Wake Island",
                "KI": "Wallis and Futuna", "KN": "Yemen", "KO": "Yugoslavia",
                "KP": "Zambia", "KQ": "Zimbabwe"
            },
            usstates: {
                "AB": "Alabama", "AC": "Alaska", "AK": "Arizona",
                "AL": "Arkansas", "BI": "California", "BT": "Colorado",
                "BX": "Connecticut", "CE": "Delaware", "CG": "District of Columbia",
                "CW": "Florida", "DC": "Georgia", "DR": "Hawaii",
                "DV": "Idaho", "DW": "Illinois", "DY": "Indiana",
                "EA": "Iowa", "EL": "Kansas", "EN": "Kentucky",
                "FC": "Louisiana", "FG": "Maine", "FP": "Maryland",
                "FQ": "Massachusetts", "FV": "Michigan", "FY": "Minnesota",
                "FZ": "Mississippi", "GA": "Missouri", "GE": "Montana",
                "GL": "Nebraska", "GP": "Nevada", "GR": "New Hampshire",
                "GS": "New Jersey", "GT": "New Mexico", "GU": "New York",
                "HB": "North Carolina", "HC": "North Dakota", "HF": "Ohio",
                "HG": "Oklahoma", "HI": "Oregon", "HO": "Pennsylvania",
                "HX": "Rhode Island", "IU": "South Carolina", "IV": "South Dakota",
                "JI": "Tennessee", "JJ": "Texas", "JZ": "Utah",
                "KD": "Vermont", "KG": "Virginia", "KJ": "Washington",
                "KK": "West Virginia", "KL": "Wisconsin", "KM": "Wyoming"
            }
        }
    },
    methods:{
        submitData(){
            this.$emit('updateBirthDetails');
        },
        resetState(){
            this.birthData.usState='';
            this.resetCityAndBirthPlace()
        },
        resetCityAndBirthPlace(){
            this.birthData.city='';
            this.birthData.birthPlaceId=0;
        }
    }

});

app.component('search-dropdown',{
    template:`
        <div>    
            <input type="text" v-model.trim="birthData.city" @keyUp="fetchCities">
            <div v-if="isCities">
                <ul>
                    <li v-for="city in cities" :key=city.value @click="setCity(event,city.label,city.value)">{{city.label}}</li>
                </ul>
            </div>
        </div>`
    ,
    methods: {
        fetchCities(event){
            if(event.target.value.length<2){
                this.cities=[];
                return false;
            }
            let _country = (this.birthData.countryShort === "USA")?this.birthData.usState:this.birthData.countryShort;
            fetch(`https://services.astrologyanswers.com/aa/api/autocomplete?term=${event.target.value.toLowerCase()}&country=${_country}`).then(response => {
                if (response.status === 200) {
                    response.json().then(data => {
                        this.cities = data;
                    });
                }
                else {
                    console.log('Error with API. Status code : ' + response.status);
                    this.cities=[];
                }
            });
        },
        setCity(event,city,placeId){
            this.birthData.city = city;
            this.birthData.birthPlaceId = placeId;
            this.cities=[];
        }
    },
    computed:{
        isCities(){
            return this.cities.length > 0;
        }
    },
    props:{
        birthData:Object
    },
    data(){
        return{
            cities:[]
        }

    }
});

function renderBirthDetails(_nextUrl){
    if(_nextUrl === '' || typeof _nextUrl === 'undefined'){
        console.log('NextUrl required');
        return;
    }
    const _urlParams = new URLSearchParams(window.location.search);
    let _email = _urlParams.get('email') ?? '';
    if(_email === ''){
        console.log('email required');
        return;
    }
    let birthDetailsApp = app.mount("#birth-details-div");
    birthDetailsApp.fetchBirthDetails(_nextUrl);
}

