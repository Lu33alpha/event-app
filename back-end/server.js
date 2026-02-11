const express = require('express');
const cors = require("cors");
const {login, signup, me} = require("./auth/authController.js");
const {requireAuth} = require('./auth/authMiddleware.js');
const {CreateEvent, deleteEvent, getEvents, joinEvent, leaveEvent, updateEvent} = require('./event/eventController.js');

const app = express();
app.use(express.json());
app.use(cors());

// Routes AUTH
app.post("/api/login", login);
app.post("/api/signup", signup);
app.get("/api/me", requireAuth, me);


app.post("/api/createEvent", requireAuth, CreateEvent);
app.delete("/api/events/:id", requireAuth, deleteEvent);
app.get("/api/events", requireAuth, getEvents);
app.post("/api/events/join", requireAuth, joinEvent);
app.post("/api/events/leave", requireAuth, leaveEvent);
app.put("/api/events/:id", requireAuth, updateEvent);


// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});