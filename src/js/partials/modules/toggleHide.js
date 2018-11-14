/*jshint esversion: 6 */

$.fn.toggleHide = function(speed) {
    let $switches = this,
        $hideBlocks = $('.js-toggle-hide');

    speed = speed === undefined ? 300 : speed;

    $switches.each(function() {
        let $btn = $(this),
            data = $btn.data('hide'),
            $changeText = $btn.find('.js-toggle-switch-text'),
            $hideBlock = $hideBlocks.filter(`[data-hide-block=${data}]`);

        $btn.on('click', function() {
            if ($hideBlock.is(':hidden')) {
                $hideBlock.fadeIn(speed);
                $changeText.text('Скрыть');

            } else {
                $hideBlock.fadeOut(speed);
                $changeText.text('Показать');
            }
        });
    });
};

$(document).ready(function() {
    $('.js-toggle-switch').toggleHide();
});
