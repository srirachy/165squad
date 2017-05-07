/**
 * Created by Akshat on 3/18/2017.
 */

$("#pins").click(function () {
    $("#all-boards").hide();
    $("#public-boards").hide();
    $("#private-boards").hide();

    $(".pin-wrapper #sliding-wall").animate({bottom: "-20px"});
    $(".pin-wrapper #close-show").stop().delay(800).hide().fadeIn(300);
    $(".title-secondary-pins").stop().delay(800).hide().fadeIn(800);
    $(".pin-wrapper #underline").hide().fadeIn(500).addClass("expand");
    $(".pin-wrapper-2").stop().delay(1300).hide().fadeIn(1000);
});

$(".pin-wrapper #close-show").click(function () {
    $(".pin-wrapper #sliding-wall").animate({bottom: "100%"});
    $(".pin-wrapper #close-show").fadeOut();
    $(".title-secondary-pins").fadeOut();
    $(".pin-wrapper #underline").fadeOut();
    $(".pin-wrapper-2").stop().fadeOut();
});

$("#boards").click(function () {
    $("#all").addClass("selected");
    $("#all-boards").show();
    $("#public-boards").hide();
    $("#private-boards").hide();

    $("#sliding-wall").animate({bottom: "-20px"});
    $("#close-show").stop().delay(800).hide().fadeIn(300);
    $(".title-secondary-boards").stop().delay(800).hide().fadeIn(800);
    $(".filter-buttons").stop().delay(1000).hide().fadeIn(800);
    $(".boards-wrapper").stop().delay(1300).hide().fadeIn(1000);
    $("#underline").hide().fadeIn(500).addClass("expand");
});

$("#close-show").click(function () {
    $("#sliding-wall").animate({bottom: "100%"});
    $("#close-show").fadeOut();
    $(".title-secondary-boards").fadeOut();
    $(".filter-buttons").fadeOut();
    $(".boards-wrapper").fadeOut();
    $("#underline").fadeOut();
    $("#all").removeClass("selected");
    $("#public").removeClass("selected");
    $("#private").removeClass("selected");
});

$("#all").click(function () {
    $("#public").removeClass("selected");
    $("#private").removeClass("selected");
    $(this).toggleClass("selected");
    $("#all-boards").fadeIn();
    $("#public-boards").hide();
    $("#private-boards").hide();
});

$("#public").click(function () {
    $("#all").removeClass("selected");
    $("#private").removeClass("selected");
    $(this).toggleClass("selected");
    $("#all-boards").hide();
    $("#public-boards").fadeIn();
    $("#private-boards").hide();
});

$("#private").click(function () {
    $("#all").removeClass("selected");
    $("#public").removeClass("selected");
    $(this).toggleClass("selected");
    $("#all-boards").hide();
    $("#public-boards").hide();
    $("#private-boards").fadeIn();
});