---
title: Release notes
---

<div class="bs-docs-featurette" id="hist-loading">
	Loading release notes...
</div>
<div class="bs-docs-featurette hide" id="hist-content">
</div>

{% include changelog.html %}

<script language="javascript">
	'use strict';

	window.onload = function() {
        function loaded(data)
        {   
            ChangeLog.buildPage([data], '#hist-content', true);
            $('#hist-content').append($('<p class="release-notes-history-link"><a href="/history">View change log for previous stable releases</a></p>'));
            $('#hist-loading').hide();
            $('#hist-content').removeClass('hide');
        }

        ChangeLog.load('https://api.github.com/repos/nzbget/nzbget/releases/tags/v{{site.data.version.stable-version}}', loaded);
    }

</script>
