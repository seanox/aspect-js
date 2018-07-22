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
 *  Project-specific extensions of the test environment.
 *  
 *  TestUtils 1.0 20180722
 *  Copyright (C) 2018 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20180722
 */
if (typeof(TestUtils) === "undefined") {
    
    TestUtils = {};
};

/**
 *  Enhancement of the Test/Assert API
 *  Adds a equals methode for a template to the Assert objects.
 *  Spaces at the beginning and end of lines are ignored.
 */ 
if (Assert.assertEqualsTemplate === undefined)
    Assert.assertEqualsTemplate = function(selector, actual) {
        var element = document.querySelector(selector);
        var content = element.innerHTML.trim().replace(/\t/g, "    ");
        content = content.replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n");
        content = content.replace(/(^\s+)|(\s+$)/gm, "");
        actual = actual.trim();
        actual = actual.replace(/\t/g, "    ");
        actual = actual.replace(/(\r\n)|(\n\r)|[\r\n]/gm, "\n");
        actual = actual.replace(/(^\s+)|(\s+$)/gm, "");
        Assert.assertEquals(content, actual);    
    };
   
/**
 *  Enhancement of the JavaScript API
 *  Adds a method that simulates keyboard input to the Element objects.
 */ 
if (Element.prototype.typeValue === undefined) {
    Element.prototype.typeValue = function(value) {
        this.focus();
        var eventKeyDown = document.createEvent('HTMLEvents');
        eventKeyDown.initEvent("keydown", false, true);
        var eventKeyUp = document.createEvent('HTMLEvents');
        eventKeyUp.initEvent("keyup", false, true);
        var element = this;
        value = (value || "").split("");
        value.forEach(function(digit, index, array) {
            element.dispatchEvent(eventKeyDown);
            element.value = (element.value || "") + digit;
            element.dispatchEvent(eventKeyUp);
        });
    };     
};

/**
 *  Implementation of a redirection of the console when using tests in IFrames.
 *  Redirection  is based on calling message events in the parent document.
 *  The message events are on methods for console levels: INFO, ERROR, WARN, LOG.
 *  
 *      Example:
 *      
 *  var onLog = function(message) {
 *      ....
 *  }
 */
if (typeof(parent) !== "undefined") {
    
    /** 
     *  General method for redirecting console levels.
     *  @param level
     *  @param variants
     */
    console.forward = function(level, variants) {
        
        var invoke;
        if (parent)
            invoke = parent["on" + level.capitalize()];
        if (invoke == null)
            invoke = console.forward[level];
        invoke.apply(null, variants);
    };
    
    /** Redirect for the level: LOG */
    console.forward.log = console.log;
    console.log = function(message) {
        console.forward("log", arguments);
    };
    
    /** Redirect for the level: WARN */
    console.forward.warn = console.warn;
    console.warn = function(message) {
        console.forward("warn", arguments);
    };
    
    /** Redirect for the level: ERROR */
    console.forward.error = console.error;
    console.error = function(message) {
        console.forward("error", arguments);
    };
    
    /** Redirect for the level: INFO */
    console.forward.info = console.info;
    console.info = function(message) {
        console.forward("info", arguments);
    };
    
    /** Registration of events for redirection */
    if (typeof(parent.onFinish) === "function")
        Test.listen(Test.EVENT_FINISH, parent.onFinish);
    if (typeof(parent.onInterrupt) === "function")
        Test.listen(Test.EVENT_INTERRUPT, parent.onInterrupt);
    if (typeof(parent.onPerform) === "function")
        Test.listen(Test.EVENT_PERFORM, parent.onPerform);
    if (typeof(parent.onResponse) === "function")
        Test.listen(Test.EVENT_RESPONSE, parent.onResponse);
    if (typeof(parent.onResume) === "function")
        Test.listen(Test.EVENT_RESUME, parent.onResume);
    if (typeof(parent.onStart) === "function")
        Test.listen(Test.EVENT_START, parent.onStart);
    if (typeof(parent.onSuspend) === "function")    
        Test.listen(Test.EVENT_SUSPEND, parent.onSuspend);
};