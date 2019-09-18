var setInterval = 10000;
var sRes = null;
var port;
window.statList = [];
chrome.runtime.onConnect.addListener(function(port) {
	try {
		port.onMessage.addListener(function(msg) {	
		var jql_url = "https://jira.taboola.com/rest/api/2/search?jql=issueKey+in+("
		for(var i=0; i < msg.jira.length; i++) {
			jql_url += msg.jira[i] + ",";
		}
		jql_url = jql_url.slice(0, -1);
		jql_url += ")&fields=created,assignee,priority,status,comment,resolution";			
		
		console.log("jiraExt:query"+ jql_url);
		
		var req = new XMLHttpRequest();
		var res = "";
		req.open("GET", jql_url, true);
		req.onreadystatechange = function (inx) {
			if (req.readyState != 4 || req.status != 200) return; 
				res = req.responseText;
				var issues = JSON.parse(res).issues;
				var result = [];
				if(issues.length > 0) {
					for(var i=0; i<issues.length; i++) {
						try {
							var issue = {};
							issue.key = issues[i].key;
							issue.created = issues[i].fields.created.split('T')[0];
							issue.status = issues[i].fields["status"].name;
							issue.assignee = issues[i].fields.assignee.name;
							issue.resolution = issues[i].fields.resolution != null ? issues[i].fields.resolution.name : "Unresolved";
							if (typeof issues[i].fields.comment != 'undefined' && issues[i].fields.comment.comments.length >0 ) {
								var commentsLenegth = issues[i].fields.comment.comments.length;
								issue.comment = issues[i].fields.comment.comments[commentsLenegth-1].body;
								issue.commentDate = issues[i].fields.comment.comments[commentsLenegth-1].updated;
							}					
							result.push(issue);	
						} catch(e) {
							console.log("JiraExt:issue fetch error");
						}			
					}			
					port.postMessage({res: result, currentInterval: window.setInterval});
				}
			};
			req.send("");	
		});
	} catch(e) {
		console.log(e.msg);
	}
});