/*jshint esversion: 6 */

function initOrderSending() {
	// Forms
	let contactInfoForm = new Form('#order-contact-info', {
			submitBtn: '#order-contact-info-submit'
		}),
		companyInfoForm = new Form('#order-company-info', {
			submitBtn: '#order-company-info-submit'
		}),
		bankInfoForm = new Form('#order-bank-info', {
			submitBtn: '#order-bank-info-submit'
		}),
		deliveryInfoForm = new Form('#order-delivery-info', {
			submitBtn: '#order-submit'
		});

	let $orderSendBtn = $('#order-send'),
		$orderSubmit = $('#order-submit'),
		$typeClientBtns = $('.js-field[type="radio"]'),
		startModal = new Modal('#start-modal', {
			nextModal: '#contact-modal',
			afterNext: function() {
				contactInfoForm.checkValidation();
			}
		}),
		contactModal = new Modal('#contact-modal', {
			backModal: '#start-modal',
			nextModal: '#company-modal',
			checkForm: contactInfoForm
		}),
		companyModal = new Modal('#company-modal', {
			backModal: '#contact-modal',
			nextModal: '#bank-modal',
			checkForm: companyInfoForm,
			afterMiss: function() {
				companyInfoForm.$el.addClass('form-miss');
			},
			afterNext: function() {
				companyInfoForm.$el.removeClass('form-miss');
			}
		}),
		bankModal = new Modal('#bank-modal', {
			backModal: '#company-modal',
			nextModal: '#delivery-modal',
			checkForm: bankInfoForm,
			afterMiss: function() {
				bankInfoForm.$el.addClass('form-miss');
			},
			afterNext: function() {
				bankInfoForm.$el.removeClass('form-miss');
			}
		}),
		delieryModal = new Modal('#delivery-modal', {
			backModal: '#bank-modal',
			nextModal: '#order-completed-modal'
		}),
		completedModal = new Modal('#order-completed-modal');

	$orderSendBtn.on('click', function() {
		startModal.open();
	});

	$typeClientBtns.on('change', function() {
		let type = $(this).val();

		if (type === 'legal') {
			contactModal.changeNextModal('#company-modal');
			delieryModal.changeBackModal('#bank-modal');
			companyInfoForm.$el.removeClass('form-miss');
			bankInfoForm.$el.removeClass('form-miss');
		} else {
			contactModal.changeNextModal('#delivery-modal');
			delieryModal.changeBackModal('#contact-modal');
			companyInfoForm.$el.addClass('form-miss');
			bankInfoForm.$el.addClass('form-miss');
		}

		$typeClientBtns.attr('checked', false);
		$(this).attr('checked', true);
	});

	$('#order-pickup').on('change', function() {
		if ($(this).prop('checked')) {
			$('#delivery-address').closest('.form-field').addClass('field-disable');
		} else {
			$('#delivery-address').closest('.form-field').removeClass('field-disable');
		}
	})

	$orderSubmit.on('click', function() {
		let $activeForms = $('.modal form.form').not('.form-miss'),
			orderInfo = [];

		$activeForms.each(function() {
			let $form = $(this),
				id = $form.attr('id'),
				form = {};

			$form.find('.field-disable').val('');
			form.id = id;
			form.data = $form.serializeArray();
			orderInfo.push(form);
		});

		console.log(orderInfo);
	})
}

$(function() {
	if ($('#order-send').length) {
		initOrderSending();
	}
});
