import { log } from "node:console";
import { addProductsToCart, deleteCartItemsById, findCartItemById, getCartItems, updateCartItemQty } from "../model/cartModel";
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

// GET CART ITEMS
export async function getAllCartItems(req, res) {
    
    try {

        const user = req.user;
        const cartItems = await getCartItems(user.id);

        if (cartItems.length <= 0) {
            return res.status(404).json({
                success: false,
                msg: "Your cart is empty",
                data: cartItems
            });
        }

        const totalPrice = cartItems.reduce((sum, item) => {
            return sum + (item.quantity * Number(item.product.price))
        }, 0);
        
        return res.status(200).json({
            success: true,
            msg: "Cart items retrieved successfully",
            totalPrice: totalPrice,
            data: cartItems
        });
    }
    catch(err){
        return res.status(400).json({
            success: false,
            msg: "Failed to get cart items",
            reason: err.message
        });
    }     
}

// UPDATE QUANTITY
export async function updateCartQty(req, res) {
    
    try {

        const quantity = req.body.quantity;
        const id = Number(req.params.id);

        if (!quantity || Number.isNaN(quantity)) {
            return res.status(400).json({
                success: false,
                msg: "Quantity must be a valid integer"
            });
        }

        if (!id || Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                msg: "Id must be a valid integer"
            });
        }         

        const cartItemExist = await findCartItemById(id);

        if (!cartItemExist) {
            return res.status(404).json({
                success: false,
                msg: "Cart item not found"
            });
        }

        const userId = req.user.id;

        if (cartItemExist.userId !== userId) {
            return res.status(403).json({
                success: false,
                msg: "Cart item does not belong to the user"
            });
        }

        const updatedCartQty = await updateCartItemQty(id, { quantity });

        return res.status(200).json({
            success: true,
            msg: "Qty updated successfully",
            data: updatedCartQty
        });
    }

    catch(err){
        return res.status(400).json({
            success: false,
            msg: "Failed to update cart qty",
            reason: err.message
        });
    }      
}

// DELETE CART ITEMS
export async function deleteCartItems(req, res) {
    
    try {

        const id = Number(req.params.id);

        if (!id || Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                msg: "Id must be a valid integer"
            });
        }    
        
        const cartItemExist = await findCartItemById(id);

        if (!cartItemExist) {
            return res.status(404).json({
                success: false,
                msg: "Cart item not found"
            });
        }

        const userId = req.user.id;

        if (cartItemExist.userId !== userId) {
            return res.status(403).json({
                success: false,
                msg: "Cart item does not belong to the user"
            });
        }
        
        await deleteCartItemsById(id);

        return res.status(200).json({
            success: true,
            msg: "Cart item deleted successfully"
        });
    }

    catch(err){
        return res.status(400).json({
            success: false,
            msg: "Failed to delete cart item(s)",
            reason: err.message
        });
    }     
}