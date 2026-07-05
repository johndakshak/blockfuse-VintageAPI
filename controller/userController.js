// import { error, log } from "node:console";
import { createNewUser, findUserByEmail, findUserById, findAllUsers, updateUserDetails, deleteUserById } from "../model/userModel"
import { isValidEmail, isValidPassword } from "../utils/validators.js";

// CREATE USER
export async function createUser(req, res) {
    
    try {
        const { name, email, password } = req.body;

        if (name !== undefined) {
            if (typeof name !== "string" || name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    msg: "Name must be a valid, non-empty string"
                });
            }

            if (name.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    msg: "Name must be at least 2 characters long"
                });
            }

            if (name.length > 100) {
                return res.status(400).json({
                    success: false,
                    msg: "Name is too long"
                });
            }
        }

        if (email !== undefined) {
            if (typeof email !== "string" || email.trim() === "") {
                return res.status(400).json({
                    success: false,
                    msg: "Email must be a valid, non-empty string"
                });
            }

            if (!isValidEmail(email)) {
                return res.status(400).json({
                    success: false,
                    msg: "Invalid email format"
                });
            }
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                msg: "Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol"
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

        return res.status(201).json({
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
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
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
            msg: "User found",
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    }
    catch(err) {
        return res.status(400).json({error: err.message});
    }
}

// GET ALL USERS
export async function getAllUsers(req, res) {

    try {

        const user = await findAllUsers();

        return res.status(200).json({
            success: true,
            msg: "Users retrieved successfully",
            data: user
        });        

    }
    catch(err) {
        return res.status(400).json({error: err.message});
    }
}

// UPDATE USER
export async function updateUser(req, res) {
    try {

        const id = Number(req.params.id);
        
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                msg: "Missing or Invalid data"
            });
        }

        const userExist = await findUserById(Number(id));
        
        if (!userExist){
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        const { name, email } = req.body;

        if (name !== undefined) {
            if (typeof name !== "string" || name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    msg: "Name must be a valid, non-empty string"
                });
            }

            if (name.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    msg: "Name must be at least 2 characters long"
                });
            }

            if (name.length > 100) {
                return res.status(400).json({
                    success: false,
                    msg: "Name is too long"
                });
            }
        }

        if (email !== undefined) {
            if (typeof email !== "string" || email.trim() === "") {
                return res.status(400).json({
                    success: false,
                    msg: "Email must be a valid, non-empty string"
                });
            }

            if (!isValidEmail(email)) {
                return res.status(400).json({
                    success: false,
                    msg: "Invalid email format"
                });
            }
        }

        if (email) {

            const emailExist = await findUserByEmail(email);

            if (emailExist && emailExist.id !== id) {
                
                return res.status(409).json({
                    success: false,
                    msg: "Email already exist"
                });
            }            
        }

        const updatedUser = await updateUserDetails(id, { name, email})

        return res.status(200).json({
            success:true,
            msg: "User updated successfully",
            data: updatedUser
        });
               
    }
    catch (err) {
        return res.status(400).json({success: false, error: err.message});
    }
}

// DELETE USER BY ID
export async function deleteUser(req, res) {
    try {
        const id = Number(req.params.id);
        
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                msg: "Missing or Invalid data"
            });
        }
        
        const userExist = await findUserById(id);

        if (!userExist){
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        await deleteUserById(id);
        
        return res.status(200).json({
            success: true,
            msg: "User deleted successfully"
        });
    }
    catch (err) {
        return res.status(400).json({success: false, error: err.message});
    }    
}