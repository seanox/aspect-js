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
 * The ReactProxy works permanently recursively on all objects, in all levels of a
 * model and also on the objects that are added later as values, even if these
 * objects do not explicitly use the ReactProxy.
 *
 * @author  Seanox Software Solutions
 * @version 1.0.1 20230109
 */
if (typeof ReactProxy === "undefined") {

    window["ReactProxy"] = {

        selector: null,

        create(target) {
            return target.toReactProxy();
        }
    };

    Composite.listen(Composite.EVENT_RENDER_START, function(event, selector) {
        ReactProxy.selector = selector;
    });

    Composite.listen(Composite.EVENT_RENDER_NEXT, function(event, selector) {
        ReactProxy.selector = selector;
    });

    Composite.listen(Composite.EVENT_RENDER_END, function(event, selector) {
        ReactProxy.selector = null;
    });

    /**
     * Enhancement of the JavaScript API
     * Adds a function to create a ReactProxy from the object instance.
     * If it is a ReactProxy, the reference of the instance is returned.
     */
    if (Object.prototype.toReactProxy === undefined) {
        Object.prototype.toReactProxy = function() {

            if (typeof this !== "object")
                throw new TypeError("Not supported data type: " + typeof this);

            if (Array.isArray(this))
                return this.map(entry => typeof entry === "object"
                        && entry !== null ? entry.toReactProxy() : entry);

            const target = Object.assign({}, this);
            for (const key in target) {
                const value = target[key];
                if (typeof value === "object"
                        && value !== null)
                    target[key] = target[key].toReactProxy();
            }

            const proxy = new Proxy(target, {

                notifications: new Map(),

                get(target, key) {
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

                            let recipients = notifications.get(key) || new Map();

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

                        }, ReactProxy.selector, target, key, this.notifications);
                    }
                },

                set(target, key, value) {

                    if (typeof value === "object"
                            && value !== null)
                        value = value.toReactProxy();

                    try {return target[key] = value;
                    } finally {

                        // The registration is delayed so that the setting of
                        // values does not block unnecessarily.
                        Composite.asynchron((selector, target, key, notifications) => {

                            // An update of the recipients is only performed
                            // outside the rendering and if the key exists in
                            // the object.
                            if (ReactProxy.selector !== null
                                    || !target.hasOwnProperty(key))
                                return;

                            let recipients = this.notifications.get(key) || new Map();
                            for (const recipient of recipients.values()) {
                                // If the recipient is no longer included in the
                                // DOM and so it can be removed this case.
                                if (!document.body.contains(recipient))
                                    recipients.delete(recipient.ordinal());
                                else Composite.render(recipient);
                            }

                        }, ReactProxy.selector, target, key, this.notifications);
                    }
                }
            });

            // Prevents a new ReactProxy from being created by a ReactProxy.
            // This is possible, but the impact is not considered so far. So
            // the creation is done here and not in ReactProxy.create(Object).
            // This way both places are caught.
            proxy.toReactProxy = () => {
                return proxy;
            };

            const origin = this;
            proxy.toObject = () => {
                return origin;
            };

            return proxy;
        };
    }
}