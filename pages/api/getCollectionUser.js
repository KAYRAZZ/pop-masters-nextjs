import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    const token = await getToken({ req });
    const user_id = token.sub;

    try {
        const getCollectionUser = await prisma.collection.findMany({
            select: {
                collection_name: true,
            },
            distinct: ['collection_name'],
            where: {
                user_id: user_id,
                figurine_owned: true,
            },
            take: 50,
        });

        if (getCollectionUser) {
            res.json({ success: true, collection: getCollectionUser });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}