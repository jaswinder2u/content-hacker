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
    //Check for local storage compatibility
    if(typeof Storage !== "undefined")
    {
        
    }
    else
    {
        // Sorry! No Web Storage support...
        showAlert("This application requires an HTML5-compliant browser such as the latest version of Google Chrome, Firefox, Safari or Microsoft Edge. Please upgrade your browser before attempting to log in.");
    }
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

function saveToLocalStorage(reference,value)
{
    if(typeof Storage !== "undefined")
    {
        localStorage.removeItem(reference);
        localStorage.setItem(reference,value);
    }
    else
    {
        // Sorry! No Web Storage support...
        showAlert("This application requires an HTML5-compliant browser such as the latest version of Google Chrome, Firefox, Safari or Microsoft Edge. Please upgrade your browser before attempting to log in.");
    }
}

function retrieveLocalStorage(reference)
{
    var data = "";
    if(typeof Storage !== "undefined")
    {
        data = localStorage.getItem(reference);
    }
    else
    {
        // Sorry! No Web Storage support..
        showAlert("This application requires an HTML5-compliant browser such as the latest version of Google Chrome, Firefox, Safari or Microsoft Edge. Please upgrade your browser before attempting to log in.");
    }
    
    return data;
}

function hideAlert()
{
    document.getElementById("dimmer").style.display = "none";
    document.getElementById("alert-window").style.display = "none";
}

function showAlert(msgContent)
{
    /*$('#alert-msg-body').addClass("red-text");*/
    $('#alert-msg-body').html(msgContent);
    document.getElementById("alert-window").style.display = "block";
    document.getElementById("dimmer").style.display = "block";
}

function loginAccount(e)
{
    var e = e || window.event;
    e.preventDefault();
    
    clearCookies();
    
    var email = $('#user-email').val().trim();
    var password = $('#user-password').val().trim();

    $("#user-email").removeClass("input-error");
    $("#user-password").removeClass("input-error");

    if(email == '' || email.indexOf("@") == -1)
    {
        $("#login-response").html("PLEASE PROVIDE A VALID EMAIL ADDRESS.");
        $("#user-email").addClass("input-error");
        $("#login-response").show();
    }
    else if(password == '')
    {
        $("#login-response").html("PLEASE ENTER YOUR PASSWORD.");
        $("#user-password").addClass("input-error");
        $("#login-response").show();
    }
    else
    {
        //Show the spinner
        $("#login-button").html("<div><img src='keywordhacker/images/apple_spinner.gif' class='apple-spinner-small'/></div>");
        $("#user-email").removeClass("input-error");
        $("#user-password").removeClass("input-error");
        $("#login-response").html("");
        $("#login-response").hide();
        
        $.ajax({url: restURL, data: {'command':'loginAccount','username':email,'password':password}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);
                
                if(info.status == "success")
                {
                    var users = info.users;
                    var userInfo = users[0];
                    
                    document.cookie = "username="+email;
                    document.cookie = "userFullName="+userInfo.userfullname;
                    document.cookie = "cbCustomerID="+userInfo.cbCustomerID;

                    saveToLocalStorage("userInfo",returnData);
                    /*document.cookie = "firstName="+info.firstName;
                    document.cookie = "lastName="+info.lastName;
                    document.cookie = "accessPlan="+info.accessPlan;
                    document.cookie = "whiteLabelAccess="+info.whiteLabelAccess;
                    document.cookie = "maxContentReveals="+info.maxContentReveals;
                    document.cookie = "usedContentReveals="+info.usedContentReveals;
                    document.cookie = "maxMissions="+info.maxMissions;
                    document.cookie = "usedMissions="+info.usedMissions;
                    document.cookie = "maxKeywords="+info.maxKeywords;
                    document.cookie = "usedKeywords="+info.usedKeywords;
                    document.cookie = "planUpdateTS="+info.planUpdateTS;*/
                    window.location = "keywordhacker/dashboard.html";
                }
                else if(info.status == "error")
                {
                    var response = info.message;
                    response = response.toUpperCase();
                    
                    $("#login-response").html(response);
                    $("#login-response").show();
                    $("#login-button").html("SUBMIT LOGIN");
                }
            }
        });
    }
}

