window.addEventListener('load', (event) => {
  if (!useRecurly()) return;
  
  // Set PUBLIC key
  recurly.configure('ewr1-TvB1JrfZgxptu9u8AtXhk8');
  console.log('Recurly configured!');
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
