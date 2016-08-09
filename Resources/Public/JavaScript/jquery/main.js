/**
 * Created by paafelder on 11.04.16.
 */

$(document).ready(function () {


    /* set preventDefault on links */
    $('a.preventDefault').click(function(event) {
        event.preventDefault();
        return false;
    });

    /* set default paused carousel */
    $('.carousel').carousel('pause');


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

});