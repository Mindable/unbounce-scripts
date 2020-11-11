window.addEventListener('load', (event) => {
  if (!useRecurly()) return;

  // Set PUBLIC key
  recurly.configure('ewr1-TvB1JrfZgxptu9u8AtXhk8');
  console.log('Recurly configured!');

  const form = document.getElementsByTagName('form')[0];
  let fieldsDiv = form.getElementsByClassName('fields')[0];
  if (!fieldsDiv) return;
  
  // Configure CC validity element to be readonly
  let ccValidityElement = fieldsDiv.querySelector('#cc_input_validity');
  if (!ccValidityElement) throw 'Missing form element cc_input_validity';
  // ccValidityElement.setAttribute('readonly', 'true');
  ccValidityElement.value = 'Credit Card info is invalid';

  // Generate & swap placeholder input with Recurly CardElement container div
  let ccElement = Array.from(fieldsDiv.getElementsByTagName('input')).filter(e => e.id == 'cc_number')[0];
  if (!ccElement) return;
  let ccElementStyle = window.getComputedStyle(ccElement);
  let recurlyCardDiv = document.createElement('div');
  recurlyCardDiv.id = 'cc_number';
  recurlyCardDiv.style.position = ccElementStyle.getPropertyValue('position');
  recurlyCardDiv.style.top = ccElementStyle.getPropertyValue('top');
  recurlyCardDiv.style.left = ccElementStyle.getPropertyValue('left');
  recurlyCardDiv.style.width = ccElementStyle.getPropertyValue('width');
  recurlyCardDiv.style.height = ccElementStyle.getPropertyValue('height');
  recurlyCardDiv.style.lineHeight = ccElementStyle.getPropertyValue('lineHeight');
  ccElement.replaceWith(recurlyCardDiv);

  // Create CardElement to 
  console.log('recurly');
  console.log(recurly);
  let recurlyElements = recurly.Elements();
  const recurlyCardElement = recurlyElements.CardElement();
  console.log('recurlyCardElement');
  console.log(recurlyCardElement);
  recurlyCardElement.attach('#cc_number');
  
  // Testing 
  recurly.on('change' , state => {
    console.log('recurly.change');
    console.log(state);
  });
  recurly.on('submit' , state => {
    console.log('recurly.submit');
    console.log(state);
  });

  // TODO How to prevent submit if Recurly fails validation?
  // https://community.unbounce.com/t/adding-custom-validation-to-form-fields/3205
  // Need a 
  window.ub.form.customValidators.recurlyCcInput = {
    isValid: function(value) {
      return cc_input_validity == '';
    },
    message: 'Credit Card info is invalid',
  };
  window.ub.form.validationRules.cc_input_validity.recurlyCcInput = true;

  // Get Recurly token & add to form payload
  // https://community.unbounce.com/t/how-to-run-custom-code-scripts-on-form-submission/5079
  // https://developers.recurly.com/reference/recurly-js/#getting-a-token
  console.log('window.ub');
  console.log(window.ub);
  window.ub.hooks.beforeFormSubmit.push(function(args) {
    // TODO Convert callback to Promise
    console.log('window.ub.hooks.beforeFormSubmit');
    recurly.token(recurlyElements, form, (err, token) => {
      console.log(err);
      console.log(token);
    });
    console.log('window.ub.hooks.beforeFormSubmit DONE');
  });
});

document.addEventListener('DOMContentLoaded', (event) => {
  if (!useRecurly()) return;

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

function useRecurly() {
  // Continue IFF the form has hidden field `_use_recurly`
  const form = document.getElementsByTagName('form')[0];
  if (!form) return false;
  const useRecurly = Array.from(form.getElementsByTagName('input')).filter(e => e.id == '_use_recurly')[0];
  if (!useRecurly) return false;
  return true;
}
