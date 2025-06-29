import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Header() {
    const {user, setUser} = useAuth()
    const navigate = useNavigate()

    const logout = async () => {
        await authService.logout()
        setUser(null)
        navigate('/login')
    }

    return (
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
            <Link to="/" className="text-2xl font-bold text-black hover:underline">DevScribe</Link>
            <nav>
                {user ? (
                    <>
                        <Link to="/create" className="mr-4 text-blue-600 hover:underline">Write</Link>
                        <button onClick={logout} className="text-red-500 hover:underline">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="mr-4 text-blue-600 hover:underline">Login</Link>
                        <Link to="/signup" className="text-blue-600 hover:underline">Signup</Link>
                    </>
                )}
            </nav>
        </header>
    )
}