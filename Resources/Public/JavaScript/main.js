/**
 * Created by paafelder on 11.04.16.
 */

$(document).ready(function () {
    $('.carousel').carousel('pause');

    /* smooth scrolling [href^="#"] */
    $('a.anchor-nav').on('click', function (e) {
        e.preventDefault();

        var target = this.hash;
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing', function () {
            window.location.hash = target;
        });
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