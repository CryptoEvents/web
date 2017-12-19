 jQuery(document).ready(function($){
$(".all-portfolios").isotope({
itemSelector : '.single-portfolio',

layoutMode: 'fitRows',
});
$('ul.filter li').click(function(){
$("ul.filter li").removeClass("active");
$(this).addClass("active");

var selector = $(this).attr('data-filter');
$(".all-portfolios").isotope({
	
filter: selector,
animationOptions: {
duration: 750,
easing: 'linear',
queue: false,
}
});

return false;
});
});




jQuery(document).ready(function () {

	$('div.sngl_clt').click(function(){
if($(this)[0].children[1].style.display=="block"){
	$(this)[0].children[1].style.display="none";
	$(this).removeClass("active");
}
else {
	$(this)[0].children[1].style.display="block";
	$(this).addClass("active");
}
});

/*----------------------------------------------------*/
/*  Animated Progress Bars
/*----------------------------------------------------*/

    jQuery('.skills li').each(function () {
        jQuery(this).appear(function() {
          jQuery(this).animate({opacity:1,left:"0px"},800);
          var b = jQuery(this).find(".progress-bar").attr("data-width");
          jQuery(this).find(".progress-bar").animate({
            width: b + "%"
          }, 1300, "linear");
        }); 
    });   

/*----------------------------------------------------*/
/* Crousel Team 
/*----------------------------------------------------*/
	$('.all_team').owlCarousel({
		items:4,
		loop:true,
		margin:10,
		nav:true,
		autoplay:true,
		smartSpeed:3000,
		navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
		responsive:{
			0:{
				items:1
			},
			600:{
				items:1
			},
			1000:{
				items:2
			}
		}
	})
	
/*preloder*/
$(window).load(function() { // makes sure the whole site is loaded
	$('#status').fadeOut(); // will first fade out the loading animation
	$('#loader-wrapper').delay(200).fadeOut('slow'); // will fade out the white DIV that covers the website.
	$('body').delay(200).css({'overflow-x':'hidden'});
});
	
$(window).bind('scroll',function(e){
    parallaxScroll();
});
 
function parallaxScroll(){
    var scrolled = $(window).scrollTop();
	if(scrolled<750){
		$('#slider_sec0').css('top',(0-(scrolled*.1))+'px');
		$('#slider_sec1').css('top',(0-(scrolled*.2))+'px');
		$('#slider_sec2').css('top',(0-(scrolled*.3))+'px');
		$('#slider_sec').css('height',(1024-(scrolled*.3))+'px');
	}
}

});

