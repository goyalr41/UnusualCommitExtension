/*jQuery(function($){
  $("a.sha.btn.btn-outline").each(function(){
	var value = $(this).html();
	console.log(value.trim());
	$(this).css('background-color','#fcc');
	sendAjax(value);
  });
});*/

//$(function () { $("[data-toggle='tooltip']").tooltip(); });

//chrome.runtime.onMessage.addListener(
  /*function(request, sender, sendResponse) {
  callit(request.url);
    if (request.greeting == "hello")
      sendResponse({Received: "Recieved URL"});
  }*/
//);

var port1;

chrome.runtime.onConnect.addListener(function(port) {
	console.assert(port.name == "unusualport");
	port.onMessage.addListener(function(msg) {
		port1 = port;
		callit(msg.url);
	 });
});
	
function callit(url) {
	//console.log(url);
	var commitids = [];
	var username = url.split("/")[3];
	var reponame = url.split("/")[4];
	//console.log(username);
	//console.log(reponame);
	
	jQuery(function($){
		
		if ($(".statsbutton")[0]){
			//do nothing
		} else {
			var orgheight = $(".commits-listing.commits-listing-padded.js-navigation-container.js-active-navigation-container").height();
			//console.log(orgheight);
			$(".commits-listing.commits-listing-padded.js-navigation-container.js-active-navigation-container").css("height",orgheight+150);
			
			$(".commit-links-group.btn-group").each(function(){
				var value = $(this).html();
				//console.log(value);
				//$(this).append("<button aria-label='Copy the full SHA' class='js-zeroclipboard btn btn-outline zeroclipboard-button tooltipped tooltipped-s' data-clipboard-text='16487ac105e280cf05e3233adb28c096e02001b8' data-copied-hint='Copied!' data-copy-hint='Copy the full SHA' type='button'><span class='octicon octicon-graph'></span></button>");
				//$(this).append("<button aria-label='Statistics' class='btn btn-outline tooltipped tooltipped-s statsbutton' rel='nofollow'><span class='octicon octicon-graph'></span></button>");
				$(this).append("<a href='javascript:void(0)' aria-label='Statistics' class='btn btn-outline tooltipped tooltipped-s statsbutton' rel='nofollow'><span class='octicon octicon-graph' type='button'></span></a>");
			});	
			
			$("a.sha.btn.btn-outline").each(function(){
				var value = $(this).html();
				//console.log(value.trim());
				commitids.push(value.trim());
			});
			
			sendAjaxPost(username, reponame, commitids);

		}
		
		var CommitIn = new Object();
		CommitIn.username = username;
		CommitIn.reponame = reponame;
		CommitIn.commitids = commitids;
		
		var interval = null;
		    
		var ajax_call = function() {
			$.ajax({
		        url: "https://localhost:8443/UnusualGitCommit/unusualcommitstatus",
		        type: 'POST',
		        dataType: 'json',
				crossDomain: true,
		        data: JSON.stringify(CommitIn),
		        contentType: 'application/json',
		        mimeType: 'application/json',
		 
		        success: function (data) {
		        	//console.log(data);
					port1.postMessage(data);
		        	if(data.status.indexOf("Completed") > -1) {
		        		clearInterval(interval);
		        	}
		        },
		        
		        error:function(data,status,er) {
		            alert("error: "+data+" status: "+status+" er:"+er);
		        }
		    });

		};
	 
		interval = setInterval(ajax_call, 500); // 0.5 sec
		
	});

}


