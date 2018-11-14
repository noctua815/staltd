/*jshint esversion: 6 */

class Modal {
	constructor(selector, options) {
		this.CONFIG = {
			delay: 300,
			afterOpen: null,
			nextModal: null,
			backModal: null,
			checkForm: null,
			afterNext: null,
			afterMiss: null
		};
		Object.assign(this.CONFIG, options);
		this.$el = $(selector);
		this.options = options;
		this.DOM = {};
        this.DOM.$closeBtn = this.$el.find('.js-modal-close');
		this.init();
	}
	init() {
        this.DOM.$closeBtn.on('click', () => this.close());

		if (this.CONFIG.backModal) {
			this.backModal(this.CONFIG.backModal);
		}

		if (this.CONFIG.nextModal) {
			this.nextModal(this.CONFIG.nextModal);
		}
	}
	open(callback) {
		let $this = this;

        this.$el.fadeIn(this.CONFIG.delay, function() {
			closeModalOnBodyClick($this.$el);
		});

		$('body').addClass('modal-open');

		if (typeof callback === 'function') {
			callback();
		}

		if (this.CONFIG.checkForm) {
			this.CONFIG.checkForm.checkValidation('all');
		}
	}
    close(callback) {
        this.$el.fadeOut(this.CONFIG.delay, function() {
			$('body').removeClass('modal-open');
		});

		$('body').unbind('click');

        if (typeof callback === 'function') {
            callback();
        }
    }
	nextModal(selector) {
		let $nextModal = $(selector),
			$nextBtn = this.$el.find('.js-btn-next'),
			$missBtn = this.$el.find('.js-btn-miss');

		this.nextBtnHandler($nextBtn, $nextModal);

		if ($missBtn.length) {
			this.missBtnHandler($missBtn, $nextModal);
		}
	}
	backModal(selector) {
		let $backModal = $(selector),
			$backBtn = this.$el.find('.js-btn-back');

		this.backBtnHandler($backBtn, $backModal);
	}
	changeNextModal(selector) {
		this.nextBtnHandler(this.DOM.$nextBtn, $(selector));
	}
	changeBackModal(selector) {
		this.backBtnHandler(this.DOM.$backtBtn, $(selector));
	}
	nextBtnHandler($btn, $nextModal) {
		let $this = this;

		$btn.unbind('click');

		$btn.bind('click', function() {
			if ($this.CONFIG.checkForm) {
				if (!$this.CONFIG.checkForm.getValidationStatus()) {
					return false;
				}
			}

			$this.$el.fadeOut(0);
			$nextModal.fadeIn(0, function() {
				closeModalOnBodyClick($nextModal);
			});

			if ($this.CONFIG.afterNext) {
				$this.CONFIG.afterNext();
			}
		});

		this.DOM.$nextBtn = $btn;
	}
	openNewModal(selector, callback) {
		let $newModal = $(selector);

		if ($newModal.length) {
			this.$el.fadeOut(0);
			$newModal.fadeIn(0, function() {
				closeModalOnBodyClick($newModal);
			});

			if (typeof callback === 'function') {
				callback();
			}
		}
	}
	missBtnHandler($btn, $nextModal) {
		let $this = this;

		$btn.on('click', function() {
			$this.$el.fadeOut(0);
			$nextModal.fadeIn(0, function() {
				closeModalOnBodyClick($nextModal);
			});

			if ($this.CONFIG.afterMiss) {
				$this.CONFIG.afterMiss();
			}
		});
	}
	backBtnHandler($btn, $backModal) {
		let $this = this;

		$btn.unbind('click');
		$btn.bind('click', function() {
			$this.$el.fadeOut(0);
			$backModal.fadeIn(0, function() {
				closeModalOnBodyClick($backModal);
			});
		});

		this.DOM.$backtBtn = $btn;
	}
}

function closeModalOnBodyClick($modal) {
	$('body').unbind('click');

	$('body').bind('click', function(e) {
		if (!$(e.target).closest('.modal-dialog').length) {
			$modal.fadeOut(300, function() {
				$('body').removeClass('modal-open');
			});

			$(this).unbind(e);
		}
	});
}

window.Modal = Modal;
