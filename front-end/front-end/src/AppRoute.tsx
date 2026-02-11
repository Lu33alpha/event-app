import {Navigate, Route, Routes} from "react-router"
import {useMemo, useState} from "react"
import FirstPage from "./Page/FirstPage"
import Event from "./Page/event"

import type {User} from "./utils/type"

interface AppRoutesProps {
    user: User | null
}

export default function AppRoutes({user}: AppRoutesProps) {
    const token = localStorage.getItem("token")
    const isAuthenticated = useMemo(
        () => Boolean(token && user),
        [token, user]
    )


    return (
        <>
            <Routes>
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/events" replace/>
                        ) : (
                            <FirstPage/>
                        )
                    }
                />

                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/events" replace/>
                        ) : (
                            <FirstPage/>
                        )
                    }
                />

                <Route
                    path="/events"
                    element={
                        !isAuthenticated ? (
                            <Navigate to="/login" replace/>
                        ) : (
                            <Event/>
                        )
                    }
                />
            </Routes>


        </>
    )
}
