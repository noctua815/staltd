/*jshint esversion: 6 */

(function(Module, $) {
	let $form = $('#service-form'),
		$fields = $form.find('.js-field'),
		$radioBtns = $fields.filter('[type="radio"]'),
		form = new Form('#service-form');

	let $recomSection = $('#recom-product-section'),
		$recomSectionList = $('#recom-product-list');

	function serviceAdding() {

	}

	$.extend(Module, {
		init: function() {
			if (!$('#service-form').length) {
				return false;
			}
		},
		addService: function($cartBtn) {
			$form.addClass('disable');
			Module.getRecom();
		},
		removeService: function($cartBtn) {
			$form.removeClass('disable');
		},
		getData: function() {
			return form.getJSON();
		},
		getRecom: function() {
			let data = form.getFormData(); // в формате FormData
			// let data = Module.getData(); // в формате JSON

			// Пример получения рекомендованных товаров
			$.ajax({
				type: 'get',
				url: '/php/recomProducts.php',
				// data: data,
				dataType: 'html',
				success: function(response) {
					$recomSectionList.html(response);
					$recomSection.fadeIn();
					OrderItems.initItems($recomSectionList.find('.js-oi'));
				}
			});
		}
	});
}(window.Service = window.Service || {}, $));

$(function() {
	Service.init();
});
