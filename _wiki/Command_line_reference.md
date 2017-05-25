---
---
Command line in NZBGet consist of one command and any number of options. The commands can be divided into local commands and remote commands.

In the description on this page the character `$` at the beginning of the line represents command line prompt. You shouldn't type it. The purpose of it is to help you differentiate the typed commands from the received output.

### Contents

* [Common options](#common-options)
	* [Option --configfile](#option---configfile)
	* [Option --option](#option---option)
	* [Option --noconfigfile](#option---noconfigfile)
* [Local commands](#local-commands)
	* [Command --help](#command---help)
	* [Command --version](#command---version)
	* [Command --printconfig](#command---printconfig)
	* [Command --server](#command---server)
	* [Command --daemon](#command---daemon)
* [Remote commands](#remote-commands)
	* [Command --quit](#command---quit)
	* [Command --append](#command---append)
	* [Command --connect](#command---connect)
	* [Command --list](#command---list)
		* [Files in download queue](#files-in-download-queue)
		* [Groups in download queue](#groups-in-download-queue)
		* [Jobs in post-processor queue](#jobs-in-post-processor-queue)
		* [Items in history](#items-in-history)
		* [Server status](#server-status)
	* [Command --pause](#command---pause)
		* [Pause download](#pause-download)
		* [Pause post-processor](#pause-post-processor)
		* [Pause scan](#pause-scan)
	* [Command --unpause](#command---unpause)
		* [Unpause download](#unpause-download)
		* [Unpause postprocessor](#unpause-postprocessor)
		* [Unpause scan](#unpause-scan)
	* [Command --rate](#command---rate)
	* [Command --log](#command---log)
	* [Command --scan](#command---scan)
	* [Command --edit](#command---edit)
		* [Individual files](#individual-files)
		* [Groups](#groups)
		* [Post-processor queue](#post-processor-queue)
		* [History list](#history-list)
	* [Command --write](#command---write)

# Common options #
Common options are used in addition to local or remote commands. There are some options that can be used only as additional options for special remote commands. These options are described with commands they belong to.

## Option --configfile ##
By default NZBGet looks for configuration file in well known places (/etc, /opt/etc and other common directories). With option `--configfile` (short form `-c`) you can pass the name of configuration file directly and so disable the automatic search. Example:
```
$ nzbget -c /home/user/nzbget-config.conf -v
```

Command `-v/--version` used here prints the program's version - see later.

## Option --option ##
In additions to configuration file any option can be passed via command line using switch `--option` (short form `-o`). The syntax:
```
-o <name=value>
```

For example to disable the automatic scanning of incoming nzb-directory you can set configuration option **NZBDirInterval** to "0":
```
$ nzbget -o NZBDirInterval=0 -D
```

Command `-D/--daemon` used here starts the server - see later.

## Option --noconfigfile ##
With switch `--noconfigfile` (short form `-n`) the program can be used without configuration. In that case all required configuration options must be passed via command line with switch `--option`. In following example the version of nzbget used on remote server is printed:
```
$ nzbget -n -o ControlIP=192.168.1.1 -o ControlPort=6789 -o ControlPassword=mysecret -V

Request sent
server returned: 15.0-testing-r1286
```

# Local commands #
## Command --help ##
Command `--help` (short form `-h`) prints the list of available command line options.
```
$ nzbget -h

Usage:
  nzbget [switches]
 
Switches:
  -h, --help                Print this help-message
  -v, --version             Print version and exit
  -c, --configfile <file>   Filename of configuration-file
  -n, --noconfigfile        Prevent loading of configuration-file
                            (required options must be passed with --option)
  -p, --printconfig         Print configuration and exit
  -o, --option <name=value> Set or override option in configuration-file
<OUTPUT STRIPPED>
```

## Command --version ##
Command `--version` (short form `-v`) prints the version of currecnt binary:
```
$ nzbget -v

nzbget version: 0.7.0-testing-r339M
```

## Command --printconfig ##
To check what configuration file and what options are currently being used:
```
$ nzbget -p

ConfigFile = "/usr/local/root/.nzbget"
AppBin = "/tmp/local/root/nzbget"
AppDir = "/tmp/local/root"
Version = "0.7.0-testing-r339M"
TempDir = "/usr/local/root/download/tmp"
DestDir = "/usr/local/root/download/dst"
QueueDir = "/usr/local/root/download/queue"
NzbDir = "/usr/local/root/download/nzb"
LogFile = "/usr/local/root/download/dst/nzbget.log"
LockFile = "/tmp/nzbget.lock"
CreateLog = "yes"
AppendNzbDir = "yes"
AppendCategoryDir = "yes"
OutputMode = "ncurses"
<OUTPUT STRIPPED>
```

## Command --server ##
Command `--server` (short form `-s`) starts NZBGet in server console mode:
```
$ nzbget -s
```

*Console mode* means that the program work in interactive mode: it prints output and still can be controlled via keyboard. Use Ctrl+C to terminate.

You can choose one of the three output modes:
- **Log** - prints only log-messages;
- **Color** - prints colored log-messages and a status line;
- **Curses** - interactive frontend (text mode).

The output depends on configuration option **OutputMode**. See the description of the option in configuration file for more info. For example to set OutputMode to "curses":
```
$ nzbget -s -o OutputMode=curses
```

If you want to run the server in background use command `--daemon` instead of `--server`.

When working in server mode NZBGet server can be controlled using client-commands, described later in this document.

## Command --daemon ##
Command `--daemon` (short form `-D`) starts NZBGet in server daemon mode:
```
 $ nzbget -D
```

The daemon mode is similar to console server mode (command `--server`), but the server works in background.

When working in daemon mode NZBGet server can be controlled using client-commands, described later in this document.

# Remote commands #
Remote commands communicate with NZBGet server. The server can be running on the same machine or on another machine in the network. To use remote commands the configuration option **ControlIP** must point to the NZBGet server and configuration options **ControlPort** and **ControlPassword** must be the same as in configuration used on server.

NOTE: if **ControlIP** on server is set to "localhost" or "127.0.0.1" you will be able to connect to the server only from the same machine. To connect from other computers you should set the option **ControlIP** on server to an IP-address accessible from network,  for example "192.168.1.1".

## Command --quit ##
Use command `--quit` (short form `-Q`) to stop the server:
```
$ nzbget -Q

Request sent
server returned: Stopping server
```

## Command --append ##
Command `--append` (short form `-A`) sends NZB-file or URL to server.

To send nzb-file:
```
$ nzbget -A /path/to/My.File.nzb

Request sent
server returned: Collection My.File.nzb added to queue
```

NOTE: You can also add files to download queue by simply saving them into incoming nzb-directory. See configuration option **NzbDir** for details.

To send URL:
```
$ nzbget -A http://server.com/path/to/nzb/file.nzb

Request sent
server returned: Url http://server.com/path/to/nzb/file.nzb added to queue
```

The command has several options which can be passed before the last parameter (nzb-file or url):
- **T** - Add file to the top (beginning) of queue
- **P** - Pause added files
- **C \<name>** - Assign category to nzb-file
- **N \<name>** - Use this name as nzb-filename (only for URLs)
- **I \<priority>** - Set priority (signed integer)

The name, category and priority can be also set or changed later with command `--edit`.

## Command --connect ##
With command `--connect` (short form `-C`) you can connect the client to remote server. You will see the log-output of server:
```
$ nzbget -C
```

Similar to server console mode you can choose one of the three output modes:
- **Log** - prints only log-messages;
- **Color** - prints colored log-messages and a status line;
- **Curses** - interactive frontend (text mode).

For example to set OutputMode to "curses":
```
$ nzbget -C -o OutputMode=curses
```

## Command --list ##
Command `--list` (short form `-L`) requests the list of items from server and or statistical data. There are four kind of lists which can be received with command `--list`:
- **F** - files in download queue;
- **G** - groups in download queue;
- **O** - jobs in post-processor queue;
- **H** - items in history.

Subcommand "F" (files in download queue) is used by default if none of subcommands were specified.

### Files in download queue ###
To print individual files from download queue use subcommand "F":
```
$ nzbget -L F

Request sent
Queue List
-----------------------------------
[103] Ubuntu 2006\linux.ubuntu.dvdr.r02 (49.30 MB)
[104] Ubuntu 2006\linux.ubuntu.dvdr.r00 (49.29 MB)
[105] Ubuntu 2006\linux.ubuntu.dvdr.r01 (49.31 MB)
[106] Ubuntu 2006\linux.ubuntu.dvdr.r03 (49.35 MB)
<OUTPUT STRIPPED>
-----------------------------------
Files: 107
Remaining size: 4669.86 MB (+244.50 MB paused)
Current download rate: 0.0 KB/s
Session download rate: 0.0 KB/s
Speed limit: 100.0 KB/s
Up time: 00:01:35
Download time: 00:00:00
Downloaded: 0.00 MB
Threads running: 5
Server state: Paused
```

The numbers in square braces are IDs of the files. These IDs are needed by command [[#Command_--edit | --edit]].

### Groups in download queue ###
Groups are nzb-files. Each group can contain one or more individual files. To print download queue as groups use subcommand "G":
```
$ nzbget -L G

Request sent
Queue List
-----------------------------------
[103-209] Ubuntu 2006
[210-354] Debian DISK1
[355-489] Debian DISK2
-----------------------------------
Files: 450
Remaining size: 12669.21 MB (+644.50 MB paused)
Current download rate: 0.0 KB/s
Session download rate: 0.0 KB/s
Speed limit: 100.0 KB/s
Up time: 00:01:35
Download time: 00:00:00
Downloaded: 0.00 MB
Threads running: 5
Server state: Paused
```

The numbers in square braces are IDs of the files (first and last). These IDs are needed by command [[#Command_--edit | --edit]].

*'NOTE:*' if you reorder individual files it is possible that the files from one group will be mixed with another:
```
 [103] Ubuntu 2006\linux.ubuntu.dvdr.r02 (49.30 MB)
 [241] Debian DISK1\debian.disk1.dvdr.r00 (51.00 MB)
 [105] Ubuntu 2006\linux.ubuntu.dvdr.r01 (49.31 MB)
```

The groups are listed in order according to the first file of this group in download queue.

### Jobs in post-processor queue ###
To print jobs from post-processor queue use subcommand "O":
```
$ nzbget -L O

Request sent
Post-Processing List
-----------------------------------
[2] Ubuntu 2006/linux.ubuntu.dvdr.rar
-----------------------------------
```

The numbers in square braces are IDs of the jobs. These IDs are needed by command [[#Command_--edit | --edit]].

### Items in history ###
To print history use subcommand "H":
```
$ nzbget -L H

Request sent
History (recent items first)
-----------------------------------
[5] Debian DISK2 (104 files, 4.22 GB, Par failed, Script failed)
[4] Debian DISK1 (85 files, 3.97 GB, Script successful)
[2] Ubuntu 2006 (111 files, 4.79 GB, Script successful)
-----------------------------------
Items: 3
```

The numbers in square braces are IDs of the history items. These IDs are needed by command [[#Command_--edit | --edit]].

### Server status ###
The subcommands "F" and "G" in addition to file or group lists print server status. This info can be also printed without lists using subcommand "S":
```
$ nzbget -L S

Request sent
Remaining size: 0.00 MB
Current download rate: 0.0 KB/s
Session download rate: 346.7 KB/s
Up time: 45:02:32
Download time: 20:53:38
Downloaded: 25467.91 MB
Threads running: 4
Server state: Stand-By
```

## Command --pause ##
Command `--pause` (short form `-P`) requests the server to pause:
- **\<empty>** or **D** - pause download;
- **O** - pause postprocessor;
- **S** - pause scan.

### Pause download ###
To pause download queue use command `--pause` without any subcommands:
```
$ nzbget -P

Request sent
server returned: Pause-/Unpause-Command completed successfully
```

The server completes active article downloads before pausing.

You can also specify subcommand "D" with the same effect:
```
$ nzbget -P D
```

### Pause post-processor ###
The subcommand "O" pauses post-processor queue:
```
$ nzbget -P O

Request sent
server returned: Pause-/Unpause-Command completed successfully
```

Server pauses the processing of post-processor queue and also attempts to pause the active post-processing job: par-jobs can be paused mostly instantly. The pausing of a script job can take several seconds but sometimes is not possible at all. Technically the pausing of a script job is performed in a following way: during execution of a script nzbget constantly processes script's output and redirects it to nzbget's log. After a text line is received from the script nzbget checks the pause-state of post-processor. If it is paused nzbget doesn't return the execution to the script until the post-processor is unpaused. 
This means that the script should prints messages possibly often. For example, when executing unrar-command the output of unrar should not be redirected to /dev/null.

### Pause scan ###
Subcommand "S" pauses the automatic scanning of incoming nzb-directory:
```
$ nzbget -P S

Request sent
server returned: Pause-/Unpause-Command completed successfully
```

When the automatic scanning is paused it is still possible to process incloming nzb-directory by manually executing of command `--scan`.

## Command --unpause ##
Command `--unpause` (short form `-U`) requests the server to resume:
- **\<empty>** or **D** - unpause download;
- **O** - unpause postprocessor;
- **S** - unpause scan.

### Unpause download ###
To resume download queue use command `--unpause` without any subcommands:
```
$ nzbget -U

Request sent
server returned: Pause-/Unpause-Command completed successfully
```

You can also specify subcommand "D" with the same effect:
```
$ nzbget -U D
```

### Unpause postprocessor ###
The subcommand "O" resumes postprocessor queue:
```
$ nzbget -U O

Request sent
server returned: Pause-/Unpause-Command completed successfully
```

### Unpause scan ###
Subcommand "S" resumes the automatic scanning of incoming nzb-directory:
```
$ nzbget -U S

Request sent
server returned: Pause-/Unpause-Command completed successfully
```

## Command --rate ##
Command `--rate` (short form `-R`) sets download rate (other names: speed limit, bandwidth throttling) on server in KB/s. In following example we set speed limit to 200 KB/s:
```
$ nzbget -R 200

Request sent
server returned: Rate-Command completed successfully
```

The limit effects all connections. Special value *'0*' disables the speed control (no limit).

## Command --log ##
Command `--log` (short form `-G`) prints messages saved in server's screen buffer. The command requires one parameter *number of lines*. Example for printing of last 20 messages:
```
$ nzbget -G 20

Request sent
Log (last 20 entries)
-----------------------------------
[INFO] nzbget 0.7.0-testing server-mode
[INFO] Unpausing download
[INFO] Deleting file Linux.Ubuntu.dvdr.r02 from download queue
[DETAIL] Downloading Ubuntu 2006\Linux.Ubuntu.dvdr.r01 [2/79] @ europe.news.astraweb.com
[DETAIL] Downloading Ubuntu 2006\Linux.Ubuntu.dvdr.r01 [1/79] @ europe.news.astraweb.com
[ERROR] Authorization for europe.news.astraweb.com failed 
(Answer: 502 Invalid username or password)
[WARNING] Article Ubuntu 2006\Linux.Ubuntu.dvdr.r01 [2/79] @ europe.news.astraweb.com failed
[DETAIL] Waiting 10 sec to retry
<OUTPUT STRIPPED>
-----------------------------------
```

Options InfoTarget, ErrorTarget, etc in configuration file on server determine what messages should be saved to screen log buffer. Specifiyng of these options in remote client does not effect filtering.

## Command --scan ##
Command `--scan` (short form `-S`) forces the server to scan incoming nzb-firectory for nzb-files:
```
$ nzbget -S

Request sent
server returned: Scan-Command scheduled successfully
```

When performing interval scans (option **NZBDirInterval**) server checks that the file was not modified for few seconds (option **NzbDirFleAge**) before processing it. In contrast to interval scans by a forced scan all nzb-files in incoming nzb-directory will be added to download queue without that check.

## Command --edit ##
Command `--edit` (short form `-E`) is used to change the items in download queue, postprocessor queue or in history. That's the most complex command. The command has several arguments. The first argument define the target (queue or list) affected by the command. If the first argument is omitted the command affects individual files in download queue (default behavior):
- **\<empty>** - individual files in download queue;
- **G** - groups in download queue;
- **O** - postprocessor queue;
- **H** - history.

The second argument defines action, which should be performed. The list of available actions depends on used target (the first argument in the command).

The third and further arguments list the IDs of items, affected by the command. If the command should edit only one item it is simply the ID of the item. If more than one item is used they must be separated with comma. It is also possible to pass ranges of IDs using character "-". Examples of IDs:
- 1
- 1,3,6
- 1-5,3,10-22

### Individual files ###
Following actions are available for editing of individual files in download queue:
- **T** - move file to the top of download queue;
- **B** - move file to the bottom of download queue;
- **+\<offset>** - move file down in download queue to \<offset>;
- **-\<offset>** - move file up in download queue to \<offset>;
- **P** - pause file;
- **U** - unpause (resume) file;
- **D** - delete file from download queue;

The IDs of files are listed in square braces by the command `nzbget -L F` (see  [command --list](#command---list)).

Example: move two files with IDs #5 and #10 two positions up in queue:
```
$ nzbget -E -2 5,10

Request sent
server returned: Edit-Command completed successfully
```

Example: move file with ID #20 five positions down in queue:
```
$ nzbget -E +5 20

Request sent
server returned: Edit-Command completed successfully
```

Example: move file with ID #15 to the top of queue:
```
$ nzbget -E T 15

Request sent
server returned: Edit-Command completed successfully
```

Example: delete files with IDs from 100 to 199 from queue:
```
$ nzbget -E D 100-199

Request sent
server returned: Edit-Command completed successfully
```

### Groups ###
Following actions are available for editing of groups in download queue:
- **T** - move group to the top of download queue;
- **B** - move group to the bottom of download queue;
- **+\<offset>** - move group down in download queue to \<offset>;
- **-\<offset>** - move group up in download queue to \<offset>;
- **P** - pause group;
- **U** - unpause (resume) group;
- **A** - pause all par-files in group;
- **R** - pause all par-files in group except the main par-file;
- **D** - delete group from download queue;
- **K \<name>** - define category \<name> for group;
- **M** - merge groups. The list of IDs must contains at least two IDs. The first ID is the target for merging.
- **O \<name>=\<value>** - add or change the post-process parameter \<name> to \<value> for group.

After executing of move-commands (T, B, +\<offset>, -\<offset>) the individual files belonging to affected group is aligned, if they were not before. That can happen only if the individual files were moved manually in queue.

Command edit for groups requires IDs of files to be passed. For this purpose the ID of any file belonging to the group can be used. The command `nzbget -L G` prints the first and the last ID of the group (see [Groups in download queue](#groups-in-download-queue)). It's better to use the last ID to avoid the situation when the ID of the first file in download queue was passed and the file was completely downloaded and removed from download queue before the edit command was received.

Example: pause the group containing files with IDs #200-259:
```
$ nzbget -E G P 259

Request sent
server returned: Edit-Command completed successfully
```

Example: assign category "my videos" to the group containing files with IDs #451-958:
```
$ nzbget -E G K "my videos" 958

Request sent
server returned: Edit-Command completed successfully
```

Example: merge free groups. The first group, which is also used as target, contains files with IDs #50-121, the second group contains files #122-159 and the third group contains files #160-198:
```
$ nzbget -E G M 121 159 198

Request sent
server returned: Edit-Command completed successfully
```

Example: set the post-processing parameter "password" with value "my pass" for two groups: one with files #60-66 and another with files #159-186:
```
$ nzbget -E G O "password=my pass" 66 186

Request sent
server returned: Edit-Command completed successfully
```

### Post-processor queue ###
Following actions are available for editing of items in post-processor queue:
- **T** - move post-job to the top of post-processor queue;
- **B** - move post-job to the bottom of post-processor queue;
- **+\<offset>** - move post-job down in post-processor queue to \<offset>;
- **-\<offset>** - move post-job up in post-processor queue to \<offset>;
- **D** - delete post-job from post-processor queue;

Move-commands accept only one post-job at a time, delete-command can process several post-jobs at once. Move-commands cannot change the order of the top job, which remains active. If delete-command is used on active post-job the job is terminated: for a par-job it means cancelling of par-check/repair, for script-job - terminating of the post-processing script by killing it.

Command *edit for post-processor queue* requires IDs of post-jobs to be passed. These IDs are printed by list-command `nzbget -L O`.

### History list ###
Following actions are available for editing of items in history list:
- **P** - post-process history item again;
- **R** - return history item back to download queue. This command is available only if there are remaining files, which were not downloaded (par2-files);
- **D** - delete item from history;

All commands can process several history items at once.

Command *edit for history list* requires IDs of history items to be passed. These IDs are printed by list-command `nzbget -L H`.

## Command --write ##
Command `--write` (short form `-W`) adds a message to the server log. The second parameter determines the type of message:
- **D** - Detail;
- **I** - Info;
- **W** - Warning;
- **E** - Error;
- **D** - Debug (only if the server was compiled in debug-mode);
The third parameter is the text of message.

For example:
```
$ nzbget -W I "Hello World!"

Request sent
server returned: Message added to log
```

This command can be used from shell scripts when it is desired to submit any information to nzbget's user. Depending on options **DetailTarget**, **InfoTarget**, etc. the messages may be filtered and not appear in the log.
