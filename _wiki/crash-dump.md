---
title: Crash dump
---
# About crash dumps
NZBGet contains bugs. Some of them causes program crashes. The bugs have to be
found and eliminated. NZBGet supports two instruments to help with this:

- **Call stack traces** - when option **CrashTrace** is active the program
intercepts the crash and saves the call stack trace into log-file. The call stack
lets developer find the exact place of the source code where the crash happened.
Sometimes this is enough to find the bug.

- **Memory dumps** - when a crash happens the system can save program memory 
state into a file. The memory dump can then be loaded into debugger and analyzed.
It includes the information about call stack (similar to the call stack trace above)
but also includes values of all program variables, which is a big help.

# Creating crash dumps

NZBGet supports creating of crash dumps on Windows and Linux.

## Windows

### Step 1. Configure Windows to create crash dumps
Windows contains an instrument called **Windows Error Reporting**, which can
create memory dumps when programs crash. This feature is not enabled by default.

MSDN-article [Collecting User-Mode Dumps](https://msdn.microsoft.com/de-de/library/windows/desktop/bb787181(v=vs.85).aspx)
explains in detail how to enable and configure the feature.

In short, your need:
- Open Registry editor `regedit.exe`;
- Create key (folder) **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps**;
- Create value **DumpType** of type **REG_DWORD** with value **2** (full dump).

Memory dumps will be saved into **%LOCALAPPDATA%\CrashDumps** by default but you
can configure other folder if necessary, as explained in MSDN-article linked above.

### Step 2. Install debug version of NZBGet
- Download debug version of NZBGet: [latest stable](https://github.com/nzbget/nzbget/releases/download/v{{site.data.version.stable-version}}/nzbget-{{site.data.version.stable-version}}-bin-win32-debug-setup.exe) or
[latest testing](https://github.com/nzbget/nzbget/releases/download/v{{site.data.version.testing-version}}-{{site.data.version.testing-revision}}/nzbget-{{site.data.version.testing-version}}-testing-{{site.data.version.testing-revision}}-bin-win32-debug-setup.exe).
- Install it over your existing NZBGet installation. Your configuration will be preserved.
- Start NZBGet, open settings page in web-interface and set option **CrashTrace=no** 
in section *LOGGING*.
- Save settings and shutdown NZBGet.

### Step 3. Test if crash dumps are created
- In Windows Explorer open directory where NZBGet is installed, by default
`C:\Program Files (x86)\NZBGet`;
- Double click on `nzbget-shell.bat` (the extension `.bat` may be hidden depending
on Windows Explorer settings). A command prompt should be opened.
- Type command
```
nzbget.exe -B trace 1
```

This command causes NZBGet to crash. At this moment Windows should display a message
about crashed program and write crash dump. Check directory **%LOCALAPPDATA%\CrashDumps**.
Open Windows Explorer and put that string into address bar, followed by `Enter`-key,
which should navigate you to the folder.

### Step 4. Activate all logging
Now you can start NZBGet and wait for it to crash. To help with debugging it's also
recommended to activate all logging options: **DebugTarget=log**, **DetailTarget=log** (or **both**) etc.

### Step 5. Upload crash dump
When you have the crash dump put it and the log-file into an archive (rar, zip, 7z, etc.) and upload it into Google Drive, MS OneDrive, Dropbox or whatever site you prefer and share
it with NZBGet developer.

## Linux

### Step 1. Install debug version of NZBGet
- Download debug version of NZBGet: [latest stable](https://github.com/nzbget/nzbget/releases/download/v{{site.data.version.stable-version}}/nzbget-{{site.data.version.stable-version}}-bin-linux-debug.run) or
[latest testing](https://github.com/nzbget/nzbget/releases/download/v{{site.data.version.testing-version}}-{{site.data.version.testing-revision}}/nzbget-{{site.data.version.testing-version}}-testing-{{site.data.version.testing-revision}}-bin-linux-debug.run).
- Install it over your existing NZBGet installation. Your configuration will be preserved.
- Start NZBGet, open settings page in web-interface and set option **CrashTrace=no**
and **CrashDump=yes** in section *LOGGING*.
- Save settings and shutdown NZBGet.

### Step 2. Test if crash dumps are created
Open terminal and type command
```
/path/to/nzbget -B trace 1
```

This command causes NZBGet to crash. The system should display message:
```
Segmentation fault (core dumped)
```

From the message **"core dumped"** you know the core-file was written.

Now you have to find out where the system has put the file. It can be 
in current directory or in a special directory for core files.
Try googling for "where linux saves core files" (replace "linux" with your
Linux version).

### Step 3. Activate all logging
Now you can start NZBGet and wait for it to crash. To help with debugging it's also
recommended to activate all logging options: **DebugTarget=log**, **DetailTarget=log** (or **both**) etc.

### Step 4. Upload crash dump
When you have the crash dump put it and the log-file into an archive (rar, zip, 7z, etc.) and upload it into Google Drive, MS OneDrive, Dropbox or whatever site you prefer and share
it with NZBGet developer.
