/**
 * LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 * im Folgenden Seanox Software Solutions oder kurz Seanox genannt.
 * Diese Software unterliegt der Version 2 der Apache License.
 *
 * Seanox aspect-js, fullstack for single page applications
 * Copyright (C) 2025 Seanox Software Solutions
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
 * DataSource is a NoSQL approach to data storage based on XML data in
 * combination with multilingual data separation, optional aggregation, and
 * transformation. It is a combination of the approaches of a read-only database
 * system (DBS) and a content management system (CMS)."
 *
 * Data are addressed via a locator, which is a URL (xml://... or xslt://...),
 * where both single and double slashes are supported. It is used as an absolute
 * path without a file extension relative to the DataSource directory and does
 * not contain a locale (language specification) in the path. The locale would
 * be the first element in the path that the locator addresses. However, a
 * locator can also be a fully qualified URL, which typically ends with a file
 * extension (xml://....xml or xslt://....xslt). This kind of locator addresses
 * an absolute path based on the current URL and does not include a locale.
 *
 * DataSource is based on static data. Therefore, the implementation uses a
 * cache to minimize network access.
 * 
 * The data is queried with XPath, the result can be concatenated and
 * aggregated and the result can be transformed with XSLT. 
 */
(() => {

    "use strict";

    /** Path of the DataSource for: data (sub-directory of work path) */
    const DATA = window.location.combine(window.location.contextPath, "/data");

    /**
     * Pattern for a DataSource locator, based on the URL syntax but only the
     * schema, path, file and query are used. A path segment begins with a word
     * character _ a-z 0-9, optionally more word characters and additionally -
     * can follow, but can not end with the - character. Paths are separated by
     * the / character.
     * - group 1: DataSource URL without optional XPath
     * - group 2: protocol
     * - group 3: locator without optional XPath
     * - group 4: file without slash (optional)
     * - group 5: XPath without question mark (optional)
     */
    const PATTERN_LOCATOR = /^((xml|xslt):\/?((?:\/(?:(?:\w+)|(?:\w+(?:\-+\w+)+)))*(?:\/((?:(?:\w+)|(?:\w+(?:\-+\w+)+))\.\2))?))(?:\?(\S*))?$/;

    /** Pattern to detect JavaScript elements */
    const PATTERN_JAVASCRIPT = /^\s*text\s*\/\s*javascript\s*$/i;

    /** Pattern to detect a word (_ 0-9 a-z A-Z -) */
    const PATTERN_WORD = /(^\w+$)|(^((\w+\-+(?=\w))+)\w*$)/;

    /** Constant for attribute type */
    const ATTRIBUTE_TYPE = "type";

    compliant("DataSource");
    compliant(null, window.DataSource = {

        /** The currently used language. */
        get locale() {return DataSource.locales ? DataSource.locales.selection : null;},

        /**
         * Changes the localization of the DataSource.
         * Only locales from locales.xml can be used, other values cause an
         * error.
         * @param {string} locale Locale to be set
         * @throws {TypeError} In case of invalid locale type
         * @throws {Error} In case of missing DataSource data or locales
         * @throws {Error} In case of invalid locales
         */
        localize(locale) {
            
            if (!DataSource.data
                    || !DataSource.locales) 
                throw new Error("Locale not available");

            if (typeof locale !== "string")
                throw new TypeError("Invalid locale: " + typeof locale);        
            
            locale = (locale || "").trim().toLowerCase();
            if (!locale
                    || !DataSource.locales.includes(locale))
                throw new Error("Locale not available");

            DataSource.locales.selection = locale;
        },
        
        /**
         * Transforms an XMLDocument based on a passed or derived stylesheet.
         * The data and the stylesheet can be passed as Locator, XMLDocument as
         * a mix. The result as a DocumentFragment. Optionally, a meta-object
         * as map with parameters for the XSLTProcessor can be passed.
         *
         * The XML locator also supports XPath. In this case, the XPathResult
         * for the transformation is embedded in an artificial XML document with
         * a data root element.
         *
         * The method has the following various signatures:
         *     DataSource.transform(xml);
         *     DataSource.transform(xml, meta);
         *     DataSource.transform(xml, style, meta);
         *
         * @param {string|XMLDocument} xml Locator or XML document to be
         *     transformed
         * @param {string|XMLDocument} [style] Optional locator or XMLDocument
         *     that is used as a stylesheet for transformation
         * @param {Object} [meta] Optional  parameters for the XSLT processor
         * @returns {DocumentFragment} The transformation result as a
         *     DocumentFragment
         * @throws {Error} In case of invalid arguments
         */
        transform(...variants) {

            let xml = undefined;
            let style = undefined;
            let meta = undefined;
            if (!["string"].includes(typeof variants[0])
                    && !(variants[0] instanceof XMLDocument))
                throw new TypeError(`Invalid xml locator: ${typeof variants[0]}`);
            xml = variants[0];
            if (variants.length >= 3) {
                if (!["string"].includes(typeof variants[1])
                        && !(variants[1] instanceof XMLDocument))
                    throw new TypeError(`Invalid xslt locator: ${typeof variants[1]}`);
                style = variants[1];
                if (!["object"].includes(typeof variants[2]))
                    throw new TypeError(`Invalid meta object: ${typeof variants[2]}`);
                meta = variants[2];
            } else if (variants.length >= 2) {
                if (!["string", "object"].includes(typeof variants[1])
                        && !(variants[1] instanceof XMLDocument))
                    throw new TypeError(`Invalid xslt locator or meta object: ${typeof variants[1]}`);
                if (!["string"].includes(typeof variants[1])
                        && !(variants[1] instanceof XMLDocument))
                    meta = variants[1];
                else style = variants[1];
            }

            if (typeof xml === "string") {
                if (!xml.match(PATTERN_LOCATOR)
                        || xml.match(PATTERN_LOCATOR)[2] !== "xml")
                    throw new Error("Invalid xml locator: " + String(xml));
                xml = DataSource.fetch(xml);
                if (!(xml instanceof XMLDocument)) {
                    const document = document.implementation.createDocument(null, "data", null);
                    if (xml instanceof NodeList) {
                        for (let node; node = xml.iterateNext();) {
                            node = document.importNode(node, true);
                            document.documentElement.appendChild(node);
                        }
                    } else {
                        const node = document.createTextNode(String(xml));
                        document.documentElement.appendChild(node);
                    }
                    xml = document;
                }
            }

            if (typeof style === "string") {
                if (!style.match(PATTERN_LOCATOR)
                        || style.match(PATTERN_LOCATOR)[2] !== "xslt"
                        || style.match(PATTERN_LOCATOR)[5] !== undefined)
                    throw new Error("Invalid xslt locator: " + String(style));
                style = DataSource.fetch(style);
            }

            if (!(xml instanceof XMLDocument))
                throw new TypeError("Invalid xml document");   
            if (!(style instanceof XMLDocument))
                throw new TypeError("Invalid xslt stylesheet");

            const processor = new XSLTProcessor();
            processor.importStylesheet(style);
            if (meta && typeof meta === "object") {
                const set = typeof meta[Symbol.iterator] !== "function" ? Object.entries(meta) : meta
                for (const [key, value] of set)
                    if (typeof meta[key] !== "function")
                        processor.setParameter(null, key, value);
            }
            
            // Attribute escape converts text to HTML. Without, HTML tag symbols
            // < and > are masked and output as text.
            let escape = xml.evaluate("string(/*/@escape)", xml, null, XPathResult.ANY_TYPE, null).stringValue;
            escape = !!escape.match(/^yes|on|true|1$/i);

            // Workaround for some browsers, e.g. MS Edge, if they have problems
            // with !DOCTYPE + !ENTITY. Therefore the document is copied so that
            // the DOCTYPE declaration is omitted.
            let result = processor.transformToDocument(xml.clone());
            let nodes = result.querySelectorAll(escape ? "*" : "*[escape]");
            nodes.forEach((node) => {
                if (escape || (node.getAttribute("escape") || "on").match(/^yes|on|true|1$/i)) {
                    const content = node.innerHTML;
                    if (content.indexOf("<") < 0
                            && content.indexOf(">") < 0)
                        node.innerHTML = node.textContent;
                }
                node.removeAttribute("escape");
            });
            
            // JavaScript are automatically changed to composite/javascript
            // during the import. Therefore, imported scripts are not executed
            // directly, but only by the renderer. This is important in
            // combination with ATTRIBUTE_CONDITION.
            nodes = result.querySelectorAll("script[type],script:not([type])");
            nodes.forEach((node) => {
                if (!node.hasAttribute(ATTRIBUTE_TYPE)
                        || (node.getAttribute(ATTRIBUTE_TYPE) || "").match(PATTERN_JAVASCRIPT))
                    node.setAttribute("type", "composite/javascript");
            });
            
            nodes = result.childNodes;
            if (result.body)
                nodes = result.body.childNodes;
            else if (result.firstChild
                    && result.firstChild.nodeName.match(/^transformiix\b/i))
                nodes = result.firstChild.childNodes;
            const fragment = document.createDocumentFragment();
            nodes = Array.from(nodes);
            for (let loop = 0; loop < nodes.length; loop++)
                fragment.appendChild(nodes[loop]);
            return fragment;
        },
        
        /**
         * Fetch the data to a locator as XMLDocument.
         * @param {string} locator Locator to fetch data for as XMLDocument.
         *     Optionally, an XPath query is also supported. The XPath is
         *     appended to the locator separated by a question mark. The return
         *     value depends on the XPath and can be boolean, number, string,
         *     list of nodes or null.
         * @returns {XMLDocument|string|boolean|number|NodeList|null}
         *     The fetched data as an XMLDocument. When using XPath, it can be
         *     boolean, number, string, list of nodes or null.
         * @throws {Error} In case of invalid arguments
         */
        fetch(locator) {

            if (typeof locator !== "string")
                throw new Error("Invalid xml locator: " + String(locator));
            if (!locator.match(PATTERN_LOCATOR))
                throw new Error("Invalid xml locator: " + String(locator));

            locator = ((locator) => {
                const matches = locator.match(PATTERN_LOCATOR);
                const absolute = matches[4] !== undefined;
                const location = absolute
                    ? `${window.location.contextPath}${matches[3]}`
                    : `${DATA}/${DataSource.locale}${matches[3]}.${matches[2]}`;
                return {
                    source:   locator,
                    location: location,
                    type:     matches[2],
                    xpath:    matches[5]
                };
            })(locator);

            if (locator.type === "xslt"
                    && locator.xpath !== undefined)
                throw new Error("Invalid XSLT locator: " + locator.source);

            const data = ((locator) => {
                const hash = locator.hashCode();
                if (_cache.hasOwnProperty(hash))
                    return _cache[hash];
                const request = new XMLHttpRequest();
                request.overrideMimeType("application/xslt+xml");
                request.open("GET", locator, false);
                request.send();
                if (request.status !== 200)
                    throw new Error(`HTTP status ${request.status} for ${request.responseURL}`);
                const data = request.responseXML;
                _cache[hash] = data;
                return data.clone();
            })(locator.location);

            if (locator.xpath === undefined)
                return data;

            const result = data.evaluate(locator.xpath, data, null, XPathResult.ANY_TYPE, null);
            switch (result.resultType) {
                case XPathResult.BOOLEAN_TYPE:
                    return result.booleanValue;
                case XPathResult.NUMBER_TYPE:
                    return result.numberValue;
                case XPathResult.STRING_TYPE:
                    return result.stringValue;
            }
            let nodes = document.createDocumentFragment();
            if (!result.singleNodeValue) {
                for (let node; node = result.iterateNext();)
                    nodes.appendChild(node);
            } else nodes.appendChild(result.singleNodeValue);
            return nodes.childNodes.length > 0 ? nodes : null;
        },
        
        /**
         * Collects and concatenates multiple XML files in a new XMLDocument.
         *
         * The method has the following various signatures:
         *     DataSource.collect(locator, ...);
         *     DataSource.collect(collector, locator, ...);
         *
         * @param {...string} locators or collector, the name of the root
         *     element in the artificial XML document, followed by the locators
         * @returns {XMLDocument|null} The created XMLDocument, otherwise null
         * @throws {Error} In case of invalid arguments, collector or collection
         */
        collect(...variants) {

            if (variants.length <= 0)
                return null;

            let collector = "collection";
            if (variants.length > 1
                    && variants[0].match(PATTERN_WORD))
                collector = variants.shift();
            variants.forEach(entry => {
                if (typeof entry !== "string")
                    throw new TypeError(`Invalid xml locator: ${typeof entry}`);
                if (!entry.match(PATTERN_LOCATOR))
                    throw new TypeError(`Invalid xml locator: ${entry}`);
            });

            let hash = collector.hashCode() + ":" + variants.join().hashCode();
            variants.forEach(entry =>
                hash += ":" + String(entry).hashCode());
            if (_cache.hasOwnProperty(hash))
                return _cache[hash].clone();

            const data = document.implementation.createDocument(null, collector, null);
            variants.forEach(entry => {
                const result = DataSource.fetch(entry);
                if (result instanceof XMLDocument) {
                    data.documentElement.appendChild(result.documentElement.cloneNode(true));
                } else if (result instanceof NodeList) {
                    for (const node of result)
                        data.documentElement.appendChild(node);
                } else {
                    data.documentElement.appendChild(
                        document.createTextNode(String(result)));
                }
            });

            _cache[hash] = data;
            return data.clone();
        }
    });

    /**
     * Enhancement of the JavaScript API
     * Adds a method for cloning a XMLDocument.
     * @returns {XMLDocument} The cloned XMLDocument
     */
    compliant("XMLDocument.prototype.clone");
    compliant(null, XMLDocument.prototype.clone = function() {
        const clone = this.implementation.createDocument(null, null);
        clone.appendChild(clone.importNode(this.documentElement, true));
        return clone; 
    });

    // XML/XSLT data cache
    const _cache = {};
    Object.defineProperty(DataSource, "cache", {
        value: {}
    });

    // DataSource.locales
    // List of available locales (as standard marked are at the beginning)
    Object.defineProperty(DataSource, "locales", {
        value: [], enumerable: true
    });    
    
    let locales = [];
    [navigator.language].concat(navigator.languages || []).forEach(language => {
        language = language.toLowerCase().trim();
        locales.push(language);
        language = language.replace(/-.*$/, "");
        if (!locales.includes(language))
            locales.push(language);
    });

    if (locales.length <= 0)
        throw new Error("Locale not available");
    
    const request = new XMLHttpRequest();
    request.overrideMimeType("text/plain");
    request.open("GET", DATA + "/locales.xml", false);
    request.send();
    
    // DataSource.data
    // Cache of locales.xml, can also be used by other components
    Object.defineProperty(DataSource, "data", {
        value: request.status === 200 ? new DOMParser().parseFromString(request.responseText,"text/xml") : null
    });
    if (!DataSource.data
            && request.status !== 404)
        throw new Error("Locale not available");

    if (!DataSource.data)
        return;

    let xml = DataSource.data;
    let nodes = xml.evaluate("/locales/*[@default]", xml, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    for (let node; node = nodes.iterateNext();) {
        let name = node.nodeName.toLowerCase();
        if (!DataSource.locales.includes(name))
            DataSource.locales.push(name);
    }
    nodes = xml.evaluate("/locales/*", xml, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    for (let node; node = nodes.iterateNext();) {
        const name = node.nodeName.toLowerCase();
        if (!DataSource.locales.includes(name))
            DataSource.locales.push(name);
    }
    
    if (DataSource.locales.length <= 0)
        throw new Error("Locale not available");

    locales.push(DataSource.locales[0]);
    locales = locales.filter((locale) =>
        DataSource.locales.includes(locale));
    
    DataSource.locales.selection = locales.length ? locales[0] : DataSource.locales[0];
})();