var reason = new Object();
reason['totalloc'] = 'Many lines of code were changed -- much more than common in this repository. (/X lines of code changed; only /HH% of all commits are larger)';
reason['totallocauth'] ='Many lines of code were changed -- much more than common for changes by /A. (/X lines of code changed; only /HH% of all commits by /A are larger)';
reason['locadded'] = 'Many lines of code were added -- much more than common in this repository. (/X lines of code added; only /HH% of all commits are larger)';
reason['locaddedauth'] = 'Many lines of code were added -- much more than common for changes by /A. (/X lines of code added; only /HH% of all commits by /A are larger)';
reason['locremoved'] = 'Many lines of code were removed -- much more than common in this repository. (/X lines of code removed; only /HH% of all commits are larger)';
reason['locremovedauth'] = 'Many lines of code were removed -- much more than common for changes by /A. (/X lines of code removed; only /HH% of all commits by /A are larger)';   	
reason['totalfilechanged'] = 'Many files were changed -- many more than common in this repository. (/X files changed; only /HH% of all commits are larger)';
reason['totalfilechangedauth'] = 'Many files were changed -- many more than common for changes by /A. (/X files changed; only /HH% of all commits by /A are larger)';
reason['totalfileaddedauth'] = 'Many files were added -- many more than common for changes by /A. (/X files added; only /HH% of all commits by /A are larger)';
reason['totalfileremovedauth'] = 'Many files were removed -- many more than common for changes by /A. (/X files removed; only /HH% of all commits by /A are larger)';		
reason['commitmsg'] = 'The commit message is unusually long. (/X words, only /HH% of all commit messages are longer)';
reason['commitmsgauth'] = 'The commit message is unusually long. (/X words, only /HH% of all commit messages by /A are longer)';    	
reason['timeofcommitauth'] = 'Changes were commited at /X -- /A  rarely  commits around that time. (fewer than /HH% of all commits by /A are around that time)';    	
reason['filpercentchan'] = '/X files were changed -- such files are rarely changed in this repository. (fewer than /HH% of all file types changed)';
reason['filpercentchanauth'] ='/X files were changed -- such files are rarely changed by /A. (fewer than /HH% of all file types changed by /A)';
reason['filpercommit'] = '/X files were changed -- such files rarely occur in a commit in this repository. (in fewer than /HH% of all commits)';
reason['filpercommitauth'] = '/X files were changed -- such files rarely occur in a commit by /A. (in fewer than /HH% of all commits by /A)';   	
reason['combfrequency'] = '/X files were changed in the same commit -- this combination of files is rarely changed together. (in fewer than /HH% of all commits)';
reason['combfrequencyauth'] = '/X files were changed in the same commit -- this combination of files is rarely changed together by /A. (in fewer than /HH% of all commits by /A)';		
reason['combprobability'] = '/X files are rarely changed in this ratio. (only in /HH% of all commits)';
reason['combprobabilityauth'] = '/X files are rarely changed in this ratio by /A. (only in /HH% of commits by /A)';

var reasonnor = new Object();

reasonnor['totalloc'] = 'The number of changed lines of code is in the normal range for commits in this repository. (/X lines)'; 	
reasonnor['totallocauth'] = 'The number of changed lines of code is in the normal range for commits by /A in this repository. (/X lines)'; 	
reasonnor['locadded'] = 'The number of added lines of code is in the normal range for commits in this repository. (/X lines)'; 	
reasonnor['locaddedauth'] = 'The number of added lines of code is in the normal range for commits by /A in this repository. (/X lines)'; 	
reasonnor['locremoved'] = 'The number of removed lines of code is in the normal range for commits in this repository. (/X lines)'; 	
reasonnor['locremovedauth'] = 'The number of removed lines of code is in the normal range for commits by /A in this repository. (/X lines)'; 
reasonnor['totalfilechanged'] = 'The number of files changed is in the normal range for commits in this repository. (/X files)'; 	
reasonnor['totalfilechangedauth'] = 'The number of files changed is in the normal range for commits by /A in this repository. (/X files)'; 		
reasonnor['totalfileaddedauth'] = 'The number of files added is in the normal range for commits by /A in this repository. (/X files)'; 		
reasonnor['totalfileremovedauth'] = 'The number of files removed is in the normal range for commits by /A in this repository. (/X files)'; 		
reasonnor['locremoved'] = 'The number of removed lines of code is in the normal range for commits in this repository. (/X lines)'; 	
reasonnor['locremovedauth'] = 'The number of removed lines of code is in the normal range for commits by /A in this repository. (/X lines)'; 
reasonnor['commitmsg'] = 'The length of commit message is in the normal range for commits in this repository. (/X words)'; 	
reasonnor['commitmsgauth'] = 'The length of commit message is in the normal range for commits by /A in this repository. (/X words)'; 	
//reasonnor['timeofcommitauth'] = 'The length of commit message is in the normal range for commits in this repository. (/X words)'; 
reasonnor['filpercentchan'] = '/X files were changed -- such changes are very common in this repository.';
reasonnor['filpercentchanauth'] ='/X files were changed -- such changes are very common by /A in this repository.';
reasonnor['filpercommit'] = '/X files were changed -- such files very commonly occurs in a commit in this repository.';
reasonnor['filpercommitauth'] ='/X files were changed -- such files very commonly occurs in a commit by /A in this repository.';
reasonnor['combfrequency'] = '/X files were changed in the same commit -- this combination of files is very commonly changed together.';
reasonnor['combfrequencyauth'] = '/X files were changed in the same commit -- this combination of files is very commonly changed together by /A.';
//reason['combprobability'] = '/X files are rarely changed in this ratio. (only in /HH% of all commits)';
//reason['combprobabilityauth'] = '/X files are rarely changed in this ratio by /A. (only in /HH% of commits by /A)';*/


