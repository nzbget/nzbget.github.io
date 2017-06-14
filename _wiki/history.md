---
title: Release history
---

<div class="bs-docs-featurette" id="hist-loading">
    Fetching release history from GitHub...
</div>
<div class="bs-docs-featurette hide" id="hist-content">
    <p>Below is the change log for all <strong>stable</strong> releases.
    For testing releases see <a href="/history-testing">Release history (for testing releases)</a>.</p>
</div>

{% include changelog.html %}

<script language="javascript">
    window.onload = function() { ChangeLog.loadAndBuildPage('stable'); }
</script>
