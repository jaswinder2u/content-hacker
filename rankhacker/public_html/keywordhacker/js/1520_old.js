/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
        var projectOrdered = projectInfo.projectOrdered;
        
        var projectTotalContentDiff = Math.max(0,projectInfo.projectTotalContentDiff);
        
        var customerConversionRate = projectInfo.defaultConversionRate;
        if(monthlyVisitors != 0 && payingCustomers != 0 && useDefaultConversionRate != 1)
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
        
        var cartOpacity = "1.0";
        var cartOnclick = "addToCart('-1');";
        if(projectOrdered)
        {
            cartOpacity = "0.25";
            cartOnclick = "javascript:void(0);";
        }
        var newClick = new Function(cartOnclick);
        $("#project-add-to-cart").attr("onclick","").click(newClick);
        $("#project-add-to-cart").css("opacity",cartOpacity);
        

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
        var numCartEntries = thisEntry.numCartEntries;
        var cartOpacity = "1.0";
        var cartOnclick = "addToCart('"+keywordID+"');";
        if(numCartEntries>0)
        {
            cartOpacity = "0.25";
            cartOnclick = "javascript:void(0);";
        }
        
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
            topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)<img src=\"images/add-to-cart-icon.png\" id=\"cart-icon-"+keywordID+"\" style=\"margin-left:10px;margin-top:-5px;height:20px;width:auto;cursor:pointer;opacity:"+cartOpacity+";\" onclick=\""+cartOnclick+"\"></span>";
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
                seoInsuranceHTML = "<span class=\"text-right\" style=\"vertical-align:middle;float:right;padding-right:5px;padding-top:10px;\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"\" data-original-title=\"Coming soon! Buy insurance for your top 10 ranking!\"><img src=\"images/seo-insurance-icon.png\" style=\"width:18px;height:auto;\"></a></span>";
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
        var projectOrdered = projectInfo.projectOrdered;
        
        var projectTotalContentDiff = projectInfo.projectTotalContentDiff;
        
        var customerConversionRate = projectInfo.defaultConversionRate;
        if(monthlyVisitors != 0 && payingCustomers != 0 && useDefaultConversionRate != 1)
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
        var numCartEntries = thisEntry.numCartEntries;
        var cartOpacity = "1.0";
        var cartOnclick = "addToCart('"+keywordID+"');";
        if(numCartEntries>0)
        {
            cartOpacity = "0.25";
            cartOnclick = "javascript:void(0);";
        }
        
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
            topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)<img src=\"images/add-to-cart-icon.png\" id=\"cart-icon-"+keywordID+"\" style=\"margin-left:10px;margin-top:-5px;height:20px;width:auto;cursor:pointer;;opacity:"+cartOpacity+"\" onclick=\""+cartOnclick+"\"></span>";
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
                seoInsuranceHTML = "<span class=\"text-right\" style=\"vertical-align:middle;float:right;padding-right:5px;padding-top:10px;\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"\" data-original-title=\"Coming soon! Buy insurance for your top 10 ranking!\"><img src=\"images/seo-insurance-icon.png\" style=\"width:18px;height:auto;\"></a></span>";
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
        var projectOrdered = projectInfo.projectOrdered;
        
        var projectTotalContentDiff = projectInfo.projectTotalContentDiff;
        
        var customerConversionRate = projectInfo.defaultConversionRate;
        if(monthlyVisitors != 0 && payingCustomers != 0 && useDefaultConversionRate != 1)
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
                seoInsuranceHTML = "<span class=\"text-right\" style=\"vertical-align:middle;float:right;padding-right:5px;padding-top:10px;\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"\" data-original-title=\"Coming soon! Buy insurance for your top 10 ranking!\"><img src=\"images/seo-insurance-icon.png\" style=\"width:18px;height:auto;\"></a></span>";
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
        var numCartEntries = thisEntry.numCartEntries;
        var cartOpacity = "1.0";
        var cartOnclick = "addToCart('"+keywordID+"');";
        if(numCartEntries>0)
        {
            cartOpacity = "0.25";
            cartOnclick = "javascript:void(0);";
        }
        
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
            topHackContentHTML = "<span style=\"font-size:12px;color:#808080;\">"+currencyHexCode+numberWithCommas(costPerMonth)+" ("+keywordTotalContentDiff+" pcs)<img src=\"images/add-to-cart-icon.png\" id=\"cart-icon-"+keywordID+"\" style=\"margin-left:10px;margin-top:-5px;height:20px;width:auto;cursor:pointer;opacity:"+cartOpacity+";\" onclick=\""+cartOnclick+"\"></span>";
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
                seoInsuranceHTML = "<span class=\"text-right\" style=\"vertical-align:middle;float:right;padding-right:5px;padding-top:10px;\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"\" data-original-title=\"Coming soon! Buy insurance for your top 10 ranking!\"><img src=\"images/seo-insurance-icon.png\" style=\"width:18px;height:auto;\"></a></span>";
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


function gotoRHStorefront(projectURL)
{
    var username = getCookie("username");
    var fullname = getCookie("userFullName");
    var destination = "dashboard";
    projectURL = encodeURIComponent(projectURL);
    window.location = rhURL+"auto_auth.html?username="+username+"&fullname="+fullname+"&projecturl="+projectURL+"&destination="+destination;
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
                seoInsuranceHTML = "<span class=\"text-right\" style=\"vertical-align:middle;float:right;padding-right:5px;padding-top:10px;\"><a data-toggle=\"tooltip\" class=\"tooltip-hover\" title=\"\" data-original-title=\"Coming soon! Buy insurance for your top 10 ranking!\"><img src=\"images/seo-insurance-icon.png\" style=\"width:18px;height:auto;\"></a></span>";
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