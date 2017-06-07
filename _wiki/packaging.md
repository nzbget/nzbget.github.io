---
---
## Info ##
This document provides information for creators of binary NZBGet packages.

## Branches and releases ##
New features and fixes are added to NZBGet on daily basis. The actual source code can be obtained via source control repository as explained in [Building development version](Building_development_version). This most actual version is called **development** version (short **devel** or **develop**) or **git version**. Development code may contain serious bugs and is therefore not recommended for average users.

Implementing of one feature may take several days or even weeks. A short test of functionality is then performed on several platforms. If the program seems to work fine a new **testing** release is made available for public. Testing releases are provided from [Download page](download) and a new announcement is published on forum. Testing releases are good for real use and are recommended for experienced users familiar with NZBGet. Testing releases may have serious bugs as well but this happen rare.

When all features planned for a new program version are implemented and several testing releases were published and no serious bugs were reported since the latest testing version a new program version is made available for public as **stable** release. Stable releases usually don't have serious bugs and are recommended for new users as well for users who don't have much time for frequent updates and are not ready to confront with possible bugs.

There are two main copies of source code in the code repository - **develop** and **master**. In the terms of source code tool "git" they are called branches. The current development is made in **develop**-branch. The testing releases are also produced from that branch. Stable releases are made from **master**-branch. That code branch always represents the latest stable code. Before creating a new stable release the changes made since the last stable are copied from **develop**-branch into **master**-branch. If a hotfix for the latest stable is required the fix is made in the **master**-branch and then a new stable release is created.

Having two branches - one for testing (develop) and another for stable (master) - ensures that code changes made in the development code of the new version do not flow into stable version before they thoroughly tested.

