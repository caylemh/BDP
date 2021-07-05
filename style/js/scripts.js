/*-----------------------------------------------------------------------------------*/
/* WIDTH CLASS
/*-----------------------------------------------------------------------------------*/
$(document).ready(function(){
"use strict";
    assign_bootstrap_mode();
    $(window).resize(function() {
        assign_bootstrap_mode();
    });
});

function assign_bootstrap_mode() {
    width = $( window ).width();
    var mode = '';
    if (width<768) {
        mode = "mode-xs";
    }
    else if (width<992) {
        mode = "mode-sm";
    }
    else if (width<1200) {
	    $('.dropdown-submenu .dropdown-menu li a').on('touchstart', function(e) {
	    e.preventDefault();
	    window.location.href = $(this).attr('href');
		});
    }
    else if (width>1200) {
        mode = "mode-lg";
    }
    $("body").removeClass("mode-xs").removeClass("mode-sm").removeClass("mode-md").removeClass("mode-lg").addClass(mode);
}
/*-----------------------------------------------------------------------------------*/
/*	CONTENT SLIDER
/*-----------------------------------------------------------------------------------*/
/**************************************************************************
 * jQuery Plugin for Content Slider
 * @version: 1.0
 * @requires jQuery v1.8 or later
 * @author ThunderBudies
 **************************************************************************/

