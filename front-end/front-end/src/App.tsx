import './App.css'
import {BrowserRouter} from 'react-router-dom'
import AppRoutes from './AppRoute.tsx'
import {useEffect, useState} from 'react'
import {validateToken} from './API/auth-action.ts'
import type {User} from './utils/type.ts'


function App() {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        validateToken()
            .then((u) => {
                setUser(u);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);

            });
    }, []);

    return (
        <BrowserRouter>
            <AppRoutes user={user}/>
        </BrowserRouter>
    )
}

export default App