var unusualness = new Object();
unusualness['quitenormal'] = 'Do you agree this is a <font color="#330065">quite normal</font> commit?';
unusualness['normal'] = 'We rate this commit as <font color="green">normal</font>. What do you think?';
unusualness['average'] = 'Do you agree this is an <font color="#330065">average</font> commit?';
unusualness['lessunusual'] = 'Do you agree this is a <font color="#330065">less unusual</font> commit?';
unusualness['unusual'] = 'We rate this commit as <font color="#FF6600">unusual</font>. What do you think?';
unusualness['veryunusual'] = 'We rate this commit as <font color="darkred">very unsual</font>. What do you think?';

 var unusualnessdecision = new Object();
unusualnessdecision['normal'] = 'Normal';
unusualnessdecision['unusual'] = 'Unusual';
unusualnessdecision['veryunusual'] = 'Very Unsual';



function sendAjaxPost(username, reponame, commitids) {

	//console.log("call");

    // get inputs
    var CommitIn = new Object();
    CommitIn.username = username;
    CommitIn.reponame = reponame;
    CommitIn.commitids = commitids;
 
    $.ajax({
        url: "https://localhost:8443/UnusualGitCommit/unusualcommit",
        type: 'POST',
        dataType: 'json',
		crossDomain: true,
        data: JSON.stringify(CommitIn),
        contentType: 'application/json',
        mimeType: 'application/json',
 
        success: function (data) {
        	var i = 0;
        	$("a.sha.btn.btn-outline").each(function(){
    			var value = $(this).html();
    			//console.log(data[i].result);
    			//console.log(data[i].Reason);

    			if(data[i].result.indexOf("Merge") <= -1) {
    				$(this).addClass("notmerge");
    			}
    			//shading part
    		   	var value = $(this).html();
    		   	//console.log(value);
    		   	// add exception handling for '-' or null cases 
    		   	try{
    			   	var compare_value = parseFloat(data[i].Decisionval);
    			   	$(this).addClass("tooltipped tooltipped-s").attr("aria-label", "Anamoly Score: " + Math.round(data[i].Decisionval * 10000) / 10000);
    			    //console.log(compare_value);
    			   		$(this).heatcolor(
    						function() { return compare_value; },
    						{	lightness: 0,
    							colorStyle: 'greentored',
    							maxval: 1.0,
    							minval: 0.3,
    							reverseOrder: true
    						}
    					);
        				//$(this).css( "color", "black");
    		   		}
    		   		catch(err)
    		   		{
    		   			//do nothing
    		   		}
    			//$(this).addClass("tooltipped tooltipped-s tooltipped-multiline").attr("aria-label", data[i].Reason);
    			i = i+1;
    		});
        	
        	$("a.sha.btn.btn-outline.notmerge").css("color", "black");
        	
        	//$(".btn.btn-outline.tooltipped.tooltipped-s.statsbutton").attr("data-toggle" , "modal");
			//$(".btn.btn-outline.tooltipped.tooltipped-s.statsbutton").attr("data-target" , "#myModal");
			
			i = 0;
			$('head').append('<style>.tooltipped:after{text-align:left !important;}</style>');
			$('head').append('<style>.tooltipped:after{background:rgba(0,0,0,1) !important;}</style>');
			/*$('.tooltipped').hover(function(){
				$("this").css("text-align", "left");
				$("this").css("background", "rgba(0,0,0,1)");
			});*/
			
			
			$(".btn.btn-outline.tooltipped.tooltipped-s.statsbutton").each(function(){
    			//console.log(data[i].result);
    			//console.log(data[i].Reason);
    			//if(data[i].result == "Unusual") {
				
				
				if(data[i].Reason != "Merge/First Commit") {
    				$(this).attr("aria-label", 'Score: ' + unusualnessdecisionval(data[i].Decisionval)  +  ' (' + Math.round(data[i].Decisionval * 10000) / 10000 + ')\n' + getreason(data[i].reasonlist, username, data[i].Decisionval));
    				//$(this).attr("href", "https://localhost:8443/unusualenhanced/"+username+reponame+".html");
				}else {
					$(this).attr("aria-label", "It is a merge commit or initial commit");
				}
    			
    				
    			/*$(this).append("<div class='modal fade' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>"
      				     +  "</div>");*/
    			//}
    			//$(this).addClass("tooltipped tooltipped-s tooltipped-multiline").attr("aria-label", data[i].Reason);
    			i = i+1;
    		});
				
        },
        
        error:function(data,status,er) {
            alert("error: "+data+" status: "+status+" er:"+er);
        }
    });

}

