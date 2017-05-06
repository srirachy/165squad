/**
 * Created by Akshat on 3/1/2017.
 */
$(document).scroll(function() {
    var scroll = $(document).scrollTop();
    if (scroll > 95) {
        $(".nav").addClass("scrolled");
    }
    else{
        $(".nav").removeClass("scrolled");
    }
});

$(document).ready(function () {
    var theme = $.cookie('theme');
   if(typeof $.cookie('theme')==='undefined'){
       $(":root").removeClass();
   }
   else if(theme== 'monokai'){
       $(":root").removeClass().addClass("monokai");
   }
   else if(theme== 'blue'){
       $(":root").removeClass().addClass("blue");
   }
   else if(theme== 'teal'){
       $(":root").removeClass().addClass("teal");
   }
   else if(theme== 'gray'){
       $(":root").removeClass().addClass("gray");
   }
});
