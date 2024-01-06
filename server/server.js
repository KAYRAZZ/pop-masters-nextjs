const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const secretKey = process.env.TOKEN;

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
});


app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});

// Middleware pour vérifier l'authentification
const authenticateToken = (req, res, next) => {

    // Récupère juste le token sans le Bearer
    const token = req.header('Authorization').split(' ')[1];

    if (!token) return res.json({ success: false, status: 401, message: 'Token expiré' }); // Unauthorized

    jwt.verify(token, secretKey, (err, user) => {

        if (err) {
            // Si le token a expiré
            if (err.name === 'TokenExpiredError') {
                return res.json({ success: false, status: 401, message: 'Token expiré' });
            }
            return res.json({ success: false, status: 403, message: 'Unauthorized Status 403' });
            // Forbidden
        }
        // Stocker les informations de l'utilisateur dans req.user
        req.user = user;
        // Passer au middleware ou à la route suivante
        next();
    });
};

app.post("/authenticated", authenticateToken, (req, res) => {
    res.json({ success: "true" });
})

// Endpoint POST '/login' => loginForm : Se connecter
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Cherche si l'utilisteur et le mot de passe existe pour un utilisateur
    try {
        const query = 'SELECT user_id, username FROM users where username=? and password=?';
        connection.execute(query, [username, password], (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'exécution de la requête :', err);
            } else {
                // Si la réponse est supérieur à 0, c'est que cela correspond au infos de l'utilisateur, car une valeur est retournée
                if (result && result.length > 0) {
                    // Créer le token, et sauvegarde le username dans le token 
                    const token = jwt.sign({ user_id: result[0].user_id, username: username }, secretKey);

                    res.json({ success: true, message: 'Authentification réussite', token: token });
                } else {
                    res.json({ success: false, message: "Nom d'utilisateur ou mot de passe incorrect" });
                }
            }
        });
    } catch (error) {
        console.error('Erreur de connexion:', error);
    }
});

