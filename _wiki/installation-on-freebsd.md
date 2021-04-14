---
title: Installation on FreeBSD
---
## Installer for FreeBSD ##
NZBGet's [Download page](download) provides installer for FreeBSD which includes precompiled binaries for CPU-architecture x86_64. These binaries require only FreeBSD 9.1 or later (but may work on older versions too) and do not have any other library dependencies.

**NOTE**: If you prefer to compile yourself see [Installation on POSIX](installation-on-posix).

## Automatic installation ##
- Download the installer package from [Download page](download).
You can download the installer via web-browser or directly on your device with the following command:
 ```
wget https://nzbget.net/download/nzbget-latest-bin-freebsd.run
 ```

- If the above command fails use your web-browser to download the installer package, then put it on your device.

- Start the installer from terminal (change the name of installer package file if necessary):
 ```
sh nzbget-latest-bin-freebsd.run
 ```

## Customized installation ##
- By default NZBGet is installed into directory **nzbget** in the current directory. You can specify another directory using parameter **-\-destdir**:
```
sh nzbget-latest-bin-freebsd.run --destdir /path/to/install/nzbget
```

- If you want to extract all files included within installer use parameter **-\-unpack**. All files including binaries for all CPU architectures will be unpacked and no post-install configuration will be performed.

## Test ##
Test the installation by starting NZBGet in console server mode. In this mode it prints status to current terminal window and you can see any errors if they happen on start:

    <nzbget-directory>/nzbget -s

If you get an error like *"Can not open terminal"* this is because NZBGet is in curses mode and it can't determine terminal configuration. You can start NZBGet in output mode **log** or **color**:

    <nzbget-directory>/nzbget -s -o outputmode=log

or set the TERM variable:

    TERM=vt100 <nzbget-directory>/nzbget -s

Now start a web-browser and open URL **http://ip-address-of-linux-machine:6789**. You should see NZBGet web-interface. Default login credentials are username: **nzbget**, password: **tegbzn6789**. Go to settings and check options in the *PATHS*-section.

## Restoring configuration ##
If you want to reuse a configuration file from another NZBGet installation see [Backup and restore settings](backup-and-restore-settings).

## Starting on boot##
NZBGet can run in background as daemon (service). When starting NZBGet use command **-D** instead of **-s**:

    <nzbget-directory>/nzbget -D

You will not see any output of this command.
Add this line to the init scripts of your system. Also add a shutdown line to the shutdown scripts:

    <nzbget-directory>/nzbget -Q

## Updates ##
When installed via universal installer NZBGet supports automatic updates via web-interface: *Settings -> SYSTEM -> Check for updates*.

In a case automatic update doesn't work the update can be made manually by downloading installer for a newer version and running it with parameter **-\-destdir \</path/to/nzbget/directory>**, your existing configuration will be preserved.
