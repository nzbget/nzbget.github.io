---
---
## About feed scripts ##
Feed scripts are called after an RSS feed is read and before it is processed by NZBGet.

To activate a feed script or multiple scripts put them into **ScriptDir**, then choose them in global option **Extensions** (**FeedScript** in older NZBGet versions) or per feed option **FeedX.Extensions**.

## Writing feed scripts ##
Feed scripts are a kind of *Extension scripts*.

**Please read [Extension scripts](extension-scripts) for general information about extension scripts first!**

This document describes the unique features of feed scripts.

## Configuration options ##
Like other extension scripts the feed scripts get [NZBGet configuration options](extension-scripts#nzbget-configuration-options) (env. vars with prefix **NZBOP_**) and [Script configuration options](extension-scripts#script-configuration-options) (env. vars with prefix **NZBPO_**) passed. In addition the information about currently processed RSS feed is passed as well:

## Feed information ##
*TODO*