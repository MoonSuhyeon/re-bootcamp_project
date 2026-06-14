'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import InquirySidebar from '@/components/inquiry/InquirySidebar'

// ── 상수 ──────────────────────────────────────────────────────────────────────

const STEP_LABELS = ['서비스 이용 동의', '휴대폰 본인인증', '계좌선택', '입력정보 확인']

const CARRIERS = [
  { id: 'skt', label: 'SKT' },
  { id: 'skt-mvno', label: 'SKT 알뜰폰' },
  { id: 'kt', label: 'KT' },
  { id: 'kt-mvno', label: 'KT 알뜰폰' },
  { id: 'lgu', label: 'LG U+' },
  { id: 'lgu-mvno', label: 'LG U+ 알뜰폰' },
]

type BankAccount = {
  id: string
  bank: string
  bankColor: string
  type: string
  productName: string
  accountNumber: string
  balance: number
  selected: boolean
}

const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'w1', bank: '우리', bankColor: '#004A97',
    type: '입출금', productName: '우리 SUPER주거래통장',
    accountNumber: '1002057908407', balance: 94, selected: true,
  },
  {
    id: 'w2', bank: '우리', bankColor: '#004A97',
    type: '예금·적금', productName: 'WON플러스에금',
    accountNumber: '1020415972039', balance: 1000000, selected: true,
  },
  {
    id: 'g1', bank: '광주', bankColor: '#00447C',
    type: '입출금', productName: '보통예금',
    accountNumber: '074107652623', balance: 500000, selected: false,
  },
  {
    id: 'g2', bank: '광주', bankColor: '#00447C',
    type: '예금·적금', productName: '정기예금',
    accountNumber: '074201234567', balance: 3000000, selected: false,
  },
  {
    id: 'g3', bank: '광주', bankColor: '#00447C',
    type: '입출금', productName: '자유입출금통장',
    accountNumber: '074309876543', balance: 120000, selected: false,
  },
  {
    id: 'g4', bank: '광주', bankColor: '#00447C',
    type: '예금·적금', productName: '자유적금',
    accountNumber: '074412345678', balance: 200000, selected: false,
  },
  {
    id: 'g5', bank: '광주', bankColor: '#00447C',
    type: '입출금', productName: '보통예금',
    accountNumber: '074587654321', balance: 0, selected: false,
  },
]

// ── 공통 컴포넌트 ──────────────────────────────────────────────────────────────

function StepIndicator({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-1">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1
        return n === active ? (
          <span
            key={n}
            className="px-4 py-1.5 bg-kb-yellow text-[13px] font-bold text-kb-text rounded-full whitespace-nowrap"
          >
            {n}. {label}
          </span>
        ) : (
          <span
            key={n}
            className="w-8 h-8 rounded-full border border-kb-border flex items-center justify-center text-[13px] text-kb-text-muted"
          >
            {n}
          </span>
        )
      })}
    </div>
  )
}

function Breadcrumb() {
  return (
    <div className="flex justify-end mb-2 text-[12px] text-kb-text-muted gap-1 items-center">
      <span>개인뱅킹</span><span>&gt;</span>
      <span>조회</span><span>&gt;</span>
      <span>계좌조회</span><span>&gt;</span>
      <span>다른금융 조회</span><span>&gt;</span>
      <span className="text-kb-blue">다른금융 등록</span>
    </div>
  )
}

// ── Step 2: 휴대폰 본인인증 ───────────────────────────────────────────────────

