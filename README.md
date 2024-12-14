[Click here for Japanese README](README.ja.md)

# symbol-graphql-server

This repository is a project that enables the use of Symbol Blockchain APIs through GraphQL.
It automatically generates GraphQL schemas and resolvers based on the OpenAPI schema files created by the Symbol community.

## Hou to use
### 1. Prerequisites
#### 1-1. Node.js and Package Manager
- Node.js v22.12.0 or higher
- pnpm v9.12.0 or higher

#### 1-2. Enabling pnpm
If you have Node.js installed, simply run the following command to enable pnpm:
```
corepack enable
```

#### 1-3. Installing packages
```
pnpm install
```

### 2. Downloading the Schema Files

1. Visit the following URL and check the available YAML file versions:

`https://github.com/symbol-blockchain-community/symbol-rest-client/tree/main/schema`

2. Run the following command to download the schema file:

```
curl -o schema/1_0_5.yml https://github.com/symbol-blockchain-community/symbol-rest-client/blob/main/schema/1_0_5.yml
```

### 3. Building the Schema File

#### 3-1. Creating a Configuration File
Rename .meshrc.example.yaml to .meshrc.yaml, then update the endpoint value to match the URL of the Symbol node you plan to use.

#### 3-2. Build
```
pnpm run build
```

### 4. Starting the Playground

```
pnpm run dev
```

### 5. Starting Swagger UI (Optional)
If you want to review the OpenAPI specifications, run the following command to start Swagger UI:

```
pnpm run swagger
```

## Examples
### Basic Queries
The following example demonstrates some basic queries you can perform with the GraphQL server:

```
query SymbolGQLExample {
  # Get the status of the connected node
  getNodeHealth {
    status {
      apiNode
      db
    }
  }
  # Retrieve information for a specific block height
  getBlockByHeight(height: "65535") {
    ... on BlockInfo {
      id
      block {
        beneficiaryAddress
        difficulty
      }
    }
  }
  # Get a confirmed transaction by its hash
  getConfirmedTransaction(transactionId: "your transaction hash") {
    ... on TransactionInfo {
      id
      meta {
        height
        hash
        feeMultiplier
      }
      transaction {
        mosaics {
          amount
          id
        }
        size
        type
      }
    }
  }
}
```

This example shows how to:
- Check the node's health status
- Retrieve block information
- Get transaction details

You can try these queries in the GraphQL Playground after starting the server.

### About the Versions

#### version 1
- This version wraps the REST API in GraphQL (current version).
- Due to performance concerns, we are working on version 2.

#### version 2
- Instead of wrapping the REST API, version 2 will access Symbol blockchain data directly.


### Contributing
This project is released under the MIT License, allowing free use, modification, and redistribution.
We welcome all forms of contribution, including bug reports, feature requests, and pull requests.

### License
MIT License