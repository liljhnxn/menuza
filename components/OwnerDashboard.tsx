"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MenuItem } from "@/lib/types";
import { formatPrice, formatTimestamp } from "@/lib/utils";
import { MENUZA_ABI } from "@/lib/contracts/abi";
import {
  ChefHat,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface OwnerDashboardProps {
  myItems: MenuItem[];
  isLoading: boolean;
  contractAddress: `0x${string}`;
  onOpenAddItem: () => void;
  onOpenEditItem: (item: MenuItem) => void;
  onOpenRemoveItem: (item: MenuItem) => void;
  onRefetch?: () => void;
}

export function OwnerDashboard({
  myItems,
  isLoading,
  contractAddress,
  onOpenAddItem,
  onOpenEditItem,
  onOpenRemoveItem,
  onRefetch,
}: OwnerDashboardProps) {
  const { isConnected } = useAccount();
  const [togglingId, setTogglingId] = useState<bigint | null>(null);

  const { data: toggleHash, isPending: isWritingToggle, writeContract } = useWriteContract();

  const { isLoading: isConfirmingToggle } = useWaitForTransactionReceipt({
    hash: toggleHash,
    query: {
      enabled: !!toggleHash,
    },
  });

  // Calculate metrics
  const totalCount = myItems.length;
  const availableCount = myItems.filter((i) => i.isAvailable).length;
  const soldOutCount = totalCount - availableCount;

  // Function to handle toggling availability directly
  const handleToggleAvailability = (item: MenuItem) => {
    setTogglingId(item.id);
    writeContract(
      {
        address: contractAddress,
        abi: MENUZA_ABI,
        functionName: "updateAvailability",
        args: [item.id, !item.isAvailable],
      },
      {
        onSettled: () => {
          setTimeout(() => {
            setTogglingId(null);
            if (onRefetch) onRefetch();
          }, 3500);
        },
      }
    );
  };

  // Only display dashboard controls when the connected wallet has items (or when connected and has items)
  if (!isConnected || myItems.length === 0) {
    return null;
  }

  return (
    <section id="owner-dashboard" className="w-full py-10 border-b border-charcoal-800 bg-charcoal-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-charcoal-850 via-charcoal-800 to-charcoal-850 border border-charcoal-700/80 shadow-xl">
          <div>
            <div className="flex items-center space-x-2 text-terracotta-400 text-xs font-semibold tracking-widest uppercase mb-1.5">
              <ChefHat className="w-4 h-4" />
              <span>Restaurant Owner Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
              Menu Management Hub
            </h2>
            <p className="text-xs sm:text-sm text-cream-400 mt-1 max-w-lg">
              Manage live pricing, adjust item availability instantly, and add signature creations to the decentralized menu.
            </p>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={onOpenAddItem}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-charcoal-950 font-semibold text-sm shadow-lg shadow-terracotta-500/25 transition-all transform active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Menu Item</span>
          </button>
        </div>

        {/* Analytics / Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl p-5 bg-charcoal-850 border border-charcoal-700/70 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-cream-400 font-medium">
                Total Menu Items
              </p>
              <p className="text-3xl font-serif font-bold text-cream-50 mt-1">
                {totalCount}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-cream-300">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-charcoal-850 border border-charcoal-700/70 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-sage-400 font-medium">
                Available Items
              </p>
              <p className="text-3xl font-serif font-bold text-sage-400 mt-1">
                {availableCount}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sage-500/10 border border-sage-500/30 flex items-center justify-center text-sage-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-charcoal-850 border border-charcoal-700/70 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-terracotta-400 font-medium">
                Sold Out Items
              </p>
              <p className="text-3xl font-serif font-bold text-terracotta-400 mt-1">
                {soldOutCount}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-terracotta-500/10 border border-terracotta-500/30 flex items-center justify-center text-terracotta-400">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Owned Items Table / List */}
        <div className="rounded-2xl bg-charcoal-850 border border-charcoal-700/80 overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-charcoal-700/80 flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-cream-50">
              Your Registered Dishes ({myItems.length})
            </h3>
            {isLoading && (
              <div className="flex items-center space-x-1.5 text-xs text-cream-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-terracotta-400" />
                <span>Syncing on-chain...</span>
              </div>
            )}
          </div>

          <div className="divide-y divide-charcoal-750">
            {myItems.map((item) => {
              const isToggling = togglingId === item.id && (isWritingToggle || isConfirmingToggle);

              return (
                <div
                  key={item.id.toString()}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-charcoal-800/40 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center space-x-2.5 mb-1.5 flex-wrap">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-charcoal-800 text-cream-400 border border-charcoal-700">
                        #{item.id.toString()}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-charcoal-750 text-cream-300">
                        {item.category || "General"}
                      </span>
                      {item.isAvailable ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-sage-400 bg-sage-500/10 border border-sage-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Available</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-terracotta-400 bg-terracotta-500/10 border border-terracotta-500/20 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          <span>Sold Out</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-serif font-bold text-cream-100 truncate">
                      {item.name}
                    </h4>

                    <p className="text-xs text-cream-400 mt-1 line-clamp-2 max-w-2xl">
                      {item.description || "No description provided."}
                    </p>

                    <div className="flex items-center space-x-4 mt-2.5 text-xs">
                      <span className="font-mono font-bold text-terracotta-400">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-charcoal-600">•</span>
                      <span className="text-cream-500">
                        Listed {formatTimestamp(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-charcoal-750 flex-shrink-0">
                    {/* Availability Toggle */}
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      disabled={isToggling}
                      title={item.isAvailable ? "Mark as Sold Out" : "Mark as Available"}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        item.isAvailable
                          ? "bg-sage-950/30 border-sage-800/60 text-sage-300 hover:bg-sage-900/40"
                          : "bg-charcoal-800 border-charcoal-700 text-cream-400 hover:text-cream-200"
                      } disabled:opacity-50`}
                    >
                      {isToggling ? (
                        <Loader2 className="w-4 h-4 animate-spin text-terracotta-400" />
                      ) : item.isAvailable ? (
                        <ToggleRight className="w-4 h-4 text-sage-400" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-cream-400" />
                      )}
                      <span className="hidden md:inline">
                        {item.isAvailable ? "Available" : "Sold Out"}
                      </span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onOpenEditItem(item)}
                      title="Edit Item Details"
                      className="p-2 sm:px-3 sm:py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-750 border border-charcoal-700 text-cream-200 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-cream-400" />
                      <span className="hidden md:inline">Edit</span>
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={() => onOpenRemoveItem(item)}
                      title="Remove Menu Item"
                      className="p-2 sm:px-3 sm:py-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 text-red-300 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      <span className="hidden md:inline">Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

