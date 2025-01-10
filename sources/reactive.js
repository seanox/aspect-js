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
 * A reactivity system or here called reactivity rendering is a mechanism which
 * automatically keeps in sync a data source (model) with a data representation
 * (view) layer. Every time the model changes, the view is partially
 * re-rendered to reflect the changes.
 *
 * The mechanism is based on notifications that arise from setting and getting
 * from the model as a data source. Which is supported by the proxy object in
 * JavaScript and its events can then be used to determine which elements/nodes
 * in the DOM consume what data from the model and need to be updated when
 * changes are made.
 *
 * Reactivity rendering is implemented as an optional module and uses the
 * available API.
 *
 * Reactive works permanently recursively on all objects, in all levels of a
 * model and also on the objects that are added later as values, even if these
 * objects do not explicitly use the Reactive.
 *
 * Object and model are decoupled by Reactive. The implementation uses free
 * (unbound) proxies for this purpose. These proxies reference an object but are
 * not bound to an object level in the object tree and they synchronize the data
 * bidirectionally. Managed these proxies are managed with a weak map where the
 * object is the key and the garbage collection can dispose of this objects with
 * associated proxies when not in use.
 */
(() => {

    compliant("Reactive");
    compliant(null, window.Reactive = (object) => {
        if (object == null
                || typeof object !== "object")
            throw new TypeError("Invalid object type");
        return _reactive(object);
    });

    let _selector = null;
    Composite.listen(Composite.EVENT_RENDER_START, (event, selector) =>
        _selector = selector);
    Composite.listen(Composite.EVENT_RENDER_NEXT, (event, selector) =>
        _selector = selector);
    Composite.listen(Composite.EVENT_RENDER_END, (event, selector) =>
        _selector = null);

    let _selector_cache = null;
    Composite.listen(Composite.EVENT_MODULE_DOCK, (event, selector) => {
        _selector_cache = _selector;
        _selector = null;
    });
    Composite.listen(Composite.EVENT_MODULE_READY, (event, selector) => {
        _selector = _selector_cache;
        _selector_cache = null;
    });

    /**
     * Enhancement of the JavaScript API
     * Adds a function to create a reactive object to an object instance. If it
     * is already a reactive object, the reference of the instance is returned.
     */
    compliant("Object.prototype.reactive");
    compliant(null, Object.prototype.reactive = function() {
        return _reactive(this);
    });

    /**
     * Proxy is implemented exotically, cannot be inherited and has no
     * prototype. Therefore, this unconventional way with a secret simulated
     * property that is used as an indicator for existing reactive objects
     * instances. The value is not programmatically constant, instead it is
     * defined with the start of the application.
     * https://stackoverflow.com/questions/37714787/can-i-extend-proxy-with-an-es2015-class
     */
    const TARGET = Math.serial();

    /**
     * Weak map with the assignment of objects to proxies. The object is the key
     * and the proxy is the value. A feature of WeakMap is that when the key is
     * purged from the garbage collection, the value and thus the proxy is also
     * purged. Thus, this should be an efficient way to manage unbound proxies.
     */
    const _register = new WeakMap();

    const _reactive = (object) => {

        if (typeof object !== "object"
                || object === null)
            return object;

        // Proxy remains proxy
        if (object[TARGET] !== undefined)
            return object;

        // For all objects, a proxy must be created. Also for proxies, even if
        // proxy in proxy is prevented. Not internally, so it works recursively.
        // Endless loops are prevented with the register.

        if (_register.has(object))
            return _register.get(object);

        const proxy = new Proxy(object, {

            notifications: new Map(),

            cache: new Map(),

            get(target, key) {

                try {

                    // Proxy is implemented exotically, cannot be inherited and
                    // has no prototype. Therefore, this unconventional way with
                    // a secret simulated property that is used as an indicator
                    // for existing reactive object instances and also contains
                    // a reference to the original object.
                    if (key === TARGET)
                        return target;

                    let value;

                    // During analysis, getters must be invoked via the proxy to
                    // identify the final targets behind the getter.
                    if (_selector) {
                        const descriptor = Object.getOwnPropertyDescriptor(target, key);
                        if (descriptor && typeof descriptor.get === "function")
                            value = descriptor.get.call(proxy);
                        else value = target[key];
                    } else value = target[key];

                    // Proxies are only used for objects, other data types are
                    // returned directly.
                    if (typeof value !== "object"
                            || value === null
                            || value instanceof Node
                            || value instanceof NodeList
                            || value instanceof HTMLCollection)
                        return value;

                    // Proxy remains proxy
                    if (value[TARGET] !== undefined)
                        return value;

                    // A proxy always returns proxies for objects. To decouple
                    // object, proxy and view and to avoid reference to object
                    // tree/level, loose proxies are used. The mapping is based
                    // only on objects not on object level via the register.
                    if (_register.has(value))
                        return _register.get(value)
                    return _reactive(value);

                    // To be economical with resources, proxies are not created
                    // for objects immediately, but only when they are requested
                    // via getter. Therefore, the properties for an object are
                    // not analyzed recursively.

                } finally {

                    // The registration is delayed so that the getting of values
                    // does not block unnecessarily.
                    Composite.asynchron((selector, target, key, notifications) => {

                        // Registration is performed only during rendering and
                        // if the key exists in the object.
                        if (selector === null
                                || !target.hasOwnProperty(key))
                            return;

                        // Special for elements with attribute iterate. For
                        // these, the highest parent element with the attribute
                        // iterate is searched for and registered as the
                        // recipient. Why -- Iterate provides temporary
                        // variables which can be used in the enclosed markup.
                        // If these places are registered as recipients, these
                        // temporary variables cannot be accessed later in the
                        // expressions, which causes errors because the
                        // temporary variables no longer exist. Since element
                        // with the attribute iterate can be nested and the
                        // expression can be based on a parent one, the topmost
                        // one is searched for.

                        for (let node = selector; node.parentNode; node = node.parentNode) {
                            const meta = (Composite.render.meta || [])[node.ordinal()] || {};
                            if (meta.attributes && meta.attributes.hasOwnProperty(Composite.ATTRIBUTE_ITERATE))
                                selector = node;
                        }

                        const recipients = notifications.get(key) || new Map();

                        // If the selector as the current rendered element is
                        // already registered as a recipient, then the
                        // registration can be canceled.
                        if (recipients.has(selector.ordinal()))
                            return;

                        for (const recipient of recipients.values()) {

                            // If the selector as the current rendered element
                            // is already contained in a recipient as the
                            // parent, the selector as a recipient can be
                            // ignored, because the rendering is initiated by
                            // the parent and includes the selector as a child.
                            if (recipient.contains !== undefined
                                    && recipient.contains(selector))
                                return;

                            // If the selector as current rendered element
                            // contains a recipient as parent, the recipient can
                            // be removed, because the selector element will
                            // initiate rendering as parent in the future and
                            // the existing recipient will be rendered as child
                            // automatically.
                            if (selector.contains !== undefined
                                    && selector.contains(recipient))
                                recipients.delete(recipient.ordinal());
                        }

                        recipients.set(selector.ordinal(), selector);
                        notifications.set(key, recipients);

                    }, _selector, target, key, this.notifications);
                }
            },

            set(target, key, value) {

                // Proxy is implemented exotically, cannot be inherited and has
                // no prototype. Therefore, this unconventional way with a
                // secret simulated property that is used as an indicator for
                // existing reactive object instances and also contains a
                // reference to the original object and that can't be changed.
                if (key === TARGET)
                    return target;

                // To decouple object, proxy and view, the original objects are
                // always used as value and never the proxies.
                if (typeof value === "object"
                        && value !== null
                        && value[TARGET] !== undefined)
                    value = value[TARGET];

                // To be economical with resources, proxies are not created for
                // objects immediately, but only when they are explicitly
                // requested via getter.

                try {return target[key] = value;
                } finally {

                    // Unwanted recursions due to repeated value assignments:
                    // a = a / a = c = b = a must be avoided so that no infinite
                    // render cycle is initiated.
                    if (this.cache.get(key) === value)
                        return;
                    this.cache.set(key, value);

                    // The registration is delayed so that the setting of values
                    // does not block unnecessarily.
                    Composite.asynchron((selector, target, key, notifications) => {

                        // Update only if the key exists in the object.
                        // Recursions during rendering are prevented via the
                        // queue and the lock in during rendering.
                        if (!target.hasOwnProperty(key))
                            return;

                        const recipients = this.notifications.get(key) || new Map();
                        for (const recipient of recipients.values()) {
                            // If the recipient is no longer included in the DOM
                            // and so it can be removed this case.
                            if (!document.body.contains(recipient))
                                recipients.delete(recipient.ordinal());
                            else Composite.render(recipient);
                        }

                    }, _selector, target, key, this.notifications);
                }
            }
        });

        // On the one hand, the register manages the unbound proxies, on the
        // other hand, it protects against endless recursions.
        _register.set(object, proxy);

        return proxy;
    };
})();