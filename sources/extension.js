/**
 * LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 * im Folgenden Seanox Software Solutions oder kurz Seanox genannt. Diese
 * Software unterliegt der Version 2 der GNU General Public License.
 *
 * Seanox aspect-js, Fullstack JavaScript UI Framework
 * Copyright (C) 2021 Seanox Software Solutions
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of version 2 of the GNU General Public License as published
 * by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * 
 * 
 *     DESCRIPTION
 *     ----
 * General extension of the JavaScript API.
 * 
 * Extension 1.2.0 20210623
 * Copyright (C) 2021 Seanox Software Solutions
 * Alle Rechte vorbehalten.
 *
 * @author  Seanox Software Solutions
 * @version 1.2.0 20210623
 */
if (typeof Namespace === "undefined") {

    /**
     * Namespace at object level.
     * Comparable to packages in other programming languages, namespaces can be
     * used to map hierarchical structures and to group thematically related
     * components and resources.
     * The implementation happens in JavaScript at object level.
     * This means that it is not a real element of the programming language,
     * but is represented by chained static objects.
     * Each level in this object chain represents a namespace.
     * As is typical for object identifiers, namespaces also use letters,
     * numbers, and underscores separated by dots.
     * As a special feature, arrays are also supported. If an object level in
     * the namespace is a pure number, an array is assumed.
     */
    window["Namespace"] = {
            
        /** Pattern for the namespace separator */
        get PATTERN_NAMESPACE_SEPARATOR() {return /\./;},
        
        /** Pattern for a valid namespace. */
        get PATTERN_NAMESPACE() {return /^\w+(\.\w+)*$/i;}
    };
    
    /** 
     * Validates a requested namespace and creates a corresponding meta object.
     * The method has the following various signatures:
     *     Namespace.locate();
     *     Namespace.locate(namespace);
     *     Namespace.locate(object, namespace);
     * @return the created meta object
     * @throws An error occurs in case of invalid data types or syntax 
     */
    Namespace.locate = function(variants) {
        
        let scope;
        let namespace;
        
        if (arguments.length == 0)
            return {scope:window};
        
        if (arguments.length > 1) {
            scope = arguments[0];
            namespace = arguments[1];
        } else if (arguments.length > 0) {
            scope = window;
            namespace = arguments[0];
        } else throw new TypeError("Invalid namespace");
        
        if (typeof scope !== "object")
            throw new TypeError("Invalid scope: " + typeof scope);        
        if (typeof namespace !== "string")
            throw new TypeError("Invalid namespace: " + typeof namespace);

        if (!namespace.match(Namespace.PATTERN_NAMESPACE)
                || (scope == window && namespace.match(/^\d/)))
            throw new Error("Invalid namespace" + (namespace.trim() ? ": " + namespace : ""));
        
        return {scope, namespace};
    };    
    
    /**
     * Creates a namespace to pass string.
     * Without arguments, the method returns the global namespace window.
     * The method has the following various signatures:
     *     Namespace.using();
     *     Namespace.using(namespace);
     *     Namespace.using(object, namespace);
     * @param  object
     * @param  namespace
     * @return the created or already existing object(-level)
     * @throws An error occurs in case of invalid data types or syntax 
     */
    Namespace.using = function(...variants) {
        
        if (arguments.length == 0)
            return window;
        
        const meta = Namespace.locate(...variants);
        if (typeof meta.namespace === "undefined")
            return meta.scope;         
        meta.namespace.split(Namespace.PATTERN_NAMESPACE_SEPARATOR).forEach((entry, index, array) => {
            if (typeof meta.scope[entry] === "undefined") {
                if (index < array.length -1
                        && array[index +1].match(/^\d+$/))
                    meta.scope[entry] = [];
                else meta.scope[entry] = {};
            } else if (meta.scope[entry] instanceof Object
                    || meta.scope[entry] === null) {
            } else throw new Error("Invalid namespace: " + array.slice(0, index +1).join("."));
            meta.scope = meta.scope[entry];
        });
        return meta.scope; 
    };

    /**
     * Creates a namespace to pass string with a initial value.
     * The method has the following various signatures:
     *     Namespace.create(namespace);
     *     Namespace.create(namespace, value);
     *     Namespace.create(object, namespace, value);
     * @param  object
     * @param  namespace
     * @param  value
     * @return the created or already existing object(-level)
     * @throws An error occurs in case of invalid data types or syntax
     */
    Namespace.create = function(...variants) {
        if (variants.length < 1)
            throw new Error("Invalid namespace for creation: Namespace is missing");
        if (variants.length < 2)
            return Namespace.using(...variants);
        const value = variants.pop();
        const parent = variants.pop();
        const space = Namespace.using(...variants);
        space[parent] = value;
        return space[parent];
    };

    /** 
     * Resolves a namespace and returns the determined object(-level).
     * If the namespace does not exist, null is returned.
     * Without arguments, the method returns the global namespace window.
     * The method has the following various signatures:
     *     Namespace.lookup();
     *     Namespace.lookup(namespace);
     *     Namespace.lookup(object, namespace);
     * @param  object
     * @param  namespace
     * @return the determined object(-level)
     * @throws An error occurs in case of invalid data types or syntax
     */
    Namespace.lookup = function(...variants) {
        
        if (arguments.length == 0)
            return window;        
        
        const meta = Namespace.locate(...arguments);
        if (typeof meta.namespace === "undefined")
            return meta.scope;         
        meta.namespace = meta.namespace.split(Namespace.PATTERN_NAMESPACE_SEPARATOR);
        if (!meta.namespace
                || meta.namespace.length <= 0)
            return null;
        for (let index = 0; meta.scope && index < meta.namespace.length; index++) {
            if (meta.namespace[index] in meta.scope
                    && (meta.scope[meta.namespace[index]] instanceof Object
                            || meta.scope[meta.namespace[index]] === null))
                meta.scope = meta.scope[meta.namespace[index]];
            else return null;
        }
        return meta.scope;
    };
    
    /**
     * Checks whether a namespace exists.
     * The method has the following various signatures:
     *     Namespace.exists();
     *     Namespace.exists(namespace);
     *     Namespace.exists(object, namespace);     * 
     * @param  object
     * @param  namespace
     * @return true if the namespace exists
     * @throws An error occurs in case of invalid data types or syntax
     */
    Namespace.exists = function(...variants) {
        return Namespace.lookup(...variants) != null;     
    };
}

