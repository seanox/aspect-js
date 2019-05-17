# Einf�hrung

## Was ist Seanox aspect-js?

Gepr�gt durch die guten Erfahrungen aus JSF (Java Server Faces) in Bezug auf
Funktion und einfache Integration ins Markup, entstand der Wunsch nach einer
�hnlichen client-seitigen fullstack L�sung
Bei Seanox aspect-js steht ein minimalistischer Ansatz zur Implementierung von
Single-Page Applications (SPAs) im Vordergrund.  

Das Framework greift den deklarativen Ansatz von HTML auf und erweitert ihn um
Expression Language, Rendering mit zus�tzlichen Attributen,
Objekt/Modell-Bindung, Model View Controller, Resource Bundle, NoSQL-Datasource,
Testumgebung und vieles mehr.


## Erste Schritte

Das Framework besteht aus reinem JavaScript.

Die Releases werden heruntergeladen oder �ber einen Release-Channel eingebunden.
Release-Channel stellen kontinuierlich die neuesten endg�ltigen Hauptversionen
zur Verf�gung, die sind abw�rtskompatibel zur Hauptversion. Seanox aspect-js ist
somit immer auf dem neuesten Stand.

Jedes Release besteht aus zwei Versionen.  
Die Entwickler-Version beinhaltet umfangreiche Kommentare zu Konzeption,
Funktion, Arbeitsweise und Verwendung.  
Die Produktions-Version ist in der Gr�sse optimiert aber nicht verschleiert
(obfuscated).

Erstelle eine HTML-Datei, z.B. _index.html_ und f�ge Seanox apect-js ein.

```html
<!-- development version, includes helpful comments -->
<script src="https://raw.githubusercontent.com/seanox/aspect-js/master/releases/aspect-js-1.x.js"></script>
```

oder

```html
<!-- production version, optimized in size but not obfuscated -->
<script src="https://raw.githubusercontent.com/seanox/aspect-js/master/releases/aspect-js-1.x-min.js"></script>
```

## Arbeitsbereich

Seanox aspect-js agiert ausschliesslich im BODY-Tag, welches selbt mit
einbezogen wird.


## Expression Language

Expressions bzw. die Expression Language (EL) ist ein einfacher Zugang zum
clientseitigen JavaScrript und damit zu den Modellen und Komponenten im
aspect-js. In den Expressions wird die komplette JavaScript-API unterst�tzt, die
mit zus�tzliche Schl�sselw�rtern angereichert ist, womit auch die zahlreichen
arithmetische und logische Operatoren verwendet werden k�nnen.

Die Expression Language kann ab dem BODY-Tag im kompletten Markup als Freitext
sowie in allen Attributen verwendet werden. Ausgenommen sind die Tags STYLE und
SCRIPT, hier wird die Expression Language nicht unterst�tzt.

```html
<body>

</body>
<p>
  Today is {{Calendar.weekday}} and it's {{Clock.time}}.
<p>
```
