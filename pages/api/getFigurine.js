import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    const token = await getToken({ req });
    const user_id = token.sub;

    const { figurine_id } = req.query;

    try {
        const getFigurineResult = await prisma.collectionsDatas.findMany({
            where: {
                figurine_id: parseInt(figurine_id)
            },
            select: {
                collection_name: true,
                figurine_id: true,
                figurine_name: true,
                figurine_box: true,
                figurine_numero: true,
                figurine_reference: true,
                figurine_special_feature: true
            }
        });
        const getFigurineUserResult = await prisma.collection.findMany({
            where: {
                figurine_id: figurine_id,
                user_id: user_id
            },
            select: {
                figurine_id: true,
                purchase_price: true
            }
        });

        if (getFigurineResult && getFigurineResult.length != 0) {
            res.json({ success: true, figurine: getFigurineResult, figurineUser: getFigurineUserResult });
        } else {
            res.json({ success: false });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}