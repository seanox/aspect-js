[Expression Language](expression.md) | [TOC](README.md#markup) | [DataSource](datasource.md)
- - -

# Markup

With Seanox aspect-js the declarative approach of HTML is taken up and extended.
In addition to the expression language, the HTML elements are provided with
additional attributes for functions and view model binding. The corresponding
renderer is included in the composite implementation and actively monitors the
DOM starting from the BODY element via the MutationObserver and works and reacts
recursively to changes.


## Contents Overview

* [Attributes](#attributes)
  * [composite](#composite)
  * [condition](#condition)
  * [events](#events)
  * [id](#id)
  * [import](#import)
  * [interval](#interval)
  * [iterate](#iterate)
  * [message](#message)
  * [namespace](#namespace)
  * [notification](#notification)
  * [output](#output)
  * [release](#release)
  * [render](#render)
  * [validate](#validate)
* [Expression Language](#expression-language)
* [Scripting](#scripting)
* [Customizing](#customizing)
  * [Tag](#tag)
  * [Selector](#selector)
  * [Acceptor](#acceptor)
* [Hardening](markup.md#hardening)


## Attributes

In Seanox aspect-js, the declarative approach is implemented with attributes
that can be used and combined in all HTML elements starting from the HTML
element `BODY`, which is included. The values of the attributes can be static or
dynamic with the use of the expression language. If an attribute contains an
expression, the value is updated by the renderer with each refresh (render
cycle) based on the initial expression.


### composite

Marks an element in the markup as a [Composite](composite.md). Composites are
essential components that require an identifier (ID / Composite ID).

```html
<article id="example" composite>
  ...
</article>
```

As a component, composites are composed of various [Ressourcen](
    composite.md#ressourcen) (markup, CSS, JS) that can be outsourced to the
module directory based on the (composite) ID and are only loaded at runtime when
used.

Composites are also the basis for [view model binding](
    mvc.md#view-model-binding), which involves connecting HTML elements in the
markup (view) with corresponding JavaScript objects (models). Models are static
JavaScript objects that provide data, states, and functions for the view,
similar to managed beans and DTOs (Data Transfer Objects). The view as
presentation and user interface for interactions and the model are primarily
decoupled. For the MVVM (Model-View-ViewModel) approach, as an extension to the
MVC ([Model View Controller](mvc.md#model-view-controller)), the controller
links views and models bidirectionally based on the composite IDsand so no
manual implementation and declaration of events, interaction or synchronization
is required.

The [SiteMap](mvc.md#sitemap) uses composites as [faces](mvc.md#face) for the
primary projection of JavaScript objects (models), which means that they can be
used as targets for virtual paths in the [face flow](mvc.md#face-flow), which
has a direct influence on the visibility of the composites. When SiteMap is
active, composites can be marked with the attribute [static](#static), which
makes a composite permanently visible as a face regardless of virtual paths.

```html
<article id="example" composite static>
  ...
</article>
```

Details on the use of composites / modular components are described in the
chapter [Composites](composite.md) and [Model View Controller](mvc.md).


### condition

The condition attribute decides whether an element is kept in the DOM. The
expression specified with the attribute must explicitly return `true` for the
element to be retained in the DOM. If the return value differs, the element is
temporarily removed from the DOM and can be reinserted later by refreshing the
__parent element__ if the expression returns `true`.

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

Details about using embedded JavaScript are described in the chapter
[Scripting](#scripting).


### events

This declaration binds one or more events (see
https://www.w3.org/TR/DOM-Level-3-Events) to an HTML element. Events provide
primary functions for event-driven refreshing of other HTML elements (see
[render](#render) for more information), and for validating and synchronizing
and synchronization of HTML elements with the corresponding JavaScript objects
(models) (see [validate](#validate) for more information).

As with all attributes, the expression language can be used, with the difference
that the attribute is only read at the beginning. Due to the view model binding,
changes to an existing element at runtime have no effect as long as it exists in
the DOM.

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="input change" render="#output1"/>
```

Example for synchronous refreshing of the HTML element _output1_ by the events
_Input_ or _Change_ for the HTML element _text1_. In the example, the input
value of _text1_ is output synchronously with _output1_.

```javascript
const Model = {
    validate(element, value) {
        return true;
    },
    text1: ""
};
```

```html
<form id="Model" composite>
  <input id="text1" type="text"
      validate events="input change"/>
  <input type="submit" value="submit"
      validate events="click"/>
</form>
```

Example for the general usage, implementation and function as well as the
interaction of the attributes `events` and `validate`. In the example, the input
value of the composite field text1 is only transferred to the field of the same
name in the JavaScript object if at least one of the events: _Input_ or _Change_
and the validation returns the value `true`.


### id

The ID (identifier) has an elementary meaning in Seanox aspect-js. It is used by
the SiteMap as faces and facets, i.e. as targets for virtual paths in face flow
and for the view model binding.

As with all attributes, the expression language can be used, with the difference
that the attribute is only read at the beginning. Due to the view model binding,
changes to an existing element at runtime have no effect as long as it exists in
the DOM.


### import

This declaration loads content dynamically and replaces the inner HTML code of
an element. If the content was successfully loaded, the `import` attribute is
removed. The attribute expects as value one element or more elements as NodeList
or Array these are then inserted directly. Also supported is the use of an
absolute or relative URL to a remote resource, which is reloaded and inserted by
HTTP method GET. Also [DataSource URL (locator)](datasource.md#locator) is
supported, which loads and inserts transformed content from the [DataSource](
    datasource.md).

In all cases, the import attribute can be combined with the condition attribute
and is only executed when the condition is `true`.

The behavior is similar to the `output` attribute, in difference the import for
the element is executed only once.

```javascript
const Model = {
    publishForm() {
        const form = document.createElement("form");
        const label = document.createElement("label");
        label.textContent = "Input";
        form.appendChild(label);
        const input = document.createElement("input");
        input.value = "123";
        input.type = "text";
        form.appendChild(input);
        const submit = document.createElement("input");
        submit.type = "submit";
        form.appendChild(submit);
        return form;
    },
    publishImg() {
        const img = document.createElement("img");
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
<article import="{{'https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx'}}">
  loading resource...
</article>

<article import="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx">
  loading resource...
</article>
```

Example of importing via DataSource-URL. If only one URL is specified, the UR
for data and transformation are derived from it. 

```html
<article import="{{'xml:/example/content'}}">
  loading resource...
</article>

<article import="xml:/example/content">
  loading resource...
</article>
```

Example of importing a DataSource-URL with a specific data URL (locator) and
transformation URL. As a value, the data URL (locator of the XML file) and the
transformation URL (locator of the XSLT template) are expected, separated by a
blank character. 

```html
<article import="{{'xml:/example/data xslt:/example/style'}}">
  loading resource...
</article>

<article import="xml:/example/data xslt:/example/style">
  loading resource...
</article>
```

When inserting content from the DataSource, the type of JavaScript blocks is
automatically changed to `composite/javascript` and only executed by the
renderer. This ensures that the JavaScript is only executed depending on the
enclosing condition attribute.


### interval

This declaration activates an interval-controlled refresh of an HTML element
without having to trigger the refresh manually. As value an interval in
milliseconds is expected, which can also be formulated as expression. Processing
is concurrent or asynchronous, but not parallel. Means that the processing is to
start after the set time interval, but this does not start until a JavaScript
procedure started before has been completed. For this reason, the interval is to
be understood as near real-time, but not as exact.

The interval attribute expects a value in milliseconds. An invalid value causes
console output. The interval starts automatically with refreshing the declared
HTML element and will terminated and/or removed when:
- The element no longer exists in the DOM.
- the condition attribute is used that is not `true`

If an HTML element is declared as an interval, the original inner HTML code is
used as a template, and during the intervals the inner HTML code is first
removed, the template is generated individually with each interval cycle, and
the result is inserted as inner HTML code.

```html
<span interval="1000">
  ...
</span>

<span interval="{{1000 +500}}">
  ...
</span>
```

The SPAN element is refreshed every 1000ms. The interval attribute can be used
for simple HTML elements as well as complex and nested HTML constructs.

An active interval reacts dynamically when the DOM changes, terminates
automatically when the HTML element is removed from the DOM and restarts when
the HTML element is added to the DOM again. Therefore, the interval attribute is
easy to use and can be controlled with the condition attribute.

```html
<span interval="1000" condition="{{IntervalModel.isVisible()}}">
  ...
</span>
```

With the combination of interval and variable expression, the implementation of
a permanent counter is very simple.

```html
{{counter:0}}
<p interval="1000">
  {{counter:parseInt(counter) +1}}
  {{counter}}
</p>
```

The interval attribute can be used in combination with embedded JavaScript as
composite JavaScript.

```html
<script type="composite/javascript" interval="1000">
    ...
</script>
```


### iterate

The iterative output is based on lists, enumerations and arrays. If an HTML
element is declared as iterative, the initial inner HTML code is used as
template and during the iteration the inner HTML code is removed first, the
template is generated individually with each iteration and the result is added
to the inner HTML code. 

The iterate attribute expects a [variable expression](
    expression.md#variable-expression), as well as a meta object that allows
access to the iteration and so the variable expression
`iterate={tempA:Model.list}}` creates the meta object
`tempA = {item, index, data}`.

```javascript
const Model = {
    months: ["Spring", "Summer", "Autumn", "Winter"]
};
```

```html
<select iterate={{months:Model.months}}>
  <option value="{{months.index}}">
    {{months.item}}
  </option>
</select>
```


### message

Message is an optional part of [Validation](#validate) and is used for
text/error output in case of an unconfirmed validation. This requires a
combination with the attributes `validate` and `events`. 

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="Valid e-mail address required"
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="{{Messages['Model.text1.validation.message']}}"
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```


### namespace

Comparable to packages in other programming languages, namespaces can be used
for hierarchical structuring of components, resources and business logic.

Although packages are not a feature of JavaScript, they can be used at the
object level by concatenating objects in an object tree. Each level of the
object tree forms a namespace, which can also be considered a domain.

In markup, namespaces are formed from the IDs of nested composites if they use
the attribute `namespace`.

```html
<div id="masterdata" composite namespace>
  <div id="regions" composite namespace>
    namespace: masterdata.regions
  </div>    
</div>
```

If there are other elements with an ID between the composites, they have no
effect.

```html
<div id="masterdata" composite namespace>
  <section id="section">
    <form id="form">
      <div id="regions" composite namespace>
        namespace: masterdata.regions
        elements section and form are ignored 
      </div>
    </form>
  </section>  
</div>
```

Even more special in a namespace chain are composites without the attribute
`namespace.` These composites have a decoupling effect and have no namespace
themselves. New namespaces can then be started within these composites,
independent of parent namespaces.

```html
<div id="Imprint" composite namespace>
  namespace: Imprint
  <div id="Contact" composite>
    namespace: Contact
    <div id="Support" composite namespace>
      namespace: Support
      <div id="Mail" composite namespace>
        namespace: Support.Mail  
      </div>
      <div id="Channel" composite namespace>
        namespace: Support.Channel
      </div>
      ...
    </div>
    <div id="Community" composite namespace>
      namespace: Community
      <div id="Channel" composite namespace>
        namespace: Community.Channel
      </div>
      ...
    </div>
  </div>
</div>
```

This behavior was introduced with the idea of micro-frontends, which use their
own domains and are to be reused in various places. This way, domain-related
components can be implemented in the static world of Seanox aspect-js.

Namespaces also have effects on resources and modules. Thus, namespaces in the
markup initially have only a textual character and can also exist and be used
without a corresponding JavaScript object (model). Only the syntax of the
namespaces is checked in the markup. If this is valid, the namespaces are
applied directly to the path of modules and their resources and extend the path
from the module directory.


```
+ modules
  - common.css
  - common.js
  + community   
    - channel.css
    - channel.html
    - channel.js
    - ...
  - imprint.css
  - imprint.html
  - imprint.js
  + support
    - mail.css
    - mail.html
    - mail.js
    - ...
  - ...
- index.html
```

Details about namespaces are also described in the chapters
[Erweiterung - Namespace](extension.md#namespace) and [Composites - Namespace](
    composite.md#namespace).


### notification

Notification is an optional part of [Validation](#validate) and displays the
error output as an info box (browser feature) on the corresponding element.

This requires a combination with the attributes `validate`, `events` and
`message`.

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="Valid e-mail address required" notification
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```


### output

The attribute output the value or result of its expression as an inner HTML code
for an HTML element. As value are expected one element or more elements as
NodeList or Array, which are then inserted directly. The
[DataSource-URL (locator)](datasource.md#locator) is also supported, which loads
and inserts transformed content from the [DataSource](datasource.md).

In all cases, the output attribute can be combined with the condition attribute
and is only executed when the condition is `true`.

The behavior is similar to the `import` attribute, except that `output` for the
element is executed with each relevant render cycle.

```javascript
const Model = {
    publishForm() {
        const form = document.createElement("form");
        const label = document.createElement("label");
        label.textContent = "Input";
        form.appendChild(label);
        const input = document.createElement("input");
        input.value = "123";
        input.type = "text";
        form.appendChild(input);
        const submit = document.createElement("input");
        submit.type = "submit";
        form.appendChild(submit);
        return form;
    },
    publishImg() {
        const img = document.createElement("img");
        img.src = "https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/smile.png";
        return img;
    }
};
```

```html
<article output="{{Model.publishImg()}}">
  loading image...
</article>
<article output="{{Model.publishForm()}}">
  loading form...
</article>
```

Example of the output via DataSource-URL. If only one URL is specified, the data
and transformation URLs are derived from it. 

```html
<article output="{{'xml:/example/content'}}">
  loading resource...
</article>

<article output="xml:/example/content">
  loading resource...
</article>
```

Example of the output via DataSource-URL with a specific data URL and
transformation URL.

The output attribute expects primarily a data URL which can optionally be
followed by a URL for transformation, separated by a space.

```html
<article output="{{'xml:/example/data xslt:/example/style'}}">
  loading resource...
</article>

<article output="xml:/example/data xslt:/example/style">
  loading resource...
</article>
```

When inserting content from the DataSource, the type of JavaScript blocks is
automatically changed to `composite/javascript` and only executed by the
renderer. This ensures that the JavaScript is only executed depending on the
enclosing condition attribute.


### release

Inverse indicator that an element was rendered. The renderer removes this
attribute when an element is rendered. This effect can be used for CSS to
display elements only in rendered state. A corresponding CSS rule is
automatically added to the HEAD when the page is loaded. 

```html
<span release>{{'Show me after rendering.'}}</span>
```


### render

The `render` attribute requires the combination with the `events` attribute.
Together they define which targets with which occurring events be refreshed. The
`render` attribute expects a CSS selector or query selector as value, which
defines the targets.

```javascript
const Model = {
    _status1: 0,
    getStatus1() {
        return ++Model._status1;
    },
    _status2: 0,
    getStatus2() {
        return ++Model._status2;
    },
    _status3: 0,
    getStatus3() {
        return ++Model._status3;
    }
};
```

```html
Target #1:
<span id="outputText1">{{Model.status1}}</span>
Events: Wheel
<input id="text1" type="text"
    events="wheel"
    render="#outputText1, #outputText2, #outputText3"/>

Target #2:
<span id="outputText2">{{Model.status2}}</span>
Events: MouseDown KeyDown
<input id="text1" type="text"
    events="mousedown keydown"
    render="#outputText2, #outputText3"/>

Target #3:
<span id="outputText3">{{Model.status3}}</span>
Events: MouseUp KeyUp
<input id="text1" type="text"
    events="mouseup keyup"
    render="#outputText3"/>

```

The example contains 3 input fields with different events (`events`) and targets
(`render`), each of which represents an incremental text output and reacts to
corresponding events.

__Alternatively, [reactive rendering](reactive.md) can be used, where changes in
the data objects trigger a partial update of the view.__


### strict

The attribute is used in combination with the attribute [composite](#composite)
and specifies that when loading the resources (CSS, JS, HTML) for a component,
the file name is used in its original notation. The default behavior without the
[strict](#strict) attribute uses the composite id with lower case at the
beginning.

Example of standard behavior:
```html
<div id="SmallExample" composite>
```
```
+ modules
  - smallExample.css
  - smallExample.js
  - smallExample.html
- index.html
```

Example with the attribute [strict](#strict):
```html
<div id="SmallExample" composite strict>
```
```
+ modules
  - SmallExample.css
  - SmallExample.js
  - SmallExample.html
- index.html
```


### validate

The attribute `validate` requires the combination with the attribute `events`.
Together they define and control the synchronization between the markup of a
composite and the corresponding JavaScript object (model), where a property with
the same name must exist as a target for synchronization.

The validation works in two steps and uses the standard HTML5 validation at the
beginning. If this cannot determine deviations from the expected result or if no
HTML5 validation is specified, the validation of the JavaScript object is used
if the model provides a corresponding validate method
`boolean validate(element, value)` and the element to be validated is embedded
in a composite.

The synchronization and the default action of the browser are directly
influenced by the validation. This can use for it four states as return values:
`true`, `not true`, `text`, `undefined/void`.


#### true

The validation was successful. No error is displayed and the default action of
the browser is used. If possible the value is synchronized with the model.


#### not true and not undefined/void

The validation failed and an error is shown. The return value indicates that the
default behavior (action) should not be executed by the browser and is thus
blocked. In this case, a possible value is not synchronized with the model.


#### text

The validation has failed with an error message. If the error message is empty,
the message from the message attribute is used as an alternative. In this case a
possible value is not synchronized with the model.


#### undefined/void

Validation failed and an error is shown. Without a return value, the default
behavior (action) is executed by the browser. This behavior is important for
validating input fields, for example, so that the input reaches the user
interface. In this case, a possible value is not synchronized with the model.

A general strategy or standard implementation for error output is deliberately
not provided, as this is too strict in most cases and can be implemented
individually as a central solution with little effort.

```css
input[type='text']:not([title]) {
    background:#EEEEFF;
    border-color:#7777AA;
}
input[type='text'][title=''] {
    background:#EEFFEE;
    border-color:#77AA77;
}
input[type='text'][title]:not([title='']) {
    background:#FFEEEE;
    border-color:#AA7777;
}
```

```javascript
const Model = {
    validate(element, value) {
        const PATTER_EMAIL_SIMPLE = /^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$/;
        const test = PATTER_EMAIL_SIMPLE.test(value);
        return test || ("Invalid " + element.getAttribute("placeholder"));
    },
    text1: ""
};
```

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      validate events="input change" render="#Model"/>
  Model.text1: {{Model.text1}}
  <input type="submit" value="submit" validate events="click"/>
</form>
```

In this example, the input field expects an e-mail address. The value is checked
continuously during the input and in case of an invalid value an error message
is written into the attribute `title`, or in case of a valid value the content
is deleted from the attribute `title`. Below the input field is the control
output of the corresponding field in the JavaScript object (model). This field
is only synchronized if the validate method return the value `true`.


## Expression Language

The expression language can be used in the markup as free text and in the
attributes of the HTML elements. JavaScript and CSS elements are excluded. The
expression language is not supported here. When used as free text, pure text
(plain text) is always generated as output. The addition of markup, especially
HTML code, is not possible and is only supported with the attributes `output`
and `import`.

```html
<article title="{{Model.title}}">
  {{'Hello World!'}}
  ...
</article>
```

Details about syntax and usage are described in the chapter
[Expression Language](expression.md).


## Scripting

Embedded scripting brings some peculiarity with it. The standard scripting is
executed automatically by the browser and independently of the rendering.
Therefore, markup for rendering has been extended by the additional script type
`composite/javascript`, which uses the normal JavaScript but is not recognized
by the browser in comparison to `text/javascript` and therefore not executed
directly. But the renderer recognizes the JavaScript code and executes it in
every relevant render cycle. In this way, the execution of the SCRIPT element
can also be combined with the `condition` attribute.

```html
<script type="composite/javascript">
    ...
</script>
```

JavaScript is not inserted as an element, but executed directly with the eval
method. Since this uses a custom namespace and not the global namespace, global
variables must be deliberately created in the global namespace, for which the
window or Namespace API should be used.

```html
<script type="composite/javascript">
    Namespace.create("foo", function() {
        ...
    }
</script>
```


## Customizing


### Tag

Custom HTML elements (tags) take over the complete rendering on their own
responsibility. The return value determines whether the standard functions of
the renderer are used or not. Only the return value `false` (not void, not
empty) terminates the rendering for a custom HTML elements without using the
standard functions of the renderer.

```javascript
Composite.customize("foo", function(element) {
    ...
});
```

```html
<article>
  <foo/>
</article>
```


### Selector

Selectors work similar to custom tags. Compared to these, selectors use a CSS
selector to recognize elements. This selector must address the element from the
point of view of the parent element. Selectors are more flexible and
multifunctional. In this way, different selectors with different functions can
affect one element.

Selectors are iterated in order of registration and then their callback methods
are executed. The return value of the callback method determines whether the
iteration is terminated or not. Only the return value `false` (not void, not
empty) terminates the iteration over other selectors and the rendering for the
selector is terminated without using the standard functions.

```javascript
Composite.customize("a:not([href])", function(element) {
    ...
});

Composite.customize("a.foo", function(element) {
    ...
});
```

```html
<article>
  <a class="foo"></a>
</article>
```


### Acceptor

Acceptors are a special way of customizing the rendering. Compared to the other
possibilities, this is about manipulating elements before rendering. This allows
individual changes to attributes and/or the markup before the renderer processes
them. Thus, an acceptor has no effect of the implementation of the rendering.

```javascript
Composite.customize(function(element) {
    ...
});
```

## Hardening

In Seanox aspect-js, a hardening of the markup is provided, which makes it
difficult to manipulate the markup at runtime. On the one hand, hidden markup
with a condition is physically removed from the DOM and on the other hand, the
renderer observes manipulations of attributes at runtime. This observation
is based on a filter with static attributes. Static attributes are read when an
element is created in the DOM and restored when manipulated (deleted/changed).

To configure static attributes, use the method `Composite.customize(...)` and
using the parameter `@ATTRIBUTES-STATICS`. The configuration can be done several
times. The individual static attributes are then merged. All @ parameters are
case insensitive.

```javascript
Composite.customize("@ATTRIBUTES-STATICS", "action name src type");
Composite.customize("@Attributes-Statics", "required");
Composite.customize("@attributes-statics", "method action");
...
```

```html
<form method="POST" action="/service">
  <input type="user" name="user"
  <input type="password" name="password"/>
  <input type="submit"/>
</form>
```


- - -

[Expression Language](expression.md) | [TOC](README.md#markup) | [DataSource](datasource.md)
