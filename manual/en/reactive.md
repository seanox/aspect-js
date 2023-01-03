[Components](composite.md) | [TOC](README.md#reactivity-rendering) | [Extension](extension.md)
- - -

# Reactivity Rendering

In the reactive approach, changes to the data objects of models trigger a
partial refresh of the consumers in the view. Consumers are all expressions that
have read access to the changed value of a data object. The expressions can be
used in elements and in free text. For reactive rendering, the data objects must
use the ReactProxy, for which `ReactProxy.create(object)` or
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

// Assertions
objectD.objectB !== objectB
objectD.objectB === objectC.objectB
```

__The ReactProxy instance and the original data object are decoupled. Comparable
to a DTO (Data Transfer Object), the ReactProxy instance is independent and has
no direct references to the original data object.__

```javascript
const objectA = {};
const objectB = objectA.toReactProxy();
objectB.value = "B";

// Assertions
typeof objectA.value === "undefined"
typeof objectB.value === "string"
```

Access to the original data object is possible with the method
`ReactProxy.prototype.toObject()`. Here again the note that the data object
exists decoupled from the ReactProxy instance and will not correspond to the
current state of the ReactProxy instance.

From an existing ReactProxy instance, a new ReactProxy instance cannot be
created. The corresponding methods will always return a reference to the
original ReactProxy instance.

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
objectD.objectA === objectA
```


- - -

[Components](composite.md) | [TOC](README.md#reactivity-rendering) | [Extension](extension.md)
