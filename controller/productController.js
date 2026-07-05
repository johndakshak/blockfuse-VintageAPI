import { createNewProduct } from "../model/productModel";

export async function addProduct(req, res) {
    
    try {

        const {id, name, description, price, imageUrl, stock } = req.body;

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

        if (description !== undefined) {
            if (typeof description !== "string" || description.trim() === "") {
                return res.status(400).json({
                    success: false,
                    msg: "Description must be a valid, non-empty string"
                });
            }
        }

        if (price !== undefined) {
            if (typeof price !== "number") {
                return res.status(400).json({
                    success: false,
                    msg: "Price must be a valid integer, non-empty field"
                });
            }
        }   
        
        if (stock !== undefined) {
            if (typeof stock !== "number") {
                return res.status(400).json({
                    success: false,
                    msg: "Stock must be a valid integer, non-empty field"
                });
            }
        }        

        const user = req.user;
 
        const addProduct = await createNewProduct({
            ...req.body,
            createdBy: user.id
        });

        return res.status(201).json({
            success: true,
            msg: "Product added successfully",
            data: addProduct,
        });

    }
    catch(err){
        return res.status(400).json({
            success: false,
            msg: "Falied to Add new product",
            reason: err.message
        });
    }
}
