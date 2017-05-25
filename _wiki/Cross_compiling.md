---
---
## Alternative to cross-compiling ##
Before you try to cross-compile consider using the universal Linux installer which works on many platforms. See [[Installation on Linux]].

## Prerequisites ##
You must have a working cross compiling environment. NZBGet also requires a C++ compiler supporting C++14 ISO standard, see [[Prerequisites for C++ compiler]] for details.

Before your start cross compiling NZBGet compile libxml2 first. NZBGet requires this library and the compiling of libxml2 is a good test to make sure your cross compiling environment is setup properly. If you can't build libxml2 please refer to HOW-TOs and other infos for the toolchain you use.

Now, when the toolchain is working and you can compile other libraries or programs, let's start with NZBGet.

## Dependencies ##
NZBGet has several dependencies from other libraries. All but libxml2 are used for optional features. In our first compiling attempt we disable all optional features in order to skip the building of other libraries. When we have a working basic NZBGet we will build additional libraries and recompile NZBGet with additional features.

## Environment variables ##
You typically use a script provided with toolchain to set up environment variables needed for cross compiling. If you don't have such a script you should at least add the path to cross compiling tools into your **PATH**. For example:
```shell
export C200_TOOLCHAIN_ROOT=/home/slug/c200
export PATH=$C200_TOOLCHAIN_ROOT/toolchain/bin:$PATH
```

The configure script relies on program **pkgconfig** to find dependent libraries. It uses several environment variables. The most important is **PKG_CONFIG_LIBDIR**. This variable might be already set by your cross compiling environment. If not - set it manually:
```shell
export PKG_CONFIG_LIBDIR=$C200_TOOLCHAIN_ROOT/builds/staging_dir/lib/pkgconfig
```

## Configuring ##
Unpack the source code of NZBGet:
```shell
cd $C200_TOOLCHAIN_ROOT/builds/builds_dir
tar -xzf nzbget-15.0-src.tar.gz
cd nzbget
```

Now configure NZBGet with options which disable all additional features:
```shell
./configure --disable-curses --disable-parcheck --disable-tls
```

Depending on used toolchain you may need to provide additional help to the configure script to find proper cross compiling tools and to parameterize them properly. Please refer to toolchain documentation. One example how the configure-command for one particular platform could look like (this is one long line):
```shell
./configure --host=mips-linux-gnu CFLAGS=-EL CXXFLAGS="-EL" LDFLAGS="-EL -L$LIBPREF/lib \
    -Wl,-rpath-link, $LIBPREF/lib" CPPFLAGS=-EL ASFLAGS=-EL CC="mips-linux-gnu-gcc -EL" \
    --prefix=$LIBPREF --disable-curses --disable-parcheck --disable-tls
```

## Compiling ##
Compiling is easy since the all work was already done:
```shell
make
```

If the compiling went without errors you should have a binary ''nzbget''. Most likely it has symbol info used for debugging. It adds a lot to the binary size. To remove that unused data use the ''strip''-command. That is not a necessary step but is recommended:
```shell
mips-linux-gnu-strip nzbget
```

## Testing ##
Now you can upload the binary **nzbget** to your device and test if it starts without errors:
```shell
$ /path/to/nzbget -v
nzbget version: 15.0
```

If you get errors like "missing libraries" or a general "file not found", then you should check if you use the proper toolchain, which is suited for your device and is compatible with your firmware version. Don't forget to upload and install libxml2.so.

## Adding features ##
Now you can reconfigure NZBGet without **--disable**-swicthes. You will most likely get errors that the required libaries were not found since you have not built them yet. Please refer to [[Installation on POSIX]] for the info what libraries are needed for NZBGet.

## Installing ##
When compiled natively NZBGet is usually installed using command "make install", which installs the compiled binary file and supporting files in default directories. To create the snappshot of files required for installation on the target platform use parameter "DESTDIR" with command "make install":
```shell
make DESTDIR=/home/user/nzbget-package install
```

In this example all files to be installed on target platform will be copied into directory "/home/user/nzbget-package".

You should transfer the files on the device then. It's not necessary to preserve the directory structure on target platform:
* location of binary file can be any directory;
* location of config file can be passed with parameter "-c /path/to/nzbget.conf" when starting NZBGet;
* location of web-interface files and extensions scripts (post-processing scripts, etc.) can be set via program options in the configuration file.
