import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    const token = await getToken({ req });
    const user_id = token.sub;
    const { collection } = req.query;

    try {
        const getFigurines = await prisma.collectionsDatas.findMany({
            select: {
                collection_name: true,
                figurine_id: true,
                figurine_name: true,
                figurine_image: true,
                figurine_special_feature: true
            },
            where: {
                collection_name: collection
            }
        })
        const getFigurinesUser = await prisma.collection.findMany({
            select: {
                figurine_id: true,
                figurine_owned: true,
                figurine_wished: true
            },
            where: {
                collection_name: collection,
                user_id: user_id
            }
        })

        if (getFigurines && getFigurinesUser) {
            res.json({ success: true, figurines: getFigurines, figurinesUser: getFigurinesUser });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}