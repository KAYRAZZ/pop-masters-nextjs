import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    const token = await getToken({ req });
    const user_id = token.sub;

    try {
        const getFigurinesWish = await prisma.$queryRaw`select c.figurine_id, figurine_name, figurine_image, figurine_wished from collection c join collectionsDatas cd on c.figurine_id=cd.figurine_id where user_id=${user_id} and figurine_wished=true;`;

        res.json({ success: true, figurines: getFigurinesWish });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}