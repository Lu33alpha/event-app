export type CreateEventPayload = {
    name_event: string
    nb_place: number
    start_date: string
    end_date: string
    description: string
    place: string
}

export type Event = {
    id: number
    name_event: string
    nb_place: number
    start_date: string
    end_date: string
    description: string
    place: string

    owner: number

    registered_count: number
    remaining_places: number
    is_registered: boolean
}


export async function getEvents(): Promise<Event[]> {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/events", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || "Cannot fetch events");
    }

    return data.events;
}


export async function CreateEvents(
    event: CreateEventPayload
): Promise<void> {

    const token = localStorage.getItem("token")

    const res = await fetch("/api/createEvent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(event),
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data?.error || "Cannot create event")
    }
}


export async function deleteEvent(eventId: number): Promise<void> {
    const token = localStorage.getItem("token")

    const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data?.error || "Cannot delete event")
    }
}


export async function joinEvent(eventId: number): Promise<void> {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/events/join", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({eventId}),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error);
}

export async function leaveEvent(eventId: number): Promise<void> {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/events/leave", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({eventId}),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error);
}

export async function updateEvent(
    eventId: number,
    event: CreateEventPayload
): Promise<void> {

    const token = localStorage.getItem("token")

    const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(event),
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data?.error || "Cannot update event")
    }
}

