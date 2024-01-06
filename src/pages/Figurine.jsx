import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TokenContext } from "../hooks/TokenContext";
import axios from "axios";

const Figurine = () => {
    const { figurine_id } = useParams()
    const { token } = useContext(TokenContext);
    const [message, setMessage] = useState("");
    const [figurineDatas, setFigurineDatas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("http://localhost:3001/getFigurine", {
                    figurine_id
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                })

                if (response.data.success) {
                    setFigurineDatas(response.data.figurine)
                } else {
                    setMessage("Aucune Pop")
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        }
        fetchData();
    }, [])

    return (
        <section id="figurines-presentation">
            {figurineDatas && figurineDatas.map((item, index) => (
                <React.Fragment key={index}>
                    <div id="figurine-presentation">
                        <div id="boxFigurine">
                            <img src={item.figurine_box} alt="box figurine" />
                        </div>
                        <div id="infosFigurine">
                            <h2>{item.figurine_name}</h2>
                            <div id="features">
                                <span>Collection : {item.collection_name}</span>
                                <span>Numero : {item.figurine_numero}</span>
                                <span>Référence : {item.figurine_reference}</span>
                                <span>Caractéristique : {item.figurine_special_feature}</span>
                            </div>
                        </div>
                    </div>
                    <div id="market">
                        <a target="_blank" href={`https://www.amazon.fr/s?k=figurine funko pop ${item.collection_name} ${item.figurine_name}`}>Amazon</a>
                        <a target="_blank" href={`https://www.vinted.fr/catalog?search_text=figurine funko pop ${item.collection_name} ${item.figurine_name}&order=price_low_to_high`}>Vinted</a>
                        <a target="_blank" href={`https://www.fnac.com/SearchResult/ResultList.aspx?Search=figurine funko pop ${item.collection_name} ${item.figurine_name}`}>FNAC</a>
                        <a target="_blank" href={`https://www.micromania.fr/on/demandware.store/Sites-Micromania-Site/default/Search-Show?q=figurine funko pop ${item.collection_name} ${item.figurine_name}`}>Mcromania</a>
                        <a target="_blank" href={`https://www.cultura.com/search/results?search_query=figurine funko pop ${item.collection_name} ${item.figurine_name}`}>Cultura</a>
                        <a target="_blank" href={`https://fr.shopping.rakuten.com/search/figurine funko pop ${item.collection_name} ${item.figurine_name}`}>Rakuten</a>
                    </div>
                </React.Fragment>
            ))}
        </section>
    )
}

export default Figurine;