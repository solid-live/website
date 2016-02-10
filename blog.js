(function () {

    var thresholdX = screen.availWidth;
    var thresholdY = screen.availHeight;

    var wheelEvent = (document.implementation.hasFeature('Event.wheel', '3.0') ? 'wheel' : 'mousewheel');

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

        link = link.replace('https://emby.media/', '');
        link = link.replace('http://emby.media/', '');
        html += '<a class="card" href="' + link + '">';

        if (imageUrl) {

            imageUrl = imageUrl.replace('https://emby.media/', '');
            imageUrl = imageUrl.replace('http://emby.media/', '');
            html += '<div class="cardImage lazy" data-src="' + imageUrl + '"></div>';
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

    function replaceAll(str, find, replace) {

        return str.split(find).join(replace);
    }

    function renderBlog() {

        loadBlogData(function (xml) {

            xml = replaceAll(xml, "<description>", "<!--<description>");
            xml = replaceAll(xml, "</description>", "</description>-->");

            var div = document.createElement('div');
            div.innerHTML = xml;

            var items = div.querySelectorAll('item');

            var html = [];
            for (var i = 0, length = items.length; i < length; i++) {
                html.unshift(getBlogItemHtml(items[i]));
            }

            var parent = document.querySelector('.blogItems');
            parent.innerHTML = html.join('');
            lazyChildren(parent);
        });
    }

    function visibleInViewport(elem, partial, thresholdX, thresholdY) {

        thresholdX = thresholdX || 0;
        thresholdY = thresholdY || 0;

        var vpWidth = window.innerWidth,
            vpHeight = window.innerHeight;

        // Use this native browser method, if available.
        var rec = elem.getBoundingClientRect(),
            tViz = rec.top >= 0 && rec.top < vpHeight + thresholdY,
            bViz = rec.bottom > 0 && rec.bottom <= vpHeight + thresholdY,
            lViz = rec.left >= 0 && rec.left < vpWidth + thresholdX,
            rViz = rec.right > 0 && rec.right <= vpWidth + thresholdX,
            vVisible = partial ? tViz || bViz : tViz && bViz,
            hVisible = partial ? lViz || rViz : lViz && rViz;

        return vVisible && hVisible;
    }

    function isVisible(elem) {
        return visibleinviewport(elem, true, thresholdX, thresholdY);
    }

    function loadImage(elem, url) {

        if (elem.tagName !== "IMG") {

            var tmp = new Image();

            tmp.onload = function () {
                elem.style.backgroundImage = "url('" + url + "')";
            };
            tmp.src = url;

        } else {
            elem.setAttribute("src", url);
        }
    }

    function fillImage(elem) {
        var source = elem.getAttribute('data-src');
        if (source) {
            loadImage(elem, source);
            elem.setAttribute("data-src", '');
        }
    }

    function cancelAll(tokens) {
        for (var i = 0, length = tokens.length; i < length; i++) {

            tokens[i] = true;
        }
    }

    function unveilElements(images) {

        if (!images.length) {
            return;
        }

        var cancellationTokens = [];
        function unveilInternal(tokenIndex) {

            var remaining = [];
            var anyFound = false;
            var out = false;

            // TODO: This out construct assumes left to right, top to bottom

            for (var i = 0, length = images.length; i < length; i++) {

                if (cancellationTokens[tokenIndex]) {
                    return;
                }
                var img = images[i];
                if (!out && isVisible(img)) {
                    anyFound = true;
                    fillImage(img);
                } else {

                    if (anyFound) {
                        out = true;
                    }
                    remaining.push(img);
                }
            }

            images = remaining;

            if (!images.length) {
                document.removeEventListener('focus', unveil, true);
                document.removeEventListener('scroll', unveil, true);
                document.removeEventListener(wheelEvent, unveil, true);
                window.removeEventListener('resize', unveil, true);
            }
        }

        function unveil() {

            cancelAll(cancellationTokens);

            var index = cancellationTokens.length;
            cancellationTokens.length++;

            setTimeout(function () {
                unveilInternal(index);
            }, 1);
        }

        document.addEventListener('scroll', unveil, true);
        document.addEventListener('focus', unveil, true);
        document.addEventListener(wheelEvent, unveil, true);
        window.addEventListener('resize', unveil, true);

        unveil();
    }

    function lazyChildren(elem) {

        unveilElements(elem.getElementsByClassName('lazy'));
    }


    renderBlog();

})();