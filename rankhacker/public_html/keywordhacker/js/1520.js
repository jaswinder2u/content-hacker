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

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function registerMissionReportListeners()
{
    $(".suggest-keywords-list-1 ul ").on("click", "li", function () {
            var returnData = $('#json').val();
            var info = JSON.parse(returnData);

            var deletedKeywords = info.deletedKeywords;
            var projectInfo = info.projectSummary;
                var activeKeywords = projectInfo.activeKeywords;
            
            var currentCount = parseInt($('#keyword-count').val());
    
            if((activeKeywords+currentCount+1) > maxKeywordsPerProject)
            {
                $("#alert-window").removeClass("alert-window");
                $("#alert-window").addClass("alert-window-large");
                showAlert("The number of keywords allowed is currently limited. Only 25 active phrases per mission are allowed.");
            }
            else
            {
                var parent_get = $(this).parents().find(".keyword-phraser-section.collapse.in").attr('id');

                //console.log(parent_get);
                var parent_id = "#" + parent_get;

                $(this).hide(400);
                var text_of_li = $(this).html();
                //alert(text_of_li);

                var text_of_li_new_old = text_of_li.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '');
                var text_of_li_new = text_of_li_new_old.substring(0, 5);

                //alert(text_of_li_new);

                var id_of_ul = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul").attr('id');
                var id_of_ul_div = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul").next('div').attr('id');
                var id_of_ul_div_attr = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul").next('div').attr('aria-labelledby');
                var id_of_ul_aria_controls = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.power-goal-info h2 a").attr('aria-controls');
                var id_of_ul_aria_labelledby = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.power-goal-info h2 a").attr('href');
                var id_of_ul_aria_controls = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.keyword-phraser-tittle h2 a").attr('href');
                var id_of_ul_aria_controls = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.keyword-phraser-tittle h2 a").attr('aria-controls');
                var id_phraser_accordion = $(parent_id + " .phraser-accordion-outer").attr('id');

                //alert(id_of_ul);


                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul").attr('id', id_of_ul + text_of_li_new + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul").next('div').attr('id', id_of_ul_div + text_of_li_new + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul").next('div').attr('aria-labelledby', id_of_ul_div_attr + text_of_li_new + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.power-goal-info h2 a").attr('aria-controls', id_of_ul_aria_controls + text_of_li_new + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.power-goal-info h2 a").attr('href', id_of_ul_aria_labelledby + text_of_li_new + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.keyword-phraser-tittle h2 a").attr('aria-controls', id_of_ul_aria_controls + text_of_li_new + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.keyword-phraser-tittle h2 a").attr('href', id_of_ul_aria_labelledby + text_of_li_new + parent_get);

                $(parent_id + " .phraser-accordion-outer").attr('id', id_phraser_accordion + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.power-goal-info h2 a").attr('data-parent', '#' + id_phraser_accordion + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.keyword-phraser-tittle h2 a").attr('data-parent', '#' + id_phraser_accordion + parent_get);

                var chkflag = 1;
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.checkbox-outer").each(function () {
                    chkflag++;
                    $(this).find('input').attr('id', 'chk-content-' + text_of_li_new + parent_get + chkflag);
                    $(this).find('label').attr('for', 'chk-content-' + text_of_li_new + parent_get + chkflag);
                });

                addKeywordInReport(text_of_li,'1');
            }
            
        });



$(".suggest-keywords-list-2 ul ").on("click", "li", function () {
            var returnData = $('#json').val();
            var info = JSON.parse(returnData);

            var deletedKeywords = info.deletedKeywords;
            var projectInfo = info.projectSummary;
                var activeKeywords = projectInfo.activeKeywords;
            
            var currentCount = parseInt($('#keyword-count').val());
    
            if((activeKeywords+currentCount+1) > maxKeywordsPerProject)
            {
                $("#alert-window").removeClass("alert-window");
                $("#alert-window").addClass("alert-window-large");
                showAlert("The number of keywords allowed is currently limited. Only 25 active phrases per mission are allowed.");
            }
            else
            {
                var parent_get = $(this).parents().find(".keyword-phraser-section.collapse.in").attr('id');

                //console.log(parent_get);
                var parent_id = "#" + parent_get;

                $(this).hide(400);
                var text_of_li = $(this).html();
                //alert(text_of_li);

                var text_of_li_new_old = text_of_li.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '');
                var text_of_li_new = text_of_li_new_old.substring(0, 5);

                //alert(text_of_li_new);

                var id_of_ul = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul").attr('id');
                var id_of_ul_div = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul").next('div').attr('id');
                var id_of_ul_div_attr = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul").next('div').attr('aria-labelledby');
                var id_of_ul_aria_controls = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.power-goal-info h2 a").attr('aria-controls');
                var id_of_ul_aria_labelledby = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.power-goal-info h2 a").attr('href');
                var id_of_ul_aria_controls = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.keyword-phraser-tittle h2 a").attr('href');
                var id_of_ul_aria_controls = $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.keyword-phraser-tittle h2 a").attr('aria-controls');
                var id_phraser_accordion = $(parent_id + " .phraser-accordion-outer").attr('id');

                //alert(id_of_ul);


                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul").attr('id', id_of_ul + text_of_li_new + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul").next('div').attr('id', id_of_ul_div + text_of_li_new + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul").next('div').attr('aria-labelledby', id_of_ul_div_attr + text_of_li_new + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.power-goal-info h2 a").attr('aria-controls', id_of_ul_aria_controls + text_of_li_new + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.power-goal-info h2 a").attr('href', id_of_ul_aria_labelledby + text_of_li_new + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.keyword-phraser-tittle h2 a").attr('aria-controls', id_of_ul_aria_controls + text_of_li_new + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.keyword-phraser-tittle h2 a").attr('href', id_of_ul_aria_labelledby + text_of_li_new + parent_get);

                $(parent_id + " .phraser-accordion-outer").attr('id', id_phraser_accordion + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.power-goal-info h2 a").attr('data-parent', '#' + id_phraser_accordion + parent_get);
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.keyword-phraser-tittle h2 a").attr('data-parent', '#' + id_phraser_accordion + parent_get);

                var chkflag = 1;
                $(parent_id + " .phraser-accordion-outer .keyword-phraser-row:last-child ul li.checkbox-outer").each(function () {
                    chkflag++;
                    $(this).find('input').attr('id', 'chk-content-' + text_of_li_new + parent_get + chkflag);
                    $(this).find('label').attr('for', 'chk-content-' + text_of_li_new + parent_get + chkflag);
                });

                addKeywordInReport(text_of_li,'2');
            }
            
        });




$("a#button-add-url").on("click", function (event) {
            event.preventDefault();

            $(this).hide();
            var url_box = $("#url-box-template").html();
            $(this).parent().before(url_box);
            //toggle_add_more();
            $('#custom-url').focus();
        });

        $('.add-custom-keyword-outer').on('keypress', '.url-input', function (e) {
            if (e.which == 13) {
                $(this).blur();
            }
        });

        $('.add-custom-keyword-outer').on('blur', '.url-input', function () {
            var parent_get = $(this).parents().find(".keyword-phraser-section.collapse.in").attr('id');
            //console.log(parent_get);
            var parent_id = "#" + parent_get;
            var url_val = $(this).val();
            if (url_val == "") {

            } else {
                
            }
            $(this).remove();
            $("a#button-add-url").show();
            
            var returnData = $('#json').val();
            var info = JSON.parse(returnData);

            var deletedKeywords = info.deletedKeywords;
            var projectInfo = info.projectSummary;
                var activeKeywords = projectInfo.activeKeywords;
            
            var currentCount = parseInt($('#keyword-count').val());
    
            if((activeKeywords+currentCount+1) > maxKeywordsPerProject)
            {
                $("#alert-window").removeClass("alert-window");
                $("#alert-window").addClass("alert-window-large");
                showAlert("The number of keywords allowed is currently limited. Only 25 active phrases per mission are allowed.");
            }
            else
            {
                //Here's where we add the keyword to the list
                addKeywordInReport(url_val,'0');
            }
                
        });
}

/*var sortableHelper = function (e, ui) {
    ui.children().each(function () {
        $(this).width($(this).width());
    });
    return ui;
};

function enableSort() {
    $('#keyword-summary-table').sortable({
        items: 'tr.sortable-row',
        helper: sortableHelper,
        start: function (e, ui) {
            ui.placeholder.height(ui.helper.outerHeight());
        },
        update: function (e, ui) {
            var tableHasUnsortableRows = $(this).find('> tbody > tr:not(.sortable-row)').length;
            $(this).find('> tbody > tr.sortable-row').each(function (idx, row) {

                /* If we are reordering a table with some fixed rows, make sure the fixed rows
                 * always follow their corresponding sortable row so they always appear together. *
                if (tableHasUnsortableRows) {
                    var uniqID = $(this).attr('data-question-id'),
                        correspondingFixedRow = $('tr:not(.sortable-row)[data-answer-id=' + uniqID + ']');
                    correspondingFixedRow.detach().insertAfter($(this));
                }
            });
        }
    }).disableSelection();
}*/

var desc = false;

