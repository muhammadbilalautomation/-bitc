(function () {
    'use strict';

    document.querySelectorAll('[data-kgosi-frame]').forEach(function (frame) {
        var loading = frame.parentElement.querySelector('[data-kgosi-loading]');
        frame.addEventListener('load', function () {
            if (loading) {
                loading.classList.add('is-hidden');
            }
        });
    });
}());
