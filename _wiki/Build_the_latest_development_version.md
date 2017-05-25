---
redirect_from: /Build_the_latest_development_version_from_svn
---
**NOTE**: before trying this you should be able to compile the program from sources using the distribution source package. If you can't - fix this first.

The latest development sources are stored in the git repository on GitHub. Get the latest version from git repository to your computer:
```shell
git clone https://github.com/nzbget/nzbget.git nzbget-git
```

This command creates directory **nzbget-git** in current directory. You can use any other name instead of "nzbget-git".

Change to new directory:
```shell
cd nzbget-git
```

You have to do command "git clone" only once. To fetch the newest sources later you can update your local files with:
```shell
git pull
```

After cloning of the repository by default the branch **develop** is selected. If you need to build another branch, you have to select it first with command "checkout", for example to select branch "18-feed-script":
```shell
git checkout 18-feed-script
```

Now you can configure and make as usual:
```shell
./configure
make
```

**Important**:
Because of new features in newer versions of nzbget the file format for download queue may change. Newer nzbget versions can read older formats and update queue to new format. However older versions can not read newer formats. If you want to be able to downgrade to older versions and preserve queue, you should make a backup of queue-directory. 
Otherwise you'll get a message "could not load queue due version message" in older nzbget versions.