function remindPassword(type)
{
    var email = $('#recovery-email').val();
    if(email.trim() == '')
    {
        $("#recovery-message").removeClass("rh-blue-text").addClass("rh-error-text");
        $("#recovery-message").html("THE EMAIL ADDRESS YOU ENTERED IS NOT ON FILE.<BR>PLEASE ENTER A VALID EMAIL ADDRESS.");
        $("#recovery-email").addClass("input-error");
    }
    else
    {
        //Show the spinner
        $("#recovery-message").removeClass("rh-error-text").addClass("rh-blue-text");
        $("#remind-button").html("<div><img src='keywordhacker/images/apple_spinner.gif' class='apple-spinner-small'/></div>");
        $("#recovery-email").removeClass("input-error");
        
        
        $.ajax({url: restURL, data: {'command':'remindPassword','username':email}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    $("#confirmation-email").html(email);
                    $("#password-recovery").hide();
                    if(type == "resend")
                    {
                        $("#reset-response").html("Another verification email is being sent to<span class=\"rh-email-address\" id=\"confirmation-email\">"+email+"</span>");
                    }
                    else
                    {
                        $("#reset-response").html("A verification email is being sent to<span class=\"rh-email-address\" id=\"confirmation-email\">"+email+"</span>");
                    }
                    $("#reset-sent").show();
                    
                    
                }
                else if(info.status == "error")
                {
                    $("#recovery-message").removeClass("rh-blue-text").addClass("rh-error-text");
                    $("#recovery-message").html("WE WERE UNABLE TO FIND THAT EMAIL ADDRESS IN OUR SYSTEM.");
                    $("#recovery-email").addClass("input-error");
                    $("#remind-button").html("SEND PASSWORD");
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
    
    $("#user-email").html(email);
    
    $.ajax({url: restURL, data: {'command':'authenticateToken','email':email,'token':token}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    document.cookie = "username="+email;
                    $("#leader-text").html("CREATE PASSWORD FOR");
                    $("#login-response").hide();
                    $("#rh-form-box2").show();
                }
                else if(info.status == "error")
                {
                    $("#leader-text").html("UNABLE TO VALIDATE");
                    $("#login-response").show();
                    $("#rh-form-box2").hide();
                }
            }
        });
    
}

function resendVerification(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    //var email = getURLParameter("email");
    var email = getCookie("username");
    
    if(email != '')
    {    
        $.ajax({url: restURL, data: {'command':'resendUserVerification','email':email}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    window.location = "verify.html";
                    /*$("#login-response").addClass("error-text");
                    $("#login-response").html("A new verification email has been sent. Please check your email.");*/
                }
            }
        });
    }
    else
    {
        showAlert("We were unable to re-send your verification email. Please contact hq@rankhacker.com for further assistance.");
    }
}

function retryAuthenticate(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    var email = getURLParameter("email");
    if(email != '' && email != 'null' && email != null)
    {    
        $.ajax({url: restURL, data: {'command':'resendUserVerification','email':email}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    window.location = "keywordhacker/verify.html";
                    /*$("#login-response").addClass("error-text");
                    $("#login-response").html("A new verification email has been sent. Please check your email.");*/
                }
            }
        });
    }
    else
    {
        showAlert("We were unable to re-send your verification email. Please contact hq@rankhacker.com for further assistance.");
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
        $("#login-button").html("<div><img src='keywordhacker/images/apple_spinner.gif' class='apple-spinner-small'/></div>");
        
        $.ajax({url: restURL, data: {'command':'loginAuthenticatedAccount','email':email,'firstname':firstName,'lastname':lastName,'password':password}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    clearCookies();
                    
                    var users = info.users;
                    var userInfo = users[0];
                    
                    document.cookie = "username="+email;
                    document.cookie = "userFullName="+userInfo.userfullname;
                    window.location = "keywordhacker/dashboard.html?new=y";
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
        $("#login-response").html("Please provide your name and a password to continue.");
    }
}

function registerUser1(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    
    clearCookies();
    
    var email = $('#user-email-1').val();
    if(email.trim() == '')
    {
        //$("#user-email-1").css("color","#ec1c24");
        $("#user-email-1").addClass("input-error");
        $("#user-email-1").attr("placeholder","Error: Please provide a valid email address.");
    }
    else
    {
        //Show the spinner
        //$("#user-email-1").css("color","#999999");
        $("#user-email-1").removeClass("input-error");
        $("#get-verified-button-text").html("<img src='images/apple_spinner.gif' class='apple-spinner-small'/>");
        
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
                    $("#get-verified-button-text").html("GET VERIFIED");
                    $("#user-email-1").val("");
                    //$("#user-email-1").css("color","#ec1c24");
                    $("#user-email-1").addClass("input-error");
                    $("#user-email-1").attr("placeholder","Oops, "+email+" has already been registered. Please login at top.");
                }
            }
        });
    }
}

function registerUser2(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    
    clearCookies();
    
    var email = $('#user-email-2').val();
    if(email.trim() == '')
    {
        //$("#user-email-2").css("color","#ec1c24");
        $("#user-email-2").addClass("input-error");
        $("#user-email-2").attr("placeholder","Error: Please provide a valid email address.");
    }
    else
    {
        //Show the spinner
        //$("#user-email-2").css("color","#999999");
        $("#user-email-2").removeClass("input-error");
        $("#try-it-for-free-button-text").html("<img src='images/apple_spinner.gif' class='apple-spinner-small'/>");
        
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
                    $("#try-it-for-free-button-text").html("TRY IT FOR FREE");
                    $("#user-email-2").val("");
                    //$("#user-email-2").css("color","#ec1c24");
                    $("#user-email-2").addClass("input-error");
                    $("#user-email-2").attr("placeholder","Oops, "+email+" has already been registered. Please login at top.");
                }
            }
        });
    }
}

function showRemindPassword()
{
    $("#login-form").hide();
    $("#password-recovery").show();
}

function setVerifyFields()
{
    var username = getCookie("username");
    $("#user-email").html(username);
}

function hidePlaceholder(elementID)
{
    $("#"+elementID).prop("placeholder","");
}

function showPlaceholder(elementID,text)
{
    var currVal = $("#"+elementID).val();
    if(currVal.trim() == "")
    {
        $("#"+elementID).prop("placeholder",text);
    }
}