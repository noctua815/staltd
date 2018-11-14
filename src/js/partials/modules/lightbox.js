function initPhotoSwipe() {
	$(".js-lightbox").fancybox({
		animationDuration : 300,
		buttons: [
			'slideShow',
			'fullScreen',
			'zoom',
			'close'
		],
	});
}

$(function() {
	initPhotoSwipe();
});
