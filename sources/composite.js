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
 *
 * With aspect-js the declarative approach of HTML is taken up and extended.
 * In addition to the expression language, the HTML elements are provided with
 * additional attributes for functions and view model binding. The corresponding
 * renderer is included in the composite implementation and actively monitors
 * the DOM via the MutationObserver and thus reacts recursively to changes in
 * the DOM.
 *
 * This is the static component for rendering and the view model binding.
 * Processing runs in the background and starts automatically when the page is
 * loaded.
 *
 *
 *     TERMS
 *     ----
 *
 *         namespace
 *         ----
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
 *
 *         model
 *         ----
 * Models are representable/projectable static JavaScript objects that can
 * provide and receive data, states and interactions for views, comparable to
 * managed beans and DTOs (Data Transfer Objects). As singleton/facade/delegate,
 * they can use other components and abstractions, contain business logic
 * themselves, and be a link between the user interface (view) and middleware
 * (backend).
 *
 * The required view model binding is part of the Model View Controller and the
 * Composite API.
 *
 *         property
 *         ----
 * Is a property in a static model (model component / component). It
 * corresponds to an HTML element with the same ID in the same namespace. The
 * ID of the property can be relative or use an absolute namespace. If the ID
 * is relative, the namespace is defined by the parent composite element.
 *
 *         qualifier
 *         ----
 * In some cases, the identifier (ID) may not be unique. For example, in cases
 * where properties are arrays or an iteration is used. In these cases the
 * identifier can be extended by an additional unique qualifier separated by a
 * colon. Qualifiers behave like properties during view model binding and extend
 * the namespace.
 *
 *        unique
 *        ----
 * In some cases it is necessary that different things in the view refer to a
 * target in the corresponding model. However, if these things must still be
 * unique in the view, a unique identifier can be used in addition to the
 * qualifier, separated by a hash. This identifier then has no influence on the
 * composite logic and is used exclusively for the view.
 *
 *         composite
 *         ----
 * Composite describes a construct of markup (view), JavaScript object (model),
 * CSS and possibly other resources. It describes a component/module without
 * direct relation to the representation.
 *
 *         composite-id
 *         ----
 * It is a character sequence consisting of letters, numbers and underscores
 * and optionally supports the minus sign if it is not used at the beginning or
 * end. A composite ID is at least one character long and is composed by
 * combining the attributes ID and COMPOSITE.
 *
 *
 *     PRINCIPLES
 *     ----
 *
 * The world is static. So also aspect-js and all components. This avoids the
 * management and establishment of instances.
 *
 * Attributes ID and COMPOSITE are elementary and immutable.
 * They are read the first time an element occurs and stored in the object
 * cache. Therefore, these attributes cannot be changed later because they are
 * then used from the object cache.
 *
 * Attributes of elements are elementary and immutable even if they contain an
 * expression.
 *
 * Clean Code Rendering - The aspect-js relevant attributes are stored in
 * meta-objects to each element and are removed in the markup. The following
 * attributes are essential: COMPOSITE, ID -- they are cached and remain at the
 * markup, these cannot be changed. the MutationObserver will restore them.
 *
 * Markup/DOM, object tree and virtual paths are analog/homogeneous.
 * Thus virtual paths, object structure in JavaScript (namespace) and the
 * nesting of the DOM must match.
 *
 * @author  Seanox Software Solutions
 * @version 1.7.0 20230510
 */
