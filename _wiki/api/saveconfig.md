---
title: API-method "saveconfig"
---
## Syntax
```C#
bool saveconfig(struct[] Options) 
```

Saves configuration file to the disk. 

## Parameters
- **Options** - array of structs:
  - **Name** (string) - Option name.
  - **Value** (string) - Option value.

## Return value
"True" on success or "False" on failure.