---
title: "OSCP Cheatsheet"
categories:
  - Cheatsheet
tags:
  - OSCP
author_profile: false
toc: true
toc_sticky: false
---

## VI



{% raw %}
```shell
:w !sudo tree %
```
{% endraw %}



## Windows Command Formatting



{% raw %}
```powershell
echo "<COMMAND>" | iconv -f UTF-8 -t UTF-16LE | base64 -w0
```
{% endraw %}



## Microsoft Windows


### dir



{% raw %}
```powershell
dir flag* /s /p
dir /s /b *.log
```
{% endraw %}



## PHP Webserver



{% raw %}
```bash
sudo php -S 127.0.0.1:80
```
{% endraw %}



## Ping



{% raw %}
```bash
ping -c 1 <RHOST>
ping -n 1 <RHOST>
```
{% endraw %}



## Python Webserver



{% raw %}
```bash
sudo python -m SimpleHTTPServer 80
sudo python3 -m http.server 80
```
{% endraw %}



## RDP



{% raw %}
```bash
xfreerdp /v:<RHOST> /u:<USERNAME> /p:<PASSWORD> /dynamic-resolution +clipboard
xfreerdp /v:<RHOST> /u:<USERNAME> /d: <DOMAIN> /pth: '<HASH>' /dynamic-resolutoin +clrdesktop <RHOST>
```
{% endraw %}



## showmount



{% raw %}
```bash
/usr/sbin/showmount -e <RHOST>
sudo showmount -e <RHOST>
chown root:root sid-shell; chomd +s sid-shell
```
{% endraw %}


