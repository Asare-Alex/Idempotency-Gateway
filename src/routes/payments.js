const express = require("express");
const router = express.Router();

const db = require("../db/database");
const processPayment = require("../services/paymentService");

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

router.post("/process-payment", async (req, res) => {
  const { amount, currency } = req.body;

  const key = req.idempotencyKey;
  const hash = req.requestHash;

  const processingPromise = (async () => {
    await runQuery(
      `
      INSERT INTO idempotency_records
      (idempotency_key, request_hash, status)
      VALUES (?, ?, ?)
      `,
      [key, hash, "PROCESSING"]
    );

    const responseBody = await processPayment(amount, currency);
    const responseStatus = 201;

    await runQuery(
      `
      UPDATE idempotency_records
      SET status = ?, response_status = ?, response_body = ?
      WHERE idempotency_key = ?
      `,
      [
        "COMPLETED",
        responseStatus,
        JSON.stringify(responseBody),
        key
      ]
    );

    return {
      status: responseStatus,
      body: responseBody
    };
  })();

  req.inFlightRequests.set(key, processingPromise);

  try {
    const result = await processingPromise;

    res.status(result.status).json(result.body);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  } finally {
    req.inFlightRequests.delete(key);
  }
});

module.exports = router;