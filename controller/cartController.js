import { addProductsToCart } from "../model/cartModel";
import { findProductById } from "../model/productModel";

// ADD ITEMS TO CART
export async function addToCart(req, res) {
    
    try {

        const quantity = parseInt(req.body.quantity);
        const productId = parseInt(req.body.productId);

        if (!quantity || Number.isNaN(quantity)) {
            return res.status(400).json({
                success: false,
                msg: "Quantity must be a valid integer"
            });
        }

        if (!productId || Number.isNaN(productId)) {
            return res.status(400).json({
                success: false,
                msg: "Product ID must be a valid integer"
            });
        } 

        const productExist = await findProductById(productId);

        if (!productExist) {
            return res.status(404).json({
                success: false,
                msg: "Product not found"
            });
        }

        const stock = productExist.stock;
        
        if (quantity > stock) {
            return res.status(409).json({
                success: false,
                msg: `Not enough quantity. Only ${stock} left`
            });
        }

        const user = req.user;

        const addItemsToCart = await addProductsToCart({
            quantity,
            productId,
            userId: user.id
        });
        
        return res.status(200).json({
            success: true,
            msg: "Item successfully added to cart",
            data: addItemsToCart
        });

    }
    catch(err){
        return res.status(400).json({
            success: false,
            msg: "Failed to Add to cart",
            reason: err.message
        });
    }    
}