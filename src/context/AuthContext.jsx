import { createContext, useEffect, useState, useContext } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        authService.getCurrentUser().then(user => {
            setUser(user)
            setLoading(false)
        })
    }, []);

    return (
        <AuthContext.Provider value={{user, setUser, loading}}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)