"use client";

import React, { useState } from "react";
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
import {
  UtensilsCrossed,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  HelpCircle,
  Globe2,
} from "lucide-react";

export default function Home() {
  const { address, isConnected } = useAccount();

  // Contract address from environment variable or deployment artifact
  const envAddress = process.env.NEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS || defaultDeployment.address;
  const contractAddress = (
    envAddress && envAddress.startsWith("0x") && envAddress.length === 42
      ? envAddress
      : defaultDeployment.address
  ) as `0x${string}`;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Read all items from contract (publicly readable without wallet)
  const isContractConfigured = contractAddress !== "0x0000000000000000000000000000000000000000";

  const {
    data: rawAllItems,
    isLoading: isLoadingAll,
    refetch: refetchAllItems,
  } = useReadContract({
    address: contractAddress,
    abi: MENUZA_ABI,
    functionName: "getAllItems",
    query: {
      enabled: isContractConfigured,
      refetchInterval: 8000,
    },
  });

  // Read items owned by current connected wallet
  const {
    data: rawMyItems,
    isLoading: isLoadingMy,
    refetch: refetchMyItems,
  } = useReadContract({
    address: contractAddress,
    abi: MENUZA_ABI,
    functionName: "getItemsByOwner",
    args: address ? [address] : undefined,
    query: {
      enabled: isContractConfigured && isConnected && !!address,
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
        {/* Notice banner if contract address isn't configured yet */}
        {!isContractConfigured && (
          <div className="bg-charcoal-850 border-b border-charcoal-700/80 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-cream-300 gap-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-terracotta-400 flex-shrink-0" />
                <span>
                  <strong>Configuration:</strong> Please specify your deployed smart contract address in{" "}
                  <code className="text-terracotta-400 font-mono">.env.local</code> as{" "}
                  <code className="text-cream-100 font-mono">NEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS</code>.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hero Banner */}
        <section className="relative overflow-hidden pt-12 pb-14 border-b border-charcoal-800 bg-gradient-to-b from-charcoal-950 via-charcoal-900 to-charcoal-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-charcoal-850 border border-charcoal-700/80 text-cream-300 text-xs mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-terracotta-500"></span>
              <span className="font-medium">Decentralized Dining Platform</span>
              <span className="text-charcoal-600">•</span>
              <span className="text-cream-400">Botchain Testnet (968)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-cream-50 tracking-tight max-w-4xl mx-auto leading-tight">
              A Decadent Dining Experience, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-400 via-cream-100 to-terracotta-400">
                Verified On-Chain.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-cream-400 max-w-2xl mx-auto mt-4 leading-relaxed">
              Menuza empowers culinary artisans, cafés, and restaurateurs to publish immutable digital menus. Customers browse real-time availability freely without connecting a wallet.
            </p>

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
                  <Globe2 className="w-4 h-4 text-terracotta-400" />
                  <span>Connect your MetaMask wallet at the top right to create & manage dishes.</span>
                </div>
              )}
            </div>

            {/* Feature Highlights Pills */}
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
                  Mark sold-out items with one click. Clear status badges keep your patrons updated.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Restaurant Owner Dashboard (Displayed only when connected & owns items) */}
        <OwnerDashboard
          myItems={myItems}
          isLoading={isLoadingMy}
          contractAddress={contractAddress}
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
      </main>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        contractAddress={contractAddress}
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
        contractAddress={contractAddress}
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
        contractAddress={contractAddress}
        onItemRemoved={handleRefetch}
      />

      {/* Footer */}
      <footer className="w-full border-t border-charcoal-800 bg-charcoal-950 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-terracotta-500/10 border border-terracotta-500/30 flex items-center justify-center text-terracotta-400">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif font-bold text-cream-50 text-base">Menuza</span>
                <p className="text-[11px] text-cream-500">Your menu, made digital.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-cream-400">
              <a
                href="https://scan.bohr.life"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream-200 transition-colors flex items-center space-x-1"
              >
                <span>BohrScan Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-charcoal-700">•</span>
              <span>Botchain Testnet (Chain ID 968)</span>
              <span className="text-charcoal-700">•</span>
              <span className="text-cream-500">Non-custodial & Serverless</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-charcoal-850 flex flex-col sm:flex-row items-center justify-between text-[11px] text-cream-500">
            <p>© {new Date().getFullYear()} Menuza. All on-chain records public.</p>
            <p className="mt-2 sm:mt-0">Lightweight • Gas-Efficient • Restaurant-First</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
