'use strict';

function registerLoadMoreClickEvent() {
    var scripts = document.getElementsByTagName('script');
    // Only register the click event for the latest instance of this script
    // This prevents an existing click event from being re-registered
    for (var i = scripts.length - 1; i >= 0; i--) {
        var script = scripts[i];
        if (script.src.indexOf('load-more.js') !== -1) {
            var trigger = script.getAttribute('data-trigger-id');
            if (trigger) {
                var loadMoreElement = document.getElementById(trigger);
                if (loadMoreElement) {
                    loadMoreElement.addEventListener('click', function (event) {
                        event.preventDefault();
                        renderPageAndScroll(loadMoreElement);
                    });
                }
            }
            break;
        }
    }
}

function renderPageAndScroll(loadMoreElement) {
    var href = loadMoreElement.getAttribute('href');
    if (href) {
        var div = document.createElement('div');
        document.body.appendChild(div);
        var xhr = new XMLHttpRequest();

        xhr.onload = function () {
            div.innerHTML = this.response;
        };

        xhr.onreadystatechange = function () {
            // In local files, status is 0 upon success in Mozilla Firefox
            if (xhr.readyState === XMLHttpRequest.DONE) {
                var status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    // We need to use a timeout to delay execution, so as to allow the newly added content time to finish rendering
                    setTimeout(function () {
                        // Remove the existing load more element
                        loadMoreElement.parentNode.removeChild(loadMoreElement);
                        // Scroll to the start of the content
                        div.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                        });
                        // Since content has been inserted after the DOMContentLoaded event, we need to check the page for newly added load-more.js
                        registerLoadMoreClickEvent();
                    }, 100);
                }
            }
        };

        xhr.open('GET', href, true);
        xhr.send();
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
    registerLoadMoreClickEvent();
});
