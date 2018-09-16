# Handbuch

## Motivation

Die Trennung von Web-Anwendungen in Frontend und Backend sowie die Nutzung von
browserbasierter Rich-Clients und Microservices ist mehr als eine
Trenderscheinung. Neben der strikten Trennung der Komponenten, sind
Skalierbarkeit und Modularisierung gute Argumente für diese Art der
Anwendungsarchitektur.

Die Vielzahl an Frameworks für browserbasierter Rich-Clients ist gross.
Sie unterscheiden sich stark in Funktionalität, Komplexität, Grösse und
benötigen teilweise eigene Compiler und Server.

Bei Seanox aspect-js stehen ein minimalistischer Ansatz, der Wunsch nach etwas
JSF-Funktionalität auf der Client-Seite und die einfache Integration ins Markup
und JavaScript im Vordergrund. Es ist ein sportliches Experiment um das
Verständnis von Rendering, Expression Language und Performance.

## Inhalt

* [Expression Language](expression-language.md)
* [Markup](markup.md)
  * [Expression Language](markup.md#expression-language)
  * [Attribute](markup.md#attribute)
    * [condition](markup.md#condition)
    * [events](markup.md#events)
    * [import](markup.md#import)
    * [interval](markup.md#interval)
    * [iterate](markup.md#iterate)
    * [output](markup.md#output)
    * [render](markup.md#render)    
    * [sequence](markup.md#sequence)
    * [validate](markup.md#validate)    
  * [Scripting](markup.md#scripting)
  * [Customizing](markup.md#customizing)
    * [Tag](markup.md#tag)   
    * [Selector](markup.md#selector)
* [Objekt-Bindung](object-binding.md)  
    * [Grundlagen](object-binding.md#grundlagen)
    * [Begriffe](object-binding.md#begriffe)
      * [namespace](object-binding.md#namespace)
      * [scope](object-binding.md#scope)
      * [model](object-binding.md#model)
      * [field](object-binding.md#field)
      * [identifier](object-binding.md#identifier)
    * [Bindung](object-binding.md#bindung)
    * [Validierung](object-binding.md#validierung)  
* [Beispiele](examples.md)
    * [events](examples.md#events)
    * [interval](examples.md#interval)
    * [iterate](examples.md#iterate)
    * [parameter](examples.md#parameter)
