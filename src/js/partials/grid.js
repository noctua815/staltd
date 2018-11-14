/*jshint esversion: 6 */

function initGrid() {
	let $grid = $('.js-grid').isotope({
		itemSelector: '.js-grid-item',
		percentPosition: true,
		masonry: {
			columnWidth: '.js-grid-sizer'
		},
		isInitLayout: false
	});

	$grid.isotope('on', 'arrangeComplete', function() {
		$grid.removeClass('grid--hidden');
	});

	$grid.isotope();
}

function initSliders() {
	var mySwiper = new Swiper('.js-slider', {
		slideClass: 'js-slide',
		speed: 400,
		spaceBetween: 0,
		pagination: {
			el: '.swiper-pagination',
			clickable: true
		},
	});
}

$(function() {
	initGrid();
	initSliders();
});
