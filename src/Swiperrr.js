// Lord of all swipers The Swiperrr!
/* global iScroll */
(function (g, d, $){
    'use strict';
    var Swiperrr = function(config) {
        var
            createOrGetElement = function(name) {
                if ('string' === typeof name) {
                    if ((/ |#|>|\.|:/ig).test(name)) {
                        return $(name);
                    }

                    return $('<div>', {
                        'class': 'Swiperrr ' + name,
                        id: name
                    });
                }

                else if (name.length) {
                    return name;
                }
            },

            buildWrapper = function() {
                if ($('#swiper').length || $('#' + config.wrapper).length) {
                    console.warn('Uwaga! Już jeden Swiperrr o id #swiper istnieje!');
                }

                else {
                    this.$wrapper = createOrGetElement(config.wrapper || 'swiper');
                    this.$scroller = createOrGetElement(config.scroller ||
                            config.wrapper ? config.wrapper + '__scroller' : 'scroller');
                    this.$wrapper.append(this.$scroller);
                    this.$list.wrap(this.$wrapper);
                    recache.call(this);
                }
            },

            buildNavigation = function() {
                var
                    self = this,

                    $btns,
                    $btnsPages,
                    $btnPrev,
                    $btnNext,

                    $a,
                    fragment = d.createDocumentFragment(),

                    onPageButtonClick = function(e) {
                        var
                            $clicked = $(this),
                            index = $clicked.text(),
                            $active = $clicked.siblings('.active');

                        e.preventDefault();

                        if (index !== $active.text()) {
                            self.IScroll.scrollToPage(index);
                        }
                    };

                $btns = $('<div>' ,{
                    'class': config.wrapper + '__nav Swiperrr__nav nav',
                    id: config.wrapper + '__nav'
                });

                $btnsPages = $('<ul>' ,{
                    'class': config.wrapper + '__btns btns',
                    id: config.wrapper + '__btns'
                });

                $a = $('<a>', {
                    href: '#'
                }) .append($('<span>', {
                    text: 'prev'
                }));

                $btnPrev = $('<li>', {
                    'class': config.wrapper + '__prev prev',
                    id: config.wrapper + '__prev',
                }).append($a);

                $a = $a.clone()
                    .children().text('next').end();

                $btnNext = $('<li>', {
                    'class': config.wrapper + '__next next',
                    id: config.wrapper + '__next',
                }).append($a);

                fragment.appendChild($btnPrev.get(0));

                this.$list.children().each(function(index) {
                    var $li = $('<li><a href="#"><span>' + index + '</span></a></li>');

                    if (0 === index) {
                        $li.addClass('active');
                    }

                    $li.data('index', index);
                    $li.on('click', onPageButtonClick);
                    fragment.appendChild($li.get(0));
                });

                fragment.appendChild($btnNext.get(0));
                $btnsPages.get(0).appendChild(fragment);
                $btns.append($btnsPages);
                $btns.insertAfter(this.$wrapper);

                this.$btnPrev = $btnPrev;
                this.$btnNext = $btnNext;
                this.$btns = $btns;
            },

            recache = function() {
                this.$wrapper = $('#' + this.$wrapper.attr('id'));
                this.$scroller = $('#' + this.$scroller.attr('id'));
                this.$list = createOrGetElement(config.list);
            },

            setWidths = function() {
                this.containerWidth = this.$wrapper.parent().width();
                this.elementSummaryWidth = parseInt(this.containerWidth * this.numberOfLinks, 10);
                this.$scroller.width(this.elementSummaryWidth);
                this.$list.children('li').width(this.containerWidth);
            },

            correctPosition = function() {
                var index = this.$btns.find('.active').data('index');

                this.IScroll.refresh();
                this.IScroll.scrollToPage(index, 0, 500);
            },

            initIScroll = function() {
                var self = this;

                this.IScroll = new iScroll(this.$wrapper.get(0), {
                    snap: true,
                    momentum: false,
                    hScrollbar: false,
                    vScroll: false,
                    
                    onBeforeScrollStart: function(e) {
                        if (self.IScroll.absDistX > (self.IScroll.absDistY + 5)) {
                            e.preventDefault();
                        }
                    },

                    onScrollEnd: function () {
                        if (this.$btns) {
                            updateControls.call(self);
                        }
                    }
                });
            },

            bindEvents = function() {
                var
                    onPrev = function(e) {
                        var index = this.$btns.find('.active').data('index');

                        e.preventDefault();

                        if (0 !== index) {
                            this.IScroll.scrollToPage(index - 1);
                        }
                    },

                    onNext = function(e) {
                        var
                            index = this.$btns.find('.active').data('index'),
                            lastIndex = this.$btns.find('li').not('.next').last().data('index');

                        e.preventDefault();

                        if (lastIndex !== index) {
                            this.IScroll.scrollToPage(index + 1);
                        }

                    },

                    onWindowResize = function() {
                        setWidths.call(this);
                        setTimeout(correctPosition.bind(this), 250);
                    };

                if (this.$btns) {
                    this.$btnPrev.on('click', onPrev.bind(this));
                    this.$btnNext.on('click', onNext.bind(this));
                }

                $g.on('resize', onWindowResize.bind(this));
            },

            updateControls = function() {
                var
                    currentPageIndex = parseInt(this.IScroll.currPageX, 10),
                    $controls = this.$btns.find('li').not('.next, .prev'),
                    $currentControl = $controls.filter('.active');

                if (currentPageIndex !== $currentControl.data('index')){
                    $currentControl.removeClass('active');
                    $controls.eq(currentPageIndex).addClass('active');
                }
            };

        this.$list = createOrGetElement(config.list);
        buildWrapper.call(this);
        if (config.nav) {
            buildNavigation.call(this);
        }

        this.numberOfLinks = (config.numberOfLinks > this.$list.children('li').length) ?
            this.$list.children('li').length :
            config.numberOfLinks;

        setWidths.call(this);
        initIScroll.call(this);
        bindEvents.call(this);
    },

    $g = $(g);

    g.Swiperrr = Swiperrr;
}(window, document, jQuery));