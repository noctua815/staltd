/*jshint esversion: 6 */

function initSearch() {
	let $search = $('#search'),
		$searchForm = $('#search-form'),
		$searchFormContainer = $search.find('.js-search-form-container'),
		$searchInput = $searchForm.find('.js-search-input'),
		$searchBtn = $search.find('.js-search-btn'),
		$searchCancelBtn = $searchForm.find('.js-search-cancel'),
		$headerMenuBtns = $('.js-header-menu-btns'),
		escCounter = 0,
		keyupCounter = 0;

	$searchBtn.on('click', openSearch);
	$searchCancelBtn.on('click', closeSearch);

	function openSearch() {
		$headerMenuBtns.fadeOut(200);

		setTimeout(function() {
			$search.addClass('opened');
		}, 200);

		setTimeout(function() {
			$searchFormContainer.fadeIn();
			$searchInput[0].focus();
		}, 300);
	}

	function closeSearch() {
		$searchFormContainer.fadeOut(200);

		setTimeout(function() {
			$search.removeClass('opened');
		}, 200);

		setTimeout(function() {
			$headerMenuBtns.fadeIn();
			$searchForm[0].reset();
		}, 300);

		escCounter = 0;
		keyupCounter = 0;
	}

	$searchForm.bind('keydown', function(event) {
		keyupCounter++;

		// Enter
		if (event.keyCode === 13) {
			event.preventDefault();
			// TODO раскомментировать
			// $searchForm.submit();

			// TODO удалить замену href
			window.location.href = '/search.html';
		}

		// ESC
		if (event.keyCode === 27) {
			escCounter++;
			$searchInput.val('');

			if (escCounter >= 2 || keyupCounter === 1) {
				closeSearch();
			}

		} else {
			escCounter = 0;
		}
	});
}

function initSearchFilter() {
	if (!$('.js-search-filter').length) {
		return false;
	}

	let $filter = $('.js-search-filter'),
		$sections = $('.js-search-section');

	$filter.on('click', function() {
		if ($(this).hasClass('active')) {
			return false;
		}

		let $this = $(this),
			filter = $this.data('filter'),
			$filteringSections = filter === 'all' ? $sections : $sections.filter(`[data-filter="${filter}"]`),
			$grids = $filteringSections.find('.js-grid');

		$filter.removeClass('active');
		$this.addClass('active');

		$sections.removeClass('filter-animation')
			.fadeOut(300).promise().done(function() {
				$filteringSections.addClass('filter-animation').fadeIn(300);
			});

		setTimeout(function() {
			$grids.each(function() {
				let iso = Isotope.data($(this)[0]);

				iso.layout();
			})
		}, 350);

	});
}

$(function() {
	initSearch();
	initSearchFilter();
});
