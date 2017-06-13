---
title: Release history
---

<div class="bs-docs-featurette" id="hist-loading">
    Fetching release history from GitHub...
</div>
<div class="bs-docs-featurette hide" id="hist-content">
    <p>Below is the change log for all <strong>stable</strong> releases.
    The change log for <strong>testing</strong> releases can be found on <a href="https://github.com/nzbget/nzbget/releases">releases page</a>.
    For recent changes in the develop-branch please refer to <a href="https://github.com/nzbget/nzbget/commits/develop">git commit history</a>.</p>
</div>

<script src="/js/markdown.min.js"></script>

<script language="javascript">
    'use strict';

    {% include history.js %}

    function loaded(data)
    {   
        History.sort(data);
        History.buildPage(data, '#hist-content', false, true);
        $('#hist-loading').hide();
        $('#hist-content').removeClass('hide');
    }

    function buildPageFromGitHub() {
        History.load('https://api.github.com/repos/nzbget/nzbget/releases',
            function(data) {
                History.load('https://api.github.com/repos/nzbget/nzbget/releases?page=2',
                function(data2) {
                    Array.prototype.push.apply(data, data2);
                    loaded(data);
                }
            )
        });
    }

{% if false %}
    // development (test) version
    function buildPageFromLocalTest() {
        var data = [{name: '18.1', created_at: '2017-05-27T11:28:07Z', body: '- fixed few bugs (#388);\n- fixed more bugs (#292, #295,#298).'},
            {name: '18.0', created_at: '2017-02-08T16:59:17Z', body: '- don&#39;t many nice new features.'},
            {name: '18.0-testing-r1826', created_at: '2017-01-14T12:27:26Z', prerelease: true, body: '- fixed one bug;\n-fixed another bug.'},
            {name: '0.3.0', created_at: '2007-11-10T12:27:26Z', body: '- a lot of new features;\n - see [Keyboard shortcuts](https://github.com/nzbget/nzbget/wiki/Keyboard-shortcuts);\n - see [Keyboard shortcuts](https://github.com/nzbget/nzbget/wiki/Keyboard-shortcuts);'},
            {name: '0.3.1', created_at: '2007-12-18T12:27:26Z', body: '- a lot of new features.'},
            {name: '17.1', created_at: '2016-09-02T12:27:26Z', body: '- many new features.'},
            {name: '9.0', created_at: '2015-06-02T12:27:26Z', body: '- many new features.'}];
        loaded(data);
    }
    window.onload = buildPageFromLocalTest;
{% else %}
    window.onload = buildPageFromGitHub;
{% endif %}
</script>
