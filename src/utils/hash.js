const crypto = require("crypto");

function generateHash(body) {
return crypto
.createHash("sha256")
.update(JSON.stringify(body))
.digest("hex");
}

module.exports = generateHash;
