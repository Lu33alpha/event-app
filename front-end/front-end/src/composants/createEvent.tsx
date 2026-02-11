import "./style/createEvent.scss"
import {useEffect, useState} from "react"
import type {CreateEventPayload, Event} from "../API/event-action"

type Props = {
    event?: Event
    onClose: () => void
    onSubmit: (data: CreateEventPayload, eventId?: number) => Promise<void>
}

export default function CreateEventForm({event, onSubmit, onClose}: Props) {
    const [name, setName] = useState("")
    const [nbPlace, setNbPlace] = useState<number | "">("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [place, setPlace] = useState("")
    const [description, setDescription] = useState("")

    // 🔥 Pré-remplissage en mode édition
    useEffect(() => {
        if (event) {
            setName(event.name_event)
            setNbPlace(event.nb_place)
            setStartDate(event.start_date.slice(0, 10))
            setEndDate(event.end_date.slice(0, 10))
            setPlace(event.place)
            setDescription(event.description ?? "")
        } else {
            // reset complet en mode création
            setName("")
            setNbPlace("")
            setStartDate("")
            setEndDate("")
            setPlace("")
            setDescription("")
        }
    }, [event])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (new Date(startDate) > new Date(endDate)) {
            alert("La date de début ne peut pas être après la date de fin")
            return
        }

        await onSubmit(
            {
                name_event: name,
                nb_place: Number(nbPlace),
                start_date: startDate,
                end_date: endDate,
                place,
                description,
            },
            event?.id
        )

        onClose()
    }

    return (
        <form className="event-form" onSubmit={handleSubmit}>
            <button
                type="button"
                className="popup-close"
                onClick={onClose}
            >
                ×
            </button>

            <h2>{event ? "Modifier l’événement" : "Créer un événement"}</h2>

            <label>
                Nom de l'événement
                <input value={name} onChange={e => setName(e.target.value)} required/>
            </label>

            <label>
                Nombre de participants
                <input
                    type="number"
                    min={1}
                    value={nbPlace}
                    onChange={e => setNbPlace(Number(e.target.value))}
                    required
                />
            </label>

            <label>
                Date de début
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required/>
            </label>

            <label>
                Date de fin
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required/>
            </label>

            <label>
                Lieu
                <input value={place} onChange={e => setPlace(e.target.value)} required/>
            </label>

            <label>
                Description
                <textarea value={description} onChange={e => setDescription(e.target.value)}/>
            </label>

            <button type="submit">
                {event ? "Enregistrer les modifications" : "Créer l’événement"}
            </button>
        </form>
    )
}
