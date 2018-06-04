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
 *  
 *  MVC 1.0 20180604
 *  Copyright (C) 2018 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20180604
 */
if (typeof(Page) === "undefined") {
    
    Page = {};
};    

if (typeof(Face) === "undefined") {
    
    Face = {};
    
    //TODO:
};

if (typeof(Facet) === "undefined") {
    
    Facet = {};
    
    //TODO:
};

if (typeof(Path) === "undefined") {
    
    Path = {};
    
    Path.map = {};
    
    Path.filter = {};
    
    /** Pattern for a valid path. */
    Path.PATTERN_PATH = /^(#*(\w*)#*(#+\w+#*)*)*$/;
    
    Path.customize = function(scope, acceptor) {
        
        if (scope == null)
            throw new TypeError("Invalid scope: " + scope);
        
        if (scope instanceof String)
            scope = new RegExp("^" + RegExp.quote(scope) + "$");
        if (scope instanceof RegExp) {
            if (typeif(invoke) !== "function")
                throw new TypeError("Invalid acceptor: " + acceptor);
            Path.filter[scope] = acceptor;
            return;
        }
        
        if (typeif(invoke) !== "function")
            throw new TypeError("Invalid acceptor: " + acceptor);
        if (scope == Path.locate)
            Path.locate = acceptor; 
        else if (scope == Path.navigate)
            Path.navigate = acceptor;
        else if (scope == Path.authorize)
            Path.authorize = acceptor;
        else throw new TypeError("Invalid scope: " + scope);
    };
    
    /**
     *  Returns the current path as an array of path segments or checks whether
     *  a path or sub-path is currently in use. Function and return value depend
     *  on the passed argument.
     *      1. Without argument, null or space(s) as path, the return value is
     *  the current path as an array of path segments.
     *      2. With a path the return value is a boolean value whether the path
     *  matches exactly.
     *      3. With a path that has dots at the end, the return value is a
     *  boolean value whether the current path starts with the passed path.
     *  @param  path optional, path to check
     *  @return the current path as an array of path segments or boolean value
     *      whether the path matches exactly or whether the current path starts
     *      with the passed path
     */  
    Path.locate = function(path) {
        
        var locate = (window.location.hash || "").trim();
        if (!locate.startsWith("#"))
            locate = "#" + locate;
        
        path = (path || "").trim();
        if (path == "") {
            locate = locate.replace(/(^#+)|(#+$)/g, "");
            if (!locate)
                return [];
            if (!locate.includes("#"))
                return [locate];
            return locate.split("#");
        }
        
        if (!path.endsWith(".")
                && locate == path)
            return true;
        path = path.replace(/\.+$/, "");
        if (locate.startsWith(path + "#") 
                || locate == path)
            return true;
        
        return false;
    };

    Path.navigate = function(path) {
        
        var meta = Path.normalize(path, true);
        window.location.hash = meta.path; 
    };

    Path.permit = function(path) {
        return true;
    };
    
    Path.normalize = function(path) {
        
        if (path == null)
            return null;
        if (typeof(path) !== "string"
                || !path.match(Path.PATTERN_PATH))
            throw new TypeError("Invalid path" + (String(path).trim() ? ": " + path : ""));
        path = path.trim();
        
        //The type of path is determined.
        //There are these types:
        //  - absolute paths (#)
        //  - relative paths (##)
        //    is an extension of the current path.
        //  - interaction paths (###)
        //    is only temporary and is replaced by the previous path        
        var type = Math.max(1, String(path.match(/^(?!#)|(?:#{0,3})/)).length);
        path = path.replace(/(^#+)|(#+$)/g, "").trim();
        path = path.replace(/\s*#+\s*/g, "#");
        
        //Internally, a second argument can be passed with the value true.
        //Then the return value is an object with type and a canonical path.
        if (arguments.length > 1
                && arguments[1] == true) {
            var here = Path.collection[0] || "#";
            if (type == 2)
                path = (here + (path ? "#" + path : "")).replace(/^#{2,}/, "#");
            else if (type == 3)
                path = here;
            else path = "#" + path;
            return {type:type, path:path};
        }
        
        while (--type >= 0)
            path = "#" + path;
        return path; 
    };

    Path.lock;
    
    Path.collection = [Path.normalize(Path.locate().join("#"))];
    
    window.addEventListener("hashchange", function(event) {
        
        Path.lock = Path.lock || new Array();

        var path = window.location.hash;
        var meta = Path.normalize(window.location.hash, true);
        var here = Path.collection[0];
        
        path = meta.path;
        if (Path.lock
                && Path.lock.length > 0
                && Path.lock.shift() == path
                && meta.type != 3)
            return;
        Path.lock = new Array();
        
        //For functional interaction paths, the old path must be restored.
        //Rendering is not necessary because the page does not change or the
        //called function has partially triggered rendering.
        if (meta.type == 3) {
            
            Path.lock.unshift(path);
            window.history.back();
            return;
        }
        
        //During a backward step, only the target path is set and rendered,
        //since the current path indicates that previous path segments have
        //already been called and rendered.
        if ((here.startsWith(path + "#")
                || (path == "#" && here != path))) {
            Path.lock.unshift(path);
            Path.collection.unshift(path);
            window.location.hash = path;
            Composite.render(document.body);
            return;
        }

        //For a path, all path segments are called separately and rendered
        //from the root to the target. Excludes the path segments from the root
        //that have already been rendered. Only unaccessed path segments are
        //used. This should ensure that the page can render all necessary faces
        //and facets even if a path is called directly.
        var paths = path.split("#");
        if (path == "#")
            paths = new Array("");
        paths.forEach(function(path, index, array) {
            path = path ? array.slice(0, index +1).join("#") : "#";
            if (here.startsWith(path + "#")
                    || path == here
                    || path == "#")
                return;
            Path.lock.unshift(path);
            window.location.hash = path;
            Composite.render(document.body);
        });
        Path.collection.unshift(path);
    });
};

// - SiteMap verwaltet Pfade mit Views (Path / Face + Views / Facets)
// - SiteMap dient dazu zu Pfade auf Gueltigkeit zu pruefen
// - SiteMap dient dazu zu Faces und Facets auf Sichtbarkeit zu pruefen
//   Faces sind sichtbar wenn der Pfad ab Root enthalten ist, weitere Pfad-Segmente von Views kann der Pfad enthalten
//   Facets sind sichtbar, wenn der Pfad vom Face ab Root enthalten ist, weitere Pfad-Segmente von Views kann der Pfad enthalten
// - SiteMap basiert/verwendet/ergaenzt 'Path'
if (typeof(SiteMap) === "undefined") {
    
    SiteMap = {};
    
    SiteMap.paths;
    
    /** Pattern for a strict valid path. */
    SiteMap.PATTERN_PATH = /^#(\w*)(#\w+)*$/;
    
    /** Pattern for strict valid path views. */
    SiteMap.PATTERN_PATH_VIEWS = /^([\w\s]|(\w(#\w)+))*$/;
    
    SiteMap.customize = function(paths) {
        
        if (typeof(paths) !== "object")
            throw new TypeError("Invalid paths: " + typeof(paths));        

        var sitemap = {};
        for (path in paths) {
            if (typeof(path) !== "string")
                throw new TypeError("Invalid path: " + path);
            var views = paths[path];
            if ((typeof(views) !== "string"
                        || !views.match(SiteMap.PATTERN_PATH_VIEWS))
                    && views != null)
                throw new TypeError("Invalid path: " + path);
            sitemap[path] = (views || "").trim().split(/\s+/);
        } 
        SiteMap.paths = sitemap;
    };

    SiteMap.validate = function(path) {
    };

    SiteMap.visible = function(path) {
    };
};