const JWT_SECRET = "supersecret";
const jwt = require("jsonwebtoken");

exports.requireAuth = (req, res, next) => {

    const authHeader = req.header("Authorization");


    if (!authHeader) {
        return res.status(401).json({error: "No token provided"});
    }


    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({error: "Token invalid"});
    }
}
