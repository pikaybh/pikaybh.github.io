---
title: "Vim Cheatsheet Essential Commands for Developers"
categories:
  - Cheatsheet
tags:
  - OSCP
  - Linux
  - Vim
header:
  overlay_image: assets/images/headers/1_VO98sILElESsQdiq1DLcZQ.png
  teaser: assets/images/headers/1_VO98sILElESsQdiq1DLcZQ.png
  caption: 
author_profile: false
toc: true
---
Vim is a powerful text editor that can significantly enhance productivity when mastered. This cheatsheet covers fundamental to advanced commands, helping both beginners and experienced developers navigate Vim effectively.


## 1. Introduction


Vim is a free and open-source, screen-based text editor that serves as an enhanced version of the original vi editor developed by Bill Joy. Created by Bram Moolenaar, Vim was first released to the public in 1991. The name "Vim" stands for "Vi IMproved," reflecting its numerous enhancements over the original vi. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Vim_%28text_editor%29?utm_source=chatgpt.com))


Vim is designed for use both from a command-line interface and as a standalone application in a graphical user interface. Since its initial release for the Amiga, cross-platform development has made it available on many other systems. In 2018, it was voted the most popular editor among Linux Journal readers. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Vim_%28text_editor%29?utm_source=chatgpt.com))


Vim's forerunner, Stevie (ST Editor for VI Enthusiasts), was created by Tim Thompson for the Atari ST in 1987 and further developed by Tony Andrews and G.R. (Fred) Walter. It was one of the first popularized clones of vi and did not use vi's source code. Basing Vim on the source code for Stevie meant the program could be distributed without requiring the AT&T source license. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Vim_%28text_editor%29?utm_source=chatgpt.com))


Vim has a reputation for its steep learning curve due to its modal nature, where users switch between different modes for editing and command inputs. However, once mastered, it is celebrated for its efficiency and powerful features, making it a favorite among many developers and system administrators.


The enduring rivalry between Vim and Emacs users, often referred to as the "editor war," has become a notable part of hacker culture and the free software community. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Editor_war?utm_source=chatgpt.com))


Bram Moolenaar, the creator and maintainer of Vim, was a Dutch software engineer and activist. He advocated for ICCF Holland, a non-governmental organization supporting AIDS victims in Uganda, and used the popularity of Vim to encourage donations. Moolenaar passed away on August 3, 2023, at the age of 62. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Bram_Moolenaar?utm_source=chatgpt.com))


Now, let’s learn about how to use Vim commands.


## 2. Commands


### 2. 1. Basics


| Command        | Description                               |
| -------------- | ----------------------------------------- |
| `vim filename` | Open a file in Vim                        |
| `:q`           | Quit Vim                                  |
| `:q!`          | Quit without saving                       |
| `:w`           | Save file                                 |
| `:wq` or `ZZ`  | Save and quit                             |
| `:x`           | Save and quit (only if changes were made) |
| `i`            | Enter Insert mode                         |
| `Esc`          | Exit Insert mode                          |


### 2. 2. Navigation


| Command  | Description                                       |
| -------- | ------------------------------------------------- |
| `h`      | Move left                                         |
| `l`      | Move right                                        |
| `j`      | Move down                                         |
| `k`      | Move up                                           |
| `0`      | Move to the beginning of the line                 |
| `^`      | Move to the first non-blank character of the line |
| `$`      | Move to the end of the line                       |
| `gg`     | Go to the beginning of the file                   |
| `G`      | Go to the end of the file                         |
| `5G`     | Go to line 5 (replace 5 with any line number)     |
| `Ctrl-d` | Scroll down half a screen                         |
| `Ctrl-u` | Scroll up half a screen                           |
| `Ctrl-f` | Scroll down a full screen                         |
| `Ctrl-b` | Scroll up a full screen                           |


### 2. 3. Editing


