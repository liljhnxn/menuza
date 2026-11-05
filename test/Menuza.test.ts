import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { Menuza } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Menuza Contract", function () {
  let menuza: Menuza;
  let owner: HardhatEthersSigner;
  let restaurantA: HardhatEthersSigner;
  let restaurantB: HardhatEthersSigner;
  let customer: HardhatEthersSigner;

  const sampleItem = {
    name: "Truffle Tagliatelle",
    description: "Handmade pasta, black truffle shavings, aged parmesan crema",
    price: ethers.parseEther("0.02"), // 0.02 BOT
    category: "Mains",
  };

  beforeEach(async function () {
    [owner, restaurantA, restaurantB, customer] = await ethers.getSigners();
    const MenuzaFactory = await ethers.getContractFactory("Menuza");
    menuza = await MenuzaFactory.deploy();
    await menuza.waitForDeployment();
  });

  describe("Adding Menu Items", function () {
    it("should allow a restaurant owner to add a menu item successfully", async function () {
      const tx = await menuza.connect(restaurantA).addItem(
        sampleItem.name,
        sampleItem.description,
        sampleItem.price,
        sampleItem.category
      );

      await expect(tx)
        .to.emit(menuza, "ItemAdded")
        .withArgs(1, restaurantA.address, sampleItem.name, sampleItem.price, sampleItem.category);

      const item = await menuza.getItem(1);
      expect(item.id).to.equal(1);
      expect(item.owner).to.equal(restaurantA.address);
      expect(item.name).to.equal(sampleItem.name);
      expect(item.description).to.equal(sampleItem.description);
      expect(item.price).to.equal(sampleItem.price);
      expect(item.category).to.equal(sampleItem.category);
      expect(item.isAvailable).to.equal(true);
      expect(item.exists).to.equal(true);
    });

    it("should reject adding an item with an empty name", async function () {
      await expect(
        menuza.connect(restaurantA).addItem("", "Delicious food", ethers.parseEther("0.01"), "Mains")
      ).to.be.revertedWithCustomError(menuza, "EmptyItemName");
    });

    it("should reject adding an item with zero price", async function () {
      await expect(
        menuza.connect(restaurantA).addItem("Free Pasta", "Tasty", 0, "Mains")
      ).to.be.revertedWithCustomError(menuza, "InvalidPrice");
    });

    it("should assign incremental unique IDs to multiple items", async function () {
      await menuza.connect(restaurantA).addItem("Item 1", "Desc 1", 100, "Drinks");
      await menuza.connect(restaurantA).addItem("Item 2", "Desc 2", 200, "Mains");
      await menuza.connect(restaurantB).addItem("Item 3", "Desc 3", 300, "Desserts");

      const item1 = await menuza.getItem(1);
      const item2 = await menuza.getItem(2);
      const item3 = await menuza.getItem(3);

      expect(item1.id).to.equal(1);
      expect(item2.id).to.equal(2);
      expect(item3.id).to.equal(3);
      expect(item1.owner).to.equal(restaurantA.address);
      expect(item3.owner).to.equal(restaurantB.address);
    });
  });

  describe("Editing Menu Items", function () {
    beforeEach(async function () {
      await menuza.connect(restaurantA).addItem(
        sampleItem.name,
        sampleItem.description,
        sampleItem.price,
        sampleItem.category
      );
    });

    it("should allow the original owner to edit item details", async function () {
      const updatedName = "Truffle Tagliatelle Deluxe";
      const updatedDesc = "Extra black truffles with 24-month aged parmigiano";
      const updatedPrice = ethers.parseEther("0.025");
      const updatedCategory = "Chef's Specials";

      const tx = await menuza.connect(restaurantA).editItem(
        1,
        updatedName,
        updatedDesc,
        updatedPrice,
        updatedCategory
      );

      await expect(tx)
        .to.emit(menuza, "ItemUpdated")
        .withArgs(1, restaurantA.address, updatedName, updatedPrice, updatedCategory);

      const item = await menuza.getItem(1);
      expect(item.name).to.equal(updatedName);
      expect(item.description).to.equal(updatedDesc);
      expect(item.price).to.equal(updatedPrice);
      expect(item.category).to.equal(updatedCategory);
    });

    it("should prevent unauthorized wallets from editing an item", async function () {
      await expect(
        menuza.connect(restaurantB).editItem(1, "Hacked Pasta", "Desc", sampleItem.price, "Mains")
      ).to.be.revertedWithCustomError(menuza, "Unauthorized");

      await expect(
        menuza.connect(customer).editItem(1, "Customer Edit", "Desc", sampleItem.price, "Mains")
      ).to.be.revertedWithCustomError(menuza, "Unauthorized");
    });

    it("should reject editing non-existent items", async function () {
      await expect(
        menuza.connect(restaurantA).editItem(999, "Ghost Pasta", "Desc", sampleItem.price, "Mains")
      ).to.be.revertedWithCustomError(menuza, "ItemNotFound");
    });

    it("should reject editing with an empty name or zero price", async function () {
      await expect(
        menuza.connect(restaurantA).editItem(1, "", "Desc", sampleItem.price, "Mains")
      ).to.be.revertedWithCustomError(menuza, "EmptyItemName");

      await expect(
        menuza.connect(restaurantA).editItem(1, "Valid Name", "Desc", 0, "Mains")
      ).to.be.revertedWithCustomError(menuza, "InvalidPrice");
    });
  });

  describe("Updating Availability", function () {
    beforeEach(async function () {
      await menuza.connect(restaurantA).addItem(
        sampleItem.name,
        sampleItem.description,
        sampleItem.price,
        sampleItem.category
      );
    });

    it("should allow the owner to toggle availability to Sold Out and back", async function () {
      // Toggle to Sold Out
      const tx1 = await menuza.connect(restaurantA).updateAvailability(1, false);
      await expect(tx1)
        .to.emit(menuza, "AvailabilityUpdated")
        .withArgs(1, false);

      let item = await menuza.getItem(1);
      expect(item.isAvailable).to.equal(false);

      // Toggle back to Available
      const tx2 = await menuza.connect(restaurantA).updateAvailability(1, true);
      await expect(tx2)
        .to.emit(menuza, "AvailabilityUpdated")
        .withArgs(1, true);

      item = await menuza.getItem(1);
      expect(item.isAvailable).to.equal(true);
    });

    it("should prevent unauthorized wallets from updating availability", async function () {
      await expect(
        menuza.connect(restaurantB).updateAvailability(1, false)
      ).to.be.revertedWithCustomError(menuza, "Unauthorized");
    });

    it("should reject updating availability of a non-existent item", async function () {
      await expect(
        menuza.connect(restaurantA).updateAvailability(999, false)
      ).to.be.revertedWithCustomError(menuza, "ItemNotFound");
    });
  });

  describe("Removing Menu Items", function () {
    beforeEach(async function () {
      await menuza.connect(restaurantA).addItem(
        sampleItem.name,
        sampleItem.description,
        sampleItem.price,
        sampleItem.category
      );
    });

    it("should allow the original owner to remove their item", async function () {
      const tx = await menuza.connect(restaurantA).removeItem(1);
      await expect(tx)
        .to.emit(menuza, "ItemRemoved")
        .withArgs(1, restaurantA.address);

      // getItem on removed item should revert with ItemNotFound
      await expect(menuza.getItem(1)).to.be.revertedWithCustomError(
        menuza,
        "ItemNotFound"
      );
    });

    it("should prevent unauthorized removal", async function () {
      await expect(
        menuza.connect(restaurantB).removeItem(1)
      ).to.be.revertedWithCustomError(menuza, "Unauthorized");

      await expect(
        menuza.connect(customer).removeItem(1)
      ).to.be.revertedWithCustomError(menuza, "Unauthorized");
    });

    it("should reject removing a non-existent or already removed item", async function () {
      await menuza.connect(restaurantA).removeItem(1);

      await expect(
        menuza.connect(restaurantA).removeItem(1)
      ).to.be.revertedWithCustomError(menuza, "ItemNotFound");
    });
  });

  describe("Retrieving Items", function () {
    beforeEach(async function () {
      // Restaurant A adds 2 items
      await menuza.connect(restaurantA).addItem("Espresso", "Single shot Arabica", 100, "Drinks");
      await menuza.connect(restaurantA).addItem("Croissant", "Warm buttery croissant", 150, "Pastries");

      // Restaurant B adds 1 item
      await menuza.connect(restaurantB).addItem("Margherita Pizza", "San Marzano tomatoes, fior di latte", 500, "Mains");
    });

    it("should retrieve individual items via getItem", async function () {
      const item1 = await menuza.getItem(1);
      expect(item1.name).to.equal("Espresso");
      expect(item1.owner).to.equal(restaurantA.address);

      const item3 = await menuza.getItem(3);
      expect(item3.name).to.equal("Margherita Pizza");
      expect(item3.owner).to.equal(restaurantB.address);
    });

    it("should retrieve all active items via getAllItems", async function () {
      const allItems = await menuza.getAllItems();
      expect(allItems.length).to.equal(3);
      expect(allItems[0].name).to.equal("Espresso");
      expect(allItems[1].name).to.equal("Croissant");
      expect(allItems[2].name).to.equal("Margherita Pizza");

      // Remove item 2 and verify getAllItems only returns active items
      await menuza.connect(restaurantA).removeItem(2);

      const remainingItems = await menuza.getAllItems();
      expect(remainingItems.length).to.equal(2);
      expect(remainingItems[0].id).to.equal(1);
      expect(remainingItems[1].id).to.equal(3);
    });

    it("should retrieve items belonging to connected wallet via getMyItems", async function () {
      const myItemsA = await menuza.connect(restaurantA).getMyItems();
      expect(myItemsA.length).to.equal(2);
      expect(myItemsA[0].name).to.equal("Espresso");
      expect(myItemsA[1].name).to.equal("Croissant");

      const myItemsB = await menuza.connect(restaurantB).getMyItems();
      expect(myItemsB.length).to.equal(1);
      expect(myItemsB[0].name).to.equal("Margherita Pizza");

      const customerItems = await menuza.connect(customer).getMyItems();
      expect(customerItems.length).to.equal(0);
    });

    it("should allow any caller to query items by owner via getItemsByOwner", async function () {
      const itemsA = await menuza.getItemsByOwner(restaurantA.address);
      expect(itemsA.length).to.equal(2);
    });
  });
});
