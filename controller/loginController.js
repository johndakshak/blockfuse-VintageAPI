import bcrypt from "bcrypt";
import { findUserByEmail } from "../model/userModel";
import { isValidEmail } from "../utils/validators";
import jwt from "jsonwebtoken";
import "dotenv/config";

export async function login(req, res) {

    try {

        const { email, password } = req.body;       

        if (email !== undefined) {
            if (typeof email !== "string" || email.trim() === "") {
                return res.status(400).json({
                    success: false,
                    msg: "Email cannot be empty"
                });
            }

            if (!isValidEmail(email)) {
                return res.status(400).json({
                    success: false,
                    msg: "Invalid email format"
                });
            }
        }    
        
        if (password !== undefined) {
            if (typeof password !== "string" || password.trim() === "") {
                return res.status(400).json({
                    success: false,
                    msg: "Password cannot be empty"
                });
            }
        }     

        const userExist = await findUserByEmail(email);

        if (!userExist) {
            return res.status(404).json({
                success: false,
                msg: "Ivalid email or password",
            });            
        }
        
        const passwordMatch = await bcrypt.compare(password, userExist.password);

        if (passwordMatch !== true) {
            return res.status(404).json({
                success: false,
                msg: "Ivalid email or password",
            });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_EXP_TIME = "30M";
        
        const token = jwt.sign({
            
            id: userExist.id,
            name: userExist.name,
            email: userExist.email,
            role: userExist.role
            }, 
            JWT_SECRET, 
            { 
                expiresIn: JWT_EXP_TIME
            }
        );   
        
        return res.status(200).json({
            success: true,
            msg: "login successfull",           
            access_token: token
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Failed to login",
            reason: err.message
        });
    }
}