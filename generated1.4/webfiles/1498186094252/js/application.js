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

define(
	[
		'require',
		'jquery',
		'console'
	],

	function(require, $, console) {


		var pageSpecificModules = [];

		/**
		 * @module Application
		 * @type {{modulesList: [], modulesByName: {}}}
		 */
		var Application = {
			modulesList: ['content-block-item'],
			modulesByName: {
				"content-block-item": {}
			}
		};

		//alert("This is A TEST");

		var $moduleNamingElements = $('*[data-modules], *[data-module]');
		console.log('module naming elements', $moduleNamingElements);

		$moduleNamingElements.each(function(idx, elem) {

			var elementModuleList = [];
			var strModuleList = $(elem).data('modules');

			if (strModuleList.indexOf(',') !== -1) {
				elementModuleList = strModuleList.split(',');
			} else if (strModuleList.indexOf(' ') !== -1) {
				elementModuleList = strModuleList.split(/[ \r\n\t]+/);
			} else {
				// single module
				elementModuleList = [strModuleList];
			}

			$.each(elementModuleList, function(midx, moduleName) {

				if (typeof moduleName !== 'string') return;
				// skip if module already in required-list
				if (moduleName in Application.modulesByName) return;

				moduleName = $.trim(moduleName);
				if (!moduleName.length) return;

				Application.modulesList.push(moduleName);
				Application.modulesByName[moduleName] = {};

			});
		});

		console.log('Modules list for this page: ', Application.modulesList);

		$.each(Application.modulesList, function(midx, moduleName) {
			var moduleRequirejsName = moduleName;

			console.group("Requiring module "+moduleName);
			console.log('Requiring module from page: '+moduleName);


			require([moduleRequirejsName], function (module) {

				console.log('Value of module "'+moduleRequirejsName+'": ', module);

				console.log('Checking if "'+moduleName+'" is a singleton that requires outside instantiation.');
				try {
					if (typeof module === 'function') {
						//var proto = module.prototype;
						console.log('.. Yes; Creating singleton instance of '+moduleName+' retval..');

						var singleton = new (module.bind(module))();
						module = singleton;
						console.info('.. the newly-created singleton of '+moduleName+': ', module);
					} else {
						console.log('.. No. Just taking the return value from the module define() call,'
								+"\n    so the value of module '"+moduleName+"' is: ",module);
					}
				} catch (error) {
					console.warn(error);
				}

				console.groupEnd("Requiring module "+moduleName);

				Application.modulesByName[moduleName] = module;

			});

		});

		window.Application = Application;
		return Application;

	}
);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHBsaWNhdGlvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoXG5cdFtcblx0XHQncmVxdWlyZScsXG5cdFx0J2pxdWVyeScsXG5cdFx0J2NvbnNvbGUnXG5cdF0sXG5cblx0ZnVuY3Rpb24ocmVxdWlyZSwgJCwgY29uc29sZSkge1xuXG5cblx0XHR2YXIgcGFnZVNwZWNpZmljTW9kdWxlcyA9IFtdO1xuXG5cdFx0LyoqXG5cdFx0ICogQG1vZHVsZSBBcHBsaWNhdGlvblxuXHRcdCAqIEB0eXBlIHt7bW9kdWxlc0xpc3Q6IFtdLCBtb2R1bGVzQnlOYW1lOiB7fX19XG5cdFx0ICovXG5cdFx0dmFyIEFwcGxpY2F0aW9uID0ge1xuXHRcdFx0bW9kdWxlc0xpc3Q6IFsnY29udGVudC1ibG9jay1pdGVtJ10sXG5cdFx0XHRtb2R1bGVzQnlOYW1lOiB7XG5cdFx0XHRcdFwiY29udGVudC1ibG9jay1pdGVtXCI6IHt9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vYWxlcnQoXCJUaGlzIGlzIEEgVEVTVFwiKTtcblxuXHRcdHZhciAkbW9kdWxlTmFtaW5nRWxlbWVudHMgPSAkKCcqW2RhdGEtbW9kdWxlc10sICpbZGF0YS1tb2R1bGVdJyk7XG5cdFx0Y29uc29sZS5sb2coJ21vZHVsZSBuYW1pbmcgZWxlbWVudHMnLCAkbW9kdWxlTmFtaW5nRWxlbWVudHMpO1xuXG5cdFx0JG1vZHVsZU5hbWluZ0VsZW1lbnRzLmVhY2goZnVuY3Rpb24oaWR4LCBlbGVtKSB7XG5cblx0XHRcdHZhciBlbGVtZW50TW9kdWxlTGlzdCA9IFtdO1xuXHRcdFx0dmFyIHN0ck1vZHVsZUxpc3QgPSAkKGVsZW0pLmRhdGEoJ21vZHVsZXMnKTtcblxuXHRcdFx0aWYgKHN0ck1vZHVsZUxpc3QuaW5kZXhPZignLCcpICE9PSAtMSkge1xuXHRcdFx0XHRlbGVtZW50TW9kdWxlTGlzdCA9IHN0ck1vZHVsZUxpc3Quc3BsaXQoJywnKTtcblx0XHRcdH0gZWxzZSBpZiAoc3RyTW9kdWxlTGlzdC5pbmRleE9mKCcgJykgIT09IC0xKSB7XG5cdFx0XHRcdGVsZW1lbnRNb2R1bGVMaXN0ID0gc3RyTW9kdWxlTGlzdC5zcGxpdCgvWyBcXHJcXG5cXHRdKy8pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gc2luZ2xlIG1vZHVsZVxuXHRcdFx0XHRlbGVtZW50TW9kdWxlTGlzdCA9IFtzdHJNb2R1bGVMaXN0XTtcblx0XHRcdH1cblxuXHRcdFx0JC5lYWNoKGVsZW1lbnRNb2R1bGVMaXN0LCBmdW5jdGlvbihtaWR4LCBtb2R1bGVOYW1lKSB7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBtb2R1bGVOYW1lICE9PSAnc3RyaW5nJykgcmV0dXJuO1xuXHRcdFx0XHQvLyBza2lwIGlmIG1vZHVsZSBhbHJlYWR5IGluIHJlcXVpcmVkLWxpc3Rcblx0XHRcdFx0aWYgKG1vZHVsZU5hbWUgaW4gQXBwbGljYXRpb24ubW9kdWxlc0J5TmFtZSkgcmV0dXJuO1xuXG5cdFx0XHRcdG1vZHVsZU5hbWUgPSAkLnRyaW0obW9kdWxlTmFtZSk7XG5cdFx0XHRcdGlmICghbW9kdWxlTmFtZS5sZW5ndGgpIHJldHVybjtcblxuXHRcdFx0XHRBcHBsaWNhdGlvbi5tb2R1bGVzTGlzdC5wdXNoKG1vZHVsZU5hbWUpO1xuXHRcdFx0XHRBcHBsaWNhdGlvbi5tb2R1bGVzQnlOYW1lW21vZHVsZU5hbWVdID0ge307XG5cblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0Y29uc29sZS5sb2coJ01vZHVsZXMgbGlzdCBmb3IgdGhpcyBwYWdlOiAnLCBBcHBsaWNhdGlvbi5tb2R1bGVzTGlzdCk7XG5cblx0XHQkLmVhY2goQXBwbGljYXRpb24ubW9kdWxlc0xpc3QsIGZ1bmN0aW9uKG1pZHgsIG1vZHVsZU5hbWUpIHtcblx0XHRcdHZhciBtb2R1bGVSZXF1aXJlanNOYW1lID0gbW9kdWxlTmFtZTtcblxuXHRcdFx0Y29uc29sZS5ncm91cChcIlJlcXVpcmluZyBtb2R1bGUgXCIrbW9kdWxlTmFtZSk7XG5cdFx0XHRjb25zb2xlLmxvZygnUmVxdWlyaW5nIG1vZHVsZSBmcm9tIHBhZ2U6ICcrbW9kdWxlTmFtZSk7XG5cblxuXHRcdFx0cmVxdWlyZShbbW9kdWxlUmVxdWlyZWpzTmFtZV0sIGZ1bmN0aW9uIChtb2R1bGUpIHtcblxuXHRcdFx0XHRjb25zb2xlLmxvZygnVmFsdWUgb2YgbW9kdWxlIFwiJyttb2R1bGVSZXF1aXJlanNOYW1lKydcIjogJywgbW9kdWxlKTtcblxuXHRcdFx0XHRjb25zb2xlLmxvZygnQ2hlY2tpbmcgaWYgXCInK21vZHVsZU5hbWUrJ1wiIGlzIGEgc2luZ2xldG9uIHRoYXQgcmVxdWlyZXMgb3V0c2lkZSBpbnN0YW50aWF0aW9uLicpO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgbW9kdWxlID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHQvL3ZhciBwcm90byA9IG1vZHVsZS5wcm90b3R5cGU7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnLi4gWWVzOyBDcmVhdGluZyBzaW5nbGV0b24gaW5zdGFuY2Ugb2YgJyttb2R1bGVOYW1lKycgcmV0dmFsLi4nKTtcblxuXHRcdFx0XHRcdFx0dmFyIHNpbmdsZXRvbiA9IG5ldyAobW9kdWxlLmJpbmQobW9kdWxlKSkoKTtcblx0XHRcdFx0XHRcdG1vZHVsZSA9IHNpbmdsZXRvbjtcblx0XHRcdFx0XHRcdGNvbnNvbGUuaW5mbygnLi4gdGhlIG5ld2x5LWNyZWF0ZWQgc2luZ2xldG9uIG9mICcrbW9kdWxlTmFtZSsnOiAnLCBtb2R1bGUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnLi4gTm8uIEp1c3QgdGFraW5nIHRoZSByZXR1cm4gdmFsdWUgZnJvbSB0aGUgbW9kdWxlIGRlZmluZSgpIGNhbGwsJ1xuXHRcdFx0XHRcdFx0XHRcdCtcIlxcbiAgICBzbyB0aGUgdmFsdWUgb2YgbW9kdWxlICdcIittb2R1bGVOYW1lK1wiJyBpczogXCIsbW9kdWxlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKGVycm9yKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnNvbGUuZ3JvdXBFbmQoXCJSZXF1aXJpbmcgbW9kdWxlIFwiK21vZHVsZU5hbWUpO1xuXG5cdFx0XHRcdEFwcGxpY2F0aW9uLm1vZHVsZXNCeU5hbWVbbW9kdWxlTmFtZV0gPSBtb2R1bGU7XG5cblx0XHRcdH0pO1xuXG5cdFx0fSk7XG5cblx0XHR3aW5kb3cuQXBwbGljYXRpb24gPSBBcHBsaWNhdGlvbjtcblx0XHRyZXR1cm4gQXBwbGljYXRpb247XG5cblx0fVxuKTtcbiJdLCJmaWxlIjoiYXBwbGljYXRpb24uanMifQ==


}
/*
     FILE ARCHIVED ON 19:57:22 Oct 17, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:37:59 Oct 28, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 412.292
  exclusion.robots: 0.323
  exclusion.robots.policy: 0.312
  RedisCDXSource: 30.472
  esindex: 0.006
  LoadShardBlock: 356.841 (3)
  PetaboxLoader3.datanode: 159.159 (4)
  CDXLines.iter: 22.225 (3)
  load_resource: 167.447
  PetaboxLoader3.resolve: 85.356
*/