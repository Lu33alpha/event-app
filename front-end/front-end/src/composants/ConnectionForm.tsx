import "./style/ConnectionForm.scss"
import type {FormEvent} from "react";


type ConnectionFormProps = {
    onSave: () => void,
    isLogin: boolean,
    setUsername: (u: string) => void,
    setPassword: (p: string) => void,
    username: string,
    password: string
}
export default function ConnectionForm({
                                           onSave,
                                           isLogin,
                                           setUsername,
                                           setPassword,
                                           username,
                                           password
                                       }: ConnectionFormProps) {
    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        onSave()


    }

    return (<form onSubmit={handleSubmit}>

        <input value={username} placeholder="nom" onChange={(e) => setUsername(e.target.value)}></input>
        <input type="password" placeholder="password" value={password}
               onChange={(e) => setPassword(e.target.value)}></input>
        <button type="submit">{isLogin ? "Se connecter" : "S'inscrire"}</button>
    </form>)
}