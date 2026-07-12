import jwt from "jsonwebtoken";
import "dotenv/config";

export async function authMiddleware(req, res, next) {

    try {

        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: false,
                msg: "Access denied. No token provided"
            });
        }

        const token = authHeader.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET;

        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.user = decodedToken; 
        next();      

    }
    catch (err) {
        console.log(err.message)
        return res.status(401).json({
            status: false,
            msg: "Invalid or expired token",
            reason: err.message
        });
    }
} 


