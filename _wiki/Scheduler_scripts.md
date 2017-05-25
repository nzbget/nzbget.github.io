---
---
## About scheduler scripts
Scheduler scripts are called by scheduler tasks (setup by the user).

To activate a scheduler script or multiple scripts put them into **ScriptDir**, then choose them in the option **TaskX.Script**.

## Writing scheduler scripts
Scheduler scripts are a kind of *Extension scripts*.

**Please read [Extension scripts](Extension_scripts) for general information about extension scripts first!**

This document describes the unique features of scheduler scripts.

## Configuration options
Like other extension scripts the scheduler scripts get [NZBGet configuration options](Extension_scripts#nzbget-configuration-options) (env. vars with prefix **NZBOP_**) and [Script configuration options](Extension_scripts#script-configuration-options) (env. vars with prefix **NZBPO_**) passed. In addition the information about currently processed task is passed as well.

## Schedule
Users can activate scheduler scripts in two ways:

1. By creating a scheduler task with **TaskX.Command=Script** and choosing the script. The schedule time is configured via scheduler task in option **TaskX.Time**.

2. For many scheduler scripts a reasonable default schedule can be provided by script author, via script definition. Scheduler scripts with default schedule can be activated by user via simple selection of the script in option **Extensions**; no creation of a scheduler task is required. If user doesn't like the default scheduling he can create a scheduler task (instead of or in addition to activating the script via option "Extensions").

### Default schedule definition
Example (explained below):

```python
#########################################################
### TASK TIME: *;*:00;*:30                            ###
#########################################################
### NZBGET QUEUE/SCHEDULER/POST-PROCESSING SCRIPT     ###
#########################################################
### QUEUE EVENTS: NZB_ADDED                           ###

# Test script.
#
# This is a long description for test script.

#########################################################
### OPTIONS                                           ###

# Example script option (yes, no).
#Option1=yes

### NZBGET QUEUE/SCHEDULER/POST-PROCESSING SCRIPT     ###
#########################################################
```

Here we have a multi-purpose extension script (queue, scheduler and post-processing). Script definition is enclosed between opening and closing script definition signature `NZBGET QUEUE/SCHEDULER/POST-PROCESSING SCRIPT`.

Like other queue scripts this script has event definition `### QUEUE EVENTS: NZB_ADDED`.

The script provides default scheduler task using signature `### TASK TIME: *;*:00;*:30`. In that example the script will be started at program boot (`*`) and then every 30 minutes. See description of option **TaskX.Time** for details.

You may wonder why the task definition were put before opening script definition signature (`NZBGET QUEUE/SCHEDULER/POST-PROCESSING SCRIPT`). Indeed the task definition looks nicer when put near queue event definition:
```python
#########################################################
### NZBGET QUEUE/SCHEDULER/POST-PROCESSING SCRIPT     ###
### QUEUE EVENTS: NZB_ADDED                           ###
### TASK TIME: *;0:00;0:30                            ###
```
There is however one issue with this nice style: older nzbget versions do not recognize task definition and treat it as option section which leads to crazy things happening on configuration page in web-interface. Therefore if your script must work with nzbget prior v18 you should put the task definition as shown in the first example.

**Note:** decorations `#########################################################` in both examples are used strictly for formatting and are not necessary.

## Task information
*TODO*
