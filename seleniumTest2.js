const assert = require('assert');
let webdriver = require("selenium-webdriver");
let chrome = require("selenium-webdriver/chrome");
const { Key, By } = require("selenium-webdriver");
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
            // Close the browser
            await driver.close();

            // Quit the browser
            await driver.quit();
        }
    }).timeout(15000); // Increase timeout if necessary
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
            // Close the browser
            await driver.close();

            // Quit the browser
            await driver.quit();
        }
    }).timeout(15000); // Increase timeout if necessary
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
            // Close the browser
            await driver.close();

            // Quit the browser
            await driver.quit();
        }
    }).timeout(15000); // Increase timeout if necessary
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
            // Close the browser
            await driver.close();

            // Quit the browser
            await driver.quit();
        }
    }).timeout(15000); // Increase timeout if necessary
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
            // Close the browser
            await driver.quit();
        }
    }).timeout(20000); // Increase timeout if necessary
});