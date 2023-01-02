[Events](events.md) | [TOC](README.md#test)
- - -

# Test

The Test API supports the implementation and execution of integration tests and
can be used for suites, scenarios and single test cases.

As a modular component of Seanox aspect-js, the Test API is included in every
release that can be easily removed. Because the Test API has some special
features regarding error handling and console output, the Test API must be
activated deliberately at runtime.

```javascript
Test.activate();

Test.create({test() {
    ...
}});

Test.start();
```


## Contents Overview

* [Task](#task)
  * [name](#name)
  * [test](#test)
  * [timeout](#timeout)
  * [expected](#expected)
  * [ignore](#ignore)
* [Scenario](#scenario)
* [Suite](#suite)
* [Assert](#assert)
  * [assertTrue](#asserttrue)
  * [assertFalse](#assertfalse)
  * [assertEquals](#assertequals)
  * [assertNotEquals](#assertnotequals)
  * [assertSame](#assertsame)
  * [assertNotSame](#assertnotsame)
  * [assertNull](#assertnull)
  * [assertNotNull](#assertnotnull)
  * [assertUndefined](#assertundefined)
  * [assertNotUndefined](#assertnotundefined)
  * [fail](#fail)
* [Configuration](#configuration)
  * [auto](#auto)
  * [output](#output)
  * [monitor](#monitor)
* [Output](#output-1)
  * [Forwarding](#forwarding)
  * [Buffer](#buffer)
  * [Listener](#listener)
* [Monitoring](#monitoring)
* [Control](#control)
* [Events](#events)
* [Extension](#extension)


## Task

The smallest component in an integration test, used here as _task_, because
_case_ is a keyword in JavaScript. It can be implemented alone, but is always
used in a scenario.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertTrue(true);
}});

Test.start();
```

Task is primarily a meta object.

```
{name:..., test:..., timeout:..., expected:..., ignore:...}
```


### name

Optional name of the test task.


### test

An implemented method to be executed as a test.


### timeout

Optional the maximum runtime of the test item in milliseconds. Exceeding this
limit will cause the test to fail. A value greater than 0 is expected, otherwise
the timeout is ignored.


### expected

Optional to test the occurrence of defined errors. The error must occur if the
test is successful. An error object or a RegExp is expected as value.


### ignore

Optional true, if the test is to be ignored.


## Scenario

A scenario is a sequence of a lot of test cases (tasks).

```javascript
Test.activate();

Test.create({test() {
    Assert.assertTrue(true);
}});
Test.create({name:"example", timeout:1000, test() {
    Assert.assertTrue(true);
}});
Test.create({error:Error test() {
    throw new Error();
}});
Test.create({error:/^My Error/i, test() {
    throw new Error("My Error");
}});
Test.create({ignore:true, test() {
    Assert.assertTrue(true);
}});

Test.start();
```


## Suite

A suite is a complex bundle of different test cases, scenarios and other suites.
Usually a suite consists of different files, which then represent a complex
test. An example of a good suite is a cascade of different files und the test
can be started in any file and place. This makes it possible to perform the
integration test on different levels and with different complexity.


## Assert

The test cases are implemented with assertions. The Test API provides elementary
assertions, you can implement more. The function is simple. If an assertion was
not `true`, an error is thrown, optionally with an individual error message.

__The methods use different signatures, which are described in the examples
below.__


### assertTrue

Asserts that a value is `true`.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertTrue(true);
}});
Test.create({test() {
    Assert.assertTrue("message", true);
}});

Test.start();
```


### assertFalse

Asserts that a value is `false`, as negation of `Assert.assertTrue(...)`.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertFalse(false);
}});
Test.create({test() {
    Assert.assertFalse("message", false);
}});

Test.start();
```


### assertEquals

Asserts that two values are equals.

Difference between equals and same: `=== / ==` or `!== / !=`

```javascript
Test.activate();

Test.create({test() {
    Assert.assertEquals(expected, value);
}});
Test.create({test() {
    Assert.assertEquals("message", expected, value);
}});

Test.start();
```


### assertNotEquals

Asserts that two values are not equals, as negation of `Assert.assertEquals(...)`.

Difference between equals and same: `=== / ==` or `!== / !=`

```javascript
Test.activate();

Test.create({test() {
    Assert.assertNotEquals(unexpected, value);
}});
Test.create({test() {
    Assert.assertNotEquals("message", unexpected, value);
}});

Test.start();
```


### assertSame

Asserts that two values are the same.

Difference between equals and same: `=== / ==` or `!== / !=`

```javascript
Test.activate();

Test.create({test() {
    Assert.assertSame(expected, value);
}});
Test.create({test() {
    Assert.assertSame("message", expected, value);
}});

Test.start();
```


### assertNotSame

Asserts two values are not the same, as negation of `Assert.assertSame(...)`.

Difference between equals and same: === / == or !== / !=

```javascript
Test.activate();

Test.create({test() {
    Assert.assertNotSame(unexpected, value);
}});
Test.create({test() {
    Assert.assertNotSame("message", unexpected, value);
}});

Test.start();
```


### assertNull

Asserts that a value is `null`.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertNull(null);
}});
Test.create({test() {
    Assert.assertNull("message", null);
}});

Test.start();
```


### assertNotNull

Asserts that a value is not `null`, as negation of `Assert.assertNull(...)`.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertNotNull(null);
}});
Test.create({test() {
    Assert.assertNotNull("message", null);
}});

Test.start();
```


### assertUndefined

Asserts that a value is `undefined`.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertUndefined(undefined);
}});
Test.create({test() {
    Assert.assertUndefined("message", undefined);
}});

Test.start();
```


### assertNotUndefined

Asserts that a value is not `undefined`, as negation of `Assert.assertUndefined(...)`.

```javascript
Test.activate();

Test.create({test() {
    Assert.assertNotUndefined(undefined);
}});
Test.create({test() {
    Assert.assertNotUndefined("message", undefined);
}});

Test.start();
```


### fail

Fails a test with an optional message.

```javascript
Test.activate();

Test.create({test() {
    Assert.fail();
}});
Test.create({test() {
    Assert.fail("message");
}});

Test.start();
```


## Configuration

Optionally, the Test API can be configured with each start. A meta object is
expected as parameter. The configuration contained in it is partially adopted
and the unknown is ignored.

```javascript
Test.start({auto: boolean, ouput: {...}, monitor: {...}});
```


### auto

Option that triggers the start when loading the page. If the page is already
loaded, the parameter _auto_ is ignored and the start is executed immediately.

```javascript
Test.start({auto: true});
```


### output

Function or object for outputting messages and errors. If not specified, console
object is used.

```javascript
Test.start({output: {
    log(message) {
        ...
    },
    error(message) {
        ...
    }
}});
```


### monitor

Monitors the progress of the test and is informed of the various steps and
statuses during execution. The monitor can also be used for data output, for
example, to redirect the output to a DOM element. The monitor is optional.
Without this, the console is used to output information about the test process.

```javascript
Test.start({monitor: {

    start(status) {
        The method is called with the start.
    },

    suspend(status) {
        The method is called with suspension.
    },

    resume(status) {
        The method is called if the test run is stopped and is to be
        continued later.
    },

    interrupt(status) {
        The method is called if you want to abort the test run.
        The test run cannot then be resumed.
    },

    perform(status) {
        The method is called before a test task is performed.
    },

    response(status) {
        The method is called when a test task has been performed.
        Here you can find the result of the test task.
    },

    finish(status) {
        The method is called when all test tasks have been completed.
    }
}});
```

The current status is passed to all monitor methods as an meta-object. The
status contains details of the current task and the queue. The details are
read-only and cannot be changed.

```javascript
{
    task: {
        title:
            title of the test task,
        meta:
            meta information about the test itself (name, test,
            timeout, expected, serial),
        running:
            indicator when the test task is in progress
        timing:
            start time from the test task in milliseconds
        timeout:
            optional, the time in milliseconds when a timeout is
            expected
        duration:
            total execution time of the test task in milliseconds, is
            set with the end of the test task
        error:
            optional, if an unexpected error (also assertion error) has
            occurred, which terminated the test task
    },
    queue: {
        timing:
            start time in milliseconds,
        size:
            original queue length,
        length:
            number of outstanding tests,
        progress:
            number of tests performed,
        lock:
            indicator when a test is performed and the queue is waiting,
        faults:
            number of detected faults
    }
}
```


## Output

As a development tool, browsers provide console output that can be used to log
information for which different channels or levels are supported:
    _LOG_, _WARN_, _ERROR_, _INFO_

```javascript
console.log(message);
console.warn(message);
console.error(message);
console.info(message);
```

To be able to include console output in tests, the activated Test API supports
forwarding, listeners and buffers for console output.


### Forwarding

The forwarding runs completely in the background and distributes the output to
the browser console output and to the components of the Test API. In the case
of (I)Frames, the output is forwarded to enclosing or superordinate
window-objects and is accessible there via buffer and listener with an activated
Test API.


### Buffer

If the Test API is activated, the console object is extended by the buffer
output. The buffer contains caches for the levels: _LOG_, _WARN_, _ERROR_ and
_INFO_ as well as methods for emptying.

```javascript
const log   = console.output.log;
const warn  = console.output.warn;
const error = console.output.error;
const info  = console.output.info;

console.output.clear();
```


### Listener

Callback methods can be established as listeners for console output.

```javascript
console.listen(function(level, message) {
    message = Array.from(arguments).slice(1);
    ...
});
```

The callback methods are then called at each console output and the log level is
passed as the first parameter. The additional number of parameters is variable
and depends on the initial call of the corresponding console methods. This often
makes it easier to use `arguments`.


## Monitoring

Monitoring monitors the progress of the test and is informed of the various
steps and statuses during execution. The monitor is optional. Without this, the
console is used to output information about the test process.

Details about configuration and usage are described in chapter
[Configuration - monitor](#monitor).


## Control

The test progress and the execution of the tests can be controlled by the
Test API.

```javascript
Test.start();
Test.start({auto: boolean});
```

The start can be done manually or when using `auto = true`, by loading the
page. If the page is already loaded, the parameter `auto` is ignored and the
start is executed immediately.

```javascript
Test.suspend();
```

Suspends the current test execution, which can be continued from the current
test with `Test.resume()`.

```javascript
Test.resume();
```

Continues the test execution if it was stopped before.

```javascript
Test.interrupt();
```

Interrupts the current test run and discards all outstanding tests.
The test run can be restarted with `Test.start()`.

```javascript
Test.status();
```

Makes a snapshot of the status of the current test. The status contains details
of the current task and the queue. The details are read-only and cannot be
changed. If no test is executed, false is returned.

```javascript
{
    task: {
        title:
            title of the test task,
        meta:
            meta information about the test itself (name, test,
            timeout, expected, serial),
        running:
            indicator when the test task is in progress
        timing:
            start time from the test task in milliseconds
        timeout:
            optional, the time in milliseconds when a timeout is
            expected
        duration:
            total execution time of the test task in milliseconds, is
            set with the end of the test task
        error:
            optional, if an unexpected error (also asser error) has
            occurred, which terminated the test task
    },
    queue: {
        timing:
            start time in milliseconds,
        size:
            original queue length,
        length:
            number of outstanding tests,
        progress:
            number of tests performed,
        lock:
            indicator when a test is performed and the queue is waiting,
        faults:
            number of detected faults
    }
}
```


## Events

Events and their callback methods are another way of monitoring test execution.
The callback methods are registered at the Test API for corresponding events and
then work similar to the monitor.

List of available events:

```javascript
Test.EVENT_INTERRUPT
Test.EVENT_PERFORM
Test.EVENT_RESPONSE
Test.EVENT_RESUME
Test.EVENT_START
Test.EVENT_SUSPEND
```

Examples of use:

```javascript
Test.listen(Test.EVENT_START, function(event, status) {
    ...
});

Test.listen(Test.EVENT_PERFORM, function(event, status) {
    ...
});

Test.listen(Test.EVENT_FINISH, function(event, status) {
    ...
});
```


## Extension

The Test API also activates extensions of the JavaScript API.

### Element

#### Element.prototype.typeValue

Method that simulates keyboard input for element objects.
The following events are triggered during simulation: 
    focus, keydown, keyup, change

```html
<form action="/api/example" methode="POST">
  <input type="text" id="inputText"/>
  <input type="submit"/> 
</form>
```

```javascript
document.querySelector("#inputText").typeValue("Hello World!");
});
```


#### Element.prototype.toPlainString

Method that creates a simple string for an element object. The string is based
on `Element.prototype.outerHTML`.

```html
<form action="/api/example" methode="POST">
  <input type="text" id="inputText"/>
  <input type="submit"/> 
</form>
});
```

```javascript
console.log(document.querySelector("form").toPlainString());
```

Output:

```
<form xmlns="http://www.w3.org/1999/xhtml" action="/api/example" methode="POST">
  <input type="text" id="inputText"/>
  <input type="submit"/> 
</form>
```


#### Element.prototype.trigger

Method to trigger an event for an element.

```javascript
document.queryElement("#button").trigger("click");
```

Method call with option bubbles. Decides whether the event should run through
the event chain or not.

Default: false

```javascript
document.queryElement("#button").trigger("click", true);
```

Method call with option bubbles and cancel. This determines whether the event
can be canceled.

Default: true

```javascript
document.queryElement("#button").trigger("click", true, false);
```


### Node

#### Node.prototype.toPlainString

Method that creates a simple string for a node object. The string is based on
`XMLSerializer.serializeToString(node)`.

```javascript
const text = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
         + "<note>"
         + "  <to>Tove</to>"
         + "  <from>Jani</from>"
         + "  <heading>Reminder</heading>"
         + "  <body>Don't forget me this weekend!</body>"
         + "</note>";

const parser = new DOMParser();
const xml = parser.parseFromString(text, "text/xml");

const nodes = xml.evaluate("/note", xml, null, XPathResult.ANY_TYPE, null);
const result = nodes.iterateNext();
console.log(result.toPlainString());
```

Output:

```
<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>
```


### Object

#### Object.prototype.toPlainString

Method that creates a simple string for an object. The string is based on
`JSON.stringify(object)`.

```javascript
const example = {a:1, b:2, c() {return;}};
console.log(example.toPlainString());
```

Output:

```
{"a":1,"b":2}
```


- - -

[Events](events.md) | [TOC](README.md#test)
