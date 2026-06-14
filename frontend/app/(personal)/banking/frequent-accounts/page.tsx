'use client'

import { useState } from 'react'
import ManageSidebar from '@/components/inquiry/ManageSidebar'

const MOCK_BANKS = [
  'AXful', 'KB국민', '신한', '우리', '하나', 'IBK기업', 'NH농협', '카카오뱅크', '토스뱅크', 'SC제일',
]

const GROUP_OPTIONS = ['기준', '가족', '친구', '공과금', '저축', '기타']

type FreqAccount = {
  id: string
  bank: string
  accountNo: string
  name: string
  alias: string
  group: string
  phone: string
  checked: boolean
}

const MOCK_FREQ_ACCOUNTS: FreqAccount[] = [
  { id: '1', bank: 'AXful',   accountNo: '531089-04-274618', name: '김민준', alias: '아들 용돈',   group: '가족',  phone: '',            checked: false },
  { id: '2', bank: '신한',    accountNo: '110-456-789012',   name: '이서연', alias: '룸메이트',    group: '친구',  phone: '010-5678-xxxx', checked: false },
  { id: '3', bank: 'NH농협',  accountNo: '301-0987-6543-11', name: '박도현', alias: '관리비',      group: '공과금', phone: '',            checked: false },
]

// 출금가능금액 모달용 mock
const MOCK_BALANCE_INFO = {
  availableBalance: 5_320_000,
  accountBalance:   5_320_000,
  dailyLimit:       5_000_000,
  dailyRemain:      4_999_950,
  onceLimit:        1_000_000,
}

// 내계좌 모달용 mock
const MY_ACCOUNTS = {
  입출금식계좌: [
    { number: '531089-04-274618', name: 'AXful ONE통장-보통예금' },
  ],
  적립식계좌: [
    { number: '748201-05-938471', name: 'AXful 스타 건강적금' },
  ],
  대출계좌:   [],
  펀드계좌:   [],
}

function fmt(n: number) { return n.toLocaleString('ko-KR') }

