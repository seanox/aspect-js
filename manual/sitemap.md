&#9665; [Model-View-Controller](mvc.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#sitemap)
&nbsp;&nbsp;&nbsp;&nbsp; [Components](composite.md) &#9655;
- - -

## SiteMap

The representation of the page can be organized in Seanox aspect-js with SiteMap
into faces as well as facets and addressed via virtual paths. For this purpose
SiteMap provides a hierarchical directory structure based on the virtual paths
of all faces and facets. SiteMap controls the access and visualization (showing
and hiding) of the element -- the so-called face flow. Face flow and
visualization work resolutely and actively use the DOM to insert and remove the
faces and facets.

```
+-----------------------------------------------+
|  Page                                         |
|  +-----------------------------------------+  |
|  |  Face A / Partial Face A                |  |
|  |  +-------------+       +-------------+  |  |
|  |  |  Facet A1   |  ...  |  Facet An   |  |  |
|  |  +-------------+       +-------------+  |  |
|  |                                         |  |
|  |  +-----------------------------------+  |  |
|  |  |  Face AA                          |  |  |
|  |  |  +-----------+     +-----------+  |  |  |
|  |  |  | Facet AA1 | ... | Facet AAn |  |  |  |
|  |  |  +-----------+     +-----------+  |  |  |
|  |  +-----------------------------------+  |  |
|  |  ...                                    |  |
|  +-----------------------------------------+  |
|  ...                                          |
|  +-----------------------------------------+  |
|  |  Face n                                 |  |
|  |  ...                                    |  |
|  +-----------------------------------------+  |
+-----------------------------------------------+
```


## Contents Overview

