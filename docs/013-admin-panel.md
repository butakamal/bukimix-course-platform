# 013 管理画面

## 概要

コース・レッスンの CRUD 管理を行う管理者専用の画面。YouTube 動画 ID の登録・編集が主目的。

## 関連

- 機能ID: F-13
- 画面ID: P-13（`/admin`）
- Phase: 5
- 推定: 1日

## TODO

### 認証・権限
- [x] `ADMIN_EMAIL` 環境変数でメールアドレスを指定し、一致するユーザーのみ管理画面にアクセスできる
- [x] `lib/supabase/proxy.ts` に `/admin` をログイン必須ルートとして追加する
- [x] `app/admin/layout.tsx` でメール照合チェックをし、非管理者は `/` にリダイレクトする

### コース管理
- [x] `/admin/courses` — コース一覧（タイトル・スラッグ・公開状態・レッスン数）
- [x] `/admin/courses/new` — コース新規作成フォーム
- [x] `/admin/courses/[courseId]` — コース編集フォーム ＋ 当コースのレッスン一覧
- [x] 削除（関連レッスンは DB cascade で削除）
- [x] 公開/非公開チェックボックス

### レッスン管理
- [x] `/admin/courses/[courseId]/lessons/new` — レッスン新規作成（YouTube 動画 ID 入力）
- [x] `/admin/courses/[courseId]/lessons/[lessonId]` — レッスン編集
- [x] 削除

### Server Actions（`lib/actions/admin.ts`）
- [x] `createCourse` — バリデーション・slug 形式チェック・DB 挿入
- [x] `updateCourse` — 更新
- [x] `deleteCourse` — 削除
- [x] `createLesson` — バリデーション・YouTube 動画 ID 必須チェック・DB 挿入
- [x] `updateLesson` — 更新
- [x] `deleteLesson` — 削除
- [x] 各アクションで `updateTag('courses')` してキャッシュを即時無効化

### UI
- [x] `app/admin/layout.tsx` — サイドバーナビ（コース管理・公開サイトへのリンク）
- [x] フォームバリデーションエラーを `useActionState` で表示
- [x] 保存成功時に成功メッセージを表示

### 環境変数（`.env.local`）
```
ADMIN_EMAIL=your-email@example.com
```
