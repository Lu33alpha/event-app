const pool = require("../db");


exports.CreateEvent = async (req, res) => {
    try {


        const {
            name_event,
            nb_place,
            start_date,
            end_date,
            description,
            place
        } = req.body;


        const owner = req.user.id;


        if (!name_event || !nb_place || !start_date || !end_date || !place) {
            return res.status(400).json({error: "Champs manquants"});
        }

        if (new Date(start_date) > new Date(end_date)) {
            return res.status(400).json({
                error: "La date de début ne peut pas être après la date de fin"
            })
        }

        const insertResult = await pool.query(
            `INSERT INTO events
                 (name_event, nb_place, start_date, end_date, description, owner, place)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [
                name_event,
                nb_place,
                start_date,
                end_date,
                description,
                owner,
                place
            ]
        );

        return res.status(201).json({
            message: "Event créé",
            event_id: insertResult.rows[0].id
        });

    } catch (err) {

        return res.status(500).json({error: "server error"});
    }
};


exports.deleteEvent = async (req, res) => {
    try {
        const userId = req.user.id
        const eventId = req.params.id

        // 🔒 Vérifier s’il y a des inscrits (optionnel mais pro)
        const countResult = await pool.query(
            `SELECT COUNT(*)
             FROM event_participants
             WHERE event_id = $1`,
            [eventId]
        )

        if (Number(countResult.rows[0].count) > 0) {
            return res.status(400).json({
                error: "Impossible de supprimer un événement avec des inscrits"
            })
        }

        // 🔒 Suppression sécurisée (owner only)
        const result = await pool.query(
            `
                DELETE
                FROM events
                WHERE id = $1
                  AND owner = $2 RETURNING id
            `,
            [eventId, userId]
        )

        if (result.rowCount === 0) {
            return res.status(403).json({
                error: "Non autorisé ou événement introuvable"
            })
        }

        return res.status(200).json({
            message: "Événement supprimé",
            event_id: result.rows[0].id
        })

    } catch (err) {

        return res.status(500).json({error: "server error"})
    }
}

exports.getEvents = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `
                SELECT e.id,
                       e.name_event,
                       e.nb_place,
                       e.start_date,
                       e.end_date,
                       e.description,
                       e.place,
                       e.owner,

                       COUNT(ep.user_id)                AS registered_count,
                       (e.nb_place - COUNT(ep.user_id)) AS remaining_places,

                       EXISTS (SELECT 1
                               FROM event_participants ep2
                               WHERE ep2.event_id = e.id
                                 AND ep2.user_id = $1)  AS is_registered

                FROM events e
                         LEFT JOIN event_participants ep ON ep.event_id = e.id
                GROUP BY e.id
                ORDER BY e.start_date ASC
            `,
            [userId]
        );

        return res.status(200).json({events: result.rows});

    } catch (err) {

        return res.status(500).json({error: "server error"});
    }
};


exports.joinEvent = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({error: "Unauthorized"});
        }

        const userId = req.user.id;
        const {eventId} = req.body;

        if (!eventId) {
            return res.status(400).json({error: "eventId manquant"});
        }

        // 🔍 vérifier le nombre de places restantes
        const eventResult = await pool.query(
            `SELECT nb_place
             FROM events
             WHERE id = $1`,
            [eventId]
        );

        if (eventResult.rowCount === 0) {
            return res.status(404).json({error: "Event introuvable"});
        }

        const maxPlaces = eventResult.rows[0].nb_place;

        const countResult = await pool.query(
            `SELECT COUNT(*)
             FROM event_participants
             WHERE event_id = $1`,
            [eventId]
        );

        if (Number(countResult.rows[0].count) >= maxPlaces) {
            return res.status(400).json({error: "Plus de places disponibles"});
        }

        // ➕ inscription
        await pool.query(
            `INSERT INTO event_participants (user_id, event_id)
             VALUES ($1, $2)`,
            [userId, eventId]
        );

        return res.status(201).json({message: "Inscription réussie"});

    } catch (err) {
        // inscription déjà existante
        if (err.code === "23505") {
            return res.status(400).json({error: "Déjà inscrit à cet événement"});
        }


        return res.status(500).json({error: "server error"});
    }
};


async function getUserIdByUsername(username) {
    const result = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
    );

    if (result.rowCount === 0) {
        return null;
    }

    return result.rows[0].id;
}

exports.leaveEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const {eventId} = req.body;

        if (!eventId) {
            return res.status(400).json({error: "eventId manquant"});
        }

        await pool.query(
            `DELETE
             FROM event_participants
             WHERE user_id = $1
               AND event_id = $2`,
            [userId, eventId]
        );

        return res.status(200).json({message: "Désinscription réussie"});

    } catch (err) {

        return res.status(500).json({error: "server error"});
    }
};


exports.updateEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;

        const {
            name_event,
            nb_place,
            start_date,
            end_date,
            description,
            place
        } = req.body;

        // 🔒 Vérification des champs obligatoires
        if (!name_event || !nb_place || !start_date || !end_date || !place) {
            return res.status(400).json({error: "Champs manquants"});
        }

        // 🔒 Vérifier que le nombre de places n'est pas inférieur aux inscrits
        const countResult = await pool.query(
            `SELECT COUNT(*)
             FROM event_participants
             WHERE event_id = $1`,
            [eventId]
        );

        const registeredCount = Number(countResult.rows[0].count);

        if (nb_place < registeredCount) {
            return res.status(400).json({
                error: `Impossible de réduire le nombre de places en dessous de ${registeredCount}`
            });
        }

        // 🔒 Update sécurisé : owner obligatoire
        const result = await pool.query(
            `
                UPDATE events
                SET name_event  = $1,
                    nb_place    = $2,
                    start_date  = $3,
                    end_date    = $4,
                    description = $5,
                    place       = $6
                WHERE id = $7
                  AND owner = $8 RETURNING id
            `,
            [
                name_event,
                nb_place,
                start_date,
                end_date,
                description,
                place,
                eventId,
                userId
            ]
        );

        if (result.rowCount === 0) {
            return res.status(403).json({
                error: "Non autorisé ou événement introuvable"
            });
        }

        return res.status(200).json({
            message: "Événement modifié avec succès",
            event_id: result.rows[0].id
        });

    } catch (err) {

        return res.status(500).json({error: "server error"});
    }
};

