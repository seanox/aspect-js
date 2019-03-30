# Model View Controler

TODO:


## Contents Overview

TODO:


## Virtual Paths

TODO:


## SiteMap

Static component for the use of a SiteMap for virtua paths.
SiteMap is a directory consisting of faces and facets that are addressed by
paths.

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

A face is the primary projection of the content. This projection may contain
additional sub-components, in form of facets and sub-faces.

Facets are parts of a face (projection) and are not normally a standalone
component. For example, the input mask and result table of a search can be
separate facets of a face, as can articles or sections of a face. Both face and
facet can be accessed via virtual paths. The path to a facet has the effect that
the face is displayed with any other faces, but the requested facet is displayed
in the visible area and focused.

Faces are also components that can be nested.  
Thus, parent faces become partial faces when the path refers to a sub-face.
A sub-face is presented with all its parent partial faces. If the parent faces
contain additional facets, these facets are not displayed. The parent faces are
therefore only partially presented.

With the SiteMap the structure of faces, facets and the corresponding paths are
described. The SiteMap controls the face flow and the presentation of the
components corresponding to a path.  
This means that you don't have to take care of showing and hiding components
yourself.

The show and hide is hard realized in the DOM.  
This means that if a component is hidden, it is physically removed from the DOM
and only added again when it is displayed.

When it comes to controlling face flow, the SiteMap provides hooks for
permission concepts and acceptors. With both things the face flow can be
controlled and influenced. This way, the access to paths can be stopped and/or
redirected/forwarded  with own logic. 