# Options Trading App Simulation

This project is a basic options trading app simulation built with Next.js, React, and MongoDB. It allows users to simulate trading binary options, manage balances, and interact with an orderbook.


https://github.com/user-attachments/assets/a5b69c38-6176-4064-9b02-a198400d5717



## Features

- User authentication
- INR balance management (onramp and faucet)
- Stock balance management
- Place 'Yes' and 'No' orders
- Real-time orderbook updates using WebSockets
- Mint tokens for trading
- Matching engine for order execution

## Technologies Used

- Next.js 14
- React 18
- MongoDB
- Socket.IO for real-time updates
- Tailwind CSS for styling
- Framer Motion for animations

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/options-trading-app.git
   cd options-trading-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Contains the main application pages and API routes
- `src/components`: React components used throughout the app
- `src/lib`: Utility functions and database operations
- `src/pages/api`: API routes for WebSocket initialization

## API Endpoints

- `/api/balance/inr/:userId`: Get INR balance
- `/api/balance/stock/:userId`: Get stock balance
- `/api/onramp/inr`: Onramp INR
- `/api/faucet`: Use faucet to get free INR
- `/api/order/yes`: Place a 'Yes' order
- `/api/order/no`: Place a 'No' order
- `/api/orderbook/:stockSymbol`: Get orderbook for a stock
- `/api/trade/mint/:stockSymbol`: Mint new tokens
