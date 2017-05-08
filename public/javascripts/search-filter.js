/**
 * Created by Akshat on 5/8/2017.
 */

$(document).ready(function(){
    $("#search-pins-results").show();
    $("#search-boards-results").hide();
    $("#search-pins").addClass("selected");
    $("#search-boards").removeClass("selected");
});

$("#search-pins").click(function () {
    $("#search-pins-results").stop().delay(300).fadeIn();
    $("#search-boards-results").fadeOut(300);
    $(this).addClass("selected");
    $("#search-boards").removeClass("selected");
});

$("#search-boards").click(function () {
    $("#search-pins-results").fadeOut(300);
    $("#search-boards-results").stop().delay(300).fadeIn();
    $(this).addClass("selected");
    $("#search-pins").removeClass("selected");
});