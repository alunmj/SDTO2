chrome.webRequest.onErrorOccurred.addListener(onErrorOccurred, {urls: ["<all_urls>"]});
chrome.webRequest.onCompleted.addListener(onCompleted, {urls: ["<all_urls>"]});

// Storage API details at https://developer.chrome.com/docs/extensions/reference/api/storage

async function onErrorOccurred(details)
{
  if (!navigator.onLine) {
    return; // Could just be because we disconnected.
  }
  if (details.error == "net::ERR_NAME_NOT_RESOLVED") {
    //debugger;
    response = await fetch("https://dns.google/resolve?name="+(new URL(details.url)).host+"&type=5")
    if (response.status == 200) {
        jq = await response.json();
        //debugger
        if (jq.Answer) {
          cnameExtra = "\r\n \r\nCNAME for: " + jq.Answer[0].data
          cname = jq.Answer[0].data
        } else {
          cnameExtra = "";
          cname = ""
        }
        datatowrite = {"desturl":details.url,"cname":cname}
        chrome.tabs.get(details.tabId,function(tab) {
          datatowrite.pageurl = tab.url
          theHost = (new URL(details.url)).hostname
          datatowrite.dest = theHost
          chrome.storage.local.set({[theHost]:datatowrite})
        })

    }

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