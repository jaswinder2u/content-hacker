var restURL = "https://www.rankhacker.com/rest2.0/kh_endpoint.jsp?"
var rhURL = "https://www.rankhacker.com/rhstorefront_v2/";
/*var restURL = "http://localhost:8084/rest2.0/kh_endpoint.jsp?"
var rhURL = "http://localhost:8383/rankhacker/";*/

//var maxProjects = 3;
var maxKeywordsPerProject = 25;
var currUser = getCookie("username");
if(currUser != "")
{
    if(currUser.includes("fairmarketing.com"))
    {
        maxKeywordsPerProject = 10000;
    }
}
//var maxDeletedKeywords = 50;

$(".show-more a").each(function() {
    var $link = $(this);
    var $content = $link.parent().prev("div.text-content");

    var visibleHeight = $content[0].clientHeight;
    var actualHide = $content[0].scrollHeight - 1;

    if (actualHide > visibleHeight) {
        $link.show();
    } else {
        $link.hide();
    }
});

$(".show-more a").on("click", function() {
    var $link = $(this);
    var $content = $link.parent().prev("div.text-content");
    var linkText = $link.text();

    $content.toggleClass("short-text, full-text");

    $link.text(getShowLinkText(linkText));

    return false;
});


var desc = false;

var sort_by = function(field, reverse, primer){
   var key = function (x) {return primer ? primer(x[field]) : x[field]};
   
   return function (a,b) {
	  var A = key(a), B = key(b);
	  return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];
   }
}

var keywords_sort_by = function(field, reverse, primer){
   var key = function (x) {return primer ? primer(x[field]) : x[field]};
   //var key2 = function (x) {return primer ? primer(x["active"]) : x["active"]};
   var key2 = function(x2) {return x2["active"];}

   return function (a,b) {
	  var A = key(a), B = key(b);
          var A2 = key2(a), B2 = key2(b);
	  //return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];
          if(A2 < B2) return -1 * [-1,1][+!!false];
          if(A2 > B2) return 1 * [-1,1][+!!false];
          if(A < B) return -1 * [-1,1][+!!reverse];
          if(A > B) return 1 * [-1,1][+!!reverse];
          return 0 * [-1,1][+!!reverse];
   }
}

function callbackData(jsonData)
{
    return jsonData;
}

function date_sort_asc(a, b) {
    return new Date(a.runDateRaw).getTime() - new Date(b.runDateRaw).getTime();
}

function date_sort_desc(a, b) {
    return new Date(b.runDateRaw).getTime() - new Date(a.runDateRaw).getTime();
}

function getURLParameter(name)
{
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

function logout(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    
    //Expire the cookies
    clearCookies();
    /*document.cookie = 'session_id=';
    document.cookie = 'project_id=';
    document.cookie = 'username=';
    document.cookie = "userFullName=";
    document.cookie = 'email=';*/
    
    window.location = "../login.html";
}

/*function loginAccount()
{
    var email = $('#user-email').val().trim();
    var password = $('#user-password').val().trim();

    if(email == '' || email.indexOf("@") == -1)
    {
        $("#login-response").html("Error: Please provide a valid email address.");
    }
    else if(password == '')
    {
        $("#login-response").html("Error: Please enter your password.");
    }
    else
    {
        //Show the spinner
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
                    $("#login-response").html(info.message);
                }
            }
        });
    }
}*/

/*function hideLogin()
{
    document.getElementById("dimmer").style.display = "none";
    document.getElementById("login-window").style.display = "none";
}

function showLogin()
{
    document.getElementById("login-window").style.display = "block";
    document.getElementById("dimmer").style.display = "block";
}*/

function hideAlert()
{
    document.getElementById("dimmer").style.display = "none";
    document.getElementById("alert-window").style.display = "none";
}

function showAlert(msgContent)
{
    $('#alert-msg-body').addClass("red-text");
    $('#alert-msg-body').html(msgContent);
    document.getElementById("alert-window").style.display = "block";
    document.getElementById("dimmer").style.display = "block";
}

function remindPassword()
{
    var email = $('#user-email').val();
    
    if(email.trim() == '')
    {
        $("#login-response").html("Error: Please provide a valid email address.");
    }
    else
    {
        //Show the spinner
        $("#login-response").html("<div><img src='images/apple_spinner.gif' class='apple-spinner-small'/></div>");
        
        $.ajax({url: restURL, data: {'command':'remindPassword','username':email}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    $("#login-response").html("Please check your email for a message from Rank Hacker Admin containing a new password for your account.");
                }
                else if(info.status == "error")
                {
                    $("#login-response").html("Error: We were unable to find an account under that email address.");
                }
            }
        });
    }
}

function getSessionID(callback)
{
    var sessionID = getCookie("session_id");
    if(sessionID == '' || sessionID == null)
    {
        $.ajax({url: restURL, data: {'command':'getSession'}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    sessionID = info.sessionid;
                    callback(sessionID);
                }
            }
        });
    }
    else
    {
        callback(sessionID);
    }
    
}

function createKeywordHackerProject(e,id)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    
    var projectID = getURLParameter("pid");
    
    var projectURL = $('#project-url').val();
    var projectLocation = $('#project-location').val();
    var currentKeywordCount = parseInt($('#keyword-count').val());
    //var eCommerce = $('#e-commerce-selection').val();
    var industry = $('#industry-selection').val();
    
    var useGoogle;
    var useBing;
    var useYouTube;
    var useAppStore;
    var useLocal;
    var useRegional;
    var useNational;

    if($('#use-google').is(':checked'))
    {
        useGoogle = 1;
    }
    else
    {
        useGoogle = 0;
    }

    if($('#use-bing').is(':checked'))
    {
        useBing = 1;
    }
    else
    {
        useBing = 0;
    }

    if($('#use-you-tube').is(':checked'))
    {
        useYouTube = 1;
    }
    else
    {
        useYouTube = 0;
    }

    if($('#use-app-store').is(':checked'))
    {
        useAppStore = 1;
    }
    else
    {
        useAppStore = 0;
    }
    
    if($('#local-national').val() == "local")
    {
        useLocal = 1;
        useRegional = 0;
        useNational = 0;
    }
    else if($('#local-national').val() == "regional")
    {
        useLocal = 0;
        useRegional = 1;
        useNational = 0;
    }
    else
    {
        useLocal = 0;
        useRegional = 0;
        useNational = 1;
    }
    
    /*if($('#use-local').is(':checked'))
    {
        useLocal = 1;
    }
    else
    {
        useLocal = 0;
    }
    
    if($('#use-national').is(':checked'))
    {
        useNational = 1;
    }
    else
    {
        useNational = 0;
    }*/
    
    var username = getCookie("username");

    if(username == "")
    {
        window.location = 'index.html';
    }
    else if((id == "2") && projectID == "0" && projectURL.trim() == '')
    {
        showAlert("Please enter the project URL.");
    }
    else if((id == "2") && projectID == "0" && projectLocation.trim() == '')
    {
        showAlert("Please enter the project location.");
    }
    else if((id == "2") && projectID == "0" && currentKeywordCount == 0)
    {
        showAlert("Please enter at least one keyword phrase.");
    }
    else if((id == "1") && projectID == "0" && currentKeywordCount == 0)
    {
        showAlert("Please enter at least one keyword phrase.");
    }
    else if((id == "2") && ($('#ex6SliderVal').val() == 0 || $('#ex7SliderVal').val() == 0 || $('#ex9SliderVal').val() == 0))
    {
        showAlert("Please enter a value for monthly visitors, paying customers and content costs in order to hack actual net-worth.");
    }
    else
    {
        //Show the spinner
        //$("#submit-button-block-"+id).html("<div class='three-quarters-loader-small' style='float:right;margin-right:60px;'></div>");
        $("#submit-button-block-"+id).html("<div><img src='images/apple_spinner.gif' class='apple-spinner-small'/></div>");
        //$("#submit-button-block-2").html("<div class='three-quarters-loader-small' style='float:right;margin-right:60px;'></div>");
        //projectURL = encodeURI(projectURL);
        
        //Build the keywords list
        var keywordsList = "";
        for(var i=1; i<=currentKeywordCount; i++)
        {
            var keywordString = $('#keyword'+i).html();
            var keywordEndLoc = keywordString.indexOf("<span");
            var keyword = keywordString.substring(0,keywordEndLoc);
            if(keywordsList == "")
            {
                //keywordsList = i+"="+keyword;
                keywordsList = keyword;
            }
            else
            {
                //keywordsList += ";"+i+"="+keyword;
                keywordsList += ";"+keyword;
            }
        }
        //keywordsList = encodeURI(keywordsList);
        
        var monthlyVisitors = $('#ex6SliderVal').val();
        var payingCustomers = $('#ex7SliderVal').val();
        var customerValue = $('#ex8SliderVal').val();
        var costPerLevel = $('#ex9SliderVal').val();
        
        var useDefaultConvRate = 0;
        if(id == "1")
        {
            useDefaultConvRate = 1;
        }
        
        if(projectID == "0")
        {
            //Once you have required info, create the project
            $.ajax({url: restURL, data: {'command':'createKHProject','username':username,'projectURL':projectURL,'usedefaultconvrate':useDefaultConvRate,'projectLocation':projectLocation,'keywords':keywordsList,'monthlyVisitors':monthlyVisitors,'payingCustomers':payingCustomers,'customerValue':customerValue,'costPerLevel':costPerLevel,'useGoogle':useGoogle,'useBing':useBing,'useYouTube':useYouTube,'useAppStore':useAppStore,'useLocal':useLocal,'useRegional':useRegional,'useNational':useNational,'industry':industry}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        //window.location = "dashboard.html";
                        var projectID = info.message;
                        window.location = "keywordhacker.html?pid="+projectID;
                    }
                    else
                    {
                        $("#submit-button-block-1").html("<a class=\"calculate-networth-btn\" onclick=\"createKeywordHackerProject(event,'1');\">CALCULATE ESTIMATED NETWORTH</a>");
                        $("#submit-button-block-2").html("<a class=\"calculate-networth-btn\" onclick=\"createKeywordHackerProject(event,'2');\">CALCULATE ACTUAL NETWORTH</a>");
                        $("#alert-window").removeClass("alert-window");
                        $("#alert-window").addClass("alert-window-large");
                        showAlert(info.message);
                    }
                }
            });
        }
        else
        {
            //We're actually updating the project, not creating a new one
            var useDefaultConvRate = 0;
            if(id == "1")
            {
                useDefaultConvRate = 1;
            }
            
            $.ajax({url: restURL, data: {'command':'editKHProject','projectid':projectID,'usedefaultconvrate':useDefaultConvRate,'monthlyVisitors':monthlyVisitors,'payingCustomers':payingCustomers,'customerValue':customerValue,'costPerLevel':costPerLevel,'useGoogle':useGoogle,'useBing':useBing,'useYouTube':useYouTube,'useAppStore':useAppStore,'useLocal':useLocal,'useRegional':useRegional,'useNational':useNational,'industry':industry}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        window.location = "keywordhacker.html?pid="+projectID;
                    }
                }
            });
            
        }
    }
}

function loadProjectDashboard(flip)
{
    var username = getCookie("username");
    if(username != '')
    {
        if(username == "hari.patel@1520holdings.com")
        {
            username = "admin@fairmarketing.com";
        }
        
        $.ajax({url: restURL, data: {'command':'getProjectDashboardData','username':username}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    //Save this to local storage so that it can be used to populate the HTML using any sort method
                    $('#json').val(returnData);
                    var sortMethod = $('#curr_sort').val();
                    //var reversed = $('#curr_sort_reversed').val();
                    
                    //$('#curr_sort').val("runDate");
                    //$('#curr_sort_reversed').val("false");
                    
                    var userFullName = info.userFullName;
                    var userLastName = userFullName.substring(userFullName.indexOf(" ")+1,userFullName.length);
                    /*if(userLastName == '')
                    {
                        userLastName = "Anderson";
                    }*/
                    
                    //Set the welcome message
                    $('#dashboard-user-full-name').html("welcome <strong>AGENT "+userLastName.toUpperCase()+"</strong> <strong>[</strong> manage your missions below <strong>]</strong>");
                    
                    //Populate the cards based on a default sort of create date
                    displayDashboardCards(sortMethod,flip);
                }
            }
        });
        
        //Show the manageIndustries link for admin
        if(username !== 'admin@fairmarketing.com' && $('#industry-link').length)
        {
            $('#industry-link').remove();
            $('#users-link').remove();
        }
        
        refreshCartDropdown();
    }
    else
    {
        window.location = "../index.html";
    }
}

 function displayDashboardCards(sortMethod,flip,filterString)
{
    var returnData = $('#json').val();
    
    var currSortMethod = $('#curr_sort').val();
    var sortMethodReversed = $('#curr_sort_reversed').val();
    
    var reversed;
    
    var info = JSON.parse(returnData);
    var data = info.data;
    
    
    if(sortMethod == 'runDate')
    {
        if(sortMethod == currSortMethod)
        {
            if(sortMethodReversed == "true" && flip)
            {
                reversed = false;
                data.sort(date_sort_asc);
            }
            else
            {
                reversed = true;
                data.sort(date_sort_desc);
            }
        }
    }
    else if(sortMethod == 'project')
    {
        if(sortMethod == currSortMethod)
        {
            if(sortMethodReversed == "true" && flip)
            {
                reversed = false;
            }
            else
            {
                reversed = true;
            }
        }
        data.sort(sort_by('projectID', reversed, parseInt));
    }
    else if(sortMethod == 'status')
    {
        if(sortMethod == currSortMethod)
        {
            if(sortMethodReversed == "true" && flip)
            {
                reversed = false;
            }
            else
            {
                reversed = true;
            }
        }
        data.sort(sort_by('completed', reversed, parseInt));
    }
    
    //Save the new sort method and reversed status (but only if we're not filtering!)
    var useFilter = false;
    if(typeof filterString !== 'undefined' && filterString !== '')
    {
        useFilter = true;
    }
    else
    {
        $('#curr_sort').val(sortMethod);
        $('#curr_sort_reversed').val(reversed);        
    }
    
    
    
    var finalOutput = "";
    var cardHTML = "";
    
    var canCreate = info.canCreate;
    
    //var totalProjects = info.totalProjects;
    //if(totalProjects >= maxProjects)
    if(canCreate == "false")
    {
        $("#kh_logo").click(function(){
            $("#activate-new-window").hide();
            $("#alert-window").removeClass("alert-window");
            $("#alert-window").addClass("alert-window-large");
            showAlert("It looks like you've already created the maximum of 3 missions. Please contact RankHacker about subscription options.");});
    }
    else
    {
        $("#kh_logo").click(function(){gotoCreateProject('0');});
    }
    
    var numProjects = info.projectsCount;
    for(var i=0; i<numProjects; i++)
    {
        var entry = info.data[i];

        var projectID = entry.projectID;
        var runDate = entry.runDate;
        var numberOfKeywords = entry.keywordCount;
        var completed = entry.completed;
        var active = entry.active;
        var monthlyVisitors = entry.monthlyVisitors;
        var payingCustomers = entry.payingCustomers;
        var valuePerCustomer = entry.valuePerCustomer;
        var costPerLevel = entry.costPerLevel;
        var totalPowerLevel = entry.totalPowerLevel;
        var incomingTraffic = Math.round(entry.incomingTraffic,0);
        var projectTitle = entry.projectTitle;
        var currencyHexCode = entry.currencyHexCode;
        var completionPercent = entry.completionPercent;
        var storefrontReports = entry.storefrontReports;
        var userMonthlyContent = entry.userMonthlyContent;
        var competitorMonthlyContent = entry.competitorMonthlyContent;
        var useDefaultConversionRate = entry.useDefaultConversionRate;

        var canShow = true;
        if(useFilter && projectTitle.indexOf(filterString) === -1)
        {
            canShow = false;
        }
        
        var customerConversionRate = entry.defaultConversionRate;
        if(monthlyVisitors !== 0 && payingCustomers !== 0 && useDefaultConversionRate !== 1)
        {
            customerConversionRate = (payingCustomers / monthlyVisitors);
        }
        
        /*if(monthlyVisitors == 0)
        {
            monthlyVisitors = 1;
        }*/

        var activeString = "ACTIVE";
        
        var totalContentDiff = (competitorMonthlyContent - userMonthlyContent);
        //var monthlyCustomers = Math.round(incomingTraffic * (payingCustomers / monthlyVisitors),0);
        var monthlyCustomers = Math.round(incomingTraffic * customerConversionRate,0);
        var monthlySales = Math.round(monthlyCustomers * valuePerCustomer,0);
        //var marketingCosts = numberWithCommas(Math.round((totalPowerLevel * costPerLevel),0)) + "/mo.";
        //var costPerMonth = Math.round((totalPowerLevel * costPerLevel),0);
        var marketingCosts = numberWithCommas(Math.round((totalContentDiff * costPerLevel),0)) + "/mo.";
        var costPerMonth = Math.round((totalContentDiff * costPerLevel),0);
        var keywordNetWorth = numberWithCommas(monthlySales - costPerMonth);
        
        var fontSize = "31";
        if((monthlySales - costPerMonth) > 999999 && (monthlySales - costPerMonth) <= 9999999)
        {
            fontSize = "28";
        }
        else if((monthlySales - costPerMonth) > 999999 && (monthlySales - costPerMonth) <= 99999999)
        {
            fontSize = "24";
        }
        else if((monthlySales - costPerMonth) > 99999999 && (monthlySales - costPerMonth) <= 999999999)
        {
            fontSize = "22";
        }
        

        var keywordNetWorthString = "";
        var anchorAhref = "";
        var plSum = "";
        if(completed != 1)
        {
            //keywordNetWorthString = "<span style=\"color:red;display:block;\" class=\"loader__dot\">"+completionPercent+"%&nbsp;data collected</span>";
            keywordNetWorthString = "<span style=\"color:red;display:block;font-size:20px;line-height:20px;vertical-align:middle;text-align:center;padding:5px 0;padding-right:-2px;\" class=\"loader__dot\">gathering intel</span>";
            anchorAhref = "onclick=\"window.location='keywordhacker.html?pid="+projectID+"';\" onmouseover=\"highlightKWHCard('"+projectID+"');\" onmouseout=\"restoreKWHCard('"+projectID+"');\"";
            plSum = "--";
        }
        else
        {
            keywordNetWorthString = currencyHexCode+keywordNetWorth;
            anchorAhref = "onclick=\"window.location='keywordhacker.html?pid="+projectID+"';\" onmouseover=\"highlightKWHCard('"+projectID+"');\" onmouseout=\"restoreKWHCard('"+projectID+"');\"";
            //plSum = totalPowerLevel;
            plSum = totalContentDiff;
        }

        if(active != '1')
        {
            activeString = "INACTIVE";
        }
        
        var rhActive = 1;
        var chActive = 0;
        if(storefrontReports > 0)
        {
            chActive = 1;
        }
        
        var rhHTML = "";
        var chHTML = "";
        
        /*if(rhActive == 1)
        {
            rhHTML += "<a style=\"cursor:pointer;\" "+anchorAhref+" id=\"rh-module-"+projectID+"\" class=\"module-link keyword-hacker-module\">";
            rhHTML += "<img src=\"images/tabDivider.png\" id=\"RHdivider-"+projectID+"\" class=\"rh-folder-tab\">";
            rhHTML += "<h2 class=\"module-heading text-left\">Keyword Hacker Data</h2>";
            rhHTML += "<div class=\"module-detail-section\">";
            rhHTML += "<div class=\"row\">";
            rhHTML += "<div class=\"col-lg-2 project-icon\"><img src=\"images/icon-keyword_hacker.png\" alt=\"Keyword Hacker\" class=\"dashboard-icon\"></div>";
            rhHTML += "<div class=\"col-lg-10 module-details-outer\">";
            rhHTML += "<div class=\"col-lg-6  module-details-left\">";
            rhHTML += "<h2 class=\"module-heading\">Active<br>keywords<span>"+numberOfKeywords+"</span></h2>";
            rhHTML += "<h2 class=\"module-heading\">Content goal<span>"+plSum+"</span></h2>";
            rhHTML += "</div>";
            rhHTML += "<div class=\"col-lg-6 module-details-right\">";
            rhHTML += "<h2 class=\"module-heading\">Keyword net<br>worth<span>"+keywordNetWorthString+"</span></h2>";
            rhHTML += "<h2 class=\"module-heading\">Content costs<span>"+currencyHexCode+marketingCosts+"</span></h2>";
            rhHTML += "</div>";
            rhHTML += "</div>";
            rhHTML += "</div>";
            rhHTML += "</div>";
            rhHTML += "</a>";
        }
        else
        {
            rhHTML += "<a style=\"cursor:default;\" id=\"rh-module-"+projectID+"\" class=\"module-link content-hacker-module\">";
            rhHTML += "<img src=\"images/tabDivider.png\" id=\"RHdivider-"+projectID+"\" class=\"rh-folder-tab\">";
            rhHTML += "<h2 class=\"module-heading text-left\">Content Hacker Data</h2>";
            rhHTML += "<div class=\"module-detail-section\">";
            rhHTML += "<div class=\"row\">";
            rhHTML += "<div class=\"col-lg-12 module-details-outer\">";
            rhHTML += "<h2 class=\"activate-link\" style=\"margin-top:50px;\" onclick=\"gotoCreateProject();\">[ Activate Keyword Hacker Data ]</h2>";
            rhHTML += "</div>";
            rhHTML += "</div>";
            rhHTML += "</div>";
            rhHTML += "</a>";
        }*/
        
        if(rhActive == 1)
        {
            rhHTML += "<a style=\"cursor:pointer;\" "+anchorAhref+" id=\"rh-module-"+projectID+"\" class=\"module-link keyword-hacker-module\">";
            rhHTML += "<img src=\"images/tabDivider.png\" id=\"RHdivider-"+projectID+"\" class=\"rh-folder-tab\">";
            rhHTML += "<h2 class=\"module-heading text-left\">Keyword Hacker Data</h2>";
            rhHTML += "<div class=\"module-detail-section\">";
            rhHTML += "<div class=\"col-sm-2 project-icon text-center \"><img src=\"images/icon-keyword_hacker.png\" alt=\"Keyword Hacker\" class=\"dashboard-icon\"></div>";
            rhHTML += "<div class=\"col-sm-10 module-details-outer\">";

            //rhHTML += "<div class=\"module-details-right\">";
            //rhHTML += "<h2 class=\"module-heading\">Active<br>keywords<span>"+numberOfKeywords+"</span></h2>";
            //rhHTML += "<h2 class=\"module-heading\">Content goal<span>"+plSum+"</span></h2>";
            //rhHTML += "</div>";
            //rhHTML += "<div class=\"module-details-center\">";
            //rhHTML += "<h2 class=\"module-heading\"><span><img src=\"images/header_arrow.png\" class=\"dashboard-card-arrow-1\"></span></h2>";
            //rhHTML += "<h2 class=\"module-heading\"><span><img src=\"images/header_arrow.png\" class=\"dashboard-card-arrow-2\"></span></h2>";
            //rhHTML += "</div>";
            //rhHTML += "<div class=\"module-details-left\">";
            //rhHTML += "<h2 class=\"module-heading\" style=\"font-size:11px;padding-bottom:5px;\">Keyword networth<div style=\"font-size:"+fontSize+"px;\">"+keywordNetWorthString+"</div></h2>";
            //rhHTML += "<h2 class=\"module-heading\">Content costs<span>"+currencyHexCode+marketingCosts+"</span></h2>";
            //rhHTML += "</div>";
 
            rhHTML += "<div class=\"module-details-inner\">";
            rhHTML += "<div class=\"module-details-right\">";
            rhHTML += "<h2 class=\"module-heading\">Active<br>keywords<span>"+numberOfKeywords+"</span></h2>";
            rhHTML += "</div>";
            rhHTML += "<div class=\"module-details-center\">";
            rhHTML += "<h2 class=\"module-heading\"><span><img src=\"images/header_arrow.png\" class=\"dashboard-card-arrow-1\"></span></h2>";
            rhHTML += "</div>";
            rhHTML += "<div class=\"module-details-left\">";
            rhHTML += "<h2 class=\"module-heading \" style=\"font-size:14px;padding-bottom:5px;\">Keyword<br/>networth<span class=\"keyword_networth_count\"  style=\"text-align:left;\">"+keywordNetWorthString+"</span></h2>";
            rhHTML += "</div>";
            rhHTML += "</div>";

            rhHTML += "<div class=\"module-details-inner\">";
            rhHTML += "<div class=\"module-details-right\">";
            rhHTML += "<h2 class=\"module-heading\">Content<br/>goal<span>"+plSum+"</span></h2>";
            rhHTML += "</div>";
            rhHTML += "<div class=\"module-details-center\">";
            rhHTML += "<h2 class=\"module-heading\"><span><img src=\"images/header_arrow.png\" class=\"dashboard-card-arrow-2\"></span></h2>";
            rhHTML += "</div>";
            rhHTML += "<div class=\"module-details-left\">";
            rhHTML += "<h2 class=\"module-heading\">Content<br/>costs<span style=\"text-align:left;\">"+currencyHexCode+marketingCosts+"</span></h2>";
            rhHTML += "<img class=\"launch-icon\" src=\"images/launch-icon.png\"></div>";
            rhHTML += "</div>";
            rhHTML += "</div>";
            rhHTML += "</div>";
            rhHTML += "</a>";
        }
        else
        {
            rhHTML += "<a style=\"cursor:default;\" id=\"rh-module-"+projectID+"\" class=\"module-link content-hacker-module\">";
            rhHTML += "<img src=\"images/tabDivider.png\" id=\"RHdivider-"+projectID+"\" class=\"rh-folder-tab\">";
            rhHTML += "<h2 class=\"module-heading text-left\">Content Hacker Data</h2>";
            rhHTML += "<div class=\"module-detail-section\">";
            rhHTML += "<div class=\"row\">";
            rhHTML += "<div class=\"col-lg-12 module-details-outer\">";
            rhHTML += "<h2 class=\"activate-link\" style=\"margin-top:50px;\" onclick=\"gotoCreateProject('0');\">[ Activate Keyword Hacker Data ]</h2>";
            rhHTML += "</div>";
            rhHTML += "</div>";
            rhHTML += "</div>";
            rhHTML += "</a>";
        }
        
        chActive = 0; 
        if(chActive == 1)
        {
            chHTML += "<a style=\"cursor:pointer;\" id=\"ch-module-"+projectID+"\" class=\"module-link content-hacker-module\" onmouseover=\"highlightCHCard('"+projectID+"')\" onmouseout=\"restoreCHCard('"+projectID+"');\" onclick=\"gotoRHStorefront('"+projectTitle+"');\">";
            //chHTML += "<img src=\"images/card_down_arrow.png\" class=\"module-card-arrow\">";
            chHTML += "<img src=\"images/tabDivider.png\" id=\"CHdivider-"+projectID+"\" class=\"ch-folder-tab\">";
            chHTML += "<h2 class=\"module-heading text-left\">Content Hacker Data</h2>";
            chHTML += "<div class=\"module-detail-section\">";
            chHTML += "<div class=\"row\">";
            chHTML += "<div class=\"project-icon\"><img src=\"images/icon-content_hacker.png\" alt=\"Keyword Hacker\" class=\"dashboard-icon\"><!--<span class=\"dashboard-card-notification-count\"></span>--></div>";
            chHTML += "<div class=\"module-details-outer\">";
            chHTML += "<div class=\"module-details-left\">";
            chHTML += "<h2 class=\"module-heading\">Number of<br>blueprints<span>"+storefrontReports+"</span></h2>";
            chHTML += "<h2 class=\"module-heading\">Content<br>created<span>Coming Soon</span></h2>";
            chHTML += "</div>";
            chHTML += "<div class=\"module-details-right\">";
            chHTML += "<h2 class=\"module-heading\">Content<br>ordered<span>Coming Soon</span></h2>";
            chHTML += "<h2 class=\"module-heading\">Content<br>published<span>Coming Soon</span></h2>";
            chHTML += "</div>";
            chHTML += "</div>";
            chHTML += "</div>";
            chHTML += "</div>";
            chHTML += "</a>";
        }
        else
        {
            chHTML += "<a style=\"cursor:default;\" id=\"ch-module-"+projectID+"\" class=\"module-link content-hacker-module\">";
            //chHTML += "<img src=\"images/card_down_arrow.png\" class=\"module-card-arrow\">";
            chHTML += "<img src=\"images/tabDivider.png\" id=\"CHdivider-"+projectID+"\" class=\"ch-folder-tab\">";
            chHTML += "<h2 class=\"module-heading text-left\">Content Hacker Data</h2>";
            chHTML += "<div class=\"module-detail-section\">";
            chHTML += "<div class=\"row\">";
            chHTML += "<div class=\"col-lg-12 module-details-outer\">";
            //chHTML += "<h2 class=\"activate-link\" style=\"margin-top:50px;\" onclick=\"gotoRHCreateProject('"+projectTitle+"','','','','','','');\">[ Activate Content Hacker Data ]</h2>";
            chHTML += "<h2 class=\"activate-link\" style=\"margin-top:50px;cursor:default;\">[ Content Hacker Module ]</h2><h2 class=\"module-heading\"><span style=\"color:#cf102d;font-size:20px;text-align:center;\">Coming Soon</span></h2>";
            chHTML += "</div>";
            chHTML += "</div>";
            chHTML += "</div>";
            chHTML += "</a>";
        }

        //Create a card and add it to the div
        //if(completed == '1')
        //if(true)
        if(canShow)
        {
            cardHTML += "<li class=\"col-lg-4 matchheight element-item\" id=\"project-card-"+projectID+"\">";
            cardHTML += "<div class=\"project-cart-box box-shadow-ot\">";
            cardHTML += "<div class=\"card-header\">";
            cardHTML += "<span class=\"card-header-mission-text\">The Mission</span>";
            //cardHTML += "<h1 class=\"project_name_sort\"><label for=\"chk-content-all1\"></label><a style=\"cursor:pointer;\" "+anchorAhref+">"+projectTitle+"</a></h1>";
            cardHTML += "<h1 class=\"project_name_sort\"><label for=\"chk-content-all1\"></label><span style=\"cursor:default;color:#404040;\">"+projectTitle+"</span></h1>";
            cardHTML += "<div style=\"clear:both;text-align:right;float:right;margin-top:-20px;\"><a style=\"cursor:pointer;\" class=\"edit-icon\" title=\"Edit Mission\" onclick=\"gotoCreateProject('"+projectID+"');\"></a><!--<a style=\"cursor:pointer;color:rgba(61,61,61,.25);\" title=\"Download\" class=\"download-icon\" onclick=\"saveTextAsFileFromDashboard('"+projectID+"');\"></a><a class=\"delete-icon\" title=\"Delete Mission\" onclick=\"displayProjectDeleteWindow('"+projectID+"');\"></a>--></div>";
            cardHTML += "</div>";
            
            cardHTML += rhHTML;
            cardHTML += chHTML;
            
            cardHTML += "<div class=\"card-box-bottom\">";
            cardHTML += "<div class=\"project-date-card date_sort\"><i class=\"eagle-icon\"></i>Initiated "+runDate+"</div>";
            //cardHTML += "<a style=\"cursor:pointer;\" "+anchorAhref+" class=\"project-status-card  project_status_sort \" href=\"javascript:void(0);\"> "+activeString+" </a>";
            //cardHTML += "<div style=\"clear:both;text-align:right;float:right;margin-top:-20px;\"><!--<a style=\"cursor:pointer;\" class=\"edit-icon\" title=\"Edit Mission\" onclick=\"gotoCreateProject('"+projectID+"');\"></a><a style=\"cursor:pointer;color:rgba(61,61,61,.25);\" title=\"Download\" class=\"download-icon\" onclick=\"saveTextAsFileFromDashboard('"+projectID+"');\"></a>--><a class=\"delete-icon-orig\" title=\"Delete Mission\" onclick=\"displayProjectDeleteWindow('"+projectID+"');\"></a></div>";
            cardHTML += "<div style=\"clear:both;text-align:right;float:right;\"><span class=\"delete-icon-small\" style=\"float:right;text-align:right;padding-right:5px;\" title=\"Delete Mission\" onclick=\"displayProjectDeleteWindow('"+projectID+"');\"><img src=\"images/ic_delete_forever_gray.png\" class=\"delete-icon-small\"></span></div>";
            cardHTML += "</div>";
            cardHTML += "</div>";
            cardHTML += "</li>";
        }
    }

    var addMoreHTML = "<li class=\"col-lg-4 matchheight element-item\" id=\"project-card-0\">" +
                      "<div class=\"project-cart-box box-shadow-ot\">"+
                      "<div class=\"card-header\"><span style=\"float:right;padding:5px;margin-top:-70px;\"><img src=\"images/start-icon.png\" style=\"margin-bottom:5px;\"><br><img src=\"images/create-new-icon.png\" style=\"cursor:pointer;width:35px;height:auto;margin-left:120px;\" onclick=\"showActivate();\"></span></div>"+
                        "<div class=\"active-link-outer\"><span class=\"active-new-project-link\" style=\"cursor:pointer;\" onclick=\"showActivate();\"> <a style=\"cursor:pointer;\">[ Activate New Mission ]</a> </span></div>" +
                      "<div class=\"card-box-bottom\">&nbsp;</div>"+
                      "</div>"+

                        "</li>";

    finalOutput = "<ul class=\"row grid\">"+addMoreHTML+cardHTML+"</ul>";

    $('#card-container').html(finalOutput);
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
}

function loadProjectData()
{
    var username = getCookie("username");
    var projectID = getURLParameter("pid");
    if(username != '')
    {
        if(projectID != '')
        {
            $.ajax({url: restURL, data: {'command':'getProjectData','projectid':projectID}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        var projectInfo = info.projectSummary;
                        var projectUsername = projectInfo.username;
                        if(projectUsername !== username && username !== "admin@fairmarketing.com" && username !== "hari.patel@1520holdings.com")
                        {
                            window.location = "dashboard.html";
                        }
                        else
                        {
                            //Save this to local storage so that it can be sent to the PDF printer service
                            $('#json').val(returnData);
                            displayProjectInfo('keyword',false);
                        }
                    }
                }
            });
        }
        else
        {
            window.location = "dashboard.html";
        }
        
        //Show the manageIndustries link for admin
        if(username !== 'admin@fairmarketing.com' && $('#industry-link').length)
        {
            $('#industry-link').remove();
            $('#users-link').remove();
        }
        
        refreshCartDropdown();
    }
    else
    {
        window.location = "index.html";
    }
}

function validateURL(url)
{
    var validTLDs = [".com",".org",".net",".int",".edu",".gov",".mil",".arpa",".ac",".ad",".ae",".af",".ag",".ai",".al",".am",".an",".ao",".aq",".ar",".as",".at",".au",".aw",".ax",".az",".ba",".bb",".bd",".be",".bf",".bg",".bh",".bi",".bj",".bm",".bn",".bo",".bq",".br",".bs",".bt",".bv",".bw",".by",".bz",".ca",".cc",".cd",".cf",".cg",".ch",".ci",".ck",".cl",".cm",".cn",".co",".cr",".cu",".cv",".cw",".cx",".cy",".cz",".de",".dj",".dk",".dm",".do",".dz",".ec",".ee",".eg",".eh",".er",".es",".et",".eu",".fi",".fj",".fk",".fm",".fo",".fr",".ga",".gb",".gd",".ge",".gf",".gg",".gh",".gi",".gl",".gm",".gn",".gp",".gq",".gr",".gs",".gt",".gu",".gw",".gy",".hk",".hm",".hn",".hr",".ht",".hu",".id",".ie",".il",".im",".in",".io",".iq",".ir",".is",".it",".je",".jm",".jo",".jp",".ke",".kg",".kh",".ki",".km",".kn",".kp",".kr",".krd",".kw",".ky",".kz",".la",".lb",".lc",".li",".lk",".lr",".ls",".lt",".lu",".lv",".ly",".ma",".mc",".md",".me",".mg",".mh",".mk",".ml",".mm",".mn",".mo",".mp",".mq",".mr",".ms",".mt",".mu",".mv",".mw",".mx",".my",".mz",".na",".nc",".ne",".nf",".ng",".ni",".nl",".no",".np",".nr",".nu",".nz",".om",".pa",".pe",".pf",".pg",".ph",".pk",".pl",".pm",".pn",".pr",".ps",".pt",".pw",".py",".qa",".re",".ro",".rs",".ru",".rw",".sa",".sb",".sc",".sd",".se",".sg",".sh",".si",".sj",".sk",".sl",".sm",".sn",".so",".sr",".ss",".st",".su",".sv",".sx",".sy",".sz",".tc",".td",".tf",".tg",".th",".tj",".tk",".tl",".tm",".tn",".to",".tp",".tr",".tt",".tv",".tw",".tz",".ua",".ug",".uk",".us",".uy",".uz",".va",".vc",".ve",".vg",".vi",".vn",".vu",".wf",".ws",".ye",".yt",".za",".zm",".zw"];
    var isValid = false;
    for(var i=0; i<validTLDs.length; i++)
    {
        if(url.indexOf(validTLDs[i]) > -1)
        {
            isValid = true;
        }
    }
    return isValid;
}

function gotoCreateProject(projectID)
{
    window.location = "projectwizard.html?pid="+projectID;
}

function forceSubmit(e)
{
    var userEntry = $("#new-keyword").val().trim();
    if(userEntry !== "")
    {
        addKeyword("addme");
    }
}