* [Terms](#terms)
  * [Page](#page)
  * [Face](#face)
  * [Facet](#facet)
  * [Face Flow](#face-flow)
* [Configuration](#configuration)
  * [Face Flow](#face-flow-1)
  * [Permissions](#permissions)
  * [Acceptors](#acceptors)
* [Navigation](#navigation)
* [Permission Concept](#permission-concept)
* [Acceptors](#acceptors)
* [Virtual Paths](#virtual-paths)
  * [Root Path](#root-path)
  * [Relative Path](#relative-path)
  * [Absolute Path](#absolute-path)


## Terms


### Page

In a single page application, the page is the elementary framework and runtime
environment of the entire application.


### Face

A face is the primary projection of models/components/content. This projection
can contain additional substructures in the form of faces and sub-faces. Thus,
parent faces become partial faces if the path refers to a sub-face. In this
case, all parent faces are displayed partially, i.e. without their possibly
contained faces.


### Facet

Facets are parts of a face (projection) and usually not an independent
representation. For example, in a search form, the input mask and the result
table can be separate faces of a face. Both faces and facets are accessible via
virtual paths. The path to facets causes the enclosing face to be displayed with
all its parent faces.


### Face Flow

Face flow describes the access control and the sequence of faces and facets. The
SiteMap provides interfaces, permission  concepts and acceptors with which the
face flow can be controlled and influenced.


## Configuration

By default the SiteMap is inactive and has to be activated with the
configuration.

For the configuration of the SiteMap the method `SiteMap.customize(...)` is
used. With this method it is possible to define and register the face-flow 
(paths, faces, facets), the permissions and the acceptors, for which the method
has different signatures.

The configuration can be called several times, even at runtime. The SiteMap
collects all configurations cumulatively. All paths, faces and facets are
summarized, acceptors and permit methods are collected in the order of their
registration. Because the configuration always uses a cumulative state, it is
later not comprehensible how the configuration was created.

The configuration of the SiteMap is only applied if an error-free meta-object is
passed and no errors occur during processing.


### Face Flow

The configuration is based on a meta-object that is passed to method
`SiteMap.customize({meta})`. The keys (string) correspond to the paths and a
path always has a existing face as its target, partial paths without face can be
ignored. The values are arrays with the valid facets for a path or face. Facets
do not need their own path because they are automatically derived and created.

```javascript
SiteMap.customize({...});
```

```javascript
SiteMap.customize({
    "#": ["news", "products", "about", "contact", "legal"],
    "#products#papers": ["paperA4", "paperA5", "paperA6"],
    "#products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "#products#pens": ["pencil", "ballpoint", "stylograph"],
    "#legal": ["terms", "privacy"],
    ...
});
```

__The navigation only accepts paths that are defined in the face-flow. Invalid
paths are forwarded to the next higher known/permitted path, based on the
requested path.__

__Without face flow there are no valid paths. If you want to use components
without face flow in a page with activated SiteMap, you have to declare them as
_static_, otherwise the components will be hidden and thus removed from the
DOM.__

```html
<html>
  <body>
    <form id="model" composite static>
      ...
    </form>
  </body>
</html>
```


### Permissions

The permission concept is based on permit method(s) that are passed together
with meta-object of the face-flow.

```javascript
SiteMap.customize({...}, function(path) {...});
```

```javascript
SiteMap.customize({
    "#": ["news", "products", "about", "contact", "legal"],
    "#products#papers": ["paperA4", "paperA5", "paperA6"],
    "#products#envelope": ["envelopeA4", "envelopeA5", "envelopeA6"],
    "#products#pens": ["pencil", "ballpoint", "stylograph"],
    "#legal": ["terms", "privacy"], ...},

    function(path) {
        ...
    }
});
```

All requested paths pass through the registered permit methods. These decide
what happens to the path. The following return values are expected from each
permit method:

`boolean true` The validation is successful and the iteration via further permit
methods is continued. If all permit methods return true and thus confirm the
path, it is used.

`string` The validation (iteration over further permit-methods) will be aborted
and it will be forwarded to the path corresponding to the string. 

`otherwise` The path is regarded as invalid/unauthorized, the validation
(iteration over further permit-methods) will be aborted and it follows a
forwarding to the original path.


### Acceptors

Acceptors work in a similar way to permit methods. In difference to this, the
methods of the acceptors are only called for those paths whose RegExp pattern
corresponds to the requested path. Also the methods of the acceptors are
expected to return the same kind of values as the [Permissions](#permissions)
methods. 

```javascript
SiteMap.customize(RegExp, function(path) {...});
```

```javascript
SiteMap.customize(/^phone.*$/i, function(path) {
    dial the phone number
});
SiteMap.customize(/^mail.*$/i, function(path) {
    send a mail
});
```


## Navigation

The navigation can be effected by changing the URL hash in the browser (direct
input), by using hash links, and in JavaScript with `window.location.hash`,
`window.location.href`, `SiteMap.navigate(path)` and `SiteMap.forward(path)`.

```html
<a href="#a#b#c">Goto root + a + b + c</a>
<a href="##">Back to the parent</a>
<a href="##x">Back to the parent + x</a>
```

```javascript
SiteMap.navigate("#a#b#c");
SiteMap.navigate("##");
SiteMap.navigate("##x");
```

```javascript
SiteMap.forward("#a#b#c");
SiteMap.forward("##");
SiteMap.forward("##x");
```

In difference to the navigate method, the forwarding is executed directly
instead of triggering an asynchronous forwarding by changing the location hash.

Relative paths without hash at the beginning are possible, but only work with
`SiteMap.navigate(path)`.

```javascript
SiteMap.navigate("x#y#z");
```


## Permission Concept

The permission concept is based on permit methods, which are defined as callback
methods with the configuration of the face-flow. Several permit methods can be
defined, which are verified with each requested path. Only if all permit methods
confirm the requested path with `true`, it will be used and the renderer will
render the dependent faces and facets and makes them visible.
 
More details can be found in chapter [Permissions](#permissions).


## Acceptors

Acceptors are executed together with the permission concept. They have the same
effect, but only affect paths that correspond to a regular expression. Acceptors
can be used to confirm permissions and/or for hidden background activities.

More details can be found in chapter [Acceptors](#acceptors).


## Virtual Paths

Virtual paths are used for navigation, routing and controlling the view flow.
The target can be a view or a function. For SPAs (single-page applications), the
anchor part of the URL is used for navigation and routes.

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
```

Relative paths without hash at the beginning are possible, but only work with
`SiteMap.navigate(path)`.

```javascript
SiteMap.navigate("x#y#z");
```


### Absolute Path

Absolute Paths start with the root, represented by a leading hash sign (#).

```html
<a href="#">Back to the root</a>
<a href="#a#b#c">Back to the root + a + b + c</a>
```

TODO: Description of paths with parameters
TODO: Description of the path dynamic in terms of the matching view as the
      target (PATH_INFO / PATH_TRANSLATED)



- - -
&#9665; [Model-View-Controller](mvc.md)
&nbsp;&nbsp;&nbsp;&nbsp; &#8801; [Table of Contents](README.md#sitemap)
&nbsp;&nbsp;&nbsp;&nbsp; [Components](composite.md) &#9655;
