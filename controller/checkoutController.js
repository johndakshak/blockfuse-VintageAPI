import { checkoutItems } from "../model/checkoutModel";
import { getCartItems } from "../model/cartModel";

export async function checkout(req, res) {

    try {
        const userId = req.user.id;

        const itemsAtCheckout = await checkoutItems({ userId });
        console.log(itemsAtCheckout)
        
        return res.status(200).json({
            success: true,
            msg: "Checkout successfull",
            data: itemsAtCheckout
        });
    }
    catch(err){
        return res.status(400).json({
            success: false,
            msg: "Failed to checkout",
            reason: err.message
        });
    }      
}