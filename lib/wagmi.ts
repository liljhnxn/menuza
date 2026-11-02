import { http, createConfig, injected } from "wagmi";
import { botchainTestnet } from "./chains";

export const config = createConfig({
  chains: [botchainTestnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchainTestnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.bohr.life"),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
