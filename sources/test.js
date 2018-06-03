/**
 *  LIZENZBEDINGUNGEN - Seanox Software Solutions ist ein Open-Source-Projekt,
 *  im Folgenden Seanox Software Solutions oder kurz Seanox genannt. Diese
 *  Software unterliegt der Version 2 der GNU General Public License.
 *
 *  Seanox aspect-js, JavaScript Client Faces
 *  Copyright (C) 2018 Seanox Software Solutions
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
 *  Test is a simple API and module to implement and execute integration tests.
 *  The tests can be implemented as suites, scenarios and test cases.
 *  
 *  
 *      Case
 *      ----
 *  The smallest and simplest element in an integration test, used here as
 *  task, because case is a keyword. It can be implemented alone, but is always
 *  used in a scenario.
 *  
 *  Test.create({test:function() {
 *      Assert.assertTrue(true);
 *  }});
 *  
 *  Test.start();
 *  
 *  
 *      Scenario
 *      ----
 *  A scenario is a sequence of a lot of test cases usually in one file.
 *  
 *  Test.create({test:function() {
 *      Assert.assertTrue(true);
 *  }});
 *  
 *  Test.create({name:"example", timeout:1000, test:function() {
 *      Assert.assertTrue(true);
 *  }});
 *  
 *  Test.create({error:Error test:function() {
 *      throw new Error();
 *  }});
 *  
 *  Test.create({error:/^My Error/i, test:function() {
 *      throw new Error("My Error");
 *  }});
 *  
 *  Test.create({ignore:true, test:function() {
 *      Assert.assertTrue(true);
 *  }});
 *  
 *  Test.start();
 *  
 *  
 *      Suite
 *      ----
 *  A suite is a complex bundle of different test cases, scenarios and other
 *  suites. Usually a suite consists of different files, which then represent a
 *  complex test. An example of a good suite is a cascade of different files, if
 *  the test can be started in any file and place. This makes it possible to
 *  perform the integration test on different levels and with different
 *  complexity.
 *  
 *      
 *      Assert
 *      ----
 *  The test cases are implemented with assertions. The test module provides
 *  elementary assertions, you can implement more. The function is simple. If an
 *  assertion was not true, a error is thrown -- see as an example the
 *  implementation here.
 *  
 *  Test 1.0 201804015
 *  Copyright (C) 2018 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 201804015
 */
