'use client'

import LoanSidebar from '@/components/inquiry/LoanSidebar'

type PageMeta = { title: string; breadcrumb: string; content: React.ReactNode }

function ConsentForm({ title, fields }: { title: string; fields: string[] }) {
  return (
    <div className="max-w-lg">
      <div className="bg-[#F5F5F5] border border-kb-border p-4 mb-5 text-[13px] text-kb-text-body">
        <p className="font-bold mb-1">{title} 동의</p>
        <p>금융거래 목적으로 개인(신용)정보를 제3자에게 제공하는 것에 동의합니다.</p>
      </div>
      <div className="border border-kb-border p-5 space-y-4">
        {fields.map(field => (
          <div key={field} className="flex items-center gap-4">
            <label className="w-28 text-[13px] font-medium text-kb-text flex-shrink-0">{field}</label>
            <input type="text" placeholder="입력하세요" className="flex-1 border border-kb-border px-3 py-2 text-[13px] focus:outline-none focus:border-kb-text" />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-5">
        <button className="px-12 py-2.5 text-[14px] font-bold text-white" style={{ backgroundColor: '#3D3D3D' }}>동의 제출</button>
      </div>
    </div>
  )
}

function ESignForm() {
  const STEPS = [
    '부동산 담보대출 신청내역 확인 후 대상신청내역의 자세히보기 클릭',
    '전자서명 정보의 본인이름 확인 후 전자서명하기 버튼 클릭, 전자서명 화면으로 이동',
    '설정계약서와 위임장 이미지를 확인하고 「확인하였습니다」 체크 후 전자서명하기 클릭',
    '전자등기 전자서명 완료',
  ]

  return (
    <div>
      {/* 전자서명 */}
      <h2 className="text-[15px] font-bold text-kb-text mb-2">전자서명</h2>
      <div className="bg-[#F5F5F5] border border-kb-border px-5 py-4 mb-6">
        <p className="text-[13px] text-kb-text-body leading-relaxed">
          · 고객님께서 AX풀뱅크 영업점에서 작성하신 '설정계약서' 등을 대법원 인터넷등기소에 접수하기 위해 인증서로 본인임을 확인하는 절차입니다.
        </p>
      </div>

      {/* 전자서명시 유의사항 */}
      <h2 className="text-[15px] font-bold text-kb-text mb-2">전자서명시 유의사항</h2>
      <div className="bg-[#F5F5F5] border border-kb-border px-5 py-4 mb-6 space-y-1.5">
        <p className="text-[13px] text-kb-text-body leading-relaxed">· 부동산 소유자(담보제공자)가 여러명인 경우 소유자(담보제공자) 모두 전자서명을 하셔야 합니다.</p>
        <p className="text-[13px] text-kb-text-body leading-relaxed">· 전자서명이 완료되지 않을 경우 등기 설정이 불가하여 대출 실행이 제한될 수 있습니다.</p>
      </div>

      {/* 전자서명 절차 */}
      <h2 className="text-[15px] font-bold text-kb-text mb-4">전자서명 절차</h2>
      <div className="space-y-2 mb-8">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-center gap-4 border border-kb-border px-5 py-4">
            <span className="w-8 h-8 rounded-full bg-[#1A56DB] text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-[13px] text-kb-text-body">{step}</p>
          </div>
        ))}
      </div>

      {/* 부동산 담보대출 신청내역 */}
      <h2 className="text-[15px] font-bold text-kb-text mb-3">부동산 담보대출 신청내역</h2>
      <table className="w-full text-[13px] border-t-2 border-kb-text border-collapse">
        <thead>
          <tr className="bg-[#F5F5F5]">
            {['선택', '신청상품', '신청일자', '신청금액(원)', '처리부점', '처리상태', '담보물건주소'].map(h => (
              <th key={h} className="px-3 py-3 text-center font-medium border-b border-kb-border whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7} className="px-4 py-8 text-center text-[13px] text-kb-text-muted border-b border-kb-border">
              조회하실 내역이 없습니다.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function DocsUpload() {
  const docs = [
    { name: '재직증명서', required: true,  status: '미제출' },
    { name: '소득확인서류', required: true,  status: '미제출' },
    { name: '건강보험료 납부확인서', required: false, status: '미제출' },
  ]
  return (
    <div>
      <p className="text-[13px] text-kb-text-muted mb-4">대출 실행 후 요구된 사후 서류를 제출합니다.</p>
      <table className="w-full text-[13px] border-t border-kb-text mb-5">
        <thead>
          <tr className="bg-[#F5F5F5]">
            <th className="px-4 py-3 text-left font-medium border-b border-kb-border">서류명</th>
            <th className="px-4 py-3 text-center font-medium border-b border-kb-border">필수여부</th>
            <th className="px-4 py-3 text-center font-medium border-b border-kb-border">제출상태</th>
            <th className="px-4 py-3 text-center font-medium border-b border-kb-border">업로드</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-kb-border">
          {docs.map(d => (
            <tr key={d.name} className="hover:bg-kb-beige-light">
              <td className="px-4 py-3">{d.name}</td>
              <td className="px-4 py-3 text-center">
                <span className={`text-[11px] font-bold px-2 py-0.5 ${d.required ? 'bg-red-500 text-white' : 'bg-kb-border text-kb-text-muted'}`}>{d.required ? '필수' : '선택'}</span>
              </td>
              <td className="px-4 py-3 text-center text-kb-text-muted">{d.status}</td>
              <td className="px-4 py-3 text-center">
                <input type="file" className="text-[11px]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center">
        <button className="px-12 py-2.5 text-[14px] font-bold text-white" style={{ backgroundColor: '#3D3D3D' }}>제출</button>
      </div>
    </div>
  )
}


const PAGE_MAP: Record<string, PageMeta> = {
  docs: {
    title: '사후서류제출', breadcrumb: '사후서류제출',
    content: <DocsUpload />,
  },
  sign: {
    title: '부동산담보대출 전자서명', breadcrumb: '부동산담보대출 전자서명',
    content: <ESignForm />,
  },
}

export default function StatusSlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const meta = PAGE_MAP[slug]

  if (!meta) {
    return (
      <main className="pb-16">
        <div className="max-w-kb-container mx-auto px-6 pt-6">
          <div className="flex gap-8">
            <LoanSidebar />
            <div className="flex-1 flex items-center justify-center py-20">
              <p className="text-[15px] text-kb-text-muted">페이지를 찾을 수 없습니다.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pb-16">
      <div className="max-w-kb-container mx-auto px-6 pt-6">
        <div className="flex gap-8">
          <LoanSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="text-[26px] font-bold text-kb-text mb-6">{meta.title}</h1>
            <div className="border-t border-kb-text pt-6">
              {meta.content}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
