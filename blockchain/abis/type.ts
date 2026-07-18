export const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "BatchCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "BatchHarvested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isPassed",
        "type": "bool"
      }
    ],
    "name": "QualityVerified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "shipCompany",
        "type": "string"
      }
    ],
    "name": "ShipAssigned",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "TransitUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "enum AgriTrace.Role",
        "name": "_role",
        "type": "uint8"
      }
    ],
    "name": "assignRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_shipCompany",
        "type": "string"
      }
    ],
    "name": "assignShipper",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "batchTransits",
    "outputs": [
      {
        "internalType": "address",
        "name": "shipper",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "timestamp",
        "type": "uint32"
      },
      {
        "internalType": "int16",
        "name": "temperature",
        "type": "int16"
      },
      {
        "internalType": "uint16",
        "name": "humidity",
        "type": "uint16"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "batches",
    "outputs": [
      {
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "internalType": "enum AgriTrace.BatchStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "uint32",
        "name": "harvestDate",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "expiryDate",
        "type": "uint32"
      },
      {
        "internalType": "int16",
        "name": "minTemp",
        "type": "int16"
      },
      {
        "internalType": "int16",
        "name": "maxTemp",
        "type": "int16"
      },
      {
        "internalType": "uint16",
        "name": "minHumidity",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "maxHumidity",
        "type": "uint16"
      },
      {
        "internalType": "string",
        "name": "plantIPFS",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "harvestIPFS",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "retailCompany",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "shipCompany",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "retailer",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "timestamp",
            "type": "uint32"
          },
          {
            "internalType": "bool",
            "name": "isPassed",
            "type": "bool"
          }
        ],
        "internalType": "struct AgriTrace.QualityTest",
        "name": "qualityTest",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "int16[4]",
        "name": "_envLimits",
        "type": "int16[4]"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "createBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "uint32",
        "name": "_expiryDate",
        "type": "uint32"
      },
      {
        "internalType": "string",
        "name": "_retailCompany",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "harvestBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "int16",
        "name": "_temp",
        "type": "int16"
      },
      {
        "internalType": "uint16",
        "name": "_hum",
        "type": "uint16"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "updateTransit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userRoles",
    "outputs": [
      {
        "internalType": "enum AgriTrace.Role",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_isPassed",
        "type": "bool"
      }
    ],
    "name": "verifyQuality",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const