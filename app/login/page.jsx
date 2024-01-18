"use client"

import React, { useState } from "react";
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const router = useRouter()
    const { data: session } = useSession()
    // console.log(session);
    
    const handleClick = async () => {
        const credentials = {
            username: username,
            password: password,
        };

        const result = await signIn('credentials', {
            ...credentials,
            redirect: false,
        });
        if (result.ok) {
            router.push("/")
        } else {
            setMessage("Mauvais identifiant")
        }

    }

    return (
        <section>
            <div>
                <label>Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Mot de passe</label>
                <input type="text" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <input type="submit" value="Se connecter" onClick={handleClick} />

            <button onClick={() => signIn("google")}>Sign in with Google</button>

            <button onClick={() => signOut()}>Sign Out</button>
            {message}

        </section>
    )
}

export default Login;