---
title: API-method "configtemplates"
---
## Syntax
```swift
struct[] configtemplates(bool LoadFromDisk) 
```
Returns NZBGet configuration file template and also extracts configuration sections from all post-processing files. This information is for example used by web-interface to build settings page or page "Postprocess" in download details dialog.

## Parameters
- **LoadFromDisk** (bool) - **`v15.0`** "True" - load templates from disk, "False" - give templates loaded on program start.

## Return value
This method returns array of structures with following fields:
- **Name** (string) - Post-processing script name. For example "videosort/VideoSort.py". This field is empty in the first record, which holds the config template of the program itself.
- **DisplayName** (string) - Nice script name ready for displaying. For example "VideoSort".
- **PostScript** (bool) - "True" for post-processing scripts.
- **ScanScript** (bool) - "True" for scan scripts.
- **QueueScript** (bool) - "True" for queue scripts.
- **SchedulerScript** (bool) - "True" for scheduler scripts.
- **Template** (string) - Content of the configuration template (multiple lines).
