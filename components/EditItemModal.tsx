"use client";

import React, { useState, useEffect } from "react";
import { formatEther, parseEther } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MenuItem } from "@/lib/types";
import { MENUZA_ABI } from "@/lib/contracts/abi";
import { getExplorerTxUrl } from "@/lib/utils";
import { X, Edit3, Loader2, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";

interface EditItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  contractAddress: `0x${string}`;
  onItemUpdated?: () => void;
}

const CATEGORY_PRESETS = ["Mains", "Drinks", "Desserts", "Starters", "Specials", "Sides"];

export function EditItemModal({
  item,
  isOpen,
  onClose,
  contractAddress,
  onItemUpdated,
}: EditItemModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Mains");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      try {
        setPrice(formatEther(item.price));
      } catch {
        setPrice("0");
      }
      if (CATEGORY_PRESETS.includes(item.category)) {
        setCategory(item.category);
        setIsCustom(false);
      } else {
        setIsCustom(true);
        setCustomCategory(item.category || "");
      }
      setLocalError(null);
    }
  }, [item]);

  const { data: hash, isPending: isWriting, writeContract, reset: resetWrite, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  });

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setLocalError("Item name is required.");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setLocalError("Please enter a valid price greater than zero.");
      return;
    }

    const finalCategory = isCustom ? customCategory.trim() || "General" : category;

    try {
      const priceInWei = parseEther(price.toString());

      writeContract({
        address: contractAddress,
        abi: MENUZA_ABI,
        functionName: "editItem",
        args: [item.id, trimmedName, description.trim(), priceInWei, finalCategory],
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to format price or send transaction.";
      setLocalError(message);
    }
  };

  const handleClose = () => {
    if (isConfirmed && onItemUpdated) {
      onItemUpdated();
    }
    resetWrite();
    setLocalError(null);
    onClose();
  };

  const isBusy = isWriting || isConfirming;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-charcoal-900 border border-charcoal-700 shadow-2xl p-6 sm:p-8 text-cream-50 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isBusy}
          className="absolute right-5 top-5 p-2 rounded-xl text-cream-400 hover:text-cream-100 hover:bg-charcoal-800 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-terracotta-500/10 border border-terracotta-500/30 flex items-center justify-center text-terracotta-400 mb-3">
            <Edit3 className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-cream-50">
            Edit Menu Item
          </h3>
          <p className="text-xs text-cream-400 mt-1">
            Update pricing, details, or category on-chain (Item #{item.id.toString()}).
          </p>
        </div>

        {/* Success Banner */}
        {isConfirmed ? (
          <div className="rounded-2xl bg-sage-500/10 border border-sage-500/30 p-5 text-center my-4 animate-in fade-in">
            <CheckCircle className="w-10 h-10 text-sage-400 mx-auto mb-2" />
            <h4 className="font-serif font-bold text-lg text-cream-100">
              Changes Saved!
            </h4>
            <p className="text-xs text-cream-300 mt-1">
              The updated item information has been recorded on Botchain.
            </p>
            {hash && (
              <a
                href={getExplorerTxUrl(hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-terracotta-400 hover:underline mt-3"
              >
                <span>View BohrScan receipt</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <div className="mt-5">
              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-charcoal-950 font-semibold text-sm transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error alerts */}
            {(localError || writeError || confirmError) && (
              <div className="rounded-xl bg-red-950/60 border border-red-800/80 p-3.5 text-xs text-red-200 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="break-words">
                  {localError ||
                    writeError?.message ||
                    confirmError?.message ||
                    "An error occurred while updating the item."}
                </span>
              </div>
            )}

            {/* Item Name */}
            <div>
              <label className="block text-xs font-semibold text-cream-300 uppercase tracking-wider mb-1.5">
                Dish / Item Name <span className="text-terracotta-400">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isBusy}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-charcoal-850 border border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-cream-50 placeholder-cream-500 focus:outline-none focus:border-terracotta-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-cream-300 uppercase tracking-wider mb-1.5">
                Short Description
              </label>
              <textarea
                disabled={isBusy}
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-charcoal-850 border border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-cream-50 placeholder-cream-500 focus:outline-none focus:border-terracotta-500 transition-colors resize-none"
              />
            </div>

            {/* Price (BOT) */}
            <div>
              <label className="block text-xs font-semibold text-cream-300 uppercase tracking-wider mb-1.5">
                Price (BOT) <span className="text-terracotta-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.000000000000000001"
                  required
                  disabled={isBusy}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-charcoal-850 border border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-cream-50 font-mono placeholder-cream-500 focus:outline-none focus:border-terracotta-500 transition-colors"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-cream-400 pointer-events-none">
                  BOT
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-cream-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {CATEGORY_PRESETS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    disabled={isBusy}
                    onClick={() => {
                      setIsCustom(false);
                      setCategory(cat);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      !isCustom && category === cat
                        ? "bg-terracotta-500 text-charcoal-950 font-semibold"
                        : "bg-charcoal-850 text-cream-400 border border-charcoal-700 hover:bg-charcoal-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => setIsCustom(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    isCustom
                      ? "bg-terracotta-500 text-charcoal-950 font-semibold"
                      : "bg-charcoal-850 text-cream-400 border border-charcoal-700 hover:bg-charcoal-800"
                  }`}
                >
                  Custom +
                </button>
              </div>

              {isCustom && (
                <input
                  type="text"
                  disabled={isBusy}
                  placeholder="e.g. Signature Cocktails"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-charcoal-850 border border-charcoal-700 rounded-xl px-4 py-2 text-xs text-cream-50 placeholder-cream-500 focus:outline-none focus:border-terracotta-500 transition-colors mt-2"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isBusy}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-cream-400 hover:text-cream-200 hover:bg-charcoal-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isBusy}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-charcoal-950 font-semibold text-sm shadow-lg shadow-terracotta-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isBusy && <Loader2 className="w-4 h-4 animate-spin text-charcoal-950" />}
                <span>
                  {isWriting
                    ? "Confirm in Wallet..."
                    : isConfirming
                    ? "Updating on Botchain..."
                    : "Save Changes"}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

