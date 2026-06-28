import { error } from "node:console";
import { createNewUser, findUserByEmail, findUserById } from "../model/userModel"

// CREATE USER
export async function createUser(req, res) {
    
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password){
            return res.status(400).json({
                success: false,
                msg: "At least one field is empty or Invalid data"
            });
        }

        const emailExist = await findUserByEmail(email);
        
        if (emailExist){
            return res.status(409).json({
                success: false,
                msg: "Email already exists"
            });
        }

        const user = await createNewUser(req.body);

        return res.status(200).json({
            success: true,
            msg: "User created successfully",
            data: {
                name: user.name,
                email: user.email
            }
        });

    }
    catch(err){
        return res.status(400).json({error: err.message});
    }
}

// GET USER BY ID
export async function getUserById(req, res) {
    
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({
                success: false,
                msg: "Missing or Invalid data"
            });
        }

        const user = await findUserById(Number(id));

        if (!user) {
            res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    }
    catch(err) {
        console.log(err)
        res.status(400).json({error: err.message})
    }
}