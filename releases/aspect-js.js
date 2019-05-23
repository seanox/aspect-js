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
 *  General extension of the JavaScript API.
 *  
 *  Extension 1.0 20190312
 *  Copyright (C) 2019 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20190312
 */
if (typeof Namespace === "undefined") {

    /**
     *  Namespaces at object level.
     *  Comparable to packages in other programming languages, namespaces can be
     *  used to map hierarchical structures and to group thematically related
     *  components and resources.
     *  The implementation happens in JavaScript at object level.
     *  This means that it is not a real element of the programming language,
     *  but is represented by chained static objects.
     *  Each level in this object chain represents a namespace.
     *  As is typical for objects, the namespaces are separated by a dot. 
     */
    Namespace = {};
    
    /** Pattern for the namespace separator */
    Namespace.PATTERN_NAMESPACE_SEPARATOR = /[\\\/\.]/;
    
    /** Pattern for a valid namespace. */
    Namespace.PATTERN_NAMESPACE = /^(?:[\\\/]*[a-z][\w]*)(?:[\\\/\.][a-z][\w]*)*$/i;
    
    /** Pattern to detect if there are conflicts in the namespace. */
    Namespace.PATTERN_NAMESPACE_SEPARATOR_CONFLICT = /(\..*[\\\/])|(\\.*[\.\/])|(\/.*[\\\.])/;    
    
    /**
     *  Creates a namespace to pass string.
     *  Slash and dot are supported as separators.
     *  @param  namespace
     *  @return the created namespace
     *  @throws An error occurs in the following cases:
     *      - event is not valid or is not supported
     *      - callback function is not implemented correctly or does not exist
     */
    Namespace.using = function(namespace) {
        
        if (namespace == null)
            return null;

        if (typeof namespace !== "string")
            throw new TypeError("Invalid namespace: " + typeof namespace);
        if (!namespace.match(Namespace.PATTERN_NAMESPACE)
                || namespace.match(Namespace.PATTERN_NAMESPACE_SEPARATOR_CONFLICT))
            throw new Error("Invalid namespace" + (namespace.trim() ? ": " + namespace : ""));
        
        var scope = window;
        namespace = namespace.replace(/^[\\\/]/, "");
        namespace.split(Namespace.PATTERN_NAMESPACE_SEPARATOR).forEach((entry, index, array) => {
            if (typeof scope[entry] === "undefined") {
                scope[entry] = {};
            } else if (scope[entry] instanceof Object) {
            } else throw new Error("Invalid namespace: " + array.slice(0, index +1).join("."));
            scope = scope[entry];
        });
        
        return scope; 
    };
};

/**
 *  Enhancement of the JavaScript API
 *  Adds a function for creating a alhpanumeric (U)UID with fixed size to the
 *  Math object.
 *  @param size optional, default is 16
 */
if (Math.uniqueId === undefined) {
    Math.uniqueId = function(size) {
        size = size || 16;
        if (size < 0)
            sitze = 16;
        var unique = "";
        for (var loop = 0; loop < size; loop++) {
            var random = Math.floor(Math.random() * Math.floor(26));
            if ((Math.floor(Math.random() * Math.floor(26))) % 2 == 0)
                unique += String(random % 10);
            else unique += String.fromCharCode(65 +random); 
        }
        return unique;
    };
};

/**
 *  Enhancement of the JavaScript API
 *  Adds a capitalize function to the String objects.
 */ 
if (String.prototype.capitalize === undefined) {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
};

/**
 *  Enhancement of the JavaScript API
 *  Adds a function for encoding the string objects in hexadecimal code.
 */      
if (String.prototype.encodeHex === undefined) {
    String.prototype.encodeHex = function() {
        var text = this;
        var result = "";
        for (var loop = 0; loop < text.length; loop++) {
            var digit = Number(text.charCodeAt(loop)).toString(16).toUpperCase();
            while (digit.length < 2)
                digit = "0" + digit;            
            result += digit;
        }
        return "0x" + result;
    };
};

/**
 *  Enhancement of the JavaScript API
 *  Adds a function for decoding hexadecimal code to the string objects.
 */     
if (String.prototype.decodeHex === undefined) {
    String.prototype.decodeHex = function() {
        var text = this;
        if (text.match(/^0x/))
            text = text.substring(2);
        var result = "";
        for (var loop = 0; loop < text.length; loop += 2)
            result += String.fromCharCode(parseInt(text.substr(loop, 2), 16));
        return result;
    };
};

/**
 *  Enhancement of the JavaScript API
 *  Adds a method for encoding Base64.
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
}; 

/**
 *  Enhancement of the JavaScript API
 *  Adds a method for decoding Base64.
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
};

/**
 *  Enhancement of the JavaScript API
 *  Adds a HTML encode function to the String objects.
 */ 
if (String.prototype.encodeHtml === undefined) {
    String.prototype.encodeHtml = function() {
        var element = document.createElement("div");
        element.textContent = this;
        return element.innerHTML;
    };
}; 

/**
 *  Enhancement of the JavaScript API
 *  Adds a method for calculating a hash value.
 */ 
