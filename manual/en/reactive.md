[Components](composite.md) | [TOC](README.md#reactivity-rendering) | [Extension](extension.md)
- - -

# Reactivity Rendering

In the reactive approach, changes to the data objects (models) trigger a partial
refresh of the consumers in the view. Consumers are all expressions that have
read access to the changed value of a data object. The expressions can be used
in elements and in free text. For reactive rendering, the data objects must use
the ReactProxy, for which `ReactProxy.create(object)` or
`Object.prototype.toReactProxy()`, which provides each object instance, are
used.

```javascript
let Model = {
    value: ...
}.toReactProxy();
```

In this example, the renderer will automatically update all elements in the DOM,
which includes free-text that uses the property value from the model directly or
indirectly in an expression when the value of the property `value` changes or
more exactly, if the value in the data object was set final, which can be
relevant when using getters and setters.

__The reactive behavior is based on notifications within the ReactProxy to
trigger the rendering. To set up the notifications, the ReactProxy must know the
consumers of the data, for which it collects the necessary information when
parsing and rendering the markup, which also works for markup that is inserted
at runtime. Thus, the ReactProxy must always exist before the consumers.__

Reactive rendering can be stopped by selectively deleting ReactProxy instances
with the `delete` method.

The ReactProxy works permanently recursively on all object levels and also on
objects that are added later as values, even if they do not explicitly use the
ReactProxy, new instances are created for the referenced objects.

```javascript
const objectA = {}
const objectB = {}
objectA.objectB = objectB;

// Assertions
objectA.objectB === objectB

const objectC = objectA.toReactProxy();

// Assertions
objectC.objectB === objectA.objectB
objectC.objectB !== objectB
objectA.objectB !== objectB

const objectD = ({}).toReactProxy();
objectD.objectB = objectB;
objectD.objectB.text = "A";

// Assertions
objectD.objectB !== objectB
objectD.objectB !== objectC.objectB
objectD.objectB.text === "A"
objectC.objectB.text === "A"
```

__The ReactProxy is a substitute for another object and controls access to the
original object. Even though the ReactProxy and the object are independent
instances, the ReactProxy is tightly coupled to the original object.__

```javascript
const objectA = {};
const objectB = objectA.toReactProxy();
objectB.value = "B";

// Assertions
typeof objectA.value === "string"
typeof objectB.value === "string"
objectA.value === objectB.value
```

Access to the original data object is possible with the method
`ReactProxy.prototype.toObject()`.

From an existing ReactProxy instance, a new ReactProxy instance cannot be
created. `ReactProxy.prototype.toReactProxy()` will always return a reference to
itself. The situation is slightly different when another ReactProxy object is
added as a value to an existing ReactProxy instance. Then a new ReactProxy
instance is created based on the original object to be added as ReactProxy
object.

```javascript
const objectA = ({}).toReactProxy();
const objectB = objectA.toReactProxy();
const objectC = ReactProxy.create(objectA);

// Assertions
objectA === objectB
objectA === objectC
objectB === objectC

const objectD = ({objectA}).toReactProxy();

// Assertion
objectD.objectA !== objectA

objectC.objectB = objectB;

// Assertion
objectC.objectB !== objectB
```

__Prevent misunderstanding__

The ReactProxy itself has no direct influence on the view, but instead requests
the renderer to update specific consuming elements, which is especially
important must be taken into account especially when expressions use temporary
variables, such as those used with the `iterate` attribute.

Elements with the attribute iterate are automatically taken into account and in
this case the top element with the attribute iterate is always updated so that
the temporary variables are available in all expressions.



- - -

[Components](composite.md) | [TOC](README.md#reactivity-rendering) | [Extension](extension.md)