function addKeyword(e)
{
    if(e.keyCode == 13 || e == "addme")
    {
        var keyword = $('#new-keyword').val();
        var currentCount = parseInt($('#keyword-count').val());
        if(keyword.trim() !== '')
        {
            var kwArray = keyword.split(",");
            
            var newKWLength = kwArray.length;
            var maxKWLoc = Math.min(maxKeywordsPerProject-currentCount,newKWLength);
            var upperLimit = Math.max(0,maxKWLoc);

            for(var j=0; j<maxKWLoc; j++)
            {
                var currentKeywordCount = $('#keyword-count').val();
                var existingKeywords = $('#ctc').html();
                var newKeywordCount = parseInt(currentKeywordCount) + 1;
                var newKeywords = existingKeywords + "<li id=\"keyword"+newKeywordCount+"\">"+kwArray[j].trim()+"<span style=\"padding:5px;color:#ec1c24;font-weight:bold;cursor:pointer;\" id=\"remove-keyword"+newKeywordCount+"\" title=\"Remove\" onclick=\"removeKeyword(this);\">X</span></li>";
                $('#ctc').html(newKeywords);
                //$('#new-keyword').val('');
                $('#keyword-count').val(newKeywordCount);
            }
            
            if((newKWLength+currentCount) > maxKeywordsPerProject)
            {
                $("#alert-window").removeClass("alert-window");
                $("#alert-window").addClass("alert-window-large");
                showAlert("The number of keywords allowed per mission is currently limited. Only the first 25 phrases have been added.");
            }
            $('#new-keyword').val('');
            // The event listener for the file upload
            //document.getElementById('fileupload').addEventListener('change', upload, false);
        }
    }
}

function removeKeyword(element)
{
    var currentKeywordCount = parseInt($('#keyword-count').val());
    var id = element.getAttribute('id').replace('remove-keyword','');
    var idValue = parseInt(id);
    
    $('#keyword'+idValue).remove();
    
    if(idValue < currentKeywordCount)
    {
        var startingVal = idValue + 1;
        //Re-number the items behind this one so that we have an accurate count
        for(var i=startingVal; i<=currentKeywordCount; i++)
        {
            var newIDString = "keyword"+(i-1);
            var newRemoveString = "remove-keyword"+(i-1);
            $('#keyword'+i).attr("id",newIDString);
            $('#remove-keyword'+i).attr("id",newRemoveString);
        }
    }
    
    $('#keyword-count').val(currentKeywordCount-1);
    // The event listener for the file upload
    //document.getElementById('fileupload').addEventListener('change', upload, false);
}

function unitTest()
{
    /*var projectID = "227";
    
    //Hide the button so users don't hit it more than once
    $('#refresh-div').html("Working...");
    var deleteList = '';
    var addList = '';
    
    if(projectID != '' && getCookie("username") == 'hkpatel187@hotmail.com')
    {
        confirm("refreshing project: "+projectID+" without adding/removing urls");
        
        $.ajax({url: restURL, data: {'command':'refreshProject','projectid':projectID,'deleteList':deleteList,'addList':addList}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    window.location = "dashboard.html";
                }
            }
        });
    }*/
}

function sortKeywordCompetitors(selectedKeywordID,field)
{
    $('body').addClass('wait');
    
    var returnData = $('#json').val();
    var currSortMethod = $('#competitor-sort-method').val();
    var sortMethod = $('#competitor-sort-reversed').val();
    var reversed;
    
    //Find the data
    var info = JSON.parse(returnData);
    var projectInfo = info.projectSummary;
    var clientURL = projectInfo.clientURL;
    
    var keywordInfo = info.keywordData;
    
    var keywordID;
    var thisEntry;
    var thisCompetitorArray;
    var keywordStatus;
    var clientRanking;
    var competitorsAverageMonthlyContent;
    var userMonthlyContent;
    var userMonthlyBacklinks;
    var keywordTotalContentDiff;

    var avgCTR;
    var clientCTR;
    var avgRank;
    var totalPowerLevel;
    var keywordTotalContentDiffHTML = "";
    
    for(var i=0; i<keywordInfo.length; i++)
    {
        keywordID = keywordInfo[i].keywordID;
        if(keywordID == selectedKeywordID)
        {
            thisEntry = keywordInfo[i];
            thisCompetitorArray = thisEntry.competitorData;
            keywordStatus = thisEntry.status;
            clientRanking = thisEntry.clientRanking;
            competitorsAverageMonthlyContent = thisEntry.competitorsAverageMonthlyContent;
            userMonthlyContent = thisEntry.userMonthlyContent;
            userMonthlyBacklinks = thisEntry.userMonthlyBacklinks;
            keywordTotalContentDiff = thisEntry.keywordTotalContentDiff;
            
            avgCTR = Math.round(thisEntry.avgCTR);
            clientCTR = Math.round(thisEntry.clientCTR);
            avgRank = thisEntry.avgRank;
            totalPowerLevel = thisEntry.totalPowerLevel;     //Add back the client power level to the total power level for this keyword
            
            if(userMonthlyContent == "-1")
            {
                userMonthlyContent = "?";
            }
            if(userMonthlyBacklinks == "-1")
            {
                userMonthlyBacklinks = "?";
            }
            
            
            //var topHackContentHTML = "";
            //var boxGoalHTML = "";
            var shadedString = "";
            if(keywordStatus == "hacked")
            {
                //topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+(competitorsAverageMonthlyContent-userMonthlyContent)+" @ "+currencyHexCode+numberWithCommas(costPerMonth)+" </span><br/><a id=\"get-the-hack-1-"+i+"\" class=\"blueprint-links-blue\" style=\"font-size:9px;\" onclick=\"getContentReport('"+keywordID+"');\">VIEW CONTENT</a>";
                //boxGoalHTML = keywordTotalContentDiff;
                if(keywordTotalContentDiff >= 0)
                {
                    keywordTotalContentDiffHTML = "+" + keywordTotalContentDiff;
                }
                else
                {
                    keywordTotalContentDiffHTML = keywordTotalContentDiff;
                }
            }
            else if(keywordStatus == "hacking" || keywordStatus == "adding")
            {
                keywordTotalContentDiffHTML = "?";
            }
            else
            {
                keywordTotalContentDiffHTML = "?";
                shadedString = " shaded";
            }
            
        }
    }
    
    //Got the data, now let's sort it
    if(field == 'google-rank')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        else
        {
            //Switch the reverse flag so that the initial sort on a new column is ASC
            reversed = true;
        }
        thisCompetitorArray.sort(sort_by('positionRank', reversed, parseInt));
    }
    else if(field == 'url')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        else
        {
            //Switch the reverse flag so that the initial sort on a new column is ASC
            reversed = true;
        }
        thisCompetitorArray.sort(sort_by('url', reversed, function(a){return a.toUpperCase()}));
    }
    else if(field == 'ctr')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        else
        {
            //Switch the reverse flag so that the initial sort on a new column is ASC
            reversed = true;
        }
        thisCompetitorArray.sort(sort_by('traffic', reversed, parseFloat));
    }
    else if(field == 'monthly-content')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        else
        {
            //Switch the reverse flag so that the initial sort on a new column is ASC
            reversed = true;
        }
        thisCompetitorArray.sort(sort_by('competitorMonthlyContent', reversed, parseInt));
    }
    else if(field == 'monthly-backlinks')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        else
        {
            //Switch the reverse flag so that the initial sort on a new column is ASC
            reversed = true;
        }
        thisCompetitorArray.sort(sort_by('competitorMonthlyBacklinks', reversed, parseInt));
    }
    
    if(typeof reversed == 'undefined')
    {
        reversed = false;
    }
    
    //Save the new sort method and reversed status
    $('#competitor-sort-method').val(field);
    $('#competitor-sort-reversed').val(reversed);
    
    var competitorsCount = 0;
    var totalCTR = 0;
    var totalPowerLevel = 0;
    var totalRank = 0;
    var totalBacklinks = 0;
    
    //Now re-draw the content for the competitors div
    var competitorInnerHTML = "<div class=\"\" id=\"competitorsList-"+selectedKeywordID+"\" style=\"padding:0;margin:0;\">" +
            "<ul class=\"power-summary-row-highlight\" style=\"background-color:#cccccc;color:#000;border-right:1px solid #cccccc;margin:0;\">\n"+
                                "<li class=\"col-xs-12\" style=\"background-color:#cccccc;border-right:1px solid #cccccc;padding:0;\">\n"+
                                    "<h2 style=\"color:#000;text-align:center;\"><b>TOP TEN COMPETITORS RANKING FOR THIS KEYWORD PHRASE</b><!--<br/><span style=\"font-size:12px;color:#000;margin-top:10px;\">Select up to 5 competitors</span>--></h2>\n"+
                                "</li>\n"+
                            "</ul>\n"+
                            
                "<ul class=\"power-summary-row col-xs-12\">\n"+
                    "<li class=\"checkbox-outer col-xs-1\"></li>\n"+
                    "<li class=\"power-summary-rank col-xs-1\" style=\"cursor:pointer;padding-left:10px;padding-right:10px;\" onclick=\"sortKeywordCompetitors('"+selectedKeywordID+"','google-rank');\">\n"+
                        "<h2>Rank<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i></h2>\n"+
                    "</li>\n"+
                    "<li class=\"power-goal-info col-xs-5\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+selectedKeywordID+"','url');\">\n"+
                        "<h2>Competitor URL<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i></h2>\n"+
                    "</li>\n"+
                    "<li class=\"power-goal-info col-xs-1\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+selectedKeywordID+"','ctr');\">\n"+
                        "<h2>CTR<br><i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i><a class=\"info-icon\" title=\"Click Through Rate for the ranking position and current keyword.\"> </a></h2>\n"+
                    "</li>\n"+
                    "<li class=\"monthly-organic-info col-xs-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+selectedKeywordID+"','monthly-backlinks');\">\n"+
                        "<h2>Total<br>Backlinks<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i></h2>\n"+
                    "</li>\n"+
                    "<li class=\"monthly-organic-info col-xs-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+selectedKeywordID+"','monthly-content');\">\n"+
                        "<h2>Monthly<br>Content<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i><a class=\"info-icon\" title=\"The number of off-site content produced monthly with this keyword phrase as the topic.\"> </a></h2>\n"+
                    "</li>\n"+
                "</ul>\n";
        var showWarning = false;
        
        //competitorInnerHTML += "<ul class=\"power-summary-row\" style=\"border:0;\" id=\"competitorsList\">";
        var unhackedCompetitorExists = false;
        //competitorInnerHTML += "<div id=\"competitorsList-"+selectedKeywordID+"\">";
        for(var j=0; j<thisCompetitorArray.length; j++)
        {
            var disabled = false;
            
            var thisCompetitor = thisCompetitorArray[j];
            
            if(thisCompetitor.disabled == 1)
            {
                disabled = true;
            }
            else
            {
                disabled = false;
            }
            
            
            var competitorID = thisCompetitor.competitorID;
            var competitorActive = thisCompetitor.active;
            var competitorAhrefsStarted = thisCompetitor.ahrefsStarted;
            var competitorPositionRank = thisCompetitor.positionRank;
            var competitorURL = thisCompetitor.url;
                var competitorURLShort = competitorURL.substring(0,30);
                if(competitorURL.length > 30) { competitorURLShort += "..."; }
                
            /*if(j == 0)
            {
                c1 = competitorURL;
            }
            else if(j == 1)
            {
                c2 = competitorURL;
            }
            else if(j == 2)
            {
                c3 = competitorURL;
            }
            else if(j == 3)
            {
                c4 = competitorURL;
            }
            else if(j == 4)
            {
                c5 = competitorURL;
            }*/
                
            var competitorCTR = Math.round(thisCompetitor.traffic);
            var competitorCTRExact = Math.round(thisCompetitor.trafficExact);
            //var competitorMonthlyContent = thisCompetitor.competitorMonthlyContent;
            
            var ctrType = "";
            /*var ctrType = " (b)";
            if(typeof competitorCTRExact != "undefined")
            {
                if(competitorCTRExact > 0)
                {
                    competitorCTR = competitorCTRExact;
                    ctrType = " (e)";
                }
            }*/
            
            //var competitorPowerLevel = thisCompetitor.powerLevel;
            if(competitorAhrefsStarted == 0 && competitorActive == 1)
            {
                unhackedCompetitorExists = true;
            }
            
            var competitorPowerLevel = thisCompetitor.competitorMonthlyContent;
            var competitorMonthlyBacklinks = thisCompetitor.competitorMonthlyBacklinks;
            var competitorTotalBacklinks = thisCompetitor.competitorTotalBacklinks;
            var competitorContentCountHTML = "";
            var competitorMonthlyBacklinksHTML = "";
            if(competitorPowerLevel < 0 && (keywordStatus == "hacking" || keywordStatus == "adding") && competitorActive == 1)
            {
                competitorContentCountHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            }
            else if(competitorPowerLevel < 0 || keywordStatus == "added")
            {
                competitorContentCountHTML = "";
            }
            else
            {
                competitorContentCountHTML = competitorPowerLevel;
            }
            
            if(competitorMonthlyBacklinks < 0 && (keywordStatus == "hacking" || keywordStatus == "adding") && competitorActive == 1)
            {
                competitorMonthlyBacklinksHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            }
            else if(competitorMonthlyBacklinks < 0 || keywordStatus == "added")
            {
                competitorMonthlyBacklinksHTML = "";
            }
            else
            {
                //competitorMonthlyBacklinksHTML = competitorMonthlyBacklinks;
                competitorMonthlyBacklinksHTML = numberWithCommas(parseInt(competitorTotalBacklinks));
            }
            
            /*if(competitorPowerLevel > 9 && competitorActive == 1)
            {
                showWarning = true;
            }*/
            showWarning = false;
            
            
            var competitorCheckboxStatus = "";
            var seoInsuranceHTML = "";
            if(competitorActive == 1)
            {
                competitorCheckboxStatus = "checked";
                competitorsCount++;
                totalCTR += competitorCTR;
                totalPowerLevel += competitorPowerLevel;
                totalRank += competitorPositionRank;
                totalBacklinks += competitorMonthlyBacklinks;
            }
            
            if(thisCompetitor.disabled == 1)
            {
                competitorCheckboxStatus = " disabled";
                seoInsuranceHTML = "<span class=\"text-right\" style=\"vertical-align:middle;float:right;padding-right:5px;padding-top:10px;\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"\" data-original-title=\"Coming soon! Buy insurance for your top 10 ranking!\"><img src=\"images/seo-insurance-icon.png\" style=\"width:25px;height:auto;\"></a></span>";
            }
            
            //if(competitorsCount == 0) { competitorsCount = 1;}
            
            competitorInnerHTML += "<ul class=\"power-summary-row col-xs-12\" style=\"margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-1\">\n"+
                                    "<h2 class=\"rh-checkbox-padded\" style=\"text-align:center;\">\n"+
                                        "<input type=\"checkbox\" class=\"filled-in rh-checkbox rh-checkbox-padded\" "+competitorCheckboxStatus+" id=\"chk-content-all-c"+competitorID+"\" onchange=\"toggleCompetitor('"+competitorID+"',this.checked,'"+i+"','"+selectedKeywordID+"');\">\n"+
                                        "<label for=\"chk-content-all-c"+competitorID+"\"></label>\n"+
                                    "</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-summary-rank col-xs-1\">\n"+
                                    "<h2>"+competitorPositionRank+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-5 power-summary-competionurl\">\n"+
                                    //"<h2 title=\""+competitorURL+"\">"+competitorURLShort+"<a title=\"Copy full URL to clipboard\" class=\"copy-button\" onmouseover=\"resetTitle();\" data-clipboard-action=\"copy\" data-clipboard-text=\""+competitorURL+"\"><i class=\"fa fa-copy\" style=\"padding-left:5px;color:gray;cursor:pointer;\"></i></a></h2>\n"+
                                    "<h2 title=\""+competitorURL+"\">"+competitorURLShort+"<a title=\"Copy full URL to clipboard\" id=\"copy-anchor-"+competitorID+"\" class=\"copy-button\" onmouseover=\"resetTitle('"+competitorID+"');\"  onclick=\"showCopiedConfirmation('"+competitorID+"');\" data-clipboard-action=\"copy\" data-clipboard-text=\""+competitorURL+"\"><i class=\"fa fa-copy fa-blue\" id=\"copy-icon-"+competitorID+"\" style=\"padding-left:5px;cursor:pointer;\"></i></a></h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"col-xs-1 power-summary-rank desktop-hidden\">\n"+
                                    "<h2>"+competitorPositionRank+"</h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"power-goal-info col-xs-1 power-summary-ctr\">\n"+
                                    "<h2>"+competitorCTR+"%"+ctrType+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-monthly-backlinks"+shadedString+"\">\n"+
                                    "<h2 id=\"kwid-"+selectedKeywordID+"-competitorid-"+competitorID+"-backlinks\">"+competitorMonthlyBacklinksHTML+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-offsite-content"+shadedString+"\">\n"+
                                    "<h2 id=\"kwid-"+selectedKeywordID+"-competitorid-"+competitorID+"-content\">"+competitorContentCountHTML+"</h2>"+seoInsuranceHTML+"\n"+
                                "</li>\n"+
                            "</ul>\n";
        }
        
        //var needToHackHTML = "<div class=\"reveal-content-btn\"><span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button-white-bg\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\">REVEAL CONTENT</span></div>";
        var needToHackHTML = "<div class=\"reveal-content-btn\"><span id=\"get-the-hack-2-"+i+"\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\"><img src=\"images/reveal-button.png\" style=\"cursor:pointer;\"></span></div>";
        if(shadedString != "")
        {
            competitorInnerHTML += needToHackHTML;
        }
        competitorInnerHTML += "</div>";
        
        if(competitorsCount == 0) { competitorsCount = 1;}
        
        //Hidden element to keep track of how many competitors you've selected
        competitorInnerHTML += "<input id=\"kwid-"+selectedKeywordID+"-competitorsCount\" type=\"hidden\" value=\""+competitorsCount+"\">\n";
        
        
        var competitorAvgCount = Math.round(totalPowerLevel/competitorsCount);
        var competitorAvgBacklinks = Math.round(totalBacklinks/competitorsCount);
        if(competitorAvgCount < 0)
        {
            competitorAvgCount = "?";
        }
        if(competitorAvgBacklinks < 0 || unhackedCompetitorExists)
        {
            competitorAvgBacklinks = "?";
        }
        
        //Add in the average row
        competitorInnerHTML += "<ul class=\"power-summary-row-avg col-xs-12\" style=\"background-color:#e6e6e6;margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-1\" style=\"background-color:#e6e6e6;padding-left:15px;\">\n"+
                                    "<h2><b>AVG</b></h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-summary-rank col-xs-1\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+selectedKeywordID+"-avg-rank\">"+Math.round(totalRank/competitorsCount)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-5 power-summary-competionurl\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2>Selected Competitors</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-1 power-summary-ctr\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+selectedKeywordID+"-avg-ctr\">"+Math.round(totalCTR/competitorsCount)+"%</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-monthly-backlinks\" style=\"background-color:#e6e6e6;border-right:1px solid #e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+selectedKeywordID+"-table-total-backlinks\">"+competitorAvgBacklinks+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-offsite-content\" style=\"padding-left:15px;padding-right:15px;background-color:#e6e6e6;border-right:1px solid #e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+selectedKeywordID+"-table-total-pl\">"+competitorAvgCount+"</h2>\n"+
                                "</li>\n"+
                            "</ul>\n";
        
        
        //Add in the user's row
        competitorInnerHTML += "<ul class=\"power-summary-row-you col-xs-12\" style=\"background-color:#e6f2ff;margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-1\" style=\"background-color:#e6f2ff;padding-left:15px;\">\n"+
                                    "<h2><b>YOU</b></h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-summary-rank col-xs-1\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientRanking+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-5 power-summary-competionurl\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientURL+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-1 power-summary-ctr\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientCTR+"%</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-monthly-backlinks\" style=\"background-color:#e6f2ff;border-right:1px solid #e6f2ff;\">\n"+
                                    "<h2 id=\"kwid-"+selectedKeywordID+"-user-monthly-backlinks-count\">"+userMonthlyBacklinks+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-offsite-content\" style=\"padding-left:15px;padding-right:15px;background-color:#e6f2ff;border-right:1px solid #e6f2ff;\">\n"+
                                    "<h2 id=\"kwid-"+selectedKeywordID+"-user-monthly-content-count\">"+userMonthlyContent+"</h2>\n"+
                                "</li>\n"+
                            "</ul>\n";
        //competitorInnerHTML += "</div>\n";
        
        
        //Add in the summary row
        competitorInnerHTML += "<ul class=\"power-summary-row-highlight col-xs-12\" style=\"background-color:#005cb9;color:#fff;border-right:1px solid #005cb9;margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-10\" style=\"background-color:#005cb9;border-right:1px solid #005cb9;padding-left:15px;\">\n"+
                                    "<h2 style=\"color:#fff;\"><a data-toggle=\"tooltip\" title=\"Monthly Content Goal = Competitors' Average Monthly Content - Your Monthly Content\" class=\"tooltip-hover\" style=\"color:#fff;\"><b>YOUR MONTHLY CONTENT GOAL</b></a></h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2\" style=\"padding-left:15px;padding-right:15px;background-color:#005cb9;color:#fff;border-right:1px solid #005cb9;margin-left:-4px;\">\n"+
                                    "<h2 style=\"color:#fff;font-size:16px;\" id=\"kwid-"+selectedKeywordID+"-plg-2\"><b>"+keywordTotalContentDiffHTML+"</b></h2>\n"+
                                "</li>\n"+
                            "</ul>\n";
        competitorInnerHTML += "</div>\n"+
                            "</div>\n";
        
    $('#competitors-table-'+selectedKeywordID).html(competitorInnerHTML);
    $('body').removeClass('wait');
}