if (String.prototype.hashCode === undefined) {
    String.prototype.hashCode = function() {
        if (this.hash == undefined)
            this.hash = 0;
        if (this.hash != 0)
            return this.hash;
        for (var loop = 0, hops = 0; loop < this.length; loop++) {
            var temp = 31 *this.hash +this.charCodeAt(loop);
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
}; 

/**
 *  Enhancement of the JavaScript API
 *  Adds a decode of slash sequences (control characters).
 */ 
if (String.prototype.unescape === undefined) {
    String.prototype.unescape = function() {
        var text = this;
        text = text.replace(/\r/g, "\\r");
        text = text.replace(/\n/g, "\\n");
        text = text.replace(/^(["'])/, "\$1");
        text = text.replace(/([^\\])((?:\\{2})*)(?=["'])/g, "$1$2\\");
        return eval("\"" + text + "\"");
    };
};

/**
 *  Enhancement of the JavaScript API
 *  Modifies the method to support note and notes as NodeList and Array.
 *  If the option exclusive is used, existing children will be removed first.
 *  @param node      node(s)
 *  @param exclusive existing children will be removed first
 */
Element.prototype.internalAppendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(node, exclusive) {
    if (exclusive)
        this.innerHTML = "";
    if (node instanceof Node) {
        this.internalAppendChild(node);
    } else if (Array.isArray(node)
            || node instanceof NodeList
            || (Symbol && Symbol.iterator
                    && node && typeof node[Symbol.iterator])) {
        node = Array.from(node);
        for (var loop = 0; loop < node.length; loop++)
            this.internalAppendChild(node[loop]);
    } else this.internalAppendChild(node);
};

/**
 *  Enhancement of the JavaScript API
 *  Returns a literal pattern for the specified text.
 *  Metacharacters or escape sequences in the text thus lose their meaning.
 *  @param  text text to be literalized
 *  @return a literal pattern for the specified text 
 */
if (RegExp.quote === undefined) {
    RegExp.quote = function(text) {
        if (text == null
                || text == undefined)
            return null;
        return String(text).replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
    };
};

/**
 *  Enhancement of the JavaScript API
 *  Adds a property to get the UID for the window instance.
 */  
if (window.serial === undefined) {
    var timestamp = (new Date().getTime() -946684800000).toString(36);
    window.serial = Math.uniqueId(10) + (timestamp.length.toString(36) + timestamp).toUpperCase();
};

/**
 *  Enhancement of the JavaScript API
 *  Adds a property to get the context path.
 *  The context path is the portion of the request URI that is used to select
 *  the context of the request and can be compared with the current working
 *  directory.
 */  
if (window.location.pathcontext === undefined) {
    window.location.pathcontext = window.location.pathname.replace(/\/([^\/]*\.[^\/]*){0,}$/g, "") || "/";
};

/**
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
 *  DataSource 1.0 20190520
 *  Copyright (C) 2019 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20190520
 */
if (typeof DataSource === "undefined") {
    
    /** Static component for the access and transforming of XML data. */  
    DataSource = {};
    
    /** Internal cache of locales.xml */
    DataSource.data;

    /** List of available locales */
    DataSource.locales;

    /** Internal cache of XML/XSLT data. */
    DataSource.cache;
    
    /** Path of the DataSource for: data (sub-directory of work path) */
    DataSource.DATA = window.location.pathcontext + "/data";

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
    DataSource.locale;
    
    (function() {
        
        var locale = (navigator.browserLanguage || navigator.language || "").trim().toLowerCase();
        locale = locale.match(/^([a-z]+)/);
        if (!locale)
            throw new Error("Locale not available");
        DataSource.locale = locale[0];
        
        var request;
        request = new XMLHttpRequest();
        request.open("GET", DataSource.DATA + "/locales.xml", false);
        request.overrideMimeType("application/xslt+xml");
        request.send();

        if (request.status == 200)
            DataSource.data = request.responseXML;
        if (!DataSource.data
                && request.status != 404)
            throw new Error("Locale not available");
        
        DataSource.locales = [];
        if (!DataSource.data)
            return;
        
        var xml = DataSource.data;
        var nodes = xml.evaluate("/locales/*", xml, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        for (var node = nodes.iterateNext(); node; node = nodes.iterateNext()) {
            var name = node.nodeName.toLowerCase();
            DataSource.locales.push(node.nodeName);
        }
        
        locale = DataSource.locale;
        if (!xml.evaluate("count(/locales/" + locale + ")", xml, null, XPathResult.ANY_TYPE, null).numberValue)
            locale = xml.evaluate("/locales/*[@default]", xml, null, XPathResult.ANY_TYPE, null).iterateNext().nodeName.toLowerCase();
        if (!locale)
            throw new Error("Locale not available");
        DataSource.locale = locale;
    })();
    
    /**
     *  Changes the localization of the DataSource.
     *  Only locales from locales.xml can be used, other values cause an
     *  exception.
     *  @para  locale
     *  @throws Error in the case of invalid locales
     */
    DataSource.localize = function(locale) {
        
        if (!DataSource.data
                || !DataSource.locales) 
            throw new Error("Locale not available");

        locale = (locale || "").trim().toLowerCase();
        if (!locale
                || !DataSource.locales.includes(locale))
            throw new Error("Locale not available");

        DataSource.locale = locale;
    };
    
    /**
     *  Transforms an XMLDocument based on a passed stylesheet.
     *  The data and the stylesheet can be passed as Locator, XMLDocument and in
     *  mix. The result as a node. In some browsers, the XSLTProcessor may
     *  create a container object, which is removed automatically. With the
     *  option raw the cleanup can be deactivated.
     *  @param  xml   locator or XMLDocument
     *  @param  style locator or XMLDocument 
     *  @param  raw   option in combination with transform
     *      true returns the complete XML document, otherwise only the root
     *      entity as node 
     *  @return the transformation result as a node
     */
    DataSource.transform = function(xml, style, raw) {
        
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
        
        //The escape attribute converts text to HTML.
        //Without the escape attribute, the HTML tag symbols < and > are masked
        //and output as text.
        
        var escape = xml.evaluate("string(/*/@escape)", xml, null, XPathResult.ANY_TYPE, null).stringValue;
        escape = !!escape.match(/^yes|on|true|1$/i);
        
        var result = processor.transformToDocument(xml);
        var nodes = result.querySelectorAll(escape ? "*" : "*[escape]");
        nodes.forEach((node, index, array) => {
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
        nodes.forEach((node, index, array) => {
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
     *  Fetch the data to a locator as XMLDocument.
     *  Optionally the data can be transformed via XSLT.
     *  @param  locators  locator
     *  @param  transform locator of the transformation style
     *  @param  raw       option in combination with transform
     *      true returns the complete XML document, otherwise only the root
     *      entity as node
     *  @return the fetched data, optionally transformed, as XMLDocument or the
     *      root entity as a node when the combination transform and raw is used
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
            if (request.status != 200)
                throw new Error("HTTP status " + request.status + " for " + request.responseURL);
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
            if (!arguments[0].match(/[a-z]\w+/i))
                throw new TypeError("Invalid collector");
            collector = arguments[0];
            collection = collection.concat(arguments[1]);
        } else if (arguments.length == 1
                && Array.isArray(arguments[0])) {
            collection = collection.concat(arguments[0]);
        } else {
            for (var loop = 0; loop < arguments.length; loop++)
                collection.push(arguments[loop]);
        }
        
        DataSource.cache = DataSource.cache || {};
        var hash = collection.join().hashCode();
        collection.forEach((entry, index, array) => {
            hash += ":" + String(entry).hashCode();
        });
        if (DataSource.cache.hasOwnProperty(hash))
            return DataSource.cache[hash].clone();  

        var root = document.implementation.createDocument(null, collector, null, null);
        collection.forEach((entry, index, array) => {
            if (typeof entry !== "string")
                throw TypeError("Invalid collection entry");
            root.documentElement.appendChild(DataSource.fetch(entry).documentElement.cloneNode(true));
        });

        DataSource.cache[hash] = root;
        return root.clone();
    };
};

/**
 *  (Resource)Messages is a static DataSource extension for internationalization
 *  and localization. The implementation is based on a set of key-value or
 *  label-value data which is stored in the locales.xml of the DataSource.
 *  
 *      +- data
 *      |  |
 *      |  +- de...
 *      |  +- en...
 *      |  +- locales.xml
 *      |
 *      +- modules
 *      +- resources
 *      +- index.html
 *  
 *  The elements for the supported languages are organized in locales in this
 *  file. Locales is a set of supported country codes. In each country code, the
 *  key values are recorded as label entries.  
 *    
 *  <?xml version="1.0" encoding="ISO-8859-1"?>
 *  <locales>
 *    <de>
 *      <label key="contact.title" value="Kontakt"/>
 *      <label key="contact.development.title">Entwicklung</label>
 *      ...
 *    </de>
 *    <en default="true">
 *      <label key="contact.title" value="Contact"/>
 *      <label key="contact.development.title">Development</label>
 *      ...
 *    </en>
 *  </locales>
 *  
 *  The language is selected automatically on the basis of the language setting
 *  of the browser. If the language set there is not supported, the language
 *  declared as 'default' is used.
 *  
 *  After loading the application, Messages are available as an assosiative
 *  array and can be used directly in JavaScript and Markup via Expression
 *  Language.
 *  
 *  Messages["contact.title"];
 *      
 *  <h1 output="{{Messages['contact.title']}}"/>
 *  
 *  Messages 1.0 20190520
 *  Copyright (C) 2019 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20190520
 */
if (typeof Messages === "undefined") {
    
    /**
     *  (Resource)Messages is a static DataSource extension for localization and
     *  internationalization. The implementation is based on a set of key-value
     *  or label-value data.
     */
    Messages = {};
    
    (function() {

        //Messages are based on DataSources.
        //To initialize, the DataSource.localize method must be overwritten and
        //loading of the key-value pairs is embedded.
        var localize = DataSource.localize;
        DataSource.localize = function(locale) {
            for (var property in Messages)
                if (typeof Messages[property] == "string")
                    delete Messages[property];
            DataSource.localize.internal(locale);

            var xpath = "/locales/" + DataSource.locale + "/label";
            var label = DataSource.data.evaluate(xpath, DataSource.data, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            for (var node = label.iterateNext(); node; node = label.iterateNext()) {
                var key = (node.getAttribute("key") || "").trim();
                if (key == "")
                    continue;
                var value = ((node.getAttribute("value") || "").trim()
                        + " " + (node.textContent).trim()).trim();
                value = value.unescape();
                Messages[key] = value;
            }
        };
        
        DataSource.localize.internal = localize;
        
        if (DataSource.data
                && DataSource.locale
                && DataSource.locales
                && DataSource.locales.includes(DataSource.locale))
            DataSource.localize(DataSource.locale);
    })();
};

/**
 *  With aspect-js the declarative approach of HTML is taken up and extended.
 *  In addition to the expression language, the HTML elements are provided with
 *  additional attributes for functions and object binding attributes.
 *  The corresponding renderer is included in the composite implementation and
 *  actively monitors the DOM via the MutationObserver and thus reacts
 *  recursively to changes in the DOM.
 *  
 *  
 *      TERMS
 *      ----
 *      
 *          namespace
 *          ----
 *  The namespace is a sequence of characters or words consisting of letters,
 *  numbers, and an underscore that describes the path in an object tree. The
 *  dot is used as a separator, it defines the boundary from one level to the
 *  next in the object tree. Each element in the namespace must contain at least
 *  one character, begin with a letter, and end with a letter or number.
 *  
 *          scope
 *          ----
 *  The scope is based on namespace and represents it on the object level. Means
 *  the namespace is the description text, the scope is the result if the 
 *  namespace was resolved in the object tree.
 *  
 *          model
 *          ----
 *  The model (model component / component) is a static JavaScript object in any
 *  namespace and provides the logic for the user interface (UI component) and
 *  the transition from user interface to business logic and/or the backend. The
 *  linking and/or binding of markup and JavaSchript model is done by the
 *  Composite-API. For this purpose, an HTML element must be marked with the
 *  attribute `composite` and have a valid Composite-ID. The Composite-ID must
 *  meet the requirements of the namespace.
 *  
 *          property
 *          ----
 *  Is a property in a static model (model component / component). It
 *  corresponds to an HTML element with the same ID in the same namespace. The
 *  ID of the property can be relative or use an absolute namespace. If the ID
 *  is relative, the namespace is defined by the parent composite element.
 *  
 *          qualifier
 *          ----
 *  In some cases, the identifier (ID) may not be unique. For example, in cases
 *  where properties are arrays or an iteration is used. In these cases the
 *  identifier can be extended by an additional unique qualifier separated by a
 *  colon.
 *  Qualifiers are ignored during object/model binding.
 *  
 *          composite
 *          ----
 *  Composite describes the construct of markup, JavaScript model, and possibly
 *  existing module resources. It describes a component/module without direct
 *  reference to a concrete perspective.
 *  
 *          composite-id
 *          ----
 *  The Composite-ID is an application-wide unique identifier.
 *  It is a sequence of characters or words consisting of letters, numbers, and
 *  underscores that contains at least one character, begins with a letter, and
 *  ends with a letter or number. A Composite-ID is formed by combining the
 *  attributes `ID` and `composite`.
 *  
 *  
 *      PRINCIPLES
 *      ----
 *      
 *  The world is static. So also aspect-js and all components. This avoids the
 *  management and establishment of instances.
 *  
 *  Composite attributes are elementary and immutable.
 *  They are read the first time an element occurs and stored in the object
 *  cache. Therefore, these attributes cannot be changed later because they are
 *  then used from the object cache.
 *  
 *  Attributes of elements are elementary and immutable even if they contain an
 *  expression.
 *  
 *  Clean Code Rendering - The aspect-js relevant attributes are stored in meta
 *  objects to each element and are removed in the markup. The following
 *  attributes are essential: composite, id -- they are cached and remain at the
 *  markup, these cannot be changed. the MutationObserver will restore them.
 *  
 *  Markup/DOM, object tree and virtual paths are analog/homogeneous.
 *  Thus virtual paths, object structure in JavaScript (namespace) and the
 *  nesting of the DOM must match.
 *        
 *  Composite 1.0 20190412
 *  Copyright (C) 2019 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20190412
 */
if (typeof Composite === "undefined") {
    
    /**
     *  Static component for rendering and object binding.
     *  The processing runs in the background and starts automatically when a
     *  page is loaded.
     */
    Composite = {};
    
    /** Assoziative array for custom tags (key:tag, value:function) */
    Composite.macros;

    /** Assoziative array for custom selectors (key:hash, value:{selector, function}) */
    Composite.selectors;
    
    /** Assoziative array with acceptor and their registered listerners */
    Composite.acceptors;

    /** Assoziative array with events and their registered listerners */
    Composite.listeners;
    
    /** 
     *  Array with docked models.
     *  The array is used for the logic to call the dock and undock methods,
     *  because the static models themselves have no status and the decision
     *  about the current existence in the DOM is not stable.
     *  All docked models are included in the array.
     */
    Composite.models;
    
    /** Path of the Composite for: moduels (sub-directory of work path) */
    Composite.MODULES = window.location.pathcontext + "/modules";

    /** Constant for attribute composite */
    Composite.ATTRIBUTE_COMPOSITE = "composite";
    
    /** Constant for attribute condition */
    Composite.ATTRIBUTE_CONDITION = "condition";

    /** Constant for attribute events */
    Composite.ATTRIBUTE_EVENTS = "events"; 

    /** Constant for attribute id */
    Composite.ATTRIBUTE_ID = "id";
    
    /** Constant for attribute import */
    Composite.ATTRIBUTE_IMPORT = "import";

    /** Constant for attribute interval */
    Composite.ATTRIBUTE_INTERVAL = "interval";

    /** Constant for attribute iterate */
    Composite.ATTRIBUTE_ITERATE = "iterate";

    /** Constant for attribute name */
    Composite.ATTRIBUTE_NAME = "name";

    /** Constant for attribute output */
    Composite.ATTRIBUTE_OUTPUT = "output";

    /** Constant for attribute render */
    Composite.ATTRIBUTE_RENDER = "render";     
    
    /** Constant for attribute text */
    Composite.ATTRIBUTE_TEXT = "text";    

    /** Constant for attribute type */
    Composite.ATTRIBUTE_TYPE = "type";
    
    /** Constant for attribute validate */
    Composite.ATTRIBUTE_VALIDATE = "validate";
    
    /** Constant for attribute value */
    Composite.ATTRIBUTE_VALUE = "value";

    /**
     *  Pattern for all accepted attributes.
     *  Accepted attributes are all attributes, even without an expression that
     *  is cached in the meta object. Other attributes are only cached if they
     *  contain an expression.
     */
    Composite.PATTERN_ATTRIBUTE_ACCEPT = /^composite|condition|events|id|import|interval|iterate|output|render|validate$/i;   
    
    /**
     *  Pattern for all static attributes.
     *  Static attributes are not removed from the element during rendering, but
     *  are also set in the meta object like non-static attributes.
     *  These attributes are also intended for direct use in JavaScript and CSS.
     */
    Composite.PATTERN_ATTRIBUTE_STATIC = /^composite|id$/i;

    /** 
     *  Pattern to detect if a string contains an expression.
     *  Escaping characters via slash is supported.
     */
    Composite.PATTERN_EXPRESSION_CONTAINS = /\{\{((?:(?:.*?[^\\](?:\\\\)*)|(?:(?:\\\\)*))*?)\}\}/g;   
    
    /**
     *  Patterns to test whether an expression is exclusive, i.e. an expression
     *  without additional text fragments before or after.
     *  The test is based on the check that the text has an expression (group 1)
     *  and at the end no more literal or other expressions (group 2) exist.
     */
    Composite.PATTERN_EXPRESSION_EXCLUSIVE = /^\s*\{\{((?:(?:.*?[^\\](?:\\\\)*)|(?:(?:\\\\)*))*?)\}\}\s*(.*)$/;
    
    /**
     *  Patterns for expressions with variable.
     *      group 1: variable
     *      group 2: expression
     */
    Composite.PATTERN_EXPRESSION_VARIABLE = /^\s*(_*[a-z]\w*)\s*:\s*(.*?)\s*$/i;    

    /** Pattern for all to ignore (script-)elements */
    Composite.PATTERN_ELEMENT_IGNORE = /script|style/i;

    /** Pattern for all script elements */
    Composite.PATTERN_SCRIPT = /script/i;

    /** 
     *  Pattern for all composite-script elements.
     *  These elements are not automatically executed by the browser but must be
     *  triggered by rendering. Therefore, these scripts can be combined and
     *  controlled with the condition attribute.
     */
    Composite.PATTERN_COMPOSITE_SCRIPT = /^composite\/javascript$/i;

    /** Pattern for a composite id */
    Composite.PATTERN_COMPOSITE_ID = /^(?:[a-z]\w*)*$/i;

    /**
     *  Pattern for a element id
     *      group 1: model, optionally with (full qualified) namespace
     *      group 2: property, only with an extended namespace
     *      group 3: qualifier (optional)
     */
    Composite.PATTERN_ELEMENT_ID = /^(?:((?:[a-z]\w*)(?:\.(?:[a-z]\w*))*)\.)*([a-z]\w*)(?:\:(\w*))*$/i;
    
    /** Pattern for a scope (namespace) */
    Composite.PATTERN_CUSTOMIZE_SCOPE = /^[a-z](?:(?:\w*)|([\-\w]*\w))$/i;
    
    /** Pattern for a datasource url */
    Composite.PATTERN_DATASOURCE_URL = /^\s*xml:\s*(\/[^\s]+)\s*(?:\s*(?:xslt|xsl):\s*(\/[^\s]+))*$/i;

    /** Pattern for all accepted events */
    Composite.PATTERN_EVENT = /^([A-Z][a-z]+)+$/;
    
    /** Constants of events during rendering */
    Composite.EVENT_RENDER_START = "RenderStart";
    Composite.EVENT_RENDER_NEXT = "RenderNext";
    Composite.EVENT_RENDER_END = "RenderEnd";

    /** Constants of events during scanning */
    Composite.EVENT_SCAN_START = "ScanStart";
    Composite.EVENT_SCAN_NEXT = "ScanNext";
    Composite.EVENT_SCAN_END = "ScanEnd";

    /** Constants of events during mounting */
    Composite.EVENT_MOUNT_START = "MountStart";
    Composite.EVENT_MOUNT_NEXT = "MountNext";
    Composite.EVENT_MOUNT_END = "MountEnd";

    /** Constants of events when using AJAX */
    Composite.EVENT_AJAX_START = "AjaxStart";
    Composite.EVENT_AJAX_PROGRESS = "AjaxProgress";
    Composite.EVENT_AJAX_RECEIVE = "AjaxReceive";
    Composite.EVENT_AJAX_LOAD = "AjaxLoad";
    Composite.EVENT_AJAX_ABORT = "AjaxAbort";
    Composite.EVENT_AJAX_TIMEOUT = "AjaxTimeout";
    Composite.EVENT_AJAX_ERROR = "AjaxError";
    Composite.EVENT_AJAX_END = "AjaxEnd";

    /** Constants of events when errors occur */
    Composite.EVENT_ERROR = "Error";
    
    /** 
     *  List of possible DOM events
     *  see also https://www.w3schools.com/jsref/dom_obj_event.asp
     */
    Composite.events = "abort after|print animation|end animation|iteration animation|start"
        + " before|print before|unload blur"
        + " can|play can|play|through change click context|menu copy cut"
        + " dbl|click drag drag|end drag|enter drag|leave drag|over drag|start drop duration|change"
        + " ended error"
        + " focus focus|in focus|out"
        + " hash|change"
        + " input invalid"
        + " key|down key|press key|up"
        + " load loaded|data loaded|meta|data load|start"
        + " message mouse|down mouse|enter mouse|leave mouse|move mouse|over mouse|out mouse|up mouse|wheel"
        + " offline online open"
        + " page|hide page|show paste pause play playing popstate progress"
        + " rate|change resize reset"
        + " scroll search seeked seeking select show stalled storage submit suspend"
        + " time|update toggle touch|cancel touch|end touch|move touch|start transition|end"
        + " unload"
        + " volume|change"
        + " waiting wheel";
    
    /** Patterns with the supported events */
    Composite.PATTERN_EVENT_FUNCTIONS = (function() {
        var pattern = Composite.events.replace(/(?:\||\b)(\w)/g, (match, letter) => {
           return letter.toUpperCase();
        });
        pattern = new RegExp("^on(" + pattern.replace(/\s+/g, "|") + ")");
        return pattern;
    })();
    
    /**
     *  Lock mechanism for the render, mound and scan methods. The lock controls
     *  that the methods are not used concurrently and/or asynchronously. Each
     *  method opens its own transaction (lock). During a transaction, the
     *  method call requires a lock. If this lock does not exist or differs from
     *  the current transaction, the method call is parked in a queue until the
     *  current lock is released. The methods themselves can call themselves
     *  recursively and do so with the lock they know.
     *  In addition to the lock mechanism, the methods also control the START,
     *  NEXT, and END events.
     *  @param  context  method (render, mound or scan)
     *  @param  selector
     *  @return the created lock as meta object
     */
    Composite.lock = function(context, selector) {
        
        context.queue = context.queue || [];

        if (context.lock === undefined
                || context.lock === false) {
            context.lock = {ticks:1, selector:selector, queue:[],
                    share:function() {
                        this.ticks++;
                        return this;
                    },
                    release:function() {
                        this.ticks--;
                        if (this.ticks > 0)
                            return;
                        context.lock = false;
                        if (context == Composite.render) {
                            Composite.fire(Composite.EVENT_RENDER_END, this.selector);
                            Composite.scan(this.selector);
                        } else if (context == Composite.mount) {
                            Composite.fire(Composite.EVENT_MOUNT_END, this.selector);
                        } else if (context == Composite.scan) {
                            Composite.fire(Composite.EVENT_SCAN_END, this.selector);
                        } else throw new Error("Invalid context: " + context);
                        var selector = context.queue.shift();
                        if (selector)
                            context.call(null, selector);  
                }};
            
            if (context == Composite.render)
                Composite.fire(Composite.EVENT_RENDER_START, this.selector);
            else if (context == Composite.mount)
                Composite.fire(Composite.EVENT_MOUNT_START, this.selector);
            else if (context == Composite.scan)
                Composite.fire(Composite.EVENT_SCAN_START, this.selector);
            else throw new Error("Invalid context: " + context);            
        } else {
            if (context == Composite.render)
                Composite.fire(Composite.EVENT_RENDER_NEXT, this.selector);
            else if (context == Composite.mount)
                Composite.fire(Composite.EVENT_MOUNT_NEXT, this.selector);
            else if (context == Composite.scan)
                Composite.fire(Composite.EVENT_SCAN_NEXT, this.selector);
            else throw new Error("Invalid context: " + context);            
        }
        
        return context.lock;
    };

    /**
     *  Enhancement of the JavaScript API
     *  Adds a static counter for assigning serial IDs to the object.
     */    
    if (Object.indication === undefined)
        Object.indication = 0;
    
    /**
     *  Enhancement of the JavaScript API
     *  Adds a function for getting the serial ID to the objects.
     */ 
    if (Object.prototype.ordinal === undefined) {
        Object.prototype.ordinal = function() {
            this.serial = this.serial || ++Object.indication;
            return this.serial;
        };     
    };
    
    /**
     *  Enhancement of the JavaScript API
     *  Adds a static function to determine an object via the namespace.
     */ 
    if (Object.lookup === undefined)
        Object.lookup = function(namespace) {
            namespace = (namespace || "").trim().split(/\./);
            if (!namespace
                    || namespace.length <= 0)
                return null;
            var scope = window;
            for (var index = 0; scope && index < namespace.length; index++) {
                if (namespace[index] in scope
                        && scope[namespace[index]] instanceof Object)
                    scope = scope[namespace[index]];
                else return null;
            }
            return scope;
        };
        
    /**
     *  Enhancement of the JavaScript API
     *  Adds a static function to check whether an object exists in a namespace.
     */ 
    if (Object.exists === undefined)
        Object.exists = function(namespace) {
            return Object.lookup(namespace) != null; 
        };        

    /**
     *  Enhancement of the JavaScript API
     *  Implements an own open method for event management.
     *  The original method is reused in the background.
     */ 
    XMLHttpRequest.prototype.internalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(variants) {

        var callback = function() {
            if (arguments.length > 0) {
                var event = arguments[0];
                if (event.type == "loadstart")
                    event = Composite.EVENT_AJAX_START;
                else if (event.type == "progress")
                    event = Composite.EVENT_AJAX_PROGRESS; 
                else if (event.type == "readystatechange")
                    event = Composite.EVENT_AJAX_RECEIVE; 
                else if (event.type == "load")
                    event = Composite.EVENT_AJAX_LOAD; 
                else if (event.type == "abort")
                    event = Composite.EVENT_AJAX_ABORT; 
                else if (event.type == "error")
                    event = Composite.EVENT_AJAX_ERROR;   
                else if (event.type == "timeout")
                    event = Composite.EVENT_AJAX_TIMEOUT;   
                else if (event.type == "loadend")
                    event = Composite.EVENT_AJAX_END; 
                else return;
                Composite.fire(event, arguments[0]); 
            }
        };
        
        if (typeof this.internalInit === "undefined") {
            this.internalInit = true;
            this.addEventListener("loadstart", callback);
            this.addEventListener("progress", callback);
            this.addEventListener("readystatechange", callback);
            this.addEventListener("load", callback);
            this.addEventListener("abort", callback);
            this.addEventListener("error", callback);
            this.addEventListener("timeout", callback);
            this.addEventListener("loadend", callback);
        }
        
        this.internalOpen.apply(this, arguments);
    };
    
    /**
     *  Registers a callback function for composite events.
     *  @param  event    see Composite.EVENT_***
     *  @param  callback callback function
     *  @throws An error occurs in the following cases:
     *      - event is not valid or is not supported
     *      - callback function is not implemented correctly or does not exist
     */
    Composite.listen = function(event, callback) {
        
        if (typeof event !== "string")
            throw new TypeError("Invalid event: " + typeof event);
        if (typeof callback !== "function"
                && callback !== null
                && callback !== undefined)
            throw new TypeError("Invalid callback: " + typeof callback);        
        if (!event.match(Composite.PATTERN_EVENT))
            throw new Error("Invalid event" + (event.trim() ? ": " + event : ""));
        
        event = event.toLowerCase();
        Composite.listeners = Composite.listeners || [];
        if (!Array.isArray(Composite.listeners[event]))
            Composite.listeners[event] = [];
        Composite.listeners[event].push(callback);
    };
    
    /**
     *  Triggers an event.
     *  All callback functions for this event are called.
     *  @param event    see Composite.EVENT_***
     *  @param variants up to five additional optional arguments that are passed
     *                  as arguments when the callback function is called
     */
    Composite.fire = function(event, variants) {

        event = (event || "").trim();
        if (!Composite.listeners
                || !event)
            return;
        var listeners = Composite.listeners[event.toLowerCase()];
        if (!Array.isArray(listeners))
            return;
        variants = Array.from(arguments);
        variants = variants.slice(1);
        variants.unshift(event);
        listeners.forEach((callback, index, array) => {
            callback.apply(null, variants);
        });        
    };

    /**
     *  Asynchronous call of a function.
     *  In reality, it is a non-blocking function call, because asynchronous
     *  execution is not possible without Web Worker.
     *  @param task     function to be executed
     *  @param variants up to five additional optional arguments that are passed
     *                  as arguments when the callback function is called
     */
    Composite.asynchron = function(task, variants) {
        
        arguments = Array.from(arguments);
        arguments = arguments.slice(2);
        window.setTimeout((invoke, variants) => {
            invoke.apply(null, variants);
        }, 0, task, arguments);
    };
    
    /**
     *  Mounts the as selector passed element with all its children where an
     *  object/model binding is possible. Mount is possible for all elements
     *  with an ID, not only for composite objects and their children.
     *  
     *  The object/model binding is about connecting markup/HTML elements with
     *  JavaScript models. The models, also known as components, are static
     *  constructs/classes in which properties and logic corresponding to the
     *  markup/DOM are implemented. This avoids manual implementation and
     *  declaration of events as well as synchronization and interaction between
     *  UI and the application logic.
     *  
     *      Principles
     *      ----
     *  Components are a static JavaScript models.
     *  Namespaces are supported, but they must be syntactically valid.
     *  Objects in objects is possible through the namespaces (as static inner
     *  class).
     *  
     *      Binding
     *      ----
     *  The object constraint only includes what has been implemented in the
     *  model (snapshot). An automatic extension of the models at runtime by the
     *  renderer is not detected/supported, but can be implemented in the
     *  application logic - this is a conscious decision!
     *      Case study:
     *  In the markup there is a composite with a property x. There is a
     *  corresponding JavaScript model for the composite but without the
     *  property x. The renderer will mount the composite with the JavaScript
     *  model, the property x will not be found in the model and will be
     *  ignored. At runtime, the model is modified later and the property x is
     *  added. The renderer will not detect the change in the model and the
     *  property x will not be mounted during re-rendering. Only when the
     *  composite is completely removed from the DOM (e.g. by a condition) and
     *  then newly added to the DOM, the property x is also mounted, because the
     *  renderer then uses the current snapshot of the model and the property x
     *  also exists in the model.
     *  
     *      Synchronization
     *      ----
     *  The object binding and synchronization assume that a model corresponding
     *  to the composite exists with the same namespace. During synchronization,
     *  the element must also exist as a property in the model.
     *  
     *      Events
     *      ----
     *  Composite.EVENT_MOUNT_START
     *  Composite.EVENT_MOUNT_NEXT
     *  Composite.EVENT_MOUNT_END
     *  
     *      Queue and Lock:
     *      ----
     *  The method used a simple queue and transaction management so that the
     *  concurrent execution of rendering works sequentially in the order of the
     *  method call.
     * 
     *  @throws An error occurs in the following cases:
     *      - namespace is not valid or is not supported
     *      - namespace cannot be created if it already exists as a method
     */
    Composite.mount = function(selector, lock) {
        
        Composite.mount.queue = Composite.mount.queue || [];
        
        //The lock locks concurrent mount requests.
        //Concurrent mounting causes unexpected effects.
        if (Composite.mount.lock
                && Composite.mount.lock != lock) {
            if (!Composite.mount.queue.includes(selector))
                Composite.mount.queue.push(selector);
            return;
        }

        var lock = Composite.lock(Composite.mount, selector);
            
        try {
            
            if (typeof selector === "string") {
                selector = selector.trim();
                if (!selector)
                    return;
                var nodes = document.querySelectorAll(selector);
                nodes.forEach((node, index, array) => {
                    Composite.mount(node, lock.share());
                });
                return; 
            }

            if (!(selector instanceof Element))
                return;
            
            //There must be a corresponding model class.
            var model = Composite.mount.lookup(selector);
            if (!(model instanceof Object)
                    || model instanceof Element)
                return;

            //No multiple object binding
            if (Composite.mount.queue.includes(selector))
                return;
            
            var serial = selector.ordinal();
            var object = Composite.render.meta[serial] || {};
            var events = object.events || {};
            
            //Registers all events that are implemented in the model.
            //With the attribute 'events' the events are registered and executed
            //during the rendering. The reason is the combination of the
            //attributes events + render. The re-rendering of the targets only
            //makes sense after executing the event methods. Only in this way
            //can the results and changes that the event methods cause be used
            //in the re-rendering. In this case, all event-methods which are
            //used during the rendering are registered and collected. Only event
            //methods that are not registered during rendering can be registered
            //here.
            
            model = model.scope[model.property];
            for (var entry in model)
                if (typeof model[entry] === "function"
                        && entry.match(Composite.PATTERN_EVENT_FUNCTIONS)
                        && typeof events[entry.substring(2).toLowerCase()] !== "function")
                    selector.addEventListener(entry.substring(2).toLowerCase(), model[entry]);

        } finally {
            lock.release();
        }        
    };
    
    /**
     *  Determines the namespace for a composite element as meta object.
     *
     *  Composite:
     *      {composite:scope, model}
     *  Composite Element:
     *      {composite:scope, model, property, name:qualifier}
     *
     *  The namespace is created based on the parent composite elements
     *  (elements with the attribute 'composite'), but also includes the passed
     *  element if it is a composite itself.
     *  The IDs of the composite elements constitute the namespace in order of
     *  their position in the DOM.
     *  @param  element
     *  @return the determined namespace as meta object, otherwise null
     *  @throws An error occurs in the following cases:
     *      - a composite does not have an ID
     *      - in the case of an invalid composite ID
     */
    Composite.mount.locate = function(element) {
        
        if (!(element instanceof Element))
            return null;

        var serial = (element.getAttribute(Composite.ATTRIBUTE_ID) || "").trim();

        //Composites have a meta object where only composite and model are filled.
        if (element.hasAttribute(Composite.ATTRIBUTE_COMPOSITE)) {
            if (!serial.match(Composite.PATTERN_COMPOSITE_ID))
                throw new Error("Invalid composite id" + (serial ? ": " + serial : ""));
            if (!Object.lookup(serial))
                return null;
            return {composite:serial, model:serial, property:null, name:null};
        }

        //Splitting of the element ID into:
        //   model, property, qualifier (optional)
        var meta = serial.match(Composite.PATTERN_ELEMENT_ID);
        if (!meta)
            return null;
        
        meta = {composite:null, model:meta[1], property:meta[2], name:meta[3]};
        
        for (var scope = element; scope; scope = scope.parentNode) {
            if (!(scope instanceof Element)
                    || !scope.hasAttribute(Composite.ATTRIBUTE_COMPOSITE))
                continue;
            var serial = (scope.getAttribute(Composite.ATTRIBUTE_ID) || "").trim();
            if (!serial.match(Composite.PATTERN_COMPOSITE_ID))
                throw new Error("Invalid composite id" + (serial ? ": " + serial : ""));
            serial = serial.replace(/:.*$/, "");
            if (meta.composite)
                meta.composite = "." + meta.composite;
            meta.composite = serial + (meta.composite || "");
        }
        
        if (meta.composite
                && !Object.lookup(meta.composite))
            return null;
        
        //If the ID contains a dot (meta.model exists), it can be an ID with an
        //absolute namespace or the ID is relative to the namespace of the
        //composite. Both cases will be evaluated. The ID with the relative
        //namespace of the composite has higher priority.
        //So after the last dot the ID of the element and before it the
        //namespace must be contained. The id will be removed at the end and the
        //namespace remains.
        //The qualifier is passed through in both cases, but not tested.
        if (meta.model) {
            if (meta.composite) {
                var scope = Object.lookup(meta.composite + "." + meta.model);
                if (scope && scope.hasOwnProperty(meta.property)) {
                    meta.model = meta.composite + "." + meta.model;
                    return meta;
                }
            }
            var scope = Object.lookup(meta.model);
            if (scope && scope.hasOwnProperty(meta.property))
                return meta;
            return null;
        }

        //Without an additional namespace, the property must exist relative to
        //the composite. The composite thus represents the complete namespace.
        //The qualifier is passed through in both cases, but not tested.
        if (!meta.composite)
            return null;
        meta.model = meta.composite;
        var scope = Object.lookup(meta.model);
        if (scope && scope.hasOwnProperty(meta.property))
            return meta;
        return null;
    };
    
    /**
     *  Determines the meta informations as object for an element.
     *  
     *      {scope, model, property, name:qualifier}
     *      
     *  The method always requires a corresponding JavaScript model and an
     *  element with an ID. The ID can be relative or absolute/full qualified.
     *  For relative IDs, the namespace is determined from the higher-level
     *  composite structure in the DOM. Absolute IDs refer directly to the
     *  namespace to be used. If no corresponding namespace/JavaScript model can
     *  be determined, the method returns null.
     *  
     *  Absolute namespaces contain a dot as a package separator.

     *  The recursive determinaton of the namespace, the higher-level composite
     *  IDs are always regarded as absolute until the first absolute composite
     *  ID occurs, then the recursion/determinaton is interrupted and the
     *  absolute composite ID is used as the basis for the namespace.
     *  Means, it is primarily always searched for an independent model in
     *  JavaScript and only alternatively for a sub-model (inner class).
     *      
     *  @param  element element
     *  @return the created meta object, otherwise null
     *  @throws An error occurs in the following cases:
     *      - in the case of an invalid composite ID 
     */
    Composite.mount.lookup = function(element) {
        
        if (!(element instanceof Element)
                || !element.hasAttribute(Composite.ATTRIBUTE_ID))
            return null;
        
        //Elements and composites use different ID formats.
        //The ID of the composite corresponds to a variable or class name and is
        //always compatible with the ID of an element. The ID of an element can
        //contain additional information such as a qualifying namespace and an
        //individual identifier.
        var serial = (element.getAttribute(Composite.ATTRIBUTE_ID) || "").trim();
        if (element.hasAttribute(Composite.ATTRIBUTE_COMPOSITE))
            serial = serial.match(Composite.PATTERN_COMPOSITE_ID);
        else serial = serial.match(Composite.PATTERN_ELEMENT_ID);
        if (!serial)
            throw new Error("Invalid composite id" + (serial ? ": " + serial : ""));
        
        //Determines the meta-data for the model:
        //    composite (optional), model, property, name (optional)
        //Locale only returns a meta-object if a corresponding JavaScript model
        //exists for the markup/DOM.
        var meta = Composite.mount.locate(element);
        if (!meta)
            return null;
        
        scope = Object.lookup(meta.model);
        if (!scope)
            return null;
        
        //The meta-object for the return value is created.
        //For composite elements, this only contains the scope and model.
        if (element.hasAttribute(Composite.ATTRIBUTE_COMPOSITE))
            return {scope:scope, model:meta.model};

        return {composite:{scope:scope, model:meta.model},
            scope:scope, model:meta.model, property:meta.property, name:meta.name};
    };
    
    /**
     *  Scans the as selector passed element with all its children for composite
     *  elements where an object/model binding is possible. The binding itself
     *  is delegated to the mount method.
     *  
     *      Events
     *      ----
     *  Composite.EVENT_SCAN_START
     *  Composite.EVENT_SCAN_NEXT
     *  Composite.EVENT_SCAN_END
     *   
     *      Queue and Lock:
     *      ----
     *  The method used a simple queue and transaction management so that the
     *  concurrent execution of scanning works sequentially in the order of the
     *  method call.
     */
    Composite.scan = function(selector, lock) {
       
        Composite.scan.queue = Composite.scan.queue || [];
        
        //The lock locks concurrent scan requests.
        //Concurrent scaning causes unexpected effects.
        if (Composite.scan.lock
                && Composite.scan.lock != lock) {
            if (!Composite.scan.queue.includes(selector))
                Composite.scan.queue.push(selector);
            return;
        }

        var lock = Composite.lock(Composite.scan, selector);
            
        try {

            if (typeof selector === "string") {
                selector = selector.trim();
                if (!selector)
                    return;
                var nodes = document.querySelectorAll(selector);
                nodes.forEach((node, index, array) => {
                    Composite.scan(node, lock.share());
                });
                return; 
            }

            if (!(selector instanceof Element))
                return;
    
            //Find all elements with an ID in a composite, including the
            //composite itself.
            var nodes = selector.querySelectorAll("[" + Composite.ATTRIBUTE_ID + "]");
            nodes = Array.from(nodes);
            if (!selector.hasAttribute(Composite.ATTRIBUTE_MOUNT))
                nodes.unshift(selector); 
            nodes.forEach((node, index, array) => {
                var serial = (node.getAttribute(Composite.ATTRIBUTE_ID) || "").trim();
                if (serial.match(Composite.PATTERN_ELEMENT_ID))
                    Composite.mount(node);
            });
        } finally {
            lock.release();
        }
    };
    
    /**
     *  There are several ways to customize the renderer.
     *  
     *      Custom Tag (Macro)
     *      ----
     *  Macros are completely user-specific.
     *  The return value determines whether the standard functions are used or
     *  not. Only the return value false (not void, not empty) terminates the
     *  rendering for the macro without using the standard functions of the
     *  rendering.
     *
     *      Composite.customize(tag:string, function(element) {...});
     *  
     *      Custom Selector
     *      ----
     *  Selectors work similar to macros.
     *  Unlike macros, selectors use a CSS selector to detect elements.
     *  This selector must match the current element from the point of view of
     *  the parent. Selectors are more flexible and multifunctional. Therefore
     *  different selectors and thus different functions can match one element.
     *  In this case, all implemented callback methods are performed.
     *  The return value determines whether the loop is aborted or not.
     *  Only the return value false (not void, not empty) terminates the loop
     *  over other selectors and the rendering for the selector without using
     *  the standard functions of the rendering.
     *  
     *      Composite.customize(selector:string, function(element) {...}); 
     *  
     *  Macros and selectors are based on a text key.
     *  If this key is used more than once, existing macros and selectors will
     *  be overwritten.    
     *      
     *      Custom Acceptor
     *      ---
     *  Acceptors are a very special way to customize. Unlike the other ways,
     *  here the rendering is not shifted into own implementations. With a
     *  acceptor, an element is manipulated before rendering and only if the
     *  renderer processes the element initially. This makes it possible to make
     *  individual changes to the attributes or the markup before the renderer
     *  processes them. This does not affect the implementation of the
     *  rendering.
     *  
     *      Composite.customize(function(element) {...});
     * 
     *  @throws An error occurs in the following cases:
     *      - namespace is not valid or is not supported
     *      - callback function is not implemented correctly
     */
    Composite.customize = function(scope, callback) {
        
        //If only one argument of type function is passed, the method is
        //registered as a acceptor.
        if (typeof scope === "function"
                && arguments.length == 1) {
            Composite.acceptors = Composite.acceptors || [];
            Composite.acceptors.push(scope);
            return;
        }
        
        //Custom tags, here also called macro, are based on a case-insensitive
        //tag name (key) and a render function (value). In this function, the
        //tag name and the render functions are registered and a RegExp will be
        //created so that the custom tags can be found faster.
        
        if (typeof scope !== "string")
            throw new TypeError("Invalid scope: " + typeof scope);
        if (typeof callback !== "function"
                && callback !== null
                && callback !== undefined)
            throw new TypeError("Invalid callback: " + typeof callback);
        scope = scope.trim();
        if (scope.length <= 0)
            throw new Error("Invalid scope");
            
        if (scope.match(Composite.PATTERN_CUSTOMIZE_SCOPE)) {
            Composite.macros = Composite.macros || {};
            if (callback == null)
                delete Composite.macros[scope.toLowerCase()];
            else Composite.macros[scope.toLowerCase()] = callback;
        } else {
            var hash = scope.toLowerCase().hashCode();
            Composite.selectors = Composite.selectors || {};
            if (callback == null)
                delete Composite.selectors[hash];
            else Composite.selectors[hash] = {selector:scope, callback:callback};
        } 
    };
    
    /**
     *  Rendering involves updating and, if necessary, reconstructing an HTML
     *  element and all its children. The declarative commands for rendering
     *  (attributes) and the expression language are executed.
     *
     *      Queue and Lock:
     *      ----
     *  The method used a simple queue and transaction management so that the
     *  concurrent execution of rendering works sequentially in the order of the
     *  method call.
     *  
     *      Element Meta Object
     *      ---- 
     *  With the processed HTML elements and text nodes, simplified meta objects
     *  are created. The serial, the reference on the HTML element and the
     *  initial attributes (which are required for rendering) are stored there.
     *  
     *      Serial
     *      ----
     *  Serial is a special extension of the JavaScript API of the object and
     *  creates a unique ID for each object. This ID can be used to compare, map
     *  and reference a wide variety of objects. Composite and rendering use
     *  serial, since this cannot be changed via the markup.  
     *      
     *      Text Node (simple embedded expression)
     *      ----
     *  A text node contain static and dynamic contents as well as parameters.
     *  Dynamic contents and parameters are formulated as expressions, but only
     *  the dynamic contents are output. Parameters are interpreritert, but do
     *  not generate any output. During initial processing, a text node is
     *  analyzed and, if necessary, splitted into static content, dynamic
     *  content and parameters. To do this, the original text node is replaced
     *  by new separate text nodes:
     *      e.g. "text {{expr}} + {{var:expr}}"
     *               -> ["text ", {{expr}}, " + ", {{var:expr}}]
     *  When the text nodes are split, meta objects are created for them. The
     *  meta objects are compatible with the meta objects of the rendering
     *  methods but use the additional attributes:
     *      Composite.ATTRIBUTE_TEXT, Composite.ATTRIBUTE_NAME and
     *      Composite.ATTRIBUTE_VALUE
     *  Only static content uses Composite.ATTRIBUTE_TEXT, dynamic content and
     *  parameters use Composite.ATTRIBUTE_VALUE, and only the parameters use
     *  Composite.ATTRIBUTE_NAME. The meta objects for dynamic content also have
     *  their own rendering method for generating output. Static content is
     *  ignored later during rendering because it is unchangeable.     
     *      
     *      Events + Validate + Render
     *      ----
     *  Events primarily controls the synchronization of the input values of
     *  HTML elements with the properties of a model. Means that the value in
     *  the model only changes if an event occurs for the corresponding HTML
     *  element. Synchronization is performed at a low level. Means that the
     *  properties are synchronized directly and without the use of get and set
     *  methods. For a better control a declarative validation is supported. If
     *  the attribute 'validate' exists, the value for this is ignored, the
     *  static method <Model>.validate(element, value) is  called in the
     *  corresponding model. This call must return a true value as the result,
     *  otherwise the element value is not stored into the corresponding model
     *  property. If an event occurs, synchronization is performed. After that
     *  will be checked whether the render attribute exists. All selectors
     *  listed here are then triggered for re-rendering. (Re)rendering is
     *  independent of synchronization and validation and is executed
     *  immediately after an event occurs.
     *      
     *      Condition
     *      ----
     *  The declaration can be used with all HTML elements, but not with script
     *  and style. The condition defines whether an element is (re)rendered or
     *  not. As result of the expression true/false is expected and will be se
     *  as an absolute value for the condition attribute - only true or false.
     *  Elements are hidden with the condition attribute via CSS and only
     *  explicitly displayed with [condition=true].
     *  JavaScript (composite/javascript) elements are executed or not.     
     *      
     *      Import
     *      ----
     *  This declation loads the content and replaces the inner HTML of an
     *  element with the content. The attribute expects as value one element or
     *  more elements as node list or array -- these are then inserted directly
     *  and behave similar to the output-attribute, or the value is considered
     *  as a remote resource with relative or absolute URL and will be loaded
     *  via the HTTP method GET.
     *  If the content was successfully imported and inserted, the import
     *  attribute is removed. Recursive rendering is initiated by the
     *  MutationObserver.
     *  The import attribute can be combined with the condition attribute so
     *  that the import is only executed if the condition is true.
     *  
     *      Output
     *      ----
     *  Set the value or result of an expression as the content of an element.
     *  For an expression, the result can also be an element or a node list with
     *  elements. All other data types are set as text. This output is
     *  exclusive, thus overwriting any existing content.
     *  The recursive (re)rendering is initiated via the MutationObserver.
     *      
     *      Interval
     *      ----
     *  Interval rendering based on a window interval.
     *  If an HTML element is declared as interval, its initial inner HTML is
     *  used as a template. During the intervals, the inner HTML is first
     *  emptied, the template is rendered individually with each interval cycle,
     *  and the result is added to the inner HTML. The interval attribute
     *  expects a value in milliseconds. An invalid value cause a console
     *  output. The interval starts automatically with the (re)rendering of the
     *  declared HTML element and is terminated and removed when:
     *    - the element no longer exists in the DOM
     *    - condition the condition attribute is false
     *      
     *      Iterate
     *      ----
     *  Iterative rendering based on lists, enumeration and arrays.
     *  If an HTML element is declared as iterate, its initial inner HTML is
     *  used as a template. During iteration, the inner HTML is initially
     *  emptied, the template is rendered individually with each iteration cycle
     *  and the result is added to the inner HTML.
     *  The expression for the iteration is a parameter expression. The
     *  parameter is a meta object and supports access to the iteration cycle.
     *      e.g iterate={{tempA:Model.list}} -> tempA = {item, index, data}
     *             
     *      Scripting
     *      ----
     *  Embedded scripting brings some peculiarities.
     *  The default scripting is automatically executed by the browser and
     *  independent of rendering. Therefore, the scripting for rendering has
     *  been adapted and a new script type have been introduced:
     *      composite/javascript
     *  This script type use the normal JavaScript. Unlike type text/javascript,
     *  the browser does not recognize them and does not execute the JavaScript
     *  code automatically. Only the render recognizes the JavaScript code and
     *  executes it in each render cycle when the cycle includes the script
     *  element. In this way, the execution of the script element can also be
     *  combined with the attribute condition.
     *  Embedded scripts must be 'ThreadSafe'.
     *  
     *      Custom Tag (Macro)
     *      ----
     *  More details about the usage can be found in:
     *      Composite.customize(tag:string, function(element) {...});
     *  
     *      Custom Selector
     *      ----
     *  More details about the usage can be found in
     *      Composite.customize(selector:string, function(element) {...}); 
     *  
     *      Custom Acceptor
     *      ----  
     *  More details about the usage can be found in
     *      Composite.customize(function(element) {...});
     *      
     *      Events
     *      ----
     *  Composite.EVENT_RENDER_START
     *  Composite.EVENT_RENDER_NEXT
     *  Composite.EVENT_RENDER_END
     */
    Composite.render = function(selector, lock) {
        
        if (!selector)
            return;

        Composite.render.queue = Composite.render.queue || [];
        
        //The lock locks concurrent render requests.
        //Concurrent rendering causes unexpected states due to manipulations
        //at the DOM. HTML elements that are currently being processed can
        //be omitted or replaced from the DOM. Access to parent and child
        //elements may then no longer be possible.
        if (Composite.render.lock
                && Composite.render.lock != lock) {
            if (!Composite.render.queue.includes(selector))
                Composite.render.queue.push(selector);
            return;
        }

        var lock = Composite.lock(Composite.render, selector);
            
        try {

            if (typeof selector === "string") {
                selector = selector.trim();
                if (!selector)
                    return;
                var nodes = document.querySelectorAll(selector);
                nodes.forEach((node, index, array) => {
                    Composite.render(node, lock.share());
                });
                return;
            }
            
            if (!(selector instanceof Node))
                return;

            //If a custom tag exists, the macro is executed.
            //Macros are completely user-specific.
            //The return value determines whether the standard functions are
            //used or not. Only the return value false (not void, not empty)
            //terminates the rendering for the macro without using the standard
            //functions.
            Composite.macros = Composite.macros || {};
            var macro = Composite.macros[selector.nodeName.toLowerCase()];
            if (macro && macro(selector) === false)
                return;
            
            //If a custom selector exists, the macro is executed.
            //Selectors work similar to macros.
            //Unlike macros, selectors use a CSS selector to detect elements.
            //This selector must match the current element from the point of
            //view of the parent.
            //Selectors are more flexible and multifunctional. Therefore
            //different selectors and thus different functions can match one
            //element. In this case, all implemented callback methods are
            //performed.
            //The return value determines whether the loop is aborted or not.
            //Only the return value false (not void, not empty) terminates the
            //loop and the rendering for the selector without using the standard
            //functions.
            Composite.selectors = Composite.selectors || {};
            if (selector.parentNode) {
                for (var macro in Composite.selectors) {
                    macro = Composite.selectors[macro];
                    var nodes = selector.parentNode.querySelectorAll(macro.selector);
                    if (Array.from(nodes).includes(selector)) {
                        if (macro.callback(selector) === false)
                            return;
                    }
                }
            }

            //Associative array (meta store) for element-related meta-objects,
            //those which are created during rendering: (key:serial, value:meta)
            Composite.render.meta = Composite.render.meta || [];
            
            //Register each analyzed node/element and minimizes multiple
            //analysis. For registration, the serial number of the node/element
            //is used. The node prototype has been enhanced with creation and a
            //get-function. During the analysis, the attributes of a element
            //(not node) containing an expression or all allowed attributes are
            //cached in the memory (Composite.render.meta).
            var serial = selector.ordinal();
            var object = Composite.render.meta[serial];
            if (!object) {
                
                //Acceptors are a very special way to customize. Unlike the
                //other ways, here the rendering is not shifted into own
                //implementations. With a acceptor, an element is manipulated
                //before rendering and only if the renderer processes the
                //element initially. This makes it possible to make individual
                //changes to the attributes or the markup before the renderer
                //processes them. This does not affect the implementation of the
                //rendering. The method call with a acceptor:
                //    Composite.customize(function(element) {...});
                Composite.acceptors = Composite.acceptors || [];
                Composite.acceptors.forEach((acceptor, index, array) => {
                    acceptor.call(null, selector);
                });

                object = {serial:serial, element:selector, attributes:{}};
                Composite.render.meta[serial] = object;
                if ((selector instanceof Element)
                        && selector.attributes) {
                    //Attribute condition is not included in the list of
                    //Composite.PATTERN_ATTRIBUTE_ACCEPT because it is used very
                    //specifically and must therefore be requested separately.
                    Array.from(selector.attributes).forEach((attribute, index, array) => {
                        var value = (attribute.value || "").trim();
                        if (value.match(Composite.PATTERN_EXPRESSION_CONTAINS)
                                || attribute.name.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)) {
                            //Remove all internal attributes but not the statics.
                            //Static attributes are still used in the markup or
                            //for the rendering.
                            if (attribute.name.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)
                                    && !attribute.name.match(Composite.PATTERN_ATTRIBUTE_STATIC))
                                selector.removeAttribute(attribute.name);
                            object.attributes[attribute.name.toLowerCase()] = value;
                        }
                    });
                    
                    //Load modules/components/composite resources.
                    if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE))
                        Composite.render.include(selector);
                    
                    //The condition attribute is interpreted.
                    //If an HTML element uses the condition attribute, a text
                    //node is created for the HTML element as a placeholder
                    //For the placeholder, a meta object is created with all the
                    //details of the HTML element, the condition and the outer
                    //HTML code of the HTML element as a template. Then the HTML
                    //element in the DOM is replaced by the placeholder (text
                    //node). The original selector is switched to the text node
                    //and the rendering is continued with the text node.
                    var condition = object.attributes.hasOwnProperty(Composite.ATTRIBUTE_CONDITION)
                            ? object.attributes[Composite.ATTRIBUTE_CONDITION] : null;
                    delete object.attributes[Composite.ATTRIBUTE_CONDITION];        
                    if (condition) {
                        
                        //The initial HTML element is replaced by a placeholder.
                        //Because the meta object is also replaced, all
                        //attributes must be completely copied for later
                        //rendering, excluding the attribute 'condition', which
                        //is controlled by the placeholder and should not create
                        //a new or recursive placeholder.
                        delete object.attributes[Composite.ATTRIBUTE_CONDITION];
                        
                        //The placeholder and its meta object are created.
                        //This indirectly prevents the MutationObserver from
                        //rendering the placeholder, since the placeholder is
                        //already known.
                        var placeholder = document.createTextNode("");
                        object = {serial:placeholder.ordinal(), element:placeholder, attributes:object.attributes,
                                condition:condition, template:selector.cloneNode(true), output:null
                        };

                        //The Meta object is registered.
                        Composite.render.meta[object.serial] = object;

                        //The meta object for the HTML element is removed,
                        //because only the new placeholder is relevant.
                        delete Composite.render.meta[serial];
                        
                        selector.parentNode.replaceChild(placeholder, selector);
                        
                        selector = placeholder;
                        serial = selector.ordinal();
                        object = Composite.render.meta[serial];
                    }
                }
            }
            
            //The placeholder(-output) is interpreted.
            //Placeholder output is only processed via the placeholder.
            //Therefore the placeholder output is replaced by the placeholder at
            //variable level (selector + serial + object).
            if (object.hasOwnProperty("placeholder")) {
                selector = object.placeholder.element;
                serial = selector.ordinal();
                object = Composite.render.meta[serial];                
            }
            
            //A text node contain static and dynamic contents as well as
            //parameters. Dynamic contents and parameters are formulated as
            //expressions, but only the dynamic contents are output. Parameters
            //are interpreritert, but do not generate any output. During initial
            //processing, a text node is analyzed and, if necessary, splitted
            //into static content, dynamic content and parameters. To do this,
            //the original text node is replaced by new separate text nodes:
            //    e.g. "text {{expr}} + {{var:expr}}" ->  ["text ", {{exprl}}, " + ", {{var:expr}}]
            //When the text nodes are split, meta objects are created for them.
            //The meta objects are compatible with the meta objects of the
            //rendering methods but use the additional attributes: 
            //    Composite.ATTRIBUTE_TEXT, Composite.ATTRIBUTE_NAME and
            //    Composite.ATTRIBUTE_VALUE
            //Only static content uses Composite.ATTRIBUTE_TEXT, dynamic content
            //and parameters use Composite.ATTRIBUTE_VALUE, and only the
            //parameters use Composite.ATTRIBUTE_NAME.
            //The meta objects for dynamic content also have their own rendering
            //method for generating output. Static content is ignored later
            //during rendering because it is unchangeable.
            if (selector.nodeType == Node.TEXT_NODE
                    && !object.hasOwnProperty(Composite.ATTRIBUTE_CONDITION)) {
                
                //Elements of type: script + style are ignored.
                //No expression is replaced here.
                if (selector.parentNode
                        && selector.parentNode.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE))
                    return;
                
                //Text nodes are only analyzed once.
                //Pure text is completely ignored, only text nodes with a
                //expression as value are updated.
                if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_TEXT))
                    return;

                //New/unknown text nodes must be analyzed and prepared.
                //If the meta object for text nodes Composite.ATTRIBUTE_TEXT and
                //Composite.ATTRIBUTE_VALUE are not contained, it must be new.
                if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_VALUE)) {
                    object.render();
                    return;
                }   
                    
                //Step 1:
                //If the text node does not contain an expression, the content
                //is static. Static text nodes are marked with the attribute
                //Composite.ATTRIBUTE_TEXT.
                
                var content = selector.textContent;
                if (content.match(Composite.PATTERN_EXPRESSION_CONTAINS)) {
                    
                    //Step 2:
                    //All expressions are determined. A meta object is created
                    //for all expressions. In the text content from the text
                    //node, the expressions are replaced by a placeholder in the
                    //format of the expression with a serial.
                    //Empty expressions are removed/ignored.
                    
                    //All created meta objects with an expression have a special
                    //render method for updating the text content of the text
                    //node.
                    
                    //Step 3:
                    //The format of the expression distinguishes whether it is a
                    //parameter or an output expression. Parameter expressions
                    //start with the name of the parameter and are interpreted
                    //later, but do not generate any output.
                    
                    content = content.replace(Composite.PATTERN_EXPRESSION_CONTAINS, (match, offset, content) => {
                        match = match.substring(2, match.length -2).trim();
                        if (!match)
                            return "";
                        var node = document.createTextNode("");
                        var serial = node.ordinal();
                        var object = {serial:serial, element:node, attributes:{}, value:null,
                                render:function() {
                                    if (this.attributes.hasOwnProperty(Composite.ATTRIBUTE_NAME)) {
                                        var name = (this.attributes[Composite.ATTRIBUTE_NAME] || "").trim();
                                        var value = (this.attributes[Composite.ATTRIBUTE_VALUE] || "").trim();
                                        window[name] = Expression.eval(this.serial + ":" + Composite.ATTRIBUTE_VALUE, value);
                                        word = "";
                                    } else {
                                        word = this.attributes[Composite.ATTRIBUTE_VALUE];
                                        word = Expression.eval(this.serial + ":" + Composite.ATTRIBUTE_VALUE, word);
                                    }
                                    this.value = word;
                                    this.element.textContent = word;
                                }};
                        var param = match.match(Composite.PATTERN_EXPRESSION_VARIABLE);
                        if (param) {
                            object.attributes[Composite.ATTRIBUTE_NAME] = param[1];
                            object.attributes[Composite.ATTRIBUTE_VALUE] = "{{" + param[2] + "}}";
                        } else object.attributes[Composite.ATTRIBUTE_VALUE] = "{{" + match + "}}";
                        Composite.render.meta[serial] = object; 
                        return "{{" + serial + "}}";
                    });
                    
                    //Step 4:
                    //The prepared text with expression placeholders is
                    //analyzed. All placeholders are determined and the text is
                    //split at the placeholders. The result is an array of
                    //words. Each word are new text nodes with static text or
                    //dynamic content.
                    
                    if (content.match(Composite.PATTERN_EXPRESSION_CONTAINS)) {
                        var words = content.split(/(\{\{\d+\}\})/);
                        words.forEach((word, index, array) => {
                            if (word.match(/^\{\{\d+\}\}$/)) {
                                var serial = parseInt(word.substring(2, word.length -2).trim());
                                var object = Composite.render.meta[serial];
                                object.render();
                            } else {
                                var node = document.createTextNode(word);
                                var serial = node.ordinal();
                                var object = {serial:serial, element:node, attributes:{}};
                                object.element.textContent = word;
                                object.attributes[Composite.ATTRIBUTE_TEXT] = word;
                                Composite.render.meta[serial] = object; 
                            }
                            array[index] = object.element;
                        });
                        
                        //Step 5:
                        //The newly created text nodes are inserted before the
                        //current text node. The current text node can then be
                        //deleted, since its content is displayed using the
                        //newly created text nodes.
                        
                        //For internal and temporary calls, no parent can exist.
                        if (selector.parentNode == null)
                            return;
                        
                        //The new text nodes are inserted before the current
                        //element one.
                        words.forEach((node, index, array) => {
                            selector.parentNode.insertBefore(node, selector);
                        });
                        
                        //The current element will be removed.
                        selector.parentNode.removeChild(selector);                        
                        
                        return;
                    }
                    
                    //If the text content contains empty expressions, these are
                    //corrected and the content is used as static.
                    selector.nodeValue = content;
                }
                
                object.attributes[Composite.ATTRIBUTE_TEXT] = content;
                
                return;
            }
            
            //Only composites are docked as models.
            //Composites without conditions are docked by the renderer at first
            //detection. Composites with condition are docked and undocked
            //depending on the result of the condition.
            
            var dock = function(object) {
                Composite.models = Composite.models || [];
                if (!object.attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE)
                        || !object.attributes.hasOwnProperty(Composite.ATTRIBUTE_ID)
                        || Composite.models.includes(object.attributes[Composite.ATTRIBUTE_ID]))
                    return;
                Composite.models.push(object.attributes[Composite.ATTRIBUTE_ID]);
                var meta = Composite.mount.lookup(object.template || object.element);
                if (meta && meta.model && meta.scope
                        && typeof meta.scope.dock === "function")
                    meta.scope.dock.call(null);
            };
            
            if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE)
                    && !object.attributes.hasOwnProperty(Composite.ATTRIBUTE_CONDITION)
                    && !object.hasOwnProperty(Composite.ATTRIBUTE_CONDITION))
                dock(object);
            
            //The condition attribute is interpreted.
            //The condition is a very special implementation.
            //So it was important that a condition can remove and add a node in
            //the DOM. To do this, a placeholder and a template are created for
            //an element with a condition. The placeholder is a text node
            //without content and therefore invisible in the user interface. The
            //placeholder is the cached markup of the element.
            //Thus the renderer can insert or remove the markup after the
            //placeholder according to the condition.
            if (selector.nodeType == Node.TEXT_NODE
                    && object.hasOwnProperty(Composite.ATTRIBUTE_CONDITION)) {
                var placeholder = object;
                if (Expression.eval(serial + ":" + Composite.ATTRIBUTE_CONDITION, placeholder.condition) === true) {
                    
                    if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE))
                        dock(object);
                    
                    if (!placeholder.output
                            || !document.body.contains(placeholder.output)) {
                        //The placeholder output is rendered recursively and
                        //finally and inserted before the placeholder.
                        //Therefore, rendering can be stopped afterwards.
                        var template = placeholder.template.cloneNode(true);
                        placeholder.output = template;
                        
                        //The meta object is prepared and registered so that
                        //the attributes of the placeholder are available for
                        //rendering.
                        var serial = template.ordinal();
                        var object = {serial:serial, element:template, attributes:object.attributes, lock:true};
                        Composite.render.meta[serial] = object; 
                        
                        //The placeholder output is rendered recursively and
                        //finally and inserted in the iterate container.
                        //Therefore, rendering can be stopped afterwards.
                        Composite.render(template, lock.share());
                        object.placeholder = placeholder;
                        selector.parentNode.insertBefore(template, selector);
                        return;
                    }
                    selector = placeholder.output;
                    serial = selector.ordinal();
                    object = Composite.render.meta[serial];
                } else {
                    if (!placeholder.output)
                        return;
                    selector.parentNode.removeChild(placeholder.output);
                    delete placeholder.output;
                    return;
                }
            }
            
            if (!(selector instanceof Element))
                return;
            
            //Events primarily controls the synchronization of the input values
            //of HTML elements with the properties of a model. Means that the
            //value in the model only changes if an event occurs for the
            //corresponding HTML element. Synchronization is performed at a low
            //level. Means that the properties are synchronized directly and
            //without the use of get and set methods.
            //For a better control a declarative validation is supported.
            //If the attribute 'validate' exists, the value for this is ignored,
            //the static method <Model>.validate(element, value) is  called in
            //the corresponding model. This call must return a true value as the
            //result, otherwise the element value is not stored into the
            //corresponding model property.
            //If an event occurs, synchronization is performed. After that will
            //be checked whether the render attribute exists. All selectors
            //listed here are then triggered for (re)rendering. (Re)rendering is
            //independent of synchronization and validation and is executed
            //immediately after an event occurs.
            var events = object.attributes.hasOwnProperty(Composite.ATTRIBUTE_EVENTS)
                    ? object.attributes[Composite.ATTRIBUTE_EVENTS] : null;
            delete object.attributes[Composite.ATTRIBUTE_EVENTS];        
            var render = object.attributes.hasOwnProperty(Composite.ATTRIBUTE_RENDER)
                    ? object.attributes[Composite.ATTRIBUTE_RENDER] : false;
            delete object.attributes[Composite.ATTRIBUTE_RENDER];        
            if (events) {
                events = events.split(/\s+/);
                events.forEach((event, index, array) => {
                    var meta = Composite.mount.lookup(selector);
                    
                    //With the attribute 'events' the events are registered and
                    //executed here. Because the propagation, capture and
                    //bubbling phases should not be disturbed during the event.
                    //During binding, the logic checks which events have already
                    //been registered so that the implemented event methods in
                    //the model are not called more than once.
                    if (meta && meta.scope && meta.property
                            && typeof meta.scope[meta.property] === "object"
                            && meta.scope[meta.property] != null) {
                        var invoke = "on" + event.capitalize();
                        if (invoke.match(Composite.PATTERN_EVENT_FUNCTIONS)) {
                            if (typeof meta.scope[meta.property][invoke] === "function") {
                                object.events = object.events || {};
                                object.events[event.toLowerCase()] = meta.scope[meta.property][invoke]; 
                            }
                        }
                    }
                    
                    selector.addEventListener(event.toLowerCase(), (event) => {
                        var target = event.currentTarget;
                        var serial = target.ordinal();
                        var object = Composite.render.meta[serial];
                        if (!target.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE)
                                && Composite.ATTRIBUTE_VALUE in target
                                && typeof target[Composite.ATTRIBUTE_VALUE] !== "function") {
                            var meta = Composite.mount.lookup(target);
                            if (meta) {
                                var valid = false;
                                if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_VALIDATE)
                                        && typeof meta.scope[Composite.ATTRIBUTE_VALIDATE] === "function") {
                                    valid = meta.scope[Composite.ATTRIBUTE_VALIDATE].call(null, target, target.value) === true;
                                } else valid = true;
                                if (valid) {
                                    if (meta.scope[meta.property] instanceof Object)
                                        meta.scope[meta.property].value = target.value;
                                    else meta.scope[meta.property] = target.value
                                }
                            }
                        }
                        
                        var events = object.events || {};
                        if (typeof events[event.type] === "function")
                            events[event.type].call(null, event);
                        
                        if (render) {
                            if ((render || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
                                render = Expression.eval(serial + ":" + Composite.ATTRIBUTE_RENDER, render);
                            Composite.render(render, lock.share());
                        }
                    });                    
                });
            }
            
            //The import attribute is interpreted.
            //This declation loads the content and replaces the inner HTML of an
            //element with the content.
            //The following data types are supported:
            //  1. Node and NodeList as the result of an expression.
            //  2. URL (relative or absolute) loads markup/content from a remote
            //     data source via the HTTP method GET
            //  2. DataSource-URL loads and transforms DataSource data.
            //  3. Everything else is output directly as string/text.
            //The import is exclusive, similar to the output-attribute, thus
            //overwriting any existing content. The recursive (re)rendering is
            //initiated via the MutationObserver.
            //Loading and replacing the import function can be combined with the
            //condition attribute and is only executed when the condition is
            //true. If the content can be loaded successfully, the import
            //attribute is removed.
            if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_IMPORT)) {
                selector.innerHTML = "";
                var value = object.attributes[Composite.ATTRIBUTE_IMPORT];
                if ((value || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
                    value = Expression.eval(serial + ":" + Composite.ATTRIBUTE_IMPORT, value);
                //Attributes can only be deleted in objects that are not
                //locked. Locked objects are reused and require all
                //attributes for (re)rendering. Here the attribute 'import'
                //is affected/meant.
                Composite.render.cache = Composite.render.cache || {};
                
                if (!value) {
                    if (!object.lock)
                        delete object.attributes[Composite.ATTRIBUTE_IMPORT];                
                
                } else if (value instanceof Element
                        || value instanceof NodeList) {
                    selector.appendChild(value, true);
                    if (!object.lock)
                        delete object.attributes[Composite.ATTRIBUTE_IMPORT];                

                } else if (String(value).match(Composite.PATTERN_DATASOURCE_URL)) {
                    var data = String(value).match(Composite.PATTERN_DATASOURCE_URL);
                    data[2] = DataSource.fetch("xslt://" + (data[2] || data[1]));
                    data[1] = DataSource.fetch("xml://" + data[1]);
                    data = DataSource.transform(data[1], data[2]);
                    selector.appendChild(data, true);
                    var serial = selector.ordinal();
                    var object = Composite.render.meta[serial];
                    if (!object.lock)
                        delete object.attributes[Composite.ATTRIBUTE_IMPORT];                
                
                } else if (typeof Composite.render.cache[value] !== "undefined") {
                    selector.innerHTML = Composite.render.cache[value];
                    var serial = selector.ordinal();
                    var object = Composite.render.meta[serial];
                    if (!object.lock)
                        delete object.attributes[Composite.ATTRIBUTE_IMPORT];                
                
                } else {
                    window.setTimeout((selector, lock, url) => {
                        try {
                            var request = new XMLHttpRequest();
                            request.overrideMimeType("text/plain");
                            request.open("GET", url, false);
                            request.send();
                            if (request.status != "200")
                                throw Error("HTTP status " + request.status + " for " + url);
                            Composite.render.cache[url] = request.responseText;
                            selector.innerHTML = request.responseText;
                            var serial = selector.ordinal();
                            var object = Composite.render.meta[serial];
                            if (!object.lock)
                                delete object.attributes[Composite.ATTRIBUTE_IMPORT];
                        } catch (error) {
                            Composite.fire(Composite.EVENT_AJAX_ERROR, error);
                            throw error;
                        } finally {
                            lock.release();
                        }
                    }, 0, selector, lock.share(), value);
                }
            } 
            
            //The output attribute is interpreted.
            //This declaration sets the value or result of an expression as the
            //content of an element.
            //The following data types are supported:
            //  1. Node and NodeList as the result of an expression.
            //  2. DataSource-URL loads and transforms DataSource data.
            //  3. Everything else is output directly as string/text.
            //The output is exclusive, thus overwriting any existing content.
            //The recursive (re)rendering is initiated via the MutationObserver.
            if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_OUTPUT)) {
                selector.innerHTML = "";
                var value = object.attributes[Composite.ATTRIBUTE_OUTPUT];
                if ((value || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
                    value = Expression.eval(serial + ":" + Composite.ATTRIBUTE_OUTPUT, value);
                if (String(value).match(Composite.PATTERN_DATASOURCE_URL)) {
                    var data = String(value).match(Composite.PATTERN_DATASOURCE_URL);
                    data[2] = DataSource.fetch("xslt://" + (data[2] || data[1]));
                    data[1] = DataSource.fetch("xml://" + data[1]);
                    data = DataSource.transform(data[1], data[2]);
                    selector.appendChild(data, true);
                } else if (value instanceof Node)
                    selector.appendChild(value.cloneNode(true), true);
                else if (value instanceof NodeList)
                    Array.from(value).forEach(function(node, index, array) {
                        selector.appendChild(node.cloneNode(true), index == 0);
                    });
                else selector.innerHTML = String(value);
            }

            //The interval attribute is interpreted.
            //Interval rendering based on a window interval.
            //If an HTML element is declared as interval, its initial inner HTML
            //is used as a template. During the intervals, the inner HTML is
            //first emptied, the template is rendered individually with each
            //interval cycle, and the result is added to the inner HTML.
            //The interval attribute expects a value in milliseconds. An invalid
            //value cause a console output.
            //The interval starts automatically with the (re)rendering of the
            //declared HTML element and is terminated and removed when:
            //  - the element no longer exists in the DOM
            //  - the condition attribute is false
            var interval = object.attributes[Composite.ATTRIBUTE_INTERVAL];
            if (interval
                    && !object.interval) {
                interval = String(interval).trim();
                var context = serial + ":" + Composite.ATTRIBUTE_INTERVAL;
                interval = String(Expression.eval(context, interval));
                if (interval.match(/^\d+$/)) {
                    if (object.hasOwnProperty("placeholder")) {
                        object = object.placeholder;
                        selector = object.element;
                    }
                    interval = parseInt(interval);
                    object.interval = {
                        object:object,
                        selector:selector,
                        task:function(interval) {
                            var serial = interval.selector.ordinal();
                            var object = Composite.render.meta[serial];
                            var interrupt = !document.body.contains(interval.selector);
                            if (!object)
                                interrupt = true;
                            if (object
                                    && object.hasOwnProperty(Composite.ATTRIBUTE_CONDITION)
                                    && (!object.condition.element
                                            || !document.body.contains(object.condition.element)))
                                interrupt = true;
                            if (interrupt) {
                                window.clearInterval(interval.timer);
                                delete interval.object.interval                         
                            } else Composite.render(interval.selector);
                        }
                    };
                    object.interval.timer = window.setInterval(object.interval.task, interval, object.interval);
                } else if (interval)
                    console.error("Invalid interval: " + interval);
            }
            
            //The iterate attribute is interpreted.
            //Iterative rendering based on lists, enumeration and arrays.
            //If an HTML element is declared iteratively, its initial inner HTML
            //is used as a template. During iteration, the inner HTML is
            //initially emptied, the template is rendered individually with each
            //iteration cycle and the result is added to the inner HTML.
            //There are two particularities to consider.
            //  1. The internal recusive rendering must be done sequentially.
            //  2. The internal rendering creates temporary composite meta
            //     objects. These meta objects contain meta information in their
            //     attributes, which can be incorrectly interpreted during
            //     rescan after the iteration. Therefore, the temporarily
            //     created meta objects must be removed.
            //  3. A global variable is required for the iteration. If this
            //     variable already exists, the existing variable is saved and
            //     restored at the end of the iteration.
            //A variable with meta information is used within the iteration:
            //     e.g iterate={{tempA:Model.list}} -> tempA = {item, index, data}   
            if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_ITERATE)) {
                if (!object.iterate) {
                    var iterate = object.attributes[Composite.ATTRIBUTE_ITERATE];
                    var content = iterate.match(Composite.PATTERN_EXPRESSION_EXCLUSIVE);
                    content = content && !content[2] ? content[1].match(Composite.PATTERN_EXPRESSION_VARIABLE)  : null;
                    if (content) {
                        object.iterate = {name:content[1].trim(),
                                expression:"{{" + content[2].trim() + "}}"
                        };
                        object.template = selector.cloneNode(true);
                    } else console.error("Invalid iterate: " + iterate);
                }
                if (object.iterate) {
                    //A temporary global variable is required for the iteration.
                    //If this variable already exists, the existing method is
                    //cahced and restored at the end of the iteration.
                    var variable = window[object.iterate.name];
                    try {
                        var context = serial + ":" + Composite.ATTRIBUTE_ITERATE;
                        selector.innerHTML = "";
                        iterate = Expression.eval(context, object.iterate.expression);
                        if (iterate) {
                            iterate = Array.from(iterate);
                            iterate.forEach((item, index, array) => {
                                window[object.iterate.name] = {item:item, index:index, data:array};
                                var template = object.template.cloneNode(true);
                                Composite.render(template, lock.share());
                                selector.appendChild(template.childNodes);
                                delete Composite.render.meta[template.ordinal()];                                 
                            });
                        }
                    } finally {
                        //If necessary, restore the temporary variable.
                        delete window[object.iterate.name];
                        if (variable !== undefined)
                            window[object.iterate.name] = variable;
                    }
                    //The output of iterate is rendered recursively and finally
                    //and inserted in the iterate container. Therefore,
                    //rendering can be stopped afterwards.
                    return;
                }
            }
            
            //The expression in the attributes is interpreted.
            //The expression is stored in a meta object and loaded from there,
            //the attributes of the element can be overwritten in a render cycle
            //and are available (conserved) for further cycles. A special case
            //is the text element. The result is output here as textContent.
            //Elements of type: script + style are ignored.
            if (!selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE)) {
                var attributes = Array.from(selector.attributes || []);
                attributes = attributes.map(entry => entry.name);
                attributes = attributes.concat(Array.from(object.attributes));
                if (Composite.ATTRIBUTE_VALUE in selector)
                    attributes.push(Composite.ATTRIBUTE_VALUE);
                attributes = attributes.filter((value, index, array) => {
                    return array.indexOf(value) === index;
                });
                attributes.forEach((attribute, index, array) => {
                    //Ignore all internal attributes
                    if (attribute.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)
                            && !attribute.match(Composite.PATTERN_ATTRIBUTE_STATIC))
                        return;                    
                    var value = object.attributes[attribute] || "";
                    if (!value.match(Composite.PATTERN_EXPRESSION_CONTAINS))
                        return;
                    var context = serial + ":" + attribute;
                    value = Expression.eval(context, value);
                    value = String(value).encodeHtml();
                    value = value.replace(/"/g, "&quot;");
                    //Special case attribute value, here primarily the value of
                    //the property must be set, the value of the attribute is
                    //optional. Changing the value does not trigger an event, so
                    //no unwanted recursions occur.
                    if (attribute.toLowerCase() == Composite.ATTRIBUTE_VALUE
                            && Composite.ATTRIBUTE_VALUE in selector)
                        selector.value = value;
                    selector.setAttribute(attribute, value);
                });
            }

            //Embedded scripting brings some special effects.
            //The default scripting is automatically executed by the browser and
            //independent of rendering. Therefore, the scripting for rendering
            //has been adapted and a new script type have been introduced:
            //    composite/javascript
            //This script type use the normal JavaScript. Unlike type
            //text/javascript, the browser does not recognize them and does not
            //execute the JavaScript code automatically. Only the render
            //recognizes the JavaScript code and executes it in each render
            //cycle when the cycle includes the script element. In this way, the
            //execution of the script element can also be combined with the
            //attribute condition.
            //Embedded scripts must be 'ThreadSafe'.
            if (selector.nodeName.match(Composite.PATTERN_SCRIPT)) {
                var type = (selector.getAttribute(Composite.ATTRIBUTE_TYPE) || "").trim();
                if (type.match(Composite.PATTERN_COMPOSITE_SCRIPT)) {
                    try {eval(selector.textContent);
                    } catch (exception) {
                        console.error(exception);
                    }
                }
            }
            
            //Follow other element children recursively.
            //The following are ignored:
            //  - Elements of type: script + style and custom tags
            //  - Elements with functions that modify the inner markup
            //  - Elements that are a placeholder
            //These elements manipulate the inner markup.
            //This is intercepted by the MutationObserver.
            if (selector.childNodes
                    && !selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE)) {
                Array.from(selector.childNodes).forEach((node, index, array) => {
                    //The rendering is recursive, if necessary the node is then
                    //no longer available. For example, if a condition is
                    //replaced by the placeholder,
                    if (!selector.contains(node))
                        return;
                    if (node.nodeType != Node.TEXT_NODE) {
                        var serial = node.ordinal();
                        var object = Composite.render.meta[serial];
                        //Ignore all placeholder outputs.
                        //Rendering is only done via the placeholder.
                        if (object)
                            if (object.hasOwnProperty("placeholder"))
                                return;
                    }
                    Composite.render(node, lock.share());
                });
            }

        } finally {
            lock.release();
        }
    };
    
    /**
     *  Load modules/components/composite resources.
     *  For components/composites, it is assumed that resources have been
     *  outsourced. For outsourcing CSS, JS and HTML are supported.
     *  The resources are stored in the module directory (./modules by default
     *  is relative to the page URL). The resources (response) are stored in the
     *  render cache, but only to detect and prevent repeated loading. The
     *  resources will only be requested once. If they do not exist (status 404),
     *  it is not tried again. Otherwise, an error is thrown if the request is
     *  not answered with status 200.
     *  @param composite
     */
    Composite.render.include = function(composite) {
        
        if (!(typeof composite == "string"
                || composite instanceof Element))
            throw new TypeError("Invalid composite: " + typeof composite);
        
        var object = null;
        if (composite instanceof Element) {
            object = Composite.render.meta[composite.ordinal()];   
            if (!object)
                throw new TypeError("Unknown composite");
        }
        
        Composite.render.cache = Composite.render.cache || {};
        var context = Composite.MODULES + "/" + (composite instanceof Element ? composite.id : composite);        
        
        if (typeof Composite.render.cache[context + ".composite"] === "undefined") {
            Composite.render.cache[context + ".composite"] = null;
            var request = new XMLHttpRequest();
            request.overrideMimeType("text/plain");
            
            request.onreadystatechange = function() {
                if (request.readyState != 4
                        || request.status == "404")
                    return;
                if (request.status != "200")
                    throw new Error("HTTP status " + request.status + " for " + request.responseURL);
                
                //CSS is inserted into the HEad element as a style element.
                //Without a head element, the inserting causes an error.

                //JavaScript is not inserted as an element, it is executed
                //directly. For this purpose eval is used. Since the method may
                //form its own namespace for variables, it is important to
                //initialize the global variable better with window[...].
                
                //HTML/Markup is preloaded into the render cache if available.
                //If markup exists for the composite, the import attribute with
                //the URL is added to the item. Inserting then takes over the
                //import implementation, which then also accesses the render
                //cache.
                
                var content = request.responseText.trim();
                if (content) {
                    Composite.render.cache[request.responseURL] = request.responseText;
                    if (request.responseURL.match(/\.css$/)) {
                        var head = document.querySelector("html head");
                        if (!head)
                            throw new Error("No head element found");
                        var style = document.createElement("style");
                        style.setAttribute("type", "text/css");
                        style.textContent = content;
                        head.appendChild(style);
                    } else if (request.responseURL.match(/\.js$/)) {
                        eval(content);
                    } else if (request.responseURL.match(/\.html$/)) {
                        object.attributes[Composite.ATTRIBUTE_IMPORT.name.toLowerCase()] = request.responseURL;                                    
                    }
                }
            };

            //The sequence of loading is strictly defined.
            //    sequence: CSS, JS, HTML
            request.open("GET", context + ".css", false);
            request.send();
            request.open("GET", context + ".js", false);
            request.send();

            //HTML/Markup is only loaded if it is a known composite object and
            //the element does not contain a markup (inner HTML) and the
            //attributes import and output are not set. Thus is the assumption
            //that for an empty element outsourced markup should exist.
            if (object && !object.attributes.hasOwnProperty(Composite.ATTRIBUTE_IMPORT)
                    && !object.attributes.hasOwnProperty(Composite.ATTRIBUTE_OUTPUT)
                    && !composite.innerHTML.trim()) {
                request.open("GET", context + ".html", false);
                request.send();
            }
        }        
    };

    //Listener when an error occurs and triggers a matching composite-event.
    window.addEventListener("error", (event) => {
        Composite.fire(Composite.EVENT_ERROR, event);
    });
    
    //MutationObserver detects changes at the DOM and triggers (re)rendering and
    //(re)scanning and prevents manipulation of the composite attributes.
    //  - Text-Nodes: The TextConten of text nodes with an expression is
    //    protected by the MutationObserver and cannot be manipulated.
    //  - The attributes of the renderer (Composite.PATTERN_ATTRIBUTE_ACCEPT)
    //    are protected by the MutationObserver and cannot be manipulated.
    window.addEventListener("load", (event) => {
        (new MutationObserver((records) => {
            records.forEach((record) => {

                //Without Meta-Store, the renderer hasn't run yet.
                //The reaction by the MutationObserver only makes sense when the
                //renderer has run initially.
                if (!Composite.render.meta)
                    return;
                
                var serial = record.target.ordinal();
                var object = Composite.render.meta[serial];
                
                //Text changes are only monitored at text nodes with expression.
                //Manipulations are corrected/restored.
                if (record.type == "characterData"
                        && record.target.nodeType == Node.TEXT_NODE) {
                    if (object && object.hasOwnProperty(Composite.ATTRIBUTE_VALUE)
                            && String(object.value || "") != record.target.textContent)
                        record.target.textContent = object.value || "";
                    return;
                }
                
                //Changes at the renderer-specific and static attributes are
                //monitored. Manipulations are corrected/restored.
                if (object && record.type == "attributes") {
                    var attribute = (record.attributeName || "").toLowerCase().trim();
                    if (attribute.match(Composite.PATTERN_ATTRIBUTE_STATIC)) {
                        var value = record.target.getAttribute(attribute);
                        if (object.attributes[attribute] != value)
                            record.target.setAttribute(attribute, object.attributes[attribute]);
                    } else if (attribute.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)) {
                        record.target.removeAttribute(attribute);
                    }
                }
                
                //Theoretically, the target object may be unknown by the
                //renderer, but normally the mutation observer reacts to the
                //parent element when inserting new elements.
                //Therefore, this case was not implemented.
                
                //All new inserted elements are rendered if they are unknown for
                //the renderer. It is important that the new nodes are also
                //contained in the body. This is not always the case, e.g. when
                //recursive rendering replaces elements. So an include can load
                //data with a condition. Nodes are created per include, which
                //are then replaced by a placholder in the case of a condition.
                //The MutationObserver does not run parallel, so it is called
                //after the rendering with obsolete nodes.
                if (record.addedNodes) {
                    record.addedNodes.forEach((node) => {
                        if (node instanceof Element
                                && !Composite.render.meta[node.ordinal()]
                                && document.body.contains(node))
                            Composite.render(node);
                    });
                }
                
                //All removed elements are cleaned and if necessary the undock
                //method is called if an object binding exists.
                if (record.removedNodes) {
                    record.removedNodes.forEach((node) => {
                        var cleanup = function(node) {
                            //Clean up all the child elements first.
                            if (node.childNodes) {
                                Array.from(node.childNodes).forEach((node) => {
                                    cleanup(node);
                                });
                            }
                            
                            //Composites/models must be undocked when they are
                            //removed from the DOM. The following implementation
                            //is based on the assumption that composites with
                            //and without conditions are removed from the DOM.
                            //For composites with condition, it must be noted
                            //that the composite is initially replaced by a
                            //placeholder. During replacement, the initial
                            //composite is removed, which can cause an unwanted
                            //undocking. Therefore, the logic is based on the
                            //assumption that each composite has a meta object.
                            //When replacing the original composite, the
                            //corresponding meta object is also deleted, so that
                            //the MutationObserver detects the composite to be
                            //removed in the DOM, but undocking is not performed
                            //without the matching meta object.

                            var serial = node.ordinal();
                            var object = Composite.render.meta[serial];
                            if (object && object.attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE)) {
                                var meta = Composite.mount.lookup(node);
                                if (meta && meta.model
                                        && Composite.models.includes(meta.model)) {
                                    Composite.models = Composite.models.filter(model => model != meta.model);
                                    if (meta.scope
                                            && typeof meta.scope.undock === "function")
                                    meta.scope.undock.call(null);
                                }
                            }
                            
                            delete Composite.render.meta[node.ordinal()];
                        };
                        cleanup(node);
                    });
                }                
            });
        })).observe(document.body, {childList:true, subtree:true, attributes:true, characterData:true});
    });
};

