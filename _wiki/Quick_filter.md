---
---
### Contents
- [Intro](#intro)
- [Simple filter](#simple-filter)
- [Specifying column](#specifying-column)
- [AND operator](#and-operator)
- [OR operator](#or-operator)
- [NOT operator](#not-operator)
- [Grouping](#grouping)
- [Combining operators](#combining-operators)
- [Comparison operators](#comparison-operators)
- [Special fields](#special-fields)
- [API fields](#api-fields)
- [Search in settings](#search-in-settings)

## Intro
In web-interface the lists can be filtered using **Quick Filter**. This applies to main lists such as *Downloads*, *History* and *Messages* but also to file lists (in *download details dialog*) and log messages (in *download details dialog* and in *history details dialog*). Moreover the filter can be also used on settings page.

For the main lists the filter input box is located at the top of the page:
![quickfilter](https://cloud.githubusercontent.com/assets/3368402/9324892/966870ee-458e-11e5-8052-7918a95ade4d.png)

With quick filter the content can be restricted to entries with certain conditions.

## Simple filter
The simplest filter is a word. The table is searched for the word and only the entries containing the word are shown. For example filter `iso` shows entries containing word "iso". The search is made for sub-strings, "iso" matches also for texts like "isolate".

## Specifying column
To search only in certain column add the name of column to the search string using colon as a separator between column name and search text: `name:debian` will search only in column "Name".

## AND operator
To search for entries having more than one search word separate the words with space, no special AND-operator is required: `debian iso` will show entries containing both "debian" and "iso".

## OR operator
To search for entries having ANY of the words separate the words with `|`, for example `debian | ubuntu` shows entries with any of these words.

## NOT operator
To negate the condition add character `-` (hyphen) before the search word. For example `-iso` shows entries without word "iso".

## Grouping
When searching for both OR and AND conditions use parenthesis to group words. For example `(debian | ubuntu) iso` filters entries with "iso" and either "debian" or "ubuntu":
```
ubuntu 11 10 server amd64 iso
debian 7 iso
```

## Combining operators
All operators can be used in one search query. Examples:
- `(debian | ubuntu) iso`
- `(debian | ubuntu) -iso`
- `-(debian|ubuntu) iso`
- `-(debian|ubuntu) iso -dvd`

With column names:
- `(debian | ubuntu) category:iso`
- `(debian | ubuntu) -category:iso`
- `-(name:debian|name:ubuntu) category:iso`

## Comparison operators
By default the search is made for sub-strings. However there are other comparison operators. All of them require the specifying of column names:
- `=` - exact match is required (yet case insensitive like all other comparisons). For example `category=720p` matches categories "720p" and "720P" but not "HD - 720p". The equal-operator is also useful to filter columns with empty values, for example `category=` shows entries with empty category;
- `<>` - not equal. For example `category<>720p`;
- `>`, `<`, `<=`, `>=` - integer comparison operators, to use with integer fields (see below).

## Special fields
All columns displayed in tables are searched as is, exactly as they are shown. For example the column "Size" contains formatted texts such as "1.5 GB" or "890 MB". Searching for size as text isn't very practical. To make more sophisticated searches such as "show only entries with size between 4 and 8 GB" possible a set of extra integer fields is added to the searchable fields:
- **sizemb**, **sizegb**, **leftmb**, **leftgb** - initial and remaining download size in MB or GB;
- **agem**, **ageh**, **aged** - post age in minutes, hours or days;
- **priority** - priority of the download (as integer value). Default priorities are: -100 (very low), -50 (low), 0 (normal), 50 (high), 100 (very high), 900 (force).

These fields are especially useful when combined with integer comparison operators. Examples:
- `sizegb>4 sizegb<8` - shows downloads with size between 4 and 8 GB (alternatively `sizegb>=4 sizegb<=8` to include the boundaries);
- `game of kings sizegb>4`;
- `(debian|ubuntu) aged>1000`.

## API fields
In addition to fields displayed in tables and special integer fields mentioned above, there are even more fields which can be used in search strings. Plain fields returned by the relevant API call can be used:
- Downloads - fields returned by [[API-Method "listgroups"]];
- History - fields returned by [[API-Method "history"]];
- Messages - fields returned by [[API-Method "log"]].

Examples for downloads:
- `dupescore>100` - only downloads with duplicate score above 100;
- `dupekey<>` - downloads with non-empty duplicate key (alternatively: `-dupekey=`);
- `health<1000` - non-healthy downloads.

Examples for history:
- `-(parstatus:success|parstatus:none)` - with par-status other than "SUCCESS" or "NONE";
- `-url=` - with non-empty URL.

**NOTE:** Field "Status" exists in both table and API. The table displays a more user friendly text whereas the API contains more technical version. To search for API field type field name with exact letter case as documented in the API - "Status". To search for table field use lower letter case "status"; any other letter case form will search in the table too.

## Search in settings
When searching in settings the option names, descriptions and values are searched by default. To narrow down the search scope use the following field names:
- **name** - for option name;
- **description** - for option description text;
- **value** - for current option value.

Examples:
- `name:par` - shows options whose names contain word "par";
- `name:feed name:pause value:yes` - shows options with words "feed" and "pause" in their names and value set to "yes".

**TIP:** After searching on settings page click on option name to navigate to the page where the option is located.
