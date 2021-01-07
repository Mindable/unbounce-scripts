window.instapageFormSubmitSuccess = function (form) {
    function getFfluxSubmitUrl(form) {
        const ffluxSubmitUrlInput = Array.from(form.getElementsByTagName('input'))
            .find(i => i.name == 'fflux_submit_url' && i.type == 'hidden');
        if (!ffluxSubmitUrlInput) return undefined;
        return ffluxSubmitUrlInput.value;
    };
    function getFfluxLeadsFormId(form) {
        const ffluxLeadsFormIdInput = Array.from(form.getElementsByTagName('input'))
            .find(i => i.name == 'fflux_leads_form_id' && i.type == 'hidden');
        if (!ffluxLeadsFormIdInput) return undefined;
        return ffluxLeadsFormIdInput.value;
    };
    function getFormDataJson(form) {
        const formData = new FormData(form);
        const formDataJson = Array.from(formData).reduce((acc, cur) => {
            acc[cur[0]] = cur[1];
            return acc;
        }, {});
        return formDataJson;
    };
    function stripFormDataJson(formDataJson) {
        const ignoreKeyList = [
            'fflux_leads_form_id',
            'fflux_submit_url',
            'lpsSubmissionConfig',
            'thank-you-message'
        ];
        ignoreKeyList.forEach(key => delete formDataJson[key]);
    };

    // Ensure the form is configured for submission to FunnelFlux, and done so properly
    const ffluxSubmitUrl = getFfluxSubmitUrl(form);
    if (!ffluxSubmitUrl) return;
    const ffluxLeadsFormId = getFfluxLeadsFormId(form);
    if (!ffluxLeadsFormId) {
        console.error('Hidden field fflux_leads_form_id must be defined alongside fflux_submit_url');
        return;
    }

    // Obtain form data in JSON format, strip off ignore fields
    const formDataJson = getFormDataJson(form);
    stripFormDataJson(formDataJson);

    // Transform formDataJson as query params
    const url = new URL(ffluxSubmitUrl);
    Object.keys(formDataJson).forEach(key => url.searchParams.append(key, formDataJson[key]));

    // Perform form submission
    window.location.href = url.toString();
};
