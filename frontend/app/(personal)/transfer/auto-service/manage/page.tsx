'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_ACCOUNTS } from '@/lib/mock-data'
import TransferSidebar from '@/components/inquiry/TransferSidebar'

type RegRow = {
  id: string
  bank: string
  account: string
  holder: string
  transferDay: string
  amount: number
  startDate: string
  endDate: string
  receiverDisplay: string
  myDisplay: string
}

const INITIAL_REGISTRATIONS: RegRow[] = [
  {
    id: '1',
    bank: '가상은행',
    account: '012-345-678901',
    holder: '홍길동',
    transferDay: '30일',
    amount: 100_000,
    startDate: '2026.05',
    endDate: '2027.05',
    receiverDisplay: '홍길동',
    myDisplay: '531089-04-274618',
  },
]

function fmt(n: number) { return n.toLocaleString('ko-KR') }

export default function AutoTransferManagePage() {
  const router = useRouter()
  const [activeTab,    setActiveTab]    = useState<'registered' | 'terminated'>('registered')
  const [fromAccount,  setFromAccount]  = useState('')
  const [txType,       setTxType]       = useState<'KB' | '타행'>('KB')
  const [searched,     setSearched]     = useState(false)
  const [rows,         setRows]         = useState<RegRow[]>(INITIAL_REGISTRATIONS)
  const [selectedIds,  setSelectedIds]  = useState<Set<string>>(new Set())
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [terminated,   setTerminated]   = useState<RegRow[]>([])

  const visibleRows = searched && txType === '타행' ? rows : []

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selectedIds.size === visibleRows.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(visibleRows.map(r => r.id)))
    }
  }

  function handleSearch() {
    setSearched(true)
    setSelectedIds(new Set())
  }

  function handleTerminate() {
    if (selectedIds.size === 0) { alert('해지할 자동이체를 선택해주세요.'); return }
    setShowConfirm(true)
  }

  function confirmTerminate() {
    const toTerminate = rows.filter(r => selectedIds.has(r.id))
    setRows(prev => prev.filter(r => !selectedIds.has(r.id)))
    setTerminated(prev => [...prev, ...toTerminate])
    setSelectedIds(new Set())
    setShowConfirm(false)
    setActiveTab('terminated')
  }

  return (
    <div className="max-w-kb-container mx-auto px-6">
      <div className="flex">
        <TransferSidebar />

        <main className="flex-1 pl-8 pt-4 pb-12">
          {/* 브레드크럼 */}
          <div className="flex justify-end mb-2 text-[12px] text-kb-text-muted gap-1 items-center">
            <span>개인뱅킹</span><span>&gt;</span>
            <span>이체</span><span>&gt;</span>
            <span>자동이체</span><span>&gt;</span>
            <span className="text-kb-blue">자동이체내역 조회/해지/변경</span>
          </div>

          <h1 className="text-[22px] font-bold text-kb-text mb-5">자동이체내역 조회/해지/변경</h1>

          {/* 탭 */}
          <div className="flex border-b border-kb-border mb-5">
            {([
              { id: 'registered', label: '등록내역' },
              { id: 'terminated', label: '해지내역' },
            ] as const).map(tab => (
              <button key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearched(false); setSelectedIds(new Set()) }}
                className={`px-10 py-3 text-[14px] font-semibold border-t border-l border-r -mb-px transition-colors
                  ${activeTab === tab.id
                    ? 'border-kb-border bg-white text-kb-text'
                    : 'border-transparent bg-[#f5f5f5] text-kb-text-muted hover:bg-white'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* 안내 문구 */}
          <div className="text-[12px] text-kb-text-body space-y-1 mb-5">
            {activeTab === 'registered' ? (
              <>
                <p>· 출금계좌번호를 선택하면 등록된 자동이체 내역을 조회할 수 있습니다.</p>
                <p>· 자동이체를 해지하려면 [등록내역]에서 출금계좌번호를 선택하여 조회된 입금계좌를 선택한 후 [해지] 버튼을 눌러주세요.</p>
                <p>· AXful카드사 AXful 장기카드대출(카드론) 관련 자동이체 내역은 조회되지 않습니다.</p>
                <p>· 해당 내용 확인은 AXful카드 고객센터(1588-1688)로 문의해 주세요.</p>
                <p>· 보험료, 관리비, 휴대전화요금 등은 공과금 메뉴에서 자동납부 조회, 등록, 해지가 가능합니다.</p>
                <p>· 퇴직연금 자동이체 조회/해지/변경은 퇴직연금관리에서 확인 가능합니다.</p>
                <p>· 이용가능시간은 우측 상단의 [도움말]을 참고하세요.</p>
              </>
            ) : (
              <>
                <p>· 출금계좌번호를 선택하면 해지된 자동이체 내역을 조회할 수 있습니다.</p>
                <p>· 자동이체를 해지하려면 [등록내역]에서 출금계좌번호를 선택하여 조회된 입금계좌를 선택한 후 [해지] 버튼을 눌러주세요.</p>
              </>
            )}
          </div>

          {/* 조회 폼 */}
          <div className="border border-kb-border mb-5">
            <table className="w-full text-[13px]">
              <tbody>
                <tr>
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36 whitespace-nowrap">출금계좌번호</td>
                  <td className="border border-kb-border px-4 py-3">
                    <select value={fromAccount} onChange={e => { setFromAccount(e.target.value); setSearched(false) }}
                      className="border border-kb-border px-3 py-1.5 text-[13px] outline-none w-72">
                      <option value="">선택하세요</option>
                      {MOCK_ACCOUNTS.map(a => (
                        <option key={a.id} value={a.id}>{a.number} : {a.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text whitespace-nowrap">구분</td>
                  <td className="border border-kb-border px-4 py-3">
                    <div className="flex items-center gap-6">
                      {([
                        { val: 'KB', label: 'AX풀뱅크 자동이체' },
                        { val: '타행', label: '타행자동이체' },
                      ] as const).map(opt => (
                        <label key={opt.val} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                          <input type="radio" name="txType" value={opt.val}
                            checked={txType === opt.val}
                            onChange={() => { setTxType(opt.val); setSearched(false) }}
                            className="accent-kb-text" />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mb-6">
            <button onClick={handleSearch}
              className="bg-[#5C5C5C] text-white px-14 py-3 text-[14px] hover:opacity-90 transition-opacity">
              조회
            </button>
          </div>

          {/* ── 등록내역 결과 ── */}
          {activeTab === 'registered' && searched && (
            <>
              {visibleRows.length === 0 ? (
                <div className="border border-kb-border py-10 text-center text-[13px] text-kb-text-muted">
                  조회내역이 없습니다.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-[12px] border-collapse">
                      <thead>
                        <tr className="bg-kb-beige-light">
                          <th className="border border-kb-border px-2 py-2 w-8">
                            <input type="checkbox"
                              checked={selectedIds.size === visibleRows.length && visibleRows.length > 0}
                              onChange={toggleAll}
                              className="accent-kb-text" />
                          </th>
                          <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap">입금기관</th>
                          <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap">입금계좌번호</th>
                          <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap">예금주</th>
                          <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap">이체일</th>
                          <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap">이체금액(원)</th>
                          <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap text-center">
                            <div>이체시작년월</div>
                            <div className="border-t border-kb-border mt-1 pt-1">이체종료년월</div>
                          </th>
                          <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap text-center">
                            <div>받는분 통장 표시내용</div>
                            <div className="border-t border-kb-border mt-1 pt-1">내 통장 표시내용</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRows.map(row => (
                          <tr key={row.id} className="hover:bg-kb-beige-light/50">
                            <td className="border border-kb-border px-2 py-2 text-center">
                              <input type="checkbox"
                                checked={selectedIds.has(row.id)}
                                onChange={() => toggleSelect(row.id)}
                                className="accent-kb-text" />
                            </td>
                            <td className="border border-kb-border px-3 py-2 text-center">{row.bank}</td>
                            <td className="border border-kb-border px-3 py-2 text-center">{row.account}</td>
                            <td className="border border-kb-border px-3 py-2 text-center">{row.holder}</td>
                            <td className="border border-kb-border px-3 py-2 text-center">{row.transferDay}</td>
                            <td className="border border-kb-border px-3 py-2 text-right">{fmt(row.amount)}</td>
                            <td className="border border-kb-border px-3 py-0 text-center">
                              <div className="py-1.5">{row.startDate}</div>
                              <div className="border-t border-kb-border py-1.5">{row.endDate}</div>
                            </td>
                            <td className="border border-kb-border px-3 py-0 text-center">
                              <div className="py-1.5">{row.receiverDisplay}</div>
                              <div className="border-t border-kb-border py-1.5 text-[11px] text-kb-text-muted">{row.myDisplay}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 페이지네이션 */}
                  <div className="flex justify-center mb-4">
                    <button className="w-7 h-7 bg-kb-yellow text-[13px] font-bold text-kb-text">1</button>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button onClick={handleTerminate}
                      className="bg-kb-yellow px-10 py-2.5 text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">
                      해지
                    </button>
                    <button onClick={() => router.push('/transfer/auto-service/manage/edit')}
                      className="border border-kb-border px-10 py-2.5 text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                      변경
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── 해지내역 결과 ── */}
          {activeTab === 'terminated' && searched && (
            <>
              {terminated.length === 0 ? (
                <div className="border border-kb-border py-10 text-center text-[13px] text-kb-text-muted">
                  조회내역이 없습니다.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px] border-collapse">
                    <thead>
                      <tr className="bg-kb-beige-light">
                        <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap">입금은행</th>
                        <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap">입금계좌번호</th>
                        <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap">예금주명</th>
                        <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap text-center">
                          <div>자동이체일</div>
                          <div className="border-t border-kb-border mt-1 pt-1">이체주기</div>
                        </th>
                        <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap text-center">
                          <div>이체금액(원)</div>
                          <div className="border-t border-kb-border mt-1 pt-1">이체비율(%)</div>
                        </th>
                        <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap">이체시작일</th>
                        <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap">이체종료일</th>
                        <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap">해지년월일</th>
                        <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold whitespace-nowrap">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {terminated.map(row => (
                        <tr key={row.id}>
                          <td className="border border-kb-border px-3 py-2 text-center">{row.bank}</td>
                          <td className="border border-kb-border px-3 py-2 text-center">{row.account}</td>
                          <td className="border border-kb-border px-3 py-2 text-center">{row.holder}</td>
                          <td className="border border-kb-border px-3 py-0 text-center">
                            <div className="py-1.5">{row.transferDay}</div>
                            <div className="border-t border-kb-border py-1.5">매월</div>
                          </td>
                          <td className="border border-kb-border px-3 py-0 text-center">
                            <div className="py-1.5">{fmt(row.amount)}</div>
                            <div className="border-t border-kb-border py-1.5">-</div>
                          </td>
                          <td className="border border-kb-border px-3 py-2 text-center">{row.startDate}</td>
                          <td className="border border-kb-border px-3 py-2 text-center">{row.endDate}</td>
                          <td className="border border-kb-border px-3 py-2 text-center">2026.05</td>
                          <td className="border border-kb-border px-3 py-2 text-center text-red-600 font-semibold">해지</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 해지 확인 다이얼로그 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-kb-border shadow-xl w-[380px]">
            <div className="px-6 py-6 text-center">
              <p className="text-[14px] text-kb-text mb-6">고객님이 선택한 자동이체내역을 해지하시겠습니까?</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setShowConfirm(false)}
                  className="border border-kb-border px-10 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">
                  취소
                </button>
                <button onClick={confirmTerminate}
                  className="bg-kb-yellow px-10 py-2.5 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark">
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
