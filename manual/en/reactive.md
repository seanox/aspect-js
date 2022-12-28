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
indirectly in an expression when the value of the property `value` changes.

The ReactProxy works permanently recursively on all objects, in all levels of a
model and also on the objects that are added later as values, even if these
objects do not explicitly use the ReactProxy.

TODO:


- - -

[Components](composite.md) | [TOC](README.md#reactivity-rendering) | [Extension](extension.md)
