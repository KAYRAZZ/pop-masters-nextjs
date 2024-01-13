const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require('dotenv').config();


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const secretKey = process.env.TOKEN;

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
    res.json({ success: true });
})

// Endpoint POST '/login' => loginForm : Se connecter
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Cherche si l'utilisteur et le mot de passe existe pour un utilisateur
    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });
        console.log(user);
        if (user && await bcrypt.compare(password, user.password)) {
            // Créer le token, et sauvegarde le username dans le token 
            const token = jwt.sign({ user_id: user.user_id, username: user.username }, secretKey);
            res.json({ success: true, message: 'Authentication successful', token });
        } else {
            res.json({ success: false, message: 'Incorrect username or password' });
        }

    } catch (error) {
        console.error('Erreur de connexion:', error);
    }
});

// Endpoint POST '/getCollections' => Collections : Récupère les collections 
app.post("/getCollections", authenticateToken, async (req, res) => {
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
            res.json({ success: true, datas: distinctCollectionNames });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Endpoint POST '/getCollectionUser' => myCollection : récupère la collection de l'utilisateur  
app.post("/getCollectionUser", authenticateToken, async (req, res) => {
    const { user_id } = req.user;

    try {
        const getCollectionUser = await prisma.collection.findMany({
            select: {
                collection_name: true,
            },
            distinct: ['collection_name'],
            where: {
                user_id: user_id,
                figurine_owned: true,
            },
            take: 50,
        });

        if (getCollectionUser) {
            res.json({ success: true, collection: getCollectionUser });
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

    try {
        const getFigurines = await prisma.collectionsDatas.findMany({
            select: {
                collection_name: true,
                figurine_id: true,
                figurine_name: true,
                figurine_image: true,
                figurine_special_feature: true
            },
            where: {
                collection_name: collection
            }
        })
        const getFigurinesUser = await prisma.collection.findMany({
            select: {
                figurine_id: true,
                figurine_owned: true,
                figurine_wished: true
            },
            where: {
                collection_name: collection,
                user_id: user_id
            }
        })

        if (getFigurines && getFigurinesUser) {
            res.json({ success: true, figurines: getFigurines, figurinesUser: getFigurinesUser });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// amodifier
// Endpoint POST '/getFigurinesWish' => Wish : Affiche les figurines souhaitées par l'utilisateur 
app.post("/getFigurinesWish", authenticateToken, async (req, res) => {
    const { user_id } = req.user;

    try {
        const getFigurinesWish = await prisma.$queryRaw`select c.figurine_id, figurine_name, figurine_image, figurine_wished from collection c join collectionsDatas cd on c.figurine_id=cd.figurine_id where user_id=${user_id} and figurine_wished=true;`;

        res.json({ success: true, figurines: getFigurinesWish });

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Endpoint POST '/getFigurinesCollection' => Collection : Affiche les figurines d'une collection 
app.post("/getFigurinesCollection", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    const { collection } = req.body;

    try {
        const getFigurinesResult = await prisma.collectionsDatas.findMany({
            where: {
                collection_name: collection
            },
            select: {
                collection_name: true,
                figurine_id: true,
                figurine_name: true,
                figurine_image: true,
                figurine_special_feature: true
            }
        });
        const getFigurinesUserResult = await prisma.collection.findMany({
            where: {
                collection_name: collection,
                user_id: user_id
            },
            select: {
                figurine_id: true,
                figurine_owned: true,
                figurine_wished: true,
            }
        });

        if (getFigurinesResult) {
            res.json({ success: true, figurines: getFigurinesResult, figurinesUser: getFigurinesUserResult });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// Endpoint POST '/getFigurine' => Collection : Affiche une figurine 
app.post("/getFigurine", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    const { figurine_id } = req.body;

    try {
        const getFigurineResult = await prisma.collectionsDatas.findMany({
            where: {
                figurine_id: figurine_id
            },
            select: {
                collection_name: true,
                figurine_id: true,
                figurine_name: true,
                figurine_box: true,
                figurine_numero: true,
                figurine_reference: true,
                figurine_special_feature: true
            }
        });
        const getFigurineUserResult = await prisma.collection.findMany({
            where: {
                figurine_id: figurine_id,
                user_id: user_id
            },
            select: {
                figurine_id: true,
                purchase_price: true
            }
        });

        if (getFigurineResult && getFigurineResult.length != 0) {
            res.json({ success: true, figurine: getFigurineResult, figurineUser: getFigurineUserResult });
        } else {
            res.json({ success: false });
        }

    } catch (error) {
        console.error('Erreur de requête:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Endpoint POST '/changePriceFigurine' => Figurine : Modifie le prix de la figurine de l'utilisateur 
app.post("/changePriceFigurine", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    const { figurine_id, priceFigurine } = req.body;

    const changePriceFigurine = () => {
        const query = "update collections set purchase_price=? where figurine_id=? and user_id=?";
        return executeQuery(query, [priceFigurine, figurine_id, user_id]);
    };

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
});


// Endpoint POST '/addDeleteFigurine' => Collection : Ajoute / supprime figurine de sa collection
app.post("/addDeleteFigurine", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
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
});


// Endpoint POST '/wishFigurine' => Collection : Ajoute / supprime figurine dans les souhaits
app.post("/wishFigurine", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
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
});



// Endpoint POST '/searchFigurines' => search : Rechercher les figurines
app.post("/searchFigurines", authenticateToken, async (req, res) => {
    let { searchParam } = req.body;
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
});


// Endpoint POST '/getLastFigurines' => Dashboard : Récupère les dernieres figurines ajoutées par l'utilisateur
app.post("/getLastFigurines", authenticateToken, async (req, res) => {
    const { user_id } = req.user;

    try {
        let getRecentlyAddedResult = await prisma.$queryRaw`select cd.figurine_id, cd.figurine_name, c.collection_name, cd.figurine_image from collection c join collectionsDatas cd on c.figurine_id=cd.figurine_id where user_id=${user_id} order by date_figurine_added DESC limit 5;`;

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

    try {
        let getParcelUserResult = await prisma.$queryRaw`select p.figurine_id, figurine_name, figurine_image, tracking_number, donnees from parcelTracking p join collectionsDatas cd on p.figurine_id=cd.figurine_id where user_id=${user_id} order by date_parcel_added DESC limit 5;`;

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
            locale: 'fr-FR',
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

    try {
        console.log(figurine_id);
        await prisma.parcelTracking.create({
            data: {
                figurine_id,
                tracking_number: suivi,
                donnees: JSON.stringify(suiviParcelResult),
                date_parcel_added: new Date(),
                user_id
            }
        });

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
});

// Endpoint POST '/refreshParcels' => Dashboard : Rafraichir les infos des suivi de colis
app.post("/refreshParcels", authenticateToken, async (req, res) => {
    const { user_id } = req.user;

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
                user_id,
                figurine_id
            }
        })
    };
    const insertParcel = (tracking_number, figurine_id, suiviParcelResult) => {
        return prisma.parcelTracking.create({
            data: {
                tracking_number,
                figurine_id,
                donnees: JSON.stringify(suiviParcelResult),
                user_id
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
});