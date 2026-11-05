import { formatEther } from "viem";

export function formatBohrPrice(weiPrice: bigint | undefined | null, symbol = "BOT"): string {
  if (weiPrice === undefined || weiPrice === null) return `0.00 ${symbol}`;
  try {
    const formatted = formatEther(weiPrice);
    const num = parseFloat(formatted);
    if (isNaN(num)) return `0 ${symbol}`;
    return `${formatted} ${symbol}`;
  } catch {
    return `0 ${symbol}`;
  }
}

export function formatAddress(address: string): string {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(timestamp: bigint | number): string {
  try {
    const millis = Number(timestamp) * 1000;
    const date = new Date(millis);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function getExplorerTxUrl(txHash: string | undefined): string {
  if (!txHash) return "#";
  const base = process.env.NEXT_PUBLIC_BLOCK_EXPLORER || "https://scan.botchain.ai";
  return `${base.replace(/\/$/, "")}/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string | undefined): string {
  if (!address) return "#";
  const base = process.env.NEXT_PUBLIC_BLOCK_EXPLORER || "https://scan.botchain.ai";
  return `${base.replace(/\/$/, "")}/address/${address}`;
}
