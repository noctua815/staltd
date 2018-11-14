/*jshint esversion: 6 */

function initSlidedown() {
    let $slidedown = $('.js-slidedown');

    $slidedown.each(function() {
        let $this = $(this),
            $slSwitch = $this.find('.js-slidedown-switch'),
            $slBody = $this.find('.js-slidedown-body'),
            $switchText = $this.find('.js-slidedown-text'),
            closedText = $slSwitch.data('closed-text') ? $slSwitch.data('closed-text') : $slSwitch.text(),
            openedText = $slSwitch.data('opened-text') ? $slSwitch.data('opened-text') : $slSwitch.text();

        $slSwitch.on('click', function() {
            if (!$this.hasClass('opened')) {
                $this.addClass('opened');
                $slBody.slideDown(200, function() {
                    $switchText.text(openedText);
                });
            } else {
                $this.removeClass('opened');
                $slBody.slideUp(200, function() {
                    $switchText.text(closedText);
                });
            }
        });
    });

}

$(function() {
	initSlidedown();
});
