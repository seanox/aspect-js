/**
 *  LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 *  im Folgenden Seanox Software Solutions oder kurz Seanox genannt. Diese
 *  Software unterliegt der Version 2 der GNU General Public License.
 *
 *  Seanox aspect-js, JavaScript Client Faces
 *  Copyright (C) 2018 Seanox Software Solutions
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
 *  TODO:
 *  - Virtuelle Pfade basieren auf einer SiteMap (SiteMap.customize)
 *  - SiteMap verwendet nur gültige Pfade (existieren in SiteMap und der Pfad ist Gültig im Sinne von SiteMap.permit
 *    Ungültige Pfad führen zur Weiterleitung zum nächst höheren validen/erlaubten Pfad
 *  - Begriffe path + view / page + face + facetts  
 *  
 *  MVC 1.0 20180810
 *  Copyright (C) 2018 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20180810
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
     *  composite IDs) and use the hash character as separator and root. Between
     *  the path segments, the hash character can also be used as a back jump
     *  directive. The return jump then corresponds to the number of additional
     *  hash characters.
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
    
    /** Assosiative array with all real paths without views paths (key:path, value:views). */
    SiteMap.paths;

    /** Array with all view paths (sum of all paths and assigned views). */
    SiteMap.views;

    /** Array with all supported acceptors. */  
    SiteMap.acceptors;
    
    /** Array with all permit functions. */
    SiteMap.permits;
    
    /** Pattern for a valid path. */
    SiteMap.PATTERN_PATH = /^#([a-z]\w*)*$/;

    /** Pattern for a valid path views. */
    SiteMap.PATTERN_PATH_VIEWS = /^(#[a-z]\w*)(\s+(#[a-z]\w*)+)*$/;
    
    /**
     *  Checks a path using existing / registered permit methods.
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
                return faöse;
        }
        return true;
    };

    /**
     *  Determines the real existing path according to the SiteMap.
     *  The methods distinguish between absolute, relative and functional paths.
     *  Functionals remain unchanged.
     *  Absolute and relative paths are balanced.
     *  Relative paths are balanced on the basis of the current work path.
     *  All paths are checked against the SiteMap. Invalid paths are searched
     *  for a valid partial path. To do this, the path is shortened piece by
     *  piece. If no valid partial path can be found, the root is returned.
     *  Without passing a path, the current work path is returned.
     *  @param  path to check - optional (URL is also supported, only the hash
     *               is used here and the URL itself is ignored)
     *  @return the real path determined in the SiteMap, or the unchanged
     *          function path.
     */  
    SiteMap.locate = function(path) {
        
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

        while (SiteMap.views
                && path.length > 1) {
            if (SiteMap.views.includes(path))
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
     *  Checks whether a path or subpath is currently being used.
     *  This method is used to show and hide composites depending on the current
     *  work path.
     *  @param  path
     *  @return true if the path or subpath is currently used, otherwise false
     */
    SiteMap.lookup = function(path) {
        
        path = (path || "").trim().toLowerCase();
        if (!path)
            return false;
        
        var location = Path.normalize(SiteMap.location);
        
        var paths = Object.keys(SiteMap.paths || {});
        paths = paths.sort(function(path, compare) {
            return -path.length +compare.length;
        });
        
        for (; paths.length > 0; paths.shift()) {
            var item = paths[0];
            if (!location.startsWith(item.match(/#$/) ? item : item + "#")
                    && location != item)
                continue;
            if (item == path)
                return true;
            item = SiteMap.paths[item] || [];
            return item.includes(path.replace(/^#+/, ""));
        }
        
        return false;
    };
    
    //TODO:
    //- alle Pfade und views müssen (#[a-z]\w*)(\s+(#[a-z]\w*))* entsprechen
    //- die map wird nur übernommen, wenn dieses komplett fehlerfrei ist, im Fehlerfall wird keiner der Einträge übernommen
    //- optional kann eine Methode zur Validierug der Pfad übergeben werden
    //  das besonders für Modle interessant, wenn diese eigene Pfade registrieren, können
    //  diese auch eigene Validierungsmethoden mit bringen. Wichtig ist dann aber die
    //  Funktionsweise der SiteMap. Diese kommuliert alle Pfade und Views und somit
    //  ist keine spätere Trennung mehr möglich. Die Registrierten permit Methoden
    //  werden entsprechend der Reihenfolge beim Anlegen abgearbeitet. Für einen
    //  validen Pfad müssen alle permit-Methoden true zurückgeben, mit dem ersten
    //  false wird die Überprunfung beendet, weitere permit methoden werden dann
    //  nicht aufgeufen. Bedeutet, permit methoden sollten sich ausschliesslich
    //  um das Verbot nicht aber um die Erlaubnis kümmern und im zweifel immer true zurück gebenm, da noch weitere permit.methoden von anderen Modlen folgen könnten
    
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
     *          "products#pens": ["pencil", "ballpoint", "stylograph"]
     *          "legal": ["terms", "privacy"],
     *          ...
     *      }
     *      
     *  Optionally, acceptors can also be passed with the meta object.
     *  The key (RegExp) corresponds to a path filter, the value is a method
     *  that is executed if the current path matches the filter of an acceptor.
     *      
     *      sitemap = {
     *          ...
     *          /^mail.*$/, function() {
     *              send a mail
     *          },
     *          /^phone.*$/, function() {
     *              dial the phone number
     *          },,
     *          /^sms.*$/, function() {
     *              send a sms
     *          },
     *          ...
     *      }
     *      
     *  An acceptor is an alias/filter for a path based function
     *  If the path corresponds to an acceptor, the stored function is called.
     *  The return value controls what happens to the path.  
     *  If the return value is false, the Acceptor takes over the complete path
     *  control for the matching path. Possible following acceptors are not
     *  used.   
     *  If the return value is a string, this is interpreted as a new
     *  destination and a forwarding follows. Possible following acceptors are
     *  not used.
     *  In all other cases, the Acceptor works in the background. Possible
     *  following acceptors are used and the SiteMap keeps the control of the
     *  path.
     *  
     *  TODO:    
     */
    SiteMap.customize = function(map, permit) {

        if (typeof map !== "object")
            throw new TypeError("Invalid map: " + typeof map);
        if (permit != null
                && typeof map !== "function")
            throw new TypeError("Invalid permit: " + typeof permit);
        
        var paths = {};
        Object.keys(SiteMap.paths || {}).forEach(function(key) {
            paths[key] = SiteMap.paths[key];
        });
        var views = (SiteMap.views || []).slice();
        var acceptors = (SiteMap.acceptors || []).slice();
        var permits = (SiteMap.permits || []).slice();
        
        if (permit)
            permits.push(permit);
        
        Object.keys(map).forEach(function(key) {
            var value = map[key];
            if (typeof key === "string"
                && key.match(SiteMap.PATTERN_PATH)
                && (value == null
                        || typeof value === "string")) {
                views.push(key);
                paths[key] = paths[key] || [];
                value = (value || "").toLowerCase().trim().split(/\s+/);
                value.forEach(function(view) {
                    if (!view.match(SiteMap.PATTERN_PATH_VIEW))
                        throw new Error("Invalid view: " + view);
                    if (!paths[key].includes(view))
                        paths[key].push(view);
                    view = Path.normalize(key, view)
                    if (!views.includes(view))
                        views.push(view);
                });
            } else if (key != null
                    && key instanceof RegExp
                    && typeof value === "function") {
                acceptors[key] = value;
            }
        });
        
        SiteMap.paths = paths;
        SiteMap.views = views;
        SiteMap.acceptors = acceptors;
        SiteMap.permits = SiteMap.permits;
    };
    
    /**
     *  Rendering filter for all composite elements.
     *  The filter causes an additional condition for the SiteMap to be added to
     *  each composite element that the renderer determines. This condition is
     *  used to show or hide the composite elements in the DOM to the
     *  corresponding virtual paths. The elements are identified by the serial.
     *  The SiteMap uses a map (serial / element) as cache for fast access. The
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
                    return "{{SiteMap.lookup(\"" + path + "\") and (" + match + ")}}";
                });
        }
        if (!script)
            script = (script || "") + "{{SiteMap.lookup(\"" + path + "\")}}";
        element.setAttribute(Composite.ATTRIBUTE_CONDITION, script);
    });

    /**
     *  Established a listener that listens when the page loads.
     *  The method initiates the initial usage of the path.
     */
    window.addEventListener("load", function(event) {
        
        SiteMap.navigate(window.location.hash);
        
        var event = document.createEvent('HTMLEvents');
        event.initEvent("hashchange", false, true);
        window.dispatchEvent(event);
    });
    
    /**
     *  Establishes a listener that listens to changes from the URL hash.
     *  The method corrects invalid and unauthorized paths by forwarding them to
     *  the next valid path, restores the view of functional paths, and
     *  organizes partial rendering.
     */
    window.addEventListener("hashchange", function(event) {
        
        var source = Path.normalize(SiteMap.location);
        var locate = (event.newURL || "").replace(Path.PATTERN_URL, "$1");
        var target = SiteMap.locate(locate);
        
        //Discrepancies in the path cause a forwarding to a valid path.
        if (locate != target) {
            SiteMap.navigate(target);
            return;
        }        
        
        //For functional interaction paths, the old path must be restored.
        //Rendering is not necessary because the page does not change or the
        //called function has partially triggered rendering.
        if (target.match(Path.PATTERN_PATH_FUNCTIONAL)) {
            var x = window.pageXOffset || document.documentElement.scrollLeft;
            var y = window.pageYOffset || document.documentElement.scrollTop;
            window.location.replace(source);
            window.setTimeout(window.scrollTo, 0, x, y); 
            return;
        }
        
        var acceptors = SiteMap.acceptors || [];
        for (var loop = 0; loop < acceptors.length; loop++) {
            var acceptor = acceptors[loop];
            if (!acceptor.pattern.test(path))
                continue;
            var result = acceptor.action.call(null, path);
            if (result === false)
                return;
            if (typeof result !== "string")
                continue;
            path = Path.normalize(result);
            return permit(path);
        }

        SiteMap.location = target;
        
        if (!source.endsWith("#"))
            source += "#";
        if (!target.endsWith("#"))
            target += "#";
        
        //The deepest similarity in both paths is used for rendering.
        //Render as minimal as possible:
        //  old: #a#b#c#d#e#f  new: #a#b#c#d      -> render #d
        //  old: #a#b#c#d      new: #a#b#c#d#e#f  -> render #d
        //  old: #a#b#c#d      new: #e#f          -> render body
        var render = "#";
        if (source.startsWith(target))
            render = target;
        else if (target.startsWith(source))
            render = source;
        render = render.replace(/(^#+)|(#+$)/g, "").trim();
        if (render.length > 0)
            Composite.render("#" + render.match(/[^#]+$/));
        else Composite.render(document.body);
    });
};