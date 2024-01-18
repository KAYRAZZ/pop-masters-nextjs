const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

// Charger les données depuis le fichier JSON
const jsonData = JSON.parse(fs.readFileSync('./others/funko_pop_dataV2.json', 'utf8'));


async function insertData() {
    try {
        const insertDataArray = jsonData.flatMap((data) => {
            return data.datas.map((figurine) => {
                return {
                    collection_name: data.collection,
                    figurine_id: figurine.figurine_id,
                    figurine_name: figurine.name,
                    figurine_image: figurine.figurineImage,
                    figurine_box: figurine.figurineBox,
                    figurine_reference: figurine.reference,
                    figurine_numero: figurine.numPop,
                    figurine_special_feature: figurine.specialFeature,
                };
            });
        });

        await prisma.collectionsDatas.createMany({
            data: insertDataArray,
        });

        console.log('Données insérées avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données :', error);
    } finally {
        await prisma.$disconnect();
    }
}

insertData();