function displayProjectInfo(field,sort)
{
    $('body').addClass('wait');
    var returnData = $('#json').val();
    var info = JSON.parse(returnData);

    //Fill in the project data here
    var projectInfo = info.projectSummary;
        var projectUsername = projectInfo.username;
        var projectID = projectInfo.projectID;
        var runDate = projectInfo.runDate;
        var costPerLevel = projectInfo.costPerLevel;
        var searchVolume = projectInfo.searchVolume;
        var clientURL = projectInfo.clientURL;
        var valuePerCustomer = projectInfo.valuePerCustomer;
        var active = projectInfo.active;
        var completed = projectInfo.completed;
        var clientDA = projectInfo.clientDA;
        var clientPA = projectInfo.clientPA;
        //var clientPowerLevel = Math.max(1,Math.round((clientDA+clientPA)/2/10,0));
        var totalPowerLevel = projectInfo.totalPowerLevel
        var incomingTraffic = Math.round(projectInfo.incomingTraffic,0);
        var runDateRaw = projectInfo.runDateRaw;
        var keywordCount = projectInfo.keywordCount;
        var geoLocation = projectInfo.geoLocation;
        var monthlyVisitors = projectInfo.monthlyVisitors;
        var payingCustomers = projectInfo.payingCustomers;
        var currencyHexCode = projectInfo.currencyHexCode;
        var useGoogle = projectInfo.useGoogle;
        var useBing = projectInfo.useBing;
        var useDefaultConversionRate = projectInfo.useDefaultConversionRate;
        
        var projectTotalContentDiff = Math.max(0,projectInfo.projectTotalContentDiff);
        
        var customerConversionRate = projectInfo.defaultConversionRate;
        if(monthlyVisitors !== 0 && payingCustomers !== 0 && useDefaultConversionRate !== 1)
        {
            customerConversionRate = (payingCustomers / monthlyVisitors);
        }
        
        var monthlyCustomers = Math.round(incomingTraffic * customerConversionRate,0);
        var monthlySales = Math.round(monthlyCustomers * valuePerCustomer,0);
        //var costPerMonth = Math.round((totalPowerLevel * costPerLevel),0);
        var costPerMonth = Math.round((projectTotalContentDiff * costPerLevel),0);
        var keywordNetWorth = (monthlySales - costPerMonth);
        
        //var customerConversionRate = (payingCustomers / monthlyVisitors);
        
        //var netWorthStyle = "green-text";
        var netWorthStyle = "white-text";
        if(keywordNetWorth < 0 || completed != 1)
        {
            netWorthStyle = "red-text";
        }
        
        var keywordNetWorthString = "";
        var firstID = 0;
        var firstCounter = 0;
        
        //Iterate through the keywords to see if any are in "hacking" status; if so, show the warning message
        var currentlyHacking = false;
        var currentlyAdding = false;
        var tempKeywordInfo = info.keywordData;
        for(var t=0; t<tempKeywordInfo.length; t++)
        {
            var tempEntry = tempKeywordInfo[t];
            var tempStatus = tempEntry.status;
            if(tempStatus == "hacking")
            {
                currentlyHacking = true;
            }
            if(tempStatus == "adding")
            {
                currentlyAdding = true;
            }
        }
        
        
        if(completed != 1 || currentlyHacking || currentlyAdding)
        {
            keywordNetWorthString = "<span class=\"loader__dot\" style=\"font-size:15px;color:red;\">calculating...</span>";
            //Show the warning message at top, and set the flag to keep checking
            if(currentlyAdding)
            {
                $("#warning-message-content").html("Your keywords are being added. You can manually refresh this page to get the latest info, or we'll let you know as soon as all the numbers are in!");
            }
            else if(currentlyHacking)
            {
                $("#warning-message-content").html("We are hacking the content strategies of your selected competitors. This report could take several minutes to complete but it's worth the wait! You can refresh the page periodically to get the latest info, or wait for us to let you know when it's all done.");
            }
            
            $("#warning-message").show(400);
            $("#check-project-done-flag").val(1);
        }
        else
        {
            keywordNetWorthString = currencyHexCode+numberWithCommas(keywordNetWorth);
        }
        
        var activeString = "";
        if(active == 1)
        {
            activeString = "ACTIVE";
        }
        else
        {
            activeString = "INACTIVE";
        }
        
        $('#currency-code-1').html(currencyHexCode);
        $('#currency-code-2').html(currencyHexCode);
        $('#currency-code-3').html(currencyHexCode);
        
        if(useGoogle == 1 && useBing != 1)
        {
            $("#search-engine-icons").html("<i class=\"keyword-item-icon rh-google-icon\" style=\"margin-left:-5px;margin-bottom:-3px;\"></i>");
        }
        else if(useGoogle != 1 && useBing == 1)
        {
            $("#search-engine-icons").html("<img src=\"images/bing_icon.png\" class=\"icon-sized\"><img src=\"images/yahoo_icon.png\" class=\"icon-sized\">");
        }
        else
        {
            $("#search-engine-icons").html("<i class=\"keyword-item-icon rh-google-icon\" style=\"margin-left:-5px;margin-bottom:-3px;\"></i><img src=\"images/bing_icon.png\" class=\"icon-sized\"><img src=\"images/yahoo_icon.png\" class=\"icon-sized\">");
        }
        
        if(typeof searchVolume === 'undefined') {searchVolume = 0;}
        if(typeof incomingTraffic === 'undefined') {incomingTraffic = 0;}
        if(typeof payingCustomers === 'undefined') {payingCustomers = 0;}
        if(typeof monthlyVisitors === 'undefined') {monthlyVisitors = 0.0000001;}
        if(typeof monthlySales === 'undefined') {monthlySales = 0;}
        if(typeof costPerMonth === 'undefined' || keywordCount == 0) {costPerMonth = 0;}
        
        var locationTitleText = "Total monthly search volume for the city you typed in above.";
        if(typeof projectInfo.useNational != "undefined")
        {
            if(projectInfo.useNational == 1)
            {
                locationTitleText = "Total monthly search volume for the country that your city resides within.";
            }
        }
        
        $('#projectTitle').html(clientURL+"<span><a style=\"cursor:pointer;margin-left:7px;\" class=\"edit-icon\" title=\"Edit Mission\" onclick=\"gotoCreateProject('"+projectID+"');\"></a><!--<a style=\"cursor:pointer;margin-left:7px;margin-top:3px;color:rgba(61,61,61,.25);\" title=\"Download\" class=\"download-icon\" onclick=\"saveTextAsFile();\"></a>--></span>");
        $('#numKeywords').html(keywordCount);
        $('#geoLocation').html("<h2><a style=\"color:#000;\">"+geoLocation+"</a><!--<a class=\"edit-icon\" title=\"Edit Location\"></a>--></h2>");
        /*$('#searchVolume').html("<h2>"+numberWithCommas(searchVolume)+"<span>MO,SEARCH VOLUME<a class=\"info-icon\" title=\"This is the total sum of monthly search volume for all selected keywords in this project.\"></a></span></h2>");
        $('#projectedVisitors').html("<h2>"+numberWithCommas(incomingTraffic)+"<span>PROJECTED MO. VISITORS<a class=\"info-icon\" title=\"Calculated by applying the average CTR for your competitors to Mo. Search Volume.\"></a></span></h2>");
        $('#projectedCustomers').html("<h2>"+numberWithCommas(Math.round(incomingTraffic * (payingCustomers / monthlyVisitors),0))+"<span>PROJECTED MO. CUSTOMERS<a class=\"info-icon\" title=\"Calculated based on your conversion rate.\"></a></span></h2>");
        $('#projectedSales').html("<h2>$"+numberWithCommas(monthlySales)+"<span>PROJECTED MO. SALES<a class=\"info-icon\" title=\"Calculated based on your conversion rate and customer value.\"></a></span></h2>");
        $('#costPerMonth').html("<h2>$"+numberWithCommas(costPerMonth)+"<span>COST PER MONTH<a class=\"info-icon\" title=\"This is the total sum of monthly costs for all selected keywords in this project.\"></a></span></h2>");
        $('#kwNetWorth').html("<h2 class=\""+netWorthStyle+"\">"+keywordNetWorthString+"<span>KEYWORD NET-WORTH<a class=\"info-icon\" title=\"This is the projected return on your invested marketing dollars for all selected keywords in this project.\"></a></span></h2>");*/
        $('#searchVolume').html("<h2>"+numberWithCommas(searchVolume)+"<span>MO. SEARCH VOLUME</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
        $('#projectedVisitors').html("<h2>"+numberWithCommas(incomingTraffic)+"<span>PROJ. MO. VISITORS</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
        $('#projectedCustomers').html("<h2>"+numberWithCommas(Math.round(incomingTraffic * customerConversionRate,0))+"<span>PROJ. MO. CUSTOMERS</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
        //$('#projectedSales').html("<h2>"+currencyHexCode+numberWithCommas(monthlySales)+"<span>PROJ. MO. SALES</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
        $('#projectedSales').html("<h2>"+currencyHexCode+numberWithCommas(monthlySales)+"<span>PROJ. MO. SALES</span></h2><div class=\"header-math-sign\" style=\"font-family:'Baloo Bhaina', cursive;color:#ec1c24;font-size:48px;font-weight:bold;padding-right:25px;\">-</div>");
        //$('#costPerMonth').html("<h2>"+currencyHexCode+numberWithCommas(costPerMonth)+"<span>COST PER MONTH</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
        $('#costPerMonth').html("<h2>"+currencyHexCode+numberWithCommas(costPerMonth)+"&nbsp;<font style=\"color:#598a9e;font-size:12px;\">("+projectTotalContentDiff+" pcs)</font><span>COST PER MONTH</span></h2><div class=\"header-math-sign\" style=\"font-family:'Baloo Bhaina', cursive;color:#088D0C;font-size:48px;font-weight:bold;\">=</div>");
        $('#kwNetWorth').html("<h2 class=\""+netWorthStyle+"\" style=\"background-color:#000;\">"+keywordNetWorthString+"<span style=\"background-color:#fff;\">KEYWORD NET-WORTH</span></h2>");
        $('#dateDivBottom').html("<div class=\"project-date-card date_sort\"><i class=\"eagle-icon\"></i>Initiated "+runDate+"</div><a class=\"project-status-card  project_status_sort\" href=\"javascript:void(0);\">"+activeString+"</a>");

    //Let's sort the keyword data by the specified field first
    var currSortMethod = $('#keyword-sort-method').val();
    var sortMethod = $('#keyword-sort-reversed').val();
    var reversed = false;
    
    //Find the data
    var keywordInfo = info.keywordData;

    //Got the data, now let's sort it (if sort=true)
    if(sort)
    {
        if(field == 'keyword')
        {
            if(field == currSortMethod)
            {
                if(sortMethod == "false")
                {
                    reversed = true;
                }
                else
                {
                    reversed = false;
                }
            }
            keywordInfo.sort(keywords_sort_by('keyword', reversed, function(a){return a.toUpperCase()}));
        }
        else if(field == 'powerLevelGoal')
        {
            if(field == currSortMethod)
            {
                if(sortMethod == "false")
                {
                    reversed = true;
                }
                else
                {
                    reversed = false;
                }
            }
            keywordInfo.sort(keywords_sort_by('powerLevelGoal', reversed, parseInt));
        }
        else if(field == 'searchVolume')
        {
            if(field == currSortMethod)
            {
                if(sortMethod == "false")
                {
                    reversed = true;
                }
                else
                {
                    reversed = false;
                }
            }
            keywordInfo.sort(keywords_sort_by('searchVolume', reversed, parseInt));
        }
        else if(field == 'monthlyVisitors')
        {
            if(field == currSortMethod)
            {
                if(sortMethod == "false")
                {
                    reversed = true;
                }
                else
                {
                    reversed = false;
                }
            }
            keywordInfo.sort(keywords_sort_by('monthlyVisitors', reversed, parseInt));
        }
        else if(field == 'monthlyCustomers')
        {
            if(field == currSortMethod)
            {
                if(sortMethod == "false")
                {
                    reversed = true;
                }
                else
                {
                    reversed = false;
                }
            }
            keywordInfo.sort(keywords_sort_by('monthlyCustomers', reversed, parseInt));
        }
        else if(field == 'monthlySales')
        {
            if(field == currSortMethod)
            {
                if(sortMethod == "false")
                {
                    reversed = true;
                }
                else
                {
                    reversed = false;
                }
            }
            keywordInfo.sort(keywords_sort_by('monthlySales', reversed, parseInt));
        }
        else if(field == 'costPerMonth')
        {
            if(field == currSortMethod)
            {
                if(sortMethod == "false")
                {
                    reversed = true;
                }
                else
                {
                    reversed = false;
                }
            }
            keywordInfo.sort(keywords_sort_by('costPerMonth', reversed, parseInt));
        }
        else if(field == 'keywordNetWorth')
        {
            if(field == currSortMethod)
            {
                if(sortMethod == "false")
                {
                    reversed = true;
                }
                else
                {
                    reversed = false;
                }
            }
            keywordInfo.sort(keywords_sort_by('keywordNetWorth', reversed, parseInt));
        }

        //Save the new sort method and reversed status
        $('#keyword-sort-method').val(field);
        $('#keyword-sort-reversed').val(reversed);
    }

    //Fill in the keyword data here
    var accordianHTML = "";
    //var keywordInfo = info.keywordData;
    for(var i=0; i<keywordInfo.length; i++)
    {
        var thisEntry = keywordInfo[i];
        var thisCompetitorArray = thisEntry.competitorData;
        
        var keywordID = thisEntry.keywordID;
        var searchVolume = thisEntry.searchVolume;
        var clientRanking = thisEntry.clientRanking;
        var keywordActive = thisEntry.active;
        var avgCTR = Math.round(thisEntry.avgCTR);
        var avgCTRExact = Math.round(thisEntry.avgCTRExact);
        var keywordHidden = thisEntry.hidden;
        var clientPowerLevel = thisEntry.clientKeywordPowerLevel;
        var errorExists = thisEntry.errorFlag;
        //var clientPowerLevel = thisEntry.userMonthlyContent;
        
        var competitorsAverageMonthlyContent = thisEntry.competitorsAverageMonthlyContent;
        var userMonthlyContent = thisEntry.userMonthlyContent;
        var userMonthlyBacklinks = thisEntry.userMonthlyBacklinks;
        var keywordTotalContentDiff = thisEntry.keywordTotalContentDiff;
        
        if(userMonthlyContent == "-1")
        {
            userMonthlyContent = "?";
        }
        if(userMonthlyBacklinks == "-1")
        {
            userMonthlyBacklinks = "?";
        }
        
        /*if(typeof avgCTRExact != "undefined")
        {
            if(avgCTRExact > 0)
            {
                avgCTR = avgCTRExact;
            }
        }*/
        
        var clientCTR = Math.round(thisEntry.clientCTR);
        var avgRank = thisEntry.avgRank;
        var totalPowerLevel = thisEntry.totalPowerLevel;     //Add back the client power level to the total power level for this keyword
        //var totalPowerLevel = thisEntry.keywordTotalContentDiff;
        var keyword = thisEntry.keyword;
        
        /*var monthlyVisitors = Math.round(searchVolume * avgCTR,0);
        var monthlyCustomers = Math.round(monthlyVisitors * customerConversionRate,0);
        var monthlySales = Math.round(monthlyCustomers * valuePerCustomer,0);
        var costPerMonth = Math.round((totalPowerLevel - clientPowerLevel) * costPerLevel, 0);
        var keywordNetWorth = (monthlySales - costPerMonth);
        
        var powerLevelGoal = Math.max(1,(totalPowerLevel - clientPowerLevel));*/
        var monthlyVisitors = thisEntry.monthlyVisitors;
        var monthlyCustomers = thisEntry.monthlyCustomers;
        var monthlySales = thisEntry.monthlySales;
        var costPerMonth = thisEntry.costPerMonth;
        var keywordNetWorth = thisEntry.keywordNetWorth;
        var keywordStatus = thisEntry.status;
        
        var keywordTotalContentDiffHTML = "";
        var topKWNetworth = "";
        var topHackContentHTML = "";
        var topHackExpand = "";
        var boxGoalHTML = "";
        var bigHackContentButton = "";
        var shadedString = "";
        var errorTriangleHTML = "";
        
        if(errorExists == 1)
        //if(true)
        {
            errorTriangleHTML = "<a data-toggle=\"tooltip\" onclick=\"rerunKeyword('"+keywordID+"');\" class=\"tooltip-hover\" title=\"\" data-original-title=\"It looks like there was an issue running this keyword. Please click the triangle icon to try re-running the phrase.\"><img src=\"images/red-warning-icon.png\" class=\"restart-icon\"></a>";
        }
        
        if(keywordStatus == "hacked")
        {
            //topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+keywordTotalContentDiff+" @ "+currencyHexCode+numberWithCommas(costPerMonth)+" </span><br/><a id=\"get-the-hack-1-"+i+"\" class=\"blueprint-links-blue\" style=\"font-size:9px;\" onclick=\"getContentReport('"+keywordID+"');\">VIEW CONTENT</a>";
            topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            //topHackExpand = "id=\"toggle-keyword-"+keywordID+"\" style=\"cursor:pointer;\" data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            topHackExpand = "style=\"cursor:pointer;\" data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)<img src=\"images/add-to-cart-icon.png\" style=\"margin-left:10px;margin-top:-5px;height:20px;width:auto;cursor:pointer;\" onclick=\"addToCart('"+keywordID+"');\"></span>";
            boxGoalHTML = keywordTotalContentDiff;
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button-blue\" onclick=\"getContentReport('"+keywordID+"');\">VIEW CONTENT</span>";
            if(keywordTotalContentDiff >= 0)
            {
                keywordTotalContentDiffHTML = "+" + keywordTotalContentDiff;
            }
            else
            {
                keywordTotalContentDiffHTML = keywordTotalContentDiff;
            }
        }
        else if(keywordStatus == "hacking")
        {
            topHackContentHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            topHackExpand = "";
            //topHackContentHTML = "$0 (0 pcs)";
            //topKWNetworth = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            boxGoalHTML = "?";
            keywordTotalContentDiffHTML = "?";
            bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button\" style=\"cursor:default;border:0;\"><img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/></span>";
        }
        else if(keywordStatus == "adding")
        {
            //topHackContentHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            topHackExpand = "";
            topHackContentHTML = "$0 (0 pcs)";
            topKWNetworth = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            //topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            boxGoalHTML = "?";
            keywordTotalContentDiffHTML = "?";
            bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button\" style=\"cursor:default;border:0;\"><img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/></span>";
        }
        else
        {
            //It's just been added, not yet hacked
            shadedString = " shaded";
            //topHackExpand = "id=\"toggle-keyword-"+keywordID+"\" style=\"cursor:pointer;\" data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            topHackExpand = "style=\"cursor:pointer;\" data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            if(keywordActive == 1)
            {
                //topHackContentHTML = "<span style=\"font-size:20px;color:#808080;text-align:center;margin-left:30%;\">?</span><br/><span style=\"text-align:center;\"><a id=\"get-the-hack-1-"+i+"\" class=\"blueprint-links\" style=\"font-size:9px;\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\">HACK CONTENT</a></span>";
                topHackContentHTML = "<span style=\"font-size:20px;color:#808080;text-align:center;margin-left:25%;\"><img src=\"images/reveal-button.png\" class=\"goal-icon\"></span>";
            }
            else
            {
                topHackContentHTML = "<span style=\"font-size:20px;color:#808080;text-align:center;margin-left:25%;\"><img src=\"images/reveal-button.png\" class=\"goal-icon\"></span>";
            }
            //boxGoalHTML = "<span id=\"get-the-hack-1.5-"+i+"\" class=\"get-the-hack-button-small\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\">HACK<br/>CONTENT</span>";
            boxGoalHTML = "?";
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\">HACK CONTENT</span>";
            keywordTotalContentDiffHTML = "?";
        }
       
        /*if(keywordStatus == "hacked" || keywordStatus == "initial_done")
        {
            topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)</span>";
            boxGoalHTML = keywordTotalContentDiff;
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button-blue\" onclick=\"getContentReport('"+keywordID+"');\">VIEW CONTENT</span>";
            if(keywordTotalContentDiff >= 0)
            {
                keywordTotalContentDiffHTML = "+" + keywordTotalContentDiff;
            }
            else
            {
                keywordTotalContentDiffHTML = keywordTotalContentDiff;
            }
        }
        else
        {
            //It's unhacked
            topHackContentHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            boxGoalHTML = "?";
            keywordTotalContentDiffHTML = "?";
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button\" style=\"cursor:default;border:0;\"><img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/></span>";
        }*/
       
        var powerLevelGoal = Math.max(1,(totalPowerLevel - clientPowerLevel));
        
        var keywordCheckboxStatus = "";
        var rowBGText = "";
        var keywordToggle = "";
        var eyeToggle = "";
        if(keywordActive == 1 && (keywordStatus == "hacked" || keywordStatus == "added"))
        {
            if(firstID == 0)
            {
                firstID = keywordID;
            }
            keywordCheckboxStatus = "checked";
            //rowBGText = " style=\"background-color:#fff;\"";
            rowBGText = " style=\"opacity:1.0;cursor:pointer;\"";
            //keywordToggle = " data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            //eyeToggle = " data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            keywordToggle = " data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            eyeToggle = " data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            
        }
        else if(keywordActive == 1 && (keywordStatus == "hacking" || keywordStatus == "adding"))
        {
            if(firstID == 0)
            {
                firstID = keywordID;
            }
            keywordCheckboxStatus = "checked";
            //rowBGText = " style=\"background-color:#fff;\"";
            rowBGText = " style=\"opacity:1.0;\"";
            //keyword = "<span class=\"shimmer\">"+keyword+"</span>";
            eyeToggle = " style=\"display:none;\"";
            //keywordToggle = " data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            //eyeToggle = " data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
        }
        else
        {
            //rowBGText = " style=\"background-color:#b3b3b3;\"";
            if(i == 0)
            {
                firstCounter = 1;
            }
            eyeToggle = " style=\"display:none;\"";
            rowBGText = " style=\"opacity:0.33;\"";
        }
        
        var hideCSS = "";
        if(keywordHidden == 1)
        {
            hideCSS = "style=\"display:none;\"";
        }
        
        //Add the header info for the accordian HTML
        accordianHTML += "<div id=\"kw-panel-div"+keywordID+"\" class=\"panel panel-default keyword-phraser-row\" "+hideCSS+">\n"+
                            "<ul role=\"tab\" id=\"keyword-phraser-heading"+keywordID+"\""+rowBGText+">\n"+
                                "<li class=\"checkbox-outer width-2-5\" style=\"position:relative;top:30%;font-size:28px;\" "+topHackExpand+">\n"+
                                    "<i id=\"caret-"+keywordID+"\" class=\"fa fa-caret-right\"></i>\n"+
                                "</li>\n"+
                                "<li class=\"keyword-phraser-tittle width-30\" "+topHackExpand+">\n"+
                                    "<h2><a"+keywordToggle+">"+keyword+"</a><a"+eyeToggle+" class=\"rh-view-icon\"> </a>"+errorTriangleHTML+"</h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"power-goal-info width-7\" id=\"kwid-"+keywordID+"-plg-1\">\n"+
                                    "<h2>"+powerLevelGoal+"<a data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\" class=\"rh-view-icon\"> </a></h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"monthly-organic-info width-10\" id=\"kwid-"+keywordID+"-search-volume\">\n"+
                                    "<h2>"+numberWithCommas(searchVolume)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"monthly-visitors-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-monthly-visitors\">\n"+
                                    "<h2>"+numberWithCommas(monthlyVisitors)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"monthly-customers-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-monthly-customers\">\n"+
                                    "<h2>"+numberWithCommas(monthlyCustomers)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"monthly-sales-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-monthly-sales\">\n"+
                                    "<h2>"+currencyHexCode+numberWithCommas(monthlySales)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"cost-monthly-info width-12\" "+""+" id=\"kwid-"+keywordID+"-cost-per-month\">\n"+
                                    //"<h2 id=\"top-hack-content-"+i+"\" "+topHackExpand+">"+topHackContentHTML+"</h2>\n"+
                                    "<h2 id=\"top-hack-content-"+i+"\">"+topHackContentHTML+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"keyword-net-worth-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-kw-net-worth\">\n"+
                                    "<h2 class=\"\">"+topKWNetworth+"</h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"spacer-info\"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"keyword-net-worth-info width-7\">\n"+
                                    "<h2><a id=\"get-the-hack-1-"+i+"\" class=\"blueprint-links\" onclick=\"gotoStorefrontPrefill('"+i+"');\">HACK CONTENT</a></h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"checkbox-outer content-blueprint-info width-1\">\n"+
                                    "<h2 class=\"rh-checkbox-padded\" style=\"text-align:center;padding-left:5px;\">\n"+
                                        "<input type=\"checkbox\" class=\"filled-in rh-checkbox rh-checkbox-padded\" "+keywordCheckboxStatus+" id=\"chk-content-all-kw"+keywordID+"\" onchange=\"toggleKeyword('"+keywordID+"',this.checked);\">\n"+
                                        "<label for=\"chk-content-all-kw"+keywordID+"\"></label>\n"+
                                    "</h2>\n"+
                                "</li>\n"+
                                "<li class=\"content-blueprint-info width-1\">\n"+
                                    "<h2 style=\"text-align:center;\"><span class=\"delete-icon\" style=\"float:right;text-align:right;\" title=\"Delete Keyword\" onclick=\"displayKeywordDeleteWindow('"+keywordID+"');\"><img src=\"images/ic_delete_forever_gray.png\" class=\"delete-icon\"></span></h2>\n"+
                                "</li>\n"+
                            "</ul>\n"+
                            "<div id=\"keyword-phraser-collapse"+i+"\" class=\"panel-collapse collapse \" role=\"tabpanel\" aria-labelledby=\"keyword-phraser-heading"+i+"\">\n"+

                            "<div class=\"mobile-keyword-phraser-table\" id=\"keyword-phraser-heading"+keywordID+"\""+rowBGText+">\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-search-volume\">\n"+
                                    "<h2>The monthly average searches for each keyword:</h2><span>"+numberWithCommas(searchVolume)+"</span>\n"+
                                "</div>\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-monthly-visitors\">\n"+
                                    "<h2>Projected Monthly Visitors:</h2><span>"+numberWithCommas(monthlyVisitors)+"</span>\n"+
                                "</div>\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-monthly-customers\">\n"+
                                    "<h2>Projected Monthly Customers:</h2><span>"+numberWithCommas(monthlyCustomers)+"</span>\n"+
                                "</div>\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-monthly-sales\">\n"+
                                    "<h2>Projected Monthly Sales:</h2><span>"+currencyHexCode+numberWithCommas(monthlySales)+"</span>\n"+
                                "</div>\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-cost-per-month\">\n"+
                                    "<h2>Content Goal & Cost:</h2><span id=\"top-hack-content-"+i+"\">"+topHackContentHTML+"</span>\n"+
                                "</div>\n"+ 
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-kw-net-worth\">\n"+
                                    "<h2>Keyword Net-Worth:</h2><span class=\"\">"+topKWNetworth+"</span>\n"+
                                "</div>\n"+
                            "</div>\n";


                            "<div class=\"power-level-summary\">\n";
        
        //Let's first build the "THEM" table so that we can determine if they hav a power level goal of 9 (need to know whether to show the warning message)
        /* old onclick sorting: 
         * 
         * onclick=\"sortKeywordCompetitors('"+keywordID+"','google-rank','"+totalPowerLevel+"');\"
         * onclick=\"sortKeywordCompetitors('"+keywordID+"','url','"+totalPowerLevel+"');\"
         * onclick=\"sortKeywordCompetitors('"+keywordID+"','ctr','"+totalPowerLevel+"');\"
         * onclick=\"sortKeywordCompetitors('"+keywordID+"','power-level','"+totalPowerLevel+"');\"
         * 
         */
        var competitorHTML = "<div class=\"col-lg-6 them-power-summary-section\" style=\"padding-right:0;\" id=\"competitors-table-"+keywordID+"\">\n" +
            "<div class=\"\" id=\"competitorsList-"+keywordID+"\" style=\"padding:0;margin:0;\">" +
                "<ul class=\"power-summary-row-highlight\" style=\"background-color:#cccccc;color:#000;border-right:1px solid #cccccc;margin:0;\">\n"+
                                "<li class=\"col-xs-12\" style=\"background-color:#cccccc;border-right:1px solid #cccccc;padding:0;\">\n"+
                                    "<h2 style=\"color:#000;text-align:center;\"><b>TOP TEN COMPETITORS RANKING FOR THIS KEYWORD PHRASE</b><!--<br/><span style=\"font-size:12px;color:#000;margin-top:10px;\">Select up to 5 competitors</span>--></h2>\n"+
                                "</li>\n"+
                            "</ul>\n"+
                
                
                "<ul class=\"power-summary-row col-xs-12\">\n"+
                    "<li class=\"checkbox-outer col-xs-1\"></li>\n"+
                    //"<li class=\"keyword-phraser-tittle col-lg-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','google-rank','"+totalPowerLevel+"','"+avgRank+"','"+avgCTR+"','"+clientCTR+"','"+clientRanking+"','"+clientURL+"','"+clientPowerLevel+"','"+powerLevelGoal+"');\">\n"+
                    "<li class=\"power-summary-rank col-xs-1\" style=\"cursor:pointer;padding-left:10px;padding-right:10px;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','google-rank');\">\n"+
                        "<h2>Rank<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i></h2>\n"+
                    "</li>\n"+
                    //"<li class=\"power-goal-info col-lg-5\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','url','"+totalPowerLevel+"','"+avgRank+"','"+avgCTR+"','"+clientCTR+"','"+clientRanking+"','"+clientURL+"','"+clientPowerLevel+"','"+powerLevelGoal+"');\">\n"+
                    "<li class=\"power-goal-info col-xs-5\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','url');\">\n"+
                        "<h2>Competitor URL<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i></h2>\n"+
                    "</li>\n"+
                    //"<li class=\"power-goal-info col-lg-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','ctr','"+totalPowerLevel+"','"+avgRank+"','"+avgCTR+"','"+clientCTR+"','"+clientRanking+"','"+clientURL+"','"+clientPowerLevel+"','"+powerLevelGoal+"');\">\n"+
                    "<li class=\"power-goal-info col-xs-1\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','ctr');\">\n"+
                        "<h2>CTR<br><i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i><a class=\"info-icon\" title=\"Click Through Rate for the ranking position and current keyword.\"> </a></h2>\n"+
                    "</li>\n"+
                    //"<li class=\"monthly-organic-info col-lg-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','monthly-content','"+totalPowerLevel+"','"+avgRank+"','"+avgCTR+"','"+clientCTR+"','"+clientRanking+"','"+clientURL+"','"+clientPowerLevel+"','"+powerLevelGoal+"');\">\n"+
                    "<li class=\"monthly-organic-info col-xs-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','monthly-backlinks');\">\n"+
                        "<h2>Total<br>Backlinks<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i></h2>\n"+
                    "</li>\n"+
                    "<li class=\"monthly-organic-info col-xs-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','monthly-content');\">\n"+
                        "<h2>Monthly<br>Content<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i><a class=\"info-icon\" title=\"The number of off-site content produced monthly with this keyword phrase as the topic.\"> </a></h2>\n"+
                    "</li>\n"+
                "</ul>\n";
        var showWarning = false;
        
        //competitorHTML += "<ul class=\"power-summary-row-hidden\" id=\"competitorsList\">";
        var competitorsCount = 0;
        var totalCTR = 0;
        var totalPowerLevel = 0;
        var totalRank = 0;
        var totalBacklinks = 0;
        
        var c1 = "";
        var c2 = "";
        var c3 = "";
        var c4 = "";
        var c5 = "";
        var disabled = false;
        
        var unhackedCompetitorExists = false;
        //competitorHTML += "<div class=\"col-lg-12\" id=\"competitorsList-"+keywordID+"\">";
        for(var j=0; j<thisCompetitorArray.length; j++)
        {
            var thisCompetitor = thisCompetitorArray[j];
            
            if(thisCompetitor.disabled == 1)
            {
                disabled = true;
            }
            else
            {
                disabled = false;
            }
            var competitorID = thisCompetitor.competitorID;
            var competitorActive = thisCompetitor.active;
            var competitorAhrefsStarted = thisCompetitor.ahrefsStarted;
            var competitorAhrefsCompleted = thisCompetitor.ahrefsCompleted;
            var competitorPositionRank = thisCompetitor.positionRank;
            var competitorURL = thisCompetitor.url;
                var competitorURLShort = competitorURL.substring(0,30);
                if(competitorURL.length > 30) { competitorURLShort += "..."; }
                
            if(competitorAhrefsStarted == 0 && competitorActive == 1)
            {
                unhackedCompetitorExists = true;
            }
                
                
            if(j == 0)
            {
                c1 = competitorURL;
            }
            else if(j == 1)
            {
                c2 = competitorURL;
            }
            else if(j == 2)
            {
                c3 = competitorURL;
            }
            else if(j == 3)
            {
                c4 = competitorURL;
            }
            else if(j == 4)
            {
                c5 = competitorURL;
            }
                
            var competitorCTR = Math.round(thisCompetitor.traffic);
            var competitorCTRExact = Math.round(thisCompetitor.trafficExact);
            //var competitorMonthlyContent = thisCompetitor.competitorMonthlyContent;
            
            var ctrType = "";
            /*var ctrType = " (b)";
            if(typeof competitorCTRExact != "undefined")
            {
                if(competitorCTRExact > 0)
                {
                    competitorCTR = competitorCTRExact;
                    ctrType = " (e)";
                }
            }*/
            
            //var competitorPowerLevel = thisCompetitor.powerLevel;
            var competitorPowerLevel = thisCompetitor.competitorMonthlyContent;
            var competitorMonthlyBacklinks = thisCompetitor.competitorMonthlyBacklinks;
            var competitorTotalBacklinks = thisCompetitor.competitorTotalBacklinks;
            var competitorContentCountHTML = "";
            var competitorMonthlyBacklinksHTML = "";
            if(competitorPowerLevel < 0 && keywordStatus == "hacking" && competitorActive == 1)
            {
                competitorContentCountHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            }
            else if(competitorPowerLevel < 0)
            {
                //competitorContentCountHTML = "<span style=\"width:100;background-color:#808080;color:#808080;\">?</span>";
                competitorContentCountHTML = "";
            }
            else
            {
                competitorContentCountHTML = competitorPowerLevel;
            }
            
            if(competitorAhrefsCompleted == 0 && keywordStatus == "hacking" && competitorActive == 1)
            {
                competitorMonthlyBacklinksHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            }
            else if(competitorMonthlyBacklinks < 0 || competitorAhrefsStarted == 0)
            {
                //competitorContentCountHTML = "<span style=\"width:100;background-color:#808080;color:#808080;\">?</span>";
                competitorContentCountHTML = "";
            }
            else
            {
                //competitorMonthlyBacklinksHTML = competitorMonthlyBacklinks;
                competitorMonthlyBacklinksHTML = numberWithCommas(parseInt(competitorTotalBacklinks));
            }
            
            /*if(competitorPowerLevel > 9 && competitorActive == 1)
            {
                showWarning = true;
            }*/
            showWarning = false;
            
            
            var competitorCheckboxStatus = "";
            var seoInsuranceHTML = "";
            if(competitorActive == 1 && !disabled)
            {
                competitorCheckboxStatus = "checked";
                competitorsCount++;
                totalCTR += competitorCTR;
                totalPowerLevel += competitorPowerLevel;
                totalRank += competitorPositionRank;
                totalBacklinks += competitorMonthlyBacklinks;
            }
            
            if(thisCompetitor.disabled == 1)
            {
                competitorCheckboxStatus = " disabled";
                seoInsuranceHTML = "<span class=\"text-right\" style=\"vertical-align:middle;float:right;padding-right:5px;padding-top:10px;\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"\" data-original-title=\"Coming soon! Buy insurance for your top 10 ranking!\"><img src=\"images/seo-insurance-icon.png\" style=\"width:25px;height:auto;\"></a></span>";
            }
            //if(competitorsCount == 0) { competitorsCount = 1;}
            
            competitorHTML += "<ul class=\"power-summary-row col-xs-12\" style=\"margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-1\">\n"+
                                    "<h2 class=\"rh-checkbox-padded\" style=\"text-align:center;\">\n"+
                                        "<input type=\"checkbox\" class=\"filled-in rh-checkbox rh-checkbox-padded\" "+competitorCheckboxStatus+" id=\"chk-content-all-c"+competitorID+"\" onchange=\"toggleCompetitor('"+competitorID+"',this.checked,'"+i+"','"+keywordID+"');\">\n"+
                                        "<label for=\"chk-content-all-c"+competitorID+"\"></label>\n"+
                                    "</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-summary-rank col-xs-1\">\n"+
                                    "<h2>"+competitorPositionRank+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-5 power-summary-competionurl\">\n"+
                                    "<h2 title=\""+competitorURL+"\">"+competitorURLShort+"<a title=\"Copy full URL to clipboard\" id=\"copy-anchor-"+competitorID+"\" class=\"copy-button\" onmouseover=\"resetTitle('"+competitorID+"');\" onclick=\"showCopiedConfirmation('"+competitorID+"');\" data-clipboard-action=\"copy\" data-clipboard-text=\""+competitorURL+"\"><i class=\"fa fa-copy fa-blue\" id=\"copy-icon-"+competitorID+"\" style=\"padding-left:5px;cursor:pointer;\"></i></a></h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"col-xs-1 power-summary-rank desktop-hidden\">\n"+
                                    "<h2>"+competitorPositionRank+"</h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"power-goal-info col-xs-1 power-summary-ctr\">\n"+
                                    "<h2>"+competitorCTR+"%"+ctrType+"</h2>\n"+
                                "</li>\n"+
                                
                                "<li class=\"col-xs-2 power-summary-monthly-backlinks"+shadedString+"\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-competitorid-"+competitorID+"-backlinks\">"+competitorMonthlyBacklinksHTML+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-offsite-content"+shadedString+"\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-competitorid-"+competitorID+"-content\">"+competitorContentCountHTML+"</h2>"+seoInsuranceHTML+"\n"+
                                "</li>\n"+                                
                            "</ul>\n";
        }
        
        //var needToHackHTML = "<div class=\"reveal-content-btn\"><span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button-white-bg\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\">REVEAL CONTENT</span></div>";
        var needToHackHTML = "<div class=\"reveal-content-btn\"><span id=\"get-the-hack-2-"+i+"\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\"><img src=\"images/reveal-button.png\" style=\"cursor:pointer;\"></span></div>";
        if(shadedString != "")
        {
            competitorHTML += needToHackHTML;
        }
        //competitorHTML += "</div>";
        
        if(competitorsCount == 0) { competitorsCount = 1;}
        
        //Hidden element to keep track of how many competitors you've selected
        competitorHTML += "<input id=\"kwid-"+keywordID+"-competitorsCount\" type=\"hidden\" value=\""+competitorsCount+"\">\n";
        
        var competitorAvgCount = Math.ceil(totalPowerLevel/competitorsCount);
        var competitorAvgBacklinks = Math.round(totalBacklinks/competitorsCount);
        if(competitorAvgCount < 0)
        {
            competitorAvgCount = "?";
        }
        if(competitorAvgBacklinks < 0 || unhackedCompetitorExists)
        {
            competitorAvgBacklinks = "?";
        }
        
        //Add in the average row
        competitorHTML += "<ul class=\"power-summary-row-avg col-xs-12\" style=\"background-color:#e6e6e6;margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-1\" style=\"background-color:#e6e6e6;padding-left:15px;\">\n"+
                                    "<h2><b>AVG</b></h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-1 power-summary-rank\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-avg-rank\">"+Math.round(totalRank/competitorsCount)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-5 power-summary-competionurl\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2>Selected Competitors</h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"col-xs-1 power-summary-rank desktop-hidden\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-avg-rank\">"+Math.round(totalRank/competitorsCount)+"</h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"power-goal-info col-xs-1 power-summary-ctr\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-avg-ctr\">"+Math.round(totalCTR/competitorsCount)+"%</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-monthly-backlinks\" style=\"background-color:#e6e6e6;border-right:1px solid #e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-table-total-backlinks\">"+competitorAvgBacklinks+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-offsite-content\" style=\"padding-left:15px;padding-right:15px;background-color:#e6e6e6;border-right:1px solid #e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-table-total-pl\">"+competitorAvgCount+"</h2>\n"+
                                "</li>\n"+
                            "</ul>\n";
         
        
        //Add in the user's row
        competitorHTML += "<ul class=\"power-summary-row-you col-xs-12\" style=\"background-color:#e6f2ff;margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-1\" style=\"background-color:#e6f2ff;padding-left:15px;\">\n"+
                                    "<h2><b>YOU</b></h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-1 power-summary-rank\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientRanking+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-5 power-summary-competionurl\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientURL+"</h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"col-xs-1 power-summary-rank desktop-hidden\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientRanking+"</h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"power-goal-info col-xs-1 power-summary-ctr\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientCTR+"%</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-monthly-backlinks\" style=\"background-color:#e6f2ff;border-right:1px solid #e6f2ff;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-user-monthly-backlinks-count\">"+userMonthlyBacklinks+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-offsite-content\" style=\"padding-left:15px;padding-right:15px;background-color:#e6f2ff;border-right:1px solid #e6f2ff;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-user-monthly-content-count\">"+userMonthlyContent+"</h2>\n"+
                                "</li>\n"+
                            "</ul>\n";
        //competitorHTML += "<!--</div>-->\n";
        
        
        //Add in the summary row
        competitorHTML += "<ul class=\"power-summary-row-highlight col-xs-12\" style=\"background-color:#005cb9;color:#fff;border-right:1px solid #005cb9;margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-10\" style=\"background-color:#005cb9;border-right:1px solid #005cb9;padding-left:15px;\">\n"+
                                    "<h2 style=\"color:#fff;\"><a data-toggle=\"tooltip\" title=\"Monthly Content Goal = Competitors' Average Monthly Content - Your Monthly Content\" class=\"tooltip-hover\" style=\"color:#fff;\"><b>YOUR MONTHLY CONTENT GOAL</b></a></h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2\" style=\"padding-left:15px;padding-right:15px;background-color:#005cb9;color:#fff;border-right:1px solid #005cb9;margin-left:-4px;\">\n"+
                                    "<h2 style=\"color:#fff;font-size:16px;\" id=\"kwid-"+keywordID+"-plg-2\"><b>"+keywordTotalContentDiffHTML+"</b></h2>\n"+
                                "</li>\n"+
                            "</ul>\n";
                    
        competitorHTML += "</div>\n"+
                      "</div>\n";
        
        //Now put the info for client ranking power
        var plgHTML = "<div class=\"col-lg-6 you-power-summary-section\">\n"+
                                    "<!--<h2 class=\"power-summary-heading\"><span class=\"tag-label\">YOU</span> YOUR RANKING POWER LEVEL IS <span class=\"total-power-summery\">"+clientPowerLevel+"</span></h2>\n"+
                                    "<div class=\"divider\"></div>-->\n"+
                                    "<!--<ul class=\"power-summary-row power-summary-heading-row\">\n"+
                                        "<li class=\"checkbox-outer col-lg-1\"> &nbsp; </li>\n"+
                                        "<li class=\"keyword-phraser-tittle col-lg-2\">\n"+
                                            "<h2>Google Rank</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"power-goal-info col-lg-7\">\n"+
                                            "<h2>Your URL</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"monthly-organic-info col-lg-2\">\n"+
                                            "<h2>Power Level<a class=\"info-icon\" title=\"Represents the level of marketing effort required for each keyword.\"> </a></h2>\n"+
                                        "</li>\n"+
                                    "</ul>-->\n"+
                                    "<!--<ul class=\"power-summary-row\">\n"+
                                        "<li class=\"checkbox-outer col-lg-1\">\n"+
                                            "<h2 class=\"rh-checkbox-padded\">\n"+
                                                "<input type=\"checkbox\" class=\"filled-in rh-checkbox rh-checkbox-padded\" checked disabled id=\"chk-content-all2\">\n"+
                                                "<label for=\"chk-content-all2\"></label>\n"+
                                            "</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"col-lg-2\">\n"+
                                            "<h2>"+clientRanking+"</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"col-lg-7\">\n"+
                                            "<h2>"+clientURL+"</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"col-lg-2\">\n"+
                                            "<h2>"+clientPowerLevel+"</h2>\n"+
                                        "</li>\n"+
                                    "</ul>-->\n";
                            
            if(showWarning)
            {
                plgHTML += "<div class=\"warrining-message\" id=\"warning-message-head-"+keywordID+"\">\n"+
                                        "<div class=\"col-md-2 warrining-icon\"><img src=\"images/warning-sign-white.png\" alt=\"\"></div>\n"+
                                        "<div class=\"col-md-10\" style=\"margin:0;\">\n"+
                                            "<h2>You have some tricky competitors</h2>\n"+
                                        "</div>\n"+
                                    "</div>\n";
                plgHTML += "<div class=\"row\" id=\"warning-message-body-"+keywordID+"\">\n"+
                                        "<div class=\"col-md-1\"></div>\n"+
                                        "<div class=\"col-md-11\" style=\"padding:10px;\">\n"+
                                            "&middot;&nbsp;You may want to uncheck competitor urls whose power level exceedes 9</li>\n"+
                                        "</div>\n"+
                                    "</div>\n";
            }
                plgHTML += "<div class=\"power-goal-section\">\n"+
                                        "<div>\n"+
                                            "<div class=\"col-xs-3 goal-img\"><img src=\"images/goal-img.png\" alt=\"\"></div>\n"+
                                            "<div class=\"goal-details col-xs-9\">\n"+
                                                "<h1 style=\"margin-bottom:15px;\">Your Monthly Content Goal</h1>\n"+
                                                "<span id=\"kwid-"+keywordID+"-their-pl\" class=\"their-power-level-box\">"+competitorAvgCount+"</span>\n"+
                                                "<span class=\"your-power-level-box\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" style=\"background:transparent;\" title=\"Click to edit your monthly content\"><input type=\"text\" onchange=\"changeUserMonthlyContent('"+keywordID+"','"+i+"');\" class=\"transparent-text-input\" id=\"kwid-"+keywordID+"-your-pl\" value=\""+userMonthlyContent+"\"/></a></span>\n"+
                                                "<span id=\"kwid-"+keywordID+"-plg-3\" class=\"net-power-level-box\">"+boxGoalHTML+"</span>\n"+
                                             "<div class=\"goal-details col-md-12\">\n"+
                                                "<span class=\"their-power-level-label\">Their Monthly<br>Content</span>\n"+
                                                "<span class=\"your-power-level-label\">Your Monthly<br>Content</span>\n"+
                                                "<span class=\"net-power-level-label\">Your Monthly<br>Content Goal</span>\n"+
                                            "</div>\n"+
                                            "</div>\n"+
                                            "<div class=\"goal-details col-md-12\">\n"+
                                                "<h3>To match the marketing aggression of your competitors for this keyword you need to increase your content creation by <span id=\"kwid-"+keywordID+"-plg-4\" style=\"color:#005cb9;\">"+keywordTotalContentDiffHTML+"</span> per month</h3>\n"+
                                                "<p>We've analyzed your competitors' content marketing strategies to determine their monthly content creation schedule. Next, we subtracted your current monthly content creation total from theirs in order to set a monthly content goal.</p>\n"+
                                                "<p style=\"margin-top:50px;\" id=\"big-hack-content-"+i+"\">"+bigHackContentButton+"</p>\n"+
                                            "</div>"+
                                            "<!--<div class=\"goal-details col-md-12\" style=\"margin-top:250px;vertical-align:bottom;\">\n"+
                                                "<span><img src=\"images/header_arrow.png\" class=\"hack-content-arrow\"></span>\n"+
                                                "<span class=\"get-the-hack-statement\">Hack the content strategies of your competitors.</span>"+bigHackContentButton+"\n"+
                                            "</div>-->"+
                                        "</div>"+
                                    "</div>\n";
                
        
            plgHTML += "</div>\n";
            
            //Add in the competitorHTML we already built, and finish off the div
            accordianHTML += competitorHTML + plgHTML + "</div>\n" +
                                                "</div>\n" +
                                            "</div>\n";
    }
    
    document.getElementById('main-panel').style.display = "";
    $('#keyword-phraser-accordion').html(accordianHTML);
    
    var suggestedKeywordsHTML = "";
    var suggestedKeywords;
    var grSuggestedKeywords = info.grSuggestedKeywords;
    if(grSuggestedKeywords.length > 0)
    {
        suggestedKeywords = info.grSuggestedKeywords;
    }
    else
    {
        suggestedKeywords = info.suggestedKeywords;
    }
    
    for(var i=0; i<suggestedKeywords.length; i++)
    {
        if(i<35)
        {
            suggestedKeywordsHTML += "<li data-type=\"1\">"+suggestedKeywords[i]+"</li>";
        }
        else
        {
            suggestedKeywordsHTML += "<li data-type=\"1\" class=\"read-more-target\">"+suggestedKeywords[i]+"</li>";
        }
    }
    $("#suggestedKeywordsList").html(suggestedKeywordsHTML);
    
    var altSuggestedKeywordsHTML = "";
    var altSuggestedKeywords = info.altSuggestedKeywords;
    for(var i=0; i<altSuggestedKeywords.length; i++)
    {
        if(i<35)
        {
            altSuggestedKeywordsHTML += "<li data-type=\"2\">"+altSuggestedKeywords[i]+"</li>";
        }
        else
        {
            altSuggestedKeywordsHTML += "<li data-type=\"2\" class=\"read-more-target\">"+altSuggestedKeywords[i]+"</li>";
        }
    }
    $("#altSuggestedKeywordsList").html(altSuggestedKeywordsHTML);
    
    //$("#keyword-phraser-collapse"+firstCounter).addClass("in");
    //$("#keyword-phraser-heading"+firstID).find(".keyword-row-arrow").attr("src","images/keyword_row_arrow_yellow.png");
    //$("#kw-panel-div"+firstID).addClass("active");
    //$("#caret-"+firstID).removeClass("fa-caret-right").addClass("fa-caret-down");
    
    document.getElementById('loading_spinner').style.display = "none";
    document.getElementById('loading_spinner_message').style.display = "none";
    $('body').removeClass('wait');
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
}

function toggleCompetitor(competitorID,checked,keywordCounter,keywordID)
{
    $('body').addClass('wait');
    //Hide the Get the Hack buttons
    $("#get-the-hack-1-"+keywordCounter).hide(200);
    $("#get-the-hack-2-"+keywordCounter).hide(200);
    //document.getElementById("get-the-hack-1-"+keywordCounter).style.display = "none";
    //document.getElementById("get-the-hack-2-"+keywordCounter).style.display = "none";

    var projectID = getURLParameter("pid");
    var active = "";
    if(checked)
    {
        active = "1";
    }
    else
    {
        active = "0";
    }
    
    var canSelect = true;
    var selectedCount = $("#kwid-"+keywordID+"-competitorsCount").val();
    
    /*if(active == "1" && selectedCount >= 5)
    {
        canSelect = false;
    }*/
    
    if(competitorID != '' && projectID != '')
    {
        if(canSelect)
        {
            //Overwrite the project-level and keyword-level keyword net worth texts with the progress bar spinner
            //$("#kwNetWorth").html("<img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/>");
            $("#kwNetWorth").html("<span class=\"loader__dot\" style=\"font-size:15px;color:red;\">calculating...</span>");
            //$("#kwid-"+keywordID+"-kw-net-worth").html("<img src=\"images/thin_stripe_progress.gif\" class=\"intermediate-progress-bar\"/>");
            $("#top-hack-content-"+keywordCounter).html("<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>");
            
            //Save the original competitor ID and value
            $("#orig-competitor-id").val(competitorID);
            if(active == "1")
            {
                $("#orig-competitor-checked").val("0");
            }
            else
            {
                $("#orig-competitor-checked").val("1");
            }
            
            $.ajax({url: restURL, data: {'command':'toggleCompetitorActive','projectid':projectID,'competitorid':competitorID,'active':active}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        $('#json').val(returnData);

                        var field = $('#keyword-sort-method').val();
                        refreshKeywordInfo(returnData,field,keywordID);
                        refreshKeywordSuggestions();
                        //refreshProjectData_old(keywordCounter);
                        //refreshProjectData(keywordCounter);
                        
                    }
                }
            });
        }
        else
        {
            $('body').removeClass('wait');
            showAlert("You may only select 5 competitors.");
            $("#chk-content-all-c"+competitorID).prop("checked",false);
        }
    }
}

function toggleKeyword(keywordID,checked)
{
    $('body').addClass('wait');

    var projectID = getURLParameter("pid");
    var active = "";
    if(checked)
    {
        active = "1";
    }
    else
    {
        active = "0";
    }
    
    if(keywordID != '' && projectID != '')
    {
        var keywordCount = 0;
        
        //Overwrite the project-level and keyword-level keyword net worth texts with the progress bar spinner
        //$("#kwNetWorth").html("<img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/>");
        $("#kwNetWorth").html("<span class=\"loader__dot\" style=\"font-size:15px;color:red;\">calculating...</span>");
        //$("#kwid-"+keywordID+"-kw-net-worth").html("<img src=\"images/thin_stripe_progress.gif\" class=\"intermediate-progress-bar\"/>");
        //$("#top-hack-content-"+keywordID).html("<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>");
        
        //Change the background color if it's inactive
        if(active == "0")
        {
            //$("#keyword-phraser-heading"+keywordID).css('background-color','#b3b3b3');
            $("#keyword-phraser-heading"+keywordID).fadeTo(400,0.33,function(){});
            
            //First update the keyword count
            keywordCount = parseInt($("#numKeywords").html())-1;
        }
        else
        {
            //$("#keyword-phraser-heading"+keywordID).css('background-color','#fff');
            $("#keyword-phraser-heading"+keywordID).fadeTo(400,1.0,function(){});
            //First update the keyword count
            keywordCount = parseInt($("#numKeywords").html())+1;
        }
        
        $("#numKeywords").html(keywordCount);
        
        $.ajax({url: restURL, data: {'command':'toggleKeywordActive','projectid':projectID,'keywordid':keywordID,'active':active}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    refreshProjectData(-1,keywordID);
                    $('body').removeClass('wait');
                }
            }
        });
    }
}

