// Эффект slideUp + fadeOut
$.fn.fadeThenSlideToggle = function(speed, easing, callback) {
	if (this.is(":hidden")) {
		return this.slideDown(speed, easing).fadeTo(speed, 1, easing, callback);
	} else {
		return this.fadeTo(speed, 0, easing).slideUp(speed, easing, callback);
	}
};
