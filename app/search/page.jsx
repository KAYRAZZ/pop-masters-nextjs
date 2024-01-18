"use client"
import { useSearchParams } from 'next/navigation'

import { useEffect, useState } from "react";

const Search = () => {
    const searchParams = useSearchParams()
    const search = searchParams.get('s')

    const [donnees, setDonnees] = useState([]);
    let [isChange, setIsChange] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/searchFigurines?searchParam=${search}`)
                const data = await response.json();

                setDonnees(data.figurines);

            } catch (error) {
                console.error("Erreur lors de la requete ", error);
            }
        }

        fetchData();
    }, [search, isChange]);

    const handleAddDeleteFigurine = async (collection, figurine_id) => {
        try {
            await fetch("/api/addDeleteFigurine", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({
                    collection,
                    figurine_id
                }),
            })
            setIsChange(isChange++)

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

export default Search;