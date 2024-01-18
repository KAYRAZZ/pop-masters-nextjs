import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    const token = await getToken({ req });
    const user_id = token.sub;

    try {
        let getParcelUserResult = await prisma.$queryRaw`select p.figurine_id, figurine_name, figurine_image, tracking_number, donnees from parcelTracking p join collectionsDatas cd on p.figurine_id=cd.figurine_id where user_id=${user_id} order by date_parcel_added DESC limit 5;`;

        for (let i = 0; i < getParcelUserResult.length; i++) {
            getParcelUserResult[i].donnees = JSON.parse(getParcelUserResult[i].donnees);
        }
        res.json({ success: true, getParcelUserResult: getParcelUserResult });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}