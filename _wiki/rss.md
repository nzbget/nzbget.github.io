---
title: RSS and duplicate check
---
### Contents
- [Filter](#filter)
  - [Simple filters](#simple-filters)
  - [Terms](#terms)
  - [Grouping and OR-operator](#grouping-and-or-operator)
  - [Example search strings](#example-search-strings)
  - [Multiline filters](#multiline-filters)
  - [Rules](#rules)
- [Duplicate check](#duplicates)
  - [Duplicate keys](#duplicate-keys)
  - [Duplicate scores](#duplicate-scores)
  - [Duplicate modes](#duplicate-modes)
  - [Example duplicate filters](#example-duplicate-filters)
  - [History and duplicate check](#history-and-duplicate-check)

# Filter
RSS feeds in NZBGet have option *Filter* describing filter rules. If the filter is empty every rss item is downloaded. Otherwise the filter is applied.

## Simple filters
In its simplest version filter is a list of words which must be present in the feed item title, for example:
``` 
game
```
or
```
game of thrones
```

If multiple words are provided they all must be present. A search is performed on word basis - the title is separated into words first and then the words from filter are checked if they present in feed item title. This means that search for **gam** will not match word **game** in the title. But you can use wildcard symbols `?` and `*`. `?` matches any (one) character, `*` matches a sequence of characters. For example:
```
gam*
```

will match words "gam", "game", "games", etc. The search string:
```
gam?
```
will match "game" and "gamm" but not "gam" nor "games".

If you put stars on both sides of word:
```
*am*
```
this matches all titles containing "am" such as "Game", "Camel", etc.

Put multiple search words into filter to find titles having ALL of these words:
```
game of thrones
```
will match only if a title has all three words. You can of course use wildcard characters:
```
game of thrones S03E??
```
this matches only season 3 of "game of thrones".

**Title** is not the only field of feed item. The item has also other fields such as **category**, **age**, **size**, etc. To search in additional fields put the field name with colon-character before search word:
```
category:*hd*
```
matches feed items having sub-string "hd" in category name. All searchable fields are listed later in this document.

One search word with its associated field is referred as **search term** in this document.

Example of search terms:

Term|Description
----|-----------
`game`|Title must contain word "game".
`title:game`|The same as above: title must contain word "game".
`category:*hd*`|Category contains substring "hd".
`age:>2h`|Post age at least 2 hours.
`size:<5GB`|Post size less than 5GB.

Combining multiple terms into a search string we can construct more complex criteria:

Filter|Description
----|-----------
`game of thrones`|Title must contain words "game", "of" and "thrones".
`game of thrones category:*hd*`|Title must contain words "game", "of" and "thrones" and the category must contain substring "hd".
`game of thrones category:*hd* age:>2h`|As above and age at least 2 hours.
`game of thrones category:*hd* age:>2h size:>1GB size:<5GB`|As above and post size between 1GB and 5GB.

## Terms
Formal definition of search terms:
```
[+|-][field:][command]param
```

Part|Description
----|-----------
+|Declares a positive term. Terms are positive by default, the "+" can be omitted.
-|Declares a negative term. If the term succeed the feed item is ignored.
field|Field to which apply the rule. If not specified the default field "title" is used.
command|A special character (or two) defining how to interpret the parameter (followed after the command). The commands are described in details later.
param|Parameter for command.

### Commands

Command|Description
----|-----------
`@`|Search for word "param" This is default command, the "@" can be omitted.
`$`|"param" defines a regular expression (using POSIX Extended Regular Expressions syntax).
`=`|equal.
`<`|less than.
`<=`|equal or less than.
`>`|greater than.
`>=`|equal or greater than.

- Commands `@` and `$` are for use with text fields (title, filename, category, link, genre, dupekey).
- Commands `=`, `<`, `<=`, `>` and `>=` are for use with numeric fields (size, age, rating, imdbid, rageid, tvdbid, tvmazeid, season, episode, priority, dupescore).

#### More about text search (command @)
- Text search supports wildcard characters `*` (matches any number of any characters), `?` (matches any one character) and `#` (matches one digit);
- Text search is by default performed against words (word-search mode): the field content is separated into words and then each word is checked against pattern.
- If the search pattern starts and ends with `*` (star) the search is performed against the whole field content (substring-search mode).
- If the search pattern contains word separator characters (except `*` and `?`) the search is performed on the whole field (the word-search would be obviously never successful in this case). 
- Following characters assumed to be word separators: !\"#$%&'()*+,-./:;<=>?@[\\]^_\`{\|}~.

### Param
- For field **size** the parameter can have suffixes "K", "KB" (kilobytes), "M", "MB" (megabytes), "G", "GB" (gigabytes). If not specified the bytes are assumed.
- For field **age** the parameter can have suffixes "m" (minutes), "h" (hours), "d" (days). If not specified the days are assumed.
- Field "rating" can be used with integer or floating point parameter. Integer parameter is interpreted as value of rating between 0 and 100. A floating point value is used as rating between 0.0 and 10.0.

**NOTE**: Only fields **title**, **filename** and **age** are always present. The availability of other fields depend on rss feed provider. Fields not present in the feed should not be searched.

## Grouping and OR-operator ##
Multiple terms separated with spaces all must match for the whole search string to match. Sometimes you may need to match **any** of the terms instead of **all**. For this purposes there is an *OR*-operator. In the next example titles having either 720p or 1080p (or both) are matching:
```
720p | 1080p
```
If you need to mix OR-operator with AND-condition (default) you can (and should) use braces for grouping:
```
dexter ( 720p | 1080p )
```
In this example titles having word "dexter" and either 720p or 1080p (or both) are matching.

**IMPORTANT:** braces and `|`-character must be surrounded with spaces.

**Good:**
```
( dexter | ( breaking bad ) ) ( 720p | 1080p )
```

**Bad** (will not work):
```
(dexter|breaking bad) (720p|1080p)
(dexter|(breaking bad))(720p|1080p)
(dexter | (breaking bad)) (720p | 1080p)
(dexter | ( breaking bad )) (720p | 1080p)
```

## Example search strings
- **Title:** Game.of.Thrones.S02E06.REAL.1080p.HDTV.X264-QCF.WEB-DL
- **Size:** 1.6GB
- **Age:** 15h
- **Category:** TV > HD

Examples of search strings:


Filter|Result|Remark
------|------|------
`game`|MATCH|
`games`|FAIL|
`gam`|FAIL|
`gam*`|MATCH|
`am*`|FAIL|
`*am*`|MATCH|
`game of thrones`|MATCH|
`game of throne`|FAIL|
`game of throne*`|MATCH|
`game.of?thrones`|MATCH|substring-search because of point-character, which is a word-separator
`game*of*thrones`|FAIL|word-search
`game*of*thrones*`|FAIL|word-search
`*game*of*thrones*`|MATCH|substring-search because of stars at the beginning and the end
`game of throne*`|MATCH|
`game of thrones WEB-DL`|MATCH|
`game of thrones -WEB-DL`|FAIL|
`+title:@game`|MATCH|
`-game`|FAIL|
`-kings`|MATCH|
`title:game.of.thrones size:<4GB`|MATCH|
`title:game.of?thrones`|MATCH|
`@game`|MATCH|
`size:<1.4GB`|FAIL|
`HDTV category:*hd* -evolve s02e* size:>600MB size:<2000MB`|MATCH|
`size:<2000MB`|MATCH|
`age:<10`|MATCH|less than 10 days
`$game.*\.s02e[0-9]*\..*`|MATCH|regular expression

## Multiline filters
If you have an RSS feed delivering much more items than you need you may require complex filters. RSS filter in NZBGet can have multiple lines. Each line is a rule and is processed separately. There are five kinds of rules:
- Accept;
- Reject;
- Require;
- Options;
- Comment.

For each item (nzb-file) in the RSS feed NZBGet goes through filter rules line by line. Comment-rules start with character '#' and do not have any effect. Other rules have *filter string* and may have additional parameters. Filter strings were described before in this document. First NZBGet checks filter string against item. If the filter string matches we will say the rule has matched. In this case an action depending on the rule kind is applied to feed item.

Example of multi line filter:
```
Reject: age:>10
Require: 720p
# this is comment
Accept: game of thrones S03E##
Accept: dexter S08E##
```

Each feed item (nzb-file) is checked against these rules starting from the first rule in the list.
- The first rule `Reject: age:>10` says that items older than 10 days must be rejected. Reject rules are final: if the item matches search string (`age:>10`) the item is rejected (not added to queue) and no other rules are checked for that item. If the rule doesn't match the item is considered good and other rules are checked then.
- The second rule `Require: 720p` checks if item title has word "720p". If the rule matches the item is considered good and other rules are checked then. If the rule doesn't match the item is rejected (this is final) and no other rules checked for the item. Require-rules can be usually rewritten as Reject-rules by negating the search term:
`Reject: -720p`. If the search string consist of more than one term the negating can be difficult. Besides the require-rules often look more natural and are easier to read.
- The third rule `# this is comment` is just skipped. You can use comments to describe complex parts of filters or to temporary comment out a rule for debugging.
- The fourth rule `Accept: game of thrones S03E##` causes items having words "game of thrones" and a word matching to pattern "S03E##" to be accepted. Accepted items are added to queue. No other rules are checked for such items. If search string doesn't match the rule is skipped and further rules are checked for the item.
- The fifth rule `Accept: dexter S08E##` is similar to fourth but checks for other title.

If an item has passed to the end of the RSS filter and it was not accepted nor rejected by any rule the item is ignored - it's not added to queue. It has almost the same effect as if the last rule of the filter would a reject-rule:

```
Reject: *
```

The only difference between ignored and rejected items is the status of the item shown in the build-filter-dialog in web-interface: it's either REJECTED or IGNORED. Distinguishing them helps to understand how rules were applied to feed items.

There are many ways to achieve the same effect. The four rules from our example (not counting comment-rule) can be rewritten using two rules:
```
Accept: game of thrones S03E## age:<10 720p
Accept: dexter S08E## age:<10 720p
```
However if you need to accept many shows writing `age:<10 720p` for each show isn't very practical.

**Options-Rule**
One rule not shown in our example is *options-rule*. It sets options on feed items if the search string matches. In the following example if the title contains words "hdtv", "720p" or "1080p" the option "category" is set to "HD" for that item.
```
Options(category:HD): hdtv
Options(category:HD): 720p
Options(category:HD): 1080p
```

Options-rules are not final. If they don't match they are skipped and no options on feed item are changed. Later when the item is added to queue the options associated with the item will have some effect of how the item is processed. In our example the nzb-file will be added to category "HD". A default category for feed items can be set via option *FeedX.Category*. The options-rule overrides this setting. "Category" is one of options, there are also others described later.

Accept-rules can also set options for accepted items:
```
Accept(category:HD): game of thrones S03E## age:<10 720p
```

## Rules
Formal definition of rules:
```
[A:|A(options):|R:|Q:|O(options):|#] <search string>
```

Rule|Description
----|-----------
Accept (A)|declares Accept-rule. Rules are accept-rules by default, the "A:" can be omitted. If the feed item matches to the rule the item is considered good and no further rules are checked.
Reject (R)|declares Reject-rule. If the feed item matches to the rule the item is considered bad and no further rules are checked.
Require (Q)|declares Require-rule. If the feed item DOES NOT match to the rule the item is considered bad and no further rules are checked.
Options (O)|declares Options-rule. If the feed item matches to the rule the options declared in the rule are set for the item. The item is neither accepted nor rejected via this rule but can be accepted later by one of Accept-rules. In this case the item will have its options already set (unless the Accept-rule overrides them).
#|lines starting with `#` are considered comments and are ignored. You can use comments to explain complex rules or to temporary disable rules for debugging.

### Options
*Options* allow to set properties on nzb-file. It's a comma-separated list of property names with their values.

Definition of an option:
```
name:value
```

Options can be defined using long option names or short names:

Option|Description
------|-----------
category (cat, c)|set category name, value is a string.
pause (p)|add nzb in paused or unpaused state, possible values are: yes (y), no (n).
priority (pr, r)|set priority, value is a signed integer number.
priority+ (pr+, r+)|increase priority, value is a signed integer number.
dupescore (ds, s)|set duplicate score, value is a signed integer number.
dupescore+ (ds+, s+)|increase duplicate score, value is a signed integer number.
dupekey (dk, k)|set duplicate key, value is a string.
dupekey+ (dk+, k+)|add to duplicate key, value is a string.
dupemode (dm, m)|set duplicate check mode, possible values are: score (s), all (a), force (f).

Rule-options override values set in feed-options.

Examples:
```
A(category:big movies, priority:50, pause:yes): size:>8GB
Options(dupescore:200): 720p web-dl
# the same as above using short rule-name (O) and short option name (s):
O(s:200): 720p web-dl
```

# Duplicates
Same titles are usually posted to Usenet by more than one posters. You can use RSS filter to reject some kinds of duplicates such as the ones not having HD keywords:
```
Require: ( hdtv | 720p | 1080p | bluray )
Reject: category:sd
```

Still at the end you will have multiple versions of the same title:
```
Dexter.S08E10.1080p.WEB-DL.DD5.1.H.264-BS.NLsub		TV > Foreign	9 d	2.19 GB
Dexter.S08E10.1080p.WEB-DL.DD5.1.H.264-BS.NLsub		TV > Foreign	9 d	2.19 GB
Dexter.S08E10.1080p.HDTV.x264.QCF			TV > HD		10 d	3.45 GB
Dexter.S08E10.1080p.HDTV.x264-QCF			TV > HD		10 d	3.31 GB
Dexter.S08E10.720p.HDTV.x264.VOST.Kharn			TV > HD		11 d	9.40 GB
Dexter.S08E10.720p.HDTV.x264-EVOLVE.NLsub		TV > Foreign	14 d	1.24 GB
Dexter.S08E10.720p.HDTV.x264.EVOLVE			TV > HD		14 d	1.24 GB
Dexter.S08E10.720p.HDTV.DD5.x264-NTb			TV > HD		15 d	3.13 GB
Dexter.S08E10.720p.HDTV.x264.EVOLVE			TV > HD		16 d	1.39 GB
Dexter.S08E10.720p.HDTV.x264-EVOLVE			TV > HD		16 d	1.34 GB
```

You certainly don't want to download all 10 versions of the title. This is where NZBGets *Smart Duplicates* come into play.

Smart duplicates have two purposes:
- avoid download of duplicates;
- if download fails - automatically choose another release (duplicate).

The feature consists of two parts:
- duplicate detection;
- duplicate handling.

Duplicate detection:
- by adding items from newznab RSS feeds the fields **imdbid** or **rageid/season/episode** (alternatively **tvdbid** and **tvmazeid**) are used if available to automatically detect duplicates;
- by adding items from RSS feeds not having these fields special filter commands can be used to help the program identify duplicates;
- by adding nzb-files from other sources (upload via web-interface or put files into NzbDir) a simple title match is used;
- by adding nzb-files from all sources a content check prevents adding of **exactly same** nzb-files;
- manually: duplicate properties can be changed for any download (nzb-file); these properties define how duplicates are handled.

Duplicate handling:
- before an item is added to queue a check is performed whether a similar item is already queued or was downloaded before. If download queue contains the same title or history contains the title with status "success" the duplicate is not added to queue but instead put directly to history as backup (see later);
- if the title doesn't present in queue and it was never successfully downloaded before it is added to download queue;
- if download of an item fails and there are duplicates to this item in history the best of them is moved back to queue for download.

After successful download of one duplicate:
- successfully downloaded nzb-file is shown as "success" in history;
- failed downloads are shown as "failure" in history;
- downloads which were not tried (because another one succeeded or still queued) are shown as "dupe" in history;
- if you find out that the success-file is not good (wrong language, bad video, etc.) you can mark this nzb-file in history as bad (command "Mark as bad" in actions menu); if there are duplicates with dupe-status (not tried) the best of them is moved back to queue for download; if there are no backup duplicates in history the title will be watched in RSS feeds and will be downloaded when it becomes available;

Well, RSS feeds are always watched for new versions of the title and these versions are added to history with dupe-status. They are used as backups if you mark the successfully downloaded nzb-file as bad. Once you have checked the downloaded file you can stop adding of duplicates by marking the nzb-file as good (command "Mark as good" in actions menu).

**NOTE:** for automatic duplicate handling option **HealthCheck** must be set to **Delete** or **None**. If it is set to **Pause** you will need to manually unpause another duplicate (if any exist in queue).

### Newznab feeds
The easiest way to enjoy smart duplicates is to use newznab based RSS feeds. Newznab is a software used by many nzb sites as backend. RSS feeds provided by newznab have special fields uniquely identifying movies and tv series. By default these fields usually are not present in RSS feed; to activate them add parameter **extended=1** to feed URL, for example:
```
https://mynzbsite.com/api?apikey=123&t=search&q=dexter&extended=1
```

Extended attributes provided by newznab are:
- for movies: imdb-id;
- for series: rage-id, season number and episode number.

NZBGet uses these information to find duplicates.

## Duplicate keys
To identify duplicates NZBGet needs a unique key (a string) for each title. In a case of newznab feeds the duplicate key (short: dupekey) is built by NZBGet automatically:
- for movies: *imdb=123456*, where *123456* is imdb-id of the title;
- for series: *rageid=12345-Sxx-Eyy*, where *12345* is rageid of the series, *xx* is season number and *yy* is episode number. If **rageid** isn't available fields **tvdbid** and **tvmazeid** can be used instead (requires NZBGet v17).

Example duplicate keys:
```
imdb=175849
rageid=13434-S02-E10
tvdbid=13434-S02-E10
tvmazeid=13434-S02-E10
```

For RSS feeds not having fields imdb, rageid(or tvdbid or tvmazeid)/season/episode the duplicate keys must be assigned by user using options in RSS filter commands *Accept* and *Options*. In our example non-newznab feed we use RSS filter to accept "Dexter" and "Breaking Bad":
```
Accept: dexter
Accept: breaking bad
```
In this simple example the nzb-files added to queue will not have any duplicate keys. NZBGet will compare the whole nzb-name to detect duplicates and this will not give good results since titles are usually not exactly same.

### Variables for match-groups
Now we extend RSS filter and build duplicate keys as: series name + season number + episode number:
```
Accept(dupekey:dexter-${1}-${2}): dexter S##E##
Accept(dupekey:breaking-bad-${1}-${2}): breaking bad S##E##
```

Example duplicate keys assigned by this filter:

NZB-Name|Duplicate key
--------|-------------
Dexter.S08E10.1080p.HDTV.x264.QCF|dexter-08-10
Dexter.S08E10.1080p.WEB-DL.DD5.1.H.264-BS.NLsub|dexter-08-10
Dexter.S08E11.1080p.WEB-DL|dexter-08-11
Dexter.S08E11.Monkey.in.a.Box.1080p.WEB-DL.DD5.1.H.264-BS|dexter-08-11

You can see that nzb-files for the same episode have same duplicate keys.

Take a near look at the accept-rule we were using:
```
Accept(dupekey:dexter-${1}-${2}): dexter S##E##
```
The search string `dexter S##E##` consists of two search terms: `dexter` (just a word search) and `S##E##` (a pattern match). Special character `#` matches any digit. A sequence of pattern characters build a match-group. In our search string `dexter S##E##` we have two match-groups: one after "S" and another one after "E".
After matching the actual values of match groups (for "S08E10" it's "08" and "10") can be used in option "dupekey" as variables `${1}` and `${2}`:
```
dupekey:dexter-${1}-${2}
```
Every pattern group is counted. If our search string would have `*dexter*` instead of `dexter` we would need to use variables 3 and 4:
```
Accept(dupekey:dexter-${3}-${4}): *dexter*S##E##*
```

**TIP:** when writing RSS filters in NZBGet web-interface move the mouse over status "ACCEPTED" to see the tooltip with assigned duplicate key (and other assigned options like category, priority, etc.).

### Variables "season" and "episode"
There is another (better) way to add season and episode numbers into duplicate key:
```
Accept(dupekey:dexter-${season}-${episode}): dexter
```
This has almost the same effect as using pattern matching `S##E##` and match-groups `${1}` and `${2}`. The advantage of using `${season}` and `${episode}` is that NZBGet automatically finds season and episode numbers in the title. In addition to common syntax `S##E##` a less usual syntax `#x##` (like "1x09") is also supported. When variables "season" and "episode" are used to build dupekey they are formatted in the same way (S## and E##) regardless of syntax which was used in the title.

Variables `${season}` and `${episode}` can be used in other options too, not only "dupekey". This is true for match-groups `${1}`, `${2}`, etc. as well:
```
Accept(category:dexter-${season}): dexter
```

### Option "series"
Specially for seasoned TV shows there is a shorter syntax for `${season}-${episode}` in the dupekey:
```
Accept(series:dexter): dexter
```
In this example items become duplicate key like "series=dexter-S08-E12". This is just a shorter form for `dupekey:series=dexter-${season}-${episode}`. There is one small but important distinction though: if feed item doesn't have season or episode numbers then no duplicate is generated.

### Examples

The following examples show differences between three possible ways to add season and episode numbers to duplicate key: 

<small>NZB-Name</small>|<small>Duplicate key created by "dupekey:series=dexter-S${1}-E${2}" with "S##E##"</small>|<small>Duplicate key created by "dupekey:series=dexter-${season}-${episode}"</small>|<small>Duplicate key created by "series:dexter"</small>
--------|----------------------|--------|--------
Dexter.S08E10.1080p|series=dexter-S08-E10|series=dexter-S08-E10|series=dexter-S08-E10
Dexter.S08.Season.720p|series=dexter-${1}-${2}|series=dexter-S08-E00|\<empty>
Dexter.8x10.1080p|series=dexter-${1}-${2}|series=dexter-S00-E00|\<empty>

**TIP:** for seasoned TV shows use option `series:show-name`, it gives best results and leaves duplicate key empty in situations where duplicate key cannot be confidently generated.

Why two other syntaxes then? The syntax with match-groups has wider usage than just seasoned TV shows. It can be successfully used to identify dated tv-shows and for other nzb-files not related to video. Variables `${season}` and `${episode}` were implemented before the third syntax was invented. They were kept, may be someone find them useful for anything. And they also help to explain how option `series:name` works too.

**TIP:** in a case you forgot - you need to manually assign duplicate keys only for non-newznab feeds. Newznab feeds (with option extended=1) become duplicate keys automatically (for movies and seasoned TV shows). You still can manually assign dupekeys for newznab feeds too, if you want.

### Options "rageid", "tvdbid", "tvmazeid"
As was previously shown for newznab feeds (with extended attributes) the duplicate keys are generated automatically for TV shows. Such dupekeys look like:
```
rageid=13434-S02-E10
tvdbid=13434-S02-E10
tvmazeid=13434-S02-E10
```
If you use multiple nzb-sites and the same TV show may appear in a newznab feed and in a non-newznab feed, then you should make sure that the same titles become the same dupekey. For non-newznab feed you can assign duplicate key using rageid (or tvdbid or tvmazeid) of the show to match the key generated for newznab feed:
```
A(dupekey:rageid=7926-${season}-${episode}): dexter
A(dupekey:tvdbid=79349-${season}-${episode}): dexter
```

To make life easier there is a shorter syntax for this:
```
A(rageid:7926): dexter
A(tvdbid: 79349): dexter
```

**TIP:** [How to find the T.V. show ID at TVRage.com](http://www.youtube.com/watch?v=CTsTJI8kTVM).

## Duplicate scores
With properly assigned duplicate keys each nzb-file has a duplicate key and nzb-files for the same titles have the same duplicate key. If our feed has multiple files for the same title:
```
Dexter.S08E10.1080p.WEB-DL.DD5.1.H.264-BS.NLsub		TV > Foreign	9 d	2.19 GB
Dexter.S08E10.1080p.HDTV.x264.QCF			TV > HD		10 d	3.45 GB
Dexter.S08E10.720p.HDTV.DD5.x264-NTb			TV > HD		15 d	3.13 GB
Dexter.S08E10.720p.HDTV.x264-EVOLVE			TV > HD		16 d	1.34 GB
```

NZBGet will download only one of these nzb-files. This is great but which one? Answer: the first added to download queue which is usually the first listed in the RSS feed.

Looks like it is "Dexter.S08E10.1080p.WEB-DL.DD5.1.H.264-BS.NLsub" then, right? Not really. If your RSS feed is updated frequently (every hour or so) the first nzb-file appearing in the feed would be the oldest - "Dexter.S08E10.720p.HDTV.x264-EVOLVE".

The nzb-file "Dexter.S08E10.1080p.HDTV.x264.QCF" will appear in the feed 6 days later when the 720p-version is already download. The duplicate check will mark the file as "Dupe" and put it directly into history without download. This is what duplicate check is for - save time and bandwidth for other titles.

But what if you want a higher resolution 1080p-version? You could of course modify the filter to accept only 1080p:
```
Require: 1080p
```
Looks like a solution but has two problems: in our example the 1080p-version was posted 6 days later whereas you couldn't possibly wait so long. Another problem is that the 1080p-version could never be posted at all. In most cases you would be satisfied with 720p-version if a better version is not available. It's better 720p than nothing. How to tell NZBGet about that? Answer: duplicate scores:
```
Accept(dupescore:1000): dexter 720p
Accept(dupescore:2000): dexter 1080p
```
As usual there are many ways to code the same filter, for example:
```
Require: ( 720p | 1080p )
Options(dupescore:1000) 720p
Options(dupescore:2000) 1080p
Accept: dexter
```
Although it's four lines instead of two it has an advantage that adding new TV shows to the list requires only one new line per show:
```
Accept: breaking bad
Accept: homeland
```

### How duplicate scores work
- In addition to duplicate key each nzb-file in download queue has field "duplicate score";
- If RSS feed has multiple items with the same duplicate key they all are added;
- The program chooses the item with the highest score and downloads it;
- All other items for the same duplicate key are moved into history as duplicate backups; they will be used if the first download fail;
- If download has failed and NZBGet needs to download a backup, it looks in the history for a duplicate having highest score from the remaining nzb-files;
- When RSS feed is checked for the next time, duplicates with lower scores (when already successfully downloaded) are not downloaded (but put into history); If a duplicate with higher score is found, it is downloaded.

### Stop watching
If you have watched (in the sense "watching TV") the 720p-version before 1080p-version was downloaded and you don't care about 1080p-version anymore you can tell NZBGet to stop watching (in the sense "looking for") the title. Open the history item in web-interface and from actions menu choose "Mark as good". For more about this see [History and duplicate check](#history-and-duplicate-check).

### Duplicate status
Although duplicates scores cover most use cases there is also another possibility to check for existence of the title in the history or queue, using field **dupestatus**. That is a computable field, when used in the filter rule the program searches in the history and download queue for the item with the same duplicate key or title. The field contains comma-separated list of following possible statuses (if duplicates were found): **QUEUED**, **DOWNLOADING**, **SUCCESS**, **WARNING**, **FAILURE** or an empty string if there were no matching items found:
- **DOWNLOADING** is similar to **QUEUED** but means that the download is partially downloaded (not necessary actively downloading at the moment);
- **SUCCESS**, **WARNING**, **FAILURE** as explained in RPC Method "history" but the status of pp-scripts is ignored. If any of pp-scripts has failed but the download was successfully completed the status is "SUCCESS", not "WARNING" as in the method "history".

Example:
```
O(dupescore+:-10000): dupestatus:success | dupestatus:downloading
```

## Duplicate modes
Sometimes you may want to download all available releases for a certain title to later manually choose the best one. Nzb-files in queue have a special property to achieve this - duplicate mode, which can have one of three possible values:
- **Score** - this is default duplicate mode. Only nzb-files with higher scores (when already downloaded) are downloaded;
- **All** - all nzb-files regardless of their scores are downloaded;
- **Force** - force download and disable all duplicate checks.

For *Score* and *All* apply: nzb-files are not downloaded if there is a successfully downloaded duplicate *marked as good* (see [History and duplicate check](#history-and-duplicate-check));

*Force*-mode is for use in the add-file-dialog of web-interface - there is a check box "disable duplicate check", which activates this mode. *Score* and *All* are for use in RSS feed filters:
```
# downloading best of dexter
Accept(dupemode:score): dexter
# downloading all releases of breaking bad
Accept(dupemode:all): breaking bad
```

Like all other properties *dupemode* can be used in rule *Options*:
```
Options(dupemode:all): *
Options(dupemode:score): 720p
Accept: dexter
Accept: breaking bad
```

## Example duplicate filters
### Seasoned TV shows
```
Require: ( 720p | 1080p )
Options(dupescore:1000): 720p
Options(dupescore:2000): 1080p
Accept(series:dexter): dexter season:=8 episode:>0
Accept(series:breaking-bad, priority:100): *breaking?bad* season:=5 episode:>0
```
Explanation:
- Download only HD versions (720p or 1080p);
- Download "Dexter", 8-th season;
- Download the 5-th season of "Breaking bad";
- Accept only individual episodes (episode:>0), not season packs;
- Prefer 1080p versions but accept 720p too;
- Setting duplicate keys (for non-newznab feeds), for newznab-feeds the setting of option "series" is not necessary;
- Setting high priority (priority:100) for "Breaking bad". "Dexter" will be downloaded with default priority (0).

This same filter can be rewritten using short names for rules and options:
```
Q: ( 720p | 1080p )
O(s:1000): 720p
O(s:2000): 1080p
A(series:dexter): dexter season:=8 episode:>0
A(series:breaking-bad, pr:100): *breaking?bad* season:=5 episode:>0
```

### Daily TV shows
```
Q: ( 720p | 1080p )
A(dupekey:tv=Jay.Leno-${1}): Jay Leno $([0-9]+\.[0-9]+\.[0-9]+)
```
Explanation:
- Download only HD versions (720p or 1080p);
- Download Jay Leno TV show, only titles having date stamp (like "2013.09.20");
- Generate duplicate key consisting of TV show name and air date. It produces keys like "tv=Jay.Leno-2013.09.20".
The dupekey generation part will produce different keys for different date formats even if they represent the same date ("2013.09.20" vs "2013-09-20"). The regular expression could be improved to handle this but this is usually not necessary because most posters use common format "yyyy.mm.dd".

### Daily TV shows (different date formats)
If the same show can be posted with different date formats (for example **30.05.2017** and **2017.05.30**) we need to generate duplicate keys where date is normalized to the same format. This is necessary for duplicate check to identify the items as the same title.

The following filter should capture all three formats: **30.05.2017**, **2017.05.30** and **30.05.17**:
```
# 30.05.2017
A(dupekey:tv=show.name-${2}.${3}.${4}): $(\.([0-9]{2})\.([0-9]{2})\.([0-9]{4})\.) show.name

# 2017.05.30
A(dupekey:tv=show.name-${4}.${3}.${2}): $(\.([0-9]{4})\.([0-9]{2})\.([0-9]{2})\.) show.name

# 30.05.17
A(dupekey:tv=show.name-${2}.${3}.20${4}): $(\.([0-9]{2})\.([0-9]{2})\.([0-9]{2})\.) show.name
```

Pay attention to the different order of match-variables for each date format. Append additional `20` if necessary to extend year to four digits.

If you need to capture both two-digits year formats **30.05.17** and **17.05.30** that is a bigger problem as the regex cannot determine where is the year (well, in this example it's clear the year can't be "30" but something like **16.05.17** is not that obvious. At best use directly `17` in the regex instead of `([0-9]{2})`:

```
# 30.05.17
A(dupekey:tv=show.name-${2}.${3}.2017): $(\.([0-9]{2})\.([0-9]{2})\.17\.) show.name
```

**TIP:** To test how dupekeys are generated hover mouse on status-field in feed results of the feed filter dialog in web-interface.

## Feed scripts
Sometimes you may need a more sophisticated processing of feed items, not achievable with built-in filters. In such case there is a possibility to process the feed with an external script. Use option **FeedX.Extension** to assign a script to the feed. When the feed is processed NZBGet saved the feed content into an xml-file and executes the extension script. The script can read and modify the xml-file. When the script terminates NZBGet loads the modified xml-file from disk and processes it further. See [Feed scripts](feed-scripts) for details.

## History and duplicate check
When a new nzb-file is added the program needs to check if this same nzb-file or the same title is already queued or if it was downloaded before. Since the same titles may appear in RSS feeds any time later, the information about downloaded files must be stored for a long time.

In order to reduce memory usage and data transfer to web-interface there is a program option **KeepHistory** saying how long items must be kept in history (30 days by default). This short period of time is however not sufficient for a proper duplicate check. Because of this, after expiration of KeepHistory-interval the items are not removed from history completely. Instead almost all information associated with history items is discarded and only few fields required for duplicate check are kept (title, duplicate key/score, status and few others).

Normal history items take about 2 KB memory each, reduced items require about 200 Bytes. A lot of them can be efficiently stored without problem even on devices with limited RAM.

Reduced history items are not shown in web-interface on history tab by default. But there is a button "Hidden" to show them. Such items are marked with badge **Hidden**. They can be searched and deleted like normal history items if necessary. All other history functions such as command "Post-process again" or statistics data are not available for hidden history items.

**TIP:** if history gets corrupted, this has fatal consequences to duplicate check. You should make regular backups of queue-directory (option *QueueDir*), which also contains history. The program must not run during backup. A script used to start or shutdown NZBGet is a good place for a backup command:
```shell
#!/bin/sh
zip -r queue-$(date +%Y%m%d_%H%M%S).zip /path/to/queuedir
nzbget -D
```

### Mark as good/bad
In history dialog in actions menu there are two commands **Mark as good** and **Mark as bad** directly linked to duplicate handling.
- **Mark as good**: when this command is executed on a history item, the item become marked as "good". If any duplicates will be added (from RSS or other sources) they will be ignored. Normally, when there is no good-item for duplicate but if a success-item exist, all added duplicates are put to history with dupe-status as backups. This is not happening when a good-item exist. Another effect of marking an item as good: all existing dupe-items are removed from recent history. They are put into dup-history (old-history) and can be viewed in web-interface by clicking on button **Old** in the history list.
- **Mark as bad**: this command is available only for history items with success download status. You can use it if you find out the downloaded file is not good (wrong language, bad quality, etc.) and you want download another version of the title. After marking an item as bad, if there are records with dupe-status for the same title, they are moved back from history to download queue and one of them become unpaused whereas other remain paused (backups). If there are no backup duplicates in history the title will be watched in RSS feeds and will be downloaded when it becomes available.

### History statuses
Regarding duplicate check the following statuses of history items are relevant:
- **Success** - the nzb successfully downloaded and post-processes. The duplicates will be downloaded only if having higher duplicate score or force duplicate mode.
- **Failure** - the nzb has failed. If there are duplicates one of them will be downloaded (must have been already moved from history to queue). Otherwise the feeds will be watched for the same title and the one with the highest score will be downloaded.
- **Dupe** - the nzb was deleted by duplicate check, because there is another item in queue. The item with status "Dupe" maybe used automatically if the item which is in queue fails.
- **Copy** - the nzb was deleted by duplicate check because this nzb-file already exists in download queue or in history. Here the nzb is the exactly same copy of another nzb. This status can occur only if you try to add the same nzb again. The exact content of nzb is compared here (via article IDs).
- **Good** - the nzb was marked as good by user using command *Mark as good* in history dialog. Any new arrived duplicates will be ignored (not added to queue nor to history).
- **Bad** - the nzb was marked as bad by user using command *Mark as bad* in history dialog. The item is process like item with **Failure** status.
