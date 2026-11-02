"use client";

import React from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MenuItem } from "@/lib/types";
import { MENUZA_ABI } from "@/lib/contracts/abi";
import { getExplorerTxUrl } from "@/lib/utils";
import { Trash2, AlertTriangle, Loader2, CheckCircle, ExternalLink } from "lucide-react";

interface RemoveItemDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  contractAddress: `0x${string}`;
  onItemRemoved?: () => void;
}

export function RemoveItemDialog({
  item,
  isOpen,
  onClose,
  contractAddress,
  onItemRemoved,
}: RemoveItemDialogProps) {
  const { data: hash, isPending: isWriting, writeContract, reset: resetWrite, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  });

  if (!isOpen || !item) return null;

  const handleConfirm = () => {
    writeContract({
      address: contractAddress,
      abi: MENUZA_ABI,
      functionName: "removeItem",
      args: [item.id],
    });
  };

  const handleClose = () => {
    if (isConfirmed && onItemRemoved) {
      onItemRemoved();
    }
    resetWrite();
    onClose();
  };

  const isBusy = isWriting || isConfirming;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-charcoal-900 border border-charcoal-700 shadow-2xl p-6 sm:p-7 text-cream-50">
        <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400 mb-4 mx-auto">
          <Trash2 className="w-6 h-6 stroke-[1.8]" />
        </div>

        <h3 className="text-xl font-serif font-bold text-cream-50 text-center mb-1">
          Remove Menu Item?
        </h3>
        <p className="text-xs text-cream-400 text-center mb-6">
          Are you sure you want to remove <strong className="text-cream-100">&quot;{item.name}&quot;</strong>? This action will permanently delist it from the live menu.
        </p>

        {isConfirmed ? (
          <div className="text-center py-2 animate-in fade-in">
            <CheckCircle className="w-8 h-8 text-sage-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-sage-300">
              Item removed from Botchain menu.
            </p>
            {hash && (
              <a
                href={getExplorerTxUrl(hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-terracotta-400 hover:underline mt-2"
              >
                <span>View receipt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <div className="mt-5">
              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-750 text-cream-100 text-xs font-semibold border border-charcoal-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            {(writeError || confirmError) && (
              <div className="rounded-xl bg-red-950/60 border border-red-800/80 p-3 text-xs text-red-200 flex items-start space-x-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="break-words">
                  {writeError?.message || confirmError?.message || "Failed to remove item."}
                </span>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isBusy}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold text-cream-300 hover:bg-charcoal-800 border border-charcoal-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isBusy}
                className="w-1/2 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all disabled:opacity-50"
              >
                {isBusy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isWriting ? "Confirming..." : isConfirming ? "Removing..." : "Yes, Remove"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

