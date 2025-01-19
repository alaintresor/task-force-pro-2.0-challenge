# Task Force Pro 2.0 Challenge

This repository contains both the frontend and backend codebases for the **Task Force Pro 2.0 Challenge**. The frontend is built with ReactJS, while the backend is developed using Node.js.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Backend](#backend)
  - [Technologies](#technologies)
  - [Setup and Deployment](#setup-and-deployment)
- [Frontend](#frontend)
  - [Technologies](#technologies-1)
  - [Setup and Deployment](#setup-and-deployment-1)
- [Environment Variables](#environment-variables)
- [Priview Version](#priview-version)

---

## Project Structure

```
root
├── backend          # Node.js backend code
│   ├── src          # Source code
│   ├── package.json # Backend dependencies and scripts
│   └── ...
├── frontend         # ReactJS frontend code
│   ├── src          # Source code
│   ├── public       # Public assets
│   ├── package.json # Frontend dependencies and scripts
│   └── ...
└── README.md        # Project documentation
```

---

## Backend

The backend of this project is a Node.js application that provides API services for the frontend. It includes database management, authentication, and other core functionalities.

### Technologies

- Node.js
- Express
- Mongodb

### Setup and Deployment

1. Navigate to the `wallet_app_be` directory:
   ```bash
   cd wallet_app_be
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the `.env.example` and configure the required variables:
   ```plaintext
   PORT=4000
   DEV_MONGODB_URL=your_database_url
   NODE_ENV=development
   ```

4. Run the application locally:
   ```bash
   npm run start:dev
   ```

---

## Frontend

The frontend is a ReactJS application that provides a user-friendly interface to interact with the backend APIs.

### Technologies

- ReactJS
- Axios (for API requests)

### Setup and Deployment

1. Navigate to the `wallet_app_fe` directory:
   ```bash
   cd wallet_app_fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the `.env.example` and configure the required variables:
   ```plaintext
   VITE_BASE_URL=http://localhost:4000/api/v1
   ```

4. Run the application locally:
   ```bash
   npm start
   ```
---

## Environment Variables

Ensure both the backend and frontend have the correct `.env` files:

### Backend
| Variable         | Description                 |
|------------------|-----------------------------|
| `PORT`           | Port number for the server |
| `DEV_MONGODB_URL`   | Database connection string |
| `NODE_ENV`       | Environment (development/production) |
| `JWT_SECRET`       | JWT secret key |

### Frontend
| Variable              | Description                       |
|-----------------------|-----------------------------------|
| `VITE_BASE_URL`   | Backend API base URL             |

---

## Priview Version
```url
https://task-force-pro-2-0-challenge.vercel.app/
```

