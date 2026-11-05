# Menuza 🍽️

> **Your menu, made digital.**  
> A simple, lightweight, on-chain digital menu application for restaurants, cafés, and food vendors powered by **Botchain Testnet**.

---

## 🌟 Overview

Menuza bridges culinary hospitality and Web3 decentralization:
- **For Customers**: Browse menus, live prices, and instant availability **without connecting a wallet**.
- **For Restaurant Owners**: Connect with MetaMask to publish new dishes, adjust pricing, toggle item availability (Available vs. Sold Out), and delist items on-chain with cryptographic ownership.
- **Serverless & Non-Custodial**: No centralized database, no backend API, no payment gateways or tokens. All menu items live directly on Botchain Testnet.

---

## ⚡ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (dark charcoal & warm cream restaurant aesthetics)
- **Smart Contract**: Solidity (`^0.8.20`)
- **Smart Contract Development**: Hardhat
- **Blockchain Connectivity**: `wagmi` v2, `viem` v2, `@tanstack/react-query`
- **Wallet Support**: MetaMask / Injected Web3 wallets

---

## ⛓️ Blockchain Configuration

| Property | Value |
| :--- | :--- |
| **Network Name** | Botchain Mainnet |
| **Chain ID** | `677` |
| **RPC URL** | `https://rpc.botchain.ai` |
| **Currency Symbol** | `BOT` |
| **Total Supply** | 150 Million |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Verified Contract** | [`0x866630e38A98eEc2cD612A1B46dFFA9E8e33dd19`](https://scan.botchain.ai/address/0x866630e38A98eEc2cD612A1B46dFFA9E8e33dd19#code) |

---

## 📂 Project Structure

```text
Menuza/
├── app/
│   ├── globals.css         # Restaurant charcoal & warm cream styling
│   ├── layout.tsx          # Root layout and metadata
│   └── page.tsx            # One-page application (Hero, Public Menu, Dashboard)
├── components/
│   ├── AddItemModal.tsx     # Modal to add dishes with name, description, price, category
│   ├── EditItemModal.tsx    # Modal to update dish details & price
│   ├── Header.tsx           # Logo, Botchain network badge & wallet connector
│   ├── OwnerDashboard.tsx   # Metrics & item management for connected restaurant owners
│   ├── Providers.tsx        # Wagmi and React Query providers
│   ├── PublicMenu.tsx       # Public menu browsing with category filter & search
│   └── RemoveItemDialog.tsx # Confirmation dialog to delist menu items
├── contracts/
│   └── Menuza.sol           # Gas-efficient Solidity contract
├── lib/
│   ├── chains.ts            # Botchain Testnet Viem definition (Chain ID 968)
│   ├── types.ts             # TypeScript interfaces for MenuItem
│   ├── utils.ts             # Price, address, and date formatting helpers
│   ├── wagmi.ts             # Wagmi client configuration
│   └── contracts/
│       └── abi.ts           # Typed ABI definition for Menuza
├── scripts/
│   └── deploy.ts            # Hardhat deployment script for Botchain
├── test/
│   └── Menuza.test.ts       # Comprehensive smart contract test suite (18 tests)
├── hardhat.config.ts        # Hardhat configuration for Botchain Testnet
├── tailwind.config.ts       # Custom restaurant color scheme
├── tsconfig.json            # TypeScript configuration
└── package.json
```

---

## 📜 Smart Contract (`Menuza.sol`)

The `Menuza.sol` contract contains all digital menu logic:

- `addItem(name, description, price, category)`: Registers a new menu item, assigns unique incremental ID, marks it Available, and emits `ItemAdded`.
- `editItem(id, name, description, price, category)`: Allows only the original owner to modify item information and emits `ItemUpdated`.
- `updateAvailability(id, isAvailable)`: Allows the owner to toggle between Available and Sold Out, emitting `AvailabilityUpdated`.
- `removeItem(id)`: Delists an item, preventing unauthorized deletion, and emits `ItemRemoved`.
- `getItem(id)`: Public view to retrieve an individual item.
- `getAllItems()`: Public view returning all active menu items for customer browsing.
- `getMyItems()` / `getItemsByOwner(owner)`: Retrieves items registered by a specific wallet.

### Security & Access Control
- Rejects empty item names (`EmptyItemName`).
- Rejects zero or negative prices (`InvalidPrice`).
- Enforces owner permissions for editing, toggling, and removal (`Unauthorized`).
- Custom errors used for optimal gas efficiency.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or pnpm
- MetaMask browser extension

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repo-url>
cd Menuza
npm install --legacy-peer-deps
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_CHAIN_ID=968
NEXT_PUBLIC_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_BLOCK_EXPLORER=https://scan.bohr.life
NEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS=<YOUR_DEPLOYED_CONTRACT_ADDRESS>

# For contract deployment:
PRIVATE_KEY=your_private_key_here
```

---

## 🧪 Testing

Run the full smart contract test suite covering 18 scenarios:
```bash
npm run test
```

All tests execute against an in-memory EVM verifying:
- Menu item registration
- Empty name and zero price rejection
- Incremental ID allocation
- Owner-only editing and error guards
- Owner-only availability status toggling
- Owner-only item removal and removal guards
- Public querying (`getItem`, `getAllItems`, `getItemsByOwner`)

---

## 🚢 Deployment to Botchain Testnet

1. Ensure your deployer wallet has testnet funds in `BOHR`.
2. Set your `PRIVATE_KEY` in `.env.local` or environment variable:
   ```bash
   export PRIVATE_KEY="0x..."
   ```
3. Run the deployment script:
   ```bash
   npm run deploy
   ```
4. Copy the resulting contract address and add it to `NEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS` in `.env.local`.

---

## 💻 Running the Application

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 🦊 Adding Botchain Testnet to MetaMask

If MetaMask does not switch automatically:
- **Network Name**: Botchain Testnet
- **New RPC URL**: `https://rpc.bohr.life`
- **Chain ID**: `968`
- **Currency Symbol**: `BOHR`
- **Block Explorer URL**: `https://scan.bohr.life`

---

## 📄 License
MIT