function addKeywordToProject(keyword)
{
    var projectID = getURLParameter("pid");
    if(projectID != '' && keyword.trim() != '')
    {
        $.ajax({url: restURL, data: {'command':'addProjectKeyword','projectid':projectID,'keyword':keyword}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    //loadProjectData();
                    window.location.reload();
                }
            }
        });
    }
}

function refreshProjectData(keywordCounter,keywordID)
{
    var projectID = getURLParameter("pid");
    if(projectID != '')
    {
        $.ajax({url: restURL, data: {'command':'getProjectData','projectid':projectID}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    //Save this to local storage so that it can be sent to the PDF printer service
                    $('#json').val(returnData);

                    var field = $('#keyword-sort-method').val();

                    if(keywordCounter > -1)
                    {
                        refreshKeywordInfo(returnData,field,keywordID);
                        refreshKeywordSuggestions();
                    }
                    else
                    {
                        displayProjectInfo(field,false);
                    }
                }
            }
        });
    }
    else
    {
        window.location = "dashboard.html";
    }
}

function refreshProjectInfo(keywordCounter)
{
    var returnData = $('#json').val();
    var info = JSON.parse(returnData);
    
    var origCompetitorID = $("#orig-competitor-id").val();
    var origCompetitorChecked = $("#orig-competitor-checked").val();
    
    //Fill in the project data here
    var projectInfo = info.projectSummary;
        var projectID = projectInfo.projectID;
        var runDate = projectInfo.runDate;
        var costPerLevel = projectInfo.costPerLevel;
        var searchVolume = projectInfo.searchVolume;
        var clientURL = projectInfo.clientURL;
        var valuePerCustomer = projectInfo.valuePerCustomer;
        var active = projectInfo.active;
        var completed = projectInfo.completed;
        var totalPowerLevel = projectInfo.totalPowerLevel;
        var clientDA = projectInfo.clientDA;
        var clientPA = projectInfo.clientPA;
        var incomingTraffic = Math.round(projectInfo.incomingTraffic,0);
        var runDateRaw = projectInfo.runDateRaw;
        var keywordCount = projectInfo.keywordCount;
        var geoLocation = projectInfo.geoLocation;
        var monthlyVisitors = projectInfo.monthlyVisitors;
        var payingCustomers = projectInfo.payingCustomers;
        var currencyHexCode = projectInfo.currencyHexCode;
        var useDefaultConversionRate = projectInfo.useDefaultConversionRate;
        
        var projectTotalContentDiff = projectInfo.projectTotalContentDiff;
        
        var customerConversionRate = projectInfo.defaultConversionRate;
        if(monthlyVisitors !== 0 && payingCustomers !== 0 && useDefaultConversionRate !== 1)
        {
            customerConversionRate = (payingCustomers / monthlyVisitors);
        }
        
        var monthlyCustomers = Math.round(incomingTraffic * customerConversionRate,0);
        var monthlySales = Math.round(monthlyCustomers * valuePerCustomer,0);
        //var costPerMonth = Math.round((totalPowerLevel * costPerLevel),0);
        var costPerMonth = Math.round((projectTotalContentDiff * costPerLevel),0);
        var keywordNetWorth = (monthlySales - costPerMonth);
        
        //var netWorthStyle = "green-text";
        var netWorthStyle = "white-text";
        if(keywordNetWorth < 0 || completed != 1)
        {
            netWorthStyle = "red-text";
        }
        
        //Iterate through the keywords to see if any are in "hacking" status; if so, show the warning message
        var currentlyHacking = false;
        var currentlyAdding = false;
        var tempKeywordInfo = info.keywordData;
        for(var t=0; t<tempKeywordInfo.length; t++)
        {
            var tempEntry = tempKeywordInfo[t];
            var tempStatus = tempEntry.status;
            if(tempStatus == "hacking")
            {
                currentlyHacking = true;
            }
            if(tempStatus == "adding")
            {
                currentlyAdding = true;
            }
        }
        
        var keywordNetWorthString = "";
        if(completed != 1 || currentlyHacking || currentlyAdding)
        {
            keywordNetWorthString = "<span class=\"loader__dot\" style=\"font-size:15px;color:red;\">calculating...</span>";
            //Show the warning message at top, and set the flag to keep checking
            if(currentlyAdding)
            {
                $("#warning-message-content").html("Your keywords are being added. You can manually refresh this page to get the latest info, or we'll let you know as soon as all the numbers are in!");
            }
            else if(currentlyHacking)
            {
                $("#warning-message-content").html("We are hacking the content strategies of your selected competitors. This report could take several minutes to complete but it's worth the wait!");
            }
            $("#warning-message").show(400);
            $("#check-project-done-flag").val(1);
        }
        else
        {
            keywordNetWorthString = currencyHexCode+numberWithCommas(keywordNetWorth);
        }
        
        var activeString = "";
        if(active == 1)
        {
            activeString = "ACTIVE";
        }
        else
        {
            activeString = "INACTIVE";
        }
        
        if(typeof searchVolume === 'undefined') {searchVolume = 0;}
        if(typeof incomingTraffic === 'undefined') {incomingTraffic = 0;}
        if(typeof payingCustomers === 'undefined') {payingCustomers = 0;}
        if(typeof monthlyVisitors === 'undefined') {monthlyVisitors = 0.0000001;}
        if(typeof monthlySales === 'undefined') {monthlySales = 0;}
        if(typeof costPerMonth === 'undefined' || keywordCount == 0) {costPerMonth = 0;}
        
        $('#projectTitle').html(clientURL+"<span><a style=\"cursor:pointer;margin-left:7px;\" class=\"edit-icon\" title=\"Edit Mission\" onclick=\"gotoCreateProject('"+projectID+"');\"></a><!--<a style=\"cursor:pointer;margin-left:7px;margin-top:3px;color:rgba(61,61,61,.25);\" title=\"Download\" class=\"download-icon\" onclick=\"javascript:void(0);\"></a>--></span>");
        $('#numKeywords').html(keywordCount);
        $('#geoLocation').html("<h2>"+geoLocation+"<!--<a class=\"edit-icon\" title=\"Edit Location\"></a>--></h2>");
        /*$('#searchVolume').html("<h2>"+numberWithCommas(searchVolume)+"<span>MO,SEARCH VOLUME<a class=\"info-icon\" title=\"This is the total sum of monthly search volume for all selected keywords in this project.\"></a></span></h2>");
        $('#projectedVisitors').html("<h2>"+numberWithCommas(incomingTraffic)+"<span>PROJECTED MO. VISITORS<a class=\"info-icon\" title=\"Calculated by applying the average CTR for your competitors to Mo. Search Volume.\"></a></span></h2>");
        $('#projectedCustomers').html("<h2>"+numberWithCommas(Math.round(incomingTraffic * (payingCustomers / monthlyVisitors),0))+"<span>PROJECTED MO. CUSTOMERS<a class=\"info-icon\" title=\"Calculated based on your conversion rate.\"></a></span></h2>");
        $('#projectedSales').html("<h2>$"+numberWithCommas(monthlySales)+"<span>PROJECTED MO. SALES<a class=\"info-icon\" title=\"Calculated based on your conversion rate and customer value.\"></a></span></h2>");
        $('#costPerMonth').html("<h2>$"+numberWithCommas(costPerMonth)+"<span>COST PER MONTH<a class=\"info-icon\" title=\"This is the total sum of monthly costs for all selected keywords in this project.\"></a></span></h2>");
        $('#kwNetWorth').html("<h2 class=\""+netWorthStyle+"\">"+keywordNetWorthString+"<span>KEYWORD NET-WORTH<a class=\"info-icon\" title=\"This is the projected return on your invested marketing dollars for all selected keywords in this project.\"></a></span></h2>");*/
        $('#searchVolume').html("<h2>"+numberWithCommas(searchVolume)+"<span>MO. SEARCH VOLUME</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
        $('#projectedVisitors').html("<h2>"+numberWithCommas(incomingTraffic)+"<span>PROJ. MO. VISITORS</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
        $('#projectedCustomers').html("<h2>"+numberWithCommas(Math.round(incomingTraffic * customerConversionRate,0))+"<span>PROJ. MO. CUSTOMERS</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
        $('#projectedSales').html("<h2>"+currencyHexCode+numberWithCommas(monthlySales)+"<span>PROJ. MO. SALES</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
        $('#costPerMonth').html("<h2>"+currencyHexCode+numberWithCommas(costPerMonth)+"&nbsp;<font style=\"color:#598a9e;font-size:12px;\">("+projectTotalContentDiff+" pcs)</font><span>COST PER MONTH</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
        $('#kwNetWorth').html("<h2 class=\""+netWorthStyle+"\" style=\"background-color:#000;\">"+keywordNetWorthString+"<span style=\"background-color:#fff;\">KEYWORD NET-WORTH</span></h2>");
        $('#dateDivBottom').html("<div class=\"project-date-card date_sort\"><i class=\"eagle-icon\"></i>Initiated "+runDate+"</div><a class=\"project-status-card  project_status_sort\" href=\"javascript:void(0);\">"+activeString+"</a>");

    //Fill in the keyword data here
    var accordianHTML = "";
    var keywordInfo = info.keywordData;
    for(var i=0; i<keywordInfo.length; i++)
    {
        var thisEntry = keywordInfo[i];
        var thisCompetitorArray = thisEntry.competitorData;
        var keywordID = thisEntry.keywordID;
        
        //Cycle through and see if any competitors have PLG of 10; if so, show the warning, else hide it.
        var competitorsCount = 0;
        var totalCTR = 0;
        var keywordTotalPowerLevel = 0;
        var totalRank = 0;
        var totalBacklinks = 0;
        var showWarning = false;
        
        var competitorsAverageMonthlyContent = thisEntry.competitorsAverageMonthlyContent;
        var userMonthlyContent = thisEntry.userMonthlyContent;
        var userMonthlyBacklinks = thisEntry.userMonthlyBacklinks;
        var keywordTotalContentDiff = thisEntry.keywordTotalContentDiff;
        var keywordStatus = thisEntry.status;
            //keywordStatus = "initial_done";
        
        
        if(userMonthlyContent == "-1")
        {
            userMonthlyContent = "?";
        }
        if(userMonthlyBacklinks == "-1")
        {
            userMonthlyBacklinks = "?";
        }
        
        var unhackedCompetitorExists = false;
        var disabled;
        for(var j=0; j<thisCompetitorArray.length; j++)
        {
            var thisCompetitor = thisCompetitorArray[j];
            
            if(thisCompetitor.disabled == 1)
            {
                disabled = true;
            }
            else
            {
                disabled = false;
            }
            var competitorID = thisCompetitor.competitorID;
            var competitorActive = thisCompetitor.active;
            var competitorAhrefsStarted = thisCompetitor.ahrefsStarted;
            var competitorAhrefsCompleted = thisCompetitor.ahrefsCompleted;
            var competitorPositionRank = thisCompetitor.positionRank;
            var competitorPowerLevel = thisCompetitor.powerLevel;
            var competitorMonthlyBacklinks = thisCompetitor.competitorMonthlyBacklinks;
            var competitorTotalBacklinks = thisCompetitor.competitorTotalBacklinks;
            var competitorContentCountHTML = "";
            var competitorMonthlyBacklinksHTML = "";
            var competitorCTR = Math.round(thisCompetitor.traffic);
            var competitorCTRExact = Math.round(thisCompetitor.trafficExact);
            
            if(competitorAhrefsStarted == 0 && competitorActive == 1)
            {
                unhackedCompetitorExists = true;
            }
            
            if(competitorPowerLevel < 0 && keywordStatus == "hacking" && competitorActive == 1)
            {
                competitorContentCountHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            }
            else if(competitorPowerLevel < 0)
            {
                competitorContentCountHTML = "?";
            }
            else
            {
                competitorContentCountHTML = competitorPowerLevel;
            }
            
            if(competitorAhrefsCompleted == 0 && keywordStatus == "hacking" && competitorActive == 1)
            {
                competitorMonthlyBacklinksHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            }
            else if(competitorMonthlyBacklinks < 0 || competitorAhrefsStarted == 0)
            {
                competitorMonthlyBacklinksHTML = "?";
            }
            else
            {
                //competitorMonthlyBacklinksHTML = competitorMonthlyBacklinks;
                competitorMonthlyBacklinksHTML = numberWithCommas(parseInt(competitorTotalBacklinks));
            }
            
            /*var cognitiveStarted = thisCompetitor.cognitiveStarted;
            var cognitiveCompleted = thisCompetitor.cognitiveCompleted;
            if(competitorActive == 1 && cognitiveStarted == 0)
            {
                keywordStatus = "initial_done";
            }
            else if(competitorActive == 1 && cognitiveStarted == 1 && cognitiveCompleted == 0)
            {
                keywordStatus = "hacking";
            }*/

            var ctrType = "";
            /*var ctrType = " (b)";
            if(typeof competitorCTRExact != "undefined")
            {
                if(competitorCTRExact > 0)
                {
                    competitorCTR = competitorCTRExact;
                    ctrType = " (e)";
                }
            }*/
            /*var competitorPowerLevel = thisCompetitor.competitorMonthlyContent;
            var competitorContentCountHTML = "";
            if(competitorPowerLevel < 0 && keywordStatus == "hacking" && competitorActive == 1)
            {
                competitorContentCountHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            }
            else if(competitorPowerLevel < 0)
            {
                competitorContentCountHTML = "?";
            }
            else
            {
                competitorContentCountHTML = competitorPowerLevel;
            }*/

            /*if(competitorPowerLevel > 9 && competitorActive == 1)
            {
                showWarning = true;
            }*/
            showWarning = false;
            
            var competitorCheckboxStatus = "";
            var seoInsuranceHTML = "";
            /*if(competitorActive == 1 && !disabled)
            {
                competitorCheckboxStatus = "checked";
                competitorsCount++;
                totalCTR += competitorCTR;
                //totalPowerLevel += competitorPowerLevel;
                totalRank += competitorPositionRank;
                totalBacklinks += competitorMonthlyBacklinks;
                keywordTotalPowerLevel += competitorPowerLevel;
                //totalRank += competitorPositionRank;
            }*/
            
            if(competitorActive == 1)
            {
                competitorCheckboxStatus = "checked";
                competitorsCount++;
                totalCTR += competitorCTR;
                totalPowerLevel += competitorPowerLevel;
                totalRank += competitorPositionRank;
                totalBacklinks += competitorMonthlyBacklinks;
            }
            
            if(thisCompetitor.disabled == 1)
            {
                competitorCheckboxStatus = " disabled";
                seoInsuranceHTML = "<span class=\"text-right\" style=\"vertical-align:middle;float:right;padding-right:5px;padding-top:10px;\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"\" data-original-title=\"Coming soon! Buy insurance for your top 10 ranking!\"><img src=\"images/seo-insurance-icon.png\" style=\"width:25px;height:auto;\"></a></span>";
            }
            
            /*if(competitorID == origCompetitorID && competitorActive != origCompetitorChecked)
            {
                keywordStatus = "initial_done";
            }*/
        }

        if(competitorsCount == 0) { competitorsCount = 1;}
        
        $("#kwid-"+keywordID+"-competitorsCount").val(competitorsCount);
        
        if(showWarning)
        {
            $("#warning-message-head-"+keywordID).show();
            $("#warning-message-body-"+keywordID).show();
        }
        else
        {
            $("#warning-message-head-"+keywordID).hide();
            $("#warning-message-body-"+keywordID).hide();
        }
        
        var competitorAvgCount = Math.ceil(totalPowerLevel/competitorsCount);
        if(competitorAvgCount < 0)
        {
            competitorAvgCount = "?";
        }
        
        var keywordID = thisEntry.keywordID;
        var searchVolume = thisEntry.searchVolume;
        var keywordActive = thisEntry.active;
        var avgCTR = thisEntry.avgCTR;
        var avgRank = thisEntry.avgRank;
        //var keywordTotalPowerLevel = thisEntry.totalPowerLevel;     //Add back the client power level to the total power level for this keyword
        var keyword = thisEntry.keyword;
        var clientPowerLevel = thisEntry.clientKeywordPowerLevel;
        
        /*var monthlyVisitors = Math.round(searchVolume * avgCTR,0);
        var monthlyCustomers = Math.round(monthlyVisitors * customerConversionRate,0);
        var monthlySales = Math.round(monthlyCustomers * valuePerCustomer,0);
        var costPerMonth = Math.round(Math.max(1,Math.round((keywordTotalPowerLevel/competitorsCount) - clientPowerLevel)) * costPerLevel, 0);
        var keywordNetWorth = (monthlySales - costPerMonth);*/
        var monthlyVisitors = thisEntry.monthlyVisitors;
        var monthlyCustomers = thisEntry.monthlyCustomers;
        var monthlySales = thisEntry.monthlySales;
        var costPerMonth = thisEntry.costPerMonth;
        var keywordNetWorth = thisEntry.keywordNetWorth;
        
        //Trap for nulls on numberWithCommas function
        if(typeof searchVolume === 'undefined') {searchVolume = 0;}
        if(typeof monthlyVisitors === 'undefined') {monthlyVisitors = 0;}
        if(typeof monthlyCustomers === 'undefined') {monthlyCustomers = 0;}
        if(typeof monthlySales === 'undefined') {monthlySales = 0;}
        if(typeof costPerMonth === 'undefined') {costPerMonth = 0;}
        if(typeof keywordNetWorth === 'undefined') {keywordNetWorth = 0;}
        
        var keywordTotalContentDiffHTML = "";
        var topKWNetworth = "";
        var topHackContentHTML = "";
        var bigHackContentButton = "";
        var boxGoalHTML = "";
        if(keywordStatus == "hacked")
        {
            topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)<img src=\"images/add-to-cart-icon.png\" style=\"margin-left:10px;margin-top:-5px;height:20px;width:auto;cursor:pointer;\" onclick=\"addToCart('"+keywordID+"');\"></span>";
            boxGoalHTML = keywordTotalContentDiff;
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button-blue\" onclick=\"getContentReport('"+keywordID+"');\">VIEW CONTENT</span>";
            if(keywordTotalContentDiff >= 0)
            {
                keywordTotalContentDiffHTML = "+" + keywordTotalContentDiff;
            }
            else
            {
                keywordTotalContentDiffHTML = keywordTotalContentDiff;
            }
        }
        else if(keywordStatus == "hacking")
        {
            topHackContentHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            //topHackContentHTML = "$0 (0 pcs)";
            topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            //topKWNetworth = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            boxGoalHTML = "?";
            keywordTotalContentDiffHTML = "?";
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button\" style=\"cursor:default;border:0;\"><img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/></span>";
        }
        else if(keywordStatus == "adding")
        {
            //topHackContentHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            topHackContentHTML = "$0 (0 pcs)";
            //topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            topKWNetworth = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            boxGoalHTML = "?";
            keywordTotalContentDiffHTML = "?";
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button\" style=\"cursor:default;border:0;\"><img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/></span>";
        }
        else
        {
            //It's just been added, not yet hacked
            topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            if(keywordActive == 1)
            {
                //topHackContentHTML = "<span style=\"font-size:20px;color:#808080;text-align:center;margin-left:30%;\">?</span><br/><span style=\"text-align:center;\"><a id=\"get-the-hack-1-"+i+"\" class=\"blueprint-links\" style=\"font-size:9px;\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\">HACK CONTENT</a></span>";
                topHackContentHTML = "<span style=\"font-size:20px;color:#808080;text-align:center;margin-left:25%;\"><img src=\"images/reveal-button.png\" class=\"goal-icon\"></span>";
            }
            else
            {
                topHackContentHTML = "<span style=\"font-size:20px;color:#808080;text-align:center;margin-left:25%;\"><img src=\"images/reveal-button.png\" class=\"goal-icon\"></span>";
            }
            //boxGoalHTML = "<span id=\"get-the-hack-1.5-"+i+"\" class=\"get-the-hack-button-small\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\">HACK<br/>CONTENT</span>";
            boxGoalHTML = "?";
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\">HACK CONTENT</span>";
            keywordTotalContentDiffHTML = "?";
        }
        
        var powerLevelGoal = Math.max(1,Math.round((keywordTotalPowerLevel/competitorsCount) - clientPowerLevel));
        
        //$('#kwid-'+keywordID+'-plg-1').html("<h2>"+powerLevelGoal+"<a data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\" class=\"rh-view-icon\"> </a></h2>");
        $('#kwid-'+keywordID+'-search-volume').html("<h2>"+numberWithCommas(searchVolume)+"</h2>");
        $('#kwid-'+keywordID+'-monthly-visitors').html("<h2>"+numberWithCommas(monthlyVisitors)+"</h2>");
        $('#kwid-'+keywordID+'-monthly-customers').html("<h2>"+numberWithCommas(monthlyCustomers)+"</h2>");
        $('#kwid-'+keywordID+'-monthly-sales').html("<h2>"+currencyHexCode+numberWithCommas(monthlySales)+"</h2>");
        //$('#kwid-'+keywordID+'-cost-per-month').html("<h2>"+currencyHexCode+numberWithCommas(costPerMonth)+"</h2>");
        $('#kwid-'+keywordID+'-cost-per-month').html("<h2>"+topHackContentHTML+"</h2>");
        $('#kwid-'+keywordID+'-kw-net-worth').html("<h2 class=\"\">"+topKWNetworth+"</h2>");
        $('#kwid-'+keywordID+'-plg-2').html(keywordTotalContentDiffHTML);
        $('#kwid-'+keywordID+'-plg-3').html(boxGoalHTML);
        $('#kwid-'+keywordID+'-plg-4').html(keywordTotalContentDiffHTML);
        $('#kwid-'+keywordID+'-total-power-summary').html(keywordTotalPowerLevel);
        $('#kwid-'+keywordID+'-avg-rank').html(Math.round(totalRank/competitorsCount));
        $('#kwid-'+keywordID+'-avg-ctr').html(Math.round(totalCTR/competitorsCount)+"%");
        //$('#kwid-'+keywordID+'-table-total-pl').html(Math.round(keywordTotalPowerLevel/competitorsCount));
        $('#kwid-'+keywordID+'-table-total-pl').html(competitorsAverageMonthlyContent);
        $('#kwid-'+keywordID+'-their-pl').html(competitorsAverageMonthlyContent);
        //$('#kwid-'+keywordID+'-your-pl').html(clientPowerLevel);
        //$('#kwid-'+keywordID+'-your-pl').val(clientPowerLevel);
        $('#kwid-'+keywordID+'-table-total-backlinks').html(Math.round(totalBacklinks/competitorsCount));
    }
    
    $('body').removeClass('wait');
    //Re-display the Get the Hack buttons
    if(keywordCounter > -1)
    {
        $("#get-the-hack-1-"+keywordCounter).show(200).css('display','inline');
        //$("#get-the-hack-2-"+keywordCounter).show(200).css('display','inline');
        $("#top-hack-content-"+keywordCounter).html(topHackContentHTML);
        $("#big-hack-content-"+keywordCounter).html(bigHackContentButton);
        //document.getElementById("get-the-hack-1-"+keywordCounter).style.display = "inline";
        //document.getElementById("get-the-hack-2-"+keywordCounter).style.display = "inline";
    }
}

function displayProjectEditWindow(projectID)
{
    if(projectID != '')
    {
        //Set the id of the project we're working with
        $('#edit-project-id').val(projectID);

        //Get the project summary info and set the values
        $.ajax({url: restURL, data: {'command':'getProjectSetupData','projectid':projectID}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    var projectInfo = info.projectSummary;

                    var projectURL = projectInfo.clientURL;
                    var geoLocation = projectInfo.geoLocation;
                    var monthlyVisitors = parseInt(projectInfo.monthlyVisitors);
                    var payingCustomers = parseInt(projectInfo.payingCustomers);
                    var valuePerCustomer = parseInt(projectInfo.valuePerCustomer);
                    var costPerLevel = parseInt(projectInfo.costPerLevel);
                    var useGoogle = projectInfo.useGoogle;
                    var useBing = projectInfo.useBing;
                    var useYouTube = projectInfo.useYouTube;
                    var useAppStore = projectInfo.useAppStore;
                    var useLocal = projectInfo.useLocal;
                    var useRegional = projectInfo.useRegional;
                    var useNational = projectInfo.useNational;
                    var currencyHexCode = projectInfo.currencyHexCode;
                    var industryID = projectInfo.industryID;
                    var eCommerce = projectInfo.eCommerce;
                    
                    //Update the inputs with the appropriate values
                    $('#project-url').html(projectURL);
                    $('#project-location').html(geoLocation);
                    $('#currency-code-1').html(currencyHexCode);
                    $('#currency-code-2').html(currencyHexCode);
                    $('#currency-code-3').html(currencyHexCode);
                    
                    if(typeof eCommerce !== "undefined")
                    {
                        if(eCommerce == 1)
                        {
                            $('#e-commerce-selection option')[1].selected = true;
                        }
                        else
                        {
                            $('#e-commerce-selection option')[0].selected = true;
                        }
                    }
                    refreshIndustries();
                    
                    if(typeof industryID !== "undefined")
                    {
                        $('#industry-selection').val(parseInt(industryID));
                    }
                    
                    if(useGoogle == 1)
                    {
                        $('#use-google').prop('checked',true);
                    }
                    else
                    {
                       $('#use-google').prop('checked',false); 
                    }
                    
                    if(useBing == 1)
                    {
                        $('#use-bing').prop('checked',true);
                    }
                    else
                    {
                       $('#use-bing').prop('checked',false); 
                    }
                    
                    if(useYouTube == 1)
                    {
                        $('#use-you-tube').prop('checked',true);
                    }
                    else
                    {
                       $('#use-you-tube').prop('checked',false); 
                    }
                    
                    if(useAppStore == 1)
                    {
                        $('#use-app-store').prop('checked',true);
                    }
                    else
                    {
                       $('#use-app-store').prop('checked',false); 
                    }
                    
                    /*if(useLocal == 1)
                    {
                        $('#use-local').prop('checked',true);
                    }
                    else
                    {
                       $('#use-local').prop('checked',false); 
                    }
                    
                    if(useNational == 1)
                    {
                        $('#use-national').prop('checked',true);
                    }
                    else
                    {
                       $('#use-national').prop('checked',false); 
                    }*/
                    
                    if(useLocal == 1)
                    {
                        $('#local-national option')[0].selected = true;
                    }
                    /*else if(useRegional == 1)
                    {
                        $('#local-national option')[1].selected = true;
                    }*/
                    else
                    {
                       $('#local-national option')[1].selected = true;
                    }
                    
                    /*$('#ex6SliderVal').val(numberWithCommas(monthlyVisitors));
                    $('#ex7SliderVal').val(numberWithCommas(payingCustomers));
                    $('#ex8SliderVal').val(numberWithCommas(valuePerCustomer));
                    $('#ex9SliderVal').val(numberWithCommas(costPerLevel));*/
                    
                    $("#ex6").slider();
                    var sliderVal = monthlyVisitors;
                    if(isNaN(sliderVal) || sliderVal < 0){ sliderVal = 0; }
                    $("#ex6").slider({
                        value: sliderVal
                        });
                    $("#ex6").slider('refresh');
                    $("#ex6SliderVal").val(numberWithCommas(sliderVal));
                    
                    $("#ex7").slider();
                    var sliderVal = payingCustomers;
                    if(isNaN(sliderVal) || sliderVal < 0){ sliderVal = 0; }
                    $("#ex7").slider({
                        value: sliderVal
                        });
                    $("#ex7").slider('refresh');
                    $("#ex7SliderVal").val(numberWithCommas(sliderVal));
                    
                    $("#ex8").slider();
                    var sliderVal = valuePerCustomer;
                    if(isNaN(sliderVal) || sliderVal < 0){ sliderVal = 0; }
                    $("#ex8").slider({
                        value: sliderVal
                        });
                    $("#ex8").slider('refresh');
                    $("#ex8SliderVal").val(numberWithCommas(sliderVal));
                    
                    $("#ex9").slider();
                    var sliderVal = costPerLevel;
                    if(isNaN(sliderVal) || sliderVal < 0){ sliderVal = 0; }
                    $("#ex9").slider({
                        value: sliderVal
                        });
                    $("#ex9").slider('refresh');
                    $("#ex9SliderVal").val(numberWithCommas(sliderVal));
                    
                    //Show the modal
                    showEditProject();
                }
            }
        });
    }
}

function editKeywordHackerProject(source)
{
    //Show the spinner
    //$("#edit-project-response").html("<div><img src='images/apple_spinner.gif' class='apple-spinner-small'/></div>");
    $('body').addClass('wait');

    
    //Get the new values to update with
    var projectID = $('#edit-project-id').val();
    if(projectID != '')
    {
        var monthlyVisitors = $('#ex6SliderVal').val();
        var payingCustomers = $('#ex7SliderVal').val();
        var customerValue = $('#ex8SliderVal').val();
        var costPerLevel = $('#ex9SliderVal').val();
        var industry = $('#industry-selection').val();
        
        var useGoogle;
        var useBing;
        var useYouTube;
        var useAppStore;
        var useLocal;
        var useRegional;
        var useNational;
        
        if($('#use-google').is(':checked'))
        {
            useGoogle = 1;
        }
        else
        {
            useGoogle = 0;
        }
        
        if($('#use-bing').is(':checked'))
        {
            useBing = 1;
        }
        else
        {
            useBing = 0;
        }
        
        if($('#use-you-tube').is(':checked'))
        {
            useYouTube = 1;
        }
        else
        {
            useYouTube = 0;
        }
        
        if($('#use-app-store').is(':checked'))
        {
            useAppStore = 1;
        }
        else
        {
            useAppStore = 0;
        }
        
        /*if($('#use-local').is(':checked'))
        {
            useLocal = 1;
        }
        else
        {
            useLocal = 0;
        }

        if($('#use-national').is(':checked'))
        {
            useNational = 1;
        }
        else
        {
            useNational = 0;
        }*/
        
        if($('#local-national').val() == "local")
        {
            useLocal = 1;
            useRegional = 0;
            useNational = 0;
        }
        else if($('#local-national').val() == "regional")
        {
            useLocal = 0;
            useRegional = 1;
            useNational = 0;
        }
        else
        {
            useLocal = 0;
            useRegional = 0;
            useNational = 1;
        }
        
        /*if(monthlyVisitors == 0 || payingCustomers == 0)
        {
            showAlert("Please enter a value for both monthly visitors and paying customers.");
        }*/

        //Make the AJAX call
        $.ajax({url: restURL, data: {'command':'editKHProject','projectid':projectID,'monthlyVisitors':monthlyVisitors,'payingCustomers':payingCustomers,'customerValue':customerValue,'costPerLevel':costPerLevel,'useGoogle':useGoogle,'useBing':useBing,'useYouTube':useYouTube,'useAppStore':useAppStore,'useLocal':useLocal,'useRegional':useRegional,'useNational':useNational,'industry':industry}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    //On success, hide the window
                    //$("#edit-project-response").html("");
                    hideEditProject();
                    $('body').removeClass('wait');
                    if(source == "dashboard")
                    {
                        loadProjectDashboard(false);
                    }
                    else if(source == "projects")
                    {
                        window.location.reload();
                    }
                }
            }
        });
    }
}

function hideEditProject()
{
    document.getElementById("dimmer").style.display = "none";
    document.getElementById("edit-project-window").style.display = "none";
}

function showEditProject()
{
    document.getElementById("edit-project-window").style.display = "block";
    document.getElementById("dimmer").style.display = "block";
}

function cancelEditKeywordHackerProject()
{
    //Set the id of the project back to 0
    $('#edit-project-id').val(0);
    $("#edit-project-response").html("");
    
    //Hide the modal
    hideEditProject();
}

function displayProjectDeleteWindow(projectID)
{
    if(projectID != '')
    {
        //Set the id of the project we're working with
        $('#delete-project-id').val(projectID);
        showDeleteProject();
    }
}

function deleteKeywordHackerProject()
{
    //Show the spinner
    //$("#delete-project-response").html("<div><img src='images/apple_spinner.gif' class='apple-spinner-small'/></div>");
    $('body').addClass('wait');
    
    //Get the new values to update with
    var projectID = $('#delete-project-id').val();
    if(projectID != '')
    {
        //Make the AJAX call
        $.ajax({url: restURL, data: {'command':'deleteKHProject','projectid':projectID}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    //On success, hide the window
                    //$("#delete-project-response").html("");
                    hideDeleteProject();
                    $('body').removeClass('wait');
                    //loadProjectDashboard(false);
                    $("#project-card-"+projectID).hide(400);
                }
            }
        });
    }
}

function cancelDeleteKeywordHackerProject()
{
    //Set the id of the project back to 0
    $('#delete-project-id').val(0);
    $("#delete-project-response").html("");
    
    //Hide the modal
    document.getElementById("dimmer").style.display = "none";
    document.getElementById("delete-project-window").style.display = "none";
}

function hideDeleteProject()
{
    document.getElementById("dimmer").style.display = "none";
    document.getElementById("delete-project-window").style.display = "none";
}

function showDeleteProject()
{
    document.getElementById("delete-project-window").style.display = "block";
    document.getElementById("dimmer").style.display = "block";
}

function getShowLinkText(currentText) {
    var newText = '';

    if (currentText.toUpperCase() === "SHOW MORE") {
        newText = "Show less";
    } else {
        newText = "Show more";
    }

    return newText;
}

function toggleReadMore(num)
{
    var content = $('#show-more-text-'+num).html();
    if(content.includes("SHOW MORE"))
    {
        $('#show-more-text-'+num).html("SHOW FEWER");
        $('#read-more-button-label-'+num).removeClass("read-more-trigger");
        $('#read-more-button-label-'+num).addClass("read-less-trigger");
    }
    else
    {
        $('#show-more-text-'+num).html("SHOW MORE");
        $('#read-more-button-label-'+num).removeClass("read-less-trigger");
        $('#read-more-button-label-'+num).addClass("read-more-trigger");
    }
}

/*function toggleShowMore()
{
    $('article').readmore({
        speed: 75,
        moreLink: '<a href="#" class="read-more-trigger">SHOW MORE KEYWORDS</a>',
        lessLink: '<a href="#" class="read-less-trigger">SHOW FEWER KEYWORDS</a>'
    });
}*/

function addKeywordInReport(keyword,num)
{
    if(keyword.trim() !== '')
    {
        var kwArray = keyword.split(",");
        
        for(var i=0; i<kwArray.length; i++)
        {
            var currentKeywordCount = $('#keyword-count').val();
            var existingKeywords = $('#ctc').html();
            var newKeywordCount = parseInt(currentKeywordCount)+1;
            var newKeywords = existingKeywords + "<li data-type=\""+num+"\" id=\"keyword"+newKeywordCount+"\">"+kwArray[i].trim()+"<span style=\"padding:5px;color:#ec1c24;font-weight:bold;cursor:pointer;\" id=\"remove-keyword"+newKeywordCount+"\" title=\"Remove\" onclick=\"removeKeywordInReport(this);\">X</span></li>";

            
            
            $('#ctc').html(newKeywords);
            $('#new-phrase-container').show();

            $('#keyword-count').val(newKeywordCount);

            //Show the submit button, dynamically update the text for it, and flash it twice
            if(newKeywordCount == 1)
            {
                $("#add-keywords-button").show(100,function(){});
                $("#add-keywords-button").fadeTo(0,0.65,function(){});
                $("#add-keywords-button").html("ADD "+newKeywordCount+" KEYWORDS");
                $("#add-keywords-button").fadeTo(500,1.0,function(){});
            }
            else
            {
                $("#add-keywords-button").fadeTo(500,0.65,function(){});
                $("#add-keywords-button").html("ADD "+newKeywordCount+" KEYWORDS");
                $("#add-keywords-button").fadeTo(500,1.0,function(){});
            }
        }
    }
}

