(function () {

    function loadBlogData(callback) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', "blog.xml", true);

        xhr.onload = function (e) {

            if (this.status < 400) {

                callback(this.response);

            } else {
                //reject();
            }
        };

        //xhr.onerror = reject;

        xhr.send();
    }

    function getBlogItemHtml(item) {

        var title = item.querySelector('title').innerHTML;
        var link = item.querySelector('guid').innerHTML;
        var pubDate = item.querySelector('pubDate').innerHTML;

        var imageElement = item.querySelector('image url') || item.querySelector('url');

        var imageUrl = null;

        if (imageElement) {
            imageUrl = imageElement ? imageElement.textContent : null;
        }

        var html = '';

        html += '<a class="card" href="' + link + '">';

        if (imageUrl) {

            imageUrl = imageUrl.replace('https://emby.media/', '');
            imageUrl = imageUrl.replace('http://emby.media/', '');
            html += '<img class="cardImage" src="' + imageUrl + '" />';
        }

        html += '<div class="cardContent">';

        html += '<h2 class="w-blog-entry-title cardTitle">';
        html += title;
        html += '</h2>';

        html += '<div class="w-blog-entry-body">'
        html += '<div class="w-blog-meta cardDate">';
        html += '<i class="mdfi_device_access_time"></i>';
        html += pubDate;
        html += '</div>';
        html += '</div>';

        html += '</div>';

        html += '</a>';

        return html;
    }

    function renderBlog() {

        loadBlogData(function (xml) {

            var div = document.createElement('div');
            div.innerHTML = xml;

            var items = div.querySelectorAll('item');

            var html = [];
            for (var i = 0, length = items.length; i < length; i++) {
                html.unshift(getBlogItemHtml(items[i]));
            }

            document.querySelector('.blogItems').innerHTML = html.join('');

            // vanilla JS
            // init with element
            var grid = document.querySelector('.blogItems');
            var msnry = new Masonry(grid, {
                // options...
                itemSelector: '.card',
                columnWidth: 480
            });
        });
    }

    renderBlog();

})();