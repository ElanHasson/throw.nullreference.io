---
title: WSL Is Just Linux! Upgrading Ubuntu on WSL
date: 2023-01-18T03:20:08.000Z
description: WSL is just Linux! Upgrading Ubuntu 20.04 to Ubuntu 22.04 on WSL is easy!
featured: false
draft: false
comment: true
toc: true
reward: true
pinned: false
carousel: false
categories: [Reminders]
tags: [WSL, Linux, Windows]
series: []
images: []

resources:
- name: 'feature'
  src: 'images/wsl-jammy.png'
---

If you're a Windows user and a Linux enthusiast, you're probably familiar with Windows Subsystem for Linux (WSL). WSL is a feature in Windows 10 that allows you to run Linux command-line tools and utilities directly on Windows, without the need for a virtual machine or dual-booting.

One of the great things about WSL is that it's not some watered-down version of Linux. It's real Linux, and you can treat it just like any other deployment of Linux. That means you can upgrade your WSL distribution just like you would on a standalone Linux machine.

The process of upgrading an existing installation of Ubuntu 20.04 on WSL to Ubuntu 22.04. The process is similar to upgrading any other Linux distribution, and it's easy to do.

Before you begin, it's important to note that upgrading your WSL distribution can be a bit risky. Make sure you have a backup of any important data before proceeding. You can do so by hopping over to the Windows Command Prompt (or PowerShell 😊) and shutting down your instance by running `wsl --terminate <instance name>` and using `wsl --export <instance name> --vhd <path to write new backup.vhdx>` to create a backup of your instance.

Now is also an excellent time to update your WSL kernel. You can do so by running the following command in COmmand Prompt or PowerShell on Windows:

```cmd
C:\Users\Elan> wsl.exe --update

Checking for updates.
The most recent version of Windows Subsystem for Linux is already installed.
```

To upgrade your Ubuntu 20.04 WSL installation to Ubuntu 22.04, you'll need to use the `do-release-upgrade` command. This command is available in the `ubuntu-release-upgrader-core` package, which should be installed by default on Ubuntu 20.04.

I like to make sure I am up to date before I upgrade. To do so, I run the following commands:

```bash
sudo apt update && sudo apt upgrade -y

# reboot if you have to

sudo do-release-upgrade -d
```

This command will start the upgrade process and check for available upgrades. It will also download any necessary files.

Follow the prompts and let the upgrade process complete. It may take some time, depending on your internet connection and the size of the upgrade.

Once the upgrade is complete, you'll be running Ubuntu 22.04 on WSL. You can verify the version by running the command `lsb_release -a`.


![A terminal window showing the output of lsb_release -a and uname -a which shows we're on Ubuntu 22.04 and running on WSL](feature#center)

Upgrading your WSL distribution is similar to upgrading any other Linux distribution and it's easy to do. Just make sure to backup your important data before proceeding.