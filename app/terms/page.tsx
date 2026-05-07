import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '利用規約',
}

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">利用規約</h1>
      <div className="prose prose-sm max-w-none dark:prose-invert space-y-6 text-sm leading-relaxed text-foreground">
        <p>この利用規約（以下「本規約」）は、Bukimix（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆さまには、本規約に同意いただいたうえでご利用いただきます。</p>

        <h2 className="text-lg font-semibold mt-8">第1条（適用）</h2>
        <p>本規約は、本サービスの利用に関する一切の関係に適用されます。</p>

        <h2 className="text-lg font-semibold mt-8">第2条（利用登録）</h2>
        <p>本サービスは Google アカウントによる認証を使用します。登録申請者が本規約に同意した時点で、利用登録が完了するものとします。</p>

        <h2 className="text-lg font-semibold mt-8">第3条（禁止事項）</h2>
        <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>法令または公序良俗に違反する行為</li>
          <li>犯罪行為に関連する行為</li>
          <li>本サービスのサーバーまたはネットワークの機能を破壊・妨害する行為</li>
          <li>本サービスの運営を妨害するおそれのある行為</li>
          <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
          <li>不正アクセスをし、またはこれを試みる行為</li>
          <li>他のユーザーに成りすます行為</li>
          <li>反社会的勢力等への利益供与</li>
          <li>その他、運営者が不適切と判断する行為</li>
        </ul>

        <h2 className="text-lg font-semibold mt-8">第4条（本サービスの提供の停止等）</h2>
        <p>運営者は、以下のいずれかの事由があると判断した場合、ユーザーへの事前通知なく本サービスの全部または一部の提供を停止または中断することができます。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
          <li>地震・落雷・火災・停電等の不可抗力により、本サービスの提供が困難となった場合</li>
          <li>コンピュータまたは通信回線等が事故により停止した場合</li>
        </ul>

        <h2 className="text-lg font-semibold mt-8">第5条（免責事項）</h2>
        <p>運営者は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。</p>

        <h2 className="text-lg font-semibold mt-8">第6条（利用規約の変更）</h2>
        <p>運営者は、必要と判断した場合には、ユーザーへの通知なく本規約を変更することができます。変更後の規約は本ページに掲載した時点で効力を生じるものとします。</p>

        <h2 className="text-lg font-semibold mt-8">第7条（準拠法・裁判管轄）</h2>
        <p>本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄とします。</p>

        <p className="mt-10 text-muted-foreground">制定日：2026年5月6日</p>
      </div>
    </main>
  )
}
