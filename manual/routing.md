&#9665; [Model-View-Controller](mvc.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#sitemap)
&nbsp;&nbsp;&nbsp;&nbsp; [Components](composite.md) &#9655;
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

* [Terms](#terms)
  * [Page](#page)
  * [View](#view)
  * [View Flow](#view-flow)
* [Navigation](#navigation)
* [View Flow](#view-flow-1)
* [Permission Concept](#permission-concept)
* [Interceptors](#interceptors)
* [Paths](#paths)
  * [Root Path](#root-path)
  * [Relative Path](#relative-path)
  * [Absolute Path](#absolute-path)


## Terms


### Page

In a single page application, the page is the elementary framework and runtime
environment of the entire application.


### View

A view is the primary projection of models/components/content. This projection
can contain additional substructures in the form of views and sub-views. Views
can be static, always shown, or path-controlled. Paths address the complete
chain of nested views and shows the parent views in addition to the target view.


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
const Model = {
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

TODO:


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
`window.location.href`, `SiteMap.navigate(path)` and `SiteMap.forward(path)`.

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
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#sitemap)
&nbsp;&nbsp;&nbsp;&nbsp; [Components](composite.md) &#9655;
