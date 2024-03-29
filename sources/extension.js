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
 * General extension of the JavaScript API.
 *
 * @author  Seanox Software Solutions
 * @version 1.7.0 20230423
 */

// Compliant takes over the task that the existing JavaScript API can be
// manipulated in a controlled way. Controlled means that errors occur when
// trying to overwrite existing objects and functions. Originally, the mechanism
// was removed after loading the page, but the feature has proven to be
// convenient for other modules and therefore remains.
//
// In the code, the method is used in an unconventional form.
//
//     compliant("Composite");
//     compliant(null, window.Composite = {...});
//     compliant("Object.prototype.ordinal");
//     compliant(null, Object.prototype.ordinal = function() {...}
//
// This is only for the IDE so that syntax completion has a chance there. This
// syntax will be simplified and corrected in the build process for the
// releases.

if (window.compliant !== undefined)
    throw new Error("JavaScript incompatibility detected for: compliant");
window.compliant = (context, payload) => {
    if (context === null
            || context === undefined)
        return payload;
    if (new Function(`return typeof ${context}`)() !== "undefined")
        throw new Error("JavaScript incompatibility detected for: " + context);
    return eval(`${context} = payload`);
};

/**
 * Comparable to packages in other programming languages, namespaces can be used
 * for hierarchical structuring of components, resources and business logic.
 * Although packages are not a feature of JavaScript, they can be mapped at the
 * object level by concatenating objects into an object tree. Here, each level
 * of the object tree forms a namespace, which can also be considered a domain.
 *
 * As is typical for the identifiers of objects, namespaces also use letters,
 * numbers and underscores separated by a dot. As a special feature, arrays are
 * also supported. If a layer in the namespace uses an integer, this layer is
 * used as an array.
 */
(() => {

    compliant("Namespace");
    compliant(null, window.Namespace = {

        /** Pattern for the namespace separator */
        get PATTERN_NAMESPACE_SEPARATOR() {return /\./;},

        /** Pattern for a valid namespace level at the beginning */
        get PATTERN_NAMESPACE_LEVEL_START() {return /^[_a-z\$][\w\$]*$/i;},

        /** Pattern for a valid namespace level */
        get PATTERN_NAMESPACE_LEVEL() {return /^[\w\$]+$/;},

        /**
         * Creates a namespace to the passed object, strings and numbers, if the
         * namespace contains arrays and the numbers can be used as index.
         * Levels of the namespace levels are separated by a dot. Levels can as
         * fragments also contain dots. Without arguments the global namespace
         * window is returned.
         *
         * The method has the following various signatures:
         *     Namespace.use();
         *     Namespace.use(string);
         *     Namespace.use(string, ...string|number);
         *     Namespace.use(object);
         *     Namespace.use(object, ...string|number);
         *
         * @param  levels of the namespace
         * @return the created or already existing object(-level)
         * @throws An error occurs in case of invalid data types or syntax 
         */
        use(...levels) {

            if (levels.length <= 0)
                return window;

            _filter(...levels);

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
                // (Element) in the global namespace if there are no
                // corresponding data objects (models). Because namespaces are
                // based on data objects, if an element appears, we assume that
                // a data object does not exist and the recursive search is
                // aborted as unsuccessful.

                if (index === 0
                        && namespace === null) {
                    namespace = _populate(namespace, level);
                    if (namespace !== undefined
                            && !(namespace instanceof Element))
                        return;
                    namespace = window;
                }

                const item = _populate(namespace, level);
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
                namespace = _populate(namespace, level);
            });

            return namespace;
        },
            
        /**
         * Creates a namespace with an initial value to the passed object,
         * strings and numbers, if the namespace contains arrays and the numbers
         * can be used as index. Levels of the namespace levels are separated by
         * a dot. Levels can as fragments also contain dots. Without arguments,
         * the global namespace window is used.
         *
         * The method has the following various signatures:
         *     Namespace.create(string, value);
         *     Namespace.create(string, ...string|number, value);
         *     Namespace.create(object, value);
         *     Namespace.create(object, ...string|number, value);
         *
         * @param  levels of the namespace
         * @param  value to initialize/set
         * @return the created or already existing object(-level)
         * @throws An error occurs in case of invalid data types or syntax
         */
        create(...levels) {
            if (levels.length < 2)
                throw new Error("Invalid namespace for creation: Namespace and/or value is missing");
            const value = levels.pop();
            levels = _filter(...levels);
            const level = levels.pop();
            const namespace = Namespace.use(...levels);
            if (namespace === null)
                return null;
            namespace[level] = value;
            return _populate(namespace, level);
        },
            
        /**
         * Resolves a namespace and returns the determined object(-level).
         * If the namespace does not exist, undefined is returned.
         *
         * The method has the following various signatures:
         *     Namespace.lookup();
         *     Namespace.lookup(string);
         *     Namespace.lookup(string, ...string|number);
         *     Namespace.lookup(object);
         *     Namespace.lookup(object, ...string|number);
         *
         * @param  levels of the namespace
         * @return the determined object(-level)
         * @throws An error occurs in case of invalid data types or syntax
         */
        lookup(...levels) {

            if (levels.length <= 0)
                return window;

            _filter(...levels);

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
                // (Element) in the global namespace if there are no
                // corresponding data objects (models). Because namespaces are
                // based on data objects, if an element appears, we assume that
                // a data object does not exist and the recursive search is
                // aborted as unsuccessful.

                if (index === 0
                        && namespace === null) {
                    namespace = _populate(namespace, level);
                    if (namespace !== undefined)
                        continue;
                    namespace = window;
                }

                namespace = _populate(namespace, level);
                if (namespace === undefined
                        || namespace === null)
                    return namespace;

                if (namespace instanceof Element)
                    return undefined;
            }

            return namespace;
        },
        
        /**
         * Checks whether a namespace exists based on the passed object, strings
         * and numbers, if the namespace contains arrays and the numbers can be
         * used as index. Levels of the namespace chain are separated by a dot.
         * Levels can also be fragments that contain dots. Without arguments the
         * global namespace window is used.
         *
         * The method has the following various signatures:
         *     Namespace.exists();
         *     Namespace.exists(string);
         *     Namespace.exists(string, ...string|number);
         *     Namespace.exists(object);
         *     Namespace.exists(object, ...string|number);
         *
         * @param  levels of the namespace
         * @return true if the namespace exists
         * @throws An error occurs in case of invalid levels or syntax
         */
        exists(...levels) {
            if (levels.length < 1)
                return false;
            return Object.usable(Namespace.lookup(...levels));
        }
    });

    const _filter = (...levels) => {
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

    const _populate = (namespace, level) => {
        if (namespace && namespace !== window)
            return namespace[level];
        try {return eval(`typeof ${level} !== "undefined" ? ${level} : undefined`);
        } catch (error) {
            if (error instanceof ReferenceError
                    && namespace === window)
                return window[level];
            throw error;
        }
    }
})();

