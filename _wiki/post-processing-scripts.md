---
title: Post-processing scripts
---
## About post-processing scripts
After the download of nzb-file is completed NZBGet can call post-processing scripts (pp-scripts). The scripts can perform further processing of downloaded files such es delete unwanted files (*.url, etc.), send an e-mail notification, transfer the files to other application and do any other things. Please note that the par-check/repair and unpack are performed by NZBGet internally and are not part of post-processing scripts. You can activate par-check/repair and unpack without using of any post-processing scripts.

When a new nzb-file is added to queue it doesn't have any pp-scripts assigned to it by default. You can define what scripts should be called for the nzb-file using option **Extensions** (**PostScript** in older NZBGet versions) in section **EXTENSION SCRIPTS**. You can also define a different set of pp-scripts for each category.

Please note that these settings define "defaults" for nzb-file. When you change option **Extensions** (**PostScript**) this has no effect on already enqueued downloads. However it's possible to alter the assigned pp-scripts for each nzb-file individually. To do so click on the nzb-file in the list of downloads, then click on **Postprocess**.

If you use more than one script for one nzb-file it can be important to set the correct order of execution. The order is controlled by the option **ScriptOrder**. That is a global setting affecting all categories and also defining the order scripts are listed in the *download details dialog*.

## Writing post-processing scripts
Post-processing scripts are a kind of *Extension scripts*.

**Please read [Extension scripts](Extension_scripts) for general information about extension scripts first!**

This document describes the unique features of post-processing scripts.

