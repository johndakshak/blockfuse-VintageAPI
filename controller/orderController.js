import { findOrderByUserId } from "../model/orderModel";

export async function getOrderByUserId(req, res) {
    try {

        const userId = req.user.id;
        
        const userOrder = await findOrderByUserId(userId);
        
        return res.status(200).json({
            success: true,
            msg: "Order retrieved successfully",
            data: userOrder
        });
    }
    catch(err){
        return res.status(400).json({
            success: false,
            msg: "Failed to get orders",
            reason: err.message
        });
    }      
}