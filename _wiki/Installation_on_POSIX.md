---
---
## Prerequisites ##
NZBGet is a cross-platform program which works on many platforms including many POSIX systems.

This article explains how to compile NZBGet from sources on a POSIX system. For cross compiling tips please refer to [[Cross compiling]]. Linux users can use universal installer which includes precompiled binaries for many CPU architectures - see [[Installation on Linux]].

NZBGet absolutely needs the following libraries: 
* libstdc++ (usually part of compiler)
* [[libxml2|http://www.xmlsoft.org]]

And the following libraries are optional: 

For curses-output-mode: 
* libcurses (usually part of commercial systems)

 or (better)
* [[libncurses|http://invisible-island.net/ncurses]]

For encrypted connections (TLS/SSL): 
* [[GnuTLS|http://www.gnu.org/software/gnutls]]

 or 
* [[OpenSSL|http://www.openssl.org]]

All these libraries are included in modern Linux distributions and should be available as installable packages. Please note that you also need the developer packages for these libraries too, they package names have often suffix "dev" or "devel". On other systems you may need to download the libraries at the given URLs and compile them (see hints below).

You also need a working C++ compiler.

**Example:** The following command installs all packages required to compile NZBGet on Debian/Ubuntu:
```shell
sudo apt-get install build-essential libncurses5-dev libssl-dev libxml2-dev -y
```

## Prerequisites for C++ compiler ##
NZBGet uses modern C++ features and requires a C++ compiler supporting C++14 ISO standard. The configure-script performs a basic check and fails if C++ compiler doesn't provide required support. In special cases the check can be disabled (not recommended), see configure options below. For details see [[Prerequisites for C++ compiler|https://github.com/nzbget/nzbget/wiki/Prerequisites-for-C++-compiler]].

## Compiling ##
* download NZBGet source code from [[Download Page|http://nzbget.net/download]]
* untar the nzbget-source via

 ```shell
tar -zxf nzbget-VERSION-src.tar.gz 
 ```
* change into nzbget-directory via

 ```shell
cd nzbget-VERSION 
 ```
* configure it via

 ```shell
./configure 
 ```
maybe you have to tell configure, where to find some libraries, see Configure-options below.
* compile it via

 ```shell
make 
 ```
* become root via

 ```shell
su 
 ```
* install it via

 ```shell
make install 
```

 **NOTE**: if you want to spare some space on the drive you can install the stripped version (which is much smaller) of the binary instead:
 ```shell
make install-strip
```
The stripped version doesn't include any debugging symbols. You shouldn't do stripping if you compile the binary in debug mode (using *./configure --enable-debug*).

**NOTE**: if you do not have root-access or do not want to install the program system-wide, you can omit the install-step and copy the compiled binary "nzbget" into any location you want. 

### Configure-options ###
You may run configure with additional arguments: 
- **--disable-curses** - to make without curses-support. Use this option if you can not use curses/ncurses. 
- **--disable-parcheck** - to make without parcheck-support.
- **--with-tlslib=(GnuTLS, OpenSSL)** - to select which TLS/SSL library should be used for encrypted server connections. 
- **--disable-tls** - to make without TLS/SSL support. Use this option if you can not neither GnuTLS nor OpenSSL. 
- **--enable-debug** - to build in debug-mode, if you want to see and log debug-messages;
- **--disable-cpp-check** - disable check for C++11/C++14 compiler features. The build will most likely fail during compiling though.

### Optional package: par-check ###
NZBGet can check and repair downloaded files for you. For this purpose it uses par2-module (based on par2cmdline) which is integrated into nzbget's source code tree.

If for some reason you have troubles compiling units belonging to par2-module you can make nzbget without support for par-check using option **--disable-parcheck**:
```shell
./configure --disable-parcheck
```
### Optional package: curses ##
For curses-outputmode you need ncurses or curses on your system. If you do not have one of them you can download and compile ncurses yourself. Following configure-parameters may be useful:

    --with-libcurses-includes=/path/to/curses/includes
    --with-libcurses-libraries=/path/to/curses/libraries

If you are not able to use curses or ncurses or do not want them you can make the program without support for curses using option **--disable-curses**:
```shell
./configure --disable-curses 
```

### Optional package: TLS ###
To enable encrypted server connections (TLS/SSL) you need to build the program with TLS/SSL support. NZBGet can use two libraries: GnuTLS or OpenSSL. Configure-script checks which library is installed and use it. If both are available it gives the precedence to OpenSSL. You may override that with the option **--with-tlslib=(GnuTLS, OpenSSL)**. For example to build whith GnuTLS: 
```shell
./configure --with-tlslib=GnuTLS
```

Following configure-parameters may be useful: 

    --with-libgnutls-includes=/path/to/gnutls/includes
    --with-libgnutls-libraries=/path/to/gnutls/libraries

    --with-openssl-includes=/path/to/openssl/includes
    --with-openssl-libraries=/path/to/openssl/libraries

If none of these libraries is available you can make the program without TLS/SSL support using option **--disable-tls**:
```shell
./configure --disable-tls
```

## Configuring ##
NZBGet needs a configuration file. After **make install** an example configuration file **nzbget.conf** is installed into **/usr/shared/nzbget/nzbget.conf**. Use command:

    make install-conf

This command copies the configuration file into **/etc/nzbget.conf** and makes few changes in the file to adjust to your system paths. If you don't want the file to be system wide available you can instead of "make install-conf" copy the file into your home directory, open the file in a text editor and make sure the option **ConfigTemplate** is set properly. All other options can be edited later via web-interface.

The program looks for configuration file in following standard locations (in this order): 

On POSIX systems:
* \<app-directory>/nzbget.conf (since version 15.0)
* ~/.nzbget
* /etc/nzbget.conf
* /usr/etc/nzbget.conf
* /usr/local/etc/nzbget.conf
* /opt/etc/nzbget.conf

You can use any other path and name but then you need to pass the full filename of the configuration file when starting NZBGet:

    nzbget -c /path/to/nzbget.conf -D

If you put the configuration file in other place, you can use command- line switch "-c <filename>" to point the program to correct location. 

In special cases you can run program without configuration file using switch "-n". You need to use switch "-o" to pass required configuration options via command-line.

## Post Processing scripts ##
After the download of nzb-file is completed NZBget can call post-process-scripts, defined in configuration file. 

NZBGet distribution comes with two example scripts.

For more information see [[Post-processing scripts]] and [[Catalog of post-processing scripts]].