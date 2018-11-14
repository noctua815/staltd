/*jshint esversion: 6 */

function initLoginActions() {
	// Forms
	let signinForm = new Form('#signin-form', {
			submitBtn: '#signin-submit'
		}),
		loginForm = new Form('#login-form', {
			submitBtn: '#login-submit'
		}),
		restoreForm = new Form('#restore-form', {
			submitBtn: '#restore-submit'
		});

	// Btns
	let $openBtn = $('.js-signin-modal'),
		$loginBtn = $('.js-login-btn'),
		$signinBtn = $('.js-signin-btn'),
		$restoreBtn = $('.js-restore-btn'),
		$signinSubmit = $('#signin-submit'),
		$loginSubmit = $('#login-submit'),
		$restoreSubmit = $('#restore-submit');

	// Modals
	let signInModal = new Modal('#signin-modal', {
			checkForm: signinForm
		}),
		loginModal = new Modal('#login-modal', {
			checkForm: loginForm
		}),
		restoreModal = new Modal('#restore-modal', {
			checkForm: restoreForm
		});

	$openBtn.on('click', function() {
		loginModal.open();
	});

	$loginBtn.on('click', function() {
		if ($(this).closest('#signin-form').length) {
			signInModal.openNewModal('#login-modal', () => {
				loginForm.checkValidation();
			});
		} else {
			restoreModal.openNewModal('#login-modal', () => {
				loginForm.checkValidation();
			});
		}
	});

	$signinBtn.on('click', function() {
		if ($(this).closest('#login-form').length) {
			loginModal.openNewModal('#signin-modal', () => {
				signinForm.checkValidation();
			});
		} else {
			restoreModal.openNewModal('#signin-modal', () => {
				signinForm.checkValidation();
			});
		}
	});

	$restoreBtn.on('click', function() {
		loginModal.openNewModal('#restore-modal', () => {
			restoreForm.checkValidation();
		});
	});

	$signinSubmit.on('click', function() {
		if ($(this).hasClass('btn--disable') || $(this).hasClass('btn--loading')) {
			return false;
		}

		$(this).addClass('btn--loading');
	});

	$loginSubmit.on('click', function() {
		if ($(this).hasClass('btn--disable') || $(this).hasClass('btn--loading')) {
			return false;
		}

		$(this).addClass('btn--loading');

		setTimeout(function() {
			// TODO удалить замену href
			window.location.href = '/account.html';
		}, 1500);
	});

	$restoreSubmit.on('click', function() {
		if ($(this).hasClass('btn--disable') || $(this).hasClass('btn--loading')) {
			return false;
		}

		$(this).addClass('btn--loading');

		// TODO message
	});

	// TODO сбор и отправка данных
}

$(function() {
	initLoginActions();
});
