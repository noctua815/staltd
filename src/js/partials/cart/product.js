/*jshint esversion: 6 */

// Product actions
(function (Module, $) {
    let $mainContainer = $('#products-filtering'),
        $fullTitle = $('#prd-full-name'),
        $container = $('.js-order-item-list'),
        $filterMsg = $container.find('.js-filter-message'),
        $items = $('.js-oi'),
        isTabs = $mainContainer.data('tabs'),
        timer = 600;

    function measureSelector() {
        let $selectors = $('.js-measure-selector'),
            $bigPrices = $('.js-big-price'),
            $prices = $('.js-price');

        $selectors.each(function () {
            let $selector = $(this),
                $items = $selector.find('.js-measure-item');

            $items.on('click', function () {
                if ($(this).hasClass('active')) {
                    return false;
                }

                let $self = $(this),
                    data = getData($self.data('item')),
                    newPrice,
                    index = $items.index($self),
                    $otherSelectorts = $selectors.not($selector);

                newPrice = `${formatNumber(data.price)} ₽⁄${data.title}`;
                $bigPrices.find('span').text(newPrice);

                $items.removeClass('active');
                $self.addClass('active');
                $otherSelectorts
                    .find('.js-measure-item').removeClass('active').end()
                    .find('.js-measure-item').eq(index).addClass('active');

                updatePrices(data.id);
                OrderItems.changeMeasure(data.id);
            });
        });

        function updatePrices(id) {
            $prices.each(function () {
                let $price = $(this),
                    dataPriceArr = getData($price.data('prices')),
                    data = dataPriceArr.filter(obj => {
                        return obj.id === id
                    })[0];

                if (data) {
                    let text = '';

                    if (data.min_price && data.max_price) {
                        text = `${formatNumber(data.min_price)}-${formatNumber(data.max_price)} ₽⁄${data.title}`
                    } else if (data.min_price) {
                        text = `от ${formatNumber(data.min_price)} ₽⁄${data.title}`
                    } else if (data.max_price) {
                        text = `до ${formatNumber(data.max_price)} ₽⁄${data.title}`
                    }

                    $price.text(text);
                    $price.css('display', '');
                } else {
                    $price.css('display', 'none');
                }
            });
        }
    }

    function classSelector() {
        let $containers = $('.js-prd-classes');

        $containers.each(function () {
            let $classes = $(this).find('.js-class-cover');

            if (!$classes.filter('.selected').length) {
                $classes.eq(0).addClass('selected');
            }

            $classes.on('click', function () {
                if ($(this).hasClass('selected')) {
                    return false;
                }

                $classes.removeClass('selected');
                $(this).addClass('selected');

                setTimeout(function () {
                    findFullProductInfo();
                }, timer);
            });
        });
    }

    function coverItemSelection() {
        let $containers = $('.js-prd-covers');

        $containers.each(function () {
            let $coverItems = $(this).find('.js-cover-item');

            if (!$coverItems.filter('.selected').length) {
                $coverItems.eq(0).addClass('selected');
            }

            $coverItems.on('click', function () {
                if ($(this).hasClass('selected')) {
                    return false;
                }

                $coverItems.removeClass('selected');
                $(this).addClass('selected');

                setTimeout(function () {
                    findFullProductInfo();
                }, timer);
            });
        });
    }

    function colorSelection() {
        let $containers = $('.js-prd-colors');

        $containers.each(function () {
            let $colors = $(this).find('.js-color-item');

            if (!$colors.filter('.selected').length) {
                $colors.eq(0).addClass('selected');
            }

            $colors.on('click', function () {
                if ($(this).hasClass('selected')) {
                    return false;
                }

                $colors.removeClass('selected');
                $(this).addClass('selected');

                setTimeout(function () {
                    findFullProductInfo();
                }, timer);
            });
        });
    }

    function modifySelection() {
        let $containers = $('.js-prd-modify');

        $containers.each(function () {
            let $modifys = $(this).find('.js-modify-item');

            if (!$modifys.filter('.selected').length) {
                $modifys.eq(0).addClass('selected');
            }

            $modifys.on('click', function () {
                if ($(this).hasClass('selected')) {
                    return false;
                }

                $modifys.removeClass('selected');
                $(this).addClass('selected');

                setTimeout(function () {
                    findFullProductInfo();
                }, timer);
            });
        });
    }

    function smPrdSelection() {
        let $containers = $('.js-sm-prds');

        $containers.each(function () {
            let $prds = $(this).find('.js-sm-prd-card');

            if (!$prds.filter('.selected').length) {
                $prds.eq(0).addClass('selected');
            }

            $prds.on('click', function () {
                if ($(this).hasClass('selected')) {
                    return false;
                }

                $prds.removeClass('selected');
                $(this).addClass('selected');

                setTimeout(function () {
                    findFullProductInfo();
                }, timer);
            });
        });
    }

    function smSelector() {
        let $containers = $('.js-sm-selectors');

        $containers.each(function () {
            let $selectors = $(this).find('.js-sm-selector');

            if (!$selectors.filter('.selected').length) {
                $selectors.eq(0).addClass('selected');
            }

            $selectors.on('click', function (e) {
                if ($(this).hasClass('selected')) {
                    return false;
                }

                $selectors.removeClass('selected');
                $(this).addClass('selected');
            });
        });
    }

    function findFullProductInfo() {
        let $container,
            $classCover = $mainContainer.find('.js-class-cover.selected'),
            $option,
            $type,
            $color,
            $modify,
            params = {};

        if (isTabs) {
            $container = $mainContainer.find('.js-tabs-body').eq(0).children('.js-tabs-item').filter('.is-active');
        } else {
            $container = $mainContainer;
        }

        let $activeTab = $container.find('.js-tabs-item.is-active');

        $type = $container.find('.js-cover-item.selected');
        $option = $container.find('.js-sm-prd-card.selected');

        if ($activeTab.length) {
            $color = $activeTab.find('.js-color-item.selected');
            $modify = $activeTab.find('.js-modify-item.selected');
        } else {
            $color = $container.find('.js-color-item.selected');
            $modify = $container.find('.js-modify-item.selected');
        }

        if ($classCover.length) {
            // filters.push(getData($classCover.data('params')))
            params.class = getData($classCover.data('params')).class;
        }

        if ($option.length) {
            let data = getData($option.data('params'));
            params.option = data.option;
        }

        if ($type.length) {
            let data = getData($type.data('params'));
            params.type = data.type;
        }

        if ($color.length) {
            let data = getData($color.data('params'));
            params.color = data.color;
        }

        if ($modify.length) {
            let data = getData($modify.data('params'));
            params.modify = data.modify;
        }

        filtering(params)
        createFullProductName(params);
    }

    function filtering(params) {
        var countFiltering;

        $container.animate({
            opacity: 0
        }, 300, function () {
            countFiltering = 0;

            $items.each(function (i) {
                var data = getData($(this).data('params')),
                    dataSize = Object.keys(data).length - 1,
                    counter = 0;

                for (var key in params) {
                    if (params.hasOwnProperty(key) && data.hasOwnProperty(key)) {
                        if (params[key].toLowerCase().includes(data[key].toLowerCase())) {
                            counter++;
                        }

                        if (params[key] === 'no-class') {
                            counter += 2;
                        }
                    }
                }

                if (dataSize === counter) {
                    $(this).css('display', 'block');
                    countFiltering++;
                } else {
                    $(this).css('display', 'none');
                }
            });
        })

        setTimeout(function () {
            if (!countFiltering) {
                $filterMsg.css('display', 'block');
            } else {
                $filterMsg.css('display', 'none');
            }

            $container.animate({
                opacity: 1
            }, 300)
        }, 350)
    }

    // Получение отфильтрованный элементов по ajax
    function getFilteringItems(params) {
        var formData = new FormData();

        for (var key in params) {
            formData.append(key, params[key]);
        }

        $container.fadeOut(300);

        $.ajax({
            type: 'get',
            url: 'some-url',
            data: formData,
            success: function (response) {
                $container.html(response);
                OrderItems.initItems($container.find('.js-oi'));
                $container.fadeOut(200);
            }
        });
    }

    // Params obj - type, color, modify, name
    function createFullProductName(params) {
        if (!$fullTitle.length) {
            return false;
        }

        let $name = $fullTitle.find('.js-prd-name'),
            $type = $fullTitle.find('.js-prd-name-type'),
            $color = $fullTitle.find('.js-prd-name-color'),
            $modify = $fullTitle.find('.js-prd-name-modify');

        // Simple text blocks
        let $typeText = $fullTitle.find('.js-prd-text-type'),
            $colorText = $fullTitle.find('.js-prd-text-color');

        if (!Object.keys(params).length) {
            $fullTitle.children().not('.js-prd-name').fadeOut(0);
            return;
        } else {
            $fullTitle.children().not('.js-prd-name').fadeIn(0);
        }

        if (params.option) {
            $name.text(params.option);
        }

        if (params.type) {
            $type.text(params.type);
            if ($type.is(':hidden')) {
                $type.fadeIn(0);
                $typeText.fadeIn(0);
            }
        } else {
            $type.fadeOut(0);
            $typeText.fadeOut(0);
        }

        if (params.color) {
            $color.text(params.color);
            if ($color.is(':hidden')) {
                $color.fadeIn(0);
                $colorText.fadeIn(0);
            }
        } else {
            $color.fadeOut(0);
            $colorText.fadeOut(0);
        }

        if (params.modify) {
            $modify.text(params.modify);
            if ($modify.is(':hidden')) {
                $modify.fadeIn(0);
            }
        } else {
            $modify.fadeOut(0);
        }
    }

    $.extend(Module, {
        init: function () {
            measureSelector();
            classSelector();
            coverItemSelection();
            colorSelection();
            modifySelection();
            smPrdSelection();
            smSelector();
            setTimeout(function () {
                findFullProductInfo();
            }, 2000)

        }
    });
}(window.Product = window.Product || {}, $));

