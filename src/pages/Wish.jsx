import { useContext, useEffect, useState } from "react"
import { TokenContext } from "../hooks/TokenContext";

import axios from "axios";

const Wish = () => {
    const [donnees, setDonnees] = useState([]);
    const [message, setMessage] = useState("");
    const { token } = useContext(TokenContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("http://localhost:3001/getFigurinesWish", null, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.data.success && response.data.figurines.length === 0) {
                    setMessage("Vous n'avez aucune POP de souhaitée")
                }

                setDonnees(response.data.figurines);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };
        fetchData();
    }, [donnees])

    const handleClickWishFigurine = async (collection, figurine_id) => {
        try {
            await axios.post("http://localhost:3001/wishFigurine", {
                collection,
                figurine_id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

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