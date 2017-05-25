---
---
NZBGet can be controlled from console (terminal).

**Windows**: you can use batch file *nzbget-command-shell.bat* to start NZBGet console. After starting the batch file you can use all nzbget commands (nzbget -s, nzbget -L, etc) without typing the full path to nzbget executable.

NZBGet can be used in either standalone mode which downloads a single file or as a server which is able to queue up numerous download requests.

### Standalone mode ###

    nzbget <nzb-file>

### Server mode ###
First start the nzbget-server: 

A) in console mode:

    nzbget -s 

B) or in daemon mode (POSIX only):

    nzbget -D 

C) or as a service (Windows only):

    net start NZBGet 

To stop server use:

    nzbget -Q 

Depending on which frontend has been selected in the nzbget.conf file (option *OutputMode*) the server should display a message that it is ready to receive download requests (this applies only to console mode, not to daemon mode). 

When the server is running it is possible to queue up downloads. This can be done either in terminal with

    nzbget -A <nzb-file> 

or by uploading a nzb-file into server's monitor-directory (\<MAINDIR>/nzb by default). 

To check the status of server start client and connect it to server:

    nzbget -C 

The client have three different (display) outputmodes, which you can select in configuration file (on client computer) or in command line. Try them:

    nzbget -o outputmode=log -C 
    nzbget -o outputmode=color -C 
    nzbget -o outputmode=curses -C 

To list files in server's queue:

    nzbget -L 

It prints something like:

    [1] nzbname\filename1.rar (50.00 MB)
    [2] nzbname\filename1.r01 (50.00 MB) 

The numbers in square braces are ID's of files in queue. They can be used in edit-command. For example to move file with ID 2 to the top of queue:

    nzbget -E T 2 

or to pause files with IDs from 10 to 20:

    nzbget -E P 10-20 

or to delete files from queue:

    nzbget -E D 3 10-15 20-21 16 

### Command line reference ###
For more information on using the program via command line see [[Command line reference]].

### Running client & server on separate machines ###
Since NZBGet communicates via TCP/IP it's possible to have a server running on one computer and control it from another computer.