var sort_by = function(field, reverse, primer){
   var key = function (x) {return primer ? primer(x[field]) : x[field]};
   var key2 = function(x2) {return x2["deleted"];}
   
   return function (a,b) {
	  /*var A = key(a), B = key(b);
	  return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];*/
        var A = key(a), B = key(b);
          var A2 = key2(a), B2 = key2(b);
	  //return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];
          if(A2 < B2) return 1 * [-1,1][+!!false];
          if(A2 > B2) return -1 * [-1,1][+!!false];
          if(A < B) return -1 * [-1,1][+!!reverse];
          if(A > B) return 1 * [-1,1][+!!reverse];
          return 0 * [-1,1][+!!reverse];
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

function setCookie(param,value,days){
    var expires = "";
    if(days)
    {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = param + "=" + value + expires + "; path=/";
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

function createKeywordHackerProject(e)
{
    var e = e || window.event;
    //this.event.preventDefault();
    e.preventDefault();
    
    var projectID = $("#editing-project-id").val();
    if(projectID == "" || projectID == null || projectID == "null" || typeof projectID === "undefined")
    {
        projectID = "0";
    }
    
    /*var projectID = getURLParameter("pid");
        if(projectID == "" || projectID == null || projectID == "null" || typeof projectID === "undefined")
        {
            projectID = "0";
        }*/
    
    var projectURL = $('#project-url').val();
    var projectLocation = $('#project-location').val();
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
    
    var username = getCookie("username");

    var id = "1";
    if($("#monthly-visitors").val().trim() !== "" || $("#monthly-customers").val().trim() !== "")
    {
        id = "2";
    }
    
    var keywordsList = "";
    if(projectID == "0")
    {
        keywordsList = $("#new-keyword").val();
            keywordsList = keywordsList.replace(new RegExp(',', 'g'), ';');
    }
    
    if(username == "")
    {
        window.location = 'index.html';
    }
    else if(projectID == "0" && projectURL.trim() == '')
    {
        showAlert("Please enter your site's URL.");
    }
    else if(projectID == "0" && projectLocation.trim() == '')
    {
        showAlert("Please enter your business location.");
    }
    else if(projectID == "0" && keywordsList.trim() == '')
    {
        showAlert("Please enter at least one keyword phrase.");
    }
    else if(projectID == "0" && $('#customer-value').val().trim() == "")
    {
        showAlert("Please enter a value for your product/service price.");
    }
    else if((id == "2") && ($('#monthly-visitors').val().trim() == "" || $('#monthly-customers').val().trim() == ""))
    {
        showAlert("Please enter a value for both monthly visitors and paying customers in order to reveal using advanced options.");
    }
    else
    {
        //Show the spinner
        $("#reveal-button").html("<div><img src='images/apple_spinner.gif' class='apple-spinner-small'/></div>");
        
        var monthlyVisitors = $('#monthly-visitors').val();
        var payingCustomers = $('#monthly-customers').val();
        var customerValue = $('#customer-value').val();
        var costPerLevel = $('#content-cost').val();
        
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
                        window.location = "missionreport.html?pid="+projectID;
                    }
                    else
                    {
                        $("#reveal-button").html("Reveal <i class=\"fa fa-angle-right\" aria-hidden=\"true\"></i>");
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
                        window.location = "missionreport.html?pid="+projectID;
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
        /*if(username == "hari.patel@1520holdings.com")
        {
            username = "admin@fairmarketing.com";
        }*/
        
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
        if(username != 'admin@fairmarketing.com' && username != 'hari.patel@1520holdings.com' && $('#industry-link').length)
        {
            $('#industry-link').remove();
            $('#users-link').remove();
        }
        
        refreshCartDropdown();
    }
    else
    {
        window.location = "../login.html";
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

    if(sortMethod == 'runDate' || sortMethod == 'projectID')
    {
        if(sortMethod == currSortMethod)
        {
            if(sortMethodReversed == "true" && flip)
            {
                reversed = true;
                //data.sort(date_sort_asc);
            }
            else
            {
                reversed = false;
                //data.sort(date_sort_desc);
            }
        }
        data.sort(sort_by('projectID', reversed, parseInt));
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
    if(typeof filterString !== 'undefined' && filterString != '')
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
        var deleted = entry.deleted;
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
        var projectTitle = entry.projectTitle;
        var geoLocation = entry.geoLocation;
        var useGoogle = entry.useGoogle;
        var useBing = entry.useBing;
        var useYouTube = entry.useYouTube;
        var useAppStore = entry.useAppStore;
        var useLocal = entry.useLocal;
        var useRegional = entry.useRegional;
        var useNational = entry.useNational;
        var industryID = entry.industryID;
        var eCommerce = entry.eCommerce;

        var canShow = true;
        if(useFilter && projectTitle.indexOf(filterString) === -1)
        {
            canShow = false;
        }
        
        var customerConversionRate = entry.defaultConversionRate;
        if(monthlyVisitors != 0 && payingCustomers != 0 && useDefaultConversionRate != 1)
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
            anchorAhref = "style=\"cursor:pointer;\" onclick=\"window.location='missionreport.html?pid="+projectID+"';\" onmouseover=\"highlightKWHCard('"+projectID+"');\" onmouseout=\"restoreKWHCard('"+projectID+"');\"";
            plSum = "--";
        }
        else
        {
            keywordNetWorthString = currencyHexCode+keywordNetWorth;
            anchorAhref = "onclick=\"window.location='missionreport.html?pid="+projectID+"';\" onmouseover=\"highlightKWHCard('"+projectID+"');\" onmouseout=\"restoreKWHCard('"+projectID+"');\"";
            //plSum = totalPowerLevel;
            plSum = totalContentDiff;
        }
        
        if(deleted != "")
        {
            anchorAhref = "style=\"cursor:default;\" onclick=\"javascript:void(0);\" ";
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
            rhHTML += "<a "+anchorAhref+" id=\"rh-module-"+projectID+"\" class=\"module-link keyword-hacker-module\">";
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
            if(deleted != "1")
            {
                rhHTML += "<img class=\"launch-icon\" src=\"images/launch-icon.png\">";
            }
            else
            {
                rhHTML += "<img style=\"cursor:default;\" onclick=\"javascript:void(0);\" class=\"launch-icon\" src=\"images/blank.png\">";
            }
            rhHTML += "</div>";
            rhHTML += "</div>";
            rhHTML += "</div>";
            rhHTML += "</div>";
            rhHTML += "</a>";
            
            //Hidden inputs for wizard
            rhHTML += "<input type=\"hidden\" id=\"wizard-url-"+projectID+"\" value=\""+projectTitle+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-geolocation-"+projectID+"\" value=\""+geoLocation+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-usegoogle-"+projectID+"\" value=\""+useGoogle+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-usebing-"+projectID+"\" value=\""+useBing+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-useyoutube-"+projectID+"\" value=\""+useYouTube+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-useappstore-"+projectID+"\" value=\""+useAppStore+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-uselocal-"+projectID+"\" value=\""+useLocal+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-useregional-"+projectID+"\" value=\""+useRegional+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-usenational-"+projectID+"\" value=\""+useNational+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-industryid-"+projectID+"\" value=\""+industryID+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-ecommerce-"+projectID+"\" value=\""+eCommerce+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-customervalue-"+projectID+"\" value=\""+valuePerCustomer+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-monthlyvisitors-"+projectID+"\" value=\""+monthlyVisitors+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-monthlycustomers-"+projectID+"\" value=\""+payingCustomers+"\">";
            rhHTML += "<input type=\"hidden\" id=\"wizard-contentcost-"+projectID+"\" value=\""+costPerLevel+"\">";
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
            if(deleted != "1")
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
            else
            {
                //Add a gray overlay to it
                cardHTML += "<li class=\"col-lg-4 matchheight element-item\" id=\"project-card-"+projectID+"\">";
                    cardHTML += "<div class=\"gray-card-overlay\">";
                cardHTML += "<div class=\"project-cart-box box-shadow-ot\" style=\"opacity:1.0;\">";
                cardHTML += "<div class=\"card-header\">";
                cardHTML += "<span class=\"card-header-mission-text\">The Mission</span>";
                //cardHTML += "<h1 class=\"project_name_sort\"><label for=\"chk-content-all1\"></label><a style=\"cursor:pointer;\" "+anchorAhref+">"+projectTitle+"</a></h1>";
                cardHTML += "<h1 class=\"project_name_sort\"><label for=\"chk-content-all1\"></label><span style=\"cursor:default;color:#404040;\">"+projectTitle+"</span></h1>";
                //cardHTML += "<div style=\"clear:both;text-align:right;float:right;margin-top:-20px;\"><a style=\"cursor:pointer;\" class=\"edit-icon\" title=\"Edit Mission\" onclick=\"gotoCreateProject('"+projectID+"');\"></a><!--<a style=\"cursor:pointer;color:rgba(61,61,61,.25);\" title=\"Download\" class=\"download-icon\" onclick=\"saveTextAsFileFromDashboard('"+projectID+"');\"></a><a class=\"delete-icon\" title=\"Delete Mission\" onclick=\"displayProjectDeleteWindow('"+projectID+"');\"></a>--></div>";
                cardHTML += "</div>";

                cardHTML += rhHTML;
                cardHTML += chHTML;

                cardHTML += "<div class=\"card-box-bottom\">";
                cardHTML += "<div class=\"project-date-card date_sort\"><i class=\"eagle-icon\"></i>Initiated "+runDate+"</div>";
                //cardHTML += "<a style=\"cursor:pointer;\" "+anchorAhref+" class=\"project-status-card  project_status_sort \" href=\"javascript:void(0);\"> "+activeString+" </a>";
                //cardHTML += "<div style=\"clear:both;text-align:right;float:right;margin-top:-20px;\"><!--<a style=\"cursor:pointer;\" class=\"edit-icon\" title=\"Edit Mission\" onclick=\"gotoCreateProject('"+projectID+"');\"></a><a style=\"cursor:pointer;color:rgba(61,61,61,.25);\" title=\"Download\" class=\"download-icon\" onclick=\"saveTextAsFileFromDashboard('"+projectID+"');\"></a>--><a class=\"delete-icon-orig\" title=\"Delete Mission\" onclick=\"displayProjectDeleteWindow('"+projectID+"');\"></a></div>";
                //cardHTML += "<div style=\"clear:both;text-align:right;float:right;\"><span class=\"delete-icon-small\" style=\"float:right;text-align:right;padding-right:5px;\" title=\"Delete Mission\" onclick=\"displayProjectDeleteWindow('"+projectID+"');\"><img src=\"images/ic_delete_forever_gray.png\" class=\"delete-icon-small\"></span></div>";
                cardHTML += "</div>";
                cardHTML += "</div>";
                    cardHTML += "</div>";
                cardHTML += "</li>";
            }
        }
    }

    var addMoreHTML = "<li class=\"col-lg-4 matchheight element-item\" id=\"project-card-0\">" +
                      "<div class=\"project-cart-box box-shadow-ot\">"+
                      "<div class=\"card-header\"><!--<span style=\"float:right;padding:5px;margin-top:-70px;\"><img src=\"images/start-icon.png\" style=\"margin-bottom:5px;\"><br><img src=\"images/create-new-icon.png\" style=\"cursor:pointer;width:35px;height:auto;margin-left:120px;\" onclick=\"showActivate();\"></span>--></div>"+
                        "<div class=\"active-link-outer\"><span class=\"active-new-project-link\" style=\"cursor:pointer;\" onclick=\"showActivate();\"> <a style=\"cursor:pointer;\"><img src=\"images/rh-plus-logo.png\"><br/><br/>[ Activate New Mission ]</a> </span></div>" +
                      "<div class=\"card-box-bottom\">&nbsp;</div>"+
                      "</div>"+

                        "</li>";

    finalOutput = "<ul class=\"row grid\">"+addMoreHTML+cardHTML+"</ul>";

    $('#card-container').html(finalOutput);
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
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
    //window.location = "projectwizard.html?pid="+projectID;
    
    var wizardURL = $("#wizard-url-"+projectID).val();
    var wizardGeolocation = $("#wizard-geolocation-"+projectID).val();
    var wizardUseGoogle = $("#wizard-usegoogle-"+projectID).val();
    var wizardUseBing = $("#wizard-usebing-"+projectID).val();
    var wizardUseYouTube = $("#wizard-useyoutube-"+projectID).val();
    var wizardUseAppStore = $("#wizard-useappstore-"+projectID).val();
    var wizardUseLocal = $("#wizard-uselocal-"+projectID).val();
    var wizardUseRegional = $("#wizard-useregional-"+projectID).val();
    var wizardUseNational = $("#wizard-usenational-"+projectID).val();
    var wizardIndustryID = $("#wizard-industryid-"+projectID).val();
    var wizardECommerce = $("#wizard-ecommerce-"+projectID).val();
    var wizardCustomerValue = $("#wizard-customervalue-"+projectID).val();
    var wizardMonthlyVisitors = $("#wizard-monthlyvisitors-"+projectID).val();
    var wizardMonthlyCustomers = $("#wizard-monthlycustomers-"+projectID).val();
    var wizardContentCost = $("#wizard-contentcost-"+projectID).val();
    
    var projectIDValue = parseInt(projectID);
    if(projectIDValue < 260)
    {
        $("#metro-option").hide();
    }
    
    //Fill in the form data
    $("#website-url-input").html("website, <label style=\"color:#005cb8;font-weight:300 !important;font-size:14px;\">"+wizardURL+"</label>,");
    $("#scrollable-dropdown-menu").html("<label style=\"color:#005cb8;font-weight:300 !important;font-size:14px;\">"+wizardGeolocation+"</label>");
    $("#phrase-input").hide();
    $("#line-spacer").hide();
    $("#editing-project-id").val(projectID);
    
    if(typeof wizardECommerce !== "undefined")
    {
        if(wizardECommerce == 1)
        {
            $('#e-commerce-selection option')[1].selected = true;
        }
        else
        {
            $('#e-commerce-selection option')[0].selected = true;
        }
    }
    refreshIndustries();

    if(typeof wizardIndustryID !== "undefined")
    {
        $('#industry-selection').val(parseInt(wizardIndustryID));
    }

    if(wizardUseGoogle == 1)
    {
        $('#use-google').prop('checked',true);
    }
    else
    {
       $('#use-google').prop('checked',false); 
    }

    if(wizardUseBing == 1)
    {
        $('#use-bing').prop('checked',true);
    }
    else
    {
       $('#use-bing').prop('checked',false); 
    }

    if(wizardUseYouTube == 1)
    {
        $('#use-you-tube').prop('checked',true);
    }
    else
    {
       $('#use-you-tube').prop('checked',false); 
    }

    if(wizardUseAppStore == 1)
    {
        $('#use-app-store').prop('checked',true);
    }
    else
    {
       $('#use-app-store').prop('checked',false); 
    }

    if(wizardUseLocal == 1)
    {
        $('#local-national option')[0].selected = true;
    }
    else if(wizardUseRegional == 1)
    {
        $('#local-national option')[1].selected = true;
    }
    else
    {
       $('#local-national option')[2].selected = true;
    }

    $("#customer-value").val(wizardCustomerValue);
    $("#monthly-visitors").val(wizardMonthlyVisitors);
    $("#monthly-customers").val(wizardMonthlyCustomers);
    $("#content-cost").val(wizardContentCost);
    
    
    //Show the form
    $("#side-wizard-rh-eagle").click();
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
            //var upperLimit = Math.max(0,maxKWLoc);

            for(var j=0; j<maxKWLoc; j++)
            {
                var currentKeywordCount = $('#keyword-count').val();
                var existingKeywords = $('#new-keyword').html();
                var newKeywordCount = parseInt(currentKeywordCount) + 1;
                var newKeywords = existingKeywords + ","+kwArray[j].trim();
                //$('#ctc').html(newKeywords);
                //$('#new-keyword').val('');
                $('#keyword-count').val(newKeywordCount);
            }
            
            if((newKWLength+currentCount) > maxKeywordsPerProject)
            {
                $("#alert-window").removeClass("alert-window");
                $("#alert-window").addClass("alert-window-large");
                showAlert("The number of keywords allowed per mission is currently limited. Only the first "+maxKeywordsPerProject+" phrases have been included.");
            }
            $('#new-keyword').val(newKeywords);
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

function toggleCompetitor(competitorID,checked,keywordCounter,keywordID)
{
    $('body').addClass('wait');
    //Hide the Get the Hack buttons
    //$("#get-the-hack-1-"+keywordCounter).hide(200);
    //$("#get-the-hack-2-"+keywordCounter).hide(200);
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
    /*var selectedCount = $("#kwid-"+keywordID+"-competitorsCount").val();
    
    if(active == "1" && selectedCount >= 5)
    {
        canSelect = false;
    }*/
    
    if(competitorID !== '' && projectID !== '')
    {
        if(canSelect)
        {
            //Overwrite the project-level and keyword-level keyword net worth texts with the progress bar spinner
            /*
            //$("#kwNetWorth").html("<img src=\"images/thin_stripe_progress.gif\" class=\"medium-progress-bar\"/>");
            $("#kwNetWorth").html("<span class=\"loader__dot\" style=\"font-size:15px;color:red;\">calculating...</span>");
            //$("#kwid-"+keywordID+"-kw-net-worth").html("<img src=\"images/thin_stripe_progress.gif\" class=\"intermediate-progress-bar\"/>");
            $("#top-hack-content-"+keywordCounter).html("<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>");
            */
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
                        //refreshKeywordInfo(returnData,field,keywordID);
                        refreshMissionKeyword(returnData,field,keywordID);
                        refreshKeywordSuggestions();
                        $('body').removeClass('wait');
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
        //$("#kwNetWorth").html("<span class=\"loader__dot\" style=\"font-size:15px;color:red;\">calculating...</span>");
        //$("#kwid-"+keywordID+"-kw-net-worth").html("<img src=\"images/thin_stripe_progress.gif\" class=\"intermediate-progress-bar\"/>");
        //$("#top-hack-content-"+keywordID).html("<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>");
        
        //Change the background color if it's inactive
        if(active == "0")
        {
            $("#kw-summary-row-"+keywordID).fadeTo(400,0.33,function(){});
            $("#project-info-"+keywordID).hide();
            
            //First update the keyword count
            keywordCount = parseInt($("#numKeywords").html())-1;
        }
        else
        {
            $("#kw-summary-row-"+keywordID).fadeTo(400,1.0,function(){});
            //First update the keyword count
            keywordCount = parseInt($("#numKeywords").html())+1;
            $("#project-info-"+keywordID).show();
        }
        
        $("#numKeywords").html(keywordCount);
        
        $.ajax({url: restURL, data: {'command':'toggleKeywordActive','projectid':projectID,'keywordid':keywordID,'active':active}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    refreshMissionData(-1,keywordID);
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
                    $("#project-card-"+projectID).hide(400);
                    //loadProjectDashboard(false);
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
                    window.location = "missionreport.html?pid="+projectID;
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
    $("#side-wizard-rh-eagle").click();
    //document.getElementById("activate-new-window").style.display = "block";
    //document.getElementById("dimmer").style.display = "block";
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
                                //Also show the message at the top
                                $("#message-bar").removeClass("warning-mesage").removeClass("progress-message").removeClass("error-message").addClass("success-message");
                                $("#message-header").html("<img src=\"images/green-check.png\" class=\"message-icon\"/>YOUR REPORT IS READY");
                                $("#message-content").html("We're done hacking your competitors' strategies. Refresh your browser to see what they're up to!");
                                $("#check-project-done-flag").val(0);
                                
                                //Update the keyword net-worth text to say "ready" in static green
                                $('#mission-networth').html("<strong class=\"green-bg-total loader__dot\">refresh page<div style=\"text-align:right;float:right;clear:both;display:inline-block;color:#fff;font-size:12px;font-weight:bold;margin-top:3px;\"></div></strong>");
                            }
                        }
                    }
                });
        }
    }
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
        if(username == 'admin@fairmarketing.com' || username == 'hari.patel@1520holdings.com')
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
            window.location = "../login.html";
        }
    }
    else
    {
        window.location = "../login.html";
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
    //$("#kwid-"+keywordID+"-plg-3").html("<img src=\"images/thin_stripe_progress.gif\" class=\"mini-progress-bar\"/>");
    
    if(keywordID != '' && projectID != '')
    {
        $.ajax({url: restURL, data: {'command':'updateUserMonthlyContent','projectid':projectID,'keywordid':keywordID,'newvalue':newValue}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    refreshMissionData(keywordCounter,keywordID);
                    //$("#kwid-"+keywordID+"-user-monthly-content-count").html(newValue);
                    $('body').removeClass('wait');
                }
            }
        });
        $('body').removeClass('wait');
    }
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
        if(username !== 'admin@fairmarketing.com' && username !== 'hari.patel@1520holdings.com' && $('#industry-link').length)
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
        window.location = "../login.html";
    }
}

