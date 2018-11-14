/*jshint esversion: 6 */

function initSitySelect() {
	let $sitySelect = $('#sity-select'),
		$sitySelectHead = $sitySelect.find('.js-sity-select-head'),
		$sitySelectBody = $sitySelect.find('.js-sity-select-body'),
		sityModal = new Modal('#sity-modal');

	$sitySelectHead.on('mouseenter', function(e) {
		let isMobile = window.innerWidth <= 1100;

		if (!isMobile) {
			openDesktop();
		}
	});

	$sitySelect.on('mouseleave', function() {
		closeDesktop();
	});

	$sitySelectHead.on('click', function() {
		let isMobile = window.innerWidth <= 1100;

		if (isMobile) {
			sityModal.open();
		}
	});

	function openDesktop() {
		$sitySelect.addClass('opened');
		$sitySelectBody.fadeIn(200);
	}

	function closeDesktop() {
		$sitySelect.removeClass('opened');
		$sitySelectBody.fadeOut(200);
	}
}

$(function() {
	initSitySelect();
});
