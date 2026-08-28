![Project Banner](docs/readme-agent/banner.svg)

# Admin Interface

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Technology Stack

- JavaScript
- CSS
- HTML
- npm

## Admin Interface

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

This repository serves as a foundational setup for an Admin Interface, providing a robust starting point for React development using Vite.

## Tech Stack

*   JavaScript
*   CSS
*   HTML
*   npm

## Getting Started

To get a local copy up and running, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

This project includes several scripts defined in `package.json` for development, building, linting, and previewing.

*   **Run Development Server:**
    ```bash
    npm run dev
    ```
    (Runs `vite`)

*   **Build for Production:**
    ```bash
    npm run build
    ```
    (Runs `vite build`)

*   **Run Linter:**
    ```bash
    npm run lint
    ```
    (Runs `eslint .`)

*   **Preview Production Build:**
    ```bash
    npm run preview
    ```
    (Runs `vite preview`)

## Project Structure

The project utilizes a standard Vite/React structure, with components and hooks organized within the `src/` directory.

**Root Directory:**
*   `.env`: Environment variables file.
*   `.env.example`: Example environment variables.
*   `.gitignore`: Specifies files to be ignored by Git.
*   `README.md`: This file.
*   `eslint.config.js`: ESLint configuration file.
*   `index.html`: Main HTML entry point.
*   `package-lock.json`: Dependency lock file.
*   `package.json`: Project metadata and scripts.
*   `vite.config.js`: Vite configuration file.

**`public/` Directory:**
*   `public/favicon.svg`: Favicon asset.
*   `public/icons.svg`: Icon asset.

**`src/` Directory:**
*   `src/App.css`: Global styles for the application.
*   `src/App.jsx`: Main application component.
*   `src/assets/`: Contains various assets (e.g., `hero.png`, `react.svg`, `vite.svg`).
*   `src/auth/`: Contains authentication related components (e.g., `Login.jsx`, `ForgotPassword.jsx`, `ProtectedRoute.jsx`).
*   `src/hooks/`: Contains custom hooks (e.g., `useAdminAuth.js`, `useCampusOrderMonitor.js`, `useSessionTimeout.js`, `useShopStatusWatcher.js`).

## Development Details

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules. The application structure suggests a focus on authentication and monitoring features, utilizing custom hooks and protected routes.

## Setup Guide

### Frontend Setup

```bash

npm install
npm run dev     # development
npm run build && npm start   # production
```

Open `http://127.0.0.1:5173` (or the port shown in the terminal).

### Configuration

Copy environment templates before running:

- `.env.example` → copy to `.env` in the same directory

### Running the Application

1. **Start web app** — `npm run dev` in `./`

```bash
cd .
npm install
npm run dev
```

## System Architecture

High-level system design, data flows, API map, and workflow pipelines derived from the repository structure.

### System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        user["User / Operator"]
        api_client["API / CLI Client"]
    end

    subgraph Core["src/ — Application Core"]
    end

    subgraph Data["Data & Artifacts"]
        datasets["Datasets · JSON · CSV"]
    end

    subgraph Charts["Metrics & Dashboard Charts"]
        page_views["Page views chart"]
        nav_sections["Navigation sections map"]
        project_showcase["Project showcase grid"]
        skills_timeline["Skills & experience timeline"]
        contact_funnel["Contact conversion funnel"]
        media_gallery["Media & assets gallery"]
    end

    user --> api_client
    api_client --> Core
    user -->|Web UI| dashboard_kpis
    Core --> page_views
    page_views --> user
```

### Data Flow & Charts Pipeline

```mermaid
flowchart LR
    U["User / Event"] --> IN["Untrusted Input"]

    subgraph Pipeline["Processing Pipeline"]
        p0["Input"]
        p1["Processing"]
        p2["Output"]
        p0 --> p1
        p1 --> p2
    end

    subgraph Metrics["Metrics & Chart Feeds"]
        page_views["Page views chart"]
        nav_sections["Navigation sections map"]
        project_showcase["Project showcase grid"]
        skills_timeline["Skills & experience timeline"]
        contact_funnel["Contact conversion funnel"]
        media_gallery["Media & assets gallery"]
    end

    IN --> p0
    p2 --> OUT["Authorized Output"]
    OUT --> U
    p2 --> page_views
    page_views --> U
```

### Component & API Map

```mermaid
graph LR
    subgraph App["src Components"]
        main["main<br/>Main"]
    end
```

### Application Page Map

```mermaid
mindmap
  root((admin_interface))
    Web UI
      dashboard
```

## Application Pages

Screenshots captured from the running application. Each page is listed with its function.

### Application

#### Analytics

Analytics — application page at `/analytics`

![Analytics](docs/readme-agent/pages/analytics.png)

#### Categories

Categories — application page at `/categories`

![Categories](docs/readme-agent/pages/categories.png)

#### Forgot Password

Forgot Password — application page at `/forgot-password`

![Forgot Password](docs/readme-agent/pages/forgot-password.png)

#### Locations

Locations — application page at `/locations`

![Locations](docs/readme-agent/pages/locations.png)

### Public

#### Login

Login — application page at `/login`

![Login](docs/readme-agent/pages/login.png)

### Application

#### Orders

Orders — application page at `/orders`

![Orders](docs/readme-agent/pages/orders.png)

#### Reset Password

Reset Password — application page at `/reset-password`

![Reset Password](docs/readme-agent/pages/reset-password.png)

#### Vendors

Vendors — application page at `/vendors`

![Vendors](docs/readme-agent/pages/vendors.png)
