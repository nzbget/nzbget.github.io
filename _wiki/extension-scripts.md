---
---
## About extension scripts
The core functionality of NZBGet can be extended using extension scripts. NZBGet provides documented entry points for scripts. On certain events the scripts are executed, they receive information about event, do certain work and can communicate with NZBGet to give it instructions for further processing.

## Using extension scripts
Option **ScriptDir** defines the location of extension scripts. To make a script available in NZBGet put the script into this directory. Then go to settings tab in web-interface (if you were already on settings tab switch to downloads tab and then back to settings tab to reread the list of available scripts from the disk).

Menu at the left of page should list all extension scripts found in **ScriptDir**. Select a script to review or change its options (if it has any).

## Writing extension scripts
This article describes how to write extension scripts in general. For specific information about certain kinds of scripts please also read the dedicated articles.

## Configuration definition
Each script must have a configuration definition. The definition starts with one of the possible signatures depending on the purpose of the script:
```shell
### NZBGET POST-PROCESSING SCRIPT
### NZBGET SCAN SCRIPT
### NZBGET QUEUE SCRIPT
### NZBGET SCHEDULER SCRIPT
```
To end the definition the same signature is used.

If the script can be used for multiple purposes the signature can be mixed, for example:
```shell
### NZBGET SCAN/QUEUE SCRIPT
```
Example of a very simple post-processing script:
```shell
#!/bin/sh 

###########################################
### NZBGET POST-PROCESSING SCRIPT       ###

# Print test message.
#
# This is a test script. It prints one message to log. Here in the
# long description we could write instructions for user.
#
# The long description can have multiple paragraphs when needed. Like
# this one.

### NZBGET POST-PROCESSING SCRIPT       ###
###########################################

echo "post-processing script test"
```

The first part of configuration is a short description:
```shell
# Print test message.
```

This line is a short description of what our pp-script does. The *short description* stays near the script name in the **edit download dialog**. This should be a short one sentence description.
The long description is separated with an empty line.

### What is considered a script
NZBGet scans all files in script-directory (option **ScriptDir**) and all files in first-level sub-directories looking for script definition signature `### NZBGET <PURPOSES> SCRIPT`. If a signature is found, the file is considered to be a script.

**NOTE:** for performance reasons NZBGet scans only first 10KB of the script. Put the script definition at the beginning of the script. The script definition can be longer than 10KB but it must start within first 10KB of the script.

### Configuration options
Let's say we are writing a script to send E-Mail notification. The user needs to configure the script with options such as SMTP-Server host, port, login and password. To avoid hard-coding of these data in the script NZBGet allows the script to define the required options in the configuration section. The options are then made available on the settings page for user to configure.

Every option belongs to a configuration section. In the next example we define a new section with two options:

```shell
################################
### OPTIONS                  ###

# SMTP server host.
#Server=smtp.gmail.com

# SMTP server port (1-65535).
#Port=25
```

If your script have a lot of options you can define more than one section but you should try to avoid this. Splitting your script into several scripts may be a better alternative.

When the user saves settings in web-interface the script configuration options are saved to NZBGet configuration file using the script name as prefix. For example:
```
EMail.py:Server=smtp.gmail.com
EMail.py:Port=25
```

When the script is executed NZBGet passes the values of all configuration options to the script using environment variables. This will be described later in this document.

Since NZBGet automatically adds script name when saving the options, the options defined in different scripts are not interfere with each other or with NZBGets own options. It's not necessary to add a prefix to option names.

**Bad**:
```shell
# SMTP server host.
#EMailServer=smtp.gmail.com

# SMTP server port (1-65535).
#EMailPort=25
```

**Good**:
```shell
# SMTP server host.
#Server=smtp.gmail.com

# SMTP server port (1-65535).
#Port=25
```

Notice the options *EMailServer* and *EMailPort* renamed to *Server* and *Port*.

## Script context
NZBGet passes different information to the script. All data is passed as environment variables (env-vars).

### NZBGet configuration options
All NZBGet configuration options are passed using env-vars with prefix **NZBOP_**. The variable names are written in UPPER CASE. For Example option **ParRepair** is passed as environment variable **NZBOP_PARREPAIR**. The dots in option names are replaced with underscores, for example **NZBOP_SERVER1_HOST**. For options with predefined possible values (yes/no, etc.) the values are passed always in lower case.

#### Example: test if option "Unpack" is active
```shell
if [ "$NZBOP_UNPACK" != "yes" ]; then
	echo "[ERROR] Please enable option \"Unpack\" in nzbget configuration file"
fi
```