function removeKeywordInReport(element)
{
    var currentKeywordCount = parseInt($('#keyword-count').val());
    var id = element.getAttribute('id').replace('remove-keyword','');
    var idValue = parseInt(id);
    
    var dataType = $('#keyword'+idValue).attr('data-type');

    var keywordContent = $('#keyword'+idValue).html();
        keywordContent = keywordContent.replace("<span style=\"padding:5px;color:#ec1c24;font-weight:bold;cursor:pointer;\" id=\"remove-keyword"+idValue+"\" title=\"Remove\" onclick=\"removeKeywordInReport(this);\">X</span>","");
        keywordContent = keywordContent.trim();
    $('#keyword'+idValue).remove();
    //Add it to the list of suggested in case they want it back
    if(dataType == '1')
    {
        var suggestedList = $('#suggestedKeywordsList').html();
        var stringToAdd = "<li data-type=\"1\" class=\"read-more-target\">"+keywordContent+"</li>";
        $('#suggestedKeywordsList').html(suggestedList+stringToAdd);
    }
    else(dataType == '2')
    {
        var suggestedList = $('#altSuggestedKeywordsList').html();
        var stringToAdd = "<li data-type=\"2\" class=\"read-more-target\">"+keywordContent+"</li>";
        $('#altSuggestedKeywordsList').html(suggestedList+stringToAdd);
    }
    
    
    if(idValue < currentKeywordCount)
    {
        var startingVal = idValue + 1;
        //Re-number the items behind this one so that we have an accurate count
        for(var i=startingVal; i<=currentKeywordCount; i++)
        {
            var newIDString = "keyword"+(i-1);
            var newRemoveString = "remove-keyword"+(i-1);
            $('#keyword'+i).attr("id",newIDString);
            $('#remove-keyword'+i).attr("id",newRemoveString);
        }
    }
    
    $('#keyword-count').val(currentKeywordCount-1);
    
    //Show the submit button, dynamically update the text for it, and flash it twice
    if((currentKeywordCount-1)>0)
    {
        $("#add-keywords-button").fadeTo(500,0.65,function(){});
        $("#add-keywords-button").html("ADD "+(currentKeywordCount-1)+" KEYWORDS");
        $("#add-keywords-button").fadeTo(500,1.0,function(){});
    }
    else
    {
        $("#add-keywords-button").html("");
        $('#new-phrase-container').hide();
        $("#add-keywords-button").hide(100,function(){});
        
    }
}

function recalculateProject()
{
    $('body').addClass('wait');

    var projectID = getURLParameter("pid");
    if(projectID != '')
    {
        var currentKeywordCount = parseInt($('#keyword-count').val());
        var keywordsList = "";
        for(var i=1; i<=currentKeywordCount; i++)
        {
            var keywordString = $('#keyword'+i).html();
            var keywordEndLoc = keywordString.indexOf("<span");
            var keyword = keywordString.substring(0,keywordEndLoc);
            if(keywordsList == "")
            {
                //keywordsList = i+"="+keyword;
                keywordsList = keyword;
            }
            else
            {
                //keywordsList += ";"+i+"="+keyword;
                keywordsList += ";"+keyword;
            }
        }
        $.ajax({url: restURL, data: {'command':'addKeywordsToExistingProject','projectid':projectID,'keywords':keywordsList}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    $('body').removeClass('wait');
                    //Show the warning message at top, and set the flag to keep checking
                    //$("#warning-message").show(400);
                    //$("#check-project-done-flag").val(1);
                    window.location = "keywordhacker.html?pid="+projectID;
                }
            }
        });
    }
    else
    {
        window.location = "dashboard.html";
    }
}

function toggleLocalNational(optionToCheck,optionToUncheck)
{
    if($('#use-'+optionToCheck).prop('checked'))
    {
        $('#use-'+optionToUncheck).prop('checked',false);
    }
    else
    {
        $('#use-'+optionToUncheck).prop('checked',true);
    }
    
}

function checkRequiredEngine(workingEngine,defaultEngine)
{
    if(!$('#use-'+workingEngine).prop('checked') && !$('#use-'+defaultEngine).prop('checked'))
    {
        $('#use-'+defaultEngine).prop('checked',true);
    }
}

function displayKeywordDeleteWindow(keywordID)
{
    var returnData = $('#json').val();
    var info = JSON.parse(returnData);

    var deletedKeywords = info.deletedKeywords;
    //var maxKeywords = info.maxKeywords;
    
    if(deletedKeywords < 50)
    {
        if(keywordID != '')
        {
            //Set the id of the project we're working with
            $('#delete-keyword-id').val(keywordID);
            showDeleteProject();
        }
    }
    else
    {
        $("#alert-window").removeClass("alert-window");
        $("#alert-window").addClass("alert-window-large");
        showAlert("The number of keywords you can delete is currently limited. Only 50 phrases across all of your missions can be deleted.");
    }
}

function deleteKeyword()
{
    var projectID = getURLParameter("pid");
    var keywordID = $("#delete-keyword-id").val();
    
    if(keywordID != '' && projectID != '')
    {
        $('body').addClass('wait');
        $.ajax({url: restURL, data: {'command':'deleteKeyword','projectid':projectID,'keywordid':keywordID}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    loadProjectData();
                    hideDeleteProject();
                    $('body').removeClass('wait');
                }
            }
        });
    }
}

function expandAll(el)
{
    var all = 'show';
    jQuery(el).parent().parent().find('.panel-collapse').collapse(all);
}

function collapseAll(el)
{
    var all = 'hide';
    jQuery(el).parent().parent().find('.panel-collapse').collapse(all);
}

function prefill()
{
    var url = getURLParameter("url");
    if(url != '')
    {
        $("#project-url").val(url);
    }
}

function gotoRHStorefront(projectURL)
{
    var username = getCookie("username");
    var fullname = getCookie("userFullName");
    var destination = "dashboard";
    projectURL = encodeURIComponent(projectURL);
    window.location = rhURL+"auto_auth.html?username="+username+"&fullname="+fullname+"&projecturl="+projectURL+"&destination="+destination;
}

function gotoRHCreateProject(clientURL,competitor1,competitor2,competitor3,competitor4,competitor5,keywordPhrase,keywordID)
{
    var username = getCookie("username");
    var fullname = getCookie("userFullName");
    var destination = "create-report";
    var projectID = getURLParameter("pid");
    clientURL = encodeURIComponent(clientURL);
    competitor1 = encodeURIComponent(competitor1);
    competitor2 = encodeURIComponent(competitor2);
    competitor3 = encodeURIComponent(competitor3);
    competitor4 = encodeURIComponent(competitor4);
    competitor5 = encodeURIComponent(competitor5);
    
    window.location = rhURL+"auto_auth.html?username="+username+"&fullname="+fullname+"&destination="+destination+"&pid="+projectID+"&kwid="+keywordID+"&client="+clientURL+"&c1="+competitor1+"&c2="+competitor2+"&c3="+competitor3+"&c4="+competitor4+"&c5="+competitor5+"&phrase="+keywordPhrase;
}

function gotoKHDashboard()
{
    window.location = "dashboard.html";
}

function saveTextAsFile()
{
    var textToWrite = getProjectCSVData();
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = "report.csv";
      var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = document.body.removeChild(event.target);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function getProjectCSVData()
{
    var field = "keywordID";
    var output = "project summary\n";
    output += "project name,number of keywords selected,location,monthly search volume,projected monthly visitors,projected monthly customers,projected monthly sales,cost per month,keyword net-worth\n";
    
    var projectData = $('#json').val();
    var info = JSON.parse(projectData);
    
    //Fill in the project data here
    var projectInfo = info.projectSummary;
        var projectID = projectInfo.projectID;
        var runDate = projectInfo.runDate;
        var costPerLevel = projectInfo.costPerLevel;
        var searchVolume = projectInfo.searchVolume;
        var clientURL = projectInfo.clientURL;
        var valuePerCustomer = projectInfo.valuePerCustomer;
        var active = projectInfo.active;
        var completed = projectInfo.completed;
        var clientDA = projectInfo.clientDA;
        var clientPA = projectInfo.clientPA;
        var clientPowerLevel = Math.max(1,Math.round((clientDA+clientPA)/2/10,0));
        var totalPowerLevel = projectInfo.totalPowerLevel
        var incomingTraffic = Math.round(projectInfo.incomingTraffic,0);
        var runDateRaw = projectInfo.runDateRaw;
        var keywordCount = projectInfo.keywordCount;
        var geoLocation = projectInfo.geoLocation;
        var monthlyVisitors = projectInfo.monthlyVisitors;
        var payingCustomers = projectInfo.payingCustomers;
        
        var monthlyCustomers = Math.round(incomingTraffic * (payingCustomers / monthlyVisitors),0);
        var monthlySales = Math.round(monthlyCustomers * valuePerCustomer,0);
        var costPerMonth = Math.round((totalPowerLevel * costPerLevel),0);
        var keywordNetWorth = (monthlySales - costPerMonth);
        
        var customerConversionRate = (payingCustomers / monthlyVisitors);
        
    output += clientURL+","+keywordCount+",\""+geoLocation+"\","+searchVolume+","+monthlyVisitors+","+monthlyCustomers+",$"+monthlySales+",$"+costPerMonth+",$"+keywordNetWorth+"\n";
    output += "\n";
    output += "keyword summaries\n";
    output += "keyword selected,keyword,power level goal,monthly organic search volume,projected monthly visitors,projected monthly customers,projected monthly sales,cost per month,keyword net-worth\n";
    
    //Find the data
    var keywordInfo = info.keywordData;    

    //Fill in the keyword summary data here
    for(var i=0; i<keywordInfo.length; i++)
    {
        var thisEntry = keywordInfo[i];
        var thisCompetitorArray = thisEntry.competitorData;
        
        var keywordID = thisEntry.keywordID;
        var searchVolume = thisEntry.searchVolume;
        var clientRanking = thisEntry.clientRanking;
        var keywordActive = thisEntry.active;
        var avgCTR = thisEntry.avgCTR;
        var totalPowerLevel = thisEntry.totalPowerLevel;     //Add back the client power level to the total power level for this keyword
        var keyword = thisEntry.keyword;
        var monthlyVisitors = thisEntry.monthlyVisitors;
        var monthlyCustomers = thisEntry.monthlyCustomers;
        var monthlySales = thisEntry.monthlySales;
        var costPerMonth = thisEntry.costPerMonth;
        var keywordNetWorth = thisEntry.keywordNetWorth;
        
        var powerLevelGoal = Math.max(1,(totalPowerLevel - clientPowerLevel));
        
        output += keywordActive+","+keyword+","+powerLevelGoal+","+searchVolume+","+monthlyVisitors+","+monthlyCustomers+",$"+monthlySales+",$"+costPerMonth+",$"+keywordNetWorth+"\n";
    }
    
    output += "\n";
    output += "keyword details\n";
    output += "keyword,client google rank,client url,client power level,competitor selected,competitor google rank,competitor url,competitor ctr,competitor power level\n";
    
    //Fill in the competitor detail data here
    for(var i=0; i<keywordInfo.length; i++)
    {
        var thisEntry = keywordInfo[i];
        var thisCompetitorArray = thisEntry.competitorData;
        
        var keywordID = thisEntry.keywordID;
        var searchVolume = thisEntry.searchVolume;
        var clientRanking = thisEntry.clientRanking;
        var keywordActive = thisEntry.active;
        var avgCTR = thisEntry.avgCTR;
        var totalPowerLevel = thisEntry.totalPowerLevel;     //Add back the client power level to the total power level for this keyword
        var keyword = thisEntry.keyword;
        var monthlyVisitors = thisEntry.monthlyVisitors;
        var monthlyCustomers = thisEntry.monthlyCustomers;
        var monthlySales = thisEntry.monthlySales;
        var costPerMonth = thisEntry.costPerMonth;
        var keywordNetWorth = thisEntry.keywordNetWorth;
        
        var powerLevelGoal = Math.max(1,(totalPowerLevel - clientPowerLevel));
        
        for(var j=0; j<thisCompetitorArray.length; j++)
        {
            var thisCompetitor = thisCompetitorArray[j];
            
            var competitorID = thisCompetitor.competitorID;
            var competitorActive = thisCompetitor.active;
            var competitorPositionRank = thisCompetitor.positionRank;
            var competitorURL = thisCompetitor.url;
                var competitorURLShort = competitorURL.substring(0,45)+"...";
            var competitorCTR = Math.round(thisCompetitor.traffic);
            //var competitorPowerLevel = Math.round((thisCompetitor.DA+thisCompetitor.PA)/2/10);
            var competitorPowerLevel = thisCompetitor.powerLevel;
            
            output += keyword+","+clientRanking+","+clientURL+","+clientPowerLevel+","+competitorActive+","+competitorPositionRank+","+competitorURL+","+competitorCTR+"%,"+competitorPowerLevel+"\n";
        }
    }
    
    return output;
}

function saveTextAsFileFromDashboard(projectID)
{
    $.ajax({url: restURL, data: {'command':'getProjectData','projectid':projectID}, type: 'post', async: true, success: function postResponse(returnData){
            var info = JSON.parse(returnData);

            if(info.status == "success")
            {
                var field = "keywordID";
                var output = "project summary\n";
                output += "project name,number of keywords selected,location,monthly search volume,projected monthly visitors,projected monthly customers,projected monthly sales,cost per month,keyword net-worth\n";

                //Fill in the project data here
                var projectInfo = info.projectSummary;
                    var projectID = projectInfo.projectID;
                    var runDate = projectInfo.runDate;
                    var costPerLevel = projectInfo.costPerLevel;
                    var searchVolume = projectInfo.searchVolume;
                    var clientURL = projectInfo.clientURL;
                    var valuePerCustomer = projectInfo.valuePerCustomer;
                    var active = projectInfo.active;
                    var completed = projectInfo.completed;
                    var clientDA = projectInfo.clientDA;
                    var clientPA = projectInfo.clientPA;
                    var clientPowerLevel = Math.max(1,Math.round((clientDA+clientPA)/2/10,0));
                    var totalPowerLevel = projectInfo.totalPowerLevel
                    var incomingTraffic = Math.round(projectInfo.incomingTraffic,0);
                    var runDateRaw = projectInfo.runDateRaw;
                    var keywordCount = projectInfo.keywordCount;
                    var geoLocation = projectInfo.geoLocation;
                    var monthlyVisitors = projectInfo.monthlyVisitors;
                    var payingCustomers = projectInfo.payingCustomers;

                    var monthlyCustomers = Math.round(incomingTraffic * (payingCustomers / monthlyVisitors),0);
                    var monthlySales = Math.round(monthlyCustomers * valuePerCustomer,0);
                    var costPerMonth = Math.round((totalPowerLevel * costPerLevel),0);
                    var keywordNetWorth = (monthlySales - costPerMonth);

                    var customerConversionRate = (payingCustomers / monthlyVisitors);

                output += clientURL+","+keywordCount+",\""+geoLocation+"\","+searchVolume+","+monthlyVisitors+","+monthlyCustomers+",$"+monthlySales+",$"+costPerMonth+",$"+keywordNetWorth+"\n";
                output += "\n";
                output += "keyword summaries\n";
                output += "keyword selected,keyword,power level goal,monthly organic search volume,projected monthly visitors,projected monthly customers,projected monthly sales,cost per month,keyword net-worth\n";

                //Find the data
                var keywordInfo = info.keywordData;    

                //Fill in the keyword summary data here
                for(var i=0; i<keywordInfo.length; i++)
                {
                    var thisEntry = keywordInfo[i];
                    var thisCompetitorArray = thisEntry.competitorData;

                    var keywordID = thisEntry.keywordID;
                    var searchVolume = thisEntry.searchVolume;
                    var clientRanking = thisEntry.clientRanking;
                    var keywordActive = thisEntry.active;
                    var avgCTR = thisEntry.avgCTR;
                    var totalPowerLevel = thisEntry.totalPowerLevel;     //Add back the client power level to the total power level for this keyword
                    var keyword = thisEntry.keyword;
                    var monthlyVisitors = thisEntry.monthlyVisitors;
                    var monthlyCustomers = thisEntry.monthlyCustomers;
                    var monthlySales = thisEntry.monthlySales;
                    var costPerMonth = thisEntry.costPerMonth;
                    var keywordNetWorth = thisEntry.keywordNetWorth;

                    var powerLevelGoal = Math.max(1,(totalPowerLevel - clientPowerLevel));

                    output += keywordActive+","+keyword+","+powerLevelGoal+","+searchVolume+","+monthlyVisitors+","+monthlyCustomers+",$"+monthlySales+",$"+costPerMonth+",$"+keywordNetWorth+"\n";
                }

                output += "\n";
                output += "keyword details\n";
                output += "keyword,client google rank,client url,client power level,competitor selected,competitor google rank,competitor url,competitor ctr,competitor power level\n";

                //Fill in the competitor detail data here
                for(var i=0; i<keywordInfo.length; i++)
                {
                    var thisEntry = keywordInfo[i];
                    var thisCompetitorArray = thisEntry.competitorData;

                    var keywordID = thisEntry.keywordID;
                    var searchVolume = thisEntry.searchVolume;
                    var clientRanking = thisEntry.clientRanking;
                    var keywordActive = thisEntry.active;
                    var avgCTR = thisEntry.avgCTR;
                    var totalPowerLevel = thisEntry.totalPowerLevel;     //Add back the client power level to the total power level for this keyword
                    var keyword = thisEntry.keyword;
                    var monthlyVisitors = thisEntry.monthlyVisitors;
                    var monthlyCustomers = thisEntry.monthlyCustomers;
                    var monthlySales = thisEntry.monthlySales;
                    var costPerMonth = thisEntry.costPerMonth;
                    var keywordNetWorth = thisEntry.keywordNetWorth;

                    var powerLevelGoal = Math.max(1,(totalPowerLevel - clientPowerLevel));

                    for(var j=0; j<thisCompetitorArray.length; j++)
                    {
                        var thisCompetitor = thisCompetitorArray[j];

                        var competitorID = thisCompetitor.competitorID;
                        var competitorActive = thisCompetitor.active;
                        var competitorPositionRank = thisCompetitor.positionRank;
                        var competitorURL = thisCompetitor.url;
                            var competitorURLShort = competitorURL.substring(0,45)+"...";
                        var competitorCTR = Math.round(thisCompetitor.traffic);
                        //var competitorPowerLevel = Math.round((thisCompetitor.DA+thisCompetitor.PA)/2/10);
                        var competitorPowerLevel = thisCompetitor.powerLevel;

                        output += keyword+","+clientRanking+","+clientURL+","+clientPowerLevel+","+competitorActive+","+competitorPositionRank+","+competitorURL+","+competitorCTR+"%,"+competitorPowerLevel+"\n";
                    }
                }
                
                var textToWrite = output;
                var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
                var fileNameToSaveAs = "report.csv";
                  var downloadLink = document.createElement("a");
                downloadLink.download = fileNameToSaveAs;
                downloadLink.innerHTML = "Download File";
                if (window.webkitURL != null)
                {
                    // Chrome allows the link to be clicked
                    // without actually adding it to the DOM.
                    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
                }
                else
                {
                    // Firefox requires the link to be added to the DOM
                    // before it can be clicked.
                    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                    downloadLink.onclick = document.body.removeChild(event.target);
                    downloadLink.style.display = "none";
                    document.body.appendChild(downloadLink);
                }

                downloadLink.click();

            }
        }
    });
    
}

function hideActivate()
{
    document.getElementById("dimmer").style.display = "none";
    document.getElementById("activate-new-window").style.display = "none";
}

function showActivate()
{
    document.getElementById("activate-new-window").style.display = "block";
    document.getElementById("dimmer").style.display = "block";
}

function hideShow(hide,show)
{
    document.getElementById(hide).style.display = "none";
    document.getElementById(show).style.display = "block";
}

function checkProjectDone()
{
    var projectID = getURLParameter("pid");
    var needToCheck = $("#check-project-done-flag").val();
    if(needToCheck == 1)
    {
        if(projectID != "")
        {
            $.ajax({url: restURL, data: {'command':'checkProjectDone','projectid':projectID}, type: 'post', async: true, success: function postResponse(returnData){
                        var info = JSON.parse(returnData);

                        if(info.status == "success")
                        {
                            var completed = info.complete;
                            
                            if(completed == "1")
                            {
                                //Hide the warning message and show the success message
                                $("#warning-message").hide(400);
                                $("#success-message").show(400);
                                $("#check-project-done-flag").val(0);
                                
                                //Update the keyword net-worth text to say "ready" in static green
                                $('#kwNetWorth').html("<h2><span class=\"loader__dot\" style=\"font-size:15px;color:#088D0C;background-color:#fff;cursor:pointer;\" onclick=\"javascript:window.location.reload();\">refresh to view</span><span style=\"background-color:#fff;\">KEYWORD NET-WORTH</span></h2>");
                            }
                        }
                    }
                });
        }
    }
}

function gotoStorefrontPrefill(keywordCounter)
{
    var returnData = $('#json').val();
    var info = JSON.parse(returnData);
    
    var projectInfo = info.projectSummary;
        var projectID = projectInfo.projectID;
        var clientURL = projectInfo.clientURL;
    var keywordInfo = info.keywordData;
    var thisEntry = keywordInfo[keywordCounter];
    var thisCompetitorArray = thisEntry.competitorData;
    var thisKeywordPhrase = thisEntry.keyword;
    var thisKeywordID = thisEntry.keywordID;

    var c1 = "";
    var c2 = "";
    var c3 = "";
    var c4 = "";
    var c5 = "";

    //for(var j=0; j<thisCompetitorArray.length; j++)
    var selectedCounter = 0;
    for(var j=0; j<10; j++)
    {
        var thisCompetitor = thisCompetitorArray[j];
        var competitorURL = thisCompetitor.url;
        if(thisCompetitor.active == 1)
        {
            if(selectedCounter == 0)
            {
                c1 = competitorURL;
            }
            else if(selectedCounter == 1)
            {
                c2 = competitorURL;
            }
            else if(selectedCounter == 2)
            {
                c3 = competitorURL;
            }
            else if(selectedCounter == 3)
            {
                c4 = competitorURL;
            }
            else if(selectedCounter == 4)
            {
                c5 = competitorURL;
            }
            selectedCounter++;
        }
    }
    
    gotoRHCreateProject(clientURL,c1,c2,c3,c4,c5,thisKeywordPhrase,thisKeywordID);
}

function refreshIndustries()
{
    var eCommerce = $("#e-commerce-selection").val();
    
    $.ajax({url: restURL, data: {'command':'updateIndustriesSelection','ecommerce':eCommerce}, type: 'post', async: false, success: function postResponse(returnData){
                        var info = JSON.parse(returnData);

                        if(info.status == "success")
                        {
                            var optionsString = info.optionsString;
                            
                            $("#industry-selection").html(optionsString);
                        }
                    }
                });
    
}

function manageIndustries(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    
    $.ajax({url: restURL, data: {'command':'getAdminLink'}, type: 'post', async: true, success: function postResponse(returnData){
                        var info = JSON.parse(returnData);

                        if(info.status == "success")
                        {
                            window.location = info.adminLink;
                        }
                    }
                });
}

function registeredUsers(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    
    $.ajax({url: restURL, data: {'command':'getUsersLink'}, type: 'post', async: true, success: function postResponse(returnData){
                        var info = JSON.parse(returnData);

                        if(info.status == "success")
                        {
                            window.location = info.usersLink;
                        }
                    }
                });
}

function updateIndustry(id)
{
    var name = $("#name_"+id).val();
    var eCommerce = $("#ecommerce_"+id).val();
    var convRate = $("#conv-rate_"+id).val();
    
    if(name.trim() == "")
    {
        showAlert("Error: You must provide an industry name.");
    }
    else
    {    
        $.ajax({url: restURL, data: {'command':'processIndustry','industryid':id,'name':name,'ecommerce':eCommerce,'convrate':convRate}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    if(id == 0)
                    {
                        $("#name_"+id).val("");
                        $("#ecommerce_"+id).val(0);
                        $("#conv-rate_"+id).val(0.00);
                    }
                    getAllIndustries();
                }
            }
        });
    }
}

function getAllIndustries()
{
    var username = getCookie("username");
    if(username != '')
    {
        if(username == 'admin@fairmarketing.com')
        {
            $.ajax({url: restURL, data: {'command':'getAllIndustries'}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        var industryInfo = info.industries;
                        var rowData = "";
                        for(var i=0; i<industryInfo.length; i++)
                        {
                            var thisEntry = industryInfo[i];
                            var id = thisEntry.industryID;
                            var name = thisEntry.industryName;
                            var eCommerce = thisEntry.eCommerce;
                            var noSelected = "";
                            var yesSelected = "";
                            if(eCommerce == 0)
                            {
                                noSelected = " selected";
                                yesSelected = "";
                            }
                            else
                            {
                                noSelected = "";
                                yesSelected = " selected";
                            }
                            var convRate = thisEntry.customerConversionRate;

                            rowData += "<tr>" +
                                    "<td data-title='ID' class='industry_id'>"+id+"</td>" +
                                    "<td class='industry_name_input' data-title='Industry Name'><input type='text' size='60' id='name_"+id+"' value='"+name+"'/></td>" +
                                    "<td data-title='e-Commerce' class='industry_e-commerce_input'><select id='ecommerce_"+id+"'><option value='no'"+noSelected+">No</option><option value='yes'"+yesSelected+">Yes</option></select>" +
                                    "<td data-title='Customer Conversion Rate' class='conversion_rate_input' ><input type='text' size='10' id='conv-rate_"+id+"' value='"+convRate+"'/></td>" +
                                    "<td data-title='Action' class='action_btn'><input type='button' class='blue-btn-small' onclick=\"updateIndustry('"+id+"');\" value='Update'/></td>" +
                                    "</tr>";
                        }

                        $("#industry-table").html(rowData);
                    }
                }
            });
            
            refreshCartDropdown();
        }
        else
        {
            window.location = "../index.html";
        }
    }
    else
    {
        window.location = "../index.html";
    }
}

function searchCards()
{
    var searchString = $("#search-box").val();
    var sortMethod = $("#curr_sort").val();
    var flip = $("#curr_sort_reversed").val();
    if(flip == "true")
    {
        displayDashboardCards(sortMethod,true,searchString);
    }
    else
    {
        displayDashboardCards(sortMethod,false,searchString);
    }
}

function generateContentReport(keywordCounter)
{
    var returnData = $('#json').val();
    var info = JSON.parse(returnData);
    
    var projectInfo = info.projectSummary;
        var projectID = projectInfo.projectID;
        var clientURL = projectInfo.clientURL;
    var keywordInfo = info.keywordData;
    var thisEntry = keywordInfo[keywordCounter];
    var keywordID = thisEntry.keywordID;
    
    //Send the user to the RH Storefront
    //gotoStorefrontPrefill(keywordCounter);
    
    $.ajax({url: restURL, data: {'command':'generateContentReport','projectid':projectID,'keywordid':keywordID}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    setTimeout(function(){
                        window.location.reload();
                    }, 2000);
                    //loadProjectData();
                    
                }
            }
        });
}

function getKeywordCompetitorsAhrefs(keywordCounter)
{
    var returnData = $('#json').val();
    var info = JSON.parse(returnData);
    
    var projectInfo = info.projectSummary;
        var projectID = projectInfo.projectID;
        var clientURL = projectInfo.clientURL;
    var keywordInfo = info.keywordData;
    var thisEntry = keywordInfo[keywordCounter];
    var keywordID = thisEntry.keywordID;
    
    //Send the user to the RH Storefront
    //gotoStorefrontPrefill(keywordCounter);
    
    $.ajax({url: restURL, data: {'command':'getKeywordCompetitorsAhrefs','projectid':projectID,'keywordid':keywordID}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    //loadProjectData();
                    window.location.reload();
                }
            }
        });
}

function changeUserMonthlyContent(keywordID,keywordCounter)
{
    $('body').addClass('wait');

    var projectID = getURLParameter("pid");
    var newValue = $("#kwid-"+keywordID+"-your-pl").val();
    if(newValue.trim() == "")
    {
        newValue = "0";
    }
    
    //Put the loading bar in the content goal box
    $("#kwid-"+keywordID+"-plg-3").html("<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>");
    
    if(keywordID != '' && projectID != '')
    {
        $.ajax({url: restURL, data: {'command':'updateUserMonthlyContent','projectid':projectID,'keywordid':keywordID,'newvalue':newValue}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    refreshProjectData(keywordCounter,keywordID);
                    $("#kwid-"+keywordID+"-user-monthly-content-count").html(newValue);
                    $('body').removeClass('wait');
                }
            }
        });
        $('body').removeClass('wait');
    }
}

function gotoRHStorefrontFromReport()
{
    var returnData = $('#json').val();
    var info = JSON.parse(returnData);
    
    //Fill in the project data here
    var projectInfo = info.projectSummary;
    var purl = projectInfo.clientURL;
    gotoRHStorefront(purl);
}

function getContentReport(keywordID)
{
    var returnData = $('#json').val();
    var info = JSON.parse(returnData);
    
    //Fill in the project data here
    var projectInfo = info.projectSummary;
    var purl = projectInfo.clientURL;
    var pid = projectInfo.projectID;
    var username = getCookie("username");
    var fullname = getCookie("userFullName");
    var destination = "report";
    purl = encodeURIComponent(purl);
    window.location = rhURL+"auto_auth.html?username="+username+"&fullname="+fullname+"&projecturl="+purl+"&destination="+destination+"&pid="+pid+"&kwid="+keywordID;
    //window.location = rhURL+"auto_auth.html?username="+username+"&fullname="+fullname+"&projecturl="+purl+"&destination="+destination;
}

function resetTitle(id)
{
    $("#copy-anchor-"+id).attr('title','Copy full URL to clipboard');
}

function showCopiedConfirmation(id)
{
    $("#copy-anchor-"+id).attr('title','URL successfully copied');
}

function highlightCHCard(projectID)
{
    $('#CHdivider-'+projectID).attr("src","images/tabDividerBlue-left.png");
    $('#ch-module-'+projectID).css('background-color','#fafbfc');
    //$('#ch-module-'+projectID).css('opacity','0.3');
}
function restoreCHCard(projectID)
{
    $('#CHdivider-'+projectID).attr("src","images/tabDivider.png");
    $('#ch-module-'+projectID).css('background-color','#fff');
    //$('#ch-module-'+projectID).css('opacity','1.0');
}

function highlightKWHCard(projectID)
{
    $('#RHdivider-'+projectID).attr("src","images/tabDividerBlue-left.png");
    $('#CHdivider-'+projectID).attr("src","images/tabDividerBlue-right.png");
    $('#rh-module-'+projectID).css('background-color','#fafbfc');
    //$('#rh-module-'+projectID).css('opacity','0.3');
}
function restoreKWHCard(projectID)
{
    $('#RHdivider-'+projectID).attr("src","images/tabDivider.png");
    $('#CHdivider-'+projectID).attr("src","images/tabDivider.png");
    $('#rh-module-'+projectID).css('background-color','#fff');
    //$('#rh-module-'+projectID).css('opacity','1.0');
}

function clickReadMoreTrigger(num)
{
    $("#read-more-button-label-"+num).click();
}

function getUserInfo()
{
    var username = getCookie("username");

    if(username != '')
    {
        if(username !== 'admin@fairmarketing.com' && $('#industry-link').length)
        {
            $('#industry-link').remove();
            $('#users-link').remove();
        }
        
        refreshCartDropdown();
        
        $.ajax({url: restURL, data: {'command':'getUserInfo','username':username}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    var users = info.users;
                    var userInfo = users[0];

                    var firstName = userInfo.firstName;
                    var lastName = userInfo.lastName;
                    var username = userInfo.username;
                    /*if(lastName == '')
                    {
                        lastName = "Anderson";
                    }*/
                    
                    $("#welcome-message").html("welcome <strong>AGENT "+lastName.toUpperCase()+"</strong> <strong>[</strong> update your contact information below <strong>]</strong>");
                    $("#first_name").val(firstName);
                    $("#last_name").val(lastName);
                    $("#email-address").val(username);
                }
            }
        });
    }
    else
    {
        window.location = "../index.html";
    }
}

function updateUserInfo()
{
    var username = getCookie("username");
    
    if(username != '')
    {
        /*if(username !== 'admin@fairmarketing.com' && $('#industry-link').length)
        {
            $('#industry-link').remove();
            $('#users-link').remove();
        }*/
        
        var firstName = $("#first_name").val();
        var lastName = $("#last_name").val();
        var currPassword = $("#curr_password").val();
        var newPassword = $("#new_password").val();
        
        if(newPassword.trim() != "" && currPassword.trim() == "")
        {
            //Error message
            $("#login-response").addClass("error-text");
            $("#login-response").html("Error: Please provide your current password in order to set a new one.");
        }
        else if(currPassword.trim() != "" && newPassword.trim() == "")
        {
            //Error message
            $("#login-response").addClass("error-text");
            $("#login-response").html("Error: Please provide a new password, or clear the current password field if you do not want to change your password.");
        }
        else
        {
            //Show the spinner
            $("#login-response").html("<div><img src='images/apple_spinner.gif' class='apple-spinner-small'/></div>");
            
            $.ajax({url: restURL, data: {'command':'updateUserInfo','username':username,'firstname':firstName,'lastname':lastName,'currpassword':currPassword,'newpassword':newPassword}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        $("#login-response").addClass("error-text");
                        $("#login-response").html("Your information has been successfully updated.");
                        getUserInfo();
                    }
                    else
                    {
                        var message = info.message;
                        $("#login-response").addClass("error-text");
                        $("#login-response").html("Error: "+message);
                    }
                }
            });
        }
    }
    else
    {
        window.location = "../index.html";
    }
}

function selectActualNetworth(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    
    $("#toggle-position").val(2);
    $("#hack-estimated-form").hide();
    $("#hack-actual-form").show();
    $("#estimated-networth-button").removeClass("selected");
    $("#actual-networth-button").addClass("selected");
    $("#hack-toggle-button").css("background-image","url('images_storefront/switch-btn-left.png')");
    //$("#hack-toggle-button").html("<img src=\"images_storefront/switch-btn-left.png\" style=\"cursor:pointer;\" onclick=\"wizardToggle(event);\">");
}

function selectEstimatedNetworth(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    
    $("#toggle-position").val(1);
    $("#hack-estimated-form").show();
    $("#hack-actual-form").hide();
    $("#actual-networth-button").removeClass("selected");
    $("#estimated-networth-button").addClass("selected");
    $("#hack-toggle-button").css("background-image","url('images_storefront/switch-btn-right.png')");
    //$("#hack-toggle-button").html("<img src=\"images_storefront/switch-btn-right.png\" style=\"cursor:pointer;\" onclick=\"wizardToggle(event);\">");
}

