# 002 データベース設計・構築

## 概要

Supabase（PostgreSQL）にテーブルを作成し、RLS ポリシーとトリガーを設定する。

## 関連

- Phase: 1
- 推定: 0.5日

## TODO

### テーブル作成
- [x] `courses` テーブルを作成する
  - `id` uuid PK
  - `slug` text NOT NULL UNIQUE
  - `title` text NOT NULL
  - `description` text
  - `thumbnail_url` text
  - `sort_order` int NOT NULL DEFAULT 0
  - `is_published` boolean NOT NULL DEFAULT false
  - `created_at` / `updated_at` timestamptz
- [x] `lessons` テーブルを作成する
  - `id` uuid PK
  - `course_id` uuid FK → courses.id
  - `slug` text NOT NULL
  - `title` text NOT NULL
  - `description` text（Markdown）
  - `youtube_video_id` text NOT NULL
  - `duration_seconds` int
  - `sort_order` int NOT NULL DEFAULT 0
  - `is_published` boolean NOT NULL DEFAULT false
  - `created_at` / `updated_at` timestamptz
  - UNIQUE 制約: `(course_id, slug)`
- [x] `profiles` テーブルを作成する
  - `id` uuid PK FK → auth.users.id
  - `display_name` text
  - `avatar_url` text
  - `created_at` timestamptz
- [x] `progress` テーブルを作成する
  - `user_id` uuid FK → auth.users.id（複合PK）
  - `lesson_id` uuid FK → lessons.id（複合PK）
  - `completed_at` timestamptz NOT NULL DEFAULT now()

### RLS ポリシー
- [x] `courses`: `is_published = true` の行のみ全ユーザーが SELECT 可
- [x] `lessons`: `is_published = true` かつ親コースが公開済みの行のみ SELECT 可
- [x] `profiles`: `id = auth.uid()` のみ SELECT / UPDATE 可
- [x] `progress`: `user_id = auth.uid()` のみ SELECT / INSERT / DELETE 可

### トリガー
- [x] `auth.users` へのサインアップ時に `profiles` レコードを自動生成するトリガーを作成する
  - `display_name`: Google から取得した `raw_user_meta_data->>'full_name'`
  - `avatar_url`: `raw_user_meta_data->>'avatar_url'`

### テストデータ投入
- [x] 講座を1件作成する（`is_published = true`）
- [x] 該当講座にレッスンを3件作成する（`is_published = true`）

## 注意事項

- 管理者（bukimix）は Supabase Studio の service_role キーで直接編集するため RLS の影響を受けない
- マイグレーションファイルは `supabase/migrations/` に保存しておくと再現性が上がる
