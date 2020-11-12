// test -----------
// window.addEventListener('DOMContentLoaded', event => {
//   console.log('window.DOMContentLoaded');
// });
// document.addEventListener('DOMContentLoaded', event => {
//   console.log('document.DOMContentLoaded');
// });
// end test -------

let loadRecurlyPromise = new Promise((resolve, reject) => {
  console.log('loadRecurlyPromise start');
  const finishedLoading = function () {
    console.log('finishedLoading');
    resolve();
  };
  // Reference recurly.js CDN assets
  // https://developers.recurly.com/reference/recurly-js/#getting-started
  // https://stackoverflow.com/a/950146
  const cssRef = document.createElement('link');
  cssRef.href = 'https://js.recurly.com/v4/recurly.css';
  cssRef.type = 'text/css';
  cssRef.rel = 'stylesheet';
  document.head.appendChild(cssRef);
  const scriptRef = document.createElement('script');
  scriptRef.src = 'https://js.recurly.com/v4/recurly.js';
  scriptRef.onreadystatechange = finishedLoading;
  scriptRef.onload = finishedLoading;
  document.head.appendChild(scriptRef);
  console.log('loadRecurlyPromise end');
});

let domContentLoadedPromise = new Promise((resolve, reject) => {
  console.log('domContentLoadedPromise start');
  document.addEventListener('DOMContentLoaded', event => {
    console.log('document.DOMContentLoaded');
    resolve();
  });
  console.log('domContentLoadedPromise end');
});

console.log('begin await all');
Promise.all([loadRecurlyPromise, domContentLoadedPromise]).then(() => {
  console.log('finish await all');
  decorate_form_with_recurly();
});

function useRecurly() {
  // Continue IFF the form has hidden field `_use_recurly`
  const form = document.getElementsByTagName('form')[0];
  if (!form) return false;
  const useRecurly = Array.from(form.getElementsByTagName('input')).filter(e => e.id == '_use_recurly')[0];
  if (!useRecurly) return false;
  return true;
}

function decorate_form_with_recurly() {
  if (!useRecurly()) return;

  // Set PUBLIC key
  recurly.configure('ewr1-TvB1JrfZgxptu9u8AtXhk8');
  console.log('Recurly configured!');

  const form = document.getElementsByTagName('form')[0];
  const fieldsDiv = form.getElementsByClassName('fields')[0];
  if (!fieldsDiv) return;

  // Generate & swap placeholder input with Recurly CardElement container div
  const ccElement = Array.from(fieldsDiv.getElementsByTagName('input')).filter(e => e.id == 'cc_number')[0];
  if (!ccElement) return;
  const ccElementStyle = window.getComputedStyle(ccElement);
  const recurlyCardDiv = document.createElement('div');
  recurlyCardDiv.id = 'cc_number';
  recurlyCardDiv.style.position = ccElementStyle.getPropertyValue('position');
  recurlyCardDiv.style.top = ccElementStyle.getPropertyValue('top');
  recurlyCardDiv.style.left = ccElementStyle.getPropertyValue('left');
  recurlyCardDiv.style.width = ccElementStyle.getPropertyValue('width');
  recurlyCardDiv.style.height = ccElementStyle.getPropertyValue('height');
  recurlyCardDiv.style.lineHeight = ccElementStyle.getPropertyValue('lineHeight');
  ccElement.replaceWith(recurlyCardDiv);

  // Create CardElement & attach to recurly cc container
  const recurlyElements = recurly.Elements();
  const recurlyCardElement = recurlyElements.CardElement();
  console.log('recurlyCardElement');
  console.log(recurlyCardElement);
  recurlyCardElement.attach('#cc_number');

  // Set the submit button's enabled state to whether the CC element is valid
  const submitButton = Array.from(form.getElementsByTagName('button')).filter(e => e.getAttribute('type') == 'submit')[0];
  if (!submitButton) throw 'Cannot find submit button within form';
  recurlyCardElement.addEventListener('change', state => {
    console.log('recurlyCardElement change');
    console.log(state);
    if (!state.valid) submitButton.setAttribute('disabled', 'true');
    else submitButton.removeAttribute('disabled');
  });

  // Get Recurly token & add to form payload
  // https://community.unbounce.com/t/how-to-run-custom-code-scripts-on-form-submission/5079
  // https://developers.recurly.com/reference/recurly-js/#getting-a-token
  console.log('window.ub');
  console.log(window.ub);
  window.ub.hooks.beforeFormSubmit.push(function (args) {
    // TODO Convert callback to Promise
    console.log('window.ub.hooks.beforeFormSubmit');
    recurly.token(recurlyElements, form, (err, token) => {
      console.log(err);
      console.log(token);
    });
    console.log('window.ub.hooks.beforeFormSubmit DONE');
  });
}
