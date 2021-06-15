# unbounce-scripts
- *WARNING*: This is a public repo!
- TODO Update repo name as we're no longer using Unbounce
- The `.js` files are referenced by public pages

## Usage
We use GitHub Pages to act as a "CDN" to host files in `master`

### Old Checkout Form Implementation
Put in `<head>`:
```
<script src="https://mindable.github.io/unbounce-scripts/checkout-form-manager.js"></script>
```

### New Checkout Form Implementation
Put in `<head>`:
```
<script src="https://cdn.jsdelivr.net/npm/vue@3.0.2/dist/vue.global.prod.js"></script>
<script src="https://mindable.github.io/unbounce-scripts/dist/checkout/checkout.js"></script>
<link rel="stylesheet" href="https://mindable.github.io/unbounce-scripts/dist/checkout/default.css" />
```
Add div where you want to render Form:
```
<div id="aa-checkout-div" class="aa-checkout-div"></div
```
In case, you use any other id than `aa-checkout-div` say `checkout-div` for example, we will need this code in `<body>` at the bottom:
```
renderCheckoutForm('checkout-div');
```
More details on usage [here](https://mindable.github.io/unbounce-scripts/checkout/usage/index.html)
####Checkout Form Development
Checkout Form uses VueJs 3 but no CLI tools are used for development in initial phase, all we need is to add development build script to be added to page which is already implemented, child components are in `checkout/components` folder while main checkout App is created in `checkout/main.js`  

After making changes to app, please run `make compile_checkout` to update the distribution file.  

Example pages also use production ready VueJS and compiled Checkout JS, so they can be used for Testing deployment environment 

### Upsell Implementation
Put in `<head>`:
```
<script src="https://mindable.github.io/unbounce-scripts/checkout-form-manager.js"></script>
```
Add Link or button with class `upsell-link` and other necessary data-properties.  
For eg. ```<a class="upsell-link"
href="#"
data-action-url="https://flux2.astrologyanswers.com/?flux_action=1&flux_f=1147020355678920015&flux_ffn=1147020973846306320"
data-offer-id="1360">Buy Upsell</a>```

#### initialize/register upsell links using Js Method
```
initUpsellLinks({
    'elements': '#element-50 a, #element-244 img',
    'offer_id': '1',
    'action_url': 'https://flux2.astrologyanswers.com/link1'
});
```

### Leads Form
Put in `<head>`:
```
<script src="https://mindable.github.io/unbounce-scripts/leads-form-manager.js"></script>
```
