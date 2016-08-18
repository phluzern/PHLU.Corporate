/**
 * Created by paafelder on 11.04.16.
 */

$(document).ready(function () {


    /* set preventDefault on links */
    $('a.preventDefault').click(function (event) {
        event.preventDefault();
        return false;
    });

    /* set default paused carousel */
    $('.carousel').carousel('pause');


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

    /* smooth scrolling [href^="#"] */
    $('a.anchor-nav').on('click', function (e) {
        e.preventDefault();


        var target = this.hash != '' ? this.hash : $(e.target).closest("a").get(0).attr('href');
        var $target = $(target);


        if (target != "#") {

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, 900, 'swing', function () {
                window.location.hash = target;
            });
        }


    });

    /* top link nav */
    $(window).scroll(function () {
        spaceToTop = $(window).scrollTop();
        $('[data-spy="scroll"]').scrollspy('refresh');
        if (spaceToTop > $(window).height()) {
            $('#top-link-block').fadeIn('slow');
        }
        else {
            $('#top-link-block').fadeOut('slow');
        }
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


    /*
     Various height adjustments see further comments below
     */
    /*
     Adjust height of main content so that the footer navigation is visible after page ist loaded
     On Startpage only!
     */
    // if($(document).height() > $( window ).height()) {
    //     var marginTopHeight = 0;
    //     if(($( window ).height() - $('#carousel-phlu-teaser-xl').height() - 70) >= 0) {
    //
    //         marginTopHeight = $( window ).height() -$('#carousel-phlu-teaser-xl').height() - 70;
    //         console.log('main ist höher als fenster. fenster:', $( window ).height(), 'main:', $( window ).height());
    //     }
    //     else {
    //         console.log('fenster ist höher als main & die level0 navi ist höher als main',$('.sidebar > .row').height() . $('.main').height());
    //         if($('.sidebar > .row').height() < $('.main').height()) {
    //
    //         }
    //         else {
    //             /* Add enough margin to have same height as sidebar (otherwise the background image does not cover the whole content area) */
    //             marginTopHeight = $('.sidebar > .row').height() - $('#carousel-phlu-teaser-xl > .carousel-inner').height() + 5;
    //         }
    //     }
    //     $("#carousel-phlu-teaser-xl").css('margin-top',marginTopHeight);
    // }

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

    /*
     * load separate stylesheet file for ie11
     * */
    /*    window.location.hash = !!window.MSInputMethodContext;
     console.log(window.location.hash);
     if (window.location.hash !== '#false') {
     var $head = $("head");
     var $headlinklast = $head.find("link[rel='stylesheet']:last");
     var $removeNonIeFile = $head.find("#phluCss");
     var linkElement = "<link rel='stylesheet' href='../css/phluNoFlex.css' type='text/css' media='screen'>";

     if ($headlinklast.length) {
     $headlinklast.after(linkElement);
     }
     else {
     $head.append(linkElement);
     }
     if($removeNonIeFile.length) {
     $removeNonIeFile.remove();
     }
     }*/

    $('[data-toggle="filterCountTag"]').tooltip('show');



    $.fn.datepicker.dates['de'] = {
        days:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
        daysShort:["Son","Mon","Die","Mit","Don","Fre","Sam"],
        daysMin:["<span class='hidden-sm-down'>Sonntag</span><span class='hidden-md-up'>Son</span>","<span class='hidden-sm-down'>Montag</span><span class='hidden-md-up'>Mon</span>","<span class='hidden-sm-down'>Dienstag</span><span class='hidden-md-up'>Die</span>","<span class='hidden-sm-down'>Mittwoch</span><span class='hidden-md-up'>Mit</span>","<span class='hidden-sm-down'>Donnerstag</span><span class='hidden-md-up'>Don</span>","<span class='hidden-sm-down'>Freitag</span><span class='hidden-md-up'>Fre</span>","<span class='hidden-sm-down'>Samstag</span><span class='hidden-md-up'>Sam</span>"],
        months:["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
        monthsShort:["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],
        today:"Heute",
        monthsTitle:"Monate",
        clear:"Löschen",
        weekStart:1,
        format:"dd.mm.yyyy"



    };


    $('#datepicker').datepicker({
        startDate: '0d',
        language: 'de',
        maxViewMode: 0
    });

    $('#tag-zeit td').click(function() {
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
        else {
            $(this).addClass('active');
        }
    });

});


/* init rcrumbs */
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

