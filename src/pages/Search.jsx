import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TokenContext } from "../hooks/TokenContext";
import axios from "axios";

const Search = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('s');
    const [donnees, setDonnees] = useState([]);

    const { token } = useContext(TokenContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("http://localhost:3001/searchFigurines", {
                    searchParam
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                })

                setDonnees(response.data.figurines);

            } catch (error) {
                console.error("Erreur lors de la requete ", error);
            }
        }
        fetchData();
    }, [searchParam])


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