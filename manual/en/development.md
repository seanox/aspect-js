[Test](test.md) | [TOC](README.md#development)
- - -

# Development

TODO:


## Contents Overview

* [Server](#server)
* [Build](#build)
* [Test](#test)
  * [Firewall](#firewall)
  * [Browsers for Testing](#browsers-for-testing)
  * [Procedure](#procedure)
* [Release](#release)
  * [GitHub](#github)
  * [npmjs.com](#npmjscom)
  * [cdn.jsdelivr.net](#cdnjsdelivrnet)
* [Playground](#playground)


## Server

The project contains a completely preconfigured web server, which can be started
and also terminated most simply by command line from the project directory with
the included Ant script.

```
ant -f ./development/build.xml start
```
```
ant -f ./development/build.xml stop
```

The following important addresses are configured:

| Adresse                          | Usage                              |
|----------------------------------|------------------------------------|
| http://127.0.0.1:8000/           | Test environment                   |
| http://127.0.0.1:8000/test       | Test environment with context path |
| http://127.0.0.1:8000/playground | Playground                         |
| http://127.0.0.1:8000/tutorial   | Tutorials                          |

Logging is configured to use the command line for output.

The web server is configured via `./server/devwex.ini`. Changes take effect
immediately and the web server restarts automatically.


## Build

TODO:


## Test

Before a release, an estimated 500 000 individual tests must run successfully.
The high number results from the combination of the different browser engines
and scenarios. Nevertheless, over 21000 assertions are implemented in real
terms.


### Firewall
- Windows Defender Firewall (add a rule)
- Name: Seanox Development TCP 8000
- Protocol Type: TCP
- Local Port: 8000
- Remote Port: all
- Remote IP Address: subnet

Creation of the rule via command line:

```
set rule_name=Seanox Development TCP 8000
netsh advfirewall firewall delete rule name="%rule_name%"
netsh advfirewall firewall add rule^
    name="%rule_name%"^
    dir=in protocol=tcp localport=8000 localip=any^
    remoteip=localsubnet profile=any action=allow
```

For more details see here:

```
netsh advfirewall firewall delete rule -?
```

### Browsers for Testing

| Engine | Download                                                            |
| ------ |---------------------------------------------------------------------| 
| Blink  | https://portableapps.com/apps/internet/google_chrome_portable       |
| Gecko  | https://portableapps.com/apps/internet/firefox_portable             |
| Goanna | https://www.palemoon.org/download.shtml                             |
| WebKit | not available, native integration required<br>e.g. Safari iOS/MacOS |

Overview of engines  
https://en.wikipedia.org/wiki/Comparison_of_browser_engines

### Procedure

TODO:


## Release

### GitHub
- Check that all ToDo's are done
- Run all tests in all Engines (Blink, Gecko, Goanna, WebKit)
- Finalize `CHANGES` and `README.md`
- Create a release
- Publish the release with a tag
- Create a release in GitHub for the tag
- Update the tutorial and create a release there too

### npmjs.com
- Go to the project directory
- Update the file `package.json`
- Log in with your credentials: `npm login`
- Publish the version: `npm publish --access public`
- In case the old version should be deprecated:  
  e.g. `npm deprecate seanox/aspect-js@"< 1.4.0" "WARNING: This version has been updated to 1.4.0."`

### cdn.jsdelivr.net
Nothing needs to be changed here, the content is synchronized with npmjs.com.

TODO:


## Playground

Playground is used for quick testing and bug analysis with the current sources,
even without creating a build, because the components are used individually as a
link.

http://127.0.0.1:8000/playground

To use it, the [server](#server) must be started.


- - -

[Test](test.md) | [TOC](README.md#development)
