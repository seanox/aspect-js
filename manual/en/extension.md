[Components](composite.md) | [TOC](README.md#extension) | [Test](test.md)
- - -

# Extension

TODO: 


## Namespace

Namespace at object level.  
Comparable to packages in other programming languages, namespace can be used to
map hierarchical structures and to group thematically related components and
resources. The implementation happens in JavaScript at object level. This means
that it is not a real element of the programming language, but is represented by
chained static objects. Each level in this object chain represents a namespace.
As is typical for objects, the namespace are separated by a dot. 

```javascript
Namespace.using("app.example");
app.example.Model {
    ...
}
```


TODO:


- - -

[Components](composite.md) | [TOC](README.md#extension) | [Test](test.md)
