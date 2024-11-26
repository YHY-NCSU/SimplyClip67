chrome.contextMenus.create({
  title: "Save Image to SimplyClip",
  contexts: ["image"],
  id: "save-image-to-simplyclip"
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "save-image-to-simplyclip") {
    const imageUrl = info.srcUrl;
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imageDataUrl = e.target.result;
          chrome.storage.local.get(["imageList"], function (result) {
            let imageList = result.imageList || [];
            if (!imageList.includes(imageDataUrl)) {
              imageList.unshift(imageDataUrl);
              chrome.storage.local.set({ imageList: imageList }, () => {
                console.log("Image saved to imageList");
              });
            }
          });
        };
        reader.readAsDataURL(blob);
      });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "download-csv") {
    chrome.runtime.sendMessage({ action: "downloadCSV" });
  } else if (command === "download-doc") {
    chrome.runtime.sendMessage({ action: "downloadDOC" });
  } else if (command === "download-json") {
    chrome.runtime.sendMessage({ action: "downloadJSON" });
  }
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.action === "getClipboardData") {
      chrome.storage.sync.get(["list"], (result) => {
          sendResponse({ data: result.list || [] });
      });
  } else if (request.action === "addClipboardData") {
      const newItem = request.data;
      chrome.storage.sync.get(["list"], (result) => {
          let list = result.list || [];
          list.unshift(newItem); // Add new item to the top
          chrome.storage.sync.set({ list }, () => {
              sendResponse({ success: true });
          });
      });
  } else {
      sendResponse({ error: "Invalid action" });
  }
  return true; // Indicates async response
});

