import "dotenv/config";

const INITIALIZED_PAYMENT_URL = "https://api.paystack.co/transaction/initialize";

const VERIFY_PAYMENT_URL = "https://api.paystack.co/transaction/verify/:reference";

const PAYSTACK_SECRET_KEY=process.env.PAYSTACK_SECRET_KEY;

// INITIALIZED PAYMENT
export async function initializePayment(email, amount) {
    const response = await fetch(`${INITIALIZED_PAYMENT_URL}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, amount })
    });

    const data = await response.json();
    return data;
}

// VERIFY PAYMENT
export async function verifyPayment() {
    
}

