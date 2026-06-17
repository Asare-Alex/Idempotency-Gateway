const express = require("express");

const paymentRoutes = require("./routes/payments");
const idempotencyMiddleware = require("./middleware/idempotency");

const app = express();

app.use(express.json());

app.use(idempotencyMiddleware);

app.use("/", paymentRoutes);

const PORT = 3000;

app.listen(PORT, () => {
console.log(
`Idempotency Gateway running on port ${PORT}`
);
});