### Script configuration options
Script configuration options (script-options) are passed using env-vars with prefix **NZBPO_**. There are two env-vars for each option:
- one env-var with the name exactly as defined by pp-option;
- another env-var with the name written in UPPER CASE and with special characters replaced with underscores.

For example, for pp-option **Server.Name** two env-vars are passed: **NZBPO_Server.Name** and **NZBPO_SERVER_NAME**.

**NOTE**: In a case the user has installed the script but have not saved the configuration, the options are not saved to configuration file yet. The script will not get the options passed. This is a situation your script must handle. You can either use a default settings or terminate the script with a proper message asking the user to check and save configuration in web-interface. Example (python):
```shell
required_options = ('NZBPO_FROM', 'NZBPO_TO', 'NZBPO_SERVER', 'NZBPO_PORT', 'NZBPO_ENCRYPTION',
	'NZBPO_USERNAME', 'NZBPO_PASSWORD', 'NZBPO_FILELIST', 'NZBPO_BROKENLOG', 'NZBPO_POSTPROCESSLOG')
for optname in required_options:
	if (not optname in os.environ):
		print('[ERROR] Option %s is missing in configuration file. Please check script settings' % optname[6:])
		sys.exit(POSTPROCESS_ERROR)
```

## Custom commands
Sometimes it may be helpful to be able to execute extension scripts from settings page. For example pp-script EMail.py could use a button "Send test email". For other scripts something like "Validate settings" or "Cleanup database" may be useful too.

Starting from v19 it is possible to put buttons on the script settings page. The buttons are defined as part of script configuration, similar to script configuration options but with a slightly different syntax:
```shell
# To check connection parameters click the button.
#ConnectionTest@Send Test E-Mail
```
This example creates a button with text "Send Test E-Mail" and description "To check connection parameters click the button.".

The line defining button name and caption should not contain equal character (`=`). Otherwise it would appear as an usual option with edit field.

Older NZBGet versions (prior v19) ignore command definitions. Therefore scripts utilizing the new feature can be also used in older NZBGet version without breaking it.

When user presses the button NZBGet executes the script in a special context passing button name via env. var `NZBCP_COMMAND`. The script can check if it runs in command mode by examining this variable (python example):
```python
# Exit codes used by NZBGet
COMMAND_SUCCESS=93
COMMAND_ERROR=94

# Check if the script is executed from settings page with a custom command
command = os.environ.get('NZBCP_COMMAND')
test_mode = command == 'ConnectionTest'
if command != None and not test_mode:
	print('[ERROR] Invalid command ' + command)
	sys.exit(COMMAND_ERROR)

if test_mode:
	print('[INFO] Test connection...')
	sys.exit(COMMAND_SUCCESS)

<script continues in normal mode>
```

During execution of the script NZBGet presents a special dialog showing script output. The script must exit with one of predefined exit codes indicating success (exit code `93`) or failure (exit code `94`).

User may close the progress dialog but the script continues running in the background. All messages printed by the script are saved to NZBGet log and are seen in web-interface on Messages tab.