| Command   | Description                                          |
| --------- | ---------------------------------------------------- |
| `x`       | Delete character under the cursor                    |
| `dd`      | Delete (cut) the current line                        |
| `yy`      | Copy (yank) the current line                         |
| `p`       | Paste after the cursor                               |
| `P`       | Paste before the cursor                              |
| `u`       | Undo the last change                                 |
| `Ctrl-r`  | Redo the last undone change                          |
| `r<char>` | Replace the character under the cursor with `<char>` |
| `cw`      | Change the current word                              |
| `ciw`     | Change the inner word                                |
| `C`       | Change to the end of the line                        |
| `ddp`     | Swap current line with the next                      |
| `xp`      | Swap adjacent characters                             |


### 2. 4. Search and Replace


| Command            | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| `/pattern`         | Search forward for `pattern`                                    |
| `?pattern`         | Search backward for `pattern`                                   |
| `n`                | Repeat last search forward                                      |
| `N`                | Repeat last search backward                                     |
| `:%s/old/new/g`    | Replace all occurrences of `old` with `new`                     |
| `:%s/old/new/gc`   | Replace with confirmation                                       |
| `:.,$s/old/new/g`  | Replace `old` with `new` from the current line to the last line |
| `:.,+5s/old/new/g` | Replace `old` with `new` from the current line to 5 lines down  |


### 2. 5. Visual Mode


| Command  | Description                                  |
| -------- | -------------------------------------------- |
| `v`      | Start visual mode (character-wise selection) |
| `V`      | Start visual line mode                       |
| `Ctrl-v` | Start visual block mode                      |
| `y`      | Yank (copy) selection                        |
| `d`      | Delete selection                             |
| `>`      | Indent selection                             |
| `<`      | Un-indent selection                          |


### 2. 6. Buffers, Windows, and Tabs


| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `:e filename`      | Open another file in the same window |
| `:bn`              | Go to next buffer                    |
| `:bp`              | Go to previous buffer                |
| `:bd`              | Close current buffer                 |
| `:sp filename`     | Open a file in a horizontal split    |
| `:vs filename`     | Open a file in a vertical split      |
| `Ctrl-w w`         | Switch between split windows         |
| `Ctrl-w q`         | Close current window                 |
| `:tabnew filename` | Open a file in a new tab             |
| `gt`               | Go to next tab                       |
| `gT`               | Go to previous tab                   |


### 2. 7. Macros and Registers


| Command    | Description                                  |
| ---------- | -------------------------------------------- |
| `q<char>`  | Start recording macro into register `<char>` |
| `q`        | Stop recording macro                         |
| `@<char>`  | Play back macro stored in `<char>` register  |
| `@@`       | Repeat last macro                            |
| `"<char>p` | Paste from register `<char>`                 |


### 2. 8. Advanced Commands


| Command               | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `:set number`         | Show line numbers                                          |
| `:set relativenumber` | Show relative line numbers                                 |
| `:set ignorecase`     | Ignore case in searches                                    |
| `:set smartcase`      | Case-sensitive search if uppercase is used                 |
| `:set hlsearch`       | Highlight search results                                   |
| `:noh`                | Clear search highlights                                    |
| `:set autoindent`     | Enable automatic indentation                               |
| `:set expandtab`      | Convert tabs to spaces                                     |
| `:set tabstop=4`      | Set tab width to 4 spaces                                  |
| `:set shiftwidth=4`   | Set indentation width to 4 spaces                          |
| `:set wrap`           | Enable line wrapping                                       |
| `:set nowrap`         | Disable line wrapping                                      |
| `:w !sudo tee %`      | Save file with sudo when opened without proper permissions |


## 3. Conclusion


Vim is an incredibly efficient editor when properly mastered. This cheatsheet provides a foundation for improving workflow, whether performing basic editing or advanced text manipulation. Practice these commands regularly, and you will unlock Vim's full potential!


## Reference

- [Wikipedia](http://en.wikipedia.org/)
