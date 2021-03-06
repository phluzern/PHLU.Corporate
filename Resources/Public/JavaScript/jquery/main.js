/**
 * Created by paafelder on 11.04.16.
 */

$(document).ready(function () {
    initFrontend();
    initBackend();
});


function initFrontend() {


    var isBackend = jQuery("body").hasClass("neos-backend");

    /* set preventDefault on links */
    $('a.preventDefault').click(function (event) {
        event.preventDefault();
        return false;
    });

    /* click on nav brand home button */
    $('a.navbar-brand').click(function (e) {
        if (window.location.pathname == "/") {
            location.reload();
            e.preventDefault();
            return false;
        }

    });


    /* close tabs in pane */
    $('.tab-pane .close-btn').click(function (event) {
        $("a[data-target='#" + $(this).closest('.tab-pane').attr('id') + "']").removeClass('active');
        $(this).closest('.tab-pane').removeClass('active');
        event.preventDefault();
        return false;
    });

    $('ul.nav.nav-pills li.nav-item a.nav-link, .nav-item .a.nav-link').click(function (event) {


        event.preventDefault();


        if ($(this).hasClass('active')) {
            $(this).removeClass('active');

            if ($(this).attr('data-target')) {
                $($(this).attr('data-target')).removeClass('active');
            } else {
                $($(this).attr('href')).removeClass('active');
            }

            event.preventDefault();
            return false;
        }


    });

    /* init rcrumbs */
    $(document).mousemove(function (event) {
        window.mouseLastEvent = event;
    });


    /* set clickable containers */
    $('.clickable').on('click', function (e) {
        if ($(this).find('a').attr('href') !== undefined) window.location.href = $(this).find('a').attr('href');
    });

    /* set click event on accordion header containing links */
    $('.panel-heading').on('click', function (e) {
        if ($(e.target).attr('href') != undefined && $(e.target).attr('href') != "#") window.location.href = $(e.target).attr('href');
    });


    /*
    * show elements on scroll
    * */
    var wrap = $("#rcrumbs-wrapper").parent().parent(),
        wrapMobile = $(".navbar"),
        wrapMobileHeight = wrapMobile.height(),
        wrapMobileOffsetTop = wrapMobile.find('.navbar-toggler').length ? wrapMobile.find('.navbar-toggler').offset().top : null;

    $(window).resize(function () {
        wrapMobileOffsetTop = wrapMobile.find('.navbar-toggler').length ? wrapMobile.find('.navbar-toggler').offset().top : null;
        calculateScroll();
    });

    var calculateScroll = function () {

        /* top link nav
           * */
        spaceToTop = $(window).scrollTop();
        // $('[data-spy="scroll"]').scrollspy('refresh');
        if (spaceToTop > $(window).height()) {
            $('#top-link-block').fadeIn('slow');
        }
        else {
            $('#top-link-block').fadeOut('slow');
        }
        /*
        * fixed breadcrumb on scroll
        */
        if (spaceToTop > 65 && wrap.is(':visible')) {
            wrap.addClass("fix-crumb");
            wrap.next().css('margin-top', wrap.height());
        } else {
            wrap.removeClass("fix-crumb");
            wrap.next().css('margin-top', 0);
        }
        /*
        * fixed navbar on scroll
        */

        if (wrapMobileOffsetTop) {
            //console.log(spaceToTop, wrapMobileOffsetTop);
            if (spaceToTop > wrapMobileOffsetTop) {
                wrapMobile.next().css('margin-top', wrapMobileHeight);
                wrapMobile.addClass("fix-navbar");
            } else {
                wrapMobile.removeClass("fix-navbar");
                wrapMobile.next().css('margin-top', 0);
            }
        } else {
            wrapMobile.next().css('margin-top', 0);
        }
    };

    $(window).on('scroll',function () {
        calculateScroll();
    });
    $('#search > div').on('scroll',function () {

        spaceToTop = $('#search > div').scrollTop();
        if (spaceToTop >= $(window).height()) {
            $('#top-link-block').fadeIn('slow');
        }
        else {
            $('#top-link-block:visible').fadeOut('slow');
        }

    });
    $('#top-link-block > a').click(function () {
        $('#search > div').scrollTop(0);
    });

    /* added hyphenator for chrome support
     Hyphenator.run();*/


    /*
     bootstrap carousel
     Hide carousel's navigation if there is only one content
     */
    $('.carousel-inner').each(function () {
        if ($(this).children('div').length === 1) $(this).siblings('.carousel-control, .carousel-indicators').hide();
    });


    initSmoothScrolling();


    var resize = function () {
        if ($(window).outerWidth() > 1266) {
            /* set content height if (on startpage) the .aktuelles container is smaller than main container  */
            // if ($(".row.aktuelles").innerHeight() < $(".main").innerHeight()) {
            //     $(".row.aktuelles").css("height", $(".main").innerHeight());
            // }
            /* add top margin for phlu bg pattern on level1 subnav on short pages */
            if ($(".sidebar").innerHeight() < 2000) {
                $('.sidebar.level1').addClass('phlu-pattern-top-margin');
            }
        }
        else {
            /* stop setting height if mobile navigation is displayed */
            $(".row.aktuelles").removeAttr("style");
        }

    };
    $(window).resize(resize);
    resize();

    /*
     * mobile navigation button icon bootstrap collapse
     */
    $('#navbar').on('show.bs.collapse', function () {
        $('.navbar-toggler').addClass('open');
        $('.navbar-toggler').addClass('close-btn');
    });
    $('#navbar').on('hide.bs.collapse', function () {
        $('.navbar-toggler').removeClass('open');
        $('.navbar-toggler').removeClass('close-btn');
    });


    $('[data-toggle="filterCountTag"]').tooltip('show');

    /*
     * Datepicker
     */
    $.fn.datepicker.dates['de'] = {
        days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
        daysShort: ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"],
        daysMin: ["<span class='hidden-sm-down'>Sonntag</span><span class='hidden-md-up'>Son</span>", "<span class='hidden-sm-down'>Montag</span><span class='hidden-md-up'>Mon</span>", "<span class='hidden-sm-down'>Dienstag</span><span class='hidden-md-up'>Die</span>", "<span class='hidden-sm-down'>Mittwoch</span><span class='hidden-md-up'>Mit</span>", "<span class='hidden-sm-down'>Donnerstag</span><span class='hidden-md-up'>Don</span>", "<span class='hidden-sm-down'>Freitag</span><span class='hidden-md-up'>Fre</span>", "<span class='hidden-sm-down'>Samstag</span><span class='hidden-md-up'>Sam</span>"],
        months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
        today: "Heute",
        monthsTitle: "Monate",
        clear: "Löschen",
        weekStart: 1,
        format: "dd.mm.yyyy"


    };

    $('#datepicker').datepicker({
        startDate: '0d',
        language: 'de',
        maxViewMode: 0
    });
    $('#datepicker-further-education').datepicker({
        startDate: '0d',
        language: 'de',
        maxViewMode: 0
    });


    $('#tag-zeit td').click(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
        else {
            $(this).addClass('active');
        }
    });

    $('.ui.dropdown').dropdown();
    initCarousel();

    /*
     * show extended Search Filters
     */
    $('.extendedSearch button').on('click', function () {
        $('.extendedSearchBg').toggleClass('on');
        $('.extendedSearchFilter').toggle();
    });

    /*
     * target-group-codes
     * show fullname
     */
    $(".target-group-codes .code").hover(
        function () {
            $(this).find('.fullname').addClass("show");
        }, function () {
            $(this).find('.fullname').removeClass("show");
        }
    );

    /*
 * further education course fees infotext icon
 * show description
 */
    $(".fees-infotext").hover(
        function () {
            $(this).find('span').addClass("show");
        }, function () {
            $(this).find('span').removeClass("show");
        }
    );

    /*
     * scroll to clicked accordion element if outside of viewport
     */
    scrollToViewport();
    goToTargetNode();

}


