var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

//noinspection JSUnresolvedVariable
/**
 * @file main.js
 *
 * Initializer for `require-js` and consequently the moduler parts of the
 * Javascript on the site.
 *
 */

 var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
    return query_string;
} ();

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
    return null;
}

function displayQueryStringMessages(){

  msgId = getUrlParameter('msg');

  if( msgId !== '' && msgId != null){
    var msg = '';
    switch(msgId) {
        case '1':
        	  msg = "Successfully signed in";
              break;
        case '2':
            msg = "Registration was successful.";
            break;
        case '3':
            msg = "Your profile was updated.";
            break;
        case '4':
            msg = "Your password was changed.";
            break;
        case '5':
            msg = "Account added to your profile.";
            break;
        case '6':
            msg = "Your password was reset.";
            break;
        case '7':
            msg = "Password successfully updated.";
            break;
        case '8':
            msg = "Register or sign in for enterprise downloads";
            break;
        case '9':
            msg = "Complete your profile for enterprise downloads";
            break;
        case '99':
            msg = "An error occured.";
            break;
        default:
            msg = "";
    }
    if(history && history!=="undefined"){
    	history.replaceState({}, "title", top.location.href.substring(0, top.location.href.indexOf('?')));
    }
    var div = $('<div class="page-message">' + msg + '</div>').hide();
    $('main').children('div:first').prepend(div.fadeIn(300).delay(1500).fadeOut(700));
  }
}

function setCookie(cname, cvalue, exdays) {
	if( exdays === '' || msgId === null){
		exdays = 365;
	}
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + encodeURIComponent(cvalue) + "; " + expires + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

// Create selector for javascript detection
$('body').addClass('js-on');

// Create selector for redesign detection
if($('.section').length){
  $('body').addClass('v2');
}

// Create selector for dev portal detection
if($('#global-header').hasClass('dev-portal')){
  $('body').addClass('dev-portal');
}

// Create selector for sso detection
if($('.sso-tpl').length){
  $('body').addClass('sso');
}

 // Function for adding events to
 var addEvent = function(elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false );
    } else if ( elem.attachEvent ) {
        elem.attachEvent( "on" + type, eventHandle );
    } else {
        elem["on"+type]=eventHandle;
    }
};

 // Function for removing events from
 var removeEvent = function(elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if ( elem.removeEventListener ) {
        elem.removeEventListener( type, eventHandle, false );
    } else if ( elem.detatchEvent ) {
        elem.detatchEvent( "on" + type, eventHandle );
    }
};

 var staticHeaderBrowserWidth = 1087;
 var staticHeaderHeight = 0;

/* Returns height of elements */
function getElementHeight(selectorId){
	if (window.document.getElementById(selectorId) !== null){
		return document.getElementById(selectorId).offsetHeight;
	}
	return 0;
}

/* Returns height of fixed-position elements */
function getElementFixedHeight(selectorId){
	if (window.document.getElementById(selectorId) !== null){
		if ($('#'+selectorId).hasClass('fixed')){
			return document.getElementById(selectorId).offsetHeight;
		}
	}
	return 0;
}

function getElementResponsiveHeight(selectorId){
	if(window.innerWidth > staticHeaderBrowserWidth){
		return getElementHeight(selectorId);
	}
	return 0;
}

function getElementOffsetTop(selectorId){
	if (window.document.getElementById(selectorId) !== null){
		return document.getElementById(selectorId).offsetTop;
	}
	return 0;
}

function offsetContent(){
	var newHeight = getElementResponsiveHeight('global-header');
	document.getElementById('global-content').style.marginTop = newHeight + 'px';
}

//offsetContent();
//addEvent(window, "resize", offsetContent);


function resizeImages(){
	var newHeight = getElementHeight('global-header') + getElementHeight('main-promo');
	if (window.document.getElementById('main-promo') !== null){
		if(window.innerWidth > 800){
			document.getElementById('main-promo').style.backgroundSize = '100% ' + newHeight + 'px';
		}
	}
	/* debug */ //console.log(newHeight);
}

resizeImages();
addEvent(window, "resize", resizeImages);

function resizeIframe(iframe){
	//console.log($(iframe).parent().css('height'));
	$(iframe).css('height',$(iframe).parent().css('height')).addClass('border');
	addEvent(window, "resize", function(){$(iframe).css('height',$(iframe).parent().css('height')).addClass('border');});
}

function initializePageTemplate(){
	var pageTemplateSelector = 'page-template-attributes';
	if (window.document.getElementById(pageTemplateSelector) !== null){
		var el = $('<div id="' + $('#' + pageTemplateSelector).data('template-id') + '" class="' + $('#' + pageTemplateSelector).data('template-class') + '"></div>');
    if($('#' + pageTemplateSelector).data('template-class').indexOf('body-wrapper') > -1){
      //console.log('body');
      $('body').wrapInner(el);
    }
    else{
      //console.log('main');
      $('main').wrapInner(el);
    }
    $('main').wrapInner(el);
		$('#' + pageTemplateSelector).remove();
	}
}

var jumpNavId = 'jump-nav';
var jumpNavMarkerId = 'jump-nav-marker';
var $jumpNavs = $('.jump-nav');
var jumpNav = [];
var $jumpNavBanners = $('section.banner[data-jump-flag="true"]');

function initializeJumpNav(){

	/* Select banners that should have jump links. */
	if($jumpNavBanners.length){

		/* Loop through matching banners. */
		$jumpNavBanners.each(function(){

			var $jumpNav = $(this).parent().find('.jump-nav:first');

			/* Get all sections that should have jump links (Sections with H2s that aren't footer templates). */
			var $jumpNavSections = $(this).parents().eq(1).find('section:not(".banner, .tpl-footer") h2').closest('section');
			if($jumpNavSections.length){

				/* Loop through sections */
				$jumpNavSections.each(function(){
					var $header = $(this).find('h2:first');
					var headerText = $header.text();
					var headerId = headerText.toLowerCase().replace(/ /g,'-').replace(/['/"!.,?&#@^()]/g,'');
					headerId = headerId.replace(/\u00a0/g, '-');//For replacing &nbsp; before the version number
					$header.closest('section').attr('id',headerId);

					/* Append links to jump nav	*/
					$jumpNav.find('ul').append('<li class="col"><a id="'+headerId+'-link" href="#'+headerId+'" class="anchor"><span>'+headerText+'</span></a></li>');
				});
			}
		});
	}

	var jumpNavSelector = 'nav.' + jumpNavId;
	var $jumpNavsToMove = $jumpNavs.filter('.move-into-banner');

	var bannerSelector = '.banner';
	var jumpNavLinkSelector = '.' + jumpNavId + ' li a';
	var jumpNavHeight = getElementHeight(jumpNavId);

	// If the jump nav is supposed to be embedded into the banner, the jump nav will have a specified class.
	if ($jumpNavsToMove.length) {
		index = 0;
		$jumpNavsToMove.each(function(){
			var thisNavSelector = 'moved-nav-' + index;
			$(this).addClass(thisNavSelector);

			$banner = $(this).siblings(bannerSelector);
			if ($banner.length) {
				$banner.addClass('has-jump-nav').append($(this).siblings('.jump-nav-marker')).append($(this));

				// Set the jump-nav background image to match the banner.
				if ($banner.hasClass('bg-img')) {
					$("<style type='text/css'> .jump-nav."+thisNavSelector+".fixed{ background-image:" + $banner.css('background-image') + ";} </style>").appendTo("head");
				}
			}
			index += 1;
		});
	}

	$(jumpNavLinkSelector).each(function(){
		var linkHref = $(this).attr('href');

		/* Check to confirm jump link */
		if(linkHref.indexOf('#') == 0){
			var linkId = $(this).attr('id');
			if(document.getElementById(linkHref.replace('#',''))){
				//console.log('link:' + linkHref);
				var sectionHeight = getElementHeight(linkHref.replace('#',''));

				jumpNav.push({id:linkId, href:linkHref, top:($(linkHref).offset().top - jumpNavHeight), height:(sectionHeight)});
				//console.log('id:' + linkId +', href:' + linkHref + ', top:' + ($(linkHref).offset().top - jumpNavHeight) + ', height:' + sectionHeight);
			}
		}
	});
}
function refreshJumpNav(){

	var jumpNavSelector = 'nav.jump-nav';

	if ($(jumpNavSelector).length) {

		var scrollHeight = $(window).scrollTop();
		var jumpNavHeight = getElementHeight('jump-nav');

		/* Positioning */

		var jumpNavEl = document.getElementById(jumpNavId);
		var jumpNavMarker = document.getElementById(jumpNavMarkerId);
		// If scrollHeight is lower than jump nav, use a fixed position
		if((scrollHeight >= getElementOffsetTop(jumpNavId + '-marker') - staticHeaderHeight) && (scrollHeight < (jumpNav[jumpNav.length-1].top + jumpNav[jumpNav.length - 1].height)) ){
			jumpNavEl.classList.add('fixed', 'border');
			jumpNavEl.style.top = staticHeaderHeight + 'px';
			jumpNavMarker.style.height = jumpNavHeight + 'px';
	    }
	    else{
	    	// If not lower than jump nav
	    	jumpNavEl.classList.remove('fixed', 'border');
	    	jumpNavEl.style.top = '0px';
	    	jumpNavMarker.style.height = '0px';
	    }
		/* debug */ //console.log("scrollTop:" + $(window).scrollTop() + "#jump-nav-marker offset.top:" + $('#jump-nav-marker').offset().top + " | " + $('#jump-nav-marker').outerHeight() + ' | ' + jumpNav.offsetHeight);

		/* Link highlighting */

		if( (scrollHeight > jumpNav[0].top) && (scrollHeight < (jumpNav[jumpNav.length-1].top + jumpNav[jumpNav.length - 1].height)) ){
			//console.log('In range (' + scrollHeight +')');
			for(i=0;i < jumpNav.length;i++){
				if( (scrollHeight > jumpNav[i].top) & (scrollHeight < (jumpNav[i].top + jumpNav[i].height)) ){
					//console.log(jumpNav[i].id);
					$('.jump-nav a').removeClass('selected');
					$('.' + jumpNav[i].id).addClass('selected');
				}
			}
		}
		else{
			$('.jump-nav a').removeClass('selected');
			//console.log('Out of range (' + scrollHeight +')');
		}
	}
}

var pageNavId = 'page-nav';
var pageNavMarkerId = 'page-nav-marker';

function initializePageNav(){
	//console.log('initializePageNav()');
	pageNav = [];
	var pageNavSelector = 'div#' + pageNavId;
	var pageNavMoveSelector = pageNavSelector + '.move-into-banner';
	var bannerSelector = '.banner';
	var pageNavLinkSelector = 'div#' + pageNavId + ' li a';
	var dynamicPageNavLinkSelector = 'nav#' + pageNavId + ' li a';
	var pageNavHeight = getElementHeight(pageNavId);

	// If the page nav is supposed to be embedded into the banner, the page nav will have a specified class.
	if ($(pageNavMoveSelector).length) {
		if ($(bannerSelector).length) {
			$(bannerSelector).addClass('has-page-nav').append($(pageNavSelector + '-marker')).append($(pageNavSelector));

			// Set the page-nav background image to match the banner.
			if ($(bannerSelector).hasClass('bg-img')) {
				$("<style type='text/css'> #page-nav.fixed{ background-image:" + $(bannerSelector).css('background-image') + ";} </style>").appendTo("head");
			}
		}
	}

	$(pageNavLinkSelector).each(function(){
		var linkHref = $(this).attr('href');

		if(linkHref.indexOf('#') == 0){
			var linkId = $(this).attr('id');
			if(document.getElementById(linkHref.replace('#','')+ '-section')){
				//console.log('link:' + linkHref);
				var sectionHeight = getElementHeight(linkHref.replace('#','') + '-section');

				pageNav.push({id:linkId, href:linkHref, top:($(linkHref).offset().top - pageNavHeight), height:(sectionHeight)});
				//console.log('id:' + linkId +', href:' + linkHref + ', top:' + ($(linkHref).offset().top - pageNavHeight) + ', height:' + sectionHeight);
			}
		}
	});

	$(dynamicPageNavLinkSelector).each(function(){
		var linkHref = $(this).attr('href');

		/* Check to confirm jump link */
		if(linkHref.indexOf('#') == 0){
			var linkId = $(this).attr('id');
			if(document.getElementById(linkHref.replace('#',''))){
				//console.log('link:' + linkHref);
				var sectionHeight = getElementHeight(linkHref.replace('#',''));

				pageNav.push({id:linkId, href:linkHref, top:($(linkHref).offset().top - pageNavHeight), height:(sectionHeight)});
				//console.log('id:' + linkId +', href:' + linkHref + ', top:' + ($(linkHref).offset().top - pageNavHeight) + ', height:' + sectionHeight);
			}
		}
	});

}

function refreshPageNav(){

	var pageNavSelector = 'div#page-nav';

	if ($(pageNavSelector).length) {

		var scrollHeight = $(window).scrollTop();
		var pageNavHeight = getElementHeight('page-nav');

		/* Positioning */

		var pageNavEl = document.getElementById(pageNavId);
		var pageNavMarker = document.getElementById(pageNavMarkerId);
		// If scrollHeight is lower than page nav, use a fixed position
		if((scrollHeight >= getElementOffsetTop(pageNavId + '-marker') - staticHeaderHeight) && (scrollHeight < (pageNav[pageNav.length-1].top + pageNav[pageNav.length - 1].height)) ){
			pageNavEl.classList.add('fixed', 'border');
			pageNavEl.style.top = staticHeaderHeight + 'px';
			pageNavMarker.style.height = pageNavHeight + 'px';
	    }
	    else{
	    	// If not lower than page nav
	    	pageNavEl.classList.remove('fixed', 'border');
	    	pageNavEl.style.top = '0px';
	    	pageNavMarker.style.height = '0px';
	    }
		/* debug */ //console.log("scrollTop:" + $(window).scrollTop() + "#page-nav-marker offset.top:" + $('#page-nav-marker').offset().top + " | " + $('#page-nav-marker').outerHeight() + ' | ' + pageNav.offsetHeight);

		/* Link highlighting */

		if( (scrollHeight > pageNav[0].top) && (scrollHeight < (pageNav[pageNav.length-1].top + pageNav[pageNav.length - 1].height)) ){
			//console.log('In range (' + scrollHeight +')');
			for(i=0;i < pageNav.length;i++){
				if( (scrollHeight > pageNav[i].top) & (scrollHeight < (pageNav[i].top + pageNav[i].height)) ){
					//console.log(pageNav[i].id);
					if(!$('#' + pageNav[i].id).hasClass('selected')){
						$('#page-nav a').removeClass('selected');
						$('#' + pageNav[i].id).addClass('selected');
					}
				}
			}
		}
		else{
			$('#page-nav a').removeClass('selected');
			//console.log('Out of range (' + scrollHeight +')');
		}
	}
}

function initializeFilters(){
	if ($('.filters').length) {

		toggleCount = 10; // use all/fewer toggle when there are more than this many items

		$('.toggle').each(function(){

			/* Hide all/fewer toggles of fewer than the toggle number */
			if($(this).hasClass('see-fewer')){
				if($(this).siblings().length > (toggleCount + 2)){
					$(this).siblings(":nth-child(n+"+ (toggleCount + 1) +"):not('.toggle')").addClass('hide').hide();
				}
				else{
					$(this).siblings('.toggle').addClass('hide').hide();
				}
			}

			$(this).click(function() {

				/* Hide this toggle and show its sibling */
				$(this).hide().siblings('.toggle').removeClass('hide').show();

				/* Different behaviors for different toggle types */

					/* Show all siblings */
					if($(this).hasClass('see-all')){
						$(this).siblings(":not('.toggle')").removeClass('hide').show();
					}

					/* Hide all list items after the first set that should be shown */
					else if($(this).hasClass('see-fewer')){
						$(this).siblings(":nth-child(n+"+ (toggleCount + 1) +"):not('.toggle')").addClass('hide').hide();
					}

					/* Show child list */
					else if($(this).hasClass('expand')){
						$(this).siblings('ul').removeClass('hide').show();
					}

					/* Hide child list */
					else if($(this).hasClass('contract')){
						$(this).siblings('ul').addClass('hide').hide();
					}

  				return false;
			});
		});

	}
}


(function(context, require, isSandboxed) {
	"use strict";

	if (isSandboxed) {
		throw "Help! I'm stuck in a sandbox!";
	}

	var scriptTags = document.getElementsByTagName('script');
	var mainScriptSrc;
	var domainRelPathToMainJsDir;

	/** @type {HTMLScriptElement} tag */
	var tag;
	for (var i=0; i<scriptTags.length; i++) {

		tag = scriptTags[i];

	    if (tag.hasAttribute("rel") &&
	        tag.getAttribute("rel") === "main" &&
	        tag.hasAttribute("src")) {

	        mainScriptSrc = tag.getAttribute("src");
	    }
	}

	if (typeof mainScriptSrc !== 'string') {
	    throw "Can't find script rel=main!";
	}

	// Get everything that comes before "/main.js" in the 'src'
	// attribute which included this script
	var pathMatchResults = mainScriptSrc.match(/^(.*)\/.+$/);

	if (pathMatchResults.length === 2) {
	    domainRelPathToMainJsDir = pathMatchResults.pop();
	} else {
		throw "Couldn't determine domain-relative path to main JS!";
	}

	var config = {
		baseUrl: domainRelPathToMainJsDir,
		paths: {

			// the left side is the module ID,
			// the right side is the path to
			// the jQuery file, relative to baseUrl.
			// Also, the path should NOT include
			// the '.js' file extension. This example
			// is using jQuery 1.9.0 located at
			// js/lib/jquery-1.9.0.js, relative to
			// the HTML page.
			jquery: 'jquery-stub',
			application: 'application'
		}
	};

	/* debug*/ //console.log('require config: ', config);
	require.config(config);

	require(['application'], function(application) {
		console.log('on application; application = ', application);
		context.CbApp = application;
	});

})(
	// either the global context (window),
	// or empty object if run in isolation.
	this,
	// global requirejs function
	(typeof window == 'undefined')? require: window.requirejs,
	// only true in a script-local environment such as node.js
	// where there is no shared global object, e.g. `window`.
	(typeof exports !== 'undefined' && this.exports !== exports)
);


/*------------------------------------------------
 * JQuery Plugin: "EqualHeights"
 * Version: 2.0, 08.01.2008
 * by Scott Jehl, Todd Parker, Maggie Costello Wachs (http://www.filamentgroup.com)
 * Copyright (c) 2008 Filament Group. Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
 *
 * Description: Sets the heights of the top-level children of an element to match the tallest child.
 * Modified: added .not('.no_height') to prevent no_height items from being modified
 * Modified: added .addClass('fixed_height') to children where height is set
------------------------------------------------*/

$.fn.equalHeights = function(px) {
	$(this).each(function(){

		//console.log('equalHeights');

		// MODIFICATION: CLEARING HEIGHTS FIRST
		if ($.browser.msie && $.browser.version == 6.0) {
			$(this).children().css({'height':''});
			$(this).children().children('.full_height').css({'height':''});
		}
		$(this).children().css({'height': ''});
		$(this).children().children('.full_height').css({'height':''});

		var currentTallest = 0;
		var currentTallestSub = 0;
		$(this).children().each(function(i){
			if ($(this).height() > currentTallest) { currentTallest = $(this).height();}
			if ($(this).children('.full_height').height() > currentTallestSub) { currentTallestSub = $(this).children('.full_height').height();}
		});

		// for ie6, set height since min-height isn't supported
		if ($.browser.msie && $.browser.version == 6.0) {
			$(this).children().not('.no_height').css({'height': currentTallest});
			$(this).children().not('.no_height').children('.full_height').css({'height': currentTallestSub});
		}

		// set height
		$(this).children().not('.no_height').css({'height': currentTallest});
		$(this).children().not('.no_height').children('.full_height').css({'height': currentTallestSub});

		// add CSS class
		$(this).children().not('.no_height').addClass('fixed_height');
		$(this).children().not('.no_height').children('.full_height').addClass('fixed_height');
	});

	return this;
};

function setEqualHeights(){
	//Calling .equalHeights() was throwing a error
	//$('.equal-heights').equalHeights();
}

function scrollTo(dest,speed){
	if(typeof speed === 'undefined'){ speed='fast'; }
	if(typeof dest !== 'undefined'){
		if($(dest).length){
			$('html,body').animate({ scrollTop: $(dest).offset().top }, speed);
			$(dest).focus();
		}
	}
}

function showContent(selectorToShow,selectorToHide,effect,speed,selectorToFocus,focusSet){
	if((typeof selectorToShow != 'undefined') && (typeof selectorToHide != 'undefined')){

		if(typeof effect === 'undefined')	{ effect='fade'; }
		if(typeof speed === 'undefined')	{ speed='fast'; }

		if($(selectorToShow).is(':hidden')){
			if(effect == 'slide'){
				if($(selectorToHide + ':visible').length){
					$(selectorToHide + ':visible').hide();
					$(selectorToShow).fadeIn(speed);
				}
				else{
					$(selectorToShow).slideDown(speed);
				}
			}
			else if(effect == 'show'){
				if($(selectorToHide + ':visible').length){
					$(selectorToHide + ':visible').hide();
				}
				$(selectorToShow).show();
			}
			// default effect is fade
			else{
				if($(selectorToHide + ':visible').length){
					$(selectorToHide + ':visible').fadeOut(speed, function(){
						$(selectorToShow).fadeIn(speed);
					});
				}
				else{
					$(selectorToShow).fadeIn(speed);
				}
			}
		}

	}

	if((typeof focusSet != 'undefined') && (typeof selectorToFocus != 'undefined')){
		$(focusSet).removeClass('selected');
		$(selectorToFocus).addClass('selected');
	}
}

function renderColumns(){
	/* debug */ console.group('createColumns');

	var j = 1;

	$('.js-cols').each(function() {
		var cols = $(this).data('columns');
		var direction = $(this).data('list-direction');

		var listSelector = ".col-list-" + j;
		var obj = jQuery(this);
		var totalListElements = jQuery(this).children('div').size();
		var rows = Math.ceil(totalListElements / cols);
		var listClass = $(this).attr('class');

		/* debug */ //console.log(cols + ' columns, ' + rows + ' rows,' + totalListElements + ' total elements, class = ' + listClass);

		/*
		Create List Elements given row number
		*/

		for (i=1;i<=rows;i++){
			if(i==1){
				$(this).removeClass(listClass).addClass('row row1').wrap('<div class="cols cols-'+cols+' '+listSelector.replace('.','')+'"></div>');
				$(this).parents(listSelector).addClass(listClass);
			} else{
				$(this).parents(listSelector).append('<div class="row row'+i+'"></div>');
			}
		}

		var index = 1;

		/*
		Append List Elements to the respective row  - Horizontal
		*/

		if(direction == 'horizontal'){

			$(this).children('div').each(function(){
				if(index > cols){
					var rowNumber = Math.ceil(index / cols);
					$(this).parents(listSelector).find('.row'+rowNumber).append(this);
				}
				index = index+1;
			});

			$(listSelector).find('div.row').each(function(){
				if($(this).children().size() == 0) {
				$(this).remove();
				}
			});
		}

		/*
		Append List Elements to the respective row  - Vertical
		*/

		else{
			$(this).children('div').each(function(){
				var rowNumber = rows - (index % rows);
				$(this).parents(listSelector).find('.row'+rowNumber).append(this);
				index = index+1;
			});
		}

		$(listSelector + ' .row').children('div').each(function(){
			$(this).addClass('col');
		});

	});

	/* debug */ console.groupEnd();
}

function initializeLearnMoreLinks(){
	console.log('initializeLearnMoreLinks...');
}

function formatColumns(){
	/* debug */ //console.group('createColumns');

	$('.table').each(function() {
		if($(this).attr('highlight-column')){
			var col = $(this).data('highlight-column');
			$('.table th:nth-child('+col+'), .table td:nth-child('+col+')').addClass('highlight');
		}
	});
}
var ctaId = 'persistent-ctas';
var ctaMarkerId = 'persistent-ctas-marker';

// Fade in CTA after user stops scrolling for 250 milliseconds
function showPersistentCTAs(){
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function() {
        $('#' + ctaId).slideDown('');
		removeEvent(window, "scroll", showPersistentCTAs);
    }, 250));
}

