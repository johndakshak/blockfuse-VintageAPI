import crypto from "crypto";
import "dotenv/config"
import { findOrderByPaymentReference, updateOrderStatusByAdmin } from "../model/orderModel";

export async function verifyPayment(req, res) {

    try {
        const secret = process.env.PAYSTACK_SECRET_KEY;

        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
            return res.sendStatus(401); 
        }

        const event = req.body;

        if (event.event === "charge.success") {

            const reference = event.data.reference;

            const order = await findOrderByPaymentReference(reference);

            if (order) {
                await updateOrderStatusByAdmin(order.id, "PROCESSING");
            }
        }

        return res.sendStatus(200); 
    }
    catch(err){
        return res.status(400).json({
            success: false,
            msg: "Payment verification failed",
            reason: err.message
        });
    }
}