"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from "wagmi";
import { botchainMainnet } from "@/lib/chains";
import { formatAddress, getExplorerAddressUrl } from "@/lib/utils";
import { Utensils, Wallet, LogOut, ChevronDown, AlertCircle, ChefHat } from "lucide-react";

interface HeaderProps {
  onOpenOwnerPortal?: () => void;
  ownedCount?: number;
}

export function Header({ onOpenOwnerPortal, ownedCount = 0 }: HeaderProps) {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isWrongNetwork = isConnected && currentChainId !== botchainMainnet.id;

  const handleConnect = () => {
    // Find injected connector (MetaMask)
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-charcoal-700/80 bg-charcoal-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center shadow-lg shadow-terracotta-500/20 text-charcoal-950">
            <Utensils className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight font-serif text-cream-50">
                Menuza
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-charcoal-800 border border-charcoal-700 text-cream-400">
                Mainnet
              </span>
            </div>
            <p className="text-xs text-cream-400 font-sans hidden xs:block">
              Your menu, made digital.
            </p>
          </div>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Wrong Network Warning */}
          {isWrongNetwork ? (
            <button
              onClick={() => switchChain({ chainId: botchainMainnet.id })}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-800/80 text-red-200 text-xs font-medium hover:bg-red-900/90 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <span>Switch to Botchain Mainnet</span>
            </button>
          ) : (
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-charcoal-850 border border-charcoal-700 text-xs text-cream-400">
              <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse"></span>
              <span>Botchain Mainnet (677)</span>
            </div>
          )}

          {/* Restaurant Owner Quick Action if connected */}
          {isConnected && ownedCount > 0 && onOpenOwnerPortal && (
            <button
              onClick={onOpenOwnerPortal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-charcoal-800 border border-charcoal-700 text-cream-100 hover:border-terracotta-500/50 hover:bg-charcoal-750 transition-all text-xs font-medium"
            >
              <ChefHat className="w-4 h-4 text-terracotta-400" />
              <span className="hidden sm:inline">My Menu</span>
              <span className="px-1.5 py-0.2 rounded-full bg-terracotta-500/20 text-terracotta-400 text-[10px] font-bold">
                {ownedCount}
              </span>
            </button>
          )}

          {/* Connect / Wallet Button */}
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-charcoal-950 font-semibold text-xs sm:text-sm shadow-md shadow-terracotta-500/25 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 text-cream-100 text-xs sm:text-sm font-medium transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-sage-500"></div>
                <span className="font-mono">{address ? formatAddress(address) : ""}</span>
                <ChevronDown className="w-3.5 h-3.5 text-cream-400" />
              </button>

              {/* Wallet Dropdown */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-charcoal-850 border border-charcoal-700 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-charcoal-700/60 mb-1">
                      <p className="text-[11px] uppercase tracking-wider text-cream-500 font-semibold">
                        Connected Wallet
                      </p>
                      <p className="text-xs font-mono text-cream-200 truncate mt-0.5">
                        {address}
                      </p>
                    </div>

                    <a
                      href={getExplorerAddressUrl(address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-3 py-2 text-xs text-cream-300 hover:bg-charcoal-800 rounded-lg transition-colors"
                    >
                      <span>View on BotchainScan</span>
                      <span className="text-[10px] text-cream-500">↗</span>
                    </a>

                    <button
                      onClick={() => {
                        disconnect();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-950/50 hover:text-red-300 rounded-lg transition-colors mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

