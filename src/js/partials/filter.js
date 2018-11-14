/*jshint esversion: 6 */

function initFilter() {
	if (!$('.js-filter').length) {
		return false;
	}

	let categoryFilters = [],
		$filterMessage = $('.js-filter-message');

	let $grid = $('.js-filter-grid').isotope({
		itemSelector: '.js-filter-item',
		percentPosition: true,
		masonry: {
			columnWidth: '.js-grid-sizer'
		},

		filter: function() {
			let length = categoryFilters.length;
			if (!length) {
				return true;
			}
			let $this = $(this);

			for (let i = 0; i < length; i++) {
				let catFilter = categoryFilters[i];

				if (!$this.is('[data-category*=' + catFilter + ']')) {
					return false;
				}
			}

			return true;
		}
	});

	$grid.on('arrangeComplete', function(event, filteredItems) {
		if (!filteredItems.length) {
			$filterMessage.fadeIn(300);
		}
	});

	let $filters = $('.js-filter'),
		$tags = $('.js-tag');

	$filters.on('click', function() {
		if ($(this).hasClass('active')) {
			return false;
		}

		$filters.removeClass('active');
		$(this).addClass('active');

		filtering();
	});

	$tags.on('click', function() {
		filtering();
	});

	function filtering() {
		categoryFilters = [];
		let mainFilterValue = $filters.filter('.active').data('filter');

		if ($filterMessage.is(':visible')) {
			$filterMessage.fadeOut(300);
		}

		if (mainFilterValue !== 'all') {
			categoryFilters.push(mainFilterValue);
		}

		$tags.filter('.selected').each(function() {
			categoryFilters.push($(this).data('filter'));
		});

		$grid.isotope();
	}
}

$(function() {
	initFilter();
});
