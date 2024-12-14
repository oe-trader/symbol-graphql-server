# Symbol GraphQL Server

このリポジトリはSymbol blockchainのAPIをGraphQLで利用できるようにするためのProjectです。
コミュニティで作成されているOpenAPIのスキーマファイルを元にGraphQLのSchemaやResolverを自動生成します。

## Useage
### 1. 前提条件

#### 1-1. nodeおよびパッケージマネージャー

- node.js v22.12.0 以上
- pnpm v9.12.0以上

#### 1-2. pnpmの有効化
```
# Node.jsインストール済みの場合、以下のコマンドを実行するだけでpnpmが有効化されます。
corepack enable
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

```
pnpm run build
```

### 4. Playgroundの起動

```
pnpm run dev
```

## バージョンについて

### version 1
- OpenAPIのスキーマファイルでREST APIをラップしたもの(現在のバージョン)
- パフォーマンスの懸念があるため、バージョン2の開発を行っています。

### version 2
- REST APIのラップではなく、Symbolのブロックチェーンのデータを直接利用するもの

