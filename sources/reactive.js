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
 * JavaScript. These events can be used to determine which elements/nodes in the
 * DOM consume which data from the model and need to be refreshed when changes
 * occur.
 *
 * Reactivity rendering is implemented as an optional module and uses the
 * available API.
 *
 * Reactive works permanently recursively on all objects, in all levels of a
 * model and also on the objects that are added later as values, even if these
 * objects do not explicitly use the Reactive.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 20230223
 */
(() => {

    compliant("Reactive");
    compliant(null, window.Reactive = {
        create(target) {
            return target.reactive();
        }
    });

    let _selector = null;

    Composite.listen(Composite.EVENT_RENDER_START, (event, selector) => {
        _selector = selector;
    });

    Composite.listen(Composite.EVENT_RENDER_NEXT, (event, selector) => {
        _selector = selector;
    });

    Composite.listen(Composite.EVENT_RENDER_END, (event, selector) => {
        _selector = null;
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

    // Proxy is implemented exotically, cannot be inherited and has no
    // prototype. Therefore, this unconventional way with a secret simulated
    // property that is used as an indicator for existing reactive object
    // instances and also contains a reference to the original object.
    // https://stackoverflow.com/questions/37714787/can-i-extend-proxy-with-an-es2015-class
    const _secret = Math.serial();

    const _reactive = (object, parent, register) => {

        if (typeof object !== "object")
            throw new TypeError("Not supported data type: " + typeof object);

        // If for a proxy object the parents match, proxy must already exist in
        // the proper place in the object tree.
        if (typeof object[_secret] === "object"
                && object[_secret].parent === parent)
            return object;

        // For all other objects, a proxy must be created. Also for proxies,
        // even if proxy in proxy is prevented. Not internally, so it works
        // recursively. Endless loops are prevented with the register.

        if (register.has(object))
            return register.get(object);

        const proxy = new Proxy(object, {

            meta: {parent:null, target:null},

            notifications: new Map(),

            cache: new Map(),

            defineProperty(target, key, descriptor) {
            },

            set(target, key, value) {
            },

            get(target, key) {
            },

            deleteProperty(target, property) {
            }
        });

        // The register prevents endless recursions that can occur during
        // recursive scanning from the object tree.
        register = register || new Map();
        register.set(object, proxy)

        for (const key in proxy) {
            let value = proxy[key];
            if (typeof value === "object"
                    && value !== null
                    && !filter.includes(value))
                proxy[key] = _reactive(value, object, register);
        }

        return proxy;
    };
})();