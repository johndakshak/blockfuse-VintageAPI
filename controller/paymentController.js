import { initializePayment } from "../config/paystack";
import { findOrder, updateOrderPaymentReference } from "../model/orderModel";

export async function paymentGateway(req, res) {
    
    try {

        const orderId = Number(req.params.id);

        if (!orderId || Number.isNaN(orderId)) {
            return res.status(400).json({
                success: false,
                msg: "Order ID must be a valid integer"
            });
        }      
        
        const orderExist = await findOrder(orderId);

        if (!orderExist) {
            return res.status(404).json({
                success: false,
                msg: "Order not found"
            });
        }
        
        const user = req.user.id;

        if (orderExist.userId !== user) {
            return res.status(403).json({
                success: false,
                msg: "Order does not belong to this user"
            });
        }

        if (orderExist.status !== "PENDING") {
            return res.status(409).json({
                success: false,
                msg: `Cannot make payment. Order is already ${orderExist.status}`
            });
        }

        const amountInKobo = Number(orderExist.totalPrice) * 100;

        const email = req.user.email; 

        const paymentResponse = await initializePayment(email, amountInKobo);

        await updateOrderPaymentReference(orderId, paymentResponse.data.reference);

        return res.status(200).json({
            success: true,
            msg: "Payment initialized successfully",
            data: paymentResponse.data 
        });
    }
    catch(err){
        return res.status(400).json({
            success: false,
            msg: "Unable to make payment",
            reason: err.message
        });
    }      
}