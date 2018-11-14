/*jshint esversion: 6 */

class Form {
	constructor(selector, options) {
		this.CONFIG = {
			validation: true,
			ignoreFirstLoad: false
		};
		Object.assign(this.CONFIG, options);
		this.$el = $(selector);
		this.options = options;
		this.params = {};
		this.DOM = {};
		this.DOM.$fields = this.$el.find('.js-field');
		this.init();
	}
	init() {
		this.initFieldsAnimation();

		if (this.CONFIG.validation) {
			this.initValidation();
			this.fieldsHandler();
		}
	}
	initFieldsAnimation() {
		let $textFields = this.DOM.$fields.filter('[type="text"]'),
			$passwordFields = this.DOM.$fields.filter('[type="password"]');

		$.merge($textFields, $passwordFields);

		$textFields.each(function() {
			let $field = $(this),
				$wrapper = $field.closest('.form-field');

			if ($field.val().length !== 0) {
				$wrapper.addClass('input-filled');
			}

			$field
				.on('focus', function() {
					$wrapper.removeClass('input-filled').addClass('input-focus');
				})
				.on('blur', function() {
					if ($(this).val().length !== 0) {
						$wrapper.addClass('input-filled');
					}

					$wrapper.removeClass('input-focus');
				});
		});

		this.$el.addClass('showed-label');
	}
	initValidation() {
		this.validator = this.$el.validate({
			errorPlacement: function(error, element) {
				return true;
			}
		});

		this.DOM.$submitBtn = $(this.CONFIG.submitBtn)
		this.setFieldRules();
	}
	setFieldRules() {
		let $this = this;

		this.DOM.$fields.each(function(index) {
			let $field = $(this),
				type = $field.data('type'),
				required = $field.data('required');

			if (required) {
				$field.rules("add", {
					required: true
				});
			}

			switch (type) {
				case 'phone':
					$field.rules("add", {
						isPhone: true
					});
					break

				case 'email':
					$field.rules("add", {
						isEmail: true
					});
					break

				case 'digits':
					$field.rules("add", {
						digits: true
					});
					break
				default:
					break
			}

			if (index === $this.DOM.$fields.length - 1) {
				$this.checkValidation('all');
			}
		});
	}
	fieldsHandler(callback) {
		let $this = this,
			timeKeyup = 0,
			keyTimeout = 500;

		this.DOM.$fields
			.on('keyup', function() {
				timeKeyup = (new Date()).getTime();

				setTimeout(function() {
					let timePause = (new Date()).getTime();

					if (timePause - timeKeyup >= keyTimeout) {
						$this.checkValidation('required');

						if (typeof $this.CONFIG.fieldsHandler === "function") {
							$this.CONFIG.fieldsHandler();
						}
					}
				}, keyTimeout);
			})
			.on('blur', function() {
				$this.checkValidation('valid');
			});

		this.DOM.$fields.filter('[type="checkbox"]').on('change', function() {
			$this.checkValidation('required');
		})
	}
	getErrorList(list, type) {
		let newList = [];

		for (var i = 0; i < list.length; i++) {
			let error = list[i];

			if (type === 'required' && error.method === 'required') {
				newList.push(error);
			}

			if (type === 'valid' && (error.method === 'isEmail' || error.method === 'isPhone' || error.method === 'digits')) {
				newList.push(error);
			}
		}

		return newList;
	}
	checkValidation(type, callback) {
		type = type === undefined ? 'all' : type;
		let isValid = this.$el.valid();

		if (type === 'all') {
			this.checkErrors(this.validator.errorList, type);
		} else {
			let list = this.getErrorList(this.validator.errorList, type);
			this.checkErrors(list, type);
		}

		if (!isValid) {
			this.DOM.$submitBtn.addClass('btn--disable');
			return false;
		} else if (!this.CONFIG.ignoreFirstLoad) {
			this.DOM.$submitBtn.removeClass('btn--disable');
		}

		this.CONFIG.ignoreFirstLoad = false;

		if (typeof callback === "function") {
			callback();
		}
	}
	checkErrors(errorList, type) {
		let requiredArr = [],
			validateArr = [];

		for (let i = 0; i < errorList.length; i++) {
			let error = errorList[i],
				dataName = $(error.element).parent().find('[data-error-name]'),
				el = {
					name: dataName.length ? dataName.data('error-name') : $(error.element).prev().text().toLowerCase(),
					id: $(error.element).attr('id')
				};

			if (error.method === 'required') {
				requiredArr.push(el);
			} else {
				validateArr.push(el);
			}
		}

		this.showErrors(requiredArr, validateArr, type);
	}
	showErrors(requiredArray, validateArray, type) {
		let $requiredErrorRow = this.$el.find('.js-form-error .js-form-error-requered'),
			$validateErrorRow = this.$el.find('.js-form-error .js-form-error-validate');

		if (type === 'all') {
			this.createErrors(requiredArray, $requiredErrorRow);
			this.createErrors(validateArray, $validateErrorRow);
		} else if (type === 'valid') {
			this.createErrors(validateArray, $validateErrorRow);
		} else if (type === 'required') {
			this.createErrors(requiredArray, $requiredErrorRow);
		}
	}
	createErrors(array, $row) {
		let $errorElTemplate = $('<label />', {
			class: 'form-error__field'
		});

		if (array.length) {
			let $messageBlock = $row.find('.js-form-error-fields');

			$messageBlock.html('');

			for (let i = 0; i < array.length; i++) {
				let error = array[i],
					$errorEl = $errorElTemplate.clone();

				$errorEl.attr('for', error.id).text(error.name);
				$messageBlock.append($errorEl);
			}

			$row.fadeIn('fast').addClass('active');
		} else if ($row.not(':hidden')) {
			$row.fadeOut('fast', function() {
				$(this).removeClass('active');
			});
		}
	}
	getValidationStatus() {
		return this.$el.valid();
	}
	getFormData() {
		let formData = new FormData(this.$el[0]);
		return formData;
	}
	getJSON() {
		var o = {};
        var a = this.$el.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
	}
	serialize() {
		return this.$el.serialize();
	}
}

window.Form = Form;

// Методы валидации почты, телефона
function initValidationMethods() {
	$.validator.addMethod('isEmail', function(value, element) {
		return this.optional(element) || /^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i.test(value);
	}, 'Пожалуйста, введите e-mail');

	$.validator.addMethod('isPhone', function(value, element) {
		return this.optional(element) || /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(value);
	}, 'Пожалуйста, введите телефон');
}

// Добавление масок ввода
function initMasks() {
	$('.js-field[data-type="phone"]').inputmask('+7 (999) 999-99-99', {
		showMaskOnFocus: true,
		showMaskOnHover: false,
		clearMaskOnLostFocus: true
	});
}

// Поиск различий в массиве
Array.prototype.diff = function(a) {
	return this.filter(function(i) {
		return a.indexOf(i) < 0;
	});
};

$(function() {
	initValidationMethods();
	initMasks();
});
