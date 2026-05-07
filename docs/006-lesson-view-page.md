# 006 レッスン視聴ページ

## 概要

YouTube 動画を埋め込み表示し、レッスンの説明文（Markdown）を表示する。ログイン必須。

## 関連

- 機能ID: F-04, F-10
- 画面ID: P-04（`/courses/[courseSlug]/lessons/[lessonSlug]`）
- Phase: 4
- 推定: 0.5日

## TODO

### データ取得
- [x] `courseSlug` + `lessonSlug` でレッスンを取得し、存在しない場合は `notFound()` を呼ぶ
- [x] 同コースの全レッスン一覧を取得し、前後のレッスンへのナビゲーションリンクを生成する

### YouTube 埋め込み（`YouTubePlayer` コンポーネント）
- [x] `YouTubePlayer` コンポーネントを作成する（Client Component）
  - `youtube_video_id` を受け取り 16:9 固定の iframe を表示する
  - YouTube IFrame Player API をロードする（`onStateChange` で `ENDED` を検知するため）
  - 動画終了時に「視聴済み」Server Action を呼び出す（チケット007と連携）

### Markdown 表示
- [x] Markdown レンダリングライブラリを選定・インストールする（例: `react-markdown`）
- [x] `description` フィールドを Markdown としてレンダリングする

### ページレイアウト
- [x] `app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx` を実装する
  - 上部: `YouTubePlayer`
  - 中部: 視聴済みボタン（チケット007）
  - 下部: レッスン説明文（Markdown）
  - サイドバー: コースのレッスン一覧（現在のレッスンをハイライト）

### ルートガード
- [x] `proxy.ts` でレッスンページへの未ログインアクセスを `/login` にリダイレクトする（チケット003と連携）

### SEO
- [x] `generateMetadata` でレッスンタイトルをページタイトルに含める
- [x] `generateStaticParams` でレッスン slug を列挙し静的生成する

### エラー
- [x] `app/courses/[courseSlug]/lessons/[lessonSlug]/not-found.tsx` を作成する
