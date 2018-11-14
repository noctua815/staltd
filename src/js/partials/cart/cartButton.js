/*jshint esversion: 6 */

function cartBtnActions() {
	let $cartBtn = $('#cart-btn'),
		$cartBtnIcon = $cartBtn.find('.js-cart-btn-dots'),
		$activeOrder = $cartBtn.find('.js-cart-btn-order'),
		$orders = $cartBtn.find('.js-cart-btn-orders'),
		$ordersItems = $orders.find('.js-cart-btn-orders-item'),
		$orderLink = $cartBtn.find('.js-cart-btn-order-link');

	let orderListModal = new Modal('#order-list-modal');

	function closeOrders() {
		$cartBtnIcon.removeClass('active');
		$orders.removeClass('opened');
	}

	function desktopOpening(event) {
		if ($cartBtnIcon.hasClass('active')) {
			$cartBtnIcon.removeClass('active');
			$orders.removeClass('opened');
		} else {
			$cartBtnIcon.addClass('active');
			$orders.addClass('opened');

			closeOnBodyClick(event, '#cart-btn', closeOrders);
		}
	}

	function mobileOpening() {
		orderListModal.open();
	}

	$cartBtnIcon.on('click', function(e) {
		let isMobile = detectmob();

		if (!isMobile) {
			desktopOpening(e);
		} else {
			mobileOpening();
		}

	});

	$ordersItems.on('click', function(e) {
		e.preventDefault();

		if ($(this).hasClass('active')) {
			return false;
		}

		let $a = $(e.target).closest('a');

		$ordersItems.filter('.active').removeClass('active');
		$(this).addClass('active');
		$activeOrder.find('.js-cart-btn-num').text($(this).find('.js-cart-btn-num').text());
		$orderLink.attr('href', $a.attr('href'));
		closeOrders();
	});

	$cartBtn
		.on('mousemove', function(e) {
			if ($(e.target).hasClass('js-cart-btn-dots') || $(e.target).closest('.cart-btn__orders').length) {
				$cartBtn.removeClass('hover');
			} else {
				$cartBtn.addClass('hover');
			}
		})
		.on('mouseleave', function() {
			$cartBtn.removeClass('hover');
		})
		.on('click', function(e) {
			if (!$(e.target).hasClass('js-cart-btn-dots') && !$(e.target).closest('.cart-btn__orders').length) {
				window.location.href = $orderLink.attr('href');
			}
		});
}

$(function() {
	cartBtnActions();
});
