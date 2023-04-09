[Test](test.md) | [Inhalt](README.md#entwicklung)
- - -

# Entwicklung


## Inhalt

* [Server](#server)
* [Build](#build)
* [Test](#test)
  * [Firewall](#firewall)
  * [Browser zum Testen](#browser-zum-testen)
  * [Ablauf](#ablauf)
* [Release](#release)
  * [GitHub](#github)
  * [npmjs.com](#npmjscom)
  * [cdn.jsdelivr.net](#cdnjsdelivrnet)
* [Playground](#playground)


## Server

Das Projekt enth&auml;lt einen komplett vorkonfigurierten Webserver, der am
einfachsten per Kommandozeile aus dem Projektverzeichnis mit dem beiliegenden
Ant-Script gestartet und auch beendet werden kann.

```
ant -f ./development/build.xml start
```
```
ant -f ./development/build.xml stop
```

Folgende wichtigen Adressen sind konfiguriert:

| Adresse                          | Verwendung                    |
|----------------------------------|-------------------------------|
| http://127.0.0.1:8000/           | Testumgebung                  |
| http://127.0.0.1:8000/test       | Testumgebung mit Context-Path |
| http://127.0.0.1:8000/playground | Playground                    |
| http://127.0.0.1:8000/tutorial   | Tutorials                     |

Das Logging ist so konfiguriert, dass die Kommandozeile zur Ausgabe verwendet
wird.

Konfiguriert wird der Webserver &uuml;ber `./server/devwex.ini`. &Auml;nderungen
greifen sofort und der Webserver startet automatisch neu. 


## Build

Das Release wird per Ant-Skript direkt aus dem Wurzelverzeichnis vom Projekt
erstellt.

```
ant -f ./develpoment/build.xml test
```


## Test

Vor einem Release m&uuml;ssen gesch&auml;tzt 500 000 Einzeltests erfolgreich
durchlaufen. Die hohe Zahl ergibt sich aus der Kombination der verschiedenen
Browser-Engines und Szenarien. Dennoch sind &uuml;ber 21000 Behauptungen
(Assertions) real implementiert.


### Firewall
- Windows Defender Firewall (add a rule)
- Name: Seanox Development TCP 8000
- Protocol Type: TCP
- Local Port: 8000
- Remote Port: all
- Remote IP Address: subnet

Erstellung der Regel &uuml;ber die Kommandozeile:

```
set rule_name=Seanox Development TCP 8000
netsh advfirewall firewall delete rule name="%rule_name%"
netsh advfirewall firewall add rule^
    name="%rule_name%"^
    dir=in protocol=tcp localport=8000 localip=any^
    remoteip=localsubnet profile=any action=allow
```

Mehr erfahren:

```
netsh advfirewall firewall delete rule -?
```

### Browser zum Testen

| Engine | Download                                                            |
| ------ |---------------------------------------------------------------------| 
| Blink  | https://portableapps.com/apps/internet/google_chrome_portable       |
| Gecko  | https://portableapps.com/apps/internet/firefox_portable             |
| Goanna | https://www.palemoon.org/download.shtml                             |
| WebKit | not available, native integration required<br>e.g. Safari iOS/MacOS |

&Uuml;bersicht &uuml;ber die Browser-Engines  
https://en.wikipedia.org/wiki/Comparison_of_browser_engines

### Ablauf

- Erstellen vom Release
  `ant -f ./develpoment/build.xml test`
- Starten vom Websever
  `ant -f ./develpoment/build.xml start`
- Zu testende URLs  
  http://127.0.0.1:8000  
  http://127.0.0.1:8000/index.html  
  http://127.0.0.1:8000/test  
  http://127.0.0.1:8000/test/index.html  
  http://127.0.0.1:8000/tutorial  
- Zu testende URLs  
  MS Edge, Google Chrome, Firefox, Palemoon, Safari iOS, Safari MacOS


## Release

### GitHub
- Überprüfen, ob alle Aufgaben (TODOs) erledigt sind
- Alle Tests in allen Engines durchführen (Blink, Gecko, Goanna, WebKit)
- Finalisieren von `CHANGES` und `README.md`
- Finales Release erstellen
- Release per Tag ver&ouml;ffentlichen
- Erstellen vom Release in GitHub, basierens auf dem Tag
- Aktualisieren der Version vom Tutorial

### npmjs.com
- Go to the project directory
- Update the file `package.json`
- Log in with your credentials: `npm login`
- Publish the version: `npm publish --access public`
- In case the old version should be deprecated:  
  e.g. `npm deprecate seanox/aspect-js@"< 1.4.0" "WARNING: This version has been updated to 1.4.0."`

### cdn.jsdelivr.net
Hier muss nichts ge&auml;ndert werden, der Inhalt wird mit npmjs.com synchronisiert.


## Playground

Playground dient dem schnellen Testen und zur Fehleranalyse mit den aktuellen
Quellen, auch ohne ein Build zu erstellen, da die Komponenten einzeln als Link
verwendet werden.

http://127.0.0.1:8000/playground

Zur Verwendung muss der [Server](#server) gestartet sein.


- - -

[Test](test.md) | [Inhalt](README.md#entwicklung)
