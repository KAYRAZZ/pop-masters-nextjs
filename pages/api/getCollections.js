import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    try {
        const distinctCollectionNames = await prisma.collectionsDatas.findMany({
            select: {
                collection_name: true,
            },
            distinct: ['collection_name'],
            orderBy: {
                collection_name: 'asc', // 'asc' for ascending
            },
        });

        if (distinctCollectionNames) {
            res.json({ success: true, collections: distinctCollectionNames });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}