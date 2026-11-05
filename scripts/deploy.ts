import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer found. Please check your PRIVATE_KEY in .env.local");
  }

  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId) || 677;
  const networkName = "Botchain Mainnet";
  const tokenSymbol = "BOT";
  const explorerUrl = "https://scan.botchain.ai";

  console.log("==========================================");
  console.log(`Deploying Menuza to ${networkName} (Chain ID: ${chainId})...`);
  console.log(`Deployer address: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} ${tokenSymbol}`);

  // Fetch current gas price and set strict minimum to avoid gas wastage
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || 20000000000n;
  console.log(`Using gasPrice: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);

  const MenuzaFactory = await ethers.getContractFactory("Menuza");

  const menuza = await MenuzaFactory.deploy({
    gasPrice: gasPrice,
  });

  console.log("Transaction submitted, awaiting confirmation...");
  await menuza.waitForDeployment();

  const contractAddress = await menuza.getAddress();
  const deployTx = menuza.deploymentTransaction();
  let gasUsedStr = "N/A";
  let totalFeeStr = "N/A";

  if (deployTx) {
    const receipt = await deployTx.wait();
    if (receipt) {
      gasUsedStr = receipt.gasUsed.toString();
      const totalFee = receipt.gasUsed * (receipt.gasPrice || gasPrice);
      totalFeeStr = `${ethers.formatEther(totalFee)} ${tokenSymbol}`;
    }
  }

  console.log("------------------------------------------");
  console.log(`🎉 Menuza deployed successfully!`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Gas Used: ${gasUsedStr}`);
  console.log(`Total Gas Cost: ${totalFeeStr}`);
  console.log(`Explorer Link: ${explorerUrl}/address/${contractAddress}`);
  console.log("==========================================");

  // Export contract address and deployment data
  const deploymentsDir = path.join(process.cwd(), "lib", "contracts");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentData = {
    address: contractAddress,
    network: networkName,
    chainId: chainId,
    token: tokenSymbol,
    explorer: explorerUrl,
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
    envContent = envContent.replace(/NEXT_PUBLIC_CHAIN_ID=.*/, `NEXT_PUBLIC_CHAIN_ID=${chainId}`);
    envContent = envContent.replace(
      /NEXT_PUBLIC_RPC_URL=.*/,
      `NEXT_PUBLIC_RPC_URL=https://rpc.botchain.ai`
    );
    envContent = envContent.replace(
      /NEXT_PUBLIC_BLOCK_EXPLORER=.*/,
      `NEXT_PUBLIC_BLOCK_EXPLORER=${explorerUrl}`
    );
    envContent = envContent.replace(
      /NEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_MENUZA_CONTRACT_ADDRESS=${contractAddress}`
    );
    fs.writeFileSync(envLocalPath, envContent);
    console.log("Updated .env.local with Mainnet configuration");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
