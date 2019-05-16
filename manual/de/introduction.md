# Einführung

## Was ist Seanox aspect-js?

Geprägt durch die guten Erfahrungen aus JSF (Java Server Faces) in Bezug auf
Funktion und einfache Integration ins Markup, entstand der Wunsch nach einer
ähnlichen client-seitigen fullstack Lösung
Bei Seanox aspect-js steht ein minimalistischer Ansatz zur Implementierung von
Single-Page Applications (SPAs) im Vordergrund.  

Das Framework greift den deklarativen Ansatz von HTML auf und erweitert ihn um
Expression Language, Rendering mit zusätzlichen Attributen,
Objekt/Modell-Bindung, Model View Controller, Resource Bundle, NoSQL-Datasource,
Testumgebung und vieles mehr.


## Erste Schritte

Das Framework besteht aus reinem JavaScript.

Die Releases bestehen aus einer Datei, die heruntergeladen oder über einen
Release-Channel eingebunden wird. Release-Channel stellen kontinuierlich die
neuesten endgültigen Hauptversionen zur Verfügung, die sind abwärtskompatibel
zur Hauptversion. Seanox aspect-js ist somit immer auf dem neuesten Stand.

Jedes Release besteht aus zwei Versionen. Die Entwickler-Version beinhaltet
umfangreiche Kommentare zu Konzeption, Funktion, Arbeitsweise und Verwendung.
Die Produktions-Version ist in der Grösse optimiert aber nicht verschleiert
(obfuscated) .

Erstelle eine HTML-Datei, z.B. index.html und füge Seanox apect-js ein.

```html
<!-- development version, includes helpful comments -->
<script src="https://github.com/seanox/aspect-js/raw/master/releases/aspect-js-1.x.js"></script>
```

or

```html
<!-- production version, optimized in size but not obfuscated -->
<script src="https://github.com/seanox/aspect-js/raw/master/releases/aspect-js-1.x-min.js"></script>
```

TODO:
