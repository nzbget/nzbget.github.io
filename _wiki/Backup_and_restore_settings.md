---
---
## Configuration file ##
NZBGet stores all settings in a configuration file. The file is usually named **nzbget.conf** but any other file can be used if passed to NZBGet on start.

After installing NZBGet on a newer machine you may want to reuse the old config file in order to skip the full reconfiguration. For that purpose NZBGet web-interface provides two functions:
- Backup Settings;
- Restore Settings.

## Backup settings
Use command **Backup Settings** (*web-interface -> Settings -> SYSTEM -> Backup Settings*) to create a backup of your current configuration. This file can be used later to restore settings on this or another machine. For restore purposes you can also use the configuration file (nzbget.conf) instead of backup file. This is helpful if the old setup doesn't work anymore and you can't access web-interface to create a backup of settings.

## Restore settings
Command **Restore Settings** (*web-interface -> Settings -> SYSTEM -> Restore Settings*) restores either all settings or the settings from selected configuration sections. For example during restore process you can choose to restore only settings in the section "CATEGORIES" but not touch other settings.

## Restore settings on another machine
When performing restore on another machine it's usually wise to not restore settings which contain local paths, including:
- all options in section "PATHS";
- option "DestDir" in section "CATEGORIES" (per category destination path);
- options "UnrarCmd" and "SevenZipCmd" in section "UNPACK".

#### Recommended procedure:
- write down current values of options "UnrarCmd" and "SevenZipCmd" in section "UNPACK";
- click "Restore Settings", check all sections except "PATHS" and do restore;
- revert options "UnrarCmd" and "SevenZipCmd" in section "UNPACK";
- review destination paths in section "CATEGORIES";
- save configuration.
