console.log("first");
const { firefox } = require('playwright');

export default async function suiviParcel(numSuivi) {
console.log("1");
try {
    const browser = await firefox.launch({ headless: true });
    console.log("2");
    const context = await browser.newContext({
        locale: 'fr-FR',
    });
    console.log("3");
    const page = await context.newPage();
    
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
    
    console.log("6");
    return tab;
    
} catch (error) {
    console.error('Erreur de requête:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
}

}