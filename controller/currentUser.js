import { authMiddleware } from "./authMiddleware";

export async function getCurrentUser(req, res) {
    
    try {
        
        return res.status(200).json({
            success: true,
            msg: "User found",
            user: req.user
        });

    }
    catch (err) {
        return res.status(401).json({
            success: false,
            msg: "Failed to gt current user",
            reason: err.message
        });
    }
}