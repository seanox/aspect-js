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
 *
 * @author  Seanox Software Solutions
 * @version 0.0.0 2022xxxx
 */
if (typeof ReactProxy === "undefined") {

    window["ReactProxy"] = {};

    ReactProxy.selector = null;

    ReactProxy.create = function(target) {
        const proxy = new Proxy(target, {
            notifications: new Map(),
            get(target, key) {
                try {return target[key] ?? undefined;
                } finally {
                    // Registration as an anonymous function, so that more
                    // convenient return can be used.
                    (() => {
                        const selector = ReactProxy.selector;
                        if (selector === null
                                || !target.hasOwnProperty(key))
                            return;
                        let recipients = this.notifications.get(key) || new Map();
                        // If the current element is already registered as a
                        // recipient, the registration can be canceled.
                        if (recipients.has(selector.ordinal()))
                            return;
                        for (const recipient of recipients.values()) {
                            // If the parent is already contained by the current
                            // element, the element can be ignored as a receiver
                            // because the rendering is initiated at the parent and
                            // the element is automatically rendered as a child.
                            if (recipient.contains !== undefined
                                    && recipient.contains(selector))
                                return;
                            // If the current element contains the recipient element
                            // as parent, the recipient element can be removed,
                            // because the current element will initiate rendering
                            // as parent in the future and the element will be
                            // rendered as child automatically.
                            // Or the receiver element is no longer included in the
                            // DOM, in which case it can be removed.
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
                    try {
                        // TODO:
                        // - Get the recipient list from the map (by field/key)
                        // - Remove recipients, when the element is no longer in the DOM
                        // - Initiate rerender (composite)
                    } catch (error) {
                        // Reactive behavior is optional and ignores errors
                    }
                }
            }
        });
        return proxy;
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
            return ReactProxy.create(this);
        }
    }
}