# Markup

With aspect-js the declarative approach of HTML is taken up and extended.  
In addition to the expression language, the HTML elements are provided with
additional attributes for functions and object binding.  
The corresponding renderer is included in the composite implementation and
monitors the DOM via the MutationObserver and thus reacts recursively to changes
in the DOM.


## Contents Overview
* [Expression Language](#expression-language)
* [Attributes](#attributes)
  * [composite](#composite)
  * [condition](#condition)
  * [events](#events)
  * [import](#import)
  * [interval](#interval)
  * [output](#output)
  * [render](#render)    
  * [validate](#validate)  
* [Scripting](#scripting)
* [Customizing](#customizing)
  * [Tag](#tag)   
  * [Selector](#selector)
  * [Acceptor](#acceptor)


## Expression Language

The expression language can be used in the markup as free text and in the
attributes of the HTML elements. JavaScript and CSS elements are excluded. The
expression language is not supported here.    
When used as free text, pure text (plain text) is always generated as output.
The addition of markup, especially HTML code, is not possible and is only
supported with the attributes `output` and `import`.

```html
<article title="{{Model.title}}">
  {{'Hello World!'}}
  ...
</article>
```

Details about syntax and usage are described in the section
[Expression Language](expressions.md).


## Attributes

The declarative approach in aspect-js is primarily implemented with attributes
and can be used with all HTML elements except `SCRIPT`, which is only supported
with the type `composite/javascript`, and `STYLE`, which is not supported.
The values of the attributes can be static or dynamic when the expression
language is used.  
If an attribute contains an expression, the attribute and the value become
unchangeable, because the renderer sets them again with the updated value of the
initial expression each time it is refreshed (render cycle).


### composite

Marks an element in the markup as [Composite](composites.md).  
Composites are modular components and have a versatile meaning in aspect-js.  
They are used by the [SiteMap](mvc.md#sitemap) as faces, so as targets for
virtual paths in the face flow, which has a direct influence of the visibility
of the composites.
The [Model View Controler](mvc.md#sitemap) supports automatic
[object/model binding](object-binding.md) for composites.  
The resources (CSS, JS, Markup) for composites can be outsourced to the module
directory and are only loaded automatically when necessary.

```html
<article composite>
  ...
</article>
```

The attribute has no value.  
It can be combined with the `static` attribute.  
Then the composite becomes permanently visible as a face independent of virtual
paths.

```html
<article composite static>
  ...
</article>
```

Details on the use of composites / modular components are described in the
sections [Composites](composites.md) and [Model View Controler](mvc.md).


### condition

The condition attribute determines whether an element remains in the DOM. 
The expression passed to the attribute must explicitly return `true` or
`false`. With `false` an element is temporarily removed from the DOM and can
be re-inserted later by refreshing the __parent element__ if the expression
returns `true`.
A peculiarity is the combination with the attribute [interval](#interval),
because with the removal of the element from the DOM also the corresponding
timer is terminated. If the element is inserted into the DOM again with a later
refresh, the timer starts again from the beginning and is therefore not
continued.

```html
<article condition="{{Model.visible}}">
  ...
</article>
```

The use of the condition attribute in combination with embedded JavaScript is
possible as composite JavaScript.

```html
<script type="composite/javascript" condition="{{Model.visible}}">
  ...
</script>
```

Details about using embedded JavaScript are described in the section
[Scripting](#scripting).


### events

This declaration binds one or more events
(see https://www.w3.org/TR/DOM-Level-3-Events) to an HTML element. Events
provide primary functions for event-driven refreshing of other HTML elements
(see [render](#render) for more information), and for validating and
synchronizing and synchronization of HTML elements with the corresponding
JavaScript models (see [validate](#validate) for more information).  

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="mouseup keyup change" render="#output1"/>
```

Example for synchronous refreshing of the HTML element _output1_ by the events
_MouseUp_, _KeyUp_ or _Change_ for the HTML element _text1_. In the example, the
input value of _text1_ is output synchronously with _output1_.

```javascript
var Model = {
    validate: function(element, value) {
        return true;
    },
    text1: ""
};
```

```html
<form id="Model" composite>
  <input id="text1" type="text"
      validate events="mouseup keyup change"/>
  <input type="submit" value="submit"
      validate events="click"/>
</form>
```

Example for the general usage, implementation and function as well as the
interaction of the attributes `events` and `validate`. In the example, the
input value of the composite field text1 is only transferred to the field of the
same name in the JavaScript model if at least one of the events: MouseUp_,
_KeyUp_ or _Change_ and the validation returns the value `true`.


### import

This declaration loads content dynamically and replaces the inner HTML code of
an element. If the content was successfully loaded, the `import` attribute is
removed. The attribute expects as value one element or more elements as NodeList
or Array -- these are then inserted directly, or an absolute or relative URL to
a remote resource that is loaded by HTTP method GET, or a DataSource URL that
loads and transforms content from the DataSource.

In all cases, the import attribute can be combined with the condition attribute
and is only executed when the condition is `true`.

The behavior is similar to the `output` attribute, in difference the import for
the element is executed only once.

```javascript
var Model = {
    publishForm: function() {
        var form = document.createElement("form");
        var label = document.createElement("label");
        label.textContent = "Input";
        form.appendChild(label);
        var input = document.createElement("input");
        input.value = "123";
        input.type = "text";
        form.appendChild(input);
        var submit = document.createElement("input");
        submit.type = "submit";
        form.appendChild(submit);
        return form;
    },
    publishImg: function() {
        var img = document.createElement("img");
        img.src = "https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/smile.png";
        return img;
    }
};
```

```html
<article import="{{Model.publishImg()}}">
  loading image...  
</article>
<article import="{{Model.publishForm()}}">
  loading form...  
</article>
```

Example of importing a remote resource using the HTTP method GET.

```html
<article import="{{'https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import.htmlx'}}">
  loading resource...  
</article>

<article import="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import.htmlx">
  loading resource...  
</article>
```

Example of Importing a DataSource Resource.  
If only one URL is specified, the data and transformation URLs are derived from
it. 

```html
<article import="{{'xml:/example/content'}}">
  loading resource...  
</article>

<article import="xml:/example/content">
  loading resource...  
</article>
```

Example of importing a DataSource resource with a specific data URL and
transformation URL. The blank character is used for separation. Both URLs must
begin with the DataSource protocol and only the first two entries are used from
which the first refers to the data and the second to the transformation.

```html
<article import="{{'xml:/example/data xslt:/example/style'}}">
  loading resource...  
</article>

<article import="xml:/example/data xslt:/example/style">
  loading resource...  
</article>
```

When inserting content from the DataSource, script blocks are automatically
changed to composite/javascript and are only executed by the renderer. This
ensures that the JavaScript is only executed depending on surrounding condition
attributes.

### interval

This declaration activates an interval-controlled refresh of an HTML element
without having to trigger the refresh manually.
As value an interval in milliseconds is expected, which can also be formulated
as expression. Processing is concurrent or asynchronous, but not parallel. Means
that the processing is to start after the set time interval, but this does not
start until a JavaScript procedure started before has been completed. For this
reason, the interval is to be understood as near real-time, but not as exact.  
The interval attribute expects a value in milliseconds. An invalid value causes
console output. The interval starts automatically with refreshing the declared
HTML element and will terminated and/or removed when:  
- The element no longer exists in the DOM.
- the condition attribute is `false  

If an HTML element is declared as an interval, the original inner HTML code is
used as a template, and during the intervals the inner HTML code is first
emptied, the template is generated individually with each interval cycle, and
the result is added to the inner HTML code.

```html
<span interval="1000">
  ...
</span>

<span interval="{{1000 +500}}">
  ...
</span>
```

The SPAN element is refreshed every 1000ms.

The interval attribute can be used for simple HTML elements as well as complex
and nested HTML constructs.

An active interval reacts dynamically when the DOM changes, terminates
automatically when the HTML element is removed from the DOM and restarts when
the HTML element is added to the DOM again. Therefore, the interval attribute is
easy to use and can be controlled with the condition attribute.

```html
<span interval="1000" condition="{{IntevalModel.isVisible()}}">
  ...
</span>
```

With the combination of interval and variable expression, the implementation of
a permanent counter is very simple.

```html
{{counter:0}}
<span interval="1000">
  {{counter:parseInt(counter) +1}}^
  {{counter}}
</span>
```

The interval attribute can be used in combination with embedded JavaScript as
composite JavaScript.

```html
<script type="composite/javascript" interval="1000">
  ...
</script>
```

TODO: