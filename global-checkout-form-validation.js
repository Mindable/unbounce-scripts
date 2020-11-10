document.addEventListener('DOMContentLoaded', (event) => {
  const form = document.getElementsByTagName('form')[0];
  if (!form) return;
  const fieldsDiv = form.getElementsByClassName('fields')[0];
  if (!fieldsDiv) return;
  const input_pattern_map = {
    // https://stackoverflow.com/a/9315696
    'cc_number': '^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$',
    'cc_cvc': '[0-9]{3,4}'
  }
  let inputs = Array.from(fieldsDiv.getElementsByTagName('input'));
  inputs.forEach(input => {
    let pattern = input_pattern_map[input.getAttribute('id')];
    if (!pattern) return;
    input.setAttribute('pattern', pattern);
  });
});
