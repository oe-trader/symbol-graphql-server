'use client';

import { useState } from 'react';

interface AccountInfo {
  account: {
    address: string;
    publicKey: string;
    mosaics: Array<{
      id: string;
      amount: string;
    }>;
    importance: string;
    importanceHeight: string;
  };
}

export default function WalletSearch() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletInfo, setWalletInfo] = useState<AccountInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchWallet = async () => {
    if (!address.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError(null);
    setWalletInfo(null);

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
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
          `,
          variables: {
            accountId: address.trim(),
          },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        setError(data.errors[0].message);
      } else if (data.data.getAccountInfo.code) {
        setError(`Error: ${data.data.getAccountInfo.message}`);
      } else {
        setWalletInfo(data.data.getAccountInfo);
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchWallet();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* GraphQL Query Info */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center mb-2">
          <svg
            className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">GraphQL Query</span>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Using <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-xs">getAccountInfo</code> query to fetch
          wallet data with type-safe GraphQL schema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Symbol Wallet Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., NXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75"></path>
                </svg>
              )}
              {loading ? 'Querying...' : 'Query GraphQL'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {walletInfo && (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h3>
              <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">
                GraphQL Response
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Address</label>
                <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                  {walletInfo.account.address}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Public Key</label>
                <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                  {walletInfo.account.publicKey}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Importance Score</label>
                <p className="text-sm text-gray-900 dark:text-white">{walletInfo.account.importance}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Importance Height</label>
                <p className="text-sm text-gray-900 dark:text-white">{walletInfo.account.importanceHeight}</p>
              </div>
            </div>
          </div>

          {walletInfo.account.mosaics && walletInfo.account.mosaics.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Owned Mosaics</h3>
                <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium rounded">
                  GraphQL Array Field
                </span>
              </div>
              <div className="space-y-3">
                {walletInfo.account.mosaics.map((mosaic, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-white dark:bg-gray-600 rounded border"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Mosaic ID: <span className="font-mono">{mosaic.id}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{mosaic.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
