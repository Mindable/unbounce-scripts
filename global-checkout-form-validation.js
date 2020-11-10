document.addEventListener('DOMContentLoaded', (event) => {
  const input_validator_map = {
    'cc_number': input => {
      console.log(input.getAttribute('id'));
    },
    'cc_cvc': input => { }
  };

  const form = document.getElementsByTagName('form')[0];
  if (!form) return;

  let fieldsDiv = form.getElementsByClassName('fields')[0];
  if (!fieldsDiv) return;

  // Note: This will only find <input>, not others like <select>
  let inputs = Array.from(fieldsDiv.getElementsByTagName('input'));
  console.log(inputs);
  inputs.forEach(input => {
    // if (Object.keys(input_validator_map).includes(input.getAttribute('id'))) {
    //   inv
    // }
    let validator = input_validator_map[input.getAttribute('id')];
    if (!validator) return;
    validator(input);
  });
});