// Product elements actions
(function (Module, $) {
    let $productsContainer = $('#products-filtering'),
        $elements = $('.js-prd-element'),
        $sizeSelectors = $('.js-sm-selector'),
        $fillPriceOutput = $('.js-oi-full-price'),
        $parentColor = $('.js-color-item'),
        $tabs = $productsContainer.find('.js-tabs-item'),
        timer = 550;

    function initElements() {
        $elements.each(function () {
            let $element = $(this),
                $checkbox = $element.find('.js-prd-check'),
                $colors = $element.find('.js-sm-color'),
                $counter = $element.find('.js-oi-counter');

            $checkbox.on('click', function (e) {
                if (!$element.hasClass('selected')) {
                    $element.addClass('selected');
                    $checkbox.addClass('checked');

                    let counterValue = parseInt($counter.val());
                    if (counterValue === 0 || isNaN(counterValue)) {
                        $counter.val(1);
                    }
                } else {
                    $element.removeClass('selected');
                    $checkbox.removeClass('checked');
                }

                countingFullPrice();
            });

            $colors.on('click', function () {
                if ($(this).hasClass('selected')) {
                    return false;
                }

                $colors.removeClass('selected');
                $(this).addClass('selected');
            });

            $counter.on('change', function () {
                let value = parseInt($(this).val());

                if (value === 0 || isNaN(value)) {
                    $counter.val(0);
                    $element.removeClass('selected');
                    $checkbox.removeClass('checked');
                }

                countingFullPrice();
            });
        });

        $sizeSelectors.on('click', function () {
            timer = 550;
            countingFullPrice();
        });

        $parentColor.on('click', function () {
            let data = getData($(this).data('params'));

            changeColorPalette(data.color);
        });

        let colorPaletteOnLoad = getData($parentColor.eq(0).data('params'));

        countingFullPrice();
        changeColorPalette(colorPaletteOnLoad.color);
    }

    function countingFullPrice() {
        setTimeout(function () {
            let fullPrice = 0;
            let $activeElements = $tabs.length ? $tabs.filter('.is-active').find('.js-prd-element') : $elements;

            $activeElements.filter('.selected').each(function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }

                let data = getData($(this).data('params')),
                    $counter = $(this).find('.js-oi-counter');

                fullPrice += data.price * $counter.val();
            });

            $fillPriceOutput.text(formatNumber(fullPrice));
            timer = 0;
        }, timer);
    }

    function changeColorPalette(colorId) {
        $elements.each(function () {
            let $element = $(this),
                $colors = $element.find('.js-sm-color'),
                $filtering;

            $filtering = $colors.filter(function () {
                let data = getData($(this).data('params'));

                if (data.parentColor) {
                    if (data.parentColor.indexOf(colorId) !== -1) {
                        $(this).fadeIn(0);
                        return true;
                    } else {
                        $(this).fadeOut(0);
                        return false;
                    }
                }
            });

            if ($colors.filter('.selected').css('display') == 'none') {
                $colors.removeClass('selected');
                $filtering.eq(0).addClass('selected');
            }
        });
    }

    $.extend(Module, {
        init: function () {
            initElements();
        }
    });

}(window.ProductElements = window.ProductElements || {}, $));

Product.init();
ProductElements.init();
