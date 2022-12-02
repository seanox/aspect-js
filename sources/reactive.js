/**
 * LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 * im Folgenden Seanox Software Solutions oder kurz Seanox genannt.
 * Diese Software unterliegt der Version 2 der Apache License.
 *
 * Seanox aspect-js, Fullstack JavaScript UI Framework
 * Copyright (C) 2022 Seanox Software Solutions
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
 *
 *     DESCRIPTION
 *     ----
 * TODO
 * The Reactive approach is implemented as an optional module and uses the
 * available API.
 * TODO
 *
 * @author  Seanox Software Solutions
 * @version 0.0.0 2022xxxx
 */
if (typeof ReactProxy === "undefined") {

    window["ReactProxy"] = {};

    ReactProxy.selector = null;

    ReactProxy.create = function(target) {
        return target.toReactProxy();
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
            const proxy = new Proxy(this, {

                notifications: new Map(),

                get(target, key) {
                    try {return target[key] ?? undefined;
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

                        }, ReactProxy.selector, target, key, this.notifications)
                    }
                },

                set(target, key, value) {

                    if (!(key in target))
                        return false;

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

            return proxy;
        }
    }
}