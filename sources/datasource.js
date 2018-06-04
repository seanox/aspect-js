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
 *  DataSource 1.0 20180604
 *  Copyright (C) 2018 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20180604
 */
if (typeof(DataSource) === "undefined") {
    
    DataSource = {};

    DataSource.cache;
    
    DataSource.ROOT = window.location.pathname;
    
    DataSource.DATA = (DataSource.ROOT + "/data").replace(/\/+/g, "/");
    
    DataSource.PATTERN_LOCATOR = /^([a-z]+):\/(\/[\w\-\/]+)$/;
    
    if (XMLDocument.prototype.clone === undefined) {
        XMLDocument.prototype.clone = function() {
            var clone = this.implementation.createDocument(this.namespaceURI, null, null);
            var node = clone.importNode(this.documentElement, true);
            clone.appendChild(node);
            return clone; 
        };     
    };    
    
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
    
    DataSource.manipulate = function(locator) {

        if (typeof(locator) !== "string"
                || !locator.match(DataSource.PATTERN_LOCATOR))
            throw new Error("Invalid locator: " + String(locator));        
        
        var type = locator.match(DataSource.PATTERN_LOCATOR)[1];
        var path = locator.match(DataSource.PATTERN_LOCATOR)[2];

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
    };
    
    DataSource.transform = function(xml, style, partial) {
        
        if (!(xml instanceof XMLDocument))
            throw new TypeError("Invalid xml document");   
        if (!(style instanceof XMLDocument))
            throw new TypeError("Invalid xml stylesheet");   

        var processor = new XSLTProcessor();
        processor.importStylesheet(style);
        
        var escaping = xml.evaluate("string(/*/@escaping)", xml, null, XPathResult.ANY_TYPE, null).stringValue;
        escaping = !!escaping.match(/^yes|on|true|1$/i);
        
        var result = processor.transformToDocument(xml);
        var nodes = result.querySelectorAll(escaping ? "*" : "*[escaping]");
        nodes.forEach(function(node, index, array) {
            if (escaping || (node.getAttribute("escaping") || "on").match(/^yes|on|true|1$/i)) {
                var content = node.innerHTML;
                if (content.indexOf("<") < 0
                        && content.indexOf(">") < 0)
                    node.innerHTML = node.textContent;
            }
            node.removeAttribute("escaping");
        });
        
        if (!partial)
            return result;
        
        if (result.body)
            return result.body.childNodes;
        if (result.firstChild.nodeName.match(/^transformiix\b/i))
            return result.firstChild.childNodes;
        return result.childNodes;        
    }; 
    
    DataSource.fetch = function(locator, transform, partial) {
        
        if (typeof(locator) !== "string"
                || !locator.match(DataSource.PATTERN_LOCATOR))
            throw new Error("Invalid locator: " + String(locator));        

        var type = locator.match(DataSource.PATTERN_LOCATOR)[1];
        var path = locator.match(DataSource.PATTERN_LOCATOR)[2];
        
        if (!type.match(/^xml$/)
                && transform)
            throw new Error("Transformation is not supported for this locator");  

        var data = DataSource.manipulate(locator);
        if (!transform)
            return data.clone();
        
        var style = DataSource.manipulate(locator.replace(/^[a-z]+/i, "xslt"));
        return DataSource.transform(data, style, partial);
    };
    
    DataSource.collect = function(variants) {
        
        if (arguments.length <= 0)
            return null;
        
        var collection = new Array();
        if (arguments.length == 1
                && Array.isArray(arguments[0])) {
            collection = collection.concat(arguments[0]);
        } else if (arguments.length > 1
                || typeof(arguments[0]) === "string") {
            for (var loop = 0; loop < arguments.length; loop++)
                collection.push(arguments[loop]);
        } else throw new TypeError("Invalid collection"); 

        DataSource.cache = DataSource.cache || {};
        var hash = collection.join().hashCode();
        if (DataSource.cache.hasOwnProperty(hash))
            return DataSource.cache[hash].clone();  
        var root = document.implementation.createDocument(null, "collection", null, null);
        collection.forEach(function(entry, index, array) {
            if (typeof(entry) !== "string")
                throw TypeError("Invalid collection entry");
            root.documentElement.appendChild(
                    DataSource.fetch(entry).documentElement);
        });

        DataSource.cache[hash] = root;
        return root.clone();
    };
};