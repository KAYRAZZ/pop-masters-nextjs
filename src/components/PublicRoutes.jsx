import { Navigate, Outlet } from "react-router-dom";
import { TokenContext } from "../hooks/TokenContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";


const PublicRoutes = () => {
    const { token } = useContext(TokenContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Make asynchronous calls here to check authentication
        const checkAuthentication = async () => {
            try {
                // Example: Check authentication using the token
                const response = await axios.post("http://localhost:3001/authenticated", null, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (response.data.success) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
            }
        };

        checkAuthentication();
    }, [token]);

    return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoutes;
