# Lost & Found Application

A Node.js + Express + MongoDB application for reporting and viewing lost and found items. Used Google gemini for intelligent searching.

<img width="866" height="717" alt="Screenshot (1470)" src="https://github.com/user-attachments/assets/c2755456-3f5f-4e6f-ae6f-364a67f48e8d" />
<img width="800" height="642" alt="Screenshot (1468)" src="https://github.com/user-attachments/assets/82a15c30-aebb-4b22-a26a-42d2f8d5069e" />

## Prerequisites

- Node.js (v14 or higher)

## Installation

1. Clone or download the project.
2. Navigate to the project directory.
3. Install dependencies:
   ```
   npm install
   ```

## Running the Application

1. Start the application:
   ```
   npm run dev
   ```
2. Open your browser and go to `http://localhost:3000`

## Features

- Report lost or found items
- Upload images (optional)
- View all open items
- Close items when resolved
- Contact information for items

## Tech Stack

- Node.js
- Express.js
- NeDB (file-based database, MongoDB-like)
- Multer for file uploads
- EJS for templating
- dotenv for environment variables
