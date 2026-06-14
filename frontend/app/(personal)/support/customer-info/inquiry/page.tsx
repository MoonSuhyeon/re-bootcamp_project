'use client'

import Link from 'next/link'

const SUPPORT_TABS = [
  { label: '고객상담',         href: '#' },
  { label: '고객정보관리',     href: '#', active: true },
  { label: '사고신고',         href: '#' },
  { label: '소비자보호',       href: '#' },
  { label: '금융서비스',       href: '#' },
  { label: '서식/약관/설명서', href: '#' },
  { label: '상품공시실',       href: '#' },
]

const LEFT_MENU = [
  {
    label: '고객정보조회/수정', href: '#', open: true,
    sub: [
      { label: '고객정보조회(개인정보열람)', href: '/support/customer-info/inquiry', active: true },
      { label: '고객정보수정',               href: '/support/customer-info/edit',    active: false },
    ],
  },
  { label: 'ID조회/사용자암호 설정',          href: '#', sub: null },
  { label: '온라인고객관리',                  href: '#', sub: null },
  { label: '본인정보 이용·제공 조회',         href: '#', sub: null },
  { label: '해외 납세의무자\n본인확인서 등록', href: '#', sub: null },
  { label: '고객확인제도(CDD/EDD)',           href: '#', sub: null },
  { label: '그룹 내 고객정보 제공 안내',      href: '#', sub: null },
]

const INFO = {
  mobile:       '010-1234-5678',
  email:        'hong@axful.com',
  homeAddr:     '서울특별시 강남구 테헤란로 123',
  homeTel:      '',
  workAddr:     '',
  workName:     '',
  dept:         '',
  workTel:      '',
  sms:          '수신',
  emailReceive: '수신',
  post:         '자택 수신',
  tel:          ['자택', '직장', '휴대폰'],
}

