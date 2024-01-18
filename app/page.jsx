"use client"
import ProtectedPages from "@/lib/protectedPages"
import { useEffect, useState } from "react";
import ParcelTracking from "./components/ParcelTracking";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  ProtectedPages();

  const { data: session } = useSession()
  // console.log(session);

  const [recentlyAdded, setRecentlyAdded] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getLastFigurines", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + process.env.TOKEN_VERCEL
          }
        });
        const data = await response.json();

        setRecentlyAdded(data.recentlyAddedResult);
        console.log(recentlyAdded);

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
          {recentlyAdded && recentlyAdded.map((item, index) => (
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