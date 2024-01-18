import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import suiviParcel from "@/lib/suiviParcel";

export default async function handler(req, res) {
    const token = await getToken({ req });
    const user_id = token.sub;

    const selectParcelsUser = () => {
        return prisma.parcelTracking.findMany({
            where: {
                user_id
            }
        })
    };
    const deleteParcel = (figurine_id) => {
        return prisma.parcelTracking.delete({
            where: {
                figurine_id_user_id: {
                    user_id,
                    figurine_id
                }
            }
        })
    };
    const insertParcel = (tracking_number, figurine_id, suiviParcelResult) => {
        return prisma.parcelTracking.create({
            data: {
                tracking_number,
                figurine_id,
                donnees: JSON.stringify(suiviParcelResult),
                user_id,
                date_parcel_added: new Date(),
            }
        })
    };

    try {
        const selectParcelsUserResult = await selectParcelsUser();

        for (let i = 0; i < selectParcelsUserResult.length; i++) {
            const suiviParcelResult = await suiviParcel(selectParcelsUserResult[i].tracking_number);

            await deleteParcel(selectParcelsUserResult[i].figurine_id);
            await insertParcel(selectParcelsUserResult[i].tracking_number, selectParcelsUserResult[i].figurine_id, suiviParcelResult);
        }
        res.json({ success: true });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}