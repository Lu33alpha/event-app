import type {Event} from "../API/event-action"
import EventCard from "./eventcard"

type Props = {
    events: Event[]
    userId: number
    formatDate: (date: string) => string

    onJoin: (id: number) => Promise<void>
    onLeave: (id: number) => Promise<void>
    onEdit: (event: Event) => void
    onDelete: (event: Event) => Promise<void>
}

export default function MyEvents({
                                     events,
                                     userId,
                                     formatDate,
                                     onJoin,
                                     onLeave,
                                     onEdit,
                                     onDelete,
                                 }: Props) {
    const myEvents = events.filter(event => event.owner === userId)

    if (myEvents.length === 0) {
        return <p style={{textAlign: "center"}}>Tu n’as encore créé aucun événement 🗓️</p>
    }

    return (
        <div className="event-list">
            {myEvents.map((event, index) => (
                <EventCard
                    key={event.id}
                    event={event}
                    index={index}
                    userId={userId}
                    formatDate={formatDate}
                    onJoin={onJoin}
                    onLeave={onLeave}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}