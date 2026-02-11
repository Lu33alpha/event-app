import "./style/FirstPage.scss"
import {useState} from "react"
import {login, signUp, validateToken} from "../API/auth-action"

import ConnectionForm from "../composants/ConnectionForm"
import ErrorPopUp from "../composants/errorPopUp"

export default function FirstPage() {


    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [activeTab, setActiveTab] = useState<"login" | "register">("login")

    // 🔥 POPUP STATE LOCAL
    const [errorMessage, setErrorMessage] = useState("")
    const [showPopup, setShowPopup] = useState(false)

    async function handleSubmit() {
        try {
            if (activeTab === "login") {
                await login(username, password)
            } else {
                await signUp(username, password)
            }

            await validateToken()
            window.location.href = "/events"
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            } else {
                setErrorMessage("Une erreur est survenue")
            }
            setShowPopup(true)
        }
    }

    return (
        <div className="login-page">
            <div className="auth-card">
                {/* ONGLET */}
                <div className="tabs">
                    <button
                        className={activeTab === "login" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("login")}
                    >
                        Connexion
                    </button>

                    <button
                        className={activeTab === "register" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("register")}
                    >
                        Inscription
                    </button>
                </div>

                {/* FORM */}
                <ConnectionForm
                    onSave={handleSubmit}
                    isLogin={activeTab === "login"}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    username={username}
                    password={password}
                />
            </div>

            {/* POPUP — UNE SEULE FOIS */}
            {showPopup && (
                <div className="PopUp">
                    <ErrorPopUp
                        message={errorMessage}
                        onClose={() => setShowPopup(false)}
                    />
                </div>
            )}
        </div>
    )

}
