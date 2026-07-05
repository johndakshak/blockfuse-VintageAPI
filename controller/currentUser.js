import { findUserById } from "../model/userModel";

export async function getCurrentUser(req, res) {
    
    try {

        const id = req.user.id;
        const userExist = await findUserById(id);
        
        return res.status(200).json({
            success: true,
            msg: "User found",
            user: userExist
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