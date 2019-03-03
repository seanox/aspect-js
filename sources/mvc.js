/**
 *  LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 *  im Folgenden Seanox Software Solutions oder kurz Seanox genannt. Diese
 *  Software unterliegt der Version 2 der GNU General Public License.
 *
 *  Seanox aspect-js, Fullstack JavaScript UI Framework
 *  Copyright (C) 2019 Seanox Software Solutions
 *
 *  This program is free software; you can redistribute it and/or modify it
 *  under the terms of version 2 of the GNU General Public License as published
 *  by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT
 *  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 *  more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 *  
 *  
 *      DESCRIPTION
 *      ----
 *  The SiteMap is a static navigation component based on virtual paths and
 *  views. Virtual paths are used to delimit pages and to focus projections.
 *  Pages are a (complex) view and combine different fixed contents (navigation,
 *  menu, footer, ...) as well as variable projections (faces/views), which in
 *  turn can use sub and partial projections (facets). 
 *  
 *  Virtual paths use URL hash navigation in which the hash character is used to
 *  separate the individual parts of the path. SiteMap monitors the URL hash and
 *  the use of virtual paths actively with regard to validity and permission.
 *  
 *  Acceptors are a very special navigation function.
 *  Acceptors can be regarded as path filters. They are based on regular
 *  expressions and methods that are executed when the paths match a pattern.
 *  Acceptors can argue silently in the background without influencing the
 *  navigation of the SiteMap, or they can argue actively and take over the
 *  navigation completely active or passive by forwarding (change/manipulation
 *  of the destination).
 *  
 *  All in all, the SiteMap is comparable to a city map. The paths are streets
 *  and create a concatenated route from the root to the destination. The
 *  destination can be a street (face), with which all addresses/sights (views)
 *  are indicated or the destination is a concrete address/sights (view) in a
 *  street.
 *  
 *  All streets have a guard, who can forbid and allow access to the street
 *  and/or individual addresses/sights according to permissions.
 *  
 *  For streets, adresses and sights you can define patterns which actively
 *  change the routing or passively follow the route. 
 *  
 *  MVC 1.0 20190303
 *  Copyright (C) 2019 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20190303
 */
