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
  