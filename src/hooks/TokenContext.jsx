import React, { createContext, useEffect, useState } from "react";

const TokenContext = createContext();

const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "a");
    useEffect(() => {
        localStorage.setItem('token', token);
    }, [token]);

    const contextValue = {
        token,
        setToken,
    };

    return <TokenContext.Provider value={contextValue}>{children}</TokenContext.Provider>;
};

export { TokenProvider, TokenContext };
