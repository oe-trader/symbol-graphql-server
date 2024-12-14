# Symbol GraphQL Server

このリポジトリはSymbol blockchainのAPIをGraphQLで利用できるようにするためのプロジェクトです。
コミュニティで作成されているOpenAPIのスキーマファイルを元にGraphQLのSchemaやResolverを自動生成します。

## 使い方
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

#### 3-1. 設定ファイルの作成
`.meshrc.example.yaml`を`.meshrc.yaml`にリネームし、`endpoint`の値を利用するSymbolノードのURLに変更してください。

#### 3-2. ビルド
```
pnpm run build
```

### 4. Playgroundの起動

```
pnpm run dev
```

### 6. Swagger UIの起動（オプション）

OpenAPIの仕様を確認する場合は、以下のコマンドでSwagger UIを起動できます。
```
pnpm run swagger
```

## バージョンについて

### version 1
- OpenAPIのスキーマファイルでREST APIをラップしたもの(現在のバージョン)
- パフォーマンスの懸念があるため、バージョン2の開発を行っています。

### version 2
- REST APIのラップではなく、Symbolのブロックチェーンのデータを直接利用するもの

## コントリビューション

このプロジェクトはMITライセンスで公開されており、どなたでも自由に利用・改変・再配布が可能です。
バグ報告や機能改善の提案、プルリクエストなど、あらゆる形での貢献を歓迎しています。

## ライセンス

MIT License