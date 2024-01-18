import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    const token = await getToken({ req });
    const user_id = token.sub;
    const { collection, figurine_id } = req.body;

    const checkFigurineExists = async () => {
        return await prisma.collection.findMany({
            where: {
                user_id: user_id,
                figurine_id: figurine_id,
            },
            select: {
                figurine_id: true,
                figurine_owned: true,
                figurine_wished: true,
            },
        });
    };

    const addFigurine = async () => {
        return await prisma.collection.create({
            data: {
                collection_name: collection,
                figurine_id: figurine_id,
                figurine_owned: true,
                date_figurine_added: new Date(),
                user_id: user_id,
            },
        });
    };


    const updateFigurine = async (value) => {
        return await prisma.collection.update({
            where: {
                figurine_id_user_id: {
                    user_id: user_id,
                    figurine_id: figurine_id,
                }
            },
            data: {
                figurine_owned: !value,
            },
        });
    };

    const deleteFigurine = async () => {
        return await prisma.collection.delete({
            where: {
                figurine_id_user_id: {
                    user_id: user_id,
                    figurine_id: figurine_id
                }
            },
        });
    };

    try {
        const checkFigurineExistsResult = await checkFigurineExists();

        // Si la figurine n'existe pas pour l'utilisateur
        if (checkFigurineExistsResult && checkFigurineExistsResult.length === 0) {
            await addFigurine();
        } else {
            if (checkFigurineExistsResult[0].figurine_wished == 1) {
                await updateFigurine(checkFigurineExistsResult[0].figurine_owned);
            } else {
                await deleteFigurine();
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}