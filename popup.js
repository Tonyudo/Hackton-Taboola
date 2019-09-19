console.log("ONCLICK STARTED RUNNING");
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.extension.getBackgroundPage().console.log('foo');
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var thisTab = chrome.tabs[0];
		chrome.tabs.executeScript(thisTab.id, {file: 'variable-checker.js'}, function(data) {
			console.log(response);
			callback(response);
			var response = data[0].response;
		});
	});

});


window.addEventListener('DOMContentLoaded', (event) => {
	document.getElementById('bClick').addEventListener('click',onClick);
	
});


// function chooseIssue(){
// 


function onClick(){
	var newURL =  document.getElementById('issuetype').value;
	console.log(newURL);
	chrome.tabs.create({ url: newURL }); 
}