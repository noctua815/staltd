/*jshint esversion: 6 */

function initTags() {
	$('.js-tag').on('click', function() {
        $(this).toggleClass('selected');
    });
}

$(function() {
	initTags();
});
