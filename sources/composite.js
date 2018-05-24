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
 *  - Composite-Attribute sind elementar und unveränderlich, sie werden bei ersten Auftreten eines Elements gelesen und können später nicht geänert werden, da sie dann aus Element-Cache verwendet werden 
 *  - Element-Attribute sind auch dann elementar und unveränderlich, wenn diese eine Expression enthalten
 *  - Die Welt ist statisch. So auch aspect-js und alle Komponenten.
 *    Das erspart die Verwaltung und Einrichtung von Instanzen.
 *  - Rendering: Clean Code
 *    Nur fuer aspect-js verwendete Attribute werden ueber Element-Wrapper
 *    zwischengespeichert und koennen/sollen im Markup nach Verwendung entfernt
 *    werden. An einem Element befindliche aspect-js-Attribute sind ein
 *    Kennzeichen, dass diese noch nicht verarbeitet wurden.
 *  
 *  Composite 1.0 20180524
 *  Copyright (C) 2018 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20180524
 */
if (typeof(Composite) == 'undefined') {
    
    /** 
     *  TODO:
     *  TODO: - add tag repeat / loop
     *        - add tag interval
     */
    Composite = {};
    
    /** 
     *  Assoziative array for elements that were detected during rendering and a
     *  wrapper was created. (key:Serial, value:wrapper)
     */ 
    Composite.elements;
    
    /** Assoziative array for custom tags (key:tag, value:function) */
    Composite.macros;

    /** Assoziative array for custom selectors (key:hash, value:{selector, function}) */
    Composite.selectors;

    /** Queue with outstanding scans */
    Composite.queue;
    
    /** Assoziative array with different counters */
    Composite.ticks = {render:0, scan:0};
    
    /** Assoziative array with events and their registered listerners */
    Composite.listeners;
    
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
    
    /** Constant for attribute name */
    Composite.ATTRIBUTE_NAME = "name";

    /** Constant for attribute output */
    Composite.ATTRIBUTE_OUTPUT = "output";

    /** Constant for attribute render */
    Composite.ATTRIBUTE_RENDER = "render";     
    
    /** Constant for attribute sequence */
    Composite.ATTRIBUTE_SEQUENCE = "sequence";

    /** Constant for attribute text */
    Composite.ATTRIBUTE_TEXT = "text";    

    /** Constant for attribute type */
    Composite.ATTRIBUTE_TYPE = "type";
    
    /** Constant for attribute value */
    Composite.ATTRIBUTE_VALUE = "value";

    /**
     *  Pattern for all accepted attributes.
     *  Accepted attributes are all attributes, even without an expression that
     *  is cached in the object wrapper. Other attributes are only cached if
     *  they contain an expression.
     */
    Composite.PATTERN_ATTRIBUTE_ACCEPT = /^composite|condition|events|id|name|output|sequence|render|value$/i;   
    
    /** Pattern for all attributes that are not cached during rendering */
    Composite.PATTERN_ATTRIBUTE_IGNORE = /import|condition|output/i;    

    /** 
     *  Pattern to detect if a string contains an expression.
     *  Escaping characters via slash is supported.
     */
    Composite.PATTERN_EXPRESSION_CONTAINS = /\{\{((.*?[^\\](\\\\)*)|((\\\\)*))*?\}\}/g;   
    
    /**
     *  Patterns to test whether an expression is exclusive, i.e. an expression
     *  without additional text fragments before or after.
     */
    Composite.PATTERN_EXPRESSION_EXCLUSIVE = /^\s*\{\{((.*?[^\\](\\\\)*)|((\\\\)*))*\}\}\s*$/;

    //TODO:
    Composite.PATTERN_ELEMENT_SCRIPT = /script/i;
    
    //TODO:
    Composite.PATTERN_ELEMENT_PARAM = /param/i;  

    //TODO:
    Composite.PATTERN_ELEMENT_IGNORE = "/script|style/i";

    //TODO:
    Composite.PATTERN_ELEMENT_SCRIPT_TYPE = /^(text|condition)\/javascript$/i;
    
    //TODO:
    Composite.PATTERN_COMPOSITE_CONTEXT = /^[a-z](?:[\w\.]*[\w])*$/i;
    
    //TODO:
    Composite.PATTERN_CUSTOMIZE_SCOPE = /^[a-z](?:(?:\w*)|([\-\w]*\w))$/i;

    //TODO:
    Composite.PATTERN_PARAM_NAME = /^_*[a-z]\w*$/i;
    
    //TODO:
    Composite.PATTERN_EVENT = /^([A-Z][a-z]+)+$/;
    
    /** Pattern for the namespace separator */
    Composite.PATTERN_NAMESPACE_SEPARATOR = /[\\\/\.]/;
    
    /** Pattern for a valid namespace. */
    Composite.PATTERN_NAMESPACE = /^(?:[\\\/]*[a-z][\w]*)(?:[\\\/\.][a-z][\w]*)*$/i;
    
    /** Pattern to detect if there are conflicts in the namespace. */
    Composite.PATTERN_NAMESPACE_SEPARATOR_CONFLICT = /(\..*[\\\/])|(\\.*[\.\/])|(\/.*[\\\.])/;    

    /** Constants of events during rendering */
    Composite.EVENT_RENDER_START = "RenderStart";
    Composite.EVENT_RENDER_NEXT = "RenderNext";
    Composite.EVENT_RENDER_END = "RenderEnd";

    /** Constants of events during scanning */
    Composite.EVENT_SCAN_START = "ScanStart";
    Composite.EVENT_SCAN_NEXT = "ScanNext";
    Composite.EVENT_SCAN_END = "ScanEnd";

    /** Constants of events during mounting */
    Composite.EVENT_MOUNT_BEFORE = "MountBefore";
    Composite.EVENT_MOUNT_AFTER = "MountAfter";
    
    /** Constants of events when using AJAX */
    Composite.EVENT_AJAX_START = "AjaxStart";
    Composite.EVENT_AJAX_RECEIVE = "AjaxReceive";
    Composite.EVENT_AJAX_SUCCESS = "AjaxSuccess";
    Composite.EVENT_AJAX_ERROR = "AjaxError";

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
    
    //TODO:
    Composite.PATTERN_EVENT_FUNCTIONS = (function() {
        var pattern = Composite.events.replace(/(?:\||\b)(\w)/g, function(match, letter) {
           return letter.toUpperCase();
        });
        pattern = new RegExp("^on(" + pattern.replace(/\s+/g, '|') + ")");
        return pattern;
    })();

    /**
     *  Enhancement of the JavaScript API
     *  Adds a static counter for assigning serial IDs to the Node object.
     */    
    if (Node.indication === undefined)
        Node.indication = 0;
    
    /**
     *  Enhancement of the JavaScript API
     *  Adds a function for getting the serial ID to the Node objects.
     */ 
    if (Node.prototype.ordinal === undefined) {
        Node.prototype.ordinal = function() {
            this.serial = this.serial || Node.indication++;
            return this.serial;
        };     
    };
    
    /**
     *  Enhancement of the JavaScript API
     *  Adds a function for getting and removing an attribute to the Element objects.
     */ 
    if (Element.prototype.fetchAttribute === undefined) {
        Element.prototype.fetchAttribute = function(attribute) {
            if (!this.hasAttribute(attribute))
                return false;
            var value = this.getAttribute(attribute);
            this.removeAttribute(attribute);
            return value; 
        };     
    };

    /**
     *  Enhancement of the JavaScript API
     *  Implements an own send method for event management. The original method
     *  is reused in the background.
     */ 
    XMLHttpRequest.prototype.internalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        Composite.fire(Composite.EVENT_AJAX_START, this); 
        var internalOnReadyStateChange = this.onreadystatechange;
        this.onreadystatechange = function() {
            Composite.fire(Composite.EVENT_AJAX_RECEIVE, this);
            if (this.readyState == 4) {
                if (this.status == "200")
                    Composite.fire(Composite.EVENT_AJAX_SUCCESS, this);
                else Composite.fire(Composite.EVENT_AJAX_ERROR, this);
            }
            if (internalOnReadyStateChange)
                internalOnReadyStateChange.apply(this, arguments);
        };
        this.internalSend(body);
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
        
        if (typeof(event) !== "string")
            throw new TypeError("Invalid event: " + typeof(scope));
        if (typeof(callback) !== "function"
                && callback !== null
                && callback !== undefined)
            throw new TypeError("Invalid callback: " + typeof(callback));        
        if (!event.match(Composite.PATTERN_EVENT))
            throw new Error("Invalid event" + (event.trim() ? ": " + event : ""));
        
        event = event.toLowerCase();
        Composite.listeners = Composite.listeners || new Array();
        if (!Array.isArray(Composite.listeners[event]))
            Composite.listeners[event] = new Array();
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
        variants = Array.prototype.slice.call(arguments);
        variants = variants.slice(1, 5);
        listeners.forEach(function(callback, index, array) {
            window.setTimeout(callback, 0, event, variants[0], variants[1], variants[2], variants[3], variants[4]);
        });        
    };

    /**
     *  Asynchronous call of a function.
     *  In reality, it is a non-blocking function call, because asynchronous
     *  execution is not possible without Web Worker.
     *  @param task     function to be executed
     *  @param sequence true if the execution is to be linear/sequential
     *  @param variants up to five additional optional arguments that are passed
     *                  as arguments when the callback function is called
     */
    Composite.asynchron = function(task, sequence, variants) {
        
        var method = function(invoke, variants) {
            invoke(variants[0], variants[1], variants[2], variants[3], variants[4]);
            if (invoke == Composite.scan
                    || invoke == Composite.mount) {
                Composite.ticks.scan--;
                if (Composite.ticks.render <= 0)
                    Composite.fire(Composite.EVENT_SCAN_END, variants[0], variants[1], variants[2], variants[3], variants[4]);            
            } else {
                Composite.ticks.render--;
                if (Composite.ticks.render <= 0)
                    Composite.fire(Composite.EVENT_RENDER_END, variants[0], variants[1], variants[2], variants[3], variants[4]);            
            }
        };
        
        arguments = Array.prototype.slice.call(arguments);
        arguments = arguments.slice(2, 6);
        
        if (task == Composite.scan
                || task == Composite.mount)
            Composite.ticks.scan++;
        else Composite.ticks.render++;
        if (sequence)
            method(task, arguments);
        else window.setTimeout(method, 0, task, arguments);
    };
    
    /**
     *  TODO:
     *  TODO: fire events render start/progress/end
     *        - jede Komponente ist statisch
     *        - Namespaces werden unterstuetzt, diese aber syntaktisch gueltig sein
     *        - Objekte in Objekten ist durch den Namespaces moeglich (als static inner Class)
     * 
     *  @throws An error occurs in the following cases:
     *    - namespace is not valid or is not supported
     *    - namespace cannot be created if it already exists as a method
     */
    Composite.mount = function(namespace) {
        
        //Step 1:
        //The namespace will be created.
        
        if (typeof(namespace) !== "string")
            throw new TypeError("Invalid namespace: " + typeof(namespace));
        if (!namespace.match(Composite.PATTERN_NAMESPACE)
                || namespace.match(Composite.PATTERN_NAMESPACE_SEPARATOR_CONFLICT))
            throw new Error("Invalid namespace" + (namespace.trim() ? ": " + namespace : ""));
        
        var scope = window;
        namespace = namespace.replace(/^[\\\/]/, '');
        namespace.split(Composite.PATTERN_NAMESPACE_SEPARATOR).forEach(function(entry, index, array) {
            if (typeof(scope[entry]) === "undefined") {
                scope[entry] = new Object();
            } else if (typeof(scope[entry]) === "object") {
            } else if (typeof(scope[entry]) === "function") {
            } else throw new Error("Invalid namespace: " + array.slice(0, index +1).join("."));
            scope = scope[entry];
        });
        
        if (typeof(scope) != "object")
            return;
        
        //Step 2:
        //The events for the object itself are configured.
        //The implemented event functions must correspond to signature: on<Event>.
        //The 'on' must be followed by a capital letter.
        //    For a complete list of allowed events see:
        //Composite.events, Composite.PATTERN_EVENT_FUNCTIONS
        
        var element = document.getElementById(namespace);
        for (var entry in scope)
            if (typeof scope[entry] === "function"
                    && entry.match(Composite.PATTERN_EVENT_FUNCTIONS))
                element.addEventListener(entry.substring(2).toLowerCase(), scope[entry]);

        //TODO: the handling of array, e.g. for day iterate/repaet/loop
        //      <button id="TestButton"> -> <button id="TestButton"> einfache
        //      <button id="TestButton"> -> <button id="TestButton:1"> mehrfach
    };
    
    //TODO:
    //(Re)Index new composite elements in the DOM.
    //TODO: R: use of the collection of detected nodes by MutationObserver
    //TODO: Q: sequence or not? 
    Composite.scan = function(selector) {
        
        if (!selector)
            return;

        try {

            var event = Composite.EVENT_SCAN_START;
            if (Composite.ticks.scan > 0)
                event = Composite.EVENT_SCAN_NEXT;
            Composite.fire(event, selector);

            if (typeof selector === "string") {
                selector = selector.trim();
                if (!selector)
                    return;
                var nodes = document.querySelectorAll(selector);
                nodes.forEach(function(node, index, array) {
                    Composite.asynchron(Composite.scan, false, node);
                });
                return; 
            }

            if (!(selector instanceof Element))
                return;

            var nodes = selector.querySelectorAll("[id]");
            if (selector.hasAttribute(Composite.ATTRIBUTE_COMPOSITE)
                    && selector.hasAttribute(Composite.ATTRIBUTE_ID)) {
                nodes = Array.prototype.slice.call(nodes);
                nodes.push(selector);
            }
            
            nodes.forEach(function(node, index, array) {
                var context = (node.getAttribute(Composite.ATTRIBUTE_ID) || "").trim();
                if (!context.match(Composite.PATTERN_COMPOSITE_CONTEXT))
                    return;
                Composite.asynchron(Composite.mount, false, context);            
            });
            
        } finally {
            if (Composite.ticks.scan <= 0)
                Composite.fire(Composite.EVENT_SCAN_END);
        }
    };
    
    /**
     *  TODO:
     *  @throws An error occurs in the following cases:
     *    - namespace is not valid or is not supported
     *    - rendering function is not implemented correctly
     */
    Composite.customize = function(scope, rendering) {
        
        //Custom tags, here also called macro, are based on a case-insensitive
        //tag name (key) and a render function (value). In this function, the
        //tag name and the render functions are registered and a RegExp will be
        //created so that the custom tags can be found faster.
        
        if (typeof(scope) !== "string")
            throw new TypeError("Invalid scope: " + typeof(scope));
        if (typeof(rendering) !== "function"
                && rendering !== null
                && rendering !== undefined)
            throw new TypeError("Invalid rendering: " + typeof(rendering));
        scope = scope.trim();
        if (scope.length <= 0)
            throw new Error("Invalid scope");
            
        if (scope.match(Composite.PATTERN_CUSTOMIZE_SCOPE)) {
            Composite.macros = Composite.macros || {};
            if (rendering == null)
                delete Composite.macros[scope.toLowerCase()];
            else Composite.macros[scope.toLowerCase()] = rendering;
        } else {
            var hash = scope.toLowerCase().hashCode();
            Composite.selectors = Composite.selectors || {};
            if (rendering == null)
                delete Composite.selectors[hash];
            else Composite.selectors[hash] = {selector:scope, rendering:rendering};
        } 
    };
    
    /**
     *  TODO:
     *  TODO: Rendern vom import-Attribute
     *        Es muss zwei Arten unterstuetzen.
     *             1. Einfach
     *        Der Inhalt wird direkt in das Tag eingefuegt
     *             2. Module/Komponenten-Set
     *        Dabei liefert das Nachladen ein Index-Dateien mit Dateien, deren
     *        Inhalt eingefuegt werden muss. Es koennen verschiedene
     *        Medien-Dateien sein (HTML, JS, CSS, SVG, ...). Der Inhalt muss
     *        dann korrekt nach der Reihenfolge in der Liste eingefuegt werden.
     *  TODO: Rendern von Skripten
     *        Werden beim Rendern skripte ermittelt, muessen diese ausgefuhert
     *        werden, wenn das condition-Attribute true ist oder kein
     *        condition-Attribute vorhanden ist. Die Herausforderung ist das
     *        asynchrone Rendern. Daher mussen die Skripte "ThreadSafe" sein.
     *        Evtl. kann auch der Inhalt aller Skripte gesammelt werden und erst
     *        am Ende (nach Abschluss vom Rendering) ausgeführt werden.
     */
    Composite.render = function(selector, sequence) {
        
        if (!selector)
            return;
        
        try {
            
            var event = Composite.EVENT_RENDER_START;
            if (Composite.ticks.render > 0)
                event = Composite.EVENT_RENDER_NEXT;
            Composite.fire(event, selector);

            if (typeof selector === "string") {
                selector = selector.trim();
                if (!selector)
                    return;
                var nodes = document.querySelectorAll(selector);
                nodes.forEach(function(node, index, array) {
                    Composite.asynchron(Composite.render, sequence, node, sequence);
                });
                return;
            }
            
            if (!(selector instanceof Node))
                return;
            
            Composite.elements = Composite.elements || new Array();
            
            //Register each analyzed node/element and minimizes multiple
            //analysis. For registration, the serial number of the node/element
            //is used. The node prototype has been enhanced with creation and a
            //get-function. During the analysis, the attributes of a element
            //(not node) containing an expression or all allowed attributes are
            //cached in the memory (Composite.elements).
            var serial = selector.ordinal();
            var object = Composite.elements[serial];
            if (!object) {
                object = {serial:serial, element:selector, attributes:{}};
                Composite.elements[serial] = object;
                if ((selector instanceof Element)
                        && selector.attributes)
                    Array.from(selector.attributes).forEach(function(attribute, index, array) {
                        var value = (attribute.value || "").trim();
                        if (value.match(Composite.PATTERN_EXPRESSION_CONTAINS)
                                || attribute.name.match(Composite.PATTERN_ATTRIBUTE_ACCEPT))
                            object.attributes[attribute.nodeName.toLowerCase()] = value;
                    });
            }
            
            //The name of the parameter must correspond to the pattern
            //Composite.PATTERN_PARAM_NAME. Parameters with invalid names are
            //ignored. An invalid name does not cause an error.
            if (selector.nodeName.match(Composite.PATTERN_ELEMENT_PARAM)) {
                var name = (object.attributes[Composite.ATTRIBUTE_NAME] || "").trim();
                if (!name.match(Composite.PATTERN_PARAM_NAME))
                    return;
                var value = (object.attributes[Composite.ATTRIBUTE_VALUE] || "").trim();
                value = Expression.eval(serial + ":" + Composite.ATTRIBUTE_VALUE, value);
                eval(name + " = value;");
                return;
            }               
            
            sequence = sequence || object.attributes[Composite.ATTRIBUTE_SEQUENCE] != undefined;
            
            //Nodes of type TEXT_NODE are changed to text-elements.
            //The content is stored in the value-attribute of the wrapper-object.
            //If the element is rendered later, the value-attribute is interpreted
            //and the result is output via textContent.
            //Script and style elements are ignored.
            if (selector.nodeType == Node.TEXT_NODE) {
                
                //Ignore script and style tags, no expression is replaced here.
                if (selector.parentNode
                        && selector.parentNode.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE))
                    return;

                //Text nodes are only analyzed once.
                //Pure text is completely ignored, only text nodes with a
                //expression as value are updated.
                if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_TEXT))
                    return;
                
                if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_VALUE)) {
                    var expression = object.attributes[Composite.ATTRIBUTE_VALUE];
                    if (expression) {
                        expression = Expression.eval(serial + ":" + Composite.ATTRIBUTE_VALUE, expression);
                        object.element.nodeValue = expression;
                    }
                    return;
                }
                
                //Ignore text nodes without expression.
                if (!selector.textContent.match(Composite.PATTERN_EXPRESSION_CONTAINS))
                    return;
                
                //Replacement of the text nodes with a text element.
                //The expression will be stored in the value-attribute of the
                //wrapper-object and not directly not on the element itself.
                //Found expressions are replaced temporarilty by {{serial}} and
                //a new text-element with a wrapper-object is created for the
                //expressions, which is later inserted into the DOM.
                //Empty expressions are ignored, are replaced by void/nothing.
                var content = selector.textContent;
                content = content.replace(Composite.PATTERN_EXPRESSION_CONTAINS, function(match, offset, content) {
                    match = match.substring(2, match.length -2).trim();
                    if (!match)
                        return "";
                    var node = document.createTextNode("");
                    var serial = node.ordinal();
                    var object = {serial:serial, element:node, attributes:{}};
                    object.attributes[Composite.ATTRIBUTE_VALUE] = "{{" + match + "}}";
                    Composite.elements[serial] = object; 
                    return "{{" + serial + "}}";
                });
                
                //The content of the found text nodes is separated into two
                //different types of text-nodes. The text-nodes are
                //distinguished by the attributes Composite.ATTRIBUTE_TEXT and
                //Composite.ATTRIBUTE_VALUE. Pure text-nodes have only the
                //attribute Composite.ATTRIBUTE_TEXT and only text-nodes with an
                //expression use the attribute Composite.ATTRIBUTE_VALUE.
                //To separate the content of a text node, the first step
                //simplifies the expression as temporary placeholder, the second
                //step separates text and expressions to create new text-nodes,
                //which are then inserted at the position of the original
                //text-node.
                var empty = document.createTextNode("");
                selector.parentNode.replaceChild(empty, selector);
                var words = content.split(/(\{\{\d+\}\})/);
                words.forEach(function(word, index, array) {
                    if (word.match(/^\{\{\d+\}\}$/)) {
                        var serial = parseInt(word.substring(2, word.length -2).trim());
                        var object = Composite.elements[serial];
                        word = object.attributes[Composite.ATTRIBUTE_VALUE];
                        word = Expression.eval(serial + ":" + Composite.ATTRIBUTE_VALUE, word);
                    } else {
                        var node = document.createTextNode(word);
                        var serial = node.ordinal();
                        var object = {serial:serial, element:node, attributes:{}};
                        object.attributes[Composite.ATTRIBUTE_TEXT] = word;
                        Composite.elements[serial] = object; 
                    }
                    object.element.nodeValue = word;
                    array[index] = object.element;
                });
                //The new elements are inserted.
                words.forEach(function(node, index, array) {
                    empty.parentNode.insertBefore(node, empty);
                });
                //The temporary placeholder will be removed.
                empty.parentNode.removeChild(empty); 
    
                return;
            }  
            
            if (!(selector instanceof Element))
                return;
            
            var events = selector.fetchAttribute(Composite.ATTRIBUTE_EVENTS);
            var render = selector.fetchAttribute(Composite.ATTRIBUTE_RENDER);
            if (events && render) {
                events = events.split(/\s+/);
                events.forEach(function(event, index, array) {
                    selector.addEventListener(event, function(event) {
                        var serial = event.target.ordinal();
                        var object = Composite.elements[serial];
                        var render = object.attributes[Composite.ATTRIBUTE_RENDER];
                        Composite.asynchron(Composite.render, false, render);
                    });                    
                });
            }
            
            //The condition attribute is interpreted.
            //As result of the expression true/false is expected and will be set as
            //an absolute value for the condition attribute - so only true or false.
            //Elements are hidden with the condition attribute via CSS and only
            //explicitly displayed with [condition=true].
            //JavaScript elements are executed or not.
            var condition = object.attributes[Composite.ATTRIBUTE_CONDITION];
            if (condition) {
                condition = Expression.eval(serial + ":" + Composite.ATTRIBUTE_CONDITION, condition);
                selector.setAttribute(Composite.ATTRIBUTE_CONDITION, condition === true);
                //Recursive processing is stopped at the first element where the
                //condition-attribute is false. Further sub-elements are not followed.
                if (condition !== true)
                    return;
                if (selector.nodeName.match(Composite.PATTERN_ELEMENT_SCRIPT)) {
                    var type = (selector.getAttribute(Composite.ATTRIBUTE_TYPE) || "").trim();
                    if (type.match(Composite.PATTERN_ELEMENT_SCRIPT_TYPE)) {
                        try {eval(selector.textContent);
                        } catch (exception) {
                            console.error(exception);
                        }
                    }
                }
            }
            
            //TODO: sequence
            //TODO: url as expression is possible
            //For elements with the import-attribute, the content is loaded and
            //the inner HTML element will be replaced by the content. If the
            //content can be loaded successfully, the import-attribute is removed.
            if (selector.hasAttribute(Composite.ATTRIBUTE_IMPORT)) {
                var module = (selector.getAttribute(Composite.ATTRIBUTE_IMPORT) || "").trim();
                (function(element, url) {
                    try {
                        var request = new XMLHttpRequest();
                        request.overrideMimeType("text/plain");
                        request.open("GET", url, true);
                        request.onreadystatechange = function() {
                            if (request.readyState == 4) {
                                if (request.status == "200") {
                                    element.innerHTML = request.responseText;
                                    element.removeAttribute(Composite.ATTRIBUTE_IMPORT);
                                    Composite.render(element);
                                    return;
                                }
                                function HttpRequestError(message) {
                                    this.name = 'HttpRequestError';
                                    this.message = message;
                                    this.stack = (new Error()).stack;
                                }
                                HttpRequestError.prototype = new Error;
                                throw new HttpRequestError("HTTP status " + request.status + " for " + url);
                            }
                        };
                        request.send(null);  
                    } catch (error) {
                        Composite.fire(Composite.EVENT_AJAX_ERROR, error);
                        throw error;
                    }
                })(selector, module);
                return;
            } 

            //This attribute is used to set the value or result of an expression
            //as the content of the selected element. For an expression, the
            //result can also be an element or a node list with elements. All
            //other data types are set as text. This setting is exclusive, thus
            //overwriting any existing content.
            if (selector.hasAttribute(Composite.ATTRIBUTE_OUTPUT)) {
                selector.removeAttribute(Composite.ATTRIBUTE_OUTPUT);
                var value = object.attributes[Composite.ATTRIBUTE_OUTPUT];
                if ((value || "").match(Composite.PATTERN_EXPRESSION_CONTAINS)) {
                    var context = serial + ":" + Composite.ATTRIBUTE_OUTPUT;
                    value = Expression.eval(context, value);
                    if (value instanceof Element
                            || value instanceof NodeList)
                        selector.appendChild(value, true);
                    else selector.innerHTML = String(value);
                } else selector.innerHTML = value;
            }
            
            //If a custom tag exists, the macro is executed.
            Composite.macros = Composite.macros || {};
            var macro = Composite.macros[selector.nodeName.toLowerCase()];
            if (macro) {
                Composite.asynchron(macro, sequence, selector);
                return;
            }
            
            //TODO: Composite.selectors
            Composite.selectors = Composite.selectors || {};
            for (var macro in Composite.selectors) {
                (function(element, macro) {
                    var nodes = element.querySelectorAll(macro.selector);
                    nodes.forEach(function(node, index, array) {
                        Composite.asynchron(macro.rendering, sequence, node);
                    });
                })(selector, Composite.selectors[macro]);
            }

            //The expression in the attributes is interpreted.
            //The expression is stored in a wrapper object and loaded from there,
            //the attributes of the element can be overwritten in a render cycle and
            //are available (conserved) for further cycles. A special case is the
            //text element. The result is output here as textContent.
            //Script and style elements are ignored.
            if (!selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE)) {
                for (var attribute in object.attributes) {
                    //Ignore internal attributes (import, condition, ...).
                    if (attribute.match(Composite.PATTERN_ATTRIBUTE_IGNORE))
                        continue;
                    var value = object.attributes[attribute];
                    if (!(value || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
                        continue;
                    var context = serial + ":" + attribute;
                    value = Expression.eval(context, value);
                    value = String(value).encodeHtml();
                    value = value.replace(/"/g, "&quot;");
                    selector.setAttribute(attribute, value);
                }
            }
            
            //Follow other element children recursively.
            //Scripts, style elements and custom tags are ignored.
            //The content of custom tags is considered like a template.
            if (selector.childNodes
                    && !selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE)) {
                Array.from(selector.childNodes).forEach(function(node, index, array) {
                    Composite.asynchron(Composite.render, sequence, node, sequence);
                });
            }

        } finally {
            if (Composite.ticks.render <= 0)
                Composite.fire(Composite.EVENT_RENDER_END, selector);
        }
    };
    
    //An additional style is inserted before the current script element.
    //It is required for displaying and hiding elements with a condition attribute.
    (function() {
        var css = document.createElement("style");
        css.setAttribute("type", "text/css");
        css.textContent = "*[condition]:not([condition='true']) {display:none!important;}";
        var script = document.querySelector("script");
        script.parentNode.insertBefore(css, script); 
    })();

    //Register a listener when an error occurs and trigger a matching composite-event.
    window.addEventListener("error", function(event) {
        Composite.fire(Composite.EVENT_ERROR, event);
    });

    //With the start the complete body element is rendered.
    //Register the composite (re)scan with the end of the rendering.
    window.addEventListener("load", function(event) {
        Composite.queue = Composite.queue || new Array();
        Composite.listen(Composite.EVENT_RENDER_START, function(event, node) {
            Composite.queue.push(node);
        });
        Composite.listen(Composite.EVENT_RENDER_END, function(event, node) {
            var queue = new Array();
            while (Composite.queue.length > 0)
                queue.push(Composite.queue.shift());
            queue.forEach(function(entry, index, array) {
                Composite.asynchron(Composite.scan, false, entry);
            });
        });
        Composite.render("body");
    });
};

