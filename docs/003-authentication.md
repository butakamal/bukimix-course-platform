# 003 認証（Google OAuth）

## 概要

Supabase Auth を使った Google ログイン／ログアウトを実装する。未ログイン時に保護ページへアクセスすると `/login` にリダイレクトする。

## 関連

- 機能ID: F-01
- 画面ID: P-06
- Phase: 2
- 推定: 0.5日

## TODO

### Supabase 側の設定
- [ ] Supabase ダッシュボードで Google プロバイダーを有効化する
- [ ] Google Cloud Console の OAuth クライアント ID / シークレットを Supabase に登録する
- [ ] Supabase の Redirect URL を Google Cloud Console に登録する

### ログインページ（`app/login/page.tsx`）
- [x] Google ログインボタンを配置する
- [x] `supabase.auth.signInWithOAuth({ provider: 'google' })` を呼び出す Server Action を実装する
- [x] ゲストがアクセスしても表示できること（認証不要）

### OAuth コールバック（`app/auth/callback/route.ts`）
- [x] `code` クエリパラメータを受け取り `supabase.auth.exchangeCodeForSession(code)` を呼ぶ
- [x] 成功後は元のページ（or `/`）にリダイレクトする
- [x] エラー時は `/login?error=...` にリダイレクトする

### プロキシによるルートガード（`proxy.ts`）
- [x] `getClaims()` でセッションを検証する
- [x] 未認証ユーザーが `/courses/[courseSlug]/lessons/[lessonSlug]` にアクセスした場合 `/login` にリダイレクトする
- [x] `/login` と `/auth` パスはリダイレクト対象から除外する

### ヘッダーのログイン状態表示
- [x] ログイン済み: ユーザーのアバター画像 + 名前 + ログアウトボタン を表示する
- [x] 未ログイン: ログインボタンを表示する
- [x] ログアウトは `supabase.auth.signOut()` を呼ぶ Server Action で実装する

## 注意事項

- サーバーコードでは `getSession()` を使わず必ず `getClaims()` を使う
- `proxy.ts` 内で `createServerClient` と `getClaims()` の間にコードを挟まない
- OAuthコールバックのリダイレクトURIはローカルと本番の両方を Google / Supabase に登録する
