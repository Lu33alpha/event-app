import "./style/eventcard.scss"
import type {Event} from "../API/event-action"

type Props = {
    event: Event
    userId: number
    onJoin: (eventId: number) => Promise<void>
    onLeave: (eventId: number) => Promise<void>
    onEdit: (event: Event) => void
    onDelete: (event: Event) => Promise<void>
    formatDate: (date: string) => string
    index: number
}

export default function EventCard({
                                      event,
                                      userId,
                                      onJoin,
                                      onLeave,
                                      onEdit,
                                      onDelete,
                                      formatDate,
                                      index,
                                  }: Props) {
    const isFull = event.registered_count >= event.nb_place

    return (
        <div
            className="event-card"
            style={{animationDelay: `${index * 80}ms`}}
        >
            {/* 🔴 BADGE COMPLET */}
            {isFull && <span className="event-badge">COMPLET</span>}

            <h3>{event.name_event}</h3>

            <p>📍 {event.place}</p>

            <p>
                📅 {formatDate(event.start_date)} →{" "}
                {formatDate(event.end_date)}
            </p>

            <p>
                👥 {event.registered_count} personne
                {event.registered_count > 1 ? "s" : ""} inscrite
                {event.registered_count > 1 ? "s" : ""} sur {event.nb_place}
            </p>

            <p>{event.description}</p>

            <div className="event-actions">
                {/* INSCRIPTION */}
                <button
                    className={`event-btn ${
                        isFull && !event.is_registered ? "full" : ""
                    }`}
                    disabled={isFull && !event.is_registered}
                    onClick={async () => {
                        if (event.is_registered) {
                            await onLeave(event.id)
                        } else {
                            await onJoin(event.id)
                        }
                    }}
                >
                    {event.is_registered
                        ? "Se désinscrire"
                        : isFull
                            ? "Complet"
                            : "S’inscrire"}
                </button>

                {/* ✏️ MODIFIER */}
                {event.owner === userId && (
                    <button
                        className="edit-btn"
                        onClick={() => onEdit(event)}
                    >
                        Modifier
                    </button>
                )}

                {/* 🗑️ SUPPRIMER */}
                {event.owner === userId && (
                    <button
                        className="delete-btn"
                        onClick={() => onDelete(event)}
                    >
                        Supprimer
                    </button>
                )}
            </div>
        </div>
    )
}
