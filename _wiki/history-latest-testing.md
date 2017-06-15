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
{% if site.data.version.testing-version > site.data.version.stable-version %}
        function loaded(data)
        {   
            ChangeLog.buildPage([data], '#hist-content', false);
            $('#hist-content').append($('<p class="release-notes-history-link"><a href="/history-testing">View change log for previous testing releases</a></p>'));
            $('#hist-loading').hide();
            $('#hist-content').removeClass('hide');
        }

        $('#hist-content').html('<h4>NZBGet {{site.data.version.testing-version}}-testing-{{site.data.version.testing-revision}} <small> &bull; {{site.data.version.testing-date-text}}</small></h4>');

        ChangeLog.load('https://api.github.com/repos/nzbget/nzbget/releases/tags/v{{site.data.version.testing-version}}-{{site.data.version.testing-revision}}', loaded);
{% else %}
        $('#hist-content').html('<p>There were no testing releases since the latest stable version.</p>');
        $('#hist-loading').hide();
        $('#hist-content').removeClass('hide');
{% endif %}
    }

</script>
