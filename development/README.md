# Development

- [Testing](#testing)
  - [Firewall](#firewall)
  - [Engines Overview](#engines-overview)
  - [Browsers for Testing](#browsers-for-testing)
  - [Scenarios](#scenarios)
- [Publish](#publish)
  - [GitHub](#github)
  - [npmjs.com](#npmjscom)
  - [cdn.jsdelivr.net](#cdnjsdelivrnet)

## Testing

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

### Engines Overview
https://en.wikipedia.org/wiki/Comparison_of_browser_engines

### Browsers for Testing
| Engine | Download                                                      |
| ------ | ------------------------------------------------------------- | 
| Blink  | https://portableapps.com/apps/internet/google_chrome_portable |
| Gecko  | https://portableapps.com/apps/internet/firefox_portable       |
| Goanna | https://www.palemoon.org/download.shtml                       |
| WebKit | not available, native integration required                    |

### Scenarios
There are __48 scenarios__, which are composed as follows:

- Release scripts:  
 `aspect-js.js` and `aspect-js-min.js`  
  For this purpose the file in the release directory must be renamed:
  `aspect-js-min.js` to `aspect-js.js`.
- Server addresses with root directory, with root directory and file, with
  context path and default file and context path and file:  
  http://127.0.0.1:8000  
  http://127.0.0.1:8000/index.html  
  http://127.0.0.1:8000/test  
  http://127.0.0.1:8000/test/index.html
  http://127.0.0.1:8000/tutorial
- To all representatives of the different browser/render engines:  
  MS Edge, Google Chrome, Firefox, Palemoon, Safari iOS, Safari MacOS

## Publish

### GitHub
- Check that all ToDo's are done
- Run all tests
- Finalize CHANGES and README.md
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
  e.g. `npm deprecate seanox@1.3.1 "WARNING: This project has been renamed to aspect-js. Install using @seanox/aspect-js instead."`

### cdn.jsdelivr.net
Nothing needs to be changed here, the content is synchronized with npmjs.com.
