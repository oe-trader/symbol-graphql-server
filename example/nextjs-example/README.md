# Symbol GraphQL Explorer - Next.js Example

A modern web application that demonstrates how to integrate Symbol blockchain data with Next.js using GraphQL Mesh. This example showcases a wallet explorer with type-safe GraphQL queries and a beautiful user interface.

## Features

- 🔍 **Wallet Explorer**: Search and display Symbol wallet information
- 🚀 **GraphQL Integration**: Powered by GraphQL Mesh for type-safe API calls
- 🎨 **Modern UI**: Built with Tailwind CSS and responsive design
- 🌙 **Dark Mode**: Full dark mode support
- 📱 **Mobile Friendly**: Responsive design for all devices
- ⚡ **Type Safe**: Full TypeScript support with auto-generated types

## Prerequisites

- Node.js v22.12.0 or higher
- pnpm v9.12.0 or higher

### Enabling pnpm

If you have Node.js installed, simply run the following command to enable pnpm:

```bash
corepack enable
```

## Getting Started

### 1. Install Dependencies

```bash
cd example/nextjs-example
pnpm install
```

### 2. Configure GraphQL Mesh

Copy the example configuration file and update it with your preferred Symbol node:

```bash
cp .meshrc.example.yaml .meshrc.yaml
```

Edit `.meshrc.yaml` and update the `endpoint` value with a Symbol node URL:

1. Visit [Symbol Nodes](https://symbolnodes.org/nodes/) to find an active HTTPS-enabled node
2. Choose a node with good uptime and suitable location for your needs
3. Update the endpoint configuration:

```yaml
sources:
  - name: Symbol
    handler:
      openapi:
        source: https://raw.githubusercontent.com/symbol/symbol/refs/heads/new-docs/openapi/openapi-symbol.yml
        endpoint: https://your-node-url:3001  # Update this URL
transforms:
  - rename:
      renames:
        - from:
            type: .*DTO$
          to:
            type: '{type}'
          useRegExpForTypes: true
serve:
  endpoint: /api/graphql
  playground: false
```

**Tip**: Choose a node geographically close to your location for better performance.

### 3. Build GraphQL Schema

Generate the GraphQL schema from the Symbol OpenAPI specification:

```bash
pnpm mesh:build
```

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `pnpm dev` - Start the development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm mesh:build` - Build GraphQL Mesh schema
- `pnpm mesh:dev` - Start GraphQL Mesh in development mode

## How It Works

### GraphQL Mesh Integration

This example demonstrates how to integrate GraphQL Mesh with Next.js API Routes:

1. **OpenAPI to GraphQL**: GraphQL Mesh automatically converts Symbol's OpenAPI specification into a GraphQL schema
2. **Type Safety**: Generated TypeScript types ensure type-safe API calls
3. **API Routes**: Next.js API routes serve the GraphQL endpoint at `/api/graphql`
4. **Frontend Integration**: React components use the GraphQL API to fetch and display data

### Key Files

- `src/app/api/graphql/route.ts` - GraphQL API endpoint
- `src/app/components/WalletSearch.tsx` - Main wallet search component
- `src/types/symbol.ts` - TypeScript type definitions
- `.meshrc.yaml` - GraphQL Mesh configuration

## Example Queries

Once the application is running, you can search for Symbol wallet addresses. Here are some example queries you can try:

### Search for Account Information

Enter a Symbol address in the search box to see:
- Account details (address, public key, importance score)
- Mosaic holdings
- Account type and status

### GraphQL Query Example

The application uses queries like this behind the scenes:

```graphql
query GetAccountInfo($accountId: String!) {
  getAccountInfo(accountId: $accountId) {
    ... on AccountInfo {
      account {
        address
        publicKey
        mosaics {
          id
          amount
        }
        importance
        importanceHeight
      }
    }
    ... on ModelError {
      code
      message
    }
  }
}
```

## Customization

### Adding New Queries

1. Check available queries in `.mesh/schema.graphql` after building
2. Add new components in `src/app/components/`
3. Use the existing type definitions in `src/types/symbol.ts`

### Styling

The application uses Tailwind CSS for styling. You can customize the appearance by modifying the Tailwind classes in the components.

### Symbol Node Configuration

You can use any Symbol node by updating the `endpoint` in `.meshrc.yaml`. 

#### Finding HTTPS-enabled Nodes

1. Visit [Symbol Nodes](https://symbolnodes.org/nodes/) to see the current list of active nodes
2. Look for nodes with HTTPS support (indicated by the "https" link in the table)
3. Choose a node with good uptime and low latency for your region

#### Popular HTTPS-enabled Nodes

Based on the current node list, some reliable HTTPS-enabled nodes include:

**Note**: Node availability and HTTPS support may change over time. Always verify the current status on the [Symbol Nodes website](https://symbolnodes.org/nodes/) before configuring your application.

## Troubleshooting

### GraphQL Mesh Build Fails

Make sure you have internet access and the Symbol OpenAPI specification URL is accessible:

```bash
curl https://raw.githubusercontent.com/symbol/symbol/refs/heads/new-docs/openapi/openapi-symbol.yml
```

### TypeScript Errors

After updating `.meshrc.yaml`, rebuild the GraphQL schema:

```bash
pnpm mesh:build
```

### API Errors

Check that your Symbol node endpoint is accessible and responding:

```bash
curl https://your-node-url:3001/node/health
```

## Learn More

- [Symbol Blockchain Documentation](https://docs.symbolplatform.com/)
- [GraphQL Mesh Documentation](https://the-guild.dev/graphql/mesh)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Contributing

This example is part of the Symbol GraphQL Server project. Contributions are welcome!

## License

MIT License
