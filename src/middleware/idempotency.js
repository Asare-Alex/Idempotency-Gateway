const db = require("../db/database");
const generateHash = require("../utils/hash");

const inFlightRequests = new Map();

function findRecord(key) {
return new Promise((resolve, reject) => {
db.get(
"SELECT * FROM idempotency_records WHERE idempotency_key = ?",
[key],
(err, row) => {
if (err) reject(err);
else resolve(row);
}
);
});
}

async function idempotencyMiddleware(req, res, next) {
const key = req.header("Idempotency-Key");

if (!key) {
return res.status(400).json({
error: "Missing Idempotency-Key header"
});
}

const hash = generateHash(req.body);

const existing = await findRecord(key);

if (existing) {
if (existing.request_hash !== hash) {
return res.status(422).json({
error:
"Idempotency key already used for a different request body."
});
}


if (existing.status === "COMPLETED") {
  res.set("X-Cache-Hit", "true");

  return res
    .status(existing.response_status)
    .json(JSON.parse(existing.response_body));
}


}

if (inFlightRequests.has(key)) {
const result = await inFlightRequests.get(key);


res.set("X-Cache-Hit", "true");

return res.status(result.status).json(result.body);


}

req.idempotencyKey = key;
req.requestHash = hash;
req.inFlightRequests = inFlightRequests;

next();
}

module.exports = idempotencyMiddleware;
