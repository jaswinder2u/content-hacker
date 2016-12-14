function clearCookies()
{
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}

function getURLParameter(name)
{
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function authorizeUser()
{
    clearCookies();
    
    var username = getURLParameter("username");
    var userFullName = getURLParameter("fullname");
    var destURL = getURLParameter("destination");
    
    document.cookie = "username="+username;
    document.cookie = "userFullName="+userFullName;
    window.location = destURL;
}
