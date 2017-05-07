/**
 * Created by Akshat on 3/1/2017.
 */
$(document).scroll(function() {
    var scroll = $(document).scrollTop();
    if (scroll > 0) {
        $(".nav").addClass("scrolled");
    }
    else{
        $(".nav").removeClass("scrolled");
    }
});