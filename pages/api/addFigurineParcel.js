import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import suiviParcel from "@/lib/suiviParcel";

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
        // Ensure that `res` is defined before using it
        if (res) {
            res.status(500).json({ success: false, message: "Internal Server Error" });
        } else {
            console.error('Response object is not defined. Unable to send an error response.');
        }
    }
}
