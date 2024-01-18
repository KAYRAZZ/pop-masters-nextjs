import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    const token = await getToken({ req });
    const user_id = token.sub;
    const { figurine_id } = req.body;

    try {
        await prisma.parcelTracking.delete({
            where: {
                figurine_id_user_id: {
                    figurine_id,
                    user_id
                }
            }
        });
        res.json({ success: true });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}