if (typeof Path === "undefined") {
    
    /**
     *  Static component for the use of (virtual) paths.
     *  For more details see method Path.normalize(variants).
     */    
    Path = {};
    
    /** Pattern for a valid path. */
    Path.PATTERN_PATH = /^(?:(?:#*(?:[a-z]\w*)*)(?:#+(?:[a-z]\w*)*)*)*$/;

    /** Pattern for a url path. */
    Path.PATTERN_URL = /^[a-z]+:\/.*?(#.*)*$/i;

    /** Pattern for a functional path. */
    Path.PATTERN_PATH_FUNCTIONAL = /^#{3,}$/;
    
    /**
     *  Normalizes a path.
     *  Paths consist exclusively of word characters and underscores (based on
     *  composite IDs) and must begin with a letter and use the hash character
     *  as separator and root. Between the path segments, the hash character can
     *  also be used as a back jump directive. The return jump then corresponds
     *  to the number of additional hash characters.
     *  
     *      Note:
     *  Paths use lowercase letters. Upper case letters are automatically
     *  replaced by lower case letters when normalizing.
     *  
     *  There are four types of paths:
     *  
     *      Functional paths:
     *      ----
     *  The paths consists of three or more hash characters (###+) and are only
     *  temporary, they serve a function call without changing the current path
     *  (URL hash). If such a path is detected, the return value is always ###.
     *  
     *      Root paths:
     *      ----
     *  These paths are empty or contain only one hash character. The return
     *  value is always the given root path or # if no root path was specified.
     *  
     *      Relative paths:
     *      ----        
     *  These paths begin without hash or begin with two or more hash (##+)
     *  characters. Relative paths are prepended with the passed root.
     *  
     *      Absolute paths:
     *      ----
     *  These paths begin with one hash characters. A possibly passed root is
     *  ignored.
     *  
     *  All paths are balanced. The directive of two or more hash characters is
     *  resolved, each double hash means that the preceding path segment is
     *  skipped. If more than two hash characters are used, it extends the jump
     *  length.
     *  
     *      Examples (root #x#y#z):
     *      ----
     *  #a#b#c#d#e##f   #a#b#c#d#f
     *  #a#b#c#d#e###f  #a#b#c#f
     *  ###f            #x#f  
     *  ####f           #f
     *  empty           #x#y#z
     *  #               #x#y#z
     *  a#b#c           #x#y#z#a#b#c
     *  
     *  Invalid roots and paths cause an exception.
     *  The method uses variable parameters and has the following signatures:
     *      function(root, path) 
     *      function(path) 
     *  @param  root optional, otherwise # is used 
     *  @param  path to normalize (URL is also supported, only the hash is used
     *               here and the URL itself is ignored)
     *  @return the normalize path
     *  @throws An error occurs in the following cases:
     *      - if the root and/or the path is invalid
     */
    Path.normalize = function(variants) {
            
        var path = null;
        var root = null;
        if (arguments.length == 1) {
            path = arguments[0];
        } else if (arguments.length >= 1) {
            root = arguments[0];
            try {root = Path.normalize(root);
            } catch (exception) {
                throw new TypeError("Invalid root" + (String(root).trim() ? ": " + root : ""));
            }
            path = arguments[1];
        }
        
        if (root == null
                || root.match(/^(#+)*$/))
            root = "#";

        if (path == null)
            return null;
        
        if (typeof path === "string"
                && path.match(Path.PATTERN_URL))
            path = path.replace(Path.PATTERN_URL, "$1");
        
        if (typeof path !== "string"
                || !path.match(Path.PATTERN_PATH))
            throw new TypeError("Invalid path" + (String(path).trim() ? ": " + path : ""));
        
        path = path.toLowerCase();
        
        //Functional paths are detected.
        if (path.match(Path.PATTERN_PATH_FUNCTIONAL))
            return "###";

        //Paths to the current root are detected.
        if (path.length == 0)
            return root;
        
        //Relative paths are extended with the root.
        if (path.match(/^[^#].*$/))
            path = root + "#" + path;
        if (path.match(/^#{2}.*$/))
            path = root + path;
        
        //Path will be balanced
        var pattern = /#[^#]+#{2}/;
        while (path.match(pattern))
            path = path.replace(pattern, "#");
        path = "#" + path.replace(/(^#+)|(#+)$/g, "");
        
        return path;
    };
};

if (typeof SiteMap === "undefined") {
    
    /**
     *  Static component for the use of a SiteMap for virtua paths.
     *  SiteMap is a directory with all supported acceptors as well as all
     *  allowed paths, views and their associations.
     *  
     *  TODO: Pfad = Page | Page:View
     *        Eine View kann zur Teil Page (Partial Page) werden, wenn der Pfad nur für View existiert,
     *        dann aber noch ein darauf existierender Pfad, den Pfad der View aufgreift:
     *        #[projects, ...], #projects#devwex:[...]
     *  TODO: Begriffe einheitlich verwenden (Path, Page, Partial Page, View) 
     */
    SiteMap = {};

    /**
     *  Primarily, the root is always used when loading the page, since the
     *  renderer is executed before the MVC. Therefore, the renderer may not yet
     *  know all the paths and authorizations. After the renderer, the MVC is
     *  loaded and triggers the renderer again if the path requested with the
     *  URL differs.
     */
    SiteMap.location = "#";
    
    /**
     *  Internal counter of the path changes, is actually only used for
     *  initiation/detection of the initial rendering.
     */
    SiteMap.ticks;
    
    /** Assosiative array with all real paths without views paths (key:path, value:views). */
    SiteMap.paths;

    /** Array with all view paths (sum of all paths and assigned views). */
    SiteMap.views;

    /** Array with all supported acceptors. */  
    SiteMap.acceptors;
    
    /** Array with all permit functions. */
    SiteMap.permits;
    
    /** Pattern for a valid path. */
    SiteMap.PATTERN_PATH = /^(#([a-z]\w*)*)+$/;

    /** Pattern for a valid path views. */
    SiteMap.PATTERN_PATH_VIEWS = /^(#[a-z]\w*)(\s+(#[a-z]\w*)+)*$/;
    
    /**
     *  Checks a path using existing/registered permit methods.
     *  The path is only allowed if all permit methods confirm the check with
     *  the return value true.
     *  @param  path to check (URL is also supported, only the hash is used
     *               here and the URL itself is ignored)
     *  @return true if the path has been confirmed as permitted 
     */
    SiteMap.permit = function(path) {
        
        var permits = SiteMap.permits || [];
        while (permits.length > 0) {
            var permit = permits.shift();
            if (permit.call(null, path) !== true)
                return false;
        }
        return true;
    };

    /**
     *  Determines the real existing path according to the SiteMap.
     *  The methods distinguish between absolute, relative and functional paths.
     *  Functionals remain unchanged.
     *  Absolute and relative paths are balanced.
     *  Relative paths are balanced on the basis of the current location.
     *  All paths are checked against the SiteMap. Invalid paths are searched
     *  for a valid partial path. To do this, the path is shortened piece by
     *  piece. If no valid partial path can be found, the root is returned.
     *  Without passing a path, the current location is returned.
     *  @param  path to check - optional (URL is also supported, only the hash
     *               is used here and the URL itself is ignored)
     *  @return the real path determined in the SiteMap, or the unchanged
     *          function path.
     */  
    SiteMap.locate = function(path, strict) {
        
        path = path || "";
        
        //The path is normalized. 
        //Invalid paths are shortened when searching for a valid partial path.
        //Theoretically, the shortening must end automatically with the root or
        //the current path.
        try {path = Path.normalize(SiteMap.location, path);
        } catch (exception) {
            while (true) {
                path = path.replace(/(^[^#]+$)|(#[^#]*$)/, "");
                try {path = Path.normalize(SiteMap.location, path);
                } catch (exception) {
                    continue;
                }
                break;
            }
        }
        
        if (path.match(Path.PATTERN_PATH_FUNCTIONAL))
            return path;

        var paths = Object.keys(SiteMap.paths || {});
        if (!strict)
            paths = paths.concat(Object.keys(SiteMap.views || {}));
        while (paths && path.length > 1) {
            if (paths.includes(path))
                return path;
            path = Path.normalize(path + "##");
        }
        
        return "#";
    };

    /**
     *  Navigates to the given path, if it exists in the SiteMap.
     *  All paths are checked against the SiteMap. Invalid paths are searched
     *  for a valid partial path. To do this, the path is shortened piece by
     *  piece. If no valid partial path can be found, the root is the target.
     *  @param path (URL is also supported, only the hash is used here and the
     *              URL itself is ignored)
     */    
    SiteMap.navigate = function(path) {
        window.location.hash = SiteMap.locate(path);
    };
    
    /**
     *  Returns the meta data for a path.
     *  The meta data is an object with the following structure:
     *      {path:..., page:..., view:...}
     *  If no meta data can be determined because the path is invalid or not
     *  declared in the SiteMap, null is returned.
     *  @param  path
     *  @return meta data object, otherwise null
     */
    SiteMap.lookup = function(path) {
        
        var paths = SiteMap.paths || {};
        var views = SiteMap.views || {};

        var canonical = function(meta) {
            if (!meta.view)
                return meta.path;
            if (meta.path.endsWith("#"))
                return meta.path + meta.view;
            return meta.path + "#" + meta.view;
        };

        if (paths.hasOwnProperty(path))
            return {path:path, page:path, view:null};
        else if (views.hasOwnProperty(path))
            return {path:canonical(views[path]), page:views[path].path, view:views[path].view};
            
        return null;
    };

    /**
     *  Checks whether a path or subpath is currently being used.
     *  This is used to show/hide composites depending on the current location.
     *  @param  path
     *  @return true if the path or subpath is currently used, otherwise false
     */
    SiteMap.accept = function(path) {
        
        //Only valid paths can be confirmed.
        path = (path || "").trim().toLowerCase();
        if (!path.match(/^#.*$/))
            return false;
        path = path.replace(/(#.*?)#*$/, "$1");

        //The current path is determined and it is determined whether it is a
        //page or a view. In both cases, a meta object is created:
        //    {path:#path, view:...}
        var location = SiteMap.lookup(Path.normalize(SiteMap.location));
        if (!location)
            return false;
        
        //Determines whether the passed path is a page, a partial page or a view.
        //(Partial)pages always have the higher priority for views.
        //If nothing can be determined, there cannot be a valid path.
        var lookup = SiteMap.lookup(path);
        if (!lookup)
            return false;
        
        var partial = lookup.path;
        if (!partial.endsWith("#"))
            partial += "#";
        
        //Views are only displayed if the paths match and the path does not
        //refer to a partial page.
        if (lookup.view
                && location.page != lookup.page
                && !location.path.startsWith(partial))
            return false;

        //Pages and part pages are only displayed if the paths match or the path
        //starts with the passed path as a partial path.
        if (!location.path.startsWith(partial)
                && location.page != lookup.page)
            return false;

        //Invalid paths and views are excluded at this place, because they
        //already cause a false termination of this method (return false) and do
        //not have to be checked here anymore.

        return true;
    };
    
    /**
     *  Configures the SiteMap individually.
     *  The configuration is passed as a meta object.
     *  The keys (string) correspond to the paths, the values are arrays with
     *  the valid views for a path.
     *  
     *      sitemap = {
     *          "#": ["news", "products", "about", "contact", "legal"],
     *          "products#papers": ["paperA4", "paperA5", "paperA6"],
     *          "products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
     *          "products#pens": ["pencil", "ballpoint", "stylograph"],
     *          "legal": ["terms", "privacy"],
     *          ...
     *      };
     *      
     *      SiteMap.customize({meta});
     *      SiteMap.customize(meta);
     *      SiteMap.customize({meta}, function);
     *      SiteMap.customize(meta, permit);
     *      
     *  Optionally, acceptors can also be passed with the meta object.
     *  The key (RegExp) corresponds to a path filter, the value is a method
     *  that is executed if the current path matches the filter of an acceptor.
     *      
     *      SiteMap.customize(/^phone.*$/i, function(path) {
     *              dial the phone number
     *      });
     *      SiteMap.customize(/^mail.*$/i, function(path) {
     *              send a mail
     *      });
     *      SiteMap.customize(/^sms.*$/i, function(path) {
     *              send a sms
     *      });
     *      
     *      SiteMap.customize(RegExp, function);
     *      
     *  An acceptor is an alias/filter for a path based function
     *  If the path corresponds to an acceptor, the stored function is called.
     *  The return value controls what happens to the path.  
     *      If the return value is false:
     *      ----
     *  The Acceptor takes over the complete path control for the matching path.
     *  Possible following acceptors are not used.   
     *      If the return value is a string:
     *      ----
     *  This is interpreted as a new destination and a forwarding follows.
     *  Possible following acceptors are not used.
     *      In all other cases:
     *      ----
     *  The Acceptor works in the background.
     *  Possible following acceptors are used and the SiteMap keeps the control
     *  of the path.
     *  
     *  A permit method for paths can optionally be passed to each meta object.
     *  This is interesting for modules that want to register and validate their
     *  own paths. 
     *  
     *      Important note about how the SiteMap works:
     *      ----
     *  The SiteMap emanages all configurations cumulatively. All paths and
     *  views are summarized, acceptors and permit methods are collected in the
     *  order of their registration. A later assignment of which meta data and
     *  permit methods were passed together with which meta object does not
     *  exist.
     *  
     *  The configuration of the SiteMap is only applied if an error-free meta
     *  object is transferred and no errors occur during processing.
     *  
     *  The method uses variable parameters and has the following signatures:
     *  
     *      function(object);
     *      function(object, function);
     *      function(RegExp, function);
     *  
     *  @param  map
     *  @param  permit
     *  @throws An error occurs in the following cases:
     *      - if the data type of map and/or permit is invalid
     *      - if the sntax and/or the format of views are invalid
     */
    SiteMap.customize = function(variants) {
        
        if (arguments.length > 1
                && arguments[0] instanceof RegExp
                && typeof arguments[1] === "function") {
            SiteMap.acceptors = SiteMap.acceptors || [];
            SiteMap.acceptors.push({pattern:arguments[0], action:arguments[1]});
            return;
        }

        if (arguments.length < 1
                || typeof arguments[0] !== "object")
            throw new TypeError("Invalid map: " + typeof arguments[0]);
        var map = arguments[0];

        var permits = (SiteMap.permits || []).slice();
        if (arguments.length > 1
                && typeof arguments[1] !== "function")
            throw new TypeError("Invalid permit: " + typeof arguments[1]);
        var permit = arguments.length > 1 ? arguments[1] : null;
        if (permit)
            permits.push(permit);

        var paths = {};
        Object.keys(SiteMap.paths || {}).forEach(function(key) {
            if (typeof key === "string"
                    && key.match(SiteMap.PATTERN_PATH))
                paths[key] = SiteMap.paths[key];
        });

        var views = {};
        Object.keys(SiteMap.views || {}).forEach(function(key) {
            if (typeof key === "string"
                && key.match(SiteMap.PATTERN_PATH))
            views[key] = SiteMap.views[key];
        });

        Object.keys(map).forEach(function(key) {

            //A map entry is based on a path (datatype string beginning with #)
            //and an array of String or null as value. 
            if (typeof key !== "string"
                    || !key.match(SiteMap.PATTERN_PATH))
                return;
            var value = map[key];
            if (value != null
                    && !Array.isArray(value))
                return;
            
            key = Path.normalize(key);
            
            //The entry is added to the path map, if necessary as empty array.
            //Thus the following path map object will be created:
            //    {#path:[view, view, ...], ...}
            paths[key] = paths[key] || [];
            
            //In the next step, the views for a path are determined.
            //These are added to the path in the path map if these do not
            //already exist there. Additional a view map object will be created:
            //    {#view-path:{path:#path, view:view}, ...}
            value = value || [];
            value.forEach(function(view) {
                //Views is an array of strings with the names of the views.
                //The names must correspond to the PATTERN_PATH_VIEW.
                if (typeof view !== "string")
                    throw new TypeError("Invalid view: " + typeof view);
                view = view.toLowerCase().trim();
                if (!view.match(SiteMap.PATTERN_PATH_VIEW))
                    throw new Error("Invalid view: " + view);
                //If the view does not exist at the path, the view is added.
                if (!paths[key].includes(view))
                    paths[key].push(view);
                //The view map object is assembled.
                views[Path.normalize(key, view)] = {path:key, view:view};
            });
        });
        
        SiteMap.paths = paths;
        SiteMap.views = views;
        SiteMap.permits = permits;
    };
    
    /**
     *  Rendering filter for all composite elements.
     *  The filter causes an additional condition for the SiteMap to be added to
     *  each composite element that the renderer determines. This condition is
     *  used to show or hide the composite elements in the DOM to the
     *  corresponding virtual paths. The elements are identified by the serial.
     *  The SiteMap uses a map (serial/element) as cache for fast access. The
     *  cleaning of the cache is done by a MotationObserver.
     */
    Composite.customize(function(element) {
        
        if (!(element instanceof Element)
                || !element.hasAttribute(Composite.ATTRIBUTE_COMPOSITE))
            return;
        if (element.hasAttribute("static"))
            return;
        
        var path = "#" + Composite.mount.locate(element).replace(/\./g, "#").toLowerCase();
        
        var script = null;
        if (element.hasAttribute(Composite.ATTRIBUTE_CONDITION)) {
            script = element.getAttribute(Composite.ATTRIBUTE_CONDITION).trim();
            if (script.match(Composite.PATTERN_EXPRESSION_CONTAINS))
                script = script.replace(Composite.PATTERN_EXPRESSION_CONTAINS, function(match, offset, content) {
                    match = match.substring(2, match.length -2).trim();
                    return "{{SiteMap.accept(\"" + path + "\") and (" + match + ")}}";
                });
        }
        if (!script)
            script = (script || "") + "{{SiteMap.accept(\"" + path + "\")}}";
        element.setAttribute(Composite.ATTRIBUTE_CONDITION, script);
    });

    /**
     *  Established a listener that listens when the page loads.
     *  The method initiates the initial usage of the path.
     */
    window.addEventListener("load", function(event) {

        //Without a SiteMap the page will be rendered initially after loading.
        //Then the page has to take control.
        if (Object.keys(SiteMap.paths || {}).length <= 0) {
            Composite.render(document.body);
            return;
        }

        var source = window.location.hash;
        var target = SiteMap.locate(source);

        if (!source
                && window.location.href.match(/[^#]#$/))
            source = "#";
        
        var event = document.createEvent('HTMLEvents');
        event.initEvent("hashchange", false, true);
        event.newURL = target;

        if (source != target)
            SiteMap.navigate(target);
        else window.dispatchEvent(event);
    });
    
    /**
     *  Establishes a listener that listens to changes from the URL hash.
     *  The method corrects invalid and unauthorized paths by forwarding them to
     *  the next valid path, restores the view of functional paths, and
     *  organizes partial rendering.
     */
    window.addEventListener("hashchange", function(event) {

        //Without a SiteMap no automatic rendering can be initiated.
        if (Object.keys(SiteMap.paths || {}).length <= 0)
            return;
            
        var source = Path.normalize(SiteMap.location);
        var locate = (event.newURL || "").replace(Path.PATTERN_URL, "$1");
        var target = SiteMap.locate(locate);
        
        //Discrepancies in the path cause a forwarding to a valid path.
        if (locate != target) {
            SiteMap.navigate(target);
            return;
        }        
        
        SiteMap.ticks = (SiteMap.ticks || 0) +1;
        
        //For functional interaction paths, the old path must be restored.
        //Rendering is not necessary because the page does not change or the
        //called function has partially triggered rendering.
        if (target.match(Path.PATTERN_PATH_FUNCTIONAL)) {
            var x = window.pageXOffset || document.documentElement.scrollLeft;
            var y = window.pageYOffset || document.documentElement.scrollTop;
            window.location.replace(source);
            window.scrollTo(x, y);
            return;
        }
        
        //TODO: ??? must be tested, look like an error, beause permit is not a function
        var acceptors = SiteMap.acceptors || [];
        for (var loop = 0; loop < acceptors.length; loop++) {
            var acceptor = acceptors[loop];
            if (!acceptor.pattern.test(target))
                continue;
            var result = acceptor.action.call(null, target);
            if (result === false)
                return;
            if (typeof result !== "string")
                continue;
            target = Path.normalize(result);
            return permit(target);
        }

        SiteMap.location = target;
        
        source = SiteMap.lookup(source);
        target = SiteMap.lookup(target);
        
        //Only if the page is changed or initial, a rendering is necessary.
        if (source.page == target.page
                && SiteMap.ticks > 1)
            return;
        
        source = source.page;
        if (!source.endsWith("#"))
            source += "#";
        target = target.page;
        if (!target.endsWith("#"))
            target += "#";
        
        //The deepest similarity in both paths is used for rendering.
        //Render as minimal as possible:
        //  old: #a#b#c#d#e#f  new: #a#b#c#d      -> render #d
        //  old: #a#b#c#d      new: #a#b#c#d#e#f  -> render #d
        //  old: #a#b#c#d      new: #e#f          -> render # (body)
        var render = "#";
        if (source.startsWith(target))
            render = target;
        else if (target.startsWith(source))
            render = source;
        render = render.match(/((?:(?:#[^#]+)#*$)|(?:^#$))/g)[0];
        if (render.length > 1)
            Composite.render(render);
        else Composite.render(document.body);

        //TODO: Scroll zum Target/View
        //      Das muss ggf. per window.setTimeout am Ende vom Rendering erfolgen,
        //      da ggf. das Target erst mit dem Rendering entsteht
    });
};