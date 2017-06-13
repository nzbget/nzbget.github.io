var History = (new function()
{
	'use strict';

    this.load = function(url, callback) {
        $.ajax({
            url: url,
            complete: function(xhr) {
                callback.call(null, xhr.responseJSON);
            }
        });
    }

    this.sort = function(data)
    {
        data.sort(function(a, b) {
            var an = a.name;
            var bn = b.name;
            if (an.substr(1, 1) === '.') an = '0' + an;
            if (bn.substr(1, 1) === '.') bn = '0' + bn;
            return an < bn ? 1 : -1;
        });
    }

    this.buildPage = function(data, destDiv, withPreleases, withHeaders)
    {
        var MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (var i = 0; i < data.length; i++)
        {
            var rel = data[i];
            if (!rel.prerelease || withPreleases)
            {
                if (withHeaders)
                {
                    var dat = new Date(rel.created_at);
                    var datStr = '' + dat.getDate() + ' ' + MONTH_NAMES[dat.getMonth()] + ' ' + dat.getFullYear();
                    $(destDiv).append($('<h2>').text(rel.name).append($('<small>').text(' - ' + datStr)));
                }

                var desc = rel.body;
                desc = desc.replace(/\(https:\/\/github.com\/nzbget\/nzbget\/wiki\/(.+)\)/g,
                    function(match, p1) {
                        p1 = p1.toLowerCase().replace(/_/g, '-');
                        return '(https://nzbget.net/' + p1 + ')';
                    });
                desc = markdown.toHTML(desc);
                desc = desc.replace(/\(#([\d]+)/g, '(<a href="https://github.com/nzbget/nzbget/issues/$1">#$1</a>');
                desc = desc.replace(/,\s?#([\d]+)/g, ', <a href="https://github.com/nzbget/nzbget/issues/$1">#$1</a>');

                $(destDiv).append(desc);
            }
        }
    }
}());