export default function CustomerInfoInquiryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 고객센터 탭 */}
      <div className="bg-[#5D3D2B]">
        <div className="max-w-kb-container mx-auto px-6">
          <div className="flex">
            {SUPPORT_TABS.map(tab => (
              <Link key={tab.label} href={tab.href}
                className={`px-6 py-3 text-[14px] font-medium transition-colors ${
                  tab.active ? 'bg-[#5BC9A8] text-kb-text font-bold' : 'text-white hover:bg-white/10'
                }`}>
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-kb-container mx-auto px-6 py-6">
        {/* 브레드크럼 */}
        <div className="flex justify-end mb-3 text-[12px] text-kb-text-muted gap-1">
          <span>고객센터</span><span>›</span>
          <span>고객정보관리</span><span>›</span>
          <span>고객정보조회/수정</span><span>›</span>
          <span className="text-kb-blue">고객정보조회(개인정보열람)</span>
        </div>

        <div className="flex gap-6">
          {/* 사이드바 */}
          <aside className="w-[200px] flex-shrink-0">
            <div className="border border-kb-border">
              <div className="bg-[#5D3D2B] px-4 py-3">
                <span className="text-white font-bold text-[14px]">고객정보관리</span>
              </div>
              {LEFT_MENU.map(item => (
                <div key={item.label}>
                  <Link href={item.href}
                    className="flex items-center justify-between px-4 py-3 text-[13px] border-t border-kb-border hover:bg-kb-beige-light text-kb-text-body whitespace-pre-line">
                    {item.label}
                    {item.sub && <span className="text-[10px] text-kb-text-muted">{item.open ? '▼' : '▶'}</span>}
                  </Link>
                  {item.open && item.sub?.map(sub => (
                    <Link key={sub.label} href={sub.href}
                      className={`block pl-6 pr-4 py-2.5 text-[12px] border-t border-kb-border transition-colors ${
                        sub.active
                          ? 'bg-[#5BC9A8] text-kb-text font-bold'
                          : 'hover:bg-kb-beige-light text-kb-text-muted'
                      }`}>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Link href="/cert"
                className="flex items-center justify-between border border-kb-border px-4 py-3 text-[13px] text-kb-text-body hover:bg-kb-beige-light">
                인증센터 <span className="text-[#5BC9A8] font-bold text-[16px]">›</span>
              </Link>
            </div>
          </aside>

          {/* 본문 */}
          <main className="flex-1 min-w-0">
            <h1 className="text-[22px] font-bold text-kb-text mb-6">고객정보조회(개인정보열람)</h1>

            {/* 기본정보 */}
            <h2 className="text-[15px] font-bold text-kb-text mb-3 pb-1 border-b-2 border-kb-text">기본정보</h2>
            <table className="w-full text-[13px] border-collapse mb-6">
              <tbody>
                <Row label="휴대폰번호" value={INFO.mobile} />
                <Row label="이메일주소"  value={INFO.email} />
              </tbody>
            </table>

            {/* 자택정보 */}
            <h2 className="text-[15px] font-bold text-kb-text mb-3 pb-1 border-b-2 border-kb-text">자택정보</h2>
            <table className="w-full text-[13px] border-collapse mb-6">
              <tbody>
                <Row label="자택주소"    value={INFO.homeAddr} />
                <Row label="자택전화번호" value={INFO.homeTel} />
              </tbody>
            </table>

            {/* 직장정보 */}
            <h2 className="text-[15px] font-bold text-kb-text mb-3 pb-1 border-b-2 border-kb-text">직장정보</h2>
            <table className="w-full text-[13px] border-collapse mb-6">
              <tbody>
                <Row label="직장주소"    value={INFO.workAddr} />
                <tr className="border-b border-kb-border">
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36 whitespace-nowrap">직장명</td>
                  <td className="border border-kb-border px-4 py-3 text-kb-text-body">
                    <div className="flex gap-8">
                      <span>{INFO.workName}</span>
                      <span className="text-kb-text-muted text-[12px]">부서명&nbsp;&nbsp;<span className="text-kb-text">{INFO.dept}</span></span>
                    </div>
                  </td>
                </tr>
                <Row label="직장전화번호" value={INFO.workTel} />
              </tbody>
            </table>

            {/* 고객관리 안내수단 */}
            <h2 className="text-[15px] font-bold text-kb-text mb-3 pb-1 border-b-2 border-kb-text">고객관리 안내수단</h2>
            <table className="w-full text-[13px] border-collapse mb-8">
              <tbody>
                <tr className="border-b border-kb-border">
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36">SMS 수신여부</td>
                  <td className="border border-kb-border px-4 py-3 text-kb-text-body">
                    <div className="flex items-center">
                      <span className="flex-1">{INFO.sms}</span>
                      <span className="bg-kb-beige-light border-l border-kb-border px-4 font-semibold text-kb-text w-36">이메일 수신여부</span>
                      <span className="px-4">{INFO.emailReceive}</span>
                    </div>
                  </td>
                </tr>
                <Row label="우편물 수령처" value={INFO.post} />
                <tr className="border-b border-kb-border last:border-b-0">
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text">전화 수신여부</td>
                  <td className="border border-kb-border px-4 py-3 text-kb-text-body">
                    <div className="flex items-center gap-4">
                      {['자택', '직장', '휴대폰'].map(v => (
                        <label key={v} className="flex items-center gap-1.5 text-[12px] cursor-default">
                          <input type="checkbox" readOnly checked={INFO.tel.includes(v)} className="w-3.5 h-3.5 accent-[#5BC9A8]" />
                          {v}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-center gap-3">
              <Link href="/personal"
                className="bg-[#5BC9A8] px-12 py-3 text-[14px] font-bold text-kb-text hover:opacity-90">
                확인
              </Link>
              <Link href="/support/customer-info/edit"
                className="border border-kb-border px-12 py-3 text-[14px] text-kb-text-body hover:bg-kb-beige-light">
                수정
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-kb-border last:border-b-0">
      <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36 whitespace-nowrap">{label}</td>
      <td className="border border-kb-border px-4 py-3 text-kb-text-body">{value}</td>
    </tr>
  )
}
