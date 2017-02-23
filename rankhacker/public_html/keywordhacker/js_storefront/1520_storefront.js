var restURL = "https://www.rankhacker.com/rest2.0/kh_endpoint.jsp?"
var rhURL = "https://www.rankhacker.com/rhstorefront_v2/";
/*var restURL = "http://localhost:8084/rest2.0/kh_endpoint.jsp?"
var rhURL = "http://localhost:8383/rankhacker/";*/

function newTyped(){ /* A new typed object */ }

function foo(){ /*console.log("Callback");*/ }

function getURLParameter(name)
{
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function registerAction(e)
{
    var e = e || window.event;
    
    if(e.keyCode == 13)
    {
        loginAccount();
    }
}

function registerAuthenticatedAction(e)
{
    var e = e || window.event;
    
    if(e.keyCode == 13)
    {
        loginAccount();
    }
}

function clearCookies()
{
    //document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    //console.log(document.cookie);
}

function getCookie(paramName)
{
    var name = paramName + "=";
    var ca = document.cookie.split('; ');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function loginAccount()
{
    clearCookies();
    
    var email = $('#user-email').val().trim();
    var password = $('#user-password').val().trim();

    if(email == '' || email.indexOf("@") == -1)
    {
        $("#login-response").addClass("error-text");
        $("#login-response").html("Error: Please provide a valid email address.");
    }
    else if(password == '')
    {
        $("#login-response").addClass("error-text");
        $("#login-response").html("Error: Please enter your password.");
    }
    else
    {
        //Show the spinner
        $("#login-response").removeClass("error-text");
        $("#login-response").html("<div><img src='keywordhacker/images/apple_spinner.gif' class='apple-spinner-small'/></div>");
        
        $.ajax({url: restURL, data: {'command':'loginAccount','username':email,'password':password}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    document.cookie = "username="+email;
                    document.cookie = "userFullName="+info.userfullname;
                    window.location = "keywordhacker/dashboard.html";
                }
                else if(info.status == "error")
                {
                    $("#login-response").addClass("error-text");
                    $("#login-response").html(info.message);
                }
            }
        });
    }
}

function remindPassword()
{
    var email = $('#user-email').val();
    if(email.trim() == '')
    {
        $("#login-response").addClass("error-text");
        $("#login-response").html("Error: Please provide a valid email address.");
    }
    else
    {
        //Show the spinner
        $("#login-response").removeClass("error-text");
        $("#login-response").html("<div><img src='keywordhacker/images/apple_spinner.gif' class='apple-spinner-small'/></div>");
        
        $.ajax({url: restURL, data: {'command':'remindPassword','username':email}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    $("#login-response").addClass("error-text");
                    $("#login-response").html("Please check your email for a message from Rank Hacker Admin containing a new password for your account.");
                }
                else if(info.status == "error")
                {
                    $("#login-response").addClass("error-text");
                    $("#login-response").html("Error: We were unable to find an account under that email address.");
                }
            }
        });
    }
}

function registerUser(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    
    clearCookies();
    
    var email = $('#user-email').val();
    if(email.trim() == '')
    {
        $("#login-response").addClass("error-text");
        $("#login-response").html("Error: Please provide a valid email address.");
    }
    else
    {
        //Show the spinner
        $("#login-response").removeClass("error-text");
        $("#login-response").html("<div><img src='images/apple_spinner.gif' class='apple-spinner-small'/></div>");
        
        $.ajax({url: restURL, data: {'command':'registerUser','username':email}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    //Redirect the user to the verify.html page
                    document.cookie = "username="+email;
                    window.location = "verify.html";
                }
                else if(info.status == "error")
                {
                    $("#login-response").addClass("error-text");
                    $("#login-response").html("Error: It looks like that email address has already been registered.<br>Please use the login link at the bottom right to access your dashboard.");
                }
            }
        });
    }
}

function authenticateToken()
{
    clearCookies();
    
    var email = getURLParameter("email");
    var token = getURLParameter("token");
    setTimeout(function(){
        $.ajax({url: restURL, data: {'command':'authenticateToken','email':email,'token':token}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        document.cookie = "username="+email;
                        $("#rank-heading-response-message").removeClass("rank-heading-red");
                        $("#rank-heading-response-message").addClass("rank-heading");
                        $("#typed1").hide();
                        $("#typed2").show();
                        $("#typed3").hide();
                        $("#checking-message").hide();
                        $("#validated-message").show();
                        /*setTimeout(function(){
                            window.location = "login.html";
                        },3500);*/
                    }
                    else if(info.status == "error")
                    {
                        $("#rank-heading-response-message").removeClass("rank-heading");
                        $("#rank-heading-response-message").removeClass("rank-heading");
                        $("#rank-heading-response-message").addClass("rank-heading");
                        $("#rank-heading-response-message").addClass("rank-heading-red");
                        $("#typed1").hide();
                        $("#typed2").hide();
                        $("#typed3").show();
                        $("#typed-strings").html("");
                    }
                }
            });
    },2500);
}

function resendVerification(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    var email = getURLParameter("email");
    
    if(email != '')
    {    
        $.ajax({url: restURL, data: {'command':'resendUserVerification','email':email}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    //showAlert("A new verification email has been sent. Please check your email.");
                    $("#login-response").addClass("error-text");
                    $("#login-response").html("A new verification email has been sent. Please check your email.");
                }
            }
        });
    }
    else
    {
        //showAlert("Error: We were unable to re-send your verification email.")
        $("#login-response").addClass("error-text");
        $("#login-response").html("Error: We were unable to re-send your verification email.");
    }
}

function loginAuthenticatedAccount(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    
    var email = getURLParameter("email");
    var firstName = $("#user-first-name").val();
    var lastName = $("#user-last-name").val();
    var password = $("#user-password").val();
    
    if(firstName != '' && lastName != '' && password != '')
    {    
        //Show the spinner
        $("#login-response").removeClass("error-text");
        $("#login-response").html("<div><img src='keywordhacker/images/apple_spinner.gif' class='apple-spinner-small'/></div>");
        
        $.ajax({url: restURL, data: {'command':'loginAuthenticatedAccount','email':email,'firstname':firstName,'lastname':lastName,'password':password}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    clearCookies();
                    document.cookie = "username="+email;
                    document.cookie = "userFullName="+info.userfullname;
                    window.location = "keywordhacker/projectwizard.html?pid=0";
                }
                else
                {
                    var message = info.message;
                    $("#login-response").addClass("error-text");
                    $("#login-response").html(message);
                }
            }
        });
    }
    else
    {
        //showAlert("Error: We were unable to re-send your verification email.")
        $("#login-response").addClass("error-text");
        $("#login-response").html("Please provide a your name and a password to continue.");
    }
}