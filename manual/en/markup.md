# Markup

With aspect-js the declarative approach of HTML is taken up and extended.  
In addition to the expression language, the HTML elements are provided with
additional attributes for functions and object binding.  
The corresponding renderer is included in the composite implementation and
monitors the DOM via the MutationObserver and thus reacts recursively to changes
in the DOM.


## Contents Overview
* [Expression Language](#expression-language)
* [Attributes](#attributes)
  * [composite](#composite)
  * [condition](#condition)
  * [events](#events)
  * [import](#import)
  * [interval](#interval)
  * [output](#output)
  * [render](#render)    
  * [validate](#validate)  
* [Scripting](#scripting)
* [Customizing](#customizing)
  * [Tag](#tag)   
  * [Selector](#selector)
  * [Acceptor](#acceptor)


## Expression Language

The expression language can be used in the markup as free text and in the
attributes of the HTML elements. JavaScript and CSS elements are excluded. The
expression language is not supported here.    
When used as free text, pure text (plain text) is always generated as output.
The addition of markup, especially HTML code, is not possible and is only
supported with the attributes `output` and `import`.

```html
<article title="{{Model.title}}">
  {{'Hello World!'}}
  ...
</article>
```

Details about syntax and usage are described in the section
[Expression Language](expressions.md).


## Attributes

The declarative approach in aspect-js is primarily implemented with attributes
and can be used with all HTML elements except `SCRIPT`, which is only supported
with the type `composite/javascript`, and `STYLE`, which is not supported.
The values of the attributes can be static or dynamic when the expression
language is used.  
If an attribute contains an expression, the attribute and the value become
unchangeable, because the renderer sets them again with the updated value of the
initial expression each time it is refreshed (render cycle).


### composite

Marks an element in the markup as [Composite](composites.md).  
Composites are modular components and have a versatile meaning in aspect-js.  
They are used by the [SiteMap](mvc.md#sitemap) as faces, so as targets for
virtual paths in the face flow, which has a direct influence of the visibility
of the composites.
The [Model View Controler](mvc.md#sitemap) supports automatic
[object/model binding](object-binding.md) for composites. The resources (CSS,
JS, Markup) for composites can be outsourced to the module directory and are
only loaded automatically when necessary.

```html
<article composite>
  ...
</article>
```

TODO: