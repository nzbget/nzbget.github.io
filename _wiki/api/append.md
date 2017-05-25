---
title: API-method "append"
---
## Syntax
```C#
int append(string NZBFilename, string NZBContent, string Category,
    int Priority, bool AddToTop, bool AddPaused, string DupeKey,
    int DupeScore, string DupeMode, array PPParameters)
```

Add nzb-file or URL to download queue.

## Parameters
- **NZBFilename** (string) - name of nzb-file (with extension). This parameter can be an empty string if parameter **Content** contains an URL; in that case the file name is read from http headers. If **NZBFilename** is provided it must have correct extension (usually ".nzb") according to file content. Files without ".nzb"-extension are not added to queue directly; all files however are sent to scan-scripts.
- **Content** (string) - content of nzb-file encoded with Base64 or URL to fetch nzb-file from.
- **Category** (string) - category for nzb-file. Can be empty string. 
- **Priority** (int) - priority for nzb-file. 0 for "normal priority", positive values for high priority and negative values for low priority. Downloads with priorities equal to or greater than 900 are downloaded and post-processed even if the program is in paused state (force mode). Default priorities are: -100 (very low), -50 (low), 0 (normal), 50 (high), 100 (very high), 900 (force).
- **AddToTop** (bool) - "True" if the file should be added to the top of the download queue or "False" if to the end. 
- **AddPaused** (bool) - "True" if the file should be added in paused state.
- **DupeKey** (string) - duplicate key for nzb-file. See [RSS](RSS).
- **DupeScore** (int) - duplicate score for nzb-file. See [RSS](RSS).
- **DupeMode** (string) - duplicate mode for nzb-file. See [RSS](RSS).
- **PPParameters** (array) - **`v16.0`** post-processing parameters. The array consists of structures with following fields:
  - **Name** (string) - name of post-processing parameter.
  - **Value** (string) - value of post-processing parameter.

## Return value
Positive number representing *NZBID* of the queue item. "0" and negative numbers represent error codes. Current version uses only error code "0", newer versions may use other error codes for detailed information about error.

## Examples
Read local nzb-file from disk and send it to NZBGet, adding file to download queue:
```shell
C:\>C:\Programme\Python25\python.exe
Python 2.5.1 (r251:54863, Apr 18 2007, 08:51:08) [MSC v.1310 32 bit (Intel)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> from xmlrpclib import ServerProxy
>>> server = ServerProxy('http://nzbget:tegbzn6789@localhost:6789/xmlrpc')
>>> filename="C:\\ubuntu-7.10.nzb"
>>> in_file = open(filename, "r")
>>> nzbcontent = in_file.read()
>>> in_file.close()
>>> from base64 import standard_b64encode
>>> nzbcontent64=standard_b64encode(nzbcontent)
>>> server.append(filename, nzbcontent64, 'software', 0, False, False, '', 0, 'SCORE',  [('*unpack:', 'yes'), ('EMail.py:', 'yes')])
True
>>>
```