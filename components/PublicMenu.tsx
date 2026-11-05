"use client";

import React, { useState, useMemo } from "react";
import { MenuItem } from "@/lib/types";
import { formatPrice, formatAddress, getExplorerAddressUrl } from "@/lib/utils";
import { Search, Tag, ExternalLink, Sparkles, CheckCircle2, XCircle } from "lucide-react";

interface PublicMenuProps {
  items: MenuItem[];
  isLoading: boolean;
  onAddNewClick?: () => void;
  isOwnerConnected?: boolean;
}

export function PublicMenu({ items, isLoading, onAddNewClick, isOwnerConnected }: PublicMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique categories from items
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category && item.category.trim().length > 0) {
        set.add(item.category.trim());
      }
    });
    return ["All", ...Array.from(set)];
  }, [items]);

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <section className="w-full py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-terracotta-400 text-xs font-semibold tracking-widest uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Culinary Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cream-50">
              Live Digital Menu
            </h2>
            <p className="text-sm text-cream-400 mt-1 max-w-xl">
              Fresh on-chain menu records verified directly on Botchain Mainnet. Open for everyone to browse.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center space-x-3 text-xs text-cream-400 bg-charcoal-850 px-4 py-2 rounded-xl border border-charcoal-700/80 w-fit">
            <span>
              Total: <strong className="text-cream-100">{items.length}</strong>
            </span>
            <span className="text-charcoal-600">•</span>
            <span>
              Available:{" "}
              <strong className="text-sage-400">
                {items.filter((i) => i.isAvailable).length}
              </strong>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Categories Pill list */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? "bg-terracotta-500 text-charcoal-950 font-semibold shadow-md shadow-terracotta-500/20"
                      : "bg-charcoal-850 text-cream-400 hover:text-cream-200 hover:bg-charcoal-800 border border-charcoal-700/70"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-cream-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes, drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-850 border border-charcoal-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-cream-100 placeholder-cream-500 focus:outline-none focus:border-terracotta-500/60 transition-colors"
            />
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-charcoal-850 border border-charcoal-700/60 rounded-2xl p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-5 bg-charcoal-700 rounded-full"></div>
                  <div className="w-20 h-5 bg-charcoal-700 rounded-full"></div>
                </div>
                <div className="w-3/4 h-6 bg-charcoal-700 rounded mb-2"></div>
                <div className="w-full h-12 bg-charcoal-800 rounded mb-4"></div>
                <div className="flex justify-between items-center pt-3 border-t border-charcoal-700/40">
                  <div className="w-20 h-6 bg-charcoal-700 rounded"></div>
                  <div className="w-24 h-4 bg-charcoal-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
          <div className="text-center py-16 px-4 rounded-3xl bg-charcoal-850/60 border border-charcoal-700/50 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-charcoal-800 flex items-center justify-center mx-auto mb-4 text-cream-500">
              <Tag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-cream-100 mb-2">
              Your menu is looking empty. Add your first item to get started.
            </h3>
            <p className="text-sm text-cream-400 max-w-md mx-auto mb-6">
              Connect your wallet to publish your restaurant&apos;s signature dishes, beverages, and desserts directly onto the blockchain.
            </p>
            {onAddNewClick && (
              <button
                onClick={onAddNewClick}
                className="px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-charcoal-950 font-semibold text-sm shadow-lg shadow-terracotta-500/20 transition-all transform active:scale-95"
              >
                + Add Your First Item
              </button>
            )}
          </div>
        )}

        {/* No Search Results */}
        {!isLoading && items.length > 0 && filteredItems.length === 0 && (
          <div className="text-center py-12 px-4 rounded-2xl bg-charcoal-850/40 border border-charcoal-800">
            <p className="text-sm text-cream-400">
              No menu items match &quot;{searchQuery}&quot; in category &quot;{selectedCategory}&quot;.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-3 text-xs text-terracotta-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Menu Cards Grid */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isAvailable = item.isAvailable;
              return (
                <div
                  key={item.id.toString()}
                  className={`group relative flex flex-col justify-between rounded-2xl p-6 bg-charcoal-850 border border-charcoal-700/70 card-hover ${
                    !isAvailable ? "opacity-75 bg-charcoal-900/80" : ""
                  }`}
                >
                  <div>
                    {/* Top Tag & Availability Status */}
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-md bg-charcoal-800 border border-charcoal-700 text-cream-400">
                        {item.category || "General"}
                      </span>

                      {/* Availability Badge */}
                      {isAvailable ? (
                        <span className="inline-flex items-center space-x-1 text-xs font-medium text-sage-400 bg-sage-500/10 border border-sage-500/20 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Available</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-xs font-medium text-terracotta-400/90 bg-terracotta-500/10 border border-terracotta-500/20 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Sold Out</span>
                        </span>
                      )}
                    </div>

                    {/* Dish Name */}
                    <h3
                      className={`text-xl font-serif font-bold transition-colors ${
                        isAvailable
                          ? "text-cream-50 group-hover:text-terracotta-400"
                          : "text-cream-300 line-through decoration-charcoal-500"
                      }`}
                    >
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-cream-400 mt-2 line-clamp-3 leading-relaxed">
                      {item.description || "Freshly crafted with premium ingredients."}
                    </p>
                  </div>

                  {/* Bottom Price & Vendor verification */}
                  <div className="pt-4 mt-6 border-t border-charcoal-700/50 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-cream-500 uppercase tracking-wider block font-medium">
                        Price
                      </span>
                      <span className="text-lg font-bold font-mono text-terracotta-400">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <a
                      href={getExplorerAddressUrl(item.owner)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View vendor on BotchainScan"
                      className="flex items-center space-x-1 text-[11px] font-mono text-cream-500 hover:text-cream-300 transition-colors bg-charcoal-800/80 px-2.5 py-1 rounded-lg border border-charcoal-700/60"
                    >
                      <span>Vendor: {formatAddress(item.owner)}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

