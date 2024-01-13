import React, { useContext, useState } from "react";
import axios from "axios";
import { TokenContext } from "../hooks/TokenContext";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
    // const apiUrl = import.meta.env.VITE_LINK;
    const apiUrl = process.env.VITE_LINK;
    console.log(apiUrl);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { token, setToken } = useContext(TokenContext);
    const navigate = useNavigate()
    const handleClick = async () => {
        const response = await axios.post(apiUrl+"/login", {
            username,
            password
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        if (response.data.success) {
            setToken(response.data.token)
            setMessage("Connecter avec succès")
            navigate("/")

        } else {
            setMessage("Mauvais identifiant")
        }
        console.log(response.data.success);
    }

    return (
        <section>
            <div>
                <label>Email</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Mot de passe</label>
                <input type="text" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <input type="submit" value="Se connecter" onClick={handleClick} />

            {message}
        </section>
    )
}

export default Login;