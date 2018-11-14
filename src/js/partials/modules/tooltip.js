/*jshint esversion: 6 */

function initTooltip() {
	let isMobile = detectmob(),
		trigger = isMobile ? 'click' : 'mouseenter';

	$('.js-tooltip').each(function() {
		if (!$(this).attr('title').length) {
			$(this).attr('title', $(this).html());
		}
	});

	tippy('.js-tooltip', {
		trigger: trigger,
		theme: 'custom',
		placement: 'top',
		animateFill: 'false',
		animation: 'shift-away',
		duration: 300,
		hideonclick: false,
		interactive: true,
		dynamicTitle: true,
		arrow: false
	});
}

$(function() {
	initTooltip();
});
