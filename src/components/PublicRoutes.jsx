import { Navigate } from "react-router-dom";
import { TokenContext } from "../hooks/TokenContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Login from "../pages/Login";

const PublicRoutes = () => {
    const { token } = useContext(TokenContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.post("http://localhost:3001/authenticated", null, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setIsAuthenticated(response.data.success);

            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuthentication();
    }, [token]);

    return isAuthenticated ? <Navigate to="/" /> : <Login />;
};

export default PublicRoutes;
