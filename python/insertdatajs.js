const mysql = require('mysql');
const fs = require('fs');

// Configuration de la connexion à la base de données MySQL
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "popmasters",
    port: 3306,
});

// Charger les données depuis le fichier JSON
const jsonData = JSON.parse(fs.readFileSync('./python/funko_pop_dataV2.json', 'utf8'));


// Connexion à la base de données MySQL
connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données : ', err);
        throw err;
    }

    console.log('Insertion en cours ...');

    // Insérer les données dans la table
    jsonData.forEach((data) => {

        // const query = `INSERT INTO collections_datas (collections_datas_id, collection_name) values (${y}, ?)`;
        // connection.query(query, [data.collection], (err, results) => {
        //     if (err) {
        //         console.error('Erreur lors de l\'insertion des données : ', err);
        //     }
        // });

        for (let i = 0; i < data.datas.length; i++) {
            const figurine_id = data.datas[i].figurine_id;
            const name = data.datas[i].name;
            const figurineImage = data.datas[i].figurineImage;
            const figurineBox = data.datas[i].figurineBox;
            const reference = data.datas[i].reference;
            const numPop = data.datas[i].numPop;
            const specialFeature = data.datas[i].specialFeature;

            const query = "INSERT INTO collectionsdatas (collection_name, figurine_id, figurine_name, figurine_image, figurine_box , figurine_reference, figurine_numero, figurine_special_feature) values (?, ?, ?, ?, ?, ?, ?, ?);";
            connection.query(query, [data.collection, figurine_id, name, figurineImage, figurineBox, reference, numPop, specialFeature], (err, results) => {
                if (err) {
                    console.error('Erreur lors de l\'insertion des données : ', err);
                }
            });
        }
    });

    // Fermer la connexion à la base de données MySQL
    connection.end((err) => {
        if (err) {
            console.error('Erreur lors de la fermeture de la connexion à la base de données : ', err);
        } else {
            console.log('Insertion terminée !');
        }
    });
});
