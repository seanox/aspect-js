/**
 * LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 * im Folgenden Seanox Software Solutions oder kurz Seanox genannt.
 * Diese Software unterliegt der Version 2 der Apache License.
 *
 * Seanox aspect-js, Fullstack JavaScript UI Framework
 * Copyright (C) 2021 Seanox Software Solutions
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
 * Test is a simple API and module to implement and execute integration tests.
 * The tests can be implemented as suites, scenarios and test cases.
 * 
 * 
 *     Case
 *     ----
 * The smallest and simplest element in an integration test, used here as
 * task, because case is a keyword. It can be implemented alone, but is always
 * used in a scenario.
 * 
 * Test.create({test() {
 *     Assert.assertTrue(true);
 * }});
 * 
 * Test.start();
 * 
 * 
 *     Scenario
 *     ----
 * A scenario is a sequence of a lot of test cases usually in one file.
 * 
 * Test.create({test() {
 *     Assert.assertTrue(true);
 * }});
 * 
 * Test.create({name:"example", timeout:1000, test() {
 *     Assert.assertTrue(true);
 * }});
 * 
 * Test.create({error:Error test() {
 *     throw new Error();
 * }});
 * 
 * Test.create({error:/^My Error/i, test() {
 *     throw new Error("My Error");
 * }});
 * 
 * Test.create({ignore:true, test() {
 *     Assert.assertTrue(true);
 * }});
 * 
 * Test.start();
 * 
 * 
 *     Suite
 *     ----
 * A suite is a complex bundle of different test cases, scenarios and other
 * suites. Usually a suite consists of different files, which then represent a
 * complex test. An example of a good suite is a cascade of different files, if
 * the test can be started in any file and place. This makes it possible to
 * perform the integration test on different levels and with different
 * complexity.
 * 
 *     
 *     Assert
 *     ----
 * The test cases are implemented with assertions. The test module provides
 * elementary assertions, you can implement more. The function is simple. If an
 * assertion was not true, an error is thrown -- see as an example the
 * implementation here. 
 *
 * @author  Seanox Software Solutions
 * @version 1.1.2 20210523
 */
