

let _previousData = "";
let _maxListSize = 100;
let time_interval_set = undefined;

const readClipboardText = () => {
    chrome.storage.local.get('enabled', data => {
        if (data.enabled == true) {
            navigator.clipboard.read().then(clipboardItems => {
                for (const clipboardItem of clipboardItems) {
                    // Check if the clipboard item contains image data
                    if (clipboardItem.types.includes("image/png")) {
                        clipboardItem.getType("image/png").then(blob => {
                            if (blob) {
                                console.log("Image detected in clipboard");
                                const imageURL = URL.createObjectURL(blob); // Convert blob to a URL for storage/display
                                setClipboardData({ image: imageURL });
                                _previousData = imageURL;
                            }
                        }).catch(err => console.log(err));
                    }
                    // Check if the clipboard item contains text data
                    else if (clipboardItem.types.includes("text/plain")) {
                        clipboardItem.getType("text/plain").then(textBlob => {
                            textBlob.text().then(clipboardText => {
                                if (clipboardText.length > 0 && clipboardText !== _previousData) {
                                    console.log("Text detected in clipboard");
                                    setClipboardData({ text: clipboardText });
                                    _previousData = clipboardText;
                                }
                            });
                        }).catch(err => console.log(err));
                    }
                }
            }).catch(err => console.log(err));
        }
    });
}

const setClipboardData = async (clipboardData) => {
    // Check if the data contains text or an image
    const { text, image } = clipboardData;

    chrome.storage.sync.get(["list", "listURL", "originalList", "summarizedList", "citationList", "imageList"], function (clipboard) {
        let { list, listURL, originalList, summarizedList, citationList, imageList } = clipboard;

        if (!list) list = [];
        if (!listURL) listURL = [];
        if (!originalList) originalList = [];
        if (!summarizedList) summarizedList = [];
        if (!citationList) citationList = [];
        if (!imageList) imageList = [];

        // Check and limit the maximum list size
        if (list.length === _maxListSize) {
            list.pop();
            listURL.pop();
            originalList.pop();
            summarizedList.pop();
            citationList.pop();
            imageList.pop();
        }

        // Store text data if it's present and not already in the list
        if (text && list.indexOf(text) === -1) {
            list.unshift(text);
            listURL.unshift(window.location.href);
            originalList.unshift(text);
            summarizedList.unshift(text);
            citationList.unshift(text);
        }

        // Store image data if it's present and not already in the list
        if (image && imageList.indexOf(image) === -1) {
            imageList.unshift(image);
            listURL.unshift(window.location.href); // Optionally associate a URL with each image
        }

        // Update Chrome storage
        chrome.storage.sync.set({ list, listURL, originalList, summarizedList, citationList, imageList }, () => {
            console.log("Clipboard data stored successfully");
        });
    });
}

// Clipboard monitoring functions remain the same
window.addEventListener('mouseout', function () {
    if (time_interval_set === undefined)
        time_interval_set = setInterval(readClipboardText, 2000);
});
window.addEventListener('mouseover', function () {
    clearInterval(time_interval_set);
    time_interval_set = undefined;
});
window.addEventListener('copy', function () {
    readClipboardText();
});
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        clearInterval(time_interval_set);
        time_interval_set = undefined;
    } else {
        if (time_interval_set == undefined)
            time_interval_set = setInterval(readClipboardText, 2000);
    }
});
