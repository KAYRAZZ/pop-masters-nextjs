import React, { useEffect, useRef, useState } from "react";


const ParcelTracking = () => {

    const [figurines, setFigurines] = useState([]);
    const [figurine, setFigurine] = useState([]);
    const [inputValue, setInputValue] = useState();
    const [inputSuivi, setInputSuivi] = useState();
    const [parcelTracking, setParcelTracking] = useState([]);
    const [showCloseWindow, setShowCloseWindow] = useState(false);

    let [actualise, setActualise] = useState(0)

    let [figurineAdded, setFigurineAdded] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/getParcelData");
                const data = await response.json();
                setParcelTracking(data.getParcelUserResult)

            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        }
        fetchData();
    }, [figurineAdded, figurines, actualise])

    const refSearchFigurine = useRef(null);
    const handleOpenCloseWindow = () => {

        refSearchFigurine.current.style.display = !showCloseWindow ? "block" : "none";

        setShowCloseWindow(!showCloseWindow)
    }

    const handleSearch = async (event) => {
        if ((event.key === 'Enter' || event.type === 'click') && inputValue) {
            try {
                const response = await fetch(`/api/searchFigurines?searchParam=${inputValue}`);
                const data = await response.json();
                setFigurines(data.figurines);

            } catch (error) {
                console.error("Erreur lors de la requete ", error);
            }
        }
    }

    const handleDeleteParcel = async (figurine_id) => {
        try {
            await fetch("/api/deleteParcel", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    figurine_id
                }),
            })
            setActualise(prev => prev + 1);

        } catch (error) {
            console.error("Erreur lors de la requete ", error);
        }
    }

    const refBlocParcelTracking = useRef(null);
    const handleRefreshParcels = async () => {
        try {
            let span = document.createElement("span");
            span.id = "loader-parcel";
            refBlocParcelTracking.current.appendChild(span);

            await fetch("/api/refreshParcels")
            setActualise(prev => prev + 1);
            refBlocParcelTracking.current.removeChild(span)
        } catch (error) {
            console.error("Erreur lors de la requete ", error);
        }
    }

    const handleAddParcel = async (event) => {
        if ((event.key === 'Enter' || event.type === 'click') && inputSuivi && figurine.length !== 0) {
            let span;
            try {
                if (refSearchFigurine.current) {
                    span = document.createElement("span");
                    span.id = "loader-parcel";
                    refSearchFigurine.current.appendChild(span);
                }

                await fetch("/api/addFigurineParcel", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        suivi: inputSuivi,
                        figurine_id: figurine.figurine_id
                    }),
                });

                setFigurineAdded(prevValue => prevValue + 1)
                handleOpenCloseWindow()

            } catch (error) {
                console.error("Erreur lors de la requete ", error);
            } finally {
                // Supprimer le span s'il existe
                if (refSearchFigurine.current && span) {
                    refSearchFigurine.current.removeChild(span);
                }
            }
        } else {
            console.log("afficher msg : Figurine non séléctionnée");
        }
    }

    const handleFigurineSelected = (collection, name, image, reference, figurine_id) => {
        setFigurine({ collection, name, image, reference, figurine_id });
    }

    return (
        <div ref={refBlocParcelTracking} className="container" id="bloc-parcel-tracking">
            <span id="spanSuiviColis">Suivi des colis</span>
            <input id="addParcel" type="button" value="Ajouter un suivi" onClick={handleOpenCloseWindow} />
            <input id="refreshParcel" type="button" value="Actualiser" onClick={handleRefreshParcels} />

            {/* Affiche les parcels de l'utilisateur */}
            <div id="parcel-tracking">
                {parcelTracking.map((item, index) => (
                    <div key={index} className="bloc-figurine-parcel" >
                        <a className="little-figurine figurine-parcel" href={`/ figurine / ${item.figurine_id}`}>
                            <img src={item.figurine_image} />
                            <div>
                                <span>{item.figurine_name}</span>
                            </div>
                        </a>
                        <div className="bloc-parcel-data">
                            <div className="parcel-data">
                                {item.donnees.map((itemSuivi, index) => (
                                    <div key={index}>
                                        {itemSuivi.suivi}
                                    </div>
                                ))}
                            </div>
                            <span className="deleteParcel" onClick={() => handleDeleteParcel(item.figurine_id)}></span>
                        </div>
                    </div>

                ))}
            </div>



            {/* Affichage pour inserer le numero de suivi et la figurine */}
            <div ref={refSearchFigurine} style={{ display: "none" }} id="searchFigurineParcel">
                <span id="closeWindow" onClick={handleOpenCloseWindow}></span>
                <span>Séléctionnez une figurine et entrez le numéro de suivi</span>
                <div id="search">
                    <input type="text" placeholder="Figurine | Référence" onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleSearch} />
                    <input type="submit" onClick={handleSearch} value="Rechercher" />
                </div>

                <div id="search">
                    <input type="text" placeholder="Numéro de suivi" onChange={(e) => setInputSuivi(e.target.value)} onKeyDown={handleAddParcel} />
                    <input type="submit" value="Ajouter" onClick={handleAddParcel} />
                </div>

                <div id="searchResult">
                    {figurines && figurines.map((item, index) => (
                        <div className="little-figurine" key={index} onClick={() => handleFigurineSelected(item.collection_name, item.figurine_name, item.figurine_image, item.figurine_reference, item.figurine_id)}>
                            <img src={item.figurine_image} />
                            <div>
                                <span>{item.figurine_name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default ParcelTracking;