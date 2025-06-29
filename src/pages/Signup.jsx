import { useState } from "react"
import {authService} from '../services/authService'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [name, setName] = useState('')
    const navigate = useNavigate()
    const {setUser} = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await authService.createAccount({email, password, name})
        setUser(await authService.getCurrentUser())
        navigate('/')
    } 

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
            <input 
                type="text" 
                placeholder="Name"
                onChange={e =>setName(e.target.value)}
                required
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"    
            />
            <input 
                type="email" 
                placeholder="Email"
                onChange={e =>setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"    
            />
            <input 
                type="password" 
                placeholder="Password"
                onChange={e =>setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"    
            />
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 active:bg-blue-800 transition duration-200">
                Signup
            </button>
        </form>
    );
}