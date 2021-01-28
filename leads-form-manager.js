const formArray = [
    { id: 'firstname', selector: '[name="First Name"]' },
    { id: 'gender', selector: '[name="Gender"]' },
    { id: 'lastname', selector: '[name="Last Name"]' },
    { id: 'email', selector: '[name="Email"]' },
    { id: 'Sign', selector: '[name="Sign' },
    { id: 'city', selector: '[name="City"]' },
    { id: 'country', selector: '[name="Country"]' },
    { id: 'Birthcity', selector: '[name="Birth City"]' },
    { id: 'Birthcountry', selector: '[name="Birth Country"]' }
];

const monthNames = ["January", "February", "March", "April", "May", "June",  "July", "August", "September", "October", "November", "December"];

function prefillField(selector, dataValue) {
    let element = document.querySelector(selector);
    if (element) {
        element.value = dataValue;
    }
}

function prefillForm() {
    let _urlParams = new URLSearchParams(window.location.search);
    let _token = _urlParams.get('token');
    let _userHash = _urlParams.get('hash');

    fetch(`https://aaproxyapis.astrologyanswerstest.com/leads?hash=${_userHash}&token=${_token}`)
        .then(response => {
            if (response.status !== 200) {
                console.log('Error with API. Status code : ' + response.status);
                return;
            }
            response.json().then(data => {
                // Prefill fields with single mapping
                for (let i = 0; i < formArray.length; i++) {
                    prefillField(formArray[i].selector, data[formArray[i].id]);
                }

                // Prefill fields with multiple mappings
                if (data.birthday != null) {
                    const d = new Date(data.birthday);
                    prefillField('[name="Birth Month"]', monthNames[d.getMonth()]);
                    prefillField('[name="Birth Day"]', d.getUTCDate());
                    prefillField('[name="Birth Year"]', d.getFullYear());
                }
                if (data.Birthtime != null) {
                    prefillField('[name="Birth Hour"]', data.Birthtime.substr(0, 2) % 12 || 12);
                    prefillField('[name="Birth Minute"]', data.Birthtime.substr(3, 2));
                    prefillField('[name="Birth Meridiem"]', data.Birthtime.substr(0, 2) < 12 ? "AM" : "PM");
                }
            });
        });
}

(function() {
    prefillForm();
})();

window.instapageFormSubmitSuccess = function (form) {
    function getHiddenInputValue(form, inputId) {
        const ffluxSubmitUrlInput = Array.from(form.getElementsByTagName('input'))
            .find(i => i.name == inputId && i.type == 'hidden');
        if (!ffluxSubmitUrlInput) return undefined;
        return ffluxSubmitUrlInput.value;
    };

    // Ensure the form is configured for submission to FunnelFlux, and done so properly
    const ffluxSubmitUrl = getHiddenInputValue(form, 'fflux_submit_url');
    if (!ffluxSubmitUrl) return;
    const ffluxLeadsFormId = getHiddenInputValue(form, 'fflux_leads_form_id');
    if (!ffluxLeadsFormId) {
        console.error('Hidden field fflux_leads_form_id must be defined alongside fflux_submit_url');
        return;
    }

    // Remove unwanted 'form data' prior to submission
    ['lpsSubmissionConfig'].forEach(key => {
        form.querySelector(`input[name="${key}"]`).value = '';
    });

    // Modify form to POST to FunnelFlux w/ form-data on submit
    form.action = ffluxSubmitUrl;
    form.submit();
};
