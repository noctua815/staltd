/*jshint esversion: 6 */

// Objects page actions
function initSlider() {
	let thumbItem = Math.ceil($('.js-photo-slider-wr').width() / 100);

	$('#photo-slider').lightSlider({
        gallery:true,
        autoWidth: false,
        item:1,
		thumbItem:thumbItem,
        slideMargin: 0,
		thumbMargin: 10,
		speed: 500,
        enableDrag: true,
        currentPagerPosition:'left',
        onSliderLoad: function(el) {
			el.removeClass('visuallyhidden');

            el.lightGallery({
               selector: '#photo-slider .lslide',
			   download: false
           });
        }
    });
}

$(function() {
	initSlider();
});
