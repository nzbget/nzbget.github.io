---
---
NZBGet is designed to work smooth on computers with little resources.

The limiting factors are:
* slow CPU;
* very little RAM;
* slow hard drive interface.

NZBGet tries to overcome the limitations by using different techniques. There are many configuration options affecting performance. If you use NZBGet on a computer with limited capabilities, such as NAS, media player, router, etc. you should take your time to configure NZBGet for best performance.

**NOTE:** This guide is written for version 14.0 and later.

## CPU as a limiting factor ##
CPU is always a limiting factor on mentioned devices. Check the following configuration options.

### Encrypted communication ###
Activating the encrypted communication with news server (option **ServerX.Encryption**) makes a huge impact on performance. Use option **ServerX.Cipher** to fine tune the TLS/SSL. Choosing a faster cipher can significantly boost performance. See [Choosing cipher](choosing-cipher) for a more detailed explanation.

### Number of connections ###
With option **ServerX.Connections** you define the number of simultaneous connection.

For main servers (**ServerX.Level=0**) use as little connections as possible to saturate your internet link. More connections means more threads and this can make your device less responsive.

For fill servers (**ServerX.Level>0**) define the same number of connections as for main servers, if possible.

### CRC check ###
CRC-check ensures the downloaded articles are correct. The CRC computation however requires CPU time. If you have a good reliable news server you can disable CRC check using option **CrcCheck**. The downside of disable CrcCheck is that the quick par-verification may become less reliable which may result in a full verification sometimes.

### Par check ###
Par check is very demanding for CPU. Set option **ParCheck** to **auto**. If the download is damaged it will be par-checked and -repaired.

Make sure the option **ParScan** is set to **auto** to optimize the scan speed.

The option **ParQuick** must be activated for fast par-verification (if par-repair is needed). If your device has more than one CPU core set the option **ParThreads** accordingly. Increase the option **ParBuffer** if you have enough free memory.

Activate option **ParPauseQueue** to avoid simultaneous download and par check.

If the download is very damaged it may take a lot of time (hours or even days) to repair it. Set a time limit for par repair using option **ParTimeLimit**. If you get a very damaged download you can copy files to a fast desktop computer and repair there.

Activate option **ParRename** to handle with obfuscated (intentionally misnamed) files.

### Unpack ###
Unpacking is also demanding for CPU. Activate option **UnpackPauseQueue** to avoid simultaneous download and unpack. 

### Download speed limit ###
If the download speed limit is active the program needs additional work to respect the limit. For better performance do not limit download speed (option **DownloadRate**)

### Accurate speed rate ###
Option **AccurateRate** (when active) can significantly decrease performance because a lot of synchronization between download threads is required. If you need an accurate speed indication you should definitely test how it affect your download speed. On a desktop computer with CPU you may not notice any difference but on a slow NAS the option can decrease download speed two or three times!

### Daemon mode ###
You can run NZBGet in console in server mode using command "nzbget -s". In this case the screen is constantly updated. To avoid this you should run NZBGet in daemon (POSIX) or service (Windows) mode. Use remote client for short periods of time needed for controlling of download process on server.

## RAM as a limiting factor ##
NZBGet is designed to use as little memory as possible but it can use more RAM if available to speed up the download and post-processing. Configure the RAM usage according to your system.

### Article cache ###
Article cache greatly decreases the file fragmentation which improves the unpack speed. This is especially important if you use many connections (10 or more). If option **DirectWrite** is active (see below) the article cache can be set to **200** (MB). If **DirectWrite** is disabled the article cache should be big enough to accommodate any whole rar-file (up to 1 GB).

### Write buffer ###
Review the option **WriteBuffer**. If you have a lot of RAM set it to **1024**. If you have little memory set it to **32** or something or more depending on the amount of connections. The **WriteBuffer** is especially important if the article cache is disabled.

## Hard drive as a limiting factor ##
Even if you have a fast hard drive the disk interface in your device may be slow limiting the hard drive access.

### Direct write ###
The files are posted to Usenet within articles. One rar-file may consist of hundreds of articles. To combine the articles into the destination file, the downloaded articles must be saved temporary until all articles for the file are downloaded. The downloaded articles are saved either to memory (if article cache is active) or to temporary files. The latter would drastically decrease the performance because the written temporary files need to be read again and then to be written into the destination file. NZBGet uses a special technique to completely avoid the creating of temporary files. It is called **Direct Write**. When the option **DirectWrite** is active the program writes each article directly into the destination file to the location where the article belongs to. This is however works only if the destination file with required size can be created upfront, which requires the support of so-called sparse files. Most modern filesystems (including NTFS on Windows and EXT3, EXT4 on Linux) support it with a notable exception being HFS+ on Mac. If the direct write can not be used due to lack of sparse files support a large article cache must be configured for best performance.

### File fragmentation ###
When direct write is active multiple threads write into the same file on the disk. This may produce highly fragmented files and slow down post-processing (unpack). With **WriteBuffer** the fragmentation can be reduced. The option **ArticleCache** allows to minimize the fragmentation even more.

### Drive cache flushing ###
Since version **`16.0`** NZBGet has option **FlushQueue** (active by default), which flushes disk buffers each time the download queue or history is written to disk. This makes the queue more resistant to system crashes. On some systems the flushing may however lead to a noticeable performance degradation, which may also affect other programs since the drive cache is a common resource. If you have performance issues test if disabling of the option bring improvements; if it doesn't - it's better to keep the option active.

### Download progress ###
After the download of an article the progress information is written into disk state file. This can be disabled via option **ContinuePartial** to slightly reduce the disk access.

### Logging ###
Disable logging for detail- and debug-messages (options **DetailTarget**=**none**, **DebugTarget**=**none**). When you have a stable working configuration consider disabling log-file completely with option **CreateLog**.

### Par check and unpack ###
Activate options **ParPauseQueue** and **UnpackPauseQueue** to avoid simultaneous disk access by downloader, par-checker and unpacker.

### Intermediate directory ###
If you have more than one physical hard drive (or SSD) you can significantly improve unpack speed by using option **InterDir**. But even with one physical hard drive having a separate intermediate directory is recommended for better distinguishing of finished and active downloads.
