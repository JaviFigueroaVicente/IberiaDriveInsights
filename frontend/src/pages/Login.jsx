import { useState } from 'react'
import { loginUser } from '../composables/auth'
import { Link } from 'react-router-dom'

export default function Login({onLoginSuccess}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await loginUser(email, password);
            console.log(response);
            await onLoginSuccess(response.access_token)

        }catch(error){
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <button type="submit">Login</button>
            </form>
            <p>¿No tienes una cuenta?<Link to={'/register'}>Regístrate aquí</Link></p>
        </div>
    )
}