/*jshint esversion: 6 */
function initBreadcrumbsList() {
	let $lists = $('.js-breadcrumbs-list'),
		categoryModal = new Modal('#category-list-modal'),
		productModal = new Modal('#product-list-modal');

	$lists.each(function() {
		let $list = $(this),
			$btn = $list.find('.js-breadcrumbs-list-head'),
			$items = $list.find('.js-breadcrumbs-list-items'),
			dataModal = $list.data('list');

		$btn.on('mouseenter', function() {
			let isMobile = detectmob();

			if ($list.hasClass('opened')) {
				return false;
			}

			if (!isMobile) {
				let $openedLists = $lists.filter('.opened');

				if ($openedLists.length) {
					$openedLists.find('.js-breadcrumbs-list-items').fadeOut(250, function() {
						$openedLists.removeClass('opened');

						$list.addClass('opened');
						$items.fadeIn(250);
					});
				} else {
					$list.addClass('opened');
					$items.fadeIn(250);
				}
			}
		});

		$list.on('mouseleave', function() {
			let isMobile = detectmob();

			if (!isMobile) {
				$list.removeClass('opened');
				$items.fadeOut(250);
			}
		})

		$btn.on('click', function(e) {
			let isMobile = detectmob();

			if (isMobile && typeof dataModal !== undefined) {
				if (dataModal === 'category') {
					categoryModal.open();
				} else if (dataModal === 'product') {
					productModal.open();
				}
			}
		});
	});
}

$(function() {
	initBreadcrumbsList();
});