/**
 * Enhancement of the JavaScript API
 * Modifies the method to support node and nodes as NodeList and Array.
 * If the option exclusive is used, existing children will be removed first.
 * @param node      node(s)
 * @param exclusive existing children will be removed first
 */
Element.prototype.appendChild$origin = Element.prototype.appendChild;
Element.prototype.appendChild = function(node, exclusive) {
    if (exclusive)
        this.innerHTML = "";
    if (node instanceof Node) {
        this.appendChild$origin(node);
    } else if (Array.isArray(node)
            || node instanceof NodeList
            || (Symbol && Symbol.iterator
                    && node && typeof node[Symbol.iterator])) {
        node = Array.from(node);
        for (var loop = 0; loop < node.length; loop++)
            this.appendChild$origin(node[loop]);
    } else this.appendChild$origin(node);
};

/**
 * Enhancement of the JavaScript API
 * Adds a static function to create an alphanumeric serial (U)UID with fixed size.
 * The quality of the ID is dependent of the length.
 * @param size optional, default is 16
 */
if (Math.uniqueId === undefined) {
    Math.uniqueId = function(size) {
        size = size || 16;
        if (size < 0)
            size = 16;
        let unique = "";
        for (var loop = 0; loop < size; loop++) {
            const random = Math.floor(Math.random() * Math.floor(26));
            if ((Math.floor(Math.random() * Math.floor(26))) % 2 == 0)
                unique += String(random % 10);
            else unique += String.fromCharCode(65 +random); 
        }
        return unique;
    };
}

/**
 * Enhancement of the JavaScript API
 * Adds a static function to create an alphanumeric serial (U)UID with fixed size.
 * Compared to Math.uniqueId(), the (U)UID contains a serial reference to time.
 * The quality of the ID is dependent of the length.
 * @param size optional, default is 16
 */
if (Math.uniqueSerialId === undefined) {
    Math.uniqueSerialId = function(size) {
        size = size || 16;
        if (size < 0)
            size = 16;
        let serial = "";
        serial = (new Date().getTime() -946684800000).toString(36);
        serial = (serial.length.toString(36) + serial).toUpperCase();
        serial = Math.uniqueId() + serial;
        if (serial.length > size)
            serial = serial.substr(serial.length -size);
        return serial;
    };
}

/**
 * Enhancement of the JavaScript API
 * Creates a literal pattern for the specified text.
 * Metacharacters or escape sequences in the text thus lose their meaning.
 * @param  text text to be literalized
 * @return a literal pattern for the specified text 
 */
if (RegExp.quote === undefined) {
    RegExp.quote = function(text) {
        if (text == undefined
                || text == null)
            return null;
        return String(text).replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
    };
}

/**
 * Enhancement of the JavaScript API
 * Adds a capitalize function to the String objects.
 */ 
