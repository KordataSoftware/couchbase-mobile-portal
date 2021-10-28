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

define(['require', 'jquery', 'console', 'videoblock', 'youtube'],
	/**
	 * @param require
	 * @returns {(ContentBlockItem)}
	 */
function defineContentBlockItemModule(require) {
	'use strict';

	/**
	 * @var {jQuery} $
	 * @var {Console} console
	 * @var Videoblock
	 * @var YouTube
	 */
	var $ = require('jquery');
	var console = require('console');
	var Videoblock = require('videoblock');
	//var YouTube = require('modules/youtube');

		/**
		 * @module
		 * @singleton
		 * @name content-block-item
		 * @name ContentBlockItem
		 * @type {{videoBlocks: Array, youtubeBlocks: Array, iframes: Array, iframesProcessed: Array, iframesSkipped: Array, parsePage: function()}}
		 */
	var ContentBlockItem = {

		videoBlocks: [],
		youtubeBlocks: [],
		iframes: [],
		iframesProcessed: [],
		iframesSkipped: [],

		parsePage: parsePage

	};

	var $ignoreSelectors;

	function parsePage() {
		// if this is present, we don't touch any iframes.
		$ignoreSelectors = $('.download-section');


		var $iframes = $('.content-block-item iframe');
		$iframes.each(function dispatchIframeParse(idx, iframe) {

			ContentBlockItem.iframes.push(iframe);

			var processedIframeOrNull = parseIframe(iframe);
			if (processedIframeOrNull == null) {
				ContentBlockItem.iframesSkipped.push(iframe);
			} else {
				ContentBlockItem.iframesProcessed.push(iframe);
			}

		});

		console.log("Processed (modified) iframes: ", ContentBlockItem.iframesProcessed);
		return ContentBlockItem.iframesProcessed;
	}


	function getIframeHtml(iframeSrc){
		var src = (typeof iframeSrc === 'undefined')? "": iframeSrc;		

		var $newIframe = $('<iframe allowfullscreen frameborder="0" style="border: 1px solid rgba(128,128,128,0.5);">');
		$newIframe.attr('src', src);
		var html = $newIframe.prop('outerHTML');
		delete $newIframe[0];
		return html;
	}




	function parseIframe(iframe) {

		var $iframe = $(iframe);
		var src = $iframe.attr('src');

		var groupName = "iframe decisions for \""+src+"\"";
		console.groupCollapsed(groupName);

		console.log("ContentBlockItem: Looking at iframe with src = "
				+"\n    '"+src+"'");
		console.log("ContentBlockItem: "
				+"\n    - peering for magic attribute `__contentblockitem_parsed`, "
				+"\n    - then checking to see if a parent element has one of these "
				+"\n          classes applied: [.mediablock, .youtubeblock, .videoblock],"
				+"\n    - then checking if we are on the downloads page... "
				+"\n    - then checking if the src contains magic words... "
				+"\n    ..all of which would exclude it from further processing.");

		var parsedValue = $iframe.attr('__contentblockitem_parsed');
		try {
			console.debug($iframe.stylesheet.rules.toString());
		} catch (e) {
			// nevermind
		}

		if (
			typeof $iframe.attr('__contentblockitem_parsed') !== 'undefined'
			|| src.length === 0
			|| $iframe.parents('.mediablock').length
			|| $ignoreSelectors.length) {

			console.info("ContentBlockItem: Skipping over this iframe. (", $iframe[0], ")");
			console.groupEnd();
			return;

		} else {
			$iframe.attr('__contentblockitem_parsed', '1');
			// continues below..
		}
		// processing iframe here


		var youtubeMatch = src.match(/youtube\.com/gi);
		if (youtubeMatch === null) {

			var mediablockHtml = ''
				+ '<div class="mediablock">'
				+ '	<div class="layout-wrapper">'
				+ '	 <div class="mediablock__content">'
				+ '	' + getIframeHtml(src)
				+ '	 </div>'
				+ '	</div>'
				+ '</div>';

			var $mediablock = $(mediablockHtml);
			$iframe.replaceWith($mediablock);

			var videoblock = new Videoblock();
			ContentBlockItem.videoBlocks.push(videoblock);
			console.groupEnd(groupName);
			console.log('replaced an iframe with src=', src, 'with a mediablock:', $mediablock, ' videoblock: ', videoblock);

		} else {

			if ($iframe.parents('.videoblock').length) {
				$iframe.parents('.videoblock:first').replaceWith($iframe);
			}

			var youtubeDataContext = new YouTube.YouTubeDataContext($iframe);

			var youtubeHtml = ''
				+ '<div class="videoblock youtubeblock">'
				+ '    <div class="layout-wrapper">'
				+ '        <div class="videoblock__content">'
				+ '            <div class="videoblock__cover"></div>'
				+ '            <button class="videoblock__button" type="button">'
				+ '                <span>Play</span>'
				+ '            </button>'
				+ '        </div>'
				+ '    </div>'
				+ '</div>';

			var $youtubeblock = $(youtubeHtml);
			$iframe.replaceWith($youtubeblock);

			ContentBlockItem.youtubeBlocks.push($youtubeblock);

			console.groupEnd(groupName);


			console.log('replaced an iframe with (YouTube VideoID ' + youtubeDataContext.videoId + ') ');
			console.log('...with a videoblock:', $youtubeblock);

			var embedSrc = '//web.archive.org/web/20181017195725/https://www.youtube.com/embed/' + youtubeDataContext.videoId;
			var embedSrcWithAutoplay = embedSrc + '?autoplay=1';

			var $ytblockVideoblockContent = $youtubeblock.find('.videoblock__content');

			console.log('Youtubeblock -- attempting to get thumbnail for YT video ' + youtubeDataContext.videoId);
			youtubeDataContext.getLargeThumbnail(
				function onThumbnailReady(imageSrc) {
					console.log('Youtubeblock -- thumbnail ready for YT ' + youtubeDataContext.videoId, imageSrc);

					$youtubeblock.find('.videoblock__cover').css({
						background: 'url("' + imageSrc + '") no-repeat scroll center center / contain rgba(0, 0, 0, 0)'
					});
				},

				function onError(param1, param2, data) {
					console.log('Youtubeblock -- failed to retrieve thumbnail for YT video ID ', youtubeDataContext.videoId);
					console.log('  ... onError arguments: ', arguments);

					if (typeof param2 === 'object' && 'fn' in param2) {
						var message = param1;
						var $jqXHR = param2;
						console.log('  ... message: ', message,
							'$jqXHR: ', $jqXHR,
							'data: ', data);
					} else {
						var defaultImage = param1;
						var thumbnailError = param2;
						console.log('  ... defaultImage: ', defaultImage,
							'thumbnailError: ', thumbnailError,
							'data: ', data);
					}

					$ytblockVideoblockContent.html(
						getIframeHtml(embedSrc)
					);
				},

				'/images/play_48.png' // default image
			);

			$ytblockVideoblockContent.on('click', function onVideoClickedToPlay() {
				$youtubeblock.find('div.videoblock__cover, button.videoblock__button').remove();
				$ytblockVideoblockContent.html("").append(
					$(getIframeHtml(embedSrcWithAutoplay))
				);

			});


		}//each iframe in $iframes


	} //enddef this.parseIframe()


	ContentBlockItem.parsePage();

	//noinspection JSValidateTypes
		return ContentBlockItem;

});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250ZW50LWJsb2NrLWl0ZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKFsncmVxdWlyZScsICdqcXVlcnknLCAnY29uc29sZScsICd2aWRlb2Jsb2NrJywgJ3lvdXR1YmUnXSxcblx0LyoqXG5cdCAqIEBwYXJhbSByZXF1aXJlXG5cdCAqIEByZXR1cm5zIHsoQ29udGVudEJsb2NrSXRlbSl9XG5cdCAqL1xuZnVuY3Rpb24gZGVmaW5lQ29udGVudEJsb2NrSXRlbU1vZHVsZShyZXF1aXJlKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKipcblx0ICogQHZhciB7alF1ZXJ5fSAkXG5cdCAqIEB2YXIge0NvbnNvbGV9IGNvbnNvbGVcblx0ICogQHZhciBWaWRlb2Jsb2NrXG5cdCAqIEB2YXIgWW91VHViZVxuXHQgKi9cblx0dmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblx0dmFyIGNvbnNvbGUgPSByZXF1aXJlKCdjb25zb2xlJyk7XG5cdHZhciBWaWRlb2Jsb2NrID0gcmVxdWlyZSgndmlkZW9ibG9jaycpO1xuXHQvL3ZhciBZb3VUdWJlID0gcmVxdWlyZSgnbW9kdWxlcy95b3V0dWJlJyk7XG5cblx0XHQvKipcblx0XHQgKiBAbW9kdWxlXG5cdFx0ICogQHNpbmdsZXRvblxuXHRcdCAqIEBuYW1lIGNvbnRlbnQtYmxvY2staXRlbVxuXHRcdCAqIEBuYW1lIENvbnRlbnRCbG9ja0l0ZW1cblx0XHQgKiBAdHlwZSB7e3ZpZGVvQmxvY2tzOiBBcnJheSwgeW91dHViZUJsb2NrczogQXJyYXksIGlmcmFtZXM6IEFycmF5LCBpZnJhbWVzUHJvY2Vzc2VkOiBBcnJheSwgaWZyYW1lc1NraXBwZWQ6IEFycmF5LCBwYXJzZVBhZ2U6IGZ1bmN0aW9uKCl9fVxuXHRcdCAqL1xuXHR2YXIgQ29udGVudEJsb2NrSXRlbSA9IHtcblxuXHRcdHZpZGVvQmxvY2tzOiBbXSxcblx0XHR5b3V0dWJlQmxvY2tzOiBbXSxcblx0XHRpZnJhbWVzOiBbXSxcblx0XHRpZnJhbWVzUHJvY2Vzc2VkOiBbXSxcblx0XHRpZnJhbWVzU2tpcHBlZDogW10sXG5cblx0XHRwYXJzZVBhZ2U6IHBhcnNlUGFnZVxuXG5cdH07XG5cblx0dmFyICRpZ25vcmVTZWxlY3RvcnM7XG5cblx0ZnVuY3Rpb24gcGFyc2VQYWdlKCkge1xuXHRcdC8vIGlmIHRoaXMgaXMgcHJlc2VudCwgd2UgZG9uJ3QgdG91Y2ggYW55IGlmcmFtZXMuXG5cdFx0JGlnbm9yZVNlbGVjdG9ycyA9ICQoJy5kb3dubG9hZC1zZWN0aW9uJyk7XG5cblxuXHRcdHZhciAkaWZyYW1lcyA9ICQoJy5jb250ZW50LWJsb2NrLWl0ZW0gaWZyYW1lJyk7XG5cdFx0JGlmcmFtZXMuZWFjaChmdW5jdGlvbiBkaXNwYXRjaElmcmFtZVBhcnNlKGlkeCwgaWZyYW1lKSB7XG5cblx0XHRcdENvbnRlbnRCbG9ja0l0ZW0uaWZyYW1lcy5wdXNoKGlmcmFtZSk7XG5cblx0XHRcdHZhciBwcm9jZXNzZWRJZnJhbWVPck51bGwgPSBwYXJzZUlmcmFtZShpZnJhbWUpO1xuXHRcdFx0aWYgKHByb2Nlc3NlZElmcmFtZU9yTnVsbCA9PSBudWxsKSB7XG5cdFx0XHRcdENvbnRlbnRCbG9ja0l0ZW0uaWZyYW1lc1NraXBwZWQucHVzaChpZnJhbWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Q29udGVudEJsb2NrSXRlbS5pZnJhbWVzUHJvY2Vzc2VkLnB1c2goaWZyYW1lKTtcblx0XHRcdH1cblxuXHRcdH0pO1xuXG5cdFx0Y29uc29sZS5sb2coXCJQcm9jZXNzZWQgKG1vZGlmaWVkKSBpZnJhbWVzOiBcIiwgQ29udGVudEJsb2NrSXRlbS5pZnJhbWVzUHJvY2Vzc2VkKTtcblx0XHRyZXR1cm4gQ29udGVudEJsb2NrSXRlbS5pZnJhbWVzUHJvY2Vzc2VkO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXRJZnJhbWVIdG1sKGlmcmFtZVNyYyl7XG5cdFx0dmFyIHNyYyA9ICh0eXBlb2YgaWZyYW1lU3JjID09PSAndW5kZWZpbmVkJyk/IFwiXCI6IGlmcmFtZVNyYztcdFx0XG5cblx0XHR2YXIgJG5ld0lmcmFtZSA9ICQoJzxpZnJhbWUgYWxsb3dmdWxsc2NyZWVuIGZyYW1lYm9yZGVyPVwiMFwiIHN0eWxlPVwiYm9yZGVyOiAxcHggc29saWQgcmdiYSgxMjgsMTI4LDEyOCwwLjUpO1wiPicpO1xuXHRcdCRuZXdJZnJhbWUuYXR0cignc3JjJywgc3JjKTtcblx0XHR2YXIgaHRtbCA9ICRuZXdJZnJhbWUucHJvcCgnb3V0ZXJIVE1MJyk7XG5cdFx0ZGVsZXRlICRuZXdJZnJhbWVbMF07XG5cdFx0cmV0dXJuIGh0bWw7XG5cdH1cblxuXG5cblxuXHRmdW5jdGlvbiBwYXJzZUlmcmFtZShpZnJhbWUpIHtcblxuXHRcdHZhciAkaWZyYW1lID0gJChpZnJhbWUpO1xuXHRcdHZhciBzcmMgPSAkaWZyYW1lLmF0dHIoJ3NyYycpO1xuXG5cdFx0dmFyIGdyb3VwTmFtZSA9IFwiaWZyYW1lIGRlY2lzaW9ucyBmb3IgXFxcIlwiK3NyYytcIlxcXCJcIjtcblx0XHRjb25zb2xlLmdyb3VwQ29sbGFwc2VkKGdyb3VwTmFtZSk7XG5cblx0XHRjb25zb2xlLmxvZyhcIkNvbnRlbnRCbG9ja0l0ZW06IExvb2tpbmcgYXQgaWZyYW1lIHdpdGggc3JjID0gXCJcblx0XHRcdFx0K1wiXFxuICAgICdcIitzcmMrXCInXCIpO1xuXHRcdGNvbnNvbGUubG9nKFwiQ29udGVudEJsb2NrSXRlbTogXCJcblx0XHRcdFx0K1wiXFxuICAgIC0gcGVlcmluZyBmb3IgbWFnaWMgYXR0cmlidXRlIGBfX2NvbnRlbnRibG9ja2l0ZW1fcGFyc2VkYCwgXCJcblx0XHRcdFx0K1wiXFxuICAgIC0gdGhlbiBjaGVja2luZyB0byBzZWUgaWYgYSBwYXJlbnQgZWxlbWVudCBoYXMgb25lIG9mIHRoZXNlIFwiXG5cdFx0XHRcdCtcIlxcbiAgICAgICAgICBjbGFzc2VzIGFwcGxpZWQ6IFsubWVkaWFibG9jaywgLnlvdXR1YmVibG9jaywgLnZpZGVvYmxvY2tdLFwiXG5cdFx0XHRcdCtcIlxcbiAgICAtIHRoZW4gY2hlY2tpbmcgaWYgd2UgYXJlIG9uIHRoZSBkb3dubG9hZHMgcGFnZS4uLiBcIlxuXHRcdFx0XHQrXCJcXG4gICAgLSB0aGVuIGNoZWNraW5nIGlmIHRoZSBzcmMgY29udGFpbnMgbWFnaWMgd29yZHMuLi4gXCJcblx0XHRcdFx0K1wiXFxuICAgIC4uYWxsIG9mIHdoaWNoIHdvdWxkIGV4Y2x1ZGUgaXQgZnJvbSBmdXJ0aGVyIHByb2Nlc3NpbmcuXCIpO1xuXG5cdFx0dmFyIHBhcnNlZFZhbHVlID0gJGlmcmFtZS5hdHRyKCdfX2NvbnRlbnRibG9ja2l0ZW1fcGFyc2VkJyk7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnNvbGUuZGVidWcoJGlmcmFtZS5zdHlsZXNoZWV0LnJ1bGVzLnRvU3RyaW5nKCkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdC8vIG5ldmVybWluZFxuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdHR5cGVvZiAkaWZyYW1lLmF0dHIoJ19fY29udGVudGJsb2NraXRlbV9wYXJzZWQnKSAhPT0gJ3VuZGVmaW5lZCdcblx0XHRcdHx8IHNyYy5sZW5ndGggPT09IDBcblx0XHRcdHx8ICRpZnJhbWUucGFyZW50cygnLm1lZGlhYmxvY2snKS5sZW5ndGhcblx0XHRcdHx8ICRpZ25vcmVTZWxlY3RvcnMubGVuZ3RoKSB7XG5cblx0XHRcdGNvbnNvbGUuaW5mbyhcIkNvbnRlbnRCbG9ja0l0ZW06IFNraXBwaW5nIG92ZXIgdGhpcyBpZnJhbWUuIChcIiwgJGlmcmFtZVswXSwgXCIpXCIpO1xuXHRcdFx0Y29uc29sZS5ncm91cEVuZCgpO1xuXHRcdFx0cmV0dXJuO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdCRpZnJhbWUuYXR0cignX19jb250ZW50YmxvY2tpdGVtX3BhcnNlZCcsICcxJyk7XG5cdFx0XHQvLyBjb250aW51ZXMgYmVsb3cuLlxuXHRcdH1cblx0XHQvLyBwcm9jZXNzaW5nIGlmcmFtZSBoZXJlXG5cblxuXHRcdHZhciB5b3V0dWJlTWF0Y2ggPSBzcmMubWF0Y2goL3lvdXR1YmVcXC5jb20vZ2kpO1xuXHRcdGlmICh5b3V0dWJlTWF0Y2ggPT09IG51bGwpIHtcblxuXHRcdFx0dmFyIG1lZGlhYmxvY2tIdG1sID0gJydcblx0XHRcdFx0KyAnPGRpdiBjbGFzcz1cIm1lZGlhYmxvY2tcIj4nXG5cdFx0XHRcdCsgJ1x0PGRpdiBjbGFzcz1cImxheW91dC13cmFwcGVyXCI+J1xuXHRcdFx0XHQrICdcdCA8ZGl2IGNsYXNzPVwibWVkaWFibG9ja19fY29udGVudFwiPidcblx0XHRcdFx0KyAnXHQnICsgZ2V0SWZyYW1lSHRtbChzcmMpXG5cdFx0XHRcdCsgJ1x0IDwvZGl2Pidcblx0XHRcdFx0KyAnXHQ8L2Rpdj4nXG5cdFx0XHRcdCsgJzwvZGl2Pic7XG5cblx0XHRcdHZhciAkbWVkaWFibG9jayA9ICQobWVkaWFibG9ja0h0bWwpO1xuXHRcdFx0JGlmcmFtZS5yZXBsYWNlV2l0aCgkbWVkaWFibG9jayk7XG5cblx0XHRcdHZhciB2aWRlb2Jsb2NrID0gbmV3IFZpZGVvYmxvY2soKTtcblx0XHRcdENvbnRlbnRCbG9ja0l0ZW0udmlkZW9CbG9ja3MucHVzaCh2aWRlb2Jsb2NrKTtcblx0XHRcdGNvbnNvbGUuZ3JvdXBFbmQoZ3JvdXBOYW1lKTtcblx0XHRcdGNvbnNvbGUubG9nKCdyZXBsYWNlZCBhbiBpZnJhbWUgd2l0aCBzcmM9Jywgc3JjLCAnd2l0aCBhIG1lZGlhYmxvY2s6JywgJG1lZGlhYmxvY2ssICcgdmlkZW9ibG9jazogJywgdmlkZW9ibG9jayk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRpZiAoJGlmcmFtZS5wYXJlbnRzKCcudmlkZW9ibG9jaycpLmxlbmd0aCkge1xuXHRcdFx0XHQkaWZyYW1lLnBhcmVudHMoJy52aWRlb2Jsb2NrOmZpcnN0JykucmVwbGFjZVdpdGgoJGlmcmFtZSk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciB5b3V0dWJlRGF0YUNvbnRleHQgPSBuZXcgWW91VHViZS5Zb3VUdWJlRGF0YUNvbnRleHQoJGlmcmFtZSk7XG5cblx0XHRcdHZhciB5b3V0dWJlSHRtbCA9ICcnXG5cdFx0XHRcdCsgJzxkaXYgY2xhc3M9XCJ2aWRlb2Jsb2NrIHlvdXR1YmVibG9ja1wiPidcblx0XHRcdFx0KyAnICAgIDxkaXYgY2xhc3M9XCJsYXlvdXQtd3JhcHBlclwiPidcblx0XHRcdFx0KyAnICAgICAgICA8ZGl2IGNsYXNzPVwidmlkZW9ibG9ja19fY29udGVudFwiPidcblx0XHRcdFx0KyAnICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZpZGVvYmxvY2tfX2NvdmVyXCI+PC9kaXY+J1xuXHRcdFx0XHQrICcgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwidmlkZW9ibG9ja19fYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiPidcblx0XHRcdFx0KyAnICAgICAgICAgICAgICAgIDxzcGFuPlBsYXk8L3NwYW4+J1xuXHRcdFx0XHQrICcgICAgICAgICAgICA8L2J1dHRvbj4nXG5cdFx0XHRcdCsgJyAgICAgICAgPC9kaXY+J1xuXHRcdFx0XHQrICcgICAgPC9kaXY+J1xuXHRcdFx0XHQrICc8L2Rpdj4nO1xuXG5cdFx0XHR2YXIgJHlvdXR1YmVibG9jayA9ICQoeW91dHViZUh0bWwpO1xuXHRcdFx0JGlmcmFtZS5yZXBsYWNlV2l0aCgkeW91dHViZWJsb2NrKTtcblxuXHRcdFx0Q29udGVudEJsb2NrSXRlbS55b3V0dWJlQmxvY2tzLnB1c2goJHlvdXR1YmVibG9jayk7XG5cblx0XHRcdGNvbnNvbGUuZ3JvdXBFbmQoZ3JvdXBOYW1lKTtcblxuXG5cdFx0XHRjb25zb2xlLmxvZygncmVwbGFjZWQgYW4gaWZyYW1lIHdpdGggKFlvdVR1YmUgVmlkZW9JRCAnICsgeW91dHViZURhdGFDb250ZXh0LnZpZGVvSWQgKyAnKSAnKTtcblx0XHRcdGNvbnNvbGUubG9nKCcuLi53aXRoIGEgdmlkZW9ibG9jazonLCAkeW91dHViZWJsb2NrKTtcblxuXHRcdFx0dmFyIGVtYmVkU3JjID0gJy8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycgKyB5b3V0dWJlRGF0YUNvbnRleHQudmlkZW9JZDtcblx0XHRcdHZhciBlbWJlZFNyY1dpdGhBdXRvcGxheSA9IGVtYmVkU3JjICsgJz9hdXRvcGxheT0xJztcblxuXHRcdFx0dmFyICR5dGJsb2NrVmlkZW9ibG9ja0NvbnRlbnQgPSAkeW91dHViZWJsb2NrLmZpbmQoJy52aWRlb2Jsb2NrX19jb250ZW50Jyk7XG5cblx0XHRcdGNvbnNvbGUubG9nKCdZb3V0dWJlYmxvY2sgLS0gYXR0ZW1wdGluZyB0byBnZXQgdGh1bWJuYWlsIGZvciBZVCB2aWRlbyAnICsgeW91dHViZURhdGFDb250ZXh0LnZpZGVvSWQpO1xuXHRcdFx0eW91dHViZURhdGFDb250ZXh0LmdldExhcmdlVGh1bWJuYWlsKFxuXHRcdFx0XHRmdW5jdGlvbiBvblRodW1ibmFpbFJlYWR5KGltYWdlU3JjKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ1lvdXR1YmVibG9jayAtLSB0aHVtYm5haWwgcmVhZHkgZm9yIFlUICcgKyB5b3V0dWJlRGF0YUNvbnRleHQudmlkZW9JZCwgaW1hZ2VTcmMpO1xuXG5cdFx0XHRcdFx0JHlvdXR1YmVibG9jay5maW5kKCcudmlkZW9ibG9ja19fY292ZXInKS5jc3Moe1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZDogJ3VybChcIicgKyBpbWFnZVNyYyArICdcIikgbm8tcmVwZWF0IHNjcm9sbCBjZW50ZXIgY2VudGVyIC8gY29udGFpbiByZ2JhKDAsIDAsIDAsIDApJ1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdGZ1bmN0aW9uIG9uRXJyb3IocGFyYW0xLCBwYXJhbTIsIGRhdGEpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnWW91dHViZWJsb2NrIC0tIGZhaWxlZCB0byByZXRyaWV2ZSB0aHVtYm5haWwgZm9yIFlUIHZpZGVvIElEICcsIHlvdXR1YmVEYXRhQ29udGV4dC52aWRlb0lkKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnICAuLi4gb25FcnJvciBhcmd1bWVudHM6ICcsIGFyZ3VtZW50cyk7XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIHBhcmFtMiA9PT0gJ29iamVjdCcgJiYgJ2ZuJyBpbiBwYXJhbTIpIHtcblx0XHRcdFx0XHRcdHZhciBtZXNzYWdlID0gcGFyYW0xO1xuXHRcdFx0XHRcdFx0dmFyICRqcVhIUiA9IHBhcmFtMjtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCcgIC4uLiBtZXNzYWdlOiAnLCBtZXNzYWdlLFxuXHRcdFx0XHRcdFx0XHQnJGpxWEhSOiAnLCAkanFYSFIsXG5cdFx0XHRcdFx0XHRcdCdkYXRhOiAnLCBkYXRhKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmFyIGRlZmF1bHRJbWFnZSA9IHBhcmFtMTtcblx0XHRcdFx0XHRcdHZhciB0aHVtYm5haWxFcnJvciA9IHBhcmFtMjtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCcgIC4uLiBkZWZhdWx0SW1hZ2U6ICcsIGRlZmF1bHRJbWFnZSxcblx0XHRcdFx0XHRcdFx0J3RodW1ibmFpbEVycm9yOiAnLCB0aHVtYm5haWxFcnJvcixcblx0XHRcdFx0XHRcdFx0J2RhdGE6ICcsIGRhdGEpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCR5dGJsb2NrVmlkZW9ibG9ja0NvbnRlbnQuaHRtbChcblx0XHRcdFx0XHRcdGdldElmcmFtZUh0bWwoZW1iZWRTcmMpXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQnL2ltYWdlcy9wbGF5XzQ4LnBuZycgLy8gZGVmYXVsdCBpbWFnZVxuXHRcdFx0KTtcblxuXHRcdFx0JHl0YmxvY2tWaWRlb2Jsb2NrQ29udGVudC5vbignY2xpY2snLCBmdW5jdGlvbiBvblZpZGVvQ2xpY2tlZFRvUGxheSgpIHtcblx0XHRcdFx0JHlvdXR1YmVibG9jay5maW5kKCdkaXYudmlkZW9ibG9ja19fY292ZXIsIGJ1dHRvbi52aWRlb2Jsb2NrX19idXR0b24nKS5yZW1vdmUoKTtcblx0XHRcdFx0JHl0YmxvY2tWaWRlb2Jsb2NrQ29udGVudC5odG1sKFwiXCIpLmFwcGVuZChcblx0XHRcdFx0XHQkKGdldElmcmFtZUh0bWwoZW1iZWRTcmNXaXRoQXV0b3BsYXkpKVxuXHRcdFx0XHQpO1xuXG5cdFx0XHR9KTtcblxuXG5cdFx0fS8vZWFjaCBpZnJhbWUgaW4gJGlmcmFtZXNcblxuXG5cdH0gLy9lbmRkZWYgdGhpcy5wYXJzZUlmcmFtZSgpXG5cblxuXHRDb250ZW50QmxvY2tJdGVtLnBhcnNlUGFnZSgpO1xuXG5cdC8vbm9pbnNwZWN0aW9uIEpTVmFsaWRhdGVUeXBlc1xuXHRcdHJldHVybiBDb250ZW50QmxvY2tJdGVtO1xuXG59KTtcbiJdLCJmaWxlIjoiY29udGVudC1ibG9jay1pdGVtLmpzIn0=


}
/*
     FILE ARCHIVED ON 19:57:25 Oct 17, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:51:00 Oct 28, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 115.446
  exclusion.robots: 0.203
  exclusion.robots.policy: 0.196
  RedisCDXSource: 0.509
  esindex: 0.01
  LoadShardBlock: 92.928 (3)
  PetaboxLoader3.datanode: 153.237 (4)
  CDXLines.iter: 19.556 (3)
  load_resource: 98.208
  PetaboxLoader3.resolve: 22.64
*/