The recommended way of obtaining source code of stable and testing versions is [Download page](download) or [Release archive](https://github.com/nzbget/nzbget/releases).

**Summary:** there are three kinds of NZBGet releases:
- **Stable** - recommended for new users and for users not having much time for possible error handling;
- **Testing** - recommended for experienced users familiar with NZBGet;
- **Development** - actual source code of NZBGet. Not recommended for average users.

## What version to use for packaging ##
It's recommended to always provide **stable** version. Providing a separate package for **testing** version would be nice too. Making publicly available packages of **development** versions is not recommended and should be avoided.

## Automatic updates ##
Since NZBGet is written in C++ it is necessary to compile the program before it can be run. Compilation process is different on different platforms and is even more complex if a cross compiling is involved, which is an usual case when using the program on low power devices. For these reasons it's not possible to offer an update function, which would download the latest sources and compile them automatically.

What is possible however is that the program could install already compiled binary package automatically. For end users the update process is automated but it relies on work made by package maintainer.

The maintainer needs to compile new version of NZBGet and make it available via Internet. When user starts auto-update function the program uses a special configuration file (provided along with installed package) to retrieve information about availability of new binary packages. If new version was found user can install it. For installation NZBGet calls an update-script, which is again written and provided by package maintainer. The script then downloads and installs new version and restarts NZBGet.

## Package information file ##
For update check and installation of updates NZBGet requires:
- web-link to **update information file** containing information about binary packages available for download and installation;
- path to **update-script**, which is executed when user clicks on Install-button.
These information must be provided in the file **package-info.json** located in webui-directory. The file must be installed with NZBGet.

Package information file:
```javascript
NZBGet.PackageInfo = {
	"update-info-link": "http://www.web-server-of-package-maintainer.com/nzbget-update-info.json",
	"update-info-script": "/usr/local/bin/nzbget-update-check.sh",
	"install-script": "/usr/local/bin/nzbget-update-install.sh"
}
```

Fields:
 - **update-info-link** - Link to *update information file*. See later.
 - **update-info-script** - Path to locally installed script file, which provides content of *update information file*. See later.
 - **install-script** - Path to locally installed script file, which installs new versions.

Information about available versions is provided in form of **update information file**. There are two ways to pass it to NZBGet:
* The file can be put on web. In this case a link to the file must be put into field *update-info-link* of *package information file*;
* The file can be generated by a locally installed script. In this case field *update-info-script* points to that script.

Only one of fields *update-info-link* or *update-info-script* must be present in the *package information file*.

## Update information file ##
Example content of *update information file*:
```javascript
NZBGet.UpdateInfo = {
	"stable-version": "11.0",
	"stable-package-info": "http://www.web-server-of-package-maintainer.com/stable.html",
	"testing-version": "12.0-testing-r920",
	"testing-package-info": "http://www.web-server-of-package-maintainer.com/testing.html",
	"devel-version": "12.0-testing-r950",
	"devel-package-info": "http://www.web-server-of-package-maintainer.com/devel.html"
}
```

Fields:
 - **stable-version**, **testing-version**, **devel-version** - Version numbers of packages available for installation.
 - **stable-package-info**, **testing-package-info**, **devel-package-info** - Web-links to pages with information about packages, installations tips or any other useful info.

In the example all three milestone versions are provided but it's not required to provide all of them. For example, if only stable version is available the file would look like this:
```javascript
NZBGet.UpdateInfo = {
	"stable-version": "11.0",
	"stable-package-info": "http://www.web-server-of-package-maintainer.com/stable.html"
}
```

As you can see the *update information file* doesn't provide download links to packages. NZBGet doesn't download binary package nor install it. That's a responsibility of *update script*, which knows where to get new version.

## Update information script ##
One of a possible way to distribute NZBGet is to put it into a repository for binary packages and install it then from that repository. Example: *optware repository*.

In this case information about available binary packages and their versions can be obtained directly from package repository. This eliminates the need for hosting of *update information file*. Instead a special script file must be provided with NZBGet which then extracts version information from package repository and pass it to NZBGet.

*TODO: provide more info and examples for of update information script*

## Process flow ##
To bring all pieces together:
* User clicks on button *Check for updates*;
* NZBGet loads file *package-info.json* from webui-directory;
  * If the file doesn't exist a message *Automatic updates are not configured for your platform* is displayed;
* NZBGet reads field *update-info-link* from *package-info.json*;
* If field *update-info-link* exists NZBGet downloads *update information file* from the link;
* If field *update-info-link* doesn't exist, NZBGet reads field *update-info-script* and executes the script;
  * *update-info-script* checks availability of NZBGet versions and generates *update information file*;
* NZBGet loads content of *update information file* and checks version numbers against installed version;
* If newer version is available an Install-button appears;
* User clicks on Install-button;
* NZBGet executes script pointed by field *install-script* in *package-info.json*;
* Install-script downloads new version, terminates NZBGet, installs new version, starts NZBGet;
  * During installation web-interface shows messages printed by install-script until NZBGet is terminated;
  * After that web-interface waits for NZBGet to start again;
  * If NZBGet was started successfully, web-interface reloads the page presenting new version to user.

## Install script ##
The install script takes care of updating NZBGet to a newer version. The script must download and install the new version. The same script is called for installing stable, testing and development versions (if defined in *update information file*). The information about what of these version was chosen by user is passed in environment variable **NZBUP_BRANCH**. A process-id of NZBGet is passed in **NZBUP_PROCESSID**.

All NZBGet configuration options are also passed to script using env-vars with prefix **NZBOP_**. The variable names are written in UPPER CASE. For Example option **ParRepair** is passed as environment variable **NZBOP_PARREPAIR**. The dots in option names are replaced with underscores, for example **NZBOP_SERVER1_HOST**. For options with predefined possible values (yes/no, etc.) the values are passed always in lower case.


## Example install script:##
```shell
#!/bin/sh

echo "Installing ${NZBUP_BRANCH}"
echo "Downloading new version...";
# wget <path to newer nzbget version>
echo "Downloading new version...OK";

echo "[ERROR] Something did go wrong (example error message)"

echo "Extracting...";
sleep 2;
echo "Extracting...OK";

echo "Stopping NZBGet...";
# make a pause after printing the last message, which nzbget can receve from the script
sleep 1;

"${NZBOP_APPBIN}" -c "${NZBOP_CONFIGFILE}" -Q

# in this demo we just wait 5 seconds
# you should instead check if process with id "NZBUP_PROCESSID" still exist
sleep 5;

# after that point the message are not printed in nzbget web-interface anymore

echo "Starting NZBGet...";
"${NZBOP_APPBIN}" -c "${NZBOP_CONFIGFILE}" -D
```

## Real world examples ##
Automatic updates are implemented in:
- Linux version, available via universal Linux installer - [install-update.sh](https://github.com/nzbget/nzbget/blob/develop/linux/install-update.sh);
- Windows version - [install-update.bat](https://github.com/nzbget/nzbget/blob/develop/windows/install-update.bat).

## More info ##
Should you have any questions please feel free to ask them on [Forum](forum).
