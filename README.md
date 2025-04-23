# MyTube Clone - Video Sharing Platform

This is a simple video sharing platform built with the MERN stack (simplified version, here it's React + Node.js/Express).

## ✨ Features

*   **Video Browsing**: Displays a list of recommended videos in a grid layout on the homepage.
*   **Video Watching**: Click on a video to enter the watch page, which includes the video player, title, description, uploader information, etc.
*   **Comment System**: View and add comments below the video (currently simulated on the frontend, can be connected to a backend API).
*   **Related Videos**: Displays a list of related videos on the right side of the watch page.
*   **Responsive Layout**: Simple responsive design, including a navigation bar and sidebar.

## 🚀 Tech Stack

*   **Frontend**:
    *   React
    *   React Router DOM (for page routing)
    *   CSS (for styling)
*   **Backend**:
    *   Node.js
    *   Express (for building the API)
    *   CORS (for handling cross-origin requests)
*   **Data Storage**:
    *   In-memory storage (for simulating video and comment data)

## ⚙️ Installation and Running

**Prerequisites:**

*   Install [Node.js](https://nodejs.org/) (includes npm)

**Backend:**

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the backend server (runs on `http://localhost:3001` by default):
    ```bash
    node server.js
    ```
    Or use `nodemon` (if installed):
    ```bash
    nodemon server.js
    ```

**Frontend:**

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server (runs on `http://localhost:3000` by default):
    ```bash
    npm start
    ```

4.  Open `http://localhost:3000` in your browser to access the application.

## 📄 License

This project is licensed under the [Apache License 2.0](LICENSE).
