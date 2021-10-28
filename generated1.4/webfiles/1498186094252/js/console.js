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
 * Created by david on 9/17/14.
 */
define([], function () {

	var context = window;

	if ('console' in context && typeof context.console === 'object') return context.console;

	var Console = {
		silentLogs: []
	};

	Console.emptySilentLogs = function() {
		if (Console.silentLogs.length) {
			var entry;
			for (var i=0; i<Console.silentLogs.length; i++) {
				entry = Console.silentLogs[i];
				context.console[entry[0]].apply(context, entry[1]);
			}
			Console.silentLogs = [];
		}
	};

	/**
	 *
	 * @param nameOfConsoleFunction
	 * @returns {function(*)}
	 */
	Console.createFunction = function createFunction(nameOfConsoleFunction) {

		var funcName = nameOfConsoleFunction;
		var anonymousFunc = function(message) {

			try {
				if ('console' in context) {
					Console.emptySilentLogs();
					context.console[funcName].apply(context, arguments);
				}
			} catch (e) {
				Console.silentLogs.push([funcName, arguments]);
			}

		};

		var namedFuncResult = null;
		try {
			namedFuncResult = eval(anonymousFunc.toSource().replace("()", funcName+"()"));
			if (typeof namedFuncResult === 'function') {
				return namedFuncResult;
			}
		} catch (e) {
			// fallback to anonymous version.
		}

		return anonymousFunc;

	};


	/**
	 * @param {...*} object(s)
	*/
	Console.info = Console.createFunction("info");
	/**
	 * @param {...*} object(s)
	*/
	Console.debug = Console.createFunction("debug");
	/**
	 * @param {...*} object(s)
	*/
	Console.warn = Console.createFunction("warn");
	/**
	 * @param {...*} object(s)
	*/
	Console.error = Console.createFunction("error");
	/**
	 * @param {...*} object(s)
	*/
	Console.log = Console.createFunction("log");
	/**
	 * @param {...*} object(s)
	*/
	Console.dir = Console.createFunction("dir");
	/**
	 * Opens a visually grouped container for subsequent messages.
	 *
	 * Begins displaying subsequent log messages in a new visual grouping
	 * with the groupName displayed as a title, which when used as the parameter
	 * to a Console.groupEnd() call, will stop subsequent messages from
	 * being placed in this group (they may be in no group at all, or in a
	 * lower-level group when group() and groupCollapsed() calls are nested.
	 *
	 * The resulting group can be closed by calling @link Console.groupEnd(..)
	 * with the same `groupName` value as the parameter to groupEnd().
	 *
	 * @param {string} groupName - The name/title of the group to open
	 */
	Console.group = Console.createFunction("group");
	/**
	 * Opens a visually grouped container for subsequent messages,
	 * which starts out collapsed.
	 *
	 * Begins displaying subsequent log messages in a new visual grouping
	 * with the groupName displayed as a title, which when used as the parameter
	 * to a Console.groupEnd() call, will stop subsequent messages from
	 * being placed in this group (they may be in no group at all, or in a
	 * lower-level group when group() and groupCollapsed() calls are nested.
	 *
	 * The resulting group can be closed by calling @link Console.groupEnd(..)
	 * with the same `groupName` value as the parameter to groupEnd().
	 *
	 * @param {string} groupName - The name/title of the group to open
	 */
	Console.groupCollapsed = Console.createFunction("groupCollapsed");
	/**
	 * Closes a group which was opened by a call to group(groupName),
	 * or groupCollapsed(groupName).
	 *
	 * @param {string} groupName - The name of the group to close
	 */
	Console.groupEnd = Console.createFunction("groupEnd");
	/**
	 * Outputs a stack-trace to the current execution point, into the
	 * console logs/messages view.
	 *
	 */
	Console.trace = Console.createFunction("trace");
	/**
	 * Starts a named clockwatch, which can be stopped using the same name
	 * as a parameter to Console.timeEnd(). Clockwatches are used to measure
	 * the time cost (execution/network/IO delay) between two points in code.
	 *
	 * @param {string} timerName - Name of the clockwatch
	 */
	Console.time = Console.createFunction("time");
	/**
	 * Stops the clockwatch with name `timerName`, and returns the duration
	 * of time since the clockwatch was started.
	 *
	 * `timerName` corresponds to the timer which was started earlier
	 * using a call to `Console.time(timerName);`
	 *
	 * Clockwatches are used to measure the time cost (execution/network/IO
	 * delay) between two points in code.
	 *
	 * @param {string} timerName - Name of the clockwatch
	 */
	Console.timeEnd = Console.createFunction("timeEnd");
	/**
	 * Theoretically, will throw an error with `message` if the expression
	 * given in parameter 1 does not evaluate to true.
	 *
	 * @param {*} expression
	 * @param {*} message
	*/
	Console.assert = Console.createFunction("assert");


	return Console;

});


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb25zb2xlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSBkYXZpZCBvbiA5LzE3LzE0LlxuICovXG5kZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcblxuXHR2YXIgY29udGV4dCA9IHdpbmRvdztcblxuXHRpZiAoJ2NvbnNvbGUnIGluIGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQuY29uc29sZSA9PT0gJ29iamVjdCcpIHJldHVybiBjb250ZXh0LmNvbnNvbGU7XG5cblx0dmFyIENvbnNvbGUgPSB7XG5cdFx0c2lsZW50TG9nczogW11cblx0fTtcblxuXHRDb25zb2xlLmVtcHR5U2lsZW50TG9ncyA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChDb25zb2xlLnNpbGVudExvZ3MubGVuZ3RoKSB7XG5cdFx0XHR2YXIgZW50cnk7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8Q29uc29sZS5zaWxlbnRMb2dzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGVudHJ5ID0gQ29uc29sZS5zaWxlbnRMb2dzW2ldO1xuXHRcdFx0XHRjb250ZXh0LmNvbnNvbGVbZW50cnlbMF1dLmFwcGx5KGNvbnRleHQsIGVudHJ5WzFdKTtcblx0XHRcdH1cblx0XHRcdENvbnNvbGUuc2lsZW50TG9ncyA9IFtdO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIG5hbWVPZkNvbnNvbGVGdW5jdGlvblxuXHQgKiBAcmV0dXJucyB7ZnVuY3Rpb24oKil9XG5cdCAqL1xuXHRDb25zb2xlLmNyZWF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24gY3JlYXRlRnVuY3Rpb24obmFtZU9mQ29uc29sZUZ1bmN0aW9uKSB7XG5cblx0XHR2YXIgZnVuY05hbWUgPSBuYW1lT2ZDb25zb2xlRnVuY3Rpb247XG5cdFx0dmFyIGFub255bW91c0Z1bmMgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmICgnY29uc29sZScgaW4gY29udGV4dCkge1xuXHRcdFx0XHRcdENvbnNvbGUuZW1wdHlTaWxlbnRMb2dzKCk7XG5cdFx0XHRcdFx0Y29udGV4dC5jb25zb2xlW2Z1bmNOYW1lXS5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdENvbnNvbGUuc2lsZW50TG9ncy5wdXNoKFtmdW5jTmFtZSwgYXJndW1lbnRzXSk7XG5cdFx0XHR9XG5cblx0XHR9O1xuXG5cdFx0dmFyIG5hbWVkRnVuY1Jlc3VsdCA9IG51bGw7XG5cdFx0dHJ5IHtcblx0XHRcdG5hbWVkRnVuY1Jlc3VsdCA9IGV2YWwoYW5vbnltb3VzRnVuYy50b1NvdXJjZSgpLnJlcGxhY2UoXCIoKVwiLCBmdW5jTmFtZStcIigpXCIpKTtcblx0XHRcdGlmICh0eXBlb2YgbmFtZWRGdW5jUmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHJldHVybiBuYW1lZEZ1bmNSZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Ly8gZmFsbGJhY2sgdG8gYW5vbnltb3VzIHZlcnNpb24uXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFub255bW91c0Z1bmM7XG5cblx0fTtcblxuXG5cdC8qKlxuXHQgKiBAcGFyYW0gey4uLip9IG9iamVjdChzKVxuXHQqL1xuXHRDb25zb2xlLmluZm8gPSBDb25zb2xlLmNyZWF0ZUZ1bmN0aW9uKFwiaW5mb1wiKTtcblx0LyoqXG5cdCAqIEBwYXJhbSB7Li4uKn0gb2JqZWN0KHMpXG5cdCovXG5cdENvbnNvbGUuZGVidWcgPSBDb25zb2xlLmNyZWF0ZUZ1bmN0aW9uKFwiZGVidWdcIik7XG5cdC8qKlxuXHQgKiBAcGFyYW0gey4uLip9IG9iamVjdChzKVxuXHQqL1xuXHRDb25zb2xlLndhcm4gPSBDb25zb2xlLmNyZWF0ZUZ1bmN0aW9uKFwid2FyblwiKTtcblx0LyoqXG5cdCAqIEBwYXJhbSB7Li4uKn0gb2JqZWN0KHMpXG5cdCovXG5cdENvbnNvbGUuZXJyb3IgPSBDb25zb2xlLmNyZWF0ZUZ1bmN0aW9uKFwiZXJyb3JcIik7XG5cdC8qKlxuXHQgKiBAcGFyYW0gey4uLip9IG9iamVjdChzKVxuXHQqL1xuXHRDb25zb2xlLmxvZyA9IENvbnNvbGUuY3JlYXRlRnVuY3Rpb24oXCJsb2dcIik7XG5cdC8qKlxuXHQgKiBAcGFyYW0gey4uLip9IG9iamVjdChzKVxuXHQqL1xuXHRDb25zb2xlLmRpciA9IENvbnNvbGUuY3JlYXRlRnVuY3Rpb24oXCJkaXJcIik7XG5cdC8qKlxuXHQgKiBPcGVucyBhIHZpc3VhbGx5IGdyb3VwZWQgY29udGFpbmVyIGZvciBzdWJzZXF1ZW50IG1lc3NhZ2VzLlxuXHQgKlxuXHQgKiBCZWdpbnMgZGlzcGxheWluZyBzdWJzZXF1ZW50IGxvZyBtZXNzYWdlcyBpbiBhIG5ldyB2aXN1YWwgZ3JvdXBpbmdcblx0ICogd2l0aCB0aGUgZ3JvdXBOYW1lIGRpc3BsYXllZCBhcyBhIHRpdGxlLCB3aGljaCB3aGVuIHVzZWQgYXMgdGhlIHBhcmFtZXRlclxuXHQgKiB0byBhIENvbnNvbGUuZ3JvdXBFbmQoKSBjYWxsLCB3aWxsIHN0b3Agc3Vic2VxdWVudCBtZXNzYWdlcyBmcm9tXG5cdCAqIGJlaW5nIHBsYWNlZCBpbiB0aGlzIGdyb3VwICh0aGV5IG1heSBiZSBpbiBubyBncm91cCBhdCBhbGwsIG9yIGluIGFcblx0ICogbG93ZXItbGV2ZWwgZ3JvdXAgd2hlbiBncm91cCgpIGFuZCBncm91cENvbGxhcHNlZCgpIGNhbGxzIGFyZSBuZXN0ZWQuXG5cdCAqXG5cdCAqIFRoZSByZXN1bHRpbmcgZ3JvdXAgY2FuIGJlIGNsb3NlZCBieSBjYWxsaW5nIEBsaW5rIENvbnNvbGUuZ3JvdXBFbmQoLi4pXG5cdCAqIHdpdGggdGhlIHNhbWUgYGdyb3VwTmFtZWAgdmFsdWUgYXMgdGhlIHBhcmFtZXRlciB0byBncm91cEVuZCgpLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZ3JvdXBOYW1lIC0gVGhlIG5hbWUvdGl0bGUgb2YgdGhlIGdyb3VwIHRvIG9wZW5cblx0ICovXG5cdENvbnNvbGUuZ3JvdXAgPSBDb25zb2xlLmNyZWF0ZUZ1bmN0aW9uKFwiZ3JvdXBcIik7XG5cdC8qKlxuXHQgKiBPcGVucyBhIHZpc3VhbGx5IGdyb3VwZWQgY29udGFpbmVyIGZvciBzdWJzZXF1ZW50IG1lc3NhZ2VzLFxuXHQgKiB3aGljaCBzdGFydHMgb3V0IGNvbGxhcHNlZC5cblx0ICpcblx0ICogQmVnaW5zIGRpc3BsYXlpbmcgc3Vic2VxdWVudCBsb2cgbWVzc2FnZXMgaW4gYSBuZXcgdmlzdWFsIGdyb3VwaW5nXG5cdCAqIHdpdGggdGhlIGdyb3VwTmFtZSBkaXNwbGF5ZWQgYXMgYSB0aXRsZSwgd2hpY2ggd2hlbiB1c2VkIGFzIHRoZSBwYXJhbWV0ZXJcblx0ICogdG8gYSBDb25zb2xlLmdyb3VwRW5kKCkgY2FsbCwgd2lsbCBzdG9wIHN1YnNlcXVlbnQgbWVzc2FnZXMgZnJvbVxuXHQgKiBiZWluZyBwbGFjZWQgaW4gdGhpcyBncm91cCAodGhleSBtYXkgYmUgaW4gbm8gZ3JvdXAgYXQgYWxsLCBvciBpbiBhXG5cdCAqIGxvd2VyLWxldmVsIGdyb3VwIHdoZW4gZ3JvdXAoKSBhbmQgZ3JvdXBDb2xsYXBzZWQoKSBjYWxscyBhcmUgbmVzdGVkLlxuXHQgKlxuXHQgKiBUaGUgcmVzdWx0aW5nIGdyb3VwIGNhbiBiZSBjbG9zZWQgYnkgY2FsbGluZyBAbGluayBDb25zb2xlLmdyb3VwRW5kKC4uKVxuXHQgKiB3aXRoIHRoZSBzYW1lIGBncm91cE5hbWVgIHZhbHVlIGFzIHRoZSBwYXJhbWV0ZXIgdG8gZ3JvdXBFbmQoKS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGdyb3VwTmFtZSAtIFRoZSBuYW1lL3RpdGxlIG9mIHRoZSBncm91cCB0byBvcGVuXG5cdCAqL1xuXHRDb25zb2xlLmdyb3VwQ29sbGFwc2VkID0gQ29uc29sZS5jcmVhdGVGdW5jdGlvbihcImdyb3VwQ29sbGFwc2VkXCIpO1xuXHQvKipcblx0ICogQ2xvc2VzIGEgZ3JvdXAgd2hpY2ggd2FzIG9wZW5lZCBieSBhIGNhbGwgdG8gZ3JvdXAoZ3JvdXBOYW1lKSxcblx0ICogb3IgZ3JvdXBDb2xsYXBzZWQoZ3JvdXBOYW1lKS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGdyb3VwTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBncm91cCB0byBjbG9zZVxuXHQgKi9cblx0Q29uc29sZS5ncm91cEVuZCA9IENvbnNvbGUuY3JlYXRlRnVuY3Rpb24oXCJncm91cEVuZFwiKTtcblx0LyoqXG5cdCAqIE91dHB1dHMgYSBzdGFjay10cmFjZSB0byB0aGUgY3VycmVudCBleGVjdXRpb24gcG9pbnQsIGludG8gdGhlXG5cdCAqIGNvbnNvbGUgbG9ncy9tZXNzYWdlcyB2aWV3LlxuXHQgKlxuXHQgKi9cblx0Q29uc29sZS50cmFjZSA9IENvbnNvbGUuY3JlYXRlRnVuY3Rpb24oXCJ0cmFjZVwiKTtcblx0LyoqXG5cdCAqIFN0YXJ0cyBhIG5hbWVkIGNsb2Nrd2F0Y2gsIHdoaWNoIGNhbiBiZSBzdG9wcGVkIHVzaW5nIHRoZSBzYW1lIG5hbWVcblx0ICogYXMgYSBwYXJhbWV0ZXIgdG8gQ29uc29sZS50aW1lRW5kKCkuIENsb2Nrd2F0Y2hlcyBhcmUgdXNlZCB0byBtZWFzdXJlXG5cdCAqIHRoZSB0aW1lIGNvc3QgKGV4ZWN1dGlvbi9uZXR3b3JrL0lPIGRlbGF5KSBiZXR3ZWVuIHR3byBwb2ludHMgaW4gY29kZS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRpbWVyTmFtZSAtIE5hbWUgb2YgdGhlIGNsb2Nrd2F0Y2hcblx0ICovXG5cdENvbnNvbGUudGltZSA9IENvbnNvbGUuY3JlYXRlRnVuY3Rpb24oXCJ0aW1lXCIpO1xuXHQvKipcblx0ICogU3RvcHMgdGhlIGNsb2Nrd2F0Y2ggd2l0aCBuYW1lIGB0aW1lck5hbWVgLCBhbmQgcmV0dXJucyB0aGUgZHVyYXRpb25cblx0ICogb2YgdGltZSBzaW5jZSB0aGUgY2xvY2t3YXRjaCB3YXMgc3RhcnRlZC5cblx0ICpcblx0ICogYHRpbWVyTmFtZWAgY29ycmVzcG9uZHMgdG8gdGhlIHRpbWVyIHdoaWNoIHdhcyBzdGFydGVkIGVhcmxpZXJcblx0ICogdXNpbmcgYSBjYWxsIHRvIGBDb25zb2xlLnRpbWUodGltZXJOYW1lKTtgXG5cdCAqXG5cdCAqIENsb2Nrd2F0Y2hlcyBhcmUgdXNlZCB0byBtZWFzdXJlIHRoZSB0aW1lIGNvc3QgKGV4ZWN1dGlvbi9uZXR3b3JrL0lPXG5cdCAqIGRlbGF5KSBiZXR3ZWVuIHR3byBwb2ludHMgaW4gY29kZS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRpbWVyTmFtZSAtIE5hbWUgb2YgdGhlIGNsb2Nrd2F0Y2hcblx0ICovXG5cdENvbnNvbGUudGltZUVuZCA9IENvbnNvbGUuY3JlYXRlRnVuY3Rpb24oXCJ0aW1lRW5kXCIpO1xuXHQvKipcblx0ICogVGhlb3JldGljYWxseSwgd2lsbCB0aHJvdyBhbiBlcnJvciB3aXRoIGBtZXNzYWdlYCBpZiB0aGUgZXhwcmVzc2lvblxuXHQgKiBnaXZlbiBpbiBwYXJhbWV0ZXIgMSBkb2VzIG5vdCBldmFsdWF0ZSB0byB0cnVlLlxuXHQgKlxuXHQgKiBAcGFyYW0geyp9IGV4cHJlc3Npb25cblx0ICogQHBhcmFtIHsqfSBtZXNzYWdlXG5cdCovXG5cdENvbnNvbGUuYXNzZXJ0ID0gQ29uc29sZS5jcmVhdGVGdW5jdGlvbihcImFzc2VydFwiKTtcblxuXG5cdHJldHVybiBDb25zb2xlO1xuXG59KTtcblxuIl0sImZpbGUiOiJjb25zb2xlLmpzIn0=


}
/*
     FILE ARCHIVED ON 19:57:23 Oct 17, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:49:30 Oct 28, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 935.076
  exclusion.robots: 0.245
  exclusion.robots.policy: 0.238
  RedisCDXSource: 1.768
  esindex: 0.008
  LoadShardBlock: 908.991 (3)
  PetaboxLoader3.datanode: 1300.318 (4)
  CDXLines.iter: 21.624 (3)
  load_resource: 482.667
  PetaboxLoader3.resolve: 77.729
*/