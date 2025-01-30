---
title: Comprehensive Guide to Network Scanning with Nmap
categories:
  - OSCP
tags:
  - Nmap 
---

[Nmap (Network Mapper)](https://nmap.org/) is an essential tool for network security assessment and vulnerability analysis. This post provides an in-depth guide to Nmap's key features and applications.


For demonstration purposes, we will use [**127.0.0.1**](http://localhost/)[ (localhost)](http://localhost/) as an example.



### **1. Basic Nmap Scan**



#### 🔹 Basic Port Scan (1,000 Common Ports)



{% raw %}
```shell
nmap 127.0.0.1
```
{% endraw %}


- Checks if the target is online and scans the 1,000 most commonly used ports.
- **Example use case:** When testing a newly deployed local server to ensure it is accessible.


#### 🔹 Full Port Scan (All 65,535 Ports)



{% raw %}
```shell
nmap -p- 127.0.0.1
```
{% endraw %}


- Scans all ports to detect open services.
- **Example use case:** When performing an exhaustive security audit on a machine to check for any unexpected open ports.


#### 🔹 Fast Scan (Top 100 Ports)



{% raw %}
```shell
nmap -F 127.0.0.1
```
{% endraw %}


- Quickly scans only the 100 most commonly used ports.
- **Example use case:** When troubleshooting connectivity issues and checking if essential services (e.g., HTTP, SSH) are available.


### **2. Service and Operating System (OS) Detection**



#### 🔹 Detect Running Services and Versions



{% raw %}
```shell
nmap -sV 127.0.0.1
```
{% endraw %}


- Identifies services running on open ports along with their versions.
- **Example use case:** When verifying software versions on a web server before applying security patches.


#### 🔹 Detect Operating System (OS)



{% raw %}
```shell
nmap -O 127.0.0.1
```
{% endraw %}


- Determines the OS type of the target machine (requires admin privileges).
- **Example use case:** When analyzing a network to understand the OS distribution for compatibility testing.


#### 🔹 Detect Both Services and OS



{% raw %}
```shell
nmap -sV -O 127.0.0.1
```
{% endraw %}


- Combines service and OS detection in one scan.
- **Example use case:** When conducting a preliminary security assessment of a machine to gather essential information.


### **3. Scanning Specific Ports**



#### 🔹 Scan Specific Ports



{% raw %}
```shell
nmap -p 22,80,443 127.0.0.1
```
{% endraw %}


- Checks only the specified ports: SSH (22), HTTP (80), and HTTPS (443).
- **Example use case:** When ensuring that only necessary services are running on a secure system.


#### 🔹 Scan a Range of Ports



{% raw %}
```shell
nmap -p 20-100 127.0.0.1
```
{% endraw %}


- Scans ports 20 to 100.
- **Example use case:** When testing an internal server where services may be running within a known port range.


### **4. Firewall Evasion and Stealth Scanning**



#### 🔹 Scan Without Ping (Bypass Firewall Restrictions)



{% raw %}
```shell
nmap -Pn 127.0.0.1
```
{% endraw %}


- Forces scanning even if the target does not respond to pings.
- **Example use case:** When testing a server protected by a firewall that blocks ICMP requests.


#### 🔹 TCP SYN Scan (Stealth Scan)



{% raw %}
```shell
nmap -sS 127.0.0.1
```
{% endraw %}


- Sends SYN packets without completing a full handshake to avoid detection.
- **Example use case:** When performing a penetration test to see which ports can be probed undetected.


#### 🔹 TCP Connect Scan (For Non-Admin Users)



{% raw %}
```shell
nmap -sT 127.0.0.1
```
{% endraw %}


- Establishes full TCP connections for scanning.
- **Example use case:** When running scans from a non-root user without elevated privileges.


### **5. Scanning an Entire Network**



#### 🔹 Find Live Hosts in a Network



{% raw %}
```shell
nmap -sP 127.0.0.0/24
```
{% endraw %}


- Detects active IP addresses in the specified subnet.
- **Example use case:** When mapping a corporate network to identify all connected devices.


#### 🔹 Find Open Ports in a Network



{% raw %}
```shell
nmap -p 22,80,443 127.0.0.0/24
```
{% endraw %}


- Searches for devices with SSH, HTTP, or HTTPS ports open.
- **Example use case:** When auditing an organization's network for unauthorized services.


### **6. Using NSE (Nmap Scripting Engine)**



#### 🔹 Scan for Vulnerabilities



{% raw %}
```shell
nmap --script=vuln 127.0.0.1
```
{% endraw %}


- Runs vulnerability detection scripts.
- **Example use case:** When assessing a server for known security flaws before deploying it to production.


#### 🔹 Extract Webpage Titles



{% raw %}
```shell
nmap --script=http-title -p 80,443 127.0.0.1
```
{% endraw %}


- Retrieves the title of webpages hosted on the target.
- **Example use case:** When identifying hosted web applications without manually accessing each site.


#### 🔹 Scan for Malware and Backdoors



{% raw %}
```shell
nmap --script=malware 127.0.0.1
```
{% endraw %}


- Checks for signs of malicious software or compromised services.
- **Example use case:** When investigating a potentially infected server for security breaches.


### **7. Saving and Exporting Results**



#### 🔹 Save Output in Plain Text



{% raw %}
```shell
nmap -oN scan_results.txt 127.0.0.1
```
{% endraw %}


- Saves scan results in a text file.
- **Example use case:** When documenting security assessments for further analysis.


#### 🔹 Save Output in XML Format



{% raw %}
```shell
nmap -oX scan_results.xml 127.0.0.1
```
{% endraw %}


- Exports scan results in XML format for automation.
- **Example use case:** When integrating Nmap results with security monitoring tools.


### **📌 Quick Summary (For Reference)**


| Purpose             | Command                          |
| ------------------- | -------------------------------- |
| Basic scan          | `nmap 127.0.0.1`                 |
| Full port scan      | `nmap -p- 127.0.0.1`             |
| Detect services     | `nmap -sV 127.0.0.1`             |
| Detect OS           | `nmap -O 127.0.0.1`              |
| Scan specific ports | `nmap -p 22,80,443 127.0.0.1`    |
| Scan UDP ports      | `nmap -sU -p 53 127.0.0.1`       |
| Bypass firewalls    | `nmap -Pn 127.0.0.1`             |
| Stealth scan        | `nmap -sS 127.0.0.1`             |
| Scan entire network | `nmap -sP 127.0.0.0/24`          |
| Vulnerability scan  | `nmap --script=vuln 127.0.0.1`   |
| Save results        | `nmap -oN results.txt 127.0.0.1` |

undefined
With this guide, you can effectively use Nmap to analyze and secure your network! 🚀


{: .notice .notice—info}

