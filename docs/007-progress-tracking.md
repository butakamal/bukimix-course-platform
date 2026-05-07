# 007 視聴進捗機能

## 概要

「視聴済み」ボタンと動画終了時の自動チェックを実装する。進捗データは `progress` テーブルで管理する。

## 関連

- 機能ID: F-05, F-06, F-09
- Phase: 4
- 推定: 0.5日

## TODO

### Server Action
- [x] `markAsCompleted(lessonId: string)` Server Action を実装する
  - `getClaims()` でユーザー認証を確認する
  - `progress` テーブルに `(user_id, lesson_id)` を INSERT する（重複は無視）
  - 完了後 `revalidatePath` または `updateTag` でキャッシュを更新する
- [x] `markAsIncomplete(lessonId: string)` Server Action を実装する
  - `progress` テーブルから該当レコードを DELETE する
  - 完了後キャッシュを更新する

### 視聴済みボタン（`MarkAsCompletedButton` コンポーネント）
- [x] `MarkAsCompletedButton` コンポーネントを作成する（Client Component）
  - 初期状態（`isCompleted` prop）を受け取る
  - クリックで `markAsCompleted` / `markAsIncomplete` を呼び出す
  - `useActionState` または `useTransition` でローディング状態を表示する
  - トグルのたびに視覚的フィードバック（チェックマーク・色変化）を与える

### 動画終了時の自動チェック（F-09）
- [x] `YouTubePlayer` コンポーネントで IFrame Player API の `onStateChange` を購読する
- [x] `PlayerState.ENDED`（値: `0`）を検知したら `markAsCompleted` を呼び出す
- [x] すでに視聴済みの場合は重複呼び出しをしない

### 進捗率の表示（F-06）
- [x] 講座詳細ページの `ProgressBar` に視聴済み件数・全件数・進捗率を渡す（チケット005と連携）
- [x] マイページの講座カードにも進捗率を表示する（チケット008と連携）

## 注意事項

- `progress` テーブルは `user_id = auth.uid()` のみ操作可（RLS）
- Server Action 内では必ず `getClaims()` で認証チェックをする
- `markAsCompleted` は upsert ではなく INSERT ON CONFLICT DO NOTHING で冪等にする
