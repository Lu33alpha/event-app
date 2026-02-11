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

export default function AllEvents({
                                      events,
                                      userId,
                                      formatDate,
                                      onJoin,
                                      onLeave,
                                      onEdit,
                                      onDelete,
                                  }: Props) {
    return (
        <div className="event-list">
            {events.map((event, index) => (
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
