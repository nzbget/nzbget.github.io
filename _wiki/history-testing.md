---
title: Release history (for testing releases)
---

<div class="bs-docs-featurette" id="hist-loading">
    Fetching release history from GitHub...
</div>
<div class="bs-docs-featurette hide" id="hist-content">
    <p><span id="hist-testing">Below is the change log for <strong>testing</strong> releases.</span>
    For stable releases see <a href="/history">Release history</a>.
    For recent changes in the develop-branch please refer to <a href="https://github.com/nzbget/nzbget/commits/develop">git commit history</a>.</p>
</div>

{% include changelog.html %}

<script language="javascript">
    window.onload = function() {
        ChangeLog.loadAndBuildPage('testing', function() {
            if ($('#hist-content').children().length === 1)
            {
                $('#hist-testing').text('There were no testing releases since the latest stable version.');
            }
            else
            {
                $('#hist-content').append($('<hr><p>For older (stable) releases see <a href="/history">Release history</a>.</p>'));
            }
        });
    }
</script>
