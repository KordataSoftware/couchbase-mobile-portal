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

/**
 *
 * @module YoutubeDataContext
 * @file youtube-data.js
 * @author David Reilly <dreilly@authxconsulting.com>
 * @version 1.1; revised on 2014-10-27 (DBR)
 */
define(['thirdparty/vendor/jquery', 'console'], function defineYoutubeModule($, console) {
	'use strict';

	/**
	 * @module YouTube
	 */
	var YouTube = {

		jQueryVersion: null,

		YouTubeDataContext: function YouTubeDataContext() {

		}

	};

	//noinspection FunctionWithMultipleReturnPointsJS,JSUnusedGlobalSymbols
	YouTube.isJqueryElement = function isJqueryElement(element) {

		if (typeof element !== 'object') {
			return false;
		}

		var constructorString = Object.getPrototypeOf(element).constructor.toString();

		var plainDomElementRegExp = /\s*(?:function)\s([^\s\(]+)\([^\)]*\).*/;
		var plainDomElementResult = constructorString.match(plainDomElementRegExp);
		if (plainDomElementResult === null) {
			// Doesn't match the constructor pattern for plain HTML elements...
			// Check jQuery
			if ('jquery' in element) {
				YouTube.jQueryVersion = element.jquery;
				return true;
			}
		} else {
			YouTube.jQueryVersion = null;
		}

		return false;

	}.bind(YouTube);


	//noinspection FunctionWithMultipleReturnPointsJS,FunctionWithMultipleReturnPointsJS,FunctionTooLongJS
	/**
	 *
	 * @constructor
	 * @param {(jQuery)|object|string} initializer - Any of the following will work:
	 *
	 *      (1) a DOM iframe element (HTMLIframeElement) containing an embedded
	 *      YouTube video already loaded via "src" set appropriately,
	 *
	 *      (2) a jQuery-wrapped set of such iframes (one or more), as in:
	 *      ```js
	 *          var ytIframe = document.getElementById('youtube-iframe-embed');
	 *          $iframe = $(ytIframe);
	 *          var ytDataContext = new YoutubeDataContext($iframe);
	 *      ```
	 *
	 *      (3) the YouTube Video ID. For example, in a typical Video URL referenced
	 *          in URLs such as these:
	 *
	 *          http://www.youtube.com/watch?v=nD6Cchv3qK0
	 *          http://www.youtube.com/embed/nD6Cchv3qK0?feature=player_detailpage
	 *          http://www.youtube.com/v/nD6Cchv3qK0?asdf
	 *
	 */
	YouTube.YouTubeDataContext = function YouTubeDataContext(initializer) {

		this.dataCache = {};
		this.successMsgCache = {};
		this.$jqXHRCache = {};

		this.videoId = null;
		this.$iframe = null;
		this.iframeSrc = "";


		if (typeof initializer === 'object') {

			var unknownElement = initializer;
			var isJquery = YouTube.isJqueryElement(unknownElement);
			var $element = isJquery ? unknownElement : $(unknownElement);

			if (!($element.attr('src'))) {
				console.error('YoutubeDataContext initializer requires an iframe or video-ID. Actual: ', initializer);
				return this;
			}

			var $iframe = $element;
			if ($element[0].tagName.toUpperCase() !== 'IFRAME') {
				$iframe = $element.find('iframe[src]');
			}

			if (!$iframe.length) {
				console.error('Could not find a usable iframe in initializer.');
				return this;
			}

			this.$iframe = $iframe;

			this.iframeSrc = $.trim(this.$iframe.attr('src'));

			if (this.iframeSrc.indexOf('youtube.com') === -1) {
				console.error('Not a youtube source.');
				return this;
			}

			this.videoId = YouTube.getYoutubeVideoIdFromUrl(this.iframeSrc);
			console.info('YouTubeDataContext initialized from iframe=',this.$iframe,'; VideoID = ', this.videoId);


		} else if (typeof initializer === 'string') {
			this.videoId = initializer;
			console.info('YouTubeDataContext initialized from VideoID string; VideoID = ', this.videoId);


		} else {

			console.error(
				'YoutubeDataContext initializer requires an iframe or video-ID. Actual: ',
				initializer);
		}

		return this;

	};

	//noinspection FunctionWithMultipleReturnPointsJS
	YouTube.getYoutubeVideoIdFromUrl = function getYoutubeVideoIdFromUrl(url)
	{
		//var src = "https://web.archive.org/web/20181017195726/http://www.youtube.com/watch?v=nD6Cchv3qK0?blahfdi=ewrwg";
		var match1 = url.match(/youtube.com\/watch\?v=([^\/&\?#]+)(.*)?/);
		if (match1 !== null && match1.length >= 2) {
			return match1[1];
		}

		//var src = "https://web.archive.org/web/20181017195726/http://www.youtube.com/embed/nD6Cchv3qK0?feature=player_detailpage";
		var match2 = url.match(/youtube.com\/embed\/([^\/&\?#]+)(.*)?/);
		if (match2 !== null && match2.length >= 2) {
			return match2[1];
		}

		//var src = "https://web.archive.org/web/20181017195726/https://www.youtube.com/v/M7lc1UVf-VE?version=3&autoplay=1";
		var match3 = url.match(/youtube.com\/v\/([^\/&\?#]+)(.*)?/);
		if (match3 !== null && match3.length >= 2) {
			return match3[1];
		}

		return "";
	};

	YouTube.YouTubeDataContext.prototype.fetchYoutubeData = function fetchYoutubeData(callbackOnData, callbackOnError) {

		if (this.videoId in this.dataCache) {

			callbackOnData.apply(
				this.$jqXHRCache[this.videoId],
				[
					this.dataCache[this.videoId],
					this.successMsgCache[this.videoId],
					this.$jqXHRCache[this.videoId]
				]
			);

		} else {

			var thisDataContext = this;

			$.get("//web.archive.org/web/20181017195726/https://gdata.youtube.com/feeds/api/videos?q=" + this.videoId + '&max-results=1&v=2&alt=jsonc',
				function (data, successMsg, $jqXHR) {

					if (successMsg === "success") {

						console.log('Data returned from YouTube API: ', data);

						thisDataContext.dataCache[thisDataContext.videoId] = data;
						thisDataContext.successMsgCache[thisDataContext.videoId] = successMsg;
						thisDataContext.$jqXHRCache[thisDataContext.videoId] = $jqXHR;

						callbackOnData.apply($jqXHR, [data, successMsg, $jqXHR]);

					} else {

						console.warn("YouTube data fetch -- error: '" + successMsg + "'");
						callbackOnError.apply($jqXHR, [successMsg, $jqXHR, data]);

					}

				}
			);
		}
	};

	/*
	YouTube.YouTubeDataContext.prototype.getSmallThumbnail = function(callbackOnImageSrc, callbackOnError, imageSrcOnError) {
		var dataContext = this;

		this.fetchYoutubeData(
			// on success from YT API
			function(data, xmlDocument, successMsg, $jqXHR) {
				var imageSrc;
				try {
					var thumbnailSet = data['entry']['media:group']['media:thumbnail'];
					imageSrc = thumbnailSet[thumbnailSet.length - 1]['url'];
					callbackOnImageSrc.apply(dataContext, [imageSrc, data, xmlDocument, successMsg, $jqXHR]);
				} catch (error__extractThumbnailFromXml) {
					callbackOnError.apply(dataContext, [imageSrcOnError, error__extractThumbnailFromXml, xmlDocument]);
				}
			},
			// on error from YT API or HTTP error
			callbackOnError
		);
	};// */

	/**
	 *
	 * @param {function} onImageSrc - A callback function which, if successful, will be
	 *      called with the following parameters:
	 *
	 *      @callback.@param {string} imageSrc - Valid web location pointing to the requested video's thumbnail.
	 *      @callback.@param {object} data
	 *      @callback.@param {DomDocument} xmlDocument
	 *      @callback.@param {string} successMsg
	 *      @callback.@param {(JqXHR)XMLHttpRequest} $jqXHR - jQuery-wrapped XML HTTP-Request object used
	 *              in the transaction with the YouTube server.
	 *      @callback.@this {(YoutubeDataContext)} - Instance of YoutubeDataContext.
	 *
	 * @param {function} onError - A callback function which, in the event of an error, receives:
	 *
	 *      @callback.@param {string} imageSrcOnError
	 *      @callback.@param {error} error__extractThumbnailFromXml - An HTTP (XHR) request/response error,
	 *              or an exception locating the image in the XML returned by YouTube.
	 *      @callback.@param {DomDocument} xmlDocument - The raw XmlDocument (parsed) as returned by
	 *              YouTube data API, if available.
	 *      @callback.@this {(YoutubeDataContext)} - Instance of YoutubeDataContext.
	 *
	 * @param {string} defaultImageSrc - A browser-accepted 'src' value pointing to a fallback
	 *      image, if an error should occur.
	 *
	 */
	YouTube.YouTubeDataContext.prototype.getLargeThumbnail = function getLargeThumbnail(onImageSrc, onError, defaultImageSrc) {
		var dataContext = this;

		var getThumbnailArgs = $.makeArray(arguments);
		getThumbnailArgs.unshift("hqDefault"); // add parameter at beginning

		return dataContext.getThumbnail.apply(dataContext, getThumbnailArgs);
	};

	YouTube.YouTubeDataContext.prototype.getSmallThumbnail = function getSmallThumbnail(onImageSrc, onError, defaultImageSrc) {
		var dataContext = this;

		var getThumbnailArgs = $.makeArray(arguments);
		getThumbnailArgs.unshift("sqDefault"); // add parameter at beginning

		return dataContext.getThumbnail.apply(dataContext, getThumbnailArgs);
	};

	YouTube.YouTubeDataContext.prototype.getThumbnail =
	function getThumbnailGeneric(qualityConst, onImageSrc, onError, defaultImageSrc) {
		var dataContext = this;

		this.fetchYoutubeData(
			// on success from YT API
			function(data, successMsg, $jqXHR) {
				var imageSrc;
				try {
					var thumbnailData = data['data']['items']['0']['thumbnail'];
					if (!(qualityConst in thumbnailData)) {
						var error__extractThumbnailFromXml
							= "Unrecognized youtube thumbnail quality key: `"+qualityConst+"`";
						console.error(error__extractThumbnailFromXml);
						console.trace();

						console.log(
							"Invoking error handler callback.",
							onError,
							(onError? onError.toString(): String(onError))
						);

						onError.apply(
							dataContext,
							[defaultImageSrc, error__extractThumbnailFromXml, data]
						);
						return;
					}

					// Valid thumbnail key here:
					imageSrc = thumbnailData[qualityConst];
					onImageSrc.apply(dataContext, [imageSrc, successMsg, $jqXHR]);

				} catch (error__extractThumbnailFromXml) {
					onError.apply(dataContext, [defaultImageSrc, error__extractThumbnailFromXml, data]);
				}
			},
			// on error from YT API or HTTP error
			onError
		);
	};

	return YouTube;

});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ5b3V0dWJlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICpcbiAqIEBtb2R1bGUgWW91dHViZURhdGFDb250ZXh0XG4gKiBAZmlsZSB5b3V0dWJlLWRhdGEuanNcbiAqIEBhdXRob3IgRGF2aWQgUmVpbGx5IDxkcmVpbGx5QGF1dGh4Y29uc3VsdGluZy5jb20+XG4gKiBAdmVyc2lvbiAxLjE7IHJldmlzZWQgb24gMjAxNC0xMC0yNyAoREJSKVxuICovXG5kZWZpbmUoWyd0aGlyZHBhcnR5L3ZlbmRvci9qcXVlcnknLCAnY29uc29sZSddLCBmdW5jdGlvbiBkZWZpbmVZb3V0dWJlTW9kdWxlKCQsIGNvbnNvbGUpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiBAbW9kdWxlIFlvdVR1YmVcblx0ICovXG5cdHZhciBZb3VUdWJlID0ge1xuXG5cdFx0alF1ZXJ5VmVyc2lvbjogbnVsbCxcblxuXHRcdFlvdVR1YmVEYXRhQ29udGV4dDogZnVuY3Rpb24gWW91VHViZURhdGFDb250ZXh0KCkge1xuXG5cdFx0fVxuXG5cdH07XG5cblx0Ly9ub2luc3BlY3Rpb24gRnVuY3Rpb25XaXRoTXVsdGlwbGVSZXR1cm5Qb2ludHNKUyxKU1VudXNlZEdsb2JhbFN5bWJvbHNcblx0WW91VHViZS5pc0pxdWVyeUVsZW1lbnQgPSBmdW5jdGlvbiBpc0pxdWVyeUVsZW1lbnQoZWxlbWVudCkge1xuXG5cdFx0aWYgKHR5cGVvZiBlbGVtZW50ICE9PSAnb2JqZWN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHZhciBjb25zdHJ1Y3RvclN0cmluZyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihlbGVtZW50KS5jb25zdHJ1Y3Rvci50b1N0cmluZygpO1xuXG5cdFx0dmFyIHBsYWluRG9tRWxlbWVudFJlZ0V4cCA9IC9cXHMqKD86ZnVuY3Rpb24pXFxzKFteXFxzXFwoXSspXFwoW15cXCldKlxcKS4qLztcblx0XHR2YXIgcGxhaW5Eb21FbGVtZW50UmVzdWx0ID0gY29uc3RydWN0b3JTdHJpbmcubWF0Y2gocGxhaW5Eb21FbGVtZW50UmVnRXhwKTtcblx0XHRpZiAocGxhaW5Eb21FbGVtZW50UmVzdWx0ID09PSBudWxsKSB7XG5cdFx0XHQvLyBEb2Vzbid0IG1hdGNoIHRoZSBjb25zdHJ1Y3RvciBwYXR0ZXJuIGZvciBwbGFpbiBIVE1MIGVsZW1lbnRzLi4uXG5cdFx0XHQvLyBDaGVjayBqUXVlcnlcblx0XHRcdGlmICgnanF1ZXJ5JyBpbiBlbGVtZW50KSB7XG5cdFx0XHRcdFlvdVR1YmUualF1ZXJ5VmVyc2lvbiA9IGVsZW1lbnQuanF1ZXJ5O1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0WW91VHViZS5qUXVlcnlWZXJzaW9uID0gbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cblx0fS5iaW5kKFlvdVR1YmUpO1xuXG5cblx0Ly9ub2luc3BlY3Rpb24gRnVuY3Rpb25XaXRoTXVsdGlwbGVSZXR1cm5Qb2ludHNKUyxGdW5jdGlvbldpdGhNdWx0aXBsZVJldHVyblBvaW50c0pTLEZ1bmN0aW9uVG9vTG9uZ0pTXG5cdC8qKlxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHsoalF1ZXJ5KXxvYmplY3R8c3RyaW5nfSBpbml0aWFsaXplciAtIEFueSBvZiB0aGUgZm9sbG93aW5nIHdpbGwgd29yazpcblx0ICpcblx0ICogICAgICAoMSkgYSBET00gaWZyYW1lIGVsZW1lbnQgKEhUTUxJZnJhbWVFbGVtZW50KSBjb250YWluaW5nIGFuIGVtYmVkZGVkXG5cdCAqICAgICAgWW91VHViZSB2aWRlbyBhbHJlYWR5IGxvYWRlZCB2aWEgXCJzcmNcIiBzZXQgYXBwcm9wcmlhdGVseSxcblx0ICpcblx0ICogICAgICAoMikgYSBqUXVlcnktd3JhcHBlZCBzZXQgb2Ygc3VjaCBpZnJhbWVzIChvbmUgb3IgbW9yZSksIGFzIGluOlxuXHQgKiAgICAgIGBgYGpzXG5cdCAqICAgICAgICAgIHZhciB5dElmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd5b3V0dWJlLWlmcmFtZS1lbWJlZCcpO1xuXHQgKiAgICAgICAgICAkaWZyYW1lID0gJCh5dElmcmFtZSk7XG5cdCAqICAgICAgICAgIHZhciB5dERhdGFDb250ZXh0ID0gbmV3IFlvdXR1YmVEYXRhQ29udGV4dCgkaWZyYW1lKTtcblx0ICogICAgICBgYGBcblx0ICpcblx0ICogICAgICAoMykgdGhlIFlvdVR1YmUgVmlkZW8gSUQuIEZvciBleGFtcGxlLCBpbiBhIHR5cGljYWwgVmlkZW8gVVJMIHJlZmVyZW5jZWRcblx0ICogICAgICAgICAgaW4gVVJMcyBzdWNoIGFzIHRoZXNlOlxuXHQgKlxuXHQgKiAgICAgICAgICBodHRwOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9bkQ2Q2NodjNxSzBcblx0ICogICAgICAgICAgaHR0cDovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9uRDZDY2h2M3FLMD9mZWF0dXJlPXBsYXllcl9kZXRhaWxwYWdlXG5cdCAqICAgICAgICAgIGh0dHA6Ly93d3cueW91dHViZS5jb20vdi9uRDZDY2h2M3FLMD9hc2RmXG5cdCAqXG5cdCAqL1xuXHRZb3VUdWJlLllvdVR1YmVEYXRhQ29udGV4dCA9IGZ1bmN0aW9uIFlvdVR1YmVEYXRhQ29udGV4dChpbml0aWFsaXplcikge1xuXG5cdFx0dGhpcy5kYXRhQ2FjaGUgPSB7fTtcblx0XHR0aGlzLnN1Y2Nlc3NNc2dDYWNoZSA9IHt9O1xuXHRcdHRoaXMuJGpxWEhSQ2FjaGUgPSB7fTtcblxuXHRcdHRoaXMudmlkZW9JZCA9IG51bGw7XG5cdFx0dGhpcy4kaWZyYW1lID0gbnVsbDtcblx0XHR0aGlzLmlmcmFtZVNyYyA9IFwiXCI7XG5cblxuXHRcdGlmICh0eXBlb2YgaW5pdGlhbGl6ZXIgPT09ICdvYmplY3QnKSB7XG5cblx0XHRcdHZhciB1bmtub3duRWxlbWVudCA9IGluaXRpYWxpemVyO1xuXHRcdFx0dmFyIGlzSnF1ZXJ5ID0gWW91VHViZS5pc0pxdWVyeUVsZW1lbnQodW5rbm93bkVsZW1lbnQpO1xuXHRcdFx0dmFyICRlbGVtZW50ID0gaXNKcXVlcnkgPyB1bmtub3duRWxlbWVudCA6ICQodW5rbm93bkVsZW1lbnQpO1xuXG5cdFx0XHRpZiAoISgkZWxlbWVudC5hdHRyKCdzcmMnKSkpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignWW91dHViZURhdGFDb250ZXh0IGluaXRpYWxpemVyIHJlcXVpcmVzIGFuIGlmcmFtZSBvciB2aWRlby1JRC4gQWN0dWFsOiAnLCBpbml0aWFsaXplcik7XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgJGlmcmFtZSA9ICRlbGVtZW50O1xuXHRcdFx0aWYgKCRlbGVtZW50WzBdLnRhZ05hbWUudG9VcHBlckNhc2UoKSAhPT0gJ0lGUkFNRScpIHtcblx0XHRcdFx0JGlmcmFtZSA9ICRlbGVtZW50LmZpbmQoJ2lmcmFtZVtzcmNdJyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghJGlmcmFtZS5sZW5ndGgpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignQ291bGQgbm90IGZpbmQgYSB1c2FibGUgaWZyYW1lIGluIGluaXRpYWxpemVyLicpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4kaWZyYW1lID0gJGlmcmFtZTtcblxuXHRcdFx0dGhpcy5pZnJhbWVTcmMgPSAkLnRyaW0odGhpcy4kaWZyYW1lLmF0dHIoJ3NyYycpKTtcblxuXHRcdFx0aWYgKHRoaXMuaWZyYW1lU3JjLmluZGV4T2YoJ3lvdXR1YmUuY29tJykgPT09IC0xKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ05vdCBhIHlvdXR1YmUgc291cmNlLicpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblxuXHRcdFx0dGhpcy52aWRlb0lkID0gWW91VHViZS5nZXRZb3V0dWJlVmlkZW9JZEZyb21VcmwodGhpcy5pZnJhbWVTcmMpO1xuXHRcdFx0Y29uc29sZS5pbmZvKCdZb3VUdWJlRGF0YUNvbnRleHQgaW5pdGlhbGl6ZWQgZnJvbSBpZnJhbWU9Jyx0aGlzLiRpZnJhbWUsJzsgVmlkZW9JRCA9ICcsIHRoaXMudmlkZW9JZCk7XG5cblxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGluaXRpYWxpemVyID09PSAnc3RyaW5nJykge1xuXHRcdFx0dGhpcy52aWRlb0lkID0gaW5pdGlhbGl6ZXI7XG5cdFx0XHRjb25zb2xlLmluZm8oJ1lvdVR1YmVEYXRhQ29udGV4dCBpbml0aWFsaXplZCBmcm9tIFZpZGVvSUQgc3RyaW5nOyBWaWRlb0lEID0gJywgdGhpcy52aWRlb0lkKTtcblxuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0J1lvdXR1YmVEYXRhQ29udGV4dCBpbml0aWFsaXplciByZXF1aXJlcyBhbiBpZnJhbWUgb3IgdmlkZW8tSUQuIEFjdHVhbDogJyxcblx0XHRcdFx0aW5pdGlhbGl6ZXIpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0Ly9ub2luc3BlY3Rpb24gRnVuY3Rpb25XaXRoTXVsdGlwbGVSZXR1cm5Qb2ludHNKU1xuXHRZb3VUdWJlLmdldFlvdXR1YmVWaWRlb0lkRnJvbVVybCA9IGZ1bmN0aW9uIGdldFlvdXR1YmVWaWRlb0lkRnJvbVVybCh1cmwpXG5cdHtcblx0XHQvL3ZhciBzcmMgPSBcImh0dHA6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1uRDZDY2h2M3FLMD9ibGFoZmRpPWV3cndnXCI7XG5cdFx0dmFyIG1hdGNoMSA9IHVybC5tYXRjaCgveW91dHViZS5jb21cXC93YXRjaFxcP3Y9KFteXFwvJlxcPyNdKykoLiopPy8pO1xuXHRcdGlmIChtYXRjaDEgIT09IG51bGwgJiYgbWF0Y2gxLmxlbmd0aCA+PSAyKSB7XG5cdFx0XHRyZXR1cm4gbWF0Y2gxWzFdO1xuXHRcdH1cblxuXHRcdC8vdmFyIHNyYyA9IFwiaHR0cDovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9uRDZDY2h2M3FLMD9mZWF0dXJlPXBsYXllcl9kZXRhaWxwYWdlXCI7XG5cdFx0dmFyIG1hdGNoMiA9IHVybC5tYXRjaCgveW91dHViZS5jb21cXC9lbWJlZFxcLyhbXlxcLyZcXD8jXSspKC4qKT8vKTtcblx0XHRpZiAobWF0Y2gyICE9PSBudWxsICYmIG1hdGNoMi5sZW5ndGggPj0gMikge1xuXHRcdFx0cmV0dXJuIG1hdGNoMlsxXTtcblx0XHR9XG5cblx0XHQvL3ZhciBzcmMgPSBcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3YvTTdsYzFVVmYtVkU/dmVyc2lvbj0zJmF1dG9wbGF5PTFcIjtcblx0XHR2YXIgbWF0Y2gzID0gdXJsLm1hdGNoKC95b3V0dWJlLmNvbVxcL3ZcXC8oW15cXC8mXFw/I10rKSguKik/Lyk7XG5cdFx0aWYgKG1hdGNoMyAhPT0gbnVsbCAmJiBtYXRjaDMubGVuZ3RoID49IDIpIHtcblx0XHRcdHJldHVybiBtYXRjaDNbMV07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFwiXCI7XG5cdH07XG5cblx0WW91VHViZS5Zb3VUdWJlRGF0YUNvbnRleHQucHJvdG90eXBlLmZldGNoWW91dHViZURhdGEgPSBmdW5jdGlvbiBmZXRjaFlvdXR1YmVEYXRhKGNhbGxiYWNrT25EYXRhLCBjYWxsYmFja09uRXJyb3IpIHtcblxuXHRcdGlmICh0aGlzLnZpZGVvSWQgaW4gdGhpcy5kYXRhQ2FjaGUpIHtcblxuXHRcdFx0Y2FsbGJhY2tPbkRhdGEuYXBwbHkoXG5cdFx0XHRcdHRoaXMuJGpxWEhSQ2FjaGVbdGhpcy52aWRlb0lkXSxcblx0XHRcdFx0W1xuXHRcdFx0XHRcdHRoaXMuZGF0YUNhY2hlW3RoaXMudmlkZW9JZF0sXG5cdFx0XHRcdFx0dGhpcy5zdWNjZXNzTXNnQ2FjaGVbdGhpcy52aWRlb0lkXSxcblx0XHRcdFx0XHR0aGlzLiRqcVhIUkNhY2hlW3RoaXMudmlkZW9JZF1cblx0XHRcdFx0XVxuXHRcdFx0KTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHZhciB0aGlzRGF0YUNvbnRleHQgPSB0aGlzO1xuXG5cdFx0XHQkLmdldChcIi8vZ2RhdGEueW91dHViZS5jb20vZmVlZHMvYXBpL3ZpZGVvcz9xPVwiICsgdGhpcy52aWRlb0lkICsgJyZtYXgtcmVzdWx0cz0xJnY9MiZhbHQ9anNvbmMnLFxuXHRcdFx0XHRmdW5jdGlvbiAoZGF0YSwgc3VjY2Vzc01zZywgJGpxWEhSKSB7XG5cblx0XHRcdFx0XHRpZiAoc3VjY2Vzc01zZyA9PT0gXCJzdWNjZXNzXCIpIHtcblxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ0RhdGEgcmV0dXJuZWQgZnJvbSBZb3VUdWJlIEFQSTogJywgZGF0YSk7XG5cblx0XHRcdFx0XHRcdHRoaXNEYXRhQ29udGV4dC5kYXRhQ2FjaGVbdGhpc0RhdGFDb250ZXh0LnZpZGVvSWRdID0gZGF0YTtcblx0XHRcdFx0XHRcdHRoaXNEYXRhQ29udGV4dC5zdWNjZXNzTXNnQ2FjaGVbdGhpc0RhdGFDb250ZXh0LnZpZGVvSWRdID0gc3VjY2Vzc01zZztcblx0XHRcdFx0XHRcdHRoaXNEYXRhQ29udGV4dC4kanFYSFJDYWNoZVt0aGlzRGF0YUNvbnRleHQudmlkZW9JZF0gPSAkanFYSFI7XG5cblx0XHRcdFx0XHRcdGNhbGxiYWNrT25EYXRhLmFwcGx5KCRqcVhIUiwgW2RhdGEsIHN1Y2Nlc3NNc2csICRqcVhIUl0pO1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiWW91VHViZSBkYXRhIGZldGNoIC0tIGVycm9yOiAnXCIgKyBzdWNjZXNzTXNnICsgXCInXCIpO1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2tPbkVycm9yLmFwcGx5KCRqcVhIUiwgW3N1Y2Nlc3NNc2csICRqcVhIUiwgZGF0YV0pO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qXG5cdFlvdVR1YmUuWW91VHViZURhdGFDb250ZXh0LnByb3RvdHlwZS5nZXRTbWFsbFRodW1ibmFpbCA9IGZ1bmN0aW9uKGNhbGxiYWNrT25JbWFnZVNyYywgY2FsbGJhY2tPbkVycm9yLCBpbWFnZVNyY09uRXJyb3IpIHtcblx0XHR2YXIgZGF0YUNvbnRleHQgPSB0aGlzO1xuXG5cdFx0dGhpcy5mZXRjaFlvdXR1YmVEYXRhKFxuXHRcdFx0Ly8gb24gc3VjY2VzcyBmcm9tIFlUIEFQSVxuXHRcdFx0ZnVuY3Rpb24oZGF0YSwgeG1sRG9jdW1lbnQsIHN1Y2Nlc3NNc2csICRqcVhIUikge1xuXHRcdFx0XHR2YXIgaW1hZ2VTcmM7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHRodW1ibmFpbFNldCA9IGRhdGFbJ2VudHJ5J11bJ21lZGlhOmdyb3VwJ11bJ21lZGlhOnRodW1ibmFpbCddO1xuXHRcdFx0XHRcdGltYWdlU3JjID0gdGh1bWJuYWlsU2V0W3RodW1ibmFpbFNldC5sZW5ndGggLSAxXVsndXJsJ107XG5cdFx0XHRcdFx0Y2FsbGJhY2tPbkltYWdlU3JjLmFwcGx5KGRhdGFDb250ZXh0LCBbaW1hZ2VTcmMsIGRhdGEsIHhtbERvY3VtZW50LCBzdWNjZXNzTXNnLCAkanFYSFJdKTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3JfX2V4dHJhY3RUaHVtYm5haWxGcm9tWG1sKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2tPbkVycm9yLmFwcGx5KGRhdGFDb250ZXh0LCBbaW1hZ2VTcmNPbkVycm9yLCBlcnJvcl9fZXh0cmFjdFRodW1ibmFpbEZyb21YbWwsIHhtbERvY3VtZW50XSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQvLyBvbiBlcnJvciBmcm9tIFlUIEFQSSBvciBIVFRQIGVycm9yXG5cdFx0XHRjYWxsYmFja09uRXJyb3Jcblx0XHQpO1xuXHR9Oy8vICovXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uSW1hZ2VTcmMgLSBBIGNhbGxiYWNrIGZ1bmN0aW9uIHdoaWNoLCBpZiBzdWNjZXNzZnVsLCB3aWxsIGJlXG5cdCAqICAgICAgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuXHQgKlxuXHQgKiAgICAgIEBjYWxsYmFjay5AcGFyYW0ge3N0cmluZ30gaW1hZ2VTcmMgLSBWYWxpZCB3ZWIgbG9jYXRpb24gcG9pbnRpbmcgdG8gdGhlIHJlcXVlc3RlZCB2aWRlbydzIHRodW1ibmFpbC5cblx0ICogICAgICBAY2FsbGJhY2suQHBhcmFtIHtvYmplY3R9IGRhdGFcblx0ICogICAgICBAY2FsbGJhY2suQHBhcmFtIHtEb21Eb2N1bWVudH0geG1sRG9jdW1lbnRcblx0ICogICAgICBAY2FsbGJhY2suQHBhcmFtIHtzdHJpbmd9IHN1Y2Nlc3NNc2dcblx0ICogICAgICBAY2FsbGJhY2suQHBhcmFtIHsoSnFYSFIpWE1MSHR0cFJlcXVlc3R9ICRqcVhIUiAtIGpRdWVyeS13cmFwcGVkIFhNTCBIVFRQLVJlcXVlc3Qgb2JqZWN0IHVzZWRcblx0ICogICAgICAgICAgICAgIGluIHRoZSB0cmFuc2FjdGlvbiB3aXRoIHRoZSBZb3VUdWJlIHNlcnZlci5cblx0ICogICAgICBAY2FsbGJhY2suQHRoaXMgeyhZb3V0dWJlRGF0YUNvbnRleHQpfSAtIEluc3RhbmNlIG9mIFlvdXR1YmVEYXRhQ29udGV4dC5cblx0ICpcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gb25FcnJvciAtIEEgY2FsbGJhY2sgZnVuY3Rpb24gd2hpY2gsIGluIHRoZSBldmVudCBvZiBhbiBlcnJvciwgcmVjZWl2ZXM6XG5cdCAqXG5cdCAqICAgICAgQGNhbGxiYWNrLkBwYXJhbSB7c3RyaW5nfSBpbWFnZVNyY09uRXJyb3Jcblx0ICogICAgICBAY2FsbGJhY2suQHBhcmFtIHtlcnJvcn0gZXJyb3JfX2V4dHJhY3RUaHVtYm5haWxGcm9tWG1sIC0gQW4gSFRUUCAoWEhSKSByZXF1ZXN0L3Jlc3BvbnNlIGVycm9yLFxuXHQgKiAgICAgICAgICAgICAgb3IgYW4gZXhjZXB0aW9uIGxvY2F0aW5nIHRoZSBpbWFnZSBpbiB0aGUgWE1MIHJldHVybmVkIGJ5IFlvdVR1YmUuXG5cdCAqICAgICAgQGNhbGxiYWNrLkBwYXJhbSB7RG9tRG9jdW1lbnR9IHhtbERvY3VtZW50IC0gVGhlIHJhdyBYbWxEb2N1bWVudCAocGFyc2VkKSBhcyByZXR1cm5lZCBieVxuXHQgKiAgICAgICAgICAgICAgWW91VHViZSBkYXRhIEFQSSwgaWYgYXZhaWxhYmxlLlxuXHQgKiAgICAgIEBjYWxsYmFjay5AdGhpcyB7KFlvdXR1YmVEYXRhQ29udGV4dCl9IC0gSW5zdGFuY2Ugb2YgWW91dHViZURhdGFDb250ZXh0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGVmYXVsdEltYWdlU3JjIC0gQSBicm93c2VyLWFjY2VwdGVkICdzcmMnIHZhbHVlIHBvaW50aW5nIHRvIGEgZmFsbGJhY2tcblx0ICogICAgICBpbWFnZSwgaWYgYW4gZXJyb3Igc2hvdWxkIG9jY3VyLlxuXHQgKlxuXHQgKi9cblx0WW91VHViZS5Zb3VUdWJlRGF0YUNvbnRleHQucHJvdG90eXBlLmdldExhcmdlVGh1bWJuYWlsID0gZnVuY3Rpb24gZ2V0TGFyZ2VUaHVtYm5haWwob25JbWFnZVNyYywgb25FcnJvciwgZGVmYXVsdEltYWdlU3JjKSB7XG5cdFx0dmFyIGRhdGFDb250ZXh0ID0gdGhpcztcblxuXHRcdHZhciBnZXRUaHVtYm5haWxBcmdzID0gJC5tYWtlQXJyYXkoYXJndW1lbnRzKTtcblx0XHRnZXRUaHVtYm5haWxBcmdzLnVuc2hpZnQoXCJocURlZmF1bHRcIik7IC8vIGFkZCBwYXJhbWV0ZXIgYXQgYmVnaW5uaW5nXG5cblx0XHRyZXR1cm4gZGF0YUNvbnRleHQuZ2V0VGh1bWJuYWlsLmFwcGx5KGRhdGFDb250ZXh0LCBnZXRUaHVtYm5haWxBcmdzKTtcblx0fTtcblxuXHRZb3VUdWJlLllvdVR1YmVEYXRhQ29udGV4dC5wcm90b3R5cGUuZ2V0U21hbGxUaHVtYm5haWwgPSBmdW5jdGlvbiBnZXRTbWFsbFRodW1ibmFpbChvbkltYWdlU3JjLCBvbkVycm9yLCBkZWZhdWx0SW1hZ2VTcmMpIHtcblx0XHR2YXIgZGF0YUNvbnRleHQgPSB0aGlzO1xuXG5cdFx0dmFyIGdldFRodW1ibmFpbEFyZ3MgPSAkLm1ha2VBcnJheShhcmd1bWVudHMpO1xuXHRcdGdldFRodW1ibmFpbEFyZ3MudW5zaGlmdChcInNxRGVmYXVsdFwiKTsgLy8gYWRkIHBhcmFtZXRlciBhdCBiZWdpbm5pbmdcblxuXHRcdHJldHVybiBkYXRhQ29udGV4dC5nZXRUaHVtYm5haWwuYXBwbHkoZGF0YUNvbnRleHQsIGdldFRodW1ibmFpbEFyZ3MpO1xuXHR9O1xuXG5cdFlvdVR1YmUuWW91VHViZURhdGFDb250ZXh0LnByb3RvdHlwZS5nZXRUaHVtYm5haWwgPVxuXHRmdW5jdGlvbiBnZXRUaHVtYm5haWxHZW5lcmljKHF1YWxpdHlDb25zdCwgb25JbWFnZVNyYywgb25FcnJvciwgZGVmYXVsdEltYWdlU3JjKSB7XG5cdFx0dmFyIGRhdGFDb250ZXh0ID0gdGhpcztcblxuXHRcdHRoaXMuZmV0Y2hZb3V0dWJlRGF0YShcblx0XHRcdC8vIG9uIHN1Y2Nlc3MgZnJvbSBZVCBBUElcblx0XHRcdGZ1bmN0aW9uKGRhdGEsIHN1Y2Nlc3NNc2csICRqcVhIUikge1xuXHRcdFx0XHR2YXIgaW1hZ2VTcmM7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHRodW1ibmFpbERhdGEgPSBkYXRhWydkYXRhJ11bJ2l0ZW1zJ11bJzAnXVsndGh1bWJuYWlsJ107XG5cdFx0XHRcdFx0aWYgKCEocXVhbGl0eUNvbnN0IGluIHRodW1ibmFpbERhdGEpKSB7XG5cdFx0XHRcdFx0XHR2YXIgZXJyb3JfX2V4dHJhY3RUaHVtYm5haWxGcm9tWG1sXG5cdFx0XHRcdFx0XHRcdD0gXCJVbnJlY29nbml6ZWQgeW91dHViZSB0aHVtYm5haWwgcXVhbGl0eSBrZXk6IGBcIitxdWFsaXR5Q29uc3QrXCJgXCI7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yX19leHRyYWN0VGh1bWJuYWlsRnJvbVhtbCk7XG5cdFx0XHRcdFx0XHRjb25zb2xlLnRyYWNlKCk7XG5cblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdFx0XHRcIkludm9raW5nIGVycm9yIGhhbmRsZXIgY2FsbGJhY2suXCIsXG5cdFx0XHRcdFx0XHRcdG9uRXJyb3IsXG5cdFx0XHRcdFx0XHRcdChvbkVycm9yPyBvbkVycm9yLnRvU3RyaW5nKCk6IFN0cmluZyhvbkVycm9yKSlcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdG9uRXJyb3IuYXBwbHkoXG5cdFx0XHRcdFx0XHRcdGRhdGFDb250ZXh0LFxuXHRcdFx0XHRcdFx0XHRbZGVmYXVsdEltYWdlU3JjLCBlcnJvcl9fZXh0cmFjdFRodW1ibmFpbEZyb21YbWwsIGRhdGFdXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFZhbGlkIHRodW1ibmFpbCBrZXkgaGVyZTpcblx0XHRcdFx0XHRpbWFnZVNyYyA9IHRodW1ibmFpbERhdGFbcXVhbGl0eUNvbnN0XTtcblx0XHRcdFx0XHRvbkltYWdlU3JjLmFwcGx5KGRhdGFDb250ZXh0LCBbaW1hZ2VTcmMsIHN1Y2Nlc3NNc2csICRqcVhIUl0pO1xuXG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yX19leHRyYWN0VGh1bWJuYWlsRnJvbVhtbCkge1xuXHRcdFx0XHRcdG9uRXJyb3IuYXBwbHkoZGF0YUNvbnRleHQsIFtkZWZhdWx0SW1hZ2VTcmMsIGVycm9yX19leHRyYWN0VGh1bWJuYWlsRnJvbVhtbCwgZGF0YV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Ly8gb24gZXJyb3IgZnJvbSBZVCBBUEkgb3IgSFRUUCBlcnJvclxuXHRcdFx0b25FcnJvclxuXHRcdCk7XG5cdH07XG5cblx0cmV0dXJuIFlvdVR1YmU7XG5cbn0pO1xuIl0sImZpbGUiOiJ5b3V0dWJlLmpzIn0=


}
/*
     FILE ARCHIVED ON 19:57:26 Oct 17, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:52:07 Oct 28, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 264.054
  exclusion.robots: 0.239
  exclusion.robots.policy: 0.232
  RedisCDXSource: 8.084
  esindex: 0.01
  LoadShardBlock: 233.864 (3)
  PetaboxLoader3.datanode: 241.183 (4)
  CDXLines.iter: 19.799 (3)
  load_resource: 149.679
  PetaboxLoader3.resolve: 50.96
*/