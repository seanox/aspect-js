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

__Reactive is a substitute for another object and controls access to the
original object. Even though Reactive and the object are independent instances,
Reactive is tightly bound to the original object but decoupled and thus
logically separated.__

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
`Object.prototype.reactive()` and `Reactive(...)` always return a reference to
themselves. It is slightly different when another Reactive object is added as a
value to an existing Reactive instance. Then a new Reactive instance is created
based on the original object to be added as Reactive object.

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

As already described, Reactive is a proxy and uses a logical separation to the
original object, which is to be considered as a scheme for bidirectional
synchronization when initiated. In detail, bidirectional synchronization is
monodirectional Set and Get driven. Thus, from the point of view of the Reactive
instance, Get synchronizes from the original object to the Reactive instance
(object -> reactive) and Set synchronizes from the Reactive instance to the
original object (reactive -> object). This means that changes to the original
object are taken into account when accessing data, without this having any
effect on the view.

```javascript
const object = {valueA:1};
const model = Reactive(object);
window.setTimeout(() =>
    object.valueB = 2, 1000);
window.setTimeout(() =>
    console.log(model.valueB), 2000);
window.setTimeout(() =>
    object.valueA = 3, 3000);
window.setTimeout(() =>
    console.log(model.valueA), 4000);
window.setTimeout(() =>
    console.log(model.valueB), 5000);
window.setTimeout(() =>
    model.valueA = 5, 6000);
```

In this example, after approx. 5 seconds, where `model` has read access to the
original object as a reactive instance, the `valueB` is taken over and after
approx. 6 seconds the update of the view is triggered by the write access to
`model`.

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

Another important point concerns the use of further proxies in combination with
Reactive instances. Due to the logical separation, the Reactive instances always
act on the level of the original objects and do so recursively. Thus, adding
proxies on the object levels of the Reactive instances has no effect, since they
are not addressed. Proxies should therefore exist before the creation of the
Reactive instance or can be placed around the Reactive instance later, so that
the proxy and not the Reactive instance then form the model.

```javascript
const object = {a:{valueA:1}};
const model = new Proxy(Reactive(object), {
    ...
});
```

__Prevent misunderstandings__

Reactive itself has no direct influence on the view, but prompts the renderer to
update individual consuming HTML elements, which must be taken into account
especially when expressions use temporary variables, such as those used in the
attribute `iterate`, which is already taken into account automatically.


- - -

[Components](composite.md) | [TOC](README.md#reactivity-rendering) | [Extension](extension.md)