if (typeof Test === "undefined") {

    /**
     * Static component for creating and executing tests.
     * The component provides static functions and objects for implementing
     * integration tests.
     * 
     * The Test API is part of aspect-js but has to be activated deliberately,
     * otherwise it is not available.
     * 
     *     Test.activate();
     * 
     * This is necessary so that some enhancements to the JavaScript API that
     * are helpful for implementing test are not used productively.
     * For example, the redirection and caching of console output.
     */
    window["Test"] = {
            
        /** Pattern for all accepted events */
        get PATTERN_EVENT() {return /^[a-z]+$/;},
        
        /** Constants of events */    
        get EVENT_FINISH() {return "finish";},
        get EVENT_INTERRUPT() {return "interrupt";},
        get EVENT_PERFORM() {return "perform";},
        get EVENT_RESPONSE() {return "response";},
        get EVENT_RESUME() {return "resume";},
        get EVENT_START() {return "start";},
        get EVENT_SUSPEND() {return "suspend";}
    };
    
    /** 
     * Activates the test API.
     * The method can be called multiple times, but is ignored after the first
     * call. A later deactivation of the test API is not possible.
     */
    Test.activate = function() {
        
        if (Test.activate.lock !== undefined)
            return;

        /** 
         * Test.activate.lock
         *     Lock with the activation of the test API.
         *     The flag cannot be revoked at runtime.    
         */
        Object.defineProperty(Test.activate, "lock", {
            value: true
        });

        /** 
         * Test.stack
         *     Stack of created/registered test tasks (backlog)
         */
        Object.defineProperty(Test, "stack", {
            value: new Set()
        }); 

        /** 
         * Test.listeners
         *     Map with events and their registered listeners
         */
        Object.defineProperty(Test, "listeners", {
            value: new Map()
        }); 

        /**
         * Registers a callback function for test events.
         * @param  event    see Test.EVENT_***
         * @param  callback callback function
         * @throws An error occurs in the following cases:
         *     - event is not valid or is not supported
         *     - callback function is not implemented correctly or does not exist
         */
        Test.listen = function(event, callback) {
            
            if (typeof event !== "string")
                throw new TypeError("Invalid event: " + typeof event);
            if (typeof callback !== "function"
                    && callback !== null
                    && callback !== undefined)
                throw new TypeError("Invalid callback: " + typeof callback);        
            if (!event.match(Test.PATTERN_EVENT))
                throw new Error("Invalid event" + (event.trim() ? ": " + event : ""));
            
            event = event.toLowerCase();
            if (!Test.listeners.has(event)
                    && !Array.isArray(Test.listeners.get(event)))
                Test.listeners.set(event, []);
            Test.listeners.get(event).push(callback);
        };  
        
        /**
         * Internal method to trigger an event.
         * All callback functions for this event are called.
         * If the script is in a frame, at the parent object it will also try
         * to trigger this method. The parent object is always triggered after
         * the current object. If an error occurs when calling the current
         * object, the parent object is not triggered.
         * @param event  see Test.EVENT_***
         * @param status meta object with information about the test execution
         */
        Test.fire = function(event, status) {
            
            if (typeof Test.worker === "object")
                Test.worker.status = event;

            const invoke = (context, event, status) => {
                if (typeof context.Test.worker === "object"
                        && typeof context.Test.worker.monitor === "object"
                        && typeof context.Test.worker.monitor[event] === "function")
                try {context.Test.worker.monitor[event](status);
                } catch (error) {
                    console.error(error);
                }        
                
                event = (event || "").trim();
                if (context.Test.listeners.size <= 0
                        || !event)
                    return;
                const listeners = context.Test.listeners.get(event.toLowerCase());
                if (!Array.isArray(listeners))
                    return;
                listeners.forEach((callback) => {
                    callback(event, status);
                });                  
            };
            
            invoke(window, event, status);
            if (parent && parent !== window)
                try {invoke(parent, event, status);
                } catch (exception) {
                }
        };    
        
        /**
         * Creates and registers a test task.
         * A test task is a function or object with the required meta information
         * for performing and a test method to be executed.
         * 
         *     structure of meta: {name:..., test:..., timeout:..., expected:..., ignore:...}
         *     
         * meta.name       optional name of the test task
         * meta.test       an implemented method to be executed as a test
         * meta.timeout    maximum runtime of the test task in milliseconds
         *                 Exceeding this limit will cause the test to fail.
         *                 A value greater than 0 is expected, otherwise the
         *                 timeout is ignored.
         * meta.expected   if you want to test for the occurrence of an error
         *                 The error must occur if the test is successful.
         *                 An error object or a RegExp is expected as value.
         * meta.ignore     true, if the test is to be ignored
         * 
         *     usage:
         *     
         * Test.create({test() {
         *     Assert.assertTrue(true);
         * }});
         * 
         * Test.create({name:"example", timeout:1000, test() {
         *     Assert.assertTrue(true);
         * }});
         * 
         * Test.create({error:Error test() {
         *     throw new Error();
         * }});
         * 
         * Test.create({error:/^My Error/i, test() {
         *     throw new Error("My Error");
         * }});
         * 
         * Test.create({ignore:true, test() {
         *     Assert.assertTrue(true);
         * }});
         * 
         * @param meta
         */
        Test.create = function(meta) {
            
            if (typeof meta !== "object"
                    || typeof meta.test !== "function")
                return;
            
            if (meta.ignore !== undefined
                    && meta.ignore === true)
                return;
            
            if (Test.stack.has(meta))
                return;
            
            Test.stack.add(meta);
            const stack = Array.from(Test.stack);
            Object.defineProperty(meta, "serial", {
                value: Math.max(stack.length, stack.length > 1 ? stack[stack.length -2].serial +1: 1)
            });       
        };

        /**
         * Starts the test run.
         * The execution of the tests can optionally be configured with the
         * start by passing a meta object. The parameters in the meta object
         * are optional and cannot be changed at test runtime. Only with the
         * next start can new parameters be passed as meta objects.
         * 
         *     Test.start({auto: boolean, output: {...}, monitor: {...}});
         *     
         *     auto
         *     ----
         * true, the start is triggered when the page is loaded     
         * If the page is already loaded, the parameter auto is
         * ignored and the start is executed immediately.
         * 
         *     output
         *     ----
         * Simple function or object for outputting messages and errors.
         * If not specified, console object is used.    
         * 
         *     Implementation of an output (as function or object):
         *     
         * var output = {
         * 
         *     log(message) {
         *         ...
         *     },
         *     
         *     error(message) {
         *         ...
         *     }
         * };
         * 
         *     monitor
         *     ----
         * Monitors the test procedure and is informed about the various cycles
         * during execution. The monitor also controls the data output. For
         * example, the output can be redirected to DOM elements. Without a
         * monitor the tests will also be performed, but there will be an
         * output about success and failure.
         * If no monitor is specified, the internal monitor is used with a
         * simple console output.     
         * 
         *     Implementation of a monitor (as function or object):
         *     
         * var monitor = {
         * 
         *     start(status) {
         *         The method is called with the start.
         *     },
         *     
         *     suspend(status) {
         *         The method is called with suspension.
         *     },
         *     
         *     resume(status) {
         *         The method is called if the test run is stopped and is to be
         *         continued later.
         *     },
         *     
         *     interrupt(status) {
         *         The method is called if you want to abort the test run.
         *         The test run cannot then be resumed.
         *     },
         *     
         *     perform(status) {
         *         The method is called before a test task is performed.
         *     },
         *     
         *     response(status) {
         *         The method is called when a test task has been performed.
         *         Here you can find the result of the test task.
         *     },
         *     
         *     finish(status) {
         *         The method is called when all test tasks have been completed.
         *     }
         * };
         * 
         * The current status is passed to all monitor methods as an object.
         * The status is a snapshot of the current test run with details of the
         * current task and the queue. The details are read-only and cannot be
         * changed.
         *  
         *     structure of status: {task:..., queue:...}
         *     
         * task.title      title of the test task    
         * task.meta       meta information about the test itself
         *                 name, test, timeout, expected, serial
         * task.running    indicator when the test task is in progress
         * task.timing     start time from the test task in milliseconds
         * task.timeout    optional, the time in milliseconds when a timeout is
         *                 expected
         * task.duration   total execution time of the test task in
         *                 milliseconds, is set with the end of the test task
         * task.error      optional, if an unexpected error (also assert error)
         *                 has occurred, which terminated the test task
         * 
         * queue.timing    start time in milliseconds 
         * queue.size      original queue length
         * queue.length    number of outstanding tests
         * queue.progress  number of tests performed     
         * queue.lock      indicator when a test is performed and the queue is
         *                 waiting
         * queue.faults    number of detected faults
         * 
         * @param meta  
         */
        Test.start = function(meta) {
            
            if (Test.worker !== undefined)
                return;

            if (meta && meta.auto
                    && (document.readyState === "loading"
                        || document.readyState === "interactive")) {
                if (Test.start.auto === undefined) {
                    Object.defineProperty(Test.start, "auto", {
                        value: true
                    });  
                    window.addEventListener("load", () => {
                        Test.start(meta);
                    });
                }
                return;
            }

            const numerical = (number, text) => {
                return number + " " + text + (number !== 1 ? "s" : "");
            };

            Test.worker = {};

            // Test.worker.output
            //     Output to be used for all messages and errors
            Test.worker.output = meta ? meta.output : null;
            Test.worker.output = Test.worker.output || console;
            
            // Test.worker.monitor
            //     Monitoring of test processing
            Test.worker.monitor = meta ? meta.monitor : null;
            Test.worker.monitor = Test.worker.monitor || {
                start(status) {
                    Test.worker.output.log(new Date().toUTCString() + " Test is started"
                            + ", " + numerical(status.queue.size, "task") + " in the queue");
                },
                suspend(status) {
                    Test.worker.output.log(new Date().toUTCString() + " Test is suspended"
                            + ", " + numerical(status.queue.length, "task") + " still outstanding");
                },
                resume(status) {
                    Test.worker.output.log(new Date().toUTCString() + " Test is continued "
                            + ", " + numerical(status.queue.size, "task") + " in the queue");
                },
                interrupt(status) {
                    Test.worker.output.log(new Date().toUTCString() + " Test is interrupted"
                            + "\n\t" + numerical(status.queue.size -status.queue.progress, "task") + " still outstanding"
                            + "\n\t" + numerical(status.queue.faults, "fault") + " were detected"
                            + "\n\ttotal time " + (new Date().getTime() -status.queue.timing) + " ms");
                },
                perform(status) {
                },
                response(status) {
                    const timing = new Date().getTime() -status.task.timing;
                    if (status.task.error)
                        Test.worker.output.error(new Date().toUTCString() + " Test task " + status.task.title + " " + status.task.error.message);
                    else Test.worker.output.log(new Date().toUTCString() + " Test task " + status.task.title + " was successful (" + timing + " ms)");
                },
                finish(status) {
                    Test.worker.output.log(new Date().toUTCString() + " Test is finished"
                            + "\n\t" + numerical(status.queue.size, "task") + " were performed"
                            + "\n\t" + numerical(status.queue.faults, "fault") + " were detected"
                            + "\n\ttotal time " + (new Date().getTime() -status.queue.timing) + " ms");
                }            
            };

            // Test.worker.queue
            //     Queue of currently running test tasks
            Test.worker.queue = Test.worker.queue || {timing:false, stack:[], size:0, lock:false, progress:0, faults:0};
            if (Test.worker.queue.stack.length <= 0) {
                Test.worker.queue.stack = Array.from(Test.stack);
                Test.worker.queue.size = Test.worker.queue.stack.length;
                Test.worker.queue.timing = new Date().getTime();
            }
            
            // Test.worker.timeout
            //     Timer for controlling test tasks with timeout
            Test.worker.timeout = window.setInterval(() => {
            
                if (Test.worker.status === Test.EVENT_SUSPEND)
                    return;
                
                if (Test.worker.task === undefined
                        || !Test.worker.task.running
                        || !Test.worker.queue.lock)
                    return;

                const task = Test.worker.task;
                if (!task.timeout
                        || task.timeout > new Date().getTime())
                    return;
                
                task.duration = new Date().getTime() -task.timing;
                task.error = new Error("Timeout occurred, expected " + task.timeout + " ms but was " + task.duration + " ms");
                Test.fire(Test.EVENT_RESPONSE, Test.status());
                Test.worker.queue.faults++;
                Test.worker.queue.lock = false;
            }, 25);
            
            // Test.worker.interval
            //     Timer for processing the queue
            Test.worker.interval = window.setInterval(() => {

                if (Test.worker.status === Test.EVENT_SUSPEND)
                    return;
                
                if (!Test.worker.queue.lock
                        && Test.worker.queue.progress <= 0)
                    Test.fire(Test.EVENT_START, Test.status());
                
                if (Test.worker.queue.lock)
                    return;
                
                if (Test.worker.queue.stack.length > 0) {
                    Test.worker.queue.lock = true;
                    Test.worker.queue.progress++;
                    const meta = Test.worker.queue.stack.shift();
                    let timeout = false;
                    if ((meta.timeout || 0) > 0)
                        timeout = new Date().getTime() +meta.timeout;

                    Test.worker.task = {title:null, meta, running:true, timing:new Date().getTime(), timeout, duration:false, error:null};
                    Test.worker.task.title = "#" + meta.serial;
                    if (typeof meta.name === "string"
                            && meta.name.trim().length > 0)
                        Test.worker.task.title += " " + meta.name.replace(/[\x00-\x20]+/g, " ").trim();
                    Test.fire(Test.EVENT_PERFORM, Test.status());
                    Composite.asynchron(() => {
                        const task = Test.worker.task;
                        try {task.meta.test();
                        } catch (error) {
                            task.error = error;
                            if (!task.error.message
                                    || !task.error.message.trim())
                                task.error.message = "failed";
                        } finally {
                            if (task.meta.expected) {
                                if (task.error) {
                                    if (typeof task.meta.expected === "function"
                                            && task.error instanceof(task.meta.expected))
                                        task.error = null;
                                    if (typeof task.meta.expected === "object"
                                            && task.meta.expected instanceof(RegExp)
                                            && String(task.error).match(task.meta.expected))
                                        task.error = null;
                                } else task.error = Error("Assert error expected failed");
                            }
                            task.running = false;
                            task.duration = new Date().getTime() -task.timing;
                            if (task.timeout
                                    && task.timeout < new Date().getTime()
                                    && !task.error) {
                                task.error = new Error("Timeout occurred, expected " + task.meta.timeout + " ms but was " + task.duration + " ms");                            
                                Test.fire(Test.EVENT_RESPONSE, Test.status());
                                Test.worker.queue.faults++;
                            }
                            if (!task.error
                                    || !String(task.error.message).match(/^Timeout occurred/)) {
                                if (task.error)
                                    Test.worker.queue.faults++;
                                Test.fire(Test.EVENT_RESPONSE, Test.status());
                            }
                            Test.worker.queue.lock = false;
                        }
                    });
                    return;
                }
                
                window.clearTimeout(Test.worker.interval);
                window.clearTimeout(Test.worker.timeout);
                Test.fire(Test.EVENT_FINISH, Test.status());
                delete Test.worker;
            }, 25);
        };

        /**
         * Suspends the current test run, which can be continued from the
         * current test with Test.resume().
         * @throws An error occurs in the following cases:
         *     - No worker is present or cannot be suspended
         */
        Test.suspend = function() {

            if (Test.worker === undefined)
                throw new Error("Suspend is not available"); 
            Test.fire(Test.EVENT_SUSPEND, Test.status());
        };
        
        /** 
         * Continues the test run if it was previously suspended.
         * @throws An error occurs in the following cases:
         *     - No worker is present or cannot be resumed
         */
        Test.resume = function() {
            
            if (Test.worker === undefined
                    || Test.worker.status !== Test.EVENT_SUSPEND)
                throw new Error("Resume is not available"); 
            Test.fire(Test.EVENT_RESUME, Test.status());
        };
        
        /**
         * Interrupts the current test run and discards all outstanding tests.
         * The test run can be restarted with Test.start().
         * @throws An error occurs in the following cases:
         *     - No worker is present or cannot be interrupted
         */
        Test.interrupt = function() {
            
            if (Test.worker === undefined)
                throw new Error("Interrupt is not available"); 
            window.clearTimeout(Test.worker.interval);
            window.clearTimeout(Test.worker.timeout);
            Test.fire(Test.EVENT_INTERRUPT, Test.status());
            delete Test.worker;
        };

        /**
         * Makes a snapshot of the status of the current test.
         * The status contains details of the current task and the queue. The
         * details are read-only and cannot be changed. If no test is executed,
         * false is returned.
         *  
         *     structure of details: {task:..., queue:...}
         *     
         * task.title      title of the test task    
         * task.meta       meta information about the test itself
         *                 name, test, timeout, expected, serial
         * task.running    indicator when the test task is in progress
         * task.timing     start time from the test task in milliseconds
         * task.timeout    optional, the time in milliseconds when a timeout is
         *                 expected
         * task.duration   total execution time of the test task in
         *                 milliseconds, is set with the end of the test task
         * task.error      optional, if an unexpected error (also assert error)
         *                 has occurred, which terminated the test task
         * 
         * queue.timing    start time in milliseconds 
         * queue.size      original queue length
         * queue.length    number of outstanding tests
         * queue.progress  number of tests performed     
         * queue.lock      indicator when a test is performed and the queue is
         *                 waiting
         * queue.faults    number of detected faults 
         * 
         * @return an object with detailed status information, otherwise false
         */
        Test.status = function() {

            const status = {};
            if (typeof Test.worker === "object"
                    && typeof Test.worker.task === "object") {
                status.task = {};
                Object.defineProperty(status.task, "title", {
                    value: Test.worker.task.title,
                    enumerable: true
                });
                Object.defineProperty(status.task, "meta", {
                    value: Test.worker.task.meta,
                    enumerable: true
                });
                Object.defineProperty(status.task, "running", {
                    value: Test.worker.task.running,
                    enumerable: true
                });
                Object.defineProperty(status.task, "timing", {
                    value: Test.worker.task.timing,
                    enumerable: true
                });
                Object.defineProperty(status.task, "timeout", {
                    value: Test.worker.task.timeout,
                    enumerable: true
                });
                Object.defineProperty(status.task, "duration", {
                    value: Test.worker.task.duration,
                    enumerable: true
                });
                Object.defineProperty(status.task, "error", {
                    value: Test.worker.task.error,
                    enumerable: true
                });
            }
            
            if (typeof Test.worker === "object"
                    && typeof Test.worker.queue === "object") {
                status.queue = {};
                Object.defineProperty(status.queue, "timing", {
                    value: Test.worker.queue.timing,
                    enumerable: true
                });
                Object.defineProperty(status.queue, "size", {
                    value: Test.worker.queue.size,
                    enumerable: true
                });
                Object.defineProperty(status.queue, "length", {
                    value: Test.worker.queue.stack.length,
                    enumerable: true
                });
                Object.defineProperty(status.queue, "progress", {
                    value: Test.worker.queue.progress,
                    enumerable: true
                });
                Object.defineProperty(status.queue, "lock", {
                    value: Test.worker.queue.lock,
                    enumerable: true
                });
                Object.defineProperty(status.queue, "faults", {
                    value: Test.worker.queue.faults,
                    enumerable: true
                });
            }
            
            if (status.task === undefined
                    && status.queue === undefined)
                return false;
            return status;
        };    
    
        if (typeof Assert === "undefined") {
    
            /**
             * A set of assertion methods useful for writing tests.
             * Only failed assertions are recorded.
             * These methods can be used directly:
             *     Assert.assertEquals(...);
             */ 
            window["Assert"] = {};
            
            /**
             * Creates a new assertion based on an array of variant parameters.
             * Size defines the number of test values.
             * If more parameters are passed, the first must be the message.
             * @param arguments
             * @param size
             */
            Assert.create = function(arguments, size) {

                const assert = {message:null, values:[], error() {
                    const words = Array.from(arguments);
                    words.forEach((argument, index, array) => {
                        array[index] = String(argument).replace(/\{(\d+)\}/g, (match, index) => {
                            if (index > assert.values.length)
                                return "[null]";
                            match = String(assert.values[index]);
                            match = match.replace(/\s*[\r\n]+\s*/g, " "); 
                            return match;
                        });
                    });
                    
                    let message = "expected {1} but was {2}";
                    if (assert.message !== null) {
                        assert.message = assert.message.trim();
                        if (assert.message)
                            message = assert.message;
                    }
                    message = "{0} failed, " + message;
                    message = message.replace(/\{(\d+)\}/g, (match, index) => {
                        if (index > words.length)
                            return "[null]";
                        match = String(words[index]);
                        match = match.replace(/\s*[\r\n]+\s*/g, " "); 
                        return match;                
                    });
                    return new Error(message);
                }};
                
                arguments = Array.from(arguments);
                if (arguments.length > size)
                    assert.message = arguments.shift();
                while (arguments.length > 0)
                    assert.values.push(arguments.shift());
    
                return assert;
            };
            
            /**
             * Asserts that a value is true.
             * If the assertion is incorrect, an error with a message is thrown.
             * The method has the following various signatures:
             *     function(message, value) 
             *     function(value) 
             * @param message
             * @param value
             */       
            Assert.assertTrue = function(...variants) {

                const assert = Assert.create(variants, 1);
                if (assert.values[0] === true)
                    return;
                throw assert.error("Assert.assertTrue", "true", "{0}");
            };
            
            /**
             * Asserts that a value is false.
             * If the assertion is incorrect, an error with a message is thrown.
             * The method has the following various signatures:
             *     function(message, value) 
             *     function(value) 
             * @param message
             * @param value
             */      
            Assert.assertFalse = function(...variants) {

                const assert = Assert.create(variants, 1);
                if (assert.values[0] === false)
                    return;
                throw assert.error("Assert.assertFalse", "false", "{0}");
            };
    
            /**
             * Asserts that two values are equals.
             * Difference between equals and same: === / == or !== / !=
             * If the assertion is incorrect, an error with a message is thrown.
             * The method has the following various signatures:
             *     function(message, expected, actual) 
             *     function(expected, actual) 
             * @param message
             * @param expected
             * @param actual
             */     
            Assert.assertEquals = function(...variants) {

                const assert = Assert.create(variants, 2);
                if (assert.values[0] === assert.values[1])
                    return;
                throw assert.error("Assert.assertEquals", "{0}", "{1}");
            };

            /**
             * Asserts that two values are not equals.
             * Difference between equals and same: === / == or !== / !=
             * If the assertion is incorrect, an error with a message is thrown.
             * The method has the following various signatures:
             *     function(message, unexpected, actual) 
             *     function(unexpected, actual) 
             * @param message
             * @param unexpected
             * @param actual
             */      
            Assert.assertNotEquals = function(...variants) {

                const assert = Assert.create(variants, 2);
                if (assert.values[0] !== assert.values[1])
                    return;
                throw assert.error("Assert.assertNotEquals", "not {0}", "{1}");
            };
    
            /**
             * Asserts that two values are the same.
             * Difference between equals and same: === / == or !== / !=
             * If the assertion is incorrect, an error with a message is thrown.
             * The method has the following various signatures:
             *     function(message, expected, actual) 
             *     function(expected, actual) 
             * @param message
             * @param expected
             * @param actual
             */      
            Assert.assertSame = function(...variants) {

                const assert = Assert.create([], variants, 2);
                if (assert.values[0] === assert.values[1])
                    return;
                throw assert.error("Assert.assertSame", "{0}", "{1}");
            };
            
            /**
             * Asserts two values are not the same.
             * Difference between equals and same: === / == or !== / !=
             * If the assertion is incorrect, an error with a message is thrown.
             * The method has the following various signatures:
             *     function(message, unexpected, actual) 
             *     function(unexpected, actual) 
             * @param message
             * @param unexpected
             * @param actual
             */      
            Assert.assertNotSame = function(...variants) {

                const assert = Assert.create(variants, 2);
                if (assert.values[0] !== assert.values[1])
                    return;
                throw assert.error("Assert.assertNotSame", "not {0}", "{1}");
            };
    
            /**
             * Asserts that a value is null.
             * If the assertion is incorrect, an error with a message is thrown.
             * The method has the following various signatures:
             *     function(message, value) 
             *     function(value) 
             * @param message
             * @param value
             */    
            Assert.assertNull = function(...variants) {

                const assert = Assert.create(variants, 1);
                if (assert.values[0] === null)
                    return;
                throw assert.error("Assert.assertNull", "null", "{0}");
            };
    
            /**
             * Asserts that a value is not null.
             * If the assertion is incorrect, an error with a message is thrown.
             * The method has the following various signatures:
             *     function(message, value) 
             *     function(value) 
             * @param message
             * @param value
             */
            Assert.assertNotNull = function(...variants) {

                const assert = Assert.create(variants, 1);
                if (assert.values[0] !== null)
                    return;
                throw assert.error("Assert.assertNotNull", "not null", "{0}");
            };
    
            /**
             * Fails a test with an optional message.
             * This assertion will be thrown an error with an optional message.
             * The method has the following various signatures:
             *     function(message) 
             *     function() 
             * @param message
             */
            Assert.fail = function(message) {
    
                if (message)
                    message = String(message).trim();
                message = "Assert.fail" + (message ? ", " + message : "");
                throw new Error(message);
            }
        }
        
        /**
         * Redirection of the console level INFO, ERROR, WARN, LOG when using
         * tests. The outputs are buffered for analysis and listeners can be
         * implemented whose callback method is called at console outputs.
         */
            
        /** Cache for analyzing console output */
        console.output = {log:"", warn:"", error:"", info:""};
        
        /** Clears the cache from the console output. */
        console.output.clear = function() {
            console.output.log = "";
            console.output.warn = "";
            console.output.error = "";
            console.output.info = "";
        };
        
        /** Set of registered listeners for occurring console outputs. */
        Object.defineProperty(console, "listeners", {
            value: new Set()
        });        
        
        /**
         * Registers a callback function for console output.
         * Expected method signatures:
         *     function(level)
         *     function(level, ...)
         * @param callback callback function
         */
        console.listen = function(callback) {
            console.listeners.add(callback);
        };
        
        /** 
         * General method for redirecting console levels.
         * If the script is in a frame, at the parent object it will also try
         * to trigger this method. The parent object is always triggered after
         * the current object. If an error occurs when calling the current
         * object, the parent object is not triggered.
         * @param level
         * @param variants
         * @param output
         */
        console.forward = function(level, variants, output) {
            
            console.output[level] += Array.from(variants).join(", ");

            if (output)
                output(...variants);

            console.listeners.forEach((callback) => {
                callback(...([level, ...variants]));
            });

            if (!parent
                    || parent === window
                    || !parent.console
                    || typeof parent.console.forward !== "function")
                return;

            parent.console.forward(...(Array.from(arguments).slice(0, 2)));
        };
        
        /** Redirect for the level: LOG */
        console.log$origin = console.log;
        console.log = function(...variants) {
            console.forward("log", variants, console.log$origin);
        };
        
        /** Redirect for the level: WARN */
        console.warn$origin = console.warn;
        console.warn = function(...variants) {
            console.forward("warn", variants, console.warn$origin);
        };
        
        /** Redirect for the level: ERROR */
        console.error$origin = console.error;
        console.error = function(...variants) {
            console.forward("error", variants, console.error$origin);
        };
        
        /** Redirect for the level: INFO */
        console.info$origin = console.info;
        console.info = function(...variants) {
            console.forward("info", variants, console.info$origin);
        };
        
        /** In the case of an error, the errors are forwarded to the console. */
        window.addEventListener("error", function(event) {
            if (parent && parent !== window)
                console.forward("error", ((...variants) => {
                    return variants;
                })(event.message), null);
        });        
    
        /**
         * Enhancement of the JavaScript API
         * Adds a method that simulates keyboard input to the Element objects.
         * The following events are triggered during simulation:
         *     focus, keydown, keyup, change
         * @param value simulated input value
         * @param clear option false suppresses emptying before input
         */ 
        if (Element.prototype.typeValue === undefined) {
            Element.prototype.typeValue = function(value, clear) {
                this.focus();
                if (clear !== false)
                    this.value = "";
                const element = this;
                value = (value || "").split("");
                value.forEach((digit) => {
                    element.trigger("keydown");
                    element.value = (element.value || "") + digit;
                    element.trigger("keyup");
                });
                this.trigger("input");
            };     
        }
    
        /**
         * Enhancement of the JavaScript API
         * Adds a method that creates a plain string for a Node.
         */     
        if (Node.prototype.toPlainString === undefined)
            Node.prototype.toPlainString = function() {
                return (new XMLSerializer()).serializeToString(this);
            };    
    
        /**
         * Enhancement of the JavaScript API
         * Adds a method that creates a plain string for an Element.
         */     
        if (Element.prototype.toPlainString === undefined)
            Element.prototype.toPlainString = function() {
                return this.outerHTML;
            };
        
        /**
         * Enhancement of the JavaScript API
         * Adds a method that creates a plain string for an Object.
         */      
        if (Object.prototype.toPlainString === undefined)
            Object.prototype.toPlainString = function() {
                if (this !== null
                        && typeof this[Symbol.iterator] === 'function')
                    return JSON.stringify([...this]);
                return JSON.stringify(this);
            };     
          
        /**
         * Enhancement of the JavaScript API
         * Adds a method to trigger an event for elements.
         * @param event   type of event
         * @param bubbles deciding whether the event should bubble up through
         *     the event chain or not
         * @param cancel  defining whether the event can be canceled
         */         
        if (Element.prototype.trigger === undefined)
            Element.prototype.trigger = function(event, bubbles = false, cancel = true) {
                const trigger = new Event(event, {"bubbles":bubbles, "cancelable":cancel});
                this.dispatchEvent(trigger);
            }; 
    };
}