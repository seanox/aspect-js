/**
 *  LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 *  im Folgenden Seanox Software Solutions oder kurz Seanox genannt. Diese
 *  Software unterliegt der Version 2 der GNU General Public License.
 *
 *  Seanox aspect-js, Fullstack JavaScript UI Framework
 *  Copyright (C) 2020 Seanox Software Solutions
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
 *  DataSource is a NoSQL approach to data storage based on XML data in
 *  combination with multilingual data separation, optional aggregation and
 *  transformation.
 *  A combination of the approaches of a read only DBS and a CMS.
 *  
 *  Files are defined by locator.
 *  A locator is a URL (xml://... or xslt://...) that is used absolute and
 *  relative to the DataSource directory, but does not contain a locale
 *  (language specification) in the path. The locale is determined automatically
 *  for the language setting of the browser, or if this is not supported, the
 *  standard from the locales.xml in the DataSource directory is used.
 *  
 *  DataSource is based on static data.
 *  Therefore, the implementation uses a cache to minimize network access.
 *  
 *  The data is queried with XPath, the result can be concatenated and
 *  aggregated and the result can be transformed with XSLT. 
 *  
 *  DataSource 1.3.1 20200202
 *  Copyright (C) 2020 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.3.1 20200202
 */
if (typeof DataSource === "undefined") {
    
    /** Static component for the access and transforming of XML data. */  
    window["DataSource"] = {
            
        /** Path of the DataSource for: data (sub-directory of work path) */
        get DATA() {return window.location.pathcontext + "/data";},

        /** 
         *  Pattern for a DataSource locator
         *  The locator syntax is based on the URL syntax.
         *  Only the parts schema and path are used.
         *  A path segment begins with a word character _ a-z 0-9, optionally
         *  more word characters and additionally - can follow, but can not end
         *  with the - character. Paths are separated by the / character.
         */
        get PATTERN_LOCATOR() {return /^(?:([a-z]+):\/+)(\/((\w+)|(\w+(\-+\w+)+)))+$/;},
        
        /** Pattern to detect JavaScript elements */
        get PATTERN_JAVASCRIPT() {return /^\s*text\s*\/\s*javascript\s*$/i;},    
        
        /** Pattern to detect a word (_ 0-9 a-z A-Z -) */
        get PATTERN_WORD() {return /(^\w+$)|(^((\w+\-+(?=\w))+)\w*$)/;},
        
        /** Constant for attribute type */
        get ATTRIBUTE_TYPE() {return "type";},
        
        /** The currently used language. */
        get locale() {return DataSource.locales ? DataSource.locales.selection : null;}
    };
    
    /**
     *  Enhancement of the JavaScript API
     *  Adds a method for cloning a XMLDocument.
     */    
    if (XMLDocument.prototype.clone === undefined) {
        XMLDocument.prototype.clone = function() {
            var clone = this.implementation.createDocument(this.namespaceURI, null, null);
            var node = clone.importNode(this.documentElement, true);
            clone.appendChild(node);
            return clone; 
        };     
    };
    
    (function() {

        //DataSource.cache
        //    Internal cache of XML/XSLT data    
        Object.defineProperty(DataSource, "cache", {
            value: {}
        });        
        
        //DataSource.locales
        //    List of available locales (as standard marked are at the beginning)
        Object.defineProperty(DataSource, "locales", {
            value: [],
            enumerable: true
        });        
        
        var locale = [];
        locale = locale.concat(navigator.language);
        if (typeof navigator.languages !== "undefined")
            locale = locale.concat(navigator.languages);
        Array.from(locale).forEach((language) => {
            language = language.match(/^[a-z]+/i, "");
            if (language && !locale.includes(language[0]))
                locale.push(language[0]);
        });
        locale = locale.map(language => language.trim().toLowerCase());
        locale = locale.filter(function(item, index) {
            return locale.indexOf(item) == index;
        });

        if (locale.length <= 0)
            throw new Error("Locale not available");
        
        var request = new XMLHttpRequest();
        request.overrideMimeType("application/xslt+xml");
        request.open("HEAD", DataSource.DATA + "/locales.xml", false);
        request.send();
        if (request.status == 404)
            return;
        request.open("GET", DataSource.DATA + "/locales.xml", false);
        request.send();
        
        //DataSource.data
        //    Internal cache of locales.xml
        Object.defineProperty(DataSource, "data", {
            value: request.status == 200 ? request.responseXML : null
        });
        if (!DataSource.data
                && request.status != 404)
            throw new Error("Locale not available");

        if (!DataSource.data)
            return;
        
        var xml = DataSource.data;
        var nodes = xml.evaluate("/locales/*[@default]", xml, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        for (var node = nodes.iterateNext(); node; node = nodes.iterateNext()) {
            var name = node.nodeName.toLowerCase();
            if (!DataSource.locales.includes(name))
                DataSource.locales.push(name);
        }
        var nodes = xml.evaluate("/locales/*", xml, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        for (var node = nodes.iterateNext(); node; node = nodes.iterateNext()) {
            var name = node.nodeName.toLowerCase();
            if (!DataSource.locales.includes(name))
                DataSource.locales.push(name);
        }
        
        if (DataSource.locales.length <= 0)
            throw new Error("Locale not available");

        locale.push(DataSource.locales[0]);
        locale = locale.filter(function(locale) {
            return DataSource.locales.includes(locale);
        });  
        
        DataSource.locales.selection = locale.length ? locale[0] : DataSource.locales[0];
    })();
    
    /**
     *  Changes the localization of the DataSource.
     *  Only locales from locales.xml can be used, other values cause an
     *  exception.
     *  @param  locale
     *  @throws Error in the case of invalid locales
     */
    DataSource.localize = function(locale) {
        
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
    };    
    
    /**
     *  Transforms an XMLDocument based on a passed stylesheet.
     *  The data and the stylesheet can be passed as Locator, XMLDocument and in
     *  mix. The result as a DocumentFragment.
     *  Optionally, a meta object or a map with parameters for the XSLTProcessor
     *  can be passed.
     *  @param  xml   locator or XMLDocument
     *  @param  style locator or XMLDocument 
     *  @param  meta  optional parameters for the XSLTProcessor 
     *  @return the transformation result as a DocumentFragment
     */
    DataSource.transform = function(xml, style, meta) {
        
        if (typeof xml === "string"
                && xml.match(DataSource.PATTERN_LOCATOR))
            xml = DataSource.fetch(xml);
            
        if (typeof style === "string"
                && style.match(DataSource.PATTERN_LOCATOR))
            style = DataSource.fetch(style);
        
        if (!(xml instanceof XMLDocument))
            throw new TypeError("Invalid xml document");   
        if (!(style instanceof XMLDocument))
            throw new TypeError("Invalid xml stylesheet");   

        var processor = new XSLTProcessor();
        processor.importStylesheet(style);
        if (meta && typeof meta === "object") {
            var set = typeof meta[Symbol.iterator] !== "function" ? Object.entries(meta) : meta
            for (const [key, value] of set)
                if (typeof meta[key] !== "function")
                    processor.setParameter(null, key, value);
        }
        
        //The escape attribute converts text to HTML.
        //Without the escape attribute, the HTML tag symbols < and > are masked
        //and output as text.
        var escape = xml.evaluate("string(/*/@escape)", xml, null, XPathResult.ANY_TYPE, null).stringValue;
        escape = !!escape.match(/^yes|on|true|1$/i);

        //Workaround for some browsers, e.g. MS Edge, if they have problems with
        //!DOCTYPE + !ENTITY. Therefore the document is copied so that the
        //DOCTYPE declaration is omitted.
        var result = processor.transformToDocument(xml.clone());
        var nodes = result.querySelectorAll(escape ? "*" : "*[escape]");
        nodes.forEach((node) => {
            if (escape || (node.getAttribute("escape") || "on").match(/^yes|on|true|1$/i)) {
                var content = node.innerHTML;
                if (content.indexOf("<") < 0
                        && content.indexOf(">") < 0)
                    node.innerHTML = node.textContent;
            }
            node.removeAttribute("escape");
        });
        
        //JavaScript blocks are automatically changed to composite/javascript
        //during import. Therefore imported scripts are not executed directly,
        //but only by the renderer. This is important in combination with the
        //condition attribute.
        var nodes = result.querySelectorAll("script[type],script:not([type])");
        nodes.forEach((node) => {
            if (!node.hasAttribute(DataSource.ATTRIBUTE_TYPE)
                    || (node.getAttribute(DataSource.ATTRIBUTE_TYPE) || "").match(DataSource.PATTERN_JAVASCRIPT))
                node.setAttribute("type", "composite/javascript");
        });
        
        var nodes = result.childNodes;
        if (result.body)
            nodes = result.body.childNodes;
        else if (result.firstChild
                && result.firstChild.nodeName.match(/^transformiix\b/i))
            nodes = result.firstChild.childNodes;
        var fragment = document.createDocumentFragment();
        nodes = Array.from(nodes);
        for (var loop = 0; loop < nodes.length; loop++)
            fragment.appendChild(nodes[loop]);
        return fragment;
    }; 
    
    /**
     *  Fetch the data to a locator as XMLDocument.
     *  Optionally the data can be transformed via XSLT, for which a meta object
     *  or a map with parameters for the XSLTProcessor can also be optionally
     *  passed. When using the transformation, the return type changes to a
     *  DocumentFragment.
     *  @param  locators  locator
     *  @param  transform locator of the transformation style
     *      With the boolean true, the style is derived from the locator by
     *      using the file extension xslt.
     *  @param  meta      optional parameters for the XSLTProcessor
     *  @return the fetched data as XMLDocument or as DocumentFragment, if the
     *      transformation is used
     *  @throws Error in the case of invalid arguments
     */    
    DataSource.fetch = function(locator, transform, meta) {
        
        if (typeof locator !== "string"
                || !locator.match(DataSource.PATTERN_LOCATOR))
            throw new Error("Invalid locator: " + String(locator));        

        var type = locator.match(DataSource.PATTERN_LOCATOR)[1];
        var path = locator.match(DataSource.PATTERN_LOCATOR)[2];
        
        if (arguments.length == 1) {

            DataSource.cache = DataSource.cache || {};
            
            var data = DataSource.DATA + "/" + DataSource.locale + "/" + path + "." + type;
            data = data.replace(/\/+/g, "/");
            hash = data.hashCode();
            if (DataSource.cache.hasOwnProperty(hash))
                return DataSource.cache[hash];
            
            var request = new XMLHttpRequest();
            request.overrideMimeType("application/xslt+xml");
            request.open("GET", data, false);
            request.send();
            if (request.status != 200)
                throw new Error("HTTP status " + request.status + " for " + request.responseURL);
            data = request.responseXML;
            DataSource.cache[hash] = data;
            
            return data.clone();
        }
        
        if (!type.match(/^xml$/)
                && transform)
            throw new Error("Transformation is not supported for this locator");  

        var data = DataSource.fetch(locator);
        if (!transform)
            return data.clone();
        
        var style = locator.replace(/(^((\w+\-+(?=\w))+)\w*)|(^\w+)/, "xslt");
        if (typeof transform !== "boolean") {
            style = transform;
            if (typeof style !== "string"
                    || !style.match(DataSource.PATTERN_LOCATOR))
                throw new Error("Invalid style: " + String(style));  
        }
        
        return DataSource.transform(data, DataSource.fetch(style), meta);
    };
    
    /**
     *  Collects and concatenates multiple XML files in a new XMLDocument.
     *  The method has the following various signatures:
     *      DataSource.collect(locator, ...);
     *      DataSource.collect(collector, [locators]);
     *  @param  collector name of the collector element in the XMLDocument
     *  @param  locators  Array or VarArg with locators
     *  @return the created XMLDocument, otherwise null
     *  @throws Error in the case of invalid arguments
     */
    DataSource.collect = function(locators) {
        
        if (arguments.length <= 0)
            return null;
        
        var collection = [];

        var collector = "collection";
        if (arguments.length == 2
                && typeof arguments[0] === "string"
                && Array.isArray(arguments[1])) {
            if (!arguments[0].match(DataSource.PATTERN_WORD))
                throw new TypeError("Invalid collector");
            collector = arguments[0];
            collection = Array.from(arguments[1]);
        } else if (arguments.length == 1
                && Array.isArray(arguments[0])) {
            collection = collection.concat(arguments[0]);
        } else collection = Array.from(arguments);
        
        DataSource.cache = DataSource.cache || {};
        var hash = collector.hashCode() + ":" + collection.join().hashCode();
        collection.forEach((entry) => {
            hash += ":" + String(entry).hashCode();
        });
        if (DataSource.cache.hasOwnProperty(hash))
            return DataSource.cache[hash].clone();  

        var root = document.implementation.createDocument(null, collector, null, null);
        collection.forEach((entry) => {
            if (typeof entry !== "string")
                throw new TypeError("Invalid collection entry");
            root.documentElement.appendChild(DataSource.fetch(entry).documentElement.cloneNode(true));
        });

        DataSource.cache[hash] = root;
        return root.clone();
    };
};