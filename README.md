 Idempotency Gateway (Pay-Once Protocol)

 📌 Overview

This project is a backend API that prevents double-charging in payment systems using an **Idempotency-Key mechanism**.

It ensures that:

* A request is processed only once
* Duplicate requests return cached responses
* Conflicting requests are rejected
* Race conditions are handled safely



 ⚙️ Tech Stack

* Node.js
* Express.js
* SQLite (file-based database)
* JavaScript (ES6)



 🏗️ Architecture Diagram


Client
  |
  |  POST /process-payment (Idempotency-Key)
  v
API Server (Express)
  |
  |-- Check Idempotency Key in DB
  |        |
  |        |-- NOT FOUND → PROCESS PAYMENT (2 sec delay)
  |        |                   |
  |        |                   v
  |        |             Store response + status
  |        |
  |        |-- FOUND
  |              |
  |              |-- Same payload → RETURN cached response
  |              |-- Different payload → 422 Conflict
  |
  v
Response to Client
```

---

 🚀 Setup Instructions

 1. Install dependencies

```bash
npm install
```

 2. Run the server

```bash
npm start
```

Server runs on:

http://localhost:3000



 📡 API Documentation

 ➤ Process Payment

**Endpoint**

```
POST /process-payment
```

**Headers**


Idempotency-Key: unique-key-123
Content-Type: application/json


**Request Body**

json
{
  "amount": 100,
  "currency": "GHS"
}




 ✔️ First Request (Success)

**Response**

```json
{
  "message": "Charged 100 GHS"
}
```

Status: `201 Created`

---

 ♻️ Duplicate Request

Same key + same body:

**Response**

```json
{
  "message": "Charged 100 GHS"
}
```

Header:

```
X-Cache-Hit: true
```

---

 ❌ Conflicting Request

Same key + different body:

```json
{
  "error": "Idempotency key already used for a different request body."
}
```

Status: `422 Unprocessable Entity`



 ⚠️ Missing Key

```json
{
  "error": "Missing Idempotency-Key header"
}
```

Status: `400 Bad Request`



\ 🧠 Design Decisions

* Used **SQLite** for persistence (simple + file-based)
* Used **SHA-256 hashing** to compare request bodies
* Stored responses to enable replay
* Used middleware for idempotency validation
* Added **in-flight request map** to prevent race conditions



 🧪 Developer’s Choice Feature

 ⏳ Idempotency Key Lifecycle (TTL Concept)

Keys are designed to expire after a period (future improvement idea):

* Prevents database growth
* Improves security
* Mimics real systems like Stripe/PayPal



⚡ How to Test

```bash
curl -X POST http://localhost:3000/process-payment \
-H "Content-Type: application/json" \
-H "Idempotency-Key: test123" \
-d "{\"amount\":100,\"currency\":\"GHS\"}"
```

---

## 📂 Project Structure

```
idempotency-gateway/
├── src/
│   ├── app.js
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── db/
│   └── utils/
├── package.json
└── README.md
```


