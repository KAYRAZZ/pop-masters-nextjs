const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

async function suiviParcel(numSuivi) {
    console.log("1");
    try {
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        console.log("2");
        const page = await browser.newPage();

        // Set the language to French
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'fr-FR'
        });

        console.log("3");

        await page.goto('https://parcelsapp.com/fr/tracking/' + numSuivi);

        const elements = await page.$$('.event-content strong');
        let tab = [];
        console.log("4");

        for (const element of elements) {
            const textContent = await page.evaluate(el => el.textContent, element);
            tab.push({ suivi: textContent.trim() })
        }
        console.log("5");
        await browser.close();
    } catch (error) {
        console.error(error);
    }
}

module.exports = suiviParcel;