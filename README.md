# Menuza 🍽️

> **Your menu, made digital.**  
> A simple, lightweight, on-chain digital menu application for restaurants, cafés, and food vendors powered by **BOT Chain Mainnet**.

---

## 🌟 Overview

Menuza bridges culinary hospitality and Web3 decentralization:
- **For Customers**: Browse menus, live prices, and instant availability **without connecting a wallet**.
- **For Restaurant Owners**: Connect with MetaMask to publish new dishes, adjust pricing, toggle item availability (Available vs. Sold Out), and delist items on-chain with cryptographic ownership.
- **Serverless & Non-Custodial**: No centralized database, no backend API, no payment gateways or tokens. All menu items live directly on BOT Chain Mainnet.

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

## ⛓️ Blockchain Configuration (Mainnet)

| Property | Value |
| :--- | :--- |
| **Network Name** | **Botchain Mainnet** |
| **Chain ID** | `677` |
| **RPC URL** | `https://rpc.botchain.ai` |
| **Currency Symbol** | `BOT` |
| **Total Supply** | 150 Million |
| **BOT Chain Website** | [https://botchain.ai](https://botchain.ai) |
| **BOT Chain Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Verified Contract** | [`0x866630e38A98eEc2cD612A1B46dFFA9E8e33dd19`](https://scan.botchain.ai/address/0x866630e38A98eEc2cD612A1B46dFFA9E8e33dd19#code) |

---

## 📂 Project Structure

```text
Menuza/
├── app/
│   ├── globals.css         # Restaurant charcoal & warm cream styling
│   ├── layout.tsx          # Root layout and metadata
│   └── page.tsx            # One-page application (Hero, Public Menu, Owner Portal, BOT Chain section)
├── components/
│   ├── AddItemModal.tsx     # Modal to add dishes with name, description, price (BOT), category
│   ├── EditItemModal.tsx    # Modal to update dish details & price
│   ├── Header.tsx           # Logo, BOT Chain ecosystem links & wallet connector
│   ├── OwnerDashboard.tsx   # Metrics & item management for connected restaurant owners
│   ├── Providers.tsx        # Wagmi and React Query providers
│   ├── PublicMenu.tsx       # Public menu browsing with category filter & search
│   └── RemoveItemDialog.tsx # Confirmation dialog to delist menu items
├── contracts/
│   └── Menuza.sol           # Gas-efficient Solidity contract
├── lib/
│   ├── chains.ts            # Botchain Mainnet Viem definition (Chain ID 677)
│   ├── types.ts             # TypeScript interfaces for MenuItem
│   ├── utils.ts             # Price, address, and date formatting helpers
│   ├── wagmi.ts             # Wagmi client configuration
│   └── contracts/
│       ├── abi.ts           # Typed ABI definition for Menuza
│       └── deployment.json  # Mainnet deployment metadata
├── scripts/
│   └── deploy.ts            # Hardhat deployment script for Botchain Mainnet
├── test/
│   └── Menuza.test.ts       # Comprehensive smart contract test suite (18 tests)
├── hardhat.config.ts        # Hardhat configuration for Botchain Mainnet
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
```bash
git clone https://github.com/liljhnxn/menuza.git
cd Menuza
npm install --legacy-peer-deps
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

`.env.local` contents:
```env
NEXT_PUBLIC_CHAIN_ID=677
NEXT_PUBLIC_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_BLOCK_EXPLORER=https://scan.botchain.ai
NEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS=0x866630e38A98eEc2cD612A1B46dFFA9E8e33dd19
```

---

## 🧪 Testing

Run the full smart contract test suite covering 18 scenarios:
```bash
npm run test
```

---

## 🚢 Deployment to Botchain Mainnet

1. Ensure your deployer wallet has funds in `BOT`.
2. Run the deployment script:
   ```bash
   npx hardhat run scripts/deploy.ts --network botchainMainnet
   ```
3. Verify on BotchainScan:
   ```bash
   npx hardhat verify --network botchainMainnet <CONTRACT_ADDRESS>
   ```

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

## 🦊 Adding Botchain Mainnet to MetaMask

- **Network Name**: Botchain Mainnet
- **New RPC URL**: `https://rpc.botchain.ai`
- **Chain ID**: `677`
- **Currency Symbol**: `BOT`
- **Block Explorer URL**: `https://scan.botchain.ai`

---

## 📄 License
MIT