function prepareWizard()
{
    var projectID = getURLParameter("pid");
        var projectIDValue = parseInt(projectID);
    var username = getCookie("username");
    var userFullName = getCookie("userFullName");
    var userLastName = userFullName.substring(userFullName.indexOf(" ")+1,userFullName.length);
    //Show the manageIndustries link for admin
    if(username !== 'admin@fairmarketing.com' && $('#industry-link').length)
    {
        $('#industry-link').remove();
        $('#users-link').remove();
    }
    
    refreshCartDropdown();
    
    //Set the welcome message
    $('#welcome-message').html("welcome <strong>AGENT "+userLastName.toUpperCase()+"</strong> <strong>[</strong> activate your mission below <strong>]</strong>");
    
    if(projectID !== "0" && projectID !== "")
    {
        $("#breadcrumbs-li").html("<a href=\"dashboard.html\">Missions</a> &nbsp; <i class=\"fa fa-angle-right\"></i> &nbsp; <a href=\"keywordhacker.html?pid="+projectID+";\">Mission Report</a> &nbsp; <i class=\"fa fa-angle-right\"></i> &nbsp; <a style=\"cursor:default;\">Project Wizard</a>")
        $("#header-text").html("[   Update Mission Details  ]")
        $("#keyword-section").hide();
        if(projectIDValue < 260)
        {
            $("#metro-option").remove();
        }
        $("#project-url-html").html("My website's URL is <a data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"Sorry, the mission URL cannot be changed.\" id=\"project-url\"></a>, and");
        
        //Get the project summary info and set the values
        $.ajax({url: restURL, data: {'command':'getProjectSetupData','projectid':projectID}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    var projectInfo = info.projectSummary;

                    var projectURL = projectInfo.clientURL;
                    var geoLocation = projectInfo.geoLocation;
                    var monthlyVisitors = parseInt(projectInfo.monthlyVisitors);
                    var payingCustomers = parseInt(projectInfo.payingCustomers);
                    var valuePerCustomer = parseInt(projectInfo.valuePerCustomer);
                    var costPerLevel = parseInt(projectInfo.costPerLevel);
                    var useGoogle = projectInfo.useGoogle;
                    var useBing = projectInfo.useBing;
                    var useYouTube = projectInfo.useYouTube;
                    var useAppStore = projectInfo.useAppStore;
                    var useLocal = projectInfo.useLocal;
                    var useRegional = projectInfo.useRegional;
                    var useNational = projectInfo.useNational;
                    var currencyHexCode = projectInfo.currencyHexCode;
                    var industryID = projectInfo.industryID;
                    var eCommerce = projectInfo.eCommerce;
                    var projectUsername = projectInfo.username;
                    if(projectUsername !== username && username !== "admin@fairmarketing.com" && username !== "hari.patel@1520holdings.com")
                    {
                        window.location = "dashboard.html";
                    }
                    else
                    {
                        //Update the inputs with the appropriate values
                        $('#project-url').html(projectURL);
                        $('#project-location').html(geoLocation);
                        $('#currency-code-1').html(currencyHexCode);
                        $('#currency-code-2').html(currencyHexCode);

                        if(typeof eCommerce !== "undefined")
                        {
                            if(eCommerce == 1)
                            {
                                $('#e-commerce-selection option')[1].selected = true;
                            }
                            else
                            {
                                $('#e-commerce-selection option')[0].selected = true;
                            }
                        }
                        refreshIndustries();

                        if(typeof industryID !== "undefined")
                        {
                            $('#industry-selection').val(parseInt(industryID));
                        }

                        if(useGoogle == 1)
                        {
                            $('#use-google').prop('checked',true);
                        }
                        else
                        {
                           $('#use-google').prop('checked',false); 
                        }

                        if(useBing == 1)
                        {
                            $('#use-bing').prop('checked',true);
                        }
                        else
                        {
                           $('#use-bing').prop('checked',false); 
                        }

                        if(useYouTube == 1)
                        {
                            $('#use-you-tube').prop('checked',true);
                        }
                        else
                        {
                           $('#use-you-tube').prop('checked',false); 
                        }

                        if(useAppStore == 1)
                        {
                            $('#use-app-store').prop('checked',true);
                        }
                        else
                        {
                           $('#use-app-store').prop('checked',false); 
                        }

                        /*if(useLocal == 1)
                        {
                            $('#use-local').prop('checked',true);
                        }
                        else
                        {
                           $('#use-local').prop('checked',false); 
                        }

                        if(useNational == 1)
                        {
                            $('#use-national').prop('checked',true);
                        }
                        else
                        {
                           $('#use-national').prop('checked',false); 
                        }*/

                        if(useLocal == 1)
                        {
                            $('#local-national option')[0].selected = true;
                        }
                        else if(useRegional == 1)
                        {
                            $('#local-national option')[1].selected = true;
                        }
                        else
                        {
                           $('#local-national option')[2].selected = true;
                        }

                        /*$('#ex6SliderVal').val(numberWithCommas(monthlyVisitors));
                        $('#ex7SliderVal').val(numberWithCommas(payingCustomers));
                        $('#ex8SliderVal').val(numberWithCommas(valuePerCustomer));
                        $('#ex9SliderVal').val(numberWithCommas(costPerLevel));*/

                        //$("#ex6").slider();
                        var sliderVal = monthlyVisitors;
                        /*if(isNaN(sliderVal) || sliderVal < 0){ sliderVal = 0; }
                        $("#ex6").slider({
                            value: sliderVal
                            });
                        $("#ex6").slider('refresh');*/
                        $("#ex6SliderVal").val(numberWithCommas(sliderVal));

                        //$("#ex7").slider();
                        var sliderVal = payingCustomers;
                        /*if(isNaN(sliderVal) || sliderVal < 0){ sliderVal = 0; }
                        $("#ex7").slider({
                            value: sliderVal
                            });
                        $("#ex7").slider('refresh');*/
                        $("#ex7SliderVal").val(numberWithCommas(sliderVal));

                        //$("#ex8").slider();
                        var sliderVal = valuePerCustomer;
                        /*if(isNaN(sliderVal) || sliderVal < 0){ sliderVal = 0; }
                        $("#ex8").slider({
                            value: sliderVal
                            });
                        $("#ex8").slider('refresh');*/
                        $("#ex8SliderVal").val(numberWithCommas(sliderVal));

                        //$("#ex9").slider();
                        var sliderVal = costPerLevel;
                        /*if(isNaN(sliderVal) || sliderVal < 0){ sliderVal = 0; }
                        $("#ex9").slider({
                            value: sliderVal
                            });
                        $("#ex9").slider('refresh');*/
                        $("#ex9SliderVal").val(numberWithCommas(sliderVal));

                        //Hide the keyword phrases input, set the website URL and location to readonly and add the tooltip about creating a new project
                        //$("#header-text").html("[   Update Project Details  ]")
                        //$("#keyword-section").hide();
                        //$("#project-url-html").html("My website's URL is <a data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"Sorry, the mission URL cannot be changed; however, you can click here to start a new mission.\" id=\"project-url\" onclick=\"gotoCreateProject('0');\">"+projectURL+"</a>, and");
                        $("#scrollable-dropdown-menu").html("<label style=\"margin-top:0;\">My business is located in</label><span style=\"margin-top:20px;padding-top:20px;\"><a style=\"font-size:18px;font-weight:700;font-family: \"Montserrat\";\" data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"Sorry, the mission location cannot be changed.\" id=\"project-location\">"+geoLocation+"</a></span>");
                        $("body").tooltip({ selector: '[data-toggle=tooltip]' });
                    }
                }
            }
        });
    }
    else
    {
        //Make sure the user can create a new mission
        $.ajax({url: restURL, data: {'command':'checkUserMissionsAvailable','username':username}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    if(info.canCreate == "false")
                    {
                        window.location = "dashboard.html";
                    }
                }
            }
        });
    }
    
}

// Method that checks that the browser supports the HTML5 File API
function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    isCompatible = true;
    }
    return isCompatible;
}

// Method that reads and processes the selected file
function upload(evt) {
if (!browserSupportFileUpload()) {
    showAlert('The necessary file APIs are not fully supported in this browser! Please use an HTML5-compliant browser such as Google Chrome.');
    } else {
        var data = null;
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
            var csvData = event.target.result;

            /*csvData = csvData.replace(/[, ]+/g, ",");
            csvData.replace(/$/mg, ",");
            console.log(csvData);
            $("#new-keyword").val(csvData);*/
            data = $.csv.toArrays(csvData);

            if (data && data.length > 0) {
              var dataToShow = "";

              for(var i=0; i<data.length; i++)
              {
                  var thisEntry = data[i].toString().replace(/[,]+/g, ",");
                  if(i==0)
                  {
                      if(thisEntry.slice(-1) == ",")
                      {
                          dataToShow = thisEntry.substring(0,thisEntry.length-1);
                      }
                      else
                      {
                          dataToShow = thisEntry;
                      }

                  }
                  else
                  {
                      if(thisEntry.slice(-1) == ",")
                      {
                          dataToShow += ","+thisEntry.substring(0,thisEntry.length-1);
                      }
                      else
                      {
                          dataToShow += ","+thisEntry;
                      }
                  }
              }

              $("#new-keyword").val(dataToShow);
              addKeyword("addme");
              $("#fileupload").val("");

            } else {
                showAlert('No data to import!');
            }
        };
        reader.onerror = function() {
            showAlert('Unable to read ' + file.fileName);
        };
    }
}

function rerunKeyword(keywordID)
{
    var projectID = getURLParameter("pid");
    
    $.ajax({url: restURL, data: {'command':'rerunKeyword','projectid':projectID,'keywordid':keywordID}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        window.location.reload();
                    }
                }
            });
}

function closeWizard()
{
    var projectID = getURLParameter("pid");
    if(projectID !== "0" && projectID !== "")
    {
        window.location = "keywordhacker.html?pid="+projectID;
    }
    else
    {
        window.location = "dashboard.html";
    }
}

function displayKeywordAccordian(keywordID,keywordCounter)
{
    var output = "";
 
    var returnData = $('#json').val();
    var info = JSON.parse(returnData);
    
    //Get the project-level data here
    var projectInfo = info.projectSummary;
        var projectUsername = projectInfo.username;
        var projectID = projectInfo.projectID;
        var runDate = projectInfo.runDate;
        var costPerLevel = projectInfo.costPerLevel;
        var searchVolume = projectInfo.searchVolume;
        var clientURL = projectInfo.clientURL;
        var valuePerCustomer = projectInfo.valuePerCustomer;
        var active = projectInfo.active;
        var completed = projectInfo.completed;
        var clientDA = projectInfo.clientDA;
        var clientPA = projectInfo.clientPA;
        var totalPowerLevel = projectInfo.totalPowerLevel
        var incomingTraffic = Math.round(projectInfo.incomingTraffic,0);
        var runDateRaw = projectInfo.runDateRaw;
        var keywordCount = projectInfo.keywordCount;
        var geoLocation = projectInfo.geoLocation;
        var monthlyVisitors = projectInfo.monthlyVisitors;
        var payingCustomers = projectInfo.payingCustomers;
        var currencyHexCode = projectInfo.currencyHexCode;
        var useGoogle = projectInfo.useGoogle;
        var useBing = projectInfo.useBing;
        var useDefaultConversionRate = projectInfo.useDefaultConversionRate;
        
        var projectTotalContentDiff = projectInfo.projectTotalContentDiff;
        
        var customerConversionRate = projectInfo.defaultConversionRate;
    
    //Fill in the keyword data here
    var accordianHTML = "";
    var keywordInfo = info.keywordData;
    //for(var i=0; i<keywordInfo.length; i++)
    //{
        var thisEntry = keywordInfo[keywordCounter];
        var thisCompetitorArray = thisEntry.competitorData;
        
        var keywordID = thisEntry.keywordID;
        var searchVolume = thisEntry.searchVolume;
        var clientRanking = thisEntry.clientRanking;
        var keywordActive = thisEntry.active;
        var avgCTR = Math.round(thisEntry.avgCTR);
        var avgCTRExact = Math.round(thisEntry.avgCTRExact);
        var keywordHidden = thisEntry.hidden;
        var clientPowerLevel = thisEntry.clientKeywordPowerLevel;
        var errorExists = thisEntry.errorFlag;
        
        var competitorsAverageMonthlyContent = thisEntry.competitorsAverageMonthlyContent;
        var userMonthlyContent = thisEntry.userMonthlyContent;
        var userMonthlyBacklinks = thisEntry.userMonthlyBacklinks;
        var keywordTotalContentDiff = thisEntry.keywordTotalContentDiff;
        
        if(userMonthlyContent == "-1")
        {
            userMonthlyContent = "?";
        }
        if(userMonthlyBacklinks == "-1")
        {
            userMonthlyBacklinks = "?";
        }
        
        var clientCTR = Math.round(thisEntry.clientCTR);
        var avgRank = thisEntry.avgRank;
        var totalPowerLevel = thisEntry.totalPowerLevel;     //Add back the client power level to the total power level for this keyword
        
        var keyword = thisEntry.keyword;
        
        var monthlyVisitors = thisEntry.monthlyVisitors;
        var monthlyCustomers = thisEntry.monthlyCustomers;
        var monthlySales = thisEntry.monthlySales;
        var costPerMonth = thisEntry.costPerMonth;
        var keywordNetWorth = thisEntry.keywordNetWorth;
        var keywordStatus = thisEntry.status;
        
        var keywordTotalContentDiffHTML = "";
        var topKWNetworth = "";
        var topHackContentHTML = "";
        var topHackExpand = "";
        var boxGoalHTML = "";
        var bigHackContentButton = "";
        var shadedString = "";
        var errorTriangleHTML = "";
        
        if(errorExists == 1)
        {
            errorTriangleHTML = "<a data-toggle=\"tooltip\" onclick=\"rerunKeyword('"+keywordID+"');\" class=\"tooltip-hover\" title=\"\" data-original-title=\"It looks like there was an issue running this keyword. Please click the triangle icon to try re-running the phrase.\"><img src=\"images/red-warning-icon.png\" class=\"restart-icon\"></a>";
        }
        
        if(keywordStatus == "hacked")
        {
            //topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+keywordTotalContentDiff+" @ "+currencyHexCode+numberWithCommas(costPerMonth)+" </span><br/><a id=\"get-the-hack-1-"+i+"\" class=\"blueprint-links-blue\" style=\"font-size:9px;\" onclick=\"getContentReport('"+keywordID+"');\">VIEW CONTENT</a>";
            topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            //topHackExpand = "id=\"toggle-keyword-"+keywordID+"\" style=\"cursor:pointer;\" data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            topHackExpand = "style=\"cursor:pointer;\" data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)</span>";
            boxGoalHTML = keywordTotalContentDiff;
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button-blue\" onclick=\"getContentReport('"+keywordID+"');\">VIEW CONTENT</span>";
            if(keywordTotalContentDiff >= 0)
            {
                keywordTotalContentDiffHTML = "+" + keywordTotalContentDiff;
            }
            else
            {
                keywordTotalContentDiffHTML = keywordTotalContentDiff;
            }
        }
        else if(keywordStatus == "hacking" || keywordStatus == "adding")
        {
            topHackContentHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            topHackExpand = "";
            //topHackContentHTML = "$0 (0 pcs)";
            //topKWNetworth = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            boxGoalHTML = "?";
            keywordTotalContentDiffHTML = "?";
            bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button\" style=\"cursor:default;border:0;\"><img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/></span>";
        }
        else
        {
            //It's just been added, not yet hacked
            shadedString = " shaded";
            //topHackExpand = "id=\"toggle-keyword-"+keywordID+"\" style=\"cursor:pointer;\" data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            topHackExpand = "style=\"cursor:pointer;\" data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            if(keywordActive == 1)
            {
                //topHackContentHTML = "<span style=\"font-size:20px;color:#808080;text-align:center;margin-left:30%;\">?</span><br/><span style=\"text-align:center;\"><a id=\"get-the-hack-1-"+i+"\" class=\"blueprint-links\" style=\"font-size:9px;\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\">HACK CONTENT</a></span>";
                topHackContentHTML = "<span style=\"font-size:20px;color:#808080;text-align:center;margin-left:25%;\"><img src=\"images/reveal-button.png\" class=\"goal-icon\"></span>";
            }
            else
            {
                topHackContentHTML = "<span style=\"font-size:20px;color:#808080;text-align:center;margin-left:25%;\"><img src=\"images/reveal-button.png\" class=\"goal-icon\"></span>";
            }
            //boxGoalHTML = "<span id=\"get-the-hack-1.5-"+i+"\" class=\"get-the-hack-button-small\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\">HACK<br/>CONTENT</span>";
            boxGoalHTML = "?";
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\">HACK CONTENT</span>";
            keywordTotalContentDiffHTML = "?";
        }
       
        /*if(keywordStatus == "hacked" || keywordStatus == "initial_done")
        {
            topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)</span>";
            boxGoalHTML = keywordTotalContentDiff;
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button-blue\" onclick=\"getContentReport('"+keywordID+"');\">VIEW CONTENT</span>";
            if(keywordTotalContentDiff >= 0)
            {
                keywordTotalContentDiffHTML = "+" + keywordTotalContentDiff;
            }
            else
            {
                keywordTotalContentDiffHTML = keywordTotalContentDiff;
            }
        }
        else
        {
            //It's unhacked
            topHackContentHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            boxGoalHTML = "?";
            keywordTotalContentDiffHTML = "?";
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button\" style=\"cursor:default;border:0;\"><img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/></span>";
        }*/
       
        var powerLevelGoal = Math.max(1,(totalPowerLevel - clientPowerLevel));
        
        var keywordCheckboxStatus = "";
        var rowBGText = "";
        var keywordToggle = "";
        var eyeToggle = "";
        if(keywordActive == 1 && (keywordStatus == "hacked" || keywordStatus == "added"))
        {
            keywordCheckboxStatus = "checked";
            //rowBGText = " style=\"background-color:#fff;\"";
            rowBGText = " style=\"opacity:1.0;cursor:pointer;\"";
            //keywordToggle = " data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            //eyeToggle = " data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            keywordToggle = " data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            eyeToggle = " data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            
        }
        else if(keywordActive == 1 && (keywordStatus == "hacking" || keywordStatus == "adding"))
        {
            keywordCheckboxStatus = "checked";
            //rowBGText = " style=\"background-color:#fff;\"";
            rowBGText = " style=\"opacity:1.0;\"";
            //keyword = "<span class=\"shimmer\">"+keyword+"</span>";
            eyeToggle = " style=\"display:none;\"";
            //keywordToggle = " data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
            //eyeToggle = " data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\"";
        }
        else
        {
            //rowBGText = " style=\"background-color:#b3b3b3;\"";
            eyeToggle = " style=\"display:none;\"";
            rowBGText = " style=\"opacity:0.33;\"";
        }
        
        var hideCSS = "";
        if(keywordHidden == 1)
        {
            hideCSS = "style=\"display:none;\"";
        }
        
        //Add the header info for the accordian HTML
        accordianHTML += "<div id=\"kw-panel-div"+keywordID+"\" class=\"panel panel-default keyword-phraser-row\" "+hideCSS+">\n"+
                            "<ul role=\"tab\" id=\"keyword-phraser-heading"+keywordID+"\""+rowBGText+">\n"+
                                "<li class=\"checkbox-outer width-2-5\" style=\"position:relative;top:30%;font-size:28px;\" "+topHackExpand+">\n"+
                                    "<i id=\"caret-"+keywordID+"\" class=\"fa fa-caret-right\"></i>\n"+
                                "</li>\n"+
                                "<li class=\"keyword-phraser-tittle width-30\" "+topHackExpand+">\n"+
                                    "<h2><a"+keywordToggle+">"+keyword+"</a><a"+eyeToggle+" class=\"rh-view-icon\"> </a>"+errorTriangleHTML+"</h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"power-goal-info width-7\" id=\"kwid-"+keywordID+"-plg-1\">\n"+
                                    "<h2>"+powerLevelGoal+"<a data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+i+"\" class=\"rh-view-icon\"> </a></h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"monthly-organic-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-search-volume\">\n"+
                                    "<h2>"+numberWithCommas(searchVolume)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"monthly-visitors-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-monthly-visitors\">\n"+
                                    "<h2>"+numberWithCommas(monthlyVisitors)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"monthly-customers-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-monthly-customers\">\n"+
                                    "<h2>"+numberWithCommas(monthlyCustomers)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"monthly-sales-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-monthly-sales\">\n"+
                                    "<h2>"+currencyHexCode+numberWithCommas(monthlySales)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"cost-monthly-info width-12\" "+""+" id=\"kwid-"+keywordID+"-cost-per-month\">\n"+
                                    //"<h2 id=\"top-hack-content-"+i+"\" "+topHackExpand+">"+topHackContentHTML+"</h2>\n"+
                                    "<h2 id=\"top-hack-content-"+keywordCounter+"\">"+topHackContentHTML+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"keyword-net-worth-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-kw-net-worth\">\n"+
                                    "<h2 class=\"\">"+topKWNetworth+"</h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"spacer-info\"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"keyword-net-worth-info width-7\">\n"+
                                    "<h2><a id=\"get-the-hack-1-"+i+"\" class=\"blueprint-links\" onclick=\"gotoStorefrontPrefill('"+i+"');\">HACK CONTENT</a></h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"checkbox-outer content-blueprint-info width-1\">\n"+
                                    "<h2 class=\"rh-checkbox-padded\" style=\"text-align:center;padding-left:5px;\">\n"+
                                        "<input type=\"checkbox\" class=\"filled-in rh-checkbox rh-checkbox-padded\" "+keywordCheckboxStatus+" id=\"chk-content-all-kw"+keywordID+"\" onchange=\"toggleKeyword('"+keywordID+"',this.checked);\">\n"+
                                        "<label for=\"chk-content-all-kw"+keywordID+"\"></label>\n"+
                                    "</h2>\n"+
                                "</li>\n"+
                                "<li class=\"content-blueprint-info width-1\">\n"+
                                    "<h2 style=\"text-align:center;\"><span class=\"delete-icon\" style=\"float:right;text-align:right;\" title=\"Delete Keyword\" onclick=\"displayKeywordDeleteWindow('"+keywordID+"');\"><img src=\"images/ic_delete_forever_gray.png\" class=\"delete-icon\"></span></h2>\n"+
                                "</li>\n"+
                            "</ul>\n"+
                            "<div id=\"keyword-phraser-collapse"+keywordCounter+"\" class=\"panel-collapse collapse \" role=\"tabpanel\" aria-labelledby=\"keyword-phraser-heading"+i+"\">\n"+

                            "<div class=\"mobile-keyword-phraser-table\" id=\"keyword-phraser-heading"+keywordID+"\""+rowBGText+">\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-search-volume\">\n"+
                                    "<h2>The monthly average searches for each keyword:</h2><span>"+numberWithCommas(searchVolume)+"</span>\n"+
                                "</div>\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-monthly-visitors\">\n"+
                                    "<h2>Projected Monthly Visitors:</h2><span>"+numberWithCommas(monthlyVisitors)+"</span>\n"+
                                "</div>\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-monthly-customers\">\n"+
                                    "<h2>Projected Monthly Customers:</h2><span>"+numberWithCommas(monthlyCustomers)+"</span>\n"+
                                "</div>\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-monthly-sales\">\n"+
                                    "<h2>Projected Monthly Sales:</h2><span>"+currencyHexCode+numberWithCommas(monthlySales)+"</span>\n"+
                                "</div>\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-cost-per-month\">\n"+
                                    "<h2>Content Goal & Cost:</h2><span id=\"top-hack-content-"+keywordCounter+"\">"+topHackContentHTML+"</span>\n"+
                                "</div>\n"+ 
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-kw-net-worth\">\n"+
                                    "<h2>Keyword Net-Worth:</h2><span class=\"\">"+topKWNetworth+"</span>\n"+
                                "</div>\n"+
                            "</div>\n";


                            "<div class=\"power-level-summary\">\n";
        
        //Let's first build the "THEM" table so that we can determine if they hav a power level goal of 9 (need to know whether to show the warning message)
        /* old onclick sorting: 
         * 
         * onclick=\"sortKeywordCompetitors('"+keywordID+"','google-rank','"+totalPowerLevel+"');\"
         * onclick=\"sortKeywordCompetitors('"+keywordID+"','url','"+totalPowerLevel+"');\"
         * onclick=\"sortKeywordCompetitors('"+keywordID+"','ctr','"+totalPowerLevel+"');\"
         * onclick=\"sortKeywordCompetitors('"+keywordID+"','power-level','"+totalPowerLevel+"');\"
         * 
         */
        var competitorHTML = "<div class=\"col-lg-6 them-power-summary-section\" style=\"padding-right:0;\" id=\"competitors-table-"+keywordID+"\">\n" +
            "<div class=\"\" id=\"competitorsList-"+keywordID+"\" style=\"padding:0;margin:0;\">" +
                "<ul class=\"power-summary-row-highlight\" style=\"background-color:#cccccc;color:#000;border-right:1px solid #cccccc;margin:0;\">\n"+
                                "<li class=\"col-xs-12\" style=\"background-color:#cccccc;border-right:1px solid #cccccc;padding:0;\">\n"+
                                    "<h2 style=\"color:#000;text-align:center;\"><b>TOP TEN COMPETITORS RANKING FOR THIS KEYWORD PHRASE</b><!--<br/><span style=\"font-size:12px;color:#000;margin-top:10px;\">Select up to 5 competitors</span>--></h2>\n"+
                                "</li>\n"+
                            "</ul>\n"+
                
                
                "<ul class=\"power-summary-row col-xs-12\">\n"+
                    "<li class=\"checkbox-outer col-xs-1\"></li>\n"+
                    //"<li class=\"keyword-phraser-tittle col-lg-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','google-rank','"+totalPowerLevel+"','"+avgRank+"','"+avgCTR+"','"+clientCTR+"','"+clientRanking+"','"+clientURL+"','"+clientPowerLevel+"','"+powerLevelGoal+"');\">\n"+
                    "<li class=\"power-summary-rank col-xs-1\" style=\"cursor:pointer;padding-left:10px;padding-right:10px;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','google-rank');\">\n"+
                        "<h2>Rank<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i></h2>\n"+
                    "</li>\n"+
                    //"<li class=\"power-goal-info col-lg-5\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','url','"+totalPowerLevel+"','"+avgRank+"','"+avgCTR+"','"+clientCTR+"','"+clientRanking+"','"+clientURL+"','"+clientPowerLevel+"','"+powerLevelGoal+"');\">\n"+
                    "<li class=\"power-goal-info col-xs-5\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','url');\">\n"+
                        "<h2>Competitor URL<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i></h2>\n"+
                    "</li>\n"+
                    //"<li class=\"power-goal-info col-lg-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','ctr','"+totalPowerLevel+"','"+avgRank+"','"+avgCTR+"','"+clientCTR+"','"+clientRanking+"','"+clientURL+"','"+clientPowerLevel+"','"+powerLevelGoal+"');\">\n"+
                    "<li class=\"power-goal-info col-xs-1\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','ctr');\">\n"+
                        "<h2>CTR<br><i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i><a class=\"info-icon\" title=\"Click Through Rate for the ranking position and current keyword.\"> </a></h2>\n"+
                    "</li>\n"+
                    //"<li class=\"monthly-organic-info col-lg-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','monthly-content','"+totalPowerLevel+"','"+avgRank+"','"+avgCTR+"','"+clientCTR+"','"+clientRanking+"','"+clientURL+"','"+clientPowerLevel+"','"+powerLevelGoal+"');\">\n"+
                    "<li class=\"monthly-organic-info col-xs-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','monthly-backlinks');\">\n"+
                        "<h2>Total<br>Backlinks<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i></h2>\n"+
                    "</li>\n"+
                    "<li class=\"monthly-organic-info col-xs-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','monthly-content');\">\n"+
                        "<h2>Monthly<br>Content<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i><a class=\"info-icon\" title=\"The number of off-site content produced monthly with this keyword phrase as the topic.\"> </a></h2>\n"+
                    "</li>\n"+
                "</ul>\n";
        var showWarning = false;
        
        //competitorHTML += "<ul class=\"power-summary-row-hidden\" id=\"competitorsList\">";
        var competitorsCount = 0;
        var totalCTR = 0;
        var totalPowerLevel = 0;
        var totalRank = 0;
        var totalBacklinks = 0;
        
        var c1 = "";
        var c2 = "";
        var c3 = "";
        var c4 = "";
        var c5 = "";
        var disabled = false;
        
        var unhackedCompetitorExists = false;
        //competitorHTML += "<div class=\"col-lg-12\" id=\"competitorsList-"+keywordID+"\">";
        for(var j=0; j<thisCompetitorArray.length; j++)
        {
            var thisCompetitor = thisCompetitorArray[j];
            
            if(thisCompetitor.disabled == 1)
            {
                disabled = true;
            }
            else
            {
                disabled = false;
            }
            var competitorID = thisCompetitor.competitorID;
            var competitorActive = thisCompetitor.active;
            var competitorAhrefsStarted = thisCompetitor.ahrefsStarted;
            var competitorAhrefsCompleted = thisCompetitor.ahrefsCompleted;
            var competitorPositionRank = thisCompetitor.positionRank;
            var competitorURL = thisCompetitor.url;
                var competitorURLShort = competitorURL.substring(0,30);
                if(competitorURL.length > 30) { competitorURLShort += "..."; }
                
            if(competitorAhrefsStarted == 0 && competitorActive == 1)
            {
                unhackedCompetitorExists = true;
            }
                
                
            if(j == 0)
            {
                c1 = competitorURL;
            }
            else if(j == 1)
            {
                c2 = competitorURL;
            }
            else if(j == 2)
            {
                c3 = competitorURL;
            }
            else if(j == 3)
            {
                c4 = competitorURL;
            }
            else if(j == 4)
            {
                c5 = competitorURL;
            }
                
            var competitorCTR = Math.round(thisCompetitor.traffic);
            var competitorCTRExact = Math.round(thisCompetitor.trafficExact);
            //var competitorMonthlyContent = thisCompetitor.competitorMonthlyContent;
            
            var ctrType = "";
            /*var ctrType = " (b)";
            if(typeof competitorCTRExact != "undefined")
            {
                if(competitorCTRExact > 0)
                {
                    competitorCTR = competitorCTRExact;
                    ctrType = " (e)";
                }
            }*/
            
            //var competitorPowerLevel = thisCompetitor.powerLevel;
            var competitorPowerLevel = thisCompetitor.competitorMonthlyContent;
            var competitorMonthlyBacklinks = thisCompetitor.competitorMonthlyBacklinks;
            var competitorTotalBacklinks = thisCompetitor.competitorTotalBacklinks;
            var competitorContentCountHTML = "";
            var competitorMonthlyBacklinksHTML = "";
            if(competitorPowerLevel < 0 && keywordStatus == "hacking" && competitorActive == 1)
            {
                competitorContentCountHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            }
            else if(competitorPowerLevel < 0)
            {
                //competitorContentCountHTML = "<span style=\"width:100;background-color:#808080;color:#808080;\">?</span>";
                competitorContentCountHTML = "";
            }
            else
            {
                competitorContentCountHTML = competitorPowerLevel;
            }
            
            if(competitorAhrefsCompleted == 0 && keywordStatus == "hacking" && competitorActive == 1)
            {
                competitorMonthlyBacklinksHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            }
            else if(competitorMonthlyBacklinks < 0 || competitorAhrefsStarted == 0)
            {
                //competitorContentCountHTML = "<span style=\"width:100;background-color:#808080;color:#808080;\">?</span>";
                competitorContentCountHTML = "";
            }
            else
            {
                //competitorMonthlyBacklinksHTML = competitorMonthlyBacklinks;
                competitorMonthlyBacklinksHTML = numberWithCommas(parseInt(competitorTotalBacklinks));
            }
            
            /*if(competitorPowerLevel > 9 && competitorActive == 1)
            {
                showWarning = true;
            }*/
            showWarning = false;
            
            
            var competitorCheckboxStatus = "";
            var seoInsuranceHTML = "";
            if(competitorActive == 1 && !disabled)
            {
                competitorCheckboxStatus = "checked";
                competitorsCount++;
                totalCTR += competitorCTR;
                totalPowerLevel += competitorPowerLevel;
                totalRank += competitorPositionRank;
                totalBacklinks += competitorMonthlyBacklinks;
            }
            
            if(thisCompetitor.disabled == 1)
            {
                competitorCheckboxStatus = " disabled";
                seoInsuranceHTML = "<span class=\"text-right\" style=\"vertical-align:middle;float:right;padding-right:5px;padding-top:10px;\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"\" data-original-title=\"Coming soon! Buy insurance for your top 10 ranking!\"><img src=\"images/seo-insurance-icon.png\" style=\"width:25px;height:auto;\"></a></span>";
            }
            //if(competitorsCount == 0) { competitorsCount = 1;}
            
            competitorHTML += "<ul class=\"power-summary-row col-xs-12\" style=\"margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-1\">\n"+
                                    "<h2 class=\"rh-checkbox-padded\" style=\"text-align:center;\">\n"+
                                        "<input type=\"checkbox\" class=\"filled-in rh-checkbox rh-checkbox-padded\" "+competitorCheckboxStatus+" id=\"chk-content-all-c"+competitorID+"\" onchange=\"toggleCompetitor('"+competitorID+"',this.checked,'"+i+"','"+keywordID+"');\">\n"+
                                        "<label for=\"chk-content-all-c"+competitorID+"\"></label>\n"+
                                    "</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-summary-rank col-xs-1\">\n"+
                                    "<h2>"+competitorPositionRank+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-5 power-summary-competionurl\">\n"+
                                    "<h2 title=\""+competitorURL+"\">"+competitorURLShort+"<a title=\"Copy full URL to clipboard\" id=\"copy-anchor-"+competitorID+"\" class=\"copy-button\" onmouseover=\"resetTitle('"+competitorID+"');\" onclick=\"showCopiedConfirmation('"+competitorID+"');\" data-clipboard-action=\"copy\" data-clipboard-text=\""+competitorURL+"\"><i class=\"fa fa-copy fa-blue\" id=\"copy-icon-"+competitorID+"\" style=\"padding-left:5px;cursor:pointer;\"></i></a></h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"col-xs-1 power-summary-rank desktop-hidden\">\n"+
                                    "<h2>"+competitorPositionRank+"</h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"power-goal-info col-xs-1 power-summary-ctr\">\n"+
                                    "<h2>"+competitorCTR+"%"+ctrType+"</h2>\n"+
                                "</li>\n"+
                                
                                "<li class=\"col-xs-2 power-summary-monthly-backlinks"+shadedString+"\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-competitorid-"+competitorID+"-backlinks\">"+competitorMonthlyBacklinksHTML+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-offsite-content"+shadedString+"\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-competitorid-"+competitorID+"-content\">"+competitorContentCountHTML+"</h2>"+seoInsuranceHTML+"\n"+
                                "</li>\n"+                                
                            "</ul>\n";
        }
        
        //var needToHackHTML = "<div class=\"reveal-content-btn\"><span id=\"get-the-hack-2-"+i+"\" class=\"get-the-hack-button-white-bg\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\">REVEAL CONTENT</span></div>";
        var needToHackHTML = "<div class=\"reveal-content-btn\"><span id=\"get-the-hack-2-"+keywordCounter+"\" onclick=\"getKeywordCompetitorsAhrefs('"+keywordCounter+"');\"><img src=\"images/reveal-button.png\" style=\"cursor:pointer;\"></span></div>";
        if(shadedString != "")
        {
            competitorHTML += needToHackHTML;
        }
        //competitorHTML += "</div>";
        
        if(competitorsCount == 0) { competitorsCount = 1;}
        
        //Hidden element to keep track of how many competitors you've selected
        competitorHTML += "<input id=\"kwid-"+keywordID+"-competitorsCount\" type=\"hidden\" value=\""+competitorsCount+"\">\n";
        
        var competitorAvgCount = Math.ceil(totalPowerLevel/competitorsCount);
        var competitorAvgBacklinks = Math.round(totalBacklinks/competitorsCount);
        if(competitorAvgCount < 0)
        {
            competitorAvgCount = "?";
        }
        if(competitorAvgBacklinks < 0 || unhackedCompetitorExists)
        {
            competitorAvgBacklinks = "?";
        }
        
        //Add in the average row
        competitorHTML += "<ul class=\"power-summary-row-avg col-xs-12\" style=\"background-color:#e6e6e6;margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-1\" style=\"background-color:#e6e6e6;padding-left:15px;\">\n"+
                                    "<h2><b>AVG</b></h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-1 power-summary-rank\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-avg-rank\">"+Math.round(totalRank/competitorsCount)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-5 power-summary-competionurl\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2>Selected Competitors</h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"col-xs-1 power-summary-rank desktop-hidden\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-avg-rank\">"+Math.round(totalRank/competitorsCount)+"</h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"power-goal-info col-xs-1 power-summary-ctr\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-avg-ctr\">"+Math.round(totalCTR/competitorsCount)+"%</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-monthly-backlinks\" style=\"background-color:#e6e6e6;border-right:1px solid #e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-table-total-backlinks\">"+competitorAvgBacklinks+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-offsite-content\" style=\"padding-left:15px;padding-right:15px;background-color:#e6e6e6;border-right:1px solid #e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-table-total-pl\">"+competitorAvgCount+"</h2>\n"+
                                "</li>\n"+
                            "</ul>\n";
         
        
        //Add in the user's row
        competitorHTML += "<ul class=\"power-summary-row-you col-xs-12\" style=\"background-color:#e6f2ff;margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-1\" style=\"background-color:#e6f2ff;padding-left:15px;\">\n"+
                                    "<h2><b>YOU</b></h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-1 power-summary-rank\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientRanking+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-5 power-summary-competionurl\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientURL+"</h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"col-xs-1 power-summary-rank desktop-hidden\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientRanking+"</h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"power-goal-info col-xs-1 power-summary-ctr\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientCTR+"%</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-monthly-backlinks\" style=\"background-color:#e6f2ff;border-right:1px solid #e6f2ff;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-user-monthly-backlinks-count\">"+userMonthlyBacklinks+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-offsite-content\" style=\"padding-left:15px;padding-right:15px;background-color:#e6f2ff;border-right:1px solid #e6f2ff;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-user-monthly-content-count\">"+userMonthlyContent+"</h2>\n"+
                                "</li>\n"+
                            "</ul>\n";
        //competitorHTML += "<!--</div>-->\n";
        
        
        //Add in the summary row
        competitorHTML += "<ul class=\"power-summary-row-highlight col-xs-12\" style=\"background-color:#005cb9;color:#fff;border-right:1px solid #005cb9;margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-10\" style=\"background-color:#005cb9;border-right:1px solid #005cb9;padding-left:15px;\">\n"+
                                    "<h2 style=\"color:#fff;\"><a data-toggle=\"tooltip\" title=\"Monthly Content Goal = Competitors' Average Monthly Content - Your Monthly Content\" class=\"tooltip-hover\" style=\"color:#fff;\"><b>YOUR MONTHLY CONTENT GOAL</b></a></h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2\" style=\"padding-left:15px;padding-right:15px;background-color:#005cb9;color:#fff;border-right:1px solid #005cb9;margin-left:-4px;\">\n"+
                                    "<h2 style=\"color:#fff;font-size:16px;\" id=\"kwid-"+keywordID+"-plg-2\"><b>"+keywordTotalContentDiffHTML+"</b></h2>\n"+
                                "</li>\n"+
                            "</ul>\n";
                    
        competitorHTML += "</div>\n"+
                      "</div>\n";
        
        //Now put the info for client ranking power
        var plgHTML = "<div class=\"col-lg-6 you-power-summary-section\">\n"+
                                    "<!--<h2 class=\"power-summary-heading\"><span class=\"tag-label\">YOU</span> YOUR RANKING POWER LEVEL IS <span class=\"total-power-summery\">"+clientPowerLevel+"</span></h2>\n"+
                                    "<div class=\"divider\"></div>-->\n"+
                                    "<!--<ul class=\"power-summary-row power-summary-heading-row\">\n"+
                                        "<li class=\"checkbox-outer col-lg-1\"> &nbsp; </li>\n"+
                                        "<li class=\"keyword-phraser-tittle col-lg-2\">\n"+
                                            "<h2>Google Rank</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"power-goal-info col-lg-7\">\n"+
                                            "<h2>Your URL</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"monthly-organic-info col-lg-2\">\n"+
                                            "<h2>Power Level<a class=\"info-icon\" title=\"Represents the level of marketing effort required for each keyword.\"> </a></h2>\n"+
                                        "</li>\n"+
                                    "</ul>-->\n"+
                                    "<!--<ul class=\"power-summary-row\">\n"+
                                        "<li class=\"checkbox-outer col-lg-1\">\n"+
                                            "<h2 class=\"rh-checkbox-padded\">\n"+
                                                "<input type=\"checkbox\" class=\"filled-in rh-checkbox rh-checkbox-padded\" checked disabled id=\"chk-content-all2\">\n"+
                                                "<label for=\"chk-content-all2\"></label>\n"+
                                            "</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"col-lg-2\">\n"+
                                            "<h2>"+clientRanking+"</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"col-lg-7\">\n"+
                                            "<h2>"+clientURL+"</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"col-lg-2\">\n"+
                                            "<h2>"+clientPowerLevel+"</h2>\n"+
                                        "</li>\n"+
                                    "</ul>-->\n";
                            
            if(showWarning)
            {
                plgHTML += "<div class=\"warrining-message\" id=\"warning-message-head-"+keywordID+"\">\n"+
                                        "<div class=\"col-md-2 warrining-icon\"><img src=\"images/warning-sign-white.png\" alt=\"\"></div>\n"+
                                        "<div class=\"col-md-10\" style=\"margin:0;\">\n"+
                                            "<h2>You have some tricky competitors</h2>\n"+
                                        "</div>\n"+
                                    "</div>\n";
                plgHTML += "<div class=\"row\" id=\"warning-message-body-"+keywordID+"\">\n"+
                                        "<div class=\"col-md-1\"></div>\n"+
                                        "<div class=\"col-md-11\" style=\"padding:10px;\">\n"+
                                            "&middot;&nbsp;You may want to uncheck competitor urls whose power level exceedes 9</li>\n"+
                                        "</div>\n"+
                                    "</div>\n";
            }
                plgHTML += "<div class=\"power-goal-section\">\n"+
                                        "<div>\n"+
                                            "<div class=\"col-xs-3 goal-img\"><img src=\"images/goal-img.png\" alt=\"\"></div>\n"+
                                            "<div class=\"goal-details col-xs-9\">\n"+
                                                "<h1 style=\"margin-bottom:15px;\">Your Monthly Content Goal</h1>\n"+
                                                "<span id=\"kwid-"+keywordID+"-their-pl\" class=\"their-power-level-box\">"+competitorAvgCount+"</span>\n"+
                                                "<span class=\"your-power-level-box\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" style=\"background:transparent;\" title=\"Click to edit your monthly content\"><input type=\"text\" onchange=\"changeUserMonthlyContent('"+keywordID+"','"+i+"');\" class=\"transparent-text-input\" id=\"kwid-"+keywordID+"-your-pl\" value=\""+userMonthlyContent+"\"/></a></span>\n"+
                                                "<span id=\"kwid-"+keywordID+"-plg-3\" class=\"net-power-level-box\">"+boxGoalHTML+"</span>\n"+
                                             "<div class=\"goal-details col-md-12\">\n"+
                                                "<span class=\"their-power-level-label\">Their Monthly<br>Content</span>\n"+
                                                "<span class=\"your-power-level-label\">Your Monthly<br>Content</span>\n"+
                                                "<span class=\"net-power-level-label\">Your Monthly<br>Content Goal</span>\n"+
                                            "</div>\n"+
                                            "</div>\n"+
                                            "<div class=\"goal-details col-md-12\">\n"+
                                                "<h3>To match the marketing aggression of your competitors for this keyword you need to increase your content creation by <span id=\"kwid-"+keywordID+"-plg-4\" style=\"color:#005cb9;\">"+keywordTotalContentDiffHTML+"</span> per month</h3>\n"+
                                                "<p>We've analyzed your competitors' content marketing strategies to determine their monthly content creation schedule. Next, we subtracted your current monthly content creation total from theirs in order to set a monthly content goal.</p>\n"+
                                                "<p style=\"margin-top:50px;\" id=\"big-hack-content-"+i+"\">"+bigHackContentButton+"</p>\n"+
                                            "</div>"+
                                            "<!--<div class=\"goal-details col-md-12\" style=\"margin-top:250px;vertical-align:bottom;\">\n"+
                                                "<span><img src=\"images/header_arrow.png\" class=\"hack-content-arrow\"></span>\n"+
                                                "<span class=\"get-the-hack-statement\">Hack the content strategies of your competitors.</span>"+bigHackContentButton+"\n"+
                                            "</div>-->"+
                                        "</div>"+
                                    "</div>\n";
                
        
            plgHTML += "</div>\n";
            
            //Add in the competitorHTML we already built, and finish off the div
            accordianHTML += competitorHTML + plgHTML + "</div>\n" +
                                                "</div>\n" +
                                            "</div>\n";
    //}
    
    
    
    return output;
}

