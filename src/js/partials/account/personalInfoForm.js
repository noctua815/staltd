/*jshint esversion: 6 */

function initPersonalForm() {
	if (!$('#personal-info').length) {
		return false;
	}

	let $form = $('#personal-info'),
		$fields = $form.find('.js-field'),
		$radioBtns = $fields.filter('[type="radio"]'),
		$saveBtn = $('#personal-info-submit'),
		$legalInfoSection = $('.js-legal-info-section'),
		$addressFields = $fields.filter('.js-address-field'),
		$copyBtns = $('.js-address-copy'),
		dump = getFieldsValue($fields),
		newChanges,
		form = new Form('#personal-info', {
			submitBtn: '#personal-info-submit',
			ignoreFirstLoad: true,
			fieldsHandler: function() {
				checkChanges();
			}
		});

	function init() {
		changeClientType();
		saveChanges();
		copyAddress();
	}

	function changeClientType() {
		$radioBtns.on('change', function() {
			let type = $(this).val();

			if (type === 'legal') {
				$legalInfoSection.find('.js-field').attr('type', 'text');
				$legalInfoSection.fadeIn(300);
			} else {
				$legalInfoSection.fadeOut(300, function() {
					$legalInfoSection.find('.js-field').attr('type', 'hidden');
				});

				$copyBtns.filter('[data-address-id="delivery-adress"]').fadeOut();
			}

			$radioBtns.attr('checked', false);
			$(this).attr('checked', true);

			setTimeout(function() {
				form.checkValidation('all');
				checkChanges();
			}, 330);

		});
	}

	function saveChanges() {
		$saveBtn.on('click', function(e) {
			e.preventDefault();

			form.checkValidation('all', function() {
				dump = newChanges;
				$saveBtn.addClass('btn--disable');

				// ajax of reload page
			});
		});
	}

	function copyAddress() {
		$addressFields.on('change', function() {
			let $field = $(this),
				id = $field.attr('id');

			if ($field.val().length !== 0) {
				$copyBtns.filter(`[data-address-id=${id}]`).fadeIn(300);
			} else {
				$copyBtns.filter(`[data-address-id=${id}]`).fadeOut(300);
			}
		});

		$copyBtns.on('click', function() {
			let $fields = $addressFields.filter(`#${$(this).data('address-id')}`),
				address = $fields.val();

			$addressFields.each(function() {
				$(this).val(address)
					.closest('.form-field').addClass('input-filled');
			})

			$(this).fadeOut(300);
		});
	}

	function getFieldsValue() {
		let array = [];

		$fields.each(function(index) {
			if ($(this).attr('type') === 'radio' && $(this).attr('checked') !== 'checked') {
				return;
			} else {
				array.push($(this).val());
			}
		});

		return array;
	}

	function checkChanges() {
		let result,
			isValid = form.getValidationStatus();

		newChanges = getFieldsValue($fields);
		result = newChanges.diff(dump);

		if (result.length && isValid) {
			$saveBtn.removeClass('btn--disable');
		} else {
			$saveBtn.addClass('btn--disable');
		}
	}

	init();
}

$(function() {
	initPersonalForm();
});
