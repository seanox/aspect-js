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
    
    //??? xxx optional, dann auch true wenn übergeorder path zutriff
    Path.locate = function(path, xxx) {
        
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
        
        path = meta.path;
        if (Path.lock
                && Path.lock.length > 0
                && Path.lock.shift() == path)
            return;
        Path.lock = new Array();
        
        if (meta.type == 3) {
            window.location.hash = path;
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
            if (Path.collection[0].startsWith(path + "#")
                    || path == Path.collection[0]
                    || path == "#")
                return;
            Path.collection.unshift(path);
            window.location.hash = path;
            Composite.render("body");
        });
    });
};