(function () {

    function loadBlogData() {

        return new Promise(function (resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', "blog.xml", true);

            xhr.onload = function (e) {

                if (this.status < 400) {

                    var handler = new htmlparser.RssHandler(function (error, dom) {
                        if (error) {
                            reject();
                        } else {
                            resolve();
                        }
                    });

                    var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
                    parser.parseComplete(this.response);
                    alert(JSON.stringify(handler.dom, null, 2));

                } else {
                    reject();
                }
            };

            xhr.onerror = reject;

            xhr.send();
        });
    }

    function renderBlog() {

        loadBlogData().then(function () {


        });
    }

    renderBlog();

})();