if (typeof(Expression) === "undefined") {    
    
    /**
     *  Expression / Expression Language (EL) is mechanism that simplifies the
     *  accessibility of the data stored in JavaScrript bean component and other
     *  object on the client side. There are many operators that are used in EL
     *  like arithmetic and logical operators to perform an expression.
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
    
    /** Cache (expression / script) */
    Expression.cache;
    
    /**
     *  TODO: docu: add element-reference
     *  
     *  Resolves a value-expression recursively if necessary.
     *  Value expressions refer to a field in a static bean.
     *  The value is retrieved using a corresponding get-function or, if this is
     *  not available, the value is retrieved directly from the field.
     *  For the get-function, the first character is changed from field name to
     *  uppercase and prefixed with get.
     *      e.g. {{ExampleBean.value}} -> ExampleBean.getValue()
     *  @param  context    context or expression without context
     *  @param  expression expression in combination with a context
     *  @retrun the value of the value-expression, otherwise false
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
        
        expression.split(/\n/).forEach(function(entry, index, array) {
            var object = {type:Expression.TYPE_TEXT, data:entry};
            if (entry.match(/^\{\{.*\}\}$/)) {
                object.data = object.data.substring(2, object.data.length -2);
                object.type = Expression.TYPE_EXPRESSION;
            } else object.data = "\"" + object.data.replace(/\\/, '\\\\').replace(/"/, '\\"') + "\"";
            collate(object);
            cascade.words.push(object);
        });
        
        //Step 2:
        //Separation of expressions in literal and script as partial words.
        //The expression objects are retained but their value changes from text
        //to array with literal and script as partial words.

        cascade.expression.forEach(function(entry, index, array) {
            var text = entry.data;
            text = text.replace(/(^|[^\\])((?:\\{2})*\\[\'])/g, '$1\n$2\n');
            text = text.replace(/(^|[^\\])((?:\\{2})*\\[\"])/g, '$1\r$2\r');
            var words = new Array();
            var pattern = /(^.*?)(([\'\"]).*?(\3|$))/m;
            while (text.match(pattern)) {
                text = text.replace(pattern, function(match, script, literal) {
                    script = script.replace(/\n/g, '\'');
                    script = script.replace(/\r/g, '\"');
                    script = {type:Expression.TYPE_SCRIPT, data:script};
                    collate(script);
                    words.push(script);
                    literal = literal.replace(/\n/g, '\'');
                    literal = literal.replace(/\r/g, '\"');
                    literal = {type:Expression.TYPE_LITERAL, data:literal};
                    collate(literal);
                    words.push(literal);
                    return "";
                });
            }
            if (text.length > 0) {
                text = text.replace(/\n/g, '\'');
                text = text.replace(/\r/g, '\"');
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
        //    true, false, null, instanceof, typeof, undefined
        //Separation of script in keyword and other as partial words.
        //IMPORTANT: KEYWORDS ARE CASE-INSENSITIVE
        
        var keywords = new Array("and", "&&", "or", "||", "not", "!", "eq", "==",
                "ne", "!=", "lt", "<", "gt", ">", "le", "<=", "ge", ">=", "empty", "!",
                "div", "/", "mod", "%");
        cascade.script.forEach(function(entry, index, array) {
            var text = entry.data;
            for (var loop = 0; loop < keywords.length; loop += 2) {
                var pattern = new RegExp("(^|[^\\w\\.])(" + keywords[loop] + ")(?=[^\\w\\.]|$)", "ig");
                text = text.replace(pattern, "$1\n\r" + keywords[loop +1] + "\n");
            }
            text = text.replace(/(^|[^\w\.])(true|false|null|instanceof|typeof|undefined)(?=[^\w\.]|$)/ig, function(match, script, keyword) {
                return script + "\n\r" + keyword.toLowerCase() + "\n";
            });
            var words = new Array();
            text.split(/\n/).forEach(function(entry, index, array) {
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
        
        cascade.other.forEach(function(entry, index, array) {
            var text =  entry.data;
            text = text.replace(/(^|[^\w\.])(#{0,1}[a-zA-Z](?:[\w\.]*[\w])*(?=(?:[^\w\(\.]|$)))/g, '$1\n\r\r$2\n');
            text = text.replace(/(^|[^\w\.])(#{0,1}[a-zA-Z](?:[\w\.]*[\w])*)(?=\()/g, '$1\n\r$2\n');
            var words = new Array();
            text.split(/\n/).forEach(function(entry, index, array) {
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
        
        var words = new Array();
        var mux = function(word) {
            if (Array.isArray(word))
                word.forEach(function(entry, index, array) {
                    mux(entry);    
                });
            else if (Array.isArray(word.data))
                word.data.forEach(function(entry, index, array) {
                    mux(entry);    
                });            
            else if (typeof word.data === "string")
                if (word.data
                        && word.data.length)
                    words.push(word);
            else
                mux(word.data);
        };    
        mux(cascade.words);
        
        //Step 6:
        //Create a script from the word sequence.
        //The possible word types: text, literal, keyword, value, method, logic
        //Text and expression are always separated by brackets.
        //    e.g. text + (expression) + text + ...
        //The line break characters are misused for marking the transitions from
        //text to expression.
        
        var script = "";
        words.forEach(function(word, index, array) {
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
        script = script.replace(/(^\n)|(\r$)/g, '');
        if (script.match(/\r[^\n]*$/))
            script += ")";
        if (script.match(/^[^\r]*\n/))
            script = "(" + script; 
        script = script.replace(/(\n\r)+/g, ' + ');
        script = script.replace(/\r/g, ' + (');
        script = script.replace(/\n/g, ') + ');
        script = script.replace(/(^\s*\+\s*)|(\s*\+\s*$)/, '');
        
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
        
        Expression.cache = Expression.cache || new Array();
        
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