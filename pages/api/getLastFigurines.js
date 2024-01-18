import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    const token = await getToken({ req });
    const user_id = token.sub;
    console.log("api atteint");
    try {
        let getRecentlyAddedResult = await prisma.$queryRaw`select cd.figurine_id, cd.figurine_name, c.collection_name, cd.figurine_image from collection c join collectionsDatas cd on c.figurine_id=cd.figurine_id where user_id=${user_id} order by date_figurine_added DESC limit 5;`;

        if (getRecentlyAddedResult) {
            res.status(200).json({ success: true, recentlyAddedResult: getRecentlyAddedResult });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}