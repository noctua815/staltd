/*jshint esversion: 6 */

function declOfNum(number, titles) {
	let cases = [2, 0, 1, 1, 1, 2];
	return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

//Custom input file

$.fn.inputFile = function() {
	let $files = this;

	$files.each(function() {
		let $item = $(this),
			$input = $item.find('.js-file-input'),
			$label = $item.find('.js-file-label'),
			$delBtn = $item.find('.js-file-del'),
			defaultText = $label.text();

		$input.on('change', function(e) {
			let fileName = '';

			if (this.files && this.files.length > 1) {
				let fileDeclaration = declOfNum(this.files.length, ['файл', 'файла', 'файлов']);
				fileName = `${this.files.length} ${fileDeclaration} выбрано`;
			} else {
				fileName = e.target.value.split('\\').pop();
			}

			if (fileName.length) {
				$item.addClass('is-active');
				$label.text(fileName);
			}
		});

		$delBtn.on('click', function() {
			$input.val('');
			$label.text(defaultText);
			$item.removeClass('is-active');

			if (!/safari/i.test(navigator.userAgent)) {
				$input.prop('type', '');
				$input.prop('type', 'file');
			}
		});
	});

};

$(document).ready(function() {
	$('.js-file').inputFile();
});
