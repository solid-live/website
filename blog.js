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

    function renderBlog() {

        loadBlogData().then(function (xml) {

            var div = document.createElement('div');
            div.innerHTML = xml;

            var items = div.querySelectorAll('item');
            alert(items.length);

        });
    }

    renderBlog();

})();