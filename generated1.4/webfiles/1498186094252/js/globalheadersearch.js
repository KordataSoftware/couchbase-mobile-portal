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

define(function() {
	var GlobalHeaderSearch = function() {
		this.init();
	};

	GlobalHeaderSearch.prototype = {
		init: function() {
			var attributes = {
				'aria-controls': 'global-header-search__items',
				'aria-pressed': 'false',
				'class': 'global-header-search__toggler',
				'type': 'button'
			};

			this.el = document.querySelector('#global-header-search');
			this.searchInput = this.el.querySelector('input[type="search"]');
			this.toggler = document.createElement('button');

			for (var attr in attributes) {
				this.toggler.setAttribute(attr, attributes[attr]);
			}

			this.toggler.innerHTML = '<span>Search</span>';
			this.toggler.addEventListener('click', this.click.bind(this));

			this.el.setAttribute('aria-expanded', 'false');
			this.el.appendChild(this.toggler);
			this.el.classList.add('global-header-search--js');
		},

		click: function(event) {
			event.preventDefault();

			var isPressed = this.toggler.getAttribute('aria-pressed') !== 'true';

			this.el.setAttribute('aria-expanded', isPressed);
			this.toggler.setAttribute('aria-pressed', isPressed);

			if (isPressed) {
				this.searchInput.focus();
			} else {
				this.toggler.focus();
			}
		}
	};

	return GlobalHeaderSearch;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJnbG9iYWxoZWFkZXJzZWFyY2guanMiXSwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKGZ1bmN0aW9uKCkge1xuXHR2YXIgR2xvYmFsSGVhZGVyU2VhcmNoID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pbml0KCk7XG5cdH07XG5cblx0R2xvYmFsSGVhZGVyU2VhcmNoLnByb3RvdHlwZSA9IHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0ge1xuXHRcdFx0XHQnYXJpYS1jb250cm9scyc6ICdnbG9iYWwtaGVhZGVyLXNlYXJjaF9faXRlbXMnLFxuXHRcdFx0XHQnYXJpYS1wcmVzc2VkJzogJ2ZhbHNlJyxcblx0XHRcdFx0J2NsYXNzJzogJ2dsb2JhbC1oZWFkZXItc2VhcmNoX190b2dnbGVyJyxcblx0XHRcdFx0J3R5cGUnOiAnYnV0dG9uJ1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnbG9iYWwtaGVhZGVyLXNlYXJjaCcpO1xuXHRcdFx0dGhpcy5zZWFyY2hJbnB1dCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInNlYXJjaFwiXScpO1xuXHRcdFx0dGhpcy50b2dnbGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cblx0XHRcdGZvciAodmFyIGF0dHIgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHR0aGlzLnRvZ2dsZXIuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJpYnV0ZXNbYXR0cl0pO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnRvZ2dsZXIuaW5uZXJIVE1MID0gJzxzcGFuPlNlYXJjaDwvc3Bhbj4nO1xuXHRcdFx0dGhpcy50b2dnbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbGljay5iaW5kKHRoaXMpKTtcblxuXHRcdFx0dGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcblx0XHRcdHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy50b2dnbGVyKTtcblx0XHRcdHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnZ2xvYmFsLWhlYWRlci1zZWFyY2gtLWpzJyk7XG5cdFx0fSxcblxuXHRcdGNsaWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0dmFyIGlzUHJlc3NlZCA9IHRoaXMudG9nZ2xlci5nZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcpICE9PSAndHJ1ZSc7XG5cblx0XHRcdHRoaXMuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgaXNQcmVzc2VkKTtcblx0XHRcdHRoaXMudG9nZ2xlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcsIGlzUHJlc3NlZCk7XG5cblx0XHRcdGlmIChpc1ByZXNzZWQpIHtcblx0XHRcdFx0dGhpcy5zZWFyY2hJbnB1dC5mb2N1cygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy50b2dnbGVyLmZvY3VzKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBHbG9iYWxIZWFkZXJTZWFyY2g7XG59KTsiXSwiZmlsZSI6Imdsb2JhbGhlYWRlcnNlYXJjaC5qcyJ9


}
/*
     FILE ARCHIVED ON 19:57:25 Oct 17, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:51:35 Oct 28, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 321.463
  exclusion.robots: 0.505
  exclusion.robots.policy: 0.493
  RedisCDXSource: 32.919
  esindex: 0.014
  LoadShardBlock: 264.833 (3)
  PetaboxLoader3.datanode: 178.165 (4)
  CDXLines.iter: 20.687 (3)
  load_resource: 117.16
  PetaboxLoader3.resolve: 51.036
*/