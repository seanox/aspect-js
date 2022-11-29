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
                        // Registration as an anonymous function, so that more
                        // convenient return can be used.
                        (() => {
                            // Registration is performed only during rendering
                            // and if the key exists in the object.
                            const selector = ReactProxy.selector;
                            if (selector === null
                                    || !target.hasOwnProperty(key))
                                return;
                            let recipients = this.notifications.get(key) || new Map();
                            // If the selector as the current rendered element
                            // is already registered as a recipient, then the
                            // registration can be canceled.
                            if (recipients.has(selector.ordinal()))
                                return;
                            for (const recipient of recipients.values()) {
                                // If the selector as the current rendered
                                // element is already contained in a recipient
                                // as the parent, the selector as a recipient
                                // because the rendering is initiated by the
                                // parent and includes the selector as a child.
                                if (recipient.contains !== undefined
                                        && recipient.contains(selector))
                                    return;
                                // If the selector as current rendered element
                                // contains a recipient as parent, the recipient
                                // can be removed, because the selector element
                                // will initiate rendering as parent in the
                                // future and the existing recipient will be
                                // rendered as child automatically.
                                // Or the recipient is no longer included in the
                                // DOM and so it can be removed this case
                                if ((selector.contains !== undefined
                                                && selector.contains(recipient))
                                        || !document.body.contains(recipient))
                                    recipients.delete(recipient.ordinal());
                            }
                            recipients.set(selector.ordinal(), selector);
                            this.notifications.set(key, recipients);
                        })();
                    }
                },
                set(target, key, value) {
                    if (!(key in target))
                        return false;
                    try {return target[key] = value;
                    } finally {
                        // Update as an anonymous function, so that more
                        // convenient return can be used.
                        (() => {
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

                                // TODO:
                                // - Text nodes are not yet considered
                                // - Registration should run asynchronously
                                // - Update of the recipients should run asynchronously
                            }
                        })();
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