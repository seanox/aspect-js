[Extension](extension.md) | [TOC](README.md#test)

# Test

The Test-API supports the implementation and execution of integration tests and
can be used for suites, scenarios and single test cases.

As a modular component of Seanox aspect-js, the Test-API is included in every
release that can be easily removed. Because the Test-API has some special
features regarding error handling and console output, the Test-API must be
activated deliberately at runtime.

```javascript
Test.activate();

Test.create({test:function() {
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
  * [fail](#fail)
* [Output](#output)
  * [Forwarding](#forwarding)
  * [Buffer](#buffer)
  * [Listener](#listener)
* [Monitoring](#monitoring)
* [Control](#control)
* [Events](#events)


## Task

The smallest component in an integration test, used here as 'task', because
'case' is a keyword in JavaScript. It can be implemented alone, but is always
used in a scenario.

```javascript
Test.activate();

Test.create({test:function() {
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

Optional the maximum runtime of the test item in milliseconds.
Exceeding this limit will cause the test to fail.  
A value greater than 0 is expected, otherwise the timeout is ignored.


### expected

Optional to test the occurrence of defined errors.
The error must occur if the test is successful.
An error object or a RegExp is expected as value.


### ignore

Optional true, if the test is to be ignored.


## Scenario

A scenario is a sequence of a lot of test cases (tasks).

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertTrue(true);
}});
Test.create({name:"example", timeout:1000, test:function() {
    Assert.assertTrue(true);
}});
Test.create({error:Error test:function() {
    throw new Error();
}});
Test.create({error:/^My Error/i, test:function() {
    throw new Error("My Error");
}});
Test.create({ignore:true, test:function() {
    Assert.assertTrue(true);
}});

Test.start();
```

## Suite

A suite is a complex bundle of different test cases, scenarios and other suites.
Usually a suite consists of different files, which then represent a complex
test. An example of a good suite is a cascade of different files und the test
can be started in any file and place. This makes it possible toperform the
integration test on different levels and with different complexity.


## Assert

The test cases are implemented with assertions. The Test-API provides elementary
assertions, you can implement more.  
The function is simple. If an assertion was not ´true´, a error is thrown.


### assertTrue

Asserts that an value is `true`.  
If the assertion is false, an error with optional message is thrown.   
The method has different signatures.

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertTrue(true);
}});
Test.create({test:function() {
    Assert.assertTrue("message", true);
}});

Test.start();
```


### assertFalse

Asserts that an value is `false`, as negation of `Assert.assertTrue(...)`.  
If the assertion is false, an error with optional message is thrown.   
The method has different signatures. 

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertFalse(false);
}});
Test.create({test:function() {
    Assert.assertFalse("message", false);
}});

Test.start();
```


### assertEquals
    
Asserts that two values are equals.  
Difference between equals and same: `=== / ==` or `!== / !=`  
If the assertion is false, an error with optional message is thrown.   
The method has different signatures.

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertEquals(expected, value);
}});
Test.create({test:function() {
    Assert.assertEquals("message", expected, value);
}});

Test.start();
```


### assertNotEquals
    
Asserts that two values are not equals, as negation of `Assert.assertEquals(...)`.  
Difference between equals and same: `=== / ==` or `!== / !=`  
If the assertion is false, an error with optional message is thrown.   
The method has different signatures.

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertNotEquals(unexpected, value);
}});
Test.create({test:function() {
    Assert.assertNotEquals("message", unexpected, value);
}});

Test.start();
```


### assertSame

Asserts that two values are the same.  
Difference between equals and same: `=== / ==` or `!== / !=`  
If the assertion is false, an error with optional message is thrown.   
The method has different signatures.

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertSame(expected, value);
}});
Test.create({test:function() {
    Assert.assertSame("message", expected, value);
}});

Test.start();
```


### assertNotSame        
    
Asserts two values are not the same, as negation of `Assert.assertSame(...)`.  
Difference between equals and same: === / == or !== / !=  
If the assertion is false, an error with optional message is thrown.   
The method has different signatures.

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertNotSame(unexpected, value);
}});
Test.create({test:function() {
    Assert.assertNotSame("message", unexpected, value);
}});

Test.start();
```


### assertNull

Asserts that an value is `null`.  
If the assertion is false, an error with optional message is thrown.   
The method has different signatures. 

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertNull(null);
}});
Test.create({test:function() {
    Assert.assertNull("message", null);
}});

Test.start();
```


### assertNotNull

Asserts that an value is not `null`, as negation of `Assert.assertNull(...)`.  
If the assertion is false, an error with optional message is thrown.   
The method has different signatures. 

```javascript
Test.activate();

Test.create({test:function() {
    Assert.assertNotNull(null);
}});
Test.create({test:function() {
    Assert.assertNotNull("message", null);
}});

Test.start();
```


### fail

Fails a test with an optional message.  
The method has different signatures. 

```javascript
Test.activate();

Test.create({test:function() {
    Assert.fail();
}});
Test.create({test:function() {
    Assert.fail("message");
}});

Test.start();
```


## Output

As a development tool, browsers provide console output that can be used to log
informations.  
Logging supports different channels or levels: LOG, WARN, ERROR and INFO.

```javascript
console.log(message);
console.warn(message);
console.error(message);
console.info(message);
```

To be able to include console output in tests, the activated Test-API supports
forwarding, listeners and buffers for console output.


### Forwarding

The forwarding runs completely in the background and distributes the output to
the browser console output and to the components of the Test-API. In the case
of (I)Frames, the output is forwarded to enclosing or superordinate
window-objects and is accessible there via buffer and listener with an activated
Test-API.


### Buffer

If the Test API is activated, the console object is extended by the buffer
output. The buffer contains caches for the levels: LOG, WARN, ERROR and INFO as
well as methods for emptying.

```javascript
var log   = console.output.log;
var warn  = console.output.warn;
var error = console.output.error;
var info  = console.output.info;

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
passed as the first argument. The additional number of arguments is variable and
depends on the initial call of the corresponding console methods. This often
makes it easier to use `arguments`.


## Monitoring

TODO:


## Control

TODO:


## Events

TODO:


[Extension](extension.md) | [TOC](README.md#test)
