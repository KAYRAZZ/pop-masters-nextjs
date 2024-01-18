import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    let { searchParam } = req.query;

    if (searchParam) {
        searchParam = searchParam.replace(/ /g, '%');
    }

    try {
        const searchFigurinesResult = await prisma.collectionsDatas.findMany({
            where: {
                OR: [
                    {
                        figurine_name: {
                            contains: searchParam,
                        },
                    },
                    {
                        figurine_reference: {
                            equals: searchParam,
                        },
                    },
                    {
                        figurine_image: {
                            contains: searchParam,
                        },
                    },
                ],
            },
            select: {
                collection_name: true,
                figurine_id: true,
                figurine_name: true,
                figurine_image: true,
                figurine_reference: true
            },
            take: 50,
        });
        res.json({ success: true, figurines: searchFigurinesResult });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}