/**
 * Created by Akshat on 3/10/2017.
 */
$(".name").click(function () {
    $(".theme-menu").addClass("expanded");
    $("#theme-list").addClass("visible");
    $(".close-menu").addClass("visible");
    $(".name").removeClass("move-down").addClass("move-up");
});

$(".close-menu").click(function () {
    $(".theme-menu").removeClass("expanded");
    $("#theme-list").removeClass("visible");
    $(".close-menu").removeClass("visible");
    $(".name").removeClass("move-up").addClass("move-down");
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