if (String.prototype.capitalize === undefined) {
    String.prototype.capitalize = function() {
        if (this.length <= 0)
            return this;
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
}

/**
 * Enhancement of the JavaScript API
 * Adds a uncapitalize function to the String objects.
 */
if (String.prototype.uncapitalize === undefined) {
    String.prototype.uncapitalize = function() {
        if (this.length <= 0)
            return this;
        return this.charAt(0).toLowerCase() + this.slice(1);
    };
}

/**
 * Enhancement of the JavaScript API
 * Adds a function for encoding the string objects in hexadecimal code.
 */      
if (String.prototype.encodeHex === undefined) {
    String.prototype.encodeHex = function() {
        let text = this;
        let result = "";
        for (let loop = 0; loop < text.length; loop++) {
            let digit = Number(text.charCodeAt(loop)).toString(16).toUpperCase();
            while (digit.length < 2)
                digit = "0" + digit;            
            result += digit;
        }
        return "0x" + result;
    };
}

/**
 * Enhancement of the JavaScript API
 * Adds a function for decoding hexadecimal code to the string objects.
 */     
if (String.prototype.decodeHex === undefined) {
    String.prototype.decodeHex = function() {
        let text = this;
        if (text.match(/^0x/))
            text = text.substring(2);
        let result = "";
        for (let loop = 0; loop < text.length; loop += 2)
            result += String.fromCharCode(parseInt(text.substr(loop, 2), 16));
        return result;
    };
}

/**
 * Enhancement of the JavaScript API
 * Adds a method for encoding Base64.
 */ 
if (String.prototype.encodeBase64 === undefined) {
    String.prototype.encodeBase64 = function() {
        try {
            return btoa(encodeURIComponent(this).replace(/%([0-9A-F]{2})/g, (match, code) => {
                return String.fromCharCode("0x" + code);
            }));
        } catch (exception) {
            throw new Error("malformed character sequence");
        }
    };
}

/**
 * Enhancement of the JavaScript API
 * Adds a method for decoding Base64.
 */ 
if (String.prototype.decodeBase64 === undefined) {
    String.prototype.decodeBase64 = function() {
        try {
            return decodeURIComponent(atob(this).split("").map((code) => {
                return "%" + ("00" + code.charCodeAt(0).toString(16)).slice(-2);
            }).join(""));
        } catch (exception) {
            throw new Error("malformed character sequence");
        }
    };
}

/**
 * Enhancement of the JavaScript API
 * Adds a HTML encode function to the String objects.
 */ 
if (String.prototype.encodeHtml === undefined) {
    String.prototype.encodeHtml = function() {
        const element = document.createElement("div");
        element.textContent = this;
        return element.innerHTML;
    };
}

/**
 * Enhancement of the JavaScript API
 * Adds a method for calculating a hash value.
 */ 
if (String.prototype.hashCode === undefined) {
    String.prototype.hashCode = function() {
        if (this.hash == undefined)
            this.hash = 0;
        if (this.hash != 0)
            return this.hash;
        for (var loop = 0, hops = 0; loop < this.length; loop++) {
            const temp = 31 *this.hash +this.charCodeAt(loop);
            if (!Number.isSafeInteger(temp)) {
                hops++;
                this.hash = Number.MAX_SAFE_INTEGER -this.hash +this.charCodeAt(loop);
            } else this.hash = temp;
        }
        this.hash = Math.abs(this.hash);
        this.hash = this.hash.toString(36);
        this.hash = this.hash.length.toString(36) + this.hash; 
        this.hash = this.hash + hops.toString(36);
        this.hash = this.hash.toUpperCase();
        return this.hash;
    };
}

/**
 * Enhancement of the JavaScript API
 * Adds a decode of slash sequences (control characters).
 */ 
if (String.prototype.unescape === undefined) {
    String.prototype.unescape = function() {
        let text = this;
        text = text.replace(/\r/g, "\\r");
        text = text.replace(/\n/g, "\\n");
        text = text.replace(/^(["'])/, "\$1");
        text = text.replace(/([^\\])((?:\\{2})*)(?=["'])/g, "$1$2\\");
        return eval("\"" + text + "\"");
    };
}

/**
 * Enhancement of the JavaScript API
 * Adds a property to get the UID for the window instance.
 */  
if (window.serial === undefined) {
    Object.defineProperty(window, "serial", {
        value: Math.uniqueSerialId()
    });
}

/**
 * Enhancement of the JavaScript API
 * Adds a property to get the context path.
 * The context path is a part of the request URI and can be compared with the
 * current working directory.
 */  
if (window.location.pathcontext === undefined) {
    Object.defineProperty(window.location, "pathcontext", {
        value: window.location.pathname.replace(/\/([^\/]*\.[^\/]*){0,}$/g, "") || "/"
    });
}