$(document).ready(function () {

    var mainContOut = 0;
    var animclass = "fader"; //fader // slider


    var speed = 1000;

    jQuery.fn.extend({
        unwrapInner: function (selector) {
            return this.each(function () {
                var t = this,
                    c = $(t).children(selector);
                if (c.length === 1) {
                    c.contents().appendTo(t);
                    c.remove();
                }
            });
        }
    });




	///////////////////////////
	// GET THE URL PARAMETER //
	///////////////////////////
	function getUrlVars(hashdivider)
			{
				var vars = [], hash;
				var hashes = window.location.href.slice(window.location.href.indexOf(hashdivider) + 1).split('_');
				for(var i = 0; i < hashes.length; i++)
				{
					hashes[i] = hashes[i].replace('%3D',"=");
					hash = hashes[i].split('=');
					vars.push(hash[0]);
					vars[hash[0]] = hash[1];
				}
				return vars;
			}
	////////////////////////
	// GET THE BASIC URL  //
	///////////////////////
    function getAbsolutePath() {
		    var loc = window.location;
		    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
		    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
    }

    //////////////////////////
	// SET THE URL PARAMETER //
	///////////////////////////
    function updateURLParameter(paramVal){
	    	var baseurl = window.location.pathname.split("#")[0];
	    	var url = baseurl.split("#")[0];
	    	if (paramVal==undefined) paramVal="";

	  		par='#'+paramVal;

		    window.location.replace(url+par);
	}


    var items = jQuery('.content-slider.items a');
    var deeplink = getUrlVars("#");





    jQuery.ajaxSetup({
        // Disable caching of AJAX responses */
        cache: false
    });

    // FIRST ADD THE HANDLING ON THE DIFFERENT PORTFOLIO ITEMS
    items.slice(0, items.length).each(function (i) {
        var item = jQuery(this);
        item.data('index', i);

        if (jQuery.support.leadingWhitespace == false){

        	var conurl = jQuery(this).data('contenturl');
        	item.attr('href',conurl);

        }

        else
        // THE HANDLING IN CASE ITEM IS CLICKED
        item.click(function () {
	        item.addClass("clicked-no-slide-anim");
            var cur = item.data('index');
            var hashy = window.pageYOffset;



            if (jQuery('.dark-wrapper.fixed').length == 0) {
                // PREPARE THE CURRENT CONTENT OF BODY AND WRAP IT
                jQuery('.body-wrapper').wrapInner('<div class="fullcontent-slider-getaway-wrapper"><div class="fullcontent-slider-getaway-slide"></div></div>');
                var origheight = jQuery('.fullcontent-slider-getaway-slide').height();

                //BUILD THE PANEL

                jQuery('body').append('<div class="navcoverpage light-wrapper"></div>' +
                    '<div class="navfake dark-wrapper">' +

                    '<div class="page-title">' +
                    '<div class="container inner">' +
                    '<div class="navigation">' +
                    '<a href="#" id="gwi-thumbs" class="btn pull-left back">Back</a>' +
                    '<a href="#" id="gwi-next" class="btn pull-right rm0 nav-next-item">Next</a>' +
                    '<a href="#" id="gwi-prev" class="btn pull-right rm5 nav-prev-item">Prev</a>' +
                    '</div>' +
                    '<div class="clear"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');

                //ADD A NEW CONTENT WRAPPER
                var conurl = jQuery(this).data('contenturl');
                var concon = jQuery(this).data('contentcontainer');

                updateURLParameter(conurl);

                var extraclass = "";


                jQuery('body').append('<div class="preparedtostart right fullcontent-content-wrapper-new ' + extraclass + ' ' + animclass + '"></div>');

                // FIRST WE LOAD THE VERY FIRST ITEM, WHEN PANEL IS ALREAD IN
                setTimeout(function () {
                    if (conurl != undefined && conurl.length > 0) {

                        jQuery('.fullcontent-content-wrapper-new').load(conurl + " " + concon, function () {


                            jQuery('.preparedtostart.fullcontent-content-wrapper-new').find('.footer-wrapper').remove();
                            jQuery('.navfake h1').html(jQuery('.fullcontent-content-wrapper-new .title').html()).removeClass("novisibility");
                            animateContents(mainContOut, jQuery('.fullcontent-slider-getaway-slide'), jQuery('.preparedtostart.fullcontent-content-wrapper-new'), speed);
                            jQuery('.fullcontent-slider-getaway-slide').css({
                                height: "100%",
                                overflow: 'hidden'
                            })
                            jQuery('body,html').animate({
                                scrollTop: "0px"
                            }, {
                                duration: 10,
                                queue: false
                            });

                            var callback = new Function(item.data('callback'));
                            callback();
                        });

                    } else {
                        jQuery('.fullcontent-content-wrapper-new').append(jQuery(this).data('content'));
                    }
                }, speed + 200);


                // SHOW THE PANEL
                jQuery('.navfake').animate({
                    left: '0px'
                }, {
                    duration: speed - 200,
                    queue: false
                });
                jQuery('.navcoverpage').animate({
                    left: '0px'
                }, {
                    duration: speed - 200,
                    queue: false
                });




                // THE CLICK ON THE THUMB SHOULD ACT LIKE
                jQuery(document).on('click', '#gwi-thumbs', function () {
                	 updateURLParameter();
	                jQuery('.clicked-no-slide-anim').removeClass('clicked-no-slide-anim');
                    jQuery('.preparedtoleave').animate({
                        opacity: 0
                    }, {
                        duration: speed - 100,
                        queue: false,
                        complete: function () {
                            jQuery(this).remove();
                        }
                    });
                    setTimeout(function () {
                        jQuery('body,html').animate({
                            scrollTop: hashy + "px"
                        }, {
                            duration: 10,
                            queue: false
                        });

                        jQuery('.fullcontent-slider-getaway-slide').css({
                            visibility: 'visible'
                        }).animate({
                            left: '0px'
                        }, {
                            duration: speed,
                            queue: false
                        });
                        jQuery('.navcoverpage').animate({
                            left: '100%'
                        }, {
                            duration: speed,
                            queue: false,
                            complete: function () {
                                jQuery(this).remove();
                            }
                        });
                        jQuery('.navfake').animate({
                            left: '100%'
                        }, {
                            duration: speed,
                            queue: false,
                            complete: function () {
                                jQuery(this).remove();
                            }
                        });
                        jQuery('.fullcontent-slider-getaway-slide').unwrap().find('div:nth(0)').unwrap();

                    }, speed - 100);


                    return false;
                }) // END OF CLICK ON ICON-TH

                // THE CLICK ON THE PREV OR NEXT BUTTON
                jQuery('#gwi-next').click(function () {

                    cur = cur + 1;
                    if (cur > items.length) cur = 0;
                    var nextitem;
                    items.slice(cur, cur + 1).each(function () {
                        nextitem = jQuery(this);
                    });
                    swapContents(nextitem, 1, animclass, speed);
                    return false;

                });

                // THE CLICK ON THE PREV OR NEXT BUTTON
                jQuery('#gwi-prev').click(function () {
                    cur = cur - 1;
                    if (cur < 0) cur = items.length - 1;
                    var nextitem;
                    items.slice(cur, cur + 1).each(function () {
                        nextitem = jQuery(this);
                    });
                    swapContents(nextitem, 0, animclass, speed);
                    return false;
                });

            }
            return false;
        }); // END OF CLICK HANDLING ON PORTFOLIO ITEM

   }); // END OF HANDLING ON EACH PORTFOLIO ITEM

   var firstfound=0;
   items.slice(0, items.length).each(function (i) {
     var item=jQuery(this);
   	 if (deeplink!=undefined && deeplink.length>0 && deeplink == jQuery(this).data('contenturl')) {
		   	 	if (firstfound==0) {

	  	 			setTimeout(function() {item.click();},2000);
	  	 			firstfound=1;
	  	 		}
    	    }
   });


    // ANIMATE THE CONTENT CHANGE
    function animateContents(mainContOut, oldbody, newbody, speed) {
        // ANIMATE THE CURRENT BODY OUT OF THE SCREEN
        if (mainContOut != 0) oldbody.delay(0).animate({
            left: '-100%'
        }, {
            duration: speed,
            queue: false,
            complete: function () {
                jQuery(this).css({
                    visibility: 'hidden'
                });
            }
        })

        //jQuery('.navcoverpage').animate({'opacity':0},{duration:1200,queue:false});
        newbody.delay(0).css({
            opacity: 0
        }).animate({
            left: '0px',
            opacity: 1
        }, {
            duration: speed,
            queue: false
        });
        newbody.removeClass('preparedtostart').addClass('preparedtoleave');

    }

    // SWAP CONTENTS
    function swapContents(nextitem, dir, animclass, speed) {


        var lpx = "0px";
        var lpr = "-100%";
        var pos = "right";
        var extraclass = "";

        if (dir == 0) {
            pos = "left"
            lpr = "100%";
        }

        if (animclass == "fader") {
            lpr = "0px";
        }
        jQuery('.preparedtoleave').addClass("killme");



        //ADD A NEW CONTENT WRAPPER
        try {


            var conurl = nextitem.data('contenturl');
            var concon = nextitem.data('contentcontainer');

             updateURLParameter(conurl);



            if (jQuery('.preparedtostart').length == 0) {
                jQuery('body').append('<div class="preparedtostart ' + pos + ' ' + extraclass + ' ' + animclass + ' fullcontent-content-wrapper-new"></div>');
            }


            jQuery('.preparedtostart.fullcontent-content-wrapper-new').load(conurl + " " + concon, function () {


                jQuery('body,html').animate({
                    scrollTop: "0px"
                }, {
                    duration: 10,
                    queue: false
                });
                jQuery('.preparedtostart.fullcontent-content-wrapper-new').css({
                    'opacity': 0
                }).animate({
                    left: lpx,
                    opacity: 1
                }, {
                    duration: speed,
                    queue: false
                });
                jQuery('.killme').animate({
                    left: lpr,
                    opacity: 0
                }, {
                    duration: speed + 100,
                    queue: false,
                    complete: function () {
                        jQuery(this).remove();
                    }
                });
                jQuery('body').find('.preparedtostart.fullcontent-content-wrapper-new').each(function (i) {
                    if (!jQuery(this).hasClass("killme")) {
                        jQuery('.navfake h1').html(jQuery(this).find('.title').html());
                    }
                });
                var callback = new Function(nextitem.data('callback'));
                callback();
                jQuery('.preparedtostart.fullcontent-content-wrapper-new').removeClass('preparedtostart').addClass('preparedtoleave');

            });
        } catch (e) {}



    }
});
/*-----------------------------------------------------------------------------------*/
/*	OWL CAROUSEL
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function($) {
              $('.testimonials').owlCarousel({
                items: 1,
                nav:true,
                navText: ['<i class="icon-left-open-big"></i>','<i class="icon-right-open-big"></i>'],
                dots: false,
                autoHeight: true,
                loop: true,
                margin: 0,
              });
              
              $('.portfolio-slider').owlCarousel({
                items: 1,
                nav:true,
                navText: ['<i class="icon-left-open-big"></i>','<i class="icon-right-open-big"></i>'],
                dots: true,
                autoHeight: false,
                loop: true,
                margin: 0,
                navContainerClass: 'owl-slider-nav',
				navClass: [ 'owl-slider-prev', 'owl-slider-next' ],
				controlsClass: 'owl-slider-controls'
              });
              
              $('.carousel-gallery').owlCarousel({
			    margin:10,
			    navText: ['<i class="icon-left-open-big"></i>','<i class="icon-right-open-big"></i>'],
			    navContainerClass: 'owl-slider-nav',
				navClass: [ 'owl-slider-prev', 'owl-slider-next' ],
				controlsClass: 'owl-slider-controls',
			    nav:true,
			    dots: false,
			    items:1,
			    responsive:{
			    	450:{
			            items:2
			        },
			        1400:{
			            items:3
			        }
			    }
			});            
});
/*-----------------------------------------------------------------------------------*/
/*	VIDEO
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function () {
    jQuery('.player').fitVids();
});
/*-----------------------------------------------------------------------------------*/
/*	CALL PORTFOLIO SCRIPTS
/*-----------------------------------------------------------------------------------*/
function callPortfolioScripts() {

    		  jQuery('.player').fitVids();
    
    		  $('.portfolio-slider').owlCarousel({
                items: 1,
                nav:true,
                navText: ['<i class="icon-left-open-big"></i>','<i class="icon-right-open-big"></i>'],
                dots: true,
                autoHeight: false,
                loop: true,
                margin: 0,
                navContainerClass: 'owl-slider-nav',
				navClass: [ 'owl-slider-prev', 'owl-slider-next' ],
				controlsClass: 'owl-slider-controls'
              });
              
              $('.carousel-gallery').owlCarousel({
			    margin:10,
			    navText: ['<i class="icon-left-open-big"></i>','<i class="icon-right-open-big"></i>'],
			    navContainerClass: 'owl-slider-nav',
				navClass: [ 'owl-slider-prev', 'owl-slider-next' ],
				controlsClass: 'owl-slider-controls',
			    nav:true,
			    dots: false,
			    items:1,
			    responsive:{
			    	450:{
			            items:2
			        },
			    	1400:{
			            items:3
			        }
			    } 
			}); 
};
/*-----------------------------------------------------------------------------------*/
/*	MENU
/*-----------------------------------------------------------------------------------*/
$(document).ready(function () {
    $('.js-activated').dropdownHover({
        instantlyCloseOthers: false,
        delay: 0
    }).dropdown();


    $('.dropdown-menu a, .social .dropdown-menu, .social .dropdown-menu input').click(function (e) {
        e.stopPropagation();
    });

});
/*-----------------------------------------------------------------------------------*/
/*	STICKY HEADER
/*-----------------------------------------------------------------------------------*/
$(document).ready(function () {

    var menu = $('.navbar'),
        pos = menu.offset();

    $(window).scroll(function () {
        if ($(this).scrollTop() > pos.top + menu.height() && menu.hasClass('default') && $(this).scrollTop() > 200) {
            menu.fadeOut('fast', function () {
                $(this).removeClass('default').addClass('fixed').fadeIn('fast');
            });
        } else if ($(this).scrollTop() <= pos.top + 200 && menu.hasClass('fixed')) {
            menu.fadeOut(0, function () {
                $(this).removeClass('fixed').addClass('default').fadeIn(0);
            });
        }
    });

});

