/*jshint esversion: 6 */

// Order actions
(function (Module, $) {
    let order = Storage.getStorage('order') ? Storage.getStorage('order') : {
        simple: [],
        productsLp: [],
        elements: [],
        services: []
    };

    // Cart button info
    let $cartBtn = $('#cart-btn'),
        $counter = $cartBtn.find('.js-cart-btn-count'),
        $counterProduct = $cartBtn.find('.js-cart-btn-count-products'),
        $counterServices = $cartBtn.find('.js-cart-btn-count-services');

    function addToOrder($product) {
        let data = getData($product.data('params')),
            type = $product.data('type');

        if (type === 'simple') {
            order.simple = addTo(data, order.simple);
        }

        if (type === 'product-lp') {
            order.productsLp = addTo(data, order.productsLp);
        }

        if (type === 'elements') {
            order.elements = addTo(data, order.elements);
        }

        if (type === 'service') {
            let serviceData = Service.getData();
            Object.assign(data, serviceData);
            order.services = addTo(data, order.services);
            Service.addService($cartBtn);
        }

        Storage.addStorage('order', order);
        checkCartBtnInfo();
    }

    function removeFromOrder($product) {
        let data = getData($product.data('params')),
            type = $product.data('type');

        if (type === 'simple') {
            order.simple = removeFrom(data.id, order.simple);
        }

        if (type === 'product-lp') {
            order.productsLp = removeFrom(data.id, order.productsLp);
        }

        if (type === 'elements') {
            order.elements = removeFrom(data.id, order.elements);
        }

        if (type === 'service') {
            order.services = removeFrom(data.id, order.services);
            Service.removeService($cartBtn);
        }

        Storage.addStorage('order', order);
        checkCartBtnInfo();
    }

    function pseRemoveFromOrder($product) {
        let type = $product.data('type');

        if (type === 'service') {
            Service.removeService($cartBtn);
        }
    }

    function addTo(data, arr) {
        let temp = arr,
            isExist = false;

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id === data.id) {
                temp[i] = data;
                isExist = true;
            }
        }

        if (!isExist) {
            temp.push(data);
        }

        return temp;
    }

    function removeFrom(id, arr) {
        let temp = arr.filter(function (item) {
            return item.id !== id
        });

        return temp;
    }

    function checkCartBtnInfo() {
        let info = Order.getOrderLength();

        if (!info.all) {
            $counter.css('display', 'none');
            return false;
        } else {
            $counterProduct.text(info.products);
            $counterServices.text(info.services);
            $counter.css('display', 'block');
        }
    }

    $.extend(Module, {
        init: function () {
            checkCartBtnInfo();
        },
        add: function ($product) {
            addToOrder($product);
        },
        remove: function ($product) {
            removeFromOrder($product);
        },
        pseRemove: function ($product) {
            pseRemoveFromOrder($product);
        },
        getOrderLength: function () {
            let obj = [];

            obj.products = order.simple.length + order.productsLp.length + order.elements.length;
            obj.services = order.services.length ? order.services.length : 0;
            obj.all = obj.products + obj.services;
            return obj;
        }
    });
}(window.Order = window.Order || {}, $));

