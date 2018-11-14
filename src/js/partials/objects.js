/*jshint esversion: 6 */

// Main page actions
function initObjectsActions() {
	let $viewTypeBtns = $('.js-view-type'),
		$objectsBody = $('.js-objects-body'),
		$objectSection = $('.js-objects-section'),
		$objects = $objectsBody.find('.js-object'),
		objects = [],
		categoryFilters = [],
		viewType,
		$filterSelects = $('.js-objects-filter'),
		$grid = $('.js-objects-grid').isotope({
			itemSelector: '.js-object',
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

				if (($this.is('[data-service*=' + categoryFilters[0] + ']') || categoryFilters[0] === 'all') &&
					($this.is('[data-region*=' + categoryFilters[1] + ']') || categoryFilters[1] === 'all') &&
					($this.is('[data-year*=' + categoryFilters[2] + ']') || categoryFilters[2] === 'all')) {
					return true;
				}

				return false;
			}
		});

	$viewTypeBtns.on('click', function() {
		if ($(this).hasClass('is-active')) {
			return false;
		}

		let $btn = $(this),
			dataView = $(this).data('view-type'),
			$section = $objectSection.filter(`[data-type="${dataView}"]`);

		$viewTypeBtns.removeClass('is-active');
		$btn.addClass('is-active');

		changeObjectSection($section, dataView);
	});

	$filterSelects.on('change', function() {
		objectsFiltering($(this).data('type'), $(this).val());
	});

	// Get objects info for creating markers
	function getObjectsInfo() {
		$objects.each(function(index) {
			let $this = $(this);

			objects.push({
				id: index,
				title: $this.find('.object-item__title').text(),
				coord: $this.data('coord').split(','),
				size: $this.data('size'),
				link: $this.find('a').attr('href'),
				service: $this.data('service'),
				region: $this.data('region'),
				year: parseInt($this.data('year'))
			});
		});
	}

	// Init layout
	function initLayout() {
		$viewTypeBtns.eq(0).addClass('is-active');
		$objectSection.eq(0).fadeIn(300).addClass('is-active');

		viewType = $viewTypeBtns.eq(0).data('view-type');

		getObjectsInfo();
		GoogleMap.createMarkers(objects);
		objectsFiltering();
	}

	// Change grid type
	function changeObjectSection($section, viewType) {
		$objectsBody.height($objectsBody.outerHeight(true));

		$objectSection.filter('.is-active').fadeOut(function() {
			$(this).removeClass('is-active');
		});

		setTimeout(function() {
			var height = $section.outerHeight(true);

			$objectsBody.height(height);
			$section.fadeIn(function() {
				$section.addClass('is-active');
			});
			$grid.isotope('layout');
		}, 300);

		setTimeout(function() {
			$objectsBody.height('auto');

			if (viewType === 'map') {
				GoogleMap.refreshObjMap();
			}
		}, 700);

		viewType = $section.data('type');
	}

	// Filtering
	function objectsFiltering() {
		let serviceValue = $('.js-select[data-type="service"]').val(),
			regionValue = $('.js-select[data-type="region"]').val(),
			yearValue = $('.js-select[data-type="year"]').val() === 'all' ? 'all' : parseInt($('.js-select[data-type="year"]').val());

		categoryFilters = [];

		categoryFilters.push(serviceValue);
		categoryFilters.push(regionValue);
		categoryFilters.push(yearValue);

		GoogleMap.filteringMarkers(categoryFilters);
		$grid.isotope();
	}

	initLayout();
}

// Objects page actions
function initObjectActions() {
	let thumbItem = Math.ceil($('.js-object-slider-wr').width() / 100);

	$('#object-slider').lightSlider({
        gallery:true,
        item:1,
		thumbItem:thumbItem,
        slideMargin: 0,
		thumbMargin: 0,
		speed: 500,
        enableDrag: true,
        currentPagerPosition:'left',
		auto: true,
		pauseOnHover: true,
		pause: 4000,
		loop: true,
        onSliderLoad: function(el) {
			el.removeClass('visuallyhidden');
        }
    });
}

$(function() {
	initObjectActions();
});
