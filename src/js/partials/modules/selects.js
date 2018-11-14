/*jshint esversion: 6 */

function customSelect(element) {
	element.each(function() {
		let $this = $(this),
			numberOfOptions = $(this).children('option').length;

		$this.addClass('select-hidden');
		$this.wrap('<div class="select"></div>');
		$this.after('<div class="select-styled"></div>');

		let $select = $this.closest('div.select'),
			$styledSelect = $this.next('div.select-styled');

		$styledSelect.text($this.children('option:selected').text());

		let $list = $('<ul />', {
			'class': 'select-options'
		}).insertAfter($styledSelect);

		for (let i = 0; i < numberOfOptions; i++) {
			$('<li />', {
				text: $this.children('option').eq(i).text(),
				rel: $this.children('option').eq(i).val(),
				class: $this.children('option').eq(i).attr('selected') ? 'is-selected' : ''
			}).appendTo($list);
		}

		$styledSelect.on('click', function(e) {
			e.stopPropagation();

			$('div.select.is-active').not($select).each(function() {
				$(this).removeClass('is-active');
			});

			$select.toggleClass('is-active');
			closeOnBodyClick(e, '.select', function() {
				$select.removeClass('is-active');
			});
		});

		$list.children('li').on('click', function(e) {
			e.stopPropagation();
			e.preventDefault();

			if ($(this).hasClass('is-selected')) {
				return false;
			}

			$list.children('li').removeClass('is-selected');
			$(this).addClass('is-selected');

			$styledSelect.text($(this).text());
			$select.removeClass('is-active');
			$this.val($(this).attr('rel'));
			$this.change();
		});
	});
}



$(function() {
	customSelect($('.js-select'));
});
