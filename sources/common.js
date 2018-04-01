//TODO:
if (typeof(Namespace) === "undefined") {

    //TODO:
    Namespace = {};
    
    //TODO:
    Namespace.PATTERN_NAMESPACE_SEPARATOR = /[\\\/\.]/;
    
    //TODO:
    Namespace.PATTERN_NAMESPACE = /^(?:[\\\/]*[a-z][\w]*)(?:[\\\/\.][a-z][\w]*)*$/i;
    
    //TODO:
    Namespace.PATTERN_NAMESPACE_SEPARATOR_CONFLICT = /(\..*[\\\/])|(\\.*[\.\/])|(\/.*[\\\.])/;    
    
    //TODO:
    Namespace.using = function(name) {
        
        if (name == null)
            return null;

        if (typeof(name) !== "string")
            throw new TypeError("Invalid parameter type: " + typeof(name));
        if (!name.match(Namespace.PATTERN_NAMESPACE)
                || name.match(Namespace.PATTERN_NAMESPACE_SEPARATOR_CONFLICT))
            throw new Error("Invalid namespace" + (name.trim() ? ": " + name : ""));
        
        var scope = window;
        name = name.replace(/^[\\\/]/, '');
        name.split(Namespace.PATTERN_NAMESPACE_SEPARATOR).forEach(function(entry, index, array) {
            if (typeof(scope[entry]) === "undefined") {
                scope[entry] = new Object();
            } else if (typeof(scope[entry]) === "object") {
            } else if (typeof(scope[entry]) === "function") {
            } else throw new Error("Invalid namespace: " + array.slice(0, index +1).join("."));
            scope = scope[entry];
        });
        
        return scope; 
    };
}