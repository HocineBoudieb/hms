# Hermes Dashboard

Hermes Dashboard is a React-based web application designed to facilitate tracking and monitoring of manufacturing orders. The dashboard provides a user-friendly interface for managing workshops, monitoring active orders, viewing alerts, and configuring system settings.

---

## Features

- **Order Visualization**: Monitor and track manufacturing orders in real time.
- **Alerts Dashboard**: View, resolve, and analyze alerts with visual insights.
- **Workshops Management**: Access workshop-specific data and manage encours and orders.
- **Responsive UI**: Fully responsive design built with TailwindCSS and Material-UI.
- **Customizable Components**: Reusable React components for easy scalability.

---

## Project Structure

The project is organized as follows:

```plaintext
directory structure:
└── hermes_dashboard/
    ├── README.md
    ├── eslint.config.mjs
    ├── jsconfig.json
    ├── package-lock.json
    ├── package.json
    ├── tailwind.config.js
    ├── public/
    │   ├── index.html
    │   ├── manifest.json
    │   └── robots.txt
    └── src/
        ├── App.js
        ├── index.css
        ├── index.js
        ├── assets/
        ├── components/
        │   ├── Display.jsx
        │   ├── Header.jsx
        │   ├── ModalTable.jsx
        │   ├── Sidebar.jsx
        │   └── StatCard.jsx
        └── pages/
            ├── Alerts.js
            ├── Home.js
            ├── Settings.js
            ├── Tables.js
            └── Workshop.js
```

---

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/hermes_dashboard.git
   cd hermes_dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode. The page will reload if you make edits. You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`

Launches the test runner in interactive watch mode.

---

## Configuration

### ESLint

The project uses ESLint with the following configuration:

- **Plugins**: `@eslint/js`, `eslint-plugin-react`
- **Custom Rules**:
  - Disabled `react/react-in-jsx-scope`

Check `eslint.config.mjs` for more details.

### TailwindCSS

The TailwindCSS configuration is defined in `tailwind.config.js` and includes:

- `content` path for including all `src/` files.
- Extended utilities for scrollbar management.

---

## Core Dependencies

- **React**: For building UI components.
- **TailwindCSS**: For styling the application.
- **Material-UI**: For advanced UI components like tables and cards.
- **Axios**: For API requests.
- **Chart.js**: For rendering data visualizations.
- **React Router DOM**: For client-side routing.

---

## Key Components

### `Header.jsx`

Displays the app header with a search bar, user information, and alerts notification.

### `Sidebar.jsx`

Navigation panel with links to all major sections of the dashboard.

### `Display.jsx`

Fetches and displays workshops and `encours` data in a grid layout.

### `ModalTable.jsx`

Modal component for displaying detailed information in a table format.

### `StatCard.jsx`

Reusable component for displaying key statistics.

---

## Pages

### `Home.js`

Landing page displaying key metrics and workshop information.

### `Alerts.js`

Displays active and resolved alerts with metrics and visualization using `Doughnut` charts.

### `Tables.js`

Data grid for viewing detailed information about orders, supports, RFIDs, and alerts.

### `Workshop.js`

Provides detailed information for a specific workshop, including `encours` and orders.

### `Settings.js`

Basic settings page.

---

## APIs

The app communicates with a backend server via the following endpoints:

- `GET /workshops`: Fetch all workshops.
- `GET /encours`: Fetch all `encours` data.
- `GET /alerts`: Fetch active and resolved alerts.
- `GET /orders`: Fetch all orders.
- `POST /orders/assign`: Assign a trolley to an order.

Ensure the backend is running and accessible at `http://localhost:8081`.

---

## Development Notes

- The app uses hot-reloading for a seamless development experience.
- All styles are managed via TailwindCSS, and custom utilities are defined in `index.css`.
