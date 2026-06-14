'use client'

import Link from 'next/link'
import { useState } from 'react'
import DepositSidebar from '@/components/products/DepositSidebar'

const MOCK_DEPOSIT_ACCOUNTS = [
  {
    id: 'dep1',
    no: '531089-04-274610',
    name: 'AX Star 정기예금',
    balance: 1_000_000,
    createdAt: '2026.01.15',
    maturityDate: '2026.08.15',
    currentMethod: '자동재예치(원금)',
  },
  {
    id: 'dep2',
    no: '531089-04-274611',
    name: 'AX풀뱅크 e-정기예금',
    balance: 3_000_000,
    createdAt: '2025.12.01',
    maturityDate: '2026.09.30',
    currentMethod: '자동재예치(원금+이자)',
  },
]

const MATURITY_METHODS = [
  { id: 'auto_terminate',  label: '자동해지' },
  { id: 'auto_principal',  label: '자동재예치(원금)' },
  { id: 'auto_full',       label: '자동재예치(원금+이자)' },
]

export default function MaturityChangePage() {
  const [selectedAccId, setSelectedAccId] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [prevMethod, setPrevMethod] = useState('')

  const selectedAcc = MOCK_DEPOSIT_ACCOUNTS.find(a => a.id === selectedAccId)
  const selectedMethodLabel = MATURITY_METHODS.find(m => m.id === selectedMethod)?.label ?? ''

  function handleApply() {
    if (!selectedAccId) { alert('계좌를 선택해 주세요.'); return }
    if (!selectedMethod) { alert('변경할 만기해지방법을 선택해 주세요.'); return }
    setPrevMethod(selectedAcc?.currentMethod ?? '')
    setDone(true)
  }

  function handleReset() {
    setSelectedAccId(null)
    setSelectedMethod(null)
    setShowInfo(false)
    setDone(false)
    setPrevMethod('')
  }

  return (
    <div className="max-w-kb-container mx-auto px-6 py-6">
      {/* 브레드크럼 */}
      <div className="flex justify-end mb-3 text-[12px] text-kb-text-muted gap-1 items-center">
        <span>개인뱅킹</span><span>›</span>
        <span>금융상품</span><span>›</span>
        <span>예금</span><span>›</span>
        <span>예금 관리</span><span>›</span>
        <Link href="/products/deposit/manage/maturity-change" className="text-kb-blue hover:underline">만기해지방법 변경</Link>
      </div>

      <div className="flex gap-6">
        <DepositSidebar />

        <main className="flex-1 min-w-0">
          <h1 className="text-[20px] font-bold text-kb-text mb-5">만기해지방법 변경</h1>

          {!done ? (
            <>
              {/* ── 계좌 목록 ── */}
              <div className="border border-kb-border mb-4">
                {MOCK_DEPOSIT_ACCOUNTS.map((acc, idx) => (
                  <div
                    key={acc.id}
                    className={`flex items-center gap-3 px-4 py-3 ${idx > 0 ? 'border-t border-kb-border' : ''} ${selectedAccId === acc.id ? 'bg-[#F0FDF8]' : ''}`}
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="account"
                        checked={selectedAccId === acc.id}
                        onChange={() => { setSelectedAccId(acc.id); setSelectedMethod(null) }}
                        className="accent-[#5BC9A8] w-4 h-4"
                      />
                    </label>
                    <div className="flex-1 flex items-center gap-5 text-[13px] min-w-0">
                      <span className="text-kb-text font-medium whitespace-nowrap">{acc.no}</span>
                      <span className="text-kb-text-muted whitespace-nowrap">신규일 {acc.createdAt}</span>
                      <span className="text-kb-text-muted whitespace-nowrap">만기일 {acc.maturityDate}</span>
                      <span className="ml-auto font-bold text-kb-text whitespace-nowrap">{acc.balance.toLocaleString('ko-KR')} 원</span>
                    </div>
                    <button
                      onClick={() => setShowInfo(p => !p)}
                      className="w-6 h-6 border border-[#5BC9A8] text-[#5BC9A8] text-[11px] font-bold flex items-center justify-center hover:bg-[#5BC9A8] hover:text-white transition-colors flex-shrink-0"
                    >
                      !
                    </button>
                  </div>
                ))}
              </div>

              {/* ── 안내사항 (토글) ── */}
              {showInfo && (
                <div className="border border-kb-border bg-[#FAFAFA] px-5 py-4 mb-4 text-[12px] text-kb-text-body space-y-2">
                  <p>• 만기해지방법 구분을 변경하실 수 있습니다</p>
                  <p>• 변경을 원하시면, 변경하실 만기해지방법을 선택하신 후 하단의 [변경 적용] 버튼을 선택하여주시기 바랍니다.</p>
                  <p className="font-bold pt-1">※ 선택 조건</p>
                  <div className="space-y-2.5 pl-1">
                    <div>
                      <p className="font-semibold">1. 자동해지</p>
                      <p className="text-kb-text-muted pl-3 leading-relaxed">
                        - 만기일(휴일인 경우 휴일 이후 최초 도래하는 첫 은행영업일) 당일 상품 신규가입 시 출금계좌에 만기해지금액 전액 입금
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">2. 자동재예치(원금)</p>
                      <p className="text-kb-text-muted pl-3 leading-relaxed">
                        - 만기(재예치)일 당일 고시한 고객적용이율을 적용하며, 적용이자율을 제외한 가입조건은 기존 가입조건과 동일하게 원금부분만 재예치, 이자금액은 신규가입 시 출금계좌에 입금
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">3. 자동재예치(원금+이자)</p>
                      <p className="text-kb-text-muted pl-3 leading-relaxed">
                        - 만기(재예치)일 당일 고시한 고객적용이율을 적용하며, 적용이자율을 제외한 가입조건은 기존 가입조건과 동일조건으로 만기해지금액 전액 재예치
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 방법 선택 ── */}
              <div className="border border-kb-border mb-6">
                <div className="flex items-center gap-6 px-5 py-4">
                  <span className="text-[13px] font-semibold text-kb-text w-36 flex-shrink-0">만기해지방법 구분</span>
                  <div className="flex gap-8">
                    {MATURITY_METHODS.map(m => (
                      <label key={m.id} className={`flex items-center gap-2 text-[13px] ${selectedAccId ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                        <input
                          type="radio"
                          name="method"
                          checked={selectedMethod === m.id}
                          onChange={() => setSelectedMethod(m.id)}
                          disabled={!selectedAccId}
                          className="accent-[#5BC9A8] w-4 h-4"
                        />
                        {m.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleApply}
                  className="bg-[#5BC9A8] text-white px-12 py-2.5 text-[13px] font-bold hover:bg-[#4AB898] transition-colors"
                >
                  변경 적용
                </button>
              </div>
            </>
          ) : (
            /* ── 완료 화면 ── */
            <>
              <div className="border border-[#5BC9A8] bg-white px-5 py-4 mb-5 flex items-center gap-4">
                <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14 flex-shrink-0">
                  <rect x="5" y="4" width="34" height="42" rx="2" fill="#E8F8F4" stroke="#5BC9A8" strokeWidth="1.5"/>
                  <line x1="12" y1="16" x2="32" y2="16" stroke="#5BC9A8" strokeWidth="1.2"/>
                  <line x1="12" y1="22" x2="32" y2="22" stroke="#5BC9A8" strokeWidth="1.2"/>
                  <line x1="12" y1="28" x2="24" y2="28" stroke="#5BC9A8" strokeWidth="1.2"/>
                  <circle cx="43" cy="43" r="10" fill="#5BC9A8"/>
                  <polyline points="37,43 41,47 49,37" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-[14px] font-bold text-[#5BC9A8]">만기해지방법 구분 변경이 완료 되었습니다.</p>
                  <p className="text-[12px] text-kb-text-muted mt-0.5">감사합니다.</p>
                </div>
              </div>

              <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-6">
                <tbody>
                  {[
                    { label: '상품명',   value: selectedAcc?.name ?? '' },
                    { label: '계좌번호', value: selectedAcc?.no ?? '' },
                    { label: '변경 전',  value: prevMethod },
                    { label: '변경 후',  value: selectedMethodLabel },
                  ].map(row => (
                    <tr key={row.label}>
                      <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-[160px]">{row.label}</td>
                      <td className="border border-kb-border px-4 py-3 text-kb-text-body">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="bg-[#5BC9A8] text-white px-12 py-2.5 text-[13px] font-bold hover:bg-[#4AB898] transition-colors"
                >
                  확인
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
