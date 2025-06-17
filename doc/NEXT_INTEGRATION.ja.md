# Symbol GraphQL Server の Next.js アプリケーションへの統合

このドキュメントでは、Symbol GraphQL Server を Next.js アプリケーションに統合する方法について説明します。

## 統合方法の概要

Symbol GraphQL Server を Next.js アプリケーションに統合するには、主に2つの方法があります：

1. **Next.js API Routes を使用する方法**
   - GraphQL Mesh を Next の API Route 内で直接使用
   - Next アプリケーションと同じサーバー上で GraphQL エンドポイントを提供

2. **GraphQL Mesh SDK の使用**
   - クライアントコンポーネントから GraphQL Mesh SDK を使ってデータを取得

## 1. 準備作業

### 1-1. 必要なパッケージのインストール

```bash
npm install @graphql-mesh/cli @graphql-mesh/openapi @graphql-mesh/transform-rename graphql
# または
yarn add @graphql-mesh/cli @graphql-mesh/openapi @graphql-mesh/transform-rename graphql
# または
pnpm add @graphql-mesh/cli @graphql-mesh/openapi @graphql-mesh/transform-rename graphql
```

### 1-2. Schema ファイルの取得

Symbol ブロックチェーンの OpenAPI スキーマファイルを取得し、プロジェクト内に保存します：

```bash
mkdir -p schema
curl -o schema/1_0_5.yml https://github.com/symbol-blockchain-community/symbol-rest-client/blob/main/schema/1_0_5.yml
```

### 1-3. 設定ファイルの作成

プロジェクトのルートに `.meshrc.yaml` ファイルを作成します：

```yaml
sources:
  - name: Symbol
    handler:
      openapi:
        source: ./schema/1_0_5.yml
        endpoint: https://your-node-url:3001
transforms:
  - rename:
      renames:
        - from:
            type: '^(.+)DTO$'
          to:
            type: '$1'
          useRegExpForTypes: true
serve:
  endpoint: /api/graphql
  playground: true
```

`endpoint` の値を使用したいシンボルノードの URL に変更してください。

## 2. Next.js プロジェクトへの統合

### 2-1. API Route の作成

#### Pages Router を使用する場合

```typescript
// pages/api/graphql.ts
import { createBuiltMeshHTTPHandler } from '../../.mesh';

export const config = {
  api: {
    bodyParser: false
  }
};

export default createBuiltMeshHTTPHandler();
```

#### App Router を使用する場合

```typescript
// app/api/graphql/route.ts
import { createBuiltMeshHTTPHandler } from '../../../.mesh';

const handler = createBuiltMeshHTTPHandler();

export const GET = handler;
export const POST = handler;
```

### 2-2. ビルドスクリプトの設定

`package.json` のスクリプトにMeshビルドを追加します：

```json
{
  "scripts": {
    "dev": "next dev",
    "mesh:dev": "mesh dev",
    "build": "mesh build && next build",
    "start": "next start"
  }
}
```

## 3. GraphQL クエリの実行

### 3-1. サーバーサイドでのデータ取得

#### Pages Router (getServerSideProps)

```typescript
// pages/index.tsx
import { getMeshSDK } from '../.mesh';

export async function getServerSideProps() {
  const { getNodeHealth } = await getMeshSDK();
  
  const result = await getNodeHealth();
  
  return {
    props: {
      nodeStatus: result.status
    }
  };
}

export default function Home({ nodeStatus }) {
  return (
    <div>
      <h1>Symbol ノードのステータス</h1>
      <p>API ノード: {nodeStatus.apiNode}</p>
      <p>データベース: {nodeStatus.db}</p>
    </div>
  );
}
```

#### App Router (Server Component)

```typescript
// app/page.tsx
import { getMeshSDK } from '../.mesh';

export default async function Home() {
  const { getNodeHealth } = await getMeshSDK();
  const result = await getNodeHealth();
  
  return (
    <div>
      <h1>Symbol ノードのステータス</h1>
      <p>API ノード: {result.status.apiNode}</p>
      <p>データベース: {result.status.db}</p>
    </div>
  );
}
```

### 3-2. クライアントサイドでのデータ取得

