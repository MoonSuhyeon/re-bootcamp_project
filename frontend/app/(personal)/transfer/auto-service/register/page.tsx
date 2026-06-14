'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { MOCK_ACCOUNTS } from '@/lib/mock-data'
import TransferSidebar from '@/components/inquiry/TransferSidebar'

const STEPS = ['약관동의', '정보입력', '입력확인', '등록완료']

const TERMS = [
  { id: 'kb',    label: 'AX풀뱅크 계좌간 자동이체 약관', required: true },
  { id: 'other', label: '타행 자동이체 약관',              required: true },
]

type TermId = 'kb' | 'other'

const TERMS_CONTENT: Record<TermId, { title: string; articles: { title: string; items: string[] }[] }> = {
  kb: {
    title: '「계좌간자동이체」약관',
    articles: [
      {
        title: '제1조  자동이체 방법',
        items: [
          '① 은행은 거래처의 자동이체 신청에 따라 지정일에 통장, 수표, 지급청구서 없이 출금계좌에서 이체금액(영업시간 이내 입금분에 한합니다)을 입금 계좌로 이체합니다. 다만, 입금계좌가 퇴직연금인 경우에는 18시 전 입금분에 한해 입금계좌로 이체합니다.',
          '② 지정일이 영업일이 아닌 때는 그 다음 영업일에 이체합니다. 다만, 정기예금 및 신탁 월지급 이자는 그 전 영업일에 이체합니다.',
          '③ 통장자동대출 약정을 체결한 경우에는 대출금액을 포함하여 이체합니다. 다만, 고객이 따로 요청하는 경우에는 예금잔액 이내에서만 이체 할 수 있습니다.',
        ],
      },
      {
        title: '제2조  지급자금 부족 때의 처리',
        items: [
          '① 이체 지정일에 출금계좌의 지급자금이 이체금액에 미달하면 부족자금이 채워지는 날에 이체(영업시간 이내 입금분에 한합니다)합니다. 다만, 이체주기를 매 영업일로 정하는 경우 해당 이체 지정일에 출금계좌의 지급자금이 이체금액에 미달하면 부족자금이 채워지는 날에도 이체되지 않습니다.',
          '② 제1항에도 불구하고, 입금계좌가 대출계좌, 집합투자기구(펀드), 퇴직연금인 경우에는 별도로 정한 바에 따릅니다.',
        ],
      },
      {
        title: '제3조  여러 건의 이체처리',
        items: ['같은 날에 이체대상이 여러 건 있는 때의 이체처리순서는 은행이 정한 바에 따릅니다.'],
      },
      {
        title: '제4조  증권의 부도',
        items: ['거래처의 출금계좌에 입금한 자기앞수표, 가계수표, 등 증권이 지급 거절되었을 때는 자동이체 처리된 금액을 취소합니다.'],
      },
    ],
  },
  other: {
    title: '「타행자동이체」약관',
    articles: [
      {
        title: '제1조  약관의 적용',
        items: ['타행 자동이체에 의하여 각종 자금을 정기적으로 이체하고자 하는 자(이하 \'거래처\'라 합니다)와 AX풀뱅크(이하 \'은행\'이라 합니다)에 대하여 이 약관을 적용합니다.'],
      },
      {
        title: '제2조  신청, 변경 및 해지',
        items: [
          '① 거래처가 타행 자동이체를 이용, 변경 또는 해지하고자 할 경우에는 타행 자동이체(신규, 변경, 해지) 신청서를 제출하여야 합니다.',
          '② 타행 자동이체를 변경, 해지하고자 할 경우에는 출금일 전일까지 신청서를 제출하여야 하며, 해지신청서를 제출한 경우는 전자금융거래법에 규정된 거래지시의 철회로 봅니다.',
        ],
      },
      {
        title: '제3조  타행 자동이체 방법',
        items: ['은행은 거래처의 타행 자동이체 신청에 따라 지정일에 통장, 수표, 지급청구서 제출 등 별도 청구 없이 출금계좌에서 이체금액을 인출하여 수취인 거래 금융기관(이하\'입금은행\'이라 합니다)의 지정계좌(이하 \'입금계좌\'라 합니다)로 입금합니다.'],
      },
      {
        title: '제4조  입금가능 예금종목',
        items: ['입금계좌는 당좌, 가계당좌, 보통, 저축, 자유저축, 기업자유예금과 입금은행이 지정하는 적금 및 신탁계정이어야 하며, 이 외의 계좌로 이체를 원할 경우 거래처는 입금 가능한 계좌와 연계하여 이체할 수 있도록 입금은행과 별도의 계약을 체결하여야 합니다.'],
      },
      {
        title: '제5조  출금 및 입금',
        items: [
          '① 은행은 거래처 출금계좌에서 지정일(거래처가 지정한 날이 없는 월의 경우에는 해당 월의 말일, 휴일인 경우는 익영업일)에 출금하여 지정일에 입금합니다.',
          '② 다만 천재지변, 전산장애 등 불가피한 사유가 발생하였을 때에는 제 1항에서 정한 출금이 지연될 수 있습니다.',
        ],
      },
    ],
  },
}

const MOCK_BANKS = [
  'AXful', 'KB국민', '신한', '우리', '하나', 'IBK기업', 'NH농협', '카카오뱅크', '토스뱅크',
]

const AMOUNT_SHORTCUTS = ['100만', '60만', '10만', '6만', '1만', '정결']
const TRANSFER_DAYS    = Array.from({ length: 28 }, (_, i) => i + 1)
const CYCLE_OPTIONS    = ['선택', '매월', '매주', '매일']
const YEARS            = [2026, 2027, 2028]
const MONTHS           = Array.from({ length: 12 }, (_, i) => i + 1)
const DAYS             = Array.from({ length: 28 }, (_, i) => i + 1)

