---
---
### Contents
* [High performance](#high-performance)
* [Fast deobfuscation](#fast-deobfuscation)
* [Quick par-verification](#quick-par-verification)
* [Multicore par-repair](#multicore-par-repair)
* [Retry failed articles](#retry-failed-articles)
* [Full-featured API](#full-featured-api)
* [RSS with duplicate check](#rss-with-duplicate-check)

## High performance
Sometimes new users wonder why care about performance in a downloader? 
They say:
>The speed is only limited by the connection, the program only has to write the received data into disk.

Although that might be true when downloading from web- or ftp-servers the binary downloads from Usenet work quite differently. The Usenet was designed to transfer text messages only. In order to transfer binary files (such as photos or videos) a special technique was invented to embed the binary data into text messages. This technique involves:
- splitting of binary files into small pieces - because the message length is limited. One message is usually less than 1 MB;
- converting binary data into text form - because the messages can safely transport only basic characters used in texts;
- adding extra recovery data to repair downloaded files in a case some messages get lost - because Usenet doesn't guarantee message delivery.

From a downloader stand of point this means that the download process isn't that straightforward as moving file from location one to location two. 

**A lot of computation work has to be done in order to restore original binary files from thousands of plain text messages.**

That's why **efficiency** is important. How does NZBGet care about this?
- First of all NZBGet is written in **C++** language. The program code is compiled into native CPU instructions during build process. That provides the best possible usage of CPU power.
- Do care about efficiency - that's a general motto when developing NZBGet: use efficient algorithms, avoid unnecessary calculations whenever possible, don't load everything into memory.

All this allows NZBGet to run on systems with as little RAM as 32 MB or less and with CPUs running on 200 MHz or less.

There is another aspect of efficiency however. If the system is powerful enough and has a lot of resources - can they be used to improve download and post-processing speed? Sure, they can. NZBGet offers a bunch of options to configure the program for systems of different leagues, for example:
- use memory cache to decrease amount of disk operations;
- use more threads for downloading (connections) or for par-repair;
- etc., etc. - see [Performance tips](Performance_tips) for details.

## Fast deobfuscation
Many files posted to Usenet nowadays have obfuscated file names, for example:

    cf8ae6185547f6ca0ad263439f2279fa.01
    cf8ae6185547f6ca0ad263439f2279fa.21
    ...
    cf8ae6185547f6ca0ad263439f2279fa.par2

Once downloaded such files can not be directly unpacked (unpack will fail). The original names of rar-archives must be restored first. The files come with par2-set, which hold the recovery information including original file names. To restore the file names a recovery process using external tool **par2cmdline** is usually used:

    par2cmdline r cf8ae6185547f6ca0ad263439f2279fa.par2

During recovery the tool reads all downloaded files first and then restores original file names. The process of reading of files can take very long, many minutes or even tens of minutes depending on files size and disk speed.

**NZBGet has a unique feature called "fast par-rename", which restores original file names within few seconds**, even on very slow machines, eliminating the need for time consuming par-verification step required when using external tool par2cmdline.

A typical log in NZBGet looks like this:
```
INFO	Thu Jul 16 2015 01:38:43	Checking renamed files for Debian.7.i686
INFO	Thu Jul 16 2015 01:38:43	Renaming cf8ae6185547f6ca0ad263439f2279fa.50 to Debian.7.i686.r65
INFO	Thu Jul 16 2015 01:38:44	Renaming cf8ae6185547f6ca0ad263439f2279fa.47 to Debian.7.i686.r25
INFO	Thu Jul 16 2015 01:38:44	Renaming cf8ae6185547f6ca0ad263439f2279fa.26 to Debian.7.i686.r40
...
INFO	Thu Jul 16 2015 01:38:44	Successfully renamed 75 file(s) for Debian.7.i686
```
That's a 4GB download renamed in two seconds on a slow Linux machine.

### Rar-rename
Version 18.0 takes deobfuscation in NZBGet to even higher level by introducing new **rar-rename feature**, which can restore correct files names for multivolume rar-archives even if the download doesn't have any par2-files at all, or if the files were obfuscated before creating par2-files.

## Quick par-verification
If one or more Usenet messages were missing during download the resulting files are damaged and cannot be unpacked (or used in other way). Luckily, following Usenet standards most downloads include recovery data in form of extra files with par2-extensions. These files can be used to repair the damaged files using par2 recovery algorithm.

Once again the recovery process is usually done using the already mentioned external tool **par2cmdline**:

    par2cmdline r cf8ae6185547f6ca0ad263439f2279fa.par2

The repair process consists of two steps:

1. **verification** - the tool reads all files from disk, calculates their checksums to determine which files are damaged and need to be repaired;
2. **repairing** - the tool performs repair.

Both of these steps are time consuming. Typically the first step takes minutes or tens of minutes and the second step may take a few minutes or many hours depending on the damage (and CPU speed of course).

For a large download with little damage the first step (verification) may take longer than the actual repair. For example on a slow device the verification may take an hour with repair taking 5 minutes.

NZBGet doesn't use external tool par2cmdline. Instead the source code of that tool (which is also written in C++ like NZBGet) is integrated into NZBGet. NZBGet uses that fact to its advantage:

**Since NZBGet knows exactly which files were downloaded with errors it passes that knowledge to the repair module.**

As a result the time consuming verification step is skipped and the repair module starts the repair process directly.

## Multicore par-repair
As mentioned above the repair is usually performed using external tool **par2cmdline**. That tool was originally written many years ago (and hasn't been updated since) when mutlicore CPUs did not exist yet. Therefore the tool doesn't support multiple cores and the very time consuming repair process can use only one CPU core.

Thanks to independent developers a multicore version of the tool was developed - **par2cmdline_tbb**. That's a great tool but it has one weak point - for multicore functionality it uses a program library built by Intel. That library works only on CPUs with Intel architecture.

Many Linux devices are equipped with ARM CPUs with multiple cores: 4 cores are usual nowadays and will be more in the future. Such devices cannot use par2cmdline_tbb and must use the old par2cmdline tool which supports only one core.

**NZBGet has its own implementation of multithreading (multicore) support in the par2-module which works on all platforms and all CPUs.**

For example, on a 4-core ARM CPU NZBGet repairs 2-3 times faster than par2cmdline. Not just ARM, all other architectures profit two: MIPS, PowerPC and, of course, x86.

## Retry failed articles
If download fails for whatever reason the failed item is put to history from where it can be retried in several flavors. In addition to classic "Download again from scratch" NZBGet can also retry only failed pieces. This can be useful in several cases:
 - if the failure is caused by temporary propagation issues;
 - one or more of your optional news servers were not used during download due to connection issues;
 - you have activated another news server.

In all these cases it's preferably to not discard already downloaded pieces but instead retry only the failed ones. The "Retry failed articles" function works granularly and redownloads only missing file pieces (articles).

## Full-featured API
**The whole NZBGet functionality is accessible via [API](api).** It's not just for third-party developers. NZBGet itself uses that API very extensively. The built-in web-interface relies fully on the API. That means that **every feature or function you see in web-interface is also available for third-party developers**.

Other programs often have a built-in special web-server for web-interface, which generates web-pages and process requests from web-interface. In addition they have API-server. The functions of web-interface and API-servers are often not the same.

In NZBGet there is no such difference. The web-interface consists of a static html-page with (a lot of) javascript-code. NZBGet's built-in web-servers only serves the static web-application content. After the web-page is loaded into browser the javascript-application activates and communicates with NZBGet via API to receive the list of downloads, messages, etc. and to perform edit actions.

## RSS with duplicate check
For whose of you who can't or don't want to use additional programs to automate downloads **NZBGet offers very powerful [RSS](RSS) support**. Example RSS filter:
```
Reject: age:>10
Require: 720p
# this is comment
Accept: game of thrones S03E##
Accept: dexter S08E##
```

One big issue you may have when using RSS in other programs is a large amount of duplicate downloads. it's because same titles are usually posted to Usenet by more than one posters. **NZBGet has a powerful [duplicate handling](RSS#duplicates) to avoid multiple downloads of the same title**.

Not only it does that but it also handles failed downloads and automatically falls back to other releases of the same title if necessary.