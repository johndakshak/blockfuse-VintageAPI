import { createNewProduct, findAllProducts, findProductById, updateProductDetails } from "../model/productModel";
import { cloudinary } from "../config/cloudinary";

// ADD PRODUCT
export async function addProduct(req, res) {
    
    try {

        const {name, description, imageUrl} = req.body;
        
        const price = parseFloat(req.body.price);
        const stock = parseInt(req.body.stock);

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

        if (!req.file) {
            return res.status(400).json({
                success: false,
                msg: "Product image is required"
            });
        }

        const user = req.user;
        const newImageUrl = req.file.path;       

        const addProduct = await createNewProduct({
            name,
            description,
            imageUrl: newImageUrl,
            stock,
            price,
            createdBy: user.id
        });

        return res.status(201).json({
            success: true,
            msg: "Product added successfully",
            data: addProduct,
        });

    }
    catch(err){
        console.log(err.message)
        return res.status(400).json({
            success: false,
            msg: "Failed to Add new product",
            reason: err.message
        });
    }
}

// GET ALL PRODUCTS
export async function getProducts(req, res) {
    
    try {
        const products = await findAllProducts();

        return res.status(200).json({
            success: true,
            msg: "Products retrieved successfully",
            data: products
        });
    } 
    catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Failed to retrieve products",
            reason: err.message
        });
    }
}

// GET SINGLE PRODUCT
export async function getProductById(req, res) {
    
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                msg: "Missing or Invalid data"
            });
        }

        const product = await findProductById(Number(id));

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Product retrived successfully",
            data: product,
        });    
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Failed to retrieve product",
            reason: err.message
        });
    }
}

// UPDATE PRODUCT
export async function updateProduct(req, res) {

    try {

        const id = Number(req.params.id);
        
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                msg: "Missing or Invalid data"
            });
        }

        const productExist = await findProductById(Number(id));
        
        if (!productExist){
            return res.status(404).json({
                success: false,
                msg: "Product not found"
            });
        }

        if (!req.body) {
            return res.status(400).json({
                success: false,
                msg: "Fields cannot be empty"
            });
        }        

        const {name, description, imageUrl} = req.body;
        
        const price = req.body.price ? parseFloat(req.body.price) : undefined;
        const stock = req.body.stock ? parseInt(req.body.stock) : undefined;

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

        let newImageUrl;

        if (req.file){
            newImageUrl = req.file.path;
        }
        else {
            newImageUrl = productExist.imageUrl;
        }

        const user = req.user;    

        const updateProduct = await updateProductDetails(id, {
            name,
            description,
            imageUrl: newImageUrl,
            stock,
            price,
            createdBy: user.id
        });

        return res.status(200).json({
            success: true,
            msg: "Product updated successfully",
            data: updateProduct
        });

    }
    catch(err){
        return res.status(400).json({
            success: false,
            msg: "Failed to update product",
            reason: err.message
        });
    }
}
    