// Product actions
(function (Module, $) {
    let $order = $('#order-list'),
        $oi = $('.js-oi'),
        $oiService = $('.js-ois'),
        $totalSum = $('#order-total-sum'),
        btnClassTemp = 'order-btn';

    // TODO проверка на наличие в корзине

    function initOrderItems($items) {
        $oi = $items ? $items : $oi;
        // Товары
        $oi.each(function () {
            let $item = $(this),
                id = $item.data('id'),
                $counter = $item.find('.js-oi-counter'),
                $discountBtn = $item.find('.js-oi-discount'),
                $service = $item.find('.js-oi-service'),
                $btn = $item.find('.js-order-btn'),
                log = {
                    type: $item.data('type'),
                    service: $item.data('service')
                };

            calcPrice($item);
            initOrderBtn($btn, $item, log);

            // Ограничение на ввод данных в счетчике - только целые числа > 0
            $counter.inputmask({
                alias: 'integer',
                min: 0,
                showMaskOnFocus: false,
                showMaskOnHover: false,
                allowMinus: false
            });

            // Отслеживание изменений в счетчике.
            // Если количество равно 0 или отстутствует,
            // то товар автоматически удаляется из заявки.
            $counter.on('change', function () {
                let value = parseInt($(this).val());

                if (value === 0 || isNaN(value)) {
                    $(this).val(0);
                    Module.btnActionRemove($item, $btn, log);
                }

                calcPrice($item);
                calcTotalSum();
            });

            // Проверка на наличие блока со скидкой
            if ($discountBtn.length) {
                initDiscount($item, $discountBtn, log);
            }
        });

        // Услуги
        $oiService.each(function () {
            let $item = $(this),
                id = $item.data('id'),
                $btn = $item.find('.js-order-btn'),
                log = {
                    type: $item.data('type')
                };

            initOrderBtn($btn, $item, log);
        })
    }

    // Инициализация кнопки добавления в заявку
    function initOrderBtn($btn, $oiItem, log) {
        log.itemStatus = $btn.data('type') === 'remove' ? 'remove' : 'add';

        $btn.on('click', function (e) {
            let $target = $(e.target);

            if (log.itemStatus === 'add') {
                $btn.addClass(`${btnClassTemp}--added`);
                $oiItem.addClass('added');
                log.itemStatus = 'added';
                updateServiceStatus(log);
                Order.add($oiItem);

                return;
            }

            if (log.itemStatus === 'added') {
                if ($target.hasClass(`${btnClassTemp}__undo`)) {
                    $btn.removeClass(`${btnClassTemp}--added`);
                    $oiItem.removeClass('added');
                    log.itemStatus = 'add';
                    Order.remove($oiItem);
                }

                if ($target.hasClass(`${btnClassTemp}__add`)) {
                    $btn.removeClass(`${btnClassTemp}--added`);
                    $oiItem.removeClass('added');
                    log.itemStatus = 'add';
                    Order.pseRemove($oiItem);
                }

                updateServiceStatus(log);
            }

            if (log.itemStatus === 'remove') {
                Module.btnActionRemove($oiItem, $btn, log);

                return;
            }

            if (log.itemStatus === 'removed') {
                if ($target.hasClass(`${btnClassTemp}__undo`)) {
                    $btn.removeClass(`${btnClassTemp}--removed`);
                    $oiItem.removeClass('removed');
                    log.itemStatus = 'remove';

                    if ($oiItem.find('.js-oi-counter').val() === '0') {
                        $oiItem.find('.js-oi-counter').val(1);
                        calcPrice($oiItem);
                    }

                    calcTotalSum();
                    updateServiceStatus(log);

                    return;
                }

                if ($target.hasClass(`${btnClassTemp}__close`)) {
                    $oiItem.fadeOut(function () {
                        $oiItem.remove();

                        if (log.type === "service" && !$('.js-ois').length) {
                            $('[data-order-block="services"]').fadeOut(0);
                        }
                    });

                    log.itemStatus = 'close';
                    updateServiceStatus(log);

                    return;
                }
            }


        });
    }

    // Обновление добавления услуги в заявку
    function updateServiceStatus(log) {
        if (log.type !== 'service') {
            return;
        }

        let $serviceBlock = $(`.service-section[data-service=${log.service}]`);

        if (log.itemStatus === 'added') {
            $serviceBlock.find('.form-field').addClass('field-disable').end()
                .find('.radio-btn').addClass('disable').end()
                .find('.select').addClass('disable').end()
                .find('input').prop('disabled', true);
        } else {
            $serviceBlock.find('.form-field').removeClass('field-disable').end()
                .find('.radio-btn').removeClass('disable').end()
                .find('.select').removeClass('disable').end()
                .find('input').prop('disabled', false);
        }
    }

    // Подсчет общей стоимости товара
    function calcPrice($item) {
        let $price = $item.find('.js-oi-price'),
            $counter = $item.find('.js-oi-counter'),
            $totalPrice = $item.find('.js-oi-total-price'),
            price = $price.text().trim().replace(' ', '').replace(',', '.'),
            count = parseInt($counter.val());

        if (!isNaN(price)) {
            price = price.indexOf('.') === -1 ? price * count : (price * count).toFixed(1);
            $totalPrice.css('display', '')
        } else {
            price = 0;
            $totalPrice.css('display', 'none')
        }

        $totalPrice.text(formatNumber(price));
    }

    // Подсчет общей стоимости заявки
    function calcTotalSum() {
        if (!$order.length) {
            return false;
        }

        let sum = 0;

        $oi.not('.removed').each(function () {
            let price = $(this).find('.js-oi-total-price').text().replace(/ /g, "").replace(',', '.');

            sum += parseFloat(price);
        });

        $oiService.not('.removed').each(function () {
            let price = $(this).find('.js-oi-total-price').text().replace(/ /g, "").replace(',', '.');

            sum += parseFloat(price);
        });

        $totalSum.text(formatNumber(sum));
    }

    // Применение скидки к товару
    function initDiscount($item, $discountBtn, log) {
        let $counter = $item.find('.js-oi-counter'),
            $price = $item.find('.js-oi-price'),
            discountValue = 1 - parseFloat($discountBtn.data('discount')),
            minCount = parseInt($discountBtn.data('min'));

        log.oldPrice = parseFloat($price.text());

        $discountBtn.on('click', function () {
            if (log.discounted) {
                return false;
            }

            log.discounted = true;
            $discountBtn.addClass('applied');
            $price.text(log.oldPrice * discountValue);
            $counter.val(minCount);
            calcPrice($item);
            calcTotalSum();
        });

        $counter.on('change', function () {
            if (parseInt($(this).val()) < minCount) {
                log.discounted = false;
                $discountBtn.removeClass('applied');
                $price.text(log.oldPrice);
                calcPrice($item);
                calcTotalSum();
            }

            if (parseInt($(this).val()) >= minCount) {
                log.discounted = true;
                $discountBtn.addClass('applied');
                $price.text(log.oldPrice * discountValue);
                calcPrice($item);
                calcTotalSum();
            }
        });
    }

    $.extend(Module, {
        init: function () {
            initOrderItems();
            calcTotalSum();
        },
        initItems: function ($items) {
            initOrderItems($items);
        },
        btnActionRemove($item, $btn, log) {
            $btn.addClass(`${btnClassTemp}--removed`);
            log.itemStatus = 'removed';
            $item.addClass('removed');
            calcTotalSum();
        },
        changeMeasure(id) {
            $oi.each(function () {
                let $item = $(this),
                    dataPriceArr = getData($item.data('prices')),
                    $priceItem = $item.find('.js-oi-price'),
                    $counterWr = $item.find('.js-oi-counter').parent(),
                    data = dataPriceArr.filter(obj => {
                        return obj.id === id
                    })[0];

                if (data) {
                    $priceItem.text(formatNumber(data.price)).attr('data-price-for', `₽⁄${data.title}`);
                    $counterWr.attr('data-dimention', data.title);
                    $priceItem.css('display', '');
                } else {
                    $priceItem.text('').css('display', 'none');
                }

                calcPrice($item);
                calcTotalSum();
            });
        }
    });
}(window.OrderItems = window.OrderItems || {}, $));

$(function () {
    Order.init();
    OrderItems.init();
});