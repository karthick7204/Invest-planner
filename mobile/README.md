# InvestPlanner Mobile Application (Expo / React Native)

The official cross-platform mobile companion for Invest Planner, built with Expo Router and React Native.

## 📱 Features

- **Authentication**: JWT-based authentication with session persistence in AsyncStorage, automatic authorization header injection, and 401 token expiry handling.
- **Financial Dashboard**: Live synchronization of total income, expenses, and surplus calculations from the backend.
- **Transactions Management**: Real-time listing, creation (with validated category and purpose), and deletion of transactions.
- **Budget Tracking**: Category-based monthly budget goals with utilization progress indicators, overspend alerts, and modal definition.
- **Asset Allocation**: Dynamic surplus investment split calculation (50% Stocks, 30% Mutual Funds, 20% Gold).
- **Gemini AI Financial Reports**: Full personalized audit reports powered by Google Gemini AI with health scores, net worth velocity, observations, action recommendations, and native sharing.
- **AI Spending Insights**: Real-time weekly spending intelligence and autonomous anomaly detection.
- **Stock Suggestions**: Live National Stock Exchange (NSE) quotes with price range filtering and search.

## 🌐 Backend API Connectivity & Mobile Networking

The mobile app communicates with the shared backend Express API (`backend/`).

### Environment Variables (`.env`)

Configure `EXPO_PUBLIC_API_URL` in `mobile/.env`:

```env
# Default development URL
EXPO_PUBLIC_API_URL=http://localhost:3002
```

### Mobile Networking Rules:
1. **Web Browser (`npm run web`) & iOS Simulator (`npm run ios`)**:
   `http://localhost:3002` connects directly.
2. **Android Emulator (`npm run android`)**:
   The app automatically maps `localhost` to `http://10.0.2.2:3002`.
3. **Physical Phone via Expo Go**:
   `localhost` on a phone refers to the phone itself. The centralized API client (`src/services/api.ts`) automatically extracts your computer's LAN IP from Expo's dev server `hostUri` (e.g. `http://192.168.1.15:3002`). You can also explicitly specify your computer's Wi-Fi IPv4 address in `mobile/.env`.
4. **Production**:
   Set `EXPO_PUBLIC_API_URL=https://api.yourinvestplanner.com` in your production build / EAS environment.

## 🚀 Getting Started

1. **Start the backend server:**
   ```bash
   cd ../backend
   npm run build
   npm run dev
   ```

2. **Start the Expo mobile app:**
   ```bash
   cd ../mobile
   npx expo start
   ```

3. **Typecheck:**
   ```bash
   npx tsc --noEmit
   ```