export default function FrequentAccountsPage() {
  // 폼
  const [bank, setBank]       = useState('AXful')
  const [accountNo, setAccountNo] = useState('')
  const [group, setGroup]     = useState('기준')
  const [alias, setAlias]     = useState('')
  const [phone, setPhone]     = useState('')

  // 목록
  const [accounts, setAccounts] = useState<FreqAccount[]>(MOCK_FREQ_ACCOUNTS)
  const [filterGroup, setFilterGroup] = useState('전체')
  const [editId, setEditId] = useState<string | null>(null)

  // 모달
  const [showBalance, setShowBalance] = useState(false)
  const [showMyAccounts, setShowMyAccounts] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['입출금식계좌']))

  function toggleSection(section: string) {
    setExpandedSections(prev => {
      const next = new Set(prev)
      next.has(section) ? next.delete(section) : next.add(section)
      return next
    })
  }

  function handleRegister() {
    if (!accountNo.trim()) { alert('입금계좌번호를 입력해주세요.'); return }
    const newAcc: FreqAccount = {
      id: Date.now().toString(),
      bank, accountNo, name: '홍길동', alias, group, phone, checked: false,
    }
    setAccounts(prev => [...prev, newAcc])
    setAccountNo(''); setAlias(''); setPhone(''); setGroup('기준')
  }

  function handleCheck(id: string) {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, checked: !a.checked } : a))
  }

  function handleDelete() {
    const selected = accounts.filter(a => a.checked)
    if (!selected.length) { alert('삭제할 계좌를 선택해주세요.'); return }
    if (!confirm(`선택한 ${selected.length}개 계좌를 삭제하시겠습니까?`)) return
    setAccounts(prev => prev.filter(a => !a.checked))
  }

  function handleSelectMyAccount(number: string, bankName: string) {
    setAccountNo(number)
    setBank(bankName === 'AXful ONE통장-보통예금' ? 'AXful' : 'AXful')
    setShowMyAccounts(false)
  }

  const filtered = filterGroup === '전체' ? accounts : accounts.filter(a => a.group === filterGroup)

  return (
    <div className="max-w-kb-container mx-auto px-6">
      <div className="flex">
        <ManageSidebar />

        <main className="flex-1 pl-8 pt-4 pb-12">
          {/* 브레드크럼 */}
          <div className="flex justify-end mb-2 text-[12px] text-kb-text-muted gap-1 items-center">
            <span>개인뱅킹</span><span>&gt;</span>
            <span>뱅킹관리</span><span>&gt;</span>
            <span>계좌관리</span><span>&gt;</span>
            <span className="text-kb-blue">자주쓰는계좌 등록/삭제</span>
          </div>

          <h1 className="text-[22px] font-bold text-kb-text mb-4">자주쓰는계좌 등록/삭제</h1>

          {/* 안내문구 */}
          <div className="border border-kb-border bg-[#FFFBF0] px-5 py-4 mb-6 text-[13px] text-kb-text-body space-y-1">
            <p>· 자주쓰는 계좌를 등록하시면 이체시에 입금계좌번호 입력없이 편리하게 이용하실 수 있습니다.</p>
            <p>· 등록된 계좌 중 여러 계좌를 선택 후 [수정] 버튼을 클릭하시면 선택된 계좌를 한번에 수정하실 수 있습니다.</p>
            <p>· 등록된 계좌 중 여러 계좌를 선택 후 [삭제] 버튼을 클릭하시면 선택된 계좌가 한번에 삭제됩니다.</p>
            <p>· [계좌순서변경] 버튼을 클릭 하시면, 그룹별 계좌 순서를 변경하실 수 있습니다.</p>
            <p>· 등록하신 계좌를 해약하시는 경우 등록 내역이 자동삭제 되지 않으므로 등록내역을 삭제하신 후 이용하시기 바랍니다.</p>
            <button onClick={() => alert('계좌이체 페이지로 이동합니다.')}
              className="mt-1 border border-kb-border px-3 py-1 text-[12px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
              계좌이체 바로가기
            </button>
          </div>

          {/* 자주쓰는 계좌 등록 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[15px] font-bold text-kb-text">자주쓰는 계좌 등록</p>
              <div className="flex gap-2">
                <button onClick={() => setShowMyAccounts(true)}
                  className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                  내계좌
                </button>
                <button onClick={() => alert('최근 입금계좌 목록')}
                  className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                  최근입금계좌
                </button>
              </div>
            </div>

            <table className="w-full border-collapse border-t-2 border-kb-text text-[13px]">
              <thead>
                <tr className="bg-kb-beige-light">
                  <th className="border border-kb-border px-3 py-2.5 text-left font-semibold text-kb-text">입금은행<br />입금계좌번호</th>
                  <th className="border border-kb-border px-3 py-2.5 text-left font-semibold text-kb-text">계좌그룹</th>
                  <th className="border border-kb-border px-3 py-2.5 text-left font-semibold text-kb-text">계좌별명<br /><span className="font-normal text-kb-text-muted">휴대폰번호(선택)</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-kb-border px-3 py-3">
                    <div className="flex flex-col gap-1.5">
                      <select value={bank} onChange={e => setBank(e.target.value)}
                        className="border border-kb-border px-2 py-1.5 text-[13px] outline-none w-36">
                        {MOCK_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <input type="text" value={accountNo} onChange={e => setAccountNo(e.target.value)}
                        placeholder="입금계좌번호"
                        className="border border-kb-border px-2 py-1.5 text-[13px] outline-none w-44" />
                    </div>
                  </td>
                  <td className="border border-kb-border px-3 py-3">
                    <select value={group} onChange={e => setGroup(e.target.value)}
                      className="border border-kb-border px-2 py-1.5 text-[13px] outline-none w-24">
                      {GROUP_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </td>
                  <td className="border border-kb-border px-3 py-3">
                    <div className="flex flex-col gap-1.5">
                      <input type="text" value={alias} onChange={e => setAlias(e.target.value)}
                        placeholder="최대 한글 15자, 영문/숫자 30자"
                        className="border border-kb-border px-2 py-1.5 text-[13px] outline-none w-56" />
                      <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="- 없이 숫자만 입력"
                        className="border border-kb-border px-2 py-1.5 text-[13px] outline-none w-44" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-center mt-4">
              <button onClick={handleRegister}
                className="bg-kb-yellow px-12 py-2.5 text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">
                계좌등록하기
              </button>
            </div>
          </div>

          {/* 자주쓰는 계좌 등록내역 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[15px] font-bold text-kb-text">자주쓰는 계좌 등록내역</p>
              <div className="flex gap-2">
                <button onClick={() => alert('그룹편리 기능')}
                  className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                  그룹편리 ↗
                </button>
                <button onClick={() => alert('자주순서변경 기능')}
                  className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                  자주순서변경 ↗
                </button>
              </div>
            </div>

            {/* 그룹 필터 */}
            <div className="mb-3">
              <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)}
                className="border border-kb-border px-3 py-1.5 text-[13px] outline-none">
                <option value="전체">그룹전체</option>
                {GROUP_OPTIONS.filter(g => g !== '기준').map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <table className="w-full border-collapse border-t-2 border-kb-text text-[13px]">
              <thead>
                <tr className="bg-kb-beige-light">
                  <th className="border border-kb-border px-3 py-2.5 w-8">
                    <input type="checkbox"
                      checked={filtered.length > 0 && filtered.every(a => a.checked)}
                      onChange={e => setAccounts(prev => prev.map(a =>
                        filtered.find(f => f.id === a.id) ? { ...a, checked: e.target.checked } : a
                      ))} />
                  </th>
                  <th className="border border-kb-border px-3 py-2.5 text-left font-semibold text-kb-text">입금은행명/계좌번호</th>
                  <th className="border border-kb-border px-3 py-2.5 text-left font-semibold text-kb-text">받는분</th>
                  <th className="border border-kb-border px-3 py-2.5 text-left font-semibold text-kb-text">계좌별명</th>
                  <th className="border border-kb-border px-3 py-2.5 text-left font-semibold text-kb-text">계좌그룹</th>
                  <th className="border border-kb-border px-3 py-2.5 text-left font-semibold text-kb-text">휴대폰번호</th>
                  <th className="border border-kb-border px-3 py-2.5 text-center font-semibold text-kb-text">바로가기</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="border border-kb-border px-3 py-8 text-center text-[13px] text-kb-text-muted">
                      계좌등록내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map(a => (
                    <tr key={a.id} className={a.checked ? 'bg-kb-beige-light' : 'hover:bg-[#FAFAFA]'}>
                      <td className="border border-kb-border px-3 py-3 text-center">
                        <input type="checkbox" checked={a.checked} onChange={() => handleCheck(a.id)} />
                      </td>
                      <td className="border border-kb-border px-3 py-3">
                        <span className="font-semibold">{a.bank}</span><br />
                        <span className="text-kb-text-muted">{a.accountNo}</span>
                      </td>
                      <td className="border border-kb-border px-3 py-3">{a.name}</td>
                      <td className="border border-kb-border px-3 py-3">{a.alias || '-'}</td>
                      <td className="border border-kb-border px-3 py-3">{a.group}</td>
                      <td className="border border-kb-border px-3 py-3">{a.phone || '-'}</td>
                      <td className="border border-kb-border px-3 py-3 text-center">
                        <button onClick={() => alert(`${a.bank} ${a.accountNo}으로 이체`)}
                          className="text-kb-blue text-[12px] hover:underline">
                          이체
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => { const sel = accounts.filter(a=>a.checked); if(!sel.length){alert('수정할 계좌를 선택해주세요.');return} setEditId(sel[0].id) }}
                className="bg-kb-yellow px-10 py-2.5 text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">
                수정
              </button>
              <button onClick={handleDelete}
                className="border border-kb-border px-10 py-2.5 text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                삭제
              </button>
              <button onClick={() => alert('저장되었습니다.')}
                className="border border-kb-border px-10 py-2.5 text-[14px] text-kb-text-body hover:bg-kb-beige-light flex items-center gap-1.5 transition-colors">
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="1" width="14" height="14" rx="1"/>
                  <rect x="4" y="1" width="8" height="5"/>
                  <rect x="3" y="8" width="10" height="6"/>
                </svg>
                저장
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ── 출금가능금액 모달 ── */}
      {showBalance && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-kb-border w-80 shadow-lg">
            <div className="flex items-center justify-between px-5 py-3 border-b border-kb-border">
              <p className="text-[15px] font-bold text-kb-text">출금가능금액</p>
              <button onClick={() => setShowBalance(false)} className="text-kb-text-muted hover:text-kb-text text-lg">×</button>
            </div>
            <table className="w-full text-[13px]">
              <tbody>
                {[
                  { label: '출금가능금액',    value: MOCK_BALANCE_INFO.availableBalance },
                  { label: '계좌잔액',        value: MOCK_BALANCE_INFO.accountBalance },
                  { label: '1일이체한도',     value: MOCK_BALANCE_INFO.dailyLimit },
                  { label: '1일이체잔여한도', value: MOCK_BALANCE_INFO.dailyRemain },
                  { label: '1회이체한도',     value: MOCK_BALANCE_INFO.onceLimit },
                ].map(row => (
                  <tr key={row.label}>
                    <td className="border border-kb-border bg-kb-beige-light px-4 py-3 font-semibold text-kb-text whitespace-nowrap">{row.label}</td>
                    <td className="border border-kb-border px-4 py-3 text-right">{fmt(row.value)} 원</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center py-4">
              <button onClick={() => setShowBalance(false)}
                className="border border-kb-border px-10 py-2 text-[13px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 내계좌 모달 ── */}
      {showMyAccounts && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-kb-border w-96 shadow-lg">
            <div className="flex items-center justify-between px-5 py-3 border-b border-kb-border">
              <p className="text-[15px] font-bold text-kb-text">내계좌</p>
              <button onClick={() => setShowMyAccounts(false)} className="text-kb-text-muted hover:text-kb-text text-lg">×</button>
            </div>
            <div className="divide-y divide-kb-border">
              {(Object.entries(MY_ACCOUNTS) as [string, {number:string; name:string}[]][]).map(([section, items]) => (
                <div key={section}>
                  <button onClick={() => toggleSection(section)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-kb-beige-light transition-colors">
                    <span className="text-[13px] font-semibold text-kb-text">{section}</span>
                    <span className="text-kb-text-muted text-[12px]">{expandedSections.has(section) ? '−' : '+'}</span>
                  </button>
                  {expandedSections.has(section) && (
                    <div className="bg-[#FAFAFA]">
                      {items.length === 0 ? (
                        <p className="px-8 py-2.5 text-[12px] text-kb-text-muted">계좌가 없습니다.</p>
                      ) : (
                        items.map(item => (
                          <button key={item.number} onClick={() => handleSelectMyAccount(item.number, item.name)}
                            className="w-full flex items-center gap-2 px-8 py-2.5 hover:bg-kb-beige-light transition-colors text-left">
                            <span className="text-[12px] text-kb-text-muted">·</span>
                            <span className="text-[13px] text-kb-text">{item.number}</span>
                            <span className="text-[12px] text-kb-text-muted">{item.name}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center py-4 border-t border-kb-border">
              <button onClick={() => setShowMyAccounts(false)}
                className="border border-kb-border px-10 py-2 text-[13px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
