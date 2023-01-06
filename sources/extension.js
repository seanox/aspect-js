/**
 * LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 * im Folgenden Seanox Software Solutions oder kurz Seanox genannt.
 * Diese Software unterliegt der Version 2 der Apache License.
 *
 * Seanox aspect-js, Fullstack JavaScript UI Framework
 * Copyright (C) 2022 Seanox Software Solutions
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
 * General extension of the JavaScript API.
 *
 * @author  Seanox Software Solutions
 * @version 1.3.0 20221231
 */
if (typeof Namespace === "undefined") {

    /**
     * Namespace at object level. Comparable to packages in other programming
     * languages, namespaces can be used to map hierarchical structures and to
     * group thematically related components and resources. The implementation
     * happens in JavaScript at object level. This means that it is not a real
     * element of the programming language but is represented by chained static
     * objects. Each level in this object chain represents a namespace.
     * As is typical for object identifiers, namespaces also use letters,
     * numbers, and underscores separated by dots. As a special feature, arrays
     * are also supported. If an object level in the namespace is a pure number,
     * an array is assumed.
     */
    window["Namespace"] = {
            
        /** Pattern for the namespace separator */
        get PATTERN_NAMESPACE_SEPARATOR() {return /\./;},

        /** Pattern for a valid namespace level at the beginning */
        get PATTERN_NAMESPACE_LEVEL_START() {return /^[_a-z\$][\w\$]*$/i;},

        /** Pattern for a valid namespace level */
        get PATTERN_NAMESPACE_LEVEL() {return /(^[\w\$]+$)|(^\d+$)/;}
    };

    /**
     * Creates a namespace to the passed object, strings and numbers, if the
     * namespace contains arrays and the numbers can be used as index. Levels of
     * the namespace levels are separated by a dot. Levels can as fragments also
     * contain dots. Without arguments the global namespace window is returned.
     * The method has the following various signatures:
     *     Namespace.using();
     *     Namespace.using(string);
     *     Namespace.using(string, ...string|number);
     *     Namespace.using(object);
     *     Namespace.using(object, ...string|number);
     * @param  levels of the namespace
     * @return the created or already existing object(-level)
     * @throws An error occurs in case of invalid data types or syntax 
     */
    Namespace.using = function(...levels) {

        if (levels.length <= 0)
            return window;

        Namespace.lookup.filter(...levels);

        let offset = levels.length;
        let namespace = null;
        if (levels.length > 0
                && typeof levels[0] === "object")
            namespace = levels.shift();
        offset -= levels.length;

        levels = levels.join(".");
        levels.split(Namespace.PATTERN_NAMESPACE_SEPARATOR).forEach((level, index, array) => {

            const pattern = index === 0 && namespace === null
                    ? Namespace.PATTERN_NAMESPACE_LEVEL_START : Namespace.PATTERN_NAMESPACE_LEVEL;
            if (!level.match(pattern))
                throw new Error(`Invalid namespace at level ${index +1}${level && level.trim() ? ": " + level.trim() : ""}`);

            // Composites use IDs which causes corresponding DOM objects
            // (Element) in the global namespace if there are no corresponding
            // data objects (models). Because namespaces are based on data
            // objects (models), if an element appears, we assume that a data
            // object does not exist and the recursive search is aborted as
            // unsuccessful.

            if (index === 0
                    && namespace === null) {
                namespace = eval(`typeof ${level} === "undefined" ? undefined : ${level}`);
                if (namespace !== undefined
                        && !(namespace instanceof Element))
                    return;
                namespace = window;
            }

            const item = namespace[level]
            const type = typeof item;
            if (type !== "undefined"
                    && type !== "object")
                throw new TypeError(`Invalid namespace type at level ${index +1 +offset}: ${type}`);
            if (item === undefined
                    || item === null
                    || item instanceof Element)
                if (index < array.length -1
                        && array[index +1].match(/^\d+$/))
                    namespace[level] = [];
                else namespace[level] = {};
            namespace = namespace[level];
        });

        return namespace;
    };

    /**
     * Creates a namespace with an initial value to the passed object, strings
     * and numbers, if the namespace contains arrays and the numbers can be used
     * as index. Levels of the namespace levels are separated by a dot. Levels
     * can as fragments also contain dots. Without arguments, the global
     * namespace window is used.
     * The method has the following various signatures:
     *     Namespace.create(string, value);
     *     Namespace.create(string, ...string|number, value);
     *     Namespace.create(object, value);
     *     Namespace.create(object, ...string|number, value);
     * @param  levels of the namespace
     * @param  value to initialize/set
     * @return the created or already existing object(-level)
     * @throws An error occurs in case of invalid data types or syntax
     */
    Namespace.create = function(...levels) {
        if (levels.length < 2)
            throw new Error("Invalid namespace for creation: Namespace and/or value is missing");
        const value = levels.pop();
        levels = Namespace.lookup.filter(...levels);
        const level = levels.pop();
        const namespace = Namespace.using(...levels);
        if (namespace === null)
            return null;
        namespace[level] = value;
        return namespace[level];
    };

    /**
     * Resolves a namespace and returns the determined object(-level).
     * If the namespace does not exist, undefined is returned.
     * The method has the following various signatures:
     *     Namespace.lookup();
     *     Namespace.lookup(string);
     *     Namespace.lookup(string, ...string|number);
     *     Namespace.lookup(object);
     *     Namespace.lookup(object, ...string|number);
     * @param  levels of the namespace
     * @return the determined object(-level)
     * @throws An error occurs in case of invalid data types or syntax
     */
    Namespace.lookup = function(...levels) {

        if (levels.length <= 0)
            return window;

        Namespace.lookup.filter(...levels);

        let offset = levels.length;
        let namespace = null;
        if (levels.length > 0
                && typeof levels[0] === "object")
            namespace = levels.shift();
        offset -= levels.length;

        levels = levels.join(".");
        levels = levels.split(Namespace.PATTERN_NAMESPACE_SEPARATOR);
        for (let index = 0; index < levels.length; index++) {

            const level = levels[index];

            const pattern = index +offset === 0
                    ? Namespace.PATTERN_NAMESPACE_LEVEL_START : Namespace.PATTERN_NAMESPACE_LEVEL;
            if (!level.match(pattern))
                throw new Error(`Invalid namespace at level ${index +1 +offset}${level && level.trim() ? ": " + level.trim() : ""}`);

            // Composites use IDs which causes corresponding DOM objects
            // (Element) in the global namespace if there are no corresponding
            // data objects (models). Because namespaces are based on data
            // objects, if an element appears, we assume that a data object does
            // not exist and the recursive search is aborted as unsuccessful.

            if (index === 0
                    && namespace === null) {
                namespace = eval(`typeof ${level} === "undefined" ? undefined : ${level}`);
                if (namespace !== undefined)
                    if (namespace instanceof Element)
                        return undefined;
                    else continue;
                namespace = window;
            }

            namespace = namespace[level];
            if (namespace === undefined
                    || namespace === null)
                return namespace;

            if (namespace instanceof Element)
                return undefined;
        }

        return namespace;
    };

    Namespace.lookup.filter = function(...levels) {
        const chain = [];
        levels.forEach((level, index) => {
            if (index === 0
                    && typeof level !== "object"
                    && typeof level !== "string")
                throw new TypeError(`Invalid namespace at level ${index +1}: ${typeof level}`);
            if (index === 0
                    && level === null)
                throw new TypeError(`Invalid namespace at level ${index +1}: null`);
            if (index > 0
                    && typeof level !== "string"
                    && typeof level !== "number")
                throw new TypeError(`Invalid namespace at level ${index +1}: ${typeof level}`);
            level = typeof level === "string"
                ? level.split(Namespace.PATTERN_NAMESPACE_SEPARATOR) : [level];
            chain.push(...level);
        });
        return chain;
    };

    /**
     * Checks whether a namespace exists based on the passed object, strings and
     * numbers, if the namespace contains arrays and the numbers can be used as
     * index. Levels of the namespace chain are separated by a dot. Levels can
     * also be fragments that contain dots. Without arguments the global
     * namespace window is used.
     * The method has the following various signatures:
     *     Namespace.exists();
     *     Namespace.exists(string);
     *     Namespace.exists(string, ...string|number);
     *     Namespace.exists(object);
     *     Namespace.exists(object, ...string|number);
     * @param  levels of the namespace
     * @return true if the namespace exists
     * @throws An error occurs in case of invalid levels or syntax
     */
    Namespace.exists = function(...levels) {
        if (levels.length < 1)
            return false;
        return Object.usable(Namespace.lookup(...levels));
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
        for (let loop = 0; loop < node.length; loop++)
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
        for (let loop = 0; loop < size; loop++) {
            const random = Math.floor(Math.random() * Math.floor(26));
            if ((Math.floor(Math.random() *Math.floor(26))) % 2 === 0)
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
        let serial;
        serial = (new Date().getTime() -946684800000).toString(36);
        serial = (serial.length.toString(36) + serial).toUpperCase();
        serial = Math.uniqueId() + serial;
        if (serial.length > size)
            serial = serial.substring(serial.length -size);
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
        if (!Object.usable(text))
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
 * Adds an uncapitalize function to the String objects.
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
        let result = "";
        for (let loop = 0; loop < this.length; loop++) {
            let digit = Number(this.charCodeAt(loop)).toString(16).toUpperCase();
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
            result += String.fromCharCode(parseInt(text.substring(loop, 2), 16));
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
            throw new Error("Malformed character sequence");
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
            throw new Error("Malformed character sequence");
        }
    };
}

/**
 * Enhancement of the JavaScript API
 * Adds an HTML encode function to the String objects.
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
        if (this.hash === undefined)
            this.hash = 0;
        if (this.hash !== 0)
            return this.hash;
        let hops = 0;
        for (let loop = 0; loop < this.length; loop++) {
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
 * Adds a decoding of slash sequences (control characters).
 */ 
if (String.prototype.unescape === undefined) {
    String.prototype.unescape = function() {
        let text = this;
        text = text.replace(/\r/g, "\\r");
        text = text.replace(/\n/g, "\\n");
        text = text.replace(/^(["'])/, "\$1");
        text = text.replace(/([^\\])((?:\\{2})*)(?=["'])/g, "$1$2\\");
        return eval(`"${text}"`);
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

/**
 * Enhancement of the JavaScript API
 * Adds a method to combine paths to a new one.
 * The result will always start with a slash but ends without it.
 */
if (window.location.combine === undefined) {
    window.location.combine = function(...paths) {
        return "/" + paths.join("/")
            .replace(/[\/\\]+/g, "/")
            .replace(/(^\/+)|(\/+$)/g, "");
    };
}