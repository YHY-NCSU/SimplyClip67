
/*
 * MIT License
 * Updated content.js to address async issues and streamline clipboard access
 */

let _previousData = "";
let _maxListSize = 100;
let time_interval_set;

function safeReadClipboardText() {
    try {
        readClipboardText();
    } catch (error) {
        console.error("Error reading clipboard or storage:", error);
    }
}

function startClipboardInterval() {
    if (!time_interval_set) {
        time_interval_set = setInterval(safeReadClipboardText, 2000);
    }
}

function clearClipboardInterval() {
    if (time_interval_set) {
        clearInterval(time_interval_set);
        time_interval_set = undefined;
    }
}

window.addEventListener('mouseout', startClipboardInterval);
window.addEventListener('mouseover', clearClipboardInterval);
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearClipboardInterval();
    } else {
        startClipboardInterval();
    }
});

// Function to read from the clipboard
async function readClipboardText() {
    const { enabled } = await chrome.storage.local.get('enabled');
    if (enabled) {
        try {
            const clipboardText = await navigator.clipboard.readText();
            if (clipboardText && clipboardText !== _previousData) {
                setClipboardText(clipboardText);
                _previousData = clipboardText;
            }
        } catch (error) {
            console.log("Clipboard access error:", error);
        }
    }
}

// Function to set the clipboard text in storage
async function setClipboardText(clipText) {
    const clipboardData = await chrome.storage.sync.get([
        "list",
        "listURL",
        "originalList",
        "summarizedList",
        "citationList"
    ]);

    let list = clipboardData.list || [];
    let listURL = clipboardData.listURL || [];
    let originalList = clipboardData.originalList || [];
    let summarizedList = clipboardData.summarizedList || [];
    let citationList = clipboardData.citationList || [];

    // Manage list size and update storage data
    if (list.length >= _maxListSize) {
        list.pop();
        listURL.pop();
        originalList.pop();
        summarizedList.pop();
        citationList.pop();
    }

    if (!list.includes(clipText)) {
        list.unshift(clipText);
        listURL.unshift(window.location.href);
        originalList.unshift(clipText);
        summarizedList.unshift(clipText);
        citationList.unshift(clipText);
    }

    await chrome.storage.sync.set({
        list,
        listURL,
        originalList,
        summarizedList,
        citationList
    });

    console.log("Clipboard data updated in storage");
}

// Immediately start clipboard interval when the script loads
startClipboardInterval();
window.addEventListener('copy', readClipboardText);
