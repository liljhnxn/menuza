import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer found. Please check your PRIVATE_KEY in .env.local");
  }

  console.log("==========================================");
  console.log("Deploying Menuza Contract to Botchain Testnet (Chain ID 968)...");
  console.log(`Deployer address: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} BOHR`);

  const MenuzaFactory = await ethers.getContractFactory("Menuza");
  const menuza = await MenuzaFactory.deploy();
  await menuza.waitForDeployment();

  const contractAddress = await menuza.getAddress();
  console.log("------------------------------------------");
  console.log(`🎉 Menuza deployed successfully!`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Explorer Link: https://scan.bohr.life/address/${contractAddress}`);
  console.log("==========================================");

  // Export contract address and ABI for Next.js frontend
  const deploymentsDir = path.join(process.cwd(), "lib", "contracts");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentData = {
    address: contractAddress,
    network: "Botchain Testnet",
    chainId: 968,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(deploymentsDir, "deployment.json"),
    JSON.stringify(deploymentData, null, 2)
  );

  console.log("Saved deployment configuration to lib/contracts/deployment.json");

  // Update .env.local automatically
  const envLocalPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envLocalPath)) {
    let envContent = fs.readFileSync(envLocalPath, "utf8");
    if (envContent.includes("NEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS=${contractAddress}`;
    }
    fs.writeFileSync(envLocalPath, envContent);
    console.log("Updated NEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS in .env.local");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
