"use client"
import React, { useState, useEffect } from 'react';

const Collections = () => {
    const [donnees, setDonnees] = useState([]);
    const [search, setSearch] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("api/getCollections");
                const data = await response.json();

                setDonnees(data.collections);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };

        fetchData();
    }, []);

    const searchInput = (searchValue) => {
        let categoryTrouvees = donnees.filter(
            el => el.collection_name.toLowerCase().includes(searchValue.toLowerCase())
        );
        categoryTrouvees = categoryTrouvees.length === 0 ? null : categoryTrouvees;
        setSearch(categoryTrouvees);
    }

    return (
        <section id='collections'>
            <input type="text" placeholder='Rechercher une catégorie ...' onChange={e => searchInput(e.target.value)} />

            {search === null ? (
                <p>Aucune correspondance</p>
            ) : search.length === 0 ? (
                donnees.map((element, index) => (

                    <a key={index} className='collection' href={"/collections/" + element.collection_name}>
                        {element.collection_name}
                    </a>
                ))
            ) : (
                search.map((element, index) => (
                    <a key={index} className='collection' href={"/collections/" + element.collection_name}>
                        {element.collection_name}
                    </a>
                ))
            )}
        </section>
    );
}

export default Collections;