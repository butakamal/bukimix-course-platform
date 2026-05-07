# 005 講座詳細ページ

## 概要

講座の概要とレッスン一覧を表示する。ログインユーザーには進捗率も表示する。ゲストでもアクセス可能。

## 関連

- 機能ID: F-03, F-06
- 画面ID: P-03（`/courses/[courseSlug]`）
- Phase: 3
- 推定: 0.5日

## TODO

### データ取得
- [x] `courseSlug` で `courses` を取得し、存在しない場合は `notFound()` を呼ぶ
- [x] 該当コースの公開済みレッスン一覧を `sort_order` 昇順で取得する
- [x] ログインユーザーの場合、`progress` テーブルから視聴済みレッスンIDを取得する

### UI コンポーネント
- [x] `LessonList` コンポーネントを作成する
  - レッスン番号・タイトル・尺（`duration_seconds`）
  - 視聴済みアイコン（ログインユーザーのみ）
  - 各レッスンへの `<Link>`（未ログインはクリックで `/login` へ）
- [x] `ProgressBar` コンポーネントを作成する（0〜100% バー＋「X/Y本 (Z%)」テキスト）
- [x] 講座詳細ページ（`app/courses/[courseSlug]/page.tsx`）を実装する
  - 左カラム: レッスン一覧
  - 右カラム: 講座概要・進捗バー（ログイン済み時）

### キャッシュ
- [x] 講座・レッスンデータは `'use cache'` + `cacheLife('hours')` + `cacheTag('courses')` でキャッシュする
- [x] 進捗データはユーザー固有のためキャッシュしない（`<Suspense>` でストリーミング）

### SEO
- [x] `generateMetadata` でコースタイトルをページタイトルに含める
- [x] `generateStaticParams` で公開済みコースの slug を列挙し静的生成する

### エラー
- [x] `app/courses/[courseSlug]/not-found.tsx` を作成する