function updateUserInfo()
{
    var username = getCookie("username");
    
    if(username != '')
    {
        /*if(username !== 'admin@fairmarketing.com' && username !== 'hari.patel@1520holdings.com' && $('#industry-link').length)
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
        window.location = "../login.html";
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
    if(username !== 'admin@fairmarketing.com' && username !== 'hari.patel@1520holdings.com' && $('#industry-link').length)
    {
        $('#industry-link').remove();
        $('#users-link').remove();
    }
    
    refreshCartDropdown();
    
    //Set the welcome message
    $('#welcome-message').html("welcome <strong>AGENT "+userLastName.toUpperCase()+"</strong> <strong>[</strong> activate your mission below <strong>]</strong>");
    
    if(projectID !== "0" && projectID !== "")
    {
        $("#breadcrumbs-li").html("<a href=\"dashboard.html\">Missions</a> &nbsp; <i class=\"fa fa-angle-right\"></i> &nbsp; <a href=\"missionreport.html?pid="+projectID+";\">Mission Report</a> &nbsp; <i class=\"fa fa-angle-right\"></i> &nbsp; <a style=\"cursor:default;\">Project Wizard</a>")
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
              //addKeyword("addme");
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
        window.location = "missionreport.html?pid="+projectID;
    }
    else
    {
        window.location = "dashboard.html";
    }
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

function addToCart(e,keywordID)
{
    var projectID = getURLParameter("pid");
    var username = getCookie("username");
    if(username != '')
    {
        if(keywordID == -1)
        {
            //Show the added! text
            flashCart();
            flashAddedMessage(window.event);

            //Disable the top add to cart icon, and all of the keyword add to cart icons
            setTimeout(function(){
                    var jsonData = $("#json").val();
                    var info = JSON.parse(jsonData);
                    var keywordInfo = info.keywordData;
                    
                    for(var i=0; i<keywordInfo.length; i++)
                    {
                        var thisEntry = keywordInfo[i];
                        var thisKeywordID = thisEntry.keywordID;
                        if($("#cart-icon-"+thisKeywordID).length)
                        {
                            //$("#cart-icon-"+thisKeywordID).css("opacity","0.25");
                            $("#cart-icon-"+thisKeywordID).attr("src","images/cart-inactive.png");
                            $("#cart-icon-"+thisKeywordID).attr("onclick","javascript:void(0);");
                            //$("#cart-icon-"+thisKeywordID).attr("onclick","").click(new Function("javascript:void(0);"));
                        }
                    }
                    
                    //Hide all of the competitor table carts
                    $(".keyword-cart").hide();
                    $("#project-add-to-cart").attr("src","images/cart-inactive.png");
                    $("#project-add-to-cart").attr("onclick","javascript:void(0);");
                    //$("#mission-cart-div").html("<img src=\"images/cart-inactive.png\" id=\"project-add-to-cart\" class=\"mission-cart-icon\">");
                    
                }, 1500);

            $.ajax({url: restURL, data: {'command':'addProjectContentToCart','username':username,'projectid':projectID}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        loadMissionData(false);
                        
                        setTimeout(function(){
                            refreshCartDropdown();
                        }, 1500);
                    }
                }
            });
            
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
        }
        else
        {
            //Show the added! text
            flashCart();
            flashAddedMessage(window.event);

            //Disable this particular add to cart icon
            //$("#cart-icon-"+keywordID).css("opacity","0.25");
            $("#cart-icon-"+keywordID).attr("src","images/cart-inactive.png");
            $("#cart-icon-"+keywordID).attr("onclick","javascript:void(0);");
            //$("#cart-icon-"+keywordID).attr("onclick","").click(new Function("javascript:void(0);"));
            $("#goal-cart-"+keywordID).hide();
            /*$("#goal-cart-"+keywordID).attr("src","images/cart-inactive.png");
            $("#goal-cart-"+keywordID).attr("onclick","").click(new Function("javascript:void(0);"));*/
            
            /*setTimeout(function(){
                $("#cart-icon-"+keywordID).attr("src","images/cart-inactive.png");
                $("#cart-icon-"+keywordID).attr("onclick","").click(new Function("javascript:void(0);"));
            }, 1500);*/
            
            
            //Go through the rest of the mission; if no other keywords are available to add, disable the project-level one too
            var disable = true;
            var jsonData = $("#json").val();
            var info = JSON.parse(jsonData);
            var keywordInfo = info.keywordData;
            for(var i=0; i<keywordInfo.length; i++)
            {
                var thisEntry = keywordInfo[i];
                var thisKeywordID = thisEntry.keywordID;
                if($("#cart-icon-"+thisKeywordID).length)
                {
                    var thisSrc = $("#cart-icon-"+thisKeywordID).attr("src");
                    var loc = thisSrc.indexOf("-static");
                    if(loc > -1)
                    {
                        disable = false;
                    }
                    /*var thisOpacity = $("#cart-icon-"+thisKeywordID).css("opacity");
                    if(thisOpacity == 1)
                    {
                        disable = false;
                    }*/
                }
            }
            if(disable)
            {
                //$("#project-add-to-cart").css("opacity","0.25");
                $("#project-add-to-cart").attr("src","images/cart-inactive.png");
                $("#project-add-to-cart").attr("onclick","javascript:void(0);");
                //$("#project-add-to-cart").attr("onclick","").click(new Function("javascript:void(0);"));
                
            }
            
            $.ajax({url: restURL, data: {'command':'addKeywordContentToCart','username':username,'keywordid':keywordID}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);

                    if(info.status == "success")
                    {
                        setTimeout(function(){
                            refreshCartDropdown();
                        }, 1500);
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
                        
                        var iconSrc = "../keywordhacker/images/header-cart-inactive.png";
                        
                        if(totalContent > 0)
                        {
                            iconSrc = "../keywordhacker/images/header-cart-static.png";
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
    else
    {
        $("#tools-dropdown").hide();
        $("#cart-dropdown").hide();
        $("#gear-dropdown").html("<a style=\"cursor:pointer;\" onclick=\"javascript:window.location='../login.html';\">LOGIN</a>");
    }
}

function prepareCart()
{
    var username = getCookie("username");
    var projectID = getURLParameter("pid");
    if(username != '')
    {
        if(username !== 'admin@fairmarketing.com' && username !== 'hari.patel@1520holdings.com' && $('#industry-link').length)
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
        window.location = "../login.html";
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
        jQuery("#welcome-message").html("welcome <strong>AGENT "+lastName.toUpperCase()+"</strong> <strong>[</strong> this feature is coming soon <strong>]</strong>");
        jQuery("#back-button").html("<a class=\"orange-btn btn\" onclick=\"javascript:history.back();\">BACK TO THE PREVIOUS PAGE</a>");
    }
}

function prepareFAQs()
{
    jQuery.noConflict();
    var username = getCookie("username");
    //var projectID = getURLParameter("pid");
    if(username != '')
    {
        if(username !== 'admin@fairmarketing.com' && username !== 'hari.patel@1520holdings.com' && jQuery('#industry-link').length)
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
        //window.location = "../login.html";
    }
}

function getAllUsers()
{
    var username = getCookie("username");
    if(username != '')
    {
        if(username == 'admin@fairmarketing.com' || username == 'hari.patel@1520holdings.com')
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
                            var activeCustomer = thisEntry.activeCustomer;
                            var createDate = thisEntry.createDate;
                            
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
                            
                            var activeCustomerHTML = "Yes";
                            if(activeCustomer == false)
                            {
                                activeCustomerHTML = "No";
                            }

                            rowData += "<tr>" +
                                    "<td style=\"text-align:left\">"+firstName+"</td>" +
                                    "<td style=\"text-align:left\">"+lastName+"</td>" +
                                    "<td style=\"text-align:left\">"+email+"</td>" +
                                    "<td style=\"text-align:center\">"+activeHTML+"</td>" +
                                    "<td style=\"text-align:center\">"+verifiedHTML+"</td>" +
                                    "<td style=\"text-align:center\">"+betaUserHTML+"</td>" +
                                    "<td style=\"text-align:center\">"+activeCustomerHTML+"</td>" +
                                    "<td style=\"text-align:center\">"+createDate+"</td>" +
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
            window.location = "../login.html";
        }
    }
    else
    {
        window.location = "../login.html";
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
                        
                        var iconSrc = "../keywordhacker/images/header-cart-inactive.png";
                        
                        if(totalContent > 0)
                        {
                            iconSrc = "../keywordhacker/images/header-cart-static.png";
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
                        var totalCost = numberWithCommas(parseFloat(info.total_cost).toFixed(2));
                        
                        var missionCount = 0;
                        var keywordCount = 0;
                        var projectManagementCount = 0;
                        
                        var iconSrc = "../keywordhacker/images/header-cart-inactive.png";
                        
                        if(totalContent > 0)
                        {
                            iconSrc = "../keywordhacker/images/header-cart-static.png";
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
                        
                        //Let's also update the header and footer info since we have all of the data that we need
                        $("#content-count").html(totalContent);
                        $("#mission-count").html(missionCount);
                        $("#keyword-count").html(keywordCount);
                        $("#management-count").html(projectManagementCount);
                        $("#total-cost").html("<span class=\"amount-mn\"><sup>$</sup>"+totalCost+" </span><label style=\"float:right;\">MONTHLY TOTAL CHARGE</label>");
                        
                        $("#content-count-2").html(totalContent);
                        $("#mission-count-2").html(missionCount);
                        $("#keyword-count-2").html(keywordCount);
                        $("#management-count-2").html(projectManagementCount);
                        $("#total-cost-2").html("<span class=\"amount-mn\"><sup>$</sup>"+totalCost+" </span><label style=\"float:right;\">MONTHLY TOTAL CHARGE</label>");
                    }
                }
            });

        $.ajax({url: restURL, data: {'command':'getCartDetailData','username':username}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    var pmBubbleText = "Project Management of the content creation process will include:\n\
                        <ul>\n\
                            <li><strong>Welcome Email:</strong> We'll send you an email to schedule our first call with you</li>\n\
                            <li><strong>Kick-Off Call:</strong> During this call, we'll cover three main points\n\
                                <ul style='list-style-type:square;'>\n\
                                    <li><strong>Listening and Learning</strong> - We want to know about your business, what you do, your target market and what you want to accomplish with your content.</li>\n\
                                    <li><strong>Walk-Through Demo</strong> - We’ll show you how to navigate our simple client portal to approve topics, titles and content.</li>\n\
                                    <li><strong>Setting Expectations </strong> - We’ll describe our process, from start-to-finish. We’re very hands on and our first priority is driving your project.</li>\n\
                                </ul>\n\
                            </li>\n\
                            <li><strong>Questionnaire:</strong> You'll get a questionnaire from us after our first call that will be used to\n\
                                <ul style='list-style-type:square;'>\n\
                                    <li>Help determine what topics to focus on.</li>\n\
                                    <li>Create clear and concise writer instructions.</li>\n\
                                    <li>Ensure that you'll be thrilled with your content.</li>\n\
                                </ul>\n\
                            </li>\n\
                            <li><strong>Topic and Initial Title Creation:</strong> After we get your questionnaire back, we’ll go to work researching your website and developing a list of topics to focus on. We’ll also come up with a few initial titles for your content.</li>\n\
                            <li><strong>Topic and Title Review Call:</strong> We’ll review your topics and titles together to determine the top 3-4 titles you’d like to start with. During this call, we’ll also ask if you want to provide bullet points or talking points for each title, or let the writer work on their own.</li>\n\
                            <li><strong>Writer Sampling:</strong> Once you approve your initial batch of titles, we’ll use our powerful writer crowd-sourcing technology to create a sample pool of likely writer candidates for you to sample.</li>\n\
                            <li><strong>Initial Content Review:</strong> You’ll be able to review the content we send to you and determine if it’s great, needs a few revisions, or isn’t suitable. If you don’t like the writers, no problem! We’ll go back to our pool to find ones you’ll love.</li>\n\
                        </ul>\n\
                        At this point, we will have identified which writers you love and we can get to work completing the rest of your project. Now that the initial foundation has been laid, you won’t need to spend as much hands-on time.";
                    
                    
                    var cartHTML = "";
                    var cart = info.cartDetails;
                    var pmPrice = info.projectManagementPrice;
                    for(var p=0; p<cart.length; p++)
                    {
                        var projectInfo = cart[p];
                        var missionSubtotal = 0;
                        
                        var missionTotalContentCount = 0;
                        var missionPMHours = 0;
                        
                        if(projectInfo.project != "")
                        {
                            //Output the mission-level elements
                            cartHTML += "<div class=\"mission-heading\">"+
                                                "<label>"+projectInfo.project+"</label> <a href=\"missionreport.html?pid="+projectInfo.projectID+"\" class=\"view-mission-link\">VIEW MISSION </a> </div>"+
                                        "<div class=\"table-spacing\">";

                            var keywords = projectInfo.keywords;
                            var addPM = false;

                            for(var k=0;k<keywords.length; k++)
                            {
                                var keywordInfo = keywords[k];

                                if(keywordInfo.keyword != "")
                                {
                                    var firstAddonInfo = keywordInfo.addons[0];
                                    
                                    var keywordContentGoal = parseInt(keywordInfo.contentGoal);
                                    var addMoreClass = "";
                                    
                                    if(firstAddonInfo.keywordID == 0)
                                    {
                                        addPM = true;
                                    }
                                    else
                                    {
                                        //Output the keyword-level elements
                                        cartHTML += "<h3 class=\"keyword-phrase-number\">"+keywordInfo.keyword+"<span style=\"float:right;text-align:right;\">content goal: "+keywordContentGoal+" pcs per month</span></h3>"+
                                                        "<table class=\"mission-info-table\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">"+
                                                                "<tbody>"+
                                                                        "<tr class=\"table-heading\">"+
                                                                                "<th colspan=\"2\">ASSIGN MONTHLY CONTENT TYPE</th>"+
                                                                                "<th>WRITING DIRECTION/INSTRUCTION</th>"+
                                                                                "<th>COST</th>"+
                                                                        "</tr>";

                                        //Output the addon-level elements
                                        var keywordTotalContentCount = 0;
                                        var addons = keywordInfo.addons;
                                        for(var a=0; a<addons.length; a++)
                                        {
                                            var addonInfo = addons[a];
                                            var selectHTML = buildAddonDropdown(projectInfo.projectID,keywordInfo.keywordID,addonInfo.itemID,addonInfo.addonID);

                                            var addonPrice = parseFloat(addonInfo.price);
                                            var addonQuantity = parseInt(addonInfo.quantity);

                                            missionTotalContentCount += addonQuantity;
                                            keywordTotalContentCount += addonQuantity;
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
                                        if(keywordTotalContentCount<keywordContentGoal)
                                        {
                                            addMoreClass = " red-plus";
                                        }
                                        //Add a row for the add new button
                                        cartHTML += "<tr class=\"add-new\">"+
                                                            "<td colspan=\"5\" class=\"text-center\"><a style=\"cursor:pointer;\" onclick=\"addNewCartItem('"+projectInfo.projectID+"','"+addonInfo.keywordID+"');\" class=\"add-new-selection\"><i class=\"fa fa-plus"+addMoreClass+"\" aria-hidden=\"true\"></i></a></td>"+
                                                    "</tr>";

                                        //Close the keyword-level elements
                                        cartHTML += "</tbody>"+
                                                "</table>";
                                    }
                                }
                            }

                            //Add a div for the project management
                            missionPMHours = Math.ceil(missionTotalContentCount*0.5);

                            cartHTML += "<div class=\"project-management-checkbox\">"+
                                            "<input type=\"checkbox\" id=\"mission-"+projectInfo.projectID+"-pmbox\"";

                            if(addPM)
                            {
                                missionSubtotal += (missionPMHours*pmPrice);
                                cartHTML += " checked";
                            }
                            cartHTML += " onchange=\"toggleMissionProjectManagement('"+projectInfo.projectID+"','"+missionPMHours+"');\" /><label>ADD <strong>[<span> "+missionPMHours+" HOURS </span>]</strong> PROJECT MANAGEMENT <strong>[<span> @ $"+numberWithCommas(pmPrice.toFixed(2))+"/HOUR </span>]</strong><span class=\"position-relative\"><i class=\"info-icon\"> </i></label>"+
                                                "<div class=\"custom_tooltip\">"+
                                                    "<h2>PROJECT MANAGEMENT</h2>"+
                                                    "<p>Based on your content selections for this keyword RankHacker recommends "+missionPMHours+" hours of project management to keep your marketing hands-free.</p>"+
                                                    "<!--<div style=\"float: left;width: 100%;margin: 0;padding: 0;\"><input type=\"checkbox\" />ADD PROJECT MANAGEMENT<a href=\"javascript:void(0);\" class=\"no-thanks\">NO THANKS</a></div>-->"+
                                                "</div>"+
                                            "</span>"+
                                        "</div>";

                            //Close the mission-level elements
                            cartHTML += "</div>"+
                                    "<div class=\"cart-subtotal-section\"><label>MONTHLY CONTENT: "+missionTotalContentCount+" PCS</label> <span class=\"price\"><small>$</small>"+numberWithCommas(missionSubtotal.toFixed(2))+"</span> </div>";
                        }
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
                    
                    /*setCookie("username","",-1);
                    setCookie("username",username,1);
                    var cookie = getCookie("cb_path");
                    console.log(cookie);*/
                    //$("#pay-now-button").prop("href",planURL);
                    
                }
            }
        });
        
        //Register the info-icon event handlers
        $(document.body).on('click','.info-icon',function(){
            $(this).next('.custom_tooltip').toggleClass('active');
            });

        $(document.body).on('mouseover','.info-icon',function(){
                    $('.custom_tooltip').removeClass('active');
                    $(this).next('.custom_tooltip').addClass('active');
            });

        $(document.body).on('mouseout','.info-icon',function(){
                    $('.custom_tooltip').removeClass('active');
                    $(this).next('.custom_tooltip').removeClass('active');
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
    
    if(addonOptions != "")
    {
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

function addMissionProjectManagement(projectID,quantity)
{
    var username = getCookie("username");
    if(username != "" && projectID != "")
    {
        $.ajax({url: restURL, data: {'command':'addMissionProjectManagement','projectid':projectID,'quantity':quantity,'username':username}, type: 'post', async: true, success: function postResponse(returnData){
                //var info = JSON.parse(returnData);
                refreshCartDetails();
            }
        });
    }
}

function removeMissionProjectManagement(projectID)
{
    var username = getCookie("username");
    if(username != "" && projectID != "")
    {
        $.ajax({url: restURL, data: {'command':'removeMissionProjectManagement','projectid':projectID,'username':username}, type: 'post', async: true, success: function postResponse(returnData){
                //var info = JSON.parse(returnData);
                refreshCartDetails();
            }
        });
    }
}

function toggleMissionProjectManagement(projectID,quantity)
{
    var checked = $("#mission-"+projectID+"-pmbox").prop("checked");
    if(checked)
    {
        addMissionProjectManagement(projectID,quantity);
    }
    else
    {
        removeMissionProjectManagement(projectID);
    }
}

function processThankYou()
{
    //Grab the subscription ID from the ChargeBee response and update the database with the appropriate info
    var username = getCookie("username");
    var hostedPageID = getURLParameter("id");
    var state = getURLParameter("state")
    if(username != "" && state == "succeeded")
    {
        //addToCart(keywordID);
        $.ajax({url: restURL, data: {'command':'saveCustomerSubscriptionID','username':username,'hostedpageid':hostedPageID}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);
                if(info.status == "success")
                {
                    refreshCartDropdown();
                    var subscriptionID = info.cbSubscriptionID;
                    var customerID = info.cbCustomerID;
                    document.cookie = "cbCustomerID="+info.customerID;
                    sendNewContentOrder(subscriptionID);
                }
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

function handlePayNow(e)
{
    var e = e || window.event;
    e.preventDefault();
    
    var cbCustomerID = getCookie("cbCustomerID");
    var username = getCookie("username");
    
    if(cbCustomerID == "")
    {
        window.location = '../keywordhacker/securecheckout.html';
    }
    else
    {
        if(username != "")
        {
            $.ajax({url: restURL, data: {'command':'addSubscriptionForCustomer','username':username,'customerid':cbCustomerID}, type: 'post', async: true, success: function postResponse(returnData){
                    var info = JSON.parse(returnData);
                    if(info.status == "success")
                    {
                        refreshCartDropdown();
                        var subscriptionID = info.cbSubscriptionID;
                        sendNewContentOrder(subscriptionID);
                        window.location = '../keywordhacker/thankyou.html?state=internal';
                    }
                    else
                    {
                        window.location = '../keywordhacker/error.html';
                    }
                }
            });
        }
        else
        {
            window.location = '../keywordhacker/error.html';
        }
    }
}

function prepareCheckout()
{
    var username = getCookie("username");
    var path = "";
    
    $.ajax({url: restURL, data: {'command':'getUserCheckoutPage','username':username}, type: 'post', async: true, success: function postResponse(returnData){
            var info = JSON.parse(returnData);

            if(info.status == "success")
            {
                path = info.message;
                $("#content_frame_part").attr("src",path);
            }
            else
            {
                window.top.location.href = "error.html";
                /*path = "error.html";
                $("#content_frame_part").attr("src",path);*/
            }
        }
    });    
}

function flashAddedMessage(e)
{
    var e = e || window.event;
    $("#added-message").css({
        top: window.y-30,
        left: window.x+20
      });
    
    $('#added-message').delay(0).fadeIn(500, function() {
      $(this).delay(200).fadeOut(500);
   });
}

function prepareErrorPage()
{
    refreshCartDropdown();
}

function loadMissionData(redraw)
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
                            if(redraw)
                            {
                                displayMissionInfo('keyword',false);
                            }
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
        if(username !== 'admin@fairmarketing.com' && username !== 'hari.patel@1520holdings.com' && $('#industry-link').length)
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

function displayMissionInfo(field,sort)
{
    $('body').addClass('wait');
    var returnData = $('#json').val();
    var info = JSON.parse(returnData);

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
        var incomingTraffic = Math.round(projectInfo.incomingTraffic,0);
        var keywordCount = projectInfo.keywordCount;
        var geoLocation = projectInfo.geoLocation;
        var monthlyVisitors = projectInfo.monthlyVisitors;
        var payingCustomers = projectInfo.payingCustomers;
        var currencyHexCode = projectInfo.currencyHexCode;
        var useGoogle = projectInfo.useGoogle;
        var useBing = projectInfo.useBing;
        var useDefaultConversionRate = projectInfo.useDefaultConversionRate;
        var projectOrdered = projectInfo.projectOrdered;
        var eCommerce = projectInfo.eCommerce;
        
        var projectTitle = projectInfo.clientURL;
        var useYouTube = projectInfo.useYouTube;
        var useAppStore = projectInfo.useAppStore;
        var useLocal = projectInfo.useLocal;
        var useRegional = projectInfo.useRegional;
        var useNational = projectInfo.useNational;
        var industryID = projectInfo.industryID;
        
        var projectTotalContentDiff = Math.max(0,projectInfo.projectTotalContentDiff);
        
        var customerConversionRate = projectInfo.defaultConversionRate;
        if(monthlyVisitors != 0 && payingCustomers != 0 && useDefaultConversionRate != 1)
        {
            customerConversionRate = (payingCustomers / monthlyVisitors);
        }
        
        var monthlyCustomers = Math.round(incomingTraffic * customerConversionRate,0);
        var monthlySales = Math.round(monthlyCustomers * valuePerCustomer,0);
        var costPerMonth = Math.round((projectTotalContentDiff * costPerLevel),0);
        var keywordNetWorth = (monthlySales - costPerMonth);
        
        var netWorthClass = "green-bg-total";
        if(keywordNetWorth < 0 || completed != 1)
        {
            netWorthClass = "red-bg-total";
        }
        
        var keywordNetWorthString = "";
        
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
            keywordNetWorthString = "<span class=\"loader__dot\" style=\"font-size:15px;color:#fff;\">calculating...</span>";
            //Show the warning message at top, and set the flag to keep checking
            $("#message-bar").addClass("progress-message");
            if(currentlyAdding)
            {
                $("#message-header").html("<img src=\"images/blue-message-text.png\" class=\"message-icon\"/>ADDING KEYWORDS");
                $("#message-content").html("Manually refresh this page to get the latest info, or hang out and we'll let you know as soon as all the numbers are in!");
            }
            else if(currentlyHacking)
            {
                $("#message-header").html("<img src=\"images/blue-message-text.png\" class=\"message-icon\"/>HACKING COMPETITORS' STRATEGIES");
                $("#message-content").html("This report could take several minutes but it's worth the wait! Periodically refresh this page or give us a sec and we'll let you know as soon as it completes!");
            }
            $("#check-project-done-flag").val(1);
        }
        else
        {
            keywordNetWorthString = "<sup>"+currencyHexCode+"</sup>"+numberWithCommas(keywordNetWorth)+"<div style=\"text-align:right;float:right;clear:both;display:inline-block;color:#fff;font-size:12px;font-weight:bold;margin-top:3px;\">/mo</div>";
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
        
        /*$('#currency-code-1').html(currencyHexCode);
        $('#currency-code-2').html(currencyHexCode);
        $('#currency-code-3').html(currencyHexCode);*/
        
        if(useGoogle == 1 && useBing != 1)
        {
            $("#mission-search-engines-1").html("<label>Projections for:</label> google");
        }
        else if(useGoogle != 1 && useBing == 1)
        {
            $("#mission-search-engines-1").html("<label>Projections for:</label> yahoo/bing");
        }
        else
        {
            $("#mission-search-engines-1").html("<label>Projections for:</label> google, yahoo/bing");
        }
        
        if(typeof searchVolume === 'undefined') {searchVolume = 0;}
        if(typeof incomingTraffic === 'undefined') {incomingTraffic = 0;}
        if(typeof payingCustomers === 'undefined') {payingCustomers = 0;}
        if(typeof monthlyVisitors === 'undefined') {monthlyVisitors = 0.0000001;}
        if(typeof monthlySales === 'undefined') {monthlySales = 0;}
        if(typeof costPerMonth === 'undefined' || keywordCount == 0) {costPerMonth = 0;}
        
        /*var locationTitleText = "Total monthly search volume for the city you typed in above.";
        if(typeof projectInfo.useNational != "undefined")
        {
            if(projectInfo.useNational == 1)
            {
                locationTitleText = "Total monthly search volume for the country that your city resides within.";
            }
        }*/
    
        var cartSrc = "images/cart-static.png";
        var cartOnclick = "addToCart(event,'-1');";
        if(projectOrdered)
        {
            cartSrc = "images/cart-inactive.png";
            cartOnclick = "javascript:void(0);";
        }
    
        var monthlyCustomersText = "MONTHLY CUSTOMERS";
        var monthlySalesText = "MONTHLY SALES";
        if(eCommerce != 1)
        {
            monthlyCustomersText = "MONTHLY LEADS";
            monthlySalesText = "POTENTIAL SALES";
        }
        
        $("#mission-location-1").html("<label>Location:</label> "+geoLocation);
        $("#mission-title-1").html(clientURL);
        $("#mission-title-2").html(clientURL+"<strong class=\"position-relative\" onclick=\"gotoCreateProject('"+projectID+"');\"><i class=\"edit-icon\" title=\"Edit mission\"></i></strong>");
        
        var missionDataHTML = "<div class=\"top-check-selection\" style=\"display:none;\">" +
							"<input class=\"\" type=\"checkbox\">SEO "+
							"<input class=\"\" type=\"checkbox\">PPC"+
						"</div>"+
                        "<div class=\"panel-group keyword-networth-project-outer\" id=\"accordion\" role=\"tablist\" aria-multiselectable=\"true\">";
        
        //Hidden inputs for wizard
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-url-"+projectID+"\" value=\""+projectTitle+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-geolocation-"+projectID+"\" value=\""+geoLocation+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-usegoogle-"+projectID+"\" value=\""+useGoogle+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-usebing-"+projectID+"\" value=\""+useBing+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-useyoutube-"+projectID+"\" value=\""+useYouTube+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-useappstore-"+projectID+"\" value=\""+useAppStore+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-uselocal-"+projectID+"\" value=\""+useLocal+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-useregional-"+projectID+"\" value=\""+useRegional+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-usenational-"+projectID+"\" value=\""+useNational+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-industryid-"+projectID+"\" value=\""+industryID+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-ecommerce-"+projectID+"\" value=\""+eCommerce+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-customervalue-"+projectID+"\" value=\""+valuePerCustomer+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-monthlyvisitors-"+projectID+"\" value=\""+monthlyVisitors+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-monthlycustomers-"+projectID+"\" value=\""+payingCustomers+"\">";
        missionDataHTML += "<input type=\"hidden\" id=\"wizard-contentcost-"+projectID+"\" value=\""+costPerLevel+"\">";
        
        
        
        missionDataHTML += "<table class=\"keyword-networth-project\" id=\"keyword-summary-table\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">"+
                                "<thead>"+
                                    "<tr class=\"table-heading\" onmouseover=\"setHeadingBG('#faf8c7');\" onmouseout=\"setHeadingBG('#f1f1f3');\">"+
                                        "<td id=\"mission-heading-keyword\" colspan=\"2\" onclick=\"displayMissionInfo('keyword',true);\">"+
                                            "<h2 class=\"table-title\" id=\"keyword-count-1\">"+keywordCount+" active <span>KEYWORD PHRASES</span></h2>"+
                                        "</td>"+
                                        "<td id=\"mission-heading-search-volume\" class=\"price-widthbox\" onclick=\"displayMissionInfo('searchVolume',true);\">"+
                                            "<h2 class=\"table-title\" id=\"mission-search-volume\">"+numberWithCommas(searchVolume)+" <span class=\"info-icon-2\" title=\"The monthly average searches for each keyword\">MO. SEARCH VOLUME</span></h2>"+
                                        "</td>"+
                                        "<td id=\"mission-heading-monthly-visitors\" class=\"price-widthbox\" onclick=\"displayMissionInfo('monthlyVisitors',true);\">"+
                                            "<h2 class=\"table-title\" id=\"mission-monthly-visitors\">"+numberWithCommas(incomingTraffic)+"<span class=\"info-icon-2\" title=\"Applying each keyword's average Click Through Rate to the Monthly Search Volume, based on selected competitors\">MONTHLY VISITORS</span><span class=\"blue-text\">PROJECTED </span></h2>"+
                                        "</td>"+
                                        "<td id=\"mission-heading-monthly-customers\" class=\"price-widthbox\" onclick=\"displayMissionInfo('monthlyCustomers',true);\">"+
                                            "<h2 class=\"table-title\" id=\"mission-monthly-customers\">"+numberWithCommas(Math.round(incomingTraffic * customerConversionRate,0))+"<span class=\"info-icon-2\" title=\"Applying your website's current Conversion Rate to Projected Monthly Visitors\">"+monthlyCustomersText+"</span><span class=\"blue-text\">PROJECTED </span></h2>"+
                                        "</td>"+
                                        "<td id=\"mission-heading-monthly-sales\" class=\"price-widthbox\" style=\"padding-right: 0;\" onclick=\"displayMissionInfo('monthlySales',true);\">"+
                                            "<h2 class=\"table-title negative-sign\" id=\"mission-monthly-sales\"><sup>"+currencyHexCode+"</sup>"+numberWithCommas(monthlySales)+"<span class=\"info-icon-2\" title=\"Projected Customers multiplied by the monetary value of one paying customer\">"+monthlySalesText+"</span><span class=\"blue-text\">PROJECTED </span></h2>"+
                                        "</td>"+
                                        "<td id=\"mission-heading-cost-per-month\" class=\"price-widthbox\" style=\"padding-right: 0;\" onclick=\"displayMissionInfo('costPerMonth',true);\">"+
                                            "<h2 class=\"table-title equal-sign\" id=\"mission-content-goal\"><sup>"+currencyHexCode+"</sup>"+numberWithCommas(costPerMonth)+" <small>("+projectTotalContentDiff+" pcs)</small><div id=\"mission-cart-div\" onclick=\"event.cancelBubble; event.stopPropagation();\" class=\"mission-cart-div\"><img src=\""+cartSrc+"\" id=\"project-add-to-cart\" style=\"height:18px;\" class=\"mission-cart-icon\" onclick=\""+cartOnclick+"\"></div><span class=\"info-icon-2\" title=\"Target amount of monthly content and its cost\">CONTENT COST & GOAL</span></h2>"+
                                        "</td>"+
                                        "<td id=\"mission-heading-keyword-networth\" class=\"price-widthbox\" colspan=\"2\" onclick=\"displayMissionInfo('keywordNetWorth',true);\">"+
                                            "<h2 class=\"table-title\" id=\"mission-networth\"><strong class=\""+netWorthClass+"\">"+keywordNetWorthString+"</strong><span class=\"info-icon-2\" title=\"Projected return on your invested marketing dollars for this keyword\">KEYWORD NET WORTH<sup style=\"font-size:6px;\">TM</sup></span></h2>"+
                                        "</td>"+
                                    "</tr>"+

                                    "<tr class=\"sorttable_nosort\"> <td style=\"border-right: none;\"><div class=\"margin10t\"></div></td></tr>"+
                                    
                                "</thead>"+
                                "<tbody>";
        
        var projectIDValue = parseInt(projectID);
    if(projectIDValue < 260)
    {
        $("#metro-option").hide();
    }
    
    //Fill in the form data
    var wizardURL = projectTitle;
    var wizardGeolocation = geoLocation;
    var wizardUseGoogle = useGoogle;
    var wizardUseBing = useBing;
    var wizardUseYouTube = useYouTube;
    var wizardUseAppStore = useAppStore;
    var wizardUseLocal = useLocal;
    var wizardUseRegional = useRegional;
    var wizardUseNational = useNational;
    var wizardIndustryID = industryID;
    var wizardECommerce = eCommerce;
    var wizardCustomerValue = valuePerCustomer;
    var wizardMonthlyVisitors = monthlyVisitors;
    var wizardMonthlyCustomers = payingCustomers;
    var wizardContentCost = costPerLevel;
    
    
    $("#website-url-input").html("website, <label style=\"color:#005cb8;font-weight:300 !important;font-size:14px;\">"+wizardURL+"</label>,");
    $("#scrollable-dropdown-menu").html("<label style=\"color:#005cb8;font-weight:300 !important;font-size:14px;\">"+wizardGeolocation+"</label>");
    $("#phrase-input").hide();
    $("#editing-project-id").val(projectID);
    
    if(typeof wizardECommerce !== "undefined")
    {
        if(wizardECommerce == 1)
        {
            $('#e-commerce-selection option')[1].selected = true;
        }
        else
        {
            $('#e-commerce-selection option')[0].selected = true;
        }
    }
    refreshIndustries();

    if(typeof wizardIndustryID !== "undefined")
    {
        $('#industry-selection').val(parseInt(wizardIndustryID));
    }

    if(wizardUseGoogle == 1)
    {
        $('#use-google').prop('checked',true);
    }
    else
    {
       $('#use-google').prop('checked',false); 
    }

    if(wizardUseBing == 1)
    {
        $('#use-bing').prop('checked',true);
    }
    else
    {
       $('#use-bing').prop('checked',false); 
    }

    if(wizardUseYouTube == 1)
    {
        $('#use-you-tube').prop('checked',true);
    }
    else
    {
       $('#use-you-tube').prop('checked',false); 
    }

    if(wizardUseAppStore == 1)
    {
        $('#use-app-store').prop('checked',true);
    }
    else
    {
       $('#use-app-store').prop('checked',false); 
    }

    if(wizardUseLocal == 1)
    {
        $('#local-national option')[0].selected = true;
    }
    else if(wizardUseRegional == 1)
    {
        $('#local-national option')[1].selected = true;
    }
    else
    {
       $('#local-national option')[2].selected = true;
    }

    $("#customer-value").val(wizardCustomerValue);
    $("#monthly-visitors").val(wizardMonthlyVisitors);
    $("#monthly-customers").val(wizardMonthlyCustomers);
    $("#content-cost").val(wizardContentCost);
        
        //Output the keyword summary rows here
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
        for(var i=0; i<keywordInfo.length; i++)
        {
            var thisEntry = keywordInfo[i];
            var thisCompetitorArray = thisEntry.competitorData;

            var keywordID = thisEntry.keywordID;
            var searchVolume = thisEntry.searchVolume;
            var clientRanking = thisEntry.clientRanking;
            var keywordActive = thisEntry.active;
            //var avgCTR = Math.round(thisEntry.avgCTR);
            //var avgCTRExact = Math.round(thisEntry.avgCTRExact);
            var keywordHidden = thisEntry.hidden;
            var clientPowerLevel = thisEntry.clientKeywordPowerLevel;
            var errorExists = thisEntry.errorFlag;

            //var competitorsAverageMonthlyContent = thisEntry.competitorsAverageMonthlyContent;
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
            //var avgRank = thisEntry.avgRank;
            var totalPowerLevel = thisEntry.totalPowerLevel;     //Add back the client power level to the total power level for this keyword
            var keyword = thisEntry.keyword;

            var monthlyVisitors = thisEntry.monthlyVisitors;
            var monthlyCustomers = thisEntry.monthlyCustomers;
            var monthlySales = thisEntry.monthlySales;
            var costPerMonth = thisEntry.costPerMonth;
            var keywordNetWorth = thisEntry.keywordNetWorth;
            var keywordStatus = thisEntry.status;
            var numCartEntries = thisEntry.numCartEntries;
            
            var keywordCartDisplay = "block";
            var cartSrc = "images/cart-static.png";
            var cartOnclick = "addToCart(event,'"+keywordID+"');";
            if(numCartEntries>0)
            {
                cartSrc = "images/cart-inactive.png";
                cartOnclick = "javascript:void(0);";
                keywordCartDisplay = "none";
            }
            
            var keywordTotalContentDiffHTML = "";
            var topKWNetworth = "";
            var topHackContentHTML = "";
            var shadedString = "";
            var errorTriangleHTML = "";

            if(errorExists == 1)
            {
                errorTriangleHTML = "<a data-toggle=\"tooltip\" onclick=\"rerunKeyword('"+keywordID+"');\" class=\"tooltip-hover\" title=\"\" data-original-title=\"It looks like there was an issue running this keyword. Please click the triangle icon to try re-running the phrase.\"><img src=\"images/red-warning-icon.png\" class=\"restart-icon\"></a>";
                //Also show the message at the top
                $("#message-bar").removeClass("warning-mesage").removeClass("progress-message").removeClass("success-message").addClass("error-message");
                $("#message-header").html("<img src=\"images/red-close.png\" class=\"message-icon\"/>SOMETHING WENT WRONG");
                $("#message-content").html("One or more of your keywords below errored out during processing. You can click the red triangle next to a keyword to try re-running it.");
                
            }
            
            if(keywordStatus == "hacked")
            {
                topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
                topHackContentHTML = "<span style=\"font-size:12px;color:#808080;cursor:pointer;\" onclick=\"togglePanel('"+keywordID+"');\">"+currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)</span>";
                if(keywordTotalContentDiff >= 0)
                {
                    keywordTotalContentDiffHTML = "+" + keywordTotalContentDiff;
                }
                else
                {
                    keywordTotalContentDiffHTML = keywordTotalContentDiff;
                }
                keywordCartDisplay = "block";
            }
            else if(keywordStatus == "hacking")
            {
                topHackContentHTML = "";
                topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
                keywordTotalContentDiffHTML = "?";
                keywordCartDisplay = "none !important";
            }
            else if(keywordStatus == "adding")
            {
                topHackContentHTML = "$0 (0 pcs)";
                topKWNetworth = "";
                keywordTotalContentDiffHTML = "?";
                keywordCartDisplay = "none !important";
            }
            else
            {
                //It's just been added, not yet hacked
                shadedString = " disabled";                
                topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
                if(keywordActive == 1)
                {
                    topHackContentHTML = "<span class=\"reveal-mark-small\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\"> REVEAL </span>";
                    keywordCartDisplay = "none !important";
                }
                else
                {
                    //topHackContentHTML = "<span class=\"reveal-mark-small\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\"> REVEAL </span>";
                    topHackContentHTML = currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)";
                }
                keywordTotalContentDiffHTML = "?";
            }
            
            if(keywordActive != 1)
            {
                keywordCartDisplay = "none !important";
            }
            
            var keywordCartDisplay2 = keywordCartDisplay;
            if(numCartEntries > 0)
            {
                keywordCartDisplay2 = "none !important";
            }
            
            var keywordCheckboxStatus = "";
            var rowBGText = "";
            var checkboxBGClass = "";
            var anchorCursorStyle = "";
            var keywordToggle = "";
            var progressBarDisplay = "none";
            var projectInfoDisplay = "table-row";
            if(keywordActive == 1 && (keywordStatus == "hacked" || keywordStatus == "added"))
            {
                keywordCheckboxStatus = "checked";
                rowBGText = "style=\"opacity:1.0;cursor:pointer;\"";
                checkboxBGClass = "";
                anchorCursorStyle = "";
                keywordToggle = " onclick=\"togglePanel('"+keywordID+"');\"";
                projectInfoDisplay = "table-row";
            }
            else if(keywordActive == 1 && (keywordStatus == "hacking" || keywordStatus == "adding"))
            {
                keywordCheckboxStatus = "checked";
                rowBGText = "style=\"opacity:1.0;\"";
                checkboxBGClass = "";
                anchorCursorStyle = "";
                keywordToggle = "";
                progressBarDisplay = "table-row";
                projectInfoDisplay = "table-row";
            }
            else
            {
                rowBGText = "style=\"opacity:0.33;\"";
                checkboxBGClass = " opaque";
                anchorCursorStyle = "style=\"cursor:default;\"";
                keywordToggle = " onclick=\"togglePanel('"+keywordID+"');\"";
                progressBarDisplay = "none";
                projectInfoDisplay = "table-row";
            }

            var hideText = "";
            if(keywordHidden == 1)
            {
                rowBGText = "style=\"display:none;\"";
                hideText = "style=\"display:none;\"";
            }

            //Add the summary row for the accordian HTML
            missionDataHTML += "<tr class=\"project-head panel sortable-row\" "+hideText+" id=\"kw-summary-row-"+keywordID+"\" data-question-id=\""+keywordID+"\">\n" +
"                                        <td class=\"checkbox-ot"+checkboxBGClass+"\"><input class=\"magic-checkbox\" style=\"opacity: 1.0 !important; z-index:999;\" id=\"chk-content-all-kw"+keywordID+"\" type=\"checkbox\" "+keywordCheckboxStatus+"  onchange=\"toggleKeyword('"+keywordID+"',this.checked);\"><label for=\"chk-content-all-kw"+keywordID+"\"</td>\n" +
"                                        <td class=\"project-name-ot\" "+keywordToggle+" "+rowBGText+"><a class=\"\" "+anchorCursorStyle+">"+keyword+"</a>"+errorTriangleHTML+"</td>\n" +
"                                        <td data-label=\"MO. SEARCH VOLUME\" class=\"price-widthbox\" "+keywordToggle+" "+rowBGText+">"+numberWithCommas(searchVolume)+"</td>\n" +
"                                        <td data-label=\"MONTHLY VISITORS PROJECTED\" class=\"price-widthbox\" "+keywordToggle+" "+rowBGText+">"+numberWithCommas(monthlyVisitors)+"</td>\n" +
"                                        <td data-label=\"MONTHLY CUSTOMERS PROJECTED \" class=\"price-widthbox\" "+keywordToggle+" "+rowBGText+">"+numberWithCommas(monthlyCustomers)+"</td>\n" +
"                                        <td data-label=\"MONTHLY SALES PROJECTED\" class=\"price-widthbox\" "+keywordToggle+" "+rowBGText+"><div class=\"negative-sign\">"+currencyHexCode+numberWithCommas(monthlySales)+"</div></td>\n" +
"                                        <td data-label=\"CONTENT GOAL & COST\" class=\"price-widthbox\" "+rowBGText+"><div id=\"kw-"+keywordID+"-content-goal\" class=\"equal-sign\" style=\"cursor:default;\">"+topHackContentHTML+"<div class=\"mission-cart-div\"><img src=\""+cartSrc+"\" id=\"cart-icon-"+keywordID+"\" style=\"display:"+keywordCartDisplay+";\" class=\"mission-cart-icon\" onclick=\""+cartOnclick+"\"></div></div></td>\n" +
"                                        <td data-label=\"KEYWORD NET WORTH\" class=\"price-widthbox\" "+keywordToggle+" "+rowBGText+">"+topKWNetworth+"</td>\n" +
"                                        <td class=\"delect-row\" "+rowBGText+"><a href=\"#\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\" onclick=\"displayKeywordDeleteWindow('"+keywordID+"');\"></i></a></td> \n" +
"                                    </tr>\n" +
"                                    <tr id=\"progress-row-"+keywordID+"\" class=\"progress-row sorttable_nosort\" style=\"display:"+progressBarDisplay+";\">\n" +
"                                        <td colspan=\"9\" style=\"border-right: none !important\">\n" +
"                                            <div class=\"progress-loader\">\n" +
"                                                <div class=\"indeterminate\"></div>\n" +
"                                            </div>\n" +
"                                        </td>\n" +
"                                    </tr>";

                var revealButtonDisplay = "block";
                if(keywordStatus == "hacked")
                {
                    revealButtonDisplay = "none";
                }

                //Add the competitors panel
                missionDataHTML += "<tr id=\"project-info-"+keywordID+"\" "+rowBGText+" class=\"project-info sorttable_nosort\" data-answer-id=\""+keywordID+"\">\n" +
"                                        <td colspan=\"9\" style=\"border-right: none !important;\">\n" +
"                                            <div id=\"kw-competitors-panel-"+keywordID+"\" class=\"panel-collapse collapse\">\n" +
"                                                <div class=\"row\">\n" +
"                                                    <div class=\"col-sm-7 content-goal-info\">\n" +
"                                                        <h2 class=\"title\">SELECT BELOW TO MODIFY YOUR <span>KEYWORD NETWORTH</span> AND <span>CONTENT GOAL</span></h2>\n" +
"                                                       <div class=\"table-outer\">\n" +
"                                                       <span class=\"reveal-mark\" style=\"display:"+revealButtonDisplay+";\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\"> REVEAL </span>\n" +
"                                                        <table class=\"content-goal-table sortable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n" +
"                                                            <thead>\n" +
"                                                                <tr class=\"table-heading2\">\n" +
"                                                                    <th class=\"col-sm-1\"></th>\n" +
"                                                                    <th class=\"col-sm-1 text-center\"><span>Rank<br/>&nbsp;</span></th>\n" +
"                                                                    <th class=\"col-sm-7 text-left\"><span>URL<br/>&nbsp;</span></th>\n" +
"                                                                    <th class=\"col-sm-1 text-center\"><span class=\"info-icon-3\" title=\"Click Through Rate for the ranking position and current keyword\">CTR<br/>&nbsp;</span></th>\n" +
"                                                                    <th class=\"col-sm-1 text-center\"><span class=\"info-icon-3\" title=\"The total number of backlinks this competitor has\">Total Backlinks</span></th>\n" +
"                                                                    <th class=\"col-sm-1 text-center\"><span class=\"info-icon-3\" title=\"The amount of off-site content produced each month with this keyword phrase as the topic\">Monthly Content</span></th>\n" +
"                                                                </tr>\n"+
"                                                            </thead>\n"+
"                                                            <tbody>\n";

                            //Populate for each competitor
                            var competitorsCount = 0;
                            var totalCTR = 0;
                            //var totalPowerLevel = 0;
                            var totalRank = 0;
                            var totalBacklinks = 0;

                            var disabled = false;

                            var unhackedCompetitorExists = false;
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
                                    var competitorURLShort = competitorURL.substring(0,60);
                                    if(competitorURL.length > 60) { competitorURLShort += "..."; }

                                if(competitorAhrefsStarted == 0 && competitorActive == 1)
                                {
                                    unhackedCompetitorExists = true;
                                }

                                var competitorCTR = Math.round(thisCompetitor.traffic);
                                var competitorCTRExact = Math.round(thisCompetitor.trafficExact);

                                var competitorPowerLevel = thisCompetitor.competitorMonthlyContent;
                                var competitorMonthlyBacklinks = thisCompetitor.competitorMonthlyBacklinks;
                                var competitorTotalBacklinks = thisCompetitor.competitorTotalBacklinks;
                                var competitorContentCountHTML = "";
                                var competitorMonthlyBacklinksHTML = "";
                                if(competitorPowerLevel < 0 && keywordStatus == "hacking" && competitorActive == 1)
                                {
                                    competitorContentCountHTML = "0";
                                }
                                else if(competitorPowerLevel < 0)
                                {
                                    competitorContentCountHTML = "";
                                }
                                else
                                {
                                    competitorContentCountHTML = competitorPowerLevel;
                                }

                                if(competitorAhrefsCompleted == 0 && keywordStatus == "hacking" && competitorActive == 1)
                                {
                                    competitorMonthlyBacklinksHTML = "";
                                }
                                else if(competitorMonthlyBacklinks < 0 || competitorAhrefsStarted == 0)
                                {
                                    competitorContentCountHTML = "";
                                }
                                else
                                {
                                    competitorMonthlyBacklinksHTML = numberWithCommas(parseInt(competitorTotalBacklinks));
                                }

                                var competitorCheckboxStatus = "";
                                var seoInsuranceHTML = "";
                                if(competitorActive == 1 && !disabled)
                                {
                                    competitorCheckboxStatus = "checked";
                                    competitorsCount++;
                                    totalCTR += competitorCTR;
                                    totalPowerLevel += competitorPowerLevel;
                                    totalRank += competitorPositionRank;
                                    totalBacklinks += parseInt(competitorTotalBacklinks);
                                }

                                if(thisCompetitor.disabled == 1)
                                {
                                    competitorCheckboxStatus = " disabled";
                                    seoInsuranceHTML = "<span class=\"text-right\" style=\"vertical-align:middle;float:right;margin-right:-8px;padding-right:0;padding-top:10px;\"><a class=\"insurance-icon\" title=\"Coming soon! Buy insurance for your top 10 ranking!\"><img src=\"images/seo-insurance-icon.png\" style=\"position:absolute;right:0;top:-3px;width:27px;height:auto;\"></a></span>";
                                }
                                
                                missionDataHTML +=
"                                                                <tr class=\"project-head2\">\n" +
"                                                                    <td class=\"checkbox-ot\"><input class=\"magic-checkbox\" type=\"checkbox\" "+competitorCheckboxStatus+" id=\"chk-content-all-c"+competitorID+"\" onchange=\"toggleCompetitor('"+competitorID+"',this.checked,'"+i+"','"+keywordID+"');\"><label for=\"chk-content-all-c"+competitorID+"\"></label> </td>\n" +
"                                                                    <td data-label=\"Rank\" class=\"text-center\">"+competitorPositionRank+"</td>\n" +
"                                                                    <td data-label=\"URL\" class=\"text-left\" title=\""+competitorURL+"\">"+competitorURLShort+"<a title=\"Copy full URL to clipboard\" id=\"copy-anchor-"+competitorID+"\" class=\"copy-button\" onmouseover=\"resetTitle('"+competitorID+"');\" onclick=\"showCopiedConfirmation('"+competitorID+"');\" data-clipboard-action=\"copy\" data-clipboard-text=\""+competitorURL+"\"><i class=\"fa fa-copy fa-blue\" id=\"copy-icon-"+competitorID+"\" style=\"padding-left:5px;cursor:pointer;\"></i></a></td>\n" +
"                                                                    <td data-label=\"CTR\" class=\"text-center\">"+competitorCTR+"%</td>\n" +
"                                                                    <td data-label=\"Monthly Backlinks\" class=\"text-center"+shadedString+"\" id=\"kwid-"+keywordID+"-competitorid-"+competitorID+"-backlinks\">"+competitorMonthlyBacklinksHTML+"</td>\n" +
"                                                                    <td data-label=\"Monthly Content\" class=\"text-center"+shadedString+"\" id=\"kwid-"+keywordID+"-competitorid-"+competitorID+"-content\">"+competitorContentCountHTML+seoInsuranceHTML+"</td>\n" +
"                                                                </tr>\n";
                            }
                            
                            if(competitorsCount == 0) { competitorsCount = 1;}
                            
                            //Hidden element to keep track of how many competitors you've selected
                            missionDataHTML += "<input id=\"kwid-"+keywordID+"-competitorsCount\" type=\"hidden\" value=\""+competitorsCount+"\">\n";

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

                                missionDataHTML +=
"                                                            </tbody>\n" +
"                                                            <tfoot>\n" +
"                                                                <tr class=\"project-head2 them-row\">\n" +
"                                                                    <td class=\"checkbox-ot\"><strong>THEM</strong></td>\n" +
"                                                                    <td data-label=\"Rank\" class=\"text-center\" id=\"kwid-"+keywordID+"-avg-rank\">"+Math.round(totalRank/competitorsCount)+"</td>\n" +
"                                                                    <td data-label=\"URL\" class=\"text-left\"><strong>SELECTED COMPETITORS</strong></td>\n" +
"                                                                    <td data-label=\"CTR\" class=\"text-center\" id=\"kwid-"+keywordID+"-avg-ctr\">"+Math.round(totalCTR/competitorsCount)+"%</td>\n" +
"                                                                    <td data-label=\"Monthly Backlinks\" class=\"text-center negative-sign-2\" id=\"kwid-"+keywordID+"-table-total-backlinks\">"+numberWithCommas(competitorAvgBacklinks)+"</td>\n" +
"                                                                    <td data-label=\"Monthly Content\" style=\"font-size:20px;text-align:center;\" id=\"kwid-"+keywordID+"-table-total-pl\">"+competitorAvgCount+"<span style=\"font-size:12px;position:absolute !important;right:2px;margin-top:10px;color:#8a8b8f;\">avg</span></td>\n" +
"                                                                </tr>\n" +
"                                                                <tr class=\"project-head2 you-row\">\n" +
"                                                                    <td class=\"checkbox-ot\"><strong>YOU</strong></td>\n" +
"                                                                    <td class=\"text-center\">"+clientRanking+"</td>\n" +
"                                                                    <td data-label=\"URL\" class=\"text-left\">"+clientURL+"</td>\n" +
"                                                                    <td data-label=\"CTR\" class=\"text-center\">"+clientCTR+"%</td>\n" +
"                                                                    <td data-label=\"Monthly Backlinks\" class=\"text-center equal-sign-2\" id=\"kwid-"+keywordID+"-user-monthly-backlinks-count\">"+userMonthlyBacklinks+"</td>\n" +
"                                                                    <td data-label=\"Monthly Content\" style=\"font-size:20px;text-align:center;\" id=\"kwid-"+keywordID+"-user-monthly-content-count\"><input type=\"number\" class=\"transparent-text-input-2\" onchange=\"changeUserMonthlyContent('"+keywordID+"','"+i+"');\" id=\"kwid-"+keywordID+"-your-pl\" value=\""+userMonthlyContent+"\"><span style=\"font-size:12px;position:absolute !important;right:2px;margin-top:4px;\"><i class=\"info-icon\" title=\"Click the number to change your monthly content count\"></i></span></td>\n" +
"                                                                </tr>\n" +
"                                                                <tr class=\"project-head2 result-row\">\n" +
"                                                                    <td colspan=\"5\" class=\"text-right\">YOUR MONTHLY CONTENT GOAL</td>\n" +
"                                                                    <td colspan=\"2\" style=\"text-align:center;\">"+keywordTotalContentDiffHTML+"<span style=\"font-size:12px;position:absolute !important;right:2px;margin-top:2px;\"><img src=\"images/cart-dropshadow.png\" class=\"keyword-cart\" id=\"goal-cart-"+keywordID+"\" style=\"display:"+keywordCartDisplay2+";\" onclick=\"addToCart(event,'"+keywordID+"');\"></span></td>\n" +
"                                                                </tr>\n" +
"                                                            </tfoot>\n" +
"                                                        </table>\n" +
"							 </div>\n" +
"\n" +
"                                        <p class=\"tip-note\"> The competitors you select will greatly affect your monthly content goal, budget and keyword networth.</p>\n" +
"                                        </div>\n" +
"\n" +
"                                        <div class=\"col-sm-5 right-side-goalinfo\">\n" +
"                                            <div class=\"info-block\" style=\"margin-top:40px;\">\n" +
"                                                <h3>DO THIS FIRST <i class=\"checked-icon\"> </i></h3>\n" +
"                                                <p>Select competitors with high rankings and high CTR (click through rate)</p>\n" +
"                                            </div>\n" +
"                                            <div class=\"info-block\">\n" +
"                                                <h3>NEXT DO THIS <i class=\"revealsmall-icon\"> </i></h3>\n" +
"                                                <p>Reveal the monthly content strategies of your selected competitors</p>\n" +
"                                            </div>\n" +
"                                            <div class=\"info-block\">\n" +
"                                                <h3>REVIEW AND TAKE ACTION <img src=\"images/cart-static.png\" style=\"height:18px;margin-top:-3px;margin-left:30px;\"><!--<i class=\"blueproject-eagle-icon\"> </i>--></h3>\n" +
"                                                <p>View your monthly content goal—this is how much content you will need to create and publish each month to match your competition.</p>\n" +
"                                            </div>\n" +
"\n" +
"                                            <div class=\"info-block calculator-lt\">\n" +
"                                                <p class=\"calculator-logo\"><strong>WHAT’S A GOOD MONTHLY KEYWORD NETWORTH / ROI?</strong>\n" +
"                                                    <br>Start by defining your monthly sales goal using our <a href=\"salesgoalcalculator.html\" target=\"_blank\">calculator</a>.</p>\n" +
"                                            </div>\n" +
"\n" +
"                                        </div>\n" +
"\n" +
"                                        </div>\n" +
"                                        </div>\n" +
"                                        </td>\n" +
"\n" +
"                                    </tr>";
        }
        
        //Close the table
        missionDataHTML += "</tbody>"+
                "</table>";
        
        
        
        //Add the keyword suggestions
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
        //$("#suggestedKeywordsList").html(suggestedKeywordsHTML);

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
        //$("#altSuggestedKeywordsList").html(altSuggestedKeywordsHTML);
        
        
        missionDataHTML += "<div>\n" +
"\n" +
"                                <div class=\"add-custom-keyword-outer\">\n" +
"                                    <div id=\"url-list\">\n" +
"                                        <p class=\"suggest-keywords-label text-left\" style=\"margin-bottom:5px;\">Add Another Phrase to Your Mission</p>" +
"                                        <a href=\"#add-more-url\" class=\"add-more-url\" id=\"button-add-url\">+ ENTER KEYWORD PHRASE</a>\n" +
"                                    </div>\n" +
"                                    <div id=\"url-box-template\">\n" +
"                                        <div class=\"url-box\">\n" +
"                                            <input id=\"custom-url\" class=\"url-input\" value=\"\" type=\"text\" placeholder=\"\">\n" +
"                                        </div>\n" +
"                                    </div>\n" +
"                                </div>\n" +
"\n" +
"                                <div class=\"add-custom-keyword-outer\" id=\"new-phrase-container\" style=\"display:none;\">\n" +
"                                    <input type=\"hidden\" id=\"keyword-count\" value=\"0\"/>\n" +
"                                    <div class=\"add-keywords-list\">\n" +
"                                        <ul id=\"ctc\">\n" +
"\n" +
"                                        </ul>\n" +
"                                    </div>\n" +
"                                    <div class=\"add-keywords-list\">\n" +
"                                        <div id=\"submit-button-block\">\n" +
"                                            <a class=\"orange-btn btn pull-left\" onclick=\"recalculateProject();\" id=\"add-keywords-button\" style=\"opacity:0.0;\">ADD 0 KEYWORDS</a>\n" +
"                                        </div>\n" +
"                                    </div>\n" +
"                                </div>\n" +
"\n" +
"\n" +
"                                <div class=\"suggest-keywords-list-1\" style=\"margin-top:30px;\">\n" +
"                                    <p class=\"suggest-keywords-label\">+ Click to Add Suggested Keywords</p>\n" +
"                                    <!--<label for=\"post-2\" id=\"read-more-button-label\" class=\"read-more-trigger\" onclick=\"toggleReadMore();\">SHOW MORE KEYWORDS</label>-->\n" +
"                                    <input type=\"checkbox\" class=\"read-more-state\" id=\"post-2\"/>\n" +
"                                        <ul id=\"suggestedKeywordsList\" class=\"read-more-wrap\">\n"
                                            +suggestedKeywordsHTML+
"                                        </ul>\n" +
"                                    <div class=\"bth-more-text-outer\">\n" +
"                                    <div class=\"show-more-text clear-both\" id=\"show-more-text-1\" style=\"cursor:pointer;\" onclick=\"clickReadMoreTrigger('1');\">SHOW MORE</div>\n" +
"                                    <div class=\"show-more-button\"><label for=\"post-2\" id=\"read-more-button-label-1\" class=\"read-more-trigger\" onclick=\"toggleReadMore('1');\"></label></div>\n" +
"                                    </div>\n" +
"                                </div>\n" +
"\n" +
"                                <div class=\"suggest-keywords-list-2\" style=\"margin-top:30px;\">\n" +
"                                    <p class=\"suggest-keywords-label\">+ Click to Add Niche Suggested Keywords</p>\n" +
"                                    <!--<label for=\"post-2\" id=\"read-more-button-label\" class=\"read-more-trigger\" onclick=\"toggleReadMore();\">SHOW MORE KEYWORDS</label>-->\n" +
"                                    <input type=\"checkbox\" class=\"read-more-state\" id=\"post-3\"/>\n" +
"                                        <ul id=\"altSuggestedKeywordsList\" class=\"read-more-wrap\">\n"
                                            +altSuggestedKeywordsHTML+
"                                        </ul>\n" +
"                                    <div class=\"bth-more-text-outer\">\n" +
"                                    <div class=\"show-more-text clear-both\" id=\"show-more-text-2\" style=\"cursor:pointer;\" onclick=\"clickReadMoreTrigger('2');\">SHOW MORE</div>\n" +
"                                    <div class=\"show-more-button\"><label for=\"post-3\" id=\"read-more-button-label-2\" class=\"read-more-trigger\" onclick=\"toggleReadMore('2');\"></label></div>\n" +
"                                    </div>\n" +
"                                </div>\n" +
"\n" +
"                                <div class=\"card-box-bottom\" id=\"dateDivBottom\">\n" +
"                                    <div class=\"project-date-card date_sort\"><i class=\"eagle-icon\"></i>Initiated "+runDate+"</div><a class=\"project-status-card  project_status_sort\" href=\"javascript:void(0);\">"+activeString+"</a>\n"+
"                                </div>\n" +
"\n" +
"                            </div>\n" +
"\n" +
"                        </div>";
        
        //Output the contents of the report
        $("#mission-data").html(missionDataHTML);
        
        //Remove the waiting class from the cursor
        $('body').removeClass('wait');
        $("body").tooltip({ selector: '[data-toggle=tooltip]' });
        
        
        //Load the sorttable script
        $.getScript("js/sorttable.js", function(){});
        
        //All done, register the listners!
        registerMissionReportListeners();
}

function togglePanel(keywordID)
{
    if($("#kw-competitors-panel-"+keywordID).hasClass("in"))
    {
        //Close it
        $("#kw-summary-row-"+keywordID).removeClass("open");
        $("#project-info-"+keywordID).removeClass("active");
        $("#kw-competitors-panel-"+keywordID).removeClass("in");
    }
    else
    {
        var opacity = $("#kw-summary-row-"+keywordID).children("td").eq(1).css("opacity");

        if(opacity == 1 || opacity == "1.0") //It's not hidden
        {
            //Open it
            $("#kw-summary-row-"+keywordID).addClass("open");
            $("#project-info-"+keywordID).addClass("active");
            $("#kw-competitors-panel-"+keywordID).addClass("in");
        }
    }
}

function refreshMissionData(keywordCounter,keywordID)
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
                    //if(false)
                    {
                        refreshMissionKeyword(returnData,field,keywordID);
                        refreshKeywordSuggestions();
                    }
                    else
                    {
                        displayMissionInfo(field,false);
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

function refreshMissionKeyword(returnData,field,keywordID)
{
    var info = JSON.parse(returnData);

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
        var incomingTraffic = Math.round(projectInfo.incomingTraffic,0);
        var keywordCount = projectInfo.keywordCount;
        var geoLocation = projectInfo.geoLocation;
        var monthlyVisitors = projectInfo.monthlyVisitors;
        var payingCustomers = projectInfo.payingCustomers;
        var currencyHexCode = projectInfo.currencyHexCode;
        var useGoogle = projectInfo.useGoogle;
        var useBing = projectInfo.useBing;
        var useDefaultConversionRate = projectInfo.useDefaultConversionRate;
        var projectOrdered = projectInfo.projectOrdered;
        var eCommerce = projectInfo.eCommerce;

        var projectTotalContentDiff = Math.max(0,projectInfo.projectTotalContentDiff);

        var customerConversionRate = projectInfo.defaultConversionRate;
        if(monthlyVisitors != 0 && payingCustomers != 0 && useDefaultConversionRate != 1)
        {
            customerConversionRate = (payingCustomers / monthlyVisitors);
        }

        var monthlyCustomers = Math.round(incomingTraffic * customerConversionRate,0);
        var monthlySales = Math.round(monthlyCustomers * valuePerCustomer,0);
        var costPerMonth = Math.round((projectTotalContentDiff * costPerLevel),0);
        var keywordNetWorth = (monthlySales - costPerMonth);

        var netWorthClass = "green-bg-total";
        if(keywordNetWorth < 0 || completed != 1)
        {
            netWorthClass = "red-bg-total";
        }

        var keywordNetWorthString = "";
    
    //Find the data
    var keywordInfo = info.keywordData;

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
            keywordNetWorthString = "<span class=\"loader__dot\" style=\"font-size:15px;color:#fff;\">calculating...</span>";
            //Show the warning message at top, and set the flag to keep checking
            $("#message-bar").addClass("progress-message");
            if(currentlyAdding)
            {
                $("#message-header").html("<img src=\"images/blue-message-text.png\" class=\"message-icon\"/>ADDING KEYWORDS");
                $("#message-content").html("Manually refresh this page to get the latest info, or hang out and we'll let you know as soon as all the numbers are in!");
            }
            else if(currentlyHacking)
            {
                $("#message-header").html("<img src=\"images/blue-message-text.png\" class=\"message-icon\"/>HACKING COMPETITORS' STRATEGIES");
                $("#message-content").html("This report could take several minutes but it's worth the wait! Periodically refresh this page or give us a sec and we'll let you know as soon as it completes!");
            }
            $("#check-project-done-flag").val(1);
        }
        else
        {
            keywordNetWorthString = "<sup>"+currencyHexCode+"</sup>"+numberWithCommas(keywordNetWorth)+"<div style=\"text-align:right;float:right;clear:both;display:inline-block;color:#fff;font-size:12px;font-weight:bold;margin-top:3px;\">/mo</div>";
        }


    /*$('#currency-code-1').html(currencyHexCode);
    $('#currency-code-2').html(currencyHexCode);
    $('#currency-code-3').html(currencyHexCode);*/

    if(useGoogle == 1 && useBing != 1)
        {
            $("#mission-search-engines-1").html("<label>Projections for:</label> google");
        }
        else if(useGoogle != 1 && useBing == 1)
        {
            $("#mission-search-engines-1").html("<label>Projections for:</label> yahoo/bing");
        }
        else
        {
            $("#mission-search-engines-1").html("<label>Projections for:</label> google, yahoo/bing");
        }

    if(typeof searchVolume === 'undefined') {searchVolume = 0;}
    if(typeof incomingTraffic === 'undefined') {incomingTraffic = 0;}
    if(typeof payingCustomers === 'undefined') {payingCustomers = 0;}
    if(typeof monthlyVisitors === 'undefined') {monthlyVisitors = 0.0000001;}
    if(typeof monthlySales === 'undefined') {monthlySales = 0;}
    if(typeof costPerMonth === 'undefined' || keywordCount == 0) {costPerMonth = 0;}

    var cartSrc = "images/cart-static.png";
    var cartOnclick = "addToCart(event,'-1');";
    if(projectOrdered)
    {
        cartSrc = "images/cart-inactive.png";
        cartOnclick = "javascript:void(0);";
    }

    var monthlyCustomersText = "MONTHLY CUSTOMERS";
    var monthlySalesText = "MONTHLY SALES";
    if(eCommerce != 1)
    {
        monthlyCustomersText = "MONTHLY LEADS";
        monthlySalesText = "POTENTIAL SALES";
    }

    $("#mission-location-1").html("<label>Location:</label> "+geoLocation);
    $("#mission-title-1").html(clientURL);
    $("#mission-title-2").html(clientURL+"<strong class=\"position-relative\" onclick=\"gotoCreateProject('"+projectID+"');\"><i class=\"edit-icon\" title=\"Edit mission\"></i></strong>");

    $("#keyword-count-1").html(keywordCount+" active <span>KEYWORD PHRASES</span>");
    $("#mission-search-volume").html(numberWithCommas(searchVolume)+" <span class=\"info-icon-2\" title=\"The monthly average searches for each keyword\">MO. SEARCH VOLUME</span>");
    $("#mission-monthly-visitors").html(numberWithCommas(incomingTraffic)+"<span>MONTHLY VISITORS</span><span class=\"blue-text\">PROJECTED </span>");
    $("#mission-monthly-customers").html(numberWithCommas(Math.round(incomingTraffic * customerConversionRate,0))+"<span>"+monthlyCustomersText+"</span><span class=\"blue-text\">PROJECTED </span>");
    $("#mission-monthly-sales").html("<sup>"+currencyHexCode+"</sup>"+numberWithCommas(monthlySales)+"<span>"+monthlySalesText+"</span><span class=\"blue-text\">PROJECTED </span>");
    $("#mission-content-goal").html("<sup>"+currencyHexCode+"</sup>"+numberWithCommas(costPerMonth)+" <small>("+projectTotalContentDiff+" pcs)</small><div id=\"mission-cart-div\" onclick=\"event.cancelBubble; event.stopPropagation();\" class=\"mission-cart-div\"><img src=\""+cartSrc+"\" id=\"project-add-to-cart\" style=\"height:18px;\" class=\"mission-cart-icon\" onclick=\""+cartOnclick+"\"></div><span class=\"info-icon-2\" title=\"Target amount of monthly content and its cost\">CONTENT COST & GOAL</span>");
    $("#mission-networth").html("<strong class=\""+netWorthClass+"\">"+keywordNetWorthString+"</strong><span class=\"info-icon-2\" title=\"Projected return on your invested marketing dollars for this keyword\">KEYWORD NET WORTH<sup style=\"font-size:6px;\">TM</sup></span>");
    

    //Fill in the keyword data here
        var i = keywordCounter;
        var thisEntry = keywordInfo[keywordCounter];
        var thisCompetitorArray = thisEntry.competitorData;

        //var keywordID = thisEntry.keywordID;
        var searchVolume = thisEntry.searchVolume;
            var clientRanking = thisEntry.clientRanking;
            var keywordActive = thisEntry.active;
            //var avgCTR = Math.round(thisEntry.avgCTR);
            //var avgCTRExact = Math.round(thisEntry.avgCTRExact);
            var keywordHidden = thisEntry.hidden;
            var clientPowerLevel = thisEntry.clientKeywordPowerLevel;
            var errorExists = thisEntry.errorFlag;

            //var competitorsAverageMonthlyContent = thisEntry.competitorsAverageMonthlyContent;
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
            //var avgRank = thisEntry.avgRank;
            var totalPowerLevel = thisEntry.totalPowerLevel;     //Add back the client power level to the total power level for this keyword
            var keyword = thisEntry.keyword;

            var monthlyVisitors = thisEntry.monthlyVisitors;
            var monthlyCustomers = thisEntry.monthlyCustomers;
            var monthlySales = thisEntry.monthlySales;
            var costPerMonth = thisEntry.costPerMonth;
            var keywordNetWorth = thisEntry.keywordNetWorth;
            var keywordStatus = thisEntry.status;
            var numCartEntries = thisEntry.numCartEntries;
            
            var keywordCartDisplay = "block";
            var cartSrc = "images/cart-static.png";
            var cartOnclick = "addToCart(event,'"+keywordID+"');";
            if(numCartEntries>0)
            {
                cartSrc = "images/cart-inactive.png";
                cartOnclick = "javascript:void(0);";
                keywordCartDisplay = "none";
            }
            
            var keywordTotalContentDiffHTML = "";
            var topKWNetworth = "";
            var topHackContentHTML = "";
            var shadedString = "";
            var errorTriangleHTML = "";
        
            if(errorExists == 1)
            //if(true)
            {
                errorTriangleHTML = "<a data-toggle=\"tooltip\" onclick=\"rerunKeyword('"+keywordID+"');\" class=\"tooltip-hover\" title=\"\" data-original-title=\"It looks like there was an issue running this keyword. Please click the triangle icon to try re-running the phrase.\"><img src=\"images/red-warning-icon.png\" class=\"restart-icon\"></a>";
            }

            if(keywordStatus == "hacked")
            {
                topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
                topHackContentHTML = "<span style=\"font-size:12px;color:#808080;cursor:pointer;\" onclick=\"togglePanel('"+keywordID+"');\">"+currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)</span>";
                if(keywordTotalContentDiff >= 0)
                {
                    keywordTotalContentDiffHTML = "+" + keywordTotalContentDiff;
                }
                else
                {
                    keywordTotalContentDiffHTML = keywordTotalContentDiff;
                }
                keywordCartDisplay = "block";
            }
            else if(keywordStatus == "hacking")
            {
                topHackContentHTML = "";
                topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
                keywordTotalContentDiffHTML = "?";
                keywordCartDisplay = "none";
            }
            else if(keywordStatus == "adding")
            {
                topHackContentHTML = "$0 (0 pcs)";
                topKWNetworth = "";
                keywordTotalContentDiffHTML = "?";
                keywordCartDisplay = "none";
            }
            else
            {
                //It's just been added, not yet hacked
                shadedString = " disabled";                
                topKWNetworth = currencyHexCode+numberWithCommas(keywordNetWorth);
                if(keywordActive == 1)
                {
                    topHackContentHTML = "<span class=\"reveal-mark-small\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\"> REVEAL </span>";
                    keywordCartDisplay = "none";
                }
                else
                {
                    //topHackContentHTML = "<span class=\"reveal-mark-small\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\"> REVEAL </span>";
                    topHackContentHTML = currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)";
                }
                keywordTotalContentDiffHTML = "?";
            }

            if(keywordActive != 1)
            {
                keywordCartDisplay = "none !important";
            }
            
            var keywordCartDisplay2 = keywordCartDisplay;
            if(numCartEntries > 0)
            {
                keywordCartDisplay2 = "none !important";
            }

            var keywordCheckboxStatus = "";
            var rowBGText = "";
            var checkboxBGClass = "";
            var anchorCursorStyle = "";
            var keywordToggle = "";
            var progressBarDisplay = "none";
            var projectInfoDisplay = "table-row";
            if(keywordActive == 1 && (keywordStatus == "hacked" || keywordStatus == "added"))
            {
                keywordCheckboxStatus = "checked";
                rowBGText = "style=\"opacity:1.0;cursor:pointer;\"";
                checkboxBGClass = "";
                anchorCursorStyle = "";
                keywordToggle = " onclick=\"togglePanel('"+keywordID+"');\"";
                projectInfoDisplay = "table-row";
            }
            else if(keywordActive == 1 && (keywordStatus == "hacking" || keywordStatus == "adding"))
            {
                keywordCheckboxStatus = "checked";
                rowBGText = "style=\"opacity:1.0;\"";
                checkboxBGClass = "";
                anchorCursorStyle = "";
                keywordToggle = "";
                progressBarDisplay = "table-row";
                projectInfoDisplay = "table-row";
            }
            else
            {
                rowBGText = "style=\"opacity:0.33;\"";
                checkboxBGClass = " opaque";
                anchorCursorStyle = "style=\"cursor:default;\"";
                keywordToggle = " onclick=\"togglePanel('"+keywordID+"');\"";
                progressBarDisplay = "none";
                projectInfoDisplay = "none";
            }

            if(keywordHidden == 1)
            {
                rowBGText = "style=\"display:none;\"";
            }
        
        //Update the summary info based on ids
        $("#kw-"+keywordID+"-content-goal").html(topHackContentHTML+"<div class=\"mission-cart-div\"><img src=\""+cartSrc+"\" style=\"display:"+keywordCartDisplay+";\" id=\"cart-icon-"+keywordID+"\" class=\"mission-cart-icon\" onclick=\""+cartOnclick+"\"></div>");
        
        /*var summaryRowHTML = "<td class=\"checkbox-ot\"><input class=\"\" id=\"chk-content-all-kw"+keywordID+"\" type=\"checkbox\" "+keywordCheckboxStatus+"  onchange=\"toggleKeyword('"+keywordID+"',this.checked);\"></td>\n" +
"                                        <td class=\"project-name-ot\" "+keywordToggle+"><a class=\"\">"+keyword+"</a>"+errorTriangleHTML+"</td>\n" +
"                                        <td data-label=\"MO. SEARCH VOLUME\" class=\"price-widthbox\" "+keywordToggle+">"+numberWithCommas(searchVolume)+"</td>\n" +
"                                        <td data-label=\"MONTHLY VISITORS PROJECTED\" class=\"price-widthbox\" "+keywordToggle+">"+numberWithCommas(monthlyVisitors)+"</td>\n" +
"                                        <td data-label=\"MONTHLY CUSTOMERS PROJECTED \" class=\"price-widthbox\" "+keywordToggle+">"+numberWithCommas(monthlyCustomers)+"</td>\n" +
"                                        <td data-label=\"MONTHLY SALES PROJECTED\" class=\"price-widthbox\" "+keywordToggle+"><div class=\"negative-sign\">"+currencyHexCode+numberWithCommas(monthlySales)+"</div></td>\n" +
"                                        <td data-label=\"CONTENT GOAL & COST\" class=\"price-widthbox\"><div class=\"equal-sign\" style=\"cursor:default;\">"+topHackContentHTML+"</div></td>\n" +
"                                        <td data-label=\"KEYWORD NET WORTH\" class=\"price-widthbox\" "+keywordToggle+">"+topKWNetworth+"</td>\n" +
"                                        <td class=\"delect-row\"><a href=\"#\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\" onclick=\"displayKeywordDeleteWindow('"+keywordID+"');\"></i></a></td> \n";
        $("#kw-summary-row-"+keywordID).html(summaryRowHTML);
        $("#progress-row-"+keywordID).css("display",progressBarDisplay);*/
        
        var revealButtonDisplay = "block";
        if(keywordStatus == "hacked")
        {
            revealButtonDisplay = "none";
        }
        
        var collapseHTML = "";
        if($("#kw-competitors-panel-"+keywordID).hasClass("in"))
        {
            collapseHTML = "in";
        }
        
        var missionDataHTML = "<td colspan=\"9\" style=\"border-right: none !important;\">\n" +
"                                            <div id=\"kw-competitors-panel-"+keywordID+"\" class=\"panel-collapse collapse "+collapseHTML+"\">\n" +
"                                                <div class=\"row\">\n" +
"                                                    <div class=\"col-sm-7 content-goal-info\">\n" +
"                                                        <h2 class=\"title\">SELECT BELOW TO MODIFY YOUR <span>KEYWORD NETWORTH</span> AND <span>CONTENT GOAL</span></h2>\n" +
"                                                       <div class=\"table-outer\">\n" +
"                                                       <span class=\"reveal-mark\" style=\"display:"+revealButtonDisplay+";\" onclick=\"getKeywordCompetitorsAhrefs('"+i+"');\"> REVEAL </span>\n" +
"                                                        <table class=\"content-goal-table sortable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n" +
"                                                            <thead>\n" +
"                                                                <tr class=\"table-heading2\">\n" +
"                                                                    <th class=\"col-sm-1\"></th>\n" +
"                                                                    <th class=\"col-sm-1 text-center\"><span>Rank<br/>&nbsp;</span></th>\n" +
"                                                                    <th class=\"col-sm-7 text-left\"><span>URL<br/>&nbsp;</th>\n" +
"                                                                    <th class=\"col-sm-1 text-center\"><span class=\"info-icon-3\" title=\"Click Through Rate for the ranking position and current keyword\">CTR<br/>&nbsp;</span></th>\n" +
"                                                                    <th class=\"col-sm-1 text-center\"><span class=\"info-icon-3\" title=\"The total number of backlinks this competitor has\">Total Backlinks</span></th>\n" +
"                                                                    <th class=\"col-sm-1 text-center\"><span class=\"info-icon-3\" title=\"The amount of off-site content produced each month with this keyword phrase as the topic\">Monthly Content</span></th>\n" +"                                                                </tr>\n"+
"                                                            </thead>\n"+
"                                                            <tbody>\n";

                            //Populate for each competitor
                            var competitorsCount = 0;
                            var totalCTR = 0;
                            //var totalPowerLevel = 0;
                            var totalRank = 0;
                            var totalBacklinks = 0;

                            var disabled = false;

                            var unhackedCompetitorExists = false;
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
                                    var competitorURLShort = competitorURL.substring(0,60);
                                    if(competitorURL.length > 60) { competitorURLShort += "..."; }

                                if(competitorAhrefsStarted == 0 && competitorActive == 1)
                                {
                                    unhackedCompetitorExists = true;
                                }

                                var competitorCTR = Math.round(thisCompetitor.traffic);
                                var competitorCTRExact = Math.round(thisCompetitor.trafficExact);

                                var competitorPowerLevel = thisCompetitor.competitorMonthlyContent;
                                var competitorMonthlyBacklinks = thisCompetitor.competitorMonthlyBacklinks;
                                var competitorTotalBacklinks = thisCompetitor.competitorTotalBacklinks;
                                var competitorContentCountHTML = "";
                                var competitorMonthlyBacklinksHTML = "";
                                if(competitorPowerLevel < 0 && keywordStatus == "hacking" && competitorActive == 1)
                                {
                                    competitorContentCountHTML = "0";
                                }
                                else if(competitorPowerLevel < 0)
                                {
                                    competitorContentCountHTML = "";
                                }
                                else
                                {
                                    competitorContentCountHTML = competitorPowerLevel;
                                }

                                if(competitorAhrefsCompleted == 0 && keywordStatus == "hacking" && competitorActive == 1)
                                {
                                    competitorMonthlyBacklinksHTML = "";
                                }
                                else if(competitorMonthlyBacklinks < 0 || competitorAhrefsStarted == 0)
                                {
                                    competitorContentCountHTML = "";
                                }
                                else
                                {
                                    competitorMonthlyBacklinksHTML = numberWithCommas(parseInt(competitorTotalBacklinks));
                                }

                                var competitorCheckboxStatus = "";
                                var seoInsuranceHTML = "";
                                if(competitorActive == 1 && !disabled)
                                {
                                    competitorCheckboxStatus = "checked";
                                    competitorsCount++;
                                    totalCTR += competitorCTR;
                                    totalPowerLevel += competitorPowerLevel;
                                    totalRank += competitorPositionRank;
                                    totalBacklinks += parseInt(competitorTotalBacklinks);
                                }

                                if(thisCompetitor.disabled == 1)
                                {
                                    competitorCheckboxStatus = " disabled";
                                    seoInsuranceHTML = "<span class=\"text-right\" style=\"vertical-align:middle;float:right;margin-right:-8px;padding-right:0;padding-top:10px;\"><a class=\"insurance-icon\" title=\"Coming soon! Buy insurance for your top 10 ranking!\"><img src=\"images/seo-insurance-icon.png\" style=\"position:absolute;right:0;top:-3px;width:27px;height:auto;\"></a></span>";
                                }
                                
                                missionDataHTML +=
"                                                                <tr class=\"project-head2\">\n" +
"                                                                    <td class=\"checkbox-ot\"><input class=\"magic-checkbox\" id=\"chk-content-all-c"+competitorID+"\" type=\"checkbox\" "+competitorCheckboxStatus+" onchange=\"toggleCompetitor('"+competitorID+"',this.checked,'"+i+"','"+keywordID+"');\"><label for=\"chk-content-all-c"+competitorID+"\"></label></td>\n" +
"                                                                    <td data-label=\"Rank\" class=\"text-center\">"+competitorPositionRank+"</td>\n" +
"                                                                    <td data-label=\"URL\" class=\"text-left\" title=\""+competitorURL+"\">"+competitorURLShort+"<a title=\"Copy full URL to clipboard\" id=\"copy-anchor-"+competitorID+"\" class=\"copy-button\" onmouseover=\"resetTitle('"+competitorID+"');\" onclick=\"showCopiedConfirmation('"+competitorID+"');\" data-clipboard-action=\"copy\" data-clipboard-text=\""+competitorURL+"\"><i class=\"fa fa-copy fa-blue\" id=\"copy-icon-"+competitorID+"\" style=\"padding-left:5px;cursor:pointer;\"></i></a></td>\n" +
"                                                                    <td data-label=\"CTR\" class=\"text-center\">"+competitorCTR+"%</td>\n" +
"                                                                    <td data-label=\"Monthly Backlinks\" class=\"text-center"+shadedString+"\" id=\"kwid-"+keywordID+"-competitorid-"+competitorID+"-backlinks\">"+competitorMonthlyBacklinksHTML+"</td>\n" +
"                                                                    <td data-label=\"Monthly Content\" class=\"text-center"+shadedString+"\" id=\"kwid-"+keywordID+"-competitorid-"+competitorID+"-content\">"+competitorContentCountHTML+seoInsuranceHTML+"</td>\n" +
"                                                                </tr>\n";
                            }
                            
                            if(competitorsCount == 0) { competitorsCount = 1;}
                            
                            //Hidden element to keep track of how many competitors you've selected
                            missionDataHTML += "<input id=\"kwid-"+keywordID+"-competitorsCount\" type=\"hidden\" value=\""+competitorsCount+"\">\n";

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

                                missionDataHTML +=
"                                                            </tbody>\n" +
"                                                            <tfoot>\n" +
"                                                                <tr class=\"project-head2 them-row\">\n" +
"                                                                    <td class=\"checkbox-ot\"><strong>THEM</strong></td>\n" +
"                                                                    <td data-label=\"Rank\" class=\"text-center\" id=\"kwid-"+keywordID+"-avg-rank\">"+Math.round(totalRank/competitorsCount)+"</td>\n" +
"                                                                    <td data-label=\"URL\" class=\"text-left\"><strong>SELECTED COMPETITORS</strong></td>\n" +
"                                                                    <td data-label=\"CTR\" class=\"text-center\" id=\"kwid-"+keywordID+"-avg-ctr\">"+Math.round(totalCTR/competitorsCount)+"%</td>\n" +
"                                                                    <td data-label=\"Monthly Backlinks\" class=\"text-center negative-sign-2\" id=\"kwid-"+keywordID+"-table-total-backlinks\">"+numberWithCommas(competitorAvgBacklinks)+"</td>\n" +
"                                                                    <td data-label=\"Monthly Content\" style=\"font-size:20px;text-align:center;\" id=\"kwid-"+keywordID+"-table-total-pl\">"+competitorAvgCount+"<span style=\"font-size:12px;position:absolute !important;right:2px;margin-top:10px;color:#8a8b8f;\">avg</span></td>\n" +
"                                                                </tr>\n" +
"                                                                <tr class=\"project-head2 you-row\">\n" +
"                                                                    <td class=\"checkbox-ot\"><strong>YOU</strong></td>\n" +
"                                                                    <td class=\"text-center\">"+clientRanking+"</td>\n" +
"                                                                    <td data-label=\"URL\" class=\"text-left\">"+clientURL+"</td>\n" +
"                                                                    <td data-label=\"CTR\" class=\"text-center\">"+clientCTR+"%</td>\n" +
"                                                                    <td data-label=\"Monthly Backlinks\" class=\"text-center equal-sign-2\" id=\"kwid-"+keywordID+"-user-monthly-backlinks-count\">"+userMonthlyBacklinks+"</td>\n" +
"                                                                    <td data-label=\"Monthly Content\" style=\"font-size:20px;text-align:center;\" id=\"kwid-"+keywordID+"-user-monthly-content-count\"><input type=\"number\" class=\"transparent-text-input-2\" onchange=\"changeUserMonthlyContent('"+keywordID+"','"+i+"');\" id=\"kwid-"+keywordID+"-your-pl\" value=\""+userMonthlyContent+"\"><span style=\"font-size:12px;position:absolute !important;right:2px;margin-top:4px;\"><i class=\"info-icon\" title=\"Click the number to change your monthly content count\"></i></span></td>\n" +
"                                                                </tr>\n" +
"                                                                <tr class=\"project-head2 result-row\">\n" +
"                                                                    <td colspan=\"5\" class=\"text-right\">YOUR MONTHLY CONTENT GOAL</td>\n" +
"                                                                    <td colspan=\"2\" style=\"text-align:center;\">"+keywordTotalContentDiffHTML+"<span style=\"font-size:12px;position:absolute !important;right:2px;margin-top:2px;\"><img src=\"images/cart-dropshadow.png\" class=\"keyword-cart\" style=\"display:"+keywordCartDisplay2+";\" onclick=\"addToCart(event,'"+keywordID+"');\"></span></td>\n" +
"                                                                </tr>\n" +
"                                                            </tfoot>\n" +
"                                                        </table>\n" +
"							 </div>\n" +
"\n" +
"                                        <p class=\"tip-note\"> The competitors you select will greatly affect your monthly content goal, budget and keyword networth.</p>\n" +
"                                        </div>\n" +
"\n" +
"                                        <div class=\"col-sm-5 right-side-goalinfo\">\n" +
"                                            <div class=\"info-block\" style=\"margin-top:40px;\">\n" +
"                                                <h3>DO THIS FIRST <i class=\"checked-icon\"> </i></h3>\n" +
"                                                <p>Select competitors with high rankings and high CTR (click through rate)</p>\n" +
"                                            </div>\n" +
"                                            <div class=\"info-block\">\n" +
"                                                <h3>NEXT DO THIS <i class=\"revealsmall-icon\"> </i></h3>\n" +
"                                                <p>Reveal the monthly content strategies of your selected competitors</p>\n" +
"                                            </div>\n" +
"                                            <div class=\"info-block\">\n" +
"                                                <h3>REVIEW AND TAKE ACTION <img src=\"images/cart-static.png\" style=\"height:18px;margin-top:-3px;margin-left:30px;\"><!--<i class=\"blueproject-eagle-icon\"> </i>--></h3>\n" +
"                                                <p>View your monthly content goal—this is how much content you will need to create and publish each month to match your competition.</p>\n" +
"                                            </div>\n" +
"\n" +
"                                            <div class=\"info-block calculator-lt\">\n" +
"                                                <p class=\"calculator-logo\"><strong>WHAT’S A GOOD MONTHLY KEYWORD NETWORTH / ROI?</strong>\n" +
"                                                    <br>Start by defining your monthly sales goal using our <a href=\"salesgoalcalculator.html\" target=\"_blank\">calculator</a>.</p>\n" +
"                                            </div>\n" +
"\n" +
"                                        </div>\n" +
"\n" +
"                                        </div>\n" +
"                                        </div>\n" +
"                                        </td>";

                $("#project-info-"+keywordID).html(missionDataHTML);
                $("#project-info-"+keywordID).css("display",projectInfoDisplay);
    
    $('body').removeClass('wait');
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
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

function flashCart()
{
    $("#cart-image").fadeOut(0,function(){
        $("#cart-image").attr("src","images/header-cart-hover.png").fadeIn(0,function(){
            $("#cart-image").addClass("shadow-filter");
            $("#cart-image").fadeOut(750,function(){
                $("#cart-image").removeClass("shadow-filter");
                $("#cart-image").attr("src","images/header-cart-static.png").fadeIn(750,function(){
                    
                });
            });
        });
    });
}

function setHeadingBG(color)
{
    $("#mission-heading-keyword").css("background-color",color);
    $("#mission-heading-search-volume").css("background-color",color);
    $("#mission-heading-monthly-visitors").css("background-color",color);
    $("#mission-heading-monthly-customers").css("background-color",color);
    $("#mission-heading-monthly-sales").css("background-color",color);
    $("#mission-heading-cost-per-month").css("background-color",color);
    $("#mission-heading-keyword-networth").css("background-color",color);
}

function prepareNewWizard()
{
    var projectID = getURLParameter("pid");
        var projectIDValue = parseInt(projectID);
    var username = getCookie("username");
    var userFullName = getCookie("userFullName");
    var userLastName = userFullName.substring(userFullName.indexOf(" ")+1,userFullName.length);
    //Show the manageIndustries link for admin
    /*if(username !== 'admin@fairmarketing.com' && username !== 'hari.patel@1520holdings.com' && $('#industry-link').length)
    {
        $('#industry-link').remove();
        $('#users-link').remove();
    }
    
    refreshCartDropdown();
    
    //Set the welcome message
    $('#welcome-message').html("welcome <strong>AGENT "+userLastName.toUpperCase()+"</strong> <strong>[</strong> activate your mission below <strong>]</strong>");
    */
    
    if(projectID !== "0" && projectID !== "")
    {
        /*$("#breadcrumbs-li").html("<a href=\"dashboard.html\">Missions</a> &nbsp; <i class=\"fa fa-angle-right\"></i> &nbsp; <a href=\"missionreport.html?pid="+projectID+";\">Mission Report</a> &nbsp; <i class=\"fa fa-angle-right\"></i> &nbsp; <a style=\"cursor:default;\">Project Wizard</a>")
        $("#header-text").html("[   Update Mission Details  ]")
        $("#keyword-section").hide();*/
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

function toggleTab(name)
{
    if(name == "basic")
    {
        //Hide advanced options and update the li active class
        $("#advanced-options").hide();
        $("#advanced-tab").removeClass("active");
        $("#basic-tab").addClass("active");
    }
    else
    {
        //Show advanced options and update the li active class
        $("#advanced-options").show();
        $("#basic-tab").removeClass("active");
        $("#advanced-tab").addClass("active");
        
    }
}

function restoreKeywordHackerProject(projectID)
{
    //Show the spinner
    //$("#delete-project-response").html("<div><img src='images/apple_spinner.gif' class='apple-spinner-small'/></div>");
    $('body').addClass('wait');
    
    //Get the new values to update with
    if(projectID != '')
    {
        //Make the AJAX call
        $.ajax({url: restURL, data: {'command':'restoreKHProject','projectid':projectID}, type: 'post', async: true, success: function postResponse(returnData){
                var info = JSON.parse(returnData);

                if(info.status == "success")
                {
                    //On success, hide the window
                    //$("#delete-project-response").html("");
                    hideDeleteProject();
                    $('body').removeClass('wait');
                    $("#project-card-"+projectID).hide(400);
                    //loadProjectDashboard(false);
                }
            }
        });
    }
}

function restoreWizardFields()
{
    $("#website-url-input").html("<span class=\"required\">*</span><input id=\"project-url\" type=\"text\" placeholder=\"Website URL\" class=\"side-wizard-input\" style=\"width:225px;\"/>");
    $("#scrollable-dropdown-menu").html("<div style=\"clear:both;display:inline-block;\"><span class=\"required\">*</span><input type=\"text\" placeholder=\"Business Location\" onblur=\"validateSelection();\" id=\"project-location\" class=\"typeahead side-wizard-input\"/></div>");
    $("#phrase-input").show();
    $("#line-spacer").show();
    $("#metro-option").show();
}