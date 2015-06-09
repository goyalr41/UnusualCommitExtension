function check(tabId, changeInfo, tab) {
  user = tab.url.split("/")[3]
  repo = tab.url.split("/")[4]
  commit = tab.url.split("/")[5]

  if (tab.url.indexOf('github.com/') > -1 && user && repo && commit && changeInfo.url === undefined) {
	  chrome.pageAction.show(tabId);
  }else {
	  chrome.pageAction.hide(tabId);
  }

  //(".sha btn btn-outline").css('color','red');
}

chrome.tabs.onUpdated.addListener(check);