function unusualnessdecisionval(decisionval){
	var decvalff = parseFloat(decisionval);
	if (decvalff < 0.9){
        return unusualnessdecision['normal'] ;
    }else if(decvalff >= 0.90 && decvalff < 0.95) {
     	return unusualnessdecision['unusual'];
    }else if(decvalff >= 0.95) {
     	return unusualnessdecision['veryunusual'];
    }
};

function getreason(datareason ,authorname, decisionval) {
	
	var thereasonis = "";
	var cnt = 0;
	$.each(datareason, function(i){
		if(cnt > 4) {
			return false;
		}
		//if(datareason[i].name == 'totalloc') {
			var temp;
			
			var H;
			var flag = 1;
			var theval = parseFloat(datareason[i].valorg);
			var thevalrnd = parseFloat(datareason[i].valorg).toPrecision(1);
			if(theval == 0.0) {
				H = 'never';
				 temp = reason[datareason[i].name];
			}else if(theval > 0.0 && theval <= 1.0) {
				H = 'almost never';
				 temp = reason[datareason[i].name];
			}else if(theval > 1.0 && theval <= 3.0) {
				H = 'very rarely';
				temp = reason[datareason[i].name];
			}else if(theval > 3.0 && theval <= 7.0) {
				H = 'rarely';
				temp = reason[datareason[i].name];
			}else if(theval > 7.0 && theval < 10.0) {
				H = 'less commonly';
				temp = reasonnor[datareason[i].name];
			}else {
				flag = 0;
				temp = reasonnor[datareason[i].name];
				H = 'very commonly';
			}
			
			if(datareason[i].name == 'timeofcommitauth') {
				if(datareason[i].value > 12) {
					temp = temp.replace('/X', datareason[i].value-12 + 'pm UTC');
				}else if(datareason[i].value < 12) {
					temp = temp.replace('/X', datareason[i].value + 'am UTC');
				}else {
					temp = temp.replace('/X', datareason[i].value + 'pm UTC');
				}
			}else {
				temp = temp.replace('/X', datareason[i].value);
			}
			
			if(flag == 1) {
				//temp = '&bull;&nbsp;' + temp;
				temp = temp.replace('/Y',H);
				temp = temp.replace('/A', authorname);
				temp = temp.replace('/A', authorname);
				temp = temp.replace('/HH',thevalrnd);
				if(cnt != 4) {
					thereasonis= thereasonis + temp + "\n";
				}else {
					thereasonis= thereasonis + temp;
				}
				cnt++;

			}
			
			if(flag == 0) {
				if(datareason[i].name != 'timeofcommitauth' && datareason[i].name != 'combprobabilityauth' && datareason[i].name != 'combprobability' ) {
				//temp = '&bull;&nbsp;' + temp;
				temp = temp.replace('/Y',H);
				temp = temp.replace('/A', authorname);
				temp = temp.replace('/A', authorname);
				/*var reg = /(\(.*?\))/gi;
				temp = temp.replace(reg,"");
				temp = temp.replace("or more","or less");
				temp = temp.substring(0, temp.length-2);
				temp = temp + " in this repository.";*/
				if(cnt != 4) {
					thereasonis= thereasonis + temp + "\n";
				}else {
					thereasonis= thereasonis + temp;
				}					cnt++;
				
				}

			}
			
		//}
	});
	if(thereasonis != "") {
		var decvalff = parseFloat(decisionval);
	if (decvalff < 0.9){
        	thereasonis = "Reason: Not enough high-valued outliers, lead to rate this commit as normal.\n\n"+thereasonis; 
    }else if(decvalff >= 0.90 && decvalff < 0.95) {
        	thereasonis = "Reason: Many high-valued outliers, lead to rate this commit as unusual.\n\n"+thereasonis; 
    }else if(decvalff >= 0.95) {
        	thereasonis = "Reason: Many high-valued outliers, lead to rate this commit as very unusual.\n\n"+thereasonis; 
    }
    
	}
	return thereasonis;
	
}



//var getStyleofbody = document.getElementsByClassName("sha btn btn-outline")[0].html();
//console.log(getStyleofbody);