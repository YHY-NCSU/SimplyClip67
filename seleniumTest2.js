const assert = require('assert');
let webdriver = require("selenium-webdriver");
let chrome = require("selenium-webdriver/chrome");

const { Builder, By, Key, until } = require('selenium-webdriver');

require('chromedriver');

describe('Check search and highlight input functionality', function () {
    it('should input text in the search bar and highlight matching text in SimplyClip clipboard', async function () {
        // Open the Chrome Browser with a custom profile
        const options = new chrome.Options();

        // Initialise driver to launch Chrome
        const driver = new webdriver.Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        try {
            // Launch SimplyClip page or relevant web app page
            await driver.get('http://localhost:3000'); // Replace with actual URL if needed

            // Locate the search input field
            const searchInput = await driver.findElement(By.xpath("//input[@id='search-input']"));
            
            // Input search text
            await searchInput.sendKeys("test text");

            // Verify if the input was successfully entered
            const enteredText = await searchInput.getAttribute('value');
            assert.strictEqual(enteredText, "test text", "Search input text was not entered correctly");
            
            // Simulate a search action (press Enter or click the search button)
            await searchInput.sendKeys(Key.RETURN);

            // Wait for the results to highlight (you might need to implement a wait strategy)
            await driver.sleep(1000); // Adjust timing as needed

            // Locate the highlighted elements (assuming a CSS class is applied for highlights)
            const highlightedElements = await driver.findElements(By.css(".highlighted"));
            
            // Assert that at least one highlighted element exists
            assert(highlightedElements.length > 0, "No text was highlighted");

            // Additional assertions can be made to check the highlighted content if needed

        } finally {
            
            await driver.close();

           
            await driver.quit();
        }
    }).timeout(15000); 
});


describe('Check URL icon display for clipboard items that are URLs', function () {
    it('should show a URL icon for clipboard items that are URLs in SimplyClip', async function () {
        // Open the Chrome Browser with a custom profile
        const options = new chrome.Options();

        // Initialise driver to launch Chrome
        const driver = new webdriver.Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        try {
            // Launch SimplyClip page or relevant web app page
            await driver.get('http://localhost:3000'); // Replace with actual URL if needed

            // Locate a clipboard item that is a URL
            const clipboardItem = await driver.findElement(By.xpath("//div[contains(@class, 'clipboard-item') and contains(text(), 'http')]"));
            
            // Check if the URL icon is displayed next to the clipboard item
            const urlIcon = await clipboardItem.findElement(By.css(".url-icon"));
            const isDisplayed = await urlIcon.isDisplayed();
            
            // Assert that the URL icon is visible
            assert(isDisplayed, "URL icon is not displayed for URL clipboard items");

        } finally {
            
            await driver.close();

          
            await driver.quit();
        }
    }).timeout(15000); 
});

describe('Check YouTube icon display for clipboard items that are YouTube links', function () {
    it('should show a YouTube icon for clipboard items that are YouTube links in SimplyClip', async function () {
        // Open the Chrome Browser with a custom profile
        const options = new chrome.Options();
            

        // Initialise driver to launch Chrome
        const driver = new webdriver.Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        try {
            // Launch SimplyClip page or relevant web app page
            await driver.get('http://localhost:3000'); // Replace with actual URL if needed

            // Locate a clipboard item that is a YouTube link
            const clipboardItem = await driver.findElement(By.xpath("//div[contains(@class, 'clipboard-item') and contains(text(), 'youtube.com')]"));
            
            // Check if the YouTube icon is displayed next to the clipboard item
            const youtubeIcon = await clipboardItem.findElement(By.css(".youtube-icon"));
            const isDisplayed = await youtubeIcon.isDisplayed();
            
            // Assert that the YouTube icon is visible
            assert(isDisplayed, "YouTube icon is not displayed for YouTube link clipboard items");

        } finally {
            
            await driver.close();

            
            await driver.quit();
        }
    }).timeout(15000); 
});

describe('Check URL icon absence for clipboard items that are YouTube links', function () {
    it('should not show a URL icon for clipboard items that are YouTube links in SimplyClip', async function () {
        // Open the Chrome Browser with a custom profile
        const options = new chrome.Options();
            

        // Initialise driver to launch Chrome
        const driver = new webdriver.Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        try {
            // Launch SimplyClip page or relevant web app page
            await driver.get('http://localhost:3000'); // Replace with actual URL if needed

            // Locate a clipboard item that is a YouTube link
            const clipboardItem = await driver.findElement(By.xpath("//div[contains(@class, 'clipboard-item') and contains(text(), 'youtube.com')]"));
            
            // Check if the URL icon is displayed next to the clipboard item
            let urlIconIsDisplayed = false;
            try {
                const urlIcon = await clipboardItem.findElement(By.css(".url-icon"));
                urlIconIsDisplayed = await urlIcon.isDisplayed();
            } catch (error) {
                // Icon is not found, expected behavior
                urlIconIsDisplayed = false;
            }
            
            // Assert that the URL icon is not visible
            assert.strictEqual(urlIconIsDisplayed, false, "URL icon is displayed for YouTube link clipboard items, but it should not be");
        } finally {
           
            await driver.close();

            
            await driver.quit();
        }
    }).timeout(15000); 
});

