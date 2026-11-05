import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load .env.local first if it exists, then fallback to .env
if (fs.existsSync(path.resolve(process.cwd(), ".env.local"))) {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
}
dotenv.config();

const MAINNET_RPC_URL = process.env.BOTCHAIN_MAINNET_RPC_URL || "https://rpc.botchain.ai";
const TESTNET_RPC_URL = process.env.BOTCHAIN_RPC_URL || "https://rpc.bohr.life";

function getPrivateKey(): string[] {
  const pk = process.env.PRIVATE_KEY?.trim();
  if (!pk) return [];
  const formatted = pk.startsWith("0x") ? pk : `0x${pk}`;
  return [formatted];
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    botchainMainnet: {
      url: MAINNET_RPC_URL,
      chainId: 677,
      accounts: getPrivateKey(),
      gasPrice: 20000000000, // 20 gwei - minimum standard to prevent gas wastage
    },
    botchain: {
      url: TESTNET_RPC_URL,
      chainId: 968,
      accounts: getPrivateKey(),
    },
  },
  etherscan: {
    apiKey: {
      botchainMainnet: "empty",
      botchain: "empty",
    },
    customChains: [
      {
        network: "botchainMainnet",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
      {
        network: "botchain",
        chainId: 968,
        urls: {
          apiURL: "https://scan.bohr.life/api",
          browserURL: "https://scan.bohr.life",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
