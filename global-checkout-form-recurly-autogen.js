const FORM_HTML = `
<form id="my-form" autocomplete="on" method="POST">
  <label>first_name</label>
  <input type="text" data-recurly="first_name"><br>
  <label>last_name</label>
  <input type="text" data-recurly="last_name"><br>
  <label>address1</label>
  <input type="text" data-recurly="address1"><br>
  <label>city</label>
  <input type="text" data-recurly="city"><br>
  <label>state</label>
  <input type="text" data-recurly="state"><br>
  <label>country</label>
  <input type="text" data-recurly="country"><br>
  <label>postal_code</label>
  <input type="text" data-recurly="postal_code"><br>
  
  <div id="cc_number">
  </div>

  <!-- Recurly.js will update this field automatically -->
  <input type="hidden" name="recurly-token" data-recurly="token">

  <button>Submit</button>
</form>
`;

window.addEventListener('load', (event) => {
  const hostDiv = getHostDiv();
  if (!hostDiv) return;

  // Set PUBLIC key
  recurly.configure('ewr1-TvB1JrfZgxptu9u8AtXhk8');

  hostDiv.innerHTML = FORM_HTML;
  const form = hostDiv.getElementsByTagName('form')[0];
  
  let recurlyElements = recurly.Elements();
  const recurlyCcElement = recurlyElements.CardElement();
  recurlyCcElement.attach('#cc_number');

  form.addEventListener('submit', event => {
    event.preventDefault();
    console.log('form submit');
    recurly.token(recurlyElements, form, function (err, token) {
      if (err) {
        console.log(err);
      } else {
        console.log('token: ' + JSON.stringify(token));
        // todo Create transaction w/ token
      }
    });
  });


  // Figure out what ubounce has
  console.log('window.ub');
  console.log(window.ub);
  window.ub.hooks.beforeFormSubmit.push(function(args) {
    console.log('window.ub.hooks.beforeFormSubmit');
  });
});

document.addEventListener('DOMContentLoaded', (event) => {
  if (!getHostDiv()) return;

  // Reference recurly.js CDN assets
  // https://developers.recurly.com/reference/recurly-js/#getting-started
  const scriptRef = document.createElement('script');
  scriptRef.src = 'https://js.recurly.com/v4/recurly.js';
  document.getElementsByTagName("head")[0].appendChild(scriptRef);
  const cssRef = document.createElement('link');
  cssRef.href = 'https://js.recurly.com/v4/recurly.css';
  cssRef.type = 'text/css';
  cssRef.rel = 'stylesheet';
  document.getElementsByTagName("head")[0].appendChild(cssRef);
});

function getHostDiv() {
  return document.querySelector('#recurly_autogen');
}
