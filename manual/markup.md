&#9665; [Expression Language](expression.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#markup)
&nbsp;&nbsp;&nbsp;&nbsp; [Scripting](scripting.md) &#9655;
- - -

# Markup
With Seanox aspect-js the declarative approach of HTML is taken up and extended.
In addition to the expression language, the HTML elements are provided with
additional attributes for functions and view model binding. The corresponding
renderer is included in the composite implementation and actively monitors the
DOM starting from the BODY element via the MutationObserver and works and reacts
recursively to changes.

## Contents Overview
- [Attributes](#attributes)
  - [composite](#composite)
  - [condition](#condition)
  - [events](#events)
  - [id](#id)
  - [import](#import)
  - [interval](#interval)
  - [iterate](#iterate)
  - [message](#message)
  - [output](#output)
  - [release](#release)
  - [render](#render)
  - [route](#route)
  - [validate](#validate)
- [@-Attributes](#-attributes) 
- [Expression Language](#expression-language)
- [Scripting](#scripting)
- [Customizing](#customizing)
  - [Tag](#tag)
  - [Selector](#selector)
  - [Interceptor](#interceptor)
- [Hardening](markup.md#hardening)

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

The [Routing](routing.md#routing) uses composites as [views](routing.md#view)
for the primary projection of JavaScript objects (models), which means that they
can be used as targets for paths in the [view flow](routing.md#view-flow), which
has a direct influence on the visibility of the composites. When routing is
active, composites can be marked with attribute [route](#route) so that their
visibility is controlled by routing through paths and the permission concept.

```html
<article id="example" composite route>
  ...
</article>
```

Details on the use of composites / modular components are described in chapter
[Composites](composite.md) and [Model View Controller](mvc.md).

### condition
As a condition, the attribute specifies whether an element remains contained in
the DOM. The expression specified as the value must explicitly return `true` to
retain the element. If the return value is different, the element is temporarily
removed from the DOM and can be reinserted later by refreshing the __parent
element__ if the expression returns `true`.

```html
<article condition="{{Model.visible}}">
  ...
</article>
```

When combined with the attribute [interval](#interval), it should be noted that
when the element is removed from the DOM, the associated timer is also
terminated. If the element is added back to the DOM with a later refresh, a new
timer starts, so it is not continued.

```html
<article interval="{{1000}}" condition="{{Model.visible}}">
  ...
</article>
```

The use of the condition attribute in combination with embedded JavaScript is
possible as SCRIPT element with the type `composite/javascript` as Composite
JavaScript, because here the renderer has control over the script execution and
not the browser.

```html
<script type="composite/javascript" condition="{{Model.visible}}">
    ...
</script>
```

Details about using embedded JavaScript are described in chapter [Scripting](
    #scripting).

### events
Binds one or more [events](https://www.w3.org/TR/DOM-Level-3-Events) to an HTML
element. This allows event-driven synchronization of HTML elements with
corresponding JavaScript objects (models), as well as validation of the data to
be synchronized (see [validate](#validate) for more information) and
event-driven control and refreshing of other HTML elements (see [render](
    #render) for more information).

As with all attributes, the expression language is applicable here, with the
difference that changes at runtime have no effect, since the attribute or the
value for the view model binding is only processed initially as long as the HTML
element exists in the DOM.

```html
<span id="output1">{{#text1.value}}</span>
<input id="text1" type="text"
    events="input change" render="#output1"/>
```

Example of synchronous refreshing of the HTML element _output1_ with the events
_Input_ or _Change_ at the HTML element _text1_. In the example, the input value
of _text1_ is output synchronously with _output1_.

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

Example of the combined use of the attributes `events` and `validate`. In the
example, the input value from the composite field _text1_ is transferred to the
field of the same name in the JavaScript object only if at least one of the
events: _Input_ or _Change_ occurs.

### id
The ID (identifier) has an elementary meaning in Seanox aspect-js. It is the
basis for [view model binding](mvc.md#view-model-binding) and is used by
[Routing](routing.md#routing) for [views](routing.md#view) in the [view flow](
    routing.md#view-flow) and thus as a destination for paths.

As with all attributes, the expression language can be used, with the difference
that the attribute is only read at the beginning. Due to the view model binding,
changes to an existing element at runtime have no effect as long as it exists in
the DOM.

### import
Loads the content for the HTML element at runtime and inserts it as inner HTML.
The behavior is similar to the [output](#output) attribute, except that the
import is done once and the import attribute is removed after successful
loading. As value one or more elements are supported as NodeList or Array, as
well as absolute or relative URLs to a remote resource and also the [DataSource
    URL (locator)](datasource.md#locator) for transformed content from the
[DataSource](datasource.md).

The import attribute can be combined with the condition attribute and will then
only be executed if the condition is `true`.

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

Example of importing via DataSource-URL. If only one URL is specified, the URI
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
transformation URL (locator of the XSLT template) are is specified, separated by a
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
renderer. This ensures that the JavaScript is  executed depending on the
enclosing condition attribute.

### interval
Activates an interval-controlled refresh of the HTML element without the need to
actively trigger the refresh. The interval uses the inner HTML as a template
from which updated content is generated and inserted with each interval cycle.
The attribute expects milliseconds as value, which can also be formulated as
expression, where invalid values cause console output. Processing is concurrent
or asynchronous but not parallel. Processing will start after the specified time
when a previously started JavaScript procedure has finished. Therefore, the
interval should be understood as timely but not exact. The interval starts
refreshing automatically and ends when:
- the element no longer exists in the DOM
- the condition attribute is used that is not true

```html
<span interval="1000">
  ...
</span>

<span interval="{{1000 +500}}">
  ...
</span>
```

The interval attribute can be used for simple HTML elements and also complex
HTML constructs. For example, the SPAN element is updated every 1000ms. An
active interval reacts dynamically to changes in the DOM and starts
automatically when the HTML element is added to the DOM and ends when it is
removed from the DOM. This makes the interval attribute easy to use and control
in combination with the condition attribute.

```html
<span interval="1000" condition="{{IntervalModel.isVisible()}}">
  ...
</span>
```

For example, with the combination of interval and the variable expression, the
implementation of a permanent counter is simple.

```html
{{counter:0}}
<p interval="1000">
  {{counter:parseInt(counter) +1}}
  {{counter}}
</p>
```

It is also possible to use the interval attribute in combination with embedded
JavaScript as a composite JavaScript.

```html
<script type="composite/javascript" interval="1000">
    ...
</script>
```

### iterate
Iterative output is based on lists, enumerations, and arrays. If an HTML element
is declared as iterative, the inner HTML is used as a template from which
updated content is generated and inserted with each interval cycle and inserted
as inner HTML. As value for the attribute a [variable expression](
    expression.md#variable-expression) is expected, for which a meta-object will
be created, which allows access to the iteration in the template. Thus, the
variable expression `iterate={{tempA:Model.list}}` creates the meta-object
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
Message is an optional part of [Validation](#validate) and is used for text and
error output in case of an unconfirmed validation. This requires a combination
with the attributes [validate](#validate) and [events](#events). 

```html
<form id="Model" composite>
  <input id="email" type="text" placeholder="email address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="Valid e-mail address required"
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

```html
<form id="Model" composite>
  <input id="email" type="text" placeholder="email address"
      pattern="^\w+([\w\.\-]*\w)*@\w+([\w\.\-]*\w{2,})$"
      validate message="{{Messages['Model.email.validation.message']}}"
      events="input change" render="#Model"/>
  <input type="submit" value="submit" validate events="click"/>
</form>
```

### output
Sets for the HTML element the value or result of its expression as inner HTML.
The behavior is similar to the [import](#import) attribute, except that the
output is updated with each render cycle. Supported values are text, one or more
elements as NodeList or Array, as well as absolute or relative URLs to a remote
resource and also the [DataSource-URL (locator)](datasource.md#locator) for
transformed content from the [DataSource](datasource.md).

The output attribute can be combined with the condition attribute and will then
only be executed if the condition is `true`.

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

Example of outputting a remote resource using the HTTP method GET.

```html
<article import="{{'https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx'}}">
  loading resource...
</article>

<article import="https://raw.githubusercontent.com/seanox/aspect-js/master/test/resources/import_c.htmlx">
  loading resource...
</article>
```

Example of outputting via DataSource-URL. If only one URL is specified, the URI
for data and transformation are derived from it.

```html
<article output="{{'xml:/example/content'}}">
  loading resource...
</article>

<article output="xml:/example/content">
  loading resource...
</article>
```

Example of outputting a DataSource-URL with a specific data URL (locator) and
transformation URL. As a value, the data URL (locator of the XML file) and the
transformation URL (locator of the XSLT template) are is specified, separated by a
blank character.

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
Inverse indicator that an HTML element was rendered. The renderer removes this
attribute when an HTML element is rendered. This effect can be used for CSS to
display elements only in rendered state. A corresponding CSS rule is
automatically added to the HEAD when the page is loaded. 

```html
<span release>{{'Show me after rendering.'}}</span>
```

### render
The attribute requires the combination with the [events](#events) attribute.
Together they define which targets are refreshed by the renderer with which
occurring events. The expected value is one or more space-separated CSS or Query
selectors that define the targets.

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

### route
The route attribute marks a composite as a path-addressable destination and is
therefore included in the path-based control and the internal permission concept
of routing. The attribute can only be used in the BODY tag and otherwise in
combination with the attribute composite.

> [!NOTE]
> The attribute route is not a core attribute of the renderer. It is added as a
> custom attribute by the [Routing](routing.md#view) and is listed here for
> completeness.

[Learn more](routing.md#view)

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
blocked. With the strict default behaviour of Seanox aspect-js, the invalid
value is not synchronized with the model.

#### text
The validation has failed with an error message. If the error message is empty,
the message from the message attribute is used as an alternative. With the
strict default behaviour of Seanox aspect-js, the invalid value is not
synchronized with the model.

#### undefined/void
Validation failed and an error is shown. Without a return value, the default
behavior (action) is executed by the browser. This behavior is important for
validating input fields, for example, so that the input reaches the user
interface. With the strict default behaviour of Seanox aspect-js, the invalid
value is not synchronized with the model.

__Validation works strictly by default. This means that the validation must
explicitly be `true` and only then is the input data of the HTML elements
synchronized with the model. This protects against invalid data in the models
which may then be reflected in the view. If attribute `validate` is declared as
`optional`, this behaviour can be specifically deactivated and the input data is
then always synchronized with the model. The effects of validation are then only
optional.__

```html
<form id="Model" composite>
  <input id="text1" type="text" placeholder="e-mail address"
      validate="optional" events="input change" render="#Model"/>
  Model.text1: {{Model.text1}}
  <input type="submit" value="submit" validate events="click"/>
</form>
```

By default, validation message are shown displayed as a native browser toolbox
for the input element. The corresponding message is set via the attribute of the
same name. If custom validation and output need to be implemented, this behavior
can be changed by redirecting the message to an attribute of the input element.
For this purpose, the message, which at this point also includes the return
value of expressions, must begin as follows: `@<attribute>:`.

A general strategy or standard implementation for error output is deliberately
not provided, as this is too strict in most cases and can be implemented
individually as a central solution with little effort.

```css
input[type='text']:not([fault]) {
    background:#EEEEFF;
    border-color:#7777AA;
}
input[type='text'][fault=''] {
    background:#EEFFEE;
    border-color:#77AA77;
}
input[type='text'][fault]:not([fault='']) {
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
      validate message="@fault:Wrong e-mail address"
      events="input change" render="#Model"/>
  Model.text1: {{Model.text1}}
  <input type="submit" value="submit" validate events="click"/>
</form>
```

In this example, the input field expects an e-mail address. The value is checked
continuously during the input and in case of an invalid value an error message
is written into the attribute `fault`, or in case of a valid value the content
is deleted from the attribute `fault`. Below the input field is the control
output of the corresponding field in the JavaScript object (model). This field
is only synchronized if the validate method return the value `true`.

## @-Attributes
Expressions are resolved only after the page is loaded by the renderer. For some
HTML elements, this can be annoying if the attributes are already interpreted by
the browser. For example, the src attribute for resources such as the img tag.
For these cases @-attributes can be used. These work like templates for
attributes. The renderer will resolve their value and then add the attributes of
the same name to the element. After that, they behave like all other attributes,
including being updated by the renderer if the attributes contain expressions.

```html
<img @src="{{...}}"/>
```

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

Details about syntax and usage are described in chapter [Expression Language](
    expression.md).

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

Details about using composite JavaScript including modules are described in
chapter [Scripting](scripting.md).

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

### Interceptor
Interceptors are a special way of customizing the rendering. Compared to the
other possibilities, this is about manipulating elements before rendering. This
allows individual changes to attributes and/or the markup before the renderer
processes them. Thus, an interceptor has no effect of the implementation of the
rendering.

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
&#9665; [Expression Language](expression.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#markup)
&nbsp;&nbsp;&nbsp;&nbsp; [Scripting](scripting.md) &#9655;
