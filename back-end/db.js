const {Pool} = require("pg");

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "",
    database: "projet_event",
    port: 5432,
});

module.exports = pool;