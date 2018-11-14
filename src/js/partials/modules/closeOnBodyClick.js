// Close window/popup on body click
function closeOnBodyClick(e, closestSelector, callback) {
	$('body').bind('click', function(e) {
		if (!$(e.target).closest(closestSelector).length) {
			if (typeof callback === "function") {
				callback();
			}

			$(this).unbind(e);
		}
	});
}
