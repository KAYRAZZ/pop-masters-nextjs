import { useNavigate } from "react-router-dom";
import { TokenContext } from "../hooks/TokenContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Login from "../pages/Login";

const PrivateRoutes = ({ element: Element }) => {
    const apiUrl = import.meta.env.VITE_LINK;

    const { token } = useContext(TokenContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {

        const checkAuthentication = async () => {
            try {
                const response = await axios.post(apiUrl + "authenticated", null, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setIsAuthenticated(response.data.success);

                if (!response.data.success) {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
            }
        };
        checkAuthentication();
    }, [token, navigate]);

    return isAuthenticated ? <Element /> : null;
}
export default PrivateRoutes;
