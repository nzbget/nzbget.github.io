---
title: Prerequisites for C++ compiler
redirect_from: /cpp14
---
## C++14
As you may know NZBGet is written in C++ language. In the last years C++ has been evolved dramatically. New versions were standardized by ISO as C++11 and lately C++14. These new standards bring many interesting features to the language making it much more pleasure to work with.

In the meantime major Linux distributions have updated their compilers to GCC 4.9 which supports C++11 and partially C++14 or even to GCC 5, which fully supports C++14. Xcode on OS X includes C++14 compatible compiler. MS Visual Studio 2015 brings a C++14 compiler to Windows world as well.

Moreover after the introducing of universal Linux installer in v15 we now offer precompiled binaries for four major platforms (Windows, Linux, OS X, FreeBSD). This makes it less important which compiler is installed on user's machine since only few users compile themselves.

**Starting from version 17.0 NZBGet source code base has been upgraded to C++14.**

That means you need a C++14 compliant compiler to build NZBGet **v17** or newer from sources. Once again (if you forgot) - chances are high that you don't need to compile NZBGet on your own at all. Instead you can download the installer for your platform from [Download page](http://nzbget.net/download) and install NZBGet in a few quick steps.

## Prerequisites for C++ compiler
If you still want or need to compile NZBGet one of the following compilers (or newer) is required:
- GCC 4.9 (for GCC 4.8 see note below);
- Clang 3.4;
- MS Visual Studio 2015;
- any other C++ compiler claiming full support for C++14 ISO standard.

## Installing GCC 4.9 on Linux
If your Linux distribution has an older version of GCC there are two ways to get GCC 4.9 without upgrading to a newer version of the OS:
- install GCC 4.9 via binary package from a separate repository;
- compile GCC 4.9.

### Compiling GCC 4.9 for NZBGet
For simplicity and safety we will compile and install GCC 4.9 into user's home directory. This ensures no impact on the system or other programs is done.
- assume the following directories:
  - user's home: `/home/user`
  - GCC 4.9 main directory: `/home/user/gcc-4.9`
  - build directory: `/home/user/gcc-4.9/build`
  - installation directory: `/home/user/gcc-4.9/host/usr`

- download and unpack GCC 4.9:
 ```shell
$ mkdir -p /home/user/gcc-4.9/build && cd /home/user/gcc-4.9/build
$ wget ftp://ftp.gnu.org/gnu/gcc/gcc-4.9.3/gcc-4.9.3.tar.bz2
$ tar xfj gcc-4.9.3.tar.bz2
$ cd gcc-4.9.3
$ ./contrib/download_prerequisites
$ rm isl cloog
$ cd ..
```

- prepare directory for object files:
 ```shell
$ mkdir objdir && cd objdir
```

- configure GCC (we disabled the stuff not required for NZBGet to speed up the compiling of GCC):
 ```shell
$ ../gcc-4.9.3/configure --enable-languages=c,c++ --disable-bootstrap \
        --disable-nls --disable-libssp --disable-libgomp --disable-libmudflap \
        --disable-libquadmath --disable-decimal-float --disable-libffi \
        --disable-libsanitizer --prefix=/home/user/gcc-4.9/host/usr
```
 replace `--prefix=/home/user/gcc-4.9/host/usr` at the end of the command with the installation directory chosen on first step.

- compile GCC (replace `2`with a number of cores your CPU has, for faster compilation):
 ```shell
$ make -j2
```

- install GCC into previously configured directory (/home/user/gcc-4.9/host/usr):
 ```shell
$ make install
```

### Using GCC 4.9 with NZBGet
Now you can compile NZBGet as described in [Installation on POSIX]([Installation_on_POSIX). However since we didn't install GCC into standard directory you have to tell `configure` and `make` where to find compiler binaries.

#### Building NZBGet
So instead of executing `./configure` and `make` you should do:
 ```shell
$ PATH=/home/user/gcc-4.9/host/usr/bin:$PATH ./configure
$ PATH=/home/user/gcc-4.9/host/usr/bin:$PATH make
```

##### Special case: mixed 32 bit and 64 environment
If configure fails with an warning like this:
```shell
/usr/bin/ld: warning: skipping incompatible //usr/lib/i386-linux-gnu/libxml2.so while searching for xml2
/usr/bin/ld: error: cannot find -lxml2
```
Try specifying 32 bit mode when configuring NZBGet:
 ```shell
$ PATH=/home/user/gcc-4.9/host/usr/bin:$PATH CXXFLAGS=-m32 ./configure
```

#### Using NZBGet
When you try to run the compiled `nzbget` you'll get an error message like this:
```
$ ./nzbget -v
./nzbget: /usr/lib/x86_64-linux-gnu/libstdc++.so.6: version `GLIBCXX_3.4.20' not found (required by ./nzbget)
```

That's because we didn't install (system wide) C++ standard library built by GCC. We need to tell the linker where to find it:
```shell
$ LD_LIBRARY_PATH=/home/user/gcc-4.9/host/usr/lib64 ./nzbget -v
```

If you don't like prepending each call of `nzbget` with *LD_LIBRARY_PATH* you can update your system libstdc++.so.6 with the new one (**not recommended**):
```shell
$ sudo cp /home/user/gcc-4.9/host/usr/lib64/libstdc++.so.6 \
    /home/user/gcc-4.9/host/usr/lib64/libstdc++.so.6.0.20 \
    /usr/lib/x86_64_linux-gnu/
```

**NOTE:** This will have impact on all installed C++ programs; do this on your own risk.

A more safer approach is to set LD_LIBRARY_PATH in a terminal session once:
```shell
$ export LD_LIBRARY_PATH=/home/user/gcc-4.9/host/usr/lib64
$ ./nzbget -v
```

## Compiling with GCC 4.8
At the time of writing this GCC 4.8 was still the default compiler on RHEL and CentOS. Although GCC 4.8 does not fully support C++14, extra efforts were made to make NZBGet compatible with GCC 4.8. Compiling with GCC 4.8 is supported in release mode. Use the following configure command:
```shell
CXXFLAGS="-std=c++11 -O2 -s" ./configure --disable-cpp-check
```
### Important notes:
- compiling is possible only without debug info. When trying to compile with `-g` the compiler fails with internal error.
- support for gcc 4.8 is considered temporary and may be dropped in future NZBGet versions.
