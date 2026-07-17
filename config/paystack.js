import "dotenv/config";

const URL = "https://api.paystack.co/transaction/initialize";
const PAYSTACK_SECRET_KEY=process.env.PAYSTACK_SECRET_KEY;

export async function initializePayment(email, amount) {
    const response = await fetch(`${URL}`, {
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
