(function () {

    function loadBlogData() {

        return new Promise(function (resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', "blog.xml", true);

            xhr.onload = function (e) {

                if (this.status < 400) {

                    resolve(this.response);

                } else {
                    reject();
                }
            };

            xhr.onerror = reject;

            xhr.send();
        });
    }

    function getBlogItemHtml(item) {

        var title = item.querySelector('title').innerHTML;
        var link = item.querySelector('link').innerHTML;
        var pubDate = item.querySelector('pubDate').innerHTML;

        var imageElement = item.querySelector('image url').innerHTML;
        var imageUrl = imageElement ? imageElement.innerHTML : null;

        var html = '';

        html += '<a class="card" href="' + link + '">';

        html += '<div class="cardContent">';

        html += '<div class="cardTitle">';
        html += title;
        html += '</div>';

        html += '<div class="cardDate">';
        html += pubDate;
        html += '</div>';

        html += '</div>';

        html += '</a>';

        return html;
    }

    function renderBlog() {

        loadBlogData().then(function (xml) {

            var div = document.createElement('div');
            div.innerHTML = xml;

            var items = div.querySelectorAll('item');

            var html = '';
            for (var i = 0, length = items.length; i < length; i++) {
                html += getBlogItemHtml(item);
            }

            document.querySelector('.blogItems').innerHTML = html;
        });
    }

    renderBlog();

})();