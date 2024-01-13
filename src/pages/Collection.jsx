import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TokenContext } from "../hooks/TokenContext";
import axios from "axios";


const Collection = () => {
    const apiUrl = import.meta.env.VITE_LINK;

    let { collection } = useParams();
    const navigate = useNavigate()

    const [donnees, setDonnees] = useState([]);

    const { token } = useContext(TokenContext);

    const fetchData = async () => {
        try {
            const response = await axios.post(apiUrl + "/getFigurinesCollection", { collection }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.data.figurines.length === 0) {
                navigate("/");
            }

            // Ajoute et vérifie si la figurine lui appartient
            const updatedDonnees = response.data.figurines.map((item) => {
                const figurine_owned = response.data.figurinesUser.some((el) => el.figurine_id === item.figurine_id && el.figurine_owned == 1);

                const figurine_wished = response.data.figurinesUser.some((el) => el.figurine_id === item.figurine_id && el.figurine_wished == 1);

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
            await axios.post(apiUrl + "/addDeleteFigurine", {
                collection,
                figurine_id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            fetchData();
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    }

    const handleClickWishFigurine = async (collection, figurine_id) => {
        try {
            await axios.post(apiUrl + "/wishFigurine", {
                collection,
                figurine_id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
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