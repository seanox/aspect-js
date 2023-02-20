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
 * The ReactProxy works permanently recursively on all objects, in all levels of
 * a model and also on the objects that are added later as values, even if these
 * objects do not explicitly use the ReactProxy.
 *
 * @author  Seanox Software Solutions
 * @version 1.6.0 20230220
 */
compliant("ReactProxy");
compliant(null, window.ReactProxy = {
    create(target) {
        return target.toReactProxy();
    }
});

{
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

    const _secret = "\0" + Math.unique();

    /**
     * Enhancement of the JavaScript API
     * Adds a function to create a ReactProxy from the object instance.
     * If it is a ReactProxy, the reference of the instance is returned.
     */
    compliant("Object.prototype.toReactProxy");
    compliant(null, Object.prototype.toReactProxy = function() {

        const reactive = (object, parent, filter) => {

            if (typeof object !== "object")
                throw new TypeError("Not supported data type: " + typeof object);

            if (typeof object[_secret] === "object")
                object = object[_secret];

            const proxy = new Proxy(object, {

                notifications: new Map(),

                cache: new Map(),

                get(target, key) {

                    // Proxy is implemented exotically, cannot be inherited and
                    // has no prototype. Therefore, this unconventional way with
                    // a secret simulated property that is used as an indicator
                    // for existing ReacProxy instances and also contains a
                    // reference to the original object.

                    // https://stackoverflow.com/questions/37714787/can-i-extend-proxy-with-an-es2015-class

                    if (key === _secret)
                        return target;

                    try {return target[key];
                    } finally {

                        // The registration is delayed so that the getting of
                        // values does not block unnecessarily.
                        Composite.asynchron((selector, target, key, notifications) => {

                            // Registration is performed only during rendering
                            // and if the key exists in the object.
                            if (selector === null
                                    || !target.hasOwnProperty(key))
                                return;

                            // Special for elements with attribute iterate. For
                            // these, the highest parent element with the
                            // attribute iterate is searched for and registered
                            // as the recipient. Why -- Iterate provides
                            // temporary variables which can be used in the
                            // enclosed markup. If these places are registered
                            // as recipients, these temporary variables cannot
                            // be accessed later in the expressions, which
                            // causes errors because the temporary variables no
                            // longer exist. Since element with the attribute
                            // iterate can be nested and the expression can be
                            // based on a parent one, the topmost one is
                            // searched for.

                            for (let node = selector; node.parentNode; node = node.parentNode) {
                                const meta = (Composite.render.meta || [])[node.ordinal()] || {};
                                if (meta.attributes && meta.attributes.hasOwnProperty(Composite.ATTRIBUTE_ITERATE))
                                    selector = node;
                            }

                            const recipients = notifications.get(key) || new Map();

                            // If the selector as the current rendered element
                            // is already registered as a recipient, then the
                            // registration can be canceled.
                            if (recipients.has(selector.ordinal()))
                                return;

                            for (const recipient of recipients.values()) {

                                // If the selector as the current rendered
                                // element is already contained in a recipient
                                // as the parent, the selector as a recipient
                                // can be ignored, because the rendering is
                                // initiated by the parent and includes the
                                // selector as a child.
                                if (recipient.contains !== undefined
                                        && recipient.contains(selector))
                                    return;

                                // If the selector as current rendered element
                                // contains a recipient as parent, the recipient
                                // can be removed, because the selector element
                                // will initiate rendering as parent in the
                                // future and the existing recipient will be
                                // rendered as child automatically.
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

                    if (typeof value === "object"
                            && value !== null)
                        value = reactive(value, parent, filter);

                    try {return target[key] = value;
                    } finally {

                        if (this.cache.get(key) === value)
                            return;
                        this.cache.set(key, value);

                        // The registration is delayed so that the setting of
                        // values does not block unnecessarily.
                        Composite.asynchron((selector, target, key, notifications) => {

                            // An update of the recipients is only performed
                            // outside the rendering and if the key exists in
                            // the object.
                            if (_selector !== null
                                    || !target.hasOwnProperty(key))
                                return;

                            const recipients = this.notifications.get(key) || new Map();
                            for (const recipient of recipients.values()) {
                                // If the recipient is no longer included in the
                                // DOM and so it can be removed this case.
                                if (!document.body.contains(recipient))
                                    recipients.delete(recipient.ordinal());
                                else Composite.render(recipient);
                            }

                        }, _selector, target, key, this.notifications);
                    }
                }
            });

            // Prevents creating a ReactProxy from an existing one. This is
            // possible in principle, but the impact of existing references to
            // have not been considered to the end. Therefore, ReactProxy is
            // created here and not in ReactProxy.prototype.toReactProxy. This
            // way both places are caught.
            proxy.toReactProxy = () => {
                return proxy;
            };

            proxy.toObject = () => {
                return object;
            };

            // The filter prevents endless recursions that can occur during
            // recursive scanning from the object tree.

            filter = filter || [];
            filter.push(object);
            filter.push(proxy);

            // For ReactProxy instances, the read-only property parent is
            // automatically added at each object level if an object level does
            // not already have one with the same name. This property supports
            // access to parent object levels.

            if (typeof parent === "object") {
                filter.push(parent);
                if (typeof proxy.parent === "undefined")
                    Object.defineProperty(proxy, "parent", {
                        value: parent
                    });
            }

            for (const key in proxy) {
                let value = proxy[key];
                if (typeof value !== "object"
                        || value === null
                        || filter.includes(value))
                    continue;
                if (typeof value[_secret] === "object")
                    value = value[_secret];
                proxy[key] = reactive(value, object, filter);
            }

            return proxy;
        };

        return reactive(this);
    });
}