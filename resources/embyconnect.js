var ipsmbUser;

jQuery(document).ready(function($) {

    //get current logged in user
    $.ajaxSetup({
       headers : {   
       'X-Connect-Token' : 'CONNECT-GETUSER'
       }
    });
	
	$.getJSON("https://emby.media/service/getsignedinuser.php").done(function(user) {
         ipsmbUser = user;
		 
		 if (user && user.Id > 0) {
           $('#loggedinuser').html(user.DisplayName);
           if (user.ImageUrl) $('#userimage').attr('src',user.ImageUrl);
           $('.loggedin').show();
         } else {
		 
           $('.notloggedin').show();
         }
    }).fail(function() {
         $('.notloggedin').show();
    });

    $('#confirmForm').on('submit', function() {
        var pin = $('#pin').val();
        if (ipsmbUser && ipsmbUser.Id > 0) {
           // we have user - confirm the pin
           confirm(ipsmbUser.Id, pin, $);
        } else {
           var username = $('#username').val();
           var pw = CryptoJS.MD5(MediaBrowser.ConnectService.cleanPassword($('#pw').val()));
           $.post("https://connect.emby.media/service/user/authenticate?nameOrEmail="+username+"&password="+pw).done(function(json) {
               var result= $.parseJSON(json);
               console.log(result);
               var user = result.User;
               if (user && user.Id > 0) {
                   confirm(user.Id, pin, $);
               } else { $('#msg').html("Invalid User Name or Password.  Do you need to register?"); }
            }).fail(function(result) { $('#msg').html("Invalid User Name or Password.  Do you need to register?"); });
        } 

        return false;
     }); 

    $('.notimplemented').click(function() {
        $('#msg').html("Coming Soon");
    });
});

function confirm(userId, pin, $) {
           $.post("https://connect.emby.media/service/pin/confirm?pin="+pin+"&userId="+userId).done(function() { $('#msg').html("Pin Confirmed.  Thank you."); }).fail(function(result) { $('#msg').html("Confirm Failed. Please ensure the pin is correct.  You may need to generate another one if it has been several minutes."); });
}

(function (globalScope) {

    if (!globalScope.MediaBrowser) {
        globalScope.MediaBrowser = {};
    }

    function replaceAll(str, find, replace) {

        return str.split(find).join(replace);
    }

    var connectService = {

        cleanPassword: function (password) {

            password = password || '';

            password = replaceAll(password, "&", "&amp;");
            password = replaceAll(password, "/", "&#092;");
            password = replaceAll(password, "!", "&#33;");
            password = replaceAll(password, "$", "&#036;");
            password = replaceAll(password, "\"", "&quot;");
            password = replaceAll(password, "<", "&lt;");
            password = replaceAll(password, ">", "&gt;");
            password = replaceAll(password, "'", "&#39;");

            return password;
        }

    };

    globalScope.MediaBrowser.ConnectService = connectService;

})(window);
