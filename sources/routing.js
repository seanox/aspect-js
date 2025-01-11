/**
 * LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 * im Folgenden Seanox Software Solutions oder kurz Seanox genannt.
 * Diese Software unterliegt der Version 2 der Apache License.
 *
 * Seanox aspect-js, fullstack for single page applications
 * Copyright (C) 2023 Seanox Software Solutions
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 * 
 * 
 *     DESCRIPTION
 *     ----
 * TODO
 */
(() => {

    // TODO:
    let _routing_active = undefined;

    // Map with all supported interceptors
    const _interceptors = new Array();

    // Array with the path history (optimized)
    const _history = new Array();

    const Browser = {

        /**
         * Returns the current working path. This assumes that the URL contains
         * at least one hash, otherwise the method returns null.
         * @returns {string|null} the current path, otherwise null
         */
        get location() {
            if (window.location.hash !== "")
                return window.location.hash;
            return _locate(window.location.href);
        }
    }

    const _locate = (location) => {
        const match = location.match(/#.*$/);
        return match ? match[0] : null;
    }

    compliant("Routing");
    compliant(null, window.Routing = {

        /**
         * Returns the current working path normalized. This assumes that the
         * URL contains at least one hash, otherwise the method returns null.
         * @returns {string|null} the current path, otherwise null
         */
        get location() {
            let location = Browser.location;
            if (location != null
                    && (/^(#{2,}|[^#])/).test(location)) {
                let parent = "#";
                if (_history.length > 0)
                    parent = _history[_history.length -1];
                return Path.normalize(parent, location);
            }
            return Path.normalize(location);
        },

        // TODO:
        get history() {
            return _history;
        },

        // TODO: method to get path + parameters (+ URL decoding of the parameters)

        /**
         * Routes to the given path. TODO:
         *
         * In difference to the forward method, route is not executed directly,
         * instead the change is triggered asynchronous by the location hash.
         * 
         * @param {string} path TODO
         */    
        route(path) {
            if (path === undefined
                    || (typeof path !== "string"
                            && path !== null))
                throw new TypeError("Invalid data type");
            path = Path.normalize(path);
            if (path === null
                    || path === Browser.location)
                return;
            Composite.asynchron((path) => {
                window.location.href = path;
            }, path);
        },
        
        /**
         * Forwards to the given path. TODO:
         *
         * In difference to the route method, the forwarding is executed
         * directly, instead the navigate method triggers asynchronous
         * forwarding by changing the location hash.
         * 
         * @param {string} path TODO
         */  
        forward(path) {
            if (path === undefined
                    || (typeof path !== "string"
                            && path !== null))
                throw new TypeError("Invalid data type");
            path = Path.normalize(path);
            if (path === null
                    || path === Browser.location)
                return;
            const event = new Event("hashchange",{bubbles:false, cancelable:true});
            event.oldURL = Browser.location;
            event.newURL = path;
            window.dispatchEvent(event);
        },
           
        /**
         * Checks the approval to keep or remove the composite through the
         * routing in the DOM. For approval, the model corresponding to a
         * composite can implement the approve method, which can use different
         * return values.
         *
         * TODO: true
         * TODO: false
         * TODO: string
         * TODO: void/undefined
         *
         * Without a custom approve method, the default is applied and checked,
         * whether the current working path covers the path from the composite.
         * Covered means that the specified path must be contained from the root
         * of the current working path.
         *
         * This method assumes that the URL contains at least one hash,
         * otherwise the method returns false.
         *
         * @param {string} path TODO
         * @returns {boolean} if the composite is approved, true or false
         */
        approve(path) {

            if (path === undefined
                    || (typeof path !== "string"
                            && path !== null))
                throw new TypeError("Invalid data type");

            // Only valid paths of composites can be approved.
            path = Path.normalize(path);
            if (path === null
                    || path === "#")
                return false;

            const selector = "#" + path.split("#").pop();
            const object = Composite.lookup(selector);
            if (!(typeof object?.permit === "function"))
                return Path.covers(path);
            const approval = object.permit();
            if (approval === undefined)
                return Path.covers(path);
            if (typeof approval === "string"
                    && Path.PATTERN_PATH.test(approval)) {
                Composite.asynchron((path) => {
                    window.location.href = path;
                }, path);
                return false;
            }
            return approval === true;
        },

        customize(path, actor) {
            if (typeof path !== "string"
                    && !(path instanceof RegExp))
                throw new TypeError("Invalid data type");
            if (actor == null
                    || typeof actor !== "object"
                    || !(actor instanceof RegExp))
                throw new TypeError("Invalid object type");
            _interceptors.push({path:path, actor:actor});
        }
    });

    /**
     * Registration of the attribute static for hardening. The attribute is
     * therefore more difficult to manipulate in markup.
     */
    Composite.customize("@ATTRIBUTES-STATICS", "static");

    const _lookup = (path) => {
        path = path.split(/(?=#)/);
        do {
            let selector = `${path.join(" ")}[${Composite.ATTRIBUTE_COMPOSITE}]`;
            selector = document.querySelector(selector);
            if (selector instanceof Element)
                return selector;
            path.pop();
        } while (path.length > 0);
        return document.body;
    };

    const _render = (element, focus = false) => {
        Composite.render(element);
        if (focus) {
            Composite.asynchron((element) => {
                if (typeof element.focus === "function")
                    element.focus();
            }, element);
        }
    };

    /**
     * Establishes a listener that detects changes to the URL hash. The method
     * corrects invalid and unauthorized paths by forwarding them to next valid
     * path and organizes partial rendering.
     */
    window.addEventListener("hashchange", (event) => {

        if (!_routing_active)
            return;

        const location = Routing.location || "#";
        if (location !== Browser.location) {
            window.location.replace(location);
            return;
        }

        // Interceptors
        // - order of execution corresponds to the order of registration
        // - all interceptors are always checked and executed if they match
        // - no entry in history
        // - can change the new hash/path, but please use replace
        // - following interceptors use the possibly changed hash/path
        // - on the first explicit false, terminates the logic in hashchange
        for (const interceptor in _interceptors) {
            if (typeof interceptor.path === "string") {
                if (!Path.covers(interceptor.path))
                    continue;
            } else if (interceptor.path instanceof RegExp) {
                if (!interceptor.path.test(Routing.location))
                    continue;
            } else continue;
            if (typeof interceptor.actor === "function"
                    && interceptor.actor(_locate(event.oldURL), Browser.location) === false)
                return;
        }

        // Maintaining the history.
        // For recursions, the history is discarded after the first occurrence.
        const index = _history.indexOf(location);
        if (index >= 0)
            _history.length = index;
        _history.push(location);

        // Decision matrix
        // - invalid path(s) / undefined, then do nothing
        // - no path match / null, then render body and focus
        // - Composite old and new are the same, then render and focus new
        // - Composite old and new are not equal and one is body, then render
        //   body and focus new
        // - Composite old includes new, then render old and focus new
        // - Composite new includes old, then render new and focus new
        // - Composite old and new unequal, then render old, then render new and
        //   focus new

        const locationOld = Path.normalize(_locate(event.oldURL));
        const locationNew = Path.normalize(_locate(event.newURL));
        const locationMatch = Path.matches(locationOld, locationNew);
        if (locationMatch === undefined)
            return;
        if (locationMatch === null) {
            _render(document.body, true);
            return;
        }
        const locationOldElement = _lookup(locationOld);
        const locationNewElement = _lookup(locationNew);
        if (locationOldElement === locationNewElement) {
            _render(locationNewElement, true);
            return;
        }
        if (locationOldElement === document.body
                || locationNewElement === document.body) {
            _render(document.body);
            Composite.asynchron((element) => {
                if (typeof element.focus === "function")
                    element.focus();
            }, locationNewElement);
            return;
        }
        if (locationOldElement.contains(locationNewElement)) {
            _render(locationOldElement);
            Composite.asynchron((element) => {
                if (typeof element.focus === "function")
                    element.focus();
            }, locationNewElement);
            return;
        }
        if (locationNewElement.contains(locationOldElement)) {
            _render(locationNewElement, true);
            return;
        }
        _render(locationOldElement);
        _render(locationnewElement, true);
    });

    /**
     * TODO:
     * Rendering filter for all composite elements. The filter causes that for
     * each composite element determined by the renderer, an additional
     * condition is added to the Routing. This condition is used to show or hide
     * the composite elements in the DOM to the corresponding paths. The
     * elements are identified by the serial.
     */
    Composite.customize((element) => {

        if (_routing_active === undefined) {
            // Activates routing during the initial rendering via the boolean
            // attribute route. It must not have a value, otherwise it is
            // ignored and routing is not activated. The decision was
            // deliberate, so that interpretations such as route=“off” do not
            // cause false expectations and misunderstandings.
            _routing_active = document.body.hasAttribute("route");
            if (document.body.hasAttribute("route")
                    && document.body.getAttribute("route") !== "")
                console.warn("Ignore value for attribute route");

            // Without path, is forwarded to the root. The fact that the
            // interface can be called without a path if it wants to use the
            // routing must be taken into account in the declaration of the
            // markup and in the implementation. This logic is not included
            // here!
            if (!Browser.location)
                Routing.route("#");
        }

        if (!_routing_active)
            return;
        if (!(element instanceof Element)
                || !element.hasAttribute(Composite.ATTRIBUTE_COMPOSITE))
            return;
        if (element.hasAttribute("static")) {
            if (element.getAttribute("static") !== "")
                console.warn("Ignore value for attribute static");
            return;
        }

        let path = "";
        for (let scope = element; scope; scope = scope.parentNode) {
            if (!(scope instanceof Element)
                    || !scope.hasAttribute(Composite.ATTRIBUTE_COMPOSITE))
                continue;
            const serial = (scope.getAttribute(Composite.ATTRIBUTE_ID) || "").trim();
            if (!serial.match(Composite.PATTERN_COMPOSITE_ID))
                throw new Error(`Invalid composite id${serial ? ": " + serial : ""}`);
            path = "#" + serial + path;
        }

        let script = null;
        if (element.hasAttribute(Composite.ATTRIBUTE_CONDITION)) {
            script = element.getAttribute(Composite.ATTRIBUTE_CONDITION).trim();
            if (script.match(Composite.PATTERN_EXPRESSION_CONTAINS))
                script = script.replace(Composite.PATTERN_EXPRESSION_CONTAINS, (match) => {
                    match = match.substring(2, match.length -2).trim();
                    return `{{Routing.approve("${path}") and (${match})}}`;
                });
        }
        if (!script)
            script = `{{Routing.approve("${path}")}}`;
        element.setAttribute(Composite.ATTRIBUTE_CONDITION, script);
    });

    /**
     * Static component for the use of paths (routes). Paths are used for
     * navigation, routing and controlling the view flow. The target can be a
     * view or a function if using interceptors.
     */
    compliant("Path");
    compliant(null, window.Path = {

        // Pattern for a valid path in the 7-bit ASCII range
        get PATTERN_PATH() {return /^#[\x21-\x7E]*$/},

        // Pattern for a string in the 7-bit ASCII range
        get PATTERN_ASCII() {return /^[\x21-\x7E]*$/},

        /**
         * TODO:
         * @param {string} path
         * @param {string} compare
         * @returns {undefined|null|string}
         */
        matches(path, compare) {

            if (path === undefined
                    || (typeof path !== "string"
                            && path !== null)
                    || compare === undefined
                    || (typeof compare !== "string")
                            && compare !== null)
                throw new TypeError("Invalid data type");

            if (path == null
                    || path.length <= 0
                    || compare == null
                    || compare.length <= 0)
                return;
            path = path.split(/(?=#)/);
            compare = compare.split(/(?=#)/);
            const length = Math.min(path.length, compare.length);
            for (let index = 0; index < length; index++) {
                if (path[index] !== compare[index]) {
                    path.length = index;
                    break;
                }
            }
            return path.join("") || null;
        },

        /**
         * Checks whether the specified path is covered by the current working
         * path. Covered means that the specified path must be contained from
         * the root of the current working path. This assumes that the URL
         * contains at least one hash, otherwise the method returns false.
         * @param {string} path to be checked
         * @returns {boolean} true if the path is covered by the current path
         */
        covers(path) {

            if (path === undefined
                    || (typeof path !== "string")
                            && path !== null)
                throw new TypeError("Invalid data type");

            path = Path.normalize(path);
            if (!Routing.location
                    || path == null
                    || path.trim() === "")
                return false;
            if (path === "#")
                return true;
            return (Routing.location + "#").startsWith(path + "#");
        },

        /**
         * Normalizes a path. Paths consist of words that only use 7-bit ASCII
         * characters above the space character. The words are separated by the
         * hash character (#). There are absolute and relative paths:
         *
         * - Absolute Paths start with the root, represented by a leading
         *   hash sign (#).
         *
         * - Relative Paths are based on the current path and begin with either
         *   a word or a return. Return jumps also use the hash sign, whereby
         *   the number of repetitions indicates the number of return jumps. If
         *   the URL does not contain at least one hash and therefore has no
         *   working path, the root path is used as the working path.
         *
         * The return value is always a balanced canonical path, starting with
         * the root.
         *
         * Examples (root #x#y#z):
         *
         *    #a#b#c#d#e##f   #a#b#c#d#f
         *    #a#b#c#d#e###f  #a#b#c#f
         *    ###f            #x#f
         *    ####f           #f
         *    empty           #x#y#z
         *    #               #x#y#z
         *    a#b#c           #x#y#z#a#b#c
         *
         * Invalid roots and paths cause an error.
         * The method has the following various signatures:
         *     function(root, path)
         *     function(root, path, ...)
         *     function(path)
         *
         * @param {string} [root] optional, otherwise current location is used
         * @param {string} path to normalize
         * @returns {string} the normalize path
         * @throws {Error} An error occurs in the following cases:
         *     - Invalid root and/or path
         */
        normalize(...variants) {

            if (variants == null
                    || variants.length <= 0)
                return null;

            if (variants.length === 1
                    && variants[0] == null)
                return null;

            variants.every(item => {
                if (item == null
                        || typeof item === "string")
                    return true;
                throw new TypeError("Invalid data type");
            });

            variants = variants.filter((item, index) =>
                item != null
                    && item.trim() !== ""
                    && !(index > 0 && item === "#"));

            variants.forEach(item => {
                if (!Path.PATTERN_ASCII.test(item))
                    throw new Error(`Invalid path element: ${item}`)});

            variants = ((paths) =>
                paths.map((item, index) => {
                    item = item == null ? "" : item.trim()
                    item = item.replace(/([^#])#$/, '$1');
                    if (index > 0 && item.startsWith('#'))
                        return item.substring(1);
                    return item;
                })
            )(variants);

            let location = Browser.location;
            if (location == null
                    || location.trim() === "")
                location = "#";
            if (variants.length > 0
                    && variants[0] == null)
                variants[0] = location;
            if (variants.length > 0
                    && !variants[0].startsWith('#'))
                variants.unshift(location);
            if (variants.length <= 0)
                variants.unshift(location);

            let path = variants.join("#");
            if (path.startsWith("##"))
                path = location + path;

            if (!path.match(Path.PATTERN_PATH))
                throw new Error(`Invalid path${String(path).trim() ? ": " + path : ""}`);

            const pattern = /#[^#]+#{2}/;
            while (path.match(pattern))
                path = path.replace(pattern, "#");
            path = "#" + path.replace(/(^#+)|(#+)$/g, "");

            return path;
        }
    });
})();