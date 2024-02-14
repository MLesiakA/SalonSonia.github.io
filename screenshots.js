(async () => {
    const puppeteer = require('puppeteer');
    const fs = require('fs-extra');
    const path = require('path');
    const { default: chalk } = await import('chalk');

    // Function to take a screenshot of a webpage
    async function takeScreenshot(url, outputPath, username, password) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

         // Set the viewport size
    await page.setViewport({
        width: 1280, // Width of the viewport in pixels
        height: 800, // Height of the viewport in pixels
        deviceScaleFactor: 1, // Scale factor applied to the viewport (default is 1)
    });
    
        // Set the authentication details
        await page.authenticate({ username, password });

        // Set the 'gdpr' cookie for the domain
        await page.setCookie({
            name: 'gdpr',
            value: 'true',
            domain: 'pekao4.dev.pl.atos.net' // Change this to the desired domain
        });

        await page.goto(url);
        await page.screenshot({ path: outputPath, fullPage: true });
        await browser.close();
    }

    // Function to run the test for a website
    async function runTest(website) {
        const { name, url, username, password } = website;
        const screenshotFolder = 'dev4';
        const screenshotPath = path.join(screenshotFolder, `${name}.png`);

        try {
            // Create the screenshots folder if it doesn't exist
            await fs.ensureDir(screenshotFolder);
            
            await takeScreenshot(url, screenshotPath, username, password);
            console.log(chalk.blue(`Screenshot captured for ${name}`));
        } catch (error) {
            console.error(chalk.red(`Error capturing screenshot for ${name}: ${error.message}`));
        }
    }

    // Load websites from JSON file
    const websites = require('./websites.json');

    // Run tests for each website
    for (const website of websites) {
        await runTest(website);
    }
})();
