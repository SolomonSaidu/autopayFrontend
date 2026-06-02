# Autopay Frontend (Flex/AutoPay)

A modern, high-performance React application for managing automatic payments, tracking financial transactions, and overseeing wallet balances. This frontend communicates with a centralized backend to provide a seamless financial automation experience.

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.x or higher
- **Package Manager**: npm or yarn

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (by default).

### Production
Build the project for production:
```bash
npm run build
```

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **State Management**: React Hooks (useState, useEffect, useCallback)

---

## 📂 Project Structure

```text
autopayfrontend/
├── src/
│   ├── assets/           # Static assets (images, icons, etc.)
│   ├── components/       # UI Components (Atomic and Compound)
│   │   ├── FundWalletModal.jsx    # Wallet top-up interface
│   │   ├── LoginForm.jsx          # User authentication (Login)
│   │   ├── OverviewGrid.jsx       # Dashboard summary statistics
│   │   ├── PaymentScheduler.jsx   # Core feature: set up automated payments
│   │   ├── SettingsView.jsx       # User profile and UI preferences
│   │   ├── Sidebar.jsx            # Main navigation and session management
│   │   ├── SignUpForm.jsx         # User registration
│   │   └── TransactionTable.jsx   # Paginated ledger of historical payments
│   ├── services/         # API Layer
│   │   ├── api.js                 # Axios instance & Interceptors
│   │   └── apiEndpoints.js        # Centralized API route definitions
│   ├── App.jsx           # Global state & view orchestration
│   ├── main.jsx          # Application entry point
│   ├── App.css           # Global component styles
│   └── index.css         # Tailwind directives & base styles
├── public/               # Public assets
├── package.json          # Dependencies & scripts
└── vite.config.js        # Vite configuration
```

---

## 🔌 API & Communication

The application communicates with a backend server hosted at `https://autopay-emx7.onrender.com/api`.

### Authentication
- **Token Storage**: JWT is stored in `localStorage` under the key `flex_auth_token`.
- **Security**: All requests automatically include the `Bearer` token via an Axios Request Interceptor.

### Error Handling
A Response Interceptor monitors for:
- `401 Unauthorized`
- Invalid or Expired Tokens
In these cases, the application automatically clears the local session and redirects the user to the login screen.

---

## 📊 Dashboard Views

1. **Overview**: Real-time stats and account health.
2. **Schedules**: Manage recurring and future-dated automated payments.
3. **Transactions**: Comprehensive ledger of all account activity.
4. **Settings**: Profile management and theme (Dark/Light) toggling.

---

## 🔍 Debugging & Maintenance

### Common Issues
- **CORS/Connection Errors**: Ensure the backend is running at `https://autopay-emx7.onrender.com`. If the backend URL changes, update `src/services/api.js`.
- **Auth Loops**: If you are constantly logged out, check if the `flex_auth_token` in localStorage matches what the backend expects.
- **Environment Variables**: For production deployments, ensure the `baseURL` in `api.js` is correctly configured for the production environment.

### Linting
Maintain code quality by running:
```bash
npm run lint
```

### Data Synchronization
The dashboard syncs data every 60 seconds automatically. To trigger a manual refresh, use the `refreshDashboardData` function provided in `App.jsx`.

---

## 📝 License
Proprietary / Internal Use Only.
