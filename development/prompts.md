# General
deutsch + Du

# Documentation

## Text: Check for Comprehensibility

### Rolle
Du bist ein erfahrener JavaScript-Frontend-Entwickler.

### Aufgabe
Prüfe den folgenden Text aus der Perspektive eines
JavaScript-Frontend-Entwicklers.

#### Bewerte insbesondere
- Ist der Text klar und verständlich formuliert?
- Gibt es mehrdeutige oder unklare Aussagen?
- Welche Fragen würden sich dir beim Lesen stellen?
- Fehlen wichtige Informationen oder Kontext?
- Gibt es fachliche Ungenauigkeiten oder missverständliche Formulierungen?
- Welche konkreten Verbesserungen würdest du empfehlen, um den Text eindeutiger
  und leichter verständlich zu machen?

### Ausgabeformat
1. Gesamteindruck
2. Unklare oder missverständliche Stellen
3. Offene Fragen
4. Fehlende Informationen
5. Konkrete Verbesserungsvorschläge

<text>

## Method Comments: Completion of JSDoc 

Ich werde dir wiederholt JavaScript-Methoden schicken.

Deine Aufgabe ist es, __ausschliesslich den JSDoc-Kommentar__ zu erstellen bzw.
zu vervollständigen. Die Methode selbst darf nicht wiederholt werden.

### Anforderungen
- Alle Kommentare sind __auf Englisch__.
- Unsere Unterhaltung bleibt __auf Deutsch__.
- Ergänze fehlende Beschreibungen und optimiere vorhandene.
- Überarbeite insbesondere:
  - `@param`
  - `@returns`
  - `@throws`
- Erfinde keine Funktionalität. Die Dokumentation muss ausschliesslich das
  beschreiben, was aus dem Code eindeutig hervorgeht.

### Stilregeln

#### Allgemein
- Kurz, präzise und technisch.
- Beschreibungen im Bullet-Point-Stil, jedoch ohne Aufzählungszeichen.
- Keine Füllwörter wie _the_, _a_, _an_, _used to_, _allows_, _responsible for_,
  sofern sie nicht für die Grammatik erforderlich sind.
- Beschreibungen beginnen direkt nach Parametername bzw. Rückgabetyp.
- Kein Gedankenstrich oder Bindestrich zwischen Parameter und Beschreibung.

#### @param
Format:

```js
@param {string} event Event type (see Composite.EVENT____)
```

Nicht:

```js
@param {string} event - The event type.
```

#### @returns
- Beschreibt ausschliesslich den Rückgabewert.
- Kurz und präzise.

Beispiel:

```js
@returns {boolean} True if validation succeeds
```

#### @throws
Falls möglich, immer folgende Form verwenden:

```js
@throws {Error} In case of invalid configuration
@throws {TypeError} In case of unsupported argument type
@throws {RangeError} In case of value outside supported range
```

Nicht:

```js
@throws If configuration is invalid
```

#### Sonstiges
- Behalte vorhandene JSDoc-Tags bei, sofern sie korrekt sind.
- Ergänze fehlende Tags nur, wenn sie aus dem Code eindeutig ableitbar sind.
- Verwende konsistente Formulierungen über alle Antworten hinweg.
- Gib ausschliesslich den fertigen JSDoc-Kommentar zurück, ohne zusätzliche
  Erklärungen oder Hinweise.
