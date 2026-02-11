import "./style/event.scss"
import {useEffect, useState} from "react"
import {
    getEvents,
    joinEvent,
    leaveEvent,
    CreateEvents,
    updateEvent,
    deleteEvent,
} from "../API/event-action"
import type {Event, CreateEventPayload} from "../API/event-action"

import TopBar from "../composants/TopBar.tsx"
import AllEvents from "../composants/allEvents"
import MyEvents from "../composants/myEvents"
import CreateEventForm from "../composants/createEvent"
import Account from "../composants/account"

type Tab = "events" | "my-events" | "createEvent" | "account"

export default function EventPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    const [activeTab, setActiveTab] = useState<Tab>("events")
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)

    const userId = Number(localStorage.getItem("userId") || -1)

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("fr-FR")

    const fetchEvents = async () => {
        const data = await getEvents()
        setEvents(data)
        setLoading(false)
    }


    useEffect(() => {
        fetchEvents()
        const theme = localStorage.getItem("theme")
        if (theme === "dark") {
            document.body.classList.add("dark")
        }
    }, [])

    if (loading) return <p>Chargement...</p>

    return (
        <>
            <TopBar
                activeTab={activeTab}
                onChange={(tab) => {
                    if (tab === "createEvent") {
                        setEditingEvent(null)
                    }
                    setActiveTab(tab)
                }}
            />

            <div className="event-page">
                {activeTab === "events" && (
                    <AllEvents
                        events={events}
                        userId={userId}
                        formatDate={formatDate}
                        onJoin={async id => {
                            await joinEvent(id)
                            await fetchEvents()
                        }}
                        onLeave={async id => {
                            await leaveEvent(id)
                            await fetchEvents()
                        }}
                        onEdit={(event) => {
                            setEditingEvent(event)
                            setActiveTab("createEvent")
                        }}
                        onDelete={async (event) => {
                            if (!window.confirm(`Supprimer "${event.name_event}" ?`)) return
                            await deleteEvent(event.id)
                            await fetchEvents()
                        }}
                    />
                )}

                {activeTab === "my-events" && (
                    <MyEvents
                        events={events}
                        userId={userId}
                        formatDate={formatDate}
                        onJoin={async id => {
                            await joinEvent(id)
                            await fetchEvents()
                        }}
                        onLeave={async id => {
                            await leaveEvent(id)
                            await fetchEvents()
                        }}
                        onEdit={(event) => {
                            setEditingEvent(event)
                            setActiveTab("createEvent")
                        }}
                        onDelete={async (event) => {
                            if (!window.confirm(`Supprimer "${event.name_event}" ?`)) return
                            await deleteEvent(event.id)
                            await fetchEvents()
                        }}
                    />
                )}

                {activeTab === "createEvent" && (
                    <CreateEventForm
                        event={editingEvent ?? undefined}
                        onClose={() => setActiveTab("events")}
                        onSubmit={async (data: CreateEventPayload, eventId?: number) => {
                            if (eventId) {
                                await updateEvent(eventId, data)
                            } else {
                                await CreateEvents(data)
                            }
                            await fetchEvents()
                            setActiveTab("events")
                        }}
                    />
                )}

                {activeTab === "account" && <Account/>}
            </div>
        </>
    )
}
