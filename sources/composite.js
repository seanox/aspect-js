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
 *  
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
 *  Composite 1.2.0 20190811
 *  Copyright (C) 2019 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.2.0 20190811
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
     *  List of attributes to be hardened.
     *  The hardening of attributes is part of the safety concept and should
     *  make it more difficult to manipulate the markup at runtime. Hardening
     *  observes attributes and undoes changes.
     *  Initially, the list is empty because the policies and rules are too
     *  individual.
     *  
     *  The following attributes are recommended:
     *      action        autocomplete      autofocus
     *      form          formaction        formenctype
     *      formmethod    formnovalidate    formtarget
     *      height        list              max
     *      min           multiple          name
     *      pattern       placeholder       required
     *      size          step              target
     *      type          width
     *      
     *  The following attributes are automatically hardened:
     *      composite     id                static*
     *      
     *  Composite internal/relevant attributes are also protected, these are
     *  removed in markup and managed in memory:
     *      composite     condition         events
     *      id            import            interval
     *      iterate       output            release
     *      render        validate
     */
    Composite.ATTRIBUTE_STATICS = [];

    /**
     *  Pattern for all accepted attributes.
     *  Accepted attributes are all attributes, even without an expression that
     *  is cached in the meta object. Other attributes are only cached if they
     *  contain an expression.
     */
    Composite.PATTERN_ATTRIBUTE_ACCEPT = /^composite|condition|events|id|import|interval|iterate|output|release|render|validate$/i;   
    
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
    Composite.PATTERN_COMPOSITE_ID = /^[a-z]\w*$/i;

    /**
     *  Pattern for a element id
     *      group 1: name
     *      group 2: qualifier (optional)
     */
    Composite.PATTERN_ELEMENT_ID = /^([a-z]\w*)(?:\:(\w*))*$/i;
    
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
    
    /** Patterns with the supported events as plain array */
    Composite.PATTERN_EVENT_NAMES = (function() {
        return Composite.events.replace(/(?:\||\b)(\w)/g, (match, letter) => {
            return letter.toUpperCase();
        }).split(/\s+/);
    })();
    
    /** Patterns with the supported events as plain array (lower case) */
    Composite.PATTERN_EVENT_FILTER = (function() {
        return Composite.events.replace(/(?:\||\b)(\w)/g, (match, letter) => {
            return letter.toUpperCase();
        }).toLowerCase().split(/\s+/);
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
                            
                            //If the selector is a string, several elements must
                            //be assumed. These can, but do not have to, have a
                            //relationship in the DOM. Therefore they are all
                            //considered and mounted separately. 
                            
                            var nodes;
                            if (typeof this.selector == "string") {
                                nodes = [];
                                var scope = document.querySelectorAll(this.selector);
                                Array.from(scope).forEach((node) => {
                                    if (nodes.includes(node))
                                        nodes.push(node);
                                    var scope = node.querySelectorAll("*");
                                    Array.from(scope).forEach((node) => {
                                        if (nodes.includes(node))
                                            nodes.push(node);
                                    });
                                });
                            } else {
                                nodes = this.selector.querySelectorAll("*");
                                nodes = [this.selector].concat(Array.from(nodes));
                            }
                            
                            //Mount all elements in a composite, including itself
                            nodes.forEach((node) => {
                                Composite.mount(node);
                            });
                            
                            Composite.fire(Composite.EVENT_RENDER_END, this.selector);
                        } else if (context == Composite.mount) {
                            Composite.fire(Composite.EVENT_MOUNT_END, this.selector);
                        } else throw new Error("Invalid context: " + context);
                        var selector = context.queue.shift();
                        if (selector)
                            context.call(null, selector);  
                }};
            
            if (context == Composite.render)
                Composite.fire(Composite.EVENT_RENDER_START, this.selector);
            else if (context == Composite.mount)
                Composite.fire(Composite.EVENT_MOUNT_START, this.selector);
            else throw new Error("Invalid context: " + context);            
        } else {
            if (context == Composite.render)
                Composite.fire(Composite.EVENT_RENDER_NEXT, this.selector);
            else if (context == Composite.mount)
                Composite.fire(Composite.EVENT_MOUNT_NEXT, this.selector);
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
     *  The method has the following various signatures:
     *      Object.lookup(namespace);
     *      Object.lookup(object, namespace);
     */ 
    if (Object.lookup === undefined)
        Object.lookup = function(variants) {
        
            var scope;
            var namespace;
            
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
            namespace = (namespace || "").trim();
            if (!namespace.match(/^(?:[a-z]\w*)(?:(?:\:\w+)|(?:\.[a-z]\w*))*$/i))
                return null;
            namespace = namespace.split(/[\.\:]/);
            if (!namespace
                    || namespace.length <= 0)
                return null;
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
                Composite.fire(event, arguments); 
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
        listeners.forEach((callback) => {
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
        arguments = arguments.slice(1);
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
     *      Validation
     *      ----
     *  If an element is marked with the attribute 'validate', a two-step
     *  validation is performed.
     *  In the first step, the HTML5 validation is checked if it exists.
     *  If this validation is valid or does not exist, the model-based
     *  validation is executed if it exists. For this purpose, the static method
     *  validate is expected in the model. The current element and the current
     *  value (if available) are passed as arguments. If the return of a
     *  validation is not true, if applicable, the synchronization and the
     *  action are not executed and the default action of the browser is
     *  cancelled.     
     *  
     *      Synchronization
     *      ----
     *  The object binding and synchronization assume that a model corresponding
     *  to the composite exists with the same namespace. During synchronization,
     *  the element must also exist as a property in the model. Accepted are
     *  properties with a primitive data type and objects with a property value.
     *  The synchronization expects a positive validation, otherwise it will not
     *  be executed.
     *  
     *      Invocation
     *      ---
     *  For events, actions can be implemented in the model.
     *  Actions are static methods in the model whose name begins with 'on' and
     *  is followed by the name (camel case) of the event. As an argument, the
     *  occurring event is passed.
     *  The action methods can have a return value, but do not have to.
     *  If their return value is false, the event and thus the default action of
     *  the browser is cancelled.     
     *  The invocation expects a positive validation, otherwise it will not be
     *  executed.
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
                nodes.forEach((node) => {
                    Composite.mount(node, lock.share());
                });
                return; 
            }

            //Exclusive for elements
            //and without multiple object binding
            //and script and style elements are not supported 
            if (!(selector instanceof Element)
                    || Composite.mount.queue.includes(selector)
                    || selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE))
                return;

            //An element/selector should only be mounted once.
            Composite.mount.stack = Composite.mount.stack || [];
            if (Composite.mount.stack.includes(selector))
                return;
            
            var serial = selector.ordinal();
            var object = Composite.render.meta[serial];
            
            //Objects that were not rendered should not be mounted.
            //This can happen if new DOM elements are created during rendering
            //that are rendered later.
            if (!(object instanceof Object))
                return;
            
            //The explicit events are declared by the attribute: events.
            //The model can, but does not have to, implement the corresponding
            //method. Explicit events are mainly used to synchronize view and
            //model and to trigger targets of the attribute: render.
            var events = object.attributes.hasOwnProperty(Composite.ATTRIBUTE_EVENTS)
                    ? object.attributes[Composite.ATTRIBUTE_EVENTS] : "";
            events = events.toLowerCase().split(/\s+/);
            events = events.filter((event, index, array) => Composite.PATTERN_EVENT_FILTER.includes(event)
                    && array.indexOf(event) == index);
            
            //There must be a corresponding model class.
            //Elements are not supported.
            var meta = Composite.mount.lookup(selector);
            if (meta instanceof Object) {
                
                //The implicit assignment is based on the on-event-methods
                //implemented in the model. These are determined and added to
                //the list of events if the events have not yet been explicitly
                //declared.
                
                //Events are possible for composites and interactive composite
                //elements. Composites define the scope with their model.
                //Interactive composite elements are a property object in the
                //model that contains the interaction methods corresponding to
                //the events.
                //Therefore the scope of interactive composite elements shifts
                //from the model to the property object.
                //In all cases, a name-based alignment in the model and thus an
                //ID is required. Anonymous intercation elements do not have
                //this alignment and no scope can be determined.

                var model = meta.scope;
                if (typeof meta.property !== "undefined")
                    if (meta.property 
                            && typeof meta.scope[meta.property] === "object") {
                        model = meta.scope[meta.property];
                        if (meta.name
                                && typeof model[meta.name] === "object")
                            model = model[meta.name];
                    } else model = null;

                for (var event in model)
                    if (typeof model[event] === "function"
                            && event.match(Composite.PATTERN_EVENT_FUNCTIONS)) {
                        event = event.substring(2).toLowerCase();
                        if (!events.includes(event))
                            events.push(event);
                    }
            }

            //The determined events are registered.
            Composite.mount.stack.push(selector);
            events.forEach((event) => {
                selector.addEventListener(event.toLowerCase(), (event) => {

                    var target = event.currentTarget;
                    var serial = target.ordinal();
                    var object = Composite.render.meta[serial];

                    var action = event.type.toLowerCase();
                    if (!Composite.PATTERN_EVENT_FILTER.includes(action))
                        return;
                    action = Composite.PATTERN_EVENT_FILTER.indexOf(action);
                    action = Composite.PATTERN_EVENT_NAMES[action];
                    
                    var result;
                    
                    var valid = true;

                    //There must be a corresponding model class.
                    //Elements are not supported.
                    var meta = Composite.mount.lookup(target);
                    if (meta instanceof Object) {
                        
                        var value;
                        if (Composite.ATTRIBUTE_VALUE in target
                                && target instanceof Element)
                            value = target[Composite.ATTRIBUTE_VALUE];
                        
                        //Step 1: Validation
                        
                        //Explicit validation via HTML5.
                        //If the validation fails here, model validation and
                        //synchronization is not and rendering always performed.
                        //In this case the event and thus the default action of
                        //the browser is cancelled.
                        if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_VALIDATE)
                                && typeof target.checkValidity === "function")
                            valid = target.checkValidity();

                        //Validation is a function at the model level.
                        //If a composite consists of several model levels, the
                        //validation may have to be organized accordingly if
                        //necessary.
                        //Interactive composite elements are a property object. 
                        //Therefore they are primarily a property and the
                        //validation is located in the surrounding model and not
                        //in the property object itself.
                        
                        //Implicit validation via the model.
                        //If a corresponding validate method has been
                        //implemented in the model. The declaration with the
                        //attribute validate is not required here.
                        //The validation through the model only works if the
                        //corresponding composite is active/present in the DOM!
                        if (valid === true
                                && typeof meta.scope[Composite.ATTRIBUTE_VALIDATE] === "function") {
                            var validate = meta.scope[Composite.ATTRIBUTE_VALIDATE];
                            if (typeof value !== "undefined")
                                valid = validate.call(meta.scope, target, value);
                            else valid = validate.call(meta.scope, target);
                        }                        
                        
                        //In case of a failed validation, the event and the
                        //default action of the browser will be canceled.
                        if (valid === true) {
    
                            //Step 2: Synchronisation
                            
                            //The synchronization expects a data field. It can
                            //be a simple data type or an object with the
                            //property value. Other targets are ignored.
                            //The synchronization expects a positive validation,
                            //otherwise it will not be executed.
                            var accept = function(object, property, name) {
                                if (object == null
                                        || property == null)
                                    return false;
                                if (arguments.length > 2)
                                    return accept(object[property], name);
                                var descriptor = Object.getOwnPropertyDescriptor(object, property);
                                if (descriptor
                                        && typeof descriptor.set === "function")
                                    return true;
                                var type = typeof object[property];
                                if (type === "object"
                                        && object[property] == null)
                                    return true;
                                return type === "boolean"
                                    || type === "number"
                                    || type === "string";
                            };

                            //A composite is always a container for sub-elements.
                            //Theoretically, an input element can also be a
                            //composite, but not a model and input element/data
                            //field at the same time. That's why this case is
                            //ignored here. A composite cannot assign a value to
                            //itself. Therefore, a data field is always expected
                            //in a model.
                            if (accept(meta.scope, meta.property, meta.name))
                                meta.scope[meta.property][meta.name] = value;
                            else if (accept(meta.scope, meta.property))
                                meta.scope[meta.property] = value;
                            else if (typeof meta.scope[meta.property] === "object") {
                                if (typeof meta.name !== "undefined"
                                        && typeof meta.scope[meta.property][meta.name] === "object")
                                    if (accept(meta.scope[meta.property][meta.name], "value"))
                                        meta.scope[meta.property][meta.name].value = value;
                                else if (accept(meta.scope[meta.property], "value"))
                                    meta.scope[meta.property].value = value;
                            }
                            
                            //Step 3: Invocation

                            //Events are possible for composites and interactive
                            //composite elements. Composites define the scope
                            //with their model.
                            //Interactive composite elements are a property
                            //object in the model that contains the interaction
                            //methods corresponding to the events.
                            //Therefore the scope of interactive composite
                            //elements shifts from the model to the property
                            //object.
                            //In all cases, a name-based alignment in the model
                            //and thus an ID is required. Anonymous intercation
                            //elements do not have this alignment and no scope
                            //can be determined.
                            
                            var model = meta.scope;
                            if (typeof meta.property !== "undefined")
                                if (meta.property 
                                        && typeof meta.scope[meta.property] === "object") {
                                    model = meta.scope[meta.property];
                                    if (meta.name
                                            && typeof model[meta.name] === "object")
                                        model = model[meta.name];
                                } else model = null;

                            //For the event, a corresponding method is searched
                            //in the model that can be called. If their return
                            //value is false, the event and thus the default
                            //action of the browser is cancelled. 
                            //The invocation expects a positive validation,
                            //otherwise it will not be executed.
                            if (model && typeof model["on" + action] === "function")
                                result = model["on" + action].call(model, event);
                        }
                    }

                    //Step 4: Rendering
                    
                    //Rendering is performed in all cases.
                    //When an event occurs, all elements that correspond to the
                    //query selector rendering are updated
                    var events = object.attributes.hasOwnProperty(Composite.ATTRIBUTE_EVENTS)
                            ? object.attributes[Composite.ATTRIBUTE_EVENTS] : "";
                    events = events.toLowerCase().split(/\s+/);
                    if (events.includes(action.toLowerCase())) {
                        var render = object.attributes.hasOwnProperty(Composite.ATTRIBUTE_RENDER)
                                ? object.attributes[Composite.ATTRIBUTE_RENDER] : "";
                        if ((render || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
                            render = Expression.eval(serial + ":" + Composite.ATTRIBUTE_RENDER, render);
                        Composite.render(render);
                    }
                    
                    if (meta instanceof Object) {
                        if ((typeof result !== "undefined" && !result)
                                || (typeof valid !== "undefined" && valid !== true))
                            event.preventDefault();
                        if (typeof result !== "undefined")
                            return result;
                    }
                });
            });
        } finally {
            lock.release();
        }        
    };
    
    /**
     *  Determines the meta data for an element based on its position in the
     *  DOM, so the surrounding composite and model, the referenced property in
     *  the model with a qualifier if necessary. The meta data is only
     *  determined as text information.
     *  
     *  Composite:
     *      {composite, model}
     *  
     *  Composite Element:
     *      {composite, model, property}
     *      {composite, model, property, name:qualifier}
     *  
     *  A validation at object or JavaScript model level does not take place
     *  here. The fill levels of the meta object can be different, depending on
     *  the collected data and the resulting derivation. Thus, it is possible to
     *  make the theoretical assumptions here by deriving them from the DOM.
     *  Especially the namespace of the model is based on these theoretical
     *  assumptions.
     *  
     *  If no meta information can be determined, e.g. because no IDs were found
     *  or no enclosing composite was used, null is returned.
     *  
     *  @param  element
     *  @return determined meta object for the passed element, otherwise null
     *  @throws An error occurs in the following cases:
     *      - in the case of an invalid composite ID
     *      - in the case of an invalid element ID
     */
    Composite.mount.locate = function(element) {
        
        if (!(element instanceof Element))
            return null;

        var serial = (element.getAttribute(Composite.ATTRIBUTE_ID) || "").trim();

        //Composites have a meta object where only composite and model are filled.
        if (element.hasAttribute(Composite.ATTRIBUTE_COMPOSITE)) {
            if (!serial.match(Composite.PATTERN_COMPOSITE_ID))
                throw new Error("Invalid composite id" + (serial ? ": " + serial : ""));
            return {composite:serial, model:serial};
        }

        var meta = {composite:null, model:null, property:null, name:null};

        serial = serial.match(Composite.PATTERN_ELEMENT_ID);
        if (serial) {
            if (serial[1])
                meta.property = serial[1];
            if (serial[2])
                meta.name = serial[2];
        }

        for (var scope = element.parentNode; scope; scope = scope.parentNode) {
            
            if (!(scope instanceof Element)
                    || !scope.hasAttribute(Composite.ATTRIBUTE_ID))
                continue;
            
            var serial = (scope.getAttribute(Composite.ATTRIBUTE_ID) || "").trim();
            if (!serial.match(Composite.PATTERN_ELEMENT_ID))
                throw new Error("Invalid element id" + (serial ? ": " + serial : ""));
            if (meta.model)
                meta.model = serial + "." + meta.model;
            else meta.model = serial;
            
            //Composites are static singleton containers. The corresponding
            //JavaScript model is a root object. Therefore, the namespace ends
            //with the first composite.
            if (scope.hasAttribute(Composite.ATTRIBUTE_COMPOSITE)) {
                if (!serial.match(Composite.PATTERN_COMPOSITE_ID))
                    throw new Error("Invalid composite id" + (serial ? ": " + serial : ""));
                meta.composite = serial;
                break;
            }            
        }

        //A composite is always required.
        if (!meta.composite)
            return null;
        
        //Fields that are not used are removed.
        //So later typeof can be used like an exists method.
        //However, the property must remain null so that composites and
        //anonymous composite elements can be distinguished in the meta object.
        if (!meta.name)
            delete meta.name;
        
        return meta;
    };
    
    /**
     *  TODO: Determines the meta informations as object for an element.
     *  
     *      {composite, scope, model};
     *      
     *      {composite, scope, model, property, name:qualifier}
     *      
     *  The method always requires a corresponding JavaScript model and an
     *  element with an ID. The ID can be relative or absolute/full qualified.
     *  For relative IDs, the namespace is determined from the higher-level
     *  composite structure in the DOM. Absolute IDs whose id/namespace contain
     *  a dot as a package separator, refer directly to the namespace to be
     *  used. If no corresponding namespace/JavaScript model can be determined,
     *  the method returns null.
     *  
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
        
        if (!(element instanceof Element))
            return null;
        
        var meta = Composite.mount.locate(element);
        if (!meta)
            return null;
        
        var scope = Object.lookup(meta.model);
        if (!scope)
            return null;
        meta.scope = scope;
        
        return meta;
    };
    
    /**
     *  TODO: Add @ATTRIBUTES-STATICS
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
        
        if (typeof scope === "string"
                && typeof callback === "string"
                && scope.match(/^@ATTRIBUTES-STATICS$/i)) {
            var statics = (callback || "").trim().split(/\s+/);
            statics.forEach((entry) => {
                entry = entry.toLowerCase();
                if (!Composite.ATTRIBUTE_STATICS.includes(entry))
                    Composite.ATTRIBUTE_STATICS.push(entry)
            });
            return;
        }
        
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
     *      Release
     *      ----
     *  Inverse indicator that an element was rendered.
     *  The renderer removes this attribute when an element is rendered. This
     *  effect can be used for CSS to display elements only in rendered state.    
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
                nodes.forEach((node) => {
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
                Composite.acceptors.forEach((acceptor) => {
                    acceptor.call(null, selector);
                });

                object = {serial:serial, element:selector, attributes:{}};
                Composite.render.meta[serial] = object;
                if ((selector instanceof Element)
                        && selector.attributes) {
                    //Attribute condition is not included in the list of
                    //Composite.PATTERN_ATTRIBUTE_ACCEPT because it is used very
                    //specifically and must therefore be requested separately.
                    Array.from(selector.attributes).forEach((attribute) => {
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
                        words.forEach((node) => {
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
                if (meta && meta.scope && typeof meta.scope.dock === "function")
                    meta.scope.dock.call(meta.scope);
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
            
            //The attributes ATTRIBUTE_EVENTS, ATTRIBUTE_VALIDATE and
            //ATTRIBUTE_RENDER are processed in Composite.mount(selector) the
            //object binding and are only mentioned here for completeness.
            
            //The attribute ATTRIBUTE_RELEASE has no functional implementation.
            //This is exclusively inverse indicator that an element was
            //rendered. The renderer removes this attribute when an element is
            //rendered. This effect can be used for CSS to display elements only
            //in rendered state.   
            
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
                    Composite.asynchron((selector, lock, url) => {
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
                    }, selector, lock.share(), value);
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
                    Array.from(value).forEach(function(node, index) {
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
                attributes.forEach((attribute) => {
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
                Array.from(selector.childNodes).forEach((node) => {
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
                    } else if (Composite.ATTRIBUTE_STATICS.includes(attribute)) {
                        object.statics = object.statics || {};
                        var value = record.oldValue;
                        if (!object.statics.hasOwnProperty(attribute))
                            object.statics[attribute] = value;
                        else value = object.statics[attribute];
                        if (record.target.getAttribute(attribute) != value)
                            record.target.setAttribute(attribute, record.oldValue);
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
                                if (meta && meta.model && Composite.models.includes(meta.model)) {
                                    Composite.models = Composite.models.filter(model => model != meta.model);
                                    if (meta.scope && typeof meta.scope.undock === "function")
                                        meta.scope.undock.call(meta.scope);
                                }
                            }
                            
                            delete Composite.render.meta[node.ordinal()];
                        };
                        cleanup(node);
                    });
                }                
            });
        })).observe(document.body, {childList:true, subtree:true, attributes:true, attributeOldValue:true, characterData:true});
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
        
        expression.split(/\n/).forEach((entry) => {
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

        cascade.expression.forEach((entry) => {
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
        cascade.script.forEach((entry) => {
            var text = entry.data;
            for (var loop = 0; loop < keywords.length; loop += 2) {
                var pattern = new RegExp("(^|[^\\w\\.])(" + keywords[loop] + ")(?=[^\\w\\.]|$)", "ig");
                text = text.replace(pattern, "$1\n\r" + keywords[loop +1] + "\n");
            }
            text = text.replace(/(^|[^\w\.])(true|false|null|instanceof|typeof|undefined|new)(?=[^\w\.]|$)/ig, (match, script, keyword) => {
                return script + "\n\r" + keyword.toLowerCase() + "\n";
            });
            var words = [];
            text.split(/\n/).forEach((entry) => {
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
        
        cascade.other.forEach((entry) => {
            var text = entry.data;
            text = text.replace(/(^|[^\w\.])(#{0,1}[a-zA-Z](?:[\w\.]*[\w])*(?=(?:[^\w\(\.]|$)))/g, "$1\n\r\r$2\n");
            text = text.replace(/(^|[^\w\.])(#{0,1}[a-zA-Z](?:[\w\.]*[\w])*)(?=\()/g, "$1\n\r$2\n");
            var words = [];
            text.split(/\n/).forEach((entry) => {
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
                word.forEach((entry) => {
                    merge(entry);    
                });
            else if (Array.isArray(word.data))
                word.data.forEach((entry) => {
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
        words.forEach((word) => {
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