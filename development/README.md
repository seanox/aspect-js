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
    remoteip=localsubnet profile=domain action=allow
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
