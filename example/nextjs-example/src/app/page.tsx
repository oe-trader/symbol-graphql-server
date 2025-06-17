'use client';

import WalletSearch from './components/WalletSearch';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Symbol GraphQL Explorer</h1>
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
              Powered by GraphQL
            </span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore Symbol blockchain data through a modern GraphQL API interface. Built with GraphQL Mesh, this tool
            transforms Symbol&apos;s REST API into a powerful, type-safe GraphQL schema for seamless wallet and
            blockchain data querying.
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <WalletSearch />
        </main>

        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p>Built with GraphQL Mesh • Symbol Blockchain • Next.js</p>
          <p className="text-sm mt-2">Type-safe GraphQL API for Symbol blockchain data</p>
        </footer>
      </div>
    </div>
  );
}
