window.addEventListener('DOMContentLoaded', (event) => {
    let _checkoutElementId = 'aa-checkout-div';
    if (document.querySelector(`#${_checkoutElementId}`)) {
        renderCheckoutForm(_checkoutElementId);
    }
});