/**
 * Enhancement of the JavaScript API
 * Modifies the method to support node and nodes as NodeList and Array.
 * If the option exclusive is used, existing children will be removed first.
 * @param node      node(s)
 * @param exclusive existing children will be removed first
 */
(() => {
    const _appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function(node, exclusive) {
        if (exclusive)
            this.innerHTML = "";
        if (node instanceof Node)
            return _appendChild.call(this, node);
        if (Array.isArray(node)
                || node instanceof NodeList
                || (Symbol && Symbol.iterator
                        && node && typeof node[Symbol.iterator])) {
            node = Array.from(node);
            for (let loop = 0; loop < node.length; loop++)
                _appendChild.call(this, node[loop]);
            return node;
        }
        return _appendChild.call(this, node);
   };
})();

/**
 * Enhancement of the JavaScript API
 * Adds a static function to create an alphanumeric unique (U)UID with fixed size.
 * The quality of the ID is dependent of the length.
 * @param size optional, default is 16
 */
compliant("Math.unique");
compliant(null, Math.unique = (size) => {
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
});

/**
 * Enhancement of the JavaScript API
 * Adds a static function to create a time based alphanumeric serial that is
 * chronologically sortable as text and contains the time and a counter if
 * serial are created at the same time.
 */
(() => {
    compliant("Math.serial");
    compliant(null, Math.serial = () =>
        _serial.toString());
    const _offset = -946684800000;
    const _serial = {timing:new Date().getTime() + _offset, number:0,
        toString() {
            const timing = new Date().getTime() + _offset;
            this.number = this.timing === timing ? this.number +1 : 0;
            this.timing = timing;
            const serial = this.timing.toString(36);
            const number = this.number.toString(36);
            return (serial.length.toString(36) + serial
                + number.length.toString(36) + number).toUpperCase();
        }};
})();

/**
 * Enhancement of the JavaScript API
 * Creates a literal pattern for the specified text.
 * Metacharacters or escape sequences in the text thus lose their meaning.
 * @param  text text to be literalized
 * @return a literal pattern for the specified text 
 */
compliant("RegExp.quote");
compliant(null, RegExp.quote = (text) => {
    if (!Object.usable(text))
        return null;
    return String(text).replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
});

/**
 * Enhancement of the JavaScript API
 * Adds a capitalize function to the String objects.
 */
compliant("String.prototype.capitalize");
compliant(null, String.prototype.capitalize = function() {
    if (this.length <= 0)
        return this;
    return this.charAt(0).toUpperCase() + this.slice(1);
});

