# Project Overview

This project consists of two main components: a Node.js API and a React.js Dashboard. The API is developed using Express.js, while the Dashboard is built with React.js.

## Project Structure

The project directory is organized as follows:

```
Dev
├─ .gitignore
├─ client_sim
│  └─ launch.py
├─ hermes.db
├─ hermes_dashboard
│  ├─ jsconfig.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  └─ robots.txt
│  ├─ README.md
│  ├─ src
│  │  ├─ App.js
│  │  ├─ assets
│  │  │  ├─ encours.png
│  │  │  ├─ logo.png
│  │  │  └─ workshop.png
│  │  ├─ components
│  │  │  ├─ Display.jsx
│  │  │  ├─ Header.jsx
│  │  │  ├─ ModalTable.jsx
│  │  │  ├─ Sidebar.jsx
│  │  │  └─ StatCard.jsx
│  │  ├─ index.css
│  │  ├─ index.js
│  │  └─ pages
│  │     ├─ Alerts.js
│  │     ├─ Home.js
│  │     ├─ Settings.js
│  │     └─ Tables.js
│  └─ tailwind.config.js
└─ node_api
   ├─ .env
   ├─ .gitignore
   ├─ erase.ts
   ├─ index.js
   ├─ index.test.js
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  └─ schema.prisma
   ├─ seed.ts
   └─ seed_old.ts
```

## Launching the Node API

### Installation

To install the necessary dependencies for the Node API, navigate to the `node_api` directory and run:

```bash
npm install
```

### Starting the API

You can start the API using one of the following methods:

- **Manually**:

  ```bash
  npm start
  ```

- **Using PM2 for Continuous Running**:

  ```bash
  pm2 start index
  ```

  PM2 is a process manager that helps keep your application running continuously.

## Launching the Dashboard

### Installation

Navigate to the `hermes_dashboard` directory and install the necessary dependencies:

```bash
cd hermes_dashboard
npm install
```

### Starting the Dashboard in Development Mode

To start the Dashboard in development mode, run:

```bash
npm start
```

This command will start a development server and open the Dashboard in your default web browser.

### Building the Dashboard for Production

To create a production-ready build of the Dashboard, run:

```bash
npm run build
```

This will generate a production build in the `build` directory.

## Migrating from Development to Production

### Building the Dashboard for Production

Navigate to the `hermes_dashboard` directory and create a production build:

```bash
cd hermes_dashboard
npm run build
```

### Serving the Built Dashboard

To serve the built Dashboard, use a static file server like `serve`:

```bash
serve -s build
```

This command will start a web server that serves the built Dashboard.

## Startup

To ensure that both the API and Dashboard start automatically on system startup, follow these steps:

1. **Manage the Node API with PM2**:

   Configure PM2 to start the API on system startup. You can do this by running:

   ```bash
   pm2 startup
   ```

   This command will generate a startup script for your system.

2. **Configure Your System to Start the Dashboard Web Server on Boot**:

   Depending on your operating system, you may need to set up a service or script to start the Dashboard web server automatically.

### Note

Ensure that PM2 is properly configured to start the API on system startup to maintain continuous operation.