function initializePersistentCTAs(){
	var footerSelector = 'global-footer';
	var persistentCtaHeight = getElementHeight(ctaId);
	var footerHeight = getElementHeight(footerSelector);
	var heightAboveFooter = $('#'+footerSelector).offset().top - persistentCtaHeight;
}
function refreshPersistentCTAs(){

	if ($('#' + ctaId).length) {

		var scrollHeight = $(window).scrollTop()  + $(window).height();
		var ctaHeight = getElementHeight(ctaId);

		/* Positioning */

		var ctaEl = document.getElementById(ctaId);
		var ctaMarker = document.getElementById(ctaMarkerId);
		// If scrollHeight is higher than persistent CTA marker, use a fixed position
		if(scrollHeight <= getElementOffsetTop(ctaId + '-marker')){
			ctaEl.classList.add('fixed');
			ctaMarker.style.height = ctaHeight + 'px';
	    }
	    else{
	    	// If not lower than page nav
	    	ctaEl.classList.remove('fixed');
	    	ctaMarker.style.height = '0px';
	    }
	}
}

var $articleNav = $('.section-nav');
var $articleNavContainer = $articleNav.children().first();

function resizeSectionNav(){
  if ($(window).width() >= 800) {
	   $articleNavContainer.css('width', '100%');
  }
}
function positionSectionNav(){
	var navPosition = $articleNav.offset();
	var windowBottom = $(window).scrollTop() + $(window).height()
	var navPositionBottom = navPosition.top + $articleNav.height();

	if(($(window).scrollTop() > navPosition.top) && (windowBottom < navPositionBottom)){
		$articleNavContainer.addClass('fixed').removeClass('fixedToBottom');
	}
	else if (windowBottom >= navPositionBottom){
		$articleNavContainer.addClass('fixedToBottom').removeClass('fixed');
	}
	else {
			$articleNavContainer.removeClass('fixed fixedToBottom');
	}
}


// document ready
$(function(){

	initializePageTemplate();

	if (window.document.getElementById(ctaId) !== null){
		initializePersistentCTAs();
		addEvent(window, "scroll", refreshPersistentCTAs);
	}

	renderColumns();
	formatColumns();

	setEqualHeights();

	$(window).resize(function() {
		setEqualHeights();
	});

  displayQueryStringMessages();

	/* Embed a section into the previous section if flagged. */
	var $sectionsToAbsorb = $('section.move-into-last-section');
	if($sectionsToAbsorb.length){

		/* Loop through matching elements. */
		$sectionsToAbsorb.each(function(){
			var $previousSection = $(this).prev();
			$(this).appendTo($previousSection);
		});
	}

	/* Assign a selector to every other section. */
	$('section:not(.banner)').filter(':odd').addClass('alt-section');

	$('.static-height').each(function( index ) {
		$(this).css('height',$(this).css('height'));
	});

	/* Add line numbers to Prism code highlighting */
	$('pre code').parent('[class*="language-"]').addClass('line-numbers');

	/* using fade instead of slide animation due to Firefox 3d-transform bug */
	$('.wire-carousel').slick({
		dots: true,
		infinite: true,
		speed: 300,
		slidesToShow: 1,
		draggable:false,
		fade: true,
		swipe:false,
		touchMove:false,
		adaptiveHeight: true,
		onInit:function(){$('.slick-cloned').attr('tabindex','-1');}
	});

	/* using fade instead of slide animation due to Firefox 3d-transform bug */
	$('div.section .carousel').slick({
		dots: true,
		infinite: true,
		speed: 300,
		slidesToShow: 1,
		draggable:true,
		fade: true,
		swipe:true,
		touchMove:true,
		onInit:function(){$('.slick-cloned').attr('tabindex','-1');}
	});

  if($('section#hp-banner .carousel .carousel_slide').length > 1){

    var homepageCarouselDisplayLength = 8000;

    // After slide change
    $('section#hp-banner .carousel').on('init', function(event, slick, currentSlide, nextSlide){
      $('.slick-cloned').attr('tabindex','-1');
      $('section#hp-banner .carousel_load-bar_meter').stop(true, true).animate({
          width: "100%",
        },
        homepageCarouselDisplayLength,
        function(){
          $('section#hp-banner .carousel_load-bar_meter').css('width','0px');
        }
      );
    });

    /* using fade instead of slide animation due to Firefox 3d-transform bug */
  	$('section#hp-banner .carousel').slick({
      arrows: false,
      //autoplay: true,
      autoplaySpeed: homepageCarouselDisplayLength,
  		dots: true,
  		infinite: true,
  		speed: 300,
  		slidesToShow: 1,
  		draggable:true,
  		fade: true,
  		swipe: true,
  		touchMove: true
  	});
    // After slide change
    $('section#hp-banner .carousel').on('afterChange', function(event, slick, currentSlide, nextSlide){
      $('section#hp-banner .carousel').slick('slickPlay');
      $('section#hp-banner .carousel_load-bar_meter').stop(true, true).animate({
          width: "100%",
        },
        homepageCarouselDisplayLength,
        function(){
          $('section#hp-banner .carousel_load-bar_meter').css('width','0px');
        }
      );
    });

  }

	initializeFilters();

	if ($('#features-section h2 a').length) {
		initializeLearnMoreLinks();
	}

	if (getUrlParameter('preview-content') != null) {
		console.log('Preview content mode on. Content hidden from the rest of the world will be shown.');
			$('.preview-content').removeClass('preview-content');
	}

	if (window.document.getElementsByClassName(pageNavId) !== null){
		initializePageNav();
		addEvent(window, "scroll", refreshPageNav);
	}
  /* Select banners that should have jump links. */
  if($jumpNavBanners.length){
		initializeJumpNav();
		addEvent(window, "scroll", refreshJumpNav);
	}

	/* Handle persistent CTA display on initial scroll */
	if ($('#persistent-ctas').length){
		addEvent(window, "scroll", showPersistentCTAs);
	}

}); // end onload


$(window).load(function() {

	/* Handle article navigation resizing or scroll */
	if ($articleNav.length){

		resizeSectionNav();
		addEvent(window, "resize", resizeSectionNav);

		//positionSectionNav();
		//addEvent(window, "resize", positionSectionNav);
		//addEvent(window, "scroll", positionSectionNav);
	}

	// Scroll locally to anchors. Links with "instructions" and "donwload" classes are not being used as scrollable anchors.
	$("a[href^=#]").not('.instructions, .download').click(function(e) {
		var dest = $(this).attr('href');
		if(dest != "#"){
			e.preventDefault();
			var offsetHeight = -2 /*section border height*/ + /*getElementResponsiveHeight('global-header') +*/ getElementHeight('page-nav') + getElementHeight('jump-nav');

			/*
			 * If the page-nav isn't fixed when the anchor is clicked, double the offset.
			 * This accounts for the lost height caused when the page-nav is taken out of the normal page flow.
			 */
			$('html,body').animate({ scrollTop: $(dest).offset().top - offsetHeight }, 1000);
			$(dest).focus();
		}
	});


	(function positionHash(){
		if(window.location.hash !== ''){
			var selectorId = window.location.hash.slice(1);
			if(document.getElementById(selectorId)){
				console.log('URL hash detected: ' + selectorId + '. Matching element found.');
				scrollPosition = $('#'+selectorId).offset().top - getElementResponsiveHeight('global-header') - getElementResponsiveHeight('page-nav') - getElementResponsiveHeight('jump-nav');
				$("html,body").animate({ scrollTop: scrollPosition }, "fast");
			//	alert($('#'+selectorId).offset().top - getElementResponsiveHeight('global-header') - getElementResponsiveHeight('page-nav'));
			}
		}
	}());


	/* Download page - Hide Show all platforms link of product does not detect OS */

	if(window.location.pathname.indexOf('/nosql-databases/downloads') > -1){
		$('.product[data-os-detection="false"] .version').each(function( index ) {
			$(this).find('.show-all-platforms').remove();
		});
	}

	/* Marketo Download Form Modal - close it on esc keypress */
	$(document).keyup(function(e) {
		// escape key maps to keycode `27`
		if (e.keyCode == 27) {
			// Hide form and shadowbox
			if ($('#shadowbox').length && $('#shadowbox').is(':visible')){
				$('#shadowbox').fadeOut();
			}
    	}
  	});

});



/*=======================================
 *=========================================
 * LEARN AND SUPPORT
 */

/*=======================================
 * Guides and References page-specific jump links
 */

