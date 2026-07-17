import { json } from "node:stream/consumers";
import { findAllOrdersByAdmin, findOrder, findOrderByUserId, updateOrderStatusByAdmin } from "../model/orderModel";

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

// UPDATE ORDER STATUS BY ADMIN
export async function updateOrderStatus(req, res) {
    
    try {

        const orderId = Number(req.params.id);

        if (Number.isNaN(orderId)) {
            return res.status(400).json({
                success: false,
                msg: "Missing or Invalid data"
            });
        }        

        const status = req.body.status?.toUpperCase();

        const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];     

        if (!validStatuses.includes(status)) {
            return res.status(409).json({
                success: false,
                msg: "Please provide a valid status"
            });
        }

        const validTransitions = {
            PENDING: ["PROCESSING", "CANCELLED"],
            PROCESSING: ["SHIPPED", "CANCELLED"],
            SHIPPED: ["DELIVERED"],
            DELIVERED: [],
            CANCELLED: []  
        };         

        const orderExist = await findOrder(orderId);

        const currentStatus = orderExist.status;

        const allowedNextStatuses = validTransitions[currentStatus];

        if (status === currentStatus) {
            return res.status(409).json({
                success: false,
                msg: `Order is already ${status}`
            });
        }        

        if (!allowedNextStatuses.includes(status)) {
            return res.status(409).json({
                success: false,
                msg: `Cannot change status from ${currentStatus} to ${status}`
            });
        }        
        
        if (!orderExist) {
            return res.status(404).json({
                success: false,
                msg: "Order not found"
            });
        }

        const updatedStatus = await updateOrderStatusByAdmin(orderId, status)

        return res.status(200).json({
            success: true,
            msg: `Status updated to ${status}`,
            data: updatedStatus
        });
    }
    catch(err){
        return res.status(400).json({
            success: false,
            msg: "Cannot update status",
            reason: err.message
        });
    }     
}