function scrollToViewport() {
    $('.panel-heading').on('click', function () {
        var container = '';
        var c = 0;
        if ($(this).closest('.phlu-corporate-accordeonelement').length) {
            container = '.phlu-corporate-accordeonelement';
        }
        if ($(this).closest('.phlu-corporate-contactsgroup').length) {
            container = '.phlu-corporate-contactsgroup';
        }
        if ($(this).closest('.phlu-corporate-contact').length) {
            container = '.phlu-corporate-contact';
        }
        $(this).closest(container).on('shown.bs.collapse', function () {
            var element_position = $(this).offset().top;
            var scroll_position = $(window).scrollTop();
            var viewport_height = $(window).height();
            if ((scroll_position + viewport_height) > element_position && scroll_position < element_position) {
                //console.log('is in viewport');
            }
            else {
                if (c == 0) {
                    //console.log('out of viewport');
                    $('html, body').stop().animate({
                        'scrollTop': $(this).offset().top - 10
                    }, 100, 'swing', function () {

                    });
                }
            }
            c = 1;
        });
    });
}

function initSmoothScrolling() {

    /* smooth scrolling [href^="#"] */
    $('a.anchor-nav').on('click', function (e) {
        e.preventDefault();

        if (jQuery(this).attr('data-target')) {
            var target = jQuery(this).attr('data-target');
            var $target = $(target);
        } else {
            var target = this.hash != '' ? this.hash : $(e.target).closest("a").get(0).attr('href');
            var $target = $(target);
        }

        if (target != "#") {

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top - ($target.hasClass('phlu-corporate-section') || $target.attr('class') == undefined || $target.hasClass('sectionWithDynamicContent') ? 200 : 160)
            }, 900, 'swing', function () {

            });
        }


    });
}

