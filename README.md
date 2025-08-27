# DCA Trading App 🚀

A modern, secure Dollar-Cost Averaging (DCA) trading application built with Next.js 14 and Vincent Authentication. Automate your cryptocurrency investments with intelligent strategies and real-time portfolio tracking.

## ✨ Features

### 🔐 **Secure Authentication**
- **Vincent Authentication**: Decentralized identity management using Lit Protocol's Vincent Web App Client
- **Wallet Integration**: Seamless connection with Ethereum wallets
- **JWT Token Management**: Secure session handling with automatic expiration checks

### 📊 **DCA Strategy Management**
- **Multiple Frequencies**: Daily, Weekly, and Monthly DCA strategies
- **Token Pair Trading**: Support for ETH, USDC, UNI, LINK, and more
- **Smart Execution**: Automated strategy execution with configurable amounts
- **Portfolio Tracking**: Real-time tracking of total invested and received amounts

### 💹 **Real-Time Analytics**
- **Performance Metrics**: Track total returns, average buy prices, and execution counts
- **Price Monitoring**: Live token price feeds with 24-hour change indicators
- **Interactive Charts**: Visualize your DCA performance over time using Recharts
- **Portfolio Overview**: Comprehensive dashboard with key metrics

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Clean Interface**: Intuitive navigation and user-friendly forms
- **Loading States**: Smooth loading indicators and error handling
- **Dark Mode Ready**: Built with modern design principles

## 🏗️ **Architecture**

### **Frontend (Next.js 14)**
```
app/
├── components/          # Reusable UI components
│   ├── auth-provider.tsx    # Vincent authentication wrapper
│   └── navbar.tsx          # Navigation component
├── dashboard/          # Dashboard page
├── login/             # Authentication page
├── strategies/        # DCA strategy management
│   ├── create/           # Create new strategy
│   └── page.tsx         # Strategy list
├── lib/               # Utility libraries
│   └── vincent-auth.ts    # Vincent authentication utilities
├── stores/            # State management (Zustand)
│   └── auth-store.ts     # Authentication state
└── types/             # TypeScript definitions
    └── dca.ts            # DCA-related types
```

### **Backend API (Next.js App Router)**
```
app/api/
├── strategies/        # DCA strategy endpoints
│   ├── route.ts          # GET, POST strategies
│   └── [id]/route.ts     # PUT, DELETE specific strategy
├── tokens/            # Token information
│   └── route.ts          # GET available tokens
├── prices/            # Price data
│   └── route.ts          # GET real-time prices
└── executions/        # Strategy execution tracking
```

## 🛠️ **Tech Stack**

### **Core Technologies**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management

### **Authentication & Security**
- **@lit-protocol/vincent-app-sdk**: Decentralized authentication
- **@lit-protocol/vincent-ability-sdk**: Advanced capabilities
- **JWT**: Secure token management

### **Blockchain Integration**
- **Ethers.js v6**: Ethereum interaction
- **Uniswap Integration**: Token swapping capabilities

### **Data & Forms**
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Date-fns**: Date manipulation

### **Visualization**
- **Recharts**: Interactive charts and graphs
- **Lucide React**: Modern icon library

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Ethereum wallet (MetaMask recommended)
- Vincent app configuration

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/NirajBhattarai/ProjectDCA.git
   cd ProjectDCA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Ethereum Configuration
   NEXT_PUBLIC_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
   NEXT_PUBLIC_CHAIN_ID=1
   
   # Trading Configuration
   NEXT_PUBLIC_UNISWAP_ROUTER_ADDRESS=0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45
   NEXT_PUBLIC_DEFAULT_SLIPPAGE=0.5
   
   # Vincent Authentication
   NEXT_PUBLIC_VINCENT_APP_ID=426578300
   NEXT_PUBLIC_VINCENT_REDIRECT_URI=http://localhost:3000/login
   
   # API Keys (Keep secret)
   PRIVATE_KEY=your_private_key_here
   COINGECKO_API_KEY=your_coingecko_api_key
   INFURA_PROJECT_ID=your_infura_project_id
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

## 📱 **Pages & Routes**

### **Public Routes**
- `/login` - Vincent authentication page
- Landing page with app overview

### **Protected Routes**
- `/` - Main dashboard with portfolio overview
- `/dashboard` - Alternative dashboard route
- `/strategies` - DCA strategy management
- `/strategies/create` - Create new DCA strategy
- `/approvals` - ERC20 token approval management

### **API Endpoints**
- `GET /api/strategies` - Fetch all user strategies
- `POST /api/strategies` - Create new strategy
- `PUT /api/strategies/[id]` - Update strategy
- `DELETE /api/strategies/[id]` - Delete strategy
- `GET /api/tokens` - Get available tokens
- `GET /api/prices?token=[address]` - Get token prices
- `GET /api/executions` - Get execution history
- `GET /api/approvals` - Precheck ERC20 approval execution
- `POST /api/approvals` - Execute ERC20 token approval

## 🔧 **Configuration**

### **Vincent Authentication Setup**
1. Register your app with Vincent Platform
2. Get your `VINCENT_APP_ID`
3. Configure redirect URIs
4. Update environment variables

### **Blockchain Configuration**
1. Set up Infura or Alchemy RPC endpoint
2. Configure Uniswap router address
3. Set default slippage tolerance
4. Add private key for automated execution

### **Token Configuration**
Currently supported tokens:
- **ETH** (Ethereum): `0x0000000000000000000000000000000000000000`
- **USDC** (USD Coin): `0xA0b86a33E6441E6D3c3b6F7e8bb66F3da7E0b0Fc`
- **UNI** (Uniswap): `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984`
- **LINK** (Chainlink): `0x514910771AF9Ca656af840dff83E8264EcF986CA`

## 📊 **DCA Strategy Types**

### **Frequency Options**
- **Daily**: Execute every 24 hours
- **Weekly**: Execute every 7 days  
- **Monthly**: Execute every 30 days

### **Strategy Configuration**
```typescript
interface DcaStrategy {
  name: string;              // Strategy identifier
  tokenIn: string;           // Input token address (e.g., USDC)
  tokenOut: string;          // Output token address (e.g., ETH)
  amountPerExecution: number; // Amount to invest per execution
  frequency: DcaFrequency;   // Execution frequency
}
```

## 🔒 **Security Features**

### **Authentication Security**
- Decentralized identity with Vincent
- JWT token validation
- Automatic session expiration
- Secure token storage

### **Transaction Security**
- Private key encryption
- Slippage protection
- Gas optimization
- Transaction verification

## 🚀 **Deployment**

### **Vercel Deployment**
```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

### **Environment Variables**
Ensure all environment variables are configured in your deployment platform:
- Vincent app configuration
- RPC endpoints
- API keys
- Private keys (encrypted)

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 **Support**

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation wiki

## 🔮 **Roadmap**

### **Phase 1** ✅
- [x] Basic DCA strategy creation
- [x] Vincent authentication integration
- [x] Portfolio dashboard
- [x] Real-time price feeds

### **Phase 2** 🚧
- [ ] Advanced analytics and reporting
- [ ] Multiple exchange support
- [ ] Mobile app development
- [ ] Social trading features

### **Phase 3** 📋
- [ ] AI-powered strategy optimization
- [ ] Cross-chain DCA support
- [ ] Institutional features
- [ ] API for third-party integrations

---

**Built with ❤️ by the DCA Trading Team**

*Making cryptocurrency investing accessible, automated, and intelligent.*