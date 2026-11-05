"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAccount, useReadContract } from "wagmi";
import { MENUZA_ABI } from "@/lib/contracts/abi";
import { MenuItem } from "@/lib/types";
import defaultDeployment from "@/lib/contracts/deployment.json";
import { Header } from "@/components/Header";
import { PublicMenu } from "@/components/PublicMenu";
import { OwnerDashboard } from "@/components/OwnerDashboard";
import { AddItemModal } from "@/components/AddItemModal";
import { EditItemModal } from "@/components/EditItemModal";
import { RemoveItemDialog } from "@/components/RemoveItemDialog";
import { formatAddress } from "@/lib/utils";
import {
  UtensilsCrossed,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  PlusCircle,
  Globe,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

const MAINNET_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS || defaultDeployment.address
) as `0x${string}`;

export default function Home() {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Read all items from Mainnet contract (publicly readable without wallet)
  const {
    data: rawAllItems,
    isLoading: isLoadingAll,
    refetch: refetchAllItems,
  } = useReadContract({
    address: MAINNET_CONTRACT_ADDRESS,
    abi: MENUZA_ABI,
    functionName: "getAllItems",
    query: {
      refetchInterval: 8000,
    },
  });

  // Read items owned by current connected wallet
  const {
    data: rawMyItems,
    isLoading: isLoadingMy,
    refetch: refetchMyItems,
  } = useReadContract({
    address: MAINNET_CONTRACT_ADDRESS,
    abi: MENUZA_ABI,
    functionName: "getItemsByOwner",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 8000,
    },
  });

  // Cast retrieved data safely
  const allItems: MenuItem[] = (rawAllItems as MenuItem[]) || [];
  const myItems: MenuItem[] = (rawMyItems as MenuItem[]) || [];

  const handleRefetch = () => {
    refetchAllItems();
    if (isConnected) refetchMyItems();
  };

  const handleOpenEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleOpenRemove = (item: MenuItem) => {
    setSelectedItem(item);
    setIsRemoveOpen(true);
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(MAINNET_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-charcoal-900 text-cream-50 warm-glow">
      {/* Top Navigation */}
      <Header
        onOpenOwnerPortal={() => {
          const el = document.getElementById("owner-dashboard");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        ownedCount={myItems.length}
      />

      <main className="flex-1 flex flex-col">
        {/* Hero Banner */}
        <section className="relative overflow-hidden pt-12 pb-14 border-b border-charcoal-800 bg-gradient-to-b from-charcoal-950 via-charcoal-900 to-charcoal-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Network & Ecosystem Badge */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-charcoal-850 border border-charcoal-700/80 text-cream-300 text-xs mb-6 shadow-sm">
              <div className="w-4 h-4 relative rounded overflow-hidden flex-shrink-0">
                <Image src="/botchain-logo.png" alt="BOT Chain" fill className="object-cover" />
              </div>
              <span className="font-semibold text-cream-100">BOT Chain Mainnet</span>
              <span className="text-charcoal-600">•</span>
              <span className="text-cream-400">Chain ID: 677</span>
              <span className="text-charcoal-600">•</span>
              <span className="text-sage-400 font-medium">Verified Contract</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-cream-50 tracking-tight max-w-4xl mx-auto leading-tight">
              A Decadent Dining Experience, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-400 via-cream-100 to-terracotta-400">
                Verified On BOT Chain.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-cream-400 max-w-2xl mx-auto mt-4 leading-relaxed">
              Menuza empowers culinary artisans, cafés, and restaurateurs to publish immutable digital menus. Customers browse real-time availability freely without connecting a wallet.
            </p>

            {/* Mainnet Contract Address Pill */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center space-x-2 bg-charcoal-850/90 border border-charcoal-700/80 px-3.5 py-1.5 rounded-xl text-xs font-mono text-cream-300">
                <span className="text-terracotta-400 font-sans font-semibold">Contract:</span>
                <span className="hidden sm:inline">{MAINNET_CONTRACT_ADDRESS}</span>
                <span className="sm:hidden">{formatAddress(MAINNET_CONTRACT_ADDRESS)}</span>
                <button
                  onClick={handleCopyContract}
                  className="p-1 hover:text-cream-50 transition-colors"
                  title="Copy contract address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-sage-400" /> : <Copy className="w-3.5 h-3.5 text-cream-400" />}
                </button>
              </div>

              <a
                href={`https://scan.botchain.ai/address/${MAINNET_CONTRACT_ADDRESS}#code`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 bg-charcoal-800 hover:bg-charcoal-750 border border-charcoal-700 px-3 py-1.5 rounded-xl text-xs text-cream-200 transition-colors"
              >
                <span>View on BotchainScan</span>
                <ExternalLink className="w-3.5 h-3.5 text-cream-400" />
              </a>
            </div>

            {/* Hero Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {isConnected ? (
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-charcoal-950 font-bold text-sm shadow-xl shadow-terracotta-500/20 transition-all transform active:scale-95"
                >
                  <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Menu Item</span>
                </button>
              ) : (
                <div className="text-xs text-cream-400 bg-charcoal-850/80 px-4 py-2.5 rounded-xl border border-charcoal-700/80 inline-flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-terracotta-400" />
                  <span>Connect your MetaMask wallet at the top right to manage dishes on Mainnet.</span>
                </div>
              )}
            </div>

            {/* Feature Highlights */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-charcoal-850/70 border border-charcoal-700/60">
                <div className="flex items-center space-x-2 text-cream-200 text-xs font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4 text-sage-400" />
                  <span>Wallet-Free Browsing</span>
                </div>
                <p className="text-[11px] text-cream-400 leading-normal">
                  Guests browse live menu items instantly with zero friction and no wallet requirement.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-charcoal-850/70 border border-charcoal-700/60">
                <div className="flex items-center space-x-2 text-cream-200 text-xs font-semibold mb-1">
                  <Sparkles className="w-4 h-4 text-terracotta-400" />
                  <span>Owner Controlled</span>
                </div>
                <p className="text-[11px] text-cream-400 leading-normal">
                  Cryptographic ownership guarantees only the restaurant owner can edit pricing or delist items.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-charcoal-850/70 border border-charcoal-700/60">
                <div className="flex items-center space-x-2 text-cream-200 text-xs font-semibold mb-1">
                  <UtensilsCrossed className="w-4 h-4 text-cream-300" />
                  <span>Real-Time Availability</span>
                </div>
                <p className="text-[11px] text-cream-400 leading-normal">
                  Mark sold-out items with one click. Clear status badges keep your patrons updated in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Restaurant Owner Dashboard (Displayed only when connected & owns items) */}
        <OwnerDashboard
          myItems={myItems}
          isLoading={isLoadingMy}
          contractAddress={MAINNET_CONTRACT_ADDRESS}
          onOpenAddItem={() => setIsAddOpen(true)}
          onOpenEditItem={handleOpenEdit}
          onOpenRemoveItem={handleOpenRemove}
          onRefetch={handleRefetch}
        />

        {/* Public Browsing Menu Section */}
        <PublicMenu
          items={allItems}
          isLoading={isLoadingAll}
          isOwnerConnected={isConnected}
          onAddNewClick={() => setIsAddOpen(true)}
        />

        {/* BOT Chain Ecosystem Feature Section */}
        <section className="w-full py-12 border-t border-charcoal-800 bg-charcoal-950/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-charcoal-850 via-charcoal-900 to-charcoal-850 border border-charcoal-700/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Logo + Name + Description */}
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 relative rounded-2xl overflow-hidden shadow-xl border border-emerald-500/30 flex-shrink-0 bg-black">
                  <Image src="/botchain-logo.png" alt="BOT Chain Logo" fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold tracking-tight font-serif text-cream-50">
                      BOT Chain
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      Mainnet Live
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-cream-400 mt-1 max-w-xl">
                    Menuza is built on BOT Chain — high-throughput, gas-efficient decentralized infrastructure designed for enterprise and consumer Web3 applications.
                  </p>
                </div>
              </div>

              {/* Right: Both Required Links */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* BOT Chain Website Link */}
                <a
                  href="https://botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-charcoal-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95"
                >
                  <Globe className="w-4 h-4 text-charcoal-950" />
                  <span>BOT Chain Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-charcoal-950" />
                </a>

                {/* BOT Chain Explorer Link */}
                <a
                  href="https://scan.botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-charcoal-800 hover:bg-charcoal-750 border border-charcoal-600 text-cream-100 font-semibold text-xs sm:text-sm transition-all"
                >
                  <span>BOT Chain Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cream-400" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        contractAddress={MAINNET_CONTRACT_ADDRESS}
        onItemAdded={handleRefetch}
      />

      {/* Edit Item Modal */}
      <EditItemModal
        item={selectedItem}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedItem(null);
        }}
        contractAddress={MAINNET_CONTRACT_ADDRESS}
        onItemUpdated={handleRefetch}
      />

      {/* Remove Item Dialog */}
      <RemoveItemDialog
        item={selectedItem}
        isOpen={isRemoveOpen}
        onClose={() => {
          setIsRemoveOpen(false);
          setSelectedItem(null);
        }}
        contractAddress={MAINNET_CONTRACT_ADDRESS}
        onItemRemoved={handleRefetch}
      />

      {/* Footer */}
      <footer className="w-full border-t border-charcoal-800 bg-charcoal-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Menuza Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-terracotta-500/10 border border-terracotta-500/30 flex items-center justify-center text-terracotta-400">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-cream-50 text-lg">Menuza</span>
                <p className="text-xs text-cream-500">Your menu, made digital.</p>
              </div>
            </div>

            {/* BOT Chain Ecosystem Links & Logo */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              {/* BOT Chain Website Link */}
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-charcoal-900 border border-charcoal-750 text-cream-200 hover:text-emerald-400 transition-colors"
              >
                <div className="w-4 h-4 relative rounded overflow-hidden flex-shrink-0">
                  <Image src="/botchain-logo.png" alt="BOT Chain" fill className="object-cover" />
                </div>
                <span className="font-semibold">BOT Chain Website</span>
                <ExternalLink className="w-3 h-3 text-cream-500" />
              </a>

              {/* BOT Chain Explorer Link */}
              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900 border border-charcoal-750 text-cream-300 hover:text-cream-100 transition-colors"
              >
                <span>BOT Chain Explorer</span>
                <ExternalLink className="w-3 h-3 text-cream-500" />
              </a>

              {/* Verified Contract Link */}
              <a
                href={`https://scan.botchain.ai/address/${MAINNET_CONTRACT_ADDRESS}#code`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900 border border-charcoal-750 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Contract: {formatAddress(MAINNET_CONTRACT_ADDRESS)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-charcoal-850 flex flex-col sm:flex-row items-center justify-between text-[11px] text-cream-500">
            <p>© {new Date().getFullYear()} Menuza. All on-chain records public.</p>
            <p className="mt-2 sm:mt-0">Powered by BOT Chain Mainnet (Chain ID 677) • Native Currency: BOT</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
