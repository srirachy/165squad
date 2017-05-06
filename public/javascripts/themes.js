/**
 * Created by Akshat on 3/10/2017.
 */
/*$(".name").click(function () {
    $(".theme-menu").addClass("expand-horizontal");
}, 500);*/

$(".name").click(function () {
    $(".theme-menu").animate({width: "200px"}, 300).queue(function (next) {
        $(this).animate({height: "300px"}, 600);
        $("#theme-list").addClass("visible");
        $(".close-menu").addClass("visible");
        $(".name").removeClass("move-down").addClass("move-up");
        next();
    });
});

$(".close-menu").click(function () {
    $(".theme-menu").animate({height: "50px"}, 100).queue(function (next) {
        $("#theme-list").removeClass("visible");
        $(this).animate({width: "50px"});
        $(".close-menu").removeClass("visible");
        $(".name").removeClass("move-up").addClass("move-down");
        next();
    });
});

//listener for each theme button
$(".monokai").click(function () {
    if($.cookie('theme')!= 'monokai' || typeof $.cookie('theme')==='undefined'){
        $.cookie('theme', 'monokai', {expires: 1, path: '/'});
        $(":root").removeClass().addClass("monokai");
    }
});

$(".default").click(function () {
    if($.cookie('theme')!= 'default' || typeof $.cookie('theme')==='undefined'){
        $.cookie('theme', 'default', {expires: 1, path: '/'});
        $(":root").removeClass();
    }
});

$(".blue").click(function () {
    if($.cookie('theme')!= 'blue' || typeof $.cookie('theme')==='undefined'){
        $.cookie('theme', 'blue', {expires: 1, path: '/'});
        $(":root").removeClass().addClass("blue");
    }
});

$(".teal").click(function () {
    if($.cookie('theme')!= 'teal' || typeof $.cookie('theme')==='undefined'){
        $.cookie('theme', 'teal', {expires: 1, path: '/'});
        $(":root").removeClass().addClass("teal");
    }
});

$(".gray").click(function () {
    if($.cookie('theme')!= 'gray' || typeof $.cookie('theme')==='undefined'){
        $.cookie('theme', 'gray', {expires: 1, path: '/'});
        $(":root").removeClass().addClass("gray");
    }
});