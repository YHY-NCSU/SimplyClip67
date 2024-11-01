/*
 *MIT License
 *Copyright (c) 2021 lalit10
 *Permission is hereby granted, free of charge, to any person obtaining a copy
 *of this software and associated documentation files (the "Software"), to deal
 *in the Software without restriction, including without limitation the rights
 *to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *copies of the Software, and to permit persons to whom the Software is
 *furnished to do so, subject to the following conditions:
 *The above copyright notice and this permission notice shall be included in all
 *copies or substantial portions of the Software.
 *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *SOFTWARE.
 */

 let _previousData = "";
 let _maxListSize = 100;
 let time_interval_set = undefined;
 
 const readClipboardData = () => {
   chrome.storage.local.get('enabled', data => {
     if (data.enabled == true) {
       navigator.clipboard.read().then(clipboardItems => {
         for (const clipboardItem of clipboardItems) {
           for (const type of clipboardItem.types) {
             if (type.startsWith('image/') || type === 'image/tiff') {
               clipboardItem.getType(type).then(blob => {
                 if (_previousData !== blob) {
                   setClipboardImage(blob);
                   _previousData = blob;
                 }
               });
             } else if (type === 'text/plain') {
               clipboardItem.getType('text/plain').then(blob => {
                 blob.text().then(text => {
                   if (text.length > 0 && text !== _previousData) {
                     setClipboardText(text);
                     _previousData = text;
                   }
                 });
               });
             }
           }
         }
       }).catch(err => console.log(err));
     }
   });
 };
 
 const setClipboardImage = async (imageBlob) => {
   chrome.storage.local.get(['imageList'], function (result) {
     let imageList = result.imageList || [];
     if (imageList.length === _maxListSize) {
       imageList.pop();
     }
     const reader = new FileReader();
     reader.onload = function (e) {
       const imageDataUrl = e.target.result;
       if (!imageList.includes(imageDataUrl)) {
         imageList.unshift(imageDataUrl);
         chrome.storage.local.set({ 'imageList': imageList }, () => {
           console.log("Debug: Image pushed to imageList");
         });
       }
     };
     reader.readAsDataURL(imageBlob);
   });
 };


const setClipboardText = async (clipText) => {
    chrome.storage.sync.get("list", function (clipboard) {
        chrome.storage.sync.get("listURL", function (clipboardURL) {
            chrome.storage.sync.get("originalList", function (clipboardOriginalList) {
                chrome.storage.sync.get("summarizedList", function (clipboardSummarizedList) {
                chrome.storage.sync.get("citationList", function (clipboardCitationList) {
                                    let { list } = clipboard;
                                    let { listURL } = clipboardURL;
                                    let { originalList } = clipboardOriginalList;
                                    let { summarizedList } = clipboardSummarizedList;
                                    let { citationList } = clipboardCitationList;
                                    console.log("List is:-", list);
                                    if (typeof list === "undefined" || list.length == 0) {
                                        list = [];
                                        listURL = [];
                                        originalList = [];
                                        summarizedList = [];
                                        citationList = [];
                                    }
                                    if (list.length === _maxListSize) {
                                        list.pop();
                                        listURL.pop();
                                        originalList = [];
                                        summarizedList = [];
                                        citationList = [];
                                    }
                                    if (list.indexOf(clipText) == -1) {
                                        list.unshift(clipText);
                                        listURL.unshift(window.location.href);
                                        originalList.unshift(clipText);
                                        summarizedList.unshift(clipText);
                                        citationList.unshift(clipText);
                                    }
                                    chrome.storage.sync.set({ 'list': list }, status => console.log("Debug : Clipboard Text pushed to list"));
                                    chrome.storage.sync.set({ 'listURL': listURL }, status => { console.log("Debug : URL pushed to list") })
                                    chrome.storage.sync.set({ 'originalList': originalList }, status => console.log("Debug : Original Clipboard Text pushed to list"));
                                    chrome.storage.sync.set({ 'summarizedList': summarizedList }, status => { console.log("Debug : summarizedText pushed to the summList") })
                                    chrome.storage.sync.set({ 'citationList': citationList}, status => { console.log("Debug : citationText pushed to the citList") })
                                })
            })
        })
    })
})
}

window.addEventListener('mouseout',function(){
    if(time_interval_set===undefined)
        time_interval_set = setInterval(readClipboardData,2000)
})
window.addEventListener('mouseover',function(){
    clearInterval(time_interval_set);
    time_interval_set=undefined;
})
window.addEventListener('copy',function(){
    readClipboardData();
})
document.addEventListener('visibilitychange',function(){
    if(document.hidden){
        clearInterval(time_interval_set);
        time_interval_set=undefined;
    }else{
        if(time_interval_set==undefined)
            time_interval_set = setInterval(readClipboardData,2000);
    }
})
