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

    // Modify form to POST to FunnelFlux w/ form-data on submit
    form.action = ffluxSubmitUrl;
    form.submit();
};

/**
 * Notes for documentaion
 * - make sure Instapage's Form's Submission's Destination & Thank-You Message fields are set to blank
 * - You can either have a leads form, OR a multi-part form. not both!
 */