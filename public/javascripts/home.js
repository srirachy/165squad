/**
 * Created by Akshat on 3/18/2017.
 */
$("#board-listener").click(function () {
    $("#show-boards").addClass("visible");
    $("#close-show").addClass("visible");
    $(".title-secondary").addClass("visible");
    $(".boards-wrapper").addClass("visible");
    $("#underline").addClass("expand");
});

$("#close-show").click(function () {
    $("#show-boards").removeClass("visible");
    $("#close-show").removeClass("visible");
    $(".title-secondary").removeClass("visible");
    $(".boards-wrapper").removeClass("visible");
    $("#underline").removeClass("expand");
});