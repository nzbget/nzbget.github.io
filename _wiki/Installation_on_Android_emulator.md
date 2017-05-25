---
---
## Preparing VM
- First install Android into VirtualBox as explained in [How to Install Android in VirtualBox](http://www.howtogeek.com/164570/how-to-install-android-in-virtualbox/);
- Change network settings for VM in VirtualBox to use **Bridged adapter**;
- In Android VM start Terminal app and type

 ```
 netcfg
 ```
 the IP shown on **eth0** is the IP address of the VM.

## Accessing VM from host
You need the tool called **adb** (android debugger). It is included in Android Studio, a development tool available for free from [developer.android.com](https://developer.android.com/sdk/index.html).
Actually you only need the adb-executble but it's not available for download separately. You can download it from other questionable sources though.

Connect adb to VM:
```shell
adb connect <IP-OF-VM>
```

Now you can use all adb command, for example open shell:
```shell
adb shell
```

## Installing NZBGet
- transfer NZBGet Linux installer package into VM:

 ```shell
adb push -p /path/to/local/nzbget-16.0-bin-linux.run /sdcard/Download
```
- connect to VM shell:

 ```shell
adb shell
```
- become root:

 ```shell
su
```
- change into directory where you want to install NZBGet. That must be a directory which allows running executables, you can't use "sdcard" for that. A good place for that is **/data/data/nzbget**:

 ```shell
cd /data/data
```
- install NZBGet:

 ```shell
sh /sdcard/Download/nzbget-16.0-bin-linux.run --nocheck
```
 Parameter "--nocheck" instructs the installer to skip verification step. The android shell is very limited and the check always fails.

## Using NZBGet
- test if NZBGet can be started:

 ```shell
/data/data/nzbget/nzbget -v

nzbget version: 16.0
```
- start NZBGet in server console mode:

 ```shell
TERM=linux /data/data/nzbget/nzbget -s
```
 Press `q` to exit.

- start NZBGet in daemon mode:

 ```shell
/data/data/nzbget/nzbget -D
```
- on your host start web-browser and connect to NZBGet running in VM using the known IP-address, for example: `http://192.168.1.214:6789`;
- go to settings and configure news-servers, save settings and reload NZBGet;
- add an nzb-file and try download something;
- if you get messages "Could not resolve host \<address of your news server>" go to settings and replace the dns name with IP-address of the news-server;

At this point you should be able to download and unpack files.