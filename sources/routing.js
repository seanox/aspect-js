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
 * Static component for the use of a SiteMap for virtual paths. SiteMap is a
 * directory consisting of faces and facets that are addressed by paths.
 * 
 *     +-----------------------------------------------+
 *     |  Page                                         |
 *     |  +-----------------------------------------+  |
 *     |  |  Face A / Partial Face A                |  |
 *     |  |  +-------------+       +-------------+  |  |
 *     |  |  |  Facet A1   |  ...  |  Facet An   |  |  |
 *     |  |  +-------------+       +-------------+  |  |
 *     |  |                                         |  |
 *     |  |  +-----------------------------------+  |  |
 *     |  |  |  Face AA                          |  |  |
 *     |  |  |  +-----------+     +-----------+  |  |  |
 *     |  |  |  | Facet AA1 | ... | Facet AAn |  |  |  |
 *     |  |  |  +-----------+     +-----------+  |  |  |
 *     |  |  +-----------------------------------+  |  |
 *     |  |  ...                                    |  |
 *     |  +-----------------------------------------+  |
 *     |  ...                                          |
 *     |  +-----------------------------------------+  |
 *     |  |  Face n                                 |  |
 *     |  |  ...                                    |  |
 *     |  +-----------------------------------------+  |
 *     +-----------------------------------------------+
 *     
 * A face is the primary projection of the content. This projection may contain
 * additional sub-components, in form of facets and sub-faces.
 * 
 * Facets are parts of a face (projection) and are not normally a standalone
 * component. For example, the input mask and result table of a search can be
 * separate facets of a face, as can articles or sections of a face. Both face
 * and facet can be accessed via virtual paths. The path to a facet has the
 * effect that the face is displayed with any other faces. The facet is no
 * longer automatically focused, because the own implementation is very simple
 * and much flexible.
 *  
 *     window.addEventListener("hashchange", (event) => {
 *         var path = Path.normalize(event.newURL || "#");
 *         var target = SiteMap.lookup(path);
 *         if (target) {
 *             target = target.facet || target.face;
 *             if (target) {
 *                 target = target.replace(/(?!=#)#/, " #");
 *                 target = document.querySelector(target);
 *                 if (target) {
 *                     target.scrollIntoView(true);
 *                     target.focus();
 *                 }
 *             }
 *         }
 *     });
 * 
 * Faces are also components that can be nested. Thus, parent faces become
 * partial faces when the path refers to a sub-face. A sub-face is presented
 * with all its parent partial faces. If the parent faces contain additional
 * facets, these facets are not displayed. The parent faces are therefore only
 * partially presented.
 *
 * With the SiteMap the structure of faces, facets and the corresponding paths
 * are described. The SiteMap controls the face flow and the presentation of
 * the components corresponding to a path. This means that you don't have to
 * take care of showing and hiding components yourself.
 * 
 * The show and hide is hard realized in the DOM. This means that if a component
 * is hidden, it is physically removed from the DOM and only added again when it
 * is displayed.
 * 
 * When it comes to controlling face flow, the SiteMap provides hooks for
 * permission concepts and acceptors. With both things the face flow can be
 * controlled and influenced. This way, the access to paths can be stopped
 * and/or redirected/forwarded with own logic. 
 * 
 * The view model binding part also belongs to the Model View Controller and is
 * taken over by the Composite API in this implementation. SiteMap is an
 * extension and is based on the Composite API.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 20230328
 */
(() => {

    /**
     * Pattern for a valid face path:
     * - Paths and path segments must always begin with a word character
     * - Allowed are the word characters a-z _ 0-9 and additionally -
     * - Character - always embedded between the characters: a-z _ 0-9, it
     *   can not be used at the beginning and end
     * - Character # is used to separate the path segments
     * - After the separator # at least a word character is expected
     * - Only # as root path is also allowed
     */
    const PATTERN_PATH_FACE = /(^((#\w[\-\w]+\w)|(#\w+))+$)|(^#$)/;

    /**
     * Pattern for a valid facet path:
     * - Paths and path segments must always begin with a word character
     * - Allowed are the word characters a-z _ 0-9 and additionally -
     * - Character - always embedded between the characters: a-z _ 0-9, it
     *   can not be used at the beginning and end
     * - Character # is used to separate the path segments
     * - After the separator # at least a word character is expected
     */
    const PATTERN_PATH_FACET = /^((\w[\-\w]+\w)|(\w+))(#((\w[\-\w]+\w)|(\w+)))*$/;

    /**
     * Pattern for a valid variable facet path:
     * - Same conditions as for the pattern for a valid facet path
     * - Every path must end with ...
     * - Only ... as facet path is also allowed
     */
    const PATTERN_PATH_FACET_VARIABLE = /(^((\w[\-\w]+\w)|(\w+))(#((\w[\-\w]+\w)|(\w+)))*(\.){3}$)|(^\.{3}$)/;

    let _sitemap_active = false;

    compliant("SiteMap");
    compliant(null, window.SiteMap = {

        /**
         * Primarily, the root is always used when loading the page, since the
         * renderer is executed before the MVC. Therefore, the renderer may not
         * yet know all the paths and authorizations. After the renderer, the
         * MVC is loaded and triggers the renderer again if the path requested
         * with the URL differs.
         */        
        get location() {
            if (_history.size <= 0)
                return window.location.hash || "#";
            const history = Array.from(_history);
            return history[history.length -1];
        },
                
        set location(path) {
            if (_history.has(path)) {
                const values = Array.from(_history.values());
                while (_history.has(path)
                        && values.includes(path)) {
                    const entry = values.pop();
                    if (entry === path)
                        return;
                    _history.delete(entry);
                }
            } else _history.add(path);
        },
        
        /**
         * Checks a path against existing/registered permission methods. A path
         * is allowed only if all permission methods return true.
         * @param  path to check (URL is also supported, only the hash is used
         *     here and the URL itself is ignored)
         * @return true if the path has been confirmed as permitted 
         */
        permit(path) {
            for (let acceptor of _acceptors) {
                if (acceptor.pattern
                        && !acceptor.pattern.test(path))
                    continue; 
                acceptor = acceptor.action.call(null, path);
                if (acceptor !== true) {
                    if (typeof acceptor === "string")
                        acceptor = Path.normalize(acceptor);
                    return acceptor; 
                }
            }
            return true;
        },

        /**
         * Determines the real existing path according to the SiteMap. The
         * methods distinguish between absolute, relative and functional paths.
         * The functionalities remain unchanged. Absolute and relative paths are
         * balanced. Relative paths are balanced on the basis of the current
         * location. All paths are checked against the SiteMap. Invalid paths
         * are searched for a valid partial path. To do this, the path is
         * shortened piece by piece. If no valid partial path can be found, the
         * root is returned. Without passing a path, the current location is
         * returned.
         * @param  path to check - optional (URL is also supported, only the
         *     hash is used here and the URL itself is ignored)
         * @return the real path determined in the SiteMap, or the unchanged
         *     function path.
         */  
        locate(path) {
            
            path = path || "";
            
            // The path is normalized.
            // Invalid paths are shortened when searching for a valid partial
            // path. Theoretically, the shortening must end automatically with
            // the root or the current path.

            const locate = (path) => {
                const variants = [SiteMap.location, path];
                if (path.match(/(^#[^#].*$)|(^#$)/))
                    variants.shift();
                return variants;
            };
            
            try {path = Path.normalize(...locate(path));
            } catch (error) {
                while (true) {
                    path = path.replace(/(^[^#]+$)|(#[^#]*$)/, "");
                    try {path = Path.normalize(...locate(path));
                    } catch (error) {
                        continue;
                    }
                    break;
                }
            }
            
            if (path.match(PATTERN_PATH_FUNCTIONAL))
                return path;

            let paths = Array.from(_paths.keys());
            paths = paths.concat(Array.from(_facets.keys()));
            while (paths && path.length > 1) {
                for (const variable of _variables)
                    if ((path + "#").startsWith(variable + "#"))
                        return path;
                if (paths.includes(path))
                    return path;
                path = Path.normalize(path + "##");
            }
            
            return "#";
        },
        
        /**
         * Navigates to the given path, if it exists in the SiteMap. All paths
         * are checked against the SiteMap. Invalid paths are searched for a
         * valid partial path. To do this, the path is shortened piece by piece.
         * If no valid partial path can be found, the root is the target.
         * 
         * In difference to the forward method, navigate is not executed
         * directly, instead the change is triggered asynchronous by the
         * location hash.
         * 
         * @param path (URL is also supported, only the hash is used here and
         *     the URL itself is ignored)
         */    
        navigate(path) {
            Composite.asynchron((path) => {
                window.location.hash = path;
            }, SiteMap.locate(path));
            SiteMap.locate(path)
        },
        
        /**
         * Returns the meta data for a path.
         * The meta data is an object with the following structure:
         *
         *     {path:..., face:..., facet:...}
         *     
         * If variable paths are used, an additional data field is available. It
         * contains the additional data passed with the path, comparable to 
         * PATH_INFO in CGI.
         *
         *     {path:..., face:..., facet:..., data:...}
         *     
         * If no meta data can be determined because the path is invalid or not
         * declared in the SiteMap, null is returned.
         * @param  path optional, without SiteMap.location is used
         * @return meta data object, otherwise null
         */
        lookup(path) {
            
            if (arguments.length <= 0)
                path = SiteMap.location;

            const canonical = (meta) => {
                if (!meta.facet)
                    return meta.path;
                if (meta.path.endsWith("#"))
                    return meta.path + meta.facet;
                return meta.path + "#" + meta.facet;
            };

            for (const variable of _variables) {
                if (!(path + "#").startsWith(variable + "#"))
                    continue;
                if (_paths.has(variable)) {
                    return {path, face:variable, facet:null, get data() {
                        return path.substring(variable.length) || null;
                    }};
                } else if (_facets.has(variable)) {
                    const facet = _facets.get(variable);
                    return {path, face:facet.path, facet:facet.facet, get data() {
                        return path.substring(facet.path.length +facet.facet.length) || null;
                    }};
                }
                break;
            }
            
            if (_paths.has(path)) {
                return {path, face:path, facet:null};
            } else if (_facets.has(path)) {
                const facet = _facets.get(path);
                return {path:canonical(facet), face:facet.path, facet:facet.facet};
            }
            return null;
        },
        
        /**
         * Forwards to the given path, if it exists in the SiteMap. All paths
         * are checked against the SiteMap. Invalid paths are searched for a
         * valid partial path. To do this, the path is shortened piece by piece.
         * If no valid partial path can be found, the root is the target.
         * 
         * In difference to the navigate method, the forwarding is executed
         * directly, instead the navigate method triggers asynchronous
         * forwarding by changing the location hash.
         * 
         * @param path (URL is also supported, only the hash is used here and
         *     the URL itself is ignored)
         */  
        forward(path) {
            const event = new Event("hashchange",{bubbles:false, cancelable:true})
            event.newURL = path;
            window.dispatchEvent(event);
        },
           
        /**
         * Checks whether a path or sub-path is currently being used. This is
         * used to show/hide composites depending on the current location.
         * @param  path
         * @return true if the (sub)path is currently used, otherwise false
         */
        accept(path) {
            
            // Only valid paths can be confirmed.
            path = (path || "").trim().toLowerCase();
            if (!path.match(/^#.*$/))
                return false;
            path = path.replace(/(#.*?)#*$/, "$1");

            // The current path is determined and it is determined whether it is
            // a face or a facet. In both cases, a meta-object is created:
            //     {path:#path, facet:...}
            const location = SiteMap.lookup(Path.normalize(SiteMap.location));
            if (!location)
                return false;
            
            // Determines whether the passed path is a face, partial face or
            // facet. (Partial)faces always have the higher priority for facets.
            // If nothing can be determined, there cannot be a valid path.
            const lookup = SiteMap.lookup(path);
            if (!lookup)
                return false;

            let partial = lookup.path;
            if (!partial.endsWith("#"))
                partial += "#";
            
            // Facets are only displayed if the paths match and the path does
            // not refer to a partial face.
            if (lookup.facet
                    && location.face !== lookup.face
                    && !location.path.startsWith(partial))
                return false;

            // Faces and partial faces are only displayed if the paths match or
            // the path starts with the passed path as a partial path.
            if (!location.path.startsWith(partial)
                    && location.face !== lookup.face)
                return false;

            // Invalid paths and facets are excluded at this place, because they
            // already cause a false termination of this method (return false)
            // and do not have to be checked here anymore.

            return true;
        },
        
        /**
         * Configures the SiteMap individually. The configuration is passed as a
         * meta-object. The keys (string) correspond to the paths, the values
         * are arrays with the valid facets for a path.
         * 
         *     sitemap = {
         *         "#": ["news", "products", "about", "contact", "legal"],
         *         "#products#papers": ["paperA4", "paperA5", "paperA6"],
         *         "#products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
         *         "#products#pens": ["pencil", "ballpoint", "stylograph"],
         *         "#legal": ["terms", "privacy"],
         *         ...
         *     };
         *     
         *     sitemap = {
         *         "#": ["news", "products", "about", "contact...", "legal"],
         *         "#product": ["..."],
         *         ...
         *     };
         *     
         * The method has different signatures and can be called several times.
         * If the method is called more than once, the configurations are
         * concatenated and existing values in the configuration are overwritten.
         * 
         * The following signatures are available:
         * 
         *     SiteMap.customize({meta});
         *     SiteMap.customize({meta}, function(path) {...});
         *     SiteMap.customize(RegExp, function(path) {...});
         *    
         *     SiteMap as meta-object:
         *     ----
         * The first configuration describes the SiteMap as a meta-object. The
         * meta-object defines all available paths and facets for the face flow.    
         *     
         *     SiteMap as meta-object and permit function:
         *     ----
         * In the second example, a permit method is passed in addition to the 
         * SiteMap as a meta-object. This method is used to implement permission
         * concepts and can be used to check and manipulate paths. Several
         * permit methods can be registered. All requested paths pass through
         * the permit method(s). This can decide what happens to the path. From
         * the permit method a return value is expected, which can have the
         * following characteristics:
         * 
         *     true:
         * The validation is successful and the iteration via further permit
         * method is continued. If all permit methods return true and thus
         * confirm the path, it is used.
         *      
         *     String:
         * The validation (iteration over further permit-methods) will be
         * aborted and it will be forwarded to the path corresponding to the
         * string. 
         * 
         *     In all other cases:
         * The path is regarded as invalid/unauthorized, the validation
         * (iteration over further permit-methods) will be aborted and is
         * forwarded to the original path.
         * 
         * A permit method for paths can optionally be passed to each
         * meta-object. This is interesting for modules that want to register
         * and validate their own paths.
         * 
         *     Acceptor:
         *     ----
         * Acceptors work in a similar way to permit methods. In difference,
         * permit methods are called for each path and acceptors are only called
         * for those that match the RegExp pattern. Also from the permit method
         * a return value is expected, which can have the following
         * characteristics -- see SiteMap with permit function.
         * 
         *     SiteMap.customize(/^phone.*$/i, function(path) {
         *             dial the phone number
         *     });
         *     SiteMap.customize(/^mail.*$/i, function(path) {
         *             send a mail
         *     });
         *     SiteMap.customize(/^sms.*$/i, function(path) {
         *             send a sms
         *     });
         *     
         *     SiteMap.customize(RegExp, function);
         * 
         * Permit methods and acceptors are regarded as one set and called in
         * the order of their registration.
         * 
         *     Important note about how the SiteMap works:
         *     ----
         * The SiteMap collects all configurations cumulatively. All paths and 
         * facets are summarized, acceptors and permit methods are collected in
         * the order of their registration. A later determination of which
         * metadata was registered with which permit methods is not possible.
         * 
         * The configuration of the SiteMap is only applied if an error-free
         * meta-object is passed and no errors occur during processing.
         * 
         * The method uses variable parameters as and according to the previous
         * description.
         *
         * @param  pattern
         * @param  callback
         * @param  meta
         * @param  permit
         * @throws An error occurs in the following cases:
         *     - if the data type of acceptor and/or callback is invalid
         *     - if the data type of map and/or permit is invalid
         *     - if the syntax and/or the format of facets are invalid
         */
        customize(...variants) {

            _sitemap_active = true;

            if (variants.length > 1
                    && variants[0] instanceof RegExp) {
                if (typeof variants[1] !== "function")
                    throw new TypeError("Invalid acceptor: " + typeof variants[1]);
                _acceptors.add({pattern:variants[0], action:variants[1]});
                return;
            }

            if (variants.length < 1
                    || typeof variants[0] !== "object")
                throw new TypeError("Invalid map: " + typeof variants[0]);
            const map = variants[0];

            const acceptors = new Set(_acceptors);
            if (variants.length > 1) {
                if (typeof variants[1] !== "function")
                    throw new TypeError("Invalid permit: " + typeof variants[1]);
                acceptors.add({pattern:null, action:variants[1]});
            }

            const paths = new Map();
            _paths.forEach((value, key) => {
                if (typeof key === "string"
                        && key.match(PATTERN_PATH_FACE))
                paths.set(key, value);
            });

            const facets = new Map();
            _facets.forEach((value, key) => {
                if (typeof key === "string"
                        && key.match(PATTERN_PATH_FACET))
                    facets.set(key, value);
            });

            let variables = new Set();
            _variables.forEach((variable) => {
                if (typeof variable === "string"
                        && variable.match(PATTERN_PATH_FACE))
                    variables.add(variable);
            });

            Object.keys(map).forEach((key) => {

                // A map entry is based on a path (datatype string beginning
                // with #) and an array of String or null as value. 
                if (typeof key !== "string"
                        || !key.match(PATTERN_PATH_FACE))
                    return;
                let value = map[key];
                if (value !== null
                        && !Array.isArray(value))
                    return;
                
                key = Path.normalize(key);
                
                // Entry is added to the path map, if necessary as empty array.
                // Thus, the following path map object will be created:
                //     {#path:[facet, facet, ...], ...}
                if (!paths.has(key))
                    paths.set(key, []); 
                
                // In the next step, the facets for a path are determined.
                // These are added to the path in the path map if these do not
                // already exist there.
                // Additionally, a facet map object will be created:
                //     {#facet-path:{path:#path, facet:facet}, ...}
                value = value || [];
                value.forEach((facet) => {

                    // Facets is an array of strings with the names of the
                    // facets that must match the PATTERN_PATH_FACET.
                    if (typeof facet !== "string")
                        throw new TypeError("Invalid facet: " + typeof facet);
                    facet = facet.toLowerCase().trim();
                    if (!facet.match(PATTERN_PATH_FACET)
                            && !facet.match(PATTERN_PATH_FACET_VARIABLE))
                        throw new Error(`Invalid facet${facet ? ": " + facet : ""}`);
                    
                    // Variable paths are collected additionally, so that later
                    // on when determining the path, the complete SiteMap does
                    // not have to be searched for variable paths. Variable
                    // paths are also registered without ... at the end as
                    // normal paths.
                    if (facet.match(PATTERN_PATH_FACET_VARIABLE)) {
                        // If the facet is only ..., it is registered as
                        // available face, otherwise as a variable facet.
                        facet = facet.replace(/\.+$/, "");
                        const variable = facet ? key.replace(/#+$/, "") + "#" + facet : key;
                        if (!variables.has(variable))
                            variables.add(variable);
                        // If the face is only ..., it is registered as a face.
                        // Therefore, nothing needs to be done now.
                        if (!facet)
                            return;
                    }
                    
                    // If the facet is not in the path, it will be added.
                    if (!paths.get(key).includes(facet))
                        paths.get(key).push(facet);
                    // The facet map object is assembled.
                    facets.set(Path.normalize(key, facet), {path:key, facet});
                });
            });

            _acceptors.clear();
            acceptors.forEach(value =>
                _acceptors.add(value));

            _paths.clear();
            paths.forEach((value, key) =>
                _paths.set(key, value));

            _facets.clear();
            facets.forEach((value, key) =>
                _facets.set(key, value));

            _variables.clear();
            variables = Array.from(variables);
            variables.sort((value1, value2) =>
                value1.localeCompare(value2));
            variables.forEach((value) =>
                _variables.add(value));
        }
    });

    // Map with all paths without facets paths (key:path, value:facets)
    const _paths = new Map();

    // Map with all paths with facet paths {path:key, facet:facet}
    // The sum of all paths and assigned facets
    const _facets = new Map();

    // Set with all variables paths
    const _variables = new Set();

    // Set with all supported acceptors
    const _acceptors = new Set();

    // Set with the path history (optimized)
    const _history = new Set();
    Object.defineProperty(SiteMap, "history", {
        value: _history
    });

    /**
     * Registration of the attribute static for hardening. The attribute is
     * therefore more difficult to manipulate in markup.
     */
    Composite.customize("@ATTRIBUTES-STATICS", "static");

    /**
     * Established a listener that listens when the page loads. The method
     * initiates the initial usage of the path.
     */
    window.addEventListener("load", () => {
        
        // When clicking on a link with the current path, the focus must be set
        // back to face/facet, as the user may have scrolled on the page.
        // However, this is only necessary if face + facet have not changed. In
        // all other cases the Window-HashChange-Event does the same
        document.body.addEventListener("click", (event) => {

            if (!_sitemap_active)
                return;

            if (event.target
                    && event.target instanceof Element
                    && event.target.hasAttribute("href")) {
                const target = SiteMap.lookup(event.target.getAttribute("href"));
                const source = SiteMap.lookup(Path.normalize(SiteMap.location));
                if (source && target
                        && source.face === target.face
                        && source.facet === target.facet
                        && typeof target.focus === "function")
                    target.focus();
            }
        });

        // The initial rendering is started by the direct call of the hashchange
        // event, thus without trigger.
        SiteMap.forward(window.location.hash || "#");
    });

    /**
     * Establishes a listener that detects changes to the URL hash. The method
     * corrects invalid and unauthorized paths by forwarding them to next valid
     * path, restores the facet of functional paths, and organizes partial
     * rendering.
     */
    window.addEventListener("hashchange", (event) => {

        // Without a SiteMap no partially rendering can be initiated.
        if (!_sitemap_active
                || _paths.size <= 0)
            return;

        let source = Path.normalize(SiteMap.location);
        let locate = (event.newURL || "").replace(PATTERN_URL, "$1");
        let target = SiteMap.locate(locate);

        // Indicator for initial rendering when the history is empty.
        // In case of the initial rendering:
        // - SiteMap.location must be set finally
        // - window.location.hash must be set finally
        // - Body must be rendered
        const initial = _history.size <= 0;

        // Initially, no function path is useful, and so in this case will be
        // forwarded to the root.
        if (target.match(PATTERN_PATH_FUNCTIONAL)
                && initial)
            target = "#";
        
        // For functional interaction paths, old paths are visually restored.
        // Rendering is not necessary because the face/facet does not change or
        // the called function has partially triggered rendering.
        if (target.match(PATTERN_PATH_FUNCTIONAL)) {
            history.replaceState(null, document.title, SiteMap.location);
            return;
        }

        // If window.location.hash, SiteMap.location and new URL match, no
        // update or rendering is required.
        if (target === window.location.hash
                && target === SiteMap.location
                && !initial)
            return;
        
        // If the permission is not confirmed, will be forwarded to the next
        // higher known/permitted path, based on the requested path.
        // Alternatively, the permit methods can also supply a new target, which
        // is then jumped to.
        const forward = SiteMap.permit(target);
        if (forward !== true) {
            if (typeof forward === "string")
                SiteMap.forward(forward);
            else SiteMap.forward(target !== "#" ? target + "##" : "#");
            return;
        }
        
        // The locations are updated synchronously. The possible triggering of
        // the hashchange-event can be ignored, because SiteMap.location and
        // window.location.hash are the same and therefore no update or
        // rendering is triggered.
        SiteMap.location = target;
        
        // Source and target for rendering are determined. Because of possible
        // variable paths, the current path does not have to correspond to the
        // current face/facet and must be determined via the parent if necessary.
        source = SiteMap.lookup(source);
        target = SiteMap.lookup(target);        
        
        source = source.face;
        if (!source.endsWith("#"))
            source += "#";
        target = target.face;
        if (!target.endsWith("#"))
            target += "#";
        
        // The deepest similarity in both paths is used for rendering.
        // Render as minimal as possible:
        //     old: #a#b#c#d#e#f  new: #a#b#c#d     -> render #d
        //     old: #a#b#c#d      new: #a#b#c#d#e#f -> render #d
        //     old: #a#b#c#d      new: #e#f         -> render # (body)
        // Initially always the body is rendered.
        let render = "#";
        if (source.startsWith(target))
            render = target;
        else if (target.startsWith(source))
            render = source;
        render = render.match(/((#[^#]+)|(^))#*$/);
        if (render && render[1] && !initial)
            Composite.render(render[1]);
        else Composite.render(document.body);
        
        // Focus only after rendering, so that the target is there.
        window.location.assign(SiteMap.location);
        
        // Update of the hash and thus of the page focus, if the new focus
        // (hash) was hidden before rendering or did not exist. For this
        // purpose, the setter must be called in window.location.
        window.location.hash = window.location.hash;
    });

    /**
     * Rendering filter for all composite elements. The filter causes that for
     * each composite element determined by the renderer, an additional
     * condition is added to the SiteMap. This condition is used to show or hide
     * the composite elements in the DOM to the corresponding virtual paths. The
     * elements are identified by the serial. The SiteMap uses a map
     * (serial/element) as cache for fast access. The cleaning of the cache is
     * done by a MutationObserver.
     */
    Composite.customize((element) => {

        if (!_sitemap_active)
            return;
        if (!(element instanceof Element)
                || !element.hasAttribute(Composite.ATTRIBUTE_COMPOSITE))
            return;
        if (element.hasAttribute("static"))
            return;
        
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
                    return `{{SiteMap.accept("${path}") and (${match})}}`;
                });
        }
        if (!script)
            script = `${script || ""}{{SiteMap.accept("${path}")}}`;
        element.setAttribute(Composite.ATTRIBUTE_CONDITION, script);
    });

    /**
     * Pattern for a valid path. The syntax is based on XML entities (DOM). A
     * path segment begins with a word character _ a-z 0-9, optionally more word
     * characters and additionally - can follow, but can not end with the -
     * character. Paths are separated by the # character.
     */
    const PATTERN_PATH = /(^(\w(\-*\w)*)*((#+\w(\-*\w)*)+)#*$)|(^\w(\-*\w)*$)|(^#+$)|(^$)/;

    /** Pattern for an url path. */
    const PATTERN_URL = /^\w+:\/.*?(#.*)*$/i;

    /** Pattern for a functional path. */
    const PATTERN_PATH_FUNCTIONAL = /^#{3,}$/;

    /**
     * Static component for the use of (virtual) paths. Paths are a reference to
     * a target in face flow. The target can be a face, a facet or a function.
     * For more details see method Path.normalize(variants).
     */
    compliant("Path");
    compliant(null, window.Path = {

        /**
         * Normalizes a path. Paths consist exclusively of word characters and
         * underscores (based on composite IDs) and must begin with a word
         * character and use the hash character as separator and root. Between
         * the path segments, the hash character can also be used as a back jump
         * (parent) directive. The back jump then corresponds to the number of
         * additional hash characters.
         *
         *     Note:
         * Paths use lowercase letters. Upper case letters are automatically
         * replaced by lower case letters when normalizing.
         *
         * There are four types of paths:
         *
         *     Functional paths:
         *     ----
         * The paths consists of three or more hash characters (###+) and are
         * only temporary, they serve a function call without changing the
         * current path (URL hash). If such a path is detected, the return value
         * is always ###.
         *
         *     Root paths:
         *     ----
         * These paths are empty or contain only one hash character. The return
         * value is always the given root path or # if no root path was
         * specified.
         *
         *     Relative paths:
         *     ----
         * These paths begin without hash or begin with two or more hash (##+)
         * characters. Relative paths are prepended with the passed root.
         *
         *     Absolute paths:
         *     ----
         * These paths begin with one hash characters. A possibly passed root is
         * ignored.
         *
         * All paths are balanced. The directive of two or more hash characters
         * is resolved, each double hash means that the preceding path segment
         * is skipped. If more than two hash characters are used, it extends the
         * jump length.
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
         *     function(path)
         * @param  root optional, otherwise # is used
         * @param  path to normalize (URL is also supported, only the hash is
         *     used here and the URL itself is ignored)
         * @return the normalize path
         * @throws An error occurs in the following cases:
         *     - if the root and/or the path is invalid
         */
        normalize(...variants) {

            if (variants.length <= 0)
                return null;
            if (variants.length > 0
                    && !Object.usable(variants[0]))
                return null;
            if (variants.length > 1
                    && !Object.usable(variants[1]))
                return null;

            if (variants.length > 1
                    && typeof variants[0] !== "string")
                throw new TypeError("Invalid root: " + typeof variants[0]);
            let root = "#";
            if (variants.length > 1) {
                root = variants[0];
                try {root = Path.normalize(root);
                } catch (error) {
                    root = (root || "").trim();
                    throw new TypeError(`Invalid root${root ? ": " + root : ""}`);
                }
            }

            if (variants.length > 1
                    && typeof variants[1] !== "string")
                throw new TypeError("Invalid path: " + typeof variants[1]);
            if (variants.length > 0
                    && typeof variants[0] !== "string")
                throw new TypeError("Invalid path: " + typeof variants[0]);
            let path = "";
            if (variants.length === 1)
                path = variants[0];
            if (variants.length === 1
                    && path.match(PATTERN_URL))
                path = path.replace(PATTERN_URL, "$1");
            else if (variants.length > 1)
                path = variants[1];
            path = (path || "").trim();

            if (!path.match(PATTERN_PATH))
                throw new TypeError(`Invalid path${String(path).trim() ? ": " + path : ""}`);

            path = path.replace(/([^#])#$/, "$1");
            path = path.replace(/^([^#])/, "#$1");

            // Functional paths are detected.
            if (path.match(PATTERN_PATH_FUNCTIONAL))
                return "###";

            path = root + path;
            path = path.toLowerCase();

            // Path will be balanced
            const pattern = /#[^#]+#{2}/;
            while (path.match(pattern))
                path = path.replace(pattern, "#");
            path = "#" + path.replace(/(^#+)|(#+)$/g, "");

            return path;
        }
    });
})();