```typescript
// components/NodeStatus.tsx
'use client';

import { useEffect, useState } from 'react';

export default function NodeStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                getNodeHealth {
                  status {
                    apiNode
                    db
                  }
                }
              }
            `
          }),
        });
        
        const data = await response.json();
        setStatus(data.data.getNodeHealth.status);
      } catch (error) {
        console.error('Error fetching node status:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (!status) return <p>ステータスの取得に失敗しました</p>;

  return (
    <div>
      <h2>ノードステータス</h2>
      <p>API ノード: {status.apiNode}</p>
      <p>データベース: {status.db}</p>
    </div>
  );
}
```

## 4. ノード切り替え機能の実装

Symbol ブロックチェーンでは、ノードが停止したり遅延したりすることがあるため、ユーザーがノードを切り替えられる機能が重要です。GraphQL Mesh でもノード切り替えに対応するための方法を紹介します。

### 4-1. 動的なエンドポイント設定

GraphQL Mesh の設定を動的に変更するために、API Route をカスタマイズします：

```typescript
// app/api/graphql/route.ts
import { createYoga } from 'graphql-yoga';
import { getMesh } from '../../.mesh';
import { NextRequest } from 'next/server';

// ノードリストの例
const SYMBOL_NODES = [
  { url: 'https://node1.symbol.example.com:3001', name: 'ノード1' },
  { url: 'https://node2.symbol.example.com:3001', name: 'ノード2' },
  { url: 'https://node3.symbol.example.com:3001', name: 'ノード3' },
];

// デフォルトノード
const DEFAULT_NODE = SYMBOL_NODES[0].url;

// ノードURLをクッキーから取得するか、デフォルトを使用
function getNodeUrl(request: NextRequest): string {
  const nodeUrl = request.cookies.get('symbol-node-url')?.value;
  return nodeUrl || DEFAULT_NODE;
}

// メッシュインスタンスのキャッシュ
const meshInstanceCache = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const nodeUrl = getNodeUrl(request);
    
    // キャッシュからメッシュインスタンスを取得するか新しく作成
    if (!meshInstanceCache.has(nodeUrl)) {
      const meshInstance = await getMesh({
        sources: [
          {
            name: 'Symbol',
            handler: {
              openapi: {
                source: './schema/1_0_5.yml',
                endpoint: nodeUrl,
              },
            },
          },
        ],
      });
      
      meshInstanceCache.set(nodeUrl, meshInstance);
    }
    
    const { execute, schema } = meshInstanceCache.get(nodeUrl);
    
    const yoga = createYoga({
      schema,
      fetchAPI: { Request, Response },
      graphqlEndpoint: '/api/graphql',
    });
    
    return yoga.fetch(request);
  } catch (error) {
    console.error('GraphQL API error:', error);
    return new Response(JSON.stringify({
      errors: [{ message: 'Internal server error' }],
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export const GET = POST;
```

### 4-2. ノード選択UIの実装

```tsx
// components/NodeSelector.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// 利用可能なノードのリスト
const SYMBOL_NODES = [
  { url: 'https://node1.symbol.example.com:3001', name: 'ノード1' },
  { url: 'https://node2.symbol.example.com:3001', name: 'ノード2' },
  { url: 'https://node3.symbol.example.com:3001', name: 'ノード3' },
];

export default function NodeSelector() {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState('');
  const [loading, setLoading] = useState(false);

  // 現在選択されているノードをクッキーから取得
  useEffect(() => {
    const nodeCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('symbol-node-url='))
      ?.split('=')[1];
    
    setSelectedNode(nodeCookie || SYMBOL_NODES[0].url);
  }, []);

  // ノードを変更する関数
  const handleNodeChange = async (nodeUrl: string) => {
    setLoading(true);
    
    try {
      // クッキーを設定
      document.cookie = `symbol-node-url=${nodeUrl}; path=/; max-age=${60 * 60 * 24 * 30}`;
      setSelectedNode(nodeUrl);
      
      // 健全性チェック (オプション)
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              getNodeHealth {
                status {
                  apiNode
                  db
                }
              }
            }
          `
        }),
      });
      
      const data = await response.json();
      
      if (data.errors) {
        console.error('ノード接続エラー:', data.errors);
        alert('選択したノードに接続できません。別のノードを選択してください。');
      } else {
        // ページをリフレッシュして新しいノードのデータを表示
        router.refresh();
      }
    } catch (error) {
      console.error('ノード切り替えエラー:', error);
      alert('ノードの切り替え中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="node-selector">
      <h3>ノードを選択</h3>
      <select 
        value={selectedNode}
        onChange={(e) => handleNodeChange(e.target.value)}
        disabled={loading}
      >
        {SYMBOL_NODES.map(node => (
          <option key={node.url} value={node.url}>
            {node.name} ({node.url})
          </option>
        ))}
      </select>
      {loading && <span>切り替え中...</span>}
    </div>
  );
}
```

### 4-3. ノードステータスの監視

複数のノードを監視して最適なノードを自動選択する機能も実装できます：

```typescript
// utils/nodeHealth.ts
export async function checkNodeHealth(nodeUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${nodeUrl}/node/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000, // 5秒でタイムアウト
    });
    
    const data = await response.json();
    return data.status?.apiNode === 'up' && data.status?.db === 'up';
  } catch (error) {
    console.error(`ノード ${nodeUrl} の健全性チェックに失敗:`, error);
    return false;
  }
}

export async function findHealthyNode(nodes: string[]): Promise<string | null> {
  // 複数のノードを同時に確認
  const healthChecks = await Promise.all(
    nodes.map(async (nodeUrl) => {
      const isHealthy = await checkNodeHealth(nodeUrl);
      return { nodeUrl, isHealthy };
    })
  );
  
  // 健全なノードを見つける
  const healthyNode = healthChecks.find(check => check.isHealthy);
  return healthyNode ? healthyNode.nodeUrl : null;
}
```

### 4-4. サーバーサイドでのノード選択

```typescript
// app/api/best-node/route.ts
import { NextResponse } from 'next/server';
import { findHealthyNode } from '../../../utils/nodeHealth';

const SYMBOL_NODES = [
  'https://node1.symbol.example.com:3001',
  'https://node2.symbol.example.com:3001',
  'https://node3.symbol.example.com:3001',
];

export async function GET() {
  try {
    const healthyNodeUrl = await findHealthyNode(SYMBOL_NODES);
    
    if (healthyNodeUrl) {
      return NextResponse.json({ 
        success: true, 
        nodeUrl: healthyNodeUrl 
      });
    } else {
      return NextResponse.json(
        { success: false, message: '利用可能なノードが見つかりません' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('最適なノード検索エラー:', error);
    return NextResponse.json(
      { success: false, message: 'ノード検索中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
```

### 4-5. 自動ノード選択コンポーネント

```tsx
// components/AutoNodeSelector.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoNodeSelector() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const findBestNode = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/best-node');
      const data = await response.json();
      
      if (data.success && data.nodeUrl) {
        // クッキーを設定
        document.cookie = `symbol-node-url=${data.nodeUrl}; path=/; max-age=${60 * 60 * 24}`;
        
        // ページをリフレッシュして新しいノードのデータを表示
        router.refresh();
      } else {
        setError(data.message || '最適なノードが見つかりませんでした');
      }
    } catch (error) {
      console.error('自動ノード選択エラー:', error);
      setError('最適なノードを探す際にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auto-node-selector">
      <button 
        onClick={findBestNode} 
        disabled={loading}
      >
        最適なノードを自動選択
      </button>
      {loading && <span>検索中...</span>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### 4-6. ノードの継続的なヘルスチェック

バックグラウンドでのヘルスチェックを実装するために、クライアントサイドでの監視を実装できます：

```tsx
// components/NodeHealthMonitor.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkNodeHealth } from '../utils/nodeHealth';

export default function NodeHealthMonitor() {
  const router = useRouter();
  const [isNodeHealthy, setIsNodeHealthy] = useState(true);
  
  useEffect(() => {
    // 現在のノードURLを取得
    const getCurrentNode = () => {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('symbol-node-url='))
        ?.split('=')[1] || '';
    };
    
    // 定期的なヘルスチェック
    const interval = setInterval(async () => {
      const currentNodeUrl = getCurrentNode();
      if (!currentNodeUrl) return;
      
      const isHealthy = await checkNodeHealth(currentNodeUrl);
      setIsNodeHealthy(isHealthy);
      
      // ノードが不健全な場合は自動的に新しいノードを探す
      if (!isHealthy) {
        // ここでフォールバックロジックを実行するか、ユーザーに通知
        console.warn('現在のノードは応答していません。別のノードを選択してください。');
      }
    }, 30000); // 30秒ごとにチェック
    
    return () => clearInterval(interval);
  }, [router]);
  
  if (isNodeHealthy) return null;
  
  return (
    <div className="node-health-warning">
      <p>⚠️ 選択中のノードとの接続に問題があります。別のノードを選択してください。</p>
    </div>
  );
}
```

## 5. 注意点

- GraphQL Playground は開発環境では `/api/graphql` で利用可能です
- 本番環境では不要な場合は `.meshrc.yaml` の `playground: false` に設定してください
- サブスクリプション機能を使用する場合は、WebSocket のセットアップが必要になります
- ノード切り替え機能を実装する場合は、キャッシュの問題に注意してください
- 複数のノードで同じデータを取得する場合でも、ブロックの同期状態が異なる可能性があります

## 6. まとめ

この方法で Symbol GraphQL Server を Next.js アプリケーションに統合することで、以下のメリットが得られます：

1. フロントエンド・バックエンドを一つのアプリケーションとして管理できる
2. API Routes を使用して GraphQL エンドポイントを提供できる
3. サーバーサイドとクライアントサイドの両方でデータを取得できる
4. Next.js の様々な機能（ISR, SSG など）と組み合わせて使用できる
5. ユーザーが必要に応じてノードを切り替えることができ、ブロックチェーンネットワークの分散性を活かせる 