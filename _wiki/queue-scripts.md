---
---
## About queue scripts ##
Queue scripts are called after the download queue was changed. In the current version the queue scripts are called on defined events, described later. In the future they can be called on other events too.

To activate a queue script or multiple scripts put them into **ScriptDir**, then choose them in option **Extensions** (**QueueScript** in older NZBGet versions).

## Writing queue scripts ##
Queue scripts are a kind of *Extension scripts*.

**Please read [Extension scripts](Extension_scripts) for general information about extension scripts first!**

This document describes the unique features of queue scripts.

## Configuration options ##
Like other extension scripts the scan scripts get [NZBGet configuration options](Extension_scripts#nzbget-configuration-options) (env. vars with prefix **NZBOP_**) and [Script configuration options](Extension_scripts#script-configuration-options) (env. vars with prefix **NZBPO_**) passed. In addition the information about the file currently processed is passed as well:

## Queue event information ##
- **NZBNA_DIRECTORY** - Destination directory for downloaded files.
- **NZBNA_FILENAME** - Filename of the nzb-file. If the file was added from nzb-directory this is the fullname with path. If the file was added via web-interface it contains only filename without path.
- **NZBNA_NZBNAME** - Nzb-name as displayed in web-interface.
- **NZBNA_URL** - URL if the nzb-file was fetched from an URL.
- **NZBNA_CATEGORY** - Category of nzb-file.
- **NZBNA_PRIORITY** - Priority of nzb-file.
- **NZBNA_NZBID** - ID of queue entry, can be used in RPC-calls.
- **NZBNA_EVENT** - Describes why the script was called. See below.
- **NZBNA_URLSTATUS** - Details for event type **URL_COMPLETED**. One of "FAILURE", "SCAN_SKIPPED", "SCAN_FAILURE".
- **NZBNA_DELETESTATUS** - Details for event type **NZB_DELETED**. One of "MANUAL", "DUPE", "BAD", "GOOD", "COPY", "SCAN".

## Queue event type ##
The event type is passed with env. var **NZBNA_EVENT** and can have following values:
- **NZB_ADDED** - after adding of nzb-file to queue;
- **FILE_DOWNLOADED** - after a file included in nzb is downloaded;
- **NZB_DOWNLOADED** - after all files in nzb are downloaded (before post-processing);
- **NZB_DELETED** - after nzb-file is deleted from queue, by duplicate check or manually by user;
- **URL_COMPLETED** - after an nzb-file queued with URL is fetched but could no be added for download.

In the future the list of supported events may be extended. To avoid conflicts with future NZBGet versions the script must exit if the parameter has a value unknown to the script:

```python
if os.environ.get('NZBNA_EVENT') not in ['NZB_ADDED', 'NZB_DOWNLOADED']:
	sys.exit(0)
```

In addition to checking the parameter **NZBNA_EVENT** the script can tell NZBGet what events it is interested in, using a special event signature following the script signature:

```shell
### NZBGET QUEUE SCRIPT
### QUEUE EVENTS: NZB_ADDED, NZB_DOWNLOADED
```

That has an advantage that the script isn't called on events it can't process anyway.

## Control commands ##
Queue scripts can change properties of nzb-file by printing special messages into standard output (which is processed by NZBGet).

To assign post-processing parameters:
```shell
echo "[NZB] NZBPR_myvar=my value";
```

The prefix "NZBPR_" will be removed. In this example a post-processing parameter with name "myvar" and value "my value" will be associated with nzb-file.

To cancel downloading and mark nzb as bad:
```shell
echo "[NZB] MARK=BAD";
```

When processing event **NZB_DOWNLOADED**, which is fired after all files are downloaded and just before unpack starts the script can change final directory for nzb:
```shell
echo "[NZB] DIRECTORY=/mnt/movies";
```

## Synchronous/asynchronous and event queue ##
Only one queue script is executed at a given time. If other events have occurred during executing of the script the events are stored in a special queue and are processed later, when the script terminates.

There are two kinds of events: synchronous and asynchronous. When a **synchronous** event must be processed NZBGet executes queue script and waits for its termination before processing the nzb-file further. Only one event is of this kind - it's **NZB_DOWNLOADED**.

All other events are **asynchronous**. When a script is executed for an asynchronous event it's possible that at the time a certain part of script is being processed the state of nzb-file was changed or the file was even deleted. Scripts must take this possibility into account.

Although events **FILE_DOWNLOADED** are supposed to be executed after each downloaded file (part of nzb), no more than one event of this kind for a given nzb is preserved in the processing queue. This means that if during execution of queue scripts multiple files were completed only one event "FILE_DOWNLOADED" will be processed. Therefore scripts should not assume to be called for every downloaded file. Furthermore there is a program option **EventInterval** to reduce the number of script executions (and system load) for event "FILE_DOWNLOADED".