// Mock security card (rows A-E, cols 01-10)
const CARD_ROWS = ['A', 'B', 'C', 'D', 'E']
const CARD_COLS = Array.from({ length: 10 }, (_, i) => String(i + 1).padStart(2, '0'))
const MOCK_CARD: Record<string, string> = {}
for (const r of CARD_ROWS) {
  for (const c of CARD_COLS) {
    MOCK_CARD[`${r}${c}`] = String(
      [4,7,2,9,1,5,8,3,6,0,4,7,2,9,1,5,8,3,6,0,3,8,1,6,4,9,2,7,5,0,
       7,2,6,1,8,4,9,3,5,0,9,3,5,2,7,6,1,8,4,0][CARD_ROWS.indexOf(r)*10 + CARD_COLS.indexOf(c)]
    ).padStart(2, '0')
  }
}
const SECURITY_PROMPT = { row: 'B', col: '07' }

type AuthPhase = 'none' | 'ars1' | 'ars2' | 'security' | 'fincert1' | 'fincert2' | 'complete'

function fmt(n: number) { return n.toLocaleString('ko-KR') }

function padZero(n: number) { return String(n).padStart(2, '0') }

function shuffle(arr: (number | null)[]): (number | null)[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function AutoTransferRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  // Step 1
  const [allChecked, setAllChecked] = useState(false)
  const [checked, setChecked]       = useState<Record<string, boolean>>({ kb: false, other: false })
  const [modalOpen, setModalOpen]   = useState<TermId | null>(null)
  const [sequential, setSequential] = useState(false)

  // Step 2 — 계좌정보
  const [fromAccount,     setFromAccount]     = useState('')
  const [password,        setPassword]        = useState('')
  const [mouseInput,      setMouseInput]      = useState(false)
  const [toBank,          setToBank]          = useState('AXful')
  const [toAccount,       setToAccount]       = useState('')
  const [accountVerified, setAccountVerified] = useState(false)
  const [receiverName,    setReceiverName]    = useState('')

  // Step 2 — 자동이체정보
  const [amount,       setAmount]       = useState('')
  const [cycle,        setCycle]        = useState('선택')
  const [transferDay,  setTransferDay]  = useState(20)
  const [startYear,    setStartYear]    = useState(2026)
  const [startMonth,   setStartMonth]   = useState(1)
  const [startDay,     setStartDay]     = useState(4)
  const [endYear,      setEndYear]      = useState(2026)
  const [endMonth,     setEndMonth]     = useState(6)
  const [periodType,   setPeriodType]   = useState<'1년' | '2년' | '3년'>('1년')
  const [myDisplay,    setMyDisplay]    = useState<'계좌번호' | '반반구' | '고객지정'>('계좌번호')
  const [receiverMemo, setReceiverMemo] = useState('')

  // Step 3 — 인증
  const [authMethod,    setAuthMethod]    = useState<'ARS' | '해외출국확인'>('ARS')
  const [authPhase,     setAuthPhase]     = useState<AuthPhase>('none')
  const [securityInput, setSecurityInput] = useState('')
  const [pinInput,      setPinInput]      = useState('')
  const pinLayout = useMemo(
    () => shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, null]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step],
  )

  const txDateTime = useMemo(() => {
    const now = new Date(2026, 4, 25, 14, 32, 9)
    return `${now.getFullYear()}.${padZero(now.getMonth()+1)}.${padZero(now.getDate())} ${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`
  }, [])

  const fromAcc = MOCK_ACCOUNTS.find(a => a.id === fromAccount)
  const displayFromAcc = fromAcc?.number ?? '531089-04-274618'
  const displayFromAccName = fromAcc?.name ?? 'AXful ONE통장-보통예금'
  const displayToAccount = toAccount || '012-345-678901'
  const displayReceiver = receiverName || '홍길동'

  // ── handlers ──
  function handleAllCheck() {
    const next = !allChecked
    setAllChecked(next)
    setChecked({ kb: next, other: next })
  }

  function handleCheck(id: string) {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    setAllChecked(Object.values(next).every(Boolean))
  }

  function handleStep1Submit(agree: boolean) {
    if (!agree) { router.push('/transfer/account'); return }
    if (!checked.kb || !checked.other) { alert('필수 약관에 동의해주세요.'); return }
    setStep(1)
  }

  function handleAccountVerify() {
    if (!fromAccount)   { alert('출금계좌를 선택해주세요.'); return }
    if (!password)      { alert('계좌 비밀번호를 입력해주세요.'); return }
    if (!toAccount)     { alert('입금계좌번호를 입력해주세요.'); return }
    setReceiverName('홍길동')
    setAccountVerified(true)
  }

  function handleAmountShortcut(label: string) {
    const map: Record<string, number> = {
      '100만': 1_000_000, '60만': 600_000, '10만': 100_000,
      '6만': 60_000, '1만': 10_000,
    }
    if (label === '정결') {
      if (fromAcc) setAmount(fmt(fromAcc.availableBalance))
      return
    }
    setAmount(fmt(map[label]))
  }

  function handleStep2Confirm() {
    if (cycle === '선택') { alert('이체주기를 선택해주세요.'); return }
    if (!amount) { alert('이체금액을 입력해주세요.'); return }
    setAuthPhase('none')
    setStep(2)
  }

  function handleAuthStart() {
    if (authMethod === 'ARS') {
      setAuthPhase('ars1')
    } else {
      setAuthPhase('security')
    }
  }

  function handlePinDigit(digit: number | null) {
    if (digit === null) return
    const next = pinInput + String(digit)
    setPinInput(next)
    if (next.length >= 6) {
      setTimeout(() => {
        setAuthPhase('complete')
        setPinInput('')
      }, 400)
    }
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
            <span className="text-kb-blue">자동이체 등록</span>
          </div>

          {/* 제목 + 단계 표시 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[22px] font-bold text-kb-text">자동이체 등록</h1>
            <div className="flex items-center gap-1">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-bold
                    ${step === i ? 'bg-kb-text text-white' : step > i ? 'bg-kb-border text-white' : 'border border-kb-border text-kb-text-muted'}`}>
                    <span>{i + 1}.</span><span>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && <span className="text-kb-border text-[10px]">›</span>}
                </div>
              ))}
            </div>
          </div>

          {/* ────────────── STEP 1: 약관동의 ────────────── */}
          {step === 0 && (
            <div>
              <div className="border border-kb-border bg-[#FFFBF0] px-5 py-4 mb-6 text-[13px] text-kb-text-body space-y-1">
                <p>· 자동이체를 등록하기 전 계좌간/타행 자동이체 약관을 반드시 숙지하시기 바랍니다.</p>
                <p>· 보안카드 이용고객은 추가인증 확인 후 자동이체 등록이 가능합니다.</p>
              </div>

              <div className="border border-kb-border mb-6">
                <div className="flex items-center justify-between px-5 py-4 border-b border-kb-border">
                  <button className="flex items-center gap-3 hover:bg-kb-beige-light transition-colors flex-1 text-left"
                    onClick={handleAllCheck}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                      ${allChecked ? 'border-kb-text bg-kb-text' : 'border-kb-border'}`}>
                      {allChecked && <svg viewBox="0 0 12 10" fill="none" className="w-3 h-2.5"><polyline points="1,5 4.5,8.5 11,1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className="text-[14px] font-bold text-kb-text">전체약관보기</span>
                  </button>
                  <button
                    onClick={() => { setSequential(true); setModalOpen('kb') }}
                    className="border border-kb-border px-3 py-1 text-[13px] font-semibold text-kb-text-body hover:bg-kb-beige flex-shrink-0">
                    약관보기 ›
                  </button>
                </div>
                {TERMS.map(term => (
                  <div key={term.id} className="flex items-center justify-between px-5 py-4 border-b border-kb-border last:border-b-0">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleCheck(term.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                          ${checked[term.id] ? 'border-[#5BC9A8] bg-[#5BC9A8]' : 'border-kb-border'}`}>
                        {checked[term.id] && <svg viewBox="0 0 12 10" fill="none" className="w-3 h-2.5"><polyline points="1,5 4.5,8.5 11,1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                      <span className="text-[13px] text-kb-text-muted">
                        <span className="text-kb-blue font-semibold mr-1">[{term.required ? '필수' : '선택'}]</span>
                        {term.label}
                      </span>
                    </div>
                    <button onClick={() => setModalOpen(term.id as TermId)}
                      className="border border-kb-border px-3 py-1 text-[13px] font-semibold text-kb-text-body hover:bg-kb-beige flex-shrink-0">약관보기 ›</button>
                  </div>
                ))}
              </div>

              <p className="text-[13px] text-kb-text-body text-center mb-6">
                · 위 약관의 내용을 충분히 숙지하고 이해하였으며, 이에 동의하십니까?
              </p>
              <div className="flex justify-center gap-3 mb-8">
                <button onClick={() => handleStep1Submit(true)}
                  className="bg-kb-yellow px-12 py-3 text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">예</button>
                <button onClick={() => handleStep1Submit(false)}
                  className="border border-kb-border px-12 py-3 text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">아니오</button>
              </div>

              <div className="border-t border-kb-border pt-5 text-[12px] text-kb-text-body space-y-2">
                <p className="font-bold text-[13px] mb-2">타행자동이체 안내</p>
                <p>· 출금계좌의 예금잔액이 이체금액에 수수료를 합산한 금액보다 적은 경우 이체가 이루어지지 않습니다.</p>
                <p>· 고객의 AXful뱅크 출금계좌에서 지정일에 출금하여 당일 타행 입금계좌로 입금합니다.</p>
                <p className="text-kb-text-muted">· 타행자동이체 수수료는 건당 300원이며 자세한 내용은 우측 상단의 [도움말]을 참고하세요.</p>
              </div>
            </div>
          )}

          {/* ────────────── STEP 2: 정보입력 ────────────── */}
          {step === 1 && (
            <div>
              <div className="border border-kb-border bg-[#FFFBF0] px-5 py-4 mb-6 text-[13px] text-kb-text-body space-y-1">
                <p>· 계좌정보 입력 후 [계좌확인] 버튼을 누르면 선택한 계좌에 맞는 자동이체정보 입력란이 표시됩니다.</p>
                <p>· 연계(가상)계좌는 자동이체 입금계좌로 등록할 수 없습니다.</p>
                <p>· 상품의 위험등급이 1등급(매우높은위험)으로 상향된 펀드·신탁계좌의 경우 투자 적정여부 평가 후 자동이체 등록이 가능합니다.</p>
              </div>

              <div className="border border-t-2 border-t-kb-text border-kb-border mb-4">
                <div className="px-5 py-4">
                  <p className="text-[14px] font-bold text-kb-text mb-4">계좌정보</p>
                  <table className="w-full text-[13px]">
                    <tbody>
                      <tr>
                        <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-32 whitespace-nowrap">출금계좌번호</td>
                        <td className="border border-kb-border px-4 py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <select value={fromAccount} onChange={e => { setFromAccount(e.target.value); setAccountVerified(false) }}
                              className="border border-kb-border px-3 py-1.5 text-[13px] outline-none w-64">
                              <option value="">선택하세요</option>
                              {MOCK_ACCOUNTS.map(a => (
                                <option key={a.id} value={a.id}>{a.number} ({a.name})</option>
                              ))}
                            </select>
                            {fromAcc && (
                              <button className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">
                                출금가능금액
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text whitespace-nowrap">계좌비밀번호</td>
                        <td className="border border-kb-border px-4 py-3">
                          <div className="flex items-center gap-3">
                            <input type={mouseInput ? 'text' : 'password'} value={password}
                              onChange={e => setPassword(e.target.value)} maxLength={4}
                              placeholder="••••"
                              className="border border-kb-border px-3 py-1.5 text-[13px] w-24 outline-none" />
                            <label className="flex items-center gap-1.5 text-[12px] text-kb-text-body cursor-pointer">
                              <input type="checkbox" checked={mouseInput} onChange={e => setMouseInput(e.target.checked)} />
                              마우스로 입력
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text whitespace-nowrap">입금계좌번호</td>
                        <td className="border border-kb-border px-4 py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <select value={toBank} onChange={e => { setToBank(e.target.value); setAccountVerified(false) }}
                              className="border border-kb-border px-3 py-1.5 text-[13px] outline-none">
                              {MOCK_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <input type="text" value={toAccount}
                              onChange={e => { setToAccount(e.target.value); setAccountVerified(false) }}
                              placeholder="계좌번호 입력"
                              className="border border-kb-border px-3 py-1.5 text-[13px] w-44 outline-none" />
                            <button onClick={() => alert('자주쓰는 입금계좌 목록')}
                              className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">
                              자주쓰는 입금계좌 등록
                            </button>
                            <button onClick={() => { setToBank('AXful'); setToAccount(MOCK_ACCOUNTS[0]?.number ?? ''); setAccountVerified(false) }}
                              className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">
                              내계좌
                            </button>
                          </div>
                          {accountVerified && (
                            <p className="mt-2 text-[12px] text-green-600 font-semibold">예금주: {receiverName}</p>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {!accountVerified && (
                <div className="flex justify-center mb-6">
                  <button onClick={handleAccountVerify}
                    className="bg-[#5C5C5C] text-white px-12 py-3 text-[14px] hover:opacity-90 transition-opacity">
                    계좌확인
                  </button>
                </div>
              )}

              {accountVerified && (
                <div>
                  <div className="border border-kb-border bg-[#FFFBF0] px-5 py-4 mb-4 text-[13px] text-kb-text-body space-y-1">
                    <p>· 자동이체 등록 전 타행자동이체 약관을 반드시 숙지하시기 바랍니다.</p>
                    <p>· 타행자동이체 수수료는 건당 300원이며 자세한 내용은 우측 상단의 [도움말]을 참고하세요.
                      <span className="text-red-600 ml-1">(*23.1.19(목)~별도 안내시까지 개인/개인사업자/임의단체(서류미제출) 한시적 면제)</span>
                    </p>
                  </div>

                  <div className="border border-t-2 border-t-kb-text border-kb-border mb-6">
                    <div className="px-5 py-4">
                      <p className="text-[14px] font-bold text-kb-text mb-4">자동이체정보 <span className="text-[12px] font-normal text-kb-text-muted ml-1">이체정보</span></p>
                      <table className="w-full text-[13px]">
                        <tbody>
                          <tr>
                            <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-32 whitespace-nowrap">이체금액</td>
                            <td className="border border-kb-border px-4 py-3">
                              <div className="flex items-center gap-1 mb-2 flex-wrap">
                                {AMOUNT_SHORTCUTS.map(s => (
                                  <button key={s} onClick={() => handleAmountShortcut(s)}
                                    className="border border-kb-border px-2.5 py-1 text-[12px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                                    {s}
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="text" value={amount} onChange={e => setAmount(e.target.value)}
                                  placeholder="금액 입력"
                                  className="border border-kb-border px-3 py-1.5 text-[13px] w-44 outline-none text-right" />
                                <span className="text-[13px] text-kb-text-body">원</span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text whitespace-nowrap">이체주기</td>
                            <td className="border border-kb-border px-4 py-3">
                              <select value={cycle} onChange={e => setCycle(e.target.value)}
                                className="border border-kb-border px-3 py-1.5 text-[13px] outline-none">
                                {CYCLE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text whitespace-nowrap">자동이체일</td>
                            <td className="border border-kb-border px-4 py-3">
                              <div className="flex items-center gap-2">
                                <select value={transferDay} onChange={e => setTransferDay(Number(e.target.value))}
                                  className="border border-kb-border px-3 py-1.5 text-[13px] outline-none">
                                  {TRANSFER_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <span className="text-[13px] text-kb-text-body">일</span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text whitespace-nowrap align-top pt-4">이체기간<br /><span className="font-normal text-kb-text-muted">(시작/종료)</span></td>
                            <td className="border border-kb-border px-4 py-3">
                              <div className="flex gap-2 mb-3">
                                {(['1년', '2년', '3년'] as const).map(p => (
                                  <button key={p} onClick={() => {
                                    setPeriodType(p)
                                    const y = p === '1년' ? 1 : p === '2년' ? 2 : 3
                                    setEndYear(startYear + y)
                                    setEndMonth(startMonth)
                                  }}
                                    className={`border px-3 py-1 text-[12px] transition-colors
                                      ${periodType === p ? 'border-kb-text bg-kb-text text-white' : 'border-kb-border text-kb-text-body hover:bg-kb-beige-light'}`}>
                                    {p}
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-1 flex-wrap">
                                <select value={startYear} onChange={e => setStartYear(Number(e.target.value))}
                                  className="border border-kb-border px-2 py-1.5 text-[13px] outline-none">
                                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <span className="text-[13px]">년</span>
                                <select value={startMonth} onChange={e => setStartMonth(Number(e.target.value))}
                                  className="border border-kb-border px-2 py-1.5 text-[13px] outline-none">
                                  {MONTHS.map(m => <option key={m} value={m}>{padZero(m)}</option>)}
                                </select>
                                <span className="text-[13px]">월</span>
                                <select value={startDay} onChange={e => setStartDay(Number(e.target.value))}
                                  className="border border-kb-border px-2 py-1.5 text-[13px] outline-none">
                                  {DAYS.map(d => <option key={d} value={d}>{padZero(d)}</option>)}
                                </select>
                                <span className="text-[13px]">일</span>
                                <span className="mx-2 text-[13px] text-kb-text-muted">~</span>
                                <select value={endYear} onChange={e => setEndYear(Number(e.target.value))}
                                  className="border border-kb-border px-2 py-1.5 text-[13px] outline-none">
                                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <span className="text-[13px]">년</span>
                                <select value={endMonth} onChange={e => setEndMonth(Number(e.target.value))}
                                  className="border border-kb-border px-2 py-1.5 text-[13px] outline-none">
                                  {MONTHS.map(m => <option key={m} value={m}>{padZero(m)}</option>)}
                                </select>
                                <span className="text-[13px]">월</span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text whitespace-nowrap">내 통장 표시</td>
                            <td className="border border-kb-border px-4 py-3">
                              <div className="flex items-center gap-4">
                                {(['계좌번호', '반반구', '고객지정'] as const).map(opt => (
                                  <label key={opt} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                                    <input type="radio" name="myDisplay" value={opt}
                                      checked={myDisplay === opt} onChange={() => setMyDisplay(opt)} />
                                    {opt}
                                  </label>
                                ))}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text whitespace-nowrap">받는분 통장 표시</td>
                            <td className="border border-kb-border px-4 py-3">
                              <input type="text" value={receiverMemo} onChange={e => setReceiverMemo(e.target.value)}
                                maxLength={10}
                                placeholder="10자 이내 미입력시 송금자 이름으로 표시"
                                className="border border-kb-border px-3 py-1.5 text-[13px] w-72 outline-none" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button onClick={() => setStep(0)}
                      className="border border-kb-border px-10 py-3 text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                      이전
                    </button>
                    <button onClick={handleStep2Confirm}
                      className="bg-kb-yellow px-10 py-3 text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">
                      확인
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ────────────── STEP 3: 입력확인 ────────────── */}
          {step === 2 && (
            <div>
              {/* ── ARS 인증 모달 1: 전화번호 선택 ── */}
              {authPhase === 'ars1' && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white w-[460px] border border-kb-border shadow-xl">
                    <div className="flex items-center justify-between px-5 py-4 bg-[#333] text-white">
                      <p className="text-[14px] font-bold">ARS 인증</p>
                      <button onClick={() => setAuthPhase('none')} className="text-white/80 hover:text-white text-[18px] leading-none">✕</button>
                    </div>
                    <div className="px-6 py-6">
                      <p className="text-[13px] text-kb-text-body mb-4">ARS 인증번호 수신 전화번호를 선택하세요.</p>
                      <div className="border border-kb-border px-4 py-3 mb-1 flex items-center gap-3 bg-[#FFFEF5]">
                        <input type="radio" defaultChecked readOnly className="accent-kb-text" />
                        <span className="text-[13px] text-kb-text font-semibold">010-12**-34**</span>
                        <span className="text-[12px] text-kb-text-muted ml-1">(등록된 휴대전화)</span>
                      </div>
                      <p className="text-[11px] text-kb-text-muted mb-1 px-1">· 위 전화번호로 ARS 발신이 되며 수신 후 안내에 따라 이체 인증번호를 입력하세요.</p>
                      <p className="text-[11px] text-kb-text-muted mb-6 px-1">· 전화를 받지 못한 경우 [취소] 버튼을 클릭한 후 다시 시도해 주세요.</p>
                      <div className="flex justify-center gap-3">
                        <button onClick={() => setAuthPhase('none')}
                          className="border border-kb-border px-10 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">
                          취소
                        </button>
                        <button onClick={() => setAuthPhase('ars2')}
                          className="bg-kb-yellow px-10 py-2.5 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark">
                          전화승인 요청
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── ARS 인증 모달 2: 전화승인 완료 ── */}
              {authPhase === 'ars2' && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white w-[460px] border border-kb-border shadow-xl">
                    <div className="flex items-center justify-between px-5 py-4 bg-[#333] text-white">
                      <p className="text-[14px] font-bold">ARS 인증</p>
                      <button onClick={() => setAuthPhase('none')} className="text-white/80 hover:text-white text-[18px] leading-none">✕</button>
                    </div>
                    <div className="px-6 py-8 text-center">
                      <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.56 4.92 2 2 0 0 1 3.52 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </div>
                      <p className="text-[14px] font-bold text-kb-text mb-1">전화를 발신 중입니다</p>
                      <p className="text-[13px] text-kb-text-body mb-1">010-12**-34** 으로 발신 중입니다.</p>
                      <p className="text-[12px] text-kb-text-muted mb-6">전화 연결 후 안내에 따라 이체 인증번호를 입력하세요.</p>
                      <div className="flex justify-center gap-3">
                        <button onClick={() => setAuthPhase('none')}
                          className="border border-kb-border px-10 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">
                          취소
                        </button>
                        <button onClick={() => setAuthPhase('security')}
                          className="bg-kb-yellow px-10 py-2.5 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark">
                          전화승인 완료
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 금융인증서비스 모달 1: 전자서명 원문 ── */}
              {authPhase === 'fincert1' && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white w-[480px] border border-kb-border shadow-xl">
                    <div className="flex items-center justify-between px-5 py-3 bg-[#1a1a2e] text-white">
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="white" strokeWidth="1.5">
                          <rect x="3" y="2" width="14" height="16" rx="2"/>
                          <path d="M7 7h6M7 11h4"/>
                        </svg>
                        <p className="text-[13px] font-bold">금융인증서비스</p>
                      </div>
                      <button onClick={() => setAuthPhase('none')} className="text-white/70 hover:text-white text-[16px]">✕</button>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-[12px] text-kb-text-muted mb-3">전자서명 원문을 확인하세요.</p>
                      <div className="bg-[#f8f8f8] border border-kb-border px-4 py-4 mb-4 text-[12px] space-y-1.5 text-kb-text-body">
                        <p className="font-bold text-[13px] text-kb-text mb-2">자동이체 등록</p>
                        <div className="flex gap-2"><span className="text-kb-text-muted w-20 flex-shrink-0">출금계좌</span><span>{displayFromAcc}</span></div>
                        <div className="flex gap-2"><span className="text-kb-text-muted w-20 flex-shrink-0">입금계좌</span><span>{toBank} {displayToAccount}</span></div>
                        <div className="flex gap-2"><span className="text-kb-text-muted w-20 flex-shrink-0">받는분</span><span>{displayReceiver}</span></div>
                        <div className="flex gap-2"><span className="text-kb-text-muted w-20 flex-shrink-0">이체금액</span><span className="font-bold">{amount || '100,000'}원</span></div>
                        <div className="flex gap-2"><span className="text-kb-text-muted w-20 flex-shrink-0">수수료</span><span>300원</span></div>
                        <div className="flex gap-2"><span className="text-kb-text-muted w-20 flex-shrink-0">이체주기</span><span>{cycle === '선택' ? '매월' : cycle}</span></div>
                        <div className="flex gap-2"><span className="text-kb-text-muted w-20 flex-shrink-0">자동이체일</span><span>매월 {transferDay}일</span></div>
                        <div className="flex gap-2"><span className="text-kb-text-muted w-20 flex-shrink-0">이체기간</span><span>{startYear}.{padZero(startMonth)} ~ {endYear}.{padZero(endMonth)}</span></div>
                      </div>
                      <div className="flex justify-center gap-3">
                        <button onClick={() => setAuthPhase('security')}
                          className="border border-kb-border px-8 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">
                          취소
                        </button>
                        <button onClick={() => setAuthPhase('fincert2')}
                          className="bg-[#1a1a2e] text-white px-8 py-2.5 text-[13px] font-bold hover:opacity-90">
                          확인
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 금융인증서비스 모달 2: PIN 패드 ── */}
              {authPhase === 'fincert2' && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white w-[360px] border border-kb-border shadow-xl">
                    <div className="flex items-center justify-between px-5 py-3 bg-[#1a1a2e] text-white">
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="white" strokeWidth="1.5">
                          <rect x="3" y="2" width="14" height="16" rx="2"/>
                          <path d="M7 7h6M7 11h4"/>
                        </svg>
                        <p className="text-[13px] font-bold">금융인증서비스</p>
                      </div>
                      <button onClick={() => setAuthPhase('security')} className="text-white/70 hover:text-white text-[16px]">✕</button>
                    </div>
                    <div className="px-5 py-5">
                      <p className="text-[13px] text-kb-text-body mb-1">서비스 이용을 위해 PIN을 입력하세요.</p>
                      <p className="text-[11px] text-kb-text-muted mb-4">6자리 숫자를 입력해 주세요.</p>
                      <div className="flex justify-center gap-2 mb-5">
                        {Array.from({ length: 6 }, (_, i) => (
                          <div key={i}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                              ${i < pinInput.length ? 'border-[#1a1a2e] bg-[#1a1a2e]' : 'border-kb-border'}`}>
                            {i < pinInput.length && (
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {pinLayout.map((d, i) => (
                          <button key={i}
                            onClick={() => d !== null && handlePinDigit(d)}
                            className={`h-12 rounded text-[16px] font-bold border transition-colors
                              ${d === null
                                ? 'invisible'
                                : 'border-kb-border text-kb-text hover:bg-kb-beige-light active:bg-kb-border'}`}>
                            {d}
                          </button>
                        ))}
                        {/* 삭제 버튼 */}
                        <button onClick={() => setPinInput(p => p.slice(0, -1))}
                          className="h-12 rounded text-[13px] border border-kb-border text-kb-text-muted hover:bg-kb-beige-light col-start-3">
                          ←
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 페이지 본문 ── */}
              <div className="border border-kb-border bg-[#FFFBF0] px-5 py-4 mb-5 text-[13px] text-kb-text-body space-y-1">
                <p>· 입력하신 내용을 다시 한 번 확인하세요.</p>
                <p>· 이체금액, 자동이체일, 받는분 계좌번호 등을 꼼꼼히 확인하신 후 인증을 진행해 주세요.</p>
              </div>

              {/* 계좌정보 요약 */}
              <div className="border border-t-2 border-t-kb-text border-kb-border mb-4">
                <div className="px-5 py-4">
                  <p className="text-[14px] font-bold text-kb-text mb-3">계좌정보</p>
                  <table className="w-full text-[13px]">
                    <tbody>
                      {[
                        { label: '출금계좌번호', value: `${displayFromAcc} (${displayFromAccName})` },
                        { label: '입금계좌번호', value: `${toBank} ${displayToAccount}` },
                        { label: '받는분',       value: displayReceiver },
                      ].map(row => (
                        <tr key={row.label}>
                          <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36 whitespace-nowrap">{row.label}</td>
                          <td className="border border-kb-border px-4 py-3">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 자동이체정보 요약 */}
              <div className="border border-t-2 border-t-kb-text border-kb-border mb-6">
                <div className="px-5 py-4">
                  <p className="text-[14px] font-bold text-kb-text mb-3">자동이체정보 <span className="text-[12px] font-normal text-kb-text-muted ml-1">(타행계좌)</span></p>
                  <table className="w-full text-[13px]">
                    <tbody>
                      {[
                        { label: '이체금액',       value: `${amount || '100,000'}원` },
                        { label: '수수료',          value: '300원' },
                        { label: '이체주기',        value: cycle === '선택' ? '매월' : cycle },
                        { label: '자동이체일',      value: `매월 ${transferDay}일` },
                        { label: '이체기간',        value: `${startYear}.${padZero(startMonth)}.${padZero(startDay)} ~ ${endYear}.${padZero(endMonth)}` },
                        { label: '내 통장 표시',    value: myDisplay },
                        { label: '받는분 통장 표시', value: receiverMemo || '(미입력 - 송금자 이름 표시)' },
                      ].map(row => (
                        <tr key={row.label}>
                          <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36 whitespace-nowrap">{row.label}</td>
                          <td className="border border-kb-border px-4 py-3">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 인증 방식 선택 */}
              {authPhase === 'none' && (
                <div className="border border-t-2 border-t-kb-text border-kb-border mb-6">
                  <div className="px-5 py-4">
                    <p className="text-[14px] font-bold text-kb-text mb-4">추가 본인 인증 <span className="text-[12px] font-normal text-kb-text-muted ml-1">(택 1)</span></p>
                    <div className="flex gap-4 mb-5">
                      {([
                        { id: 'ARS', icon: '📞', label: 'ARS 인증', desc: '등록된 전화로 자동 발신하여 인증합니다.' },
                        { id: '해외출국확인', icon: '✈️', label: '해외출국확인', desc: '해외 체류 중인 경우 선택하세요.' },
                      ] as const).map(opt => (
                        <label key={opt.id}
                          className={`flex-1 flex items-start gap-3 border px-4 py-4 cursor-pointer transition-colors rounded
                            ${authMethod === opt.id ? 'border-kb-text bg-[#FFFBF0]' : 'border-kb-border hover:bg-kb-beige-light'}`}>
                          <input type="radio" name="authMethod" value={opt.id}
                            checked={authMethod === opt.id}
                            onChange={() => setAuthMethod(opt.id)}
                            className="mt-0.5 accent-kb-text" />
                          <div>
                            <p className="text-[13px] font-bold text-kb-text flex items-center gap-1.5">
                              <span>{opt.icon}</span>{opt.label}
                            </p>
                            <p className="text-[11px] text-kb-text-muted mt-0.5">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="flex justify-center gap-3">
                      <button onClick={() => setStep(1)}
                        className="border border-kb-border px-10 py-3 text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                        이전
                      </button>
                      <button onClick={handleAuthStart}
                        className="bg-kb-yellow px-10 py-3 text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">
                        인증받기
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 보안매체 비밀번호 입력 */}
              {(authPhase === 'security' || authPhase === 'fincert1' || authPhase === 'fincert2' || authPhase === 'complete') && (
                <div className="border border-t-2 border-t-kb-text border-kb-border mb-6">
                  <div className="px-5 py-4">
                    <p className="text-[14px] font-bold text-kb-text mb-4">보안매체 비밀번호 입력</p>

                    {/* 보안카드 그리드 */}
                    <div className="mb-4">
                      <p className="text-[12px] text-kb-text-muted mb-2">· 아래 보안카드에서 요청 위치의 번호를 확인 후 입력하세요.</p>
                      <div className="inline-block border border-kb-border">
                        <table className="text-[11px] border-collapse">
                          <thead>
                            <tr>
                              <th className="border border-kb-border bg-[#f0f0f0] px-2.5 py-1.5 text-kb-text-muted font-semibold w-8"></th>
                              {CARD_COLS.map(c => (
                                <th key={c} className={`border border-kb-border px-2.5 py-1.5 font-semibold w-8
                                  ${c === SECURITY_PROMPT.col ? 'bg-kb-yellow text-kb-text' : 'bg-[#f0f0f0] text-kb-text-muted'}`}>
                                  {c}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {CARD_ROWS.map(r => (
                              <tr key={r}>
                                <td className={`border border-kb-border px-2.5 py-1.5 font-semibold text-center
                                  ${r === SECURITY_PROMPT.row ? 'bg-kb-yellow text-kb-text' : 'bg-[#f0f0f0] text-kb-text-muted'}`}>
                                  {r}
                                </td>
                                {CARD_COLS.map(c => (
                                  <td key={c}
                                    className={`border border-kb-border px-2.5 py-1.5 text-center font-mono
                                      ${r === SECURITY_PROMPT.row && c === SECURITY_PROMPT.col
                                        ? 'bg-[#fff9d9] font-bold text-kb-text'
                                        : 'text-kb-text-body'}`}>
                                    {MOCK_CARD[`${r}${c}`]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[13px] text-kb-text-body whitespace-nowrap">
                        보안카드 <span className="font-bold text-kb-text">{SECURITY_PROMPT.row}{SECURITY_PROMPT.col}</span> 번 :
                      </span>
                      <input
                        type="password"
                        value={securityInput}
                        onChange={e => setSecurityInput(e.target.value)}
                        maxLength={2}
                        placeholder="00"
                        disabled={authPhase !== 'security'}
                        className="border border-kb-border px-3 py-1.5 text-[13px] w-20 outline-none text-center tracking-widest disabled:bg-kb-beige-light"
                      />
                    </div>

                    {authPhase === 'security' && (
                      <div className="flex justify-center gap-3">
                        <button onClick={() => setAuthPhase('none')}
                          className="border border-kb-border px-10 py-3 text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                          이전
                        </button>
                        <button
                          onClick={() => {
                            if (!securityInput) { alert('보안매체 비밀번호를 입력해주세요.'); return }
                            setAuthPhase('fincert1')
                          }}
                          className="bg-kb-yellow px-10 py-3 text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">
                          확인
                        </button>
                      </div>
                    )}

                    {(authPhase === 'fincert1' || authPhase === 'fincert2') && (
                      <p className="text-[12px] text-blue-600 font-semibold text-center">금융인증서비스 인증 진행 중...</p>
                    )}

                    {authPhase === 'complete' && (
                      <p className="text-[12px] text-green-600 font-semibold flex items-center gap-1.5">
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3,8 6.5,11.5 13,4.5"/>
                        </svg>
                        인증이 완료되었습니다.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 등록 버튼 (인증 완료 후) */}
              {authPhase === 'complete' && (
                <div className="flex justify-center gap-3 mt-4">
                  <button onClick={() => setStep(1)}
                    className="border border-kb-border px-10 py-3 text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                    이전
                  </button>
                  <button onClick={() => setStep(3)}
                    className="bg-kb-yellow px-10 py-3 text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">
                    등록
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ────────────── STEP 4: 등록완료 ────────────── */}
          {step === 3 && (
            <div>
              <div className="flex justify-center mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  </div>
                  <p className="text-[20px] font-bold text-kb-text">자동이체 등록이 완료되었습니다.</p>
                </div>
              </div>

              {/* 거래 기본 정보 */}
              <div className="border border-t-2 border-t-kb-text border-kb-border mb-4">
                <div className="px-5 py-4">
                  <p className="text-[14px] font-bold text-kb-text mb-3">자동이체 등록 결과</p>
                  <table className="w-full text-[13px]">
                    <tbody>
                      {[
                        { label: '거래종류', value: '자동이체 등록' },
                        { label: '거래일시', value: txDateTime },
                      ].map(row => (
                        <tr key={row.label}>
                          <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36 whitespace-nowrap">{row.label}</td>
                          <td className="border border-kb-border px-4 py-3">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 계좌정보 */}
              <div className="border border-kb-border mb-4">
                <div className="px-5 py-4">
                  <p className="text-[14px] font-bold text-kb-text mb-3">계좌정보</p>
                  <table className="w-full text-[13px]">
                    <tbody>
                      {[
                        { label: '출금계좌번호', value: `${displayFromAcc} (${displayFromAccName})` },
                        { label: '입금계좌번호', value: `${toBank} ${displayToAccount}` },
                        { label: '받는분',       value: displayReceiver },
                      ].map(row => (
                        <tr key={row.label}>
                          <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36 whitespace-nowrap">{row.label}</td>
                          <td className="border border-kb-border px-4 py-3">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 자동이체정보 */}
              <div className="border border-kb-border mb-8">
                <div className="px-5 py-4">
                  <p className="text-[14px] font-bold text-kb-text mb-3">자동이체정보</p>
                  <table className="w-full text-[13px]">
                    <tbody>
                      {[
                        { label: '이체금액',       value: `${amount || '100,000'}원` },
                        { label: '수수료',          value: '300원' },
                        { label: '이체주기',        value: cycle === '선택' ? '매월' : cycle },
                        { label: '자동이체일',      value: `매월 ${transferDay}일` },
                        { label: '이체기간',        value: `${startYear}.${padZero(startMonth)}.${padZero(startDay)} ~ ${endYear}.${padZero(endMonth)}` },
                        { label: '내 통장 표시',    value: myDisplay },
                        { label: '받는분 통장 표시', value: receiverMemo || '(송금자 이름 표시)' },
                      ].map(row => (
                        <tr key={row.label}>
                          <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36 whitespace-nowrap">{row.label}</td>
                          <td className="border border-kb-border px-4 py-3">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Link href="/transfer/auto-service/manage"
                  className="border border-kb-border px-10 py-3 text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                  등록내역조회
                </Link>
                <button onClick={() => alert('전자확인증 출력')}
                  className="border border-kb-border px-10 py-3 text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                  전자확인증
                </button>
                <Link href="/transfer/account"
                  className="bg-kb-yellow px-10 py-3 text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">
                  계좌이체
                </Link>
                <Link href="/personal"
                  className="border border-kb-border px-10 py-3 text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                  개인홈
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── 약관 모달 ── */}
      {modalOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white w-[680px] max-h-[80vh] flex flex-col border border-kb-border shadow-2xl">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-kb-border">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0" stroke="currentColor" strokeWidth="1.5">
                  <line x1="3" y1="1" x2="3" y2="19"/><line x1="3" y1="1" x2="17" y2="1"/>
                  <line x1="3" y1="10" x2="13" y2="10"/>
                </svg>
                <p className="text-[13px] font-bold text-kb-text">약관동의 및 사용자 본인 확인</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-kb-text-muted hover:text-kb-text">
                  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="10" cy="10" r="8"/><line x1="6" y1="10" x2="14" y2="10"/>
                    <line x1="10" y1="6" x2="10" y2="14"/>
                  </svg>
                </button>
                <button onClick={() => setModalOpen(null)} className="text-kb-text-muted hover:text-kb-text text-[18px] leading-none">✕</button>
              </div>
            </div>

            {/* 모달 본문 */}
            <div className="flex-1 overflow-y-auto px-10 py-6 text-[13px] leading-relaxed">
              {/* KB 로고 */}
              <div className="flex justify-end mb-2">
                <div className="border border-kb-border px-3 py-1 text-[11px] text-kb-text-muted">AX풀뱅크</div>
              </div>
              <h2 className="text-[17px] font-bold text-center mb-8">{TERMS_CONTENT[modalOpen].title}</h2>
              {TERMS_CONTENT[modalOpen].articles.map((article, i) => (
                <div key={i} className="mb-5">
                  <p className="font-bold text-kb-text mb-2">{article.title}</p>
                  {article.items.map((item, j) => (
                    <p key={j} className="text-kb-text-body ml-3 mb-1.5">{item}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* 확인 버튼 */}
            <div className="px-5 py-4 border-t border-kb-border flex justify-center">
              <button
                onClick={() => {
                  if (!checked[modalOpen]) handleCheck(modalOpen)
                  if (sequential && modalOpen === 'kb') {
                    setModalOpen('other')
                  } else {
                    setSequential(false)
                    setModalOpen(null)
                  }
                }}
                className="flex items-center gap-2 bg-kb-yellow px-10 py-2.5 text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3,8 6.5,11.5 13,4.5"/>
                </svg>
                확인
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  )
}
