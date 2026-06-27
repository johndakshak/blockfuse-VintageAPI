import { createNewUser, findUserByEmail } from "../model/userModel"

export async function createUser(req, res) {
    
    try {
        const { email, password } = req.body;

        if (!email || !password){
            return res.status(400).json({
                success: false,
                msg: "Missing or Invalid data"
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
        console.log(err)
        return res.status(400).json({error: err.message});
    }
}