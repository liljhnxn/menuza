import { formatEther } from "viem";

export function formatBohrPrice(weiPrice: bigint | undefined | null): string {
  if (weiPrice === undefined || weiPrice === null) return "0.00 BOHR";
  try {
    const formatted = formatEther(weiPrice);
    // Trim unnecessary trailing zeros if decimal is long
    const num = parseFloat(formatted);
    if (isNaN(num)) return "0 BOHR";
    // If small decimal or whole number
    return `${formatted} BOHR`;
  } catch {
    return "0 BOHR";
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

export function getExplorerTxUrl(txHash: string): string {
  const base = process.env.NEXT_PUBLIC_BLOCK_EXPLORER || "https://scan.bohr.life";
  return `${base.replace(/\/$/, "")}/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string): string {
  const base = process.env.NEXT_PUBLIC_BLOCK_EXPLORER || "https://scan.bohr.life";
  return `${base.replace(/\/$/, "")}/address/${address}`;
}

