window.addEventListener('load', (event) => {
  if (!useRecurly()) return;

  // Set PUBLIC key
  recurly.configure('ewr1-TvB1JrfZgxptu9u8AtXhk8');
  console.log('Recurly configured!');

  const form = document.getElementsByTagName('form')[0];
  let fieldsDiv = form.getElementsByClassName('fields')[0];
  if (!fieldsDiv) return;
  
  // Generate & attach credit card
  var ccElement = Array.from(fieldsDiv.getElementsByTagName('input')).filter(e => e.id == 'cc_number')[0];
  if (!ccElement) return;
  var ccElementStyle = window.getComputedStyle(ccElement);
  var recurlyCardDiv = document.createElement('div');
  recurlyCardDiv.id = 'cc_number';
  recurlyCardDiv.style.position = ccElementStyle.getPropertyValue('position');
  recurlyCardDiv.style.top = ccElementStyle.getPropertyValue('top');
  recurlyCardDiv.style.left = ccElementStyle.getPropertyValue('left');
  recurlyCardDiv.style.width = ccElementStyle.getPropertyValue('width');
  recurlyCardDiv.style.height = ccElementStyle.getPropertyValue('height');
  recurlyCardDiv.style.lineHeight = ccElementStyle.getPropertyValue('lineHeight');
  ccElement.replaceWith(recurlyCardDiv);

  let recurlyElements = recurly.Elements();
  const recurlyCardElement = recurlyElements.CardElement();
  console.log('recurlyCardElement.style');
  console.log(recurlyCardElement.style);
  recurlyCardElement.attach('#cc_number');

  // TODO How to prevent submit if Recurly fails validation?
  // preventDefault() doesn't work 

  // Get Recurly token & add to form payload
  // https://community.unbounce.com/t/how-to-run-custom-code-scripts-on-form-submission/5079
  // https://developers.recurly.com/reference/recurly-js/#getting-a-token
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
