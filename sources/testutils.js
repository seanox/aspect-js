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
 *  TestUtils 1.0 20180421
 *  Copyright (C) 2018 Seanox Software Solutions
 *  Alle Rechte vorbehalten.
 *
 *  @author  Seanox Software Solutions
 *  @version 1.0 20180421
 */
if (typeof(TestUtils) === "undefined") {
    
    TestUtils = {};
};

/**
 *  Enhancement of the Test/Assert API
 *  Adds a equals methode for a template to the Assert objects.
 */ 
if (Assert.assertEqualsTemplate === undefined)
    Assert.assertEqualsTemplate = function(selector, actual) {
        var element = document.querySelector(selector);
        var content = element.innerHTML.trim().replace(/\t/g, '    ');
        actual = actual.trim();
        actual = actual.replace(/\t/g, '    ');
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