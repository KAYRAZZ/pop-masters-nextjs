import { useContext, useState } from "react";
import axios from "axios";
import { TokenContext } from "../hooks/TokenContext";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { token, setToken } = useContext(TokenContext);

    const handleClick = async () => {
        const response = await axios.post("http://localhost:3001/login", { token }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        if (response.data.success) {
            setToken(user.accessToken)
            setMessage("Connecter avec succès")
        } else {
            setMessage("Mauvais identifiant")
        }
    }

    return (
        <section>
            <div>
                <label>Email</label>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
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