// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Menuza
 * @dev Simple, lightweight on-chain digital menu application for restaurants, cafes and food vendors.
 * Deployed to Botchain Mainnet (Chain ID 677).
 */
contract Menuza {
    struct MenuItem {
        uint256 id;
        address owner;
        string name;
        string description;
        uint256 price;
        string category;
        bool isAvailable;
        uint256 createdAt;
        bool exists;
    }

    // State variables
    uint256 private _nextItemId = 1;
    mapping(uint256 => MenuItem) private _items;
    uint256[] private _allItemIds;

    // Custom errors for gas efficiency
    error EmptyItemName();
    error InvalidPrice();
    error ItemNotFound();
    error Unauthorized();

    // Events
    event ItemAdded(
        uint256 indexed id,
        address indexed owner,
        string name,
        uint256 price,
        string category
    );

    event ItemUpdated(
        uint256 indexed id,
        address indexed owner,
        string name,
        uint256 price,
        string category
    );

    event AvailabilityUpdated(
        uint256 indexed id,
        bool isAvailable
    );

    event ItemRemoved(
        uint256 indexed id,
        address indexed owner
    );

    /**
     * @notice Add a new menu item
     * @param name Name of the dish or drink
     * @param description Brief description of ingredients/flavor
     * @param price Price of the item (in wei or BOT native unit)
     * @param category Category (e.g., Main, Drink, Dessert, Starter)
     */
    function addItem(
        string calldata name,
        string calldata description,
        uint256 price,
        string calldata category
    ) external returns (uint256) {
        if (bytes(name).length == 0) revert EmptyItemName();
        if (price == 0) revert InvalidPrice();

        uint256 itemId = _nextItemId++;

        _items[itemId] = MenuItem({
            id: itemId,
            owner: msg.sender,
            name: name,
            description: description,
            price: price,
            category: bytes(category).length > 0 ? category : "General",
            isAvailable: true,
            createdAt: block.timestamp,
            exists: true
        });

        _allItemIds.push(itemId);

        emit ItemAdded(itemId, msg.sender, name, price, _items[itemId].category);

        return itemId;
    }

    /**
     * @notice Edit an existing menu item
     * @param id The unique item ID
     * @param name Updated item name
     * @param description Updated item description
     * @param price Updated price
     * @param category Updated category
     */
    function editItem(
        uint256 id,
        string calldata name,
        string calldata description,
        uint256 price,
        string calldata category
    ) external {
        MenuItem storage item = _items[id];
        if (!item.exists) revert ItemNotFound();
        if (item.owner != msg.sender) revert Unauthorized();
        if (bytes(name).length == 0) revert EmptyItemName();
        if (price == 0) revert InvalidPrice();

        item.name = name;
        item.description = description;
        item.price = price;
        if (bytes(category).length > 0) {
            item.category = category;
        }

        emit ItemUpdated(id, msg.sender, item.name, item.price, item.category);
    }

    /**
     * @notice Update availability status of an item (Available vs Sold Out)
     * @param id The unique item ID
     * @param isAvailable True for Available, False for Sold Out
     */
    function updateAvailability(uint256 id, bool isAvailable) external {
        MenuItem storage item = _items[id];
        if (!item.exists) revert ItemNotFound();
        if (item.owner != msg.sender) revert Unauthorized();

        item.isAvailable = isAvailable;

        emit AvailabilityUpdated(id, isAvailable);
    }

    /**
     * @notice Remove a menu item
     * @param id The unique item ID
     */
    function removeItem(uint256 id) external {
        MenuItem storage item = _items[id];
        if (!item.exists) revert ItemNotFound();
        if (item.owner != msg.sender) revert Unauthorized();

        item.exists = false;

        emit ItemRemoved(id, msg.sender);
    }

    /**
     * @notice Retrieve a single menu item by ID
     * @param id The unique item ID
     */
    function getItem(uint256 id) external view returns (MenuItem memory) {
        MenuItem memory item = _items[id];
        if (!item.exists) revert ItemNotFound();
        return item;
    }

    /**
     * @notice Retrieve all active menu items for public browsing
     */
    function getAllItems() external view returns (MenuItem[] memory) {
        uint256 activeCount = 0;
        uint256 total = _allItemIds.length;

        for (uint256 i = 0; i < total; i++) {
            if (_items[_allItemIds[i]].exists) {
                activeCount++;
            }
        }

        MenuItem[] memory activeItems = new MenuItem[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < total; i++) {
            uint256 itemId = _allItemIds[i];
            if (_items[itemId].exists) {
                activeItems[currentIndex] = _items[itemId];
                currentIndex++;
            }
        }

        return activeItems;
    }

    /**
     * @notice Retrieve active menu items owned by the caller
     */
    function getMyItems() external view returns (MenuItem[] memory) {
        return getItemsByOwner(msg.sender);
    }

    /**
     * @notice Retrieve active menu items owned by a specific address
     * @param owner Address of the restaurant owner
     */
    function getItemsByOwner(address owner) public view returns (MenuItem[] memory) {
        uint256 count = 0;
        uint256 total = _allItemIds.length;

        for (uint256 i = 0; i < total; i++) {
            uint256 itemId = _allItemIds[i];
            if (_items[itemId].exists && _items[itemId].owner == owner) {
                count++;
            }
        }

        MenuItem[] memory ownerItems = new MenuItem[](count);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < total; i++) {
            uint256 itemId = _allItemIds[i];
            if (_items[itemId].exists && _items[itemId].owner == owner) {
                ownerItems[currentIndex] = _items[itemId];
                currentIndex++;
            }
        }

        return ownerItems;
    }

    /**
     * @notice Total registered items count (including removed)
     */
    function totalItemsCount() external view returns (uint256) {
        return _allItemIds.length;
    }
}

