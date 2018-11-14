/*jshint esversion: 6 */

function initPlayer() {
	let $videoBlockes = $('.js-video-block');

	$videoBlockes.each(function() {
		let $block = $(this),
			$player = $block.find('.js-player');

		$player.YTPlayer({
			videoURL: $player.data('video-url'),
			containment: 'self',
			startAt: 0,
			mute: false,
			autoPlay: false,
			loop: false,
			opacity: 1
		});

		$player.on("YTPPause", function(e) {
			$block.removeClass('playing');
		});

		$block.on('click', function(e) {
			let $target = $(e.target);

			if ($target.closest('.mb_YTPBar').length) {
				return;
			}

			if (!$(this).hasClass('playing')) {
				$(this).addClass('playing');
				$player.YTPPlay();
			} else {
				$(this).removeClass('playing');
				$player.YTPPause();
			}

		});

	});
}

$(function() {
	initPlayer();
});