const executeQuery = (query, values) => {
    return new Promise((resolve, reject) => {
        connection.execute(query, values, (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'exécution de la requête :', err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


// Endpoint POST '/getCollections' => Dashboard : 
app.post("/getCollections", authenticateToken, async (req, res) => {
    const getCollections = () => {
        const query = "select distinct collection_name from collections_datas order by collection_name;";
        return executeQuery(query);
    };

    try {
        const getCollectionsResult = await getCollections();

        if (getCollectionsResult) {
            res.json({ success: true, datas: getCollectionsResult });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Endpoint POST '/getCollectionUser' => myCollection : récupère la collection de l'utilisateur  
app.post("/getCollectionUser", authenticateToken, async (req, res) => {
    const { user_id } = req.user;

    const getCollectionUser = () => {
        const query = "select distinct collection_name from view_collections where user_id=? limit 50;";
        return executeQuery(query, [user_id]);
    };

    try {
        const getCollectionUserResult = await getCollectionUser();

        if (getCollectionUser) {
            res.json({ success: true, collection: getCollectionUserResult });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// Endpoint POST '/getFigurinesCollection' => Collection : Affiche les figurines d'un collection 
app.post("/getFigurinesCollection", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    const { collection } = req.body;

    const getFigurines = () => {
        const query = "select collection_name, figurine_id, figurine_name, figurine_image, figurine_special_feature from collections_datas where collection_name=?;";
        return executeQuery(query, [collection]);
    };

    const getFigurinesUser = () => {
        const query = "select figurine_id, figurine_owned, figurine_wished FROM collections WHERE user_id=? AND collection_name=?;";
        return executeQuery(query, [user_id, collection]);
    };

    try {
        const getFigurinesResult = await getFigurines();
        const getFigurinesUserResult = await getFigurinesUser();

        if (getFigurinesResult) {
            res.json({ success: true, figurines: getFigurinesResult, figurinesUser: getFigurinesUserResult });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Endpoint POST '/getFigurinesWish' => Collection : Affiche les figurines d'un collection 
app.post("/getFigurinesWish", authenticateToken, async (req, res) => {
    const { user_id } = req.user;

    const getFigurinesWish = () => {
        const query = "select c.figurine_id, figurine_name, figurine_image, figurine_wished from collections c join collections_datas cd on c.figurine_id=cd.figurine_id where user_id=? and figurine_wished=1;";
        return executeQuery(query, [user_id]);
    };


    try {
        const getFigurinesWishResult = await getFigurinesWish();

        res.json({ success: true, figurines: getFigurinesWishResult });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Endpoint POST '/getFigurinesCollection' => Collection : Affiche les figurines d'un collection 
app.post("/getFigurinesCollection", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    const { collection } = req.body;

    const getFigurines = () => {
        const query = "select collection_name, figurine_id, figurine_name, figurine_image, figurine_special_feature from collections_datas where collection_name=?;";
        return executeQuery(query, [collection]);
    };

    const getFigurinesUser = () => {
        const query = "select figurine_id, figurine_owned, figurine_wished FROM collections WHERE user_id=? AND collection_name=?;";
        return executeQuery(query, [user_id, collection]);
    };

    try {
        const getFigurinesResult = await getFigurines();
        const getFigurinesUserResult = await getFigurinesUser();

        if (getFigurinesResult) {
            res.json({ success: true, figurines: getFigurinesResult, figurinesUser: getFigurinesUserResult });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// Endpoint POST '/getFigurine' => Collection : Affiche les figurines d'un collection 
app.post("/getFigurine", authenticateToken, async (req, res) => {
    const { figurine_id } = req.body;

    const getFigurine = () => {
        const query = "select collection_name, figurine_name, figurine_box, figurine_numero, figurine_reference, figurine_special_feature from collections_datas where figurine_id=? ";
        return executeQuery(query, [figurine_id]);
    };

    try {
        const getFigurineResult = await getFigurine();

        if (getFigurineResult && getFigurineResult.length != 0) {
            res.json({ success: true, figurine: getFigurineResult });
        } else {
            res.json({ success: false });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// Endpoint POST '/addDeleteFigurine' => Collection : Ajoute / supprime figurine de sa collection
app.post("/addDeleteFigurine", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    const { collection, figurine_id } = req.body;

    const checkFigurineExists = () => {
        const query = "SELECT figurine_id, figurine_owned, figurine_wished FROM collections WHERE user_id=? AND figurine_id=?;";
        return executeQuery(query, [user_id, figurine_id]);
    };

    const addFigurine = () => {
        const query = "insert into collections (collection_name, figurine_id, figurine_owned, date_figurine_added, user_id) values (?, ?, 1, NOW(), ?);";
        return executeQuery(query, [collection, figurine_id, user_id]);
    };

    const deleteFigurine = () => {
        const query = "DELETE FROM collections WHERE user_id=? AND figurine_id=?";
        return executeQuery(query, [user_id, figurine_id]);
    };

    const updateFigurine = () => {
        const query = "update collections set figurine_owned=not figurine_owned WHERE user_id=? AND figurine_id=?;";
        return executeQuery(query, [user_id, figurine_id]);
    };

    try {
        const checkFigurineExistsResult = await checkFigurineExists();

        // Si la figurine n'existe pas pour l'utilisateur
        if (checkFigurineExistsResult && checkFigurineExistsResult.length === 0) {
            await addFigurine();
        } else {
            if (checkFigurineExistsResult[0].figurine_wished == 1) {
                await updateFigurine();
            } else {
                await deleteFigurine();
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// Endpoint POST '/wishFigurine' => Collection : Ajoute / supprime figurine dans les souhaits
app.post("/wishFigurine", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    const { figurine_id, collection } = req.body;

    const checkIfFigurineExists = () => {
        const query = "select figurine_id, figurine_owned, figurine_wished from collections WHERE user_id=? AND figurine_id=?;";
        return executeQuery(query, [user_id, figurine_id]);
    };

    const addFigurine = () => {
        const query = "insert into collections (collection_name, figurine_id, figurine_wished, date_figurine_added, user_id) values (?, ?, 1, NOW(), ?);";
        return executeQuery(query, [collection, figurine_id, user_id]);
    };

    const updateFigurine = () => {
        const query = "update collections set figurine_wished=not figurine_wished WHERE user_id=? AND figurine_id=?;";
        return executeQuery(query, [user_id, figurine_id]);
    };

    const deleteFigurine = () => {
        const query = "DELETE FROM collections WHERE user_id=? AND figurine_id=?";
        return executeQuery(query, [user_id, figurine_id]);
    };

    try {
        const checkIfFigurineExistsResult = await checkIfFigurineExists();

        if (checkIfFigurineExistsResult.length != 0) {
            // Si il ne possedait pas la figurine et qu'il la voulait, on supprime la figurine sinon on inverse la valeur wished, car il l'a possède et la re-souhaite
            if (checkIfFigurineExistsResult[0].figurine_wished == 1 && checkIfFigurineExistsResult[0].figurine_owned == 0) {
                await deleteFigurine();
            } else {
                await updateFigurine();
            }
        } else {
            await addFigurine();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});



// Endpoint POST '/searchFigurines' => search : Rechercher les figurines
app.post("/searchFigurines", authenticateToken, async (req, res) => {
    let { searchParam } = req.body;
    searchParam = searchParam.replace(/ /g, '%');

    const searchFigurines = () => {
        const query = "select collection_name, figurine_id, figurine_name, figurine_image, figurine_reference from collections_datas where figurine_name like CONCAT('%', ?, '%') OR figurine_reference=? OR figurine_image like CONCAT('%', ?, '%') limit 50;";
        return executeQuery(query, [searchParam, searchParam, searchParam]);
    };


    try {
        const searchFigurinesResult = await searchFigurines();
        res.json({ success: true, figurines: searchFigurinesResult });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// Endpoint POST '/getLastFigurines' => Dashboard : Récupère les dernieres figurines ajoutées par l'utilisateur
app.post("/getLastFigurines", authenticateToken, async (req, res) => {
    const { user_id } = req.user;

    const getRecentlyAdded = () => {
        const query = "select cd.figurine_id, cd.figurine_name, c.collection_name, cd.figurine_image from view_collections c join collections_datas cd on c.figurine_id=cd.figurine_id where user_id=? order by date_figurine_added DESC limit 5;";
        return executeQuery(query, [user_id]);
    };

    try {
        let getRecentlyAddedResult = await getRecentlyAdded();

        if (getRecentlyAddedResult) {
            res.json({ success: true, recentlyAddedResult: getRecentlyAddedResult });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


app.post("/getParcelData", authenticateToken, async (req, res) => {
    const { user_id } = req.user;

    const getParcelUser = () => {
        const query = "select p.figurine_id, figurine_name, figurine_image, tracking_number, donnees from view_parcel_tracking p join collections_datas cd on p.figurine_id=cd.figurine_id where user_id=? order by date_parcel_added DESC limit 5;";
        return executeQuery(query, [user_id]);
    };

    try {
        let getParcelUserResult = await getParcelUser();

        for (let i = 0; i < getParcelUserResult.length; i++) {
            getParcelUserResult[i].donnees = JSON.parse(getParcelUserResult[i].donnees);
        }
        res.json({ success: true, getParcelUserResult: getParcelUserResult });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

async function suiviParcel(numSuivi) {
    const { firefox } = require('playwright');

    try {
        const browser = await firefox.launch({ headless: true });
        const context = await browser.newContext({
            locale: 'fr-FR', // Paramètre régional pour le français
        });
        const page = await context.newPage();

        await page.goto('https://parcelsapp.com/fr/tracking/' + numSuivi);

        const elements = await page.$$('.event-content strong');
        let tab = [];

        for (const element of elements) {
            const textContent = await page.evaluate(el => el.textContent, element);
            tab.push({ suivi: textContent.trim() })
        }
        await browser.close();
        return tab;

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}

// Endpoint POST '/AddFigurineParcel' => Dashboard : Ajoute la figurine pour le suivi
app.post("/AddFigurineParcel", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    const { suivi, figurine_id } = req.body;

    const suiviParcelResult = await suiviParcel(suivi);

    const addFigurineParcel = () => {
        const query = "insert into parcel_tracking (tracking_number, figurine_id, donnees, date_parcel_added, user_id) values (?, ?, ?, NOW(), ?);";
        return executeQuery(query, [suivi, figurine_id, JSON.stringify(suiviParcelResult), user_id]);
    };

    try {
        await addFigurineParcel();

        res.json({ success: true });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Endpoint POST '/deleteParcel' => Dashboard : Supprimer une figurine de suivi de colis
app.post("/deleteParcel", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    const { figurine_id } = req.body;

    const deleteFigurineParcel = () => {
        const query = "delete from parcel_tracking where figurine_id=? and user_id=?";
        return executeQuery(query, [figurine_id, user_id]);
    };

    try {
        await deleteFigurineParcel();
        res.json({ success: true });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Endpoint POST '/refreshParcels' => Dashboard : Rafraichir les infos des suivi de colis
app.post("/refreshParcels", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    const { figurine_id } = req.body;

    const selectParcelsUser = () => {
        const query = "select tracking_number, figurine_id from parcel_tracking where user_id=?";
        return executeQuery(query, [user_id]);
    };
    const deleteParcel = (figurine_id) => {
        const query = "delete from parcel_tracking where figurine_id=? and user_id=?";
        return executeQuery(query, [figurine_id, user_id]);
    };
    const insertParcel = (tracking_number, figurine_id, suiviParcelResult) => {
        const query = "insert into parcel_tracking (tracking_number, figurine_id, donnees, date_parcel_added, user_id) values (?, ?, ?, NOW(), ?);";
        return executeQuery(query, [tracking_number, figurine_id, JSON.stringify(suiviParcelResult), user_id]);
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
});