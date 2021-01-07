window.instapageFormSubmitSuccess = function (form) {
    const ffluxSubmitUrl = getFfluxSubmitUrl(form);
    console.log(ffluxSubmitUrl);
    if (!ffluxSubmitUrl) return;
    const ffluxLeadsFormId = getFfluxLeadsFormId(form);
    console.log(ffluxLeadsFormId);
    if (!ffluxLeadsFormId) {
        console.error('Hidden field fflux_leads_form_id must be defined alongside fflux_submit_url');
        return;
    }

    console.log('here');
    // window.location.href = 'https://flux2.astrologyanswers.com/?flux_action=1&flux_f=1129646899613600679&flux_ffn=1129647158147156679&wat=hello';
};

function getFfluxSubmitUrl(form) {
    const ffluxSubmitUrlInput = Array.from(form.getElementsByTagName('input'))
        .find(i => i.name == 'fflux_submit_url' && i.type == 'hidden');
    if (!ffluxSubmitUrlInput) return undefined;
    return ffluxSubmitUrlInput.value;
}

function getFfluxLeadsFormId(form) {
    const ffluxLeadsFormIdInput = Array.from(form.getElementsByTagName('input'))
        .find(i => i.name == 'fflux_leads_form_id' && i.type == 'hidden');
    if (!ffluxLeadsFormIdInput) return undefined;
    return ffluxLeadsFormIdInput.value;
}

