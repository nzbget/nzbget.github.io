---
title: Installation on Android
---
## Installation
All steps to perform on your Android device:
- using web-browser download NZBGet installer app from [Releases Page](https://github.com/nzbget/android/releases);
- install downloaded **apk-file**. You may need to enable a setting allowing installation of apps outside of Play store;
- launch NZBGet app;
- click **Install Daemon**;
- click **Latest Stable**;
- the installer app downloads the Linux installer package and performs the installation;
- the success of installation is confirmed with message "NZBGet daemon has been successfully installed".

## Usage
- to start downloader process launch NZBGet app and choose **Start daemon**. You get a confirmation about successful start;
- in NZBGet app choose **Show web-interface**; that opens a web-browser. Alternatively open a web-browser manually and navigate to **http://localhost:6789**. Alternatively open a web-browser on your PC or any other device on the same network and navigate to **http://ip-of-android-device:6789**;
- at this point you can close NZBGet app, the daemon process remains running in background;
- use web-interface to control NZBGet daemon.

## Post-processing scripts
Most scripts are written in Python. Unfortunately there is no Python for Android. That means most scripts will not work. Bash scripts may work but you may need to install BusyBox from Play store. You also must configure option **ScriptDir** to system partition (scripts cannot be launched from sdcard). Getting post-processing scripts to cooperate is a work in progress. Please post your questions and solutions in forum topic [\[New Feature\] Android installer](http://forum.nzbget.net/viewtopic.php?f=10&t=2061).

## Installation on Android Emulator
The steps documented above will not work in Android Emulator. Installation there requires more manual work. Please see [Installation on Android emulator](Installation_on_Android_emulator) for details.