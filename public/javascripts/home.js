/**
 * Created by Akshat on 3/18/2017.
 */
$("#board-listener").click(function () {
    $("#all").addClass("selected");
    $("#all-boards").show();
    $("#public-boards").hide();
    $("#private-boards").hide();

    $("#show-boards").animate({bottom: "-20px"});
    $("#close-show").stop().delay(800).hide().fadeIn(300);
    $(".title-secondary").stop().delay(800).hide().fadeIn(800);
    $(".filter-buttons").stop().delay(1000).hide().fadeIn(800);
    $(".boards-wrapper").stop().delay(1300).hide().fadeIn(1000);
    $("#underline").hide().fadeIn(500).addClass("expand");
});

$("#close-show").click(function () {
    $("#show-boards").animate({bottom: "100%"});
    $("#close-show").fadeOut();
    $(".title-secondary").fadeOut();
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