/**
 * Enhancement of the JavaScript API
 * Adds an uncapitalize function to the String objects.
 */
compliant("String.prototype.uncapitalize");
compliant(null, String.prototype.uncapitalize = function() {
    if (this.length <= 0)
        return this;
    return this.charAt(0).toLowerCase() + this.slice(1);
});

/**
 * Enhancement of the JavaScript API
 * Adds a function for encoding the string objects in hexadecimal code.
 */
compliant("String.prototype.encodeHex");
compliant(null, String.prototype.encodeHex = function() {
    let result = "";
    for (let loop = 0; loop < this.length; loop++) {
        let digit = Number(this.charCodeAt(loop)).toString(16).toUpperCase();
        while (digit.length < 2)
            digit = "0" + digit;
        result += digit;
    }
    return "0x" + result;
});

/**
 * Enhancement of the JavaScript API
 * Adds a function for decoding hexadecimal code to the string objects.
 */
compliant("String.prototype.decodeHex");
compliant(null, String.prototype.decodeHex = function() {
    let text = this;
    if (text.match(/^0x/))
        text = text.substring(2);
    let result = "";
    for (let loop = 0; loop < text.length; loop += 2)
        result += String.fromCharCode(parseInt(text.substring(loop, 2), 16));
    return result;
});

/**
 * Enhancement of the JavaScript API
 * Adds a method for encoding Base64.
 */
compliant("String.prototype.encodeBase64");
compliant(null, String.prototype.encodeBase64 = function() {
    try {
        return btoa(encodeURIComponent(this).replace(/%([0-9A-F]{2})/g,
            (match, code) =>
                String.fromCharCode("0x" + code)));
    } catch (error) {
        throw new Error("Malformed character sequence");
    }
});

/**
 * Enhancement of the JavaScript API
 * Adds a method for decoding Base64.
 */
compliant("String.prototype.decodeBase64");
compliant(null, String.prototype.decodeBase64 = function() {
    try {
        return decodeURIComponent(atob(this).split("").map((code) =>
            "%" + ("00" + code.charCodeAt(0).toString(16)).slice(-2)).join(""));
    } catch (error) {
        throw new Error("Malformed character sequence");
    }
});

/**
 * Enhancement of the JavaScript API
 * Adds an HTML encode function to the String objects.
 */
compliant("String.prototype.encodeHtml");
compliant(null, String.prototype.encodeHtml = function() {
    const element = document.createElement("div");
    element.textContent = this;
    return element.innerHTML;
});

/**
 * Enhancement of the JavaScript API
 * Adds a method for calculating a hash value.
 */
compliant("String.prototype.hashCode");
compliant(null, String.prototype.hashCode = function() {
    if (this.hash !== undefined
            && this.hash !== 0)
        return this.hash;
    this.hash = 0;
    let hops = 0;
    for (let loop = 0; loop < this.length; loop++) {
        const temp = 31 *this.hash +this.charCodeAt(loop);
        if (!Number.isSafeInteger(temp)) {
            hops++;
            this.hash = Number.MAX_SAFE_INTEGER -this.hash +this.charCodeAt(loop);
        } else this.hash = temp;
    }
    this.hash = Math.abs(this.hash).toString(36);
    this.hash = this.hash.length.toString(36) + this.hash;
    this.hash = (this.hash + hops.toString(36)).toUpperCase();
    return this.hash;
});

/**
 * Enhancement of the JavaScript API
 * Adds a decoding of slash sequences (control characters).
 */
compliant("String.prototype.unescape");
compliant(null, String.prototype.unescape = function() {
    let text = this
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n")
        .replace(/^(["'])/, "\$1")
        .replace(/([^\\])((?:\\{2})*)(?=["'])/g, "$1$2\\");
    return eval(`"${text}"`);
});

/**
 * Enhancement of the JavaScript API
 * Adds a property to get the UID for the window instance.
 */
compliant("window.serial");
Object.defineProperty(window, "serial", {
    value: Math.serial()
});

/**
 * Enhancement of the JavaScript API
 * Adds a property to get the context path.
 * The context path is a part of the request URI and can be compared with the
 * current working directory.
 */
compliant("window.location.pathcontext");
Object.defineProperty(window.location, "pathcontext", {
    value: window.location.pathname.replace(/\/([^\/]*\.[^\/]*){0,}$/g, "") || "/"
});

/**
 * Enhancement of the JavaScript API
 * Adds a method to combine paths to a new one.
 * The result will always start with a slash but ends without it.
 */
compliant("window.location.combine");
compliant(null, window.location.combine = (...paths) =>
    "/" + paths.join("/")
        .replace(/[\/\\]+/g, "/")
        .replace(/(^\/+)|(\/+$)/g, ""));