function goToTargetNode() {


    var targetNodeElement = $('.targetnode').first();
    var targetNodeElementId = targetNodeElement.attr('data-targetnode');
    var dynamicContentsSelector = '.sectionWithDynamicContent';
    var offsetPadding = 17;

    if (targetNodeElement.length) {


        // if (window.location.hash.substring(2).length) {
        //     targetNodeElement.attr('data-searchterm', 'Ihre Suche: "'+decodeURIComponent(window.location.hash.substring(2))+'"');
        //     window.setTimeout(function () {
        //         targetNodeElement.addClass('on');
        //     }, 300);
        //     window.setTimeout(function () {
        //         targetNodeElement.removeClass('on');
        //     }, 3000);
        // }

        $(dynamicContentsSelector).each(function () {
            $(this).addClass('tmpFixedHeight');
        });

        if (targetNodeElement.is(':visible') === false) {

            // open collapses from outer to inner
            $('[data-toggle="collapse"]').each(function () {
                if ($(this).closest('.panel').find('[data-targetnode="' + targetNodeElementId + '"]').length) {
                    $(this).trigger('click');
                }
            });

            targetNodeElement.find('[data-toggle="collapse"]').first().trigger('click')


        } else {
            targetNodeElement.find('[data-toggle="collapse"]').first().trigger('click')
        }

        window.setTimeout(function () {

            var intervalCounter = 0;
            var lastScrolltop = 0;
            var minScrolltop = 250;
            var ScrollTop = targetNodeElement.offset().top < minScrolltop ? 0 : targetNodeElement.offset().top;

            var interval = window.setInterval(function () {

                if (lastScrolltop == ScrollTop - offsetPadding) {
                    $('html, body').scrollTop(ScrollTop - offsetPadding);
                }

                intervalCounter++;
                if (intervalCounter > 50) {
                    window.clearInterval(interval);
                }

                lastScrolltop = ScrollTop - offsetPadding;


            }, 10);

            var observerWasApplied = false;

            var observeScroll = function () {

                if (observerWasApplied === false) {
                    window.clearInterval(interval);
                    $(dynamicContentsSelector).each(function () {
                        $(this).removeClass('tmpFixedHeight');
                    });
                    var ScrollTop = targetNodeElement.offset().top < minScrolltop ? 0 : targetNodeElement.offset().top;
                    $('html, body').scrollTop(ScrollTop - offsetPadding);
                    observerWasApplied = true;
                }
            }

            document.addEventListener('mousewheel', function (e) {
                observeScroll();
            });

            document.addEventListener('mousedown', function (e) {
                observeScroll();
            });

            document.addEventListener('keydown', function (e) {
                observeScroll();
            });


        }, 100);


    }


}

