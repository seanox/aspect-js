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