function refreshKeywordInfo(returnData,field,keywordID)
{
    $('body').addClass('wait');

    var info = JSON.parse(returnData);

    //Fill in the project data here
    var projectInfo = info.projectSummary;
        var projectUsername = projectInfo.username;
        var projectID = projectInfo.projectID;
        var runDate = projectInfo.runDate;
        var costPerLevel = projectInfo.costPerLevel;
        var searchVolume = projectInfo.searchVolume;
        var clientURL = projectInfo.clientURL;
        var valuePerCustomer = projectInfo.valuePerCustomer;
        var active = projectInfo.active;
        var completed = projectInfo.completed;
        var clientDA = projectInfo.clientDA;
        var clientPA = projectInfo.clientPA;
        //var clientPowerLevel = Math.max(1,Math.round((clientDA+clientPA)/2/10,0));
        var totalPowerLevel = projectInfo.totalPowerLevel
        var incomingTraffic = Math.round(projectInfo.incomingTraffic,0);
        var runDateRaw = projectInfo.runDateRaw;
        var keywordCount = projectInfo.keywordCount;
        var geoLocation = projectInfo.geoLocation;
        var monthlyVisitors = projectInfo.monthlyVisitors;
        var payingCustomers = projectInfo.payingCustomers;
        var currencyHexCode = projectInfo.currencyHexCode;
        var useGoogle = projectInfo.useGoogle;
        var useBing = projectInfo.useBing;
        var useDefaultConversionRate = projectInfo.useDefaultConversionRate;
        
        var projectTotalContentDiff = projectInfo.projectTotalContentDiff;
        
        var customerConversionRate = projectInfo.defaultConversionRate;
        if(monthlyVisitors !== 0 && payingCustomers !== 0 && useDefaultConversionRate !== 1)
        {
            customerConversionRate = (payingCustomers / monthlyVisitors);
        }
        
        var monthlyCustomers = Math.round(incomingTraffic * customerConversionRate,0);
        var monthlySales = Math.round(monthlyCustomers * valuePerCustomer,0);
        //var costPerMonth = Math.round((totalPowerLevel * costPerLevel),0);
        var costPerMonth = Math.round((projectTotalContentDiff * costPerLevel),0);
        var keywordNetWorth = (monthlySales - costPerMonth);
        
        //var customerConversionRate = (payingCustomers / monthlyVisitors);
        
        //var netWorthStyle = "green-text";
        var netWorthStyle = "white-text";
        if(keywordNetWorth < 0 || completed != 1)
        {
            netWorthStyle = "red-text";
        }
        
        var keywordNetWorthString = "";
        var firstID = 0;
        
        //Let's sort the keyword data by the specified field first
    var currSortMethod = $('#keyword-sort-method').val();
    var sortMethod = $('#keyword-sort-reversed').val();
    var reversed = false;
    
    //Find the data
    var keywordInfo = info.keywordData;

    /*
    //Got the data, now let's sort it
    if(field == 'keyword')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        keywordInfo.sort(sort_by('keyword', reversed, function(a){return a.toUpperCase()}));
    }
    else if(field == 'powerLevelGoal')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        keywordInfo.sort(sort_by('powerLevelGoal', reversed, parseInt));
    }
    else if(field == 'searchVolume')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        keywordInfo.sort(sort_by('searchVolume', reversed, parseInt));
    }
    else if(field == 'monthlyVisitors')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        keywordInfo.sort(sort_by('monthlyVisitors', reversed, parseInt));
    }
    else if(field == 'monthlyCustomers')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        keywordInfo.sort(sort_by('monthlyCustomers', reversed, parseInt));
    }
    else if(field == 'monthlySales')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        keywordInfo.sort(sort_by('monthlySales', reversed, parseInt));
    }
    else if(field == 'costPerMonth')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        keywordInfo.sort(sort_by('costPerMonth', reversed, parseInt));
    }
    else if(field == 'keywordNetWorth')
    {
        if(field == currSortMethod)
        {
            if(sortMethod == "false")
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
        }
        keywordInfo.sort(sort_by('keywordNetWorth', reversed, parseInt));
    }
    
    //Save the new sort method and reversed status
    $('#keyword-sort-method').val(field);
    $('#keyword-sort-reversed').val(reversed);*/
        
    //Iterate through the keywords to see if any are in "hacking" status; if so, show the warning message
    var currentlyHacking = false;
    var currentlyAdding = false;
    var tempKeywordInfo = info.keywordData;
    var keywordCounter = 0;
    for(var t=0; t<tempKeywordInfo.length; t++)
    {
        var tempEntry = tempKeywordInfo[t];
        var tempStatus = tempEntry.status;
        if(tempStatus == "hacking")
        {
            currentlyHacking = true;
        }
        if(tempStatus == "adding")
        {
            currentlyAdding = true;
        }

        if(tempEntry.keywordID == keywordID)
        {
            keywordCounter = t;
        }
    }

    if(completed != 1 || currentlyHacking || currentlyAdding)
    {
        keywordNetWorthString = "<span class=\"loader__dot\" style=\"font-size:15px;color:red;\">calculating...</span>";
        //Show the warning message at top, and set the flag to keep checking
        if(currentlyAdding)
        {
            $("#warning-message-content").html("Your keywords are being added. You can manually refresh this page to get the latest info, or we'll let you know as soon as all the numbers are in!");
        }
        else if(currentlyHacking)
        {
            $("#warning-message-content").html("We are hacking the content strategies of your selected competitors. This report could take several minutes to complete but it's worth the wait! You can refresh the page periodically to get the latest info, or wait for us to let you know when it's all done.");
        }

        $("#warning-message").show(400);
        $("#check-project-done-flag").val(1);
    }
    else
    {
        keywordNetWorthString = currencyHexCode+numberWithCommas(keywordNetWorth);
    }

    var activeString = "";
    if(active == 1)
    {
        activeString = "ACTIVE";
    }
    else
    {
        activeString = "INACTIVE";
    }

    $('#currency-code-1').html(currencyHexCode);
    $('#currency-code-2').html(currencyHexCode);
    $('#currency-code-3').html(currencyHexCode);

    if(useGoogle == 1 && useBing != 1)
    {
        $("#search-engine-icons").html("<i class=\"keyword-item-icon rh-google-icon\" style=\"margin-left:-5px;margin-bottom:-3px;\"></i>");
    }
    else if(useGoogle != 1 && useBing == 1)
    {
        $("#search-engine-icons").html("<img src=\"images/bing_icon.png\" class=\"icon-sized\"><img src=\"images/yahoo_icon.png\" class=\"icon-sized\">");
    }
    else
    {
        $("#search-engine-icons").html("<i class=\"keyword-item-icon rh-google-icon\" style=\"margin-left:-5px;margin-bottom:-3px;\"></i><img src=\"images/bing_icon.png\" class=\"icon-sized\"><img src=\"images/yahoo_icon.png\" class=\"icon-sized\">");
    }

    if(typeof searchVolume === 'undefined') {searchVolume = 0;}
    if(typeof incomingTraffic === 'undefined') {incomingTraffic = 0;}
    if(typeof payingCustomers === 'undefined') {payingCustomers = 0;}
    if(typeof monthlyVisitors === 'undefined') {monthlyVisitors = 0.0000001;}
    if(typeof monthlySales === 'undefined') {monthlySales = 0;}
    if(typeof costPerMonth === 'undefined' || keywordCount == 0) {costPerMonth = 0;}

    var locationTitleText = "Total monthly search volume for the city you typed in above.";
    if(typeof projectInfo.useNational != "undefined")
    {
        if(projectInfo.useNational == 1)
        {
            locationTitleText = "Total monthly search volume for the country that your city resides within.";
        }
    }

    $('#projectTitle').html(clientURL+"<span><a style=\"cursor:pointer;margin-left:7px;\" class=\"edit-icon\" title=\"Edit Mission\" onclick=\"gotoCreateProject('"+projectID+"');\"></a><!--<a style=\"cursor:pointer;margin-left:7px;margin-top:3px;color:rgba(61,61,61,.25);\" title=\"Download\" class=\"download-icon\" onclick=\"saveTextAsFile();\"></a>--></span>");
    $('#numKeywords').html(keywordCount);
    $('#geoLocation').html("<h2><a style=\"color:#000;\">"+geoLocation+"</a><!--<a class=\"edit-icon\" title=\"Edit Location\"></a>--></h2>");
    /*$('#searchVolume').html("<h2>"+numberWithCommas(searchVolume)+"<span>MO,SEARCH VOLUME<a class=\"info-icon\" title=\"This is the total sum of monthly search volume for all selected keywords in this project.\"></a></span></h2>");
    $('#projectedVisitors').html("<h2>"+numberWithCommas(incomingTraffic)+"<span>PROJECTED MO. VISITORS<a class=\"info-icon\" title=\"Calculated by applying the average CTR for your competitors to Mo. Search Volume.\"></a></span></h2>");
    $('#projectedCustomers').html("<h2>"+numberWithCommas(Math.round(incomingTraffic * (payingCustomers / monthlyVisitors),0))+"<span>PROJECTED MO. CUSTOMERS<a class=\"info-icon\" title=\"Calculated based on your conversion rate.\"></a></span></h2>");
    $('#projectedSales').html("<h2>$"+numberWithCommas(monthlySales)+"<span>PROJECTED MO. SALES<a class=\"info-icon\" title=\"Calculated based on your conversion rate and customer value.\"></a></span></h2>");
    $('#costPerMonth').html("<h2>$"+numberWithCommas(costPerMonth)+"<span>COST PER MONTH<a class=\"info-icon\" title=\"This is the total sum of monthly costs for all selected keywords in this project.\"></a></span></h2>");
    $('#kwNetWorth').html("<h2 class=\""+netWorthStyle+"\">"+keywordNetWorthString+"<span>KEYWORD NET-WORTH<a class=\"info-icon\" title=\"This is the projected return on your invested marketing dollars for all selected keywords in this project.\"></a></span></h2>");*/
    $('#searchVolume').html("<h2>"+numberWithCommas(searchVolume)+"<span>MO. SEARCH VOLUME</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
    $('#projectedVisitors').html("<h2>"+numberWithCommas(incomingTraffic)+"<span>PROJ. MO. VISITORS</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
    $('#projectedCustomers').html("<h2>"+numberWithCommas(Math.round(incomingTraffic * customerConversionRate,0))+"<span>PROJ. MO. CUSTOMERS</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
    //$('#projectedSales').html("<h2>"+currencyHexCode+numberWithCommas(monthlySales)+"<span>PROJ. MO. SALES</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
    $('#projectedSales').html("<h2>"+currencyHexCode+numberWithCommas(monthlySales)+"<span>PROJ. MO. SALES</span></h2><div class=\"header-math-sign\" style=\"font-family:'Baloo Bhaina', cursive;color:#ec1c24;font-size:48px;font-weight:bold;padding-right:25px;\">-</div>");
    //$('#costPerMonth').html("<h2>"+currencyHexCode+numberWithCommas(costPerMonth)+"<span>COST PER MONTH</span></h2><img src=\"images/header_arrow.png\" class=\"header-arrow\">");
    $('#costPerMonth').html("<h2>"+currencyHexCode+numberWithCommas(costPerMonth)+"&nbsp;<font style=\"color:#598a9e;font-size:12px;\">("+projectTotalContentDiff+" pcs)</font><span>COST PER MONTH</span></h2><div class=\"header-math-sign\" style=\"font-family:'Baloo Bhaina', cursive;color:#088D0C;font-size:48px;font-weight:bold;\">=</div>");
    $('#kwNetWorth').html("<h2 class=\""+netWorthStyle+"\" style=\"background-color:#000;\">"+keywordNetWorthString+"<span style=\"background-color:#fff;\">KEYWORD NET-WORTH</span></h2>");
    $('#dateDivBottom').html("<div class=\"project-date-card date_sort\"><i class=\"eagle-icon\"></i>Initiated "+runDate+"</div><a class=\"project-status-card  project_status_sort\" href=\"javascript:void(0);\">"+activeString+"</a>");

    //Fill in the keyword data here
    var accordianHTML = "";
    //var keywordInfo = info.keywordData;
    //for(var i=0; i<keywordInfo.length; i++)
    //{

        var thisEntry = keywordInfo[keywordCounter];
        var thisCompetitorArray = thisEntry.competitorData;

        //var keywordID = thisEntry.keywordID;
        var searchVolume = thisEntry.searchVolume;
        var clientRanking = thisEntry.clientRanking;
        var keywordActive = thisEntry.active;
        var avgCTR = Math.round(thisEntry.avgCTR);
        var avgCTRExact = Math.round(thisEntry.avgCTRExact);
        var keywordHidden = thisEntry.hidden;
        var clientPowerLevel = thisEntry.clientKeywordPowerLevel;
        var errorExists = thisEntry.errorFlag;
        //var clientPowerLevel = thisEntry.userMonthlyContent;
        
        var competitorsAverageMonthlyContent = thisEntry.competitorsAverageMonthlyContent;
        var userMonthlyContent = thisEntry.userMonthlyContent;
        var userMonthlyBacklinks = thisEntry.userMonthlyBacklinks;
        var keywordTotalContentDiff = thisEntry.keywordTotalContentDiff;
        
        if(userMonthlyContent == "-1")
        {
            userMonthlyContent = "?";
        }
        if(userMonthlyBacklinks == "-1")
        {
            userMonthlyBacklinks = "?";
        }
        
        /*if(typeof avgCTRExact != "undefined")
        {
            if(avgCTRExact > 0)
            {
                avgCTR = avgCTRExact;
            }
        }*/
        
        var clientCTR = Math.round(thisEntry.clientCTR);
        var avgRank = thisEntry.avgRank;
        var totalPowerLevel = thisEntry.totalPowerLevel;     //Add back the client power level to the total power level for this keyword
        //var totalPowerLevel = thisEntry.keywordTotalContentDiff;
        var keyword = thisEntry.keyword;

        /*var monthlyVisitors = Math.round(searchVolume * avgCTR,0);
        var monthlyCustomers = Math.round(monthlyVisitors * customerConversionRate,0);
        var monthlySales = Math.round(monthlyCustomers * valuePerCustomer,0);
        var costPerMonth = Math.round((totalPowerLevel - clientPowerLevel) * costPerLevel, 0);
        var keywordNetWorth = (monthlySales - costPerMonth);
        
        var powerLevelGoal = Math.max(1,(totalPowerLevel - clientPowerLevel));*/
        var monthlyVisitors = thisEntry.monthlyVisitors;
        var monthlyCustomers = thisEntry.monthlyCustomers;
        var monthlySales = thisEntry.monthlySales;
        var costPerMonth = thisEntry.costPerMonth;
        var keywordNetWorth = thisEntry.keywordNetWorth;
        var keywordStatus = thisEntry.status;
        
        var keywordTotalContentDiffHTML = "";
        var topKWNetworth = "";
        var topHackContentHTML = "";
        var topHackExpand = "";
        var boxGoalHTML = "";
        var bigHackContentButton = "";
        var shadedString = "";
        var errorTriangleHTML = "";
        
        if(errorExists == 1)
        //if(true)
        {
            errorTriangleHTML = "<a data-toggle=\"tooltip\" onclick=\"rerunKeyword('"+keywordID+"');\" class=\"tooltip-hover\" title=\"\" data-original-title=\"It looks like there was an issue running this keyword. Please click the triangle icon to try re-running the phrase.\"><img src=\"images/red-warning-icon.png\" class=\"restart-icon\"></a>";
        }

        if(keywordStatus == "hacked")
        {
            //topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+keywordTotalContentDiff+" @ "+currencyHexCode+numberWithCommas(costPerMonth)+" </span><br/><a id=\"get-the-hack-1-"+keywordCounter+"\" class=\"blueprint-links-blue\" style=\"font-size:9px;\" onclick=\"getContentReport('"+keywordID+"');\">VIEW CONTENT</a>";
            topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            //topHackExpand = "id=\"toggle-keyword-"+keywordID+"\" style=\"cursor:pointer;\" data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            topHackExpand = "style=\"cursor:pointer;\" data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)<img src=\"images/add-to-cart-icon.png\" style=\"margin-left:10px;margin-top:-5px;height:20px;width:auto;cursor:pointer;\" onclick=\"addToCart('"+keywordID+"');\"></span>";
            boxGoalHTML = keywordTotalContentDiff;
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+keywordCounter+"\" class=\"get-the-hack-button-blue\" onclick=\"getContentReport('"+keywordID+"');\">VIEW CONTENT</span>";
            if(keywordTotalContentDiff >= 0)
            {
                keywordTotalContentDiffHTML = "+" + keywordTotalContentDiff;
            }
            else
            {
                keywordTotalContentDiffHTML = keywordTotalContentDiff;
            }
        }
        else if(keywordStatus == "hacking")
        {
            topHackContentHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            topHackExpand = "";
            //topHackContentHTML = "$0 (0 pcs)";
            //topKWNetworth = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            boxGoalHTML = "?";
            keywordTotalContentDiffHTML = "?";
            bigHackContentButton = "<span id=\"get-the-hack-2-"+keywordCounter+"\" class=\"get-the-hack-button\" style=\"cursor:default;border:0;\"><img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/></span>";
        }
        else if(keywordStatus == "adding")
        {
            //topHackContentHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            topHackExpand = "";
            topHackContentHTML = "$0 (0 pcs)";
            topKWNetworth = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            //topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            boxGoalHTML = "?";
            keywordTotalContentDiffHTML = "?";
            bigHackContentButton = "<span id=\"get-the-hack-2-"+keywordCounter+"\" class=\"get-the-hack-button\" style=\"cursor:default;border:0;\"><img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/></span>";
        }
        else
        {
            //It's just been added, not yet hacked
            shadedString = " shaded";
            //topHackExpand = "id=\"toggle-keyword-"+keywordID+"\" style=\"cursor:pointer;\" data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            topHackExpand = "style=\"cursor:pointer;\" data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
            if(keywordActive == 1)
            {
                //topHackContentHTML = "<span style=\"font-size:20px;color:#808080;text-align:center;margin-left:30%;\">?</span><br/><span style=\"text-align:center;\"><a id=\"get-the-hack-1-"+keywordCounter+"\" class=\"blueprint-links\" style=\"font-size:9px;\" onclick=\"getKeywordCompetitorsAhrefs('"+keywordCounter+"');\">HACK CONTENT</a></span>";
                topHackContentHTML = "<span style=\"font-size:20px;color:#808080;text-align:center;margin-left:25%;\"><img src=\"images/reveal-button.png\" class=\"goal-icon\"></span>";
            }
            else
            {
                topHackContentHTML = "<span style=\"font-size:20px;color:#808080;text-align:center;margin-left:25%;\"><img src=\"images/reveal-button.png\" class=\"goal-icon\"></span>";
            }
            //boxGoalHTML = "<span id=\"get-the-hack-1.5-"+keywordCounter+"\" class=\"get-the-hack-button-small\" onclick=\"getKeywordCompetitorsAhrefs('"+keywordCounter+"');\">HACK<br/>CONTENT</span>";
            boxGoalHTML = "?";
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+keywordCounter+"\" class=\"get-the-hack-button\" onclick=\"getKeywordCompetitorsAhrefs('"+keywordCounter+"');\">HACK CONTENT</span>";
            keywordTotalContentDiffHTML = "?";
        }

        /*if(keywordStatus == "hacked" || keywordStatus == "initial_done")
        {
            topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)</span>";
            boxGoalHTML = keywordTotalContentDiff;
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+keywordCounter+"\" class=\"get-the-hack-button-blue\" onclick=\"getContentReport('"+keywordID+"');\">VIEW CONTENT</span>";
            if(keywordTotalContentDiff >= 0)
            {
                keywordTotalContentDiffHTML = "+" + keywordTotalContentDiff;
            }
            else
            {
                keywordTotalContentDiffHTML = keywordTotalContentDiff;
            }
        }
        else
        {
            //It's unhacked
            topHackContentHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            boxGoalHTML = "?";
            keywordTotalContentDiffHTML = "?";
            //bigHackContentButton = "<span id=\"get-the-hack-2-"+keywordCounter+"\" class=\"get-the-hack-button\" style=\"cursor:default;border:0;\"><img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/></span>";
        }*/
       
        var powerLevelGoal = Math.max(1,(totalPowerLevel - clientPowerLevel));
        
        var keywordCheckboxStatus = "";
        var rowBGText = "";
        var keywordToggle = "";
        var eyeToggle = "";
        if(keywordActive == 1 && (keywordStatus == "hacked" || keywordStatus == "added"))
        {
            keywordCheckboxStatus = "checked";
            //rowBGText = " style=\"background-color:#fff;\"";
            rowBGText = " style=\"opacity:1.0;cursor:pointer;\"";
            //keywordToggle = " data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            //eyeToggle = " data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            keywordToggle = " data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            eyeToggle = " data-toggle=\"collapse\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            
        }
        else if(keywordActive == 1 && (keywordStatus == "hacking" || keywordStatus == "adding"))
        {
            keywordCheckboxStatus = "checked";
            //rowBGText = " style=\"background-color:#fff;\"";
            rowBGText = " style=\"opacity:1.0;\"";
            //keyword = "<span class=\"shimmer\">"+keyword+"</span>";
            eyeToggle = " style=\"display:none;\"";
            //keywordToggle = " data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
            //eyeToggle = " data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\"";
        }
        else
        {
            //rowBGText = " style=\"background-color:#b3b3b3;\"";
            if(i == 0)
            {
                firstID = 1;
            }
            eyeToggle = " style=\"display:none;\"";
            rowBGText = " style=\"opacity:0.33;\"";
        }
        
        var hideCSS = "";
        if(keywordHidden == 1)
        {
            hideCSS = "style=\"display:none;\"";
        }
        
        //Add the header info for the accordian HTML
        //accordianHTML += "<div id=\"kw-panel-div"+keywordID+"\" class=\"panel panel-default keyword-phraser-row\" "+hideCSS+">\n"+
        accordianHTML += ""+
                            "<ul role=\"tab\" id=\"keyword-phraser-heading"+keywordID+"\""+rowBGText+">\n"+
                                "<li class=\"checkbox-outer width-2-5\" style=\"position:relative;top:30%;font-size:28px;\" "+topHackExpand+">\n"+
                                    "<i id=\"caret-"+keywordID+"\" class=\"fa fa-caret-right\"></i>\n"+
                                "</li>\n"+
                                "<li class=\"keyword-phraser-tittle width-30\" "+topHackExpand+">\n"+
                                    "<h2><a"+keywordToggle+">"+keyword+"</a><a"+eyeToggle+" class=\"rh-view-icon\"> </a>"+errorTriangleHTML+"</h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"power-goal-info width-7\" id=\"kwid-"+keywordID+"-plg-1\">\n"+
                                    "<h2>"+powerLevelGoal+"<a data-toggle=\"collapse\" data-parent=\"#keyword-phraser-accordion\" href=\"#keyword-phraser-collapse"+keywordCounter+"\" aria-expanded=\"true\" aria-controls=\"keyword-phraser-collapse"+keywordCounter+"\" class=\"rh-view-icon\"> </a></h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_yellow.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"monthly-organic-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-search-volume\">\n"+
                                    "<h2>"+numberWithCommas(searchVolume)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_yellow.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"monthly-visitors-info width-10\" id=\"kwid-"+keywordID+"-monthly-visitors\">\n"+
                                    "<h2>"+numberWithCommas(monthlyVisitors)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_yellow.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"monthly-customers-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-monthly-customers\">\n"+
                                    "<h2>"+numberWithCommas(monthlyCustomers)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_yellow.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"monthly-sales-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-monthly-sales\">\n"+
                                    "<h2>"+currencyHexCode+numberWithCommas(monthlySales)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_yellow.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"cost-monthly-info width-12\" "+""+" id=\"kwid-"+keywordID+"-cost-per-month\">\n"+
                                    //"<h2 id=\"top-hack-content-"+keywordCounter+"\" "+topHackExpand+">"+topHackContentHTML+"</h2>\n"+
                                    "<h2 id=\"top-hack-content-"+keywordCounter+"\">"+topHackContentHTML+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"spacer-info\" "+topHackExpand+"><img src=\"images/keyword_row_arrow_yellow.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"keyword-net-worth-info width-10\" "+topHackExpand+" id=\"kwid-"+keywordID+"-kw-net-worth\">\n"+
                                    "<h2 class=\"\">"+topKWNetworth+"</h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"spacer-info\"><img src=\"images/keyword_row_arrow_white.png\" class=\"keyword-row-arrow\"></li>\n"+
                                "<li class=\"keyword-net-worth-info width-7\">\n"+
                                    "<h2><a id=\"get-the-hack-1-"+keywordCounter+"\" class=\"blueprint-links\" onclick=\"gotoStorefrontPrefill('"+keywordCounter+"');\">HACK CONTENT</a></h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"checkbox-outer content-blueprint-info width-1\">\n"+
                                    "<h2 class=\"rh-checkbox-padded\" style=\"text-align:center;padding-left:5px;\">\n"+
                                        "<input type=\"checkbox\" class=\"filled-in rh-checkbox rh-checkbox-padded\" "+keywordCheckboxStatus+" id=\"chk-content-all-kw"+keywordID+"\" onchange=\"toggleKeyword('"+keywordID+"',this.checked);\">\n"+
                                        "<label for=\"chk-content-all-kw"+keywordID+"\"></label>\n"+
                                    "</h2>\n"+
                                "</li>\n"+
                                "<li class=\"content-blueprint-info width-1\">\n"+
                                    "<h2 style=\"text-align:center;\"><span class=\"delete-icon\" style=\"float:right;text-align:right;\" title=\"Delete Keyword\" onclick=\"displayKeywordDeleteWindow('"+keywordID+"');\"><img src=\"images/ic_delete_forever_gray.png\" class=\"delete-icon\"></span></h2>\n"+
                                "</li>\n"+
                            "</ul>\n"+
                            "<div id=\"keyword-phraser-collapse"+keywordCounter+"\" class=\"panel-collapse collapse in\" role=\"tabpanel\" aria-labelledby=\"keyword-phraser-heading"+keywordCounter+"\">\n"+

                            "<div class=\"mobile-keyword-phraser-table\" id=\"keyword-phraser-heading"+keywordID+"\""+rowBGText+">\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-search-volume\">\n"+
                                    "<h2>The monthly average searches for each keyword:</h2><span>"+numberWithCommas(searchVolume)+"</span>\n"+
                                "</div>\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-monthly-visitors\">\n"+
                                    "<h2>Projected Monthly Visitors:</h2><span>"+numberWithCommas(monthlyVisitors)+"</span>\n"+
                                "</div>\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-monthly-customers\">\n"+
                                    "<h2>Projected Monthly Customers:</h2><span>"+numberWithCommas(monthlyCustomers)+"</span>\n"+
                                "</div>\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-monthly-sales\">\n"+
                                    "<h2>Projected Monthly Sales:</h2><span>"+currencyHexCode+numberWithCommas(monthlySales)+"</span>\n"+
                                "</div>\n"+
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-cost-per-month\">\n"+
                                    "<h2>Content Goal & Cost:</h2><span id=\"top-hack-content-"+keywordCounter+"\">"+topHackContentHTML+"</span>\n"+
                                "</div>\n"+ 
                                "<div class=\"phraser-table-block\" id=\"kwid-"+keywordID+"-kw-net-worth\">\n"+
                                    "<h2>Keyword Net-Worth:</h2><span class=\"\">"+topKWNetworth+"</span>\n"+
                                "</div>\n"+
                            "</div>\n";


                            "<div class=\"power-level-summary\">\n";
        
        //Let's first build the "THEM" table so that we can determine if they hav a power level goal of 9 (need to know whether to show the warning message)
        /* old onclick sorting: 
         * 
         * onclick=\"sortKeywordCompetitors('"+keywordID+"','google-rank','"+totalPowerLevel+"');\"
         * onclick=\"sortKeywordCompetitors('"+keywordID+"','url','"+totalPowerLevel+"');\"
         * onclick=\"sortKeywordCompetitors('"+keywordID+"','ctr','"+totalPowerLevel+"');\"
         * onclick=\"sortKeywordCompetitors('"+keywordID+"','power-level','"+totalPowerLevel+"');\"
         * 
         */
        var competitorHTML = "<div class=\"col-lg-6 them-power-summary-section\" style=\"padding-right:0;\" id=\"competitors-table-"+keywordID+"\">\n" +
            "<div class=\"\" id=\"competitorsList-"+keywordID+"\" style=\"padding:0;margin:0;\">" +
                "<ul class=\"power-summary-row-highlight\" style=\"background-color:#cccccc;color:#000;border-right:1px solid #cccccc;margin:0;\">\n"+
                                "<li class=\"col-xs-12\" style=\"background-color:#cccccc;border-right:1px solid #cccccc;padding:0;\">\n"+
                                    "<h2 style=\"color:#000;text-align:center;\"><b>TOP TEN COMPETITORS RANKING FOR THIS KEYWORD PHRASE</b><!--<br/><span style=\"font-size:12px;color:#000;margin-top:10px;\">Select up to 5 competitors</span>--></h2>\n"+
                                "</li>\n"+
                            "</ul>\n"+
                
                
                "<ul class=\"power-summary-row col-xs-12\">\n"+
                    "<li class=\"checkbox-outer col-xs-1\"></li>\n"+
                    //"<li class=\"keyword-phraser-tittle col-lg-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','google-rank','"+totalPowerLevel+"','"+avgRank+"','"+avgCTR+"','"+clientCTR+"','"+clientRanking+"','"+clientURL+"','"+clientPowerLevel+"','"+powerLevelGoal+"');\">\n"+
                    "<li class=\"power-summary-rank col-xs-1\" style=\"cursor:pointer;padding-left:10px;padding-right:10px;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','google-rank');\">\n"+
                        "<h2>Rank<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i></h2>\n"+
                    "</li>\n"+
                    //"<li class=\"power-goal-info col-lg-5\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','url','"+totalPowerLevel+"','"+avgRank+"','"+avgCTR+"','"+clientCTR+"','"+clientRanking+"','"+clientURL+"','"+clientPowerLevel+"','"+powerLevelGoal+"');\">\n"+
                    "<li class=\"power-goal-info col-xs-5\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','url');\">\n"+
                        "<h2>Competitor URL<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i></h2>\n"+
                    "</li>\n"+
                    //"<li class=\"power-goal-info col-lg-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','ctr','"+totalPowerLevel+"','"+avgRank+"','"+avgCTR+"','"+clientCTR+"','"+clientRanking+"','"+clientURL+"','"+clientPowerLevel+"','"+powerLevelGoal+"');\">\n"+
                    "<li class=\"power-goal-info col-xs-1\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','ctr');\">\n"+
                        "<h2>CTR<br><i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i><a class=\"info-icon\" title=\"Click Through Rate for the ranking position and current keyword.\"> </a></h2>\n"+
                    "</li>\n"+
                    //"<li class=\"monthly-organic-info col-lg-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','monthly-content','"+totalPowerLevel+"','"+avgRank+"','"+avgCTR+"','"+clientCTR+"','"+clientRanking+"','"+clientURL+"','"+clientPowerLevel+"','"+powerLevelGoal+"');\">\n"+
                    "<li class=\"monthly-organic-info col-xs-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','monthly-backlinks');\">\n"+
                        "<h2>Total<br>Backlinks<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i></h2>\n"+
                    "</li>\n"+
                    "<li class=\"monthly-organic-info col-xs-2\" style=\"cursor:pointer;\" onclick=\"sortKeywordCompetitors('"+keywordID+"','monthly-content');\">\n"+
                        "<h2>Monthly<br>Content<i class=\"fa fa-sort\" style=\"padding-left:5px;color:#8c8c8c;\"></i><a class=\"info-icon\" title=\"The number of off-site content produced monthly with this keyword phrase as the topic.\"> </a></h2>\n"+
                    "</li>\n"+
                "</ul>\n";
        var showWarning = false;
        
        //competitorHTML += "<ul class=\"power-summary-row-hidden\" id=\"competitorsList\">";
        var competitorsCount = 0;
        var totalCTR = 0;
        var totalPowerLevel = 0;
        var totalRank = 0;
        var totalBacklinks = 0;
        
        var c1 = "";
        var c2 = "";
        var c3 = "";
        var c4 = "";
        var c5 = "";
        var disabled = false;
        
        var unhackedCompetitorExists = false;
        //competitorHTML += "<div class=\"col-lg-12\" id=\"competitorsList-"+keywordID+"\">";
        for(var j=0; j<thisCompetitorArray.length; j++)
        {
            var thisCompetitor = thisCompetitorArray[j];
            
            if(thisCompetitor.disabled == 1)
            {
                disabled = true;
            }
            else
            {
                disabled = false;
            }
            var competitorID = thisCompetitor.competitorID;
            var competitorActive = thisCompetitor.active;
            var competitorAhrefsStarted = thisCompetitor.ahrefsStarted;
            var competitorAhrefsCompleted = thisCompetitor.ahrefsCompleted;
            var competitorPositionRank = thisCompetitor.positionRank;
            var competitorURL = thisCompetitor.url;
                var competitorURLShort = competitorURL.substring(0,30);
                if(competitorURL.length > 30) { competitorURLShort += "..."; }
                
            if(competitorAhrefsStarted == 0 && competitorActive == 1)
            {
                unhackedCompetitorExists = true;
            }
                
                
            if(j == 0)
            {
                c1 = competitorURL;
            }
            else if(j == 1)
            {
                c2 = competitorURL;
            }
            else if(j == 2)
            {
                c3 = competitorURL;
            }
            else if(j == 3)
            {
                c4 = competitorURL;
            }
            else if(j == 4)
            {
                c5 = competitorURL;
            }
                
            var competitorCTR = Math.round(thisCompetitor.traffic);
            var competitorCTRExact = Math.round(thisCompetitor.trafficExact);
            //var competitorMonthlyContent = thisCompetitor.competitorMonthlyContent;
            
            var ctrType = "";
            /*var ctrType = " (b)";
            if(typeof competitorCTRExact != "undefined")
            {
                if(competitorCTRExact > 0)
                {
                    competitorCTR = competitorCTRExact;
                    ctrType = " (e)";
                }
            }*/
            
            //var competitorPowerLevel = thisCompetitor.powerLevel;
            var competitorPowerLevel = thisCompetitor.competitorMonthlyContent;
            var competitorMonthlyBacklinks = thisCompetitor.competitorMonthlyBacklinks;
            var competitorTotalBacklinks = thisCompetitor.competitorTotalBacklinks;
            var competitorContentCountHTML = "";
            var competitorMonthlyBacklinksHTML = "";
            if(competitorPowerLevel < 0 && keywordStatus == "hacking" && competitorActive == 1)
            {
                competitorContentCountHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            }
            else if(competitorPowerLevel < 0)
            {
                //competitorContentCountHTML = "<span style=\"width:100;background-color:#808080;color:#808080;\">?</span>";
                competitorContentCountHTML = "";
            }
            else
            {
                competitorContentCountHTML = competitorPowerLevel;
            }
            
            if(competitorAhrefsCompleted == 0 && keywordStatus == "hacking" && competitorActive == 1)
            {
                competitorMonthlyBacklinksHTML = "<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>";
            }
            else if(competitorMonthlyBacklinks < 0 || competitorAhrefsStarted == 0)
            {
                //competitorContentCountHTML = "<span style=\"width:100;background-color:#808080;color:#808080;\">?</span>";
                competitorContentCountHTML = "";
            }
            else
            {
                //competitorMonthlyBacklinksHTML = competitorMonthlyBacklinks;
                competitorMonthlyBacklinksHTML = numberWithCommas(parseInt(competitorTotalBacklinks));
            }
            
            /*if(competitorPowerLevel > 9 && competitorActive == 1)
            {
                showWarning = true;
            }*/
            showWarning = false;
            
            
            var competitorCheckboxStatus = "";
            var seoInsuranceHTML = "";
            if(competitorActive == 1 && !disabled)
            {
                competitorCheckboxStatus = "checked";
                competitorsCount++;
                totalCTR += competitorCTR;
                totalPowerLevel += competitorPowerLevel;
                totalRank += competitorPositionRank;
                totalBacklinks += competitorMonthlyBacklinks;
            }
            
            if(thisCompetitor.disabled == 1)
            {
                competitorCheckboxStatus = " disabled";
                seoInsuranceHTML = "<span class=\"text-right\" style=\"vertical-align:middle;float:right;padding-right:5px;padding-top:10px;\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"\" data-original-title=\"Coming soon! Buy insurance for your top 10 ranking!\"><img src=\"images/seo-insurance-icon.png\" style=\"width:25px;height:auto;\"></a></span>";
            }
            //if(competitorsCount == 0) { competitorsCount = 1;}
            
            competitorHTML += "<ul class=\"power-summary-row col-xs-12\" style=\"margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-1\">\n"+
                                    "<h2 class=\"rh-checkbox-padded\" style=\"text-align:center;\">\n"+
                                        "<input type=\"checkbox\" class=\"filled-in rh-checkbox rh-checkbox-padded\" "+competitorCheckboxStatus+" id=\"chk-content-all-c"+competitorID+"\" onchange=\"toggleCompetitor('"+competitorID+"',this.checked,'"+keywordCounter+"','"+keywordID+"');\">\n"+
                                        "<label for=\"chk-content-all-c"+competitorID+"\"></label>\n"+
                                    "</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-summary-rank col-xs-1\">\n"+
                                    "<h2>"+competitorPositionRank+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-5 power-summary-competionurl\">\n"+
                                    "<h2 title=\""+competitorURL+"\">"+competitorURLShort+"<a title=\"Copy full URL to clipboard\" id=\"copy-anchor-"+competitorID+"\" class=\"copy-button\" onmouseover=\"resetTitle('"+competitorID+"');\" onclick=\"showCopiedConfirmation('"+competitorID+"');\" data-clipboard-action=\"copy\" data-clipboard-text=\""+competitorURL+"\"><i class=\"fa fa-copy fa-blue\" id=\"copy-icon-"+competitorID+"\" style=\"padding-left:5px;cursor:pointer;\"></i></a></h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"col-xs-1 power-summary-rank desktop-hidden\">\n"+
                                    "<h2>"+competitorPositionRank+"</h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"power-goal-info col-xs-1 power-summary-ctr\">\n"+
                                    "<h2>"+competitorCTR+"%"+ctrType+"</h2>\n"+
                                "</li>\n"+
                                
                                "<li class=\"col-xs-2 power-summary-monthly-backlinks"+shadedString+"\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-competitorid-"+competitorID+"-backlinks\">"+competitorMonthlyBacklinksHTML+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-offsite-content"+shadedString+"\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-competitorid-"+competitorID+"-content\">"+competitorContentCountHTML+"</h2>"+seoInsuranceHTML+"\n"+
                                "</li>\n"+                                
                            "</ul>\n";
        }
        
        //var needToHackHTML = "<div class=\"reveal-content-btn\"><span id=\"get-the-hack-2-"+keywordCounter+"\" class=\"get-the-hack-button-white-bg\" onclick=\"getKeywordCompetitorsAhrefs('"+keywordCounter+"');\">REVEAL CONTENT</span></div>";
        var needToHackHTML = "<div class=\"reveal-content-btn\"><span id=\"get-the-hack-2-"+keywordCounter+"\" onclick=\"getKeywordCompetitorsAhrefs('"+keywordCounter+"');\"><img src=\"images/reveal-button.png\" style=\"cursor:pointer;\"></span></div>";
        if(shadedString != "")
        {
            competitorHTML += needToHackHTML;
        }
        //competitorHTML += "</div>";
        
        if(competitorsCount == 0) { competitorsCount = 1;}
        
        //Hidden element to keep track of how many competitors you've selected
        competitorHTML += "<input id=\"kwid-"+keywordID+"-competitorsCount\" type=\"hidden\" value=\""+competitorsCount+"\">\n";
        
        var competitorAvgCount = Math.ceil(totalPowerLevel/competitorsCount);
        var competitorAvgBacklinks = Math.round(totalBacklinks/competitorsCount);
        if(competitorAvgCount < 0)
        {
            competitorAvgCount = "?";
        }
        if(competitorAvgBacklinks < 0 || unhackedCompetitorExists)
        {
            competitorAvgBacklinks = "?";
        }
        
        //Add in the average row
        competitorHTML += "<ul class=\"power-summary-row-avg col-xs-12\" style=\"background-color:#e6e6e6;margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-1\" style=\"background-color:#e6e6e6;padding-left:15px;\">\n"+
                                    "<h2><b>AVG</b></h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-1 power-summary-rank\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-avg-rank\">"+Math.round(totalRank/competitorsCount)+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-5 power-summary-competionurl\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2>Selected Competitors</h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"col-xs-1 power-summary-rank desktop-hidden\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-avg-rank\">"+Math.round(totalRank/competitorsCount)+"</h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"power-goal-info col-xs-1 power-summary-ctr\" style=\"background-color:#e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-avg-ctr\">"+Math.round(totalCTR/competitorsCount)+"%</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-monthly-backlinks\" style=\"background-color:#e6e6e6;border-right:1px solid #e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-table-total-backlinks\">"+competitorAvgBacklinks+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-offsite-content\" style=\"padding-left:15px;padding-right:15px;background-color:#e6e6e6;border-right:1px solid #e6e6e6;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-table-total-pl\">"+competitorAvgCount+"</h2>\n"+
                                "</li>\n"+
                            "</ul>\n";
         
        
        //Add in the user's row
        competitorHTML += "<ul class=\"power-summary-row-you col-xs-12\" style=\"background-color:#e6f2ff;margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-1\" style=\"background-color:#e6f2ff;padding-left:15px;\">\n"+
                                    "<h2><b>YOU</b></h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-1 power-summary-rank\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientRanking+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"power-goal-info col-xs-5 power-summary-competionurl\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientURL+"</h2>\n"+
                                "</li>\n"+
                                /*"<li class=\"col-xs-1 power-summary-rank desktop-hidden\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientRanking+"</h2>\n"+
                                "</li>\n"+*/
                                "<li class=\"power-goal-info col-xs-1 power-summary-ctr\" style=\"background-color:#e6f2ff;\">\n"+
                                    "<h2>"+clientCTR+"%</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-monthly-backlinks\" style=\"background-color:#e6f2ff;border-right:1px solid #e6f2ff;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-user-monthly-backlinks-count\">"+userMonthlyBacklinks+"</h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2 power-summary-offsite-content\" style=\"padding-left:15px;padding-right:15px;background-color:#e6f2ff;border-right:1px solid #e6f2ff;\">\n"+
                                    "<h2 id=\"kwid-"+keywordID+"-user-monthly-content-count\">"+userMonthlyContent+"</h2>\n"+
                                "</li>\n"+
                            "</ul>\n";
        //competitorHTML += "<!--</div>-->\n";
        
        
        //Add in the summary row
        competitorHTML += "<ul class=\"power-summary-row-highlight col-xs-12\" style=\"background-color:#005cb9;color:#fff;border-right:1px solid #005cb9;margin:0;\">\n"+
                                "<li class=\"checkbox-outer col-xs-10\" style=\"background-color:#005cb9;border-right:1px solid #005cb9;padding-left:15px;\">\n"+
                                    "<h2 style=\"color:#fff;\"><a data-toggle=\"tooltip\" title=\"Monthly Content Goal = Competitors' Average Monthly Content - Your Monthly Content\" class=\"tooltip-hover\" style=\"color:#fff;\"><b>YOUR MONTHLY CONTENT GOAL</b></a></h2>\n"+
                                "</li>\n"+
                                "<li class=\"col-xs-2\" style=\"padding-left:15px;padding-right:15px;background-color:#005cb9;color:#fff;border-right:1px solid #005cb9;margin-left:-4px;\">\n"+
                                    "<h2 style=\"color:#fff;font-size:16px;\" id=\"kwid-"+keywordID+"-plg-2\"><b>"+keywordTotalContentDiffHTML+"</b></h2>\n"+
                                "</li>\n"+
                            "</ul>\n";
                    
        competitorHTML += "</div>\n"+
                      "</div>\n";
        
        //Now put the info for client ranking power
        var plgHTML = "<div class=\"col-lg-6 you-power-summary-section\">\n"+
                                    "<!--<h2 class=\"power-summary-heading\"><span class=\"tag-label\">YOU</span> YOUR RANKING POWER LEVEL IS <span class=\"total-power-summery\">"+clientPowerLevel+"</span></h2>\n"+
                                    "<div class=\"divider\"></div>-->\n"+
                                    "<!--<ul class=\"power-summary-row power-summary-heading-row\">\n"+
                                        "<li class=\"checkbox-outer col-lg-1\"> &nbsp; </li>\n"+
                                        "<li class=\"keyword-phraser-tittle col-lg-2\">\n"+
                                            "<h2>Google Rank</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"power-goal-info col-lg-7\">\n"+
                                            "<h2>Your URL</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"monthly-organic-info col-lg-2\">\n"+
                                            "<h2>Power Level<a class=\"info-icon\" title=\"Represents the level of marketing effort required for each keyword.\"> </a></h2>\n"+
                                        "</li>\n"+
                                    "</ul>-->\n"+
                                    "<!--<ul class=\"power-summary-row\">\n"+
                                        "<li class=\"checkbox-outer col-lg-1\">\n"+
                                            "<h2 class=\"rh-checkbox-padded\">\n"+
                                                "<input type=\"checkbox\" class=\"filled-in rh-checkbox rh-checkbox-padded\" checked disabled id=\"chk-content-all2\">\n"+
                                                "<label for=\"chk-content-all2\"></label>\n"+
                                            "</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"col-lg-2\">\n"+
                                            "<h2>"+clientRanking+"</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"col-lg-7\">\n"+
                                            "<h2>"+clientURL+"</h2>\n"+
                                        "</li>\n"+
                                        "<li class=\"col-lg-2\">\n"+
                                            "<h2>"+clientPowerLevel+"</h2>\n"+
                                        "</li>\n"+
                                    "</ul>-->\n";
                            
            if(showWarning)
            {
                plgHTML += "<div class=\"warrining-message\" id=\"warning-message-head-"+keywordID+"\">\n"+
                                        "<div class=\"col-md-2 warrining-icon\"><img src=\"images/warning-sign-white.png\" alt=\"\"></div>\n"+
                                        "<div class=\"col-md-10\" style=\"margin:0;\">\n"+
                                            "<h2>You have some tricky competitors</h2>\n"+
                                        "</div>\n"+
                                    "</div>\n";
                plgHTML += "<div class=\"row\" id=\"warning-message-body-"+keywordID+"\">\n"+
                                        "<div class=\"col-md-1\"></div>\n"+
                                        "<div class=\"col-md-11\" style=\"padding:10px;\">\n"+
                                            "&middot;&nbsp;You may want to uncheck competitor urls whose power level exceedes 9</li>\n"+
                                        "</div>\n"+
                                    "</div>\n";
            }
                plgHTML += "<div class=\"power-goal-section\">\n"+
                                        "<div>\n"+
                                            "<div class=\"col-xs-3 goal-img\"><img src=\"images/goal-img.png\" alt=\"\"></div>\n"+
                                            "<div class=\"goal-details col-xs-9\">\n"+
                                                "<h1 style=\"margin-bottom:15px;\">Your Monthly Content Goal</h1>\n"+
                                                "<span id=\"kwid-"+keywordID+"-their-pl\" class=\"their-power-level-box\">"+competitorAvgCount+"</span>\n"+
                                                "<span class=\"your-power-level-box\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" style=\"background:transparent;\" title=\"Click to edit your monthly content\"><input type=\"text\" onchange=\"changeUserMonthlyContent('"+keywordID+"','"+keywordCounter+"');\" class=\"transparent-text-input\" id=\"kwid-"+keywordID+"-your-pl\" value=\""+userMonthlyContent+"\"/></a></span>\n"+
                                                "<span id=\"kwid-"+keywordID+"-plg-3\" class=\"net-power-level-box\">"+boxGoalHTML+"</span>\n"+
                                             "<div class=\"goal-details col-md-12\">\n"+
                                                "<span class=\"their-power-level-label\">Their Monthly<br>Content</span>\n"+
                                                "<span class=\"your-power-level-label\">Your Monthly<br>Content</span>\n"+
                                                "<span class=\"net-power-level-label\">Your Monthly<br>Content Goal</span>\n"+
                                            "</div>\n"+
                                            "</div>\n"+
                                            "<div class=\"goal-details col-md-12\">\n"+
                                                "<h3>To match the marketing aggression of your competitors for this keyword you need to increase your content creation by <span id=\"kwid-"+keywordID+"-plg-4\" style=\"color:#005cb9;\">"+keywordTotalContentDiffHTML+"</span> per month</h3>\n"+
                                                "<p>We've analyzed your competitors' content marketing strategies to determine their monthly content creation schedule. Next, we subtracted your current monthly content creation total from theirs in order to set a monthly content goal.</p>\n"+
                                                "<p style=\"margin-top:50px;\" id=\"big-hack-content-"+keywordCounter+"\">"+bigHackContentButton+"</p>\n"+
                                            "</div>"+
                                            "<!--<div class=\"goal-details col-md-12\" style=\"margin-top:250px;vertical-align:bottom;\">\n"+
                                                "<span><img src=\"images/header_arrow.png\" class=\"hack-content-arrow\"></span>\n"+
                                                "<span class=\"get-the-hack-statement\">Hack the content strategies of your competitors.</span>"+bigHackContentButton+"\n"+
                                            "</div>-->"+
                                        "</div>"+
                                    "</div>\n";
                
        
            plgHTML += "</div>\n";
            
            //Add in the competitorHTML we already built, and finish off the div
            accordianHTML += competitorHTML + plgHTML + "</div>\n" +
                                                "</div>\n";
                    
            $("#kw-panel-div"+keywordID).html(accordianHTML);
    //}
    
    /*document.getElementById('main-panel').style.display = "";
    $('#keyword-phraser-accordion').html(accordianHTML);
    
    var suggestedKeywordsHTML = "";
    var suggestedKeywords = info.suggestedKeywords;
    for(var i=0; i<suggestedKeywords.length; i++)
    {
        if(i<35)
        {
            suggestedKeywordsHTML += "<li>"+suggestedKeywords[i]+"</li>";
        }
        else
        {
            suggestedKeywordsHTML += "<li class=\"read-more-target\">"+suggestedKeywords[i]+"</li>";
        }
    }
    $("#suggestedKeywordsList").html(suggestedKeywordsHTML);*/
    document.getElementById('loading_spinner').style.display = "none";
    document.getElementById('loading_spinner_message').style.display = "none";
    $('body').removeClass('wait');
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
}

function wizardToggle(e)
{
    var currPosition = $("#toggle-position").val();
    
    if(currPosition == "1")
    {
        //hack actual
        //$("#toggle-position").val("2");
        selectActualNetworth(e);
    }
    else
    {
        //hack estimated
        //$("#toggle-position").val("1");
        selectEstimatedNetworth(e);
    }
}

function addToCart(keywordID)
{
    var projectID = getURLParameter("pid");
    var username = getCookie("username");
    if(username != '')
    {
        if(keywordID == -1)
        {
            $.ajax({url: restURL, data: {'command':'addProjectContentToCart','username':username,'projectid':projectID}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        refreshCartDropdown();
                    }
                }
            });
        }
        else
        {
            $.ajax({url: restURL, data: {'command':'addKeywordContentToCart','username':username,'keywordid':keywordID}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        refreshCartDropdown();
                    }
                }
            });
        }
    }
    else
    {
        
    }
    //window.location = "addtocart.html?pid="+projectID+"&kwid="+keywordID;
}

