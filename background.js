chrome.webRequest.onErrorOccurred.addListener(onErrorOccurred, {urls: ["<all_urls>"]});
chrome.webRequest.onCompleted.addListener(onCompleted, {urls: ["<all_urls>"]});

function onErrorOccurred(details)
{
  if (!navigator.onLine) {
    return; // Could just be because we disconnected.
  }
  if (details.error == "net::ERR_NAME_NOT_RESOLVED") {
    //debugger;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(xreq) {
      if (xhr.readyState == 4) {
    //alert('NXDOMAIN on page trying to read ' + details.url);
        jq = JSON.parse(xreq.target.responseText);
        if (jq.Answer) {
          cnameExtra = "\nCNAME for: " + jq.Answer[0].data;
        } else {
          cnameExtra = "";
        }
        chrome.tabs.get(details.tabId,function(tab){
          alert('NXD Source ' + tab.url + '\nDest ' + details.url + cnameExtra);
        });
      }
    }
    xhr.open("GET","https://dns.google/resolve?name="+(new URL(details.url)).host+"&type=5", true);
    xhr.send();

//    chrome.tabs.update(details.tabId, {url: "..."});
  }
}

function onCompleted(details)
{
  if (!navigator.onLine) {
    return; // Could just be because we're disconnected.
  }
  if (details.statuscode == 404) {
    chrome.tabs.get(details.tabId,function(tab){alert('404 Source ' + tab.url + '\nDest ' + details.url)});
  }
}