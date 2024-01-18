"use client"
import ProtectedPages from "@/pages/protectedPages";
import { useEffect, useState } from "react";

const MyCollection = () => {
    ProtectedPages();
    
    const [collection, setCollection] = useState([""]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/getCollectionUser");
                const data = await response.json();

                setCollection(data.collection);

            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        }
        fetchData();
    }, [])


    return (
        <section id='collections'>
            {collection && collection.map((item, index) => (
                <a key={index} className='collection' href={"/collections/" + item.collection_name}>
                    {item.collection_name}
                </a>
            ))}
        </section>
    )
}
export default MyCollection;