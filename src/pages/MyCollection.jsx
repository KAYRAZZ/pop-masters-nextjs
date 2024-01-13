import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../hooks/TokenContext";
import axios from "axios";

const MyCollection = () => {
    const apiUrl = import.meta.env.VITE_LINK;

    const { token } = useContext(TokenContext);
    const [collection, setCollection] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(apiUrl + "/getCollectionUser", null, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCollection(response.data.collection);

            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        }
        fetchData();
    }, [])


    return (
        <section id='collections'>
            {collection && collection.map((item, index) => (
                <a key={index} className='collection' href={"/collection/" + item.collection_name}>
                    {item.collection_name}
                </a>
            ))}
        </section>
    )
}
export default MyCollection;