if (typeof Expression === "undefined") {    
    
    /**
     *  Expressions or the Expression Language (EL) is a simple access to the
     *  client-side JavaScrript and thus to the models and components in the
     *  aspect-js. The expressions support the complete JavaScript API, the is
     *  enhanced with additional keywords, which also allows the numerous
     *  arithmetic and logical operators can be used.
     *  From the BODY tag on, the Expression Language can be used in the
     *  complete markup as free text. and in all attributes. Only the STYLE and
     *  SCRIPT, here the Expression Language is not supported.
     */
    Expression = {};

    /** Constant for element type text */
    Expression.TYPE_TEXT = 1;
    
    /** Constant for element type expression */
    Expression.TYPE_EXPRESSION = 2;
    
    /** Constant for element type literal */
    Expression.TYPE_LITERAL = 3;
    
    /** Constant for element type script */
    Expression.TYPE_SCRIPT = 4;
    
    /** Constant for element type keyword */
    Expression.TYPE_KEYWORD = 5;
    
    /** Constant for element type other */
    Expression.TYPE_OTHER = 6;
    
    /** Constant for element type method */
    Expression.TYPE_METHOD = 7;
    
    /** Constant for element type value */
    Expression.TYPE_VALUE = 8;
    
    /** Constant for element type logic */
    Expression.TYPE_LOGIC = 9;
    
    /** Cache (expression/script) */
    Expression.cache;
    
    /**
     *  Resolves a value-expression recursively if necessary.
     *  Value expressions refer to a property in a static model.
     *  The value is retrieved using a corresponding get- or is-function or, if
     *  this is not available, the value is retrieved directly from the
     *  property. For the get- and is-functions, the first character is changed
     *  from property name to uppercase and prefixed with 'get' or 'is'.
     *      e.g. {{Model.value}} -> Model.getValue()
     *           {{Model.value}} -> Model.isValue()
     *  In addition to the namespace of JavaScript, the method also supports DOM
     *  elements. To do this, the variable in the expression must begin with #
     *  and there must be a corresponding element with a matching ID in the DOM.
     *      e.g. {{#Element}} -> document.querySelector(#Element)
     *           {{#Element.value}} -> document.querySelector(#Element).value
     *  @param  context    context or expression without context
     *  @param  expression expression in combination with a context
     *  @retrun the value of the expression, otherwise false
     */
    Expression.lookup = function(context, expression) {

        try {
            if (typeof context === "string"
                    && expression === undefined) {
                if (context.match(/^#[a-zA-Z]\w*$/))
                    return document.querySelector(context);
                if (context.match(/^(#[a-zA-Z]\w*)\.(.*)*$/)) {
                    expression = context.match(/^(#[a-zA-Z]\w*)\.(.*)*$/);
                    return Expression.lookup(document.querySelector(expression[1]), expression[2]);
                }
                if (context.indexOf(".") < 0)
                    return eval(context);
                expression = context.match(/^(.*?)\.(.*)$/);
                return Expression.lookup(eval(expression[1]), expression[2]);
            }
            
            if (expression.indexOf(".") < 0)
                expression = [null, expression];
            else expression = expression.match(/^(.*?)\.(.*)$/);
            var method = "get" + expression[1].capitalize();
            if (typeof context[method] !== "function")
                method = "is" + expression[1].capitalize();
            if (typeof context[method] === "function") {
                context = (context[method])();
                if (expression.length > 2)
                    return Expression.lookup(context, expression[2]);
                return context
            }
            
            context = (context[expression[1]]);
            if (expression.length > 2)
                return Expression.lookup(context, expression[2]);
            return context
            
        } catch (exception) {
            return undefined;
        }
    };
    
    /**
     *  Analyzes and finds the components of an expression and creates a
     *  JavaScript from them. Created scripts are stored in a cache and reused
     *  as needed.
     *  @param  expression
     *  @return the created JavaScript
     */
    Expression.parse = function(expression) {
    
        //Terms:
        //An expression is an array of words.
        //A word is an elementary phrase or a partial array with more words.
        
        //Structure:
        //The words are classified in several steps and separated according to
        //their characteristics.
        
        //  +-------------------------------------------------------------+
        //  |            words (entireness of the expression)             |            
        //  +--------+----------------------------------------------------+
        //  |  text  |                     expression                     |
        //  |        +-----------+----------------------------------------+
        //  |        |  literal  |                 script                 |
        //  |        |           +-----------+----------------------------+
        //  |        |           |  keyword  |           other            |
        //  |        |           |           +---------+----------+-------+
        //  |        |           |           |  value  |  method  | logic |
        //  +--------+-----------+-----------+---------+----------+-------+
        
        //Notes:
        //Line breaks we are interpreted as blanks. Therefore, all line breaks
        //are replaced by spaces. So the characters 0x0D and 0x0A can be used
        //later as internal separator and auxiliary marker.

        //Empty expressions are interpreted like an empty string.
        if (expression === null
                || expression === undefined)
            expression = "";
        else expression = expression.trim();
        if (expression === "")
            return "";
        
        var cascade = {words:[], text:[], expression:[], literal:[], script:[], keyword:[], other:[], value:[], method:[], logic:[]};
        
        //Step 1:
        //Separation of text and expression as words.
        //Expression is always in {{...}} included, everything else before/after
        //is text. Escaping of {{ and }} is not possible and is not supported.
        //Alternatively, an expression with literals can be used.
        //    e.g. {{"{" + "{"}} / {{"}" + "}"}}
        
        //Lines breaks are ignored, they are interpreted as spaces.
        //So the start and end of expressions can be marked with line breaks.
        //After that, text and expressions can be separated.
        expression = expression.replace(/(^[\r\n]+)|([\r\n]+$)/g, "");
        expression = expression.replace(/[\r\n]/g, " ");
        expression = expression.replace(/(\{\{)/g, "\n$1");
        expression = expression.replace(/(\}\})/g, "$1\n");
        
        //Without expression it is pure text.
        if (expression.indexOf("\n") < 0)
            return "\"" + expression + "\"";
        
        expression = expression.replace(/(^\n+)|(\n+$)/g, "");

        var collate = function(word) {
            if (word.type == Expression.TYPE_TEXT)
                cascade.text.push(word);
            else if (word.type == Expression.TYPE_EXPRESSION)
                cascade.expression.push(word);
            else if (word.type == Expression.TYPE_SCRIPT)
                cascade.script.push(word);
            else if (word.type == Expression.TYPE_LITERAL)
                cascade.literal.push(word);
            else if (word.type == Expression.TYPE_KEYWORD)
                cascade.keyword.push(word);
            else if (word.type == Expression.TYPE_OTHER)
                cascade.other.push(word);
            else if (word.type == Expression.TYPE_VALUE)
                cascade.value.push(word);
            else if (word.type == Expression.TYPE_METHOD)
                cascade.method.push(word);
            else if (word.type == Expression.TYPE_LOGIC)
                cascade.logic.push(word);
        };
        
        expression.split(/\n/).forEach((entry, index, array) => {
            var object = {type:Expression.TYPE_TEXT, data:entry};
            if (entry.match(/^\{\{.*\}\}$/)) {
                object.data = object.data.substring(2, object.data.length -2);
                object.type = Expression.TYPE_EXPRESSION;
            } else object.data = "\"" + object.data.replace(/\\/, "\\\\").replace(/"/, "\\\"") + "\"";
            collate(object);
            cascade.words.push(object);
        });
        
        //Step 2:
        //Separation of expressions in literal and script as partial words.
        //The expression objects are retained but their value changes from text
        //to array with literal and script as partial words.

        cascade.expression.forEach((entry, index, array) => {
            var text = entry.data;
            text = text.replace(/(^|[^\\])((?:\\{2})*\\[\'])/g, "$1\n$2\n");
            text = text.replace(/(^|[^\\])((?:\\{2})*\\[\"])/g, "$1\r$2\r");
            var words = [];
            var pattern = /(^.*?)(([\'\"]).*?(\3|$))/m;
            while (text.match(pattern)) {
                text = text.replace(pattern, (match, script, literal) => {
                    script = script.replace(/\n/g, "\'");
                    script = script.replace(/\r/g, "\"");
                    script = {type:Expression.TYPE_SCRIPT, data:script};
                    collate(script);
                    words.push(script);
                    literal = literal.replace(/\n/g, "\'");
                    literal = literal.replace(/\r/g, "\"");
                    literal = {type:Expression.TYPE_LITERAL, data:literal};
                    collate(literal);
                    words.push(literal);
                    return "";
                });
            }
            if (text.length > 0) {
                text = text.replace(/\n/g, "\'");
                text = text.replace(/\r/g, "\"");
                text = {type:Expression.TYPE_SCRIPT, data:text};
                collate(text);
                words.push(text);
            }
            entry.data = words;
        });
        
        //Step 3:
        //Converting reserved word (keywords) into operators. 
        //supported keywords a nd mapping:
        //    and &&        empty !         div /
        //    eq  ==        ge    >=        gt  >
        //    le  <=        lt    <         mod %
        //    ne  !=        not   !         or  ||
        //additional keywords without mapping:
        //    true, false, null, instanceof, typeof, undefined, new
        //Separation of script in keyword and other as partial words.
        //IMPORTANT: KEYWORDS ARE CASE-INSENSITIVE
        
        var keywords = ["and", "&&", "or", "||", "not", "!", "eq", "==",
                "ne", "!=", "lt", "<", "gt", ">", "le", "<=", "ge", ">=", "empty", "!",
                "div", "/", "mod", "%"];
        cascade.script.forEach((entry, index, array) => {
            var text = entry.data;
            for (var loop = 0; loop < keywords.length; loop += 2) {
                var pattern = new RegExp("(^|[^\\w\\.])(" + keywords[loop] + ")(?=[^\\w\\.]|$)", "ig");
                text = text.replace(pattern, "$1\n\r" + keywords[loop +1] + "\n");
            }
            text = text.replace(/(^|[^\w\.])(true|false|null|instanceof|typeof|undefined|new)(?=[^\w\.]|$)/ig, (match, script, keyword) => {
                return script + "\n\r" + keyword.toLowerCase() + "\n";
            });
            var words = [];
            text.split(/\n/).forEach((entry, index, array) => {
                var object = {type:Expression.TYPE_OTHER, data:entry};
                if (entry.match(/^\r/)) {
                    object.data = entry.substring(1);
                    object.type = Expression.TYPE_KEYWORD;
                }
                collate(object);
                words.push(object);
            });
            entry.data = words;
        });
        
        //Step 4:
        //Detection of value- and method-expressions
        //    method expression: (^|[^\w\.])(#{0,1}[a-zA-Z](?:[\w\.]*[\w])*)(?=\()
        //The expression is followed by a round bracket.
        //    value expression: (^|[^\w\.])(#{0,1}[a-zA-Z](?:[\w\.]*[\w])*(?=(?:[^\w\(\.]|$)))
        //The expression is followed by a non-word character or the end.
        
        cascade.other.forEach((entry, index, array) => {
            var text = entry.data;
            text = text.replace(/(^|[^\w\.])(#{0,1}[a-zA-Z](?:[\w\.]*[\w])*(?=(?:[^\w\(\.]|$)))/g, "$1\n\r\r$2\n");
            text = text.replace(/(^|[^\w\.])(#{0,1}[a-zA-Z](?:[\w\.]*[\w])*)(?=\()/g, "$1\n\r$2\n");
            var words = [];
            text.split(/\n/).forEach((entry, index, array) => {
                var object = {type:Expression.TYPE_LOGIC, data:entry};
                if (entry.match(/^\r\r/)) {
                    object.data = "Expression.lookup(\"" + entry.substring(2) + "\")";
                    object.type = Expression.TYPE_VALUE;
                } else if (entry.match(/^\r[^\r]/)) {
                    object.data = entry.substring(1);
                    if (object.data.match(/^#[a-zA-Z]/))
                        object.data = "Expression.lookup(\"" + object.data + "\")";
                    object.type = Expression.TYPE_METHOD;
                }
                collate(object);
                words.push(object);
            });
            entry.data = words;
        });
        
        //Step 5:
        //Create a flat sequence from the cascade.
        
        var words = [];
        var merge = function(word) {
            if (Array.isArray(word))
                word.forEach((entry, index, array) => {
                    merge(entry);    
                });
            else if (Array.isArray(word.data))
                word.data.forEach((entry, index, array) => {
                    merge(entry);    
                });            
            else if (typeof word.data === "string")
                if (word.data
                        && word.data.length)
                    words.push(word);
            else
                merge(word.data);
        };    
        merge(cascade.words);
        
        //Step 6:
        //Create a script from the word sequence.
        //The possible word types: text, literal, keyword, value, method, logic
        //Text and expression are always separated by brackets.
        //    e.g. text + (expression) + text + ...
        //The line break characters are misused for marking the transitions from
        //text to expression.
        
        var script = "";
        words.forEach((word, index, array) => {
            if (word.type == Expression.TYPE_TEXT)
                script += "\n" + word.data + "\r";
            else if (word.type == Expression.TYPE_KEYWORD)
                script += " " + word.data + " ";
            else if (word.type == Expression.TYPE_LITERAL
                    || word.type == Expression.TYPE_VALUE
                    || word.type == Expression.TYPE_METHOD
                    || word.type == Expression.TYPE_LOGIC)
                script += word.data;
        });
        script = script.replace(/(^\n)|(\r$)/g, "");
        if (script.match(/\r[^\n]*$/))
            script += ")";
        if (script.match(/^[^\r]*\n/))
            script = "(" + script; 
        script = script.replace(/(\n\r)+/g, " + ");
        script = script.replace(/\r/g, " + (");
        script = script.replace(/\n/g, ") + ");
        script = script.replace(/(^\s*\+\s*)|(\s*\+\s*$)/, "");
        
        return script;
    };
    
    /**
     *  Interprets the passed expression.
     *  In case of an error, the error is returned and no exception is thrown.
     *  A serial can be specified optionally. The serial is an alias for caching
     *  compiled expressions. Without, the expressions are always compiled. 
     *  The function uses variable parameters and has the following signatures:
     *      function(expression) 
     *      function(serial, expression)
     *  @param  serial
     *  @param  expression
     *  @return the return value of the interpreted expression or an error if a
     *          error or exception has occurred
     */
    Expression.eval = function(variants) {
        
        Expression.cache = Expression.cache || [];
        
        var expression = null;
        if (arguments.length > 1)
            expression = arguments[1];
        else if (arguments.length > 0)
            expression = arguments[0];

        var serial = null;
        if (arguments.length > 1)
            serial = arguments[0];
        
        var script = null;
        script = serial ? Expression.cache[serial] || null : null;
        if (!script)
            script = Expression.parse(expression);
        Expression.cache[serial] = script;
        
        try {return eval(script);
        } catch (exception) {
            exception.message += "\n\t" + script;
            console.error(exception);
            return exception.message;
        }
    };
};

/**
 *  Static component for the use of a SiteMap for virtual paths.
 *  SiteMap is a directory consisting of faces and facets that are addressed by
 *  paths.
 *  
 *      +-----------------------------------------------+
 *      |  Page                                         |
 *      |  +-----------------------------------------+  |
 *      |  |  Face A / Partial Face A                |  |
 *      |  |  +-------------+       +-------------+  |  |
 *      |  |  |  Facet A1   |  ...  |  Facet An   |  |  |
 *      |  |  +-------------+       +-------------+  |  |
 *      |  |                                         |  |
 *      |  |  +-----------------------------------+  |  |
 *      |  |  |  Face AA                          |  |  |
 *      |  |  |  +-----------+     +-----------+  |  |  |
 *      |  |  |  | Facet AA1 | ... | Facet AAn |  |  |  |
 *      |  |  |  +-----------+     +-----------+  |  |  |
 *      |  |  +-----------------------------------+  |  |
 *      |  |  ...                                    |  |
 *      |  +-----------------------------------------+  |
 *      |  ...                                          |
 *      |  +-----------------------------------------+  |
 *      |  |  Face n                                 |  |
 *      |  |  ...                                    |  |
 *      |  +-----------------------------------------+  |
 *      +-----------------------------------------------+
 *      
 *  A face is the primary projection of the content. This projection may contain
 *  additional sub-components, in form of facets and sub-faces.
 *  
 *  Facets are parts of a face (projection) and are not normally a standalone
 *  component. For example, the input mask and result table of a search can be
 *  separate facets of a face, as can articles or sections of a face. Both face
 *  and facet can be accessed via virtual paths. The path to a facet has the
 *  effect that the face is displayed with any other faces, but the requested
 *  facet is displayed in the visible area and focused.
 *  
 *  Faces are also components that can be nested.
 *  Thus, parent faces become partial faces when the path refers to a sub-face.
 *  A sub-face is presented with all its parent partial faces. If the parent
 *  faces contain additional facets, these facets are not displayed. The parent
 *  faces are therefore only partially presented.
 *
 *  With the SiteMap the structure of faces, facets and the corresponding paths
 *  are described. The SiteMap controls the face flow and the presentation of
 *  the components corresponding to a path. 
 *  This means that you don't have to take care of showing and hiding components
 *  yourself.
 *  
 *  The show and hide is hard realized in the DOM.
 *  This means that if a component is hidden, it is physically removed from the
 *  DOM and only added again when it is displayed.
 *  
 *  When it comes to controlling face flow, the SiteMap provides hooks for
 *  permission concepts and acceptors. With both things the face flow can be
 *  controlled and influenced. This way, the access to paths can be stopped
 *  and/or redirected/forwarded with own logic. 
 *  
 *  The Object-/Model-Binding part also belongs to the Model View Controller and
 *  is taken over by the Composite API in this implementation. SiteMap is an
 *  extension and is based on the Composite API.
 *  
 *  MVC 1.0 20190410
 *  Copyright (C) 2019 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20190410
 */
if (typeof Path === "undefined") {
    
    /**
     *  Static component for the use of (virtual) paths.
     *  Paths are a reference to a target in face flow. The target can be a
     *  face, a facet or a function.
     *  For more details see method Path.normalize(variants).
     */    
    Path = {};
    
    /** Pattern for a valid path. */
    Path.PATTERN_PATH = /^(?:(?:#*(?:[a-z](?:(?:\w+)|(?:[\w\-]+\w+))*)*)(?:#+(?:[a-z](?:(?:\w+)|(?:[\w\-]+\w+))*)*)*)*$/;

    /** Pattern for a url path. */
    Path.PATTERN_URL = /^[a-z]+:\/.*?(#.*)*$/i;

    /** Pattern for a functional path. */
    Path.PATTERN_PATH_FUNCTIONAL = /^#{3,}$/;
    
    /**
     *  Normalizes a path.
     *  Paths consist exclusively of word characters and underscores (based on
     *  composite IDs) and must begin with a letter and use the hash character
     *  as separator and root. Between the path segments, the hash character can
     *  also be used as a back jump (parent) directive. The back jump then
     *  corresponds to the number of additional hash characters.
     *  
     *      Note:
     *  Paths use lowercase letters. Upper case letters are automatically
     *  replaced by lower case letters when normalizing.
     *  
     *  There are four types of paths:
     *  
     *      Functional paths:
     *      ----
     *  The paths consists of three or more hash characters (###+) and are only
     *  temporary, they serve a function call without changing the current path
     *  (URL hash). If such a path is detected, the return value is always ###.
     *  
     *      Root paths:
     *      ----
     *  These paths are empty or contain only one hash character. The return
     *  value is always the given root path or # if no root path was specified.
     *  
     *      Relative paths:
     *      ----        
     *  These paths begin without hash or begin with two or more hash (##+)
     *  characters. Relative paths are prepended with the passed root.
     *  
     *      Absolute paths:
     *      ----
     *  These paths begin with one hash characters. A possibly passed root is
     *  ignored.
     *  
     *  All paths are balanced. The directive of two or more hash characters is
     *  resolved, each double hash means that the preceding path segment is
     *  skipped. If more than two hash characters are used, it extends the jump
     *  length.
     *  
     *      Examples (root #x#y#z):
     *      ----
     *  #a#b#c#d#e##f   #a#b#c#d#f
     *  #a#b#c#d#e###f  #a#b#c#f
     *  ###f            #x#f  
     *  ####f           #f
     *  empty           #x#y#z
     *  #               #x#y#z
     *  a#b#c           #x#y#z#a#b#c
     *  
     *  Invalid roots and paths cause an exception.
     *  The method uses variable parameters and has the following signatures:
     *      function(root, path) 
     *      function(path) 
     *  @param  root optional, otherwise # is used 
     *  @param  path to normalize (URL is also supported, only the hash is used
     *               here and the URL itself is ignored)
     *  @return the normalize path
     *  @throws An error occurs in the following cases:
     *      - if the root and/or the path is invalid
     */
    Path.normalize = function(variants) {
            
        var path = null;
        var root = null;
        if (arguments.length == 1) {
            path = arguments[0];
        } else if (arguments.length >= 1) {
            root = arguments[0];
            try {root = Path.normalize(root);
            } catch (exception) {
                throw new TypeError("Invalid root" + (String(root).trim() ? ": " + root : ""));
            }
            path = arguments[1];
        }
        
        if (root == null
                || root.match(/^(#+)*$/))
            root = "#";

        if (path == null)
            return null;
        
        if (typeof path === "string"
                && path.match(Path.PATTERN_URL))
            path = path.replace(Path.PATTERN_URL, "$1");
        
        if (typeof path !== "string"
                || !path.match(Path.PATTERN_PATH))
            throw new TypeError("Invalid path" + (String(path).trim() ? ": " + path : ""));
        
        path = path.toLowerCase();
        
        //Functional paths are detected.
        if (path.match(Path.PATTERN_PATH_FUNCTIONAL))
            return "###";

        //Paths to the current root are detected.
        if (path.length == 0)
            return root;
        
        //Relative paths are extended with the root.
        if (path.match(/^[^#].*$/))
            path = root + "#" + path;
        if (path.match(/^#{2}.*$/))
            path = root + path;
        
        //Path will be balanced
        var pattern = /#[^#]+#{2}/;
        while (path.match(pattern))
            path = path.replace(pattern, "#");
        path = "#" + path.replace(/(^#+)|(#+)$/g, "");
        
        return path;
    };
};

if (typeof SiteMap === "undefined") {
    
    /**
     *  Static component for the use of a SiteMap for virtual paths.
     *  SiteMap is a directory consisting of faces and facets that are addressed
     *  by paths.
     *  
     *  A face is the primary projection of the content. This projection may
     *  contain additional sub-components, in form of facets and sub-faces.
     *  
     *  Facets are parts of a face (projection) and are not normally a
     *  standalone component. For example, the input mask and result table of a
     *  search can be separate facets of a face, as can articles or sections of
     *  a face. Both face and facet can be accessed via virtual paths. The path
     *  to a facet has the effect that the face is displayed with any other
     *  faces, but the requested facet is displayed in the visible area and
     *  focused.
     *  
     *  Faces are also components that can be nested.
     *  Thus, parent faces become partial faces when the path refers to a
     *  sub-face. A sub-face is presented with all its parent partial faces. If
     *  the parent faces contain additional facets, these facets are not
     *  displayed. The parent faces are therefore only partially presented.
     *  
     *  With the SiteMap the structure of faces, facets and the corresponding
     *  paths are described. The SiteMap controls the face flow and the
     *  presentation of the components corresponding to a path.
     *  This means that you don't have to take care of showing and hiding
     *  components yourself.
     *  
     *  The show and hide is hard realized in the DOM.
     *  This means that if a component is hidden, it is physically removed from
     *  the DOM and only added again when it is displayed.
     *  
     *  When it comes to controlling face flow, the SiteMap provides hooks for
     *  permission concepts and acceptors. With both things the face flow can be
     *  controlled and influenced. This way, the access to paths can be stopped
     *  and/or redirected/forwarded with own logic. 
     */
    SiteMap = {};

    /**
     *  Primarily, the root is always used when loading the page, since the
     *  renderer is executed before the MVC. Therefore, the renderer may not yet
     *  know all the paths and authorizations. After the renderer, the MVC is
     *  loaded and triggers the renderer again if the path requested with the
     *  URL differs.
     */
    SiteMap.location = "#";
    
    /**
     *  Internal counter of the path changes, is actually only used for
     *  initiation/detection of the initial rendering.
     */
    SiteMap.ticks;
    
    /** Assosiative array with all real paths without facets paths (key:path, value:facets). */
    SiteMap.paths;

    /** 
     *   Assosiative array with all paths with facet paths {path:key, facet:facet}
     *   The sum of all paths and assigned facets).
     */
    SiteMap.facets;

    /** Array with all supported acceptors. */  
    SiteMap.acceptors;
    
    /** Pattern for a valid face path. */
    SiteMap.PATTERN_PATH = /^(#([a-z](?:(?:\w+)|(?:[\w\-]+\w+))*)*)+$/;

    /** Pattern for a valid face path with optional facets. */
    SiteMap.PATTERN_PATH_FACETS = /^(#[a-z](?:(?:\w+)|(?:[\w\-]+\w+))*)(\s+(#[a-z](?:(?:\w+)|(?:[\w\-]+\w+))*)+)*$/;
    
    /**
     *  Checks a path using existing/registered permit methods.
     *  The path is only allowed if all permit methods confirm the check with
     *  the return value true.
     *  @param  path to check (URL is also supported, only the hash is used
     *               here and the URL itself is ignored)
     *  @return true if the path has been confirmed as permitted 
     */
    SiteMap.permit = function(path) {

        var acceptors = (SiteMap.acceptors || []).slice();
        while (acceptors.length > 0) {
            var acceptor = acceptors.shift();
            if (acceptor.pattern
                    && !acceptor.pattern.test(path))
                continue; 
            acceptor = acceptor.action.call(null, path);
            if (acceptor !== true) {
                if (typeof acceptor === "string")
                    acceptor = Path.normalize(acceptor);
                return acceptor; 
            }
        }
        
        return true;
    };

    /**
     *  Determines the real existing path according to the SiteMap.
     *  The methods distinguish between absolute, relative and functional paths.
     *  Functionals remain unchanged.
     *  Absolute and relative paths are balanced.
     *  Relative paths are balanced on the basis of the current location.
     *  All paths are checked against the SiteMap. Invalid paths are searched
     *  for a valid partial path. To do this, the path is shortened piece by
     *  piece. If no valid partial path can be found, the root is returned.
     *  Without passing a path, the current location is returned.
     *  @param  path to check - optional (URL is also supported, only the hash
     *               is used here and the URL itself is ignored)
     *  @return the real path determined in the SiteMap, or the unchanged
     *          function path.
     */  
    SiteMap.locate = function(path, strict) {
        
        path = path || "";
        
        //The path is normalized. 
        //Invalid paths are shortened when searching for a valid partial path.
        //Theoretically, the shortening must end automatically with the root or
        //the current path.
        try {path = Path.normalize(SiteMap.location, path);
        } catch (exception) {
            while (true) {
                path = path.replace(/(^[^#]+$)|(#[^#]*$)/, "");
                try {path = Path.normalize(SiteMap.location, path);
                } catch (exception) {
                    continue;
                }
                break;
            }
        }
        
        if (path.match(Path.PATTERN_PATH_FUNCTIONAL))
            return path;

        var paths = Object.keys(SiteMap.paths || {});
        if (!strict)
            paths = paths.concat(Object.keys(SiteMap.facets || {}));
        while (paths && path.length > 1) {
            if (paths.includes(path))
                return path;
            path = Path.normalize(path + "##");
        }
        
        return "#";
    };

    /**
     *  Navigates to the given path, if it exists in the SiteMap.
     *  All paths are checked against the SiteMap. Invalid paths are searched
     *  for a valid partial path. To do this, the path is shortened piece by
     *  piece. If no valid partial path can be found, the root is the target.
     *  @param path (URL is also supported, only the hash is used here and the
     *              URL itself is ignored)
     */    
    SiteMap.navigate = function(path) {
        window.location.hash = SiteMap.locate(path);
    };
    
    /**
     *  Returns the meta data for a path.
     *  The meta data is an object with the following structure:
     *      {path:..., face:..., facet:...}
     *  If no meta data can be determined because the path is invalid or not
     *  declared in the SiteMap, null is returned.
     *  @param  path optional, without SiteMap.location is used
     *  @return meta data object, otherwise null
     */
    SiteMap.lookup = function(path) {
        
        var paths = SiteMap.paths || {};
        var facets = SiteMap.facets || {};
        
        if (arguments.length <= 0)
            path = SiteMap.location;

        var canonical = function(meta) {
            if (!meta.facet)
                return meta.path;
            if (meta.path.endsWith("#"))
                return meta.path + meta.facet;
            return meta.path + "#" + meta.facet;
        };
        
        var focus = function(focus) {
            window.setTimeout((focus) => {
                focus = focus ? document.querySelector("#" + focus) : focus;
                if (focus) {
                    focus.scrollIntoView(true);
                    focus.focus();
                }
            }, 0, (focus.facet || focus.face).replace(/^.*#/, ""));
        };

        if (paths.hasOwnProperty(path))
            return {path:path, face:path, facet:null, focus:function() {
                focus(this);
            }};
        else if (facets.hasOwnProperty(path))
            return {path:canonical(facets[path]), face:facets[path].path, facet:facets[path].facet, focus:function() {
                focus(this);
            }};
        return null;
    };

    /**
     *  Checks whether a path or subpath is currently being used.
     *  This is used to show/hide composites depending on the current location.
     *  @param  path
     *  @return true if the path or subpath is currently used, otherwise false
     */
    SiteMap.accept = function(path) {
        
        //Only valid paths can be confirmed.
        path = (path || "").trim().toLowerCase();
        if (!path.match(/^#.*$/))
            return false;
        path = path.replace(/(#.*?)#*$/, "$1");

        //The current path is determined and it is determined whether it is a
        //face or a facet. In both cases, a meta object is created:
        //    {path:#path, facet:...}
        var location = SiteMap.lookup(Path.normalize(SiteMap.location));
        if (!location)
            return false;
        
        //Determines whether the passed path is a face, partial face or facet.
        //(Partial)faces always have the higher priority for facets.
        //If nothing can be determined, there cannot be a valid path.
        var lookup = SiteMap.lookup(path);
        if (!lookup)
            return false;
        
        var partial = lookup.path;
        if (!partial.endsWith("#"))
            partial += "#";
        
        //Facets are only displayed if the paths match and the path does not
        //refer to a partial face.
        if (lookup.facet
                && location.face != lookup.face
                && !location.path.startsWith(partial))
            return false;

        //Faces and partial faces are only displayed if the paths match or the
        //path starts with the passed path as a partial path.
        if (!location.path.startsWith(partial)
                && location.face != lookup.face)
            return false;

        //Invalid paths and facets are excluded at this place, because they
        //already cause a false termination of this method (return false) and do
        //not have to be checked here anymore.

        return true;
    };
    
    /**
     *  Configures the SiteMap individually.
     *  The configuration is passed as a meta object.
     *  The keys (string) correspond to the paths, the values are arrays with
     *  the valid facets for a path.
     *  
     *      sitemap = {
     *          "#": ["news", "products", "about", "contact", "legal"],
     *          "products#papers": ["paperA4", "paperA5", "paperA6"],
     *          "products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
     *          "products#pens": ["pencil", "ballpoint", "stylograph"],
     *          "legal": ["terms", "privacy"],
     *          ...
     *      };
     *      
     *  The method has different signatures and can be called several times.
     *  If the method is called more than once, the configurations are
     *  concatenated and existing values in the configuration are overwritten.
     *  
     *  The following signatures are available:
     *  
     *      SiteMap.customize({meta});
     *      SiteMap.customize({meta}, function(path) {...});
     *      SiteMap.customize(RegExp, function(path) {...});
     *     
     *      SiteMap as meta object:
     *      ----
     *  The first configuration describes the SiteMap as a meta object.
     *  The meta object defines all available paths and facets for the face
     *  flow.    
     *      
     *      SiteMap as meta object and permit function:
     *      ----
     *  In the second example, a permit method is passed in addition to the
     *  SiteMap as a meta object. This method is used to implement permission
     *  concepts and can be used to check and manipulate paths.
     *  Several permit methods can be registered.
     *  All requested paths pass through the permit method(s). This can decide
     *  what happens to the path. 
     *  From the permit method a return value is expected, which can have the
     *  following characteristics:
     *  
     *      true:
     *  The validation is successful and the iteration via further permit method
     *  is continued. If all permit methods return true and thus confirm the
     *  path, it is used.
     *       
     *      String:
     *  The validation (iteration over further permit-merhodes) will be aborted
     *  and it will be forwarded to the path corresponding to the string. 

     *      In all other cases:
     *  The path is regarded as invalid/unauthorized, the validation (iteration
     *  over further permit-merhodes) will be aborted and is forwarded to the
     *  original path.
     *  
     *  A permit method for paths can optionally be passed to each meta object.
     *  This is interesting for modules that want to register and validate their
     *  own paths.
     *  
     *      Acceptor:
     *      ----
     *  Acceptors work in a similar way to permit methods.
     *  In difference, permit methods are called for each path and acceptors are
     *  only called for those that match the RegExp pattern.
     *  Also from the permit method a return value is expected, which can have
     *  the following characteristics -- see SiteMap with permit function.
     *  
     *      SiteMap.customize(/^phone.*$/i, function(path) {
     *              dial the phone number
     *      });
     *      SiteMap.customize(/^mail.*$/i, function(path) {
     *              send a mail
     *      });
     *      SiteMap.customize(/^sms.*$/i, function(path) {
     *              send a sms
     *      });
     *      
     *      SiteMap.customize(RegExp, function);
     * 
     *  Permit methods and acceptors are regarded as one set and called in the
     *  order of their registration. 
     *  
     *      Important note about how the SiteMap works:
     *      ----
     *  The SiteMap collects all configurations cumulatively. All paths and
     *  facets are summarized, acceptors and permit methods are collected in the
     *  order of their registration. A later determination of which metadata was
     *  registered with which permit methods is not possible.
     *  
     *  The configuration of the SiteMap is only applied if an error-free meta
     *  object is passed and no errors occur during processing.
     *  
     *  The method uses variable parameters as and according to the previous
     *  description.
     *
     *  @param  pattern
     *  @param  callback
     *  @param  meta
     *  @param  permit
     *  @throws An error occurs in the following cases:
     *      - if the data type of acceptor and/or callback is invalid
     *      - if the data type of map and/or permit is invalid
     *      - if the syntax and/or the format of facets are invalid
     */
    SiteMap.customize = function(variants) {
        
        if (arguments.length > 1
                && arguments[0] instanceof RegExp) {
            if (typeof arguments[1] !== "function")
                throw new TypeError("Invalid acceptor: " + typeof arguments[1]);
            SiteMap.acceptors = SiteMap.acceptors || [];
            SiteMap.acceptors.push({pattern:arguments[0], action:arguments[1]});
            return;
        }

        if (arguments.length < 1
                || typeof arguments[0] !== "object")
            throw new TypeError("Invalid map: " + typeof arguments[0]);
        var map = arguments[0];

        var acceptors = (SiteMap.acceptors || []).slice();
        if (arguments.length > 1) {
            if (typeof arguments[1] !== "function")
                throw new TypeError("Invalid permit: " + typeof arguments[1]);
            acceptors.push({pattern:null, action:arguments[1]});
        }
        
        var paths = {};
        Object.keys(SiteMap.paths || {}).forEach((key) => {
            if (typeof key === "string"
                    && key.match(SiteMap.PATTERN_PATH))
                paths[key] = SiteMap.paths[key];
        });

        var facets = {};
        Object.keys(SiteMap.facets || {}).forEach((key) => {
            if (typeof key === "string"
                    && key.match(SiteMap.PATTERN_PATH))
                facets[key] = SiteMap.facets[key];
        });

        Object.keys(map).forEach((key) => {

            //A map entry is based on a path (datatype string beginning with #)
            //and an array of String or null as value. 
            if (typeof key !== "string"
                    || !key.match(SiteMap.PATTERN_PATH))
                return;
            var value = map[key];
            if (value != null
                    && !Array.isArray(value))
                return;
            
            key = Path.normalize(key);
            
            //The entry is added to the path map, if necessary as empty array.
            //Thus the following path map object will be created:
            //    {#path:[facet, facet, ...], ...}
            paths[key] = paths[key] || [];
            
            //In the next step, the facets for a path are determined.
            //These are added to the path in the path map if these do not
            //already exist there. Additional a facet map object will be created:
            //    {#facet-path:{path:#path, facet:facet}, ...}
            value = value || [];
            value.forEach((facet) => {
                //Facets is an array of strings with the names of the facets.
                //The names must correspond to the PATTERN_PATH_FACET.
                if (typeof facet !== "string")
                    throw new TypeError("Invalid facet: " + typeof facet);
                facet = facet.toLowerCase().trim();
                if (!facet.match(SiteMap.PATTERN_PATH_FACET))
                    throw new Error("Invalid facet: " + facet);
                //If the facet does not exist at the path, the facet is added.
                if (!paths[key].includes(facet))
                    paths[key].push(facet);
                //The facet map object is assembled.
                facets[Path.normalize(key, facet)] = {path:key, facet:facet};
            });
        });
        
        SiteMap.acceptors = acceptors;
        SiteMap.paths = paths;
        SiteMap.facets = facets;
    };
    
    /**
     *  Rendering filter for all composite elements.
     *  The filter causes an additional condition for the SiteMap to be added to
     *  each composite element that the renderer determines. This condition is
     *  used to show or hide the composite elements in the DOM to the
     *  corresponding virtual paths. The elements are identified by the serial.
     *  The SiteMap uses a map (serial/element) as cache for fast access. The
     *  cleaning of the cache is done by a MotationObserver.
     */
    Composite.customize((element) => {
        
        if (!(element instanceof Element)
                || !element.hasAttribute(Composite.ATTRIBUTE_COMPOSITE))
            return;
        if (element.hasAttribute("static"))
            return;
        
        var path = "#" + Composite.mount.locate(element).model.replace(/\./g, "#").toLowerCase();
        
        var script = null;
        if (element.hasAttribute(Composite.ATTRIBUTE_CONDITION)) {
            script = element.getAttribute(Composite.ATTRIBUTE_CONDITION).trim();
            if (script.match(Composite.PATTERN_EXPRESSION_CONTAINS))
                script = script.replace(Composite.PATTERN_EXPRESSION_CONTAINS, (match, offset, content) => {
                    match = match.substring(2, match.length -2).trim();
                    return "{{SiteMap.accept(\"" + path + "\") and (" + match + ")}}";
                });
        }
        if (!script)
            script = (script || "") + "{{SiteMap.accept(\"" + path + "\")}}";
        element.setAttribute(Composite.ATTRIBUTE_CONDITION, script);
    });

    /**
     *  Established a listener that listens when the page loads.
     *  The method initiates the initial usage of the path.
     */
    window.addEventListener("load", (event) => {
        
        //Initially the page-module is loaded.
        //The page-module is similar to an autostart, it is used to initialize
        //the single page application. It consists of common.js and common.css.
        //The configuration of the SiteMap and essential styles can/should be
        //stored here.
        Composite.render.include("common");
        
        //When clicking on a link with the current path, the focus must be set
        //back to face/facet, as the user may have scrolled on the page.
        //However, this is only necessary if face + facet have not changed.
        //In all other cases the Window-HashChange-Event does the same
        document.body.addEventListener("click", (event) => {
            if (event.target
                    && event.target instanceof Element
                    && event.target.hasAttribute("href")) {
                var target = SiteMap.lookup(event.target.getAttribute("href"));
                var source = SiteMap.lookup(Path.normalize(SiteMap.location));
                if (source && target
                        && source.face == target.face
                        && source.facet == target.facet)
                    target.focus();
            }
        });

        //Without a SiteMap the page will be rendered initially after loading.
        //Then the page has to take control.
        if (Object.keys(SiteMap.paths || {}).length <= 0) {
            Composite.render(document.body);
            return;
        }

        var source = window.location.hash;
        var target = SiteMap.locate(source);

        if (!source
                && window.location.href.match(/[^#]#$/))
            source = "#";
        
        var event = document.createEvent("HTMLEvents");
        event.initEvent("hashchange", false, true);
        event.newURL = target;

        if (source != target)
            SiteMap.navigate(target);
        else window.dispatchEvent(event);
    });
    
    /**
     *  Establishes a listener that listens to changes from the URL hash.
     *  The method corrects invalid and unauthorized paths by forwarding them to
     *  the next valid path, restores the facet of functional paths, and
     *  organizes partial rendering.
     */
    window.addEventListener("hashchange", (event) => {

        //Without a SiteMap no automatic rendering can be initiated.
        if (Object.keys(SiteMap.paths || {}).length <= 0)
            return;
            
        var source = Path.normalize(SiteMap.location);
        var locate = (event.newURL || "").replace(Path.PATTERN_URL, "$1");
        var target = SiteMap.locate(locate);
        
        //Discrepancies in the path cause a forwarding to a valid path.
        if (locate != target) {
            SiteMap.navigate(target);
            return;
        }        
        
        SiteMap.ticks = (SiteMap.ticks || 0) +1;
        
        //For functional interaction paths, the old path must be restored.
        //Rendering is not necessary because the face/facet does not change or
        //the called function has partially triggered rendering.
        if (target.match(Path.PATTERN_PATH_FUNCTIONAL)) {
            var x = window.pageXOffset || document.documentElement.scrollLeft;
            var y = window.pageYOffset || document.documentElement.scrollTop;
            window.location.replace(source);
            window.scrollTo(x, y);
            return;
        }
        
        //If the permission is not confirmed, will be forwarded to the next
        //higher known/permitted path, based on the requested path.
        //Alternatively, the permit methods can also supply a new target, which
        //is then jumped to.
        var forward = SiteMap.permit(target);
        if (forward !== true) {
            if (typeof forward == "string")
                SiteMap.navigate(forward);
            else SiteMap.navigate(target != "#" ? target + "##" : "#");
            return;
        }
        
        SiteMap.location = target;
        
        source = SiteMap.lookup(source);
        target = SiteMap.lookup(target);
        
        //The new focus is determined and set with a delay after the rendering.
        //This is important because the target may not exist before rendering.
        //The focus is only changed if the face or facet has changed.
        //In the case of functional links, the focus must not be set, since it
        //scrolls relative to the last position.
        if (source && target
                && (source.face != target.face
                        || source.facet != target.facet))
            target.focus();
        
        //Only if the face is changed or initial, a rendering is necessary.
        if (source.face == target.face
                && SiteMap.ticks > 1)
            return;
        
        source = source.face;
        if (!source.endsWith("#"))
            source += "#";
        target = target.face;
        if (!target.endsWith("#"))
            target += "#";
        
        //The deepest similarity in both paths is used for rendering.
        //Render as minimal as possible:
        //  old: #a#b#c#d#e#f  new: #a#b#c#d      -> render #d
        //  old: #a#b#c#d      new: #a#b#c#d#e#f  -> render #d
        //  old: #a#b#c#d      new: #e#f          -> render # (body)
        var render = "#";
        if (source.startsWith(target))
            render = target;
        else if (target.startsWith(source))
            render = source;
        render = render.match(/((?:#[^#]+)|(?:^))#*$/)[0];
        if (render && render[1])
            Composite.render(render[1]);
        else Composite.render(document.body);
    });
};

/**
 *  Test is a simple API and module to implement and execute integration tests.
 *  The tests can be implemented as suites, scenarios and test cases.
 *  
 *  
 *      Case
 *      ----
 *  The smallest and simplest element in an integration test, used here as
 *  task, because case is a keyword. It can be implemented alone, but is always
 *  used in a scenario.
 *  
 *  Test.create({test:function() {
 *      Assert.assertTrue(true);
 *  }});
 *  
 *  Test.start();
 *  
 *  
 *      Scenario
 *      ----
 *  A scenario is a sequence of a lot of test cases usually in one file.
 *  
 *  Test.create({test:function() {
 *      Assert.assertTrue(true);
 *  }});
 *  
 *  Test.create({name:"example", timeout:1000, test:function() {
 *      Assert.assertTrue(true);
 *  }});
 *  
 *  Test.create({error:Error test:function() {
 *      throw new Error();
 *  }});
 *  
 *  Test.create({error:/^My Error/i, test:function() {
 *      throw new Error("My Error");
 *  }});
 *  
 *  Test.create({ignore:true, test:function() {
 *      Assert.assertTrue(true);
 *  }});
 *  
 *  Test.start();
 *  
 *  
 *      Suite
 *      ----
 *  A suite is a complex bundle of different test cases, scenarios and other
 *  suites. Usually a suite consists of different files, which then represent a
 *  complex test. An example of a good suite is a cascade of different files, if
 *  the test can be started in any file and place. This makes it possible to
 *  perform the integration test on different levels and with different
 *  complexity.
 *  
 *      
 *      Assert
 *      ----
 *  The test cases are implemented with assertions. The test module provides
 *  elementary assertions, you can implement more. The function is simple. If an
 *  assertion was not true, a error is thrown -- see as an example the
 *  implementation here.
 *  
 *  Test 1.0 20190312
 *  Copyright (C) 2019 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20190312
 */
if (typeof Test === "undefined") {
    
    /**
     *  Static component for creating and executing tests.
     *  The component provides static functions and objects for implementing
     *  integration tests.
     *  
     *  The Test API is part of aspect-js but has to be activated deliberately,
     *  otherwise it is not available.
     *  
     *      Test.activate();
     *  
     *  This is necessary so that some enhancements to the JavaScript API that
     *  are helpful for implementing test are not used productively.
     *  For example, the redirection and caching of console output.
     */
    Test = {};
    
    /** 
     *  Activates the test API.
     *  The method can be called multiple times, but is ignored after the first
     *  call. A later deactivation of the test API is not possible.
     */
    Test.activate = function() {
        
        if (typeof Test.activate.lock !== "undefined")
            return;
        Test.activate.lock = true;
        
        /** The output to be used for all messages and errors */
        Test.output;
        
        /** The monitor to be used */
        Test.monitor;
        
        /** Stack of created/registered test tasks (backlog) */
        Test.stack;
        
        /** Queue of currently running test tasks */ 
        Test.queue;
        
        /** The currently performed test task */  
        Test.task;
        
        /** Timer for processing the queue */
        Test.interval;
        
        /** Counter for identification of test tasks */
        Test.serial;
        
        /** Timer for controlling test tasks with timeout */
        Test.timeout;
        
        /** Indicator if the autostart function can be used */
        Test.autostart;
        
        /** Assoziative array with events and their registered listerners */
        Test.listeners;
        
        /** Pattern for all accepted events */
        Test.PATTERN_EVENT = /^[a-z]+$/;
        
        /** Constants of events */    
        Test.EVENT_FINISH = "finish";
        Test.EVENT_INTERRUPT = "interrupt";
        Test.EVENT_PERFORM = "perform";
        Test.EVENT_RESPONSE = "response";
        Test.EVENT_RESUME = "resume";
        Test.EVENT_START = "start";
        Test.EVENT_SUSPEND = "suspend";

        /**
         *  Optional configuration of the test environment.
         *  You can configure (also separately): the output and a monitor.
         *  
         *      Output
         *      ----
         *      
         *  Simple function or object for outputting messages and errors.
         *  If not specified, console object is used.    
         *  
         *      Implementation of an output (as function or object):
         *      
         *  var output = {
         *  
         *      log:function(message) {
         *          ...
         *      },
         *      
         *      error:function(message) {
         *          ...
         *      }
         *  };
         *  
         *      Monitor
         *      ----
         *      
         *  Monitors the test procedure and is informed about the various cycles
         *  during execution. The monitor also controls the data output. For
         *  example, the output can be redirected to DOM elements. Without a
         *  monitor the tests will also be performed, but there will be an
         *  output about success and failure.
         *  If no monitor is specified, the internal monitor is used with a
         *  simple console output.     
         *  
         *      Implementation of a monitor (as function or object):
         *      
         *  var monitor = {
         *  
         *      start:function(status) {
         *          The method is called with the start.
         *      },
         *      
         *      suspend:function(status) {
         *          The method is called with the start.
         *      },
         *      
         *      resume:function(status) {
         *          The method is called if the test run is stopped and is to be
         *          continued later.
         *      },
         *      
         *      interrupt:function(status) {
         *          The method is called if you want to abort the test run.
         *          The test run cannot then be resumed.
         *      },
         *      
         *      perform:function(status) {
         *          The method is called before a test task is performed.
         *      },
         *      
         *      response:function(status) {
         *          The method is called when a test task has been performed.
         *          Here you can find the result of the test task.
         *      },
         *      
         *      finish:function(status) {
         *          The method is called when all test tasks have been completed.
         *      }
         *  };
         *  
         *  The current status is passed to all monitor methods as an object.
         *  The status is a snapshot of the current test run with details of the
         *  current task and the queue. You can read the details, but you can't
         *  change them.
         *   
         *      structure of status: {task:..., queue:...}
         *      
         *  task.title      title of the test task    
         *  task.meta       meta information about the test itself
         *                  name, test, timeout, expected, serial
         *  task.running    indicator when the test task is in progress
         *  task.timing     start time from the test task in milliseconds
         *  task.timeout    optional, the time in milliseconds when a timeout is
         *                  expected
         *  task.duration   total execution time of the test task in
         *                  milliseconds, is set with the end of the test task
         *  task.error      optional, if an unexpected error (also asser error)
         *                  has occurred, which terminated the test task
         *  
         *  queue.timing    start time in milliseconds 
         *  queue.size      original queue length
         *  queue.length    number of outstanding tests
         *  queue.progress  number of tests performed     
         *  queue.lock      indicator when a test is performed and the queue is
         *                  waiting
         *  queue.faults    number of detected faults
         *  
         *  @param options
         */
        Test.configure = function(options) {
            
            if (typeof options !== "object"
                    && typeof options !== "function")
                return;
            
            if (typeof options.output === "object"
                    || typeof options.output === "function")
                Test.output = options.output;
            if (typeof options.monitor === "object"
                    || typeof options.monitor === "function")
                Test.monitor = options.monitor;
        };
        
        /**
         *  Registers a callback function for test events.
         *  @param  event    see Test.EVENT_***
         *  @param  callback callback function
         *  @throws An error occurs in the following cases:
         *      - event is not valid or is not supported
         *      - callback function is not implemented correctly or does not exist
         */
        Test.listen = function(event, callback) {
            
            if (typeof event !== "string")
                throw new TypeError("Invalid event: " + typeof event);
            if (typeof callback !== "function"
                    && callback !== null
                    && callback !== undefined)
                throw new TypeError("Invalid callback: " + typeof callback);        
            if (!event.match(Test.PATTERN_EVENT))
                throw new Error("Invalid event" + (event.trim() ? ": " + event : ""));
            
            event = event.toLowerCase();
            Test.listeners = Test.listeners || [];
            if (!Array.isArray(Test.listeners[event]))
                Test.listeners[event] = [];
            Test.listeners[event].push(callback);
        };  
        
        /**
         *  Internal method to trigger an event.
         *  All callback functions for this event are called.
         *  @param event  see Test.EVENT_***
         *  @param status status object with information about the test execution
         */
        Test.fire = function(event, status) {
            
            if (typeof Test.monitor === "object"
                && typeof Test.monitor[event] === "function")
            try {Test.monitor[event](status);
            } catch (error) {
                console.error(error);
            }        

            event = (event || "").trim();
            if (!Test.listeners
                    || !event)
                return;
            var listeners = Test.listeners[event.toLowerCase()];
            if (!Array.isArray(listeners))
                return;
            listeners.forEach((callback, index, array) => {
                window.setTimeout(callback, 0, event, status);
            });        
        };    
        
        /**
         *  Creates and registers a test task.
         *  A test task is a function or object with the required meta information
         *  for performing and a test method to be executed.
         *  
         *      structure of meta: {name:..., test:..., timeout:..., expected:..., ignore:...}
         *      
         *  meta.name       optional name of the test task
         *  meta.test       an implemented method to be executed as a test
         *  meta.timeout    maximum runtime of the test task in milliseconds
         *                  Exceeding this limit will cause the test to fail.
         *                  A value greater than 0 is expected, otherwise the
         *                  timeout is ignored.
         *  meta.expected   if you want to test for the occurrence of an error
         *                  The error must occur if the test is successful.
         *                  An error object or a RegExp is expected as value.
         *  meta.ignore     true, if the test is to be ignored
         *  
         *      usage:
         *      
         *  Test.create({test:function() {
         *      Assert.assertTrue(true);
         *  }});
         *  
         *  Test.create({name:"example", timeout:1000, test:function() {
         *      Assert.assertTrue(true);
         *  }});
         *  
         *  Test.create({error:Error test:function() {
         *      throw new Error();
         *  }});
         *  
         *  Test.create({error:/^My Error/i, test:function() {
         *      throw new Error("My Error");
         *  }});
         *  
         *  Test.create({ignore:true, test:function() {
         *      Assert.assertTrue(true);
         *  }});
         */
        Test.create = function(meta) {
            
            if (typeof meta !== "object"
                    || typeof meta.test !== "function")
                return;
            
            if (typeof meta.ignore !== "undefined"
                    && meta.ignore === true)
                return;
            
            Test.stack = Test.stack || [];
            if (Test.stack.indexOf(meta) >= 0)
                return;
            if (Test.serial == undefined)
                Test.serial = 0;
            meta.serial = ++Test.serial;
            Test.stack.push(meta);
        };

        /**
         *  (Re)Starts the test run.
         *  The start can be done manually or when using auto = true, by loading
         *  the page. If the page is already loaded, the parameter auto is
         *  ignored and the start is executed immediately.
         *  @param auto true, the start is triggered when the page is loaded
         */
        Test.start = function(auto) {

            if (Test.interval)
                return;

            if (auto && document.readyState == "loaded") {
                if (typeof Test.autostart === "undefined") {
                    Test.autostart = true;
                    window.addEventListener("load", () => {
                        Test.start();
                    });
                }
                return;
            }
            
            var numerical = function(number, text) {
                return number + " " + text + (number != 1 ? "s" : "");
            };
            
            Test.output = Test.output || console;
            Test.monitor = Test.monitor || {
                start:function(status) {
                    Test.output.log(new Date().toUTCString() + " Test is started"
                            + ", " + numerical(status.queue.size, "task") + " in the queue");
                },
                suspend:function(status) {
                    Test.output.log(new Date().toUTCString() + " Test is suspended"
                            + ", " + numerical(status.queue.length, "task") + " still outstanding");
                },
                resume:function(status) {
                    Test.output.log(new Date().toUTCString() + " Test is continued "
                            + ", " + numerical(status.queue.size, "task") + " in the queue");
                },
                interrupt:function(status) {
                    Test.output.log(new Date().toUTCString() + " Test is interrupted"
                            + "\n\t" + numerical(status.queue.size -status.queue.progress, "task") + " still outstanding"
                            + "\n\t" + numerical(status.queue.faults, "fault") + " were detected"
                            + "\n\ttotal time " + (new Date().getTime() -status.queue.timing) + " ms");
                },
                perform:function(status) {
                },
                response:function(status) {
                    var timing = new Date().getTime() -status.task.timing;
                    if (status.task.error)
                        Test.output.error(new Date().toUTCString() + " Test task " + status.task.title + " " + status.task.error.message);
                    else Test.output.log(new Date().toUTCString() + " Test task " + status.task.title + " was successful (" + timing + " ms)");
                },
                finish:function(status) {
                    Test.output.log(new Date().toUTCString() + " Test is finished"
                            + "\n\t" + numerical(status.queue.size, "task") + " were performed"
                            + "\n\t" + numerical(status.queue.faults, "fault") + " were detected"
                            + "\n\ttotal time " + (new Date().getTime() -status.queue.timing) + " ms");
                }            
            };

            Test.stack = Test.stack || [];
            Test.queue = Test.queue || {timing:false, stack:[], size:0, lock:false, progress:0, faults:0};
            if (Test.queue.stack.length == 0) {
                Test.queue.stack = Test.stack.slice();
                Test.queue.size = Test.queue.stack.length;
                Test.queue.timing = new Date().getTime();
            }
            
            Test.timeout = window.setInterval(() => {

                if (!Test.task
                        || !Test.task.running
                        || !Test.queue.lock)
                    return;
                if (!Test.task.timeout
                        || Test.task.timeout > new Date().getTime())
                    return;
                Test.task.duration = new Date().getTime() -task.timing;
                Test.task.error = new Error("Timeout occurred, expected " + Test.task.timeout + " ms but was " + Test.task.duration + " ms");
                Test.fire(Test.EVENT_RESPONSE, Test.status());
                Test.queue.faults++;
                Test.queue.lock = false;
            }, 25);
            
            Test.interval = window.setInterval(() => {
                
                if (!Test.queue.lock
                        && Test.queue.progress <= 0)
                    Test.fire(Test.EVENT_START, Test.status());
                
                if (Test.queue.lock)
                    return;
                
                if (Test.queue.stack.length > 0) {
                    Test.queue.lock = true;
                    Test.queue.progress++;
                    var meta = Test.queue.stack.shift();
                    var timeout = false;
                    if ((meta.timeout || 0) > 0)
                        timeout = new Date().getTime() +meta.timeout;
                    Test.task = {title:null, meta:meta, running:true, timing:new Date().getTime(), timeout:timeout, duration:false, error:null};
                    Test.task.title = "#" + meta.serial;
                    if (typeof meta.name === "string"
                            && meta.name.trim().length > 0)
                        Test.task.title += " " + meta.name.replace(/[\x00-\x20]+/g, " ").trim();
                    Test.fire(Test.EVENT_PERFORM, Test.status());
                    window.setTimeout(() => {
                        var task = Test.task;
                        try {task.meta.test();
                        } catch (error) {
                            task.error = error;
                            if (!task.error.message
                                    || !task.error.message.trim())
                                task.error.message = "failed";
                        } finally {
                            if (task.meta.expected) {
                                if (task.error) {
                                    if (typeof task.meta.expected === "function"
                                            && task.error instanceof(task.meta.expected))
                                        task.error = null;
                                    if (typeof task.meta.expected === "object"
                                            && task.meta.expected instanceof(RegExp)
                                            && String(task.error).match(task.meta.expected))
                                        task.error = null;
                                } else task.error = Error("Assert error expected failed");
                            }
                            task.running = false;
                            task.duration = new Date().getTime() -task.timing;
                            if (task.timeout
                                    && task.timeout < new Date().getTime()
                                    && !task.error) {
                                task.error = new Error("Timeout occurred, expected " + task.meta.timeout + " ms but was " + task.duration + " ms");                            
                                Test.fire(Test.EVENT_RESPONSE, Test.status());
                                Test.queue.faults++;
                            }
                            if (!task.error
                                    || !String(task.error.message).match(/^Timeout occurred/)) {
                                if (task.error)
                                    Test.queue.faults++;
                                Test.fire(Test.EVENT_RESPONSE, Test.status());
                            }
                            Test.queue.lock = false;
                        }
                    }, 0);
                    return;
                }
                
                window.clearTimeout(Test.interval);
                Test.interval = null;
                Test.task = null;
                Test.fire(Test.EVENT_FINISH, Test.status());
            }, 25);
        };
        
        /**
         *  Suspends the current test run, which can be continued from the
         *  current test with Test.resume().
         */
        Test.suspend = function() {

            if (!Test.interval)
                return;
            window.clearTimeout(Test.interval);
            Test.interval = null;
            while (Test.queue.lock)
                continue;
            Test.task = null;
            Test.fire(Test.EVENT_SUSPEND, Test.status());
        };
        
        /** Continues the test run if it was previously suspended. */
        Test.resume = function() {

            if (!Test.interval)
                return;
            while (Test.queue.lock)
                continue;
            Test.task = null;        
            if (Test.queue.stack.length <= 0)
                return;
            Test.start();
            Test.fire(Test.EVENT_RESUME, Test.status());
        };
        
        /**
         *  Interrupts the current test run and discards all outstanding tests.
         *  The test run can be restarted with Test.start().
         */
        Test.interrupt = function() {
            
            if (!Test.interval)
                return;
            window.clearTimeout(Test.interval);
            Test.interval = null;
            while (Test.queue.lock)
                continue;
            Test.task = null;        
            Test.queue.stack = [];
            Test.fire(Test.EVENT_INTERRUPT, Test.status());
        };
        
        /**
         *  Take a snapshot of the running test.
         *  Returns an object with copies of the task and the queue with detailed
         *  status information. If no test run is executed, false is returned.
         *   
         *      structure of details: {task:..., queue:...}
         *      
         *  task.title      title of the test task    
         *  task.meta       meta information about the test itself
         *                  name, test, timeout, expected, serial
         *  task.running    indicator when the test task is in progress
         *  task.timing     start time from the test task in milliseconds
         *  task.timeout    optional, the time in milliseconds when a timeout is
         *                  expected
         *  task.duration   total execution time of the test task in
         *                  milliseconds, is set with the end of the test task
         *  task.error      optional, if an unexpected error (also asser error)
         *                  has occurred, which terminated the test task
         *  
         *  queue.timing    start time in milliseconds 
         *  queue.size      original queue length
         *  queue.length    number of outstanding tests
         *  queue.progress  number of tests performed     
         *  queue.lock      indicator when a test is performed and the queue is
         *                  waiting
         *  queue.faults    number of detected faults 
         *  
         *  @return an object with detailed status information, otherwise false
         */
        Test.status = function() {
            
            var task = null;
            if (Test.task)
                task = {
                    title:Test.task.title,
                    meta:Test.task.meta,
                    running:Test.task.running,
                    timing:Test.task.timing,
                    timeout:Test.task.timeout,
                    duration:Test.task.duration,
                    error:Test.task.error
                };

            var queue = null;
            if (Test.queue)
                queue = {
                    timing:Test.queue.timing,
                    size:Test.queue.size,
                    length:Test.queue.stack.length,
                    progress:Test.queue.progress,
                    lock:Test.queue.lock,
                    faults:Test.queue.faults
                };
            
            return {task:task, queue:queue};
        };    
    
        if (typeof Assert === "undefined") {
    
            /**
             *  A set of assertion methods useful for writing tests.
             *  Only failed assertions are recorded.
             *  These methods can be used directly:
             *      Assert.assertEquals(...);
             */ 
            Assert = {};
            
            /**
             *  Creates a new assertion based on an array of variant parameters.
             *  Size defines the number of test values.
             *  If more parameters are passed, the first must be the message.
             *  @param arguments
             *  @param size
             */
            Assert.create = function(arguments, size) {
    
                var assert = {message:null, values:[], error:function() {
                    var words = Array.from(arguments);
                    words.forEach((argument, index, array) => {
                        array[index] = String(argument).replace(/\{(\d+)\}/g, (match, index) => {
                            if (index > assert.values.length)
                                return "[null]";
                            match = String(assert.values[index]);
                            match = match.replace(/\s*[\r\n]+\s*/g, " "); 
                            return match;
                        });
                    });
                    
                    var message = "expected {1} but was {2}";
                    if (assert.message != null) {
                        assert.message = assert.message.trim();
                        if (assert.message)
                            message = assert.message;
                    }
                    message = "{0} failed, " + message;
                    message = message.replace(/\{(\d+)\}/g, (match, index) => {
                        if (index > words.length)
                            return "[null]";
                        match = String(words[index]);
                        match = match.replace(/\s*[\r\n]+\s*/g, " "); 
                        return match;                
                    });
                    return new Error(message);
                }};
                
                arguments = Array.from(arguments);
                if (arguments.length > size)
                    assert.message = arguments.shift();
                while (arguments.length > 0)
                    assert.values.push(arguments.shift());
    
                return assert;
            };
            
            /**
             *  Asserts that an value is true.
             *  If the assertion is incorrect, an error with a message is thrown.
             *  The method has the following various signatures:
             *      function(message, value) 
             *      function(value) 
             *  @param message
             *  @param value
             */       
            Assert.assertTrue = function(variants) {
                
                var assert = Assert.create(arguments, 1);
                if (assert.values[0] === true)
                    return;
                throw assert.error("Assert.assertTrue", "true", "{0}");
            };
            
            /**
             *  Asserts that an value is false.
             *  If the assertion is incorrect, an error with a message is thrown.
             *  The method has the following various signatures:
             *      function(message, value) 
             *      function(value) 
             *  @param message
             *  @param value
             */      
            Assert.assertFalse = function(variants) {
                
                var assert = Assert.create(arguments, 1);
                if (assert.values[0] === false)
                    return;
                throw assert.error("Assert.assertFalse", "false", "{0}");
            };
    
            /**
             *  Asserts that two values are equals.
             *  Difference between equals and same: === / == or !== / !=
             *  If the assertion is incorrect, an error with a message is thrown.
             *  The method has the following various signatures:
             *      function(message, expected, actual) 
             *      function(expected, actual) 
             *  @param message
             *  @param expected
             *  @param actual
             */     
            Assert.assertEquals = function(variants) {
                
                var assert = Assert.create(arguments, 2);
                if (assert.values[0] === assert.values[1])
                    return;
                throw assert.error("Assert.assertEquals", "{0}", "{1}");
            };
            
            /**
             *  Asserts that two values are not equals.
             *  Difference between equals and same: === / == or !== / !=
             *  If the assertion is incorrect, an error with a message is thrown.
             *  The method has the following various signatures:
             *      function(message, unexpected, actual) 
             *      function(unexpected, actual) 
             *  @param message
             *  @param unexpected
             *  @param actual
             */      
            Assert.assertNotEquals = function(variants) {
                
                var assert = Assert.create(arguments, 2);
                if (assert.values[0] !== assert.values[1])
                    return;
                throw assert.error("Assert.assertNotEquals", "not {0}", "{1}");
            };
            
            /**
             *  Enhancement of the Test/Assert API
             *  Adds a equals methode for a template to the Assert objects.
             *  Spaces at the beginning and end of lines are ignored.
             */
            Assert.assertEqualsTo = function(selector, actual) {
                var element = document.querySelector(selector);
                var content = element.innerHTML.trim().replace(/\t/g, "    ");
                content = content.replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n");
                content = content.replace(/(^\s+)|(\s+$)/gm, "");
                actual = actual.trim();
                actual = actual.replace(/\t/g, "    ");
                actual = actual.replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n");
                actual = actual.replace(/(^\s+)|(\s+$)/gm, "");
                Assert.assertEquals(content, actual);    
            };    
    
            /**
             *  Asserts that two values are the same.
             *  Difference between equals and same: === / == or !== / !=
             *  If the assertion is incorrect, an error with a message is thrown.
             *  The method has the following various signatures:
             *      function(message, nexpected, actual) 
             *      function(expected, actual) 
             *  @param message
             *  @param expected
             *  @param actual
             */      
            Assert.assertSame = function(variants) {
                
                var assert = Assert.create([], arguments, 2);
                if (assert.values[0] == assert.values[1])
                    return;
                throw assert.error("Assert.assertSame", "{0}", "{1}");
            };
            
            /**
             *  Asserts two values are not the same.
             *  Difference between equals and same: === / == or !== / !=
             *  If the assertion is incorrect, an error with a message is thrown.
             *  The method has the following various signatures:
             *      function(message, unexpected, actual) 
             *      function(unexpected, actual) 
             *  @param message
             *  @param unexpected
             *  @param actual
             */      
            Assert.assertNotSame = function(variants) {
                
                var assert = Assert.create(arguments, 2);
                if (assert.values[0] != assert.values[1])
                    return;
                throw assert.error("Assert.assertNotSame", "not {0}", "{1}");
            };
    
            /**
             *  Asserts that an value is null.
             *  If the assertion is incorrect, an error with a message is thrown.
             *  The method has the following various signatures:
             *      function(message, value) 
             *      function(value) 
             *  @param message
             *  @param value
             */    
            Assert.assertNull = function(variants) {
                
                var assert = Assert.create(arguments, 1);
                if (assert.values[0] === null)
                    return;
                throw assert.error("Assert.assertNull", "null", "{0}");
            };
    
            /**
             *  Asserts that an value is not null.
             *  If the assertion is incorrect, an error with a message is thrown.
             *  The method has the following various signatures:
             *      function(message, value) 
             *      function(value) 
             *  @param message
             *  @param value
             */
            Assert.assertNotNull = function(variants) {
                
                var assert = Assert.create(arguments, 1);
                if (assert.values[0] !== null)
                    return;
                throw assert.error("Assert.assertNotNull", "not null", "{0}");
            };
    
            /**
             *  Fails a test with an optional message.
             *  This assertion will be thrown a error with an optional message.
             *  The method has the following various signatures:
             *      function(message) 
             *      function() 
             *  @param message
             */
            Assert.fail = function(message) {
    
                if (message)
                    message = String(message).trim();
                message = "Assert.fail" + (message ? ", " + message : "");
                throw new Error(message);
            }
        };
    
        /**
         *  Redirection of the console when using tests in IFrames, based on
         *  calling message events in the parent document.
         *  The message events are on methods for levels: INFO, ERROR, WARN, LOG.
         *  
         *      Example:
         *      
         *  var onLog = function(message) {
         *      ...
         *  }
         */
        if (typeof parent !== "undefined") {
            
            /** Cache for analyzing console output */
            console.output = {log:"", warn:"", error:"", info:""};
            
            /** Clears the cache from the console output. */
            console.output.clear = function() {
                console.output.log = "";
                console.output.warn = "";
                console.output.error = "";
                console.output.info = "";
            };
            
            /** 
             *  General method for redirecting console levels.
             *  @param level
             *  @param variants
             */
            console.forward = function(level, variants) {
                
                console.output[level] += Array.from(variants).join(", ");
                
                var invoke;
                if (parent)
                    invoke = parent["on" + level.capitalize()];
                if (invoke == null)
                    invoke = console.forward[level];
                invoke.apply(null, variants);
            };
            
            /** Redirect for the level: LOG */
            console.forward.log = console.log;
            console.log = function(message) {
                console.forward("log", arguments);
            };
            
            /** Redirect for the level: WARN */
            console.forward.warn = console.warn;
            console.warn = function(message) {
                console.forward("warn", arguments);
            };
            
            /** Redirect for the level: ERROR */
            console.forward.error = console.error;
            console.error = function(message) {
                console.forward("error", arguments);
            };
            
            /** Redirect for the level: INFO */
            console.forward.info = console.info;
            console.info = function(message) {
                console.forward("info", arguments);
            };
            
            /** Registration of events for redirection */
            if (typeof parent.onFinish === "function")
                Test.listen(Test.EVENT_FINISH, parent.onFinish);
            if (typeof parent.onInterrupt === "function")
                Test.listen(Test.EVENT_INTERRUPT, parent.onInterrupt);
            if (typeof parent.onPerform === "function")
                Test.listen(Test.EVENT_PERFORM, parent.onPerform);
            if (typeof parent.onResponse === "function")
                Test.listen(Test.EVENT_RESPONSE, parent.onResponse);
            if (typeof parent.onResume === "function")
                Test.listen(Test.EVENT_RESUME, parent.onResume);
            if (typeof parent.onStart === "function")
                Test.listen(Test.EVENT_START, parent.onStart);
            if (typeof parent.onSuspend === "function")    
                Test.listen(Test.EVENT_SUSPEND, parent.onSuspend);
        };
    
        /**
         *  Enhancement of the JavaScript API
         *  Adds a method that simulates keyboard input to the Element objects.
         *  The following events are triggered during simulation:
         *      focus, keydown, keyup, change
         *  @param value simulated input value
         *  @param clear option false suppresses emptying before input
         */ 
        if (Element.prototype.typeValue === undefined) {
            Element.prototype.typeValue = function(value, clear) {
                this.focus();
                if (clear !== false)
                    this.value = "";
                var element = this;
                value = (value || "").split("");
                value.forEach((digit, index, array) => {
                    element.trigger("keydown");
                    element.value = (element.value || "") + digit;
                    element.trigger("keyup");
                });
                this.trigger("change");
            };     
        };
    
        /**
         *  Enhancement of the JavaScript API
         *  Adds a method that creates a plain string for a Node.
         */     
        if (Node.prototype.toPlainString === undefined)
            Node.prototype.toPlainString = function() {
                return (new XMLSerializer()).serializeToString(this);
            };    
    
        /**
         *  Enhancement of the JavaScript API
         *  Adds a method that creates a plain string for a Element.
         */     
        if (Element.prototype.toPlainString === undefined)
            Element.prototype.toPlainString = function() {
                return this.outerHTML;
        };   
        
        /**
         *  Enhancement of the JavaScript API
         *  Adds a method that creates a plain string for a Object.
         */      
        if (Object.prototype.toPlainString === undefined)
            Object.prototype.toPlainString = function() {
                return JSON.stringify(this);
            };     
          
        /**
         *  Enhancement of the JavaScript API
         *  Adds a method to trigger an event for elements.
         *  @param event   type of event
         *  @param bubbles deciding whether the event should bubble up through
         *                 the event chain or not
         *  @param cancel  defining whether the event can be canceled
         */         
        if (Element.prototype.trigger === undefined)
            Element.prototype.trigger = function(event, bubbles, cancel) {
                var trigger = document.createEvent("Event");
                if (arguments.length < 2)
                    bubbles = false;
                if (arguments.length < 3)
                    cancel = true;
                trigger.initEvent(event, bubbles, cancel);
                this.dispatchEvent(trigger);
            }; 
        
    };
};