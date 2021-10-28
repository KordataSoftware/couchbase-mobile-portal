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


	var Navigation = function() {
		this.init();
	};

	Navigation.prototype = {
		init: function() {
			var attributes = {
				'aria-controls': 'primary-navigation__wrapper',
				'aria-pressed': 'false',
				'class': 'primary-navigation__toggler',
				'type': 'button'
			};

			this.el = document.getElementById('primary-navigation');
			this.wrapper = document.getElementById('primary-navigation__wrapper');
			this.toggler = document.createElement('button');

			for (var attr in attributes) {
				this.toggler.setAttribute(attr, attributes[attr]);
			}

			this.toggler.innerHTML = '<span>Menu</span>';
			this.toggler.addEventListener('click', this.click.bind(this));

			this.wrapper.setAttribute('aria-expanded', 'false');

			this.el.insertBefore(this.toggler, this.wrapper);
		},

		click: function(event) {
			event.preventDefault();

			var isPressed = this.toggler.getAttribute('aria-pressed') !== 'true';

			this.wrapper.setAttribute('aria-expanded', isPressed);
			this.toggler.setAttribute('aria-pressed', isPressed);
		}
	};

	return Navigation;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJuYXZpZ2F0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImRlZmluZShmdW5jdGlvbigpIHtcblxuXG5cdHZhciBOYXZpZ2F0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pbml0KCk7XG5cdH07XG5cblx0TmF2aWdhdGlvbi5wcm90b3R5cGUgPSB7XG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IHtcblx0XHRcdFx0J2FyaWEtY29udHJvbHMnOiAncHJpbWFyeS1uYXZpZ2F0aW9uX193cmFwcGVyJyxcblx0XHRcdFx0J2FyaWEtcHJlc3NlZCc6ICdmYWxzZScsXG5cdFx0XHRcdCdjbGFzcyc6ICdwcmltYXJ5LW5hdmlnYXRpb25fX3RvZ2dsZXInLFxuXHRcdFx0XHQndHlwZSc6ICdidXR0b24nXG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByaW1hcnktbmF2aWdhdGlvbicpO1xuXHRcdFx0dGhpcy53cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByaW1hcnktbmF2aWdhdGlvbl9fd3JhcHBlcicpO1xuXHRcdFx0dGhpcy50b2dnbGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cblx0XHRcdGZvciAodmFyIGF0dHIgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHR0aGlzLnRvZ2dsZXIuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJpYnV0ZXNbYXR0cl0pO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnRvZ2dsZXIuaW5uZXJIVE1MID0gJzxzcGFuPk1lbnU8L3NwYW4+Jztcblx0XHRcdHRoaXMudG9nZ2xlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xpY2suYmluZCh0aGlzKSk7XG5cblx0XHRcdHRoaXMud3JhcHBlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcblxuXHRcdFx0dGhpcy5lbC5pbnNlcnRCZWZvcmUodGhpcy50b2dnbGVyLCB0aGlzLndyYXBwZXIpO1xuXHRcdH0sXG5cblx0XHRjbGljazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHZhciBpc1ByZXNzZWQgPSB0aGlzLnRvZ2dsZXIuZ2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnKSAhPT0gJ3RydWUnO1xuXG5cdFx0XHR0aGlzLndyYXBwZXIuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgaXNQcmVzc2VkKTtcblx0XHRcdHRoaXMudG9nZ2xlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcsIGlzUHJlc3NlZCk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBOYXZpZ2F0aW9uO1xufSk7XG4iXSwiZmlsZSI6Im5hdmlnYXRpb24uanMifQ==


}
/*
     FILE ARCHIVED ON 19:57:25 Oct 17, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:51:22 Oct 28, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 85.319
  exclusion.robots: 0.163
  exclusion.robots.policy: 0.154
  RedisCDXSource: 0.725
  esindex: 0.009
  LoadShardBlock: 56.533 (3)
  PetaboxLoader3.datanode: 67.211 (4)
  CDXLines.iter: 25.676 (3)
  load_resource: 66.704
  PetaboxLoader3.resolve: 30.212
*/