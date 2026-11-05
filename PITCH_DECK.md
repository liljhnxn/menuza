# Menuza — Pitch Deck

> **Decentralized, Serverless Digital Menus for the Modern Restaurant**  
> *Built on Botchain Mainnet (Chain ID: 677)*  
> *Contract: `0x866630e38A98eEc2cD612A1B46dFFA9E8e33dd19`*  
> *Deck Version: 1.0*

---

## Slide 1: Cover
* **Title**: Menuza
* **Subtitle**: Your Menu, Made Digital. Verified On-Chain.
* **Tagline**: The zero-friction, serverless digital menu protocol for restaurants, cafés, and food vendors.
* **Presenter**: Menuza Core Team
* **Ecosystem**: Botchain Network

---

## Slide 2: The Problem
* **Expensive SaaS Subscriptions**: Incumbent QR menu software costs restaurants $300–$1,800/year just to serve static menu lists.
* **Centralized Vulnerabilities**: Outages during peak dinner service, DNS redirects, and vendor lock-in.
* **Web3 Friction**: Most crypto apps force end customers to connect a wallet, pay gas, and approve popups before seeing anything.

---

## Slide 3: The Solution
* **Zero-Wallet Diners**: Customers scan a QR code and browse instantly with 0 wallet friction.
* **Cryptographic Ownership**: Only the restaurant’s private key can alter prices or delist dishes.
* **1-Click Availability**: Real-time "Sold Out" toggling on-chain keeps kitchen and guests synchronized.
* **No Database / Serverless**: 100% on-chain state on Botchain with permanent uptime.

---

## Slide 4: Product Experience
* **Restaurant Owner Portal**:
  * Real-time metrics (Total Items, Available, Sold Out).
  * Quick modal to add dishes with categories and BOHR pricing.
  * Instant availability toggles and edit controls.
* **Customer Menu**:
  * Category pill filtering (Mains, Drinks, Desserts, Specials).
  * Live search bar.
  * Clear visual badges for active vs. sold-out items.
  * Direct block explorer link to verify vendor legitimacy.

---

## Slide 5: Technical Highlights
* **Solidity Smart Contract (`Menuza.sol`)**:
  * Tested with 18 automated Hardhat unit tests (100% passing).
  * Deployed & verified on BotchainScan: `0x866630e38A98eEc2cD612A1B46dFFA9E8e33dd19`.
  * Gas-optimized custom errors: `EmptyItemName`, `InvalidPrice`, `ItemNotFound`, `Unauthorized`.
* **Frontend Architecture**:
  * Next.js 14 App Router, TypeScript, Tailwind CSS.
  * `wagmi` v2 and `viem` v2 fallback public RPC transports.
  * Restaurant dark charcoal and warm cream design language.

---

## Slide 6: Market Opportunity
* **$1.3 Trillion** global restaurant industry shifting permanently to digital/contactless menus.
* **Target Segments**:
  * Food trucks & pop-ups (need fast setup, zero recurring subscriptions).
  * Independent bistros & cafés (frequent seasonal menu revisions).
  * Web3 events, conferences, & crypto lounges (native showcases).

---

## Slide 7: Why Botchain?
* **High Throughput & Sub-Second Finality**: Essential for fast kitchen updates.
* **Negligible Gas Costs**: Updating a menu costs fractions of a cent, beating Web2 SaaS pricing.
* **EVM Compatibility**: Seamless MetaMask integration and reliable developer tooling.

---

## Slide 8: Business & Sustainability
* **Core Protocol**: Free and open source (MIT license) as public good infrastructure.
* **Value-Add Monetization**:
  * Custom ENS / Botchain domain mapping for restaurants.
  * Physical NFC wooden/acrylic table tap hardware sales.
  * Enterprise multi-location kitchen analytics.

---

## Slide 9: Roadmap
* **Q4 2026 (Completed)**:
  * Contract deployment & verification on Botchain Testnet.
  * Complete Next.js frontend with wallet-free browsing.
* **Q1 2027**:
  * Mainnet launch on Botchain.
  * Printable dynamic QR generation inside owner portal.
* **Q2 2027**:
  * POS & thermal kitchen printer webhook listeners.
  * Multi-language AI menu translation stored on IPFS.

---

## Slide 10: Summary & Links
* **Live App**: [Menuza Web App](https://github.com/liljhnxn/menuza)
* **Contract Explorer**: [BotchainScan Verified Contract](https://scan.botchain.ai/address/0x866630e38A98eEc2cD612A1B46dFFA9E8e33dd19#code)
* **GitHub Repository**: [github.com/liljhnxn/menuza](https://github.com/liljhnxn/menuza)
* **Contact**: [johnsonferanmi408@gmail.com](mailto:johnsonferanmi408@gmail.com)

