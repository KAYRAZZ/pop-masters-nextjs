"use client"

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Figurine = ({ params }) => {

    const figurine_id = params.figurine_id;

    const [message, setMessage] = useState("");
    const [figurineDatas, setFigurineDatas] = useState([]);
    const [figurineDataUser, setFigurineDatasUser] = useState([]);
    const [isChange, setIsChange] = useState(false);
    const [priceFigurine, setPriceFigurine] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/getFigurine?figurine_id=${figurine_id}`)
                const data = await response.json();
                if (data.success) {
                    setFigurineDatas(data.figurine)
                    setFigurineDatasUser(data.figurineUser)
                    setPriceFigurine(data.figurineUser[0].purchase_price);
                } else {
                    setMessage("Aucune Pop")
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        }
        fetchData();
    }, [isChange])

    const handleChangePrice = async () => {
        if (isChange && priceFigurine) {
            try {
                await fetch("/api/changePriceFigurine", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        figurine_id,
                        priceFigurine
                    }),
                })
            } catch (error) {
                console.error('Erreur :', error);
            }
        }
        setIsChange(!isChange);
    }

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

                                {figurineDataUser.length > 0 && (item.figurine_id === figurineDataUser[0]["figurine_id"]) &&
                                    <div id="bloc-price">
                                        <span>Acheté pour : </span>
                                        <u>
                                            {isChange ?
                                                <input type="text" value={priceFigurine || ""} onChange={(e) => setPriceFigurine(e.target.value)} />
                                                :
                                                <span>
                                                    {figurineDataUser[0]["purchase_price"] === null ? "Non renseigné" : figurineDataUser[0]["purchase_price"]} €
                                                </span>}
                                        </u>
                                        <img src={isChange ? "/assets/check.png" : "/assets/pencil.png"} onClick={handleChangePrice} />
                                    </div>
                                }
                            </div>
                        </div>

                        <div id="market">
                            <a target="_blank" href={`https://www.amazon.fr/s?k=figurine funko pop ${item.collection_name} ${item.figurine_name}`}>
                                <img src="/assets/amazon_logo.png" />
                            </a>
                            <a target="_blank" href={`https://www.vinted.fr/catalog?search_text=figurine funko pop ${item.collection_name} ${item.figurine_name}&order=price_low_to_high`}>
                                <img src="/assets/vinted_logo.png" />
                            </a>
                            <a target="_blank" href={`https://www.fnac.com/SearchResult/ResultList.aspx?Search=figurine funko pop ${item.collection_name} ${item.figurine_name}`}>
                                <img src="/assets/fnac_logo.png" />
                            </a>
                            <a target="_blank" href={`https://www.micromania.fr/on/demandware.store/Sites-Micromania-Site/default/Search-Show?q=figurine funko pop ${item.collection_name} ${item.figurine_name}`}>
                                <img src="/assets/micromania_logo.png" />
                            </a>
                            <a target="_blank" href={`https://www.cultura.com/search/results?search_query=figurine funko pop ${item.collection_name} ${item.figurine_name}`}>
                                <img src="/assets/cultura_logo.png" />
                            </a>
                            <a target="_blank" href={`https://www.leboncoin.fr/recherche?text=figurine funko pop ${item.collection_name} ${item.figurine_name}`}>
                                <img src="/assets/leboncoin_logo.png" />
                            </a>
                            <a target="_blank" href={`https://fr.shopping.rakuten.com/search/figurine funko pop ${item.collection_name} ${item.figurine_name}`}>
                                <img src="/assets/rakuten_logo.png" />
                            </a>
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </section>
    )
}

export default Figurine;