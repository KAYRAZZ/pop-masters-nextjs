import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    const token = await getToken({ req });
    const user_id = token.sub;

    const { figurine_id, collection } = req.body;

    const checkIfFigurineExists = async () => {
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
                figurine_wished: true,
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
                figurine_wished: !value,
            },
        });
    };

    const deleteFigurine = async (id) => {
        return await prisma.collection.delete({
            where: {
                figurine_id_user_id: {
                    user_id: user_id,
                    figurine_id: figurine_id,
                }
            },
        });
    };

    try {
        const checkIfFigurineExistsResult = await checkIfFigurineExists();

        if (checkIfFigurineExistsResult.length !== 0) {
            // Si il ne possedait pas la figurine et qu'il la voulait, on supprime la figurine sinon on inverse la valeur wished, car il l'a possède et la re-souhaite
            if (checkIfFigurineExistsResult[0].figurine_wished == 1 && checkIfFigurineExistsResult[0].figurine_owned == 0) {
                await deleteFigurine();
            } else {
                await updateFigurine(checkIfFigurineExistsResult[0].figurine_wished)
            }
        } else {
            await addFigurine();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}