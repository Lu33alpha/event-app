type Tab = "events" | "my-events" | "createEvent" | "account"

type Props = {
    activeTab: Tab
    onChange: (tab: Tab) => void
}

export default function TopBar({activeTab, onChange}: Props) {
    return (
        <div className="topbar">
            <button
                className={activeTab === "events" ? "active" : ""}
                onClick={() => onChange("events")}
            >
                Events
            </button>

            <button
                className={activeTab === "my-events" ? "active" : ""}
                onClick={() => onChange("my-events")}
            >
                Mes events
            </button>

            <button
                className={activeTab === "createEvent" ? "active" : ""}
                onClick={() => onChange("createEvent")}
            >
                Create Event
            </button>

            <button
                className={activeTab === "account" ? "active" : ""}
                onClick={() => onChange("account")}
            >
                Mon compte
            </button>
        </div>
    )
}
