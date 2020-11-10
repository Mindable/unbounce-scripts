
document.addEventListener('DOMContentLoaded', (event) => {
  // TODO Check if form has hidden field declaring Recurly enabled
  const form = document.getElementsByTagName('form')[0];
  if (!form) return;

  // Reference recurly.js CDN assets
  // https://developers.recurly.com/reference/recurly-js/#getting-started
  var scriptRef = document.createElement('script');
  scriptRef.src = 'https://js.recurly.com/v4/recurly.js';
  document.getElementsByTagName("head")[0].appendChild(scriptRef);
  var cssRef = document.createElement('link');
  cssRef.href = 'https://js.recurly.com/v4/recurly.css';
  cssRef.type = 'text/css';
  cssRef.rel = 'stylesheet';
  document.getElementsByTagName("head")[0].appendChild(cssRef);
});
