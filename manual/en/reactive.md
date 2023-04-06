[Components](composite.md) | [TOC](README.md#reactivity-rendering) | [Extension](extension.md)
- - -

# Reactivity Rendering

In the reactive approach, changes to the data objects (models) trigger a partial
refresh of the consumers in the view. Consumers are all expressions that have
read access to the changed value of a data object. In the view, expressions can
be used in the HTML elements and in the free text. The data objects must then
use `Reactive(object)` or `Object.prototype.reactive()` for reactive rendering.

```javascript
const Model = {
    value: ...
}.reactive();
```

In this example, the renderer automatically updates all HTML elements in the
DOM, which includes free-text that uses the value property from the model
directly or indirectly in an expression when the value of the value property
changes or, more precisely, when a changed value has been set final in the data
object, which can be relevant when using getters and setters.

__The reactive behavior is based on notifications within Reactive that are used
to trigger the rendering. In order to establish the notifications, Reactive must
know the consumers of the data, for which it collects the necessary information
when parsing and rendering the markup, which also works for markup that is only
inserted at runtime. Thus, Reactive must always exist before the consumers.__

Reactive rendering can be stopped by selectively deleting reactive instances
with the `delete` method.

Reactive works permanently recursively on all object levels and also on the
objects which are added later as values. Even if these objects do not explicitly
use Reactive, new instances are created for the referenced objects. Initiating
objects and reactive models are logically decoupled and are synchronized
bidirectionally. In contrast, views and reactive models, like models internally,
use proxies that behave and can be used like the initiating originals. However,
proxies are separate instances that are compatible but not identical to the
initiating object. This logical separation is necessary so that the renderer can
generate appropriate notifications when data changes and thus update the
consumers in the view.

```javascript
const objectA = {}
const objectB = {}
objectA.objectB = objectB;

// Assertions
objectA.objectB === objectB

const objectC = objectA.reactive();

// Assertions
objectC.objectB !== objectA
objectC.objectB !== objectB
objectA.objectB === objectB

const objectD = ({}).reactive();
objectD.objectB = objectB;
objectD.objectB.text = "A";

// Assertions
objectD.objectB !== objectB;
objectD.objectB === objectC.objectB;
objectD.objectB.text === "A";
objectC.objectB.text === "A";

const objectE = {text: "A"};
const objectF = objectE.reactive();
objectF.text = "B";

// Assertions
objectE.text === "B";
objectF.text === "B";

objectE.text = "C";

// Assertions
objectE.text === "C"
objectF.text === "C"

```

__Reactive is a substitute for another object and controls access to the
original object. Even though Reactive and the object are independent instances,
Reactive is tightly bound to the original object and yet decoupled.__

```javascript
const objectA = {};
const objectB = objectA.reactive();
objectB.value = "B";

// Assertions
typeof objectA.value === "string"
typeof objectB.value === "string"
objectA.value === objectB.value
```

From an existing Reactive instance no new Reactive instance can be created.
`ReactProxy.prototype.reactive()` will always return a reference to itself. It
is slightly different when another ReactProxy object is added as a value to an
existing ReactProxy instance. Then a new ReactProxy instance is created based on
the original object to be added as ReactProxy object.

```javascript
const objectA = ({}).reactive();
const objectB = objectA.reactive();
const objectC = Reactive(objectA);

// Assertions
objectA === objectB
objectA === objectC
objectB === objectC

const objectD = ({objectA}).reactive();

// Assertion
objectD.objectA === objectA

objectC.objectB = objectB;

// Assertion
objectC.objectB === objectB
```

__Prevent misunderstandings__

The ReactProxy itself has no direct influence on the view, instead it requests
the renderer to update specific consuming HTML elements, which is especially
important to note when expressions use temporary variables, such as those used
with the attribute `iterate`.

HTML elements with the attribute `iterate` are automatically considered and so
in this case the HTML element at the top with the attribute `iterate` is always
updated so that the temporary variables are available in all expressions.


- - -

[Components](composite.md) | [TOC](README.md#reactivity-rendering) | [Extension](extension.md)
