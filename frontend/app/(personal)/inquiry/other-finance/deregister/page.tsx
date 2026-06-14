'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InquirySidebar from '@/components/inquiry/InquirySidebar'

type DeregisterStep = 'list' | 'confirm' | 'complete'

const REGISTERED_ACCOUNTS = [
  {
    id: 'g1',
    bank: '광주',
    bankColor: '#00447C',
    accountNumber: '074107652623',
    productName: '보통예금',
  },
]

export default function DeregisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<DeregisterStep>('list')
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const allChecked = checked.size === REGISTERED_ACCOUNTS.length
  const selectedAccounts = REGISTERED_ACCOUNTS.filter(a => checked.has(a.id))

  function toggleAll() {
    if (allChecked) {
      setChecked(new Set())
    } else {
      setChecked(new Set(REGISTERED_ACCOUNTS.map(a => a.id)))
    }
  }

  function toggleAccount(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1024px] mx-auto px-4 py-6 flex gap-6">
        <InquirySidebar />

        <main className="flex-1 pl-8 pt-4 pb-12">
          {/* 브레드크럼 */}
          <div className="flex justify-end mb-2 text-[12px] text-kb-text-muted gap-1 items-center">
            <span>개인뱅킹</span><span>&gt;</span>
            <span>조회</span><span>&gt;</span>
            <span>계좌조회</span><span>&gt;</span>
            <span className="text-kb-blue">다른금융 등록해제</span>
          </div>

          <h1 className="text-[22px] font-bold text-kb-text mb-4">다른금융 등록해제</h1>

          {/* ── 목록 단계 ── */}
          {step === 'list' && (
            <>
              {/* 안내 */}
              <div className="border border-kb-border bg-kb-beige-light px-4 py-3 mb-5 text-[13px] text-kb-text-body space-y-1">
                <p>· 다른금융 등록 해제 시, AX풀뱅킹/인터넷뱅킹에서 해당 계좌, 카드, 선불기관의 조회 및 거래를 할 수 없습니다.</p>
                <p>· 다른금융 등록 해제 시, AX풀뱅킹/인터넷뱅킹에서의 연결이 해제되며, 해당 기관에서는 해지되지 않습니다.</p>
                <p>· 잔액 모으기 예약이 되어 있는 계좌는 등록을 해제할 수 없습니다.</p>
                <p>· 착오송금 반환 신청중인 계좌는 해제할 수 없습니다.</p>
                <p>· 숨김 등록 되어있는 계좌는 숨김 등록 해제 후 처리 가능합니다.</p>
              </div>

              <h2 className="text-[14px] font-bold text-kb-text mb-3">등록된 다른 금융</h2>

              {/* 계좌 섹션 */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px] font-semibold text-kb-text">계좌</span>
                  <span className="text-[13px] text-kb-text">{REGISTERED_ACCOUNTS.length}</span>
                </div>
                <table className="w-full border-collapse border border-kb-border text-[13px]">
                  <thead>
                    <tr className="bg-kb-beige-light">
                      <th className="border border-kb-border px-3 py-2.5 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          onChange={toggleAll}
                          className="accent-kb-yellow w-4 h-4"
                        />
                      </th>
                      <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">No.</th>
                      <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">기관명</th>
                      <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">계좌번호</th>
                      <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">계좌명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REGISTERED_ACCOUNTS.map((acc, i) => (
                      <tr key={acc.id}>
                        <td className="border border-kb-border px-3 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={checked.has(acc.id)}
                            onChange={() => toggleAccount(acc.id)}
                            className="accent-kb-yellow w-4 h-4"
                          />
                        </td>
                        <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{i + 1}</td>
                        <td className="border border-kb-border px-4 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                              style={{ backgroundColor: acc.bankColor }}
                            >
                              {acc.bank[0]}
                            </span>
                            <span className="text-kb-text">{acc.bank}</span>
                          </div>
                        </td>
                        <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{acc.accountNumber}</td>
                        <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{acc.productName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 카드사 섹션 */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px] font-semibold text-kb-text">카드사</span>
                  <span className="text-[13px] text-kb-text">0</span>
                </div>
                <table className="w-full border-collapse border border-kb-border text-[13px]">
                  <thead>
                    <tr className="bg-kb-beige-light">
                      <th className="border border-kb-border px-3 py-2.5 w-10 text-center">
                        <input type="checkbox" disabled className="w-4 h-4 opacity-40" />
                      </th>
                      <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">No.</th>
                      <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">카드사</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={3} className="border border-kb-border px-4 py-4 text-center text-[13px] text-kb-text-muted">
                        등록된 카드사가 없습니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 선불기관 섹션 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px] font-semibold text-kb-text">선불기관</span>
                  <span className="text-[13px] text-kb-text">0</span>
                </div>
                <table className="w-full border-collapse border border-kb-border text-[13px]">
                  <thead>
                    <tr className="bg-kb-beige-light">
                      <th className="border border-kb-border px-3 py-2.5 w-10 text-center">
                        <input type="checkbox" disabled className="w-4 h-4 opacity-40" />
                      </th>
                      <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">No.</th>
                      <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">기관명</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={3} className="border border-kb-border px-4 py-4 text-center text-[13px] text-kb-text-muted">
                        등록된 선불기관이 없습니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => router.push('/inquiry/other-finance')}
                  className="px-14 py-3 border border-kb-border text-[14px] text-kb-text-body hover:bg-kb-beige-light"
                >
                  취소
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  disabled={checked.size === 0}
                  className="px-10 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark disabled:opacity-50"
                >
                  다른금융 등록 해제
                </button>
              </div>
            </>
          )}

          {/* ── 확인 단계 ── */}
          {step === 'confirm' && (
            <>
              {/* 확인 메시지 */}
              <div className="border border-kb-border px-5 py-5 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0">
                  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                    <rect x="4" y="4" width="40" height="40" rx="4" fill="#F5F0E8" stroke="#CCCCCC" strokeWidth="1.5" />
                    <circle cx="24" cy="24" r="12" fill="none" stroke="#CCCCCC" strokeWidth="1.5" />
                    <polyline points="19,24 23,28 29,20" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-kb-text">다른금융 등록을 해제 하시겠습니까?</p>
                  <p className="text-[13px] text-kb-text-muted">{selectedAccounts.length}개 정보를 등록해제합니다.</p>
                </div>
              </div>

              <h2 className="text-[14px] font-bold text-kb-text mb-3">해제할 계좌</h2>
              <table className="w-full border-collapse border border-kb-border text-[13px] mb-6">
                <thead>
                  <tr className="bg-kb-beige-light">
                    <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">No.</th>
                    <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">기관명</th>
                    <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">계좌번호</th>
                    <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">계좌명</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAccounts.map((acc, i) => (
                    <tr key={acc.id}>
                      <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{i + 1}</td>
                      <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{acc.bank}</td>
                      <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{acc.accountNumber}</td>
                      <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{acc.productName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setStep('complete')}
                  className="px-14 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark"
                >
                  확인
                </button>
                <button
                  onClick={() => setStep('list')}
                  className="px-14 py-3 border border-kb-border text-[14px] text-kb-text-body hover:bg-kb-beige-light"
                >
                  취소
                </button>
              </div>
            </>
          )}

          {/* ── 완료 단계 ── */}
          {step === 'complete' && (
            <>
              {/* 완료 메시지 */}
              <div className="border border-kb-border px-5 py-5 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0">
                  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                    <rect x="4" y="4" width="40" height="40" rx="4" fill="#F5F0E8" stroke="#CCCCCC" strokeWidth="1.5" />
                    <circle cx="24" cy="24" r="12" fill="#FFC107" />
                    <polyline points="19,24 23,28 29,20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[15px] font-bold text-orange-500">
                  {selectedAccounts.length}건의 다른금융을 해제가 완료되었습니다.
                </p>
              </div>

              <h2 className="text-[14px] font-bold text-kb-text mb-3">계좌</h2>
              <table className="w-full border-collapse border border-kb-border text-[13px] mb-6">
                <thead>
                  <tr className="bg-kb-beige-light">
                    <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">No.</th>
                    <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">기관명</th>
                    <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">계좌번호</th>
                    <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">계좌명</th>
                    <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">처리결과</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAccounts.map((acc, i) => (
                    <tr key={acc.id}>
                      <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{i + 1}</td>
                      <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{acc.bank}</td>
                      <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{acc.accountNumber}</td>
                      <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{acc.productName}</td>
                      <td className="border border-kb-border px-4 py-2.5 text-center">
                        <span className="text-kb-blue font-semibold">해제</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center">
                <button
                  onClick={() => router.push('/inquiry/other-finance')}
                  className="px-14 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark"
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