function PhoneAuthStep({ onNext }: { onNext: () => void }) {
  const [carrier, setCarrier] = useState('skt')
  const [phone, setPhone] = useState('')
  const [authSent, setAuthSent] = useState(false)
  const [authCode, setAuthCode] = useState('')
  const [countdown, setCountdown] = useState(290) // 4:50

  useEffect(() => {
    if (!authSent) return
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown(v => v - 1), 1000)
    return () => clearInterval(timer)
  }, [authSent, countdown])

  const mm = String(Math.floor(countdown / 60)).padStart(1, '0')
  const ss = String(countdown % 60).padStart(2, '0')

  function handleSendAuth() {
    if (!phone) return
    setAuthSent(true)
    setCountdown(290)
  }

  function handleResend() {
    setCountdown(290)
    setAuthCode('')
  }

  return (
    <>
      <StepIndicator active={2} />
      <div className="flex items-center justify-between mb-4 mt-1">
        <h1 className="text-[22px] font-bold text-kb-text">다른금융 조회</h1>
      </div>

      <h2 className="text-[16px] font-bold text-kb-text mb-4">휴대폰 본인인증</h2>

      <div className="border border-kb-border mb-6">
        {/* 이름 */}
        <div className="flex items-center px-4 py-3 border-b border-kb-border">
          <span className="text-[13px] text-kb-text w-28">이름</span>
          <span className="text-[13px] text-kb-text">홍길동</span>
        </div>
        {/* 주민등록번호 */}
        <div className="flex items-center px-4 py-3 border-b border-kb-border">
          <span className="text-[13px] text-kb-text w-28">주민등록번호</span>
          <span className="text-[13px] text-kb-text">000101 - 1******</span>
        </div>
        {/* 통신사 */}
        <div className="flex items-start px-4 py-3 border-b border-kb-border">
          <span className="text-[13px] text-kb-text w-28 pt-1">통신사</span>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {CARRIERS.map(c => (
              <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="carrier"
                  value={c.id}
                  checked={carrier === c.id}
                  onChange={() => setCarrier(c.id)}
                  className="accent-kb-yellow"
                />
                <span className="text-[13px] text-kb-text">{c.label}</span>
              </label>
            ))}
          </div>
        </div>
        {/* 휴대폰번호 */}
        <div className="flex items-center px-4 py-3 border-b border-kb-border">
          <span className="text-[13px] text-kb-text w-28">휴대폰번호</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="- 없이 숫자만 입력"
              maxLength={11}
              className="border border-kb-border px-3 py-1.5 text-[13px] w-44 outline-none"
            />
            <button
              onClick={authSent ? handleResend : handleSendAuth}
              className="border border-kb-border px-4 py-1.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light whitespace-nowrap"
            >
              {authSent ? '인증번호 재발송' : '인증번호 요청'}
            </button>
          </div>
        </div>
        {/* 인증번호 입력 (authSent 후 표시) */}
        {authSent && (
          <div className="flex items-center px-4 py-3">
            <span className="text-[13px] text-kb-text w-28">인증번호 입력</span>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={authCode}
                onChange={e => setAuthCode(e.target.value.replace(/\D/g, ''))}
                placeholder="숫자 6자리 입력"
                maxLength={6}
                className="border border-kb-border px-3 py-1.5 text-[13px] w-44 outline-none"
              />
              <span className={`text-[13px] font-semibold ${countdown <= 60 ? 'text-red-500' : 'text-kb-text-body'}`}>
                {mm}:{ss}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 안내 문구 */}
      <ul className="mb-6 space-y-1 text-[12px] text-kb-text-muted">
        <li>· [휴대폰의 확인] 버튼을 눌러 인증을 위한 SMS를 전송해주세요.</li>
        <li>· 입력하신 휴대폰번호로 SMS가 발송됩니다.</li>
        <li>· 본인명의 휴대폰에서만 이용 가능합니다.</li>
        <li>· 휴대폰 인증이 불가능하거나 본인명의가 아닌 경우 직접 입력하기로 진행해주세요.</li>
      </ul>
      <button className="text-[12px] text-kb-blue underline mb-6">계좌 직접 입력하기 ›</button>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="px-14 py-3 border border-kb-border text-[14px] text-kb-text-body hover:bg-kb-beige-light"
        >
          취소
        </button>
        <button
          onClick={onNext}
          disabled={authSent && authCode.length < 6}
          className="px-14 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark disabled:opacity-50"
        >
          확인
        </button>
      </div>
    </>
  )
}

// ── Step 3: 계좌선택 ──────────────────────────────────────────────────────────

