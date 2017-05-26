---
title: API-method "rate"
---
## Syntax
```swift
bool rate(int Limit)
```

Set download speed limit.

## Parameters
- **Limit** (int) - new download speed limit in KBytes/second. Value "0" disables speed throttling. 

## Return value
Usually "True" but may return "False" if parameter **Limit** was out of range.
