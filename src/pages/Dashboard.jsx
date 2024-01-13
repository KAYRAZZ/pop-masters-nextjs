import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../hooks/TokenContext";
import axios from 'axios';
import ParcelTracking from "../components/ParcelTracking";

const Dashboard = () => {
    const apiUrl = import.meta.env.VITE_LINK;

    const [recentlyAdded, setRecentlyAdded] = useState([""]);

    const { token } = useContext(TokenContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(apiUrl + "/getLastFigurines", null, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setRecentlyAdded(response.data.recentlyAddedResult);

            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };

        fetchData();
    }, []);

    return (
        <section id="dashboard">
            <ParcelTracking />

            <div className="container" id="bloc-recentlyAdded">
                <span id="recentlyAdded">Les 5 dernières POP ajoutées à la collection</span>
                <div id="little-figurines">
                    {recentlyAdded.map((item, index) => (
                        <a key={index} className="little-figurine" href={`/figurine/${item.figurine_id}`}>
                            <img src={item.figurine_image} />
                            <div>
                                <span>{item.figurine_name}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>


        </section>
    )
}

export default Dashboard;