"use client"
import ProtectedPages from "@/pages/protectedPages";
import { useEffect, useState } from "react";

const Collection = ({ params }) => {
    ProtectedPages();
    
    let collection = params.collection;

    const [donnees, setDonnees] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/getFigurinesCollection?collection=${collection}`);
            const data = await response.json();

            // Ajoute et vérifie si la figurine lui appartient
            const updatedDonnees = data.figurines.map((item) => {
                const figurine_owned = data.figurinesUser.some((el) => el.figurine_id === item.figurine_id && el.figurine_owned == 1);

                const figurine_wished = data.figurinesUser.some((el) => el.figurine_id === item.figurine_id && el.figurine_wished == 1);

                return {
                    collection_name: item.collection_name,
                    figurine_id: item.figurine_id,
                    figurine_name: item.figurine_name,
                    figurine_image: item.figurine_image,
                    figurine_owned: figurine_owned,
                    figurine_wished: figurine_wished,
                };
            });
            setDonnees(updatedDonnees);
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddDeleteFigurine = async (collection, figurine_id) => {
        try {
            await fetch("/api/addDeleteFigurine", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    collection,
                    figurine_id
                }),
            });

            fetchData();
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    }

    const handleClickWishFigurine = async (collection, figurine_id) => {
        try {
            await fetch("/api/wishFigurine", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    collection,
                    figurine_id
                }),
            })

            fetchData();
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    }

    return (

        <section id="figurines">
            {donnees.map((item, index) => (
                <div className="bloc-figurine" key={index}>
                    <span className={"addFigurine" + (item.figurine_owned == true ? " checked" : "")} onClick={() => handleAddDeleteFigurine(item.collection_name, item.figurine_id)}></span>
                    <span className={"addWish" + (item.figurine_wished == true ? " checked" : "")} onClick={() => handleClickWishFigurine(item.collection_name, item.figurine_id)}></span>


                    <div className="figurine" >
                        <a className="figurineImage" href={`/figurine/${item.figurine_id}`}>
                            <img src={item.figurine_image} alt="figurine" />
                        </a>
                        <div className="figurineName">
                            <span>{item.figurine_name}</span>
                        </div>
                    </div>

                </div>
            ))}
        </section>

    )
}

export default Collection;