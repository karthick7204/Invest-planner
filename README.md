# Invest Planner

Invest Planner is a comprehensive full-stack personal finance and investment management application. It provides users with tools to track daily expenses, manage budgets, set savings goals, monitor stock market data (NSE), and get AI-powered financial insights.

## 🏗 Architecture Overview

The application follows a modern client-server architecture with a clear separation of concerns between the frontend presentation layer and the backend API layer.

### Tech Stack

- **Frontend:** Next.js 15+ (App Router), React 19, Tailwind CSS, Recharts, Lucide React
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT)
- **External Integrations:** 
  - Google Generative AI (Gemini) for AI-powered financial insights
  - `stock-nse-india-secure` for live National Stock Exchange (NSE) data

### System Components

#### 1. Frontend (Next.js Application)
Located in `frontend/investplanner/`.
- **Pages & Routing:** Uses Next.js App Router for dynamic routing (Dashboard, Expenses, Investments, Stocks, Reports, etc.).
- **State Management & UI:** Built with functional React components. Uses Tailwind CSS for responsive and modern styling.
- **Data Visualization:** Utilizes Recharts to render interactive charts for budgets, expenses, and stock trends.
- **Client-Side Fetching:** Communicates with the backend REST API via standard HTTP requests.

#### 2. Backend (Express API)
Located in `backend/`.
- **Controllers & Routes:** Modularized routes for different domains:
  - `/api` - Authentication (Login/Register)
  - `/expense` & `/dailyexpense` - Expense tracking and history
  - `/budget` - Budget allocation and management
  - `/target` - Savings goals and target tracking
  - `/invest` - Investment portfolio management
  - `/stocks` - Live NSE stock market data fetching
  - `/ai` - Integration with Google's Gemini AI for smart financial suggestions
- **Middleware:** Custom request handlers and JWT-based authorization middleware to secure endpoints.
- **Database Models:** Mongoose schemas defining the structure for Users, Expenses, Budgets, Investments, etc.

#### 3. Database Layer (MongoDB)
- A NoSQL database hosted on MongoDB Atlas, ensuring flexible schema design for complex financial records and high availability.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- API Keys for Google Generative AI

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/karthick7204/Invest-planner.git
   cd Invest-planner
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=3000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend/investplanner
   npm install
   ```
   Create a `.env` file in the `frontend/investplanner/` directory if needed for API URLs.
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open your browser and navigate to `http://localhost:3000` (or the port specified by Next.js).

## 📁 Project Structure

```text
Invest-planner/
├── backend/
│   ├── src/
│   │   ├── middleware/   # Express middlewares (Auth, Error handling)
│   │   ├── routes/       # API Route definitions
│   │   ├── models/       # Mongoose DB schemas
│   │   └── index.ts      # Express App entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   └── investplanner/
│       ├── app/          # Next.js App Router pages & layouts
│       ├── public/       # Static assets
│       ├── tailwind.config.ts
│       └── package.json
└── README.md
```

## 🔐 Security
- **Authentication:** All protected routes require a valid JWT token passed in the Authorization header.
- **CORS:** Configured to restrict access to trusted origins.
- **Environment Variables:** Sensitive keys and database URIs are strictly managed via `.env` files and never committed to version control.
