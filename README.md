# Savanna Spice

This project includes a static restaurant frontend and a Node.js backend that stores booking details in MongoDB and sends booking notifications by email.

## What was added

- `server.js` — Express backend with MongoDB storage and email notifications
- `package.json` — project dependencies and start scripts
- `.env.example` — example configuration for MongoDB and SMTP
- `postman_collection.json` — Postman collection for testing the booking API
- Updated `index.html` and `script.js` to submit the booking form to the backend
- Prices converted from dollars to Kenyan shillings

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set your values:

```bash
copy .env.example .env
```

3. Make sure MongoDB is running and available at the URI in `.env`.

4. To use Gmail with 2-step verification, create an app password in your Google Account and put it in `EMAIL_PASS`.

5. Start the server:

```bash
npm start
```

6. Open the website in your browser:

```text
http://localhost:3000
```

## API Endpoints

- `POST /api/bookings` — save a booking and send an email
- `GET /api/bookings` — retrieve saved bookings
- `GET /api/health` — health check

## Postman

Import `postman_collection.json` into Postman to test the API endpoints.
