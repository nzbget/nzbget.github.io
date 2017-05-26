---
title: API-method "loadconfig"
---
## Syntax
```swift
struct[] loadconfig() 
```

Reads configuration file from the disk. 

## Return value
This method returns array of structures with following fields:
- **Name** (string) - Option name.
- **Value** (string) - Option value.

## Remarks
The option value is returned exactly as it is stored in the configuration file. For example it may contain variable references (e. g. "${MainDir}/dst").
