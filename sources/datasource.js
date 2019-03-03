/**
 *  LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 *  im Folgenden Seanox Software Solutions oder kurz Seanox genannt. Diese
 *  Software unterliegt der Version 2 der GNU General Public License.
 *
 *  Seanox aspect-js, Fullstack JavaScript UI Framework
 *  Copyright (C) 2019 Seanox Software Solutions
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
 *  DataSource 1.0 20190214
 *  Copyright (C) 2019 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20190214
 */
if (typeof DataSource === "undefined") {
    
    /** Static component for the access and transforming of XML data. */  
    DataSource = {};

    /** Internal cache of XML/XSLT data. */
    DataSource.cache;
    
    /** Path of the DataSource for: root */
    DataSource.ROOT = window.location.pathname;
    
    /** Path of the DataSource for: data (sub-directory of root) */
    DataSource.DATA = (DataSource.ROOT.replace(/[^/]*\.[^/]+$/, "") + "/data").replace(/\/+/g, "/");
    
    /** Pattern for a DataSource locators */
    DataSource.PATTERN_LOCATOR = /^([a-z]+):\/(\/[\w\-\/]+)$/;
    
    /** Pattern to detect JavaScript elements */
    DataSource.PATTERN_JAVASCRIPT = /^\s*text\s*\/\s*javascript\s*$/i;    
    
    /** Constant for attribute type */
    DataSource.ATTRIBUTE_TYPE = "type";
    
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
    
    /** The available languages in the 'locales.xml' with label-value pairs. */
    DataSource.locale = (function() {
        
        var request;
        request = new XMLHttpRequest();
        request.open("GET", DataSource.DATA + "/locales.xml", false);
        request.overrideMimeType("application/xslt+xml");
        request.send();
        var xml = request.responseXML;
        
        var locale = (navigator.browserLanguage || navigator.language || "").trim().toLowerCase();
        locale = locale.match(/^([a-z]+)/);
        if (locale)
            locale = locale[0];
        if (xml.evaluate("count(/locales/" + locale + ")", xml, null, XPathResult.ANY_TYPE, null).numberValue)
            return locale;
        return xml.evaluate("/locales/*[@default]", xml, null, XPathResult.ANY_TYPE, null).iterateNext().nodeName.toLowerCase();
    })();
    
    /**
     *  Transforms an XMLDocument based on a passed stylesheet (as XMLDocument).
     *  The result as a node. In some browsers, the XSLTProcessor may create a
     *  container object, which is removed automatically. With the option raw
     *  the cleanup can be deactivated.
     *  @param  xml   data as XMLDocument
     *  @param  style as XMLDocument 
     *  @return the transformation result as a node
     */
    DataSource.transform = function(xml, style, raw) {
        
        if (!(xml instanceof XMLDocument))
            throw new TypeError("Invalid xml document");   
        if (!(style instanceof XMLDocument))
            throw new TypeError("Invalid xml stylesheet");   

        var processor = new XSLTProcessor();
        processor.importStylesheet(style);
        
        //The escape attribute converts text to HTML.
        //Without the escape attribute, the HTML tag symbols < and > are masked
        //and output as text.
        
        var escape = xml.evaluate("string(/*/@escape)", xml, null, XPathResult.ANY_TYPE, null).stringValue;
        escape = !!escape.match(/^yes|on|true|1$/i);
        
        var result = processor.transformToDocument(xml);
        var nodes = result.querySelectorAll(escape ? "*" : "*[escape]");
        nodes.forEach(function(node, index, array) {
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
        nodes.forEach(function(node, index, array) {
            if (!node.hasAttribute(DataSource.ATTRIBUTE_TYPE)
                    || (node.getAttribute(DataSource.ATTRIBUTE_TYPE) || "").match(DataSource.PATTERN_JAVASCRIPT))
                node.setAttribute("type", "composite/javascript");
        });
        
        if (arguments.length > 2
                && !!raw)
            return result;
        
        if (result.body)
            return result.body.childNodes;
        if (result.firstChild
                && result.firstChild.nodeName.match(/^transformiix\b/i))
            return result.firstChild.childNodes;
        return result.childNodes;        
    }; 
    
    /**
     *  Fetch the data as text to a locator.
     *  Optionally the data can be transformed into an XMLDocument.
     *  @param  locators  locator
     *  @param  transform locator of style for the transformation
     *  @param  raw
     *      in combination with transform optionally true to return the complete
     *      XMLDocument, otherwise only the root entity is returned as node     
     *  @return the data as text or in combination with transform the
     *      XMLDocument or the root entity as node
     *  @throws Error in the case of invalid arguments
     */    
    DataSource.fetch = function(locator, transform, raw) {
        
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
            request.open("GET", data, false);
            request.overrideMimeType("application/xslt+xml");
            request.send();
            data = request.responseXML;
            DataSource.cache[hash] = data;
            
            return data;
        }
        
        if (!type.match(/^xml$/)
                && transform)
            throw new Error("Transformation is not supported for this locator");  

        var data = DataSource.fetch(locator);
        if (!transform)
            return data.clone();
        
        var style = DataSource.fetch(locator.replace(/^[a-z]+/i, "xslt"));
        return DataSource.transform(data, style, raw);
    };
    
    /**
     *  Collects and concatates the of multiple XML files as a new XMLDocument.
     *  @param  locators Array or VarArg with locators
     *  @return the created XMLDocument, otherwise null
     *  @throws Error in the case of invalid arguments
     */
    DataSource.collect = function(locators) {
        
        if (arguments.length <= 0)
            return null;
        
        var collection = [];
        if (arguments.length == 1
                && Array.isArray(arguments[0])) {
            collection = collection.concat(arguments[0]);
        } else if (arguments.length > 1
                || typeof arguments[0] === "string") {
            for (var loop = 0; loop < arguments.length; loop++)
                collection.push(arguments[loop]);
        } else throw new TypeError("Invalid collection"); 

        DataSource.cache = DataSource.cache || {};
        var hash = collection.join().hashCode();
        if (DataSource.cache.hasOwnProperty(hash))
            return DataSource.cache[hash].clone();  
        var root = document.implementation.createDocument(null, "collection", null, null);
        collection.forEach(function(entry, index, array) {
            if (typeof entry !== "string")
                throw TypeError("Invalid collection entry");
            root.documentElement.appendChild(
                    DataSource.fetch(entry).documentElement);
        });

        DataSource.cache[hash] = root;
        return root.clone();
    };
};