if (typeof(Test) === "undefined") {
    
    /**
     *  Static component for creating and executing tests.
     *  The component provides static functions and objects for implementing
     *  integration tests.
     */
    Test = {};
    
    /** The output to be used for all messages and errors */
    Test.output;
    
    /** The monitor to be used */
    Test.monitor;
    
    /** Stack of created / registered test tasks (backlog) */
    Test.stack;
    
    /** Queue of currently running test tasks */ 
    Test.queue;
    
    /** The currently performed test task */  
    Test.task;
    
    /** Timer for processing the queue */
    Test.interval;
    
    /** Counter for identification of test tasks */
    Test.serial;
    
    /** Timer for controlling test tasks with timeout */
    Test.timeout;
    
    /** Indicator if the autostart function can be used */
    Test.autostart;
    
    /**
     *  Optional configuration of the test environment.
     *  You can configure (also separately): the output and a monitor.
     *  
     *      Output
     *      ----
     *      
     *  Simple function or object for outputting messages and errors.
     *  If not specified, console object is used.    
     *  
     *      Implementation of an output (as function or object):
     *      
     *  var output = {
     *  
     *      log:function(message) {
     *          ...
     *      },
     *      
     *      error:function(message) {
     *          ...
     *      }
     *  };
     *  
     *      Monitor
     *      ----
     *      
     *  Monitors the test procedure and is informed about the various cycles
     *  during execution. The monitor also controls the data output. For
     *  example, the output can be redirected to DOM elements. Without a monitor
     *  the tests will also be performed, but there will be an output
     *  about success and failure.
     *  If no monitor is specified, the internal monitor is used with a simple
     *  console output.     
     *  
     *      Implementation of a monitor (as function or object):
     *      
     *  var monitor = {
     *  
     *      start:function(status) {
     *          The method is called with the start.
     *      },
     *      
     *      suspend:function(status) {
     *          The method is called with the start.
     *      },
     *      
     *      resume:function(status) {
     *          The method is called if the test run is stopped and is to be
     *          continued later.
     *      },
     *      
     *      interrupt:function(status) {
     *          The method is called if you want to abort the test run.
     *          The test run cannot then be resumed.
     *      },
     *      
     *      perform:function(status) {
     *          The method is called before a test task is performed.
     *      },
     *      
     *      response:function(status) {
     *          The method is called when a test task has been performed.
     *          Here you can find the result of the test task.
     *      },
     *      
     *      finish:function(status) {
     *          The method is called when all test tasks have been completed.
     *      }
     *  };
     *  
     *  The current status is passed to all monitor methods as an object.
     *  The status is a snapshot of the current test run with details of the
     *  current task and the queue. You can read the details, but you can't
     *  change them.
     *   
     *      structure of status: {task:..., queue:...}
     *      
     *  task.title      title of the test task    
     *  task.meta       meta information about the test itself
     *                  name, test, timeout, expected, serial
     *  task.running    indicator when the test task is in progress
     *  task.timing     start time from the test task in milliseconds
     *  task.timeout    optional, the time in milliseconds when a timeout is
     *                  expected
     *  task.duration   total execution time of the test task in milliseconds,
     *                  is set with the end of the test task
     *  task.error      optional, if an unexpected error (also asser error) has
     *                  occurred, which terminated the test task
     *  
     *  queue.timing    start time in milliseconds 
     *  queue.size      original queue length
     *  queue.length    number of outstanding tests
     *  queue.progress  number of tests performed     
     *  queue.lock      indicator when a test is performed and the queue is
     *                  waiting
     *  queue.faults    number of detected faults
     *  
     *  @param options
     */
    Test.configure = function(options) {
        
        if (typeof(options) !== "object"
                && typeof(options) !== "function")
            return;
        
        if (typeof(options.output) === "object"
                || typeof(options.output) === "function")
            Test.output = options.output;
        if (typeof(options.monitor) === "object"
                || typeof(options.monitor) === "function")
            Test.monitor = options.monitor;
    };
    
    /**
     *  Internal method to inform the monitor about current events.
     *  @param event
     *  @param message
     */
    Test.inform = function(event, message) {
        
        if (typeof(Test.monitor) === "object"
                && typeof(Test.monitor[event]) === "function")
            try {Test.monitor[event](message);
            } catch (error) {
                console.error(error);
            }
    };
    
    /**
     *  Creates and registers a test task.
     *  A test task is a function or object with the required meta information
     *  for performing and a test method to be executed.
     *  
     *      structure of meta: {name:..., test:..., timeout:..., expected:..., ignore:...}
     *      
     *  meta.name       optional name of the test task
     *  meta.test       an implemented method to be executed as a test
     *  meta.timeout    maximum runtime of the test task in milliseconds
     *                  Exceeding this limit will cause the test to fail.
     *                  A value greater than 0 is expected, otherwise the
     *                  timeout is ignored.
     *  meta.expected   if you want to test for the occurrence of an error
     *                  The error must occur if the test is successful.
     *                  An error object or a RegExp is expected as value.
     *  meta.ignore     true, if the test is to be ignored
     *  
     *      usage:
     *      
     *  Test.create({test:function() {
     *      Assert.assertTrue(true);
     *  }});
     *  
     *  Test.create({name:"example", timeout:1000, test:function() {
     *      Assert.assertTrue(true);
     *  }});
     *  
     *  Test.create({error:Error test:function() {
     *      throw new Error();
     *  }});
     *  
     *  Test.create({error:/^My Error/i, test:function() {
     *      throw new Error("My Error");
     *  }});
     *  
     *  Test.create({ignore:true, test:function() {
     *      Assert.assertTrue(true);
     *  }});
     */
    Test.create = function(meta) {
        
        if (typeof(meta) !== "object"
                || typeof(meta.test) !== "function")
            return;
        
        if (typeof(meta.ignore) !== "undefined"
                && meta.ignore === true)
            return;
        
        Test.stack = Test.stack || new Array();
        if (Test.stack.indexOf(meta) >= 0)
            return;
        if (Test.serial == undefined)
            Test.serial = 0;
        meta.serial = ++Test.serial;
        Test.stack.push(meta);
    };

    /**
     *  (Re)Starts the test run.
     *  The start can be done manually or when using the parameter auto = true,
     *  by loading the page. If the page is already loaded, the parameter auto
     *  is ignored and the start is executed immediately.
     *  @param auto true, the start is triggered when the page is loaded
     */
    Test.start = function(auto) {

        if (Test.interval)
            return;

        if (auto && document.readyState == "loaded") {
            if (typeof(Test.autostart) == "undefined") {
                Test.autostart = true;
                window.addEventListener("load", function() {
                    Test.start();
                });
            }
            return;
        }
        
        var numerical = function(number, text) {
            return number + " " + text + (number != 1 ? "s" : "");
        };
        
        Test.output = Test.output || console;
        Test.monitor = Test.monitor || {
            start:function(status) {
                Test.output.log(new Date().toUTCString() + " Test is started"
                        + ", " + numerical(status.queue.size, "task") + " in the queue");
            },
            suspend:function(status) {
                Test.output.log(new Date().toUTCString() + " Test is suspended"
                        + ", " + numerical(status.queue.length, "task") + " still outstanding");
            },
            resume:function(status) {
                Test.output.log(new Date().toUTCString() + " Test is continued "
                        + ", " + numerical(status.queue.size, "task") + " in the queue");
            },
            interrupt:function(status) {
                Test.output.log(new Date().toUTCString() + " Test is interrupted"
                        + "\n\t" + numerical(status.queue.size -status.queue.progress, "task") + " still outstanding"
                        + "\n\t" + numerical(status.queue.faults, "fault") + " were detected"
                        + "\n\ttotal time " + (new Date().getTime() -status.queue.timing) + " ms");
            },
            perform:function(status) {
            },
            response:function(status) {
                var timing = new Date().getTime() -status.task.timing;
                if (status.task.error)
                    Test.output.error(new Date().toUTCString() + " Test task " + status.task.title + " " + status.task.error.message);
                else Test.output.log(new Date().toUTCString() + " Test task " + status.task.title + " was successful (" + timing + " ms)");
            },
            finish:function(status) {
                Test.output.log(new Date().toUTCString() + " Test is finished"
                        + "\n\t" + numerical(status.queue.size, "task") + " were performed"
                        + "\n\t" + numerical(status.queue.faults, "fault") + " were detected"
                        + "\n\ttotal time " + (new Date().getTime() -status.queue.timing) + " ms");
            }            
        };

        Test.stack = Test.stack || new Array();
        Test.queue = Test.queue || {timing:false, stack:[], size:0, lock:false, progress:0, faults:0};
        if (Test.queue.stack.length == 0) {
            Test.queue.stack = Test.stack.slice();
            Test.queue.size = Test.queue.stack.length;
            Test.queue.timing = new Date().getTime();
        }
        
        Test.timeout = window.setInterval(function() {

            if (!Test.task
                    || !Test.task.running
                    || !Test.queue.lock)
                return;
            if (!Test.task.timeout
                    || Test.task.timeout > new Date().getTime())
                return;
            Test.task.duration = new Date().getTime() -task.timing;
            Test.task.error = new Error("Timeout occurred, expected " + Test.task.timeout + " ms but was " + Test.task.duration + " ms");
            Test.inform("response", Test.status());
            Test.queue.faults++;
            Test.queue.lock = false;
        }, 25);
        
        Test.interval = window.setInterval(function() {
            
            if (!Test.queue.lock
                    && Test.queue.progress <= 0)
                Test.inform("start", Test.status());
            
            if (Test.queue.lock)
                return;
            
            if (Test.queue.stack.length > 0) {
                Test.queue.lock = true;
                Test.queue.progress++;
                var meta = Test.queue.stack.shift();
                var timeout = false;
                if (!isNaN(meta.timeout)
                        && meta.timeout > 0)
                    timeout = new Date().getTime() +meta.timeout;
                Test.task = {title:null, meta:meta, running:true, timing:new Date().getTime(), timeout:timeout, duration:false, error:null};
                Test.task.title = "#" + meta.serial;
                if (typeof(meta.name) == "string"
                        && meta.name.trim().length > 0)
                    Test.task.title += " " + meta.name.replace(/[\x00-\x20]+/g, " ").trim();
                Test.inform("perform", Test.status());
                window.setTimeout(function() {
                    var task = Test.task;
                    try {task.meta.test();
                    } catch (error) {
                        task.error = error;
                        if (!task.error.message
                                || !task.error.message.trim())
                            task.error.message = "failed";
                    } finally {
                        if (task.meta.expected) {
                            if (task.error) {
                                if (typeof(task.meta.expected) === "function"
                                        && task.error instanceof(task.meta.expected))
                                    task.error = null;
                                if (typeof(task.meta.expected) === "object"
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
                            Test.inform("response", Test.status());
                            Test.queue.faults++;
                        }
                        if (!task.error
                                || !String(task.error.message).match(/^Timeout occurred/)) {
                            if (task.error)
                                Test.queue.faults++;
                            Test.inform("response", Test.status());
                        }
                        Test.queue.lock = false;
                    }
                }, 0);
                return;
            }
            
            window.clearTimeout(Test.interval);
            Test.interval = null;
            Test.task = null;
            Test.inform("finish", Test.status());
        }, 25);
    };
    
    /**
     *  Suspends the current test run, which can be continued from the current
     *  test with Test.resume().
     */
    Test.suspend = function() {

        if (!Test.interval)
            return;
        window.clearTimeout(Test.interval);
        Test.interval = null;
        while (Test.queue.lock)
            continue;
        Test.task = null;
        Test.inform("suspend", Test.status());
    };
    
    /** Continues the test run if it was previously suspended. */
    Test.resume = function() {

        if (!Test.interval)
            return;
        while (Test.queue.lock)
            continue;
        Test.task = null;        
        if (Test.queue.stack.length <= 0)
            return;
        Test.start();
        Test.inform("resume", Test.status());
    };
    
    /**
     *  Interrupts the current test run and discards all outstanding tests.
     *  The test run can be restarted with Test.start().
     */
    Test.interrupt = function() {
        
        if (!Test.interval)
            return;
        window.clearTimeout(Test.interval);
        Test.interval = null;
        while (Test.queue.lock)
            continue;
        Test.task = null;        
        Test.queue.stack = new Array();
        Test.inform("interrupt", Test.status());
    };
    
    /**
     *  Take a snapshot of the running test.
     *  Returns an object with copies of the task and the queue with detailed
     *  status information. If no test run is executed, false is returned.
     *   
     *      structure of details: {task:..., queue:...}
     *      
     *  task.title      title of the test task    
     *  task.meta       meta information about the test itself
     *                  name, test, timeout, expected, serial
     *  task.running    indicator when the test task is in progress
     *  task.timing     start time from the test task in milliseconds
     *  task.timeout    optional, the time in milliseconds when a timeout is
     *                  expected
     *  task.duration   total execution time of the test task in milliseconds,
     *                  is set with the end of the test task
     *  task.error      optional, if an unexpected error (also asser error) has
     *                  occurred, which terminated the test task
     *  
     *  queue.timing    start time in milliseconds 
     *  queue.size      original queue length
     *  queue.length    number of outstanding tests
     *  queue.progress  number of tests performed     
     *  queue.lock      indicator when a test is performed and the queue is
     *                  waiting
     *  queue.faults    number of detected faults 
     *  
     *  @return an object with detailed status information, otherwise false
     */
    Test.status = function() {
        
        var task = null;
        if (Test.task)
            task = {
                title:Test.task.title,
                meta:Test.task.meta,
                running:Test.task.running,
                timing:Test.task.timing,
                timeout:Test.task.timeout,
                duration:Test.task.duration,
                error:Test.task.error
            };

        var queue = null;
        if (Test.queue)
            queue = {
                timing:Test.queue.timing,
                size:Test.queue.size,
                length:Test.queue.stack.length,
                progress:Test.queue.progress,
                lock:Test.queue.lock,
                faults:Test.queue.faults
            };
        
        return {task:task, queue:queue};
    };    
};

if (typeof(Assert) === "undefined") {

    /**
     *  A set of assertion methods useful for writing tests.
     *  Only failed assertions are recorded.
     *  These methods can be used directly:
     *      Assert.assertEquals(...);
     */ 
    Assert = {};
    
    /**
     *  Creates a new assertion based on an array of variant parameters.
     *  Size defines the number of test values.
     *  If more parameters are passed, the first must be the message.
     *  @param arguments
     *  @param size
     */
    Assert.create = function(arguments, size) {

        var assert = {message:null, values:[], error:function() {
            var words = Array.prototype.slice.call(arguments);
            words.forEach(function(argument, index, array) {
                array[index] = String(argument).replace(/\{(\d+)\}/g, function(match, index) {
                    if (index > assert.values.length)
                        return "[null]";
                    match = String(assert.values[index]);
                    match = match.replace(/\s*[\r\n]+\s*/g, " "); 
                    return match;
                });
            });
            
            var message = "expected {1} but was {2}";
            if (assert.message != null) {
                assert.message = assert.message.trim();
                if (assert.message)
                    message = assert.message;
            }
            message = "{0} failed, " + message;
            message = message.replace(/\{(\d+)\}/g, function(match, index) {
                if (index > words.length)
                    return "[null]";
                match = String(words[index]);
                match = match.replace(/\s*[\r\n]+\s*/g, " "); 
                return match;                
            });
            return new Error(message);
        }};
        
        arguments = Array.prototype.slice.call(arguments);
        if (arguments.length > size)
            assert.message = arguments.shift();
        while (arguments.length > 0)
            assert.values.push(arguments.shift());

        return assert;
    };
    
    /**
     *  Asserts that an value is true.
     *  If the assertion is incorrect, an error is thrown with the given message.
     *  The method uses variable parameters and has the following signatures:
     *      function(message, value) 
     *      function(value) 
     *  @param message
     *  @param value
     */       
    Assert.assertTrue = function(variants) {
        
        var assert = Assert.create(arguments, 1);
        if (assert.values[0] === true)
            return;
        throw assert.error("Assert.assertTrue", "true", "{0}");
    };
    
    /**
     *  Asserts that an value is false.
     *  If the assertion is incorrect, an error is thrown with the given message.
     *  The method uses variable parameters and has the following signatures:
     *      function(message, value) 
     *      function(value) 
     *  @param message
     *  @param value
     */      
    Assert.assertFalse = function(variants) {
        
        var assert = Assert.create(arguments, 1);
        if (assert.values[0] === false)
            return;
        throw assert.error("Assert.assertFalse", "false", "{0}");
    };

    /**
     *  Asserts that two values are equals.
     *  Difference between equals and same: === / == or !== / !=
     *  If the assertion is incorrect, an error is thrown with the given message.
     *  The method uses variable parameters and has the following signatures:
     *      function(message, expected, actual) 
     *      function(expected, actual) 
     *  @param message
     *  @param expected
     *  @param actual
     */     
    Assert.assertEquals = function(variants) {
        
        var assert = Assert.create(arguments, 2);
        if (assert.values[0] === assert.values[1])
            return;
        throw assert.error("Assert.assertEquals", "{0}", "{1}");
    };
    
    /**
     *  Asserts that two values are not equals.
     *  Difference between equals and same: === / == or !== / !=
     *  If the assertion is incorrect, an error is thrown with the given message.
     *  The method uses variable parameters and has the following signatures:
     *      function(message, unexpected, actual) 
     *      function(unexpected, actual) 
     *  @param message
     *  @param unexpected
     *  @param actual
     */      
    Assert.assertNotEquals = function(variants) {
        
        var assert = Assert.create(arguments, 2);
        if (assert.values[0] !== assert.values[1])
            return;
        throw assert.error("Assert.assertNotEquals", "not {0}", "{1}");
    };

    /**
     *  Asserts that two values are the same.
     *  Difference between equals and same: === / == or !== / !=
     *  If the assertion is incorrect, an error is thrown with the given message.
     *  The method uses variable parameters and has the following signatures:
     *      function(message, nexpected, actual) 
     *      function(expected, actual) 
     *  @param message
     *  @param expected
     *  @param actual
     */      
    Assert.assertSame = function(variants) {
        
        var assert = Assert.create([], arguments, 2);
        if (assert.values[0] == assert.values[1])
            return;
        throw assert.error("Assert.assertSame", "{0}", "{1}");
    };
    
    /**
     *  Asserts two values are not the same.
     *  Difference between equals and same: === / == or !== / !=
     *  If the assertion is incorrect, an error is thrown with the given message.
     *  The method uses variable parameters and has the following signatures:
     *      function(message, unexpected, actual) 
     *      function(unexpected, actual) 
     *  @param message
     *  @param unexpected
     *  @param actual
     */      
    Assert.assertNotSame = function(variants) {
        
        var assert = Assert.create(arguments, 2);
        if (assert.values[0] != assert.values[1])
            return;
        throw assert.error("Assert.assertNotSame", "not {0}", "{1}");
    };

    /**
     *  Asserts that an value is null.
     *  If the assertion is incorrect, an error is thrown with the given message.
     *  The method uses variable parameters and has the following signatures:
     *      function(message, value) 
     *      function(value) 
     *  @param message
     *  @param value
     */    
    Assert.assertNull = function(variants) {
        
        var assert = Assert.create(arguments, 1);
        if (assert.values[0] === null)
            return;
        throw assert.error("Assert.assertNull", "null", "{0}");
    };

    /**
     *  Asserts that an value is not null.
     *  If the assertion is incorrect, an error is thrown with the given message.
     *  The method uses variable parameters and has the following signatures:
     *      function(message, value) 
     *      function(value) 
     *  @param message
     *  @param value
     */
    Assert.assertNotNull = function(variants) {
        
        var assert = Assert.create(arguments, 1);
        if (assert.values[0] !== null)
            return;
        throw assert.error("Assert.assertNotNull", "not null", "{0}");
    };

    /**
     *  Fails a test with an optional message.
     *  This assertion will be thrown a error with an optional message.
     *  The method uses variable parameters and has the following signatures:
     *      function(message) 
     *      function() 
     *  @param message
     */
    Assert.fail = function(message) {

        if (message)
            message = String(message).trim();
        message = "Assert.fail" + (message ? ", " + message : "");
        throw new Error(message);
    }
};