function AccountSelectStep({
  accounts,
  setAccounts,
  onNext,
  onPrev,
}: {
  accounts: BankAccount[]
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>
  onNext: () => void
  onPrev: () => void
}) {
  const [activeTab, setActiveTab] = useState<'은행' | '증권'>('은행')
  const [expandedBanks, setExpandedBanks] = useState<Set<string>>(new Set(['우리']))

  const banks = Array.from(new Set(accounts.map(a => a.bank)))

  function toggleBank(bank: string) {
    setExpandedBanks(prev => {
      const next = new Set(prev)
      next.has(bank) ? next.delete(bank) : next.add(bank)
      return next
    })
  }

  function toggleAccount(id: string) {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a))
  }

  function toggleBankAll(bank: string, checked: boolean) {
    setAccounts(prev => prev.map(a => a.bank === bank ? { ...a, selected: checked } : a))
  }

  function deselectAll() {
    setAccounts(prev => prev.map(a => ({ ...a, selected: false })))
  }

  const bankCount = accounts.length
  const selectedCount = accounts.filter(a => a.selected).length

  return (
    <>
      <StepIndicator active={3} />
      <div className="flex items-center justify-between mb-4 mt-1">
        <h1 className="text-[22px] font-bold text-kb-text">다른금융 조회</h1>
      </div>

      {/* 안내 */}
      <div className="border border-kb-border bg-kb-beige-light px-4 py-3 mb-5 text-[13px] text-kb-text-body space-y-1">
        <p>· 어카운트인포 서비스로 불러온 다른금융 계좌목록입니다.</p>
        <p>· 한 번에 최다 10개까지 계좌를 선택하여 등록할 수 있습니다.</p>
        <p>· 입출금, 예·적금, 펀드, 증권통합 계좌를 등록할 수 있습니다.</p>
        <p>· 비활동성 계좌(거래중지계좌 등) 및 일부 증권종합계좌는 등록이 불가 할 수 있습니다.</p>
        <p>· 등록할 계좌를 선택해주세요.</p>
      </div>

      <h2 className="text-[15px] font-bold text-kb-text mb-3">계좌통합한 계좌 목록</h2>

      {/* 탭 */}
      <div className="flex border-b border-kb-border mb-3">
        {(['은행', '증권'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-10 py-2 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-kb-yellow text-kb-text'
                : 'border-transparent text-kb-text-muted hover:text-kb-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === '은행' && (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-kb-text-body">
              은행 {bankCount} 증권 0
            </span>
            <button
              onClick={deselectAll}
              className="border border-kb-border px-3 py-1 text-[12px] text-kb-text-body hover:bg-kb-beige-light"
            >
              전체해제
            </button>
          </div>

          <div className="border border-kb-border">
            {banks.map(bank => {
              const bankAccounts = accounts.filter(a => a.bank === bank)
              const bankColor = bankAccounts[0]?.bankColor ?? '#555'
              const isExpanded = expandedBanks.has(bank)
              const allChecked = bankAccounts.every(a => a.selected)
              const someChecked = bankAccounts.some(a => a.selected)

              return (
                <div key={bank} className="border-b border-kb-border last:border-b-0">
                  {/* 은행 헤더 */}
                  <button
                    onClick={() => toggleBank(bank)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-kb-beige-light"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                        style={{ backgroundColor: bankColor }}
                      >
                        {bank[0]}
                      </span>
                      <span className="text-[13px] font-semibold text-kb-text">
                        {bank} (총 {bankAccounts.length}계좌)
                      </span>
                    </div>
                    <span className="text-[12px] text-kb-text-muted">{isExpanded ? '∧' : '∨'}</span>
                  </button>

                  {/* 계좌 목록 */}
                  {isExpanded && (
                    <div className="border-t border-kb-border">
                      {/* 전체 체크 */}
                      <div className="flex items-center gap-2 px-4 py-2 bg-kb-beige-light border-b border-kb-border">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          ref={el => { if (el) el.indeterminate = someChecked && !allChecked }}
                          onChange={e => toggleBankAll(bank, e.target.checked)}
                          className="accent-kb-yellow w-4 h-4"
                        />
                        <span className="text-[12px] text-kb-text-muted">전체선택</span>
                      </div>

                      <table className="w-full text-[13px]">
                        <thead>
                          <tr className="bg-kb-beige-light border-b border-kb-border">
                            <th className="px-4 py-2 text-center font-semibold text-kb-text w-10"></th>
                            <th className="px-4 py-2 text-center font-semibold text-kb-text">계좌종류</th>
                            <th className="px-4 py-2 text-left font-semibold text-kb-text">계좌정보</th>
                            <th className="px-4 py-2 text-right font-semibold text-kb-text">잔액</th>
                            <th className="px-4 py-2 text-center font-semibold text-kb-text">등록구분</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bankAccounts.map(acc => (
                            <tr key={acc.id} className="border-b border-kb-border last:border-b-0">
                              <td className="px-4 py-2.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={acc.selected}
                                  onChange={() => toggleAccount(acc.id)}
                                  className="accent-kb-yellow w-4 h-4"
                                />
                              </td>
                              <td className="px-4 py-2.5 text-center text-kb-text-body">{acc.type}</td>
                              <td className="px-4 py-2.5">
                                <p className="text-kb-text">{acc.productName}</p>
                                <p className="text-kb-text-muted text-[12px]">{acc.accountNumber}</p>
                              </td>
                              <td className="px-4 py-2.5 text-right text-kb-text">
                                {acc.balance.toLocaleString()}원
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <span className="text-kb-blue text-[12px]">등록가능</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <p className="text-[12px] text-kb-text-muted mt-2">
            선택된 계좌: {selectedCount}개
          </p>
        </>
      )}

      {activeTab === '증권' && (
        <div className="border border-kb-border py-10 text-center text-[13px] text-kb-text-muted">
          조회된 증권 계좌가 없습니다.
        </div>
      )}

      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={onPrev}
          className="px-14 py-3 border border-kb-border text-[14px] text-kb-text-body hover:bg-kb-beige-light"
        >
          이전
        </button>
        <button
          onClick={onNext}
          disabled={selectedCount === 0}
          className="px-14 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark disabled:opacity-50"
        >
          확인
        </button>
      </div>
    </>
  )
}

// ── Step 4: 입력정보 확인 ─────────────────────────────────────────────────────

function ConfirmStep({
  accounts,
  onComplete,
  onPrev,
}: {
  accounts: BankAccount[]
  onComplete: () => void
  onPrev: () => void
}) {
  const selected = accounts.filter(a => a.selected)
  const [arsPhase, setArsPhase] = useState<null | 'phone' | 'approved'>(null)

  return (
    <>
      <StepIndicator active={4} />
      <div className="flex items-center justify-between mb-4 mt-1">
        <h1 className="text-[22px] font-bold text-kb-text">다른금융 조회</h1>
      </div>

      {/* 안내 */}
      <div className="border border-kb-border bg-kb-beige-light px-4 py-3 mb-5 text-[13px] text-kb-text-body">
        · 법령에 따라 조회 동의는 최대 5년까지 유효하며, 1년마다 자동의 여부를 확인해야 합니다.
      </div>

      <h2 className="text-[14px] font-bold text-kb-text mb-3">등록할 계좌정보</h2>
      <table className="w-full border-collapse border border-kb-border mb-6 text-[13px]">
        <thead>
          <tr className="bg-kb-beige-light">
            <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">기관명</th>
            <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">계좌번호</th>
          </tr>
        </thead>
        <tbody>
          {selected.map(acc => (
            <tr key={acc.id}>
              <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{acc.bank}</td>
              <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{acc.accountNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="mb-5 space-y-1 text-[12px] text-kb-text-muted">
        <li>· [ARS인증 요청]버튼을 눌러 ARS인증 절차를 진행해 주세요.</li>
        <li>· 계좌등록을 위해서는 ARS인증을 완료해야 합니다.</li>
      </ul>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setArsPhase('phone')}
          className="px-10 py-2.5 bg-kb-yellow text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark"
        >
          ARS인증 요청
        </button>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={onPrev}
          className="px-14 py-3 border border-kb-border text-[14px] text-kb-text-body hover:bg-kb-beige-light"
        >
          이전
        </button>
        <button
          onClick={onComplete}
          disabled={arsPhase !== 'approved'}
          className="px-14 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark disabled:opacity-50"
        >
          확인
        </button>
      </div>

      {/* ARS 모달 */}
      {arsPhase && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-kb-border w-[420px] shadow-lg">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-kb-border bg-kb-beige-light">
              <span className="text-[14px] font-bold text-kb-text">ARS인증</span>
              <button
                onClick={() => setArsPhase(null)}
                className="text-kb-text-muted hover:text-kb-text text-[18px] leading-none"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-5">
              {arsPhase === 'phone' ? (
                <>
                  <div className="bg-kb-beige-light border border-kb-border px-4 py-3 mb-4 text-[13px] text-kb-text-body space-y-1">
                    <p>· 본인확인을 위해 전화인증을 수행할 전화번호 선택 후 [확인]버튼을 선택하여 주시기 바랍니다.</p>
                    <p>· 정보통신망법 개정에 따라 2013.2.18부터 휴대폰 본인인증 서비스가 종료됩니다. 은행에 등록된 휴대폰번호로 인증해 주시기 바랍니다.</p>
                    <button className="text-kb-blue underline text-[12px]">고객정보수정 ›</button>
                  </div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[13px] text-kb-text w-20">전화번호</span>
                    <span className="text-[13px] text-kb-text">010-90**-99**</span>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setArsPhase('approved')}
                      className="px-10 py-2 bg-kb-yellow text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark"
                    >
                      확인
                    </button>
                    <button
                      onClick={() => setArsPhase(null)}
                      className="px-10 py-2 border border-kb-border text-[14px] text-kb-text-body hover:bg-kb-beige-light"
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-kb-beige-light border border-kb-border px-4 py-3 mb-4 text-[13px] text-kb-text-body space-y-1">
                    <p>· 고객님께 ARS인증을 위한 전화를 걸고 있습니다.</p>
                    <p>· 전화를 받은 후 승인번호를 눌러주시기 바랍니다.</p>
                  </div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[13px] text-kb-text w-20">승인번호</span>
                    <span className="text-[16px] font-bold text-kb-text">20</span>
                  </div>
                  <ul className="text-[12px] text-kb-text-muted space-y-1 mb-5">
                    <li>· 전화승인 처리가 완료되고 나면 아래에 전화승인완료 버튼을 눌러주세요.</li>
                    <li>· 전화가 오지 않을 경우 전화번호를 다시하거나 착신이 정지되어 있는지 확인하시기 바랍니다.</li>
                    <li>· 착신전환된 전화번호로는 ARS인증이 불가능하오니 유의하시기 바랍니다.</li>
                  </ul>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setArsPhase(null)
                        onComplete()
                      }}
                      className="px-8 py-2 bg-kb-yellow text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark"
                    >
                      전화승인완료
                    </button>
                    <button
                      onClick={() => setArsPhase(null)}
                      className="px-8 py-2 border border-kb-border text-[14px] text-kb-text-body hover:bg-kb-beige-light"
                    >
                      취소
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── 완료 페이지 ───────────────────────────────────────────────────────────────

function CompleteStep({ accounts }: { accounts: BankAccount[] }) {
  const router = useRouter()
  const selected = accounts.filter(a => a.selected)

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[22px] font-bold text-kb-text">다른금융 조회</h1>
      </div>

      {/* 완료 메시지 */}
      <div className="border-2 border-kb-yellow rounded px-6 py-6 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 flex-shrink-0">
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            <rect x="6" y="6" width="36" height="36" rx="4" fill="#F5F0E8" stroke="#CCCCCC" strokeWidth="1.5"/>
            <circle cx="24" cy="24" r="10" fill="none" stroke="#CCCCCC" strokeWidth="1.5"/>
            <line x1="20" y1="24" x2="23" y2="27" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round"/>
            <line x1="23" y1="27" x2="28" y2="21" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-[15px] font-bold text-kb-text">
          총 {selected.length}건의 다른금융 계좌 등록이 완료되었습니다.
        </p>
      </div>

      <h2 className="text-[14px] font-bold text-kb-text mb-3">계좌정보</h2>
      <table className="w-full border-collapse border border-kb-border mb-6 text-[13px]">
        <thead>
          <tr className="bg-kb-beige-light">
            <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">계좌명</th>
            <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">계좌번호</th>
            <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">상품종류</th>
            <th className="border border-kb-border px-4 py-2.5 text-center font-semibold text-kb-text">처리상태</th>
          </tr>
        </thead>
        <tbody>
          {selected.map(acc => (
            <tr key={acc.id}>
              <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{acc.productName}</td>
              <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">
                {acc.bank}{acc.accountNumber}
              </td>
              <td className="border border-kb-border px-4 py-2.5 text-center text-kb-text">{acc.type}</td>
              <td className="border border-kb-border px-4 py-2.5 text-center">
                <span className="text-kb-blue font-semibold">정상</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center">
        <button
          onClick={() => router.push('/inquiry/accounts')}
          className="px-14 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark"
        >
          확인
        </button>
      </div>
    </>
  )
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────

type Step = 'phone-auth' | 'account-select' | 'confirm' | 'complete'

export default function OtherFinanceRegisterPage() {
  const [step, setStep] = useState<Step>('phone-auth')
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1024px] mx-auto px-4 py-6 flex gap-6">
        <InquirySidebar />

        <main className="flex-1 pl-8 pt-4 pb-12">
          <Breadcrumb />

          {step === 'phone-auth' && (
            <PhoneAuthStep onNext={() => setStep('account-select')} />
          )}
          {step === 'account-select' && (
            <AccountSelectStep
              accounts={accounts}
              setAccounts={setAccounts}
              onNext={() => setStep('confirm')}
              onPrev={() => setStep('phone-auth')}
            />
          )}
          {step === 'confirm' && (
            <ConfirmStep
              accounts={accounts}
              onComplete={() => setStep('complete')}
              onPrev={() => setStep('account-select')}
            />
          )}
          {step === 'complete' && <CompleteStep accounts={accounts} />}
        </main>
      </div>
    </div>
  )
}
