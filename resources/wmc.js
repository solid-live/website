(function () {

    jQuery(function () {

        jQuery.get("http://mb3admin.com/admin/service/package/latestVersion?package=MBClassic&class=Release", function (data) {
            jQuery('.stableVersion').html(data);
        });

        jQuery.get("http://mb3admin.com/admin/service/package/latestVersion?package=MBClassic&class=Beta", function (data) {
            jQuery('.betaVersion').html(data);
        });
    });

})();