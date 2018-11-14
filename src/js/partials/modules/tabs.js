/*jshint esversion: 6 */

// Tabs
(function(Module, $) {
	let tabs = $('.js-tabs'),
		animationTime = 250;

	function init() {
		initLayout();
		handlerTabs();
	}

	function initLayout() {
		tabs.each(function() {
			let $this = $(this),
				$tabsBody = $this.find('.js-tabs-body');

			$this.find('.js-tabs-trigger').eq(0).addClass('is-active');
			$this.find('.js-tabs-item').eq(0).fadeIn(animationTime, function() {
				$(this).addClass('is-active');
			});
		});
	}

	function handlerTabs() {
		tabs.each(function(index) {
			var $this = $(this),
				$tabsBody = $this.find('.js-tabs-body').eq(0),
				$triggers = $this.find('.js-tabs-triggers').eq(0).find('.js-tabs-trigger'),
				$items = $tabsBody.eq(0).children('.js-tabs-item'),
				isWork = false;

			$triggers.on('click', function() {
				if ($(this).hasClass('is-active') || isWork) {
					return false;
				}

				isWork = true;

				var $trigger = $(this),
					index = $triggers.index($trigger),
					$item = $items.eq(index);

				$tabsBody.height($tabsBody.outerHeight(true));
				$triggers.removeClass('is-active');
				$trigger.addClass('is-active');

				$items.filter('.is-active').fadeOut(animationTime, function() {
					$(this).removeClass('is-active');
				});

				setTimeout(function() {
					var height = $item.outerHeight(true);

					$tabsBody.height(height);
					$item.fadeIn(animationTime, function() {
						$item.addClass('is-active');
					});
				}, animationTime - 50);

				setTimeout(function() {
					$tabsBody.height('auto');

					if ($item.find('.js-map').length) {
						GoogleMap.initSimpleMap($item.find('.js-map'));
					}

					isWork = false;
				}, animationTime * 2);

			});
		});
	}

	$.extend(Module, {
		init: function() {
			init();
		}
	});
}(window.tabs = window.tabs || {}, $));

$(function() {
	tabs.init();
});
