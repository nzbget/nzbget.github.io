---
title: Installation on Windows
---
## Installation ##
- Download NZBGet setup for windows from [Download page](download).
- Run setup and install the program;
- Start NZBGet via start menu or desktop shortcut;
- NZBGet puts an icon into the tray area (near clock) and opens a browser window;
- In the web-interface (browser window) go to settings page:
  - Setup your login credentials in section *SECURITY*;
  - Add one or more news-servers in seciont *NEWS-SERVERS*;
  - Save settings and reload NZBGet.

Now you can add nzb-files and enjoy fast downloads with NZBGet.

## Windows Service ##
NZBGet can work as service. To install the service start batch file *nzbget-command-shell.bat* (**as administrator!**), then type the command

    nzbget -install

To start or stop the service use windows management console or a command line:

    net start NZBGet

    net stop NZBGet

To remove (uninstall) the service:

    nzbget -remove

## Post-processing scripts ##
Most scripts require *Python*. You need to download Python from [www.python.org](http://www.python.org) and install it. There are two versions of python: version 2.x and version 3.x. Version 2.x is the most widely used. All pp-scripts work with python 2.x. Some scripts may work with python 3.x but most will fail. 

Put scripts into ppscripts-folder (option *ScriptDir*). The scripts should then appear in NZBGet web-interface.

## Restoring configuration ##
If you want to reuse a configuration file from another NZBGet installation see [Backup and restore settings](backup-and-restore-settings).

## Updates ##
Version 15 supports automatic updates via web-interface: Settings -> SYSTEM -> Check for updates.

In a case automatic update doesn't work the update can be made manually by manually downloading and installing of a newer version over the existing installation:
- Download a newer version of NZBGet;
- Stop NZBGet if it's running;
- Install the setup over existing installation;

That's all, now you can start NZBGet. If you see messages like "Option xxx obsolete", don't worry. They just to inform you about changes in the new version. Go to settings page and click *Save all changes*. The obsolete options will be removed from config file.

## Compiling ##
If you want to compile NZBGet for Windows yourself this information is for you.

NZBGet can be compiled using MS Visual C++ 2015 (free Community edition is OK) or a newer version. The project file is provided. 

To compile the program with TLS/SSL support you need one of the libraries:
- [OpenSSL](https://wiki.openssl.org/index.php/Binaries)

   NOTE: depending on your OpenSSL version you may need to replace ssleay32MT.lib and
libeay32MT.lib with libssl32MT.lib and libcrypto32MT.lib in project settings under Linker -> Input.

or
- [GnuTLS](http://www.gnu.org/software/gnutls).

For gzip support in web-server and web-client:
- [zlib](http://www.zlib.net).

For regex support:
- [Regex for Windows](http://gnuwin32.sourceforge.net/packages/regex.htm).
