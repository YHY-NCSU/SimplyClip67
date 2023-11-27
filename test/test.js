/*
 *MIT License
 *
 *Copyright (c) 2021 lalit10
 *
 *Permission is hereby granted, free of charge, to any person obtaining a copy
 *of this software and associated documentation files (the "Software"), to deal
 *in the Software without restriction, including without limitation the rights
 *to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *copies of the Software, and to permit persons to whom the Software is
 *furnished to do so, subject to the following conditions:
 *
 *The above copyright notice and this permission notice shall be included in all
 *copies or substantial portions of the Software.
 *
 *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 *AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *SOFTWARE.
 */
// UNCOMMENT THE IFRAME CODE CHUNK IN POPUP.HTML TO ALLOW TESTING IN THE CODE
let sampleText = "Sample Copied Text!";

function mockCopyToClipboard(text){
    navigator.clipboard.writeText(text);
    button1.focus();
    button1.click();
}

function mockCopyToChromeStorage(){
    navigator.clipboard.writeText(sampleText);
    chrome.storage.sync.get(['list'], clipboard => {
        let list = clipboard.list;
        list.push("Sample Copied Text!");
        chrome.storage.sync.set({'list':list},()=>{
            console.log("Button 1 was clicked and entry added");
        })
    });
}

function mockDeleteListEntry(text){
    chrome.storage.sync.get(['list'], clipboard => {
        let list = clipboard.list;
        let textIndex = list.indexOf(text);
        if(textIndex!== -1){
            list.slice(textIndex);
        }
        chrome.storage.sync.set({ 'list': list } , ()=>{
            console.log("Chrome Storage updated");
        })
    })
}

window.addEventListener("DOMContentLoaded", (event) => {
    let button1 = document.getElementById("storageTest");
    button1.addEventListener("click",()=>{
        mockCopyToChromeStorage();
    })
});


window.addEventListener("DOMContentLoaded", (event) => {
    let button2 = document.getElementById("deleteTest");
    button2.addEventListener("click",()=>{
        mockDeleteListEntry(sampleText);
    })
});


window.addEventListener("DOMContentLoaded", (event) => {
    let button3 = document.getElementById("copyFirstEntry");
    button3.addEventListener("click",()=>{
        console.log("Button 3 clicked");
        mockCopyToClipboard(sampleText);
    })
    button3.focus();
    button3.click();
});

/*
 * Test to delete the added entry
 *  button2.focus();
 *  Button2.click();
 */
