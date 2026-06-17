async function processPayment(amount, currency) {
await new Promise((resolve) => setTimeout(resolve, 2000));

return {
message: `Charged ${amount} ${currency}`
};
}

module.exports = processPayment;
