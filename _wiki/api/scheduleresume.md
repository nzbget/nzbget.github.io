---
title: API-method "scheduleresume"
---
## Syntax
```swift
bool scheduleresume(int Seconds)
```

Schedule resuming of all activities after expiring of wait interval.

## Parameters
- **Seconds** (int) - Amount of seconds to wait before resuming. 

## Return value
Always "True".

## Remarks
Method *scheduleresume* activates a wait timer. When the timer fires then all pausable activities resume: download, post-processing and scan of incoming directory. This method doesn't pause anything, activities must be paused before calling this method.

Calling any of methods *pausedownload*, *resumedownload*, *pausepost*, *resumepost*, *pausescan*, *resumescan* deactivates the wait timer.