function refreshCartDropdown()
{
    var username = getCookie("username");
    if(username != '')
    {
        $.ajax({url: restURL, data: {'command':'getCartDropdownData','username':username}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        var totalContent = info.total_content;
                        var totalCost = numberWithCommas(parseFloat(info.total_cost).toFixed(0));
                        
                        var missionCount = 0;
                        var keywordCount = 0;
                        var projectManagementCount = 0;
                        
                        var iconSrc = "../keywordhacker/images/cart_empty.png";
                        
                        if(totalContent > 0)
                        {
                            iconSrc = "../keywordhacker/images/cart_full.png";
                            missionCount = info.missions;
                            keywordCount = info.keywords;
                            projectManagementCount = info.project_management;
                        }
                        
                        $("#cart-image").attr('src',iconSrc);
                        $("#cart-total-pieces").html(totalContent);
                        $("#cart-total-missions").html(missionCount);
                        $("#cart-total-keywords").html(keywordCount);
                        $("#cart-total-project-mgmt").html(projectManagementCount);
                        $("#cart-total-cost").html("$"+totalCost);
                    }
                }
            });
    }
}

function prepareCart()
{
    var username = getCookie("username");
    var projectID = getURLParameter("pid");
    if(username != '')
    {
        if(username !== 'admin@fairmarketing.com' && $('#industry-link').length)
        {
            $('#industry-link').remove();
            $('#users-link').remove();
        }
        
        getAddonItems(function(output){
            $("#addons").val(output);
            refreshCartDetails();
        });
    }
    else
    {
        window.location = "../index.html";
    }
}

function gotoCHPreview()
{
    window.location = "../contenthacker_preview/contenthacker.html";
}

function refreshKeywordSuggestions()
{
    var username = getCookie("username");
    var projectID = getURLParameter("pid");
    if(username != '' && projectID != '')
    {
        $.ajax({url: restURL, data: {'command':'getProjectKeywordSuggestions','projectid':projectID}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    var suggestedKeywordsHTML = "";
                    var suggestedKeywords = info.suggestedKeywords;
                    for(var i=0; i<suggestedKeywords.length; i++)
                    {
                        if(i<35)
                        {
                            suggestedKeywordsHTML += "<li data-type=\"1\">"+suggestedKeywords[i]+"</li>";
                        }
                        else
                        {
                            suggestedKeywordsHTML += "<li data-type=\"1\" class=\"read-more-target\">"+suggestedKeywords[i]+"</li>";
                        }
                    }
                    $("#suggestedKeywordsList").html(suggestedKeywordsHTML);
                    
                    var altSuggestedKeywordsHTML = "";
                    var altSuggestedKeywords = info.altSuggestedKeywords;
                    for(var i=0; i<altSuggestedKeywords.length; i++)
                    {
                        if(i<35)
                        {
                            altSuggestedKeywordsHTML += "<li data-type=\"2\">"+altSuggestedKeywords[i]+"</li>";
                        }
                        else
                        {
                            altSuggestedKeywordsHTML += "<li data-type=\"2\" class=\"read-more-target\">"+altSuggestedKeywords[i]+"</li>";
                        }
                    }
                    $("#altSuggestedKeywordsList").html(altSuggestedKeywordsHTML);
                }
            }
        });
    }
}

function prepareCalculator()
{
    jQuery.noConflict();
    var username = getCookie("username");
    //var projectID = getURLParameter("pid");
    if(username != '')
    {
        if(username !== 'admin@fairmarketing.com' && jQuery('#industry-link').length)
        {
            jQuery('#industry-link').remove();
            jQuery('#users-link').remove();
        }
        
        refreshCartDropdownForCalculator();
        
        jQuery.ajax({url: restURL, data: {'command':'getUserInfo','username':username}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    var users = info.users;
                    var userInfo = users[0];

                    var firstName = userInfo.firstName;
                    var lastName = userInfo.lastName;
                    var username = userInfo.username;
                    /*if(lastName == '')
                    {
                        lastName = "Anderson";
                    }*/
                    
                    jQuery("#welcome-message").html("welcome <strong>AGENT "+lastName.toUpperCase()+"</strong> <strong>[</strong> this feature is coming soon <strong>]</strong>");
                    jQuery("#back-button").html("<a class=\"orange-btn btn\" onclick=\"javascript:history.back();\">BACK TO THE PREVIOUS PAGE</a>");
                }
            }
        });
    }
    else
    {
        window.location = "../index.html";
    }
}

function prepareFAQs()
{
    jQuery.noConflict();
    var username = getCookie("username");
    //var projectID = getURLParameter("pid");
    if(username != '')
    {
        if(username !== 'admin@fairmarketing.com' && jQuery('#industry-link').length)
        {
            jQuery('#industry-link').remove();
            jQuery('#users-link').remove();
        }
        
        refreshCartDropdownForCalculator();
        
        jQuery.ajax({url: restURL, data: {'command':'getUserInfo','username':username}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    var users = info.users;
                    var userInfo = users[0];

                    var firstName = userInfo.firstName;
                    var lastName = userInfo.lastName;
                    var username = userInfo.username;
                    /*if(lastName == '')
                    {
                        lastName = "Anderson";
                    }*/
                    
                    jQuery("#welcome-message").html("welcome <strong>AGENT "+lastName.toUpperCase()+"</strong> <strong>[</strong> this feature is coming soon <strong>]</strong>");
                    jQuery("#back-button").html("<a class=\"orange-btn btn\" onclick=\"javascript:history.back();\">BACK TO THE PREVIOUS PAGE</a>");
                }
            }
        });
    }
    else
    {
        window.location = "../index.html";
    }
}

function getAllUsers()
{
    var username = getCookie("username");
    if(username != '')
    {
        if(username == 'admin@fairmarketing.com')
        {
            $.ajax({url: restURL, data: {'command':'getAllUsers'}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        var usersInfo = info.users;
                        var rowData = "";
                        for(var i=0; i<usersInfo.length; i++)
                        {
                            var thisEntry = usersInfo[i];
                            var firstName = thisEntry.firstName;
                            var lastName = thisEntry.lastName;
                            var email = thisEntry.email;
                            var isActive = thisEntry.isActive;
                            var verified = thisEntry.verified;
                            var isBetaUser = thisEntry.isBetaUser;
                            
                            var activeHTML = "Yes";
                            if(isActive == false)
                            {
                                activeHTML = "No";
                            }
                            
                            var verifiedHTML = "Yes";
                            if(verified == false)
                            {
                                verifiedHTML = "No";
                            }
                            
                            var betaUserHTML = "Yes";
                            if(isBetaUser == false)
                            {
                                betaUserHTML = "No";
                            }

                            rowData += "<tr>" +
                                    "<td style=\"text-align:left\">"+firstName+"</td>" +
                                    "<td style=\"text-align:left\">"+lastName+"</td>" +
                                    "<td style=\"text-align:left\">"+email+"</td>" +
                                    "<td style=\"text-align:center\">"+activeHTML+"</td>" +
                                    "<td style=\"text-align:center\">"+verifiedHTML+"</td>" +
                                    "<td style=\"text-align:center\">"+betaUserHTML+"</td>" +
                                    "</tr>";
                        }

                        $("#users-table-body").html(rowData);
                    }
                }
            });
            
            refreshCartDropdown();
        }
        else
        {
            window.location = "../index.html";
        }
    }
    else
    {
        window.location = "../index.html";
    }
}

function saveToExcel(tableID){
       var htmltable = document.getElementById(tableID);
       var html = htmltable.outerHTML;
       window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
}

function refreshCartDropdownForCalculator()
{
    jQuery.noConflict();
    var username = getCookie("username");
    if(username != '')
    {
        jQuery.ajax({url: restURL, data: {'command':'getCartDropdownData','username':username}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        var totalContent = info.total_content;
                        var totalCost = numberWithCommas(parseFloat(info.total_cost).toFixed(0));
                        
                        var missionCount = 0;
                        var keywordCount = 0;
                        var projectManagementCount = 0;
                        
                        var iconSrc = "../keywordhacker/images/cart_empty.png";
                        
                        if(totalContent > 0)
                        {
                            iconSrc = "../keywordhacker/images/cart_full.png";
                            missionCount = info.missions;
                            keywordCount = info.keywords;
                            projectManagementCount = info.project_management;
                        }
                        
                        jQuery("#cart-image").attr('src',iconSrc);
                        jQuery("#cart-total-pieces").html(totalContent);
                        jQuery("#cart-total-missions").html(missionCount);
                        jQuery("#cart-total-keywords").html(keywordCount);
                        jQuery("#cart-total-project-mgmt").html(projectManagementCount);
                        jQuery("#cart-total-cost").html("$"+totalCost);
                    }
                }
            });
    }
}

function refreshCartDetails()
{
    var username = getCookie("username");
    if(username != '')
    {
        $.ajax({url: restURL, data: {'command':'getCartDropdownData','username':username}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        var totalContent = info.total_content;
                        var totalCost = numberWithCommas(parseFloat(info.total_cost).toFixed(0));
                        
                        var missionCount = 0;
                        var keywordCount = 0;
                        var projectManagementCount = 0;
                        
                        var iconSrc = "../keywordhacker/images/cart_empty.png";
                        
                        if(totalContent > 0)
                        {
                            iconSrc = "../keywordhacker/images/cart_full.png";
                            missionCount = info.missions;
                            keywordCount = info.keywords;
                            projectManagementCount = info.project_management;
                        }
                        
                        $("#cart-image").attr('src',iconSrc);
                        $("#cart-total-pieces").html(totalContent);
                        $("#cart-total-missions").html(missionCount);
                        $("#cart-total-keywords").html(keywordCount);
                        $("#cart-total-project-mgmt").html(projectManagementCount);
                        $("#cart-total-cost").html("$"+totalCost);
                        
                        //Let's also update the header info since we have all of the data that we need
                        $("#content-count").html(totalContent);
                        $("#mission-count").html(missionCount);
                        $("#keyword-count").html(keywordCount);
                        $("#management-count").html(projectManagementCount);
                        $("#total-cost").html("<sup>$</sup>"+totalCost);
                    }
                }
            });

        $.ajax({url: restURL, data: {'command':'getCartDetailData','username':username}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    var cartHTML = "";
                    var cart = info.cartDetails;
                    for(var p=0; p<cart.length; p++)
                    {
                        var projectInfo = cart[p];
                        var missionSubtotal = 0;
                        
                        //Output the mission-level elements
                        cartHTML += "<div class=\"mission-heading\">"+
                                            "<label>"+projectInfo.project+"</label> <a href=\"keywordhacker.html?pid="+projectInfo.projectID+"\" class=\"view-mission-link\">VIEW MISSION </a> </div>"+
                                    "<div class=\"table-spacing\">";
                            
                        var keywords = projectInfo.keywords;
                        for(var k=0;k<keywords.length; k++)
                        {
                            var keywordInfo = keywords[k];
                            //Output the keyword-level elements
                            cartHTML += "<h3 class=\"keyword-phrase-number\">"+keywordInfo.keyword+"</h3>"+
                                            "<table class=\"mission-info-table\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">"+
                                                    "<tbody>"+
                                                            "<tr class=\"table-heading\">"+
                                                                    "<th colspan=\"2\">ASSIGN MONTHLY CONTENT TYPE</th>"+
                                                                    "<th>WRITING DIRECTION/INSTRUCTION</th>"+
                                                                    "<th>COST</th>"+
                                                            "</tr>";

                            //Output the addon-level elements
                            var addons = keywordInfo.addons;
                            for(var a=0; a<addons.length; a++)
                            {
                                var addonInfo = addons[a];
                                
                                var selectHTML = buildAddonDropdown(projectInfo.projectID,keywordInfo.keywordID,addonInfo.itemID,addonInfo.addonID);

                                var addonPrice = parseFloat(addonInfo.price);
                                var addonQuantity = parseInt(addonInfo.quantity);
                                missionSubtotal += (addonPrice*addonQuantity);

                                cartHTML += "<tr>"+
                                                    "<td class=\"number text-center\"><input type=\"text\" onchange=\"updateCartItem('"+addonInfo.itemID+"')\" id=\"addon-quantity-"+addonInfo.itemID+"\" class=\"cart-text-input text-center\" value=\""+addonInfo.quantity+"\"/></td>"+
                                                    "<td>"+selectHTML+"</td>"+
                                                    "<td class=\"instruction_data\"><input type=\"text\" class=\"cart-text-input text-left\" id=\"addon-instructions-"+addonInfo.itemID+"\" onchange=\"updateCartItem('"+addonInfo.itemID+"')\" value=\""+addonInfo.contentInstructions+"\"/></td>"+
                                                    "<td class=\"cost-ot\">@ $"+addonInfo.price+"</td>"+
                                                    "<td class=\"delect-row\"><a style=\"cursor:pointer;\" onclick=\"deleteCartItem('"+addonInfo.itemID+"');\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>"+
                                                    "</td>"+
                                            "</tr>";
                            }
                            
                            //Add a row for the add new button
                            cartHTML += "<tr class=\"add-new\">"+
                                                "<td colspan=\"5\" class=\"text-center\"><a style=\"cursor:pointer;\" onclick=\"addNewCartItem('"+projectInfo.projectID+"','"+addonInfo.keywordID+"');\" class=\"add-new-selection\"><i class=\"fa fa-plus\" aria-hidden=\"true\"></i></a></td>"+
                                        "</tr>";
                            
                            //Close the keyword-level elements
                            cartHTML += "</tbody>"+
                                    "</table>";
                        }
                        
                        //Add a div for the project management
                        cartHTML += "<div class=\"project-management-checkbox\">"+
                                        "<input type=\"checkbox\"/>ADD <strong>[<span> 16 HOURS </span>]</strong> PROJECT MANAGEMENT <strong>[<span> @ $96.25/HOUR </span>]</strong><span class=\"position-relative\"><i class=\"info-icon\"> </i>"+
                                            "<div class=\"custom_tooltip\">"+
                                                "<h2>PROJECT MANAGEMENT</h2>"+
                                                "<p>Based on your content selections for this keyword Rank Hacker recommends a minimum of 8 hours of project management to keep your marketing hands-free.</p>"+
                                                "<!--<div style=\"float: left;width: 100%;margin: 0;padding: 0;\"><input type=\"checkbox\" />ADD PROJECT MANAGEMENT<a href=\"javascript:void(0);\" class=\"no-thanks\">NO THANKS</a></div>-->"+
                                            "</div>"+
                                        "</span>"+
                                    "</div>";
                        
                        //Close the mission-level elements
                        cartHTML += "</div>"+
                                "<div class=\"cart-subtotal-section\"><label>SUBTOTAL</label> <span class=\"price\"><small>$</small>"+numberWithCommas(missionSubtotal.toFixed(0))+"</span> </div>";
                    }
                    
                    $("#cart-details").html(cartHTML);
                    
                    
                    //Also grab the ChargeBee info and update the pay now button target
                    var planURL = info.chargeBeePage;
                    var chargeBeeAddons = info.chargeBeeAddons;
                    for(var c=0; c<chargeBeeAddons.length; c++)
                    {
                        var thisAddon = chargeBeeAddons[c];
                        var thisID = thisAddon.chargeBeeID;
                        var thisQty = thisAddon.quantity;
                        
                        if(c==0)
                        {
                            planURL += "?addons[id]["+c+"]="+thisID+"&addons[quantity]["+c+"]="+thisQty;
                        }
                        else
                        {
                            planURL += "&addons[id]["+c+"]="+thisID+"&addons[quantity]["+c+"]="+thisQty;
                        }
                    }
                    
                    $("#pay-now-button").prop("href",planURL);
                    
                }
            }
        });
    }
}

function gotoCartDetail(e)
{
    var e = e || window.event;
    e.preventDefault();
    
    window.location = '../keywordhacker/cartdetail.html';
}

function getAddonItems(callbackData)
{
    $.ajax({url: restURL, data: {'command':'getAddonItems'}, type: 'post', async: true, success: function postResponse(returnData){
            callbackData(returnData);
        }
    });
}

function buildAddonDropdown(projectID,keywordID,itemID,addonID)
{
    var addonOptions = $("#addons").val();

    var selectHTML = "<select class=\"cart-item-select\" onchange=\"updateCartItem('"+itemID+"')\" id=\"addon-type-"+itemID+"\">";
    
    var info = JSON.parse(addonOptions);
    if(info.status == "success")
    {
        var addons = info.addons;
        for(var i=0; i<addons.length; i++)
        {
            var addonInfo = addons[i];
            
            var id = addonInfo.id;
            var desc = addonInfo.name;
            //var price = addonInfo.price;
            
            selectHTML += "<option class=\"cart-item-select-option\" value=\""+id+"\"";
            if(id == addonID)
            {
                selectHTML += " selected";
            }
            selectHTML += ">"+desc+"</option>";
        }
    }
    selectHTML += "</select>";
    return selectHTML;
}

function addNewCartItem(projectID,keywordID)
{
    var username = getCookie("username");
    if(username != "" && projectID != "")
    {
        //addToCart(keywordID);
        $.ajax({url: restURL, data: {'command':'addNewCartItem','username':username,'projectid':projectID,'keywordid':keywordID}, type: 'post', async: true, success: function postResponse(returnData){
                //var info = JSON.parse(returnData);
                refreshCartDetails();
            }
        });
    }
}

function deleteCartItem(itemID)
{
    $.ajax({url: restURL, data: {'command':'deleteCartItem','addonid':itemID}, type: 'post', async: true, success: function postResponse(returnData){
            //var info = JSON.parse(returnData);
            refreshCartDetails();
        }
    });
}

function updateCartItem(itemID)
{
    var addonType = $("#addon-type-"+itemID).val();
    var contentInstructions = $("#addon-instructions-"+itemID).val();
    var quantity = $("#addon-quantity-"+itemID).val();
    
    $.ajax({url: restURL, data: {'command':'updateCartItem','addonid':itemID,'addontype':addonType,'instructions':contentInstructions,'quantity':quantity}, type: 'post', async: true, success: function postResponse(returnData){
            //var info = JSON.parse(returnData);
            refreshCartDetails();
        }
    });
}

function processThankYou()
{
    //Grab the subscription ID from the ChargeBee response and update the database with the appropriate info
    var username = getURLParameter("cust_email");
    var customerID = getURLParameter("cust_id");
    var subscriptionID = getURLParameter("sub_id");
    if(username != "" && subscriptionID != "" && customerID != "")
    {
        //addToCart(keywordID);
        $.ajax({url: restURL, data: {'command':'saveCustomerSubscriptionID','username':username,'subscriptionid':subscriptionID,'customerid':customerID}, type: 'post', async: true, success: function postResponse(returnData){
                //var info = JSON.parse(returnData);
                prepareCart();
                sendNewContentOrder(subscriptionID);
            }
        });
    }
}

function sendNewContentOrder(subscriptionID)
{
    //Grab the subscription ID from the ChargeBee response and update the database with the appropriate info
    if(subscriptionID != "")
    {
        //addToCart(keywordID);
        $.ajax({url: restURL, data: {'command':'sendNewContentOrder','subscriptionid':subscriptionID}, type: 'post', async: true, success: function postResponse(returnData){
                //var info = JSON.parse(returnData);
                
            }
        });
    }
}