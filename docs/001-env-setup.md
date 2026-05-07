# 001 環境構築

## 概要

開発・本番環境の初期セットアップ。Next.jsプロジェクト、外部サービスの接続、CI/CDの基盤を整える。

## 関連

- Phase: 0
- 推定: 0.5日

## TODO

### パッケージ・ツール
- [x] shadcn/ui を初期化する (`npx shadcn@latest init`)
- [x] `@supabase/supabase-js` `@supabase/ssr` をインストールする
- [x] npm か pnpm かをプロジェクト内で統一する

### 外部サービス
- [x] Supabase プロジェクトを作成する
- [ ] Vercel プロジェクトを作成し、GitHubリポジトリと連携する
- [ ] Google Cloud Console で OAuth クライアントを作成する
  - [ ] ローカル用リダイレクトURI を登録する (`http://localhost:3000/auth/callback`)
  - [ ] 本番用リダイレクトURI を登録する

### 環境変数
- [x] `.env.local` を作成し以下を設定する
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [ ] Vercel の環境変数にも同じ値を設定する
- [x] `.env.local` が `.gitignore` に含まれていることを確認する

### Supabase クライアントファイル
- [x] `lib/supabase/client.ts` を作成する（Client Component用）
- [x] `lib/supabase/server.ts` を作成する（Server Component / Server Action用）
- [x] `lib/supabase/proxy.ts` を作成する（セッション更新ロジック）
- [x] ルートの `proxy.ts` を作成する（Next.js プロキシエントリポイント）

### 型定義
- [x] `lib/types.ts` を作成し、DB テーブルの型を定義する
- [x] `next typegen` を実行して PageProps / LayoutProps を生成する

## 注意事項

- `middleware.ts` は Next.js 16 で `proxy.ts` にリネームされた
- `NEXT_PUBLIC_` プレフィックスがない環境変数はクライアントバンドルに含まれない
- Supabase クライアントはリクエストごとに生成する（グローバル変数に入れない）
