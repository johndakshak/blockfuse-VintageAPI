import { findAllOrdersByAdmin, findOrderByUserId } from "../model/orderModel";

// GET ORDERS BY A USER
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

// GET ALL ORDERS BY ADMIN
export async function getAllOrdersByAdmin(req, res) {

    try {

        const usersOrder = await findAllOrdersByAdmin();
        
        return res.status(200).json({
            success: true,
            msg: "Orders retrieved successfully",
            data: usersOrder
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
