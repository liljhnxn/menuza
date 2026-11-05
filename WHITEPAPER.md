# Menuza — Whitepaper
**A Decentralized, Serverless Digital Menu Protocol on BOT Chain Mainnet**

*Version 1.0 — November 2026*  
*Author: Menuza Core Team*  
*Network: Botchain Mainnet (Chain ID: 677)*  
*Native Currency: BOT*  
*Contract Address: `0x866630e38A98eEc2cD612A1B46dFFA9E8e33dd19`*  
*BOT Chain Website: [https://botchain.ai](https://botchain.ai)*  
*BOT Chain Explorer: [https://scan.botchain.ai](https://scan.botchain.ai)*  
*Verified Contract Code: [https://scan.botchain.ai/address/0x866630e38A98eEc2cD612A1B46dFFA9E8e33dd19#code](https://scan.botchain.ai/address/0x866630e38A98eEc2cD612A1B46dFFA9E8e33dd19#code)*  
*Repository: [github.com/liljhnxn/menuza](https://github.com/liljhnxn/menuza)*  

---

## 1. Executive Summary

**Menuza** is a lightweight, on-chain digital menu protocol designed for restaurants, cafés, food trucks, and hospitality vendors. By deploying core menu cataloging and real-time inventory state directly onto **BOT Chain Mainnet**, Menuza eliminates the recurring SaaS fees, centralized database vulnerabilities, and vendor lock-in that plague traditional digital menu providers.

Crucially, Menuza solves the consumer onboarding dilemma of Web3: **customers browse live menus with zero friction and no wallet requirement**, while restaurant proprietors retain cryptographic ownership over item listings, real-time availability, and pricing in **BOT**.

---

## 2. Problem Statement

Digital menus surged in adoption following the ubiquity of QR codes. However, existing Web2 and Web3 solutions present significant friction:

1. **Predatory SaaS Subscription Fees**: Incumbent QR menu providers charge restaurants recurring monthly subscriptions ($30–$150/month) simply to host basic static JSON or PDF files.
2. **Centralized Outages & Vendor Lock-In**: If the SaaS platform suffers downtime or updates its fee structure, hospitality operators lose access to their menu systems during peak service hours.
3. **Database Fragility & Tampering**: Centralized databases are susceptible to DNS hijacking, phishing redirects, and malicious menu modifications.
4. **Web3 Adoption Barriers**: Most decentralized hospitality applications require diners to connect a wallet or hold governance tokens simply to view a dish, alienating 99% of everyday restaurant patrons.

---

## 3. The Menuza Solution

Menuza re-architects the digital dining workflow with a **public-read / owner-write** decentralized design:

* **Frictionless Public Read**: Menu records are fetched directly from BOT Chain RPC endpoints via HTTP client-side calls. Diners scan a QR code and immediately see live dishes, dietary descriptions, and prices without installing a wallet, signing messages, or paying gas.
* **Cryptographic Owner Control**: Only the original creator wallet can modify prices, update ingredients, delist dishes, or toggle real-time availability (Available vs. Sold Out).
* **Zero Backend Infrastructure**: Menuza requires no centralized server, database (SQL/MongoDB), or custodial cloud accounts. The state is permanently verifiable on BOT Chain.
* **Cost Efficiency**: Utilizing BOT Chain’s high-throughput, low-fee architecture, hospitality owners pay nominal gas fees only when updating their catalog.

---

## 4. Technical Architecture

### 4.1 Smart Contract Layer (`Menuza.sol`)
The core contract is built with Solidity `0.8.20` and optimized with the EVM Paris target:

```solidity
struct MenuItem {
    uint256 id;
    address owner;
    string name;
    string description;
    uint256 price;
    string category;
    bool isAvailable;
    uint256 createdAt;
    bool exists;
}
```

#### Core Methods:
* `addItem(string name, string description, uint256 price, string category)`: Registers a new culinary item, enforces non-empty strings and non-zero pricing, assigns incremental unique IDs, and emits `ItemAdded`.
* `editItem(uint256 id, string name, string description, uint256 price, string category)`: Validates `msg.sender == item.owner` and updates item metadata.
* `updateAvailability(uint256 id, bool isAvailable)`: Enables 1-click status toggling (Available vs. Sold Out) during busy kitchen shifts.
* `removeItem(uint256 id)`: Soft-delists items from public views, preventing unauthorized deletion.
* `getAllItems()`: Efficient view returning all non-delisted active items across all vendors.
* `getItemsByOwner(address owner)`: Filtered view providing instant multi-location or vendor-specific indexing.

#### Security & Gas Optimization:
* Custom errors (`EmptyItemName`, `InvalidPrice`, `ItemNotFound`, `Unauthorized`) save gas over standard revert strings.
* Input sanity checks prevent zero prices and malformed items.
* State storage packing ensures minimal gas consumption during contract execution.

### 4.2 Frontend Application
* **Framework**: Next.js 14 (App Router) + TypeScript.
* **Styling**: Tailwind CSS tailored to dark charcoal (`#141312`) and warm cream (`#FAF6EE`) with terracotta highlights (`#E26D28`).
* **Web3 Integration**: `wagmi` v2 + `viem` v2 with fallback HTTP transports connected to `https://rpc.botchain.ai`.
* **Explorer Verification**: Verified on BotchainScan (`https://scan.botchain.ai/address/0x866630e38A98eEc2cD612A1B46dFFA9E8e33dd19#code`).

---

## 5. Market Opportunity & Target Segments

1. **Independent Food Vendors & Food Trucks**: High-turnover businesses needing quick availability toggling without recurring monthly subscriptions.
2. **Specialty Cafés & Bistros**: Establishments offering dynamic seasonal menus or rotating single-origin roasts.
3. **Web3 Native Venues & Conferences**: Crypto-friendly lounges, hackathons, and conferences showcasing decentralized consumer tech.
4. **Pop-up Kitchens & Night Markets**: Rapid deployment of digital menus with zero cloud infrastructure setup.

---

## 6. Tokenomics & Business Model

Menuza is intentionally designed as **public good infrastructure** for hospitality:
* **Protocol Core**: Free and open source (MIT license).
* **Native Currency**: `BOT`.
* **No Rent-Seeking Tokens**: No artificial protocol tokens or speculative barriers.
* **Sustainability Channels**:
  * Optional premium white-label domains / custom subdomains.
  * Verified restaurant naming integration on BOT Chain.
  * NFC hardware stand and durable wooden/acrylic QR card bundles for brick-and-mortar restaurants.

---

## 7. Roadmap

### Phase 1: Mainnet Protocol Launch (Completed ✅)
* Smart contract design, local Hardhat test suite (18/18 passing).
* Deployment & code verification on BOT Chain Mainnet (Chain ID 677).
* Responsive, mobile-first one-page Next.js application with wallet-free browsing.
* BOT Chain ecosystem integration with direct links to `https://botchain.ai` and `https://scan.botchain.ai`.

### Phase 2: Kitchen Operations & Printing
* Multi-menu management (Lunch, Dinner, Drinks) under single owner wallets.
* Dynamic SVG QR code generator embedded in owner dashboard.

### Phase 3: Hardware & Hospitality Integrations
* NFC table-tap puck integration.
* Multilingual automated translations stored on IPFS/Arweave.
* Open API / Subgraph for POS hardware integration.

---

## 8. Conclusion

Menuza demonstrates that Web3 technology can solve tangible real-world business problems without burdening mainstream consumers. By leveraging BOT Chain Mainnet's performance and security, Menuza offers restaurants absolute data sovereignty, permanent uptime, and zero recurring overhead.
