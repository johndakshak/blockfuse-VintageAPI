import jwt from "jsonwebtoken";
import "dotenv/config";

export async function adminMiddleware(req, res, next) {
    
    const isAdmin = req.user.role === "ADMIN";

    if (isAdmin === false) {
        return res.status(403).json({
            success: false,
            msg: "Access denied. Admins only"
        });
    }

    next();      
}