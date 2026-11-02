export interface MenuItem {
  id: bigint;
  owner: `0x${string}`;
  name: string;
  description: string;
  price: bigint;
  category: string;
  isAvailable: boolean;
  createdAt: bigint;
  exists: boolean;
}

export type CategoryFilter = "All" | "Mains" | "Drinks" | "Desserts" | "Starters" | "Specials" | string;