function initCarousel() {


    /* set default paused carousel */
    $('.carousel').carousel('pause');

    /*
     * media carousel swipe for mobile
     */
    $(".carousel").swiperight(function () {
        $(this).carousel('prev');
    });
    $(".carousel").swipeleft(function () {
        $(this).carousel('next');
    });

    /*
     * image gallery lightbox
     */
    $("[id^=blueimpgallery-carousel-phlu-image-gallery-]").on('click', function (event) {
        event = event || window.event;
        var target = event.target || event.srcElement,
            link = target.src ? target.parentNode : target,
            options = {index: link, event: event},
            links = this.getElementsByTagName('a');
        blueimp.Gallery(links, options);
    });
}

function initBackend() {
    $('.neos-tooltip-inner').click(function () {
        $(this).hide();
    });
}

/* init rcrumbs
$(document).mousemove(function (event) {
    window.mouseLastEvent = event;
});

$('.rcrumbs-container').rcrumbs({
    ellipsis: false,
    nbUncollapsableCrumbs: 1,
    nbFixedCrumbs: 1,
    callback: {

        preCrumbsListDisplay: function (e) {

            var self = this;
            self.listsWidth = {};
            $(e.element).find("li.expander").each(function (i) {
                $(this).remove();
            });
        },

        postCrumbsListDisplay: function (e) {

            var expanderWidth = 75;
            var expanderExpandedWidth = 0;
            var self = this;
            self.isExpanding = false;

            var hasHidden = $(e.element).find("li").length - 1 > e.nbCrumbDisplayed ? true : false;

            if (hasHidden && e.nbCrumbDisplayed >= 1) {

                var hiddenFrom = e.options.nbFixedCrumbs;
                var hiddenTo = $(e.element).find("li").length - e.nbCrumbDisplayed - 1;

                $(e.element).find("li").each(function (i) {
                    if (e.options.nbFixedCrumbs === i) {

                        var expanderExpanded = $("<ul/>");
                        expanderExpanded.addClass('breadcrumb');

                        $(e.element).find("li").each(function (a) {

                            if (a >= hiddenFrom && a <= hiddenTo) {
                                var a = $(this).clone().html();
                                var li = $("<li/>");
                                li.addClass('breadcrumb-item');
                                li.css('width', self.listsWidth[a]);
                                $(a).appendTo(li);
                                li.appendTo(expanderExpanded);
                            }
                        });

                        var expander = $("<li/>");
                        expander.css('min-width', expanderWidth + "px");
                        expander.addClass('breadcrumb-item');
                        expander.addClass('expander');
                        expander.addClass('expander out');
                        expanderExpanded.appendTo(expander);

                        $(this).before(expander);

                        expander.show();
                        expander.width(expanderWidth);
                        expanderExpanded.hide();


                        expander.expand = function () {

                            if (expanderExpandedWidth == 0) expanderExpandedWidth = expanderExpanded.width();
                            expander.addClass('in').removeClass('out');
                            expander.width(expanderWidth);
                            expanderExpanded.show();


                            expander.width(0);
                            expanderExpanded.width(0);
                            expander.css('width', 'auto');
                            expanderExpanded.animate({width: expanderExpandedWidth}, 'slow', function () {
                                expanderExpanded.css('width', 'auto');
                            });


                            var c = 0;
                            self.expanderHideInterval = setInterval(function () {
                                c++;
                                var top = $(expander).offset().top;
                                var mouseY = mouseLastEvent.pageY;
                                if (c > 100 || mouseY < top - 30 || mouseY > top + 30) {
                                    clearInterval(self.expanderHideInterval);
                                    expander.animate({width: expanderWidth}, 'slow', function () {
                                        expander.addClass('out').removeClass('in');
                                        self.isExpanding = false;
                                    });
                                }

                            }, 4000);
                        }


                        expander.mouseenter(function () {
                            if (expander.hasClass('in') === false) expander.expand();
                        });


                    }
                });


            }

        }
    }
});

*/