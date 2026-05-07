# 004 講座一覧ページ

## 概要

公開済み講座をカード形式で一覧表示する。ゲストでもアクセス可能。

## 関連

- 機能ID: F-02
- 画面ID: P-02（`/courses`）
- Phase: 3
- 推定: 0.5日

## TODO

### データ取得
- [x] `courses` テーブルから `is_published = true` の講座を `sort_order` 昇順で取得する Server Component を実装する
- [x] 各講座のレッスン数（`lessons` テーブルの件数）も合わせて取得する

### UI コンポーネント
- [x] `CourseCard` コンポーネントを作成する
  - サムネイル画像（`next/image`）
  - タイトル
  - 短い説明文（概要の冒頭 100文字程度）
  - レッスン数
  - 講座詳細ページへの `<Link>`
- [x] 講座一覧ページ（`app/courses/page.tsx`）を実装する
  - カードグリッドレイアウト（PC: 3列、スマホ: 1列）
  - 講座が0件の場合の空状態表示

### キャッシュ
- [x] 講座一覧は `'use cache'` + `cacheLife('hours')` + `cacheTag('courses')` でキャッシュする

### SEO
- [x] `generateMetadata` でページタイトル・ディスクリプションを設定する

### ローディング
- [x] `app/courses/loading.tsx` を作成しスケルトン UI を表示する

## 注意事項

- `images.remotePatterns` に Supabase Storage のホスト名を登録してからサムネを表示する
- `images.domains` は非推奨なので使わない
