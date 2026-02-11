type Props = {
    message: string
    onClose: () => void
}

export default function ErrorPopUp({message, onClose}: Props) {
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div
                className="popup-content"
                onClick={(e) => e.stopPropagation()}
            >
                <h3>Erreur</h3>
                <p>{message}</p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    )
}