describe('Clipboard Search Functionality to filter out items with specific text', function () {
    it('should display only clipboard items matching the search input text in SimplyClip', async function () {
        // Open the Chrome Browser with a custom profile if needed
        const options = new chrome.Options();
       

        // Initialize driver to launch Chrome
        const driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        try {
            // Launch SimplyClip page or relevant web app page
            await driver.get('http://localhost:3000'); // Replace with actual URL if needed

            // Wait until the page is loaded and the clipboard items are present
            await driver.wait(until.elementLocated(By.css('.clipboard-item')), 10000);

            // Input text into the search input box
            const searchInput = await driver.findElement(By.id('search-input')); // Adjust selector if necessary
            const searchText = 'copy'; // The text to search for
            await searchInput.sendKeys(searchText);

            // Wait for the search results to update (adjust the wait time as necessary)
            await driver.sleep(1000);

            // Get all clipboard items
            const clipboardItems = await driver.findElements(By.css('.clipboard-item'));

            // Collect displayed clipboard items
            let displayedItems = [];
            for (let item of clipboardItems) {
                const isDisplayed = await item.isDisplayed();
                if (isDisplayed) {
                    const text = await item.getText();
                    displayedItems.push(text.trim());
                }
            }

            // Expected items that should be displayed (define these based on your app's data)
            // For example, assume the items containing 'copy' are:
            const expectedItems = ['Copy this text', 'Text to be copied'];

            // Assert that only the expected items are displayed
            assert.strictEqual(displayedItems.length, expectedItems.length, 'Number of displayed items does not match expected number');
            assert.deepStrictEqual(displayedItems.sort(), expectedItems.sort(), 'Displayed items do not match expected items');

        } finally {
           
            await driver.quit();
        }
    }).timeout(20000); 
});

//Test for delete functionality for each list item

describe('Delete Functionality for Clipboard Items', function () {
    it('should remove a clipboard item when its delete button is clicked', async function () {
        // Open the Chrome Browser with a custom profile if needed
        const options = new chrome.Options();
        // Uncomment and set the path if you need to use a custom user data directory
        // options.addArguments('--user-data-dir=/path/to/your/custom/profile');

        // Initialize driver to launch Chrome
        const driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        try {
            // Launch SimplyClip page or relevant web app page
            await driver.get('http://localhost:3000'); // Replace with actual URL if needed

            // Wait until the clipboard items are present on the page
            await driver.wait(until.elementLocated(By.css('.clipboard-item')), 10000);

            // Locate all initial clipboard items
            let clipboardItems = await driver.findElements(By.css('.clipboard-item'));
            const initialItemCount = clipboardItems.length;

            // Assert that there is at least one item to delete
            assert(initialItemCount > 0, 'No clipboard items found to delete');

            // Locate the delete button for the first clipboard item
            const deleteButton = await clipboardItems[0].findElement(By.css('.delete-button')); // Adjust selector if necessary

            // Click the delete button
            await deleteButton.click();
            // Wait for the item to be removed from the DOM
            await driver.wait(async () => {
                const updatedClipboardItems = await driver.findElements(By.css('.clipboard-item'));
                return updatedClipboardItems.length === initialItemCount - 1;
            }, 5000, 'Item was not deleted within the expected time');

            // Get the updated list of clipboard items
            clipboardItems = await driver.findElements(By.css('.clipboard-item'));
            const updatedItemCount = clipboardItems.length;

            // Assert that the number of items has decreased by one
            assert.strictEqual(updatedItemCount, initialItemCount - 1, 'Clipboard item was not deleted correctly');
        } finally {
            
            await driver.quit();
        }
    }).timeout(20000); 
});

//test for global delete functionality

describe('Global Delete Functionality for Clipboard Items', function () {
    it('should remove all clipboard items when the global delete button is clicked', async function () {
        // Open the Chrome Browser with a custom profile if needed
        const options = new chrome.Options();
        // Uncomment and set the path if you need to use a custom user data directory
        // options.addArguments('--user-data-dir=/path/to/your/custom/profile');

        // Initialize driver to launch Chrome
        const driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        try {
            // Launch SimplyClip page or relevant web app page
            await driver.get('http://localhost:3000'); // Replace with actual URL if needed

            // Wait until the clipboard items are present on the page
            await driver.wait(until.elementLocated(By.css('.clipboard-item')), 10000);

            // Locate all initial clipboard items
            let clipboardItems = await driver.findElements(By.css('.clipboard-item'));
            const initialItemCount = clipboardItems.length;

            // Assert that there is at least one item to delete
            assert(initialItemCount > 0, 'No clipboard items found to delete');

            // Locate the global delete button
            const globalDeleteButton = await driver.findElement(By.css('.global-delete-button')); // Adjust selector if necessary

            // Click the global delete button
            await globalDeleteButton.click();

            // Wait for all items to be removed from the DOM
            await driver.wait(async () => {
                const updatedClipboardItems = await driver.findElements(By.css('.clipboard-item'));
                return updatedClipboardItems.length === 0;
            }, 5000, 'Items were not deleted within the expected time');

            // Get the updated list of clipboard items
            clipboardItems = await driver.findElements(By.css('.clipboard-item'));
            const updatedItemCount = clipboardItems.length;

            // Assert that all items have been deleted
            assert.strictEqual(updatedItemCount, 0, 'Global delete button did not remove all clipboard items');
        } finally {
           
            await driver.quit();
        }
    }).timeout(20000); 
});
