# Example Vite React SPA with Cloudflare Workers

このプロジェクトは、最新のReact SPAアプリケーションをCloudflare Workersでホスティングするための実装例です。

## 技術スタック

### コア技術
- React 19
- TypeScript
- Vite 6
- TanStack Router
- Tailwind CSS 4

### デプロイメント
- Cloudflare Workers
- Wrangler

### 開発ツール
- ESLint 9
- SWC
- pnpm

## プロジェクト構成

```
├── src/                  # ソースコード
│   ├── assets/          # 静的アセット
│   ├── routes/          # TanStack Routerのルート定義
│   ├── main.tsx         # アプリケーションのエントリーポイント
│   └── routeTree.gen.ts # 自動生成されたルートツリー
├── worker/              # Cloudflare Workersのコード
├── public/              # 静的ファイル
└── dist/                # ビルド出力
```

## 開発方法

### 開発サーバーの起動

```bash
pnpm dev
```

### ビルド

```bash
pnpm build
```

### プレビュー

```bash
pnpm preview
```

### Cloudflareへのデプロイ

```bash
pnpm deploy
```

## ESLint設定

このプロジェクトでは最新のESLint 9（フラットコンフィグ）を使用しています。必要に応じて`eslint.config.js`を編集してください。
