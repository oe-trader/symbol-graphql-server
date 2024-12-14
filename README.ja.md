[English READMEはこちら](README.md)

# Symbol GraphQL Server

このリポジトリは、Symbol BlockchainのAPIをGraphQLで利用するためのプロジェクトです。
コミュニティが作成したOpenAPIスキーマファイルを元に、GraphQLのスキーマおよびリゾルバを自動生成します。

## 使い方
### 1. 前提条件

#### 1-1. nodeおよびパッケージマネージャー

- node.js v22.12.0 以上
- pnpm v9.12.0以上

#### 1-2. pnpmの有効化

Node.jsインストール済みの場合、以下のコマンドを実行するだけでpnpmが有効化されます。

```
corepack enable
```

#### 1-3. パッケージのインストール

```
pnpm install
```

### 2. スキーマファイルのダウンロード

1. 以下のページにアクセスし、有効なyamlファイルのバージョンを確認します。
```
https://github.com/symbol-blockchain-community/symbol-rest-client/tree/main/schema
```

2. 以下のコマンドを実行し、スキーマファイルをダウンロードします。
```
curl -o schema/1_0_5.yml https://github.com/symbol-blockchain-community/symbol-rest-client/blob/main/schema/1_0_5.yml
```

### 3. スキーマファイルのビルド

#### 3-1. 設定ファイルの作成
`.meshrc.example.yaml`をコピーして`.meshrc.yaml`にリネームし、`endpoint`の値を利用するSymbolノードのURLに変更してください。

#### 3-2. ビルド
```
pnpm run build
```

### 4. Playgroundの起動

```
pnpm run dev
```

### 6. Swagger UIの起動（オプション）

```
pnpm run swagger
```

## Examples
### 基本的なクエリ
The following example demonstrates some basic queries you can perform with the GraphQL server:

```
query SymbolGQLExample {
  # 接続中ノードの状態
  getNodeHealth {
    status {
      apiNode
      db
    }
  }
  # 指定のブロック高の情報を取得
  getBlockByHeight(height: "65535") {
    ... on BlockInfo {
      id
      block {
        beneficiaryAddress
        difficulty
      }
    }
  }
  # 指定された承認済みトランザクションの取得
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

サーバーを起動した後、GraphQL プレイグラウンドでこれらのクエリを試すことができます。

## バージョンについて

### version 1
- ブランチ名: `main` および `dev-v1`
- REST APIをGraphQLでラップした現行バージョンです。
- パフォーマンス上の懸念があるため、次期バージョンであるversion 2を開発中です。

### version 2
- ブランチ名: `dev-v2`
- REST APIによるラップではなく、Symbolブロックチェーンのデータを直接利用する予定のバージョンです。

## コントリビューション

このプロジェクトはMITライセンスで公開されており、どなたでも自由に利用・改変・再配布が可能です。
バグ報告や機能改善の提案、プルリクエストなど、あらゆる形での貢献を歓迎しています。

## ライセンス

MIT License