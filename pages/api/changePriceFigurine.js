import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    const token = await getToken({ req });
    const user_id = token.sub;
    const { priceFigurine } = req.body;
    const figurine_id = parseInt(req.query.figurine_id, 10);

    try {
        await prisma.collection.update({
            where: {
                figurine_id_user_id: {
                    figurine_id: figurine_id,
                    user_id: user_id
                }
            },
            data: {
                purchase_price: priceFigurine
            }
        });
        res.json({ success: true });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}