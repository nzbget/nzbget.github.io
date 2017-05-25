---
title: Installation on Linux
---
## Universal installer for Linux
NZBGet's [Download Page](download) provides installer for Linux which includes precompiled binaries for many CPU types. These binaries require only Linux kernel 2.6 or later and do not have any other library dependencies. In practice that means the installer works on most Linux devices including desktop PCs, NAS, media players, WLAN routers, etc.

Please report on forum if the installer doesn't work for you.

**NOTE**: If you prefer to compile yourself see [[Installation on POSIX]].

## Automatic installation
- Download the installer package from [Download Page](download).
If your device has a decent version of **wget** you can also download the installer directly on your device with the following command (that's one long command):
 ```
wget -O - http://nzbget.net/info/nzbget-version-linux.json | \
    sed -n "s/^.*stable-download.*: \"\(.*\)\".*/\1/p" | \
    wget --no-check-certificate -i - -O nzbget-latest-bin-linux.run
 ```

- If the above command fails use your web-browser to download the installer package, then put it on your device.

- Start the installer from terminal (change the name of installer package file if necessary):
 ```
sh nzbget-latest-bin-linux.run
 ```

## Customized installation
- By default NZBGet is installed into directory **nzbget** in the current directory. You can specify another directory using parameter **--destdir**:
 ```
sh nzbget-latest-bin-linux.run --destdir /path/to/install/nzbget
 ```

- CPU architecture is detected automatically by installer. If that doesn't work or if you want to prepare the installation for usage on another computer the target CPU architecture can be specified with parameter **--arch <CPU-ARCH>**:
 ```
sh nzbget-latest-bin-linux.run --arch armhf
 ```

 Use parameter **-h** to get the list of supported CPU architectures.
- If you want to extract all files included within installer use parameter **--unpack**. All files including binaries for all CPU architectures will be unpacked and no post-install configuration will be performed.

## Test
Test the installation by starting NZBGet in console server mode. In this mode it prints status to current terminal window and you can see any errors if they happen on start:

    <nzbget-directory>/nzbget -s

If you get an error like *"Can not open terminal"* this is because NZBGet is in curses mode and it can't determine terminal configuration. You can start NZBGet in output mode **log** or **color**:

    <nzbget-directory>/nzbget -s -o outputmode=log

or set the TERM variable:

    TERM=linux <nzbget-directory>/nzbget -s

Now start a web-browser and open URL **<nowiki>http://ip-address-of-linux-machine:6789</nowiki>**. You should see NZBGet web-interface. Default login credentials are username: **nzbget**, password: **tegbzn6789**. Go to settings and check options in the *PATHS*-section.

## Restoring configuration
If you want to reuse a configuration file from another NZBGet installation see [[Backup and restore settings]].

## Starting on boot
NZBGet can run in background as daemon (service). When starting NZBGet use command **-D** instead of **-s**:

    <nzbget-directory>/nzbget -D

You will not see any output of this command.
Add this line to the init scripts of your system. Also add a shutdown line to the shutdown scripts:

    <nzbget-directory>/nzbget -Q

See forum topic [Start NZBGet on system boot](http://forum.nzbget.net/viewtopic.php?f=8&t=2709) for boot script examples.

Some systems (for example Synology NAS) provide an easy way to configure scheduler tasks executed on system boot (on Synology: Control Panel ->Task Scheduler). In that case you can add command `<nzbget-directory>/nzbget -D` there and do not need to work with boot scripts.

## Updates ##
When installed via universal installer NZBGet supports automatic updates via web-interface: *Settings -> SYSTEM -> Check for updates*.

In a case automatic update doesn't work the update can be made manually by downloading installer for a newer version and running it with parameter **-- destdir \</path/to/nzbget/directory>**, your existing configuration will be preserved.