const { firefox } = require('playwright');

export default async function suiviParcel(numSuivi) {

    try {
        const browser = await firefox.launch({ headless: true });
        const context = await browser.newContext({
            locale: 'fr-FR',
        });
        const page = await context.newPage();

        await page.goto('https://parcelsapp.com/fr/tracking/' + numSuivi);

        const elements = await page.$$('.event-content strong');
        let tab = [];

        for (const element of elements) {
            const textContent = await page.evaluate(el => el.textContent, element);
            tab.push({ suivi: textContent.trim() })
        }
        await browser.close();

        return tab;

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}