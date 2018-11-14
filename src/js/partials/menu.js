/*jshint esversion: 6 */

function headerActions() {
	let $menuBtn = $('.js-menu-btn'),
		$headerMenu = $('#header-menu');

	$menuBtn.each(function() {
		let $btn = $(this),
			id = $btn.data('menu-id'),
			$menu = $(`#${id}`),
			isHover = false;

		$headerMenu
			.on('mousemove', function(e) {
				let isMobile = detectmob();
				if (isMobile) {
					return false;
				}

				let $target = $(e.target);

				if ($target.closest(`.js-menu-btn[data-menu-id="${id}"]`).length) {
					isHover = true;

					setTimeout(function() {
						if (isHover) {
							$menu.addClass('opened');
						}
					}, 500);

					return;
				}

				if (!$target.closest('a[data-menu-id="catalog-menu"]').length && !$target.closest('.catalog-menu').length) {
					$menu.removeClass('opened');
					isHover = false;
				}
			})
			.on('mouseleave', function(e) {
				let isMobile = detectmob();
				if (isMobile) {
					return;
				}
				$menu.removeClass('opened');
				isHover = false;
			});

		$btn.on('click', function(e) {
			let isMobile = detectmob();
			if (!isMobile) {
				return;
			}

			if (!$menu.hasClass('opened')) {
				$btn.addClass('active');
				$menu.addClass('opened');
				closeOnBodyClick(e, '.menu-btn', function() {
					$btn.removeClass('active');
					$menu.removeClass('opened');
				});
			} else {
				$btn.removeClass('active');
				$menu.removeClass('opened');
			}

		});

	});
}

$(function() {
	headerActions();
});
