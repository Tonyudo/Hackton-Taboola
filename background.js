// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  var action_url = "http://taboola.com";
  chrome.tabs.update(tab.id, {url: action_url});
});