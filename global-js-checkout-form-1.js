
document.addEventListener('DOMContentLoaded', (event) => {
  return;
  // console.log('global-js-checkout-form-1 DOMContentLoaded');
  let form = document.getElementsByTagName('form')[0];
  console.log(form);
  if (!form) return;

  // V2 -----------------------
  // Go through the fields in the form and group each occurence of a hiddend _header field as a section
  // Then repopulate the fields div with each section being a fieldset & legend
  let fieldsDiv = form.getElementsByClassName('fields')[0];
  if (!fieldsDiv) return;

  let elements = Array.from(fieldsDiv.children);
  console.log('elements');
  console.log(elements);
  
  let sections = [];
  elements.forEach(e => {
    if (e.getAttribute('type') == 'hidden' && e.getAttribute('name').startsWith('_form_section_header'))
    {
      sections.push({
        name: e.getAttribute('value'),
        fields: []
      });
    } else {
      sections[sections.length - 1].fields.push(e);
    }
  });
  console.log('sections');
  console.log(sections);

  while (fieldsDiv.firstChild) {
    fieldsDiv.removeChild(fieldsDiv.lastChild);
  }

  sections.forEach(s => {
    let fieldSet = document.createElement('fieldset');
    let legend = document.createElement('legend');
    legend.innerText = s.name;
    fieldSet.insertAdjacentElement('beforeend', legend);
    s.fields.forEach(f => fieldSet.insertAdjacentElement('beforeend', f));
    fieldsDiv.insertAdjacentElement('beforeend', fieldSet);
  });

  // V2 END -------------------

  // V1 -----------------------
  // Find all hidden elements having name match pattern _form_section_header*
  // And replace them with label elements with hidden field's value
  // let elements = Array.from(form.getElementsByTagName('input'))
  //   .filter(e => e.getAttribute('type') == 'hidden'
  //     && e.getAttribute('name').startsWith('_form_section_header'));
  // console.log('hidden header elements');
  // console.log(elements);

  // const createHeaderElement = function (text) {
  //   let span = document.createElement('span');
  //   span.setAttribute('class', 'label-style');
  //   span.innerText = text;
  //   let label = document.createElement('label');
  //   label.setAttribute('id', 'label_header');
  //   label.setAttribute('class', 'main lp-form-label');
  //   label.setAttribute('style', 'height: auto;');
  //   label.insertAdjacentElement('afterbegin', span);
  //   let container = document.createElement('div');
  //   container.setAttribute('id', 'container_header');
  //   container.setAttribute('class', 'lp-pom-form-field single-line-text');
  //   container.setAttribute('style', 'height: auto;');
  //   container.insertAdjacentElement('afterbegin', label);
  //   return container;
  // };

  // elements.forEach(e => {
  //   e.replaceWith(createHeaderElement(e.getAttribute('value')));
  // });
  // V1 END -------------------
});
