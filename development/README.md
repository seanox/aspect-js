# Development

## Testing

### Firewall

- Windows Defender Firewall (add a rule)
- Name: Seanox Development TCP 3000, 3100, 3200
- Protocol Type: TCP
- Local Port: 3000, 3100, 3200
- Remote Port: all
- Remote IP Adress: subnet

Creation of the rule via command line:

```
set rule_name=Seanox Development TCP 3000, 3100, 3200
netsh advfirewall firewall delete rule name="%rule_name%"
netsh advfirewall firewall add rule^
    name="%rule_name%"^
    dir=in protocol=tcp localport=3000,3100,3200 localip=any^
    remoteip=localsubnet profile=any action=allow
```

For more details see here:

```
netsh advfirewall firewall delete rule -?
```

### Engines overview

https://en.wikipedia.org/wiki/Comparison_of_browser_engines

### Browsers for Testing

| Engine | Download                                                      |
| ------ | ------------------------------------------------------------- | 
| Blink  | https://portableapps.com/apps/internet/google_chrome_portable |
| Gecko  | https://portableapps.com/apps/internet/firefox_portable       |
| Goanna | https://www.palemoon.org/download.shtml                       |
| WebKit | not available, native integration required                    |

### Scenarios

There are __56 scenarios__, which are composed as follows:

- Release scripts:  
 `aspect-js.js` and `aspect-js-min.js`  
  For this purpose the file in the release directory must be renamed:
  `aspect-js-min.js` to `aspect-js.js`.
- Server addresses with root directory, with root directory and file, with
  context path and default file and context path and file:  
  http://127.0.0.1:3100  
  http://127.0.0.1:3100/index.html  
  http://127.0.0.1:3200/test  
  http://127.0.0.1:3200/test/index.html  
- To all representatives of the different browser/render engines:  
  MS Edge, Google Chrome, Firefox, Palemoon, Safari iOS, Safari MacOS
