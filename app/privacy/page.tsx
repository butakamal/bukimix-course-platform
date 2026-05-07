import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">プライバシーポリシー</h1>
      <div className="space-y-6 text-sm leading-relaxed text-foreground">
        <p>Bukimix（以下「本サービス」）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。</p>

        <h2 className="text-lg font-semibold mt-8">第1条（取得する情報）</h2>
        <p>本サービスは、以下の情報を取得します。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Google アカウント情報（氏名、メールアドレス、プロフィール画像）</li>
          <li>本サービス内の学習進捗データ（視聴済みレッスン情報）</li>
          <li>アクセスログ（IPアドレス、ブラウザ種別、閲覧ページ等）</li>
        </ul>

        <h2 className="text-lg font-semibold mt-8">第2条（利用目的）</h2>
        <p>取得した情報は、以下の目的のために利用します。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>本サービスの提供・運営</li>
          <li>学習進捗の管理・表示</li>
          <li>本サービスの改善・新機能開発</li>
          <li>不正利用の防止</li>
          <li>サービスに関するご連絡</li>
        </ul>

        <h2 className="text-lg font-semibold mt-8">第3条（第三者サービスの利用）</h2>

        <h3 className="font-semibold mt-4">Supabase（認証・データ保存）</h3>
        <p>本サービスはユーザー認証およびデータ管理に Supabase を利用しています。Supabase のプライバシーポリシーについては <a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a> をご参照ください。</p>

        <h3 className="font-semibold mt-4">Google OAuth（ログイン認証）</h3>
        <p>本サービスは Google のOAuth認証を利用してログイン機能を提供しています。Google のプライバシーポリシーについては <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a> をご参照ください。</p>

        <h3 className="font-semibold mt-4">Google Analytics 4（アクセス解析）</h3>
        <p>本サービスはアクセス解析のために Google Analytics 4（GA4）を使用しています。GA4 は Cookie を使用してユーザーのアクセス情報を収集します。収集される情報は匿名化されており、個人を特定するものではありません。GA4 のデータ収集を無効にするには、<a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google アナリティクス オプトアウト アドオン</a>をご利用ください。</p>

        <h3 className="font-semibold mt-4">YouTube（動画配信）</h3>
        <p>レッスン動画は YouTube の埋め込みプレーヤーを使用して提供されます。YouTube のプライバシーポリシーについては <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a> をご参照ください。</p>

        <h2 className="text-lg font-semibold mt-8">第4条（個人情報の第三者提供）</h2>
        <p>本サービスは、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。</p>

        <h2 className="text-lg font-semibold mt-8">第5条（個人情報の開示・訂正・削除）</h2>
        <p>ユーザーは、本サービスが保有する自身の個人情報の開示・訂正・削除を請求することができます。ご希望の場合は、本サービスのお問い合わせ窓口までご連絡ください。</p>

        <h2 className="text-lg font-semibold mt-8">第6条（プライバシーポリシーの変更）</h2>
        <p>本ポリシーの内容は、法令変更やサービスの改善に伴い変更することがあります。変更後のポリシーは本ページに掲載した時点で効力を生じるものとします。</p>

        <p className="mt-10 text-muted-foreground">制定日：2026年5月6日</p>
      </div>
    </main>
  )
}
