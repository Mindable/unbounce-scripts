document.addEventListener('DOMContentLoaded', (event) => {
  const form = document.getElementsByTagName('form')[0];
  if (!form) return;
  const button = form.getElementsByTagName('button')[0];
  if (!button) return;
  button.addEventListener('click', validateForm);
});

function validateForm(event) {
  const form = document.getElementsByTagName('form')[0];
  if (!form) return true;
  const fieldsDiv = form.getElementsByClassName('fields')[0];
  if (!fieldsDiv) return true;

  const input_validator_map = {
    'cc_number': input => {
      console.log(`Validating: ${input.getAttribute('id')}`);
    },
    'cc_cvc': input => {
      console.log(`Validating: ${input.getAttribute('id')}`);
    }
  };

  let validationErrors = [];
  // Note: This will only find <input>, not others like <select>
  let inputs = Array.from(fieldsDiv.getElementsByTagName('input'));
  inputs.forEach(input => {
    let validator = input_validator_map[input.getAttribute('id')];
    if (!validator) return true;
    let validationError = validator(input);
    if (validationError)
      validationErrors.push(validationError);
  });

  if (validationErrors.length > 0) return false;
  return true;
}

// https://community.unbounce.com/t/how-to-run-custom-code-scripts-on-form-submission/5079
window.ub.hooks.beforeFormSubmit.push(function (args) {
  console.log('ub.hooks.beforeFormSubmit');
  console.log(args);
});