function initializeDocListJumpNav(){

	/* Get all sections that should have jump links. */
	var $jumpLinkSections = $('section.documents');

	if($jumpLinkSections.length){
		/* Loop through sections. */
		$jumpLinkSections.each(function(){
			var $jumpNav = $(this).find('ul.anchors');
			var $jumpHeaders = $(this).find('h3');

			$jumpHeaders.each(function(){
				var $header = $(this).find('a');
				var headerText = $header.text();
				var headerId = headerText.toLowerCase().replace(/ /g,'-').replace(/['/"!.,?&#@^()]/g,'');
				$header.attr('id', headerId + '-anchor');

				/* Append links to jump nav	*/
				$jumpNav.append('<li><a id="'+headerId+'-link" href="#'+headerId+'-anchor" class="anchor">'+headerText+'</a></li>');
			});

		});
	}
}

$(function(){


	//setCookie('TESTCOOKIE', 'asdf');

	/*=======================================
	 * Ingested article tabbed content
	 */

	/* Add and remove classes for visual formatting. */

	$('pre code').removeClass('pre codeblock').parent().addClass('pre codeblock');
	$('.stripe-display pre:not([class*="language-"])').addClass('language-pre');
	$('.stripe-display pre:not([class*="language-"]) code').addClass('language-pre');

	/* Add classes for visual formatting. */
	var codeLanguage = getCookie('codeLanguage');
	setLanguage(codeLanguage);

	/* Guides and References page-specific jump links */
	initializeDocListJumpNav();

});

/*
 * ======================================= Show/hide tabs function.
 */
function setLanguage(codeLanguage) {
	var lang, cook;
	if (codeLanguage !== '') {

		/* Set language cookie. */
		setCookie('codeLanguage', codeLanguage);

		/* Tab display */
		$('.stripe-active.' + codeLanguage).addClass('selected');
		$('.stripe-active:not(.' + codeLanguage + ')').removeClass('selected');

		/* Content display */
		$('.stripe-display.' + codeLanguage).show();
		$('.stripe-display:not(.' + codeLanguage + ')').hide();

	} else {

		/**
		 * @ This will set cookie as default
		 */
		lang = $('.tab-bar a:first-child').eq(0).text();
		cook = lang.toLowerCase().replace(/[^a-z0-9-\s]/gi, '');
		setCookie('codeLanguage', cook);
		tabDisplay(cook);
	}
	/**
	 * @ Takes param of String which is added as the target element's classname.
	 */
	function tabDisplay(codeLanguage) {
		/* Tab display */
		if($('.stripe-active').length) {
			$('.stripe-active.' + codeLanguage).addClass('selected');
			$('.stripe-active:not(.' + codeLanguage + ')').removeClass('selected');

			/* Content display */
			$('.stripe-display.' + codeLanguage).show();
			$('.stripe-display:not(.' + codeLanguage + ')').hide();
		}
	}
}




if (document.location.hostname.indexOf('couchbase') > -1) {
	/*------------------------------------------------
	 * Flashtalking Couchbase oneTag.
	 * One Tag Conditional Container: Couchbase (6792) | Couchbase oneTag (5045)
	------------------------------------------------
	var ft_onetag_5045 = {
		ft_vars:{
			"ftXRef":"",
			"ftXValue":"",
			"ftXType":"",
			"ftXName":"",
			"ftXNumItems":"",
			"ftXCurrency":"",
			"U1":"",
			"U2":"",
			"U3":"",
			"U4":"",
			"U5":"",
			"U6":"",
			"U7":"",
			"U8":"",
			"U9":"",
			"U10":"",
			"U11":"",
			"U12":"",
			"U13":"",
			"U14":"",
			"U15":"",
			"U16":"",
			"U17":"",
			"U18":"",
			"U19":"",
			"U20":""
			},
		ot_dom:document.location.protocol+'//web.archive.org/web/20170901230818/https://servedby.flashtalking.com',
		ot_path:'/container/6792;44410;5045;iframe/?',
		ot_href:'ft_referrer='+escape(document.location.href),
		ot_rand:Math.random()*1000000,
		ot_ref:document.referrer,
		ot_init:function(){
			var o=this,qs='',count=0,ns='';
			for(var key in o.ft_vars){
				qs+=(o.ft_vars[key]==''?'':key+'='+o.ft_vars[key]+'&');
			}
			count=o.ot_path.length+qs.length+o.ot_href+escape(o.ot_ref).length;
			ns=o.ot_ns(count-2000);
			document.write('<iframe style="position:absolute; visibility:hidden; width:1px; height:1px;" src="'+o.ot_dom+o.ot_path+qs+o.ot_href+'&ns='+ns+'&cb='+o.ot_rand+'"></iframe>');
		},
		ot_ns:function(diff){
			if(diff>0){
				var o=this,qo={},
					sp=/(?:^|&)([^&=]*)=?([^&]*)/g,
					fp=/^(http[s]?):\/\/?([^:\/\s]+)\/([\w\.]+[^#?\s]+)(.*)?/.exec(o.ot_ref),
					ro={h:fp[2],p:fp[3],qs:fp[4].replace(sp,function(p1,p2,p3){if(p2)qo[p2]=[p3]})};
				return escape(ro.h+ro.p.substring(0,10)+(qo.q?'?q='+unescape(qo.q):'?p='+unescape(qo.p)));
			}else{
				var o=this;
				return escape(unescape(o.ot_ref));
			}
		}
	}
	ft_onetag_5045.ot_init();
	*/
}


var textProp = document.documentElement.textContent !== undefined ? 'textContent' : 'innerText';

function getText( elem ) {
	return elem[ textProp ];
}

// When document is ready
$(function() {

	var cardsetSelector = '.cardset.'+ 'apps';
	var noResultsSelector = cardsetSelector + ' .no-filtered-results';

	// filter functions
	var filterFns = {
		// show as user enters value into field
		autocomplete: function() {
			var name = $(this).data('sort-value-2');
			var query = $('input[data-filter="autocomplete"]').val();
			var regexString = query;
			var regexp = RegExp(regexString, "i" );
			return name.match( regexp );
		}
	};

	// init Isotope
	$miniappIso = $(cardsetSelector + ' ul.cards').isotope({
		// options
		itemSelector: '.card',
		layoutMode: 'fitRows', /* masonry, fitRows */
		getSortData: {
			defaultSort1: '[data-sort-value-1]', // value of attribute
			defaultSort2: '[data-sort-value-2]', // value of attribute
			heading: function( itemElem ) { // function
				var heading = $( itemElem ).find('h3').text();
				return parseFloat( heading.replace( /[\(\)]/g, '') );
				}
		},
		sortBy : ['defaultSort1','defaultSort2'],
		sortAscending: false,
		filter: function() {
			var isMatched = true;
			var $this = $(this);

			for ( var prop in filters ) {
				var filter = filters[ prop ];
				// use function if it matches
				filter = filterFns[ filter ] || filter;
				// test each filter
				if ( filter ) {
					isMatched = isMatched && $(this).is( filter );
				}
				// break if not matched
				if ( !isMatched ) {
					break;
				}
			}
			return isMatched;
		}
	});


	// store filter for each group
	var filters = {};

	$(cardsetSelector + ' .filter-button-group').on( 'click keyup', '.btn', function() {
		var $this = $(this);
		// get group key
		var $buttonGroup = $this.parents('.button-group');
		var filterGroup = $buttonGroup.attr('data-filter-group');
		// set filter for group
		filters[ filterGroup ] = $this.attr('data-filter');
		// arrange, and use filter fn
		$miniappIso.isotope('arrange');
		// highlight button
		$(this).addClass('selected').siblings().removeClass('selected');

		/* display message box if no filtered items */
		if ( !$miniappIso.data('isotope').filteredItems.length ) {
			$(noResultsSelector).show();
		}
		else{
			$(noResultsSelector).hide();
		}
	});

	// layout Isotope after each image loads
	$miniappIso.imagesLoaded().progress( function() {
		$miniappIso.isotope('layout');
	});

	/* Tagging markup for GTM */
	$('.hero a').addClass('gtm-hero-a');
	$('.hp-tpl #customers a').addClass('gtm-hp-customers-a');

	/*DropDown with version list for Mobile and Server in Documentation Page*/
	$("#versionsDropDown").on("change", function(e) {
		window.location.href = $(this).val();
	});

	/*DropDown with programming languages in SDK page*/
	$("#languageDropDown").on("change", function(e) {
		var selectedOption = $(this).find("option:selected");
		if(!selectedOption.hasClass("notLanguageLink"))
		{
			setCookie('langCookie', selectedOption.text());
		}
		window.location.href = $(this).val();
	});

});

// Add wrapper to Marketo popup for improved vertical alignment
$('#download_form_container').closest('#shadowbox').addClass('download');
$('#shadowbox.download').wrap('<div class="shadowbox-download-wrapper"></div>');


/* COLLAPSIBLE MENU =================================================== */

$(function(){

  var headingClass = 'static';
  var linkClass = 'link';

  /* Assign classes to list items with children. Create links to expand/collapse. */
  $('.article-tpl .toc ul.collapsed li').parents('li').addClass('hasChild').prepend('<a href="#" class="icon"> </a>');

  /* Assign classes to links that are headings, not links (href="#") */
  $('.article-tpl .toc ul.collapsed a[href="#"]:not(.icon)').addClass(headingClass);

  /* Assign classes to links (href="#") */
  $('.article-tpl .toc ul.collapsed a[href!="#"]:not(.icon)').addClass(linkClass);

  /* Reveal article navigation to selected link */
  $('aside.left-rail a.selected').parents('li').addClass('open parent-of-selected');

  /* Hide content levels that were assigned a close class. */
  $('.article-tpl .toc ul.collapsed li.hasChild:not(.open, .parent-of-selected) > ul').hide().siblings('.icon').addClass('close');

  /* Show or hide children on icon click. */
  $('.article-tpl .toc ul.collapsed').on('click', 'a.icon', function( e ) {
    e.preventDefault();

    $(this).toggleClass('close').siblings('ul').slideToggle();
  });

  /* Change icon hover state when hovering over a heading. */
  $('.article-tpl .toc ul.collapsed a.static').hover(
    function() {
      $(this).prev('.icon').toggleClass('on');
    },
    function() {
      $(this).prev('.icon').toggleClass('on');
    }
  );

  /* Show or hide children on icon click. */
  $('.article-tpl .toc ul.collapsed').on('click', 'a.static', function( e ) {
    e.preventDefault();

    if($(this).attr("href") == "#"){
      //$(this).prev('.icon').click();
      $(this).prev('.icon').toggleClass('close').siblings('ul').slideToggle();
    }
  });

  $('aside.left-rail .toc').show();
});


/* HIPPO CHANNEL MANAGER =================================================== */
//
// If component properties change through the Channel Manager editor,
// call onload functions.
//

var hippoCmsFlag = false;
var localEnvironmentFlag = false;
var hippoCmsResourcePrefix = '';

(function detectHippoCMS(){
	// Top level window
	if(window.top == window.self) {
	  //console.log('Top level.');
	}
	// Not top level. An iframe, popup or something
	else {
		//console.log('Not top level.');

		if(window.parent.document.getElementById('Hippo.ChannelManager.TemplateComposer.Instance')){
		  //console.log('Channel manager detected.');

		  hippoCmsFlag = true;

		}
	}
}());

(function detectLocalEnvironment(){
	if(document.domain.indexOf('localhost') > -1) {
	  localEnvironmentFlag = true;
	}
}());

function hippoCmsChangeImagePaths(prefix){
	if(prefix !== ''){
		console.log('Changing CMS image path references...[hippoCmsChangeImagePaths]');

		// Add cms path to images referencing CMS images
	  	$('img[src^="/binaries/content/gallery"]').each(function () {
		  var curSrc = $(this).attr('src');

		  $(this).attr('src',prefix + curSrc);
		});
	}
}

/* " // Coda 2 sucks at color-coding properly after a regex.  Adding the " fixes the problem. */

/* AGENDA PAGE INFO TOGGLE =================================================== */
//
// Clicking 'session' name expands to show more information
//
var agendaToggle = function() {
    $('.agenda__entry').click(function(e){
        e.preventDefault();
        $(this).toggleClass('bold');
        $(this).next('div.agenda__addl-info').toggle();
    });
};
agendaToggle();

var $globalCurrentDay = '';
var agendaIdUpdate = function() {
    
    $('.agenda__tabs__unique, .agenda__table .columns').each(function(){
        var str = $(this).attr('id');
        if(str !== undefined) {
            str = str.replace(/\s+/g, "_");
            $(this).attr('id',str);
        }
    });

    $('.agenda__tabs__unique').click(function(){
        // Reset
        $('.session-group').css('display','none');
        $('.agenda__graphs').addClass('hide').removeClass('show');
        $('.agenda__filter').css('display','block');
        $('.agenda__table').removeClass('default');
        $('.agenda__tabs li').removeClass('active');
        
        // Switch to detail list
        $('#overview-list').css('display','none');
        $('#document-list').css('display','block');

        
        // Set
        $(this).parent('li').addClass('active');
        var tabId = $(this).attr('id');
        var subTabIdArray = tabId.split('tab_');
        var idSubString = subTabIdArray[1];
        console.log('idSubString from tab: ' + idSubString);
        // Find the .columns id that contains the tab idSubString and display
		$globalCurrentDay = idSubString;
        $('.columns').each(function(){
            var columnsId;
            if($(this).attr('id') !== undefined) {
        		columnsId = $(this).attr('id');

        	}
            else {
				columnsId = "";
            }
            if(columnsId.indexOf(idSubString) !== -1) {
                $(this).parent('.session-group').css('display','block');

                // Hide the filters/tracks if necessary
                if($(this).parent('.session-group').hasClass('hide-filters')){
                    $('.agenda__filter').css('display','none');
                }

            } 
        });
    });
    $('#tab_overview').click(function(){
        $('.agenda__filter').css('display','none');
        $('.agenda__table').addClass('default');
        $('.session-group').css('display','block');
        $('.agenda__graphs').addClass('show').removeClass('hide');
        $('.agenda__tabs li').removeClass('active');
        $(this).parent('li').addClass('active');
        
        // Switch to overview list
        $('#overview-list').css('display','block');
        $('#document-list').css('display','none');
		console.log('$globalCurrentDay OVER = ' + $globalCurrentDay);


    });
};
agendaIdUpdate();

$('.navi-icon').click( function() {
    if ($(this).hasClass('open')) {
        // if icon clicked has open, remove 'open' effectively closing modal
        $(this).removeClass('open');    
        $('.agenda__filter__box').css('display','none');
    }
    else {
        // then add open class to navi-icon;
        $(this).addClass('open');
        $('.agenda__filter__box').css('display','block');
    }
});

var filterTracks = function() {
    // Apply selected filter
    $('input[name=rdo-filter]:radio').click(function() {
        //console.log('filter clicked; ' + $(this).attr('id'));
        var radioId = $(this).attr('id');
        var trackValArray = radioId.split('rdo-');
        trackVal = trackValArray[1];
        //console.log('trackVal = ' + trackVal);
        
        if (trackVal === 'none') {
            $('.row').css('display','table-row');
            $('.agenda__table').removeClass('apply-filter');
			console.log("1");
		}
        else {
            var trackClassToShow = '.track-' + trackVal;
            $('.row').css('display','none');
            $(trackClassToShow).css('display','table-row');
            $('.agenda__table').addClass('apply-filter');
			//console.log("2");
			//console.log('$globalCurrentDay = ' + $globalCurrentDay);
			//console.log(".cont_" + $globalCurrentDay + " " + trackClassToShow);
			console.log($("#cont_" + $globalCurrentDay + " " + trackClassToShow).length.toString());
			if  ($("#cont_" + $globalCurrentDay + " " + trackClassToShow).length == 0) {
				//console.log("IF #no-session-" + $globalCurrentDay + " " + trackClassToShow);
				console.log("if no sessions");
				console.log('#no-session-' + $globalCurrentDay);

				//$('#overview-list #no-session-' + $globalCurrentDay).remove();
				$('#no-session-' + $globalCurrentDay).css('display','block');

			}
			else {
				console.log("else if sessions");
				console.log('#no-session-' + $globalCurrentDay);
				//console.log("ELSE #no-session-" + $globalCurrentDay + " " + trackClassToShow);

				$('#no-session-' + $globalCurrentDay).css('display','none');

			}



        } 
        $('.agenda__filter label').removeClass('rdo-selected');
        $(this).next('label').addClass('rdo-selected');






    });
    // Clear filters
    $('.agenda__tabs > li > a').click(function() {
        $('#rdo-none').click();
        //$('.row').css('display','table-row'); 
    });
    
};
filterTracks();

if(hippoCmsFlag){
	hippoCmsResourcePrefix = '/site/_cmsinternal';
}
else if(localEnvironmentFlag){
	hippoCmsResourcePrefix = '/site';
}

$(function(){
	hippoCmsChangeImagePaths(hippoCmsResourcePrefix);
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFZhcmlhYmxlXG4vKipcbiAqIEBmaWxlIG1haW4uanNcbiAqXG4gKiBJbml0aWFsaXplciBmb3IgYHJlcXVpcmUtanNgIGFuZCBjb25zZXF1ZW50bHkgdGhlIG1vZHVsZXIgcGFydHMgb2YgdGhlXG4gKiBKYXZhc2NyaXB0IG9uIHRoZSBzaXRlLlxuICpcbiAqL1xuXG4gdmFyIFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaGlzIGZ1bmN0aW9uIGlzIGFub255bW91cywgaXMgZXhlY3V0ZWQgaW1tZWRpYXRlbHkgYW5kXG4gIC8vIHRoZSByZXR1cm4gdmFsdWUgaXMgYXNzaWduZWQgdG8gUXVlcnlTdHJpbmchXG4gIHZhciBxdWVyeV9zdHJpbmcgPSB7fTtcbiAgdmFyIHF1ZXJ5ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7XG4gIHZhciB2YXJzID0gcXVlcnkuc3BsaXQoXCImXCIpO1xuICBmb3IgKHZhciBpPTA7aTx2YXJzLmxlbmd0aDtpKyspIHtcbiAgICB2YXIgcGFpciA9IHZhcnNbaV0uc3BsaXQoXCI9XCIpO1xuICAgIFx0Ly8gSWYgZmlyc3QgZW50cnkgd2l0aCB0aGlzIG5hbWVcbiAgICBpZiAodHlwZW9mIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcXVlcnlfc3RyaW5nW3BhaXJbMF1dID0gcGFpclsxXTtcbiAgICBcdC8vIElmIHNlY29uZCBlbnRyeSB3aXRoIHRoaXMgbmFtZVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdmFyIGFyciA9IFsgcXVlcnlfc3RyaW5nW3BhaXJbMF1dLCBwYWlyWzFdIF07XG4gICAgICBxdWVyeV9zdHJpbmdbcGFpclswXV0gPSBhcnI7XG4gICAgXHQvLyBJZiB0aGlyZCBvciBsYXRlciBlbnRyeSB3aXRoIHRoaXMgbmFtZVxuICAgIH0gZWxzZSB7XG4gICAgICBxdWVyeV9zdHJpbmdbcGFpclswXV0ucHVzaChwYWlyWzFdKTtcbiAgICB9XG4gIH1cbiAgICByZXR1cm4gcXVlcnlfc3RyaW5nO1xufSAoKTtcblxuZnVuY3Rpb24gZ2V0VXJsUGFyYW1ldGVyKHNQYXJhbSkge1xuICAgIHZhciBzUGFnZVVSTCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpO1xuICAgIHZhciBzVVJMVmFyaWFibGVzID0gc1BhZ2VVUkwuc3BsaXQoJyYnKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNVUkxWYXJpYWJsZXMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICB2YXIgc1BhcmFtZXRlck5hbWUgPSBzVVJMVmFyaWFibGVzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgIGlmIChzUGFyYW1ldGVyTmFtZVswXSA9PSBzUGFyYW0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBzUGFyYW1ldGVyTmFtZVsxXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVF1ZXJ5U3RyaW5nTWVzc2FnZXMoKXtcblxuICBtc2dJZCA9IGdldFVybFBhcmFtZXRlcignbXNnJyk7XG5cbiAgaWYoIG1zZ0lkICE9PSAnJyAmJiBtc2dJZCAhPSBudWxsKXtcbiAgICB2YXIgbXNnID0gJyc7XG4gICAgc3dpdGNoKG1zZ0lkKSB7XG4gICAgICAgIGNhc2UgJzEnOlxuICAgICAgICBcdCAgbXNnID0gXCJTdWNjZXNzZnVsbHkgc2lnbmVkIGluXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcyJzpcbiAgICAgICAgICAgIG1zZyA9IFwiUmVnaXN0cmF0aW9uIHdhcyBzdWNjZXNzZnVsLlwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJzMnOlxuICAgICAgICAgICAgbXNnID0gXCJZb3VyIHByb2ZpbGUgd2FzIHVwZGF0ZWQuXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnNCc6XG4gICAgICAgICAgICBtc2cgPSBcIllvdXIgcGFzc3dvcmQgd2FzIGNoYW5nZWQuXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnNSc6XG4gICAgICAgICAgICBtc2cgPSBcIkFjY291bnQgYWRkZWQgdG8geW91ciBwcm9maWxlLlwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJzYnOlxuICAgICAgICAgICAgbXNnID0gXCJZb3VyIHBhc3N3b3JkIHdhcyByZXNldC5cIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICc3JzpcbiAgICAgICAgICAgIG1zZyA9IFwiUGFzc3dvcmQgc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQuXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnOCc6XG4gICAgICAgICAgICBtc2cgPSBcIlJlZ2lzdGVyIG9yIHNpZ24gaW4gZm9yIGVudGVycHJpc2UgZG93bmxvYWRzXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnOSc6XG4gICAgICAgICAgICBtc2cgPSBcIkNvbXBsZXRlIHlvdXIgcHJvZmlsZSBmb3IgZW50ZXJwcmlzZSBkb3dubG9hZHNcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICc5OSc6XG4gICAgICAgICAgICBtc2cgPSBcIkFuIGVycm9yIG9jY3VyZWQuXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIG1zZyA9IFwiXCI7XG4gICAgfVxuICAgIGlmKGhpc3RvcnkgJiYgaGlzdG9yeSE9PVwidW5kZWZpbmVkXCIpe1xuICAgIFx0aGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sIFwidGl0bGVcIiwgdG9wLmxvY2F0aW9uLmhyZWYuc3Vic3RyaW5nKDAsIHRvcC5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJz8nKSkpO1xuICAgIH1cbiAgICB2YXIgZGl2ID0gJCgnPGRpdiBjbGFzcz1cInBhZ2UtbWVzc2FnZVwiPicgKyBtc2cgKyAnPC9kaXY+JykuaGlkZSgpO1xuICAgICQoJ21haW4nKS5jaGlsZHJlbignZGl2OmZpcnN0JykucHJlcGVuZChkaXYuZmFkZUluKDMwMCkuZGVsYXkoMTUwMCkuZmFkZU91dCg3MDApKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRDb29raWUoY25hbWUsIGN2YWx1ZSwgZXhkYXlzKSB7XG5cdGlmKCBleGRheXMgPT09ICcnIHx8IG1zZ0lkID09PSBudWxsKXtcblx0XHRleGRheXMgPSAzNjU7XG5cdH1cbiAgICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyoyNCo2MCo2MCoxMDAwKSk7XG4gICAgdmFyIGV4cGlyZXMgPSBcImV4cGlyZXM9XCIrZC50b1VUQ1N0cmluZygpO1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoY3ZhbHVlKSArIFwiOyBcIiArIGV4cGlyZXMgKyBcIjsgcGF0aD0vXCI7XG59XG5cbmZ1bmN0aW9uIGdldENvb2tpZShjbmFtZSkge1xuICAgIHZhciBuYW1lID0gY25hbWUgKyBcIj1cIjtcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICBmb3IodmFyIGk9MDsgaTxjYS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IGNhW2ldO1xuICAgICAgICB3aGlsZSAoYy5jaGFyQXQoMCk9PScgJykgYyA9IGMuc3Vic3RyaW5nKDEpO1xuICAgICAgICBpZiAoYy5pbmRleE9mKG5hbWUpID09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lLmxlbmd0aCxjLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBcIlwiO1xufVxuXG4vLyBDcmVhdGUgc2VsZWN0b3IgZm9yIGphdmFzY3JpcHQgZGV0ZWN0aW9uXG4kKCdib2R5JykuYWRkQ2xhc3MoJ2pzLW9uJyk7XG5cbi8vIENyZWF0ZSBzZWxlY3RvciBmb3IgcmVkZXNpZ24gZGV0ZWN0aW9uXG5pZigkKCcuc2VjdGlvbicpLmxlbmd0aCl7XG4gICQoJ2JvZHknKS5hZGRDbGFzcygndjInKTtcbn1cblxuLy8gQ3JlYXRlIHNlbGVjdG9yIGZvciBkZXYgcG9ydGFsIGRldGVjdGlvblxuaWYoJCgnI2dsb2JhbC1oZWFkZXInKS5oYXNDbGFzcygnZGV2LXBvcnRhbCcpKXtcbiAgJCgnYm9keScpLmFkZENsYXNzKCdkZXYtcG9ydGFsJyk7XG59XG5cbi8vIENyZWF0ZSBzZWxlY3RvciBmb3Igc3NvIGRldGVjdGlvblxuaWYoJCgnLnNzby10cGwnKS5sZW5ndGgpe1xuICAkKCdib2R5JykuYWRkQ2xhc3MoJ3NzbycpO1xufVxuXG4gLy8gRnVuY3Rpb24gZm9yIGFkZGluZyBldmVudHMgdG9cbiB2YXIgYWRkRXZlbnQgPSBmdW5jdGlvbihlbGVtLCB0eXBlLCBldmVudEhhbmRsZSkge1xuICAgIGlmIChlbGVtID09IG51bGwgfHwgdHlwZW9mKGVsZW0pID09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gICAgaWYgKCBlbGVtLmFkZEV2ZW50TGlzdGVuZXIgKSB7XG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgZXZlbnRIYW5kbGUsIGZhbHNlICk7XG4gICAgfSBlbHNlIGlmICggZWxlbS5hdHRhY2hFdmVudCApIHtcbiAgICAgICAgZWxlbS5hdHRhY2hFdmVudCggXCJvblwiICsgdHlwZSwgZXZlbnRIYW5kbGUgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtW1wib25cIit0eXBlXT1ldmVudEhhbmRsZTtcbiAgICB9XG59O1xuXG4gLy8gRnVuY3Rpb24gZm9yIHJlbW92aW5nIGV2ZW50cyBmcm9tXG4gdmFyIHJlbW92ZUV2ZW50ID0gZnVuY3Rpb24oZWxlbSwgdHlwZSwgZXZlbnRIYW5kbGUpIHtcbiAgICBpZiAoZWxlbSA9PSBudWxsIHx8IHR5cGVvZihlbGVtKSA9PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuICAgIGlmICggZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyICkge1xuICAgICAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUsIGV2ZW50SGFuZGxlLCBmYWxzZSApO1xuICAgIH0gZWxzZSBpZiAoIGVsZW0uZGV0YXRjaEV2ZW50ICkge1xuICAgICAgICBlbGVtLmRldGF0Y2hFdmVudCggXCJvblwiICsgdHlwZSwgZXZlbnRIYW5kbGUgKTtcbiAgICB9XG59O1xuXG4gdmFyIHN0YXRpY0hlYWRlckJyb3dzZXJXaWR0aCA9IDEwODc7XG4gdmFyIHN0YXRpY0hlYWRlckhlaWdodCA9IDA7XG5cbi8qIFJldHVybnMgaGVpZ2h0IG9mIGVsZW1lbnRzICovXG5mdW5jdGlvbiBnZXRFbGVtZW50SGVpZ2h0KHNlbGVjdG9ySWQpe1xuXHRpZiAod2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGVjdG9ySWQpICE9PSBudWxsKXtcblx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZWN0b3JJZCkub2Zmc2V0SGVpZ2h0O1xuXHR9XG5cdHJldHVybiAwO1xufVxuXG4vKiBSZXR1cm5zIGhlaWdodCBvZiBmaXhlZC1wb3NpdGlvbiBlbGVtZW50cyAqL1xuZnVuY3Rpb24gZ2V0RWxlbWVudEZpeGVkSGVpZ2h0KHNlbGVjdG9ySWQpe1xuXHRpZiAod2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGVjdG9ySWQpICE9PSBudWxsKXtcblx0XHRpZiAoJCgnIycrc2VsZWN0b3JJZCkuaGFzQ2xhc3MoJ2ZpeGVkJykpe1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGVjdG9ySWQpLm9mZnNldEhlaWdodDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRSZXNwb25zaXZlSGVpZ2h0KHNlbGVjdG9ySWQpe1xuXHRpZih3aW5kb3cuaW5uZXJXaWR0aCA+IHN0YXRpY0hlYWRlckJyb3dzZXJXaWR0aCl7XG5cdFx0cmV0dXJuIGdldEVsZW1lbnRIZWlnaHQoc2VsZWN0b3JJZCk7XG5cdH1cblx0cmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRPZmZzZXRUb3Aoc2VsZWN0b3JJZCl7XG5cdGlmICh3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZWN0b3JJZCkgIT09IG51bGwpe1xuXHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxlY3RvcklkKS5vZmZzZXRUb3A7XG5cdH1cblx0cmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIG9mZnNldENvbnRlbnQoKXtcblx0dmFyIG5ld0hlaWdodCA9IGdldEVsZW1lbnRSZXNwb25zaXZlSGVpZ2h0KCdnbG9iYWwtaGVhZGVyJyk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnbG9iYWwtY29udGVudCcpLnN0eWxlLm1hcmdpblRvcCA9IG5ld0hlaWdodCArICdweCc7XG59XG5cbi8vb2Zmc2V0Q29udGVudCgpO1xuLy9hZGRFdmVudCh3aW5kb3csIFwicmVzaXplXCIsIG9mZnNldENvbnRlbnQpO1xuXG5cbmZ1bmN0aW9uIHJlc2l6ZUltYWdlcygpe1xuXHR2YXIgbmV3SGVpZ2h0ID0gZ2V0RWxlbWVudEhlaWdodCgnZ2xvYmFsLWhlYWRlcicpICsgZ2V0RWxlbWVudEhlaWdodCgnbWFpbi1wcm9tbycpO1xuXHRpZiAod2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLXByb21vJykgIT09IG51bGwpe1xuXHRcdGlmKHdpbmRvdy5pbm5lcldpZHRoID4gODAwKXtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLXByb21vJykuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnMTAwJSAnICsgbmV3SGVpZ2h0ICsgJ3B4Jztcblx0XHR9XG5cdH1cblx0LyogZGVidWcgKi8gLy9jb25zb2xlLmxvZyhuZXdIZWlnaHQpO1xufVxuXG5yZXNpemVJbWFnZXMoKTtcbmFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgcmVzaXplSW1hZ2VzKTtcblxuZnVuY3Rpb24gcmVzaXplSWZyYW1lKGlmcmFtZSl7XG5cdC8vY29uc29sZS5sb2coJChpZnJhbWUpLnBhcmVudCgpLmNzcygnaGVpZ2h0JykpO1xuXHQkKGlmcmFtZSkuY3NzKCdoZWlnaHQnLCQoaWZyYW1lKS5wYXJlbnQoKS5jc3MoJ2hlaWdodCcpKS5hZGRDbGFzcygnYm9yZGVyJyk7XG5cdGFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgZnVuY3Rpb24oKXskKGlmcmFtZSkuY3NzKCdoZWlnaHQnLCQoaWZyYW1lKS5wYXJlbnQoKS5jc3MoJ2hlaWdodCcpKS5hZGRDbGFzcygnYm9yZGVyJyk7fSk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVQYWdlVGVtcGxhdGUoKXtcblx0dmFyIHBhZ2VUZW1wbGF0ZVNlbGVjdG9yID0gJ3BhZ2UtdGVtcGxhdGUtYXR0cmlidXRlcyc7XG5cdGlmICh3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFnZVRlbXBsYXRlU2VsZWN0b3IpICE9PSBudWxsKXtcblx0XHR2YXIgZWwgPSAkKCc8ZGl2IGlkPVwiJyArICQoJyMnICsgcGFnZVRlbXBsYXRlU2VsZWN0b3IpLmRhdGEoJ3RlbXBsYXRlLWlkJykgKyAnXCIgY2xhc3M9XCInICsgJCgnIycgKyBwYWdlVGVtcGxhdGVTZWxlY3RvcikuZGF0YSgndGVtcGxhdGUtY2xhc3MnKSArICdcIj48L2Rpdj4nKTtcbiAgICBpZigkKCcjJyArIHBhZ2VUZW1wbGF0ZVNlbGVjdG9yKS5kYXRhKCd0ZW1wbGF0ZS1jbGFzcycpLmluZGV4T2YoJ2JvZHktd3JhcHBlcicpID4gLTEpe1xuICAgICAgLy9jb25zb2xlLmxvZygnYm9keScpO1xuICAgICAgJCgnYm9keScpLndyYXBJbm5lcihlbCk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAvL2NvbnNvbGUubG9nKCdtYWluJyk7XG4gICAgICAkKCdtYWluJykud3JhcElubmVyKGVsKTtcbiAgICB9XG4gICAgJCgnbWFpbicpLndyYXBJbm5lcihlbCk7XG5cdFx0JCgnIycgKyBwYWdlVGVtcGxhdGVTZWxlY3RvcikucmVtb3ZlKCk7XG5cdH1cbn1cblxudmFyIGp1bXBOYXZJZCA9ICdqdW1wLW5hdic7XG52YXIganVtcE5hdk1hcmtlcklkID0gJ2p1bXAtbmF2LW1hcmtlcic7XG52YXIgJGp1bXBOYXZzID0gJCgnLmp1bXAtbmF2Jyk7XG52YXIganVtcE5hdiA9IFtdO1xudmFyICRqdW1wTmF2QmFubmVycyA9ICQoJ3NlY3Rpb24uYmFubmVyW2RhdGEtanVtcC1mbGFnPVwidHJ1ZVwiXScpO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplSnVtcE5hdigpe1xuXG5cdC8qIFNlbGVjdCBiYW5uZXJzIHRoYXQgc2hvdWxkIGhhdmUganVtcCBsaW5rcy4gKi9cblx0aWYoJGp1bXBOYXZCYW5uZXJzLmxlbmd0aCl7XG5cblx0XHQvKiBMb29wIHRocm91Z2ggbWF0Y2hpbmcgYmFubmVycy4gKi9cblx0XHQkanVtcE5hdkJhbm5lcnMuZWFjaChmdW5jdGlvbigpe1xuXG5cdFx0XHR2YXIgJGp1bXBOYXYgPSAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5qdW1wLW5hdjpmaXJzdCcpO1xuXG5cdFx0XHQvKiBHZXQgYWxsIHNlY3Rpb25zIHRoYXQgc2hvdWxkIGhhdmUganVtcCBsaW5rcyAoU2VjdGlvbnMgd2l0aCBIMnMgdGhhdCBhcmVuJ3QgZm9vdGVyIHRlbXBsYXRlcykuICovXG5cdFx0XHR2YXIgJGp1bXBOYXZTZWN0aW9ucyA9ICQodGhpcykucGFyZW50cygpLmVxKDEpLmZpbmQoJ3NlY3Rpb246bm90KFwiLmJhbm5lciwgLnRwbC1mb290ZXJcIikgaDInKS5jbG9zZXN0KCdzZWN0aW9uJyk7XG5cdFx0XHRpZigkanVtcE5hdlNlY3Rpb25zLmxlbmd0aCl7XG5cblx0XHRcdFx0LyogTG9vcCB0aHJvdWdoIHNlY3Rpb25zICovXG5cdFx0XHRcdCRqdW1wTmF2U2VjdGlvbnMuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciAkaGVhZGVyID0gJCh0aGlzKS5maW5kKCdoMjpmaXJzdCcpO1xuXHRcdFx0XHRcdHZhciBoZWFkZXJUZXh0ID0gJGhlYWRlci50ZXh0KCk7XG5cdFx0XHRcdFx0dmFyIGhlYWRlcklkID0gaGVhZGVyVGV4dC50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywnLScpLnJlcGxhY2UoL1snL1wiIS4sPyYjQF4oKV0vZywnJyk7XG5cdFx0XHRcdFx0aGVhZGVySWQgPSBoZWFkZXJJZC5yZXBsYWNlKC9cXHUwMGEwL2csICctJyk7Ly9Gb3IgcmVwbGFjaW5nICZuYnNwOyBiZWZvcmUgdGhlIHZlcnNpb24gbnVtYmVyXG5cdFx0XHRcdFx0JGhlYWRlci5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnLGhlYWRlcklkKTtcblxuXHRcdFx0XHRcdC8qIEFwcGVuZCBsaW5rcyB0byBqdW1wIG5hdlx0Ki9cblx0XHRcdFx0XHQkanVtcE5hdi5maW5kKCd1bCcpLmFwcGVuZCgnPGxpIGNsYXNzPVwiY29sXCI+PGEgaWQ9XCInK2hlYWRlcklkKyctbGlua1wiIGhyZWY9XCIjJytoZWFkZXJJZCsnXCIgY2xhc3M9XCJhbmNob3JcIj48c3Bhbj4nK2hlYWRlclRleHQrJzwvc3Bhbj48L2E+PC9saT4nKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHR2YXIganVtcE5hdlNlbGVjdG9yID0gJ25hdi4nICsganVtcE5hdklkO1xuXHR2YXIgJGp1bXBOYXZzVG9Nb3ZlID0gJGp1bXBOYXZzLmZpbHRlcignLm1vdmUtaW50by1iYW5uZXInKTtcblxuXHR2YXIgYmFubmVyU2VsZWN0b3IgPSAnLmJhbm5lcic7XG5cdHZhciBqdW1wTmF2TGlua1NlbGVjdG9yID0gJy4nICsganVtcE5hdklkICsgJyBsaSBhJztcblx0dmFyIGp1bXBOYXZIZWlnaHQgPSBnZXRFbGVtZW50SGVpZ2h0KGp1bXBOYXZJZCk7XG5cblx0Ly8gSWYgdGhlIGp1bXAgbmF2IGlzIHN1cHBvc2VkIHRvIGJlIGVtYmVkZGVkIGludG8gdGhlIGJhbm5lciwgdGhlIGp1bXAgbmF2IHdpbGwgaGF2ZSBhIHNwZWNpZmllZCBjbGFzcy5cblx0aWYgKCRqdW1wTmF2c1RvTW92ZS5sZW5ndGgpIHtcblx0XHRpbmRleCA9IDA7XG5cdFx0JGp1bXBOYXZzVG9Nb3ZlLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciB0aGlzTmF2U2VsZWN0b3IgPSAnbW92ZWQtbmF2LScgKyBpbmRleDtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3ModGhpc05hdlNlbGVjdG9yKTtcblxuXHRcdFx0JGJhbm5lciA9ICQodGhpcykuc2libGluZ3MoYmFubmVyU2VsZWN0b3IpO1xuXHRcdFx0aWYgKCRiYW5uZXIubGVuZ3RoKSB7XG5cdFx0XHRcdCRiYW5uZXIuYWRkQ2xhc3MoJ2hhcy1qdW1wLW5hdicpLmFwcGVuZCgkKHRoaXMpLnNpYmxpbmdzKCcuanVtcC1uYXYtbWFya2VyJykpLmFwcGVuZCgkKHRoaXMpKTtcblxuXHRcdFx0XHQvLyBTZXQgdGhlIGp1bXAtbmF2IGJhY2tncm91bmQgaW1hZ2UgdG8gbWF0Y2ggdGhlIGJhbm5lci5cblx0XHRcdFx0aWYgKCRiYW5uZXIuaGFzQ2xhc3MoJ2JnLWltZycpKSB7XG5cdFx0XHRcdFx0JChcIjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+IC5qdW1wLW5hdi5cIit0aGlzTmF2U2VsZWN0b3IrXCIuZml4ZWR7IGJhY2tncm91bmQtaW1hZ2U6XCIgKyAkYmFubmVyLmNzcygnYmFja2dyb3VuZC1pbWFnZScpICsgXCI7fSA8L3N0eWxlPlwiKS5hcHBlbmRUbyhcImhlYWRcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGluZGV4ICs9IDE7XG5cdFx0fSk7XG5cdH1cblxuXHQkKGp1bXBOYXZMaW5rU2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oKXtcblx0XHR2YXIgbGlua0hyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcblxuXHRcdC8qIENoZWNrIHRvIGNvbmZpcm0ganVtcCBsaW5rICovXG5cdFx0aWYobGlua0hyZWYuaW5kZXhPZignIycpID09IDApe1xuXHRcdFx0dmFyIGxpbmtJZCA9ICQodGhpcykuYXR0cignaWQnKTtcblx0XHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxpbmtIcmVmLnJlcGxhY2UoJyMnLCcnKSkpe1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdsaW5rOicgKyBsaW5rSHJlZik7XG5cdFx0XHRcdHZhciBzZWN0aW9uSGVpZ2h0ID0gZ2V0RWxlbWVudEhlaWdodChsaW5rSHJlZi5yZXBsYWNlKCcjJywnJykpO1xuXG5cdFx0XHRcdGp1bXBOYXYucHVzaCh7aWQ6bGlua0lkLCBocmVmOmxpbmtIcmVmLCB0b3A6KCQobGlua0hyZWYpLm9mZnNldCgpLnRvcCAtIGp1bXBOYXZIZWlnaHQpLCBoZWlnaHQ6KHNlY3Rpb25IZWlnaHQpfSk7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ2lkOicgKyBsaW5rSWQgKycsIGhyZWY6JyArIGxpbmtIcmVmICsgJywgdG9wOicgKyAoJChsaW5rSHJlZikub2Zmc2V0KCkudG9wIC0ganVtcE5hdkhlaWdodCkgKyAnLCBoZWlnaHQ6JyArIHNlY3Rpb25IZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG5mdW5jdGlvbiByZWZyZXNoSnVtcE5hdigpe1xuXG5cdHZhciBqdW1wTmF2U2VsZWN0b3IgPSAnbmF2Lmp1bXAtbmF2JztcblxuXHRpZiAoJChqdW1wTmF2U2VsZWN0b3IpLmxlbmd0aCkge1xuXG5cdFx0dmFyIHNjcm9sbEhlaWdodCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblx0XHR2YXIganVtcE5hdkhlaWdodCA9IGdldEVsZW1lbnRIZWlnaHQoJ2p1bXAtbmF2Jyk7XG5cblx0XHQvKiBQb3NpdGlvbmluZyAqL1xuXG5cdFx0dmFyIGp1bXBOYXZFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGp1bXBOYXZJZCk7XG5cdFx0dmFyIGp1bXBOYXZNYXJrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChqdW1wTmF2TWFya2VySWQpO1xuXHRcdC8vIElmIHNjcm9sbEhlaWdodCBpcyBsb3dlciB0aGFuIGp1bXAgbmF2LCB1c2UgYSBmaXhlZCBwb3NpdGlvblxuXHRcdGlmKChzY3JvbGxIZWlnaHQgPj0gZ2V0RWxlbWVudE9mZnNldFRvcChqdW1wTmF2SWQgKyAnLW1hcmtlcicpIC0gc3RhdGljSGVhZGVySGVpZ2h0KSAmJiAoc2Nyb2xsSGVpZ2h0IDwgKGp1bXBOYXZbanVtcE5hdi5sZW5ndGgtMV0udG9wICsganVtcE5hdltqdW1wTmF2Lmxlbmd0aCAtIDFdLmhlaWdodCkpICl7XG5cdFx0XHRqdW1wTmF2RWwuY2xhc3NMaXN0LmFkZCgnZml4ZWQnLCAnYm9yZGVyJyk7XG5cdFx0XHRqdW1wTmF2RWwuc3R5bGUudG9wID0gc3RhdGljSGVhZGVySGVpZ2h0ICsgJ3B4Jztcblx0XHRcdGp1bXBOYXZNYXJrZXIuc3R5bGUuaGVpZ2h0ID0ganVtcE5hdkhlaWdodCArICdweCc7XG5cdCAgICB9XG5cdCAgICBlbHNle1xuXHQgICAgXHQvLyBJZiBub3QgbG93ZXIgdGhhbiBqdW1wIG5hdlxuXHQgICAgXHRqdW1wTmF2RWwuY2xhc3NMaXN0LnJlbW92ZSgnZml4ZWQnLCAnYm9yZGVyJyk7XG5cdCAgICBcdGp1bXBOYXZFbC5zdHlsZS50b3AgPSAnMHB4Jztcblx0ICAgIFx0anVtcE5hdk1hcmtlci5zdHlsZS5oZWlnaHQgPSAnMHB4Jztcblx0ICAgIH1cblx0XHQvKiBkZWJ1ZyAqLyAvL2NvbnNvbGUubG9nKFwic2Nyb2xsVG9wOlwiICsgJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgXCIjanVtcC1uYXYtbWFya2VyIG9mZnNldC50b3A6XCIgKyAkKCcjanVtcC1uYXYtbWFya2VyJykub2Zmc2V0KCkudG9wICsgXCIgfCBcIiArICQoJyNqdW1wLW5hdi1tYXJrZXInKS5vdXRlckhlaWdodCgpICsgJyB8ICcgKyBqdW1wTmF2Lm9mZnNldEhlaWdodCk7XG5cblx0XHQvKiBMaW5rIGhpZ2hsaWdodGluZyAqL1xuXG5cdFx0aWYoIChzY3JvbGxIZWlnaHQgPiBqdW1wTmF2WzBdLnRvcCkgJiYgKHNjcm9sbEhlaWdodCA8IChqdW1wTmF2W2p1bXBOYXYubGVuZ3RoLTFdLnRvcCArIGp1bXBOYXZbanVtcE5hdi5sZW5ndGggLSAxXS5oZWlnaHQpKSApe1xuXHRcdFx0Ly9jb25zb2xlLmxvZygnSW4gcmFuZ2UgKCcgKyBzY3JvbGxIZWlnaHQgKycpJyk7XG5cdFx0XHRmb3IoaT0wO2kgPCBqdW1wTmF2Lmxlbmd0aDtpKyspe1xuXHRcdFx0XHRpZiggKHNjcm9sbEhlaWdodCA+IGp1bXBOYXZbaV0udG9wKSAmIChzY3JvbGxIZWlnaHQgPCAoanVtcE5hdltpXS50b3AgKyBqdW1wTmF2W2ldLmhlaWdodCkpICl7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhqdW1wTmF2W2ldLmlkKTtcblx0XHRcdFx0XHQkKCcuanVtcC1uYXYgYScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0XHRcdCQoJy4nICsganVtcE5hdltpXS5pZCkuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdCQoJy5qdW1wLW5hdiBhJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdPdXQgb2YgcmFuZ2UgKCcgKyBzY3JvbGxIZWlnaHQgKycpJyk7XG5cdFx0fVxuXHR9XG59XG5cbnZhciBwYWdlTmF2SWQgPSAncGFnZS1uYXYnO1xudmFyIHBhZ2VOYXZNYXJrZXJJZCA9ICdwYWdlLW5hdi1tYXJrZXInO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplUGFnZU5hdigpe1xuXHQvL2NvbnNvbGUubG9nKCdpbml0aWFsaXplUGFnZU5hdigpJyk7XG5cdHBhZ2VOYXYgPSBbXTtcblx0dmFyIHBhZ2VOYXZTZWxlY3RvciA9ICdkaXYjJyArIHBhZ2VOYXZJZDtcblx0dmFyIHBhZ2VOYXZNb3ZlU2VsZWN0b3IgPSBwYWdlTmF2U2VsZWN0b3IgKyAnLm1vdmUtaW50by1iYW5uZXInO1xuXHR2YXIgYmFubmVyU2VsZWN0b3IgPSAnLmJhbm5lcic7XG5cdHZhciBwYWdlTmF2TGlua1NlbGVjdG9yID0gJ2RpdiMnICsgcGFnZU5hdklkICsgJyBsaSBhJztcblx0dmFyIGR5bmFtaWNQYWdlTmF2TGlua1NlbGVjdG9yID0gJ25hdiMnICsgcGFnZU5hdklkICsgJyBsaSBhJztcblx0dmFyIHBhZ2VOYXZIZWlnaHQgPSBnZXRFbGVtZW50SGVpZ2h0KHBhZ2VOYXZJZCk7XG5cblx0Ly8gSWYgdGhlIHBhZ2UgbmF2IGlzIHN1cHBvc2VkIHRvIGJlIGVtYmVkZGVkIGludG8gdGhlIGJhbm5lciwgdGhlIHBhZ2UgbmF2IHdpbGwgaGF2ZSBhIHNwZWNpZmllZCBjbGFzcy5cblx0aWYgKCQocGFnZU5hdk1vdmVTZWxlY3RvcikubGVuZ3RoKSB7XG5cdFx0aWYgKCQoYmFubmVyU2VsZWN0b3IpLmxlbmd0aCkge1xuXHRcdFx0JChiYW5uZXJTZWxlY3RvcikuYWRkQ2xhc3MoJ2hhcy1wYWdlLW5hdicpLmFwcGVuZCgkKHBhZ2VOYXZTZWxlY3RvciArICctbWFya2VyJykpLmFwcGVuZCgkKHBhZ2VOYXZTZWxlY3RvcikpO1xuXG5cdFx0XHQvLyBTZXQgdGhlIHBhZ2UtbmF2IGJhY2tncm91bmQgaW1hZ2UgdG8gbWF0Y2ggdGhlIGJhbm5lci5cblx0XHRcdGlmICgkKGJhbm5lclNlbGVjdG9yKS5oYXNDbGFzcygnYmctaW1nJykpIHtcblx0XHRcdFx0JChcIjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+ICNwYWdlLW5hdi5maXhlZHsgYmFja2dyb3VuZC1pbWFnZTpcIiArICQoYmFubmVyU2VsZWN0b3IpLmNzcygnYmFja2dyb3VuZC1pbWFnZScpICsgXCI7fSA8L3N0eWxlPlwiKS5hcHBlbmRUbyhcImhlYWRcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0JChwYWdlTmF2TGlua1NlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGxpbmtIcmVmID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG5cblx0XHRpZihsaW5rSHJlZi5pbmRleE9mKCcjJykgPT0gMCl7XG5cdFx0XHR2YXIgbGlua0lkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xuXHRcdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGlua0hyZWYucmVwbGFjZSgnIycsJycpKyAnLXNlY3Rpb24nKSl7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ2xpbms6JyArIGxpbmtIcmVmKTtcblx0XHRcdFx0dmFyIHNlY3Rpb25IZWlnaHQgPSBnZXRFbGVtZW50SGVpZ2h0KGxpbmtIcmVmLnJlcGxhY2UoJyMnLCcnKSArICctc2VjdGlvbicpO1xuXG5cdFx0XHRcdHBhZ2VOYXYucHVzaCh7aWQ6bGlua0lkLCBocmVmOmxpbmtIcmVmLCB0b3A6KCQobGlua0hyZWYpLm9mZnNldCgpLnRvcCAtIHBhZ2VOYXZIZWlnaHQpLCBoZWlnaHQ6KHNlY3Rpb25IZWlnaHQpfSk7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ2lkOicgKyBsaW5rSWQgKycsIGhyZWY6JyArIGxpbmtIcmVmICsgJywgdG9wOicgKyAoJChsaW5rSHJlZikub2Zmc2V0KCkudG9wIC0gcGFnZU5hdkhlaWdodCkgKyAnLCBoZWlnaHQ6JyArIHNlY3Rpb25IZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0JChkeW5hbWljUGFnZU5hdkxpbmtTZWxlY3RvcikuZWFjaChmdW5jdGlvbigpe1xuXHRcdHZhciBsaW5rSHJlZiA9ICQodGhpcykuYXR0cignaHJlZicpO1xuXG5cdFx0LyogQ2hlY2sgdG8gY29uZmlybSBqdW1wIGxpbmsgKi9cblx0XHRpZihsaW5rSHJlZi5pbmRleE9mKCcjJykgPT0gMCl7XG5cdFx0XHR2YXIgbGlua0lkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xuXHRcdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGlua0hyZWYucmVwbGFjZSgnIycsJycpKSl7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ2xpbms6JyArIGxpbmtIcmVmKTtcblx0XHRcdFx0dmFyIHNlY3Rpb25IZWlnaHQgPSBnZXRFbGVtZW50SGVpZ2h0KGxpbmtIcmVmLnJlcGxhY2UoJyMnLCcnKSk7XG5cblx0XHRcdFx0cGFnZU5hdi5wdXNoKHtpZDpsaW5rSWQsIGhyZWY6bGlua0hyZWYsIHRvcDooJChsaW5rSHJlZikub2Zmc2V0KCkudG9wIC0gcGFnZU5hdkhlaWdodCksIGhlaWdodDooc2VjdGlvbkhlaWdodCl9KTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnaWQ6JyArIGxpbmtJZCArJywgaHJlZjonICsgbGlua0hyZWYgKyAnLCB0b3A6JyArICgkKGxpbmtIcmVmKS5vZmZzZXQoKS50b3AgLSBwYWdlTmF2SGVpZ2h0KSArICcsIGhlaWdodDonICsgc2VjdGlvbkhlaWdodCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxufVxuXG5mdW5jdGlvbiByZWZyZXNoUGFnZU5hdigpe1xuXG5cdHZhciBwYWdlTmF2U2VsZWN0b3IgPSAnZGl2I3BhZ2UtbmF2JztcblxuXHRpZiAoJChwYWdlTmF2U2VsZWN0b3IpLmxlbmd0aCkge1xuXG5cdFx0dmFyIHNjcm9sbEhlaWdodCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblx0XHR2YXIgcGFnZU5hdkhlaWdodCA9IGdldEVsZW1lbnRIZWlnaHQoJ3BhZ2UtbmF2Jyk7XG5cblx0XHQvKiBQb3NpdGlvbmluZyAqL1xuXG5cdFx0dmFyIHBhZ2VOYXZFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhZ2VOYXZJZCk7XG5cdFx0dmFyIHBhZ2VOYXZNYXJrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYWdlTmF2TWFya2VySWQpO1xuXHRcdC8vIElmIHNjcm9sbEhlaWdodCBpcyBsb3dlciB0aGFuIHBhZ2UgbmF2LCB1c2UgYSBmaXhlZCBwb3NpdGlvblxuXHRcdGlmKChzY3JvbGxIZWlnaHQgPj0gZ2V0RWxlbWVudE9mZnNldFRvcChwYWdlTmF2SWQgKyAnLW1hcmtlcicpIC0gc3RhdGljSGVhZGVySGVpZ2h0KSAmJiAoc2Nyb2xsSGVpZ2h0IDwgKHBhZ2VOYXZbcGFnZU5hdi5sZW5ndGgtMV0udG9wICsgcGFnZU5hdltwYWdlTmF2Lmxlbmd0aCAtIDFdLmhlaWdodCkpICl7XG5cdFx0XHRwYWdlTmF2RWwuY2xhc3NMaXN0LmFkZCgnZml4ZWQnLCAnYm9yZGVyJyk7XG5cdFx0XHRwYWdlTmF2RWwuc3R5bGUudG9wID0gc3RhdGljSGVhZGVySGVpZ2h0ICsgJ3B4Jztcblx0XHRcdHBhZ2VOYXZNYXJrZXIuc3R5bGUuaGVpZ2h0ID0gcGFnZU5hdkhlaWdodCArICdweCc7XG5cdCAgICB9XG5cdCAgICBlbHNle1xuXHQgICAgXHQvLyBJZiBub3QgbG93ZXIgdGhhbiBwYWdlIG5hdlxuXHQgICAgXHRwYWdlTmF2RWwuY2xhc3NMaXN0LnJlbW92ZSgnZml4ZWQnLCAnYm9yZGVyJyk7XG5cdCAgICBcdHBhZ2VOYXZFbC5zdHlsZS50b3AgPSAnMHB4Jztcblx0ICAgIFx0cGFnZU5hdk1hcmtlci5zdHlsZS5oZWlnaHQgPSAnMHB4Jztcblx0ICAgIH1cblx0XHQvKiBkZWJ1ZyAqLyAvL2NvbnNvbGUubG9nKFwic2Nyb2xsVG9wOlwiICsgJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgXCIjcGFnZS1uYXYtbWFya2VyIG9mZnNldC50b3A6XCIgKyAkKCcjcGFnZS1uYXYtbWFya2VyJykub2Zmc2V0KCkudG9wICsgXCIgfCBcIiArICQoJyNwYWdlLW5hdi1tYXJrZXInKS5vdXRlckhlaWdodCgpICsgJyB8ICcgKyBwYWdlTmF2Lm9mZnNldEhlaWdodCk7XG5cblx0XHQvKiBMaW5rIGhpZ2hsaWdodGluZyAqL1xuXG5cdFx0aWYoIChzY3JvbGxIZWlnaHQgPiBwYWdlTmF2WzBdLnRvcCkgJiYgKHNjcm9sbEhlaWdodCA8IChwYWdlTmF2W3BhZ2VOYXYubGVuZ3RoLTFdLnRvcCArIHBhZ2VOYXZbcGFnZU5hdi5sZW5ndGggLSAxXS5oZWlnaHQpKSApe1xuXHRcdFx0Ly9jb25zb2xlLmxvZygnSW4gcmFuZ2UgKCcgKyBzY3JvbGxIZWlnaHQgKycpJyk7XG5cdFx0XHRmb3IoaT0wO2kgPCBwYWdlTmF2Lmxlbmd0aDtpKyspe1xuXHRcdFx0XHRpZiggKHNjcm9sbEhlaWdodCA+IHBhZ2VOYXZbaV0udG9wKSAmIChzY3JvbGxIZWlnaHQgPCAocGFnZU5hdltpXS50b3AgKyBwYWdlTmF2W2ldLmhlaWdodCkpICl7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhwYWdlTmF2W2ldLmlkKTtcblx0XHRcdFx0XHRpZighJCgnIycgKyBwYWdlTmF2W2ldLmlkKS5oYXNDbGFzcygnc2VsZWN0ZWQnKSl7XG5cdFx0XHRcdFx0XHQkKCcjcGFnZS1uYXYgYScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0XHRcdFx0JCgnIycgKyBwYWdlTmF2W2ldLmlkKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdCQoJyNwYWdlLW5hdiBhJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdPdXQgb2YgcmFuZ2UgKCcgKyBzY3JvbGxIZWlnaHQgKycpJyk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVGaWx0ZXJzKCl7XG5cdGlmICgkKCcuZmlsdGVycycpLmxlbmd0aCkge1xuXG5cdFx0dG9nZ2xlQ291bnQgPSAxMDsgLy8gdXNlIGFsbC9mZXdlciB0b2dnbGUgd2hlbiB0aGVyZSBhcmUgbW9yZSB0aGFuIHRoaXMgbWFueSBpdGVtc1xuXG5cdFx0JCgnLnRvZ2dsZScpLmVhY2goZnVuY3Rpb24oKXtcblxuXHRcdFx0LyogSGlkZSBhbGwvZmV3ZXIgdG9nZ2xlcyBvZiBmZXdlciB0aGFuIHRoZSB0b2dnbGUgbnVtYmVyICovXG5cdFx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKCdzZWUtZmV3ZXInKSl7XG5cdFx0XHRcdGlmKCQodGhpcykuc2libGluZ3MoKS5sZW5ndGggPiAodG9nZ2xlQ291bnQgKyAyKSl7XG5cdFx0XHRcdFx0JCh0aGlzKS5zaWJsaW5ncyhcIjpudGgtY2hpbGQobitcIisgKHRvZ2dsZUNvdW50ICsgMSkgK1wiKTpub3QoJy50b2dnbGUnKVwiKS5hZGRDbGFzcygnaGlkZScpLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdCQodGhpcykuc2libGluZ3MoJy50b2dnbGUnKS5hZGRDbGFzcygnaGlkZScpLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQkKHRoaXMpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdC8qIEhpZGUgdGhpcyB0b2dnbGUgYW5kIHNob3cgaXRzIHNpYmxpbmcgKi9cblx0XHRcdFx0JCh0aGlzKS5oaWRlKCkuc2libGluZ3MoJy50b2dnbGUnKS5yZW1vdmVDbGFzcygnaGlkZScpLnNob3coKTtcblxuXHRcdFx0XHQvKiBEaWZmZXJlbnQgYmVoYXZpb3JzIGZvciBkaWZmZXJlbnQgdG9nZ2xlIHR5cGVzICovXG5cblx0XHRcdFx0XHQvKiBTaG93IGFsbCBzaWJsaW5ncyAqL1xuXHRcdFx0XHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoJ3NlZS1hbGwnKSl7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLnNpYmxpbmdzKFwiOm5vdCgnLnRvZ2dsZScpXCIpLnJlbW92ZUNsYXNzKCdoaWRlJykuc2hvdygpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8qIEhpZGUgYWxsIGxpc3QgaXRlbXMgYWZ0ZXIgdGhlIGZpcnN0IHNldCB0aGF0IHNob3VsZCBiZSBzaG93biAqL1xuXHRcdFx0XHRcdGVsc2UgaWYoJCh0aGlzKS5oYXNDbGFzcygnc2VlLWZld2VyJykpe1xuXHRcdFx0XHRcdFx0JCh0aGlzKS5zaWJsaW5ncyhcIjpudGgtY2hpbGQobitcIisgKHRvZ2dsZUNvdW50ICsgMSkgK1wiKTpub3QoJy50b2dnbGUnKVwiKS5hZGRDbGFzcygnaGlkZScpLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvKiBTaG93IGNoaWxkIGxpc3QgKi9cblx0XHRcdFx0XHRlbHNlIGlmKCQodGhpcykuaGFzQ2xhc3MoJ2V4cGFuZCcpKXtcblx0XHRcdFx0XHRcdCQodGhpcykuc2libGluZ3MoJ3VsJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0LyogSGlkZSBjaGlsZCBsaXN0ICovXG5cdFx0XHRcdFx0ZWxzZSBpZigkKHRoaXMpLmhhc0NsYXNzKCdjb250cmFjdCcpKXtcblx0XHRcdFx0XHRcdCQodGhpcykuc2libGluZ3MoJ3VsJykuYWRkQ2xhc3MoJ2hpZGUnKS5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXG4gIFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0fVxufVxuXG5cbihmdW5jdGlvbihjb250ZXh0LCByZXF1aXJlLCBpc1NhbmRib3hlZCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZiAoaXNTYW5kYm94ZWQpIHtcblx0XHR0aHJvdyBcIkhlbHAhIEknbSBzdHVjayBpbiBhIHNhbmRib3ghXCI7XG5cdH1cblxuXHR2YXIgc2NyaXB0VGFncyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcblx0dmFyIG1haW5TY3JpcHRTcmM7XG5cdHZhciBkb21haW5SZWxQYXRoVG9NYWluSnNEaXI7XG5cblx0LyoqIEB0eXBlIHtIVE1MU2NyaXB0RWxlbWVudH0gdGFnICovXG5cdHZhciB0YWc7XG5cdGZvciAodmFyIGk9MDsgaTxzY3JpcHRUYWdzLmxlbmd0aDsgaSsrKSB7XG5cblx0XHR0YWcgPSBzY3JpcHRUYWdzW2ldO1xuXG5cdCAgICBpZiAodGFnLmhhc0F0dHJpYnV0ZShcInJlbFwiKSAmJlxuXHQgICAgICAgIHRhZy5nZXRBdHRyaWJ1dGUoXCJyZWxcIikgPT09IFwibWFpblwiICYmXG5cdCAgICAgICAgdGFnLmhhc0F0dHJpYnV0ZShcInNyY1wiKSkge1xuXG5cdCAgICAgICAgbWFpblNjcmlwdFNyYyA9IHRhZy5nZXRBdHRyaWJ1dGUoXCJzcmNcIik7XG5cdCAgICB9XG5cdH1cblxuXHRpZiAodHlwZW9mIG1haW5TY3JpcHRTcmMgIT09ICdzdHJpbmcnKSB7XG5cdCAgICB0aHJvdyBcIkNhbid0IGZpbmQgc2NyaXB0IHJlbD1tYWluIVwiO1xuXHR9XG5cblx0Ly8gR2V0IGV2ZXJ5dGhpbmcgdGhhdCBjb21lcyBiZWZvcmUgXCIvbWFpbi5qc1wiIGluIHRoZSAnc3JjJ1xuXHQvLyBhdHRyaWJ1dGUgd2hpY2ggaW5jbHVkZWQgdGhpcyBzY3JpcHRcblx0dmFyIHBhdGhNYXRjaFJlc3VsdHMgPSBtYWluU2NyaXB0U3JjLm1hdGNoKC9eKC4qKVxcLy4rJC8pO1xuXG5cdGlmIChwYXRoTWF0Y2hSZXN1bHRzLmxlbmd0aCA9PT0gMikge1xuXHQgICAgZG9tYWluUmVsUGF0aFRvTWFpbkpzRGlyID0gcGF0aE1hdGNoUmVzdWx0cy5wb3AoKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBcIkNvdWxkbid0IGRldGVybWluZSBkb21haW4tcmVsYXRpdmUgcGF0aCB0byBtYWluIEpTIVwiO1xuXHR9XG5cblx0dmFyIGNvbmZpZyA9IHtcblx0XHRiYXNlVXJsOiBkb21haW5SZWxQYXRoVG9NYWluSnNEaXIsXG5cdFx0cGF0aHM6IHtcblxuXHRcdFx0Ly8gdGhlIGxlZnQgc2lkZSBpcyB0aGUgbW9kdWxlIElELFxuXHRcdFx0Ly8gdGhlIHJpZ2h0IHNpZGUgaXMgdGhlIHBhdGggdG9cblx0XHRcdC8vIHRoZSBqUXVlcnkgZmlsZSwgcmVsYXRpdmUgdG8gYmFzZVVybC5cblx0XHRcdC8vIEFsc28sIHRoZSBwYXRoIHNob3VsZCBOT1QgaW5jbHVkZVxuXHRcdFx0Ly8gdGhlICcuanMnIGZpbGUgZXh0ZW5zaW9uLiBUaGlzIGV4YW1wbGVcblx0XHRcdC8vIGlzIHVzaW5nIGpRdWVyeSAxLjkuMCBsb2NhdGVkIGF0XG5cdFx0XHQvLyBqcy9saWIvanF1ZXJ5LTEuOS4wLmpzLCByZWxhdGl2ZSB0b1xuXHRcdFx0Ly8gdGhlIEhUTUwgcGFnZS5cblx0XHRcdGpxdWVyeTogJ2pxdWVyeS1zdHViJyxcblx0XHRcdGFwcGxpY2F0aW9uOiAnYXBwbGljYXRpb24nXG5cdFx0fVxuXHR9O1xuXG5cdC8qIGRlYnVnKi8gLy9jb25zb2xlLmxvZygncmVxdWlyZSBjb25maWc6ICcsIGNvbmZpZyk7XG5cdHJlcXVpcmUuY29uZmlnKGNvbmZpZyk7XG5cblx0cmVxdWlyZShbJ2FwcGxpY2F0aW9uJ10sIGZ1bmN0aW9uKGFwcGxpY2F0aW9uKSB7XG5cdFx0Y29uc29sZS5sb2coJ29uIGFwcGxpY2F0aW9uOyBhcHBsaWNhdGlvbiA9ICcsIGFwcGxpY2F0aW9uKTtcblx0XHRjb250ZXh0LkNiQXBwID0gYXBwbGljYXRpb247XG5cdH0pO1xuXG59KShcblx0Ly8gZWl0aGVyIHRoZSBnbG9iYWwgY29udGV4dCAod2luZG93KSxcblx0Ly8gb3IgZW1wdHkgb2JqZWN0IGlmIHJ1biBpbiBpc29sYXRpb24uXG5cdHRoaXMsXG5cdC8vIGdsb2JhbCByZXF1aXJlanMgZnVuY3Rpb25cblx0KHR5cGVvZiB3aW5kb3cgPT0gJ3VuZGVmaW5lZCcpPyByZXF1aXJlOiB3aW5kb3cucmVxdWlyZWpzLFxuXHQvLyBvbmx5IHRydWUgaW4gYSBzY3JpcHQtbG9jYWwgZW52aXJvbm1lbnQgc3VjaCBhcyBub2RlLmpzXG5cdC8vIHdoZXJlIHRoZXJlIGlzIG5vIHNoYXJlZCBnbG9iYWwgb2JqZWN0LCBlLmcuIGB3aW5kb3dgLlxuXHQodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICYmIHRoaXMuZXhwb3J0cyAhPT0gZXhwb3J0cylcbik7XG5cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEpRdWVyeSBQbHVnaW46IFwiRXF1YWxIZWlnaHRzXCJcbiAqIFZlcnNpb246IDIuMCwgMDguMDEuMjAwOFxuICogYnkgU2NvdHQgSmVobCwgVG9kZCBQYXJrZXIsIE1hZ2dpZSBDb3N0ZWxsbyBXYWNocyAoaHR0cDovL3d3dy5maWxhbWVudGdyb3VwLmNvbSlcbiAqIENvcHlyaWdodCAoYykgMjAwOCBGaWxhbWVudCBHcm91cC4gTGljZW5zZWQgdW5kZXIgR1BMIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL2dwbC1saWNlbnNlLnBocClcbiAqXG4gKiBEZXNjcmlwdGlvbjogU2V0cyB0aGUgaGVpZ2h0cyBvZiB0aGUgdG9wLWxldmVsIGNoaWxkcmVuIG9mIGFuIGVsZW1lbnQgdG8gbWF0Y2ggdGhlIHRhbGxlc3QgY2hpbGQuXG4gKiBNb2RpZmllZDogYWRkZWQgLm5vdCgnLm5vX2hlaWdodCcpIHRvIHByZXZlbnQgbm9faGVpZ2h0IGl0ZW1zIGZyb20gYmVpbmcgbW9kaWZpZWRcbiAqIE1vZGlmaWVkOiBhZGRlZCAuYWRkQ2xhc3MoJ2ZpeGVkX2hlaWdodCcpIHRvIGNoaWxkcmVuIHdoZXJlIGhlaWdodCBpcyBzZXRcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiQuZm4uZXF1YWxIZWlnaHRzID0gZnVuY3Rpb24ocHgpIHtcblx0JCh0aGlzKS5lYWNoKGZ1bmN0aW9uKCl7XG5cblx0XHQvL2NvbnNvbGUubG9nKCdlcXVhbEhlaWdodHMnKTtcblxuXHRcdC8vIE1PRElGSUNBVElPTjogQ0xFQVJJTkcgSEVJR0hUUyBGSVJTVFxuXHRcdGlmICgkLmJyb3dzZXIubXNpZSAmJiAkLmJyb3dzZXIudmVyc2lvbiA9PSA2LjApIHtcblx0XHRcdCQodGhpcykuY2hpbGRyZW4oKS5jc3MoeydoZWlnaHQnOicnfSk7XG5cdFx0XHQkKHRoaXMpLmNoaWxkcmVuKCkuY2hpbGRyZW4oJy5mdWxsX2hlaWdodCcpLmNzcyh7J2hlaWdodCc6Jyd9KTtcblx0XHR9XG5cdFx0JCh0aGlzKS5jaGlsZHJlbigpLmNzcyh7J2hlaWdodCc6ICcnfSk7XG5cdFx0JCh0aGlzKS5jaGlsZHJlbigpLmNoaWxkcmVuKCcuZnVsbF9oZWlnaHQnKS5jc3MoeydoZWlnaHQnOicnfSk7XG5cblx0XHR2YXIgY3VycmVudFRhbGxlc3QgPSAwO1xuXHRcdHZhciBjdXJyZW50VGFsbGVzdFN1YiA9IDA7XG5cdFx0JCh0aGlzKS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oaSl7XG5cdFx0XHRpZiAoJCh0aGlzKS5oZWlnaHQoKSA+IGN1cnJlbnRUYWxsZXN0KSB7IGN1cnJlbnRUYWxsZXN0ID0gJCh0aGlzKS5oZWlnaHQoKTt9XG5cdFx0XHRpZiAoJCh0aGlzKS5jaGlsZHJlbignLmZ1bGxfaGVpZ2h0JykuaGVpZ2h0KCkgPiBjdXJyZW50VGFsbGVzdFN1YikgeyBjdXJyZW50VGFsbGVzdFN1YiA9ICQodGhpcykuY2hpbGRyZW4oJy5mdWxsX2hlaWdodCcpLmhlaWdodCgpO31cblx0XHR9KTtcblxuXHRcdC8vIGZvciBpZTYsIHNldCBoZWlnaHQgc2luY2UgbWluLWhlaWdodCBpc24ndCBzdXBwb3J0ZWRcblx0XHRpZiAoJC5icm93c2VyLm1zaWUgJiYgJC5icm93c2VyLnZlcnNpb24gPT0gNi4wKSB7XG5cdFx0XHQkKHRoaXMpLmNoaWxkcmVuKCkubm90KCcubm9faGVpZ2h0JykuY3NzKHsnaGVpZ2h0JzogY3VycmVudFRhbGxlc3R9KTtcblx0XHRcdCQodGhpcykuY2hpbGRyZW4oKS5ub3QoJy5ub19oZWlnaHQnKS5jaGlsZHJlbignLmZ1bGxfaGVpZ2h0JykuY3NzKHsnaGVpZ2h0JzogY3VycmVudFRhbGxlc3RTdWJ9KTtcblx0XHR9XG5cblx0XHQvLyBzZXQgaGVpZ2h0XG5cdFx0JCh0aGlzKS5jaGlsZHJlbigpLm5vdCgnLm5vX2hlaWdodCcpLmNzcyh7J2hlaWdodCc6IGN1cnJlbnRUYWxsZXN0fSk7XG5cdFx0JCh0aGlzKS5jaGlsZHJlbigpLm5vdCgnLm5vX2hlaWdodCcpLmNoaWxkcmVuKCcuZnVsbF9oZWlnaHQnKS5jc3MoeydoZWlnaHQnOiBjdXJyZW50VGFsbGVzdFN1Yn0pO1xuXG5cdFx0Ly8gYWRkIENTUyBjbGFzc1xuXHRcdCQodGhpcykuY2hpbGRyZW4oKS5ub3QoJy5ub19oZWlnaHQnKS5hZGRDbGFzcygnZml4ZWRfaGVpZ2h0Jyk7XG5cdFx0JCh0aGlzKS5jaGlsZHJlbigpLm5vdCgnLm5vX2hlaWdodCcpLmNoaWxkcmVuKCcuZnVsbF9oZWlnaHQnKS5hZGRDbGFzcygnZml4ZWRfaGVpZ2h0Jyk7XG5cdH0pO1xuXG5cdHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gc2V0RXF1YWxIZWlnaHRzKCl7XG5cdC8vQ2FsbGluZyAuZXF1YWxIZWlnaHRzKCkgd2FzIHRocm93aW5nIGEgZXJyb3Jcblx0Ly8kKCcuZXF1YWwtaGVpZ2h0cycpLmVxdWFsSGVpZ2h0cygpO1xufVxuXG5mdW5jdGlvbiBzY3JvbGxUbyhkZXN0LHNwZWVkKXtcblx0aWYodHlwZW9mIHNwZWVkID09PSAndW5kZWZpbmVkJyl7IHNwZWVkPSdmYXN0JzsgfVxuXHRpZih0eXBlb2YgZGVzdCAhPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdGlmKCQoZGVzdCkubGVuZ3RoKXtcblx0XHRcdCQoJ2h0bWwsYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQoZGVzdCkub2Zmc2V0KCkudG9wIH0sIHNwZWVkKTtcblx0XHRcdCQoZGVzdCkuZm9jdXMoKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gc2hvd0NvbnRlbnQoc2VsZWN0b3JUb1Nob3csc2VsZWN0b3JUb0hpZGUsZWZmZWN0LHNwZWVkLHNlbGVjdG9yVG9Gb2N1cyxmb2N1c1NldCl7XG5cdGlmKCh0eXBlb2Ygc2VsZWN0b3JUb1Nob3cgIT0gJ3VuZGVmaW5lZCcpICYmICh0eXBlb2Ygc2VsZWN0b3JUb0hpZGUgIT0gJ3VuZGVmaW5lZCcpKXtcblxuXHRcdGlmKHR5cGVvZiBlZmZlY3QgPT09ICd1bmRlZmluZWQnKVx0eyBlZmZlY3Q9J2ZhZGUnOyB9XG5cdFx0aWYodHlwZW9mIHNwZWVkID09PSAndW5kZWZpbmVkJylcdHsgc3BlZWQ9J2Zhc3QnOyB9XG5cblx0XHRpZigkKHNlbGVjdG9yVG9TaG93KS5pcygnOmhpZGRlbicpKXtcblx0XHRcdGlmKGVmZmVjdCA9PSAnc2xpZGUnKXtcblx0XHRcdFx0aWYoJChzZWxlY3RvclRvSGlkZSArICc6dmlzaWJsZScpLmxlbmd0aCl7XG5cdFx0XHRcdFx0JChzZWxlY3RvclRvSGlkZSArICc6dmlzaWJsZScpLmhpZGUoKTtcblx0XHRcdFx0XHQkKHNlbGVjdG9yVG9TaG93KS5mYWRlSW4oc3BlZWQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0JChzZWxlY3RvclRvU2hvdykuc2xpZGVEb3duKHNwZWVkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZihlZmZlY3QgPT0gJ3Nob3cnKXtcblx0XHRcdFx0aWYoJChzZWxlY3RvclRvSGlkZSArICc6dmlzaWJsZScpLmxlbmd0aCl7XG5cdFx0XHRcdFx0JChzZWxlY3RvclRvSGlkZSArICc6dmlzaWJsZScpLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkKHNlbGVjdG9yVG9TaG93KS5zaG93KCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBkZWZhdWx0IGVmZmVjdCBpcyBmYWRlXG5cdFx0XHRlbHNle1xuXHRcdFx0XHRpZigkKHNlbGVjdG9yVG9IaWRlICsgJzp2aXNpYmxlJykubGVuZ3RoKXtcblx0XHRcdFx0XHQkKHNlbGVjdG9yVG9IaWRlICsgJzp2aXNpYmxlJykuZmFkZU91dChzcGVlZCwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdCQoc2VsZWN0b3JUb1Nob3cpLmZhZGVJbihzcGVlZCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHQkKHNlbGVjdG9yVG9TaG93KS5mYWRlSW4oc3BlZWQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHRpZigodHlwZW9mIGZvY3VzU2V0ICE9ICd1bmRlZmluZWQnKSAmJiAodHlwZW9mIHNlbGVjdG9yVG9Gb2N1cyAhPSAndW5kZWZpbmVkJykpe1xuXHRcdCQoZm9jdXNTZXQpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdCQoc2VsZWN0b3JUb0ZvY3VzKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW5kZXJDb2x1bW5zKCl7XG5cdC8qIGRlYnVnICovIGNvbnNvbGUuZ3JvdXAoJ2NyZWF0ZUNvbHVtbnMnKTtcblxuXHR2YXIgaiA9IDE7XG5cblx0JCgnLmpzLWNvbHMnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb2xzID0gJCh0aGlzKS5kYXRhKCdjb2x1bW5zJyk7XG5cdFx0dmFyIGRpcmVjdGlvbiA9ICQodGhpcykuZGF0YSgnbGlzdC1kaXJlY3Rpb24nKTtcblxuXHRcdHZhciBsaXN0U2VsZWN0b3IgPSBcIi5jb2wtbGlzdC1cIiArIGo7XG5cdFx0dmFyIG9iaiA9IGpRdWVyeSh0aGlzKTtcblx0XHR2YXIgdG90YWxMaXN0RWxlbWVudHMgPSBqUXVlcnkodGhpcykuY2hpbGRyZW4oJ2RpdicpLnNpemUoKTtcblx0XHR2YXIgcm93cyA9IE1hdGguY2VpbCh0b3RhbExpc3RFbGVtZW50cyAvIGNvbHMpO1xuXHRcdHZhciBsaXN0Q2xhc3MgPSAkKHRoaXMpLmF0dHIoJ2NsYXNzJyk7XG5cblx0XHQvKiBkZWJ1ZyAqLyAvL2NvbnNvbGUubG9nKGNvbHMgKyAnIGNvbHVtbnMsICcgKyByb3dzICsgJyByb3dzLCcgKyB0b3RhbExpc3RFbGVtZW50cyArICcgdG90YWwgZWxlbWVudHMsIGNsYXNzID0gJyArIGxpc3RDbGFzcyk7XG5cblx0XHQvKlxuXHRcdENyZWF0ZSBMaXN0IEVsZW1lbnRzIGdpdmVuIHJvdyBudW1iZXJcblx0XHQqL1xuXG5cdFx0Zm9yIChpPTE7aTw9cm93cztpKyspe1xuXHRcdFx0aWYoaT09MSl7XG5cdFx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MobGlzdENsYXNzKS5hZGRDbGFzcygncm93IHJvdzEnKS53cmFwKCc8ZGl2IGNsYXNzPVwiY29scyBjb2xzLScrY29scysnICcrbGlzdFNlbGVjdG9yLnJlcGxhY2UoJy4nLCcnKSsnXCI+PC9kaXY+Jyk7XG5cdFx0XHRcdCQodGhpcykucGFyZW50cyhsaXN0U2VsZWN0b3IpLmFkZENsYXNzKGxpc3RDbGFzcyk7XG5cdFx0XHR9IGVsc2V7XG5cdFx0XHRcdCQodGhpcykucGFyZW50cyhsaXN0U2VsZWN0b3IpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInJvdyByb3cnK2krJ1wiPjwvZGl2PicpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBpbmRleCA9IDE7XG5cblx0XHQvKlxuXHRcdEFwcGVuZCBMaXN0IEVsZW1lbnRzIHRvIHRoZSByZXNwZWN0aXZlIHJvdyAgLSBIb3Jpem9udGFsXG5cdFx0Ki9cblxuXHRcdGlmKGRpcmVjdGlvbiA9PSAnaG9yaXpvbnRhbCcpe1xuXG5cdFx0XHQkKHRoaXMpLmNoaWxkcmVuKCdkaXYnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKGluZGV4ID4gY29scyl7XG5cdFx0XHRcdFx0dmFyIHJvd051bWJlciA9IE1hdGguY2VpbChpbmRleCAvIGNvbHMpO1xuXHRcdFx0XHRcdCQodGhpcykucGFyZW50cyhsaXN0U2VsZWN0b3IpLmZpbmQoJy5yb3cnK3Jvd051bWJlcikuYXBwZW5kKHRoaXMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGluZGV4ID0gaW5kZXgrMTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkKGxpc3RTZWxlY3RvcikuZmluZCgnZGl2LnJvdycpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYoJCh0aGlzKS5jaGlsZHJlbigpLnNpemUoKSA9PSAwKSB7XG5cdFx0XHRcdCQodGhpcykucmVtb3ZlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8qXG5cdFx0QXBwZW5kIExpc3QgRWxlbWVudHMgdG8gdGhlIHJlc3BlY3RpdmUgcm93ICAtIFZlcnRpY2FsXG5cdFx0Ki9cblxuXHRcdGVsc2V7XG5cdFx0XHQkKHRoaXMpLmNoaWxkcmVuKCdkaXYnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciByb3dOdW1iZXIgPSByb3dzIC0gKGluZGV4ICUgcm93cyk7XG5cdFx0XHRcdCQodGhpcykucGFyZW50cyhsaXN0U2VsZWN0b3IpLmZpbmQoJy5yb3cnK3Jvd051bWJlcikuYXBwZW5kKHRoaXMpO1xuXHRcdFx0XHRpbmRleCA9IGluZGV4KzE7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQkKGxpc3RTZWxlY3RvciArICcgLnJvdycpLmNoaWxkcmVuKCdkaXYnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdjb2wnKTtcblx0XHR9KTtcblxuXHR9KTtcblxuXHQvKiBkZWJ1ZyAqLyBjb25zb2xlLmdyb3VwRW5kKCk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVMZWFybk1vcmVMaW5rcygpe1xuXHRjb25zb2xlLmxvZygnaW5pdGlhbGl6ZUxlYXJuTW9yZUxpbmtzLi4uJyk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdENvbHVtbnMoKXtcblx0LyogZGVidWcgKi8gLy9jb25zb2xlLmdyb3VwKCdjcmVhdGVDb2x1bW5zJyk7XG5cblx0JCgnLnRhYmxlJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRpZigkKHRoaXMpLmF0dHIoJ2hpZ2hsaWdodC1jb2x1bW4nKSl7XG5cdFx0XHR2YXIgY29sID0gJCh0aGlzKS5kYXRhKCdoaWdobGlnaHQtY29sdW1uJyk7XG5cdFx0XHQkKCcudGFibGUgdGg6bnRoLWNoaWxkKCcrY29sKycpLCAudGFibGUgdGQ6bnRoLWNoaWxkKCcrY29sKycpJykuYWRkQ2xhc3MoJ2hpZ2hsaWdodCcpO1xuXHRcdH1cblx0fSk7XG59XG52YXIgY3RhSWQgPSAncGVyc2lzdGVudC1jdGFzJztcbnZhciBjdGFNYXJrZXJJZCA9ICdwZXJzaXN0ZW50LWN0YXMtbWFya2VyJztcblxuLy8gRmFkZSBpbiBDVEEgYWZ0ZXIgdXNlciBzdG9wcyBzY3JvbGxpbmcgZm9yIDI1MCBtaWxsaXNlY29uZHNcbmZ1bmN0aW9uIHNob3dQZXJzaXN0ZW50Q1RBcygpe1xuICAgIGNsZWFyVGltZW91dCgkLmRhdGEodGhpcywgJ3Njcm9sbFRpbWVyJykpO1xuICAgICQuZGF0YSh0aGlzLCAnc2Nyb2xsVGltZXInLCBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcjJyArIGN0YUlkKS5zbGlkZURvd24oJycpO1xuXHRcdHJlbW92ZUV2ZW50KHdpbmRvdywgXCJzY3JvbGxcIiwgc2hvd1BlcnNpc3RlbnRDVEFzKTtcbiAgICB9LCAyNTApKTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVBlcnNpc3RlbnRDVEFzKCl7XG5cdHZhciBmb290ZXJTZWxlY3RvciA9ICdnbG9iYWwtZm9vdGVyJztcblx0dmFyIHBlcnNpc3RlbnRDdGFIZWlnaHQgPSBnZXRFbGVtZW50SGVpZ2h0KGN0YUlkKTtcblx0dmFyIGZvb3RlckhlaWdodCA9IGdldEVsZW1lbnRIZWlnaHQoZm9vdGVyU2VsZWN0b3IpO1xuXHR2YXIgaGVpZ2h0QWJvdmVGb290ZXIgPSAkKCcjJytmb290ZXJTZWxlY3Rvcikub2Zmc2V0KCkudG9wIC0gcGVyc2lzdGVudEN0YUhlaWdodDtcbn1cbmZ1bmN0aW9uIHJlZnJlc2hQZXJzaXN0ZW50Q1RBcygpe1xuXG5cdGlmICgkKCcjJyArIGN0YUlkKS5sZW5ndGgpIHtcblxuXHRcdHZhciBzY3JvbGxIZWlnaHQgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgICsgJCh3aW5kb3cpLmhlaWdodCgpO1xuXHRcdHZhciBjdGFIZWlnaHQgPSBnZXRFbGVtZW50SGVpZ2h0KGN0YUlkKTtcblxuXHRcdC8qIFBvc2l0aW9uaW5nICovXG5cblx0XHR2YXIgY3RhRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjdGFJZCk7XG5cdFx0dmFyIGN0YU1hcmtlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGN0YU1hcmtlcklkKTtcblx0XHQvLyBJZiBzY3JvbGxIZWlnaHQgaXMgaGlnaGVyIHRoYW4gcGVyc2lzdGVudCBDVEEgbWFya2VyLCB1c2UgYSBmaXhlZCBwb3NpdGlvblxuXHRcdGlmKHNjcm9sbEhlaWdodCA8PSBnZXRFbGVtZW50T2Zmc2V0VG9wKGN0YUlkICsgJy1tYXJrZXInKSl7XG5cdFx0XHRjdGFFbC5jbGFzc0xpc3QuYWRkKCdmaXhlZCcpO1xuXHRcdFx0Y3RhTWFya2VyLnN0eWxlLmhlaWdodCA9IGN0YUhlaWdodCArICdweCc7XG5cdCAgICB9XG5cdCAgICBlbHNle1xuXHQgICAgXHQvLyBJZiBub3QgbG93ZXIgdGhhbiBwYWdlIG5hdlxuXHQgICAgXHRjdGFFbC5jbGFzc0xpc3QucmVtb3ZlKCdmaXhlZCcpO1xuXHQgICAgXHRjdGFNYXJrZXIuc3R5bGUuaGVpZ2h0ID0gJzBweCc7XG5cdCAgICB9XG5cdH1cbn1cblxudmFyICRhcnRpY2xlTmF2ID0gJCgnLnNlY3Rpb24tbmF2Jyk7XG52YXIgJGFydGljbGVOYXZDb250YWluZXIgPSAkYXJ0aWNsZU5hdi5jaGlsZHJlbigpLmZpcnN0KCk7XG5cbmZ1bmN0aW9uIHJlc2l6ZVNlY3Rpb25OYXYoKXtcbiAgaWYgKCQod2luZG93KS53aWR0aCgpID49IDgwMCkge1xuXHQgICAkYXJ0aWNsZU5hdkNvbnRhaW5lci5jc3MoJ3dpZHRoJywgJzEwMCUnKTtcbiAgfVxufVxuZnVuY3Rpb24gcG9zaXRpb25TZWN0aW9uTmF2KCl7XG5cdHZhciBuYXZQb3NpdGlvbiA9ICRhcnRpY2xlTmF2Lm9mZnNldCgpO1xuXHR2YXIgd2luZG93Qm90dG9tID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpXG5cdHZhciBuYXZQb3NpdGlvbkJvdHRvbSA9IG5hdlBvc2l0aW9uLnRvcCArICRhcnRpY2xlTmF2LmhlaWdodCgpO1xuXG5cdGlmKCgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPiBuYXZQb3NpdGlvbi50b3ApICYmICh3aW5kb3dCb3R0b20gPCBuYXZQb3NpdGlvbkJvdHRvbSkpe1xuXHRcdCRhcnRpY2xlTmF2Q29udGFpbmVyLmFkZENsYXNzKCdmaXhlZCcpLnJlbW92ZUNsYXNzKCdmaXhlZFRvQm90dG9tJyk7XG5cdH1cblx0ZWxzZSBpZiAod2luZG93Qm90dG9tID49IG5hdlBvc2l0aW9uQm90dG9tKXtcblx0XHQkYXJ0aWNsZU5hdkNvbnRhaW5lci5hZGRDbGFzcygnZml4ZWRUb0JvdHRvbScpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdFx0JGFydGljbGVOYXZDb250YWluZXIucmVtb3ZlQ2xhc3MoJ2ZpeGVkIGZpeGVkVG9Cb3R0b20nKTtcblx0fVxufVxuXG5cbi8vIGRvY3VtZW50IHJlYWR5XG4kKGZ1bmN0aW9uKCl7XG5cblx0aW5pdGlhbGl6ZVBhZ2VUZW1wbGF0ZSgpO1xuXG5cdGlmICh3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY3RhSWQpICE9PSBudWxsKXtcblx0XHRpbml0aWFsaXplUGVyc2lzdGVudENUQXMoKTtcblx0XHRhZGRFdmVudCh3aW5kb3csIFwic2Nyb2xsXCIsIHJlZnJlc2hQZXJzaXN0ZW50Q1RBcyk7XG5cdH1cblxuXHRyZW5kZXJDb2x1bW5zKCk7XG5cdGZvcm1hdENvbHVtbnMoKTtcblxuXHRzZXRFcXVhbEhlaWdodHMoKTtcblxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuXHRcdHNldEVxdWFsSGVpZ2h0cygpO1xuXHR9KTtcblxuICBkaXNwbGF5UXVlcnlTdHJpbmdNZXNzYWdlcygpO1xuXG5cdC8qIEVtYmVkIGEgc2VjdGlvbiBpbnRvIHRoZSBwcmV2aW91cyBzZWN0aW9uIGlmIGZsYWdnZWQuICovXG5cdHZhciAkc2VjdGlvbnNUb0Fic29yYiA9ICQoJ3NlY3Rpb24ubW92ZS1pbnRvLWxhc3Qtc2VjdGlvbicpO1xuXHRpZigkc2VjdGlvbnNUb0Fic29yYi5sZW5ndGgpe1xuXG5cdFx0LyogTG9vcCB0aHJvdWdoIG1hdGNoaW5nIGVsZW1lbnRzLiAqL1xuXHRcdCRzZWN0aW9uc1RvQWJzb3JiLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkcHJldmlvdXNTZWN0aW9uID0gJCh0aGlzKS5wcmV2KCk7XG5cdFx0XHQkKHRoaXMpLmFwcGVuZFRvKCRwcmV2aW91c1NlY3Rpb24pO1xuXHRcdH0pO1xuXHR9XG5cblx0LyogQXNzaWduIGEgc2VsZWN0b3IgdG8gZXZlcnkgb3RoZXIgc2VjdGlvbi4gKi9cblx0JCgnc2VjdGlvbjpub3QoLmJhbm5lciknKS5maWx0ZXIoJzpvZGQnKS5hZGRDbGFzcygnYWx0LXNlY3Rpb24nKTtcblxuXHQkKCcuc3RhdGljLWhlaWdodCcpLmVhY2goZnVuY3Rpb24oIGluZGV4ICkge1xuXHRcdCQodGhpcykuY3NzKCdoZWlnaHQnLCQodGhpcykuY3NzKCdoZWlnaHQnKSk7XG5cdH0pO1xuXG5cdC8qIEFkZCBsaW5lIG51bWJlcnMgdG8gUHJpc20gY29kZSBoaWdobGlnaHRpbmcgKi9cblx0JCgncHJlIGNvZGUnKS5wYXJlbnQoJ1tjbGFzcyo9XCJsYW5ndWFnZS1cIl0nKS5hZGRDbGFzcygnbGluZS1udW1iZXJzJyk7XG5cblx0LyogdXNpbmcgZmFkZSBpbnN0ZWFkIG9mIHNsaWRlIGFuaW1hdGlvbiBkdWUgdG8gRmlyZWZveCAzZC10cmFuc2Zvcm0gYnVnICovXG5cdCQoJy53aXJlLWNhcm91c2VsJykuc2xpY2soe1xuXHRcdGRvdHM6IHRydWUsXG5cdFx0aW5maW5pdGU6IHRydWUsXG5cdFx0c3BlZWQ6IDMwMCxcblx0XHRzbGlkZXNUb1Nob3c6IDEsXG5cdFx0ZHJhZ2dhYmxlOmZhbHNlLFxuXHRcdGZhZGU6IHRydWUsXG5cdFx0c3dpcGU6ZmFsc2UsXG5cdFx0dG91Y2hNb3ZlOmZhbHNlLFxuXHRcdGFkYXB0aXZlSGVpZ2h0OiB0cnVlLFxuXHRcdG9uSW5pdDpmdW5jdGlvbigpeyQoJy5zbGljay1jbG9uZWQnKS5hdHRyKCd0YWJpbmRleCcsJy0xJyk7fVxuXHR9KTtcblxuXHQvKiB1c2luZyBmYWRlIGluc3RlYWQgb2Ygc2xpZGUgYW5pbWF0aW9uIGR1ZSB0byBGaXJlZm94IDNkLXRyYW5zZm9ybSBidWcgKi9cblx0JCgnZGl2LnNlY3Rpb24gLmNhcm91c2VsJykuc2xpY2soe1xuXHRcdGRvdHM6IHRydWUsXG5cdFx0aW5maW5pdGU6IHRydWUsXG5cdFx0c3BlZWQ6IDMwMCxcblx0XHRzbGlkZXNUb1Nob3c6IDEsXG5cdFx0ZHJhZ2dhYmxlOnRydWUsXG5cdFx0ZmFkZTogdHJ1ZSxcblx0XHRzd2lwZTp0cnVlLFxuXHRcdHRvdWNoTW92ZTp0cnVlLFxuXHRcdG9uSW5pdDpmdW5jdGlvbigpeyQoJy5zbGljay1jbG9uZWQnKS5hdHRyKCd0YWJpbmRleCcsJy0xJyk7fVxuXHR9KTtcblxuICBpZigkKCdzZWN0aW9uI2hwLWJhbm5lciAuY2Fyb3VzZWwgLmNhcm91c2VsX3NsaWRlJykubGVuZ3RoID4gMSl7XG5cbiAgICB2YXIgaG9tZXBhZ2VDYXJvdXNlbERpc3BsYXlMZW5ndGggPSA4MDAwO1xuXG4gICAgLy8gQWZ0ZXIgc2xpZGUgY2hhbmdlXG4gICAgJCgnc2VjdGlvbiNocC1iYW5uZXIgLmNhcm91c2VsJykub24oJ2luaXQnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcbiAgICAgICQoJy5zbGljay1jbG9uZWQnKS5hdHRyKCd0YWJpbmRleCcsJy0xJyk7XG4gICAgICAkKCdzZWN0aW9uI2hwLWJhbm5lciAuY2Fyb3VzZWxfbG9hZC1iYXJfbWV0ZXInKS5zdG9wKHRydWUsIHRydWUpLmFuaW1hdGUoe1xuICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgfSxcbiAgICAgICAgaG9tZXBhZ2VDYXJvdXNlbERpc3BsYXlMZW5ndGgsXG4gICAgICAgIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJCgnc2VjdGlvbiNocC1iYW5uZXIgLmNhcm91c2VsX2xvYWQtYmFyX21ldGVyJykuY3NzKCd3aWR0aCcsJzBweCcpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgLyogdXNpbmcgZmFkZSBpbnN0ZWFkIG9mIHNsaWRlIGFuaW1hdGlvbiBkdWUgdG8gRmlyZWZveCAzZC10cmFuc2Zvcm0gYnVnICovXG4gIFx0JCgnc2VjdGlvbiNocC1iYW5uZXIgLmNhcm91c2VsJykuc2xpY2soe1xuICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgIC8vYXV0b3BsYXk6IHRydWUsXG4gICAgICBhdXRvcGxheVNwZWVkOiBob21lcGFnZUNhcm91c2VsRGlzcGxheUxlbmd0aCxcbiAgXHRcdGRvdHM6IHRydWUsXG4gIFx0XHRpbmZpbml0ZTogdHJ1ZSxcbiAgXHRcdHNwZWVkOiAzMDAsXG4gIFx0XHRzbGlkZXNUb1Nob3c6IDEsXG4gIFx0XHRkcmFnZ2FibGU6dHJ1ZSxcbiAgXHRcdGZhZGU6IHRydWUsXG4gIFx0XHRzd2lwZTogdHJ1ZSxcbiAgXHRcdHRvdWNoTW92ZTogdHJ1ZVxuICBcdH0pO1xuICAgIC8vIEFmdGVyIHNsaWRlIGNoYW5nZVxuICAgICQoJ3NlY3Rpb24jaHAtYmFubmVyIC5jYXJvdXNlbCcpLm9uKCdhZnRlckNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUpe1xuICAgICAgJCgnc2VjdGlvbiNocC1iYW5uZXIgLmNhcm91c2VsJykuc2xpY2soJ3NsaWNrUGxheScpO1xuICAgICAgJCgnc2VjdGlvbiNocC1iYW5uZXIgLmNhcm91c2VsX2xvYWQtYmFyX21ldGVyJykuc3RvcCh0cnVlLCB0cnVlKS5hbmltYXRlKHtcbiAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGhvbWVwYWdlQ2Fyb3VzZWxEaXNwbGF5TGVuZ3RoLFxuICAgICAgICBmdW5jdGlvbigpe1xuICAgICAgICAgICQoJ3NlY3Rpb24jaHAtYmFubmVyIC5jYXJvdXNlbF9sb2FkLWJhcl9tZXRlcicpLmNzcygnd2lkdGgnLCcwcHgnKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KTtcblxuICB9XG5cblx0aW5pdGlhbGl6ZUZpbHRlcnMoKTtcblxuXHRpZiAoJCgnI2ZlYXR1cmVzLXNlY3Rpb24gaDIgYScpLmxlbmd0aCkge1xuXHRcdGluaXRpYWxpemVMZWFybk1vcmVMaW5rcygpO1xuXHR9XG5cblx0aWYgKGdldFVybFBhcmFtZXRlcigncHJldmlldy1jb250ZW50JykgIT0gbnVsbCkge1xuXHRcdGNvbnNvbGUubG9nKCdQcmV2aWV3IGNvbnRlbnQgbW9kZSBvbi4gQ29udGVudCBoaWRkZW4gZnJvbSB0aGUgcmVzdCBvZiB0aGUgd29ybGQgd2lsbCBiZSBzaG93bi4nKTtcblx0XHRcdCQoJy5wcmV2aWV3LWNvbnRlbnQnKS5yZW1vdmVDbGFzcygncHJldmlldy1jb250ZW50Jyk7XG5cdH1cblxuXHRpZiAod2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUocGFnZU5hdklkKSAhPT0gbnVsbCl7XG5cdFx0aW5pdGlhbGl6ZVBhZ2VOYXYoKTtcblx0XHRhZGRFdmVudCh3aW5kb3csIFwic2Nyb2xsXCIsIHJlZnJlc2hQYWdlTmF2KTtcblx0fVxuICAvKiBTZWxlY3QgYmFubmVycyB0aGF0IHNob3VsZCBoYXZlIGp1bXAgbGlua3MuICovXG4gIGlmKCRqdW1wTmF2QmFubmVycy5sZW5ndGgpe1xuXHRcdGluaXRpYWxpemVKdW1wTmF2KCk7XG5cdFx0YWRkRXZlbnQod2luZG93LCBcInNjcm9sbFwiLCByZWZyZXNoSnVtcE5hdik7XG5cdH1cblxuXHQvKiBIYW5kbGUgcGVyc2lzdGVudCBDVEEgZGlzcGxheSBvbiBpbml0aWFsIHNjcm9sbCAqL1xuXHRpZiAoJCgnI3BlcnNpc3RlbnQtY3RhcycpLmxlbmd0aCl7XG5cdFx0YWRkRXZlbnQod2luZG93LCBcInNjcm9sbFwiLCBzaG93UGVyc2lzdGVudENUQXMpO1xuXHR9XG5cbn0pOyAvLyBlbmQgb25sb2FkXG5cblxuJCh3aW5kb3cpLmxvYWQoZnVuY3Rpb24oKSB7XG5cblx0LyogSGFuZGxlIGFydGljbGUgbmF2aWdhdGlvbiByZXNpemluZyBvciBzY3JvbGwgKi9cblx0aWYgKCRhcnRpY2xlTmF2Lmxlbmd0aCl7XG5cblx0XHRyZXNpemVTZWN0aW9uTmF2KCk7XG5cdFx0YWRkRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCByZXNpemVTZWN0aW9uTmF2KTtcblxuXHRcdC8vcG9zaXRpb25TZWN0aW9uTmF2KCk7XG5cdFx0Ly9hZGRFdmVudCh3aW5kb3csIFwicmVzaXplXCIsIHBvc2l0aW9uU2VjdGlvbk5hdik7XG5cdFx0Ly9hZGRFdmVudCh3aW5kb3csIFwic2Nyb2xsXCIsIHBvc2l0aW9uU2VjdGlvbk5hdik7XG5cdH1cblxuXHQvLyBTY3JvbGwgbG9jYWxseSB0byBhbmNob3JzLiBMaW5rcyB3aXRoIFwiaW5zdHJ1Y3Rpb25zXCIgYW5kIFwiZG9ud2xvYWRcIiBjbGFzc2VzIGFyZSBub3QgYmVpbmcgdXNlZCBhcyBzY3JvbGxhYmxlIGFuY2hvcnMuXG5cdCQoXCJhW2hyZWZePSNdXCIpLm5vdCgnLmluc3RydWN0aW9ucywgLmRvd25sb2FkJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdHZhciBkZXN0ID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG5cdFx0aWYoZGVzdCAhPSBcIiNcIil7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgb2Zmc2V0SGVpZ2h0ID0gLTIgLypzZWN0aW9uIGJvcmRlciBoZWlnaHQqLyArIC8qZ2V0RWxlbWVudFJlc3BvbnNpdmVIZWlnaHQoJ2dsb2JhbC1oZWFkZXInKSArKi8gZ2V0RWxlbWVudEhlaWdodCgncGFnZS1uYXYnKSArIGdldEVsZW1lbnRIZWlnaHQoJ2p1bXAtbmF2Jyk7XG5cblx0XHRcdC8qXG5cdFx0XHQgKiBJZiB0aGUgcGFnZS1uYXYgaXNuJ3QgZml4ZWQgd2hlbiB0aGUgYW5jaG9yIGlzIGNsaWNrZWQsIGRvdWJsZSB0aGUgb2Zmc2V0LlxuXHRcdFx0ICogVGhpcyBhY2NvdW50cyBmb3IgdGhlIGxvc3QgaGVpZ2h0IGNhdXNlZCB3aGVuIHRoZSBwYWdlLW5hdiBpcyB0YWtlbiBvdXQgb2YgdGhlIG5vcm1hbCBwYWdlIGZsb3cuXG5cdFx0XHQgKi9cblx0XHRcdCQoJ2h0bWwsYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQoZGVzdCkub2Zmc2V0KCkudG9wIC0gb2Zmc2V0SGVpZ2h0IH0sIDEwMDApO1xuXHRcdFx0JChkZXN0KS5mb2N1cygpO1xuXHRcdH1cblx0fSk7XG5cblxuXHQoZnVuY3Rpb24gcG9zaXRpb25IYXNoKCl7XG5cdFx0aWYod2luZG93LmxvY2F0aW9uLmhhc2ggIT09ICcnKXtcblx0XHRcdHZhciBzZWxlY3RvcklkID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSk7XG5cdFx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxlY3RvcklkKSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdVUkwgaGFzaCBkZXRlY3RlZDogJyArIHNlbGVjdG9ySWQgKyAnLiBNYXRjaGluZyBlbGVtZW50IGZvdW5kLicpO1xuXHRcdFx0XHRzY3JvbGxQb3NpdGlvbiA9ICQoJyMnK3NlbGVjdG9ySWQpLm9mZnNldCgpLnRvcCAtIGdldEVsZW1lbnRSZXNwb25zaXZlSGVpZ2h0KCdnbG9iYWwtaGVhZGVyJykgLSBnZXRFbGVtZW50UmVzcG9uc2l2ZUhlaWdodCgncGFnZS1uYXYnKSAtIGdldEVsZW1lbnRSZXNwb25zaXZlSGVpZ2h0KCdqdW1wLW5hdicpO1xuXHRcdFx0XHQkKFwiaHRtbCxib2R5XCIpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IHNjcm9sbFBvc2l0aW9uIH0sIFwiZmFzdFwiKTtcblx0XHRcdC8vXHRhbGVydCgkKCcjJytzZWxlY3RvcklkKS5vZmZzZXQoKS50b3AgLSBnZXRFbGVtZW50UmVzcG9uc2l2ZUhlaWdodCgnZ2xvYmFsLWhlYWRlcicpIC0gZ2V0RWxlbWVudFJlc3BvbnNpdmVIZWlnaHQoJ3BhZ2UtbmF2JykpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSgpKTtcblxuXG5cdC8qIERvd25sb2FkIHBhZ2UgLSBIaWRlIFNob3cgYWxsIHBsYXRmb3JtcyBsaW5rIG9mIHByb2R1Y3QgZG9lcyBub3QgZGV0ZWN0IE9TICovXG5cblx0aWYod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9ub3NxbC1kYXRhYmFzZXMvZG93bmxvYWRzJykgPiAtMSl7XG5cdFx0JCgnLnByb2R1Y3RbZGF0YS1vcy1kZXRlY3Rpb249XCJmYWxzZVwiXSAudmVyc2lvbicpLmVhY2goZnVuY3Rpb24oIGluZGV4ICkge1xuXHRcdFx0JCh0aGlzKS5maW5kKCcuc2hvdy1hbGwtcGxhdGZvcm1zJykucmVtb3ZlKCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKiBNYXJrZXRvIERvd25sb2FkIEZvcm0gTW9kYWwgLSBjbG9zZSBpdCBvbiBlc2Mga2V5cHJlc3MgKi9cblx0JChkb2N1bWVudCkua2V5dXAoZnVuY3Rpb24oZSkge1xuXHRcdC8vIGVzY2FwZSBrZXkgbWFwcyB0byBrZXljb2RlIGAyN2Bcblx0XHRpZiAoZS5rZXlDb2RlID09IDI3KSB7XG5cdFx0XHQvLyBIaWRlIGZvcm0gYW5kIHNoYWRvd2JveFxuXHRcdFx0aWYgKCQoJyNzaGFkb3dib3gnKS5sZW5ndGggJiYgJCgnI3NoYWRvd2JveCcpLmlzKCc6dmlzaWJsZScpKXtcblx0XHRcdFx0JCgnI3NoYWRvd2JveCcpLmZhZGVPdXQoKTtcblx0XHRcdH1cbiAgICBcdH1cbiAgXHR9KTtcblxufSk7XG5cblxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTEVBUk4gQU5EIFNVUFBPUlRcbiAqL1xuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogR3VpZGVzIGFuZCBSZWZlcmVuY2VzIHBhZ2Utc3BlY2lmaWMganVtcCBsaW5rc1xuICovXG5cbmZ1bmN0aW9uIGluaXRpYWxpemVEb2NMaXN0SnVtcE5hdigpe1xuXG5cdC8qIEdldCBhbGwgc2VjdGlvbnMgdGhhdCBzaG91bGQgaGF2ZSBqdW1wIGxpbmtzLiAqL1xuXHR2YXIgJGp1bXBMaW5rU2VjdGlvbnMgPSAkKCdzZWN0aW9uLmRvY3VtZW50cycpO1xuXG5cdGlmKCRqdW1wTGlua1NlY3Rpb25zLmxlbmd0aCl7XG5cdFx0LyogTG9vcCB0aHJvdWdoIHNlY3Rpb25zLiAqL1xuXHRcdCRqdW1wTGlua1NlY3Rpb25zLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkanVtcE5hdiA9ICQodGhpcykuZmluZCgndWwuYW5jaG9ycycpO1xuXHRcdFx0dmFyICRqdW1wSGVhZGVycyA9ICQodGhpcykuZmluZCgnaDMnKTtcblxuXHRcdFx0JGp1bXBIZWFkZXJzLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyICRoZWFkZXIgPSAkKHRoaXMpLmZpbmQoJ2EnKTtcblx0XHRcdFx0dmFyIGhlYWRlclRleHQgPSAkaGVhZGVyLnRleHQoKTtcblx0XHRcdFx0dmFyIGhlYWRlcklkID0gaGVhZGVyVGV4dC50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywnLScpLnJlcGxhY2UoL1snL1wiIS4sPyYjQF4oKV0vZywnJyk7XG5cdFx0XHRcdCRoZWFkZXIuYXR0cignaWQnLCBoZWFkZXJJZCArICctYW5jaG9yJyk7XG5cblx0XHRcdFx0LyogQXBwZW5kIGxpbmtzIHRvIGp1bXAgbmF2XHQqL1xuXHRcdFx0XHQkanVtcE5hdi5hcHBlbmQoJzxsaT48YSBpZD1cIicraGVhZGVySWQrJy1saW5rXCIgaHJlZj1cIiMnK2hlYWRlcklkKyctYW5jaG9yXCIgY2xhc3M9XCJhbmNob3JcIj4nK2hlYWRlclRleHQrJzwvYT48L2xpPicpO1xuXHRcdFx0fSk7XG5cblx0XHR9KTtcblx0fVxufVxuXG4kKGZ1bmN0aW9uKCl7XG5cblxuXHQvL3NldENvb2tpZSgnVEVTVENPT0tJRScsICdhc2RmJyk7XG5cblx0Lyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0ICogSW5nZXN0ZWQgYXJ0aWNsZSB0YWJiZWQgY29udGVudFxuXHQgKi9cblxuXHQvKiBBZGQgYW5kIHJlbW92ZSBjbGFzc2VzIGZvciB2aXN1YWwgZm9ybWF0dGluZy4gKi9cblxuXHQkKCdwcmUgY29kZScpLnJlbW92ZUNsYXNzKCdwcmUgY29kZWJsb2NrJykucGFyZW50KCkuYWRkQ2xhc3MoJ3ByZSBjb2RlYmxvY2snKTtcblx0JCgnLnN0cmlwZS1kaXNwbGF5IHByZTpub3QoW2NsYXNzKj1cImxhbmd1YWdlLVwiXSknKS5hZGRDbGFzcygnbGFuZ3VhZ2UtcHJlJyk7XG5cdCQoJy5zdHJpcGUtZGlzcGxheSBwcmU6bm90KFtjbGFzcyo9XCJsYW5ndWFnZS1cIl0pIGNvZGUnKS5hZGRDbGFzcygnbGFuZ3VhZ2UtcHJlJyk7XG5cblx0LyogQWRkIGNsYXNzZXMgZm9yIHZpc3VhbCBmb3JtYXR0aW5nLiAqL1xuXHR2YXIgY29kZUxhbmd1YWdlID0gZ2V0Q29va2llKCdjb2RlTGFuZ3VhZ2UnKTtcblx0c2V0TGFuZ3VhZ2UoY29kZUxhbmd1YWdlKTtcblxuXHQvKiBHdWlkZXMgYW5kIFJlZmVyZW5jZXMgcGFnZS1zcGVjaWZpYyBqdW1wIGxpbmtzICovXG5cdGluaXRpYWxpemVEb2NMaXN0SnVtcE5hdigpO1xuXG59KTtcblxuLypcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBTaG93L2hpZGUgdGFicyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gc2V0TGFuZ3VhZ2UoY29kZUxhbmd1YWdlKSB7XG5cdHZhciBsYW5nLCBjb29rO1xuXHRpZiAoY29kZUxhbmd1YWdlICE9PSAnJykge1xuXG5cdFx0LyogU2V0IGxhbmd1YWdlIGNvb2tpZS4gKi9cblx0XHRzZXRDb29raWUoJ2NvZGVMYW5ndWFnZScsIGNvZGVMYW5ndWFnZSk7XG5cblx0XHQvKiBUYWIgZGlzcGxheSAqL1xuXHRcdCQoJy5zdHJpcGUtYWN0aXZlLicgKyBjb2RlTGFuZ3VhZ2UpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdCQoJy5zdHJpcGUtYWN0aXZlOm5vdCguJyArIGNvZGVMYW5ndWFnZSArICcpJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cblx0XHQvKiBDb250ZW50IGRpc3BsYXkgKi9cblx0XHQkKCcuc3RyaXBlLWRpc3BsYXkuJyArIGNvZGVMYW5ndWFnZSkuc2hvdygpO1xuXHRcdCQoJy5zdHJpcGUtZGlzcGxheTpub3QoLicgKyBjb2RlTGFuZ3VhZ2UgKyAnKScpLmhpZGUoKTtcblxuXHR9IGVsc2Uge1xuXG5cdFx0LyoqXG5cdFx0ICogQCBUaGlzIHdpbGwgc2V0IGNvb2tpZSBhcyBkZWZhdWx0XG5cdFx0ICovXG5cdFx0bGFuZyA9ICQoJy50YWItYmFyIGE6Zmlyc3QtY2hpbGQnKS5lcSgwKS50ZXh0KCk7XG5cdFx0Y29vayA9IGxhbmcudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bXmEtejAtOS1cXHNdL2dpLCAnJyk7XG5cdFx0c2V0Q29va2llKCdjb2RlTGFuZ3VhZ2UnLCBjb29rKTtcblx0XHR0YWJEaXNwbGF5KGNvb2spO1xuXHR9XG5cdC8qKlxuXHQgKiBAIFRha2VzIHBhcmFtIG9mIFN0cmluZyB3aGljaCBpcyBhZGRlZCBhcyB0aGUgdGFyZ2V0IGVsZW1lbnQncyBjbGFzc25hbWUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0YWJEaXNwbGF5KGNvZGVMYW5ndWFnZSkge1xuXHRcdC8qIFRhYiBkaXNwbGF5ICovXG5cdFx0aWYoJCgnLnN0cmlwZS1hY3RpdmUnKS5sZW5ndGgpIHtcblx0XHRcdCQoJy5zdHJpcGUtYWN0aXZlLicgKyBjb2RlTGFuZ3VhZ2UpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0JCgnLnN0cmlwZS1hY3RpdmU6bm90KC4nICsgY29kZUxhbmd1YWdlICsgJyknKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblxuXHRcdFx0LyogQ29udGVudCBkaXNwbGF5ICovXG5cdFx0XHQkKCcuc3RyaXBlLWRpc3BsYXkuJyArIGNvZGVMYW5ndWFnZSkuc2hvdygpO1xuXHRcdFx0JCgnLnN0cmlwZS1kaXNwbGF5Om5vdCguJyArIGNvZGVMYW5ndWFnZSArICcpJykuaGlkZSgpO1xuXHRcdH1cblx0fVxufVxuXG5cblxuXG5pZiAoZG9jdW1lbnQubG9jYXRpb24uaG9zdG5hbWUuaW5kZXhPZignY291Y2hiYXNlJykgPiAtMSkge1xuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQgKiBGbGFzaHRhbGtpbmcgQ291Y2hiYXNlIG9uZVRhZy5cblx0ICogT25lIFRhZyBDb25kaXRpb25hbCBDb250YWluZXI6IENvdWNoYmFzZSAoNjc5MikgfCBDb3VjaGJhc2Ugb25lVGFnICg1MDQ1KVxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0dmFyIGZ0X29uZXRhZ181MDQ1ID0ge1xuXHRcdGZ0X3ZhcnM6e1xuXHRcdFx0XCJmdFhSZWZcIjpcIlwiLFxuXHRcdFx0XCJmdFhWYWx1ZVwiOlwiXCIsXG5cdFx0XHRcImZ0WFR5cGVcIjpcIlwiLFxuXHRcdFx0XCJmdFhOYW1lXCI6XCJcIixcblx0XHRcdFwiZnRYTnVtSXRlbXNcIjpcIlwiLFxuXHRcdFx0XCJmdFhDdXJyZW5jeVwiOlwiXCIsXG5cdFx0XHRcIlUxXCI6XCJcIixcblx0XHRcdFwiVTJcIjpcIlwiLFxuXHRcdFx0XCJVM1wiOlwiXCIsXG5cdFx0XHRcIlU0XCI6XCJcIixcblx0XHRcdFwiVTVcIjpcIlwiLFxuXHRcdFx0XCJVNlwiOlwiXCIsXG5cdFx0XHRcIlU3XCI6XCJcIixcblx0XHRcdFwiVThcIjpcIlwiLFxuXHRcdFx0XCJVOVwiOlwiXCIsXG5cdFx0XHRcIlUxMFwiOlwiXCIsXG5cdFx0XHRcIlUxMVwiOlwiXCIsXG5cdFx0XHRcIlUxMlwiOlwiXCIsXG5cdFx0XHRcIlUxM1wiOlwiXCIsXG5cdFx0XHRcIlUxNFwiOlwiXCIsXG5cdFx0XHRcIlUxNVwiOlwiXCIsXG5cdFx0XHRcIlUxNlwiOlwiXCIsXG5cdFx0XHRcIlUxN1wiOlwiXCIsXG5cdFx0XHRcIlUxOFwiOlwiXCIsXG5cdFx0XHRcIlUxOVwiOlwiXCIsXG5cdFx0XHRcIlUyMFwiOlwiXCJcblx0XHRcdH0sXG5cdFx0b3RfZG9tOmRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sKycvL3NlcnZlZGJ5LmZsYXNodGFsa2luZy5jb20nLFxuXHRcdG90X3BhdGg6Jy9jb250YWluZXIvNjc5Mjs0NDQxMDs1MDQ1O2lmcmFtZS8/Jyxcblx0XHRvdF9ocmVmOidmdF9yZWZlcnJlcj0nK2VzY2FwZShkb2N1bWVudC5sb2NhdGlvbi5ocmVmKSxcblx0XHRvdF9yYW5kOk1hdGgucmFuZG9tKCkqMTAwMDAwMCxcblx0XHRvdF9yZWY6ZG9jdW1lbnQucmVmZXJyZXIsXG5cdFx0b3RfaW5pdDpmdW5jdGlvbigpe1xuXHRcdFx0dmFyIG89dGhpcyxxcz0nJyxjb3VudD0wLG5zPScnO1xuXHRcdFx0Zm9yKHZhciBrZXkgaW4gby5mdF92YXJzKXtcblx0XHRcdFx0cXMrPShvLmZ0X3ZhcnNba2V5XT09Jyc/Jyc6a2V5Kyc9JytvLmZ0X3ZhcnNba2V5XSsnJicpO1xuXHRcdFx0fVxuXHRcdFx0Y291bnQ9by5vdF9wYXRoLmxlbmd0aCtxcy5sZW5ndGgrby5vdF9ocmVmK2VzY2FwZShvLm90X3JlZikubGVuZ3RoO1xuXHRcdFx0bnM9by5vdF9ucyhjb3VudC0yMDAwKTtcblx0XHRcdGRvY3VtZW50LndyaXRlKCc8aWZyYW1lIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHZpc2liaWxpdHk6aGlkZGVuOyB3aWR0aDoxcHg7IGhlaWdodDoxcHg7XCIgc3JjPVwiJytvLm90X2RvbStvLm90X3BhdGgrcXMrby5vdF9ocmVmKycmbnM9JytucysnJmNiPScrby5vdF9yYW5kKydcIj48L2lmcmFtZT4nKTtcblx0XHR9LFxuXHRcdG90X25zOmZ1bmN0aW9uKGRpZmYpe1xuXHRcdFx0aWYoZGlmZj4wKXtcblx0XHRcdFx0dmFyIG89dGhpcyxxbz17fSxcblx0XHRcdFx0XHRzcD0vKD86XnwmKShbXiY9XSopPT8oW14mXSopL2csXG5cdFx0XHRcdFx0ZnA9L14oaHR0cFtzXT8pOlxcL1xcLz8oW146XFwvXFxzXSspXFwvKFtcXHdcXC5dK1teIz9cXHNdKykoLiopPy8uZXhlYyhvLm90X3JlZiksXG5cdFx0XHRcdFx0cm89e2g6ZnBbMl0scDpmcFszXSxxczpmcFs0XS5yZXBsYWNlKHNwLGZ1bmN0aW9uKHAxLHAyLHAzKXtpZihwMilxb1twMl09W3AzXX0pfTtcblx0XHRcdFx0cmV0dXJuIGVzY2FwZShyby5oK3JvLnAuc3Vic3RyaW5nKDAsMTApKyhxby5xPyc/cT0nK3VuZXNjYXBlKHFvLnEpOic/cD0nK3VuZXNjYXBlKHFvLnApKSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dmFyIG89dGhpcztcblx0XHRcdFx0cmV0dXJuIGVzY2FwZSh1bmVzY2FwZShvLm90X3JlZikpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdF9vbmV0YWdfNTA0NS5vdF9pbml0KCk7XG5cdCovXG59XG5cblxudmFyIHRleHRQcm9wID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnRleHRDb250ZW50ICE9PSB1bmRlZmluZWQgPyAndGV4dENvbnRlbnQnIDogJ2lubmVyVGV4dCc7XG5cbmZ1bmN0aW9uIGdldFRleHQoIGVsZW0gKSB7XG5cdHJldHVybiBlbGVtWyB0ZXh0UHJvcCBdO1xufVxuXG4vLyBXaGVuIGRvY3VtZW50IGlzIHJlYWR5XG4kKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBjYXJkc2V0U2VsZWN0b3IgPSAnLmNhcmRzZXQuJysgJ2FwcHMnO1xuXHR2YXIgbm9SZXN1bHRzU2VsZWN0b3IgPSBjYXJkc2V0U2VsZWN0b3IgKyAnIC5uby1maWx0ZXJlZC1yZXN1bHRzJztcblxuXHQvLyBmaWx0ZXIgZnVuY3Rpb25zXG5cdHZhciBmaWx0ZXJGbnMgPSB7XG5cdFx0Ly8gc2hvdyBhcyB1c2VyIGVudGVycyB2YWx1ZSBpbnRvIGZpZWxkXG5cdFx0YXV0b2NvbXBsZXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuYW1lID0gJCh0aGlzKS5kYXRhKCdzb3J0LXZhbHVlLTInKTtcblx0XHRcdHZhciBxdWVyeSA9ICQoJ2lucHV0W2RhdGEtZmlsdGVyPVwiYXV0b2NvbXBsZXRlXCJdJykudmFsKCk7XG5cdFx0XHR2YXIgcmVnZXhTdHJpbmcgPSBxdWVyeTtcblx0XHRcdHZhciByZWdleHAgPSBSZWdFeHAocmVnZXhTdHJpbmcsIFwiaVwiICk7XG5cdFx0XHRyZXR1cm4gbmFtZS5tYXRjaCggcmVnZXhwICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIGluaXQgSXNvdG9wZVxuXHQkbWluaWFwcElzbyA9ICQoY2FyZHNldFNlbGVjdG9yICsgJyB1bC5jYXJkcycpLmlzb3RvcGUoe1xuXHRcdC8vIG9wdGlvbnNcblx0XHRpdGVtU2VsZWN0b3I6ICcuY2FyZCcsXG5cdFx0bGF5b3V0TW9kZTogJ2ZpdFJvd3MnLCAvKiBtYXNvbnJ5LCBmaXRSb3dzICovXG5cdFx0Z2V0U29ydERhdGE6IHtcblx0XHRcdGRlZmF1bHRTb3J0MTogJ1tkYXRhLXNvcnQtdmFsdWUtMV0nLCAvLyB2YWx1ZSBvZiBhdHRyaWJ1dGVcblx0XHRcdGRlZmF1bHRTb3J0MjogJ1tkYXRhLXNvcnQtdmFsdWUtMl0nLCAvLyB2YWx1ZSBvZiBhdHRyaWJ1dGVcblx0XHRcdGhlYWRpbmc6IGZ1bmN0aW9uKCBpdGVtRWxlbSApIHsgLy8gZnVuY3Rpb25cblx0XHRcdFx0dmFyIGhlYWRpbmcgPSAkKCBpdGVtRWxlbSApLmZpbmQoJ2gzJykudGV4dCgpO1xuXHRcdFx0XHRyZXR1cm4gcGFyc2VGbG9hdCggaGVhZGluZy5yZXBsYWNlKCAvW1xcKFxcKV0vZywgJycpICk7XG5cdFx0XHRcdH1cblx0XHR9LFxuXHRcdHNvcnRCeSA6IFsnZGVmYXVsdFNvcnQxJywnZGVmYXVsdFNvcnQyJ10sXG5cdFx0c29ydEFzY2VuZGluZzogZmFsc2UsXG5cdFx0ZmlsdGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpc01hdGNoZWQgPSB0cnVlO1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblxuXHRcdFx0Zm9yICggdmFyIHByb3AgaW4gZmlsdGVycyApIHtcblx0XHRcdFx0dmFyIGZpbHRlciA9IGZpbHRlcnNbIHByb3AgXTtcblx0XHRcdFx0Ly8gdXNlIGZ1bmN0aW9uIGlmIGl0IG1hdGNoZXNcblx0XHRcdFx0ZmlsdGVyID0gZmlsdGVyRm5zWyBmaWx0ZXIgXSB8fCBmaWx0ZXI7XG5cdFx0XHRcdC8vIHRlc3QgZWFjaCBmaWx0ZXJcblx0XHRcdFx0aWYgKCBmaWx0ZXIgKSB7XG5cdFx0XHRcdFx0aXNNYXRjaGVkID0gaXNNYXRjaGVkICYmICQodGhpcykuaXMoIGZpbHRlciApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGJyZWFrIGlmIG5vdCBtYXRjaGVkXG5cdFx0XHRcdGlmICggIWlzTWF0Y2hlZCApIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGlzTWF0Y2hlZDtcblx0XHR9XG5cdH0pO1xuXG5cblx0Ly8gc3RvcmUgZmlsdGVyIGZvciBlYWNoIGdyb3VwXG5cdHZhciBmaWx0ZXJzID0ge307XG5cblx0JChjYXJkc2V0U2VsZWN0b3IgKyAnIC5maWx0ZXItYnV0dG9uLWdyb3VwJykub24oICdjbGljayBrZXl1cCcsICcuYnRuJywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHQvLyBnZXQgZ3JvdXAga2V5XG5cdFx0dmFyICRidXR0b25Hcm91cCA9ICR0aGlzLnBhcmVudHMoJy5idXR0b24tZ3JvdXAnKTtcblx0XHR2YXIgZmlsdGVyR3JvdXAgPSAkYnV0dG9uR3JvdXAuYXR0cignZGF0YS1maWx0ZXItZ3JvdXAnKTtcblx0XHQvLyBzZXQgZmlsdGVyIGZvciBncm91cFxuXHRcdGZpbHRlcnNbIGZpbHRlckdyb3VwIF0gPSAkdGhpcy5hdHRyKCdkYXRhLWZpbHRlcicpO1xuXHRcdC8vIGFycmFuZ2UsIGFuZCB1c2UgZmlsdGVyIGZuXG5cdFx0JG1pbmlhcHBJc28uaXNvdG9wZSgnYXJyYW5nZScpO1xuXHRcdC8vIGhpZ2hsaWdodCBidXR0b25cblx0XHQkKHRoaXMpLmFkZENsYXNzKCdzZWxlY3RlZCcpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cblx0XHQvKiBkaXNwbGF5IG1lc3NhZ2UgYm94IGlmIG5vIGZpbHRlcmVkIGl0ZW1zICovXG5cdFx0aWYgKCAhJG1pbmlhcHBJc28uZGF0YSgnaXNvdG9wZScpLmZpbHRlcmVkSXRlbXMubGVuZ3RoICkge1xuXHRcdFx0JChub1Jlc3VsdHNTZWxlY3Rvcikuc2hvdygpO1xuXHRcdH1cblx0XHRlbHNle1xuXHRcdFx0JChub1Jlc3VsdHNTZWxlY3RvcikuaGlkZSgpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gbGF5b3V0IElzb3RvcGUgYWZ0ZXIgZWFjaCBpbWFnZSBsb2Fkc1xuXHQkbWluaWFwcElzby5pbWFnZXNMb2FkZWQoKS5wcm9ncmVzcyggZnVuY3Rpb24oKSB7XG5cdFx0JG1pbmlhcHBJc28uaXNvdG9wZSgnbGF5b3V0Jyk7XG5cdH0pO1xuXG5cdC8qIFRhZ2dpbmcgbWFya3VwIGZvciBHVE0gKi9cblx0JCgnLmhlcm8gYScpLmFkZENsYXNzKCdndG0taGVyby1hJyk7XG5cdCQoJy5ocC10cGwgI2N1c3RvbWVycyBhJykuYWRkQ2xhc3MoJ2d0bS1ocC1jdXN0b21lcnMtYScpO1xuXG5cdC8qRHJvcERvd24gd2l0aCB2ZXJzaW9uIGxpc3QgZm9yIE1vYmlsZSBhbmQgU2VydmVyIGluIERvY3VtZW50YXRpb24gUGFnZSovXG5cdCQoXCIjdmVyc2lvbnNEcm9wRG93blwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihlKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAkKHRoaXMpLnZhbCgpO1xuXHR9KTtcblxuXHQvKkRyb3BEb3duIHdpdGggcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzIGluIFNESyBwYWdlKi9cblx0JChcIiNsYW5ndWFnZURyb3BEb3duXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgc2VsZWN0ZWRPcHRpb24gPSAkKHRoaXMpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIik7XG5cdFx0aWYoIXNlbGVjdGVkT3B0aW9uLmhhc0NsYXNzKFwibm90TGFuZ3VhZ2VMaW5rXCIpKVxuXHRcdHtcblx0XHRcdHNldENvb2tpZSgnbGFuZ0Nvb2tpZScsIHNlbGVjdGVkT3B0aW9uLnRleHQoKSk7XG5cdFx0fVxuXHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJCh0aGlzKS52YWwoKTtcblx0fSk7XG5cbn0pO1xuXG4vLyBBZGQgd3JhcHBlciB0byBNYXJrZXRvIHBvcHVwIGZvciBpbXByb3ZlZCB2ZXJ0aWNhbCBhbGlnbm1lbnRcbiQoJyNkb3dubG9hZF9mb3JtX2NvbnRhaW5lcicpLmNsb3Nlc3QoJyNzaGFkb3dib3gnKS5hZGRDbGFzcygnZG93bmxvYWQnKTtcbiQoJyNzaGFkb3dib3guZG93bmxvYWQnKS53cmFwKCc8ZGl2IGNsYXNzPVwic2hhZG93Ym94LWRvd25sb2FkLXdyYXBwZXJcIj48L2Rpdj4nKTtcblxuXG4vKiBDT0xMQVBTSUJMRSBNRU5VID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4kKGZ1bmN0aW9uKCl7XG5cbiAgdmFyIGhlYWRpbmdDbGFzcyA9ICdzdGF0aWMnO1xuICB2YXIgbGlua0NsYXNzID0gJ2xpbmsnO1xuXG4gIC8qIEFzc2lnbiBjbGFzc2VzIHRvIGxpc3QgaXRlbXMgd2l0aCBjaGlsZHJlbi4gQ3JlYXRlIGxpbmtzIHRvIGV4cGFuZC9jb2xsYXBzZS4gKi9cbiAgJCgnLmFydGljbGUtdHBsIC50b2MgdWwuY29sbGFwc2VkIGxpJykucGFyZW50cygnbGknKS5hZGRDbGFzcygnaGFzQ2hpbGQnKS5wcmVwZW5kKCc8YSBocmVmPVwiI1wiIGNsYXNzPVwiaWNvblwiPiA8L2E+Jyk7XG5cbiAgLyogQXNzaWduIGNsYXNzZXMgdG8gbGlua3MgdGhhdCBhcmUgaGVhZGluZ3MsIG5vdCBsaW5rcyAoaHJlZj1cIiNcIikgKi9cbiAgJCgnLmFydGljbGUtdHBsIC50b2MgdWwuY29sbGFwc2VkIGFbaHJlZj1cIiNcIl06bm90KC5pY29uKScpLmFkZENsYXNzKGhlYWRpbmdDbGFzcyk7XG5cbiAgLyogQXNzaWduIGNsYXNzZXMgdG8gbGlua3MgKGhyZWY9XCIjXCIpICovXG4gICQoJy5hcnRpY2xlLXRwbCAudG9jIHVsLmNvbGxhcHNlZCBhW2hyZWYhPVwiI1wiXTpub3QoLmljb24pJykuYWRkQ2xhc3MobGlua0NsYXNzKTtcblxuICAvKiBSZXZlYWwgYXJ0aWNsZSBuYXZpZ2F0aW9uIHRvIHNlbGVjdGVkIGxpbmsgKi9cbiAgJCgnYXNpZGUubGVmdC1yYWlsIGEuc2VsZWN0ZWQnKS5wYXJlbnRzKCdsaScpLmFkZENsYXNzKCdvcGVuIHBhcmVudC1vZi1zZWxlY3RlZCcpO1xuXG4gIC8qIEhpZGUgY29udGVudCBsZXZlbHMgdGhhdCB3ZXJlIGFzc2lnbmVkIGEgY2xvc2UgY2xhc3MuICovXG4gICQoJy5hcnRpY2xlLXRwbCAudG9jIHVsLmNvbGxhcHNlZCBsaS5oYXNDaGlsZDpub3QoLm9wZW4sIC5wYXJlbnQtb2Ytc2VsZWN0ZWQpID4gdWwnKS5oaWRlKCkuc2libGluZ3MoJy5pY29uJykuYWRkQ2xhc3MoJ2Nsb3NlJyk7XG5cbiAgLyogU2hvdyBvciBoaWRlIGNoaWxkcmVuIG9uIGljb24gY2xpY2suICovXG4gICQoJy5hcnRpY2xlLXRwbCAudG9jIHVsLmNvbGxhcHNlZCcpLm9uKCdjbGljaycsICdhLmljb24nLCBmdW5jdGlvbiggZSApIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdjbG9zZScpLnNpYmxpbmdzKCd1bCcpLnNsaWRlVG9nZ2xlKCk7XG4gIH0pO1xuXG4gIC8qIENoYW5nZSBpY29uIGhvdmVyIHN0YXRlIHdoZW4gaG92ZXJpbmcgb3ZlciBhIGhlYWRpbmcuICovXG4gICQoJy5hcnRpY2xlLXRwbCAudG9jIHVsLmNvbGxhcHNlZCBhLnN0YXRpYycpLmhvdmVyKFxuICAgIGZ1bmN0aW9uKCkge1xuICAgICAgJCh0aGlzKS5wcmV2KCcuaWNvbicpLnRvZ2dsZUNsYXNzKCdvbicpO1xuICAgIH0sXG4gICAgZnVuY3Rpb24oKSB7XG4gICAgICAkKHRoaXMpLnByZXYoJy5pY29uJykudG9nZ2xlQ2xhc3MoJ29uJyk7XG4gICAgfVxuICApO1xuXG4gIC8qIFNob3cgb3IgaGlkZSBjaGlsZHJlbiBvbiBpY29uIGNsaWNrLiAqL1xuICAkKCcuYXJ0aWNsZS10cGwgLnRvYyB1bC5jb2xsYXBzZWQnKS5vbignY2xpY2snLCAnYS5zdGF0aWMnLCBmdW5jdGlvbiggZSApIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZigkKHRoaXMpLmF0dHIoXCJocmVmXCIpID09IFwiI1wiKXtcbiAgICAgIC8vJCh0aGlzKS5wcmV2KCcuaWNvbicpLmNsaWNrKCk7XG4gICAgICAkKHRoaXMpLnByZXYoJy5pY29uJykudG9nZ2xlQ2xhc3MoJ2Nsb3NlJykuc2libGluZ3MoJ3VsJykuc2xpZGVUb2dnbGUoKTtcbiAgICB9XG4gIH0pO1xuXG4gICQoJ2FzaWRlLmxlZnQtcmFpbCAudG9jJykuc2hvdygpO1xufSk7XG5cblxuLyogSElQUE8gQ0hBTk5FTCBNQU5BR0VSID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLy9cbi8vIElmIGNvbXBvbmVudCBwcm9wZXJ0aWVzIGNoYW5nZSB0aHJvdWdoIHRoZSBDaGFubmVsIE1hbmFnZXIgZWRpdG9yLFxuLy8gY2FsbCBvbmxvYWQgZnVuY3Rpb25zLlxuLy9cblxudmFyIGhpcHBvQ21zRmxhZyA9IGZhbHNlO1xudmFyIGxvY2FsRW52aXJvbm1lbnRGbGFnID0gZmFsc2U7XG52YXIgaGlwcG9DbXNSZXNvdXJjZVByZWZpeCA9ICcnO1xuXG4oZnVuY3Rpb24gZGV0ZWN0SGlwcG9DTVMoKXtcblx0Ly8gVG9wIGxldmVsIHdpbmRvd1xuXHRpZih3aW5kb3cudG9wID09IHdpbmRvdy5zZWxmKSB7XG5cdCAgLy9jb25zb2xlLmxvZygnVG9wIGxldmVsLicpO1xuXHR9XG5cdC8vIE5vdCB0b3AgbGV2ZWwuIEFuIGlmcmFtZSwgcG9wdXAgb3Igc29tZXRoaW5nXG5cdGVsc2Uge1xuXHRcdC8vY29uc29sZS5sb2coJ05vdCB0b3AgbGV2ZWwuJyk7XG5cblx0XHRpZih3aW5kb3cucGFyZW50LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdIaXBwby5DaGFubmVsTWFuYWdlci5UZW1wbGF0ZUNvbXBvc2VyLkluc3RhbmNlJykpe1xuXHRcdCAgLy9jb25zb2xlLmxvZygnQ2hhbm5lbCBtYW5hZ2VyIGRldGVjdGVkLicpO1xuXG5cdFx0ICBoaXBwb0Ntc0ZsYWcgPSB0cnVlO1xuXG5cdFx0fVxuXHR9XG59KCkpO1xuXG4oZnVuY3Rpb24gZGV0ZWN0TG9jYWxFbnZpcm9ubWVudCgpe1xuXHRpZihkb2N1bWVudC5kb21haW4uaW5kZXhPZignbG9jYWxob3N0JykgPiAtMSkge1xuXHQgIGxvY2FsRW52aXJvbm1lbnRGbGFnID0gdHJ1ZTtcblx0fVxufSgpKTtcblxuZnVuY3Rpb24gaGlwcG9DbXNDaGFuZ2VJbWFnZVBhdGhzKHByZWZpeCl7XG5cdGlmKHByZWZpeCAhPT0gJycpe1xuXHRcdGNvbnNvbGUubG9nKCdDaGFuZ2luZyBDTVMgaW1hZ2UgcGF0aCByZWZlcmVuY2VzLi4uW2hpcHBvQ21zQ2hhbmdlSW1hZ2VQYXRoc10nKTtcblxuXHRcdC8vIEFkZCBjbXMgcGF0aCB0byBpbWFnZXMgcmVmZXJlbmNpbmcgQ01TIGltYWdlc1xuXHQgIFx0JCgnaW1nW3NyY149XCIvYmluYXJpZXMvY29udGVudC9nYWxsZXJ5XCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0ICB2YXIgY3VyU3JjID0gJCh0aGlzKS5hdHRyKCdzcmMnKTtcblxuXHRcdCAgJCh0aGlzKS5hdHRyKCdzcmMnLHByZWZpeCArIGN1clNyYyk7XG5cdFx0fSk7XG5cdH1cbn1cblxuLyogXCIgLy8gQ29kYSAyIHN1Y2tzIGF0IGNvbG9yLWNvZGluZyBwcm9wZXJseSBhZnRlciBhIHJlZ2V4LiAgQWRkaW5nIHRoZSBcIiBmaXhlcyB0aGUgcHJvYmxlbS4gKi9cblxuLyogQUdFTkRBIFBBR0UgSU5GTyBUT0dHTEUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vL1xuLy8gQ2xpY2tpbmcgJ3Nlc3Npb24nIG5hbWUgZXhwYW5kcyB0byBzaG93IG1vcmUgaW5mb3JtYXRpb25cbi8vXG52YXIgYWdlbmRhVG9nZ2xlID0gZnVuY3Rpb24oKSB7XG4gICAgJCgnLmFnZW5kYV9fZW50cnknKS5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdib2xkJyk7XG4gICAgICAgICQodGhpcykubmV4dCgnZGl2LmFnZW5kYV9fYWRkbC1pbmZvJykudG9nZ2xlKCk7XG4gICAgfSk7XG59O1xuYWdlbmRhVG9nZ2xlKCk7XG5cbnZhciAkZ2xvYmFsQ3VycmVudERheSA9ICcnO1xudmFyIGFnZW5kYUlkVXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgJCgnLmFnZW5kYV9fdGFic19fdW5pcXVlLCAuYWdlbmRhX190YWJsZSAuY29sdW1ucycpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHN0ciA9ICQodGhpcykuYXR0cignaWQnKTtcbiAgICAgICAgaWYoc3RyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXHMrL2csIFwiX1wiKTtcbiAgICAgICAgICAgICQodGhpcykuYXR0cignaWQnLHN0cik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoJy5hZ2VuZGFfX3RhYnNfX3VuaXF1ZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIFJlc2V0XG4gICAgICAgICQoJy5zZXNzaW9uLWdyb3VwJykuY3NzKCdkaXNwbGF5Jywnbm9uZScpO1xuICAgICAgICAkKCcuYWdlbmRhX19ncmFwaHMnKS5hZGRDbGFzcygnaGlkZScpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG4gICAgICAgICQoJy5hZ2VuZGFfX2ZpbHRlcicpLmNzcygnZGlzcGxheScsJ2Jsb2NrJyk7XG4gICAgICAgICQoJy5hZ2VuZGFfX3RhYmxlJykucmVtb3ZlQ2xhc3MoJ2RlZmF1bHQnKTtcbiAgICAgICAgJCgnLmFnZW5kYV9fdGFicyBsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFN3aXRjaCB0byBkZXRhaWwgbGlzdFxuICAgICAgICAkKCcjb3ZlcnZpZXctbGlzdCcpLmNzcygnZGlzcGxheScsJ25vbmUnKTtcbiAgICAgICAgJCgnI2RvY3VtZW50LWxpc3QnKS5jc3MoJ2Rpc3BsYXknLCdibG9jaycpO1xuXG4gICAgICAgIFxuICAgICAgICAvLyBTZXRcbiAgICAgICAgJCh0aGlzKS5wYXJlbnQoJ2xpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB2YXIgdGFiSWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XG4gICAgICAgIHZhciBzdWJUYWJJZEFycmF5ID0gdGFiSWQuc3BsaXQoJ3RhYl8nKTtcbiAgICAgICAgdmFyIGlkU3ViU3RyaW5nID0gc3ViVGFiSWRBcnJheVsxXTtcbiAgICAgICAgY29uc29sZS5sb2coJ2lkU3ViU3RyaW5nIGZyb20gdGFiOiAnICsgaWRTdWJTdHJpbmcpO1xuICAgICAgICAvLyBGaW5kIHRoZSAuY29sdW1ucyBpZCB0aGF0IGNvbnRhaW5zIHRoZSB0YWIgaWRTdWJTdHJpbmcgYW5kIGRpc3BsYXlcblx0XHQkZ2xvYmFsQ3VycmVudERheSA9IGlkU3ViU3RyaW5nO1xuICAgICAgICAkKCcuY29sdW1ucycpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBjb2x1bW5zSWQ7XG4gICAgICAgICAgICBpZigkKHRoaXMpLmF0dHIoJ2lkJykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBcdFx0Y29sdW1uc0lkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xuXG4gICAgICAgIFx0fVxuICAgICAgICAgICAgZWxzZSB7XG5cdFx0XHRcdGNvbHVtbnNJZCA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihjb2x1bW5zSWQuaW5kZXhPZihpZFN1YlN0cmluZykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoJy5zZXNzaW9uLWdyb3VwJykuY3NzKCdkaXNwbGF5JywnYmxvY2snKTtcblxuICAgICAgICAgICAgICAgIC8vIEhpZGUgdGhlIGZpbHRlcnMvdHJhY2tzIGlmIG5lY2Vzc2FyeVxuICAgICAgICAgICAgICAgIGlmKCQodGhpcykucGFyZW50KCcuc2Vzc2lvbi1ncm91cCcpLmhhc0NsYXNzKCdoaWRlLWZpbHRlcnMnKSl7XG4gICAgICAgICAgICAgICAgICAgICQoJy5hZ2VuZGFfX2ZpbHRlcicpLmNzcygnZGlzcGxheScsJ25vbmUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJyN0YWJfb3ZlcnZpZXcnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKCcuYWdlbmRhX19maWx0ZXInKS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG4gICAgICAgICQoJy5hZ2VuZGFfX3RhYmxlJykuYWRkQ2xhc3MoJ2RlZmF1bHQnKTtcbiAgICAgICAgJCgnLnNlc3Npb24tZ3JvdXAnKS5jc3MoJ2Rpc3BsYXknLCdibG9jaycpO1xuICAgICAgICAkKCcuYWdlbmRhX19ncmFwaHMnKS5hZGRDbGFzcygnc2hvdycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgICAgICQoJy5hZ2VuZGFfX3RhYnMgbGknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQodGhpcykucGFyZW50KCdsaScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFN3aXRjaCB0byBvdmVydmlldyBsaXN0XG4gICAgICAgICQoJyNvdmVydmlldy1saXN0JykuY3NzKCdkaXNwbGF5JywnYmxvY2snKTtcbiAgICAgICAgJCgnI2RvY3VtZW50LWxpc3QnKS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG5cdFx0Y29uc29sZS5sb2coJyRnbG9iYWxDdXJyZW50RGF5IE9WRVIgPSAnICsgJGdsb2JhbEN1cnJlbnREYXkpO1xuXG5cbiAgICB9KTtcbn07XG5hZ2VuZGFJZFVwZGF0ZSgpO1xuXG4kKCcubmF2aS1pY29uJykuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdvcGVuJykpIHtcbiAgICAgICAgLy8gaWYgaWNvbiBjbGlja2VkIGhhcyBvcGVuLCByZW1vdmUgJ29wZW4nIGVmZmVjdGl2ZWx5IGNsb3NpbmcgbW9kYWxcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpOyAgICBcbiAgICAgICAgJCgnLmFnZW5kYV9fZmlsdGVyX19ib3gnKS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyB0aGVuIGFkZCBvcGVuIGNsYXNzIHRvIG5hdmktaWNvbjtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgICAkKCcuYWdlbmRhX19maWx0ZXJfX2JveCcpLmNzcygnZGlzcGxheScsJ2Jsb2NrJyk7XG4gICAgfVxufSk7XG5cbnZhciBmaWx0ZXJUcmFja3MgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBBcHBseSBzZWxlY3RlZCBmaWx0ZXJcbiAgICAkKCdpbnB1dFtuYW1lPXJkby1maWx0ZXJdOnJhZGlvJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2ZpbHRlciBjbGlja2VkOyAnICsgJCh0aGlzKS5hdHRyKCdpZCcpKTtcbiAgICAgICAgdmFyIHJhZGlvSWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XG4gICAgICAgIHZhciB0cmFja1ZhbEFycmF5ID0gcmFkaW9JZC5zcGxpdCgncmRvLScpO1xuICAgICAgICB0cmFja1ZhbCA9IHRyYWNrVmFsQXJyYXlbMV07XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3RyYWNrVmFsID0gJyArIHRyYWNrVmFsKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0cmFja1ZhbCA9PT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAkKCcucm93JykuY3NzKCdkaXNwbGF5JywndGFibGUtcm93Jyk7XG4gICAgICAgICAgICAkKCcuYWdlbmRhX190YWJsZScpLnJlbW92ZUNsYXNzKCdhcHBseS1maWx0ZXInKTtcblx0XHRcdGNvbnNvbGUubG9nKFwiMVwiKTtcblx0XHR9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRyYWNrQ2xhc3NUb1Nob3cgPSAnLnRyYWNrLScgKyB0cmFja1ZhbDtcbiAgICAgICAgICAgICQoJy5yb3cnKS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG4gICAgICAgICAgICAkKHRyYWNrQ2xhc3NUb1Nob3cpLmNzcygnZGlzcGxheScsJ3RhYmxlLXJvdycpO1xuICAgICAgICAgICAgJCgnLmFnZW5kYV9fdGFibGUnKS5hZGRDbGFzcygnYXBwbHktZmlsdGVyJyk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiMlwiKTtcblx0XHRcdC8vY29uc29sZS5sb2coJyRnbG9iYWxDdXJyZW50RGF5ID0gJyArICRnbG9iYWxDdXJyZW50RGF5KTtcblx0XHRcdC8vY29uc29sZS5sb2coXCIuY29udF9cIiArICRnbG9iYWxDdXJyZW50RGF5ICsgXCIgXCIgKyB0cmFja0NsYXNzVG9TaG93KTtcblx0XHRcdGNvbnNvbGUubG9nKCQoXCIjY29udF9cIiArICRnbG9iYWxDdXJyZW50RGF5ICsgXCIgXCIgKyB0cmFja0NsYXNzVG9TaG93KS5sZW5ndGgudG9TdHJpbmcoKSk7XG5cdFx0XHRpZiAgKCQoXCIjY29udF9cIiArICRnbG9iYWxDdXJyZW50RGF5ICsgXCIgXCIgKyB0cmFja0NsYXNzVG9TaG93KS5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiSUYgI25vLXNlc3Npb24tXCIgKyAkZ2xvYmFsQ3VycmVudERheSArIFwiIFwiICsgdHJhY2tDbGFzc1RvU2hvdyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiaWYgbm8gc2Vzc2lvbnNcIik7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCcjbm8tc2Vzc2lvbi0nICsgJGdsb2JhbEN1cnJlbnREYXkpO1xuXG5cdFx0XHRcdC8vJCgnI292ZXJ2aWV3LWxpc3QgI25vLXNlc3Npb24tJyArICRnbG9iYWxDdXJyZW50RGF5KS5yZW1vdmUoKTtcblx0XHRcdFx0JCgnI25vLXNlc3Npb24tJyArICRnbG9iYWxDdXJyZW50RGF5KS5jc3MoJ2Rpc3BsYXknLCdibG9jaycpO1xuXG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJlbHNlIGlmIHNlc3Npb25zXCIpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnI25vLXNlc3Npb24tJyArICRnbG9iYWxDdXJyZW50RGF5KTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIkVMU0UgI25vLXNlc3Npb24tXCIgKyAkZ2xvYmFsQ3VycmVudERheSArIFwiIFwiICsgdHJhY2tDbGFzc1RvU2hvdyk7XG5cblx0XHRcdFx0JCgnI25vLXNlc3Npb24tJyArICRnbG9iYWxDdXJyZW50RGF5KS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG5cblx0XHRcdH1cblxuXG5cbiAgICAgICAgfSBcbiAgICAgICAgJCgnLmFnZW5kYV9fZmlsdGVyIGxhYmVsJykucmVtb3ZlQ2xhc3MoJ3Jkby1zZWxlY3RlZCcpO1xuICAgICAgICAkKHRoaXMpLm5leHQoJ2xhYmVsJykuYWRkQ2xhc3MoJ3Jkby1zZWxlY3RlZCcpO1xuXG5cblxuXG5cblxuICAgIH0pO1xuICAgIC8vIENsZWFyIGZpbHRlcnNcbiAgICAkKCcuYWdlbmRhX190YWJzID4gbGkgPiBhJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJyNyZG8tbm9uZScpLmNsaWNrKCk7XG4gICAgICAgIC8vJCgnLnJvdycpLmNzcygnZGlzcGxheScsJ3RhYmxlLXJvdycpOyBcbiAgICB9KTtcbiAgICBcbn07XG5maWx0ZXJUcmFja3MoKTtcblxuaWYoaGlwcG9DbXNGbGFnKXtcblx0aGlwcG9DbXNSZXNvdXJjZVByZWZpeCA9ICcvc2l0ZS9fY21zaW50ZXJuYWwnO1xufVxuZWxzZSBpZihsb2NhbEVudmlyb25tZW50RmxhZyl7XG5cdGhpcHBvQ21zUmVzb3VyY2VQcmVmaXggPSAnL3NpdGUnO1xufVxuXG4kKGZ1bmN0aW9uKCl7XG5cdGhpcHBvQ21zQ2hhbmdlSW1hZ2VQYXRocyhoaXBwb0Ntc1Jlc291cmNlUHJlZml4KTtcbn0pO1xuIl0sImZpbGUiOiJtYWluLmpzIn0=


}
/*
     FILE ARCHIVED ON 23:08:18 Sep 01, 2017 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:28:09 Oct 28, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 295.611
  exclusion.robots: 0.296
  exclusion.robots.policy: 0.287
  RedisCDXSource: 1.848
  esindex: 0.009
  LoadShardBlock: 271.567 (3)
  PetaboxLoader3.datanode: 185.95 (4)
  CDXLines.iter: 19.323 (3)
  load_resource: 84.689
  PetaboxLoader3.resolve: 48.038
*/