(() => {

    compliant("Composite");
    compliant(null, window.Composite = {

        // Against the trend, the constants of the composite are public so that
        // they can be used by extensions.
            
        /** Path of the Composite for: modules (sub-directory of work path) */
        get MODULES() {return window.location.combine(window.location.pathcontext, "/modules");},

        /** Constant for attribute composite */
        get ATTRIBUTE_COMPOSITE() {return "composite";},
        
        /** Constant for attribute condition */
        get ATTRIBUTE_CONDITION() {return "condition";},

        /** Constant for attribute events */
        get ATTRIBUTE_EVENTS() {return "events";},

        /** Constant for attribute id */
        get ATTRIBUTE_ID() {return "id";},
        
        /** Constant for attribute import */
        get ATTRIBUTE_IMPORT() {return "import";},

        /** Constant for attribute interval */
        get ATTRIBUTE_INTERVAL() {return "interval";},

        /** Constant for attribute iterate */
        get ATTRIBUTE_ITERATE() {return "iterate";},

        /** Constant for attribute message */
        get ATTRIBUTE_MESSAGE() {return "message";},

        /** Constant for attribute name */
        get ATTRIBUTE_NAME() {return "name";},

        /** Constant for attribute output */
        get ATTRIBUTE_OUTPUT() {return "output";},
        
        /** Constant for attribute render */
        get ATTRIBUTE_RENDER() {return "render";},  
        
        /** Constant for attribute release */
        get ATTRIBUTE_RELEASE() {return "release";},

        /** Constant for attribute state */
        get ATTRIBUTE_STRICT() {return "state";},

        /** Constant for attribute text */
        get ATTRIBUTE_TEXT() {return "text";},

        /** Constant for attribute type */
        get ATTRIBUTE_TYPE() {return "type";},
        
        /** Constant for attribute validate */
        get ATTRIBUTE_VALIDATE() {return "validate";},
        
        /** Constant for attribute value */
        get ATTRIBUTE_VALUE() {return "value";},

        /**
         * Pattern for all accepted attributes.
         * Accepted attributes are all attributes, even without an expression
         * that is cached in the meta-object. Other attributes are only cached
         * if they contain an expression.
         */
        get PATTERN_ATTRIBUTE_ACCEPT() {return /^(composite|condition|events|id|import|interval|iterate|message|output|release|render|state|validate)$/i;},
        
        /**
         * Pattern for all static attributes.
         * Static attributes are not removed from the element during rendering,
         * but are also set in the meta-object like non-static attributes. These
         * attributes are also intended for direct use in JavaScript and CSS.
         */
        get PATTERN_ATTRIBUTE_STATIC() {return /^(composite|id)$/i;},

        /** 
         * Pattern to detect if a string contains an expression.
         * Escaping characters via slash is supported.
         */
        get PATTERN_EXPRESSION_CONTAINS() {return /\{\{(.|\r|\n)*?\}\}/g;},

        /**
         * Patterns for condition expressions.
         * Conditions are explicitly a single expression and not a variable
         * expression.
         */
        get PATTERN_EXPRESSION_CONDITION() {return /^\s*\{\{\s*(([^}]|(}(?!})))*?)\s*\}\}\s*$/i;},

        /**
         * Patterns for expressions with variable.
         * Variables are at the beginning of the expression and are separated
         * from the expression by a colon. The variable name must conform to the
         * usual JavaScript conditions and starts with _ or a letter, other word
         * characters (_ 0-9 a-z A-Z) may follow.
         * - group 1: variable
         * - group 2: expression
         */
        get PATTERN_EXPRESSION_VARIABLE() {return /^\s*\{\{\s*((?:(?:_*[a-z])|(?:_\w*))\w*)\s*:\s*(([^}]|(}(?!})))*?)\s*\}\}\s*$/i;},
        
        /** Pattern for all to ignore (script-)elements */
        get PATTERN_ELEMENT_IGNORE() {return /script|style/i;},

        /** Pattern for all script elements */
        get PATTERN_SCRIPT() {return /script/i;},

        /** 
         * Pattern for all composite-script elements.
         * These elements are not automatically executed by the browser but must
         * be triggered by rendering. Therefore, these scripts can be combined
         * and controlled with ATTRIBUTE_CONDITION.
         */
        get PATTERN_COMPOSITE_SCRIPT() {return /^composite\/javascript$/i;},

        /**
         * Pattern for a composite id (based on a word e.g. name@namespace:...)
         * - group 1: name
         * - group 2: namespace (optional)
         */
        get PATTERN_COMPOSITE_ID() {return /^([_a-z]\w*)(?:@([_a-z]\w*(?::[_a-z]\w*)*))?$/i;},

        /**
         * Pattern for an element id (e.g. name:qualifier...@model:...)
         * - group 1: name
         * - group 2: qualifier(s) (optional)
         * - group 3: unique identifier (optional)
         * - group 4: (namespace+)model (optional)
         */
        get PATTERN_ELEMENT_ID() {return /^([_a-z]\w*)(?::(\w+(?::\w+)*))?(?:#(\w+))?(?:@([_a-z]\w*(?::[_a-z]\w*)*))?$/i;},

        /** Pattern for a scope (custom tag, based on a word) */
        get PATTERN_CUSTOMIZE_SCOPE() {return /[_a-z]([\w-]*\w)?$/i;},

        /** Pattern for a datasource url */
        get PATTERN_DATASOURCE_URL() {return /^\s*xml:\s*(\/\S+)\s*(?:\s*(?:xslt|xsl):\s*(\/\S+))*$/i;},

        /** Pattern for all accepted events */
        get PATTERN_EVENT() {return /^([A-Z][a-z]+)+$/;},
        
        /** Constants of events during rendering */
        get EVENT_RENDER_START() {return "RenderStart";},
        get EVENT_RENDER_NEXT() {return "RenderNext";},
        get EVENT_RENDER_END() {return "RenderEnd";},

        /** Constants of events during mounting */
        get EVENT_MOUNT_START() {return "MountStart";},
        get EVENT_MOUNT_NEXT() {return "MountNext";},
        get EVENT_MOUNT_END() {return "MountEnd";},

        /** Constants of events when using modules */
        get EVENT_MODULE_LOAD() {return "ModuleLoad";},
        get EVENT_MODULE_DOCK() {return "ModuleDock";},
        get EVENT_MODULE_READY() {return "ModuleReady";},
        get EVENT_MODULE_UNDOCK() {return "ModuleUndock";},

        /** Constants of events when using HTTP */
        get EVENT_HTTP_START() {return "HttpStart";},
        get EVENT_HTTP_PROGRESS() {return "HttpProgress";},
        get EVENT_HTTP_RECEIVE() {return "HttpReceive";},
        get EVENT_HTTP_LOAD() {return "HttpLoad";},
        get EVENT_HTTP_ABORT() {return "HttpAbort";},
        get EVENT_HTTP_TIMEOUT() {return "HttpTimeout";},
        get EVENT_HTTP_ERROR() {return "HttpError";},
        get EVENT_HTTP_END() {return "HttpEnd";},

        /** Constants of events when errors occur */
        get EVENT_ERROR() {return "Error";},
        
        /** 
         * List of possible DOM events
         * see also https://www.w3schools.com/jsref/dom_obj_event.asp
         */
        get EVENTS() {return "abort after|print animation|end animation|iteration animation|start"
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
                + " waiting wheel";},
        
        /** Patterns with the supported events */
        get PATTERN_EVENT_FUNCTIONS() {return (() => {
            const pattern = Composite.EVENTS.replace(/(?:\||\b)(\w)/g, (match, letter) =>
               letter.toUpperCase());
            return new RegExp("^on(" + pattern.replace(/\s+/g, "|") + ")");
        })();},
        
        /** Patterns with the supported events as plain array */
        get PATTERN_EVENT_NAMES() {return (() => {
            return Composite.EVENTS.replace(/(?:\||\b)(\w)/g, (match, letter) =>
                letter.toUpperCase()).split(/\s+/);
        })();},
        
        /** Patterns with the supported events as plain array (lower case) */
        get PATTERN_EVENT_FILTER() {return (() => {
            return Composite.EVENTS.replace(/(?:\||\b)(\w)/g, (match, letter) =>
                letter.toUpperCase()).toLowerCase().split(/\s+/);
        })();},

        /**
         * Lock mechanism for methods: render, mound and scan. The lock controls
         * that the methods are not used concurrently and/or asynchronously.
         * Each method opens its own transaction (lock). During a transaction,
         * the method call requires a lock. If this lock does not exist or
         * differs from the current transaction, the method call is parked in a
         * queue until the current lock is released. The methods themselves can
         * call themselves recursively and do so with the lock they know. In
         * addition to the lock mechanism, the methods also control the START,
         * NEXT, and END events.
         * @param  context  method (render, mound or scan)
         * @param  selector
         * @return the created lock as meta-object
         */
        lock(context, selector) {
            
            context.queue = context.queue || [];

            if (context.lock === undefined
                    || context.lock === false) {
                context.lock = {ticks:1, selector, queue:[],
                        share() {
                            this.ticks++;
                            return this;
                        },
                        release() {
                            this.ticks--;
                            if (this.ticks > 0)
                                return;
                            if (context === Composite.render) {

                                // To ensure that on conditions when the lock is
                                // created for the marker, the children are also
                                // mounted, the selector must be switched to the
                                // element, because the marker is a text node
                                // without children.

                                let selector = this.selector;
                                if (selector instanceof Node
                                        && selector.nodeType === Node.TEXT_NODE) {
                                    let serial = selector.ordinal();
                                    let object = _render_meta[serial] || {};
                                    if (object.condition
                                            && object.condition.element
                                            && object.condition.marker === this.selector)
                                        selector = object.condition.element;
                                }

                                // If the selector is a string, several elements
                                // must be assumed, which may or may not have a
                                // relation to the DOM. Therefore, they are all
                                // considered and mounted separately.

                                let nodes = [];
                                if (typeof selector === "string") {
                                    const scope = document.querySelectorAll(selector);
                                    Array.from(scope).forEach((node) => {
                                        if (!nodes.includes(node))
                                            nodes.push(node);
                                        const scope = node.querySelectorAll("*");
                                        Array.from(scope).forEach((node) => {
                                            if (!nodes.includes(node))
                                                nodes.push(node);
                                        });
                                    });
                                } else if (selector instanceof Element) {
                                    nodes = selector.querySelectorAll("*");
                                    nodes = [selector].concat(Array.from(nodes));
                                }
                                
                                // Mount all elements in a composite, including
                                // the composite element itself
                                nodes.forEach((node) =>
                                    Composite.mount(node));
                                
                                Composite.fire(Composite.EVENT_RENDER_END, this.selector);
                            } else if (context === Composite.mount) {
                                Composite.fire(Composite.EVENT_MOUNT_END, this.selector);
                            } else throw new Error("Invalid context: " + context);
                            const selector = context.queue.shift();
                            if (selector)
                                Composite.asynchron(context, selector);
                            context.lock = false;
                    }};
                
                if (context === Composite.render)
                    Composite.fire(Composite.EVENT_RENDER_START, selector);
                else if (context === Composite.mount)
                    Composite.fire(Composite.EVENT_MOUNT_START, selector);
                else throw new Error("Invalid context: " + context);            
            } else {
                if (context === Composite.render)
                    Composite.fire(Composite.EVENT_RENDER_NEXT, selector);
                else if (context === Composite.mount)
                    Composite.fire(Composite.EVENT_MOUNT_NEXT, selector);
                else throw new Error("Invalid context: " + context);            
            }
            
            return context.lock;
        },
        
        /**
         * Registers a callback function for composite events.
         * @param  event    see Composite.EVENT_***
         * @param  callback callback function
         * @throws An error occurs in the following cases:
         *     - event is not valid or is not supported
         *     - callback is not implemented correctly or does not exist
         */
        listen(event, callback) {
            
            if (typeof event !== "string")
                throw new TypeError("Invalid event: " + typeof event);
            if (typeof callback !== "function"
                    && callback !== null
                    && callback !== undefined)
                throw new TypeError("Invalid callback: " + typeof callback);        
            if (!event.match(Composite.PATTERN_EVENT))
                throw new Error(`Invalid event${event.trim() ? ": " + event : ""}`);
            
            event = event.toLowerCase();
            if (!_listeners.has(event)
                    || !Array.isArray(_listeners.get(event)))
                _listeners.set(event, []);
            _listeners.get(event).push(callback);
        },
        
        /**
         * Triggers an event.
         * All callback functions for this event are called.
         * @param event    see Composite.EVENT_***
         * @param variants up to five additional optional arguments that are
         *     passed as arguments when the callback function is called
         */
        fire(event, ...variants) {
            event = (event || "").trim();
            if (_listeners.size <= 0
                    || !event)
                return;
            const listeners = _listeners.get(event.toLowerCase());
            if (!Array.isArray(listeners))
                return;
            variants = [event, ...variants];
            listeners.forEach((callback) =>
                callback(...variants));
        },

        /**
         * Asynchronous or in reality non-blocking call of a function. Because
         * the asynchronous execution is not possible without Web Worker.
         * @param task     function to be executed
         * @param variants up to five additional optional arguments that are
         *     passed as arguments when the callback function is called
         */
        asynchron(task, ...variants) {
            window.setTimeout((invoke, ...variants) => {
                invoke(...variants);
            }, 0, task, ...variants);
        },
        
        /**
         * Validates the as selector passed element(s), if the element(s) are
         * marked with ATTRIBUTE_VALIDATE, a two-step validation is performed.
         * In the first step, the HTML5 validation is checked if it exists. If
         * this validation is valid or does not exist, the model based
         * validation is executed if it exists. For this purpose, the static
         * method validate is expected in the model. The current element and the
         * current value (if available) are passed as arguments.
         * 
         * The validation can have four states:
         * 
         *     true, not true, text, undefined/void
         *     
         *         true
         *         ----
         * The validation was successful. No error is displayed and the default
         * action of the browser is used. If possible the value is synchronized
         * with the model.
         * 
         *         not true and not undefined/void
         *         ----
         * The validation failed; an error is displayed. An existing return
         * value indicates that the default action of the browser should not be
         * executed and so it is blocked. In this case, a possible value is not
         * synchronized with the model.
         * 
         *         text
         *         ----
         * Text corresponds to: Invalid + error message. If the error message is
         * empty, the message from ATTRIBUTE_MESSAGE is used alternatively.
         * 
         *         undefined/void
         *         ----
         * The validation failed; an error is displayed. No return value
         * indicates that the default action of the browser should nevertheless
         * be executed. This behavior is important e.g. for the validation of
         * input fields, so that the input reaches the user interface. In this
         * case, a possible value is not synchronized with the model. 
         *
         * @param  selector selector
         * @param  lock     unlocking of the model validation
         * @return validation result
         *     true, false, undefined/void
         */
        validate(selector, lock) {
            
            if (arguments.length < 2
                    || lock !== false)
                lock = true;
            
            if (typeof selector === "string") {
                selector = selector.trim();
                if (!selector)
                    return;
                let validate = Array.from(document.querySelectorAll(selector));
                validate.forEach((node, index) => {
                    validate[index] = Composite.validate(node, lock);
                    if (validate[index] === undefined)
                        validate[index] = 0;
                    else validate[index] = validate[index] === true ? 1 : 2; 
                });
                validate = validate.join("");
                if (validate.match(/^1+$/))
                    return true;
                if (validate.match(/2/))
                    return false;
                return;
            }

            if (!(selector instanceof Element))
                return;
            
            const serial = selector.ordinal();
            const object = _render_meta[serial];
            
            let valid = true;

            // Resets the customer-specific error.
            // This is necessary for the checkValidity method to work.
            if (typeof selector.setCustomValidity === "function")
                selector.setCustomValidity("");
            
            // Explicit validation via HTML5. If the validation fails, model
            // validation and synchronization is not and rendering always
            // performed. In this case the event and thus the default action of
            // the browser is cancelled.
            if (typeof selector.checkValidity === "function")
                valid = selector.checkValidity();

            // There can be a corresponding model.
            const meta = _mount_lookup(selector);
            if (meta instanceof Object) {

                // Validation is a function at the model level. If a composite
                // consists of several model levels, the validation may have to
                // be organized accordingly if necessary. Interactive composite
                // elements are a property object. Therefore, they are primarily
                // a property and the validation is located in the surrounding
                // model and not in the property object itself.
                
                let value;
                if (selector instanceof Element) {
                    if (selector.tagName.match(/^input$/i)
                            && selector.type.match(/^radio|checkbox/i))
                        value = selector.checked;
                    else if (selector.tagName.match(/^select/i)
                            && "selectedIndex" in selector)
                        value = selector.options[selector.selectedIndex].value;
                    else if (Composite.ATTRIBUTE_VALUE in selector)
                        value = selector[Composite.ATTRIBUTE_VALUE];
                }        
                
                // Implicit validation via the model, if a corresponding
                // validate method is implemented. The validation through the
                // model only works if the corresponding composite is
                // active/present in the DOM!
                if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_VALIDATE)
                        && valid === true
                        && lock !== true
                        && typeof meta.model[Composite.ATTRIBUTE_VALIDATE] === "function") {
                    const validate = meta.model[Composite.ATTRIBUTE_VALIDATE];
                    if (value !== undefined)
                        valid = validate.call(meta.model, selector, value);
                    else valid = validate.call(meta.model, selector);
                }            
            }

            // ATTRIBUTE_VALIDATE can be supplemented with ATTRIBUTE_MESSAGE.
            // However, ATTRIBUTE_MESSAGE has no effect without
            // ATTRIBUTE_VALIDATE. The value of ATTRIBUTE_MESSAGE is used as an
            // error message if the validation was not successful. For this
            // purpose, the browser function of HTML5 form validation is used,
            // which shows  the message as a browser validation tooltip/message.
            //
            // The browser validation tooltip/message can be redirected to the
            // title attribute of the validated element if the message begins
            // with the prefix //, which includes the return value per
            // expression. This function can be helpful if a custom error
            // concept needs to be implemented.

            if (valid !== true) {
                let message;
                if (typeof valid === "string"
                        && valid.trim())
                    message = valid.trim();
                if (typeof message !== "string") {
                    if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_MESSAGE))
                        message = String(object.attributes[Composite.ATTRIBUTE_MESSAGE] || "");
                    if ((message || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
                        message = String(Expression.eval(serial + ":" + Composite.ATTRIBUTE_MESSAGE, message));
                }

                const PATTERN_REDIRECT_MESSAGE = /^\s*\/{2,}\s*(.*?)\s*/;
                const redirect = PATTERN_REDIRECT_MESSAGE.test(message);
                message = message.replace(PATTERN_REDIRECT_MESSAGE, "$1");

                if (typeof selector.setCustomValidity === "function"
                        && Object.usable(message)) {
                    selector.setCustomValidity(message);
                    if (!redirect && typeof selector.reportValidity === "function")
                        selector.reportValidity();
                }
            }     
            
            if (valid === undefined)
                return;
            return valid; 
        },

        /**
         * Mounts the as selector passed element(s) with all its children where
         * a view model binding is possible. Mount is possible for all elements
         * with ATTRIBUTE_ID, not only for composite objects and their children.
         *
         * View-model binding is about linking of HTML elements in markup (view)
         * with corresponding JavaScript objects (models).
         *
         * Models are representable/projectable static JavaScript objects that
         * can provide and receive data, states and interactions for views,
         * comparable to managed beans and DTOs. As singleton/facade/delegate,
         * they can use other components and abstractions, contain business
         * logic themselves, and be a link between the user interface (view) and
         * middleware (backend).
         *
         * The required view model binding is part of the Model View Controller
         * and the Composite API.
         *
         * The view as presentation and user interface for interactions and the
         * model are primarily decoupled. For the MVVM approach as an extension
         * of the MVC, the controller establishes the bidirectional connection
         * between view and model, which means that no manual implementation and
         * declaration of events, interaction or synchronization is required.
         *
         *     Principles
         *     ----
         * Components are a static JavaScript objects (models). Namespaces are
         * supported, but they must be syntactically valid. Objects in objects
         * is possible through the namespaces (as static inner class).
         * 
         *     Binding
         *     ----
         * The object constraint only includes what has been implemented in the
         * model (snapshot). An automatic extension of the models at runtime by
         * the renderer is not detected/supported, but can be implemented in the
         * application logic - this is a conscious decision!
         *     Case study:
         * In the markup there is a composite with a property x. There is a
         * corresponding JavaScript object (model) for the composite but without
         * the property x. The renderer will mount the composite with the
         * JavaScript model, the property x will not be found in the model and
         * will be ignored. At runtime, the model is modified later and the
         * property x is added. The renderer will not detect the change in the
         * model and the property x will not be mounted during re-rendering.
         * Only when the composite is completely removed from the DOM (e.g. by a
         * condition) and then newly added to the DOM, the property x is also
         * mounted, because the renderer then uses the current snapshot of the
         * model and the property x also exists in the model.
         * 
         *     Validation
         *     ----
         * Details are described to Composite.validate(selector, lock)   
         * 
         *     Synchronization
         *     ----
         * View model binding and synchronization assume that a corresponding
         * static JavaScript object/model exists in the same namespace for the
         * composite. During synchronization, the element must also exist as a
         * property in the model. Accepted are properties with a primitive data
         * type and objects with a property value. The synchronization expects a
         * positive validation, otherwise it will not be executed.
         * 
         *     Invocation
         *     ---
         * For events, actions can be implemented in the model. Actions are
         * static methods in the model whose name begins with 'on' and is
         * followed by the name (camel case) of the event. As an argument, the
         * occurring event is passed. The action methods can have a return
         * value, but do not have to. If their return value is false, the event
         * and thus the default action of the browser is cancelled. The
         * invocation expects a positive validation, otherwise it will not be
         * executed.
         * 
         *     Events
         *     ----
         * Composite.EVENT_MOUNT_START
         * Composite.EVENT_MOUNT_NEXT
         * Composite.EVENT_MOUNT_END
         * 
         *     Queue and Lock:
         *     ----
         * The method used a simple queue and transaction management so that the
         * concurrent execution of rendering works sequentially in the order of
         * the method call.
         * 
         * @param  selector
         * @param  lock
         * @throws An error occurs in the following cases:
         *     - namespace is not valid or is not supported
         *     - namespace cannot be created if it already exists as a method
         */
        mount(selector, lock) {
            
            Composite.mount.queue = Composite.mount.queue || [];

            // The lock locks concurrent mount requests.
            // Concurrent mounting causes unexpected effects.
            if (Composite.mount.lock
                    && Composite.mount.lock !== lock) {
                if (!Composite.mount.queue.includes(selector))
                    Composite.mount.queue.push(selector);
                return;
            }

            lock = Composite.lock(Composite.mount, selector);
                
            try {
                
                if (typeof selector === "string") {
                    selector = selector.trim();
                    if (!selector)
                        return;
                    const nodes = document.querySelectorAll(selector);
                    nodes.forEach((node) =>
                        Composite.mount(node, lock.share()));
                    return; 
                }

                // Exclusive for elements
                // and without multiple object binding
                // and script and style elements are not supported 
                if (!(selector instanceof Element)
                        || Composite.mount.queue.includes(selector)
                        || selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE))
                    return;

                // An element/selector should only be mounted once.
                Composite.mount.stack = Composite.mount.stack || [];
                if (Composite.mount.stack.includes(selector))
                    return;

                const serial = selector.ordinal();
                const object = _render_meta[serial];
                
                // Objects that were not rendered should not be mounted. This
                // can happen if new DOM elements are created during rendering
                // that are rendered later.
                if (!(object instanceof Object))
                    return;

                const identifier = object.attributes[Composite.ATTRIBUTE_ID];
                
                // The explicit events are declared by ATTRIBUTE_EVENTS. The
                // model can, but does not have to, implement the corresponding
                // method. Explicit events are mainly used to synchronize view
                // and model and to trigger targets of ATTRIBUTE_RENDER.
                let events = object.attributes.hasOwnProperty(Composite.ATTRIBUTE_EVENTS)
                        ? object.attributes[Composite.ATTRIBUTE_EVENTS] : "";
                events = String(events || "");
                events = events.toLowerCase().split(/\s+/);
                events = events.filter((event, index, array) => Composite.PATTERN_EVENT_FILTER.includes(event)
                        && array.indexOf(event) === index);
                
                // There must be a corresponding model.
                const meta = _mount_lookup(selector);
                if (meta instanceof Object
                        && identifier) {
                    
                    // The implicit assignment is based on the on-event-methods
                    // implemented in the model. These are determined and added
                    // to the list of events if the events have not yet been
                    // explicitly declared. But this is only useful for elements
                    // with an ID. Since mounting is performed recursively on
                    // the child nodes, it should be prevented that child nodes
                    // are assigned the events of the parents.

                    // Events are possible for composites and their interactive
                    // elements. For this purpose, composites define the scope
                    // with their model. Interactive composite elements are an
                    // object in the model that contains the interaction methods
                    // corresponding to the events. Therefore, the scope of
                    // interactive composite elements shifts from the model to
                    // the according object. In all cases, a name-based
                    // alignment in the model and thus ATTRIBUTE_ID is required
                    // Anonymous interaction elements do not have this alignment
                    // and no scope can be determined.

                    let model = meta.model;
                    if (meta.target !== undefined)
                        if (typeof meta.target === "object")
                            model = meta.target;
                        else model = null;

                    for (let entry in model)
                        if (typeof model[entry] === "function"
                                && entry.match(Composite.PATTERN_EVENT_FUNCTIONS)) {
                            entry = entry.substring(2).toLowerCase();
                            if (!events.includes(entry))
                                events.push(entry);
                        }

                    let prototype = model ? Object.getPrototypeOf(model) : null;
                    while (prototype) {
                        Object.getOwnPropertyNames(prototype).forEach(entry => {
                            if (typeof model[entry] === "function"
                                    && entry.match(Composite.PATTERN_EVENT_FUNCTIONS)) {
                                entry = entry.substring(2).toLowerCase();
                                if (!events.includes(entry))
                                    events.push(entry);
                            }
                        });
                        prototype = Object.getPrototypeOf(prototype);
                    }
                }

                // The determined events are registered.
                Composite.mount.stack.push(selector);
                events.forEach((event) => {
                    selector.addEventListener(event.toLowerCase(), (event) => {

                        const target = event.currentTarget;
                        const serial = target.ordinal();
                        const object = _render_meta[serial];

                        let action = event.type.toLowerCase();
                        if (!Composite.PATTERN_EVENT_FILTER.includes(action))
                            return;
                        action = Composite.PATTERN_EVENT_FILTER.indexOf(action);
                        action = Composite.PATTERN_EVENT_NAMES[action];
                        
                        let result;
                        
                        // Step 1: Validation

                        let valid = Composite.validate(target, false);

                        // There must be a corresponding model.
                        const meta = _mount_lookup(target);
                        if (meta instanceof Object) {
                            
                            let value;
                            if (target instanceof Element) {
                                if (target.tagName.match(/^input$/i)
                                        && target.type.match(/^radio|checkbox/i))
                                    value = target.checked;
                                else if (target.tagName.match(/^select/i)
                                        && "selectedIndex" in target)
                                    value = target.options[target.selectedIndex].value;
                                else if (Composite.ATTRIBUTE_VALUE in target)
                                    value = target[Composite.ATTRIBUTE_VALUE];
                            }

                            // Validation works strictly by default. This means
                            // that the value must explicitly be true and only
                            // then is the input data synchronized with the
                            // model via the HTML elements. This protects
                            // against invalid data in the models which may then
                            // be reflected in the view. If ATTRIBUTE_VALIDATE
                            // is declared as optional, this behaviour can be
                            // specifically deactivated and the input data is
                            // then always synchronized with the model. The
                            // effects of validation are then only optional.
                            if (String(object.attributes[Composite.ATTRIBUTE_VALIDATE]).toLowerCase() === "optional"
                                    || valid === true) {
        
                                // Step 2: Synchronisation
                                
                                // Synchronization expects a data field. It can
                                // be a simple data type or an object with the
                                // property value. Other targets are ignored.
                                // The synchronization expects a successful
                                // validation, otherwise it will not be executed.
                                const accept = (property) => {
                                    const type = typeof property;
                                    if (property === undefined)
                                        return false;
                                    if (type === "object"
                                            && property === null)
                                        return true;
                                    return type === "boolean"
                                        || type === "number"
                                        || type === "string";
                                };
                                
                                // A composite is planned as a container for
                                // sub-elements. Theoretically, an input element
                                // can also be a composite and thus both model
                                // and input element / data field. In this case,
                                // a composite can assign a value to itself.
                                if (accept(meta.target)) {
                                    meta.target = value;
                                } else if (typeof meta.target === "object") {
                                    if (accept(meta.target[Composite.ATTRIBUTE_VALUE]))
                                        meta.target[Composite.ATTRIBUTE_VALUE] = value;
                                } else if (meta.target === undefined) {
                                    if (accept(meta.model[Composite.ATTRIBUTE_VALUE]))
                                        meta.model[Composite.ATTRIBUTE_VALUE] = value;
                                }
                                
                                // Step 3: Invocation

                                // Events are possible for composites and their
                                // interactive elements. For this purpose,
                                // composites define the scope with their model.
                                // Interactive composite elements are an object
                                // in the model that contains the interaction
                                // methods corresponding to the events.
                                // Therefore, the scope of interactive composite
                                // elements shifts from the model to the
                                // according object. In all cases, a name-based
                                // alignment in the model and thus ATTRIBUTE_ID
                                // is required. Anonymous interaction elements
                                // do not have this alignment and no scope can
                                // be determined.
                                
                                let model = meta.model;
                                if (meta.target !== undefined)
                                    if (meta.target
                                            && typeof meta.target === "object")
                                        model = meta.target;
                                    else model = null;

                                // For the event, a corresponding method is
                                // searched in the model that can be called. If
                                // their return value is false, the event and
                                // thus the default action of the browser is
                                // cancelled. The invocation expects a positive
                                // validation, otherwise it will not be executed.
                                if (model && typeof model["on" + action] === "function")
                                    result = model["on" + action].call(model, event);
                            }
                        }

                        // Step 4: Rendering
                        
                        // Rendering is performed in all cases. When an event
                        // occurs, all elements that correspond to the query
                        // selector rendering are updated. 
                        let events = object.attributes.hasOwnProperty(Composite.ATTRIBUTE_EVENTS)
                                ? object.attributes[Composite.ATTRIBUTE_EVENTS] : "";
                        events = String(events || "");
                        events = events.toLowerCase().split(/\s+/);
                        if (events.includes(action.toLowerCase())) {
                            let render = object.attributes.hasOwnProperty(Composite.ATTRIBUTE_RENDER)
                                    ? object.attributes[Composite.ATTRIBUTE_RENDER] : "";
                            render = String(render || "");
                            if ((render || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
                                render = Expression.eval(serial + ":" + Composite.ATTRIBUTE_RENDER, render);
                            Composite.render(render);
                        }
                        
                        if (meta instanceof Object) {
                            if ((result !== undefined && !result)
                                    || (valid !== undefined && valid !== true))
                                event.preventDefault();
                            if (result !== undefined)
                                return result;
                        }
                    });
                });

                // The current value in the model must be set in the HTML
                // element if the element has a corresponding value property.
                //     model -> view
                // This is only useful for elements with an ID. Because mounting
                // is performed recursively on the child nodes, it should be
                // prevented that child nodes are assigned.
                if (meta && meta.target && identifier) {
                    let value = meta.target;
                    if (meta.target instanceof Object)
                        value = Composite.ATTRIBUTE_VALUE in meta.target ? meta.target.value : undefined;
                    if (value !== undefined) {
                        if (selector.tagName.match(/^input$/i)
                                && selector.type.match(/^radio|checkbox/i))
                            selector.checked = value;
                        else if (Composite.ATTRIBUTE_VALUE in selector)
                            selector[Composite.ATTRIBUTE_VALUE] = value;
                    }
                }
            } finally {
                lock.release();
            }        
        },

        /**
         * There are several ways to customize the renderer.
         * 
         *     Custom Tag (Macro)
         *     ----
         * Macros are completely user-specific. The return value determines
         * whether the standard functions are used or not. Only the return value
         * false (not void, not empty) terminates the rendering for the macro
         * without using the standard functions of the rendering.
         *
         *     Composite.customize(tag:string, function(element) {...});
         * 
         *     Custom Selector
         *     ----
         * Selectors work similar to macros. Unlike macros, selectors use a CSS
         * selector to detect elements. This selector must match the current
         * element from the point of view of the parent. Selectors are more
         * flexible and multifunctional. Therefore, different selectors and thus
         * different functions can match one element. In this case, all
         * implemented callback methods are performed. The return value
         * determines whether the loop is aborted or not. Only the return value
         * false (not void, not empty) terminates the loop over other selectors
         * and the rendering for the selector without using the standard
         * functions of the rendering.
         * 
         *     Composite.customize(selector:string, function(element) {...}); 
         * 
         * Macros and selectors are based on a text key. If this key is used
         * more than once, existing macros and selectors will be overwritten.    
         *     
         *     Custom Acceptor
         *     ---
         * Acceptors are a very special way to customize. Unlike the other ways,
         * here the rendering is not shifted into own implementations. With an
         * acceptor, an element is manipulated before rendering and only if the
         * renderer processes the element initially. This makes it possible to
         * make individual changes to the attributes or the markup before the
         * renderer processes them. This does not affect the implementation of
         * the rendering.
         * 
         *     Composite.customize(function(element) {...});
         *     
         *     Configuration
         *     ---
         * The customize method also supports the configuration of the
         * composite. For this purpose, the parameter and the value are passed.
         * 
         *     Composite.customize(parameter:string, value);
         *     
         * Parameters start with @ and thereby differ from Acceptor/Selector/Tag.
         *     
         *     @ATTRIBUTES-STATICS
         * Static attributes are a component of the hardening of the markup.
         * These attributes are observed by the renderer and manipulation is
         * made more difficult by restoring the original value. As value one or
         * more attributes separated by spaces are expected. The method can be
         * called several times. This has a cumulative effect and the attributes
         * are collected. It is not possible to remove attributes.    
         * 
         *     Composite.customize("@ATTRIBUTES-STATICS", "...");
         *     
         * @param  variants
         * @throws An error occurs in the following cases:
         *     - namespace is not valid or is not supported
         *     - callback function is not implemented correctly
         */
        customize(...variants) {
            
            let scope;
            if (variants.length > 0)
                scope = variants[0];

            // STATIC is used for hardening attributes in markup. Hardening
            // makes the manipulation of attributes more difficult. At runtime,
            // additional attributes can be declared as static. However, this
            // function is not cheap, since the values of the attributes used at
            // that time must be determined for all elements to be restored, for
            // which purpose the complete DOM is analyzed (full DOM scan). The
            // composite-specific static attributes (PATTERN_ATTRIBUTE_ACCEPT)
            // are excluded from this function because they are already actively
            // monitored by the MutationObserver.
            if (typeof scope === "string"
                    && variants.length > 1
                    && typeof variants[1] === "string"
                    && scope.match(/^@ATTRIBUTES-STATICS$/i)) {
                const changes = [];
                const statics = (variants[1] || "").trim().split(/\s+/);
                statics.forEach((entry) => {
                    entry = entry.toLowerCase();
                    if (!_statics.has(entry)
                            && !entry.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)) {
                        _statics.add(entry);
                        changes.push(entry); 
                    }
                });
                const scanning = (element) => {
                    if (!(element instanceof Element))
                        return;
                    const serial = element.ordinal();
                    const object = _render_meta[serial];
                    if (!object)
                        return;
                    changes.forEach((attribute) => {
                        object.statics = object.statics || {};
                        if (object.statics.hasOwnProperty[attribute]
                                && object.statics[attribute] !== undefined)
                            return;
                        if (element.hasAttribute(attribute))
                            object.statics[attribute] = element.getAttribute(attribute);
                        else object.statics[attribute] = null;
                    });
                    Array.from(element.childNodes).forEach((node) =>
                        scanning(node));
                };
                scanning(document.body);
                return;
            }
            
            // If only one argument of type function is passed, the method is
            // registered as an acceptor.
            if (typeof scope === "function"
                    && variants.length === 1) {
                _acceptors.add(scope);
                return;
            }

            // Custom tags, here also called macro, are based on a
            // case-insensitive tag name (key) and a render function (value). In
            // this function, the tag name and the render functions are
            // registered and a RegExp will be created so that the custom tags
            // can be found faster.
            if (typeof scope !== "string")
                throw new TypeError("Invalid scope: " + typeof scope);
            const callback = variants.length > 1 ? variants[1] : null;
            if (typeof callback !== "function"
                    && callback !== null
                    && callback !== undefined)
                throw new TypeError("Invalid callback: " + typeof callback);
            scope = scope.trim();
            if (scope.length <= 0)
                throw new Error("Invalid scope");
                
            if (scope.match(Composite.PATTERN_CUSTOMIZE_SCOPE)) {
                if (callback === null)
                    _macros.delete(scope.toLowerCase());
                else _macros.set(scope.toLowerCase(), callback);
            } else {
                const hash = scope.toLowerCase().hashCode();
                if (callback === null)
                    _selectors.delete(hash);
                else _selectors.set(hash, {selector:scope, callback});
            } 
        },
        
        /**
         * Rendering involves updating and, if necessary, reconstructing an HTML
         * element and all its children. The declarative commands for rendering
         * (attributes) and the expression language are executed.
         *
         *     Queue and Lock:
         *     ----
         * The method used a simple queue and transaction management so that the
         * concurrent execution of rendering works sequentially in the order of
         * the method call.
         * 
         *     Element meta-object
         *     ---- 
         * With the processed HTML elements and text nodes, simplified
         * meta-objects are created. The serial, the reference on the HTML
         * element and the initial attributes (which are required for rendering)
         * are stored there.
         * 
         *     Serial
         *     ----
         * Serial is a special extension of the JavaScript API of the object and
         * creates a unique ID for each object. This ID can be used to compare,
         * map and reference a wide variety of objects. Composite and rendering
         * use serial, since this cannot be changed via the markup.  
         *     
         * The following attributes and elements are supported:
         *
         * - Attributes:
         *     COMPOSITE    INTERVAL    RENDER
         *     CONDITION    ITERATE     STATE
         *     EVENTS       MESSAGE     VALIDATE
         *     ID           OUTPUT
         *     IMPORT       RELEASE
         *
         * - Expression Language
         * - Scripting
         * - Customizing
         *   Tag, Selector, Acceptor
         *
         * Details are described in the documentation:
         * https://github.com/seanox/aspect-js/blob/master/manual/en/markup.md#contents-overview           
         * 
         * @param selector
         * @param lock
         */
        render(selector, lock) {

            Composite.render.queue = Composite.render.queue || [];
            if (!selector
                    && Composite.render.queue.length <= 0)
                return;

            // The lock locks concurrent render requests. Concurrent rendering
            // causes unexpected states due to manipulations at the DOM. HTML
            // elements that are currently being processed can be omitted or
            // replaced from the DOM. Access to parent and child elements may
            // then no longer be possible.
            if (Composite.render.lock
                    && Composite.render.lock !== lock) {
                if (!Composite.render.queue.includes(selector))
                    Composite.render.queue.push(selector);
                Composite.asynchron(Composite.render);
                return;
            }

            if (!selector)
                selector = Composite.render.queue[0];

            // even before rendering, possible expressions in the initial ID
            // should be resolved
            if (selector instanceof Element
                    && !_render_meta[selector.ordinal()]) {
                let id = selector.getAttribute(Composite.ATTRIBUTE_ID) || "";
                if (id.match(Composite.PATTERN_EXPRESSION_CONTAINS)) {
                    id = Expression.eval(selector.ordinal() + ":" + Composite.ATTRIBUTE_ID, id);
                    selector.setAttribute(Composite.ATTRIBUTE_ID, id);
                }
            }

            lock = Composite.lock(Composite.render, selector);

            const origin = selector;
            
            try {

                if (typeof selector === "string") {
                    selector = selector.trim();
                    if (!selector)
                        return;
                    const nodes = document.querySelectorAll(selector);
                    nodes.forEach((node) =>
                        Composite.render(node, lock.share()));
                    return;
                }
                
                if (!(selector instanceof Node))
                    return;

                // If a custom tag exists, the macro is executed. Macros are
                // completely user-specific. The return value determines whether
                // the standard functions are used or not. Only the return value
                // false (not void, not empty) terminates the rendering for the
                // macro without using the standard functions.
                const macro = _macros.get(selector.nodeName.toLowerCase());
                if (macro && macro(selector) === false)
                    return;
                
                // If a custom selector exists, the macro is executed. Selectors
                // work similar to macros. Unlike macros, selectors use a CSS
                // selector to detect elements. This selector must match the
                // current element from the point of view of the parent.
                // Selectors are more flexible and multifunctional. Therefore,
                // different selectors and thus different functions can match
                // one element. In this case, all implemented callback methods
                // are performed. The return value determines whether the loop
                // is aborted or not. Only the return value false (not void, not
                // empty) terminates the loop and the rendering for the selector
                // without using the standard functions.
                if (selector.parentNode) {
                    for (const [key, macro] of _selectors) {
                        const nodes = selector.parentNode.querySelectorAll(macro.selector);
                        if (Array.from(nodes).includes(selector)) {
                            if (macro.callback(selector) === false)
                                return;
                        }
                    }
                }

                // Register each analyzed node/element and minimizes multiple
                // analysis. For registration, the serial of the node/element is
                // used. The node prototype has been enhanced with creation and
                // a get-function. During the analysis, the attributes of an
                // element (not node) containing an expression or all allowed
                // attributes are cached in the memory (_render_meta).
                let serial = selector.ordinal();
                let object = _render_meta[serial];
                if (!object) {

                    // Acceptors are a very special way to customize. Unlike the
                    // other ways, here the rendering is not shifted into own
                    // implementations. With an acceptor, an element is
                    // manipulated before rendering and only if the renderer
                    // processes the element initially. This makes it possible
                    // to make individual changes to the attributes or the
                    // markup before the renderer processes them. This does not
                    // affect the implementation of the rendering.
                    // Example of the method call with an acceptor:
                    //     Composite.customize(function(element) {...});
                    _acceptors.forEach((acceptor) =>
                        acceptor.call(null, selector));

                    object = {serial, element:selector, attributes:{}};
                    _render_meta[serial] = object;
                    if ((selector instanceof Element)
                            && selector.attributes) {
                        Array.from(selector.attributes).forEach((attribute) => {
                            attribute = {name:attribute.name.toLowerCase(), value:(attribute.value || "").trim()};
                            if (attribute.value.match(Composite.PATTERN_EXPRESSION_CONTAINS)
                                    || attribute.name.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)
                                    || _statics.has(attribute.name)) {
                                
                                // Remove all internal attributes but not the
                                // statics. Static attributes are still used in
                                // the markup or for the rendering.
                                if (attribute.name.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)
                                        && !attribute.name.match(Composite.PATTERN_ATTRIBUTE_STATIC)
                                        && !_statics.has(attribute.name)
                                        && attribute.name !== Composite.ATTRIBUTE_RELEASE)
                                    selector.removeAttribute(attribute.name);
                                
                                object.attributes[attribute.name] = attribute.value;
                                
                                // Special case: ATTRIBUTE_ID/ATTRIBUTE_EVENTS
                                // Both attributes are used initially for the
                                // object and event binding. Expressions are
                                // supported for the attributes, but these are
                                // only initially resolved during the first
                                // rendering.
                                
                                // Special case: static attributes
                                // These attributes are used initially markup
                                // harding. Expressions are supported for the
                                // attributes, but these are only initially
                                // resolved during the first rendering.
                                
                                if (attribute.value.match(Composite.PATTERN_EXPRESSION_CONTAINS)
                                        && (attribute.name.match(Composite.PATTERN_ATTRIBUTE_STATIC)
                                                || attribute.name === Composite.ATTRIBUTE_ID
                                                || attribute.name === Composite.ATTRIBUTE_EVENTS
                                                || _statics.has(attribute.name)))
                                    attribute.value = Expression.eval(selector.ordinal() + ":" + attribute.name, attribute.value);
                                
                                // The initial value of the static attribute is
                                // registered for the restore. This is a part of
                                // the markup hardening of the MutationObserver.                            
                                if (attribute.name.match(Composite.PATTERN_ATTRIBUTE_STATIC)
                                        || attribute.name === Composite.ATTRIBUTE_ID
                                        || attribute.name === Composite.ATTRIBUTE_EVENTS)
                                    object.attributes[attribute.name] = attribute.value;

                                // The initial value of the static attribute is
                                // registered for the restore. This is a part of
                                // the markup hardening of the MutationObserver.
                                object.statics = object.statics || {};
                                if (_statics.has(attribute.name))
                                    object.statics[attribute.name] = attribute.value;
                                
                                // The result of the expression must be written
                                // back to the static attributes.   
                                if (attribute.name.match(Composite.PATTERN_ATTRIBUTE_STATIC)
                                        || attribute.name === Composite.ATTRIBUTE_ID
                                        || attribute.name === Composite.ATTRIBUTE_EVENTS
                                        || _statics.has(attribute.name))
                                    selector.setAttribute(attribute.name, attribute.value);
                            }
                        });

                        // ATTRIBUTE_CONDITION: If an HTML element uses this
                        // attribute, a text node is created for the element as
                        // a marker with a corresponding meta-object for the
                        // details of the element, condition and the outer HTML
                        // as a template. Then the HTML element in the DOM is
                        // replaced by the marker as text node. The original
                        // selector is switched to the text node and rendering
                        // continues.

                        if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_CONDITION)) {
                            const expression = (object.attributes[Composite.ATTRIBUTE_CONDITION] || "").trim();
                            if (!expression.match(Composite.PATTERN_EXPRESSION_CONDITION))
                                throw new Error(`Invalid condition${expression ? ": " + expression : ""}`);

                            // The marker and its meta-object are created. This
                            // prevents the MutationObserver from rendering the
                            // marker, because it is then already known.
                            const marker = document.createTextNode("");
                            const template = selector.cloneNode(true);
                            const attributes = object.attributes;
                            object = {serial:marker.ordinal(), element:marker, attributes,
                                condition:{expression, template, marker, element:null, attributes, complete:false, share:null}};
                            _render_meta[object.serial] = object;

                            // The meta-object for the HTML element is removed,
                            // because only the new marker is relevant.
                            delete _render_meta[serial];

                            // The marker is initially created and in the DOM.
                            selector.parentNode.replaceChild(marker, selector);

                            // The rendering of the marker continues
                            // recursively, so that objects do not have to be
                            // switched/rewritten and the rendering can be
                            // finished here.
                            Composite.render(marker, lock.share());
                            return;
                        }

                        // Load modules/components/composite resources.
                        if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE))
                            Composite.include(selector);
                    }
                }

                // ATTRIBUTE_CONDITION: At this point, the renderer encounters a
                // condition. This can be the marker or the element. Which one
                // exactly is unimportant. In both cases, we decide here what to
                // do and what happens.

                // If the current lock corresponds to the share from the
                // condition object, the rendering for marker and output has
                // already been done and nothing more needs to be done.
                if (object.hasOwnProperty("condition")
                        && object.condition.share === lock.ordinal())
                    return;

                // If share absolute does not match the lock, the condition must
                // be validated initially.
                if (object.hasOwnProperty("condition")
                        && Math.abs(object.condition.share || 0) !== lock.ordinal()) {
                    object.condition.share = -lock.ordinal();

                    // The final rendering is recursive and uses a negated
                    // (negative) lock as indicator that the condition has
                    // already been validated.

                    const condition = object.condition;

                    // The condition must be explicitly true, otherwise the
                    // output is removed from the DOM and the rendering ends.
                    // The cleanup will be done by the MutationObserver.
                    const expression = Expression.eval(serial + ":" + Composite.ATTRIBUTE_CONDITION, condition.expression);
                    selector.nodeValue = expression instanceof Error ? expression : "";
                    if (expression !== true) {
                        // Because a condition can consist of two elements
                        // (marker and conditional element), it can happen that
                        // when rendering a NodeList, the marker is hit first,
                        // which then deletes the element, and the NodeList
                        // still contains the element that has already been
                        // deleted. Then this place is also called, but then the
                        // node/element has no parent.
                        if (condition.element
                                && condition.element.parentNode)
                            condition.element.parentNode.removeChild(condition.element);
                        condition.element = null;
                        condition.share = lock.ordinal();
                        return;
                    }

                    // If the output already exists, the content must be
                    // rendered recursively, so that objects do not have to be
                    // switched and the rendering can be finished here.
                    if (condition.element) {
                        Composite.render(condition.element, lock.share());
                        return;
                    }

                    condition.element = condition.template.cloneNode(true);
                    const element = condition.element;
                    const attributes = Object.assign({}, condition.attributes);
                    _render_meta[element.ordinal()] = {serial:element.ordinal(), element, attributes, condition};

                    // Load modules/components/composite resources.
                    // That no resources are loaded more than once is taken care
                    // of by the include method ot Composite.
                    if (attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE))
                        Composite.include(element);

                    selector.parentNode.insertBefore(element, selector);

                    // The rendering of the marker continues recursively, so
                    // that objects do not have to be switched/rewritten and the
                    // rendering can be finished here.

                    Composite.render(condition.element, lock.share());
                    return;
                }

                // If share matches the negated lock, then the content must be
                // rendered normally, but only once. Therefore, share is
                // finalized by the positive lock.
                if (object.hasOwnProperty("condition")
                        && object.condition.share !== -lock.ordinal())
                    object.condition.share = lock.ordinal();

                // A text node contain static and dynamic contents as well as
                // parameters. Dynamic contents and parameters are formulated
                // as expressions, but only the dynamic contents are output.
                // Parameters are interpreted, but do not generate any output.
                // During initial processing, a text node is analyzed and, if
                // necessary, split into static content, dynamic content and
                // parameters. To do this, the original text node is replaced by
                // new separate text nodes:
                //     e.g. "text {{expr}} + {{var:expr}}"
                //              ->  ["text ", {{expr}}, " + ", {{var:expr}}]
                //
                // When the text nodes are split, meta-objects are created for
                // them. The meta-objects are compatible with the meta-objects
                // of the rendering methods but use the additional attributes: 
                //     Composite.ATTRIBUTE_TEXT, Composite.ATTRIBUTE_NAME and
                //     Composite.ATTRIBUTE_VALUE
                // Only static content uses Composite.ATTRIBUTE_TEXT, dynamic
                // content and parameters use Composite.ATTRIBUTE_VALUE, and
                // only the parameters use Composite.ATTRIBUTE_NAME. The meta
                // objects for dynamic content also have their own rendering
                // method for generating output. Static content is ignored later
                // during rendering because it is unchangeable.
                if (selector.nodeType === Node.TEXT_NODE) {
                    
                    // Elements of type: script + style are ignored.
                    // No expression is replaced here.
                    if (selector.parentNode
                            && selector.parentNode.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE))
                        return;
                    
                    // Text nodes are only analyzed once. Pure text is
                    // completely ignored, only text nodes with an expression as
                    // value are updated.
                    if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_TEXT))
                        return;

                    // New/unknown text nodes must be analyzed and prepared. If
                    // the meta-object for text nodes Composite.ATTRIBUTE_TEXT
                    // and Composite.ATTRIBUTE_VALUE are not contained, it must
                    // be new.
                    if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_VALUE)) {
                        object.render();
                        return;
                    }   
                        
                    // Step 1:
                    // If the text node does not contain an expression, the
                    // content is static. Static text nodes are marked with the
                    // attribute Composite.ATTRIBUTE_TEXT.
                    
                    let content = selector.textContent;
                    if (content.match(Composite.PATTERN_EXPRESSION_CONTAINS)) {
                        
                        // Step 2:
                        // All expressions are determined. A meta-object is
                        // created for all expressions. In the text content from
                        // the text node, the expressions are replaced by a
                        // placeholder in the format of the expression with a
                        // serial. Empty expressions are removed/ignored.
                        
                        // All created meta-objects with an expression have a
                        // special render method for updating the text content
                        // of the text node.
                        
                        // Step 3:
                        // The format of the expression distinguishes whether it
                        // is a parameter or an output expression. Parameter
                        // expressions start with the name of the parameter and
                        // are interpreted later, but do not generate any output.
                        
                        content = content.replace(Composite.PATTERN_EXPRESSION_CONTAINS, (match) => {
                            if (!match.substring(2, match.length -2).trim())
                                return "";
                            const node = document.createTextNode("");
                            const serial = node.ordinal();
                            const object = {serial, element:node, attributes:{}, value:null,
                                render() {
                                    let word = "";
                                    if (this.attributes.hasOwnProperty(Composite.ATTRIBUTE_NAME)) {
                                        const name = String(this.attributes[Composite.ATTRIBUTE_NAME] || "").trim();
                                        const value = String(this.attributes[Composite.ATTRIBUTE_VALUE] || "").trim();
                                        window[name] = Expression.eval(this.serial + ":" + Composite.ATTRIBUTE_VALUE, value);
                                    } else {
                                        word = String(this.attributes[Composite.ATTRIBUTE_VALUE] || "");
                                        word = Expression.eval(this.serial + ":" + Composite.ATTRIBUTE_VALUE, word);
                                    }
                                    this.value = word;
                                    this.element.textContent = word !== undefined ? word : "";
                                }};
                                const param = match.match(Composite.PATTERN_EXPRESSION_VARIABLE);
                                if (param) {
                                    object.attributes[Composite.ATTRIBUTE_NAME] = param[1];
                                    object.attributes[Composite.ATTRIBUTE_VALUE] = "{{" + param[2] + "}}";
                                } else object.attributes[Composite.ATTRIBUTE_VALUE] = match;
                            _render_meta[serial] = object;
                            return "{{" + serial + "}}";
                        });
                        
                        // Step 4:
                        // The prepared text with expression placeholders is
                        // analyzed. All placeholders are determined and the
                        // text is split at the placeholders. The result is an
                        // array of words. Each word is a new text nodes with
                        // static text or dynamic content.
                        
                        if (content.match(Composite.PATTERN_EXPRESSION_CONTAINS)) {
                            const words = content.split(/(\{\{\d+\}\})/);
                            words.forEach((word, index, array) => {
                                if (word.match(/^\{\{\d+\}\}$/)) {
                                    const serial = parseInt(word.substring(2, word.length -2).trim());
                                    const object = _render_meta[serial];
                                    Composite.fire(Composite.EVENT_RENDER_NEXT, object.element);
                                    object.render();
                                    array[index] = object.element;
                                } else {
                                    const node = document.createTextNode(word);
                                    const serial = node.ordinal();
                                    const object = {serial, element:node, attributes:{}};
                                    Composite.fire(Composite.EVENT_RENDER_NEXT, object.element);
                                    object.element.textContent = word;
                                    object.attributes[Composite.ATTRIBUTE_TEXT] = word;
                                    _render_meta[serial] = object;
                                    array[index] = object.element;
                                }
                            });
                            
                            // Step 5:
                            // The newly created text nodes are inserted before
                            // the current text node. The current text node can
                            // then be deleted, since its content is displayed
                            // using the newly created text nodes.
                            
                            // For internal and temporary calls, no parent can
                            // exist.
                            if (selector.parentNode === null)
                                return;
                            
                            // The new text nodes are inserted before the
                            // current element one.
                            words.forEach((node) =>
                                selector.parentNode.insertBefore(node, selector));
                            
                            // The current element will be removed.
                            selector.parentNode.removeChild(selector);
                            
                            return;
                        }
                        
                        // If the text content contains empty expressions, these
                        // are corrected and the content is used as static.
                        selector.nodeValue = content;
                    }
                    
                    object.attributes[Composite.ATTRIBUTE_TEXT] = content;
                    
                    return;
                }

                if (!(selector instanceof Element))
                    return;

                // Only composites are mounted based on their model. This
                // excludes markers of conditions as text nodes.
                if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE)) {
                    const locate = _mount_locate(selector);
                    let model = (locate.namespace || []).concat(locate.model).join(".");
                    if (!_models.has(model)) {
                        _models.add(model);
                        model = Object.lookup(model);
                        if (model && typeof model.dock === "function") {
                            const meta = _mount_lookup(selector);
                            Composite.fire(Composite.EVENT_MODULE_DOCK, meta);
                            model.dock.call(model);
                            Composite.fire(Composite.EVENT_MODULE_READY, meta);
                        }
                    }
                }

                // The attributes ATTRIBUTE_EVENTS, ATTRIBUTE_VALIDATE and
                // ATTRIBUTE_RENDER are processed in Composite.mount(selector)
                // the view model binding and are only mentioned here for
                // completeness.
                
                // The attribute ATTRIBUTE_RELEASE has no functional
                // implementation. This is exclusively inverse indicator that an
                // element was rendered. The renderer removes this attribute
                // when an element is rendered. This effect can be used for CSS
                // to display elements only in rendered state.   
                
                // ATTRIBUTE_IMPORT: This declaration loads the content and
                // replaces the inner HTML of an element with the content.
                // The following data types are supported:
                // 1. Node and NodeList as the result of an expression.
                // 2. URL (relative or absolute) loads markup/content from a
                //    remote data source via the HTTP method GET
                // 2. DataSource-URL loads and transforms DataSource data.
                // 3. Everything else is output directly as string/text.
                // The import is exclusive, similar to ATTRIBUTE_OUTPUT, thus
                // overwriting any existing content. The recursive (re)rendering
                // is initiated via the MutationObserver. If the content can be
                // loaded successfully, ATTRIBUTE_IMPORT is removed.
                if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_IMPORT)) {
                    selector.innerHTML = "";
                    let value = object.attributes[Composite.ATTRIBUTE_IMPORT];
                    if ((value || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
                        value = Expression.eval(serial + ":" + Composite.ATTRIBUTE_IMPORT, String(value));

                    if (!value) {
                        delete object.attributes[Composite.ATTRIBUTE_IMPORT];                
                    
                    } else if (value instanceof Element
                            || value instanceof NodeList) {
                        selector.appendChild(value, true);
                        delete object.attributes[Composite.ATTRIBUTE_IMPORT];                

                    } else if (String(value).match(Composite.PATTERN_DATASOURCE_URL)) {
                        let data = String(value).match(Composite.PATTERN_DATASOURCE_URL);
                        data[2] = DataSource.fetch("xslt://" + (data[2] || data[1]));
                        data[1] = DataSource.fetch("xml://" + data[1]);
                        data = DataSource.transform(data[1], data[2]);
                        selector.appendChild(data, true);
                        const serial = selector.ordinal();
                        const object = _render_meta[serial];
                        delete object.attributes[Composite.ATTRIBUTE_IMPORT];
                    
                    } else if (_render_cache[value] !== undefined) {
                        selector.innerHTML = _render_cache[value];
                        const serial = selector.ordinal();
                        const object = _render_meta[serial];
                        delete object.attributes[Composite.ATTRIBUTE_IMPORT];
                    
                    } else {
                        Composite.asynchron((selector, lock, url) => {
                            try {
                                const request = new XMLHttpRequest();
                                request.overrideMimeType("text/plain");
                                request.open("GET", url, false);
                                request.send();
                                if (request.status !== 200)
                                    throw new Error(`HTTP status ${request.status} for ${request.responseURL}`);
                                const content = request.responseText.trim();
                                _render_cache[request.responseURL] = content;
                                selector.innerHTML = content;
                                const serial = selector.ordinal();
                                const object = _render_meta[serial];
                                delete object.attributes[Composite.ATTRIBUTE_IMPORT];
                            } catch (error) {
                                Composite.fire(Composite.EVENT_HTTP_ERROR, error);
                                throw error;
                            } finally {
                                lock.release();
                            }
                        }, selector, lock.share(), value);
                    }
                } 
                
                // ATTRIBUTE_OUTPUT: This declaration sets the value or result
                // of an expression as the content of an element.
                // The following data types are supported:
                // 1. Node and NodeList as the result of an expression.
                // 2. DataSource-URL loads and transforms DataSource data.
                // 3. Everything else is output directly as string/text.
                // The output is exclusive, thus overwriting any existing
                // content. The recursive (re)rendering is initiated via the
                // MutationObserver.
                if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_OUTPUT)) {
                    selector.innerHTML = "";
                    let value = object.attributes[Composite.ATTRIBUTE_OUTPUT];
                    if ((value || "").match(Composite.PATTERN_EXPRESSION_CONTAINS))
                        value = Expression.eval(serial + ":" + Composite.ATTRIBUTE_OUTPUT, String(value));
                    if (String(value).match(Composite.PATTERN_DATASOURCE_URL)) {
                        let data = String(value).match(Composite.PATTERN_DATASOURCE_URL);
                        data[2] = DataSource.fetch("xslt://" + (data[2] || data[1]));
                        data[1] = DataSource.fetch("xml://" + data[1]);
                        data = DataSource.transform(data[1], data[2]);
                        selector.appendChild(data, true);
                    } else if (value instanceof Node)
                        selector.appendChild(value.cloneNode(true), true);
                    else if (value instanceof NodeList)
                        Array.from(value).forEach((node, index) =>
                            selector.appendChild(node.cloneNode(true), index === 0));
                    else selector.innerHTML = String(value);
                }

                // ATTRIBUTE_INTERVAL: Interval based rendering. If an HTML
                // element is declared with an interval, this element is
                // periodically updated according to the interval. But for this
                // purpose, it is not reset to the initial state. The interval
                // ends automatically when the element is removed from the DOM
                // as is the case when combined with CONDITION.
                let interval = String(object.attributes[Composite.ATTRIBUTE_INTERVAL] || "").trim();
                if (interval && !object.interval) {
                    const context = serial + ":" + Composite.ATTRIBUTE_INTERVAL;
                    interval = String(Expression.eval(context, interval));
                    if (!interval.match(/^\d*$/))
                        throw new Error("Invalid interval: " + interval);
                    interval = Number.parseInt(interval);
                    object.interval = window.setInterval(() => {
                        if (!document.body.contains(selector)) {
                            window.clearInterval(object.interval);
                            delete object.interval;
                        } else Composite.render(selector);
                    }, interval);
                }

                // ATTRIBUTE_ITERATE: Iterative rendering based on enumeration,
                // lists and arrays. If an HTML element is declared iteratively,
                // its initial inner HTML is used as a template. During
                // iteration, the inner HTML is initially emptied, the template
                // is rendered individually with each iteration cycle and the
                // result is added to the inner HTML.
                // There are some particularities to consider:
                // 1. The internal recursive rendering must be done
                //    sequentially.
                // 2. A global variable is required for the iteration. If this
                //    variable already exists, the existing variable is saved
                //    and restored at the end of the iteration.
                // 3. The variable with the partial meta-object is added at th
                //    beginning of each iteration block as a value expression,
                //    so that no problems with the temporary variable occur
                //    later during partial rendering. This way the block keeps th
                //    meta information it is built on.
                // 4. Variable with meta information about the iteration is used
                //    within the iteration:
                //    e.g iterate={{tempA:Model.list}}
                //            -> tempA = {item, index, data}
                if (object.attributes.hasOwnProperty(Composite.ATTRIBUTE_ITERATE)) {

                    if (!object.iterate) {
                        const iterate = String(object.attributes[Composite.ATTRIBUTE_ITERATE] || "").trim();
                        const match = iterate.match(Composite.PATTERN_EXPRESSION_VARIABLE);
                        if (!match)
                            throw new Error(`Invalid iterate${iterate ? ": " + iterate : ""}`);
                        object.iterate = {name:match[1].trim(), expression:"{{" + match[2].trim() + "}}", items:[]};
                        object.template = selector.cloneNode(true);
                        selector.innerHTML = "";
                    }

                    // A temporary global variable is required for the
                    // iteration. If this variable already exists, the existing
                    // is cached and restored at the end of the iteration.

                    const context = serial + ":" + Composite.ATTRIBUTE_ITERATE;
                    let iterate = Expression.eval(context, object.iterate.expression);
                    if (iterate instanceof Error)
                        throw iterate;
                    if (iterate) {
                        delete object.iterate.variable;
                        if (eval("typeof " + object.iterate.name + " !== \"undefined\""))
                            object.iterate.variable = eval(object.iterate.name);
                        if (iterate instanceof XPathResult) {
                            const meta = {entry: null, array: [], iterate};
                            while (meta.entry = meta.iterate.iterateNext())
                                meta.array.push(meta.entry);
                            iterate = meta.array;
                        } else iterate = Array.from(iterate);

                        object.iterate.update = object.iterate.items.length !== iterate.length;
                        if (object.iterate.update) {
                            selector.innerHTML = "";
                            object.iterate.items = Array.from(iterate);
                            iterate.forEach((item, index, array) => {
                                const meta = {};
                                Object.defineProperty(meta, "item", {
                                    enumerable:true, value:item
                                });
                                Object.defineProperty(meta, "index", {
                                    enumerable:true, value:index
                                });
                                Object.defineProperty(meta, "data", {
                                    enumerable:true, value:array
                                });
                                object.iterate.items[index] = meta
                                const data = "{{___(\"" + object.iterate.name + "\", " + serial + ", " + index + ")}}";
                                const node = document.createTextNode(data);
                                selector.appendChild(node);
                                Composite.render(node, lock.share());
                                // For whatever reason, if forEach is used on
                                // the NodeList, each time it is appended to the
                                // DOM the elements are removed from the
                                // NodeList piece by piece.
                                Array.from(object.template.cloneNode(true).childNodes).forEach(node => {
                                    selector.appendChild(node);
                                    Composite.render(node, lock.share());
                                });
                            });
                            // The expression to reset the temporary variable is
                            // created and inserted at the end of the iteration,
                            // which resets the variable to the previous value.
                            // This resets the variable to the previous value
                            // and thus simulates the effect of own scopes.
                            const data = "{{___(\"" + object.iterate.name + "\", " + serial + ")}}";
                            const node = document.createTextNode(data);
                            selector.appendChild(node);
                            Composite.render(node, lock.share());
                        }
                    }
                    // The content is finally rendered, the enclosing container
                    // element itself, or more precisely the attributes, still
                    // needs to be updated.
                }
                
                // EXPRESSION: The expression in the attributes is interpreted.
                // The expression is stored in a meta-object and loaded from
                // there, the attributes of the element can be overwritten in a
                // render cycle and are available (conserved) for further cycles.
                // A special case is the text element. The result is output here
                // as textContent. Elements of type: script + style are ignored.
                if (!selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE)) {
                    const attributes = [];
                    for (const key in object.attributes)
                        if (object.attributes.hasOwnProperty(key))
                            attributes.push(key);
                    if (Composite.ATTRIBUTE_VALUE in selector
                            && object.attributes.hasOwnProperty(Composite.ATTRIBUTE_VALUE)
                            && !attributes.includes(Composite.ATTRIBUTE_VALUE))
                        attributes.push(Composite.ATTRIBUTE_VALUE);
                    attributes.forEach((attribute) => {
                        // Ignore all internal attributes
                        if (attribute.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)
                                && !attribute.match(Composite.PATTERN_ATTRIBUTE_STATIC))
                            return;
                        let value = String(object.attributes[attribute] || "");
                        if (!value.match(Composite.PATTERN_EXPRESSION_CONTAINS))
                            return;
                        const context = serial + ":" + attribute;
                        value = Expression.eval(context, value);
                        // If the type value is undefined, the attribute is
                        // removed. Since the attribute contains an expression,
                        // the removal is only temporary and is checked again at
                        // the next render cycle and possibly inserted again if
                        // the expression returns a return value.
                        if (value !== undefined) {
                            value = String(value).encodeHtml();
                            value = value.replace(/"/g, "&quot;");
                            // Special case attribute value, here primarily the
                            // value of the property must be set, the value of
                            // the attribute is optional. Changing the value
                            // does not trigger an event, so no unwanted
                            // recursions occur.
                            if (attribute.toLowerCase() === Composite.ATTRIBUTE_VALUE
                                    && Composite.ATTRIBUTE_VALUE in selector)
                                selector.value = value;
                            // @-ATTRIBUTE: These are attribute templates for
                            // the renderer, which inserts attributes of the
                            // same name to them without @. This feature can be
                            // applied to all non-composite relevant attributes
                            // and avoids that attributes are misinterpreted by
                            // the browser before rendering, e.g. if the value
                            // uses the expression language. Attributes created
                            // from templates behave like other attributes,
                            // which includes updating by the renderer.
                            if (attribute.startsWith("@")) {
                                selector.removeAttribute(attribute);
                                attribute = attribute.replace(/^@+/, "");
                            }
                            selector.setAttribute(attribute, value);
                        } else selector.removeAttribute(attribute);
                    });
                }

                // Embedded scripting brings some special effects. The default
                // scripting is automatically executed by the browser and
                // independent of rendering. Therefore, the scripting for
                // rendering has been adapted and a new script type have been
                // introduced: composite/javascript. This script type use the
                // normal JavaScript. Unlike type text/javascript, the browser
                // does not recognize them and does not execute the JavaScript
                // code automatically. Only the render recognizes the JavaScript
                // code and executes it in each render cycle when the cycle
                // includes the script element. So the execution of the script
                // element can be combined with ATTRIBUTE_CONDITION.
                if (selector.nodeName.match(Composite.PATTERN_SCRIPT)) {
                    const type = (selector.getAttribute(Composite.ATTRIBUTE_TYPE) || "").trim();
                    if (type.match(Composite.PATTERN_COMPOSITE_SCRIPT)) {
                        try {Scripting.eval(selector.textContent);
                        } catch (error) {
                            throw new Error("Composite JavaScript", error);
                        }
                    }
                }
                
                // Follow other element children recursively.
                // The following are ignored:
                // - Elements of type: script + style and custom tags
                // - Elements with functions that modify the inner markup
                // - Elements that are iteration
                // These elements manipulate the inner markup.
                // This is intercepted by the MutationObserver.
                if (selector.childNodes
                        && !selector.nodeName.match(Composite.PATTERN_ELEMENT_IGNORE)
                        && !(object.attributes.hasOwnProperty(Composite.ATTRIBUTE_ITERATE)
                                && object.iterate.update)) {
                    Array.from(selector.childNodes).forEach((node) => {
                        // The rendering is recursive, if necessary the node is
                        // then no longer available. For example, if a condition
                        // is replaced by the marker.
                        if (!selector.contains(node))
                            return;
                        Composite.render(node, lock.share());
                    });
                }
                
                if (selector.hasAttribute(Composite.ATTRIBUTE_RELEASE))
                    selector.removeAttribute(Composite.ATTRIBUTE_RELEASE);

            } catch (error) {
                console.error(error);
                Composite.fire(Composite.EVENT_ERROR, error);
                if (origin instanceof Element)
                    origin.innerText = "Error: " + (error.message.match(/(\{\{|\}\})/)
                        ? "Invalid expression" : error.message);

            } finally {

                // The queue is used to prevent elements from being registered for
                // update multiple times during a render cycle when a lock exists.
                // When the selector is rendered, any queued jobs are removed.
                Composite.render.queue = Composite.render.queue.filter(entry => entry !== origin);

                lock.release();
            }
        },

        /**
         * Loads a resource (JS, CSS, HTML are supported).
         * @param  resource
         * @param  strict
         * @return the content when loading a HTML resource
         */
        load(resource, strict) {

            resource = (resource || "").trim();
            if (!resource.match(/\.(js|css|html)(\?.*)?$/i))
                throw new Error("Resource not supported" + (resource ? ": " + resource : ""))

            const normalize = (path) => {
                const anchor = document.createElement("a");
                anchor.href = path;
                return anchor.pathname.replaceAll(/\/{2,}/g, "/");
            };

            // JS and CSS are loaded only once
            resource = normalize(resource);
            if (!resource.startsWith(Composite.MODULES + "/"))
                throw new Error("Resource not supported: " + resource);
            if (resource in _render_cache
                    && resource.match(/\.(js|css)(\?.*)?$/i))
                return;

            // Resource has already been requested, but with no useful
            // response and unsuccessful requests will not be repeated
            if (resource in _render_cache
                    && _render_cache[resource] === undefined)
                return;

            if (!(resource in _render_cache)) {
                _render_cache[resource] = undefined;
                const request = new XMLHttpRequest();
                request.overrideMimeType("text/plain");
                request.open("GET", resource, false);
                request.send();
                // Only server states 200 and 404 (not in combination with the
                // option strict) are supported, others will cause an error and
                // the requests are not repeated later.
                if (request.status === 404
                        && !strict)
                    return;
                if (request.status !== 200)
                    throw new Error(`HTTP status ${request.status} for ${request.responseURL}`);
                _render_cache[resource] = request.responseText.trim();
            }

            // CSS is inserted into the HEAD element as a style element.
            // Without a head element, the inserting causes an error.

            // JavaScript is not inserted as an element, it is executed
            // directly. For this purpose eval is used. Since the method may
            // form its own scope for variables, it is important to use the
            // macro #export to be able to use variables and/or constants in
            // the global scope.

            // HTML/Markup is preloaded into the render cache if available.
            // If markup exists for the composite, ATTRIBUTE_IMPORT with the
            // URL is added to the item. Inserting then takes over the
            // import implementation, which then also accesses the render
            // cache.

            const content = _render_cache[resource];
            if (resource.match(/\.js(\?.*)?$/i)) {
                try {Scripting.eval(content);
                } catch (error) {
                    console.error(resource, error.name + ": " + error.message);
                    throw error;
                }
            } else if (resource.match(/\.css(\?.*)?$/i)) {
                const head = document.querySelector("html head");
                if (!head)
                    throw new Error("No head element found");
                const style = document.createElement("style");
                style.setAttribute("type", "text/css");
                style.textContent = content;
                head.appendChild(style);
            } else if (resource.match(/\.html(\?.*)?$/i))
                return content;
        },

        /**
         * Loads modules/components/composite resources. The assumption is, for
         * components/composites, the resources are outsourced. JS and HTML are
         * supported. Resources are stored in the module directory (./modules by
         * default is relative to the page URL). The resources (response) are
         * stored in the render cache, but only to detect and prevent repeated
         * loading. The resources will only be requested once. If they do not
         * exist (status 404), it is not tried again. Otherwise, an error is
         * thrown if the request is not answered with status 200.
         *
         * The method also supports string arrays for resources with path. Then
         * each path element is an array entry.
         *
         * Following rules apply to loading resources:
         * - Composite ID / namespace / path must have a valid syntax
         * - HTML is loaded only for elements when the elements have no content
         * - CSS is only loaded when HTML is also loaded
         * - JavaScript is loaded only if no corresponding JavaScript model 
         *   exists
         *
         * @param composite
         */
        include(...composite) {

            if (composite.length <= 0
                    || (composite.length === 1
                            && !(composite[0] instanceof Element)
                            && typeof composite[0] !== "string"))
                throw new TypeError("Invalid composite for include");
            if (composite.length === 1
                    && composite[0] instanceof Element)
                composite = composite[0];

            let resource = composite;

            let object = null;
            if (composite instanceof Element) {
                if (!composite.hasAttribute(Composite.ATTRIBUTE_ID))
                    throw new Error("Unknown composite without id");
                object = _render_meta[composite.ordinal()];
                if (!object)
                    throw new Error("Unknown composite");
                const meta = _mount_locate(composite);
                if (!meta.namespace)
                    meta.namespace = [];
                meta.namespace.push(meta.model);
                resource = meta.namespace;
            }

            const context = Composite.MODULES + "/" + resource.join("/");

            // Based on namespace and resource a corresponding JavaScript object
            // is searched for. Therefore, here with invalid namespace/composite
            // IDs an error occurs, which must be noticed however already
            // before, it is to be ensured that only modules are loaded to valid
            // composites (namespace + composite ID). Later, it is also decided
            // whether JavaScript must be loaded. This is only necessary if
            // lookup cannot determine a JavaScript model (undefined or
            // element).

            // Theoretically an error can occur during the lookup if namespace
            // or composite ID are invalid, but this should already run on error
            // before, so it is not done here -- otherwise this is a bug!

            const lookup = Object.lookup(resource.join("."));

            resource = resource.join("/");

            // Was the module already loaded?
            // Initially EVENT_MODULE_LOAD is triggered.
            if (_render_cache[context + ".composite"] === undefined)
                Composite.fire(Composite.EVENT_MODULE_LOAD, composite, resource);
            _render_cache[context + ".composite"] = null;

            // The sequence of loading is strictly defined: JS, CSS, HTML

            // JavaScript is only loaded if no corresponding object exists for
            // the Composite ID or the object is an element object
            if (lookup === undefined
                    || lookup instanceof Element
                    || lookup instanceof HTMLCollection
                    || resource === "common")
                this.load(context + ".js");

            // CSS and HTML are loaded once and only if they are resources to an
            // element and the element is empty, excludes CSS for common.
            if (resource === "common")
                this.load(context + ".css");

            // CSS and HTML/markup is only loaded if it is a known composite
            // object and the element does not contain a markup (inner HTML).
            // For inserting HTML/markup ATTRIBUTE_IMPORT and ATTRIBUTE_OUTPUT
            // must not be set. It is assumed that an empty component/elements
            // outsourced markup exists.
            if (composite instanceof Element
                    && !composite.innerHTML.trim())
                this.load(context + ".css");

            // Is only required if the composite has no content and will not be
            // filled with the attributes ATTRIBUTE_IMPORT and ATTRIBUTE_OUTPUT.
            if (composite instanceof Element
                    && !composite.innerHTML.trim()
                    && !object?.attributes.hasOwnProperty(Composite.ATTRIBUTE_IMPORT)
                    && !object?.attributes.hasOwnProperty(Composite.ATTRIBUTE_OUTPUT)) {
                const content = this.load(context + ".html");
                if (content === undefined)
                    return;
                _recursion_detection(composite);
                if (composite instanceof Element)
                    composite.innerHTML = content;
            }
        }
    });

    /**
     * Set of attributes to be hardened.
     * The hardening of attributes is part of the safety concept and should make
     * it more difficult to manipulate the markup at runtime. Hardening observes
     * attributes and undoes changes. Initially, the list is empty because the
     * policies and rules are too individual.
     * 
     * The following attributes are recommended:
     *     action        autocomplete      autofocus
     *     form          formaction        formenctype
     *     formmethod    formnovalidate    formtarget
     *     height        list              max
     *     min           multiple          name
     *     pattern       placeholder       required
     *     size          step              target
     *     type          width
     *     
     * The following attributes are automatically hardened:
     *     COMPOSITE     ID                STATIC*
     *     
     * Composite internal/relevant attributes are also protected, these are
     * removed in markup and managed in memory:
     *     COMPOSITE     CONDITION         EVENTS
     *     ID            IMPORT            INTERVAL
     *     ITERATE       OUTPUT            RELEASE
     *     RENDER        VALIDATE
     */
    const _statics = new Set();

    /** Map for custom tags (key:tag, value:function) */
    const _macros = new Map();

    /** Map for custom selectors (key:hash, value:{selector, function}) */
    const _selectors = new Map();

    /** Set with acceptor and their registered listeners */
    const _acceptors = new Set();

    /** Map with events and their registered listeners */
    const _listeners = new Map();

    /** 
     * Set with docked models.
     * The set is used for the logic to call the dock and undock methods, 
     * because the static models themselves have no status and the decision
     * about the current existence in the DOM is not stable.
     * All docked models are included in the set.
     */
    const _models = new Set();

    // Internal method for controlling temporary variables for expression
    // rendering, such as for ATTRIBUTE_ITERATE. The goal is for the method to
    // simulate a separate scope for temporary variables. For this purpose,
    // global variables are created as expressions and removed again at the end
    // of the scope or reset to a possible previously existing value.
    compliant("___");
    compliant(null, ___ = (variable, serial, index) => {
        let object = _render_meta[serial];
        if (object && object.iterate) {
            if (index === undefined) {
                if ("variable" in object.iterate)
                    eval(variable + " = object.iterate.variable");
                else eval("delete " + variable);
            } else eval(variable + " = object.iterate.items[" + index + "]");
        }
    });

    const _recursion_detection = (element) => {
        const id = (element instanceof Element ? element.id || "" : "").trim();
        const pattern = id.toLowerCase();
        while (pattern && element instanceof Element) {
            element = element.parentNode;
            if (element instanceof Element
                    && element.hasAttribute(Composite.ATTRIBUTE_COMPOSITE)
                    && element.hasAttribute(Composite.ATTRIBUTE_ID)
                    && (element.id || "").toLowerCase().trim() === pattern)
                throw new Error("Recursion detected for composite: " + id);
        }
    }

    /**
     * Determines the meta data for an element based on its position in the DOM
     * with the corresponding model, the referenced route and target. The meta
     * data is only determined as text information.
     * 
     * Composite:
     *     {namespace, model}
     * 
     * Composite Element:
     *     {namespace, model, route, target}
     *     {namespace, model, route, unique, target}
     *
     * namespace: namespace of the composite/model
     *            chain as array without the model or undefined if no chain
     * model:     corresponds to the enclosing composite
     * route:     fully qualified route to the target,
     *            starting with the module, ends with the target
     * unique:    unique identifier
     *            not part of the route and without effect on the logic
     * target:    final target in the chain
     *
     * A validation at object or JavaScript model level does not take place
     * here. The fill levels of the meta-object can be different, depending on
     * the collected data and the resulting derivation. Thus, it is possible to
     * make the theoretical assumptions here by deriving them from the DOM.
     * Especially the namespace of the model is based on these theoretical
     * assumptions.
     * 
     * If no meta information can be determined, e.g. because no IDs were found
     * or no enclosing composite was used, null is returned.
     * 
     * @param  element
     * @return determined meta-object for the passed element, otherwise null
     * @throws An error occurs in the following cases:
     *     - in the case of an invalid composite ID
     *     - in the case of an invalid element ID
     */
    const _mount_locate = (element) => {

        if (!(element instanceof Element))
            return null;

        // A composite stops the determination. Composites are static
        // components, comparable to managed beans or named beans, and therefore
        // normally have no superordinate object levels. But the Composite-ID
        // can contain a namespace, which is then taken into consideration.

        let serial = (element.getAttribute(Composite.ATTRIBUTE_ID) || "").trim();
        if (element.hasAttribute(Composite.ATTRIBUTE_COMPOSITE)) {
            const composite = serial.match(Composite.PATTERN_COMPOSITE_ID);
            if (!composite)
                throw new Error(`Invalid composite id${serial ? ": " + serial : ""}`);
            if (!composite[2])
                return {model:composite[1]};
            return {namespace:composite[2].split(/:+/), model:composite[1]};
        }

        const locate = _mount_locate(element.parentNode);
        if (!element.hasAttribute(Composite.ATTRIBUTE_ID))
            return locate;

        if (!serial.match(Composite.PATTERN_ELEMENT_ID))
            throw new Error(`Invalid element id${serial ? ": " + serial : ""}`);

        const meta = {namespace:[], model:null, route:[], target:null};
        if (locate) {
            if (locate.namespace)
                locate.namespace.push(locate.model);
            else locate.namespace = [locate.model];
            meta.namespace = locate.namespace;
            if (locate.route)
                meta.route.push(...locate.route);
            else meta.route.push(locate.model);
        }

        serial = serial.match(Composite.PATTERN_ELEMENT_ID);
        if (serial[4]) {
            meta.namespace = serial[4].split(/:/);
            meta.route = [meta.namespace[meta.namespace.length -1]];
        }
        meta.route.push(serial[1]);
        if (serial[2])
            meta.route.push(...serial[2].split(/:/));
        if (serial[3])
            meta.unique = serial[3];
        meta.target = meta.route[meta.route.length -1];
        meta.model = meta.namespace.pop();
        if (meta.namespace.length <= 0)
            delete meta.namespace;

        // a model is always required
        return meta.model ? meta : null;
    };

    /**
     * Determines the meta-object for an element based on its position in the
     * DOM, so the surrounding composite and model, the referenced route and
     * target in the model.
     * 
     * Composite:
     *     {meta:{namespace, model}, namespace, model}
     * 
     * Composite Element:
     *     {meta:{namespace, model, route, target}, namespace, model, route, target}
     *
     * The method always requires a corresponding JavaScript object (model) and
     * an element with a valid element ID in a valid enclosing composite,
     * otherwise the method will return null.
     *
     * @param  element
     * @return determined meta-object for the passed element, otherwise null
     * @throws An error occurs in the following cases:
     *     - in the case of an invalid composite ID
     *     - in the case of an invalid element ID
     */
    const _mount_lookup = (element) => {

        const meta = _mount_locate(element);
        if (!meta)
            return null;

        const namespace = Namespace.lookup(...(meta.namespace || []));
        const model = Object.lookup(namespace || window, meta.model)
        if (!model)
            return null;
        if (meta.target === undefined)
            return {meta, namespace, model};

        const lookup = {
            meta,
            namespace,
            model,
            get target() {
                return Object.lookup(this.namespace, ...(this.meta.route || []));
            },
            set target(value) {
                let chain = [this.meta.model];
                if (this.meta.route)
                    chain = this.meta.route;
                const target = chain.pop();
                Object.lookup(this.namespace, ...chain)[target] = value;
            }
        };

        if (!lookup.model
                || lookup.target === undefined)
            return null;
        return lookup;
    };

    /** Associative array of reusable content for rendering */
    const _render_cache = {};

    /**
     * Associative array for element-related meta-objects, those which are
     * created during rendering: (key:serial, value:meta)
     */
    const _render_meta = [];
    Object.defineProperty(Composite.render, "meta", {
        value: _render_meta
    });

    let _serial = 0;
    
    /**
     * Enhancement of the JavaScript API
     * Adds a function for getting the serial ID to the objects.
     */
    compliant("Object.prototype.serial");
    compliant("Object.prototype.ordinal");
    compliant(null, Object.prototype.ordinal = function() {
        if (this.serial === undefined)
            Object.defineProperty(this, "serial", {
                value: ++_serial
            });
        return this.serial;
    });

    /**
     * Enhancement of the JavaScript API
     * Adds a static function to create and use a namespace for an object.
     * Without arguments, the method returns the global namespace window.
     * The method has the following various signatures:
     *     Object.use();
     *     Object.use(string);
     *     Object.use(string, ...string|number);
     *     Object.use(object);
     *     Object.use(object, ...string|number);
     * @param  levels of the namespace
     * @return the created or already existing object(-level)
     * @throws An error occurs in case of invalid data types or syntax 
     */
    compliant("Object.use");
    compliant(null, Object.use = (...levels) =>
        Namespace.use.apply(null, levels));

    /**
     * Enhancement of the JavaScript API
     * Adds a static function to determine an object via the namespace.
     * Without arguments, the method returns the global namespace window.
     * The method has the following various signatures:
     *     Object.lookup();
     *     Object.lookup(string);
     *     Object.lookup(string, ...string|number);
     *     Object.lookup(object);
     *     Object.lookup(object, ...string|number);
     * @param  levels of the namespace
     * @return the determined object(-level)
     * @throws An error occurs in case of invalid data types or syntax
     */
    compliant("Object.lookup");
    compliant(null, Object.lookup = (...levels) =>
        Namespace.lookup.apply(null, levels));

    /**
     * Enhancement of the JavaScript API
     * Adds a static function to check whether an object exists in a namespace.
     * In difference to the namespace function of the same name, qualifiers are
     * also supported in the namespace. The effect is the same. Qualifiers are
     * optional namespace elements at the end that use the colon as a separator.
     * The method has the following various signatures:
     *     Object.exists();
     *     Object.exists(string);
     *     Object.exists(string, ...string|number);
     *     Object.exists(object);
     *     Object.exists(object, ...string|number);
     * @param  levels of the namespace
     * @return true if the namespace exists
     * @throws An error occurs in case of invalid data types or syntax
     */
    compliant("Object.exists");
    compliant(null, Object.exists = (...levels) =>
        Namespace.exists.apply(null, levels));

    /**
     * Enhancement of the JavaScript API
     * Adds a static function to checks that an object is not undefined / null.
     * @param  object
     * @return true is neither undefined nor null
     */
    compliant("Object.usable");
    compliant(null, Object.usable = (object) =>
        object !== undefined && object !== null);

    /**
     * Enhancement of the JavaScript API
     * Implements an own open method for event management.
     * The original method is reused in the background.
     */ 
    const _request_open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...variants) {

        const callback = (event = null) => {
            if (!event)
                return;
            if (event.type === "loadstart")
                event = [Composite.EVENT_HTTP_START, event];
            else if (event.type === "progress")
                event = [Composite.EVENT_HTTP_PROGRESS, event]; 
            else if (event.type === "readystatechange")
                event = [Composite.EVENT_HTTP_RECEIVE, event]; 
            else if (event.type === "load")
                event = [Composite.EVENT_HTTP_LOAD, event]; 
            else if (event.type === "abort")
                event = [Composite.EVENT_HTTP_ABORT, event]; 
            else if (event.type === "error")
                event = [Composite.EVENT_HTTP_ERROR, event];   
            else if (event.type === "timeout")
                event = [Composite.EVENT_HTTP_TIMEOUT, event];   
            else if (event.type === "loadend")
                event = [Composite.EVENT_HTTP_END, event]; 
            else return;
            Composite.fire(...event); 
        };

        if (this.status === XMLHttpRequest.UNSENT) {
            this.addEventListener("loadstart", callback);
            this.addEventListener("progress", callback);
            this.addEventListener("readystatechange", callback);
            this.addEventListener("load", callback);
            this.addEventListener("abort", callback);
            this.addEventListener("error", callback);
            this.addEventListener("timeout", callback);
            this.addEventListener("loadend", callback);
        }

        _request_open.call(this, ...variants);
    };

    // Listener when an error occurs and triggers a matching composite-event.
    window.addEventListener("error", (event) =>
        Composite.fire(Composite.EVENT_ERROR, event));
    
    // MutationObserver detects changes at the DOM and triggers (re)rendering
    // and (re)scanning and prevents manipulation of ATTRIBUTE_COMPOSITE.
    // - Text-Nodes: The TextContent of text nodes with an expression is
    //   protected by the MutationObserver and cannot be manipulated.
    // - The attributes of the renderer (Composite.PATTERN_ATTRIBUTE_ACCEPT)
    //   are protected by the MutationObserver and cannot be manipulated.
    window.addEventListener("load", () => {
    
        // The inverse indicator release shows when an element has been rendered
        // because the renderer removes this attribute. This effect is used for
        // CSS to show elements only in rendered state. A corresponding CSS rule
        // is automatically added to the HEAD when the page is loaded.
        if (document.querySelector("html")) {
            if (!document.querySelector("html head"))
                document.querySelector("html").appendChild(document.createElement("head"));
            const style = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.innerHTML = "*[release] {display:none!important;}";
            document.querySelector("html head").appendChild(style);
        }
        
        // Initially the common-module is loaded.
        // The common-module is similar to an autostart, it is used to
        // initialize the single page application. It consists of common.js and
        // common.css. The configuration of the SiteMap and essential styles
        // can/should be stored here.
        Composite.include("common");

        const _cleanup = (node) => {
            // Clean up all the child elements first.
            if (node.childNodes)
                Array.from(node.childNodes).forEach((node) =>
                    _cleanup(node));

            // Composites and models must be undocked when they are removed from
            // the DOM independent of whether a condition exists. For composites
            // with condition, it must be noted that the composite is initially
            // replaced by a marker. During replacement, the initial composite
            // is removed, which can cause an unwanted undocking. The logic is
            // based on the assumption that each composite has a meta-object.
            // When replacing a composite, the corresponding meta-object is also
            // deleted, so that the MutationObserver detects the composite to be
            // removed in the DOM, but undocking is not performed without the
            // matching meta-object.

            const serial = node.ordinal();
            const object = _render_meta[serial];
            if (object && object.attributes.hasOwnProperty(Composite.ATTRIBUTE_COMPOSITE)) {
                const meta = _mount_lookup(node);
                if (meta && meta.meta && meta.meta.model && meta.model) {
                    const model = (meta.meta.namespace || []).concat(meta.meta.model).join(".");
                    if (_models.has(model)) {
                        _models.delete(model);
                        if (typeof meta.model.undock === "function") {
                            meta.model.undock.call(meta.model);
                            Composite.fire(Composite.EVENT_MODULE_UNDOCK, meta);
                        }
                    }
                }
            }

            // meta-object assigned to the element must be deleted, because it
            // is an indicator for existence and presence of composites/models
            delete _render_meta[node.ordinal()];
        };

        (new MutationObserver((records) => {
            records.forEach((record) => {

                // HTML uses attributes whose pure presences have effects:
                //     autofocus, disabled, hidden, multiple, readonly, required
                // With the expression language the setting and removing of
                // these attributes is not possible. This task is taken over by
                // the MutationObserver. It reacts to the values true and false
                // for the present attributes and removes the attribute from the
                // HTML element in case of false.

                if (record.type === "attributes") {
                    const attribute = record.attributeName;
                    if (attribute.match(/^(autofocus|disabled|hidden|multiple|readonly|required)$/i)) {
                        const value = String(record.target.getAttribute(attribute));
                        if (value === "false")
                            record.target.removeAttribute(attribute)
                        if (value === "true")
                            record.target.setAttribute(attribute, attribute);
                    }
                }

                // Without Meta-Store, the renderer hasn't run yet. The reaction
                // by the MutationObserver only makes sense when the renderer
                // has run initially.
                if (!_render_meta.length)
                    return;

                const serial = record.target.ordinal();
                const object = _render_meta[serial];
                
                // Text changes are only monitored at text nodes with expression.
                // Manipulations are corrected/restored.
                if (record.type === "characterData"
                        && record.target.nodeType === Node.TEXT_NODE) {
                    if (object && object.hasOwnProperty(Composite.ATTRIBUTE_VALUE)) {
                        const value = object.value === undefined ? "" : String(object.value);
                        if (value !== record.target.textContent)
                            record.target.textContent = value;
                    }
                    return;
                }
                
                // Changes at the renderer-specific and static attributes are
                // monitored. Manipulations are corrected/restored.
                if (object && record.type === "attributes") {
                    const attribute = (record.attributeName || "").toLowerCase().trim();
                    if (attribute.match(Composite.PATTERN_ATTRIBUTE_ACCEPT)
                            && !attribute.match(Composite.PATTERN_ATTRIBUTE_STATIC)) {
                        // Composite internal non-static attributes are managed
                        // by the renderer and are removed.
                        if (record.target.hasAttribute(attribute))
                            record.target.removeAttribute(attribute);
                    } else if (attribute.match(Composite.PATTERN_ATTRIBUTE_STATIC)) {
                        if (!object.attributes.hasOwnProperty(attribute)) {
                            // If the renderer has not registered an initial
                            // value, the assumption is that the attribute was
                            // subsequently added and is therefore removed.
                            if (record.target.hasAttribute(attribute))
                                record.target.removeAttribute(attribute);
                        } else {
                            // If the attribute was removed or the value was
                            // changed, the initial value is restored that was
                            // previously determined by the renderer.
                            if (!record.target.hasAttribute(attribute)
                                    || object.attributes[attribute] !== record.target.getAttribute(attribute))
                                record.target.setAttribute(attribute, object.attributes[attribute]);
                        }
                    } else if (_statics.has(attribute)) {
                        object.statics = object.statics || {};
                        if (!object.statics.hasOwnProperty(attribute)) {
                            // If the renderer has not registered an initial
                            // value, the assumption is that the attribute was
                            // subsequently added and is therefore removed.
                            if (record.target.hasAttribute(attribute))
                                record.target.removeAttribute(attribute);
                        } else {
                            // If the attribute was removed or the value was
                            // changed, the initial value is restored that was
                            // previously determined by the renderer.
                            if (!record.target.hasAttribute(attribute)
                                    || object.statics[attribute] !== record.target.getAttribute(attribute))
                                record.target.setAttribute(attribute, object.statics[attribute]);
                        }
                    }
                }
                
                // Theoretically, the target object may be unknown by the
                // renderer, but normally the mutation observer reacts to the
                // parent element when inserting new elements. Therefore, this
                // case was not implemented.
                
                // All new inserted elements are rendered if they are unknown for
                // the renderer. It is important that the new nodes are also
                // contained in the body. This is not always the case, e.g. when
                // recursive rendering replaces elements. So an include can load
                // data with a condition. Nodes are created per include, which
                // are then replaced by a marker in the case of a condition. The
                // MutationObserver does not run parallel, so it is called after
                // the rendering with obsolete nodes.
                (record.addedNodes || []).forEach((node) => {
                    if ((node instanceof Element
                            || (node instanceof Node
                                    && node.nodeType === Node.TEXT_NODE))
                            && !_render_meta[node.ordinal()]
                            && document.body.contains(node))
                        Composite.render(node);
                });

                // All removed elements are cleaned and if necessary the undock
                // method is called if a view model binding exists.
                (record.removedNodes || []).forEach((node) =>
                    _cleanup(node));
            });
        })).observe(document.body, {childList:true, subtree:true, attributes:true, attributeOldValue:true, characterData:true});

        Composite.render(document.body);
    });
})();