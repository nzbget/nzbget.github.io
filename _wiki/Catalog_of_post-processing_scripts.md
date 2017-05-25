---
---
This documents lists few interesting post-processing and other extension scripts written for NZBGet.
Even more scripts are available on sub-forum [[Extension scripts|http://nzbget.sourceforge.net/forum/viewforum.php?f=8]].

Most scripts are written in python and work on many platforms including Linux, Mac, Windows.

For information on writing post-processing scripts see [[Extension scripts]].

### Contents

* [Sorting/Cleanup](#sortingcleanup)
	* [VideoSort - better video sorting](#videosort---better-video-sorting)
	* [PoisonProcess - convert and organize videos](#poisonprocess---convert-and-organize-videos)
	* [FakeDetector - early detection of fake videos](#fakedetector---early-detection-of-fake-videos)
	* [PasswordDetector - stop download of protected .rar](#passworddetector---stop-download-of-protected-rar)
	* [Subliminal - download subtitles](#subliminal---download-subtitles)
	* [DeleteSamples - delete ".sample" files](#deletesamples---delete-sample-files)
	* [Flatten - remove subdirectories](#flatten---remove-subdirectories)
	* [SafeRename - rename.sh/.bat](#saferename---renameshbat)
	* [Reverse_name -  reverse the filenname](#reversename----reverse-the-filename)
	* [ResetDateTime - reset modified and accessed timestamps](#resetdatetime---reset-modified-and-accessed-timestamps)
	* [CharTranslator - fix filename encoding issues](#chartranslator---fix-filename-encoding-issues)
	* [Permissions - change file permission](#permissions---change-file-permission)
* [Notifications](#notifications)
	* [EMail - send E-Mail notification](#email---send-e-mail-notification)
	* [Pushbullet - notifications (Android, iOS, Chrome)](#pushbullet---notifications-android-ios-chrome)
	* [Pushover (iOS and Android)](#pushover-ios-and-android)
	* [NotifyMyAndroid](#notifymyandroid)
	* [Notify - notifications (All In One)](#notify---notifications-all-in-one)
	* [NotifyOSX - OSX via Notification Center](#notifyosx---osx-via-notification-center)
	* [Growl - Growl notification](#growl---growl-notification)
	* [Prowl - iOS push notification service](#prowl---ios-push-notification-service)
	* [AutoRemote - plugin for Tasker](#autoremote---plugin-for-tasker)
	* [FailureEmail](#failureemail)
	* [Logger - save post-processing log](#logger---save-post-processing-log)
	* [SendFiles - send downloaded files via email](#sendfiles---send-downloaded-files-via-email)
* [System](#system)
	* [Completion - propagation/DMCA/retention check](#completion---propagationdmcaretention-check)
* [Integration with other tools](#integration-with-other-tools)
	* [nzbToMedia - automation tools integration](#nzbtomedia---automation-tools-integration)
	* [NotifyXBMC - quick-update for XBMC](#notifyxbmc---quick-update-for-xbmc)
	* [NotifyPlex - library update and GUI notification](#notifyplex---library-update-and-gui-notification)
* [Other](#other)

# Sorting/Cleanup #
## VideoSort - better video sorting ##
This is a script for downloaded TV shows and movies. It uses scene-standard naming conventions to match TV shows and movies and rename/move/sort/organize them as you like.

* Installation and usage: [[VideoSort|https://github.com/nzbget/VideoSort]].
* [[Discussion thread|http://nzbget.sourceforge.net/forum/viewtopic.php?f=8&t=840]]

## PoisonProcess - convert and organize videos ##
An alternative to VideoSort written in bash (doesn't require python).

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=880]].

## FakeDetector - early detection of fake videos ##
This is a queue-script which is executed during download, after every downloaded file containing in nzb-file (typically a rar-file). The script lists content of download rar-files and tries to detect fake nzbs.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1394]].

## PasswordDetector - stop download of protected .rar ##
PasswordDetector is a queue script that checks for passwords inside of every .rar file of a NZB downloaded. This means that it can detect password protected NZB's very early before downloading is complete, allowing the NZB to be automatically deleted or paused. Detecting early saves data, time, resources, etc.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1391]].

## Subliminal - download subtitles ##
For downloaded video files **Subliminal** searches subtitles on various web-sites and downloads them into destination directory.

* Download and more info: [[Discussion thread|http://nzbget.sourceforge.net/forum/viewtopic.php?f=8&t=1422]].
* Older alternative script (by a different author): [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=764]].

## DeleteSamples - delete ".sample" files ##
Deletes ".sample" files. This script is part of script collection ''nzbToMedia'' but can be used separately from the rest of the collection. If you don't need the whole nzbToMedia package you can download only this script.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1634]].

## Flatten - remove subdirectories ##
This will remove subdirectories and put all downloaded files into the root download directory.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1634]].

## SafeRename - rename.sh/.bat ##
Parse the download for any "rename.sh" or "rename.bat" scripts and then determine the correct file renaming to be applied (without running of downloaded batch files).

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1634]].

## Reverse_name -  reverse the filename ##
Some release groups simply reverse the Filename of an Episode. The script reverses it back.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1197]].

## ResetDateTime - reset modified and accessed timestamps ##
What this script does is reset the date modified and accessed for all files in the completed download. This is needed if you want your media management tools to correctly identify "recently added" files. This script is part of script collection ''nzbToMedia'' but can be used separately from the rest of the collection. If you don't need the whole nzbToMedia package you can download only this script.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1634]].

## CharTranslator - fix filename encoding issues ##
The script will fix the encoding issues after unpack and add the media files to the Syno DLNA Index.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1474]].

## Permissions - change file permission ##
The script changes the folder rights after unpack.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=835#p8377]].

# Notifications #
## EMail - send E-Mail notification ##
Sends E-Mail notification when the job is done. The message includes:
* job-status (success, failure);
* the list of resulted files (optionally);
* content of _brokenlog.txt (if exists - for failed jobs);
* full post-processing log of the job (optionally: always, never, on-failure).

The script is included with NZBGet.

## Pushbullet - notifications (Android, iOS, Chrome) ##
Pushbullet is a notification service for Android, iOS, Chrome, Firefox and Windows.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1205]].

## Pushover (iOS and Android) ##
This script sends a Pushover (http://pushover.net) notification to iOS and Android devices when a job is finished.

* Download and more info: [[Discussion thread|http://nzbget.sourceforge.net/forum/viewtopic.php?f=3&t=782]].

## NotifyMyAndroid ##
This script sends a notification to your NotifyMyAndroid account.

* Download and more info: [[Discussion thread|http://nzbget.sourceforge.net/forum/viewtopic.php?f=3&t=775]].

## Notify - notifications (All In One) ##
An ultimate notification script supporting many services (PushBullet, Growl, Pushover, etc.).

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1639]].

## NotifyOSX - OSX via Notification Center ##
This PP and Queue script will notify OSX via Notification Center when a download has completed, failed or added to NZBGet.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1433]].

## Growl - Growl notification ##
Sends notifications to Growl app (Mac and Windows).

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=942]].

## Prowl - iOS push notification service ##
Sends notifications to iOS devices.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1219]].

## AutoRemote - plugin for Tasker ##
AutoRemote is a plugin for the popular android app Tasker. It allows you to send messages between android devices, computers, chrome instances and more.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1416]].

## FailureEmail ##
Based on default email-script this script sends E-Mail notification only when a job has failed. It provides various options to customize conditions when an email should be send.

* Download and more info: [[Discussion thread|http://nzbget.sourceforge.net/forum/viewtopic.php?f=3&t=774]].

## Logger - save post-processing log##
Saves the full post-processing log of the job into file _postprocesslog.txt.

The script is included with NZBGet.

## SendFiles - send downloaded files via email ##
The script checks if download has files with certain extensions and sends them via email (one email per file).
This can be used for example to add downloaded books to Kindle Cloud as explained [[here|http://nzbget.sourceforge.net/forum/viewtopic.php?f=8&t=804]].

* Download and info: [[Discussion thread|http://nzbget.sourceforge.net/forum/viewtopic.php?f=8&t=806]].

# System #
## Completion - propagation/DMCA/retention check ##
A script that checks if the files are actually available BEFORE downloading, typically useful for when huge propagation issues arise, or you try to get older posts that might be incomplete.
- [[Discussion thread on NZBGet forum|http://forum.nzbget.net/viewtopic.php?f=8&t=1736]].

# Integration with other tools #
## nzbToMedia - automation tools integration ##
A script collection primary aimed to users running automation nzb search tools including: [[CouchPotato|http://couchpota.to]], [[SickBeard|http://www.sickbeard.com]], [[HeadPhones|http://github.com/rembo10/headphones]], [[Mylar|https://github.com/evilhero/mylar]], [[Gamez|https://github.com/mdlesk/Gamez]], etc.

- [[Home page|https://github.com/clinton-hall/nzbToMedia]] (download, installation instructions, source code);
- [[Discussion thread on NZBGet forum|http://nzbget.sourceforge.net/forum/viewtopic.php?f=3&t=745]];
- [[Discussion thread on CouchPotato forum|https://couchpota.to/forum/viewtopic.php?f=17&t=343]].

## NotifyXBMC - quick-update for XBMC ##
The script sends a quick-update command to XBMC so it will index a folder that NZBGet just downloaded. It's also capable of displaying a message on XBMC.

* Download and more info: [[Discussion thread|http://nzbget.sourceforge.net/forum/viewtopic.php?f=3&t=777]].

## NotifyPlex - library update and GUI notification ##
The PP-Script will call a targeted Plex refresh/update upon successful download and send a GUI Notification to Plex Home Theater.

* Download and more info: [[Discussion thread|http://nzbget.net/forum/viewtopic.php?f=8&t=1393]].

# Other #
Even more scripts are available on sub-forum [[Extension scripts|http://nzbget.sourceforge.net/forum/viewforum.php?f=8]].