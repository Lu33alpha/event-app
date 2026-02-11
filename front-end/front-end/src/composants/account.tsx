import "./style/account.scss"
import {useEffect, useState} from "react"


export default function Account() {

    const [isDark, setIsDark] = useState(false)


    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme === "dark") {
            document.body.classList.add("dark")
            setIsDark(true)
        }
    }, [])

    const toggleTheme = () => {
        if (isDark) {
            document.body.classList.remove("dark")
            localStorage.setItem("theme", "light")
            setIsDark(false)
        } else {
            document.body.classList.add("dark")
            localStorage.setItem("theme", "dark")
            setIsDark(true)
        }
    }

    const logout = () => {
        const confirmLogout = window.confirm("Se déconnecter ?")
        if (!confirmLogout) return

        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("userId")

        window.location.href = "/login"
    }

    return (
        <div className="account-page">
            <h2>Mon compte</h2>

            <button onClick={toggleTheme}>
                {isDark ? "☀️ Mode clair" : "🌙 Mode sombre"}
            </button>

            <button
                onClick={logout}
                className="logout-btn"
            >
                🚪 Déconnexion
            </button>
        </div>
    )
}
