# Function Descriptions 

Following are the functions used in SimplyClip application.

### Function: addClipboardListItem(text)
-	Functionality: This function adds the text copied to the global list of copied items Adds DOM elements to the HTML page to render the copied text in the extension Has Event Listeners for Edit and Delete buttons
-	Input: Accepts string -> Text that is copied to the clipboard
-	Output: Returns void

### Function: getClipboardText()
-	Functionality: This function gets the list of items copied to the clipboard
-	Input: No input
-	Output: Returns void

### Function: getThumbnail(textContent) 
-	Functionality: This function gets the source URL and the image URL for the copied image/text
-	Input: Accepts string -> URL of the website from which text is copied
-	Output: SourceURL, ImageURL

### Function: addClipboardListItem(text)
-	Functionality: This function adds the text copied to the global list of copied items Adds DOM elements to the HTML page to render the copied text in the extension Has Event Listeners for Edit and Delete buttons
-	Input: Accepts string -> text that is copied to the clipboard
-	Output: Returns void

### Function: downloadClipboardTextAsDoc () 
-	Functionality: Retrieves the copied text from the storage , generates a doc file and downloads the file.
-	Input: No Input
-	Output: Returns void

### Function: downloadClipboardTextAsCsv () 
-	Functionality: Retrieves the copied text, original copied text and URL of copied text from the storage , generates a CSV file and downloads the file.
-	Input: No Input
-	Output: Returns void

### Function: searchClipboardText()
-	Functionality: Filters the displayed copied text list that matches search text in the search box
-	Input: No Input
-	Output: Returns void

### Function: deleteAllText()
-	Functionality: Deletes all the text copied in the simply clip clipboard.
-	Input: No Input
-	Output: Returns void



