'use client'

import { useState } from 'react'
import Link from 'next/link'
import InquirySidebar from '@/components/inquiry/InquirySidebar'

type Tab = '전체' | '은행' | '증권' | '카드' | '선불'

const REGISTERED_ACCOUNTS = [
  {
    id: 'g1',
    bank: '광주',
    bankColor: '#00447C',
    accountNumber: '074107652623',
    productName: '보통예금',
    type: '입출금',
    balance: 30341,
  },
]

const ACCOUNT_MGT_ITEMS = [
  { label: '잔액 모으기', href: '#' },
  { label: '계좌발명관리', href: '#' },
  { label: '다른금융 등록 해제', href: '/inquiry/other-finance/deregister' },
  { label: '통지이메일 관리', href: '#' },
  { label: '계좌숨기기', href: '#' },
  { label: '오픈뱅킹 장기미사용 이체제한 조회/해제', href: '#' },
]

const EMPTY_SECTIONS = [
  { dotColor: 'bg-yellow-400', title: '예금·적금', sub: '예금·적금계좌' },
  { dotColor: 'bg-green-500', title: '펀드', sub: '펀드계좌' },
  { dotColor: 'bg-purple-500', title: '신탁/ISA', sub: '신탁/ISA계좌' },
  { dotColor: 'bg-pink-500', title: '대출', sub: '대출계좌' },
  { dotColor: 'bg-sky-500', title: '외화/골드', sub: '외화/골드계좌' },
]

function formatDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export default function OtherFinancePage() {
  const [activeTab, setActiveTab] = useState<Tab>('전체')
  const [balanceVisible, setBalanceVisible] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['입출금']))
  const [openMgt, setOpenMgt] = useState<string | null>(null)

  function toggleSection(name: string) {
    setExpandedSections(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const now = formatDate(new Date())

  return (
    <div className="min-h-screen bg-white" onClick={() => setOpenMgt(null)}>
      <div className="max-w-[1024px] mx-auto px-4 py-6 flex gap-6">
        <InquirySidebar />

        <main className="flex-1 pl-8 pt-4 pb-12">
          {/* 브레드크럼 */}
          <div className="flex justify-end mb-2 text-[12px] text-kb-text-muted gap-1 items-center">
            <span>개인뱅킹</span><span>&gt;</span>
            <span>조회</span><span>&gt;</span>
            <span>계좌조회</span><span>&gt;</span>
            <span className="text-kb-blue">다른금융 조회</span>
            <span>&gt;</span>
            <span className="text-kb-blue cursor-pointer">?도움말</span>
          </div>

          {/* 타이틀 */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[22px] font-bold text-kb-text">다른금융 조회</h1>
            <Link href="#" className="text-[13px] text-kb-blue hover:underline">
              KB금융그룹 통합조회 &gt;
            </Link>
          </div>

          {/* 탭 */}
          <div className="flex border-b border-kb-border mb-3">
            {(['전체', '은행', '증권', '카드', '선불'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${
                  activeTab === tab
                    ? 'border-kb-yellow text-kb-text'
                    : 'border-transparent text-kb-text-muted hover:text-kb-text'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 조회기준일시 */}
          <p className="text-[12px] text-kb-text-muted mb-3">조회기준일시 : {now}</p>

          {/* 인사말 + 잔액보기 토글 */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[16px] font-bold text-kb-text">홍길동 고객님,</p>
              <p className="text-[14px] text-kb-text-body">소소한 행복이 가득한</p>
              <p className="text-[14px] text-kb-text-body">즐거운 저녁 시간 보내세요.</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-kb-text-muted">잔액보기</span>
                <button
                  onClick={() => setBalanceVisible(v => !v)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                    balanceVisible ? 'bg-kb-yellow justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow" />
                </button>
                <span className={`text-[12px] font-bold ${balanceVisible ? 'text-kb-text' : 'text-kb-text-muted'}`}>
                  {balanceVisible ? 'ON' : 'OFF'}
                </span>
              </div>
              {!balanceVisible && (
                <p className="text-[12px] text-kb-text-muted text-right">
                  총 잔액을 보시려면,{' '}
                  <button
                    className="text-kb-blue font-semibold"
                    onClick={() => setBalanceVisible(true)}
                  >
                    &apos;잔액보기를 [ON]&apos;
                  </button>
                  으로 변경해 주세요.
                </p>
              )}
            </div>
          </div>

          {/* 배너 */}
          <div className="bg-blue-50 border border-blue-100 px-5 py-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-[12px] text-kb-text-muted mb-0.5">증권, 저축은행 계좌까지!</p>
              <p className="text-[15px] font-bold text-kb-text">나의 모든 자산을 한 눈에 보여드려요!</p>
            </div>
            <div className="w-14 h-14 flex-shrink-0">
              <svg viewBox="0 0 56 56" fill="none" className="w-full h-full">
                <circle cx="28" cy="28" r="24" fill="#E8EFF8" />
                <path d="M28 8 A20 20 0 0 1 48 28" stroke="#4A90D9" strokeWidth="7" fill="none" />
                <path d="M48 28 A20 20 0 0 1 28 48" stroke="#F5A623" strokeWidth="7" fill="none" />
                <path d="M28 48 A20 20 0 0 1 8 28" stroke="#7ED321" strokeWidth="7" fill="none" />
                <path d="M8 28 A20 20 0 0 1 28 8" stroke="#D0021B" strokeWidth="7" fill="none" />
                <circle cx="28" cy="28" r="9" fill="white" />
              </svg>
            </div>
          </div>

          {/* 보기 방식 */}
          <div className="flex justify-end gap-2 mb-4">
            <button className="flex items-center gap-1 border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">
              ⊞ 카드형 보기
            </button>
            <button className="flex items-center gap-1 border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">
              🏛 기관별 보기
            </button>
          </div>

          {/* 입출금 섹션 */}
          <div className="mb-4">
            <button
              className="w-full flex items-center justify-between py-2"
              onClick={() => toggleSection('입출금')}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                <span className="text-[14px] font-bold text-kb-text">
                  입출금 (총 {REGISTERED_ACCOUNTS.length}계좌)&nbsp;&nbsp;잔액&nbsp;
                  {balanceVisible
                    ? REGISTERED_ACCOUNTS.reduce((s, a) => s + a.balance, 0).toLocaleString()
                    : '***'}
                  &nbsp;원
                </span>
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <button className="border border-kb-border px-2 py-1 text-[12px] text-kb-text-body hover:bg-kb-beige-light flex items-center gap-1">
                  ⊞ 계좌순서변경
                </button>
                <span className="text-[12px] text-kb-text-muted">
                  {expandedSections.has('입출금') ? '∧' : '∨'}
                </span>
              </div>
            </button>

            {expandedSections.has('입출금') && (
              <div className="border-t border-kb-border">
                {REGISTERED_ACCOUNTS.map(acc => (
                  <div
                    key={acc.id}
                    className="flex items-center justify-between py-3.5 px-1 border-b border-kb-border last:border-b-0 relative"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                        style={{ backgroundColor: acc.bankColor }}
                      >
                        {acc.bank[0]}
                      </span>
                      <div>
                        <p className="text-[13px] font-semibold text-kb-text">{acc.accountNumber}</p>
                        <p className="text-[12px] text-kb-text-muted">{acc.bank} {acc.productName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[12px] text-kb-text-muted">잔액</p>
                        <p className="text-[14px] font-bold text-kb-text">
                          {balanceVisible ? `${acc.balance.toLocaleString()}원` : '***원'}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                          <button className="border border-kb-border px-3 py-1 text-[12px] text-kb-text-body hover:bg-kb-beige-light">조회</button>
                          <button className="border border-kb-border px-3 py-1 text-[12px] text-kb-text-body hover:bg-kb-beige-light">이체</button>
                        </div>
                        <div className="flex gap-1">
                          <button className="border border-kb-border px-3 py-1 text-[12px] text-kb-text-body hover:bg-kb-beige-light">잔액 모으기</button>
                          <button
                            className="border border-kb-border px-3 py-1 text-[12px] text-kb-text-body hover:bg-kb-beige-light"
                            onClick={() => setOpenMgt(openMgt === acc.id ? null : acc.id)}
                          >
                            계좌관리
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 계좌관리 드롭다운 */}
                    {openMgt === acc.id && (
                      <div className="absolute right-0 top-full z-20 bg-white border border-kb-border shadow-lg w-56">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-kb-border bg-kb-beige-light">
                          <span className="text-[13px] font-bold text-kb-text">계좌관리</span>
                          <button
                            onClick={() => setOpenMgt(null)}
                            className="text-kb-text-muted hover:text-kb-text"
                          >
                            ✕
                          </button>
                        </div>
                        <ul>
                          {ACCOUNT_MGT_ITEMS.map(item => (
                            <li key={item.label}>
                              <Link
                                href={item.href}
                                className="block px-4 py-2 text-[13px] text-kb-text-body hover:bg-kb-beige-light"
                                onClick={() => setOpenMgt(null)}
                              >
                                · {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 빈 섹션들 */}
          {EMPTY_SECTIONS.map(s => (
            <EmptySection
              key={s.title}
              dotColor={s.dotColor}
              title={s.title}
              sub={s.sub}
            />
          ))}
        </main>
      </div>
    </div>
  )
}

function EmptySection({
  dotColor,
  title,
  sub,
}: {
  dotColor: string
  title: string
  sub: string
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center py-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor} flex-shrink-0`} />
        <span className="text-[14px] font-bold text-kb-text ml-2">{title}</span>
      </div>
      <div className="border border-kb-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 flex-shrink-0">
            <rect x="6" y="6" width="28" height="36" rx="2" fill="#EFEFEF" stroke="#CCCCCC" strokeWidth="1.5" />
            <line x1="12" y1="16" x2="28" y2="16" stroke="#CCCCCC" strokeWidth="1.5" />
            <line x1="12" y1="22" x2="28" y2="22" stroke="#CCCCCC" strokeWidth="1.5" />
            <line x1="12" y1="28" x2="20" y2="28" stroke="#CCCCCC" strokeWidth="1.5" />
            <circle cx="37" cy="37" r="8" fill="#EFEFEF" stroke="#CCCCCC" strokeWidth="1.5" />
            <line x1="35" y1="37" x2="39" y2="37" stroke="#999" strokeWidth="1.5" />
            <line x1="37" y1="35" x2="37" y2="39" stroke="#999" strokeWidth="1.5" />
          </svg>
          <div>
            <p className="text-[13px] text-kb-text-body">조회 내역이 없습니다.</p>
            <p className="text-[12px] text-kb-text-muted">
              KB인터넷뱅킹에서 다른 {sub} 조회 OK!
            </p>
          </div>
        </div>
        <Link
          href="/transfer/other-bank/register/terms"
          className="border border-kb-border px-4 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light whitespace-nowrap"
        >
          다른금융 등록
        </Link>
      </div>
    </div>
  )
}
