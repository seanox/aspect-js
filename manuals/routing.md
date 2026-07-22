&#9665; [Model-View-Controller](mvc.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#routing)
&nbsp;&nbsp;&nbsp;&nbsp; [DataSource](datasource.md) &#9655;
- - -

# Routing
The presentation of the page can be organized in Seanox aspect-js in views,
which are addressed via paths (routes). For this purpose, the routing supports a
hierarchical directory structure based on the IDs of the nested composites in
the markup. The routing then controls the visibility and permission for
accessing the views via paths - the so-called view flow. For the view flow and
the permission, the routing actively uses the DOM to insert and remove the views
depending on the situation.

```
+-----------------------------------------------+
|  Page (#)                                     |
|  +-----------------------------------------+  |
|  |  View A (#A)                            |  |
|  |  +-----------------------------------+  |  |
|  |  |  View B (#A#B)                    |  |  |
|  |  |  +-----------------------------+  |  |  |
|  |  |  |  View C (#A#B#C)            |  |  |  |
|  |  |  +-----------------------------+  |  |  |
|  |  +-----------------------------------+  |  |
|  +-----------------------------------------+  |
+-----------------------------------------------+
```

## Contents Overview
- [Terms](#terms)
  - [Page](#page)
  - [View](#view)
  - [View Flow](#view-flow)
- [Navigation](#navigation)
- [Permission Concept](#permission-concept)
- [Interceptors](#interceptors)
- [Paths](#paths)
  - [Root Path](#root-path)
  - [Relative Path](#relative-path)
  - [Absolute Path](#absolute-path)

## Terms

### Page
In a single page application, the page is the elementary framework and runtime
environment of the entire application.

### View
A view is the primary projection of models/components/content. This projection
can contain additional substructures in the form of views and sub-views. Views
can be static, always shown, or with attribute `route` path-controlled. Paths
address the complete chain of nested views and shows the parent views in
addition to the target view.

```html
<body route>
  <header id="header" composite>
    always shown, regardless of the path
  </header>
  <main>
    <div id="a" composite route>
      shown with path #a
    </div>
    <div id="b" composite route>
      shown with path #b
    </div>
    <div id="c" composite route>
      shown with path #c  
    </div>
  </main>
  <footer id="footer" composite>
    always shown, regardless of the path
  </footer>
</body>

```

### View Flow
View flow describes the access control and the sequence of views. The routing
provides interfaces, events, permission concepts and interceptors with which the
view flow can be controlled and influenced.

## Navigation
Navigation is based on paths that use the hash in the URL. It is effected by
changing the URL hash in the browser (direct input), by using hash links and in
JavaScript with `window.location.hash`, `window.location.href`,
`Routing.route(path)` and `Routing.forward(path)`.

```html
<a href="#a#b#c">Goto root + a + b + c</a>
<a href="##">Back to the parent</a>
<a href="##x">Back to the parent + x</a>
```

```javascript
Routing.route("#a#b#c");
Routing.route("##");
Routing.route("##x");
```

```javascript
Routing.forward("#a#b#c");
Routing.forward("##");
Routing.forward("##x");
```

In difference to the navigate method, the forwarding is executed directly
instead of triggering an asynchronous forwarding by changing the location hash.

Relative paths without hash at the beginning are possible, but only work with
`Routing.route(path)` and `Routing.forward(path)`.

```javascript
Routing.route("x#y#z");
Routing.forward("x#y#z");
```

> [!IMPORTANT] 
> __Links with these paths are interpreted by the browser as a reference to
> another page.__

__Explanation of how paths work: Routing will accept all paths (routes). There
are no invalid ones if the paths only use 7-bit ASCII characters. The routing
will cover the destinations that the path covers from the root. Subsequent
components of the path are regarded as path parameters and can be used in the
business logic of the views. If special characters are required for the
parameters, these are URL-encoded.__

## Permission Concept
The permission concept is based on permit methods in the models, which are
called each (re-)rendering if the model has implemented the permit method. Then
the following return values are possible:

### undefined / no return value
The view is shown if the current path covers the path of the view.

### true
The view is shown if any parent views are also shown.

### false
The view and possible sub-views are not shown.

### string
The return value is a path. The view and possible sub-views are not shown and
the page/navigation is redirected to the returned path.

```javascript
const model = {
    permit() {
        if (condition === 1)
            return;        
        if (condition === 2)
            return true;
        if (condition === 3)
            return "#redirect";
        return false;
    }    
};
```

## Interceptors
Interceptors allow custom logic to be executed during navigation before the
target path is evaluated and the view flow is processed by routing. They are
intended to react to specific paths and can influence whether the navigation
continues.

An interceptor is registered with `Routing.customize(path, actor)`. The `path`
can be either an exact route string or a regular expression. The `actor` is a
function that is executed when the specified path matches the requested
navigation target. The actor is a callback that receives the previous hash and
the new hash as parameters.

```javascript
Routing.customize("#a#b#c", (previousHash, newHash) => {
    console.log("Navigation from", previousHash, "to", newHash);
});
````

Interceptors are processed before routing checks the path validity, resolves the
target view and updates the view flow. They are therefore suitable for tasks
such as authentication checks, redirects, route migration or custom navigation
handling.

### Execution order
Interceptors are executed in the order in which they were registered.

All registered interceptors are checked. If an interceptor matches the requested
path, its actor function is executed. Following interceptors receive the
potentially modified navigation target.

An interceptor can stop further processing of the current navigation by
returning `false` explicitly.

```javascript
Routing.customize("#a#b", (oldHash, newHash) => {
    if (!User.isAuthenticated())
        return false;
});
```

Any other return value does not affect routing.

### Path matching
A string interceptor matches the specified path and all nested paths below it.

```javascript
Routing.customize("#a", actor);
```

matches:

```
#a
#a#b
#a#b#c
```

but not:

```
#abc
#c#b#a
```

Regular expressions can be used for more flexible matching:

```javascript
Routing.customize(/^#a#\d+$/, actor);
```

### Navigation changes
Interceptors do not create entries in the routing history. They are executed
within the current navigation event.

An interceptor can modify the target navigation if required. For example,
`window.location.replace()` can be used to replace the current URL without
creating an additional browser history entry.

```javascript
Routing.customize("#old-path", (oldHash, newHash) => {
    window.location.replace("#new-path");
});
```

Because interceptors are executed sequentially, subsequent interceptors operate
on the updated navigation target.

__Interceptors are executed before the normal routing process. Therefore,
changes made by interceptors directly affect the following path resolution and
view rendering.__

## Paths
Paths are used for navigation, routing and controlling the view flow. The target
can be a view or a function if using interceptors. For SPAs (single-page
applications), the anchor part of the URL is used for navigation and routes.

```
https://example.local/example/#path
```

Similar to a file system, absolute and relative paths are also supported here.
Paths consist of case-sensitive words that only use 7-bit ASCII characters above
the space character. Characters outside this range are URL encoded. The words
are separated by the hash character (`#`). 

```
#a#b#c#d
```

Repeated use of the separator (`#`) allows jumps back in the path to be mapped.
The number of repetitions indicates the number of returns in the direction of
the root.

```
#a#b#c#d##x   -> #a#b#c#x
#a#b#c#d###x  -> #a#b#x
#a#b#c#d####x -> #a#x
```

The navigation can be effected by changing the URL hash in the browser (direct
input), by using hash links, and in JavaScript with `window.location.hash`,
`window.location.href`, `Routing.navigate(path)` and `Routing.forward(path)`.

Relative paths without hash at the beginning are possible, but only work with
`Routing.route(path)` and `Routing.forward(path)`.

```javascript
Routing.route("x#y#z");
Routing.forward("x#y#z");
```

> [!IMPORTANT]
> __Links with these paths are interpreted by the browser as a reference to
> another page.__

There are different types of paths, which are explained below.

### Root Path
These paths are empty or contain only one hash character.

```html
<a href="#">Back to the root</a>
```

### Relative Path
Relative Paths are based on the current path and begin with either a word or a
return. Return jumps also use the hash sign, whereby the number of repetitions
indicates the number of return jumps.

```html
<a href="##">Back to the parent</a>
<a href="##x">Back to the parent + x</a>
<a href="###">Back to the parent + parent</a>
<a href="###x">Back to the parent + parent + x</a>
```

Relative paths without hash at the beginning are possible, but only work with
`Routing.route(path)` and `Routing.forward(path)`.

```javascript
Routing.route("x#y#z");
Routing.forward("x#y#z");
```

### Absolute Path
Absolute Paths start with the root, represented by a leading hash sign (`#`).

```html
<a href="#">Back to the root</a>
<a href="#a#b#c">Back to the root + a + b + c</a>
```



- - -
&#9665; [Model-View-Controller](mvc.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#routing)
&nbsp;&nbsp;&nbsp;&nbsp; [DataSource](datasource.md) &#9655;
