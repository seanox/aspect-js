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
 * combination with multilingual data separation, optional aggregation and
 * transformation.
 * A combination of the approaches of a read only DBS and a CMS.
 * 
 * Files are defined by locator.
 * A locator is a URL (xml://... or xslt://...) that is used absolute and
 * relative to the DataSource directory, but does not contain a locale
 * (language specification) in the path. The locale is determined automatically
 * for the language setting of the browser, or if this is not supported, the
 * standard from the locales.xml in the DataSource directory is used.
 * 
 * DataSource is based on static data.
 * Therefore, the implementation uses a cache to minimize network access.
 * 
 * The data is queried with XPath, the result can be concatenated and
 * aggregated and the result can be transformed with XSLT. 
 */
(() => {

    "use strict";

    /** Path of the DataSource for: data (sub-directory of work path) */
    const DATA = window.location.combine(window.location.contextPath, "/data");

    /**
     * Pattern for a DataSource locator, based on the URL syntax but only
     * the parts schema and path are used. A path segment begins with a word
     * character _ a-z 0-9, optionally more word characters and additionally
     * - can follow, but can not end with the - character. Paths are
     * separated by the / character.
     */
    const PATTERN_LOCATOR = /^(?:([a-z]+):\/+)(\/((\w+)|(\w+(\-+\w+)+)))+$/;

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
         * Transforms an XMLDocument based on a passed stylesheet.
         * The data and the stylesheet can be passed as Locator, XMLDocument an
         * in mix. The result as a DocumentFragment. Optionally, a meta-object
         * or a map with parameters for the XSLTProcessor can be passed.
         * @param {string|XMLDocument} xml Locator or XMLDocument to be
         *     transformed
         * @param {string|XMLDocument} style Locator or XMLDocument stylesheet
         * @param {Object} [meta] Optional parameters for the XSLTProcessor
         * @returns {DocumentFragment} The transformation result as a
         *     DocumentFragment
         @throws {TypeError} In case of invalid xml document and/or stylesheet
         */
        transform(xml, style, meta) {
            
            if (typeof xml === "string"
                    && xml.match(PATTERN_LOCATOR))
                xml = DataSource.fetch(xml);
                
            if (typeof style === "string"
                    && style.match(PATTERN_LOCATOR))
                style = DataSource.fetch(style);
            
            if (!(xml instanceof XMLDocument))
                throw new TypeError("Invalid xml document");   
            if (!(style instanceof XMLDocument))
                throw new TypeError("Invalid xml stylesheet");

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
         * Fetch the data to a locator as XMLDocument. Optionally the data can
         * be transformed via XSLT, for which a meta-object or map with
         * parameters for the XSLTProcessor can be passed. When using the
         * transformation, the return type changes to a DocumentFragment.
         * @param {string} locator Locator to fetch data for.
         * @param {string|boolean} transform Locator of the transformation
         *     style. If boolean true, the style is derived from the locator
         *     using the file extension xslt.
         * @param {Object} [meta] Optional parameters for the XSLTProcessor.
         * @returns {XMLDocument|DocumentFragment} The fetched data as an
         *     XMLDocument or a DocumentFragment if transformation is used
         * @throws {Error} In case of invalid arguments
         */
        fetch(locator, transform, meta) {
            
            if (typeof locator !== "string"
                    || !locator.match(PATTERN_LOCATOR))
                throw new Error("Invalid locator: " + String(locator));

            const type = locator.match(PATTERN_LOCATOR)[1];
            const path = locator.match(PATTERN_LOCATOR)[2];
            
            if (arguments.length === 1) {

                let data = DATA + "/" + DataSource.locale + "/" + path + "." + type;
                data = data.replace(/\/+/g, "/");
                const hash = data.hashCode();
                if (_cache.hasOwnProperty(hash))
                    return _cache[hash];
                
                const request = new XMLHttpRequest();
                request.overrideMimeType("application/xslt+xml");
                request.open("GET", data, false);
                request.send();
                if (request.status !== 200)
                    throw new Error(`HTTP status ${request.status} for ${request.responseURL}`);
                data = request.responseXML;
                _cache[hash] = data;
                
                return data.clone();
            }
            
            if (!type.match(/^xml$/)
                    && transform)
                throw new Error("Transformation is not supported for this locator");

            const data = DataSource.fetch(locator);
            if (!transform)
                return data.clone();
            
            let style = locator.replace(/(^((\w+\-+(?=\w))+)\w*)|(^\w+)/, "xslt");
            if (typeof transform !== "boolean") {
                style = transform;
                if (typeof style !== "string"
                        || !style.match(PATTERN_LOCATOR))
                    throw new Error("Invalid style: " + String(style));  
            }
            
            return DataSource.transform(data, DataSource.fetch(style), meta);
        },
        
        /**
         * Collects and concatenates multiple XML files in a new XMLDocument.
         *
         * The method has the following various signatures:
         *     DataSource.collect(locator, ...);
         *     DataSource.collect(collector, [locators]);
         *
         * @param {string} collector Name of the collector element in the
         *     XMLDocument
         * @param {Array|string} locators Array or VarArg with locators
         * @returns {XMLDocument|null} The created XMLDocument, otherwise null
         * @throws {TypeError} In case of invalid arguments, collector,
         *     collection entry
         */
        collect(...variants) {
            
            if (variants.length <= 0)
                return null;

            let collection = [];

            let collector = "collection";
            if (variants.length === 2
                    && typeof variants[0] === "string"
                    && Array.isArray(variants[1])) {
                if (!variants[0].match(PATTERN_WORD))
                    throw new TypeError("Invalid collector");
                collector = variants[0];
                collection = Array.from(variants[1]);
            } else if (variants.length === 1
                    && Array.isArray(variants[0])) {
                collection = collection.concat(variants[0]);
            } else collection = Array.from(variants);
            
            let hash = collector.hashCode() + ":" + collection.join().hashCode();
            collection.forEach((entry) =>
                hash += ":" + String(entry).hashCode());
            if (_cache.hasOwnProperty(hash))
                return _cache[hash].clone();

            const root = document.implementation.createDocument(null, collector, null);
            collection.forEach((entry) => {
                if (typeof entry !== "string")
                    throw new TypeError("Invalid collection entry");
                root.documentElement.appendChild(DataSource.fetch(entry).documentElement.cloneNode(true));
            });

            _cache[hash] = root;
            return root.clone();
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
    for (let node = nodes.iterateNext(); node; node = nodes.iterateNext()) {
        let name = node.nodeName.toLowerCase();
        if (!DataSource.locales.includes(name))
            DataSource.locales.push(name);
    }
    nodes = xml.evaluate("/locales/*", xml, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    for (let node = nodes.iterateNext(); node; node = nodes.iterateNext()) {
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