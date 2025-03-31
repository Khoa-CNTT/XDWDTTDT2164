# Frontend - Recruitment Website

This is the frontend of the Recruitment Website project, built with **Vue.js**. It provides a user interface for candidates to apply for jobs, employers to post jobs, and an admin dashboard, integrated with a backend API.

## Tech Stack

- **Vue.js**: Frontend framework
- **Vue Router**: Client-side routing
- **Vuex**: State management
- **Axios**: HTTP requests to backend API

## Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

## Project Structure

```bash
frontend/
├── public/ # Static assets (favicon, index.html)
├── src/ # Main source code
│ ├── assets/ # Images, CSS
│ ├── components/ # Reusable components (e.g., Navbar.vue)
│ ├── views/ # Page components (e.g., Home.vue)
│ ├── router/ # Route definitions
│ ├── store/ # Vuex store
│ ├── App.vue # Root component
│ └── main.js # Entry point
├── .env # Environment variables
├── package.json # Dependencies and scripts
└── vue.config.js # Vue CLI configuration (aliases)
```

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd frontend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the development Server**
   ```bash
   npm run dev
   ```
