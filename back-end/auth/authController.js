const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecret";
exports.login = async (req, res) => {

    const {username, password} = req.body;

    const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);

    const user = result.rows[0];

    if (!user) {

        return res.status(409).json({error: "Unrecognized username"})
    }


    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {

        return res.status(409).json({error: "Wrong password"})

    }

    const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET, {expiresIn: "1h"});

    return res.json({token});
}

exports.signup = async (req, res) => {
    try {

        const {username, password} = req.body;


        const result = await pool.query("SELECT id FROM users WHERE username=$1", [username]);
        const existingUser = result.rows[0];


        if (existingUser) {
            return res.status(409).json({error: "Username already taken"})
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const insertResult = await pool.query("INSERT INTO users(username, password_hash) VALUES($1, $2) RETURNING id", [username, passwordHash]);
        const newUser = insertResult.rows[0];

        const token = jwt.sign({id: newUser.id, username: username}, JWT_SECRET, {expiresIn: "1h"});
        return res.json({token});
    } catch (err) {
        return res.status(500).json({error: "server error", err});
    }

}


exports.me = async (req, res) => {
    return res.json({
        id: req.user.id,
        username: req.user.username
    })
}