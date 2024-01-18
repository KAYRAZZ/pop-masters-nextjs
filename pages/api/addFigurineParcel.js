import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { firefox } from 'playwright';


export default async function handler(req, res) {
    const token = await getToken({ req });
    const user_id = token.sub;
    const { suivi } = req.body;
    const figurine_id = parseInt(req.body.figurine_id, 10);

    
    try {
        const suiviParcelResult = await suiviParcel(suivi);
        await prisma.parcelTracking.create({
            data: {
                figurine_id,
                tracking_number: suivi,
                donnees: JSON.stringify(suiviParcelResult),
                date_parcel_added: new Date(),
                user_id
            }
        });

        res.json({ success: true });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

async function suiviParcel(numSuivi) {
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