## Configuration options
Like other extension scripts the scan scripts get [NZBGet configuration options](Extension_scripts#nzbget-configuration-options) (env. vars with prefix **NZBOP_**) and [Script configuration options](Extension_scripts#script-configuration-options) (env. vars with prefix **NZBPO_**) passed. In addition the information about the file currently processed is passed as well:

## Nzb-file information
The information about nzb-file which is currently processed:
- **NZBPP_DIRECTORY** - Path to destination dir for downloaded files.
- **NZBPP_FINALDIR** - Final directory, if set by one of previous scripts (see below).
- **NZBPP_NZBNAME** - User-friendly name of processed nzb-file as it is displayed by the program. The file path and extension are removed. If download was renamed, this parameter reflects the new name.
- **NZBPP_NZBFILENAME** - Name of processed nzb-file. If the file was added from incoming nzb-directory, this is a full file name, including path and extension. If the file was added from web-interface, it's only the file name with extension. If the file was added via RPC-API (method **append**), this can be any string but the use of actual file name is recommended for developers.
- **NZBPP_CATEGORY** - Category assigned to nzb-file (can be empty string).
- **NZBPP_TOTALSTATUS** - **`v13.0`** Total status of nzb-file:
   - **SUCCESS** - everything OK;
   - **WARNING** - download is damaged but probably can be repaired; user intervention is required;
   - **FAILURE** - download has failed or a serious error occurred during post-processing (unpack, par);
   - **DELETED** - download was deleted; post-processing scripts are usually not called in this case; however it's possible to force calling scripts with command "post-process again".
- **NZBPP_STATUS** - Complete status info for nzb-file: it consists of total status and status detail separated with slash. There are many combinations. Just few examples:
   - FAILURE/HEALTH;
   - FAILURE/PAR;
   - FAILURE/UNPACK;
   - WARNING/REPAIRABLE;
   - WARNING/SPACE;
   - WARNING/PASSWORD;
   - SUCCESS/ALL;
   - SUCCESS/UNPACK.
   - For the complete list see description of [API-Method "history"](api/history).
   - **NOTE:** one difference to the status returned by method *history* is that *NZBPP_STATUS* assumes all scripts are ended successfully. Even if one of the scripts executed before the current one has failed the status will not be set to *WARNING/SCRIPT* as method *history* will do. For example for a successful download the status would be *SUCCESS/ALL* instead. Because most scripts don't depend on other scripts they shouldn't assume the download has failed if any of the previous scripts (such as a notification script) has failed. The scripts interested in that info still can use parameter *NZBPP_SCRIPTSTATUS*.
- **NZBPP_SCRIPTSTATUS** - **`v13.0`** Summary status of the scripts executed before the current one:
   - **NONE** - no other scripts were executed yet or all of them have ended with exit code "NONE";
   - **SUCCESS** - all other scripts have ended with exit code "SUCCESS" ;
   - **FAILURE** - at least one of the script has failed.
- **NZBPP_PARSTATUS** - **~~`v13.0`~~** Result of par-check:
   - **0** = not checked: par-check is disabled or nzb-file does not contain any par-files;
   - **1** = checked and failed to repair;
   - **2** = checked and successfully repaired;
   - **3** = checked and can be repaired but repair is disabled;
   - **4** = par-check needed but skipped (option ParCheck=manual).
   - Deprecated, use *NZBPP_STATUS* and *NZBPP_TOTALSTATUS* instead.
- **NZBPP_UNPACKSTATUS** - **~~`v13.0`~~** Result of unpack:
   - **0** = unpack is disabled or was skipped due to nzb-file properties or due to errors during par-check;
   - **1** = unpack failed;
   - **2** = unpack successful;
   - **3** = write error (usually not enough disk space);
   - **4** = wrong password (only for rar5 archives).
   - Deprecated, use *NZBPP_STATUS* and *NZBPP_TOTALSTATUS* instead.

#### Example: test if download failed
```shell
if [ "$NZBPP_TOTALSTATUS" != "SUCCESS" ]; then
	echo "[ERROR] This nzb-file was not processed correctly, terminating the script"
	exit 95
fi
```

## Post-processing parameters
Sometimes a script might need an option specific to nzb-file. Best example - unpack password. NZBGet allows pp-script to define nzb-file specific options, so called post-processing parameters (pp-parameters). PP-Parameters must be declared in the configuration definition of the script. NZBGet reads the definition and adds necessary ui-elements to **download details dialog** on page **Postprocess**.

Post-processing parameters are declared using configuration section "POST-PROCESSING PARAMETERS". For example a video recode script could have a parameter "Resolution":

```shell
##############################################################################
### POST-PROCESSING PARAMETERS                                             ###

# Video resolution (default, 480p, 720p, 1080p).
Resolution=default
```

**NOTE:** Only post-processing scripts can have post-processing parameters. Scan, queue and scheduler scripts can not have them.

Post-processing parameters are passed using env-vars with prefix **NZBPR_**. Like script-options there are two env-vars for each parameter:

* one env-var with the name exactly as defined by pp-parameter
* another env-var with the name written in UPPER CASE and with special characters replaced with underscores

For example, for pp-parameter **Resolution** two env-vars are passed: **NZBPR_Resolution** and **NZBPR_RESOLUTION**.

**NOTE**: when nzb-file is added to download queue it doesn't have any pp-parameters. Only if the user opens *edit download dialog* and changes pp-parameters they are getting assigned to nzb-file and will be passed to pp-script. The script **MUST** work properly even if no pp-parameters were passed; it **MUST** use default values for pp-parameters.

Example (bash):
```shell
Resolution=$NZBPR_RESOLUTION
if [ "$Resolution" = "" ]; then
	Resolution="480p"
fi
```

Example (python):
```python
Resolution="480p"
if 'NZBPR_RESOLUTION' in os.environ:
	Resolution=os.environ['NZBPR_RESOLUTION']
```

## Exit codes
For post-processing scripts NZBGet checks the exit code of the script and sets the status in history item accordingly. Scripts can use following exit codes:
- **93** - Post-process successful (status = SUCCESS).
- **94** - Post-process failed (status = FAILURE).
- **95** - Post-process skipped (status = NONE). Use this code when you script terminates immediately without doing any job and when this is not a failure termination.
- **92** - Request NZBGet to do par-check/repair for current nzb-file. This code can be used by pp-scripts doing unpack on their own.

Scripts **MUST** return one of the listed status codes. If any other code (including 0) is returned the history item is marked with status **FAILURE**.

#### Example: exit code ###
```shell
POSTPROCESS_SUCCESS=93
POSTPROCESS_ERROR=94
echo "Hello from test script";
exit $POSTPROCESS_SUCCESS
```

## Control commands
Post-processing scripts which move downloaded files can inform NZBGet about that by printing special messages into standard output (which is processed by NZBGet). This allows the scripts called thereafter to process the files in the new location. Use command *DIRECTORY*:
```shell
echo "[NZB] DIRECTORY=/path/to/new/location";
```

The scripts executed after your script assume the files in the directory belong to the current download. If your script moves files into a non empty directory which already contains other files, your should not use that command. Otherwise the other scripts may process all files in the directory, even the files existed before. In that case use command *FINALDIR* instead (which has less consequences):
```shell
echo "[NZB] FINALDIR=/path/to/new/location";
```

Command *FINALDIR* sets a separate property *FinalDir* of the download. If it is set, that path is shown in the history dialog in web-interface. That path is also passed to post-processing scripts in a separate parameter (env. var. *NZBPP_FINALDIR*), which most scripts ignore. Command *DIRECTORY* changes the destination path of the download and affects the code accessing that info, for example the command *Post-process again* will work on new path.

## Testing
To test a pp-script save it to a text file, make it executable and put into **ScriptDir**. Then refresh the page in web-browser (a reload of NZBGet is not needed), click on any download in the download list, then click on button **Postprocess**. Here select your script. When the download is finished the script is executed.

**TIP**: to test a script after you made changes to it, use command **Post-process again** from the history page in web-interface.

Example of a very simple post-processing script:
```shell
#!/bin/sh 

#######################################
### NZBGET POST-PROCESSING SCRIPT   ###

# Print test message.
#
# This is a test script. It prints one message to log. Here in the
# long description we could write instructions for user.
#
# The long description can have multiple paragraphs when needed. Like
# this one.

### NZBGET POST-PROCESSING SCRIPT   ###
#######################################

echo "post-processing script test"
```

Our simple test script prints a message to standard output stream:
```shell
echo "post-processing script test"
```

NZBGet receives the message and adds it to Messages-log. You can set message kind by using prefixes:
```shell
echo "[DETAIL] This is detail-message"
echo "[INFO] This is info-message"
echo "[WARNING] This is warning-message"
echo "[ERROR] This is error-message"
```