See post-processing script [EMail.py](https://github.com/nzbget/nzbget/blob/develop/scripts/EMail.py) for the reference implementation.

## Extension script kinds
Further reading:
- [Post-processing scripts](post-processing-scripts)
- [Scan scripts](scan-scripts)
- [Queue scripts](queue-scripts)
- [Scheduler scripts](scheduler-scripts)
- [Feed scripts](feed-scripts)

## Tips
### Testing NZBGet version
NZBGet version is passed in env-var **NZBOP_VERSION**. Example values:
- for stable version: nzbget-11.0;
- for testing version: nzbget-11.0-testing-r620

Example (python):
```python
NZBGetVersion=os.environ['NZBOP_VERSION']
if NZBGetVersion[0:5] < '11.1':
	print('[ERROR] This script requires NZBGet 11.1 or newer. Please update NZBGet')
	sys.exit(POSTPROCESS_ERROR)
```

### Communication with NZBGet via command line
NZBGet can be controlled via command line using remote commands. For documentation on available commands see [Command line reference](command-line-reference).

When calling NZBGet you need to know two things:
- the location of NZBGet binary;
- the location of NZBGet configuration file.

These both informations are available in env-vars **NZBOP_APPBIN** and **NZBOP_CONFIGFILE**.

Example: soft-pause download queue:
```shell
 "$NZBOP_APPBIN" -c "$NZBOP_CONFIGFILE" -P
```

### Communication with NZBGet via RPC-API
With RPC-API more things can be done than using command line. For documentation on available RPC-methods see [API](api).

Example: obtaining post-processing log of current nzb-file (this is a short version of script *Logger.py* supplied with NZBGet):
```python
import os
import sys
import datetime
from xmlrpclib import ServerProxy

## Exit codes used by NZBGet
POSTPROCESS_SUCCESS=93
POSTPROCESS_ERROR=94

# To get the post-processing log we connect to NZBGet via XML-RPC
# and call method "postqueue", which returns the list of post-processing job.
# The first item in the list is current job. This item has a field 'Log',
# containing an array of log-entries.
# For more info visit http://nzbget.net/RPC_API_reference

# First we need to know connection info: host, port, username and password of NZBGet server.
# NZBGet passes all configuration options to post-processing script as
# environment variables.
host = os.environ['NZBOP_CONTROLIP'];
port = os.environ['NZBOP_CONTROLPORT'];
username = os.environ['NZBOP_CONTROLUSERNAME'];
password = os.environ['NZBOP_CONTROLPASSWORD'];

if host ## '0.0.0.0': host = '127.0.0.1'

# Build an URL for XML-RPC requests
rpcUrl = 'http://%s:%s@%s:%s/xmlrpc' % (username, password, host, port);

# Create remote server object
server = ServerProxy(rpcUrl)

# Call remote method 'postqueue'. The only parameter tells how many log-entries to return as maximum.
postqueue = server.postqueue(10000)

# Get field 'Log' from the first post-processing job
log = postqueue[0]['Log']

# Now iterate through entries and save them to the output file
if len(log) > 0:
	f = open('%s/_postprocesslog.txt' % os.environ['NZBPP_DIRECTORY'], 'w')
	for entry in log:
		f.write('%s\t%s\t%s\n' % (entry['Kind'], datetime.datetime.fromtimestamp(int(entry['Time'])), entry['Text']))
 	f.close()

sys.exit(POSTPROCESS_SUCCESS)
```

### Script consisting of multiple files
If your script consists or multiple files, put the script and all related files into a subdirectory within ppscripts-directory. NZBGet scans the first-level subdirectory of ppscripts-directory and will find your main script file (the file containing script definition signature). All other files will be ignored.
You can also created subdirectories in your script-directory. These subdirectories will not be scanned.

Example:
```
ppscripts                                <directory with pp-scripts, option ScriptDir>
ppscripts\EMail.py                       <E-Mail script supplied with NZBGet>
ppscripts\MyCoolScript                   <directory for your cool script>
ppscripts\MyCoolScript\MyCoolScript.py   <your cool script>
ppscripts\MyCoolScript\Util.py           <module required for your script>
ppscripts\MyCoolScript\DB.py             <module required for your script>
```

**TIP**: if you have many files it's better to put them in a separate subdirectory. In this case the files will not be scanned by NZBGet and the web-interface might load a little bit faster. Example:
```
ppscripts                                <directory with pp-scripts, option ScriptDir>
ppscripts\MyCoolScript                   <directory for your cool script>
ppscripts\MyCoolScript\MyCoolScript.py   <your cool script>
ppscripts\MyCoolScript\lib               <directory with modules required for your cool script>
ppscripts\MyCoolScript\lib\Util.py       <module required for your script>
ppscripts\MyCoolScript\lib\DB.py         <module required for your script>
```

### Binary script
If your script is a compiled binary executable it obviously can't have a proper script definition and will not be detected by NZBGet as a script. To solve the problem put the executable into a subdirectory and create a starter script (bash, python, etc.) with a proper script definition. The starter script should then call the binary executable.

### Windows batch file
Batch files do not treat #-character as comment. But NZBGet requires post-processing script signature. We overcome this using command **goto** at the start of script to skip the script definition lines:
```bat
@echo off
goto start:
########################################
### NZBGET POST-PROCESSING SCRIPT    ###

# Brief description goes here.
#
# Lengthier description and instructions go here. Blah, blah blah
# and so on and so forth....

########################################
### OPTIONS																   ###

# An option goes here, do you want that? (yes, no).
#
# The explanation of the option goes here...
#DoYouWantThisOption=no

### NZBGET POST-PROCESSING SCRIPT     ###
#########################################

:start
echo Hello, world!
echo You chose "Do you want this option?": "%NZBPO_DOYOUWANTTHISOPTION%"
echo Here is a smattering of NZBget server variables:
echo NZBPP_DIRECTORY="%NZBPP_DIRECTORY%"
echo NZBPP_NZBNAME="%NZBPP_NZBNAME%"

rem Return an exit code understood by nzbget
rem # Exit codes used by NZBGet
rem POSTPROCESS_SUCCESS=93
rem POSTPROCESS_NONE=95
rem POSTPROCESS_ERROR=94

exit /b 93
```
