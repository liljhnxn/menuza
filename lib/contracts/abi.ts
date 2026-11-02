export const MENUZA_ABI = [
  {
    "type": "function",
    "name": "addItem",
    "inputs": [
      { "name": "name", "type": "string", "internalType": "string" },
      { "name": "description", "type": "string", "internalType": "string" },
      { "name": "price", "type": "uint256", "internalType": "uint256" },
      { "name": "category", "type": "string", "internalType": "string" }
    ],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "editItem",
    "inputs": [
      { "name": "id", "type": "uint256", "internalType": "uint256" },
      { "name": "name", "type": "string", "internalType": "string" },
      { "name": "description", "type": "string", "internalType": "string" },
      { "name": "price", "type": "uint256", "internalType": "uint256" },
      { "name": "category", "type": "string", "internalType": "string" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateAvailability",
    "inputs": [
      { "name": "id", "type": "uint256", "internalType": "uint256" },
      { "name": "isAvailable", "type": "bool", "internalType": "bool" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeItem",
    "inputs": [
      { "name": "id", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getItem",
    "inputs": [
      { "name": "id", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Menuza.MenuItem",
        "components": [
          { "name": "id", "type": "uint256", "internalType": "uint256" },
          { "name": "owner", "type": "address", "internalType": "address" },
          { "name": "name", "type": "string", "internalType": "string" },
          { "name": "description", "type": "string", "internalType": "string" },
          { "name": "price", "type": "uint256", "internalType": "uint256" },
          { "name": "category", "type": "string", "internalType": "string" },
          { "name": "isAvailable", "type": "bool", "internalType": "bool" },
          { "name": "createdAt", "type": "uint256", "internalType": "uint256" },
          { "name": "exists", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllItems",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct Menuza.MenuItem[]",
        "components": [
          { "name": "id", "type": "uint256", "internalType": "uint256" },
          { "name": "owner", "type": "address", "internalType": "address" },
          { "name": "name", "type": "string", "internalType": "string" },
          { "name": "description", "type": "string", "internalType": "string" },
          { "name": "price", "type": "uint256", "internalType": "uint256" },
          { "name": "category", "type": "string", "internalType": "string" },
          { "name": "isAvailable", "type": "bool", "internalType": "bool" },
          { "name": "createdAt", "type": "uint256", "internalType": "uint256" },
          { "name": "exists", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMyItems",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct Menuza.MenuItem[]",
        "components": [
          { "name": "id", "type": "uint256", "internalType": "uint256" },
          { "name": "owner", "type": "address", "internalType": "address" },
          { "name": "name", "type": "string", "internalType": "string" },
          { "name": "description", "type": "string", "internalType": "string" },
          { "name": "price", "type": "uint256", "internalType": "uint256" },
          { "name": "category", "type": "string", "internalType": "string" },
          { "name": "isAvailable", "type": "bool", "internalType": "bool" },
          { "name": "createdAt", "type": "uint256", "internalType": "uint256" },
          { "name": "exists", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getItemsByOwner",
    "inputs": [
      { "name": "owner", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct Menuza.MenuItem[]",
        "components": [
          { "name": "id", "type": "uint256", "internalType": "uint256" },
          { "name": "owner", "type": "address", "internalType": "address" },
          { "name": "name", "type": "string", "internalType": "string" },
          { "name": "description", "type": "string", "internalType": "string" },
          { "name": "price", "type": "uint256", "internalType": "uint256" },
          { "name": "category", "type": "string", "internalType": "string" },
          { "name": "isAvailable", "type": "bool", "internalType": "bool" },
          { "name": "createdAt", "type": "uint256", "internalType": "uint256" },
          { "name": "exists", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalItemsCount",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ItemAdded",
    "inputs": [
      { "name": "id", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "name", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "price", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "category", "type": "string", "indexed": false, "internalType": "string" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ItemUpdated",
    "inputs": [
      { "name": "id", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "name", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "price", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "category", "type": "string", "indexed": false, "internalType": "string" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AvailabilityUpdated",
    "inputs": [
      { "name": "id", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "isAvailable", "type": "bool", "indexed": false, "internalType": "bool" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ItemRemoved",
    "inputs": [
      { "name": "id", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "owner", "type": "address", "indexed": true, "internalType": "address" }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "EmptyItemName",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidPrice",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ItemNotFound",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Unauthorized",
    "inputs": []
  }
] as const;