$(document).ready(function(){ 
$('.navbar .nav li a').on('click',function(){
	    $('.navbar .navbar-collapse.in').collapse('hide');
	})
	});


/*-----------------------------------------------------------------------------------*/
/*	LOCALSCROLL & SCROLLTO
/*-----------------------------------------------------------------------------------*/
/**
 * Copyright (c) 2007 Ariel Flesler - aflesler<a>gmail<d>com | https://github.com/flesler
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 2.0.0
 */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)}(function(e){function t(t,o,n){var i=o.hash.slice(1),a=document.getElementById(i)||document.getElementsByName(i)[0];if(a){t&&t.preventDefault();var l=e(n.target);if(!(n.lock&&l.is(":animated")||n.onBefore&&!1===n.onBefore(t,a,l))){if(n.stop&&l.stop(!0),n.hash){var r=a.id===i?"id":"name",s=e("<a> </a>").attr(r,i).css({position:"absolute",top:e(window).scrollTop(),left:e(window).scrollLeft()});a[r]="",e("body").prepend(s),location.hash=o.hash,s.remove(),a[r]=i}l.scrollTo(a,n).trigger("notify.serialScroll",[a])}}}var o=location.href.replace(/#.*/,""),n=e.localScroll=function(t){e("body").localScroll(t)};return n.defaults={duration:1e3,axis:"y",event:"click",stop:!0,target:window,autoscroll:!0},e.fn.localScroll=function(i){function a(){return!!this.href&&!!this.hash&&this.href.replace(this.hash,"")===o&&(!i.filter||e(this).is(i.filter))}return(i=e.extend({},n.defaults,i)).autoscroll&&i.hash&&location.hash&&(i.target&&window.scrollTo(0,0),t(0,location,i)),i.lazy?this.on(i.event,"a,area",function(e){a.call(this)&&t(e,this,i)}):this.find("a,area").filter(a).bind(i.event,function(e){t(e,this,i)}).end().end()},n.hash=function(){},n});

/**
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler ○ gmail • com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 2.1.3
 */
;(function(f){"use strict";"function"===typeof define&&define.amd?define(["jquery"],f):"undefined"!==typeof module&&module.exports?module.exports=f(require("jquery")):f(jQuery)})(function($){"use strict";function n(a){return!a.nodeName||-1!==$.inArray(a.nodeName.toLowerCase(),["iframe","#document","html","body"])}function h(a){return $.isFunction(a)||$.isPlainObject(a)?a:{top:a,left:a}}var p=$.scrollTo=function(a,d,b){return $(window).scrollTo(a,d,b)};p.defaults={axis:"xy",duration:0,limit:!0};$.fn.scrollTo=function(a,d,b){"object"=== typeof d&&(b=d,d=0);"function"===typeof b&&(b={onAfter:b});"max"===a&&(a=9E9);b=$.extend({},p.defaults,b);d=d||b.duration;var u=b.queue&&1<b.axis.length;u&&(d/=2);b.offset=h(b.offset);b.over=h(b.over);return this.each(function(){function k(a){var k=$.extend({},b,{queue:!0,duration:d,complete:a&&function(){a.call(q,e,b)}});r.animate(f,k)}if(null!==a){var l=n(this),q=l?this.contentWindow||window:this,r=$(q),e=a,f={},t;switch(typeof e){case "number":case "string":if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(e)){e= h(e);break}e=l?$(e):$(e,q);case "object":if(e.length===0)return;if(e.is||e.style)t=(e=$(e)).offset()}var v=$.isFunction(b.offset)&&b.offset(q,e)||b.offset;$.each(b.axis.split(""),function(a,c){var d="x"===c?"Left":"Top",m=d.toLowerCase(),g="scroll"+d,h=r[g](),n=p.max(q,c);t?(f[g]=t[m]+(l?0:h-r.offset()[m]),b.margin&&(f[g]-=parseInt(e.css("margin"+d),10)||0,f[g]-=parseInt(e.css("border"+d+"Width"),10)||0),f[g]+=v[m]||0,b.over[m]&&(f[g]+=e["x"===c?"width":"height"]()*b.over[m])):(d=e[m],f[g]=d.slice&& "%"===d.slice(-1)?parseFloat(d)/100*n:d);b.limit&&/^\d+$/.test(f[g])&&(f[g]=0>=f[g]?0:Math.min(f[g],n));!a&&1<b.axis.length&&(h===f[g]?f={}:u&&(k(b.onAfterFirst),f={}))});k(b.onAfter)}})};p.max=function(a,d){var b="x"===d?"Width":"Height",h="scroll"+b;if(!n(a))return a[h]-$(a)[b.toLowerCase()]();var b="client"+b,k=a.ownerDocument||a.document,l=k.documentElement,k=k.body;return Math.max(l[h],k[h])-Math.min(l[b],k[b])};$.Tween.propHooks.scrollLeft=$.Tween.propHooks.scrollTop={get:function(a){return $(a.elem)[a.prop]()}, set:function(a){var d=this.get(a);if(a.options.interrupt&&a._last&&a._last!==d)return $(a.elem).stop();var b=Math.round(a.now);d!==b&&($(a.elem)[a.prop](b),a._last=this.get(a))}};return p});
$(document).ready(function(){ 
    $('.navbar, .smooth').localScroll({
	    hash: true
    });
  });
/*-----------------------------------------------------------------------------------*/
/*	SCROLL NAVIGATION HIGHLIGHT
/*-----------------------------------------------------------------------------------*/
$(document).ready(function() {
	var headerWrapper		= parseInt($('.navbar').height());
	
	
	var shrinked_header_height = 53;
	var header_height = $('.navbar').height();
	
	$('.offset').css('padding-top', header_height + 'px');
    $('.anchor').css('padding-top', shrinked_header_height + 'px');  
    $('.anchor').css('margin-top', -(shrinked_header_height) + 'px'); 
    
	var offsetTolerance	= -(header_height);
	
	//Detecting user's scroll
	$(window).scroll(function() {
        //Check scroll position
        var scrollPosition = parseInt($(this).scrollTop(), 10);
        //Move trough each menu and check its position with scroll position then add current class
        $('.onepage .navbar ul.navbar-nav a[href*=#]:not([href=#])').each(function() {
            var thisHref = $(this).attr('href');
            var thisTruePosition = parseInt($(thisHref).offset().top, 10);
            var thisPosition = thisTruePosition - headerWrapper - offsetTolerance;
            if (scrollPosition >= thisPosition) {
                $('.onepage .current').removeClass('current');
                $('.onepage .navbar ul.navbar-nav a[href=' + thisHref + ']').parent('li').addClass('current');
            }
        });
        //If we're at the bottom of the page, move pointer to the last section
        var bottomPage = parseInt($(document).height(), 10) - parseInt($(window).height(), 10);
        if (scrollPosition == bottomPage || scrollPosition >= bottomPage) {
            $('.onepage .current').removeClass('current');
            $('.onepage .navbar ul.navbar-nav a:last').parent('li').addClass('current');
        }
    });
	
});
/*-----------------------------------------------------------------------------------*/
/*	RETINA
/*-----------------------------------------------------------------------------------*/
$(function() {
			$('.retina').retinise();
		});
/*-----------------------------------------------------------------------------------*/
/*	ISOTOPE CLASSIC PORTFOLIO
/*-----------------------------------------------------------------------------------*/
$(document).ready(function () {
    var $container = $('.fix-portfolio .items');
    $container.imagesLoaded(function () {
        $container.isotope({
            itemSelector: '.item',
            layoutMode: 'fitRows'
        });
    });

    $(window).on('resize', function () {
        $('.fix-portfolio .items').isotope('reLayout')
    });
    
    $('.fix-portfolio .filter li a').click(function () {

        $('.fix-portfolio .filter li a').removeClass('active');
        $(this).addClass('active');

        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector
        });

        return false;
    });
});
/*-----------------------------------------------------------------------------------*/
/*	REVOLUTION
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function() {
jQuery('.fullscreenbanner').revolution(
	{
		delay: 9000,
		startwidth: 1170,
		startheight: 550,
		hideThumbs: 200,
		fullWidth:"off",
		fullScreen:"on"
	});
});
/*-----------------------------------------------------------------------------------*/
/*	INSTAGRAM WIDGET
/*-----------------------------------------------------------------------------------*/
var widgetFeed = new Instafeed({
		target: 'instawidget',
        get: 'user',
        limit: 6,
        userId: 1215763826,
		accessToken: '1215763826.f1627ea.dad6ca96bd7642519b573d52c3ef467f',
        resolution: 'thumbnail',
        template: '<li><span class="icon-overlay"><a href="{{link}}" target="_blank"><img src="{{image}}" /></a></span></li>',
        after: function () {    
		    $('.icon-overlay a').prepend('<span class="icn-more"></span>');
		  }
    });
    
        $('#instawidget').each(function() {
    widgetFeed.run();
});
/*-----------------------------------------------------------------------------------*/
/*	FANCYBOX
/*-----------------------------------------------------------------------------------*/
$(document).ready(function () {
    $(".fancybox-media").fancybox({
        arrows: true,
        padding: 0,
        closeBtn: true,
        openEffect: 'fade',
        closeEffect: 'fade',
        prevEffect: 'fade',
        nextEffect: 'fade',
        helpers: {
            media: {},
            overlay: {
                locked: false
            },
            buttons: false,
            thumbs: {
                width: 50,
                height: 50
            },
            title: {
                type: 'inside'
            }
        },
        beforeLoad: function () {
            var el, id = $(this.element).data('title-id');
            if (id) {
                el = $('#' + id);
                if (el.length) {
                    this.title = el.html();
                }
            }
        }
    });
});
/*-----------------------------------------------------------------------------------*/
/*	PRETTIFY
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function () {
    window.prettyPrint && prettyPrint()
});
/*-----------------------------------------------------------------------------------*/
/*	PARALLAX MOBILE
/*-----------------------------------------------------------------------------------*/
$(document).ready(function () {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i)) {
        $('.parallax').addClass('mobile');
    }
});
/*-----------------------------------------------------------------------------------*/
/*	FORM
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function ($) {
    $('.forms').dcSlickForms();
});
$(document).ready(function () {
    $('.comment-form input[title], .comment-form textarea, .forms textarea').each(function () {
        if ($(this).val() === '') {
            $(this).val($(this).attr('title'));
        }

        $(this).focus(function () {
            if ($(this).val() == $(this).attr('title')) {
                $(this).val('').addClass('focused');
            }
        });
        $(this).blur(function () {
            if ($(this).val() === '') {
                $(this).val($(this).attr('title')).removeClass('focused');
            }
        });
    });
});
/*-----------------------------------------------------------------------------------*/
/*	DATA REL
/*-----------------------------------------------------------------------------------*/
$('a[data-rel]').each(function () {
    $(this).attr('rel', $(this).data('rel'));
});
/*-----------------------------------------------------------------------------------*/
/*	TOOLTIP
/*-----------------------------------------------------------------------------------*/
$(document).ready(function () {
    if ($("[rel=tooltip]").length) {
        $("[rel=tooltip]").tooltip();
    }
});
/*-----------------------------------------------------------------------------------*/
/*	TABS
/*-----------------------------------------------------------------------------------*/
$(document).ready(function () {
    $('.tabs.tabs-top').easytabs({
        animationSpeed: 300,
        updateHash: false
    });
});
/*-----------------------------------------------------------------------------------*/
/*	IMAGE ICON HOVER
/*-----------------------------------------------------------------------------------*/
$(document).ready(function () {
    $('.icon-overlay a').prepend('<span class="icn-more"></span>');
});
/*-----------------------------------------------------------------------------------*/
/* NAV BASE LINK
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function($) {
jQuery('a.js-activated').not('a.js-activated[href^="#"]').click(function(){
var url = $(this).attr('href');
window.location.href = url;
return true;
});
});