import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// import { promises as fs } from 'fs';
puppeteer.use(StealthPlugin());

async function suiviParcel(numSuivi) {
    console.log("1");
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

        await page.goto('https://parcelsapp.com/fr/tracking/' + numSuivi, { waitUntil: 'networkidle0' });
        await page.reload({ waitUntil: 'networkidle0' });
        // const html = await page.content();

        // await fs.writeFile('output.html', html);


        console.log("2");

        const elements = await page.$$('.event-content strong');
        let tab = [];

        for (const element of elements) {
            const textContent = await page.evaluate(el => el.textContent, element);
            tab.push({ suivi: textContent.trim() })
        }
        await browser.close();
        console.log(tab);
        return tab;
    } catch (error) {
        console.error(error);
    }
}

export default suiviParcel;