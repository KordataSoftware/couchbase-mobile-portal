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

define(['thirdparty/vendor/jquery', 'console'], function($, Console) {


	var Videoblock = function() {
		var $modules = $('.videoblock:not(.processed)');

		Console.log('Videoblock(): found ',$modules.length,' unprocessed .videoblock elements.');

		for (var i = 0, j = $modules.length; i < j; i++) {

			Console.log('Videoblock() loop: Processing element: ',$modules.get(i));

			var videoblockModule = new VideoblockModule($modules.get(i));
			Console.log('Videoblock() loop: --- New module: ',videoblockModule);

			$($modules.get(i)).addClass('processed');
		}
	};

	var VideoblockModule = function(el) {
		this.el = el;

		this.init();
	};

	VideoblockModule.prototype = {
		init: function() {
			this.container = this.el.querySelector('.videoblock__content');
			this.iframe = this.el.querySelector('iframe');

			this.button = document.createElement('button');
			this.button.innerHTML = '<span>Play</span>';
			this.button.setAttribute('class', 'videoblock__button');
			this.button.setAttribute('type', 'button');

			this.button.addEventListener('click', this.click.bind(this));

			this.cover = document.createElement('div');
			this.cover.setAttribute('class', 'videoblock__cover');

			this.container.appendChild(this.cover);
			this.container.appendChild(this.button);
		},

		click: function(event) {
			event.preventDefault();

			this.container.removeChild(this.button);
			this.container.removeChild(this.cover);
			this.iframe.setAttribute('src', this.iframe.getAttribute('src') + '?autoplay=1');
		}
	};

	return Videoblock;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ2aWRlb2Jsb2NrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImRlZmluZShbJ3RoaXJkcGFydHkvdmVuZG9yL2pxdWVyeScsICdjb25zb2xlJ10sIGZ1bmN0aW9uKCQsIENvbnNvbGUpIHtcblxuXG5cdHZhciBWaWRlb2Jsb2NrID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyICRtb2R1bGVzID0gJCgnLnZpZGVvYmxvY2s6bm90KC5wcm9jZXNzZWQpJyk7XG5cblx0XHRDb25zb2xlLmxvZygnVmlkZW9ibG9jaygpOiBmb3VuZCAnLCRtb2R1bGVzLmxlbmd0aCwnIHVucHJvY2Vzc2VkIC52aWRlb2Jsb2NrIGVsZW1lbnRzLicpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGogPSAkbW9kdWxlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblxuXHRcdFx0Q29uc29sZS5sb2coJ1ZpZGVvYmxvY2soKSBsb29wOiBQcm9jZXNzaW5nIGVsZW1lbnQ6ICcsJG1vZHVsZXMuZ2V0KGkpKTtcblxuXHRcdFx0dmFyIHZpZGVvYmxvY2tNb2R1bGUgPSBuZXcgVmlkZW9ibG9ja01vZHVsZSgkbW9kdWxlcy5nZXQoaSkpO1xuXHRcdFx0Q29uc29sZS5sb2coJ1ZpZGVvYmxvY2soKSBsb29wOiAtLS0gTmV3IG1vZHVsZTogJyx2aWRlb2Jsb2NrTW9kdWxlKTtcblxuXHRcdFx0JCgkbW9kdWxlcy5nZXQoaSkpLmFkZENsYXNzKCdwcm9jZXNzZWQnKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIFZpZGVvYmxvY2tNb2R1bGUgPSBmdW5jdGlvbihlbCkge1xuXHRcdHRoaXMuZWwgPSBlbDtcblxuXHRcdHRoaXMuaW5pdCgpO1xuXHR9O1xuXG5cdFZpZGVvYmxvY2tNb2R1bGUucHJvdG90eXBlID0ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5jb250YWluZXIgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy52aWRlb2Jsb2NrX19jb250ZW50Jyk7XG5cdFx0XHR0aGlzLmlmcmFtZSA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignaWZyYW1lJyk7XG5cblx0XHRcdHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdFx0XHR0aGlzLmJ1dHRvbi5pbm5lckhUTUwgPSAnPHNwYW4+UGxheTwvc3Bhbj4nO1xuXHRcdFx0dGhpcy5idXR0b24uc2V0QXR0cmlidXRlKCdjbGFzcycsICd2aWRlb2Jsb2NrX19idXR0b24nKTtcblx0XHRcdHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcblxuXHRcdFx0dGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrLmJpbmQodGhpcykpO1xuXG5cdFx0XHR0aGlzLmNvdmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHR0aGlzLmNvdmVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndmlkZW9ibG9ja19fY292ZXInKTtcblxuXHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb3Zlcik7XG5cdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmJ1dHRvbik7XG5cdFx0fSxcblxuXHRcdGNsaWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0dGhpcy5jb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5idXR0b24pO1xuXHRcdFx0dGhpcy5jb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5jb3Zlcik7XG5cdFx0XHR0aGlzLmlmcmFtZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHRoaXMuaWZyYW1lLmdldEF0dHJpYnV0ZSgnc3JjJykgKyAnP2F1dG9wbGF5PTEnKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIFZpZGVvYmxvY2s7XG59KTtcbiJdLCJmaWxlIjoidmlkZW9ibG9jay5qcyJ9


}
/*
     FILE ARCHIVED ON 19:57:26 Oct 17, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:51:58 Oct 28, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 147.942
  exclusion.robots: 0.225
  exclusion.robots.policy: 0.216
  RedisCDXSource: 1.909
  esindex: 0.015
  LoadShardBlock: 124.001 (3)
  PetaboxLoader3.datanode: 121.612 (4)
  CDXLines.iter: 19.554 (3)
  load_resource: 97.379
  PetaboxLoader3.resolve: 25.333
*/