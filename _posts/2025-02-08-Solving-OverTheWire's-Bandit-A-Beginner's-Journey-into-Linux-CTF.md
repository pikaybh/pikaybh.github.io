---
title: "Solving OverTheWire's Bandit: A Beginner's Journey into Linux CTF"
categories:
  - Wargames
tags:
  - Linux
header:
  overlay_image: assets/images/headers/domokitten.png
  teaser: assets/images/headers/download.png
  caption: I think the kitten is pretty cute :3 [**OverTheWire**](https://overthewire.org){:target="_blank"}
  cta_url: https://overthewire.org/wargames/bandit/
author_profile: false
toc: true
---
## Introduction


[OverTheWire](https://overthewire.org/wargames/)’s [**Bandit**](https://overthewire.org/wargames/bandit/) wargame is an excellent starting point for anyone looking to improve their Linux command-line skills, especially in the context of cybersecurity and Capture The Flag (CTF) challenges. This blog post outlines my experience solving Bandit, the key lessons I learned, and tips for beginners tackling the challenge.


## What is Bandit?


Bandit is a CTF-style wargame hosted on OverTheWire that teaches fundamental Linux security concepts. The challenge consists of multiple levels, each requiring players to find a password that grants access to the next level. These levels introduce various Linux commands, file manipulation techniques, permissions handling, and some basic scripting concepts.


<p class="notice notice--danger">🚧 <strong>Disclaimer</strong> This blog post contains spoilers for the Bandit game. Please proceed with caution if you have not played the game yet.</p>


## Getting Started


To begin, you need SSH access to OverTheWire’s Bandit server. The first level provides credentials to log in:



{% raw %}
```bash
ssh bandit0@bandit.labs.overthewire.org -p 2220
```
{% endraw %}



The password for `bandit0` is provided on the official site, and from there, each level presents a unique problem requiring different Linux utilities to solve.


<p class="notice notice--success">💡 <strong>TIP</strong> Instead of using the standard login command, I used the following format to streamline the process:</p>



{% raw %}
```bash
ssh -p 2220 -l bandit00 bandit.labs.overthewire.org
```
{% endraw %}



Each time I progressed to the next level, I simply recalled the previous command and changed the last digit accordingly, making the login process faster.


## Key Takeaways from Bandit


### 1. Mastering Basic Linux Commands


Many early levels require fundamental Linux commands such as:

- `ls` (list files)
- `cat` (display file contents)
- `cd` (change directory)
- `find` (locate files based on conditions)
- `grep` (search within files)
- `strings` (extract readable text from binary files)

Example:



{% raw %}
```bash
cat readme
```
{% endraw %}



This command simply outputs the password stored in `readme`.


### 2. Understanding Hidden Files and Permissions


Some levels store passwords in hidden files (e.g., filenames starting with `.`) or restrict access based on permissions. The following commands were particularly useful:

- `ls -la` (lists all files, including hidden ones, with detailed permissions)
- `chmod` (modifies file permissions)
- `sudo` (executes commands with superuser privileges, though rarely needed in Bandit)

Example:



{% raw %}
```bash
ls -la
cat .hidden
```
{% endraw %}



This helps find and read hidden files.


### 3. Handling Unusual File Names


Some passwords are hidden in files with special characters, spaces, or unusual names. Escape sequences or quotes are often needed to handle them:



{% raw %}
```bash
cat "filename with spaces"
cat ./-filename
cat $(find . -type f)
```
{% endraw %}



The `find` command is especially useful when a file’s name is unknown.


### 4. Utilizing `ssh` and `scp` for Secure Access


Several levels require transferring files or connecting remotely to retrieve information. Using `scp` (secure copy) was necessary for moving files between local and remote machines.



{% raw %}
```bash
scp -P 2220 banditX@bandit.labs.overthewire.org:/tmp/file ./
```
{% endraw %}



This downloads a file from the remote Bandit server to my local machine.


### 5. Understanding Process Manipulation


Some challenges involve running processes in the background or interacting with ongoing processes. Useful commands include:

- `ps aux` (lists running processes)
- `kill -9 <PID>` (terminates a process)
- `lsof -i` (lists open network connections)

A level involved reading data from a listening port:



{% raw %}
```bash
nc -lvnp 1234
```
{% endraw %}



This establishes a netcat listener, a common technique in penetration testing.


## My Favorite Challenges


While many levels were straightforward, a few stood out:


### Level 4: Retrieving Files Encoded in ASCII Text


A file contained a password in the only human-readable file. The solution involved for loop using:



{% raw %}
```bash
find . -type f -exec file {} + | grep ASCII | cut -d : -f1 | xargs cat
```
{% endraw %}



### Level 5: Find by Size and Type


The password for the next level is stored in a file somewhere under the **inhere** directory and has all of the following properties:

- human-readable
- 1033 bytes in size
- not executable


{% raw %}
```shell
find inhere -type f -size 1033c ! -executable | xargs cat
```
{% endraw %}



### **Level 6: Finding a Password File with Specific Ownership and Size**


The password for the next level is stored somewhere on the server and has all of the following properties:

- Owned by user **bandit7**
- Owned by group **bandit6**
- 33 bytes in size

To locate and display the password, use the following command:



{% raw %}
```shell
find / -type f -user bandit7 -group bandit6 -size 33c 2>/dev/null | xargs cat
```
{% endraw %}


- `/` → Search the entire file system
- `type f` → Look for files (not directories)
- `user bandit7` → Filter files owned by user **bandit7**
- `group bandit6` → Filter files owned by group **bandit6**
- `size 33c` → Find files that are exactly **33 bytes** in size
- `2>/dev/null` → Suppress permission errors
- `xargs cat` → Print the content of the found file

### **Level 8: Finding the Unique Password Line**


The password for the next level is stored in the file **data.txt** and is the only line of text that appears **only once** in the file.


To extract this unique line, use the following command:



{% raw %}
```shell
sort data.txt | uniq -u
```
{% endraw %}



**Explanation:**

- `sort data.txt` → Sorts the file so that duplicate lines are adjacent.
- `uniq -u` → Filters out lines that appear more than once, leaving only the unique line.

### **Level 9: Extracting data**


The password for the next level is stored in the file **`data.txt`**, hidden among various non-human-readable characters. It is one of the **few human-readable strings** and is **preceded by several** **`=`** **characters**.


To extract the password, use the following command:



{% raw %}
```shell
strings data.txt | grep '==' | awk -F '=+' '{print $2}'
```
{% endraw %}


- `strings data.txt` → Extracts human-readable strings from `data.txt`, filtering out non-printable characters.
- `grep '=='` → Filters lines that contain `==`, ensuring only relevant lines are processed.
- `awk -F '==+' '{print $2}'` →
	- `F '=+'` → Uses one or more `=` characters as the field separator.
	- `{print $2}` → Prints the portion of the line after the `=` characters, extracting the password.

### Level 10: Decoding Base64


A file contained a password encoded in Base64. The solution involved decoding it using:



{% raw %}
```bash
cat data.txt | base64 -d
```
{% endraw %}



This revealed the plaintext password. You can see the difference below:



{% raw %}
```shell
bandit10@bandit:~$ cat data.txt
VGhlIHBhc3N3b3JkIGlzIGR0UjE3M2ZaS2IwUlJzREZTR3NnMlJXbnBOVmozcVJyCg==
bandit10@bandit:~$ cat data.txt | base64 -d
The password is <PASSWORD>
```
{% endraw %}



### **Level 11: Decoding a ROT13 Encrypted Password**


The password for the next level is stored in the file **`data.txt`**, where all lowercase (`a-z`) and uppercase (`A-Z`) letters have been **rotated by 13 positions (ROT13 encryption)**.


To decode the password, use the following command:



{% raw %}
```shell
cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```
{% endraw %}


- `cat data.txt` → Displays the content of `data.txt`.
- `tr 'A-Za-z' 'N-ZA-Mn-za-m'` →
	- `tr` (translate) replaces characters using ROT13.
	- `'A-Za-z'` represents all uppercase and lowercase letters.
	- `'N-ZA-Mn-za-m'` shifts each letter **13 places forward**, effectively decoding ROT13.

### **Level 12: Extracting a Password from a Repeatedly Compressed Hexdump**


The password for the next level is stored in `data.txt`, which is a **hexdump** of a file that has been **repeatedly compressed**. To recover the password, follow these steps:


### **Level 12. Step 1: Create a Temporary Working Directory**


Since multiple decompression steps are required, it's best to work in a temporary directory:



{% raw %}
```shell
DIR=$(mktemp -d)
chmod u+w $DIR
cd $DIR
```
{% endraw %}


- `mktemp -d` → Creates a unique temporal directory name.
- `chmod` → Change permission.
- `cd` → Moves into the directory.

### **Level 12. Step 2: Copy and Convert the Hexdump Back to a File**


Copy the `data.txt` file to your working directory:



{% raw %}
```shell
cp ~/data.txt .
```
{% endraw %}



Convert the **hexdump** back into a binary file:



{% raw %}
```shell
xxd -r data.txt > data.bin
```
{% endraw %}


- `xxd -r` → Reverses the hex dump, restoring the original compressed file.

### **Level 12. Step 3: Identify Compression Type and Extract**


Check the file type:



{% raw %}
```shell
file data.bin
```
{% endraw %}



This will return something like:



{% raw %}
```text
data.bin: gzip compressed data, was "file.gz", last modified ...
```
{% endraw %}



Use the correct decompression tool based on the file type:

- **If it’s a gzip file (****`.gz`****):**

	
{% raw %}
```shell
	mv data.bin data.gz
	gunzip data.gz
```
{% endraw %}


- **If it’s a bzip2 file (****`.bz2`****):**

	
{% raw %}
```shell
	mv data.bin data.bz2
	bzip2 -d data.bz2
```
{% endraw %}


- **If it’s a tar archive (****`.tar`** **or** **`.tar.gz`****):**

	
{% raw %}
```shell
	tar xvf data.bin
```
{% endraw %}



Repeat **checking the file type and decompressing** as needed. Some files may be compressed multiple times, so you may need to **repeat the process** multiple times until you get a readable text file.


### **Level 12. Step 4: Retrieve the Password**


Once you've fully extracted the file, use `cat` command:



{% raw %}
```shell
bandit12@bandit:/tmp/tmp.yCXB8kJkVI$ file data8
data8: ASCII text
bandit12@bandit:/tmp/tmp.yCXB8kJkVI$ cat data8
The password is <PASSWORD>
```
{% endraw %}



This will display the password for the next level.


### **Level 13: Accessing** **`bandit14`** **Using an SSH Key**


The password for the next level is stored in:



{% raw %}
```text
/etc/bandit_pass/bandit14
```
{% endraw %}



However, **only user** **`bandit14`** has permission to read it. You are not provided with the password directly, but you have a **private SSH key** that allows you to log in as `bandit14`.


### **Level 13. Step 1: Locate the Private SSH Key**


In your home directory (`~`), there should be a private SSH key, likely named **`sshkey.private`**. Verify this by running:



{% raw %}
```shell
ls -l
```
{% endraw %}




{% raw %}
```shell
-rw-r----- 1 bandit14 bandit13 1679 Sep 19 07:08 sshkey.private
```
{% endraw %}



### **Level 13. Step 2: Use the SSH Key to Switch to** **`bandit14`**


Since `localhost` refers to the current machine, use SSH with the key to log in as `bandit14`:



{% raw %}
```shell
ssh -i sshkey.private bandit14@localhost -p 2220
```
{% endraw %}


- `ssh -i sshkey.private` → Specifies the private key for authentication
- `bandit14@localhost` → Logs in as `bandit14` on the same machine

Then, try logging in again.


### **Level 13. Step 3: Retrieve the Password for** **`bandit15`**


Once logged in as `bandit14`, retrieve the next level’s password with:



{% raw %}
```shell
cat /etc/bandit_pass/bandit14
```
{% endraw %}



This method allows you to **bypass the permissions issue** by logging in as `bandit14` using the SSH key.


### **Level 14: Retrieving the Password via Netcat**


To retrieve the password for the next level, you need to **send** the current level's password to **port 30000** on `localhost`.


[video](https://www.youtube.com/watch?v=7_LPdttKXPc)



{% raw %}
```shell
nc localhost 30000
```
{% endraw %}



### Level 16: Port Forwarding


This level introduced `nc` (netcat) to communicate with a remote service and extract the next password. Understanding networking basics and listening on specific ports was crucial here.


### Level 20: Dealing with Cron Jobs


One challenge required analyzing automated scheduled tasks using `cron`. Checking the `cron.d` directory and inspecting scripts helped identify how passwords were being stored and accessed.



{% raw %}
```bash
cat /etc/cron.d/cronjob
```
{% endraw %}



## Final Thoughts


Bandit is an excellent way to gain hands-on experience with Linux security concepts. It reinforced my knowledge of command-line operations, process handling, networking basics, and file system navigation. For beginners interested in ethical hacking, penetration testing, or CTF challenges, Bandit provides a solid foundation.


### Recommendations for Beginners

1. **Take Notes** – Document each level’s command and solution.
2. **Read the Man Pages** – Use `man <command>` to understand options and parameters.
3. **Experiment Beyond the Challenge** – Try different ways to achieve the same result.
4. **Join CTF Communities** – Forums and Discord groups can help with explanations and hints.

Next, I plan to explore **Narnia** and **Leviathan**, two other OverTheWire wargames that focus on binary exploitation and privilege escalation.


If you're new to Linux security, I highly recommend giving Bandit a try. Happy hacking!


## Reference

- [OverTheWire](https://overthewire.org/wargames/)
- [Bandit](https://overthewire.org/wargames/bandit/)
- [How the Internet Works in 5 Minutes](https://www.youtube.com/watch?v=7_LPdttKXPc)
