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

/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.15 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */

var requirejs, require, define;
(function (global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.1.15',
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        apsp = ap.splice,
        isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
        //PS3 indicates loaded and complete, but need to wait for complete
        //specifically. Sequence is 'loading', 'loaded', execution,
        // then 'complete'. The UA check is unfortunate, but not sure how
        //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
        //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        contexts = {},
        cfg = {},
        globalDefQueue = [],
        useInteractive = false;

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value === 'object' && value &&
                        !isArray(value) && !isFunction(value) &&
                        !(value instanceof RegExp)) {

                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }

    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }

    function scripts() {
        return document.getElementsByTagName('script');
    }

    function defaultOnError(err) {
        throw err;
    }

    //Allow getting a global that is expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }

    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }

    if (typeof define !== 'undefined') {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //Do not overwrite an existing requirejs instance.
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }

    //Allow for a require config object
    if (typeof require !== 'undefined' && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
    }

    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                //Defaults. Do not set a default for map
                //config to speed up normalize(), which
                //will run faster if there is no default.
                waitSeconds: 7,
                baseUrl: './',
                paths: {},
                bundles: {},
                pkgs: {},
                shim: {},
                config: {}
            },
            registry = {},
            //registry of just enabled modules, to speed
            //cycle breaking code when lots of modules
            //are registered, but not activated.
            enabledRegistry = {},
            undefEvents = {},
            defQueue = [],
            defined = {},
            urlFetched = {},
            bundlesMap = {},
            requireCounter = 1,
            unnormalizedCounter = 1;

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; i < ary.length; i++) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i == 1 && ary[2] === '..') || ary[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgMain, mapValue, nameParts, i, j, nameSegment, lastIndex,
                foundMap, foundI, foundStarMap, starI, normalizedBaseParts,
                baseParts = (baseName && baseName.split('/')),
                map = config.map,
                starMap = map && map['*'];

            //Adjust any relative paths.
            if (name) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // If wanting node ID compatibility, strip .js from end
                // of IDs. Have to do this here, and not in nameToUrl
                // because node allows either .js or non .js to map
                // to same file.
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                // Starts with a '.' so need the baseName
                if (name[0].charAt(0) === '.' && baseParts) {
                    //Convert baseName to array, and lop off the last part,
                    //so that . matches that 'directory' and not name of the baseName's
                    //module. For instance, baseName of 'one/two/three', maps to
                    //'one/two/three.js', but we want the directory, 'one/two' for
                    //this normalization.
                    normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    name = normalizedBaseParts.concat(name);
                }

                trimDots(name);
                name = name.join('/');
            }

            //Apply map config if available.
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');

                outerLoop: for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));

                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break outerLoop;
                                }
                            }
                        }
                    }

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }

            // If the name points to a package's name, use
            // the package main instead.
            pkgMain = getOwn(config.pkgs, name);

            return pkgMain ? pkgMain : name;
        }

        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                            scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }

        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.require.undef(id);

                //Custom require that does not do map translation, since
                //ID is "absolute", already mapped/resolved.
                context.makeRequire(null, {
                    skipMap: true
                })([id]);

                return true;
            }
        }

        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }

            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    } else {
                        // If nested plugin references, then do not try to
                        // normalize, as it will not normalize correctly. This
                        // places a restriction on resourceIds, and the longer
                        // term solution is not to normalize until plugins are
                        // loaded and all normalizations to allow for async
                        // loading of a loader plugin. But for now, fixes the
                        // common uses. Details in #1131
                        normalizedName = name.indexOf('!') === -1 ?
                                         normalize(name, parentName, applyMap) :
                                         name;
                    }
                } else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);

                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;

                    url = context.nameToUrl(normalizedName);
                }
            }

            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                     '_unnormalized' + (unnormalizedCounter += 1) :
                     '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                        prefix + '!' + normalizedName :
                        normalizedName) + suffix
            };
        }

        function getModule(depMap) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }

            return mod;
        }

        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            } else {
                mod = getModule(depMap);
                if (mod.error && name === 'error') {
                    fn(mod.error);
                } else {
                    mod.on(name, fn);
                }
            }
        }

        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
            } else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });

                if (!notified) {
                    req.onError(err);
                }
            }
        }

        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                //Array splice in the values since the context code has a
                //local var ref to defQueue, so cannot just reassign the one
                //on context.
                apsp.apply(defQueue,
                           [defQueue.length, 0].concat(globalDefQueue));
                globalDefQueue = [];
            }
        }

        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
                } else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return (defined[mod.map.id] = mod.exports);
                    } else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
                } else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            return  getOwn(config.config, mod.map.id) || {};
                        },
                        exports: mod.exports || (mod.exports = {})
                    });
                }
            }
        };

        function cleanRegistry(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];
            delete enabledRegistry[id];
        }

        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;

            if (mod.error) {
                mod.emit('error', mod.error);
            } else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id,
                        dep = getOwn(registry, depId);

                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                        } else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }

        function checkLoaded() {
            var err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = [],
                reqCalls = [],
                stillLoading = false,
                needCycleCheck = true;

            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
            }

            inCheckLoaded = true;

            //Figure out the state of all the modules.
            eachProp(enabledRegistry, function (mod) {
                var map = mod.map,
                    modId = map.id;

                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
                }

                if (!map.isDefine) {
                    reqCalls.push(mod);
                }

                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        } else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    } else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });

            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }

            //Not expired, check for a cycle.
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {}, {});
                });
            }

            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }

            inCheckLoaded = false;
        }

        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;

            /* this.exports this.factory
               this.depMaps = [],
               this.enabled, this.fetched
            */
        };

        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};

                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }

                this.factory = factory;

                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
                } else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }

                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);

                this.errback = errback;

                //Indicate this module has be initialized
                this.inited = true;

                this.ignore = options.ignore;

                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                } else {
                    this.check();
                }
            },

            defineDep: function (i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },

            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                } else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },

            load: function () {
                var url = this.map.url;

                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },

            /**
             * Checks if the module is ready to define itself, and if so,
             * define it.
             */
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
                }

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    this.fetch();
                } else if (this.error) {
                    this.emit('error', this.error);
                } else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error. However,
                            //only do it for define()'d  modules. require
                            //errbacks should not be called for failures in
                            //their callbacks (#699). However if a global
                            //onError is set, use that.
                            if ((this.events.error && this.map.isDefine) ||
                                req.onError !== defaultOnError) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                                } catch (e) {
                                    err = e;
                                }
                            } else {
                                exports = context.execCb(id, factory, depExports, exports);
                            }

                            // Favor return value over exports. If node/cjs in play,
                            // then will not have a return value anyway. Favor
                            // module.exports assignment over exports object.
                            if (this.map.isDefine && exports === undefined) {
                                cjsModule = this.module;
                                if (cjsModule) {
                                    exports = cjsModule.exports;
                                } else if (this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                                }
                            }

                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                err.requireType = this.map.isDefine ? 'define' : 'require';
                                return onError((this.error = err));
                            }

                        } else {
                            //Just a literal value
                            exports = factory;
                        }

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                req.onResourceLoad(context, this.map, this.depMaps);
                            }
                        }

                        //Clean up
                        cleanRegistry(id);

                        this.defined = true;
                    }

                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;

                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }

                }
            },

            callPlugin: function () {
                var map = this.map,
                    id = map.id,
                    //Map already normalized the prefix.
                    pluginMap = makeModuleMap(map.prefix);

                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(pluginMap);

                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod,
                        bundleId = getOwn(bundlesMap, this.map.id),
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap.name : null,
                        localRequire = context.makeRequire(map.parentMap, {
                            enableBuildCallback: true
                        });

                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }

                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        normalizedMap = makeModuleMap(map.prefix + '!' + name,
                                                      this.map.parentMap);
                        on(normalizedMap,
                            'defined', bind(this, function (value) {
                                this.init([], function () { return value; }, null, {
                                    enabled: true,
                                    ignore: true
                                });
                            }));

                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(normalizedMap);

                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }

                        return;
                    }

                    //If a paths config, then just load that file instead to
                    //resolve the plugin, as it is built into that paths layer.
                    if (bundleId) {
                        this.map.url = context.nameToUrl(bundleId);
                        this.load();
                        return;
                    }

                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });

                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];

                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });

                        onError(err);
                    });

                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = bind(this, function (text, textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name,
                            moduleMap = makeModuleMap(moduleName),
                            hasInteractive = useInteractive;

                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (textAlt) {
                            text = textAlt;
                        }

                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                        }

                        //Prime the system by creating a module instance for
                        //it.
                        getModule(moduleMap);

                        //Transfer any config to this other module.
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                        }

                        try {
                            req.exec(text);
                        } catch (e) {
                            return onError(makeError('fromtexteval',
                                             'fromText eval for ' + id +
                                            ' failed: ' + e,
                                             e,
                                             [id]));
                        }

                        if (hasInteractive) {
                            useInteractive = true;
                        }

                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(moduleMap);

                        //Support anonymous modules.
                        context.completeLoad(moduleName);

                        //Bind the value of that module to the value for this
                        //resource ID.
                        localRequire([moduleName], load);
                    });

                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, localRequire, load, config);
                }));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },

            enable: function () {
                enabledRegistry[this.map.id] = this;
                this.enabled = true;

                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;

                //Enable each dependency
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap,
                                               (this.map.isDefine ? this.map : this.map.parentMap),
                                               false,
                                               !this.skipMap);
                        this.depMaps[i] = depMap;

                        handler = getOwn(handlers, depMap.id);

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function (depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                        }));

                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        }
                    }

                    id = depMap.id;
                    mod = registry[id];

                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));

                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));

                this.enabling = false;

                this.check();
            },

            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },

            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[name];
                }
            }
        };

        function callGetModule(args) {
            //Skip modules already defined.
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
            }
        }

        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            } else {
                node.removeEventListener(name, func, false);
            }
        }

        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;

            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }

        function intakeDefines() {
            var args;

            //Any defined modules in the global queue, intake them now.
            takeGlobalQueue();

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
                } else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    callGetModule(args);
                }
            }
        }

        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,

            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function (cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }

                //Save off the paths since they require special processing,
                //they are additive.
                var shim = config.shim,
                    objs = {
                        paths: true,
                        bundles: true,
                        config: true,
                        map: true
                    };

                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (!config[prop]) {
                            config[prop] = {};
                        }
                        mixin(config[prop], value, true, true);
                    } else {
                        config[prop] = value;
                    }
                });

                //Reverse map the bundles
                if (cfg.bundles) {
                    eachProp(cfg.bundles, function (value, prop) {
                        each(value, function (v) {
                            if (v !== prop) {
                                bundlesMap[v] = prop;
                            }
                        });
                    });
                }

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location, name;

                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;

                        name = pkgObj.name;
                        location = pkgObj.location;
                        if (location) {
                            config.paths[name] = pkgObj.location;
                        }

                        //Save pointer to main module ID for pkg name.
                        //Remove leading dot in main, so main paths are normalized,
                        //and remove any trailing .js, since different package
                        //envs have different conventions: some use a module name,
                        //some use a file name.
                        config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main')
                                     .replace(currDirRegExp, '')
                                     .replace(jsSuffixRegExp, '');
                    });
                }

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id);
                    }
                });

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },

            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },

            makeRequire: function (relMap, options) {
                options = options || {};

                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;

                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }

                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                        }

                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }

                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(context, deps, relMap, localRequire);
                        }

                        //Normalize module name, if it contains . or ..
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;

                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                        id +
                                        '" has not been loaded yet for context: ' +
                                        contextName +
                                        (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }

                    //Grab defines waiting in the global queue.
                    intakeDefines();

                    //Mark all the dependencies as needing to be loaded.
                    context.nextTick(function () {
                        //Some defines could have been added since the
                        //require call, collect them.
                        intakeDefines();

                        requireMod = getModule(makeModuleMap(null, relMap));

                        //Store if map config should be applied to this require
                        //call for dependencies.
                        requireMod.skipMap = options.skipMap;

                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });

                        checkLoaded();
                    });

                    return localRequire;
                }

                mixin(localRequire, {
                    isBrowser: isBrowser,

                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function (moduleNamePlusExt) {
                        var ext,
                            index = moduleNamePlusExt.lastIndexOf('.'),
                            segment = moduleNamePlusExt.split('/')[0],
                            isRelative = segment === '.' || segment === '..';

                        //Have a file extension alias, and it is not the
                        //dots from a relative path.
                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                        }

                        return context.nameToUrl(normalize(moduleNamePlusExt,
                                                relMap && relMap.id, true), ext,  true);
                    },

                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                    },

                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                    }
                });

                //Only allow undef on top level require calls
                if (!relMap) {
                    localRequire.undef = function (id) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        takeGlobalQueue();

                        var map = makeModuleMap(id, relMap, true),
                            mod = getOwn(registry, id);

                        removeScript(id);

                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];

                        //Clean queued defines too. Go backwards
                        //in array so that the splices do not
                        //mess up the iteration.
                        eachReverse(defQueue, function(args, i) {
                            if(args[0] === id) {
                                defQueue.splice(i, 1);
                            }
                        });

                        if (mod) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }

                            cleanRegistry(id);
                        }
                    };
                }

                return localRequire;
            },

            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. A second arg, parent, the parent module,
             * is passed in for context, when this method is overridden by
             * the optimizer. Not shown here to keep code compact.
             */
            enable: function (depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var found, args, mod,
                    shim = getOwn(config.shim, moduleName) || {},
                    shExports = shim.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                        }
                        found = true;
                    } else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                    }

                    callGetModule(args);
                }

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);

                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        } else {
                            return onError(makeError('nodefine',
                                             'No define call for ' + moduleName,
                                             null,
                                             [moduleName]));
                        }
                    } else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }

                checkLoaded();
            },

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function (moduleName, ext, skipExt) {
                var paths, syms, i, parentModule, url,
                    parentPath, bundleId,
                    pkgMain = getOwn(config.pkgs, moduleName);

                if (pkgMain) {
                    moduleName = pkgMain;
                }

                bundleId = getOwn(bundlesMap, moduleName);

                if (bundleId) {
                    return context.nameToUrl(bundleId, ext, skipExt);
                }

                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
                } else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;

                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');

                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        }
                    }

                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/^data\:|\?/.test(url) || skipExt ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }

                return config.urlArgs ? url +
                                        ((url.indexOf('?') === -1 ? '?' : '&') +
                                         config.urlArgs) : url;
            },

            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function (id, url) {
                req.load(context, id, url);
            },

            /**
             * Executes a module callback function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },

            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function (evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                        (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;

                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },

            /**
             * Callback for script errors.
             */
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    return onError(makeError('scripterror', 'Script error for: ' + data.id, evt, [data.id]));
                }
            }
        };

        context.require = context.makeRequire();
        return context;
    }

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function (deps, callback, errback, optional) {

        //Find the right context, use default
        var context, config,
            contextName = defContextName;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }

        if (config) {
            context.configure(config);
        }

        return context.require(deps, callback, errback);
    };

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
    };

    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function} fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
    } : function (fn) { fn(); };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    req.version = version;

    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };

    //Create default context.
    req({});

    //Exports some context-sensitive methods on global require.
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });

    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = defaultOnError;

    /**
     * Creates the node for the load command. Only used in browser envs.
     */
    req.createNode = function (config, moduleName, url) {
        var node = config.xhtml ?
                document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                document.createElement('script');
        node.type = config.scriptType || 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        return node;
    };

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = req.createNode(config, moduleName, url);

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                    //Check if node.attachEvent is artificially added by custom script or
                    //natively supported by browser
                    //read https://github.com/jrburke/requirejs/issues/187
                    //if we can NOT find [native code] then it must NOT natively supported.
                    //in IE8, node.attachEvent does not have toString()
                    //Note the test for "[native code" with no closing brace, see:
                    //https://github.com/jrburke/requirejs/issues/273
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEventListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation that a build has been done so that
                //only one script needs to be loaded anyway. This may need to be
                //reevaluated if other use cases become common.
                importScripts(url);

                //Account for anonymous modules
                context.completeLoad(moduleName);
            } catch (e) {
                context.onError(makeError('importscripts',
                                'importScripts failed for ' +
                                    moduleName + ' at ' + url,
                                e,
                                [moduleName]));
            }
        }
    };

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }

        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser && !cfg.skipDataMain) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function (script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Preserve dataMain in case it is a path (i.e. contains '?')
                mainScript = dataMain;

                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = mainScript.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    cfg.baseUrl = subPath;
                }

                //Strip off any trailing .js since mainScript is now
                //like a module name.
                mainScript = mainScript.replace(jsSuffixRegExp, '');

                 //If mainScript is still a path, fall back to dataMain
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];

                return true;
            }
        });
    }

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function (name, deps, callback) {
        var node, context;

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps && isFunction(callback)) {
            deps = [];
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                    });

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
    };

    define.amd = {
        jQuery: true
    };


    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function (text) {
        /*jslint evil: true */
        return eval(text);
    };

    //Set up with config info.
    req(cfg);
}(this));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0aGlyZHBhcnR5L3ZlbmRvci9yZXF1aXJlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKiB2aW06IGV0OnRzPTQ6c3c9NDpzdHM9NFxuICogQGxpY2Vuc2UgUmVxdWlyZUpTIDIuMS4xNSBDb3B5cmlnaHQgKGMpIDIwMTAtMjAxNCwgVGhlIERvam8gRm91bmRhdGlvbiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogQXZhaWxhYmxlIHZpYSB0aGUgTUlUIG9yIG5ldyBCU0QgbGljZW5zZS5cbiAqIHNlZTogaHR0cDovL2dpdGh1Yi5jb20vanJidXJrZS9yZXF1aXJlanMgZm9yIGRldGFpbHNcbiAqL1xuLy9Ob3QgdXNpbmcgc3RyaWN0OiB1bmV2ZW4gc3RyaWN0IHN1cHBvcnQgaW4gYnJvd3NlcnMsICMzOTIsIGFuZCBjYXVzZXNcbi8vcHJvYmxlbXMgd2l0aCByZXF1aXJlanMuZXhlYygpL3RyYW5zcGlsZXIgcGx1Z2lucyB0aGF0IG1heSBub3QgYmUgc3RyaWN0LlxuLypqc2xpbnQgcmVnZXhwOiB0cnVlLCBub21lbjogdHJ1ZSwgc2xvcHB5OiB0cnVlICovXG4vKmdsb2JhbCB3aW5kb3csIG5hdmlnYXRvciwgZG9jdW1lbnQsIGltcG9ydFNjcmlwdHMsIHNldFRpbWVvdXQsIG9wZXJhICovXG5cbnZhciByZXF1aXJlanMsIHJlcXVpcmUsIGRlZmluZTtcbihmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gICAgdmFyIHJlcSwgcywgaGVhZCwgYmFzZUVsZW1lbnQsIGRhdGFNYWluLCBzcmMsXG4gICAgICAgIGludGVyYWN0aXZlU2NyaXB0LCBjdXJyZW50bHlBZGRpbmdTY3JpcHQsIG1haW5TY3JpcHQsIHN1YlBhdGgsXG4gICAgICAgIHZlcnNpb24gPSAnMi4xLjE1JyxcbiAgICAgICAgY29tbWVudFJlZ0V4cCA9IC8oXFwvXFwqKFtcXHNcXFNdKj8pXFwqXFwvfChbXjpdfF4pXFwvXFwvKC4qKSQpL21nLFxuICAgICAgICBjanNSZXF1aXJlUmVnRXhwID0gL1teLl1cXHMqcmVxdWlyZVxccypcXChcXHMqW1wiJ10oW14nXCJcXHNdKylbXCInXVxccypcXCkvZyxcbiAgICAgICAganNTdWZmaXhSZWdFeHAgPSAvXFwuanMkLyxcbiAgICAgICAgY3VyckRpclJlZ0V4cCA9IC9eXFwuXFwvLyxcbiAgICAgICAgb3AgPSBPYmplY3QucHJvdG90eXBlLFxuICAgICAgICBvc3RyaW5nID0gb3AudG9TdHJpbmcsXG4gICAgICAgIGhhc093biA9IG9wLmhhc093blByb3BlcnR5LFxuICAgICAgICBhcCA9IEFycmF5LnByb3RvdHlwZSxcbiAgICAgICAgYXBzcCA9IGFwLnNwbGljZSxcbiAgICAgICAgaXNCcm93c2VyID0gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50KSxcbiAgICAgICAgaXNXZWJXb3JrZXIgPSAhaXNCcm93c2VyICYmIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJyxcbiAgICAgICAgLy9QUzMgaW5kaWNhdGVzIGxvYWRlZCBhbmQgY29tcGxldGUsIGJ1dCBuZWVkIHRvIHdhaXQgZm9yIGNvbXBsZXRlXG4gICAgICAgIC8vc3BlY2lmaWNhbGx5LiBTZXF1ZW5jZSBpcyAnbG9hZGluZycsICdsb2FkZWQnLCBleGVjdXRpb24sXG4gICAgICAgIC8vIHRoZW4gJ2NvbXBsZXRlJy4gVGhlIFVBIGNoZWNrIGlzIHVuZm9ydHVuYXRlLCBidXQgbm90IHN1cmUgaG93XG4gICAgICAgIC8vdG8gZmVhdHVyZSB0ZXN0IHcvbyBjYXVzaW5nIHBlcmYgaXNzdWVzLlxuICAgICAgICByZWFkeVJlZ0V4cCA9IGlzQnJvd3NlciAmJiBuYXZpZ2F0b3IucGxhdGZvcm0gPT09ICdQTEFZU1RBVElPTiAzJyA/XG4gICAgICAgICAgICAgICAgICAgICAgL15jb21wbGV0ZSQvIDogL14oY29tcGxldGV8bG9hZGVkKSQvLFxuICAgICAgICBkZWZDb250ZXh0TmFtZSA9ICdfJyxcbiAgICAgICAgLy9PaCB0aGUgdHJhZ2VkeSwgZGV0ZWN0aW5nIG9wZXJhLiBTZWUgdGhlIHVzYWdlIG9mIGlzT3BlcmEgZm9yIHJlYXNvbi5cbiAgICAgICAgaXNPcGVyYSA9IHR5cGVvZiBvcGVyYSAhPT0gJ3VuZGVmaW5lZCcgJiYgb3BlcmEudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgT3BlcmFdJyxcbiAgICAgICAgY29udGV4dHMgPSB7fSxcbiAgICAgICAgY2ZnID0ge30sXG4gICAgICAgIGdsb2JhbERlZlF1ZXVlID0gW10sXG4gICAgICAgIHVzZUludGVyYWN0aXZlID0gZmFsc2U7XG5cbiAgICBmdW5jdGlvbiBpc0Z1bmN0aW9uKGl0KSB7XG4gICAgICAgIHJldHVybiBvc3RyaW5nLmNhbGwoaXQpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQXJyYXkoaXQpIHtcbiAgICAgICAgcmV0dXJuIG9zdHJpbmcuY2FsbChpdCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIGZvciBpdGVyYXRpbmcgb3ZlciBhbiBhcnJheS4gSWYgdGhlIGZ1bmMgcmV0dXJuc1xuICAgICAqIGEgdHJ1ZSB2YWx1ZSwgaXQgd2lsbCBicmVhayBvdXQgb2YgdGhlIGxvb3AuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZWFjaChhcnksIGZ1bmMpIHtcbiAgICAgICAgaWYgKGFyeSkge1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyeVtpXSAmJiBmdW5jKGFyeVtpXSwgaSwgYXJ5KSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gZm9yIGl0ZXJhdGluZyBvdmVyIGFuIGFycmF5IGJhY2t3YXJkcy4gSWYgdGhlIGZ1bmNcbiAgICAgKiByZXR1cm5zIGEgdHJ1ZSB2YWx1ZSwgaXQgd2lsbCBicmVhayBvdXQgb2YgdGhlIGxvb3AuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZWFjaFJldmVyc2UoYXJ5LCBmdW5jKSB7XG4gICAgICAgIGlmIChhcnkpIHtcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgZm9yIChpID0gYXJ5Lmxlbmd0aCAtIDE7IGkgPiAtMTsgaSAtPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyeVtpXSAmJiBmdW5jKGFyeVtpXSwgaSwgYXJ5KSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNQcm9wKG9iaiwgcHJvcCkge1xuICAgICAgICByZXR1cm4gaGFzT3duLmNhbGwob2JqLCBwcm9wKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPd24ob2JqLCBwcm9wKSB7XG4gICAgICAgIHJldHVybiBoYXNQcm9wKG9iaiwgcHJvcCkgJiYgb2JqW3Byb3BdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEN5Y2xlcyBvdmVyIHByb3BlcnRpZXMgaW4gYW4gb2JqZWN0IGFuZCBjYWxscyBhIGZ1bmN0aW9uIGZvciBlYWNoXG4gICAgICogcHJvcGVydHkgdmFsdWUuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLCB0aGVuIHRoZVxuICAgICAqIGl0ZXJhdGlvbiBpcyBzdG9wcGVkLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVhY2hQcm9wKG9iaiwgZnVuYykge1xuICAgICAgICB2YXIgcHJvcDtcbiAgICAgICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKGhhc1Byb3Aob2JqLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIGlmIChmdW5jKG9ialtwcm9wXSwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2ltcGxlIGZ1bmN0aW9uIHRvIG1peCBpbiBwcm9wZXJ0aWVzIGZyb20gc291cmNlIGludG8gdGFyZ2V0LFxuICAgICAqIGJ1dCBvbmx5IGlmIHRhcmdldCBkb2VzIG5vdCBhbHJlYWR5IGhhdmUgYSBwcm9wZXJ0eSBvZiB0aGUgc2FtZSBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1peGluKHRhcmdldCwgc291cmNlLCBmb3JjZSwgZGVlcFN0cmluZ01peGluKSB7XG4gICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICAgIGVhY2hQcm9wKHNvdXJjZSwgZnVuY3Rpb24gKHZhbHVlLCBwcm9wKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZvcmNlIHx8ICFoYXNQcm9wKHRhcmdldCwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZXBTdHJpbmdNaXhpbiAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhaXNBcnJheSh2YWx1ZSkgJiYgIWlzRnVuY3Rpb24odmFsdWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhKHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRhcmdldFtwcm9wXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbWl4aW4odGFyZ2V0W3Byb3BdLCB2YWx1ZSwgZm9yY2UsIGRlZXBTdHJpbmdNaXhpbik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgLy9TaW1pbGFyIHRvIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLCBidXQgdGhlICd0aGlzJyBvYmplY3QgaXMgc3BlY2lmaWVkXG4gICAgLy9maXJzdCwgc2luY2UgaXQgaXMgZWFzaWVyIHRvIHJlYWQvZmlndXJlIG91dCB3aGF0ICd0aGlzJyB3aWxsIGJlLlxuICAgIGZ1bmN0aW9uIGJpbmQob2JqLCBmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY3JpcHRzKCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmF1bHRPbkVycm9yKGVycikge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgLy9BbGxvdyBnZXR0aW5nIGEgZ2xvYmFsIHRoYXQgaXMgZXhwcmVzc2VkIGluXG4gICAgLy9kb3Qgbm90YXRpb24sIGxpa2UgJ2EuYi5jJy5cbiAgICBmdW5jdGlvbiBnZXRHbG9iYWwodmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBnID0gZ2xvYmFsO1xuICAgICAgICBlYWNoKHZhbHVlLnNwbGl0KCcuJyksIGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgICAgICBnID0gZ1twYXJ0XTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYW4gZXJyb3Igd2l0aCBhIHBvaW50ZXIgdG8gYW4gVVJMIHdpdGggbW9yZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgdGhlIGVycm9yIElEIHRoYXQgbWFwcyB0byBhbiBJRCBvbiBhIHdlYiBwYWdlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIGh1bWFuIHJlYWRhYmxlIGVycm9yLlxuICAgICAqIEBwYXJhbSB7RXJyb3J9IFtlcnJdIHRoZSBvcmlnaW5hbCBlcnJvciwgaWYgdGhlcmUgaXMgb25lLlxuICAgICAqXG4gICAgICogQHJldHVybnMge0Vycm9yfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1ha2VFcnJvcihpZCwgbXNnLCBlcnIsIHJlcXVpcmVNb2R1bGVzKSB7XG4gICAgICAgIHZhciBlID0gbmV3IEVycm9yKG1zZyArICdcXG5odHRwOi8vcmVxdWlyZWpzLm9yZy9kb2NzL2Vycm9ycy5odG1sIycgKyBpZCk7XG4gICAgICAgIGUucmVxdWlyZVR5cGUgPSBpZDtcbiAgICAgICAgZS5yZXF1aXJlTW9kdWxlcyA9IHJlcXVpcmVNb2R1bGVzO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBlLm9yaWdpbmFsRXJyb3IgPSBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGU7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vSWYgYSBkZWZpbmUgaXMgYWxyZWFkeSBpbiBwbGF5IHZpYSBhbm90aGVyIEFNRCBsb2FkZXIsXG4gICAgICAgIC8vZG8gbm90IG92ZXJ3cml0ZS5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcmVxdWlyZWpzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihyZXF1aXJlanMpKSB7XG4gICAgICAgICAgICAvL0RvIG5vdCBvdmVyd3JpdGUgYW4gZXhpc3RpbmcgcmVxdWlyZWpzIGluc3RhbmNlLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNmZyA9IHJlcXVpcmVqcztcbiAgICAgICAgcmVxdWlyZWpzID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vQWxsb3cgZm9yIGEgcmVxdWlyZSBjb25maWcgb2JqZWN0XG4gICAgaWYgKHR5cGVvZiByZXF1aXJlICE9PSAndW5kZWZpbmVkJyAmJiAhaXNGdW5jdGlvbihyZXF1aXJlKSkge1xuICAgICAgICAvL2Fzc3VtZSBpdCBpcyBhIGNvbmZpZyBvYmplY3QuXG4gICAgICAgIGNmZyA9IHJlcXVpcmU7XG4gICAgICAgIHJlcXVpcmUgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV3Q29udGV4dChjb250ZXh0TmFtZSkge1xuICAgICAgICB2YXIgaW5DaGVja0xvYWRlZCwgTW9kdWxlLCBjb250ZXh0LCBoYW5kbGVycyxcbiAgICAgICAgICAgIGNoZWNrTG9hZGVkVGltZW91dElkLFxuICAgICAgICAgICAgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIC8vRGVmYXVsdHMuIERvIG5vdCBzZXQgYSBkZWZhdWx0IGZvciBtYXBcbiAgICAgICAgICAgICAgICAvL2NvbmZpZyB0byBzcGVlZCB1cCBub3JtYWxpemUoKSwgd2hpY2hcbiAgICAgICAgICAgICAgICAvL3dpbGwgcnVuIGZhc3RlciBpZiB0aGVyZSBpcyBubyBkZWZhdWx0LlxuICAgICAgICAgICAgICAgIHdhaXRTZWNvbmRzOiA3LFxuICAgICAgICAgICAgICAgIGJhc2VVcmw6ICcuLycsXG4gICAgICAgICAgICAgICAgcGF0aHM6IHt9LFxuICAgICAgICAgICAgICAgIGJ1bmRsZXM6IHt9LFxuICAgICAgICAgICAgICAgIHBrZ3M6IHt9LFxuICAgICAgICAgICAgICAgIHNoaW06IHt9LFxuICAgICAgICAgICAgICAgIGNvbmZpZzoge31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWdpc3RyeSA9IHt9LFxuICAgICAgICAgICAgLy9yZWdpc3RyeSBvZiBqdXN0IGVuYWJsZWQgbW9kdWxlcywgdG8gc3BlZWRcbiAgICAgICAgICAgIC8vY3ljbGUgYnJlYWtpbmcgY29kZSB3aGVuIGxvdHMgb2YgbW9kdWxlc1xuICAgICAgICAgICAgLy9hcmUgcmVnaXN0ZXJlZCwgYnV0IG5vdCBhY3RpdmF0ZWQuXG4gICAgICAgICAgICBlbmFibGVkUmVnaXN0cnkgPSB7fSxcbiAgICAgICAgICAgIHVuZGVmRXZlbnRzID0ge30sXG4gICAgICAgICAgICBkZWZRdWV1ZSA9IFtdLFxuICAgICAgICAgICAgZGVmaW5lZCA9IHt9LFxuICAgICAgICAgICAgdXJsRmV0Y2hlZCA9IHt9LFxuICAgICAgICAgICAgYnVuZGxlc01hcCA9IHt9LFxuICAgICAgICAgICAgcmVxdWlyZUNvdW50ZXIgPSAxLFxuICAgICAgICAgICAgdW5ub3JtYWxpemVkQ291bnRlciA9IDE7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRyaW1zIHRoZSAuIGFuZCAuLiBmcm9tIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMuXG4gICAgICAgICAqIEl0IHdpbGwga2VlcCBhIGxlYWRpbmcgcGF0aCBzZWdtZW50IGlmIGEgLi4gd2lsbCBiZWNvbWVcbiAgICAgICAgICogdGhlIGZpcnN0IHBhdGggc2VnbWVudCwgdG8gaGVscCB3aXRoIG1vZHVsZSBuYW1lIGxvb2t1cHMsXG4gICAgICAgICAqIHdoaWNoIGFjdCBsaWtlIHBhdGhzLCBidXQgY2FuIGJlIHJlbWFwcGVkLiBCdXQgdGhlIGVuZCByZXN1bHQsXG4gICAgICAgICAqIGFsbCBwYXRocyB0aGF0IHVzZSB0aGlzIGZ1bmN0aW9uIHNob3VsZCBsb29rIG5vcm1hbGl6ZWQuXG4gICAgICAgICAqIE5PVEU6IHRoaXMgbWV0aG9kIE1PRElGSUVTIHRoZSBpbnB1dCBhcnJheS5cbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gYXJ5IHRoZSBhcnJheSBvZiBwYXRoIHNlZ21lbnRzLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdHJpbURvdHMoYXJ5KSB7XG4gICAgICAgICAgICB2YXIgaSwgcGFydDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwYXJ0ID0gYXJ5W2ldO1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0ID09PSAnLicpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJ5LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFydCA9PT0gJy4uJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiBhdCB0aGUgc3RhcnQsIG9yIHByZXZpb3VzIHZhbHVlIGlzIHN0aWxsIC4uLFxuICAgICAgICAgICAgICAgICAgICAvLyBrZWVwIHRoZW0gc28gdGhhdCB3aGVuIGNvbnZlcnRlZCB0byBhIHBhdGggaXQgbWF5XG4gICAgICAgICAgICAgICAgICAgIC8vIHN0aWxsIHdvcmsgd2hlbiBjb252ZXJ0ZWQgdG8gYSBwYXRoLCBldmVuIHRob3VnaFxuICAgICAgICAgICAgICAgICAgICAvLyBhcyBhbiBJRCBpdCBpcyBsZXNzIHRoYW4gaWRlYWwuIEluIGxhcmdlciBwb2ludFxuICAgICAgICAgICAgICAgICAgICAvLyByZWxlYXNlcywgbWF5IGJlIGJldHRlciB0byBqdXN0IGtpY2sgb3V0IGFuIGVycm9yLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCB8fCAoaSA9PSAxICYmIGFyeVsyXSA9PT0gJy4uJykgfHwgYXJ5W2kgLSAxXSA9PT0gJy4uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyeS5zcGxpY2UoaSAtIDEsIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSAtPSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdpdmVuIGEgcmVsYXRpdmUgbW9kdWxlIG5hbWUsIGxpa2UgLi9zb21ldGhpbmcsIG5vcm1hbGl6ZSBpdCB0b1xuICAgICAgICAgKiBhIHJlYWwgbmFtZSB0aGF0IGNhbiBiZSBtYXBwZWQgdG8gYSBwYXRoLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSB0aGUgcmVsYXRpdmUgbmFtZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gYmFzZU5hbWUgYSByZWFsIG5hbWUgdGhhdCB0aGUgbmFtZSBhcmcgaXMgcmVsYXRpdmVcbiAgICAgICAgICogdG8uXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gYXBwbHlNYXAgYXBwbHkgdGhlIG1hcCBjb25maWcgdG8gdGhlIHZhbHVlLiBTaG91bGRcbiAgICAgICAgICogb25seSBiZSBkb25lIGlmIHRoaXMgbm9ybWFsaXphdGlvbiBpcyBmb3IgYSBkZXBlbmRlbmN5IElELlxuICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBub3JtYWxpemVkIG5hbWVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZShuYW1lLCBiYXNlTmFtZSwgYXBwbHlNYXApIHtcbiAgICAgICAgICAgIHZhciBwa2dNYWluLCBtYXBWYWx1ZSwgbmFtZVBhcnRzLCBpLCBqLCBuYW1lU2VnbWVudCwgbGFzdEluZGV4LFxuICAgICAgICAgICAgICAgIGZvdW5kTWFwLCBmb3VuZEksIGZvdW5kU3Rhck1hcCwgc3RhckksIG5vcm1hbGl6ZWRCYXNlUGFydHMsXG4gICAgICAgICAgICAgICAgYmFzZVBhcnRzID0gKGJhc2VOYW1lICYmIGJhc2VOYW1lLnNwbGl0KCcvJykpLFxuICAgICAgICAgICAgICAgIG1hcCA9IGNvbmZpZy5tYXAsXG4gICAgICAgICAgICAgICAgc3Rhck1hcCA9IG1hcCAmJiBtYXBbJyonXTtcblxuICAgICAgICAgICAgLy9BZGp1c3QgYW55IHJlbGF0aXZlIHBhdGhzLlxuICAgICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zcGxpdCgnLycpO1xuICAgICAgICAgICAgICAgIGxhc3RJbmRleCA9IG5hbWUubGVuZ3RoIC0gMTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHdhbnRpbmcgbm9kZSBJRCBjb21wYXRpYmlsaXR5LCBzdHJpcCAuanMgZnJvbSBlbmRcbiAgICAgICAgICAgICAgICAvLyBvZiBJRHMuIEhhdmUgdG8gZG8gdGhpcyBoZXJlLCBhbmQgbm90IGluIG5hbWVUb1VybFxuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2Ugbm9kZSBhbGxvd3MgZWl0aGVyIC5qcyBvciBub24gLmpzIHRvIG1hcFxuICAgICAgICAgICAgICAgIC8vIHRvIHNhbWUgZmlsZS5cbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLm5vZGVJZENvbXBhdCAmJiBqc1N1ZmZpeFJlZ0V4cC50ZXN0KG5hbWVbbGFzdEluZGV4XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZVtsYXN0SW5kZXhdID0gbmFtZVtsYXN0SW5kZXhdLnJlcGxhY2UoanNTdWZmaXhSZWdFeHAsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTdGFydHMgd2l0aCBhICcuJyBzbyBuZWVkIHRoZSBiYXNlTmFtZVxuICAgICAgICAgICAgICAgIGlmIChuYW1lWzBdLmNoYXJBdCgwKSA9PT0gJy4nICYmIGJhc2VQYXJ0cykge1xuICAgICAgICAgICAgICAgICAgICAvL0NvbnZlcnQgYmFzZU5hbWUgdG8gYXJyYXksIGFuZCBsb3Agb2ZmIHRoZSBsYXN0IHBhcnQsXG4gICAgICAgICAgICAgICAgICAgIC8vc28gdGhhdCAuIG1hdGNoZXMgdGhhdCAnZGlyZWN0b3J5JyBhbmQgbm90IG5hbWUgb2YgdGhlIGJhc2VOYW1lJ3NcbiAgICAgICAgICAgICAgICAgICAgLy9tb2R1bGUuIEZvciBpbnN0YW5jZSwgYmFzZU5hbWUgb2YgJ29uZS90d28vdGhyZWUnLCBtYXBzIHRvXG4gICAgICAgICAgICAgICAgICAgIC8vJ29uZS90d28vdGhyZWUuanMnLCBidXQgd2Ugd2FudCB0aGUgZGlyZWN0b3J5LCAnb25lL3R3bycgZm9yXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcyBub3JtYWxpemF0aW9uLlxuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkQmFzZVBhcnRzID0gYmFzZVBhcnRzLnNsaWNlKDAsIGJhc2VQYXJ0cy5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IG5vcm1hbGl6ZWRCYXNlUGFydHMuY29uY2F0KG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRyaW1Eb3RzKG5hbWUpO1xuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLmpvaW4oJy8nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9BcHBseSBtYXAgY29uZmlnIGlmIGF2YWlsYWJsZS5cbiAgICAgICAgICAgIGlmIChhcHBseU1hcCAmJiBtYXAgJiYgKGJhc2VQYXJ0cyB8fCBzdGFyTWFwKSkge1xuICAgICAgICAgICAgICAgIG5hbWVQYXJ0cyA9IG5hbWUuc3BsaXQoJy8nKTtcblxuICAgICAgICAgICAgICAgIG91dGVyTG9vcDogZm9yIChpID0gbmFtZVBhcnRzLmxlbmd0aDsgaSA+IDA7IGkgLT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBuYW1lU2VnbWVudCA9IG5hbWVQYXJ0cy5zbGljZSgwLCBpKS5qb2luKCcvJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2VQYXJ0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9GaW5kIHRoZSBsb25nZXN0IGJhc2VOYW1lIHNlZ21lbnQgbWF0Y2ggaW4gdGhlIGNvbmZpZy5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vU28sIGRvIGpvaW5zIG9uIHRoZSBiaWdnZXN0IHRvIHNtYWxsZXN0IGxlbmd0aHMgb2YgYmFzZVBhcnRzLlxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gYmFzZVBhcnRzLmxlbmd0aDsgaiA+IDA7IGogLT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFZhbHVlID0gZ2V0T3duKG1hcCwgYmFzZVBhcnRzLnNsaWNlKDAsIGopLmpvaW4oJy8nKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2Jhc2VOYW1lIHNlZ21lbnQgaGFzIGNvbmZpZywgZmluZCBpZiBpdCBoYXMgb25lIGZvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcyBuYW1lLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBWYWx1ZSA9IGdldE93bihtYXBWYWx1ZSwgbmFtZVNlZ21lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTWF0Y2gsIHVwZGF0ZSBuYW1lIHRvIHRoZSBuZXcgdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZE1hcCA9IG1hcFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRJID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dGVyTG9vcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgZm9yIGEgc3RhciBtYXAgbWF0Y2gsIGJ1dCBqdXN0IGhvbGQgb24gdG8gaXQsXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgdGhlcmUgaXMgYSBzaG9ydGVyIHNlZ21lbnQgbWF0Y2ggbGF0ZXIgaW4gYSBtYXRjaGluZ1xuICAgICAgICAgICAgICAgICAgICAvL2NvbmZpZywgdGhlbiBmYXZvciBvdmVyIHRoaXMgc3RhciBtYXAuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmRTdGFyTWFwICYmIHN0YXJNYXAgJiYgZ2V0T3duKHN0YXJNYXAsIG5hbWVTZWdtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRTdGFyTWFwID0gZ2V0T3duKHN0YXJNYXAsIG5hbWVTZWdtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJJID0gaTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghZm91bmRNYXAgJiYgZm91bmRTdGFyTWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kTWFwID0gZm91bmRTdGFyTWFwO1xuICAgICAgICAgICAgICAgICAgICBmb3VuZEkgPSBzdGFySTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZm91bmRNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZVBhcnRzLnNwbGljZSgwLCBmb3VuZEksIGZvdW5kTWFwKTtcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IG5hbWVQYXJ0cy5qb2luKCcvJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgbmFtZSBwb2ludHMgdG8gYSBwYWNrYWdlJ3MgbmFtZSwgdXNlXG4gICAgICAgICAgICAvLyB0aGUgcGFja2FnZSBtYWluIGluc3RlYWQuXG4gICAgICAgICAgICBwa2dNYWluID0gZ2V0T3duKGNvbmZpZy5wa2dzLCBuYW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIHBrZ01haW4gPyBwa2dNYWluIDogbmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVNjcmlwdChuYW1lKSB7XG4gICAgICAgICAgICBpZiAoaXNCcm93c2VyKSB7XG4gICAgICAgICAgICAgICAgZWFjaChzY3JpcHRzKCksIGZ1bmN0aW9uIChzY3JpcHROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JpcHROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXF1aXJlbW9kdWxlJykgPT09IG5hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXF1aXJlY29udGV4dCcpID09PSBjb250ZXh0LmNvbnRleHROYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHROb2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0Tm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFzUGF0aEZhbGxiYWNrKGlkKSB7XG4gICAgICAgICAgICB2YXIgcGF0aENvbmZpZyA9IGdldE93bihjb25maWcucGF0aHMsIGlkKTtcbiAgICAgICAgICAgIGlmIChwYXRoQ29uZmlnICYmIGlzQXJyYXkocGF0aENvbmZpZykgJiYgcGF0aENvbmZpZy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgLy9Qb3Agb2ZmIHRoZSBmaXJzdCBhcnJheSB2YWx1ZSwgc2luY2UgaXQgZmFpbGVkLCBhbmRcbiAgICAgICAgICAgICAgICAvL3JldHJ5XG4gICAgICAgICAgICAgICAgcGF0aENvbmZpZy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVxdWlyZS51bmRlZihpZCk7XG5cbiAgICAgICAgICAgICAgICAvL0N1c3RvbSByZXF1aXJlIHRoYXQgZG9lcyBub3QgZG8gbWFwIHRyYW5zbGF0aW9uLCBzaW5jZVxuICAgICAgICAgICAgICAgIC8vSUQgaXMgXCJhYnNvbHV0ZVwiLCBhbHJlYWR5IG1hcHBlZC9yZXNvbHZlZC5cbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1ha2VSZXF1aXJlKG51bGwsIHtcbiAgICAgICAgICAgICAgICAgICAgc2tpcE1hcDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pKFtpZF0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1R1cm5zIGEgcGx1Z2luIXJlc291cmNlIHRvIFtwbHVnaW4sIHJlc291cmNlXVxuICAgICAgICAvL3dpdGggdGhlIHBsdWdpbiBiZWluZyB1bmRlZmluZWQgaWYgdGhlIG5hbWVcbiAgICAgICAgLy9kaWQgbm90IGhhdmUgYSBwbHVnaW4gcHJlZml4LlxuICAgICAgICBmdW5jdGlvbiBzcGxpdFByZWZpeChuYW1lKSB7XG4gICAgICAgICAgICB2YXIgcHJlZml4LFxuICAgICAgICAgICAgICAgIGluZGV4ID0gbmFtZSA/IG5hbWUuaW5kZXhPZignIScpIDogLTE7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIHByZWZpeCA9IG5hbWUuc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoaW5kZXggKyAxLCBuYW1lLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW3ByZWZpeCwgbmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG1vZHVsZSBtYXBwaW5nIHRoYXQgaW5jbHVkZXMgcGx1Z2luIHByZWZpeCwgbW9kdWxlXG4gICAgICAgICAqIG5hbWUsIGFuZCBwYXRoLiBJZiBwYXJlbnRNb2R1bGVNYXAgaXMgcHJvdmlkZWQgaXQgd2lsbFxuICAgICAgICAgKiBhbHNvIG5vcm1hbGl6ZSB0aGUgbmFtZSB2aWEgcmVxdWlyZS5ub3JtYWxpemUoKVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSB0aGUgbW9kdWxlIG5hbWVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IFtwYXJlbnRNb2R1bGVNYXBdIHBhcmVudCBtb2R1bGUgbWFwXG4gICAgICAgICAqIGZvciB0aGUgbW9kdWxlIG5hbWUsIHVzZWQgdG8gcmVzb2x2ZSByZWxhdGl2ZSBuYW1lcy5cbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpc05vcm1hbGl6ZWQ6IGlzIHRoZSBJRCBhbHJlYWR5IG5vcm1hbGl6ZWQuXG4gICAgICAgICAqIFRoaXMgaXMgdHJ1ZSBpZiB0aGlzIGNhbGwgaXMgZG9uZSBmb3IgYSBkZWZpbmUoKSBtb2R1bGUgSUQuXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gYXBwbHlNYXA6IGFwcGx5IHRoZSBtYXAgY29uZmlnIHRvIHRoZSBJRC5cbiAgICAgICAgICogU2hvdWxkIG9ubHkgYmUgdHJ1ZSBpZiB0aGlzIG1hcCBpcyBmb3IgYSBkZXBlbmRlbmN5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbWFrZU1vZHVsZU1hcChuYW1lLCBwYXJlbnRNb2R1bGVNYXAsIGlzTm9ybWFsaXplZCwgYXBwbHlNYXApIHtcbiAgICAgICAgICAgIHZhciB1cmwsIHBsdWdpbk1vZHVsZSwgc3VmZml4LCBuYW1lUGFydHMsXG4gICAgICAgICAgICAgICAgcHJlZml4ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBwYXJlbnROYW1lID0gcGFyZW50TW9kdWxlTWFwID8gcGFyZW50TW9kdWxlTWFwLm5hbWUgOiBudWxsLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsTmFtZSA9IG5hbWUsXG4gICAgICAgICAgICAgICAgaXNEZWZpbmUgPSB0cnVlLFxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gJyc7XG5cbiAgICAgICAgICAgIC8vSWYgbm8gbmFtZSwgdGhlbiBpdCBtZWFucyBpdCBpcyBhIHJlcXVpcmUgY2FsbCwgZ2VuZXJhdGUgYW5cbiAgICAgICAgICAgIC8vaW50ZXJuYWwgbmFtZS5cbiAgICAgICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgICAgIGlzRGVmaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbmFtZSA9ICdfQHInICsgKHJlcXVpcmVDb3VudGVyICs9IDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuYW1lUGFydHMgPSBzcGxpdFByZWZpeChuYW1lKTtcbiAgICAgICAgICAgIHByZWZpeCA9IG5hbWVQYXJ0c1swXTtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lUGFydHNbMV07XG5cbiAgICAgICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggPSBub3JtYWxpemUocHJlZml4LCBwYXJlbnROYW1lLCBhcHBseU1hcCk7XG4gICAgICAgICAgICAgICAgcGx1Z2luTW9kdWxlID0gZ2V0T3duKGRlZmluZWQsIHByZWZpeCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQWNjb3VudCBmb3IgcmVsYXRpdmUgcGF0aHMgaWYgdGhlcmUgaXMgYSBiYXNlIG5hbWUuXG4gICAgICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBsdWdpbk1vZHVsZSAmJiBwbHVnaW5Nb2R1bGUubm9ybWFsaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1BsdWdpbiBpcyBsb2FkZWQsIHVzZSBpdHMgbm9ybWFsaXplIG1ldGhvZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gcGx1Z2luTW9kdWxlLm5vcm1hbGl6ZShuYW1lLCBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub3JtYWxpemUobmFtZSwgcGFyZW50TmFtZSwgYXBwbHlNYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBuZXN0ZWQgcGx1Z2luIHJlZmVyZW5jZXMsIHRoZW4gZG8gbm90IHRyeSB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm9ybWFsaXplLCBhcyBpdCB3aWxsIG5vdCBub3JtYWxpemUgY29ycmVjdGx5LiBUaGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwbGFjZXMgYSByZXN0cmljdGlvbiBvbiByZXNvdXJjZUlkcywgYW5kIHRoZSBsb25nZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRlcm0gc29sdXRpb24gaXMgbm90IHRvIG5vcm1hbGl6ZSB1bnRpbCBwbHVnaW5zIGFyZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9hZGVkIGFuZCBhbGwgbm9ybWFsaXphdGlvbnMgdG8gYWxsb3cgZm9yIGFzeW5jXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsb2FkaW5nIG9mIGEgbG9hZGVyIHBsdWdpbi4gQnV0IGZvciBub3csIGZpeGVzIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29tbW9uIHVzZXMuIERldGFpbHMgaW4gIzExMzFcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gbmFtZS5pbmRleE9mKCchJykgPT09IC0xID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplKG5hbWUsIHBhcmVudE5hbWUsIGFwcGx5TWFwKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL0EgcmVndWxhciBtb2R1bGUuXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gbm9ybWFsaXplKG5hbWUsIHBhcmVudE5hbWUsIGFwcGx5TWFwKTtcblxuICAgICAgICAgICAgICAgICAgICAvL05vcm1hbGl6ZWQgbmFtZSBtYXkgYmUgYSBwbHVnaW4gSUQgZHVlIHRvIG1hcCBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgLy9hcHBsaWNhdGlvbiBpbiBub3JtYWxpemUuIFRoZSBtYXAgY29uZmlnIHZhbHVlcyBtdXN0XG4gICAgICAgICAgICAgICAgICAgIC8vYWxyZWFkeSBiZSBub3JtYWxpemVkLCBzbyBkbyBub3QgbmVlZCB0byByZWRvIHRoYXQgcGFydC5cbiAgICAgICAgICAgICAgICAgICAgbmFtZVBhcnRzID0gc3BsaXRQcmVmaXgobm9ybWFsaXplZE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBwcmVmaXggPSBuYW1lUGFydHNbMF07XG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gbmFtZVBhcnRzWzFdO1xuICAgICAgICAgICAgICAgICAgICBpc05vcm1hbGl6ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGNvbnRleHQubmFtZVRvVXJsKG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vSWYgdGhlIGlkIGlzIGEgcGx1Z2luIGlkIHRoYXQgY2Fubm90IGJlIGRldGVybWluZWQgaWYgaXQgbmVlZHNcbiAgICAgICAgICAgIC8vbm9ybWFsaXphdGlvbiwgc3RhbXAgaXQgd2l0aCBhIHVuaXF1ZSBJRCBzbyB0d28gbWF0Y2hpbmcgcmVsYXRpdmVcbiAgICAgICAgICAgIC8vaWRzIHRoYXQgbWF5IGNvbmZsaWN0IGNhbiBiZSBzZXBhcmF0ZS5cbiAgICAgICAgICAgIHN1ZmZpeCA9IHByZWZpeCAmJiAhcGx1Z2luTW9kdWxlICYmICFpc05vcm1hbGl6ZWQgP1xuICAgICAgICAgICAgICAgICAgICAgJ191bm5vcm1hbGl6ZWQnICsgKHVubm9ybWFsaXplZENvdW50ZXIgKz0gMSkgOlxuICAgICAgICAgICAgICAgICAgICAgJyc7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcHJlZml4OiBwcmVmaXgsXG4gICAgICAgICAgICAgICAgbmFtZTogbm9ybWFsaXplZE5hbWUsXG4gICAgICAgICAgICAgICAgcGFyZW50TWFwOiBwYXJlbnRNb2R1bGVNYXAsXG4gICAgICAgICAgICAgICAgdW5ub3JtYWxpemVkOiAhIXN1ZmZpeCxcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbE5hbWU6IG9yaWdpbmFsTmFtZSxcbiAgICAgICAgICAgICAgICBpc0RlZmluZTogaXNEZWZpbmUsXG4gICAgICAgICAgICAgICAgaWQ6IChwcmVmaXggP1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4ICsgJyEnICsgbm9ybWFsaXplZE5hbWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZE5hbWUpICsgc3VmZml4XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TW9kdWxlKGRlcE1hcCkge1xuICAgICAgICAgICAgdmFyIGlkID0gZGVwTWFwLmlkLFxuICAgICAgICAgICAgICAgIG1vZCA9IGdldE93bihyZWdpc3RyeSwgaWQpO1xuXG4gICAgICAgICAgICBpZiAoIW1vZCkge1xuICAgICAgICAgICAgICAgIG1vZCA9IHJlZ2lzdHJ5W2lkXSA9IG5ldyBjb250ZXh0Lk1vZHVsZShkZXBNYXApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbW9kO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb24oZGVwTWFwLCBuYW1lLCBmbikge1xuICAgICAgICAgICAgdmFyIGlkID0gZGVwTWFwLmlkLFxuICAgICAgICAgICAgICAgIG1vZCA9IGdldE93bihyZWdpc3RyeSwgaWQpO1xuXG4gICAgICAgICAgICBpZiAoaGFzUHJvcChkZWZpbmVkLCBpZCkgJiZcbiAgICAgICAgICAgICAgICAgICAgKCFtb2QgfHwgbW9kLmRlZmluZUVtaXRDb21wbGV0ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2RlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGZuKGRlZmluZWRbaWRdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vZCA9IGdldE1vZHVsZShkZXBNYXApO1xuICAgICAgICAgICAgICAgIGlmIChtb2QuZXJyb3IgJiYgbmFtZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICAgICAgICBmbihtb2QuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZC5vbihuYW1lLCBmbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25FcnJvcihlcnIsIGVycmJhY2spIHtcbiAgICAgICAgICAgIHZhciBpZHMgPSBlcnIucmVxdWlyZU1vZHVsZXMsXG4gICAgICAgICAgICAgICAgbm90aWZpZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGVycmJhY2spIHtcbiAgICAgICAgICAgICAgICBlcnJiYWNrKGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVhY2goaWRzLCBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vZCA9IGdldE93bihyZWdpc3RyeSwgaWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1NldCBlcnJvciBvbiBtb2R1bGUsIHNvIGl0IHNraXBzIHRpbWVvdXQgY2hlY2tzLlxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kLmVycm9yID0gZXJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vZC5ldmVudHMuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RpZmllZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFub3RpZmllZCkge1xuICAgICAgICAgICAgICAgICAgICByZXEub25FcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnRlcm5hbCBtZXRob2QgdG8gdHJhbnNmZXIgZ2xvYmFsUXVldWUgaXRlbXMgdG8gdGhpcyBjb250ZXh0J3NcbiAgICAgICAgICogZGVmUXVldWUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB0YWtlR2xvYmFsUXVldWUoKSB7XG4gICAgICAgICAgICAvL1B1c2ggYWxsIHRoZSBnbG9iYWxEZWZRdWV1ZSBpdGVtcyBpbnRvIHRoZSBjb250ZXh0J3MgZGVmUXVldWVcbiAgICAgICAgICAgIGlmIChnbG9iYWxEZWZRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvL0FycmF5IHNwbGljZSBpbiB0aGUgdmFsdWVzIHNpbmNlIHRoZSBjb250ZXh0IGNvZGUgaGFzIGFcbiAgICAgICAgICAgICAgICAvL2xvY2FsIHZhciByZWYgdG8gZGVmUXVldWUsIHNvIGNhbm5vdCBqdXN0IHJlYXNzaWduIHRoZSBvbmVcbiAgICAgICAgICAgICAgICAvL29uIGNvbnRleHQuXG4gICAgICAgICAgICAgICAgYXBzcC5hcHBseShkZWZRdWV1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkZWZRdWV1ZS5sZW5ndGgsIDBdLmNvbmNhdChnbG9iYWxEZWZRdWV1ZSkpO1xuICAgICAgICAgICAgICAgIGdsb2JhbERlZlF1ZXVlID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBoYW5kbGVycyA9IHtcbiAgICAgICAgICAgICdyZXF1aXJlJzogZnVuY3Rpb24gKG1vZCkge1xuICAgICAgICAgICAgICAgIGlmIChtb2QucmVxdWlyZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9kLnJlcXVpcmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChtb2QucmVxdWlyZSA9IGNvbnRleHQubWFrZVJlcXVpcmUobW9kLm1hcCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnZXhwb3J0cyc6IGZ1bmN0aW9uIChtb2QpIHtcbiAgICAgICAgICAgICAgICBtb2QudXNpbmdFeHBvcnRzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAobW9kLm1hcC5pc0RlZmluZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kLmV4cG9ydHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoZGVmaW5lZFttb2QubWFwLmlkXSA9IG1vZC5leHBvcnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAobW9kLmV4cG9ydHMgPSBkZWZpbmVkW21vZC5tYXAuaWRdID0ge30pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdtb2R1bGUnOiBmdW5jdGlvbiAobW9kKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vZC5tb2R1bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vZC5tb2R1bGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChtb2QubW9kdWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IG1vZC5tYXAuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmk6IG1vZC5tYXAudXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICBnZXRPd24oY29uZmlnLmNvbmZpZywgbW9kLm1hcC5pZCkgfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0czogbW9kLmV4cG9ydHMgfHwgKG1vZC5leHBvcnRzID0ge30pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBjbGVhblJlZ2lzdHJ5KGlkKSB7XG4gICAgICAgICAgICAvL0NsZWFuIHVwIG1hY2hpbmVyeSB1c2VkIGZvciB3YWl0aW5nIG1vZHVsZXMuXG4gICAgICAgICAgICBkZWxldGUgcmVnaXN0cnlbaWRdO1xuICAgICAgICAgICAgZGVsZXRlIGVuYWJsZWRSZWdpc3RyeVtpZF07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBicmVha0N5Y2xlKG1vZCwgdHJhY2VkLCBwcm9jZXNzZWQpIHtcbiAgICAgICAgICAgIHZhciBpZCA9IG1vZC5tYXAuaWQ7XG5cbiAgICAgICAgICAgIGlmIChtb2QuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBtb2QuZW1pdCgnZXJyb3InLCBtb2QuZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmFjZWRbaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBlYWNoKG1vZC5kZXBNYXBzLCBmdW5jdGlvbiAoZGVwTWFwLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXBJZCA9IGRlcE1hcC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcCA9IGdldE93bihyZWdpc3RyeSwgZGVwSWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vT25seSBmb3JjZSB0aGluZ3MgdGhhdCBoYXZlIG5vdCBjb21wbGV0ZWRcbiAgICAgICAgICAgICAgICAgICAgLy9iZWluZyBkZWZpbmVkLCBzbyBzdGlsbCBpbiB0aGUgcmVnaXN0cnksXG4gICAgICAgICAgICAgICAgICAgIC8vYW5kIG9ubHkgaWYgaXQgaGFzIG5vdCBiZWVuIG1hdGNoZWQgdXBcbiAgICAgICAgICAgICAgICAgICAgLy9pbiB0aGUgbW9kdWxlIGFscmVhZHkuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXAgJiYgIW1vZC5kZXBNYXRjaGVkW2ldICYmICFwcm9jZXNzZWRbZGVwSWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2V0T3duKHRyYWNlZCwgZGVwSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kLmRlZmluZURlcChpLCBkZWZpbmVkW2RlcElkXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kLmNoZWNrKCk7IC8vcGFzcyBmYWxzZT9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtDeWNsZShkZXAsIHRyYWNlZCwgcHJvY2Vzc2VkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByb2Nlc3NlZFtpZF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tMb2FkZWQoKSB7XG4gICAgICAgICAgICB2YXIgZXJyLCB1c2luZ1BhdGhGYWxsYmFjayxcbiAgICAgICAgICAgICAgICB3YWl0SW50ZXJ2YWwgPSBjb25maWcud2FpdFNlY29uZHMgKiAxMDAwLFxuICAgICAgICAgICAgICAgIC8vSXQgaXMgcG9zc2libGUgdG8gZGlzYWJsZSB0aGUgd2FpdCBpbnRlcnZhbCBieSB1c2luZyB3YWl0U2Vjb25kcyBvZiAwLlxuICAgICAgICAgICAgICAgIGV4cGlyZWQgPSB3YWl0SW50ZXJ2YWwgJiYgKGNvbnRleHQuc3RhcnRUaW1lICsgd2FpdEludGVydmFsKSA8IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgIG5vTG9hZHMgPSBbXSxcbiAgICAgICAgICAgICAgICByZXFDYWxscyA9IFtdLFxuICAgICAgICAgICAgICAgIHN0aWxsTG9hZGluZyA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIG5lZWRDeWNsZUNoZWNrID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy9EbyBub3QgYm90aGVyIGlmIHRoaXMgY2FsbCB3YXMgYSByZXN1bHQgb2YgYSBjeWNsZSBicmVhay5cbiAgICAgICAgICAgIGlmIChpbkNoZWNrTG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbkNoZWNrTG9hZGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy9GaWd1cmUgb3V0IHRoZSBzdGF0ZSBvZiBhbGwgdGhlIG1vZHVsZXMuXG4gICAgICAgICAgICBlYWNoUHJvcChlbmFibGVkUmVnaXN0cnksIGZ1bmN0aW9uIChtb2QpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFwID0gbW9kLm1hcCxcbiAgICAgICAgICAgICAgICAgICAgbW9kSWQgPSBtYXAuaWQ7XG5cbiAgICAgICAgICAgICAgICAvL1NraXAgdGhpbmdzIHRoYXQgYXJlIG5vdCBlbmFibGVkIG9yIGluIGVycm9yIHN0YXRlLlxuICAgICAgICAgICAgICAgIGlmICghbW9kLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghbWFwLmlzRGVmaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcUNhbGxzLnB1c2gobW9kKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIW1vZC5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZSBtb2R1bGUgc2hvdWxkIGJlIGV4ZWN1dGVkLCBhbmQgaXQgaGFzIG5vdFxuICAgICAgICAgICAgICAgICAgICAvL2JlZW4gaW5pdGVkIGFuZCB0aW1lIGlzIHVwLCByZW1lbWJlciBpdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtb2QuaW5pdGVkICYmIGV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNQYXRoRmFsbGJhY2sobW9kSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNpbmdQYXRoRmFsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0aWxsTG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vTG9hZHMucHVzaChtb2RJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlU2NyaXB0KG1vZElkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghbW9kLmluaXRlZCAmJiBtb2QuZmV0Y2hlZCAmJiBtYXAuaXNEZWZpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0aWxsTG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1hcC5wcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL05vIHJlYXNvbiB0byBrZWVwIGxvb2tpbmcgZm9yIHVuZmluaXNoZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2xvYWRpbmcuIElmIHRoZSBvbmx5IHN0aWxsTG9hZGluZyBpcyBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wbHVnaW4gcmVzb3VyY2UgdGhvdWdoLCBrZWVwIGdvaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYmVjYXVzZSBpdCBtYXkgYmUgdGhhdCBhIHBsdWdpbiByZXNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaXMgd2FpdGluZyBvbiBhIG5vbi1wbHVnaW4gY3ljbGUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChuZWVkQ3ljbGVDaGVjayA9IGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoZXhwaXJlZCAmJiBub0xvYWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vSWYgd2FpdCB0aW1lIGV4cGlyZWQsIHRocm93IGVycm9yIG9mIHVubG9hZGVkIG1vZHVsZXMuXG4gICAgICAgICAgICAgICAgZXJyID0gbWFrZUVycm9yKCd0aW1lb3V0JywgJ0xvYWQgdGltZW91dCBmb3IgbW9kdWxlczogJyArIG5vTG9hZHMsIG51bGwsIG5vTG9hZHMpO1xuICAgICAgICAgICAgICAgIGVyci5jb250ZXh0TmFtZSA9IGNvbnRleHQuY29udGV4dE5hbWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9uRXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Ob3QgZXhwaXJlZCwgY2hlY2sgZm9yIGEgY3ljbGUuXG4gICAgICAgICAgICBpZiAobmVlZEN5Y2xlQ2hlY2spIHtcbiAgICAgICAgICAgICAgICBlYWNoKHJlcUNhbGxzLCBmdW5jdGlvbiAobW9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrQ3ljbGUobW9kLCB7fSwge30pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0lmIHN0aWxsIHdhaXRpbmcgb24gbG9hZHMsIGFuZCB0aGUgd2FpdGluZyBsb2FkIGlzIHNvbWV0aGluZ1xuICAgICAgICAgICAgLy9vdGhlciB0aGFuIGEgcGx1Z2luIHJlc291cmNlLCBvciB0aGVyZSBhcmUgc3RpbGwgb3V0c3RhbmRpbmdcbiAgICAgICAgICAgIC8vc2NyaXB0cywgdGhlbiBqdXN0IHRyeSBiYWNrIGxhdGVyLlxuICAgICAgICAgICAgaWYgKCghZXhwaXJlZCB8fCB1c2luZ1BhdGhGYWxsYmFjaykgJiYgc3RpbGxMb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgLy9Tb21ldGhpbmcgaXMgc3RpbGwgd2FpdGluZyB0byBsb2FkLiBXYWl0IGZvciBpdCwgYnV0IG9ubHlcbiAgICAgICAgICAgICAgICAvL2lmIGEgdGltZW91dCBpcyBub3QgYWxyZWFkeSBpbiBlZmZlY3QuXG4gICAgICAgICAgICAgICAgaWYgKChpc0Jyb3dzZXIgfHwgaXNXZWJXb3JrZXIpICYmICFjaGVja0xvYWRlZFRpbWVvdXRJZCkge1xuICAgICAgICAgICAgICAgICAgICBjaGVja0xvYWRlZFRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tMb2FkZWRUaW1lb3V0SWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tMb2FkZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5DaGVja0xvYWRlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgTW9kdWxlID0gZnVuY3Rpb24gKG1hcCkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSBnZXRPd24odW5kZWZFdmVudHMsIG1hcC5pZCkgfHwge307XG4gICAgICAgICAgICB0aGlzLm1hcCA9IG1hcDtcbiAgICAgICAgICAgIHRoaXMuc2hpbSA9IGdldE93bihjb25maWcuc2hpbSwgbWFwLmlkKTtcbiAgICAgICAgICAgIHRoaXMuZGVwRXhwb3J0cyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5kZXBNYXBzID0gW107XG4gICAgICAgICAgICB0aGlzLmRlcE1hdGNoZWQgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luTWFwcyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5kZXBDb3VudCA9IDA7XG5cbiAgICAgICAgICAgIC8qIHRoaXMuZXhwb3J0cyB0aGlzLmZhY3RvcnlcbiAgICAgICAgICAgICAgIHRoaXMuZGVwTWFwcyA9IFtdLFxuICAgICAgICAgICAgICAgdGhpcy5lbmFibGVkLCB0aGlzLmZldGNoZWRcbiAgICAgICAgICAgICovXG4gICAgICAgIH07XG5cbiAgICAgICAgTW9kdWxlLnByb3RvdHlwZSA9IHtcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uIChkZXBNYXBzLCBmYWN0b3J5LCBlcnJiYWNrLCBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgICAgICAgICAvL0RvIG5vdCBkbyBtb3JlIGluaXRzIGlmIGFscmVhZHkgZG9uZS4gQ2FuIGhhcHBlbiBpZiB0aGVyZVxuICAgICAgICAgICAgICAgIC8vYXJlIG11bHRpcGxlIGRlZmluZSBjYWxscyBmb3IgdGhlIHNhbWUgbW9kdWxlLiBUaGF0IGlzIG5vdFxuICAgICAgICAgICAgICAgIC8vYSBub3JtYWwsIGNvbW1vbiBjYXNlLCBidXQgaXQgaXMgYWxzbyBub3QgdW5leHBlY3RlZC5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbml0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuZmFjdG9yeSA9IGZhY3Rvcnk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAvL1JlZ2lzdGVyIGZvciBlcnJvcnMgb24gdGhpcyBtb2R1bGUuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oJ2Vycm9yJywgZXJyYmFjayk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV2ZW50cy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAvL0lmIG5vIGVycmJhY2sgYWxyZWFkeSwgYnV0IHRoZXJlIGFyZSBlcnJvciBsaXN0ZW5lcnNcbiAgICAgICAgICAgICAgICAgICAgLy9vbiB0aGlzIG1vZHVsZSwgc2V0IHVwIGFuIGVycmJhY2sgdG8gcGFzcyB0byB0aGUgZGVwcy5cbiAgICAgICAgICAgICAgICAgICAgZXJyYmFjayA9IGJpbmQodGhpcywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vRG8gYSBjb3B5IG9mIHRoZSBkZXBlbmRlbmN5IGFycmF5LCBzbyB0aGF0XG4gICAgICAgICAgICAgICAgLy9zb3VyY2UgaW5wdXRzIGFyZSBub3QgbW9kaWZpZWQuIEZvciBleGFtcGxlXG4gICAgICAgICAgICAgICAgLy9cInNoaW1cIiBkZXBzIGFyZSBwYXNzZWQgaW4gaGVyZSBkaXJlY3RseSwgYW5kXG4gICAgICAgICAgICAgICAgLy9kb2luZyBhIGRpcmVjdCBtb2RpZmljYXRpb24gb2YgdGhlIGRlcE1hcHMgYXJyYXlcbiAgICAgICAgICAgICAgICAvL3dvdWxkIGFmZmVjdCB0aGF0IGNvbmZpZy5cbiAgICAgICAgICAgICAgICB0aGlzLmRlcE1hcHMgPSBkZXBNYXBzICYmIGRlcE1hcHMuc2xpY2UoMCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVycmJhY2sgPSBlcnJiYWNrO1xuXG4gICAgICAgICAgICAgICAgLy9JbmRpY2F0ZSB0aGlzIG1vZHVsZSBoYXMgYmUgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmlnbm9yZSA9IG9wdGlvbnMuaWdub3JlO1xuXG4gICAgICAgICAgICAgICAgLy9Db3VsZCBoYXZlIG9wdGlvbiB0byBpbml0IHRoaXMgbW9kdWxlIGluIGVuYWJsZWQgbW9kZSxcbiAgICAgICAgICAgICAgICAvL29yIGNvdWxkIGhhdmUgYmVlbiBwcmV2aW91c2x5IG1hcmtlZCBhcyBlbmFibGVkLiBIb3dldmVyLFxuICAgICAgICAgICAgICAgIC8vdGhlIGRlcGVuZGVuY2llcyBhcmUgbm90IGtub3duIHVudGlsIGluaXQgaXMgY2FsbGVkLiBTb1xuICAgICAgICAgICAgICAgIC8vaWYgZW5hYmxlZCBwcmV2aW91c2x5LCBub3cgdHJpZ2dlciBkZXBlbmRlbmNpZXMgYXMgZW5hYmxlZC5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5lbmFibGVkIHx8IHRoaXMuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAvL0VuYWJsZSB0aGlzIG1vZHVsZSBhbmQgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgICAgICAgICAvL1dpbGwgY2FsbCB0aGlzLmNoZWNrKClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmFibGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZGVmaW5lRGVwOiBmdW5jdGlvbiAoaSwgZGVwRXhwb3J0cykge1xuICAgICAgICAgICAgICAgIC8vQmVjYXVzZSBvZiBjeWNsZXMsIGRlZmluZWQgY2FsbGJhY2sgZm9yIGEgZ2l2ZW5cbiAgICAgICAgICAgICAgICAvL2V4cG9ydCBjYW4gYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlLlxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kZXBNYXRjaGVkW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwTWF0Y2hlZFtpXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwQ291bnQgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBFeHBvcnRzW2ldID0gZGVwRXhwb3J0cztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBmZXRjaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZldGNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgY29udGV4dC5zdGFydFRpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG1hcCA9IHRoaXMubWFwO1xuXG4gICAgICAgICAgICAgICAgLy9JZiB0aGUgbWFuYWdlciBpcyBmb3IgYSBwbHVnaW4gbWFuYWdlZCByZXNvdXJjZSxcbiAgICAgICAgICAgICAgICAvL2FzayB0aGUgcGx1Z2luIHRvIGxvYWQgaXQgbm93LlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNoaW0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5tYWtlUmVxdWlyZSh0aGlzLm1hcCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlQnVpbGRDYWxsYmFjazogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KSh0aGlzLnNoaW0uZGVwcyB8fCBbXSwgYmluZCh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWFwLnByZWZpeCA/IHRoaXMuY2FsbFBsdWdpbigpIDogdGhpcy5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL1JlZ3VsYXIgZGVwZW5kZW5jeS5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hcC5wcmVmaXggPyB0aGlzLmNhbGxQbHVnaW4oKSA6IHRoaXMubG9hZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gdGhpcy5tYXAudXJsO1xuXG4gICAgICAgICAgICAgICAgLy9SZWd1bGFyIGRlcGVuZGVuY3kuXG4gICAgICAgICAgICAgICAgaWYgKCF1cmxGZXRjaGVkW3VybF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsRmV0Y2hlZFt1cmxdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5sb2FkKHRoaXMubWFwLmlkLCB1cmwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ2hlY2tzIGlmIHRoZSBtb2R1bGUgaXMgcmVhZHkgdG8gZGVmaW5lIGl0c2VsZiwgYW5kIGlmIHNvLFxuICAgICAgICAgICAgICogZGVmaW5lIGl0LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjaGVjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5lbmFibGVkIHx8IHRoaXMuZW5hYmxpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBlcnIsIGNqc01vZHVsZSxcbiAgICAgICAgICAgICAgICAgICAgaWQgPSB0aGlzLm1hcC5pZCxcbiAgICAgICAgICAgICAgICAgICAgZGVwRXhwb3J0cyA9IHRoaXMuZGVwRXhwb3J0cyxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IHRoaXMuZXhwb3J0cyxcbiAgICAgICAgICAgICAgICAgICAgZmFjdG9yeSA9IHRoaXMuZmFjdG9yeTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgdGhpcy5lcnJvcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5kZWZpbmluZykge1xuICAgICAgICAgICAgICAgICAgICAvL1RoZSBmYWN0b3J5IGNvdWxkIHRyaWdnZXIgYW5vdGhlciByZXF1aXJlIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgLy90aGF0IHdvdWxkIHJlc3VsdCBpbiBjaGVja2luZyB0aGlzIG1vZHVsZSB0b1xuICAgICAgICAgICAgICAgICAgICAvL2RlZmluZSBpdHNlbGYgYWdhaW4uIElmIGFscmVhZHkgaW4gdGhlIHByb2Nlc3NcbiAgICAgICAgICAgICAgICAgICAgLy9vZiBkb2luZyB0aGF0LCBza2lwIHRoaXMgd29yay5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZpbmluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVwQ291bnQgPCAxICYmICF0aGlzLmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGZhY3RvcnkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGVyZSBpcyBhbiBlcnJvciBsaXN0ZW5lciwgZmF2b3IgcGFzc2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdG8gdGhhdCBpbnN0ZWFkIG9mIHRocm93aW5nIGFuIGVycm9yLiBIb3dldmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb25seSBkbyBpdCBmb3IgZGVmaW5lKCknZCAgbW9kdWxlcy4gcmVxdWlyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZXJyYmFja3Mgc2hvdWxkIG5vdCBiZSBjYWxsZWQgZm9yIGZhaWx1cmVzIGluXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVpciBjYWxsYmFja3MgKCM2OTkpLiBIb3dldmVyIGlmIGEgZ2xvYmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vbkVycm9yIGlzIHNldCwgdXNlIHRoYXQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCh0aGlzLmV2ZW50cy5lcnJvciAmJiB0aGlzLm1hcC5pc0RlZmluZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxLm9uRXJyb3IgIT09IGRlZmF1bHRPbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBvcnRzID0gY29udGV4dC5leGVjQ2IoaWQsIGZhY3RvcnksIGRlcEV4cG9ydHMsIGV4cG9ydHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnIgPSBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IGNvbnRleHQuZXhlY0NiKGlkLCBmYWN0b3J5LCBkZXBFeHBvcnRzLCBleHBvcnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGYXZvciByZXR1cm4gdmFsdWUgb3ZlciBleHBvcnRzLiBJZiBub2RlL2NqcyBpbiBwbGF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZW4gd2lsbCBub3QgaGF2ZSBhIHJldHVybiB2YWx1ZSBhbnl3YXkuIEZhdm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbW9kdWxlLmV4cG9ydHMgYXNzaWdubWVudCBvdmVyIGV4cG9ydHMgb2JqZWN0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hcC5pc0RlZmluZSAmJiBleHBvcnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2pzTW9kdWxlID0gdGhpcy5tb2R1bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjanNNb2R1bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9ydHMgPSBjanNNb2R1bGUuZXhwb3J0cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnVzaW5nRXhwb3J0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9leHBvcnRzIGFscmVhZHkgc2V0IHRoZSBkZWZpbmVkIHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IHRoaXMuZXhwb3J0cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyLnJlcXVpcmVNYXAgPSB0aGlzLm1hcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyLnJlcXVpcmVNb2R1bGVzID0gdGhpcy5tYXAuaXNEZWZpbmUgPyBbdGhpcy5tYXAuaWRdIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyLnJlcXVpcmVUeXBlID0gdGhpcy5tYXAuaXNEZWZpbmUgPyAnZGVmaW5lJyA6ICdyZXF1aXJlJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uRXJyb3IoKHRoaXMuZXJyb3IgPSBlcnIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9KdXN0IGEgbGl0ZXJhbCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9ydHMgPSBmYWN0b3J5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cG9ydHMgPSBleHBvcnRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXAuaXNEZWZpbmUgJiYgIXRoaXMuaWdub3JlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmaW5lZFtpZF0gPSBleHBvcnRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5vblJlc291cmNlTG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXEub25SZXNvdXJjZUxvYWQoY29udGV4dCwgdGhpcy5tYXAsIHRoaXMuZGVwTWFwcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0NsZWFuIHVwXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhblJlZ2lzdHJ5KGlkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZpbmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vRmluaXNoZWQgdGhlIGRlZmluZSBzdGFnZS4gQWxsb3cgY2FsbGluZyBjaGVjayBhZ2FpblxuICAgICAgICAgICAgICAgICAgICAvL3RvIGFsbG93IGRlZmluZSBub3RpZmljYXRpb25zIGJlbG93IGluIHRoZSBjYXNlIG9mIGFcbiAgICAgICAgICAgICAgICAgICAgLy9jeWNsZS5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZpbmluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlZmluZWQgJiYgIXRoaXMuZGVmaW5lRW1pdHRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZpbmVFbWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZGVmaW5lZCcsIHRoaXMuZXhwb3J0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmluZUVtaXRDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGNhbGxQbHVnaW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFwID0gdGhpcy5tYXAsXG4gICAgICAgICAgICAgICAgICAgIGlkID0gbWFwLmlkLFxuICAgICAgICAgICAgICAgICAgICAvL01hcCBhbHJlYWR5IG5vcm1hbGl6ZWQgdGhlIHByZWZpeC5cbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luTWFwID0gbWFrZU1vZHVsZU1hcChtYXAucHJlZml4KTtcblxuICAgICAgICAgICAgICAgIC8vTWFyayB0aGlzIGFzIGEgZGVwZW5kZW5jeSBmb3IgdGhpcyBwbHVnaW4sIHNvIGl0XG4gICAgICAgICAgICAgICAgLy9jYW4gYmUgdHJhY2VkIGZvciBjeWNsZXMuXG4gICAgICAgICAgICAgICAgdGhpcy5kZXBNYXBzLnB1c2gocGx1Z2luTWFwKTtcblxuICAgICAgICAgICAgICAgIG9uKHBsdWdpbk1hcCwgJ2RlZmluZWQnLCBiaW5kKHRoaXMsIGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvYWQsIG5vcm1hbGl6ZWRNYXAsIG5vcm1hbGl6ZWRNb2QsXG4gICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVJZCA9IGdldE93bihidW5kbGVzTWFwLCB0aGlzLm1hcC5pZCksXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lID0gdGhpcy5tYXAubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5hbWUgPSB0aGlzLm1hcC5wYXJlbnRNYXAgPyB0aGlzLm1hcC5wYXJlbnRNYXAubmFtZSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFJlcXVpcmUgPSBjb250ZXh0Lm1ha2VSZXF1aXJlKG1hcC5wYXJlbnRNYXAsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVCdWlsZENhbGxiYWNrOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvL0lmIGN1cnJlbnQgbWFwIGlzIG5vdCBub3JtYWxpemVkLCB3YWl0IGZvciB0aGF0XG4gICAgICAgICAgICAgICAgICAgIC8vbm9ybWFsaXplZCBuYW1lIHRvIGxvYWQgaW5zdGVhZCBvZiBjb250aW51aW5nLlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXAudW5ub3JtYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL05vcm1hbGl6ZSB0aGUgSUQgaWYgdGhlIHBsdWdpbiBhbGxvd3MgaXQuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGx1Z2luLm5vcm1hbGl6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgPSBwbHVnaW4ubm9ybWFsaXplKG5hbWUsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub3JtYWxpemUobmFtZSwgcGFyZW50TmFtZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkgfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcHJlZml4IGFuZCBuYW1lIHNob3VsZCBhbHJlYWR5IGJlIG5vcm1hbGl6ZWQsIG5vIG5lZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZm9yIGFwcGx5aW5nIG1hcCBjb25maWcgYWdhaW4gZWl0aGVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZE1hcCA9IG1ha2VNb2R1bGVNYXAobWFwLnByZWZpeCArICchJyArIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcC5wYXJlbnRNYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgb24obm9ybWFsaXplZE1hcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGVmaW5lZCcsIGJpbmQodGhpcywgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdChbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsdWU7IH0sIG51bGwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ25vcmU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkTW9kID0gZ2V0T3duKHJlZ2lzdHJ5LCBub3JtYWxpemVkTWFwLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkTW9kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9NYXJrIHRoaXMgYXMgYSBkZXBlbmRlbmN5IGZvciB0aGlzIHBsdWdpbiwgc28gaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NhbiBiZSB0cmFjZWQgZm9yIGN5Y2xlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlcE1hcHMucHVzaChub3JtYWxpemVkTWFwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50cy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkTW9kLm9uKCdlcnJvcicsIGJpbmQodGhpcywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZE1vZC5lbmFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9JZiBhIHBhdGhzIGNvbmZpZywgdGhlbiBqdXN0IGxvYWQgdGhhdCBmaWxlIGluc3RlYWQgdG9cbiAgICAgICAgICAgICAgICAgICAgLy9yZXNvbHZlIHRoZSBwbHVnaW4sIGFzIGl0IGlzIGJ1aWx0IGludG8gdGhhdCBwYXRocyBsYXllci5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bmRsZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcC51cmwgPSBjb250ZXh0Lm5hbWVUb1VybChidW5kbGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxvYWQgPSBiaW5kKHRoaXMsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0KFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiB2YWx1ZTsgfSwgbnVsbCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBsb2FkLmVycm9yID0gYmluZCh0aGlzLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yID0gZXJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyLnJlcXVpcmVNb2R1bGVzID0gW2lkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9SZW1vdmUgdGVtcCB1bm5vcm1hbGl6ZWQgbW9kdWxlcyBmb3IgdGhpcyBtb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NpbmNlIHRoZXkgd2lsbCBuZXZlciBiZSByZXNvbHZlZCBvdGhlcndpc2Ugbm93LlxuICAgICAgICAgICAgICAgICAgICAgICAgZWFjaFByb3AocmVnaXN0cnksIGZ1bmN0aW9uIChtb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9kLm1hcC5pZC5pbmRleE9mKGlkICsgJ191bm5vcm1hbGl6ZWQnKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhblJlZ2lzdHJ5KG1vZC5tYXAuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vQWxsb3cgcGx1Z2lucyB0byBsb2FkIG90aGVyIGNvZGUgd2l0aG91dCBoYXZpbmcgdG8ga25vdyB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy9jb250ZXh0IG9yIGhvdyB0byAnY29tcGxldGUnIHRoZSBsb2FkLlxuICAgICAgICAgICAgICAgICAgICBsb2FkLmZyb21UZXh0ID0gYmluZCh0aGlzLCBmdW5jdGlvbiAodGV4dCwgdGV4dEFsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLypqc2xpbnQgZXZpbDogdHJ1ZSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vZHVsZU5hbWUgPSBtYXAubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVNYXAgPSBtYWtlTW9kdWxlTWFwKG1vZHVsZU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0ludGVyYWN0aXZlID0gdXNlSW50ZXJhY3RpdmU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQXMgb2YgMi4xLjAsIHN1cHBvcnQganVzdCBwYXNzaW5nIHRoZSB0ZXh0LCB0byByZWluZm9yY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZnJvbVRleHQgb25seSBiZWluZyBjYWxsZWQgb25jZSBwZXIgcmVzb3VyY2UuIFN0aWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3N1cHBvcnQgb2xkIHN0eWxlIG9mIHBhc3NpbmcgbW9kdWxlTmFtZSBidXQgZGlzY2FyZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGF0IG1vZHVsZU5hbWUgaW4gZmF2b3Igb2YgdGhlIGludGVybmFsIHJlZi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0QWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRleHRBbHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVHVybiBvZmYgaW50ZXJhY3RpdmUgc2NyaXB0IG1hdGNoaW5nIGZvciBJRSBmb3IgYW55IGRlZmluZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jYWxscyBpbiB0aGUgdGV4dCwgdGhlbiB0dXJuIGl0IGJhY2sgb24gYXQgdGhlIGVuZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNJbnRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZUludGVyYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vUHJpbWUgdGhlIHN5c3RlbSBieSBjcmVhdGluZyBhIG1vZHVsZSBpbnN0YW5jZSBmb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaXQuXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRNb2R1bGUobW9kdWxlTWFwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9UcmFuc2ZlciBhbnkgY29uZmlnIHRvIHRoaXMgb3RoZXIgbW9kdWxlLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1Byb3AoY29uZmlnLmNvbmZpZywgaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZ1ttb2R1bGVOYW1lXSA9IGNvbmZpZy5jb25maWdbaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcS5leGVjKHRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvbkVycm9yKG1ha2VFcnJvcignZnJvbXRleHRldmFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdmcm9tVGV4dCBldmFsIGZvciAnICsgaWQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnIGZhaWxlZDogJyArIGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2lkXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzSW50ZXJhY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VJbnRlcmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vTWFyayB0aGlzIGFzIGEgZGVwZW5kZW5jeSBmb3IgdGhlIHBsdWdpblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBNYXBzLnB1c2gobW9kdWxlTWFwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9TdXBwb3J0IGFub255bW91cyBtb2R1bGVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5jb21wbGV0ZUxvYWQobW9kdWxlTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQmluZCB0aGUgdmFsdWUgb2YgdGhhdCBtb2R1bGUgdG8gdGhlIHZhbHVlIGZvciB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Jlc291cmNlIElELlxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxSZXF1aXJlKFttb2R1bGVOYW1lXSwgbG9hZCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vVXNlIHBhcmVudE5hbWUgaGVyZSBzaW5jZSB0aGUgcGx1Z2luJ3MgbmFtZSBpcyBub3QgcmVsaWFibGUsXG4gICAgICAgICAgICAgICAgICAgIC8vY291bGQgYmUgc29tZSB3ZWlyZCBzdHJpbmcgd2l0aCBubyBwYXRoIHRoYXQgYWN0dWFsbHkgd2FudHMgdG9cbiAgICAgICAgICAgICAgICAgICAgLy9yZWZlcmVuY2UgdGhlIHBhcmVudE5hbWUncyBwYXRoLlxuICAgICAgICAgICAgICAgICAgICBwbHVnaW4ubG9hZChtYXAubmFtZSwgbG9jYWxSZXF1aXJlLCBsb2FkLCBjb25maWcpO1xuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQuZW5hYmxlKHBsdWdpbk1hcCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW5NYXBzW3BsdWdpbk1hcC5pZF0gPSBwbHVnaW5NYXA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbmFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlbmFibGVkUmVnaXN0cnlbdGhpcy5tYXAuaWRdID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy9TZXQgZmxhZyBtZW50aW9uaW5nIHRoYXQgdGhlIG1vZHVsZSBpcyBlbmFibGluZyxcbiAgICAgICAgICAgICAgICAvL3NvIHRoYXQgaW1tZWRpYXRlIGNhbGxzIHRvIHRoZSBkZWZpbmVkIGNhbGxiYWNrc1xuICAgICAgICAgICAgICAgIC8vZm9yIGRlcGVuZGVuY2llcyBkbyBub3QgdHJpZ2dlciBpbmFkdmVydGVudCBsb2FkXG4gICAgICAgICAgICAgICAgLy93aXRoIHRoZSBkZXBDb3VudCBzdGlsbCBiZWluZyB6ZXJvLlxuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy9FbmFibGUgZWFjaCBkZXBlbmRlbmN5XG4gICAgICAgICAgICAgICAgZWFjaCh0aGlzLmRlcE1hcHMsIGJpbmQodGhpcywgZnVuY3Rpb24gKGRlcE1hcCwgaSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQsIG1vZCwgaGFuZGxlcjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRlcE1hcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vRGVwZW5kZW5jeSBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgdG8gYSBkZXBNYXBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYW5kIHdpcmVkIHVwIHRvIHRoaXMgbW9kdWxlLlxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwTWFwID0gbWFrZU1vZHVsZU1hcChkZXBNYXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLm1hcC5pc0RlZmluZSA/IHRoaXMubWFwIDogdGhpcy5tYXAucGFyZW50TWFwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLnNraXBNYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBNYXBzW2ldID0gZGVwTWFwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyID0gZ2V0T3duKGhhbmRsZXJzLCBkZXBNYXAuaWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwRXhwb3J0c1tpXSA9IGhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlcENvdW50ICs9IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uKGRlcE1hcCwgJ2RlZmluZWQnLCBiaW5kKHRoaXMsIGZ1bmN0aW9uIChkZXBFeHBvcnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZpbmVEZXAoaSwgZGVwRXhwb3J0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5lcnJiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb24oZGVwTWFwLCAnZXJyb3InLCBiaW5kKHRoaXMsIHRoaXMuZXJyYmFjaykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWQgPSBkZXBNYXAuaWQ7XG4gICAgICAgICAgICAgICAgICAgIG1vZCA9IHJlZ2lzdHJ5W2lkXTtcblxuICAgICAgICAgICAgICAgICAgICAvL1NraXAgc3BlY2lhbCBtb2R1bGVzIGxpa2UgJ3JlcXVpcmUnLCAnZXhwb3J0cycsICdtb2R1bGUnXG4gICAgICAgICAgICAgICAgICAgIC8vQWxzbywgZG9uJ3QgY2FsbCBlbmFibGUgaWYgaXQgaXMgYWxyZWFkeSBlbmFibGVkLFxuICAgICAgICAgICAgICAgICAgICAvL2ltcG9ydGFudCBpbiBjaXJjdWxhciBkZXBlbmRlbmN5IGNhc2VzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc1Byb3AoaGFuZGxlcnMsIGlkKSAmJiBtb2QgJiYgIW1vZC5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmVuYWJsZShkZXBNYXAsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgLy9FbmFibGUgZWFjaCBwbHVnaW4gdGhhdCBpcyB1c2VkIGluXG4gICAgICAgICAgICAgICAgLy9hIGRlcGVuZGVuY3lcbiAgICAgICAgICAgICAgICBlYWNoUHJvcCh0aGlzLnBsdWdpbk1hcHMsIGJpbmQodGhpcywgZnVuY3Rpb24gKHBsdWdpbk1hcCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbW9kID0gZ2V0T3duKHJlZ2lzdHJ5LCBwbHVnaW5NYXAuaWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kICYmICFtb2QuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5lbmFibGUocGx1Z2luTWFwLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2soKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG9uOiBmdW5jdGlvbiAobmFtZSwgY2IpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2JzID0gdGhpcy5ldmVudHNbbmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKCFjYnMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2JzID0gdGhpcy5ldmVudHNbbmFtZV0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2JzLnB1c2goY2IpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW1pdDogZnVuY3Rpb24gKG5hbWUsIGV2dCkge1xuICAgICAgICAgICAgICAgIGVhY2godGhpcy5ldmVudHNbbmFtZV0sIGZ1bmN0aW9uIChjYikge1xuICAgICAgICAgICAgICAgICAgICBjYihldnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vTm93IHRoYXQgdGhlIGVycm9yIGhhbmRsZXIgd2FzIHRyaWdnZXJlZCwgcmVtb3ZlXG4gICAgICAgICAgICAgICAgICAgIC8vdGhlIGxpc3RlbmVycywgc2luY2UgdGhpcyBicm9rZW4gTW9kdWxlIGluc3RhbmNlXG4gICAgICAgICAgICAgICAgICAgIC8vY2FuIHN0YXkgYXJvdW5kIGZvciBhIHdoaWxlIGluIHRoZSByZWdpc3RyeS5cbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzW25hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBjYWxsR2V0TW9kdWxlKGFyZ3MpIHtcbiAgICAgICAgICAgIC8vU2tpcCBtb2R1bGVzIGFscmVhZHkgZGVmaW5lZC5cbiAgICAgICAgICAgIGlmICghaGFzUHJvcChkZWZpbmVkLCBhcmdzWzBdKSkge1xuICAgICAgICAgICAgICAgIGdldE1vZHVsZShtYWtlTW9kdWxlTWFwKGFyZ3NbMF0sIG51bGwsIHRydWUpKS5pbml0KGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIobm9kZSwgZnVuYywgbmFtZSwgaWVOYW1lKSB7XG4gICAgICAgICAgICAvL0Zhdm9yIGRldGFjaEV2ZW50IGJlY2F1c2Ugb2YgSUU5XG4gICAgICAgICAgICAvL2lzc3VlLCBzZWUgYXR0YWNoRXZlbnQvYWRkRXZlbnRMaXN0ZW5lciBjb21tZW50IGVsc2V3aGVyZVxuICAgICAgICAgICAgLy9pbiB0aGlzIGZpbGUuXG4gICAgICAgICAgICBpZiAobm9kZS5kZXRhY2hFdmVudCAmJiAhaXNPcGVyYSkge1xuICAgICAgICAgICAgICAgIC8vUHJvYmFibHkgSUUuIElmIG5vdCBpdCB3aWxsIHRocm93IGFuIGVycm9yLCB3aGljaCB3aWxsIGJlXG4gICAgICAgICAgICAgICAgLy91c2VmdWwgdG8ga25vdy5cbiAgICAgICAgICAgICAgICBpZiAoaWVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuZGV0YWNoRXZlbnQoaWVOYW1lLCBmdW5jKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBmdW5jLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2l2ZW4gYW4gZXZlbnQgZnJvbSBhIHNjcmlwdCBub2RlLCBnZXQgdGhlIHJlcXVpcmVqcyBpbmZvIGZyb20gaXQsXG4gICAgICAgICAqIGFuZCB0aGVuIHJlbW92ZXMgdGhlIGV2ZW50IGxpc3RlbmVycyBvbiB0aGUgbm9kZS5cbiAgICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZ0XG4gICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRTY3JpcHREYXRhKGV2dCkge1xuICAgICAgICAgICAgLy9Vc2luZyBjdXJyZW50VGFyZ2V0IGluc3RlYWQgb2YgdGFyZ2V0IGZvciBGaXJlZm94IDIuMCdzIHNha2UuIE5vdFxuICAgICAgICAgICAgLy9hbGwgb2xkIGJyb3dzZXJzIHdpbGwgYmUgc3VwcG9ydGVkLCBidXQgdGhpcyBvbmUgd2FzIGVhc3kgZW5vdWdoXG4gICAgICAgICAgICAvL3RvIHN1cHBvcnQgYW5kIHN0aWxsIG1ha2VzIHNlbnNlLlxuICAgICAgICAgICAgdmFyIG5vZGUgPSBldnQuY3VycmVudFRhcmdldCB8fCBldnQuc3JjRWxlbWVudDtcblxuICAgICAgICAgICAgLy9SZW1vdmUgdGhlIGxpc3RlbmVycyBvbmNlIGhlcmUuXG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcihub2RlLCBjb250ZXh0Lm9uU2NyaXB0TG9hZCwgJ2xvYWQnLCAnb25yZWFkeXN0YXRlY2hhbmdlJyk7XG4gICAgICAgICAgICByZW1vdmVMaXN0ZW5lcihub2RlLCBjb250ZXh0Lm9uU2NyaXB0RXJyb3IsICdlcnJvcicpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgICAgICAgICAgaWQ6IG5vZGUgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVxdWlyZW1vZHVsZScpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaW50YWtlRGVmaW5lcygpIHtcbiAgICAgICAgICAgIHZhciBhcmdzO1xuXG4gICAgICAgICAgICAvL0FueSBkZWZpbmVkIG1vZHVsZXMgaW4gdGhlIGdsb2JhbCBxdWV1ZSwgaW50YWtlIHRoZW0gbm93LlxuICAgICAgICAgICAgdGFrZUdsb2JhbFF1ZXVlKCk7XG5cbiAgICAgICAgICAgIC8vTWFrZSBzdXJlIGFueSByZW1haW5pbmcgZGVmUXVldWUgaXRlbXMgZ2V0IHByb3Blcmx5IHByb2Nlc3NlZC5cbiAgICAgICAgICAgIHdoaWxlIChkZWZRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhcmdzID0gZGVmUXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJnc1swXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25FcnJvcihtYWtlRXJyb3IoJ21pc21hdGNoJywgJ01pc21hdGNoZWQgYW5vbnltb3VzIGRlZmluZSgpIG1vZHVsZTogJyArIGFyZ3NbYXJncy5sZW5ndGggLSAxXSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vYXJncyBhcmUgaWQsIGRlcHMsIGZhY3RvcnkuIFNob3VsZCBiZSBub3JtYWxpemVkIGJ5IHRoZVxuICAgICAgICAgICAgICAgICAgICAvL2RlZmluZSgpIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICBjYWxsR2V0TW9kdWxlKGFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQgPSB7XG4gICAgICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgICAgIGNvbnRleHROYW1lOiBjb250ZXh0TmFtZSxcbiAgICAgICAgICAgIHJlZ2lzdHJ5OiByZWdpc3RyeSxcbiAgICAgICAgICAgIGRlZmluZWQ6IGRlZmluZWQsXG4gICAgICAgICAgICB1cmxGZXRjaGVkOiB1cmxGZXRjaGVkLFxuICAgICAgICAgICAgZGVmUXVldWU6IGRlZlF1ZXVlLFxuICAgICAgICAgICAgTW9kdWxlOiBNb2R1bGUsXG4gICAgICAgICAgICBtYWtlTW9kdWxlTWFwOiBtYWtlTW9kdWxlTWFwLFxuICAgICAgICAgICAgbmV4dFRpY2s6IHJlcS5uZXh0VGljayxcbiAgICAgICAgICAgIG9uRXJyb3I6IG9uRXJyb3IsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogU2V0IGEgY29uZmlndXJhdGlvbiBmb3IgdGhlIGNvbnRleHQuXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY2ZnIGNvbmZpZyBvYmplY3QgdG8gaW50ZWdyYXRlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25maWd1cmU6IGZ1bmN0aW9uIChjZmcpIHtcbiAgICAgICAgICAgICAgICAvL01ha2Ugc3VyZSB0aGUgYmFzZVVybCBlbmRzIGluIGEgc2xhc2guXG4gICAgICAgICAgICAgICAgaWYgKGNmZy5iYXNlVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjZmcuYmFzZVVybC5jaGFyQXQoY2ZnLmJhc2VVcmwubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2ZnLmJhc2VVcmwgKz0gJy8nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9TYXZlIG9mZiB0aGUgcGF0aHMgc2luY2UgdGhleSByZXF1aXJlIHNwZWNpYWwgcHJvY2Vzc2luZyxcbiAgICAgICAgICAgICAgICAvL3RoZXkgYXJlIGFkZGl0aXZlLlxuICAgICAgICAgICAgICAgIHZhciBzaGltID0gY29uZmlnLnNoaW0sXG4gICAgICAgICAgICAgICAgICAgIG9ianMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXA6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGVhY2hQcm9wKGNmZywgZnVuY3Rpb24gKHZhbHVlLCBwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpzW3Byb3BdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbmZpZ1twcm9wXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ1twcm9wXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbWl4aW4oY29uZmlnW3Byb3BdLCB2YWx1ZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWdbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy9SZXZlcnNlIG1hcCB0aGUgYnVuZGxlc1xuICAgICAgICAgICAgICAgIGlmIChjZmcuYnVuZGxlcykge1xuICAgICAgICAgICAgICAgICAgICBlYWNoUHJvcChjZmcuYnVuZGxlcywgZnVuY3Rpb24gKHZhbHVlLCBwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlYWNoKHZhbHVlLCBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSBwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZXNNYXBbdl0gPSBwcm9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL01lcmdlIHNoaW1cbiAgICAgICAgICAgICAgICBpZiAoY2ZnLnNoaW0pIHtcbiAgICAgICAgICAgICAgICAgICAgZWFjaFByb3AoY2ZnLnNoaW0sIGZ1bmN0aW9uICh2YWx1ZSwgaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vTm9ybWFsaXplIHRoZSBzdHJ1Y3R1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBzOiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHZhbHVlLmV4cG9ydHMgfHwgdmFsdWUuaW5pdCkgJiYgIXZhbHVlLmV4cG9ydHNGbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLmV4cG9ydHNGbiA9IGNvbnRleHQubWFrZVNoaW1FeHBvcnRzKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaW1baWRdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuc2hpbSA9IHNoaW07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9BZGp1c3QgcGFja2FnZXMgaWYgbmVjZXNzYXJ5LlxuICAgICAgICAgICAgICAgIGlmIChjZmcucGFja2FnZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZWFjaChjZmcucGFja2FnZXMsIGZ1bmN0aW9uIChwa2dPYmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiwgbmFtZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcGtnT2JqID0gdHlwZW9mIHBrZ09iaiA9PT0gJ3N0cmluZycgPyB7IG5hbWU6IHBrZ09iaiB9IDogcGtnT2JqO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lID0gcGtnT2JqLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbiA9IHBrZ09iai5sb2NhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5wYXRoc1tuYW1lXSA9IHBrZ09iai5sb2NhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9TYXZlIHBvaW50ZXIgdG8gbWFpbiBtb2R1bGUgSUQgZm9yIHBrZyBuYW1lLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy9SZW1vdmUgbGVhZGluZyBkb3QgaW4gbWFpbiwgc28gbWFpbiBwYXRocyBhcmUgbm9ybWFsaXplZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYW5kIHJlbW92ZSBhbnkgdHJhaWxpbmcgLmpzLCBzaW5jZSBkaWZmZXJlbnQgcGFja2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy9lbnZzIGhhdmUgZGlmZmVyZW50IGNvbnZlbnRpb25zOiBzb21lIHVzZSBhIG1vZHVsZSBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy9zb21lIHVzZSBhIGZpbGUgbmFtZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5wa2dzW25hbWVdID0gcGtnT2JqLm5hbWUgKyAnLycgKyAocGtnT2JqLm1haW4gfHwgJ21haW4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKGN1cnJEaXJSZWdFeHAsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKGpzU3VmZml4UmVnRXhwLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vSWYgdGhlcmUgYXJlIGFueSBcIndhaXRpbmcgdG8gZXhlY3V0ZVwiIG1vZHVsZXMgaW4gdGhlIHJlZ2lzdHJ5LFxuICAgICAgICAgICAgICAgIC8vdXBkYXRlIHRoZSBtYXBzIGZvciB0aGVtLCBzaW5jZSB0aGVpciBpbmZvLCBsaWtlIFVSTHMgdG8gbG9hZCxcbiAgICAgICAgICAgICAgICAvL21heSBoYXZlIGNoYW5nZWQuXG4gICAgICAgICAgICAgICAgZWFjaFByb3AocmVnaXN0cnksIGZ1bmN0aW9uIChtb2QsIGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vSWYgbW9kdWxlIGFscmVhZHkgaGFzIGluaXQgY2FsbGVkLCBzaW5jZSBpdCBpcyB0b29cbiAgICAgICAgICAgICAgICAgICAgLy9sYXRlIHRvIG1vZGlmeSB0aGVtLCBhbmQgaWdub3JlIHVubm9ybWFsaXplZCBvbmVzXG4gICAgICAgICAgICAgICAgICAgIC8vc2luY2UgdGhleSBhcmUgdHJhbnNpZW50LlxuICAgICAgICAgICAgICAgICAgICBpZiAoIW1vZC5pbml0ZWQgJiYgIW1vZC5tYXAudW5ub3JtYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2QubWFwID0gbWFrZU1vZHVsZU1hcChpZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vSWYgYSBkZXBzIGFycmF5IG9yIGEgY29uZmlnIGNhbGxiYWNrIGlzIHNwZWNpZmllZCwgdGhlbiBjYWxsXG4gICAgICAgICAgICAgICAgLy9yZXF1aXJlIHdpdGggdGhvc2UgYXJncy4gVGhpcyBpcyB1c2VmdWwgd2hlbiByZXF1aXJlIGlzIGRlZmluZWQgYXMgYVxuICAgICAgICAgICAgICAgIC8vY29uZmlnIG9iamVjdCBiZWZvcmUgcmVxdWlyZS5qcyBpcyBsb2FkZWQuXG4gICAgICAgICAgICAgICAgaWYgKGNmZy5kZXBzIHx8IGNmZy5jYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnJlcXVpcmUoY2ZnLmRlcHMgfHwgW10sIGNmZy5jYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgbWFrZVNoaW1FeHBvcnRzOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBmbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmluaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IHZhbHVlLmluaXQuYXBwbHkoZ2xvYmFsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQgfHwgKHZhbHVlLmV4cG9ydHMgJiYgZ2V0R2xvYmFsKHZhbHVlLmV4cG9ydHMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgbWFrZVJlcXVpcmU6IGZ1bmN0aW9uIChyZWxNYXAsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGxvY2FsUmVxdWlyZShkZXBzLCBjYWxsYmFjaywgZXJyYmFjaykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQsIG1hcCwgcmVxdWlyZU1vZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5lbmFibGVCdWlsZENhbGxiYWNrICYmIGNhbGxiYWNrICYmIGlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5fX3JlcXVpcmVKc0J1aWxkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGVwcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSW52YWxpZCBjYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uRXJyb3IobWFrZUVycm9yKCdyZXF1aXJlYXJncycsICdJbnZhbGlkIHJlcXVpcmUgY2FsbCcpLCBlcnJiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiByZXF1aXJlfGV4cG9ydHN8bW9kdWxlIGFyZSByZXF1ZXN0ZWQsIGdldCB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFsdWUgZm9yIHRoZW0gZnJvbSB0aGUgc3BlY2lhbCBoYW5kbGVycy4gQ2F2ZWF0OlxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzIG9ubHkgd29ya3Mgd2hpbGUgbW9kdWxlIGlzIGJlaW5nIGRlZmluZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVsTWFwICYmIGhhc1Byb3AoaGFuZGxlcnMsIGRlcHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXJzW2RlcHNdKHJlZ2lzdHJ5W3JlbE1hcC5pZF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1N5bmNocm9ub3VzIGFjY2VzcyB0byBvbmUgbW9kdWxlLiBJZiByZXF1aXJlLmdldCBpc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9hdmFpbGFibGUgKGFzIGluIHRoZSBOb2RlIGFkYXB0ZXIpLCBwcmVmZXIgdGhhdC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXEuZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcS5nZXQoY29udGV4dCwgZGVwcywgcmVsTWFwLCBsb2NhbFJlcXVpcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL05vcm1hbGl6ZSBtb2R1bGUgbmFtZSwgaWYgaXQgY29udGFpbnMgLiBvciAuLlxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwID0gbWFrZU1vZHVsZU1hcChkZXBzLCByZWxNYXAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gbWFwLmlkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc1Byb3AoZGVmaW5lZCwgaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uRXJyb3IobWFrZUVycm9yKCdub3Rsb2FkZWQnLCAnTW9kdWxlIG5hbWUgXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1wiIGhhcyBub3QgYmVlbiBsb2FkZWQgeWV0IGZvciBjb250ZXh0OiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0TmFtZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlbE1hcCA/ICcnIDogJy4gVXNlIHJlcXVpcmUoW10pJykpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZpbmVkW2lkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vR3JhYiBkZWZpbmVzIHdhaXRpbmcgaW4gdGhlIGdsb2JhbCBxdWV1ZS5cbiAgICAgICAgICAgICAgICAgICAgaW50YWtlRGVmaW5lcygpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vTWFyayBhbGwgdGhlIGRlcGVuZGVuY2llcyBhcyBuZWVkaW5nIHRvIGJlIGxvYWRlZC5cbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1NvbWUgZGVmaW5lcyBjb3VsZCBoYXZlIGJlZW4gYWRkZWQgc2luY2UgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3JlcXVpcmUgY2FsbCwgY29sbGVjdCB0aGVtLlxuICAgICAgICAgICAgICAgICAgICAgICAgaW50YWtlRGVmaW5lcygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlTW9kID0gZ2V0TW9kdWxlKG1ha2VNb2R1bGVNYXAobnVsbCwgcmVsTWFwKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vU3RvcmUgaWYgbWFwIGNvbmZpZyBzaG91bGQgYmUgYXBwbGllZCB0byB0aGlzIHJlcXVpcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY2FsbCBmb3IgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZU1vZC5za2lwTWFwID0gb3B0aW9ucy5za2lwTWFwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlTW9kLmluaXQoZGVwcywgY2FsbGJhY2ssIGVycmJhY2ssIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tMb2FkZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsUmVxdWlyZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBtaXhpbihsb2NhbFJlcXVpcmUsIHtcbiAgICAgICAgICAgICAgICAgICAgaXNCcm93c2VyOiBpc0Jyb3dzZXIsXG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENvbnZlcnRzIGEgbW9kdWxlIG5hbWUgKyAuZXh0ZW5zaW9uIGludG8gYW4gVVJMIHBhdGguXG4gICAgICAgICAgICAgICAgICAgICAqICpSZXF1aXJlcyogdGhlIHVzZSBvZiBhIG1vZHVsZSBuYW1lLiBJdCBkb2VzIG5vdCBzdXBwb3J0IHVzaW5nXG4gICAgICAgICAgICAgICAgICAgICAqIHBsYWluIFVSTHMgbGlrZSBuYW1lVG9VcmwuXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0b1VybDogZnVuY3Rpb24gKG1vZHVsZU5hbWVQbHVzRXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbW9kdWxlTmFtZVBsdXNFeHQubGFzdEluZGV4T2YoJy4nKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50ID0gbW9kdWxlTmFtZVBsdXNFeHQuc3BsaXQoJy8nKVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1JlbGF0aXZlID0gc2VnbWVudCA9PT0gJy4nIHx8IHNlZ21lbnQgPT09ICcuLic7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vSGF2ZSBhIGZpbGUgZXh0ZW5zaW9uIGFsaWFzLCBhbmQgaXQgaXMgbm90IHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy9kb3RzIGZyb20gYSByZWxhdGl2ZSBwYXRoLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSAmJiAoIWlzUmVsYXRpdmUgfHwgaW5kZXggPiAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dCA9IG1vZHVsZU5hbWVQbHVzRXh0LnN1YnN0cmluZyhpbmRleCwgbW9kdWxlTmFtZVBsdXNFeHQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lUGx1c0V4dCA9IG1vZHVsZU5hbWVQbHVzRXh0LnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZXh0Lm5hbWVUb1VybChub3JtYWxpemUobW9kdWxlTmFtZVBsdXNFeHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxNYXAgJiYgcmVsTWFwLmlkLCB0cnVlKSwgZXh0LCAgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lZDogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFzUHJvcChkZWZpbmVkLCBtYWtlTW9kdWxlTWFwKGlkLCByZWxNYXAsIGZhbHNlLCB0cnVlKS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgc3BlY2lmaWVkOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gbWFrZU1vZHVsZU1hcChpZCwgcmVsTWFwLCBmYWxzZSwgdHJ1ZSkuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFzUHJvcChkZWZpbmVkLCBpZCkgfHwgaGFzUHJvcChyZWdpc3RyeSwgaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvL09ubHkgYWxsb3cgdW5kZWYgb24gdG9wIGxldmVsIHJlcXVpcmUgY2FsbHNcbiAgICAgICAgICAgICAgICBpZiAoIXJlbE1hcCkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFJlcXVpcmUudW5kZWYgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQmluZCBhbnkgd2FpdGluZyBkZWZpbmUoKSBjYWxscyB0byB0aGlzIGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2ZpeCBmb3IgIzQwOFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFrZUdsb2JhbFF1ZXVlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXAgPSBtYWtlTW9kdWxlTWFwKGlkLCByZWxNYXAsIHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZCA9IGdldE93bihyZWdpc3RyeSwgaWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVTY3JpcHQoaWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZGVmaW5lZFtpZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdXJsRmV0Y2hlZFttYXAudXJsXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB1bmRlZkV2ZW50c1tpZF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQ2xlYW4gcXVldWVkIGRlZmluZXMgdG9vLiBHbyBiYWNrd2FyZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaW4gYXJyYXkgc28gdGhhdCB0aGUgc3BsaWNlcyBkbyBub3RcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbWVzcyB1cCB0aGUgaXRlcmF0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgZWFjaFJldmVyc2UoZGVmUXVldWUsIGZ1bmN0aW9uKGFyZ3MsIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihhcmdzWzBdID09PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZRdWV1ZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0hvbGQgb24gdG8gbGlzdGVuZXJzIGluIGNhc2UgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9tb2R1bGUgd2lsbCBiZSBhdHRlbXB0ZWQgdG8gYmUgcmVsb2FkZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3VzaW5nIGEgZGlmZmVyZW50IGNvbmZpZy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9kLmV2ZW50cy5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmRXZlbnRzW2lkXSA9IG1vZC5ldmVudHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW5SZWdpc3RyeShpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsUmVxdWlyZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ2FsbGVkIHRvIGVuYWJsZSBhIG1vZHVsZSBpZiBpdCBpcyBzdGlsbCBpbiB0aGUgcmVnaXN0cnlcbiAgICAgICAgICAgICAqIGF3YWl0aW5nIGVuYWJsZW1lbnQuIEEgc2Vjb25kIGFyZywgcGFyZW50LCB0aGUgcGFyZW50IG1vZHVsZSxcbiAgICAgICAgICAgICAqIGlzIHBhc3NlZCBpbiBmb3IgY29udGV4dCwgd2hlbiB0aGlzIG1ldGhvZCBpcyBvdmVycmlkZGVuIGJ5XG4gICAgICAgICAgICAgKiB0aGUgb3B0aW1pemVyLiBOb3Qgc2hvd24gaGVyZSB0byBrZWVwIGNvZGUgY29tcGFjdC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZW5hYmxlOiBmdW5jdGlvbiAoZGVwTWFwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZCA9IGdldE93bihyZWdpc3RyeSwgZGVwTWFwLmlkKTtcbiAgICAgICAgICAgICAgICBpZiAobW9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldE1vZHVsZShkZXBNYXApLmVuYWJsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW50ZXJuYWwgbWV0aG9kIHVzZWQgYnkgZW52aXJvbm1lbnQgYWRhcHRlcnMgdG8gY29tcGxldGUgYSBsb2FkIGV2ZW50LlxuICAgICAgICAgICAgICogQSBsb2FkIGV2ZW50IGNvdWxkIGJlIGEgc2NyaXB0IGxvYWQgb3IganVzdCBhIGxvYWQgcGFzcyBmcm9tIGEgc3luY2hyb25vdXNcbiAgICAgICAgICAgICAqIGxvYWQgY2FsbC5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtb2R1bGVOYW1lIHRoZSBuYW1lIG9mIHRoZSBtb2R1bGUgdG8gcG90ZW50aWFsbHkgY29tcGxldGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbXBsZXRlTG9hZDogZnVuY3Rpb24gKG1vZHVsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZm91bmQsIGFyZ3MsIG1vZCxcbiAgICAgICAgICAgICAgICAgICAgc2hpbSA9IGdldE93bihjb25maWcuc2hpbSwgbW9kdWxlTmFtZSkgfHwge30sXG4gICAgICAgICAgICAgICAgICAgIHNoRXhwb3J0cyA9IHNoaW0uZXhwb3J0cztcblxuICAgICAgICAgICAgICAgIHRha2VHbG9iYWxRdWV1ZSgpO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKGRlZlF1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBhcmdzID0gZGVmUXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3NbMF0gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3NbMF0gPSBtb2R1bGVOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiBhbHJlYWR5IGZvdW5kIGFuIGFub255bW91cyBtb2R1bGUgYW5kIGJvdW5kIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RvIHRoaXMgbmFtZSwgdGhlbiB0aGlzIGlzIHNvbWUgb3RoZXIgYW5vbiBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vd2FpdGluZyBmb3IgaXRzIGNvbXBsZXRlTG9hZCB0byBmaXJlLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gbW9kdWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9Gb3VuZCBtYXRjaGluZyBkZWZpbmUgY2FsbCBmb3IgdGhpcyBzY3JpcHQhXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjYWxsR2V0TW9kdWxlKGFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vRG8gdGhpcyBhZnRlciB0aGUgY3ljbGUgb2YgY2FsbEdldE1vZHVsZSBpbiBjYXNlIHRoZSByZXN1bHRcbiAgICAgICAgICAgICAgICAvL29mIHRob3NlIGNhbGxzL2luaXQgY2FsbHMgY2hhbmdlcyB0aGUgcmVnaXN0cnkuXG4gICAgICAgICAgICAgICAgbW9kID0gZ2V0T3duKHJlZ2lzdHJ5LCBtb2R1bGVOYW1lKTtcblxuICAgICAgICAgICAgICAgIGlmICghZm91bmQgJiYgIWhhc1Byb3AoZGVmaW5lZCwgbW9kdWxlTmFtZSkgJiYgbW9kICYmICFtb2QuaW5pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maWcuZW5mb3JjZURlZmluZSAmJiAoIXNoRXhwb3J0cyB8fCAhZ2V0R2xvYmFsKHNoRXhwb3J0cykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzUGF0aEZhbGxiYWNrKG1vZHVsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25FcnJvcihtYWtlRXJyb3IoJ25vZGVmaW5lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdObyBkZWZpbmUgY2FsbCBmb3IgJyArIG1vZHVsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW21vZHVsZU5hbWVdKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL0Egc2NyaXB0IHRoYXQgZG9lcyBub3QgY2FsbCBkZWZpbmUoKSwgc28ganVzdCBzaW11bGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGUgY2FsbCBmb3IgaXQuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsR2V0TW9kdWxlKFttb2R1bGVOYW1lLCAoc2hpbS5kZXBzIHx8IFtdKSwgc2hpbS5leHBvcnRzRm5dKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNoZWNrTG9hZGVkKCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENvbnZlcnRzIGEgbW9kdWxlIG5hbWUgdG8gYSBmaWxlIHBhdGguIFN1cHBvcnRzIGNhc2VzIHdoZXJlXG4gICAgICAgICAgICAgKiBtb2R1bGVOYW1lIG1heSBhY3R1YWxseSBiZSBqdXN0IGFuIFVSTC5cbiAgICAgICAgICAgICAqIE5vdGUgdGhhdCBpdCAqKmRvZXMgbm90KiogY2FsbCBub3JtYWxpemUgb24gdGhlIG1vZHVsZU5hbWUsXG4gICAgICAgICAgICAgKiBpdCBpcyBhc3N1bWVkIHRvIGhhdmUgYWxyZWFkeSBiZWVuIG5vcm1hbGl6ZWQuIFRoaXMgaXMgYW5cbiAgICAgICAgICAgICAqIGludGVybmFsIEFQSSwgbm90IGEgcHVibGljIG9uZS4gVXNlIHRvVXJsIGZvciB0aGUgcHVibGljIEFQSS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbmFtZVRvVXJsOiBmdW5jdGlvbiAobW9kdWxlTmFtZSwgZXh0LCBza2lwRXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhdGhzLCBzeW1zLCBpLCBwYXJlbnRNb2R1bGUsIHVybCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50UGF0aCwgYnVuZGxlSWQsXG4gICAgICAgICAgICAgICAgICAgIHBrZ01haW4gPSBnZXRPd24oY29uZmlnLnBrZ3MsIG1vZHVsZU5hbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBrZ01haW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlTmFtZSA9IHBrZ01haW47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnVuZGxlSWQgPSBnZXRPd24oYnVuZGxlc01hcCwgbW9kdWxlTmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYnVuZGxlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQubmFtZVRvVXJsKGJ1bmRsZUlkLCBleHQsIHNraXBFeHQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vSWYgYSBjb2xvbiBpcyBpbiB0aGUgVVJMLCBpdCBpbmRpY2F0ZXMgYSBwcm90b2NvbCBpcyB1c2VkIGFuZCBpdCBpcyBqdXN0XG4gICAgICAgICAgICAgICAgLy9hbiBVUkwgdG8gYSBmaWxlLCBvciBpZiBpdCBzdGFydHMgd2l0aCBhIHNsYXNoLCBjb250YWlucyBhIHF1ZXJ5IGFyZyAoaS5lLiA/KVxuICAgICAgICAgICAgICAgIC8vb3IgZW5kcyB3aXRoIC5qcywgdGhlbiBhc3N1bWUgdGhlIHVzZXIgbWVhbnQgdG8gdXNlIGFuIHVybCBhbmQgbm90IGEgbW9kdWxlIGlkLlxuICAgICAgICAgICAgICAgIC8vVGhlIHNsYXNoIGlzIGltcG9ydGFudCBmb3IgcHJvdG9jb2wtbGVzcyBVUkxzIGFzIHdlbGwgYXMgZnVsbCBwYXRocy5cbiAgICAgICAgICAgICAgICBpZiAocmVxLmpzRXh0UmVnRXhwLnRlc3QobW9kdWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9KdXN0IGEgcGxhaW4gcGF0aCwgbm90IG1vZHVsZSBuYW1lIGxvb2t1cCwgc28ganVzdCByZXR1cm4gaXQuXG4gICAgICAgICAgICAgICAgICAgIC8vQWRkIGV4dGVuc2lvbiBpZiBpdCBpcyBpbmNsdWRlZC4gVGhpcyBpcyBhIGJpdCB3b25reSwgb25seSBub24tLmpzIHRoaW5ncyBwYXNzXG4gICAgICAgICAgICAgICAgICAgIC8vYW4gZXh0ZW5zaW9uLCB0aGlzIG1ldGhvZCBwcm9iYWJseSBuZWVkcyB0byBiZSByZXdvcmtlZC5cbiAgICAgICAgICAgICAgICAgICAgdXJsID0gbW9kdWxlTmFtZSArIChleHQgfHwgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vQSBtb2R1bGUgdGhhdCBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgdG8gYSBwYXRoLlxuICAgICAgICAgICAgICAgICAgICBwYXRocyA9IGNvbmZpZy5wYXRocztcblxuICAgICAgICAgICAgICAgICAgICBzeW1zID0gbW9kdWxlTmFtZS5zcGxpdCgnLycpO1xuICAgICAgICAgICAgICAgICAgICAvL0ZvciBlYWNoIG1vZHVsZSBuYW1lIHNlZ21lbnQsIHNlZSBpZiB0aGVyZSBpcyBhIHBhdGhcbiAgICAgICAgICAgICAgICAgICAgLy9yZWdpc3RlcmVkIGZvciBpdC4gU3RhcnQgd2l0aCBtb3N0IHNwZWNpZmljIG5hbWVcbiAgICAgICAgICAgICAgICAgICAgLy9hbmQgd29yayB1cCBmcm9tIGl0LlxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSBzeW1zLmxlbmd0aDsgaSA+IDA7IGkgLT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50TW9kdWxlID0gc3ltcy5zbGljZSgwLCBpKS5qb2luKCcvJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFBhdGggPSBnZXRPd24ocGF0aHMsIHBhcmVudE1vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50UGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgYW4gYXJyYXksIGl0IG1lYW5zIHRoZXJlIGFyZSBhIGZldyBjaG9pY2VzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ2hvb3NlIHRoZSBvbmUgdGhhdCBpcyBkZXNpcmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXkocGFyZW50UGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50UGF0aCA9IHBhcmVudFBhdGhbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN5bXMuc3BsaWNlKDAsIGksIHBhcmVudFBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9Kb2luIHRoZSBwYXRoIHBhcnRzIHRvZ2V0aGVyLCB0aGVuIGZpZ3VyZSBvdXQgaWYgYmFzZVVybCBpcyBuZWVkZWQuXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IHN5bXMuam9pbignLycpO1xuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gKGV4dCB8fCAoL15kYXRhXFw6fFxcPy8udGVzdCh1cmwpIHx8IHNraXBFeHQgPyAnJyA6ICcuanMnKSk7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9ICh1cmwuY2hhckF0KDApID09PSAnLycgfHwgdXJsLm1hdGNoKC9eW1xcd1xcK1xcLlxcLV0rOi8pID8gJycgOiBjb25maWcuYmFzZVVybCkgKyB1cmw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy51cmxBcmdzID8gdXJsICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy51cmxBcmdzKSA6IHVybDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vRGVsZWdhdGVzIHRvIHJlcS5sb2FkLiBCcm9rZW4gb3V0IGFzIGEgc2VwYXJhdGUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAgIC8vYWxsb3cgb3ZlcnJpZGluZyBpbiB0aGUgb3B0aW1pemVyLlxuICAgICAgICAgICAgbG9hZDogZnVuY3Rpb24gKGlkLCB1cmwpIHtcbiAgICAgICAgICAgICAgICByZXEubG9hZChjb250ZXh0LCBpZCwgdXJsKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRXhlY3V0ZXMgYSBtb2R1bGUgY2FsbGJhY2sgZnVuY3Rpb24uIEJyb2tlbiBvdXQgYXMgYSBzZXBhcmF0ZSBmdW5jdGlvblxuICAgICAgICAgICAgICogc29sZWx5IHRvIGFsbG93IHRoZSBidWlsZCBzeXN0ZW0gdG8gc2VxdWVuY2UgdGhlIGZpbGVzIGluIHRoZSBidWlsdFxuICAgICAgICAgICAgICogbGF5ZXIgaW4gdGhlIHJpZ2h0IHNlcXVlbmNlLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGV4ZWNDYjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBhcmdzLCBleHBvcnRzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KGV4cG9ydHMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBjYWxsYmFjayBmb3Igc2NyaXB0IGxvYWRzLCB1c2VkIHRvIGNoZWNrIHN0YXR1cyBvZiBsb2FkaW5nLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2dCB0aGUgZXZlbnQgZnJvbSB0aGUgYnJvd3NlciBmb3IgdGhlIHNjcmlwdFxuICAgICAgICAgICAgICogdGhhdCB3YXMgbG9hZGVkLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvblNjcmlwdExvYWQ6IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAvL1VzaW5nIGN1cnJlbnRUYXJnZXQgaW5zdGVhZCBvZiB0YXJnZXQgZm9yIEZpcmVmb3ggMi4wJ3Mgc2FrZS4gTm90XG4gICAgICAgICAgICAgICAgLy9hbGwgb2xkIGJyb3dzZXJzIHdpbGwgYmUgc3VwcG9ydGVkLCBidXQgdGhpcyBvbmUgd2FzIGVhc3kgZW5vdWdoXG4gICAgICAgICAgICAgICAgLy90byBzdXBwb3J0IGFuZCBzdGlsbCBtYWtlcyBzZW5zZS5cbiAgICAgICAgICAgICAgICBpZiAoZXZ0LnR5cGUgPT09ICdsb2FkJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlYWR5UmVnRXhwLnRlc3QoKGV2dC5jdXJyZW50VGFyZ2V0IHx8IGV2dC5zcmNFbGVtZW50KS5yZWFkeVN0YXRlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9SZXNldCBpbnRlcmFjdGl2ZSBzY3JpcHQgc28gYSBzY3JpcHQgbm9kZSBpcyBub3QgaGVsZCBvbnRvIGZvclxuICAgICAgICAgICAgICAgICAgICAvL3RvIGxvbmcuXG4gICAgICAgICAgICAgICAgICAgIGludGVyYWN0aXZlU2NyaXB0ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAvL1B1bGwgb3V0IHRoZSBuYW1lIG9mIHRoZSBtb2R1bGUgYW5kIHRoZSBjb250ZXh0LlxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGdldFNjcmlwdERhdGEoZXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5jb21wbGV0ZUxvYWQoZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDYWxsYmFjayBmb3Igc2NyaXB0IGVycm9ycy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb25TY3JpcHRFcnJvcjogZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZ2V0U2NyaXB0RGF0YShldnQpO1xuICAgICAgICAgICAgICAgIGlmICghaGFzUGF0aEZhbGxiYWNrKGRhdGEuaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvbkVycm9yKG1ha2VFcnJvcignc2NyaXB0ZXJyb3InLCAnU2NyaXB0IGVycm9yIGZvcjogJyArIGRhdGEuaWQsIGV2dCwgW2RhdGEuaWRdKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnRleHQucmVxdWlyZSA9IGNvbnRleHQubWFrZVJlcXVpcmUoKTtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFpbiBlbnRyeSBwb2ludC5cbiAgICAgKlxuICAgICAqIElmIHRoZSBvbmx5IGFyZ3VtZW50IHRvIHJlcXVpcmUgaXMgYSBzdHJpbmcsIHRoZW4gdGhlIG1vZHVsZSB0aGF0XG4gICAgICogaXMgcmVwcmVzZW50ZWQgYnkgdGhhdCBzdHJpbmcgaXMgZmV0Y2hlZCBmb3IgdGhlIGFwcHJvcHJpYXRlIGNvbnRleHQuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgZmlyc3QgYXJndW1lbnQgaXMgYW4gYXJyYXksIHRoZW4gaXQgd2lsbCBiZSB0cmVhdGVkIGFzIGFuIGFycmF5XG4gICAgICogb2YgZGVwZW5kZW5jeSBzdHJpbmcgbmFtZXMgdG8gZmV0Y2guIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIGNhbGxiYWNrIGNhblxuICAgICAqIGJlIHNwZWNpZmllZCB0byBleGVjdXRlIHdoZW4gYWxsIG9mIHRob3NlIGRlcGVuZGVuY2llcyBhcmUgYXZhaWxhYmxlLlxuICAgICAqXG4gICAgICogTWFrZSBhIGxvY2FsIHJlcSB2YXJpYWJsZSB0byBoZWxwIENhamEgY29tcGxpYW5jZSAoaXQgYXNzdW1lcyB0aGluZ3NcbiAgICAgKiBvbiBhIHJlcXVpcmUgdGhhdCBhcmUgbm90IHN0YW5kYXJkaXplZCksIGFuZCB0byBnaXZlIGEgc2hvcnRcbiAgICAgKiBuYW1lIGZvciBtaW5pZmljYXRpb24vbG9jYWwgc2NvcGUgdXNlLlxuICAgICAqL1xuICAgIHJlcSA9IHJlcXVpcmVqcyA9IGZ1bmN0aW9uIChkZXBzLCBjYWxsYmFjaywgZXJyYmFjaywgb3B0aW9uYWwpIHtcblxuICAgICAgICAvL0ZpbmQgdGhlIHJpZ2h0IGNvbnRleHQsIHVzZSBkZWZhdWx0XG4gICAgICAgIHZhciBjb250ZXh0LCBjb25maWcsXG4gICAgICAgICAgICBjb250ZXh0TmFtZSA9IGRlZkNvbnRleHROYW1lO1xuXG4gICAgICAgIC8vIERldGVybWluZSBpZiBoYXZlIGNvbmZpZyBvYmplY3QgaW4gdGhlIGNhbGwuXG4gICAgICAgIGlmICghaXNBcnJheShkZXBzKSAmJiB0eXBlb2YgZGVwcyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIC8vIGRlcHMgaXMgYSBjb25maWcgb2JqZWN0XG4gICAgICAgICAgICBjb25maWcgPSBkZXBzO1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgLy8gQWRqdXN0IGFyZ3MgaWYgdGhlcmUgYXJlIGRlcGVuZGVuY2llc1xuICAgICAgICAgICAgICAgIGRlcHMgPSBjYWxsYmFjaztcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGVycmJhY2s7XG4gICAgICAgICAgICAgICAgZXJyYmFjayA9IG9wdGlvbmFsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZXBzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnICYmIGNvbmZpZy5jb250ZXh0KSB7XG4gICAgICAgICAgICBjb250ZXh0TmFtZSA9IGNvbmZpZy5jb250ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dCA9IGdldE93bihjb250ZXh0cywgY29udGV4dE5hbWUpO1xuICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnRleHQgPSBjb250ZXh0c1tjb250ZXh0TmFtZV0gPSByZXEucy5uZXdDb250ZXh0KGNvbnRleHROYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgICAgIGNvbnRleHQuY29uZmlndXJlKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29udGV4dC5yZXF1aXJlKGRlcHMsIGNhbGxiYWNrLCBlcnJiYWNrKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3VwcG9ydCByZXF1aXJlLmNvbmZpZygpIHRvIG1ha2UgaXQgZWFzaWVyIHRvIGNvb3BlcmF0ZSB3aXRoIG90aGVyXG4gICAgICogQU1EIGxvYWRlcnMgb24gZ2xvYmFsbHkgYWdyZWVkIG5hbWVzLlxuICAgICAqL1xuICAgIHJlcS5jb25maWcgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHJldHVybiByZXEoY29uZmlnKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBzb21ldGhpbmcgYWZ0ZXIgdGhlIGN1cnJlbnQgdGlja1xuICAgICAqIG9mIHRoZSBldmVudCBsb29wLiBPdmVycmlkZSBmb3Igb3RoZXIgZW52c1xuICAgICAqIHRoYXQgaGF2ZSBhIGJldHRlciBzb2x1dGlvbiB0aGFuIHNldFRpbWVvdXQuXG4gICAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgbGF0ZXIuXG4gICAgICovXG4gICAgcmVxLm5leHRUaWNrID0gdHlwZW9mIHNldFRpbWVvdXQgIT09ICd1bmRlZmluZWQnID8gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDQpO1xuICAgIH0gOiBmdW5jdGlvbiAoZm4pIHsgZm4oKTsgfTtcblxuICAgIC8qKlxuICAgICAqIEV4cG9ydCByZXF1aXJlIGFzIGEgZ2xvYmFsLCBidXQgb25seSBpZiBpdCBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0LlxuICAgICAqL1xuICAgIGlmICghcmVxdWlyZSkge1xuICAgICAgICByZXF1aXJlID0gcmVxO1xuICAgIH1cblxuICAgIHJlcS52ZXJzaW9uID0gdmVyc2lvbjtcblxuICAgIC8vVXNlZCB0byBmaWx0ZXIgb3V0IGRlcGVuZGVuY2llcyB0aGF0IGFyZSBhbHJlYWR5IHBhdGhzLlxuICAgIHJlcS5qc0V4dFJlZ0V4cCA9IC9eXFwvfDp8XFw/fFxcLmpzJC87XG4gICAgcmVxLmlzQnJvd3NlciA9IGlzQnJvd3NlcjtcbiAgICBzID0gcmVxLnMgPSB7XG4gICAgICAgIGNvbnRleHRzOiBjb250ZXh0cyxcbiAgICAgICAgbmV3Q29udGV4dDogbmV3Q29udGV4dFxuICAgIH07XG5cbiAgICAvL0NyZWF0ZSBkZWZhdWx0IGNvbnRleHQuXG4gICAgcmVxKHt9KTtcblxuICAgIC8vRXhwb3J0cyBzb21lIGNvbnRleHQtc2Vuc2l0aXZlIG1ldGhvZHMgb24gZ2xvYmFsIHJlcXVpcmUuXG4gICAgZWFjaChbXG4gICAgICAgICd0b1VybCcsXG4gICAgICAgICd1bmRlZicsXG4gICAgICAgICdkZWZpbmVkJyxcbiAgICAgICAgJ3NwZWNpZmllZCdcbiAgICBdLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICAvL1JlZmVyZW5jZSBmcm9tIGNvbnRleHRzIGluc3RlYWQgb2YgZWFybHkgYmluZGluZyB0byBkZWZhdWx0IGNvbnRleHQsXG4gICAgICAgIC8vc28gdGhhdCBkdXJpbmcgYnVpbGRzLCB0aGUgbGF0ZXN0IGluc3RhbmNlIG9mIHRoZSBkZWZhdWx0IGNvbnRleHRcbiAgICAgICAgLy93aXRoIGl0cyBjb25maWcgZ2V0cyB1c2VkLlxuICAgICAgICByZXFbcHJvcF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY3R4ID0gY29udGV4dHNbZGVmQ29udGV4dE5hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5yZXF1aXJlW3Byb3BdLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGlmIChpc0Jyb3dzZXIpIHtcbiAgICAgICAgaGVhZCA9IHMuaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgIC8vSWYgQkFTRSB0YWcgaXMgaW4gcGxheSwgdXNpbmcgYXBwZW5kQ2hpbGQgaXMgYSBwcm9ibGVtIGZvciBJRTYuXG4gICAgICAgIC8vV2hlbiB0aGF0IGJyb3dzZXIgZGllcywgdGhpcyBjYW4gYmUgcmVtb3ZlZC4gRGV0YWlscyBpbiB0aGlzIGpRdWVyeSBidWc6XG4gICAgICAgIC8vaHR0cDovL2Rldi5qcXVlcnkuY29tL3RpY2tldC8yNzA5XG4gICAgICAgIGJhc2VFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jhc2UnKVswXTtcbiAgICAgICAgaWYgKGJhc2VFbGVtZW50KSB7XG4gICAgICAgICAgICBoZWFkID0gcy5oZWFkID0gYmFzZUVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFueSBlcnJvcnMgdGhhdCByZXF1aXJlIGV4cGxpY2l0bHkgZ2VuZXJhdGVzIHdpbGwgYmUgcGFzc2VkIHRvIHRoaXNcbiAgICAgKiBmdW5jdGlvbi4gSW50ZXJjZXB0L292ZXJyaWRlIGl0IGlmIHlvdSB3YW50IGN1c3RvbSBlcnJvciBoYW5kbGluZy5cbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnIgdGhlIGVycm9yIG9iamVjdC5cbiAgICAgKi9cbiAgICByZXEub25FcnJvciA9IGRlZmF1bHRPbkVycm9yO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyB0aGUgbm9kZSBmb3IgdGhlIGxvYWQgY29tbWFuZC4gT25seSB1c2VkIGluIGJyb3dzZXIgZW52cy5cbiAgICAgKi9cbiAgICByZXEuY3JlYXRlTm9kZSA9IGZ1bmN0aW9uIChjb25maWcsIG1vZHVsZU5hbWUsIHVybCkge1xuICAgICAgICB2YXIgbm9kZSA9IGNvbmZpZy54aHRtbCA/XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ2h0bWw6c2NyaXB0JykgOlxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICBub2RlLnR5cGUgPSBjb25maWcuc2NyaXB0VHlwZSB8fCAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgbm9kZS5jaGFyc2V0ID0gJ3V0Zi04JztcbiAgICAgICAgbm9kZS5hc3luYyA9IHRydWU7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEb2VzIHRoZSByZXF1ZXN0IHRvIGxvYWQgYSBtb2R1bGUgZm9yIHRoZSBicm93c2VyIGNhc2UuXG4gICAgICogTWFrZSB0aGlzIGEgc2VwYXJhdGUgZnVuY3Rpb24gdG8gYWxsb3cgb3RoZXIgZW52aXJvbm1lbnRzXG4gICAgICogdG8gb3ZlcnJpZGUgaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCB0aGUgcmVxdWlyZSBjb250ZXh0IHRvIGZpbmQgc3RhdGUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1vZHVsZU5hbWUgdGhlIG5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdXJsIHRoZSBVUkwgdG8gdGhlIG1vZHVsZS5cbiAgICAgKi9cbiAgICByZXEubG9hZCA9IGZ1bmN0aW9uIChjb250ZXh0LCBtb2R1bGVOYW1lLCB1cmwpIHtcbiAgICAgICAgdmFyIGNvbmZpZyA9IChjb250ZXh0ICYmIGNvbnRleHQuY29uZmlnKSB8fCB7fSxcbiAgICAgICAgICAgIG5vZGU7XG4gICAgICAgIGlmIChpc0Jyb3dzZXIpIHtcbiAgICAgICAgICAgIC8vSW4gdGhlIGJyb3dzZXIgc28gdXNlIGEgc2NyaXB0IHRhZ1xuICAgICAgICAgICAgbm9kZSA9IHJlcS5jcmVhdGVOb2RlKGNvbmZpZywgbW9kdWxlTmFtZSwgdXJsKTtcblxuICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcmVxdWlyZWNvbnRleHQnLCBjb250ZXh0LmNvbnRleHROYW1lKTtcbiAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLXJlcXVpcmVtb2R1bGUnLCBtb2R1bGVOYW1lKTtcblxuICAgICAgICAgICAgLy9TZXQgdXAgbG9hZCBsaXN0ZW5lci4gVGVzdCBhdHRhY2hFdmVudCBmaXJzdCBiZWNhdXNlIElFOSBoYXNcbiAgICAgICAgICAgIC8vYSBzdWJ0bGUgaXNzdWUgaW4gaXRzIGFkZEV2ZW50TGlzdGVuZXIgYW5kIHNjcmlwdCBvbmxvYWQgZmlyaW5nc1xuICAgICAgICAgICAgLy90aGF0IGRvIG5vdCBtYXRjaCB0aGUgYmVoYXZpb3Igb2YgYWxsIG90aGVyIGJyb3dzZXJzIHdpdGhcbiAgICAgICAgICAgIC8vYWRkRXZlbnRMaXN0ZW5lciBzdXBwb3J0LCB3aGljaCBmaXJlIHRoZSBvbmxvYWQgZXZlbnQgZm9yIGFcbiAgICAgICAgICAgIC8vc2NyaXB0IHJpZ2h0IGFmdGVyIHRoZSBzY3JpcHQgZXhlY3V0aW9uLiBTZWU6XG4gICAgICAgICAgICAvL2h0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvNjQ4MDU3L3NjcmlwdC1vbmxvYWQtZXZlbnQtaXMtbm90LWZpcmVkLWltbWVkaWF0ZWx5LWFmdGVyLXNjcmlwdC1leGVjdXRpb25cbiAgICAgICAgICAgIC8vVU5GT1JUVU5BVEVMWSBPcGVyYSBpbXBsZW1lbnRzIGF0dGFjaEV2ZW50IGJ1dCBkb2VzIG5vdCBmb2xsb3cgdGhlIHNjcmlwdFxuICAgICAgICAgICAgLy9zY3JpcHQgZXhlY3V0aW9uIG1vZGUuXG4gICAgICAgICAgICBpZiAobm9kZS5hdHRhY2hFdmVudCAmJlxuICAgICAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIG5vZGUuYXR0YWNoRXZlbnQgaXMgYXJ0aWZpY2lhbGx5IGFkZGVkIGJ5IGN1c3RvbSBzY3JpcHQgb3JcbiAgICAgICAgICAgICAgICAgICAgLy9uYXRpdmVseSBzdXBwb3J0ZWQgYnkgYnJvd3NlclxuICAgICAgICAgICAgICAgICAgICAvL3JlYWQgaHR0cHM6Ly9naXRodWIuY29tL2pyYnVya2UvcmVxdWlyZWpzL2lzc3Vlcy8xODdcbiAgICAgICAgICAgICAgICAgICAgLy9pZiB3ZSBjYW4gTk9UIGZpbmQgW25hdGl2ZSBjb2RlXSB0aGVuIGl0IG11c3QgTk9UIG5hdGl2ZWx5IHN1cHBvcnRlZC5cbiAgICAgICAgICAgICAgICAgICAgLy9pbiBJRTgsIG5vZGUuYXR0YWNoRXZlbnQgZG9lcyBub3QgaGF2ZSB0b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgIC8vTm90ZSB0aGUgdGVzdCBmb3IgXCJbbmF0aXZlIGNvZGVcIiB3aXRoIG5vIGNsb3NpbmcgYnJhY2UsIHNlZTpcbiAgICAgICAgICAgICAgICAgICAgLy9odHRwczovL2dpdGh1Yi5jb20vanJidXJrZS9yZXF1aXJlanMvaXNzdWVzLzI3M1xuICAgICAgICAgICAgICAgICAgICAhKG5vZGUuYXR0YWNoRXZlbnQudG9TdHJpbmcgJiYgbm9kZS5hdHRhY2hFdmVudC50b1N0cmluZygpLmluZGV4T2YoJ1tuYXRpdmUgY29kZScpIDwgMCkgJiZcbiAgICAgICAgICAgICAgICAgICAgIWlzT3BlcmEpIHtcbiAgICAgICAgICAgICAgICAvL1Byb2JhYmx5IElFLiBJRSAoYXQgbGVhc3QgNi04KSBkbyBub3QgZmlyZVxuICAgICAgICAgICAgICAgIC8vc2NyaXB0IG9ubG9hZCByaWdodCBhZnRlciBleGVjdXRpbmcgdGhlIHNjcmlwdCwgc29cbiAgICAgICAgICAgICAgICAvL3dlIGNhbm5vdCB0aWUgdGhlIGFub255bW91cyBkZWZpbmUgY2FsbCB0byBhIG5hbWUuXG4gICAgICAgICAgICAgICAgLy9Ib3dldmVyLCBJRSByZXBvcnRzIHRoZSBzY3JpcHQgYXMgYmVpbmcgaW4gJ2ludGVyYWN0aXZlJ1xuICAgICAgICAgICAgICAgIC8vcmVhZHlTdGF0ZSBhdCB0aGUgdGltZSBvZiB0aGUgZGVmaW5lIGNhbGwuXG4gICAgICAgICAgICAgICAgdXNlSW50ZXJhY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgbm9kZS5hdHRhY2hFdmVudCgnb25yZWFkeXN0YXRlY2hhbmdlJywgY29udGV4dC5vblNjcmlwdExvYWQpO1xuICAgICAgICAgICAgICAgIC8vSXQgd291bGQgYmUgZ3JlYXQgdG8gYWRkIGFuIGVycm9yIGhhbmRsZXIgaGVyZSB0byBjYXRjaFxuICAgICAgICAgICAgICAgIC8vNDA0cyBpbiBJRTkrLiBIb3dldmVyLCBvbnJlYWR5c3RhdGVjaGFuZ2Ugd2lsbCBmaXJlIGJlZm9yZVxuICAgICAgICAgICAgICAgIC8vdGhlIGVycm9yIGhhbmRsZXIsIHNvIHRoYXQgZG9lcyBub3QgaGVscC4gSWYgYWRkRXZlbnRMaXN0ZW5lclxuICAgICAgICAgICAgICAgIC8vaXMgdXNlZCwgdGhlbiBJRSB3aWxsIGZpcmUgZXJyb3IgYmVmb3JlIGxvYWQsIGJ1dCB3ZSBjYW5ub3RcbiAgICAgICAgICAgICAgICAvL3VzZSB0aGF0IHBhdGh3YXkgZ2l2ZW4gdGhlIGNvbm5lY3QubWljcm9zb2Z0LmNvbSBpc3N1ZVxuICAgICAgICAgICAgICAgIC8vbWVudGlvbmVkIGFib3ZlIGFib3V0IG5vdCBkb2luZyB0aGUgJ3NjcmlwdCBleGVjdXRlLFxuICAgICAgICAgICAgICAgIC8vdGhlbiBmaXJlIHRoZSBzY3JpcHQgbG9hZCBldmVudCBsaXN0ZW5lciBiZWZvcmUgZXhlY3V0ZVxuICAgICAgICAgICAgICAgIC8vbmV4dCBzY3JpcHQnIHRoYXQgb3RoZXIgYnJvd3NlcnMgZG8uXG4gICAgICAgICAgICAgICAgLy9CZXN0IGhvcGU6IElFMTAgZml4ZXMgdGhlIGlzc3VlcyxcbiAgICAgICAgICAgICAgICAvL2FuZCB0aGVuIGRlc3Ryb3lzIGFsbCBpbnN0YWxscyBvZiBJRSA2LTkuXG4gICAgICAgICAgICAgICAgLy9ub2RlLmF0dGFjaEV2ZW50KCdvbmVycm9yJywgY29udGV4dC5vblNjcmlwdEVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgY29udGV4dC5vblNjcmlwdExvYWQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgY29udGV4dC5vblNjcmlwdEVycm9yLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlLnNyYyA9IHVybDtcblxuICAgICAgICAgICAgLy9Gb3Igc29tZSBjYWNoZSBjYXNlcyBpbiBJRSA2LTgsIHRoZSBzY3JpcHQgZXhlY3V0ZXMgYmVmb3JlIHRoZSBlbmRcbiAgICAgICAgICAgIC8vb2YgdGhlIGFwcGVuZENoaWxkIGV4ZWN1dGlvbiwgc28gdG8gdGllIGFuIGFub255bW91cyBkZWZpbmVcbiAgICAgICAgICAgIC8vY2FsbCB0byB0aGUgbW9kdWxlIG5hbWUgKHdoaWNoIGlzIHN0b3JlZCBvbiB0aGUgbm9kZSksIGhvbGQgb25cbiAgICAgICAgICAgIC8vdG8gYSByZWZlcmVuY2UgdG8gdGhpcyBub2RlLCBidXQgY2xlYXIgYWZ0ZXIgdGhlIERPTSBpbnNlcnRpb24uXG4gICAgICAgICAgICBjdXJyZW50bHlBZGRpbmdTY3JpcHQgPSBub2RlO1xuICAgICAgICAgICAgaWYgKGJhc2VFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgaGVhZC5pbnNlcnRCZWZvcmUobm9kZSwgYmFzZUVsZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudGx5QWRkaW5nU2NyaXB0ID0gbnVsbDtcblxuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNXZWJXb3JrZXIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy9JbiBhIHdlYiB3b3JrZXIsIHVzZSBpbXBvcnRTY3JpcHRzLiBUaGlzIGlzIG5vdCBhIHZlcnlcbiAgICAgICAgICAgICAgICAvL2VmZmljaWVudCB1c2Ugb2YgaW1wb3J0U2NyaXB0cywgaW1wb3J0U2NyaXB0cyB3aWxsIGJsb2NrIHVudGlsXG4gICAgICAgICAgICAgICAgLy9pdHMgc2NyaXB0IGlzIGRvd25sb2FkZWQgYW5kIGV2YWx1YXRlZC4gSG93ZXZlciwgaWYgd2ViIHdvcmtlcnNcbiAgICAgICAgICAgICAgICAvL2FyZSBpbiBwbGF5LCB0aGUgZXhwZWN0YXRpb24gdGhhdCBhIGJ1aWxkIGhhcyBiZWVuIGRvbmUgc28gdGhhdFxuICAgICAgICAgICAgICAgIC8vb25seSBvbmUgc2NyaXB0IG5lZWRzIHRvIGJlIGxvYWRlZCBhbnl3YXkuIFRoaXMgbWF5IG5lZWQgdG8gYmVcbiAgICAgICAgICAgICAgICAvL3JlZXZhbHVhdGVkIGlmIG90aGVyIHVzZSBjYXNlcyBiZWNvbWUgY29tbW9uLlxuICAgICAgICAgICAgICAgIGltcG9ydFNjcmlwdHModXJsKTtcblxuICAgICAgICAgICAgICAgIC8vQWNjb3VudCBmb3IgYW5vbnltb3VzIG1vZHVsZXNcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNvbXBsZXRlTG9hZChtb2R1bGVOYW1lKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm9uRXJyb3IobWFrZUVycm9yKCdpbXBvcnRzY3JpcHRzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2ltcG9ydFNjcmlwdHMgZmFpbGVkIGZvciAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgKyAnIGF0ICcgKyB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttb2R1bGVOYW1lXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldEludGVyYWN0aXZlU2NyaXB0KCkge1xuICAgICAgICBpZiAoaW50ZXJhY3RpdmVTY3JpcHQgJiYgaW50ZXJhY3RpdmVTY3JpcHQucmVhZHlTdGF0ZSA9PT0gJ2ludGVyYWN0aXZlJykge1xuICAgICAgICAgICAgcmV0dXJuIGludGVyYWN0aXZlU2NyaXB0O1xuICAgICAgICB9XG5cbiAgICAgICAgZWFjaFJldmVyc2Uoc2NyaXB0cygpLCBmdW5jdGlvbiAoc2NyaXB0KSB7XG4gICAgICAgICAgICBpZiAoc2NyaXB0LnJlYWR5U3RhdGUgPT09ICdpbnRlcmFjdGl2ZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGludGVyYWN0aXZlU2NyaXB0ID0gc2NyaXB0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpbnRlcmFjdGl2ZVNjcmlwdDtcbiAgICB9XG5cbiAgICAvL0xvb2sgZm9yIGEgZGF0YS1tYWluIHNjcmlwdCBhdHRyaWJ1dGUsIHdoaWNoIGNvdWxkIGFsc28gYWRqdXN0IHRoZSBiYXNlVXJsLlxuICAgIGlmIChpc0Jyb3dzZXIgJiYgIWNmZy5za2lwRGF0YU1haW4pIHtcbiAgICAgICAgLy9GaWd1cmUgb3V0IGJhc2VVcmwuIEdldCBpdCBmcm9tIHRoZSBzY3JpcHQgdGFnIHdpdGggcmVxdWlyZS5qcyBpbiBpdC5cbiAgICAgICAgZWFjaFJldmVyc2Uoc2NyaXB0cygpLCBmdW5jdGlvbiAoc2NyaXB0KSB7XG4gICAgICAgICAgICAvL1NldCB0aGUgJ2hlYWQnIHdoZXJlIHdlIGNhbiBhcHBlbmQgY2hpbGRyZW4gYnlcbiAgICAgICAgICAgIC8vdXNpbmcgdGhlIHNjcmlwdCdzIHBhcmVudC5cbiAgICAgICAgICAgIGlmICghaGVhZCkge1xuICAgICAgICAgICAgICAgIGhlYWQgPSBzY3JpcHQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Mb29rIGZvciBhIGRhdGEtbWFpbiBhdHRyaWJ1dGUgdG8gc2V0IG1haW4gc2NyaXB0IGZvciB0aGUgcGFnZVxuICAgICAgICAgICAgLy90byBsb2FkLiBJZiBpdCBpcyB0aGVyZSwgdGhlIHBhdGggdG8gZGF0YSBtYWluIGJlY29tZXMgdGhlXG4gICAgICAgICAgICAvL2Jhc2VVcmwsIGlmIGl0IGlzIG5vdCBhbHJlYWR5IHNldC5cbiAgICAgICAgICAgIGRhdGFNYWluID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnZGF0YS1tYWluJyk7XG4gICAgICAgICAgICBpZiAoZGF0YU1haW4pIHtcbiAgICAgICAgICAgICAgICAvL1ByZXNlcnZlIGRhdGFNYWluIGluIGNhc2UgaXQgaXMgYSBwYXRoIChpLmUuIGNvbnRhaW5zICc/JylcbiAgICAgICAgICAgICAgICBtYWluU2NyaXB0ID0gZGF0YU1haW47XG5cbiAgICAgICAgICAgICAgICAvL1NldCBmaW5hbCBiYXNlVXJsIGlmIHRoZXJlIGlzIG5vdCBhbHJlYWR5IGFuIGV4cGxpY2l0IG9uZS5cbiAgICAgICAgICAgICAgICBpZiAoIWNmZy5iYXNlVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vUHVsbCBvZmYgdGhlIGRpcmVjdG9yeSBvZiBkYXRhLW1haW4gZm9yIHVzZSBhcyB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy9iYXNlVXJsLlxuICAgICAgICAgICAgICAgICAgICBzcmMgPSBtYWluU2NyaXB0LnNwbGl0KCcvJyk7XG4gICAgICAgICAgICAgICAgICAgIG1haW5TY3JpcHQgPSBzcmMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHN1YlBhdGggPSBzcmMubGVuZ3RoID8gc3JjLmpvaW4oJy8nKSAgKyAnLycgOiAnLi8nO1xuXG4gICAgICAgICAgICAgICAgICAgIGNmZy5iYXNlVXJsID0gc3ViUGF0aDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL1N0cmlwIG9mZiBhbnkgdHJhaWxpbmcgLmpzIHNpbmNlIG1haW5TY3JpcHQgaXMgbm93XG4gICAgICAgICAgICAgICAgLy9saWtlIGEgbW9kdWxlIG5hbWUuXG4gICAgICAgICAgICAgICAgbWFpblNjcmlwdCA9IG1haW5TY3JpcHQucmVwbGFjZShqc1N1ZmZpeFJlZ0V4cCwgJycpO1xuXG4gICAgICAgICAgICAgICAgIC8vSWYgbWFpblNjcmlwdCBpcyBzdGlsbCBhIHBhdGgsIGZhbGwgYmFjayB0byBkYXRhTWFpblxuICAgICAgICAgICAgICAgIGlmIChyZXEuanNFeHRSZWdFeHAudGVzdChtYWluU2NyaXB0KSkge1xuICAgICAgICAgICAgICAgICAgICBtYWluU2NyaXB0ID0gZGF0YU1haW47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9QdXQgdGhlIGRhdGEtbWFpbiBzY3JpcHQgaW4gdGhlIGZpbGVzIHRvIGxvYWQuXG4gICAgICAgICAgICAgICAgY2ZnLmRlcHMgPSBjZmcuZGVwcyA/IGNmZy5kZXBzLmNvbmNhdChtYWluU2NyaXB0KSA6IFttYWluU2NyaXB0XTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZnVuY3Rpb24gdGhhdCBoYW5kbGVzIGRlZmluaXRpb25zIG9mIG1vZHVsZXMuIERpZmZlcnMgZnJvbVxuICAgICAqIHJlcXVpcmUoKSBpbiB0aGF0IGEgc3RyaW5nIGZvciB0aGUgbW9kdWxlIHNob3VsZCBiZSB0aGUgZmlyc3QgYXJndW1lbnQsXG4gICAgICogYW5kIHRoZSBmdW5jdGlvbiB0byBleGVjdXRlIGFmdGVyIGRlcGVuZGVuY2llcyBhcmUgbG9hZGVkIHNob3VsZFxuICAgICAqIHJldHVybiBhIHZhbHVlIHRvIGRlZmluZSB0aGUgbW9kdWxlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGZpcnN0IGFyZ3VtZW50J3NcbiAgICAgKiBuYW1lLlxuICAgICAqL1xuICAgIGRlZmluZSA9IGZ1bmN0aW9uIChuYW1lLCBkZXBzLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgbm9kZSwgY29udGV4dDtcblxuICAgICAgICAvL0FsbG93IGZvciBhbm9ueW1vdXMgbW9kdWxlc1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvL0FkanVzdCBhcmdzIGFwcHJvcHJpYXRlbHlcbiAgICAgICAgICAgIGNhbGxiYWNrID0gZGVwcztcbiAgICAgICAgICAgIGRlcHMgPSBuYW1lO1xuICAgICAgICAgICAgbmFtZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvL1RoaXMgbW9kdWxlIG1heSBub3QgaGF2ZSBkZXBlbmRlbmNpZXNcbiAgICAgICAgaWYgKCFpc0FycmF5KGRlcHMpKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IGRlcHM7XG4gICAgICAgICAgICBkZXBzID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vSWYgbm8gbmFtZSwgYW5kIGNhbGxiYWNrIGlzIGEgZnVuY3Rpb24sIHRoZW4gZmlndXJlIG91dCBpZiBpdCBhXG4gICAgICAgIC8vQ29tbW9uSlMgdGhpbmcgd2l0aCBkZXBlbmRlbmNpZXMuXG4gICAgICAgIGlmICghZGVwcyAmJiBpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgZGVwcyA9IFtdO1xuICAgICAgICAgICAgLy9SZW1vdmUgY29tbWVudHMgZnJvbSB0aGUgY2FsbGJhY2sgc3RyaW5nLFxuICAgICAgICAgICAgLy9sb29rIGZvciByZXF1aXJlIGNhbGxzLCBhbmQgcHVsbCB0aGVtIGludG8gdGhlIGRlcGVuZGVuY2llcyxcbiAgICAgICAgICAgIC8vYnV0IG9ubHkgaWYgdGhlcmUgYXJlIGZ1bmN0aW9uIGFyZ3MuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2subGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoY29tbWVudFJlZ0V4cCwgJycpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKGNqc1JlcXVpcmVSZWdFeHAsIGZ1bmN0aW9uIChtYXRjaCwgZGVwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBzLnB1c2goZGVwKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvL01heSBiZSBhIENvbW1vbkpTIHRoaW5nIGV2ZW4gd2l0aG91dCByZXF1aXJlIGNhbGxzLCBidXQgc3RpbGxcbiAgICAgICAgICAgICAgICAvL2NvdWxkIHVzZSBleHBvcnRzLCBhbmQgbW9kdWxlLiBBdm9pZCBkb2luZyBleHBvcnRzIGFuZCBtb2R1bGVcbiAgICAgICAgICAgICAgICAvL3dvcmsgdGhvdWdoIGlmIGl0IGp1c3QgbmVlZHMgcmVxdWlyZS5cbiAgICAgICAgICAgICAgICAvL1JFUVVJUkVTIHRoZSBmdW5jdGlvbiB0byBleHBlY3QgdGhlIENvbW1vbkpTIHZhcmlhYmxlcyBpbiB0aGVcbiAgICAgICAgICAgICAgICAvL29yZGVyIGxpc3RlZCBiZWxvdy5cbiAgICAgICAgICAgICAgICBkZXBzID0gKGNhbGxiYWNrLmxlbmd0aCA9PT0gMSA/IFsncmVxdWlyZSddIDogWydyZXF1aXJlJywgJ2V4cG9ydHMnLCAnbW9kdWxlJ10pLmNvbmNhdChkZXBzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vSWYgaW4gSUUgNi04IGFuZCBoaXQgYW4gYW5vbnltb3VzIGRlZmluZSgpIGNhbGwsIGRvIHRoZSBpbnRlcmFjdGl2ZVxuICAgICAgICAvL3dvcmsuXG4gICAgICAgIGlmICh1c2VJbnRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgbm9kZSA9IGN1cnJlbnRseUFkZGluZ1NjcmlwdCB8fCBnZXRJbnRlcmFjdGl2ZVNjcmlwdCgpO1xuICAgICAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXJlcXVpcmVtb2R1bGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGNvbnRleHRzW25vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXJlcXVpcmVjb250ZXh0JyldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9BbHdheXMgc2F2ZSBvZmYgZXZhbHVhdGluZyB0aGUgZGVmIGNhbGwgdW50aWwgdGhlIHNjcmlwdCBvbmxvYWQgaGFuZGxlci5cbiAgICAgICAgLy9UaGlzIGFsbG93cyBtdWx0aXBsZSBtb2R1bGVzIHRvIGJlIGluIGEgZmlsZSB3aXRob3V0IHByZW1hdHVyZWx5XG4gICAgICAgIC8vdHJhY2luZyBkZXBlbmRlbmNpZXMsIGFuZCBhbGxvd3MgZm9yIGFub255bW91cyBtb2R1bGUgc3VwcG9ydCxcbiAgICAgICAgLy93aGVyZSB0aGUgbW9kdWxlIG5hbWUgaXMgbm90IGtub3duIHVudGlsIHRoZSBzY3JpcHQgb25sb2FkIGV2ZW50XG4gICAgICAgIC8vb2NjdXJzLiBJZiBubyBjb250ZXh0LCB1c2UgdGhlIGdsb2JhbCBxdWV1ZSwgYW5kIGdldCBpdCBwcm9jZXNzZWRcbiAgICAgICAgLy9pbiB0aGUgb25zY3JpcHQgbG9hZCBjYWxsYmFjay5cbiAgICAgICAgKGNvbnRleHQgPyBjb250ZXh0LmRlZlF1ZXVlIDogZ2xvYmFsRGVmUXVldWUpLnB1c2goW25hbWUsIGRlcHMsIGNhbGxiYWNrXSk7XG4gICAgfTtcblxuICAgIGRlZmluZS5hbWQgPSB7XG4gICAgICAgIGpRdWVyeTogdHJ1ZVxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIHRoZSB0ZXh0LiBOb3JtYWxseSBqdXN0IHVzZXMgZXZhbCwgYnV0IGNhbiBiZSBtb2RpZmllZFxuICAgICAqIHRvIHVzZSBhIGJldHRlciwgZW52aXJvbm1lbnQtc3BlY2lmaWMgY2FsbC4gT25seSB1c2VkIGZvciB0cmFuc3BpbGluZ1xuICAgICAqIGxvYWRlciBwbHVnaW5zLCBub3QgZm9yIHBsYWluIEpTIG1vZHVsZXMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRleHQgdGhlIHRleHQgdG8gZXhlY3V0ZS9ldmFsdWF0ZS5cbiAgICAgKi9cbiAgICByZXEuZXhlYyA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICAgIC8qanNsaW50IGV2aWw6IHRydWUgKi9cbiAgICAgICAgcmV0dXJuIGV2YWwodGV4dCk7XG4gICAgfTtcblxuICAgIC8vU2V0IHVwIHdpdGggY29uZmlnIGluZm8uXG4gICAgcmVxKGNmZyk7XG59KHRoaXMpKTtcbiJdLCJmaWxlIjoidGhpcmRwYXJ0eS92ZW5kb3IvcmVxdWlyZS5qcyJ9


}
/*
     FILE ARCHIVED ON 01:38:22 Sep 02, 2017 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:24:26 Oct 28, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  RedisCDXSource: 50.934
  exclusion.robots.policy: 0.349
  load_resource: 32.704
  exclusion.robots: 0.362
  CDXLines.iter: 26.358 (3)
  captures_list: 377.897
  esindex: 0.011
  LoadShardBlock: 296.42 (3)
  PetaboxLoader3.datanode: 261.096 (4)
*/