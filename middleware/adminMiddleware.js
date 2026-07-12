import jwt from "jsonwebtoken";
import "dotenv/config";

export async function adminMiddleware(req, res, next) {
    
    try {

        if (!req.user) {
            return res.status(401).json({ success: false, msg: "Unauthorized" });
        }

        const isAdmin = req.user.role === "ADMIN";

        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                msg: "Access denied. Admins only"
            });
        }

        next();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: "Server error", reason: err.message });
    }
}