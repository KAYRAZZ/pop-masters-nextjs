"use client"

import ProtectedPages from "@/pages/protectedPages";
import { useEffect, useState } from "react"

const Wish = () => {
    ProtectedPages();
    const [donnees, setDonnees] = useState([]);
    const [message, setMessage] = useState("");
    let [dataChange, setDataChange] = useState(0)
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/getFigurinesWish");
                const data = await response.json();

                if (data.success && data.figurines.length === 0) {
                    setMessage("Vous n'avez aucune POP de souhaitée")
                }

                setDonnees(data.figurines);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };
        fetchData();
    }, [dataChange])

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
            setDataChange(prev => prev + 1)
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    }

    return (
        <section id="figurines">
            {donnees.length != 0 ? donnees.map((item, index) => (
                <div className="bloc-figurine" key={index}>
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
            )) :
                <div>{message}</div>
            }
        </section>
    )
}

export default Wish