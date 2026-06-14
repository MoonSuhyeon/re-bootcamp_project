'use client'

import Link from 'next/link'
import { useState } from 'react'
import DepositSidebar from '@/components/products/DepositSidebar'

const STEP_LABELS = ['1. 계좌조회/선택', '2. 해지계좌확인/정보입력', '3. 입력확인', '4. 해지완료']

const FIXED_ACCOUNTS = [
  {
    no: '557315-2709289', name: 'KB Star 정기예금', amount: '1,000,000',
    date: '2026.05.25', maturity: '2026.06.25',
    terms: [{ id: 1, regDate: '2026.05.25', matDate: '2026.06.25', amount: '1,000,000' }],
  },
]
const INSTALLMENT_ACCOUNTS: { no: string; name: string; amount: string; date: string }[] = []

const FREE_ACCOUNTS = [
  { no: '110-234-567890', name: 'AX풀뱅크ONE통장-보통예금', amount: '1,000,000', date: '2024.01.01' },
]

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
const PIN_LAYOUT = [2, 9, 1, 5, 4, 3, 7, 6, 8, -1, 0, -2]

type MainStep = 1 | 2 | 3 | 4
type Step2Phase = 'termSelect' | 'infoInput'
type CertStep = 'hidden' | 'summary' | 'pin'

interface Selected {
  no: string
  name: string
  amount: string
  accountType: 'fixed' | 'installment' | 'free'
}

export default function DepositTerminatePage() {
  const [step, setStep] = useState<MainStep>(1)
  const [step2Phase, setStep2Phase] = useState<Step2Phase>('infoInput')
  const [fixedOpen, setFixedOpen] = useState(true)
  const [installOpen, setInstallOpen] = useState(true)
  const [freeOpen, setFreeOpen] = useState(true)
  const [selected, setSelected] = useState<Selected | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null)
  const [password, setPassword] = useState('')
  const [mouseInput, setMouseInput] = useState(false)
  const [smsCode, setSmsCode] = useState('')
  const [securityInput, setSecurityInput] = useState('')
  const [showCalcModal, setShowCalcModal] = useState(false)
  const [certStep, setCertStep] = useState<CertStep>('hidden')
  const [certPin, setCertPin] = useState('')

  const activeIdx = step === 1 ? 0 : step === 2 ? 1 : step === 3 ? 2 : 3

  function goTerminate(no: string, name: string, amount: string, type: 'fixed' | 'installment' | 'free') {
    setSelected({ no, name, amount, accountType: type })
    setSelectedTerm(null)
    setPassword('')
    setMouseInput(false)
    setStep2Phase(type === 'fixed' ? 'termSelect' : 'infoInput')
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleTermSelect() {
    if (selectedTerm === null) { alert('취급번호를 선택해주세요.'); return }
    setStep2Phase('infoInput')
  }

  function handleInfoConfirm() {
    if (!password && !mouseInput) { alert('해지계좌 비밀번호를 입력해주세요.'); return }
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleFinalConfirm() {
    if (!smsCode) { alert('SMS 인증번호를 입력해주세요.'); return }
    setCertStep('summary')
  }

  function handlePinInput(n: number) {
    if (n === -2) { setCertPin(p => p.slice(0, -1)); return }
    if (n === -1) return
    if (certPin.length < 6) setCertPin(p => p + String(n))
  }

  function handleCertPinConfirm() {
    if (certPin.length < 6) { alert('6자리 비밀번호를 입력해주세요.'); return }
    setCertStep('hidden')
    setCertPin('')
    setStep(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const detailRows = selected ? [
    { label: '해지계좌종류', value: selected.name, red: false },
    { label: '해지계좌번호', value: selected.no, red: false },
    { label: '해지구분', value: '중도해약', red: true },
    { label: '해지계좌원금', value: selected.amount, red: false },
    { label: '해지이자', value: '0', red: false },
    { label: '소득세', value: '0', red: false },
    { label: '주민세', value: '0', red: false },
    { label: '농특세', value: '0', red: false },
    { label: '세금합계', value: '0', red: false },
    { label: '세금정산후 이자', value: '0', red: false },
    { label: '기지급이자', value: '0', red: false },
    { label: '카드우대보너스', value: '0', red: false },
    { label: '기장수세금', value: '0', red: false },
    { label: '실 수령액', value: selected.amount, red: false },
    { label: '입금계좌번호', value: FREE_ACCOUNTS[0].no, red: false },
  ] : []

  return (
    <div className="max-w-kb-container mx-auto px-6 py-6">
      <div className="flex justify-end mb-3 text-[12px] text-kb-text-muted gap-1 items-center">
        <span>개인뱅킹</span><span>›</span>
        <span>금융상품</span><span>›</span>
        <span>예금</span><span>›</span>
        <span>예금 조회/해지</span><span>›</span>
        <Link href="/products/deposit/inquiry/terminate" className="hover:underline">예금해지</Link>
        <span>›</span>
        <Link href="#" className="text-kb-blue hover:underline">도움말</Link>
      </div>

      <div className="flex gap-6">
        <DepositSidebar />

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-[20px] font-bold text-kb-text">예금해지</h1>
            <div className="flex gap-1">
              {STEP_LABELS.map((label, i) => (
                <button key={i} className="px-4 py-1.5 text-[12px]"
                  style={i === activeIdx
                    ? { backgroundColor: '#5BC9A8', color: 'white', fontWeight: 'bold' }
                    : { border: '1px solid #ccc', backgroundColor: 'white', color: '#666' }}>
                  {i === activeIdx ? label : `${i + 1}`}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1: 계좌조회/선택 */}
          {step === 1 && (
            <>
              <div className="border border-kb-border bg-[#FAFAFA] px-4 py-3 mb-5 text-[12px] text-kb-text-body space-y-1">
                {[
                  '인터넷으로 해지 가능한 예금은 오른쪽 상단의 [도움말]을 참조하시기 바랍니다.',
                  '해지예상조회를 이용하여 해지면 고객님의 해지계좌번호를 다시 한번 확인하여 선택하기 바랍니다.',
                  <span key="r" className="text-[#E05555]">정약관련예금(분탁정약접저예금·정약부금·정약금·정약)과 장기주택마련저축은 추가사항이 필요한 상품으로 인터넷뱅킹을 통한 해지가 제한됩니다. (창구를 통한 해지는 가능합니다.)</span>,
                  '2019.2.27 이전 영업점 창구에서 신규가입한 거치식·적식예금은 당 창구를 통한 해지만 가능하며, 인터넷뱅킹을 통한 해지가 제한됩니다.(단. 2019.2.28 이후 영업점 창구에서 신규가입한 거치식 적식예금에 해당)',
                  '2019.2.27 이전 인터넷뱅킹, 스마트뱅킹에서 신규가입한 거치식·적식예금에금은 입출금이자유로운예금은 인터넷뱅킹을 통한 해지 시 본인 휴대전화(등록)에 등록된 번호로 SMS인증을 하게 가능합니다.',
                  <span key="r2">입출금이자유로운예금 해지 시 당 창구에서 본인계좌로만 입금됩니다. 각종 자동이체 및 카드 결제계좌로 사용되고 있을 경우 해지가 제한됩니다.(창구를 통한 해지는 가능합니다.)</span>,
                ].map((n, i) => (
                  <p key={i} className="flex gap-1.5"><span className="flex-shrink-0">-</span><span>{n}</span></p>
                ))}
              </div>

              {/* 거치식 */}
              <div className="border border-kb-border mb-3">
                <button onClick={() => setFixedOpen(v => !v)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-[#FAFAFA] border-b border-kb-border">
                  <span className="text-[13px] font-bold text-kb-text">거치식 예금계좌</span>
                  <span className="text-[11px] border border-kb-border px-3 py-1 bg-white hover:bg-kb-beige-light text-kb-text-muted">{fixedOpen ? '－' : '＋'}</span>
                </button>
                {fixedOpen && (
                  <table className="w-full border-collapse text-[13px]">
                    <tbody>
                      {FIXED_ACCOUNTS.map(acc => (
                        <tr key={acc.no} className="border-t border-kb-border">
                          <td className="px-4 py-3 text-kb-text-body">
                            <p>{acc.no}</p>
                            <p className="text-[11px] text-kb-text-muted mt-0.5">신규일 {acc.date} | 만기일 {acc.maturity}</p>
                          </td>
                          <td className="px-4 py-3 text-kb-text-body">{acc.name}</td>
                          <td className="px-4 py-3 text-right text-kb-text-body font-medium">{acc.amount}원</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1 justify-end">
                              <button
                                onClick={() => goTerminate(acc.no, acc.name, acc.amount, 'fixed')}
                                className="px-3 py-1.5 text-[12px] font-bold text-white hover:opacity-90"
                                style={{ backgroundColor: '#5BC9A8' }}>
                                해지
                              </button>
                              <button className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">
                                해지예상조회
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* 적립식 */}
              <div className="border border-kb-border mb-3">
                <button onClick={() => setInstallOpen(v => !v)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-[#FAFAFA] border-b border-kb-border">
                  <span className="text-[13px] font-bold text-kb-text">적립식 예금계좌</span>
                  <span className="text-[11px] border border-kb-border px-3 py-1 bg-white hover:bg-kb-beige-light text-kb-text-muted">{installOpen ? '－' : '＋'}</span>
                </button>
                {installOpen && (
                  INSTALLMENT_ACCOUNTS.length === 0
                    ? <div className="px-4 py-3 text-[13px] text-kb-text-muted">조회하실 내역이 없습니다</div>
                    : (
                      <table className="w-full border-collapse text-[13px]">
                        <tbody>
                          {INSTALLMENT_ACCOUNTS.map(acc => (
                            <tr key={acc.no} className="border-t border-kb-border">
                              <td className="px-4 py-3 text-kb-text-body">
                                <p>{acc.no}</p>
                                <p className="text-[11px] text-kb-text-muted mt-0.5">신규일 {acc.date} | 만기일</p>
                              </td>
                              <td className="px-4 py-3 text-kb-text-body">{acc.name}</td>
                              <td className="px-4 py-3 text-right text-kb-text-body font-medium">{acc.amount}원</td>
                              <td className="px-4 py-3 text-right">
                                <button className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">
                                  해지예상조회
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                )}
              </div>

              {/* 입출금이자유로운 */}
              <div className="border border-kb-border mb-3">
                <button onClick={() => setFreeOpen(v => !v)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-[#FAFAFA] border-b border-kb-border">
                  <span className="text-[13px] font-bold text-kb-text">입출금이자유로운 예금계좌</span>
                  <span className="text-[11px] border border-kb-border px-3 py-1 bg-white hover:bg-kb-beige-light text-kb-text-muted">{freeOpen ? '－' : '＋'}</span>
                </button>
                {freeOpen && (
                  <table className="w-full border-collapse text-[13px]">
                    <tbody>
                      {FREE_ACCOUNTS.map(acc => (
                        <tr key={acc.no} className="border-t border-kb-border">
                          <td className="px-4 py-3 text-kb-text-body">
                            <p>{acc.no}</p>
                            <p className="text-[11px] text-kb-text-muted mt-0.5">신규일 {acc.date}</p>
                          </td>
                          <td className="px-4 py-3 text-kb-text-body">{acc.name}</td>
                          <td className="px-4 py-3 text-right text-kb-text-body font-medium">{acc.amount}원</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1 justify-end">
                              <button
                                onClick={() => goTerminate(acc.no, acc.name, acc.amount, 'free')}
                                className="px-3 py-1.5 text-[12px] font-bold text-white hover:opacity-90"
                                style={{ backgroundColor: '#5BC9A8' }}>
                                해지
                              </button>
                              <button className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">
                                해지예상조회
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* STEP 2a: 거치식 취급번호 선택 */}
          {step === 2 && step2Phase === 'termSelect' && selected && (
            <>
              <div className="border border-kb-border bg-[#FAFAFA] px-4 py-3 mb-5 text-[12px] text-kb-text-body">
                <p className="flex gap-1.5"><span>-</span><span>거치식 예금계좌의 조회하실 취급번호를 선택하십시오.</span></p>
              </div>

              <div className="border border-kb-border mb-6">
                <div className="px-4 py-2.5 bg-kb-beige-light border-b border-kb-border">
                  <span className="text-[13px] font-semibold text-kb-text">계좌번호</span>
                  <span className="text-[13px] text-kb-text-body ml-4">{selected.no}</span>
                </div>
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-kb-beige-light">
                      <th className="border border-kb-border px-4 py-2 text-kb-text font-semibold">선택</th>
                      <th className="border border-kb-border px-4 py-2 text-kb-text font-semibold">취급번호</th>
                      <th className="border border-kb-border px-4 py-2 text-kb-text font-semibold">신규일</th>
                      <th className="border border-kb-border px-4 py-2 text-kb-text font-semibold">만기일</th>
                      <th className="border border-kb-border px-4 py-2 text-kb-text font-semibold">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FIXED_ACCOUNTS[0].terms.map(t => (
                      <tr key={t.id}>
                        <td className="border border-kb-border px-4 py-3 text-center">
                          <input type="radio" name="term" checked={selectedTerm === t.id}
                            onChange={() => setSelectedTerm(t.id)} />
                        </td>
                        <td className="border border-kb-border px-4 py-3 text-center text-kb-text-body">{t.id}</td>
                        <td className="border border-kb-border px-4 py-3 text-center text-kb-text-body">{t.regDate}</td>
                        <td className="border border-kb-border px-4 py-3 text-center text-kb-text-body">{t.matDate}</td>
                        <td className="border border-kb-border px-4 py-3 text-right text-kb-text-body">{t.amount}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center">
                <button onClick={handleTermSelect}
                  className="px-14 py-2.5 text-[14px] font-bold text-white hover:opacity-90"
                  style={{ backgroundColor: '#5BC9A8' }}>
                  확인
                </button>
              </div>
            </>
          )}

          {/* STEP 2b: 해지계좌확인/정보입력 */}
          {step === 2 && step2Phase === 'infoInput' && selected && (
            <>
              <div className="border border-kb-border bg-[#FAFAFA] px-4 py-3 mb-5 text-[12px] text-kb-text-body space-y-1">
                {[
                  '인터넷으로 신규한 예금입니다.',
                  '인터넷으로 신규한 예금을 인터넷뱅킹을 통해서만 해지시면 해지금액을 신규당시의 출금계좌로 입금 가능합니다. (단. 창구에서 하단계좌의 실제량이 있는 경우 출금계좌 신청하기)',
                  '청약관련예금(분탁정약접저예금·청약부금·청약예금·청약저축)을 해지하시면 청약권도 상실되므로 유의하시기 바랍니다.',
                ].map((n, i) => (
                  <p key={i} className="flex gap-1.5"><span className="flex-shrink-0">-</span><span>{n}</span></p>
                ))}
              </div>

              <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-5">
                <tbody>
                  <tr>
                    <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-[160px] whitespace-nowrap">해지계좌번호</td>
                    <td className="border border-kb-border px-4 py-3 text-kb-text-body">{selected.no}</td>
                  </tr>
                  <tr>
                    <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text">해지계좌명</td>
                    <td className="border border-kb-border px-4 py-3 text-kb-text-body">{selected.name}</td>
                  </tr>
                  <tr>
                    <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text">해지계좌비밀번호</td>
                    <td className="border border-kb-border px-4 py-3">
                      <div className="flex items-center gap-3">
                        <input
                          type={mouseInput ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          maxLength={4}
                          disabled={mouseInput}
                          className="border border-kb-border px-3 py-1.5 text-[13px] w-28 outline-none disabled:bg-[#F5F5F5]"
                        />
                        <label className="flex items-center gap-1.5 text-[12px] text-kb-text-body cursor-pointer">
                          <input type="checkbox" checked={mouseInput} onChange={e => setMouseInput(e.target.checked)} />
                          마우스로 입력
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text">입금계좌번호</td>
                    <td className="border border-kb-border px-4 py-3 text-[13px] text-kb-text-body">
                      {FREE_ACCOUNTS[0].no}&nbsp;&nbsp;인터넷으로 예금신규 당시 출금계좌
                    </td>
                  </tr>
                </tbody>
              </table>

              {selected.accountType === 'fixed' && (
                <div className="border border-[#5BC9A8] bg-[#F0FBF8] px-5 py-4 mb-6 flex items-start gap-4">
                  <div className="flex-shrink-0 text-[32px] mt-1">✏️</div>
                  <div className="flex-1">
                    <p className="text-[13px] text-kb-text-body mb-3 leading-relaxed">
                      <strong>홍길동 고객님,</strong><br />
                      중도 해지하시면 약정이율이 아닌 저율의 중도해지이율이 적용되어<br />
                      금전 상 손이익이 있습니다.<br />
                      예금 가입금액 범위 내에서 대출을 가능한 예부적금담보대출 어떠신지요.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setShowCalcModal(true)}
                        className="px-4 py-2 text-[12px] font-bold text-kb-text hover:opacity-90"
                        style={{ backgroundColor: '#5BC9A8' }}>
                        예부적금담보대출 계산기
                      </button>
                      <button
                        className="px-4 py-2 text-[12px] font-bold text-kb-text hover:opacity-90"
                        style={{ backgroundColor: '#5BC9A8' }}>
                        예부적금담보대출 바로가기
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <button onClick={handleInfoConfirm}
                  className="px-14 py-2.5 text-[14px] font-bold text-white hover:opacity-90"
                  style={{ backgroundColor: '#5BC9A8' }}>
                  해지
                </button>
              </div>
            </>
          )}

          {/* STEP 3: 입력확인 */}
          {step === 3 && selected && (
            <>
              <div className="border border-kb-border bg-[#FAFAFA] px-4 py-3 mb-5 text-[12px] text-kb-text-body space-y-1">
                {[
                  '인터넷으로 신규한 예금입니다.',
                  '인터넷으로 신규한 예금을 인터넷뱅킹을 통해서만 해지시면 해지금액을 신규당시의 출금계좌로 입금 가능합니다.',
                  '청약관련예금(분탁정약접저예금·청약부금·청약예금·청약저축)을 해지하시면 청약권도 상실되므로 유의하시기 바랍니다.',
                ].map((n, i) => (
                  <p key={i} className="flex gap-1.5"><span className="flex-shrink-0">-</span><span>{n}</span></p>
                ))}
              </div>

              <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-6">
                <tbody>
                  {detailRows.map(row => (
                    <tr key={row.label}>
                      <td className="bg-kb-beige-light border border-kb-border px-4 py-2.5 font-semibold text-kb-text w-[160px] whitespace-nowrap">{row.label}</td>
                      <td className={`border border-kb-border px-4 py-2.5 ${row.red ? 'text-[#E05555] font-bold' : 'text-kb-text-body'}`}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table className="w-full border-collapse text-[13px] mb-2">
                <tbody>
                  <tr>
                    <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-[160px] whitespace-nowrap">SMS인증번호</td>
                    <td className="border border-kb-border px-4 py-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <input type="text" value={smsCode} onChange={e => setSmsCode(e.target.value)}
                          maxLength={6} className="border border-kb-border px-3 py-1.5 text-[13px] w-24 outline-none" />
                        <span className="flex items-center gap-1 text-[12px] text-kb-text-muted">
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-kb-text-muted text-white text-[9px] font-bold flex-shrink-0">i</span>
                          고객정보에 등록된 휴대폰으로 전송된 인증번호를 입력해주세요.
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="text-[11px] text-kb-text-muted px-1 mb-6">
                ※ 전기통신금융사기 피해 방지 및 피해금 환급에 관한 특별법 제2조의4 및 동법 시행령 제2조의3에 따라 전기통신금융사기 피해 방지를 위하여 금융회사에 등록된 이용자의 휴대폰을 통하여 본인 확인을 하고 있습니다.
              </p>

              <div className="border border-t-2 border-t-kb-text border-kb-border p-5 mb-6">
                <p className="text-[14px] font-bold text-kb-text mb-4">보안매체 비밀번호 입력</p>
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
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-kb-text-body whitespace-nowrap">
                    보안카드 <span className="font-bold text-kb-text">{SECURITY_PROMPT.row}{SECURITY_PROMPT.col}</span> 번 :
                  </span>
                  <input
                    type="password"
                    value={securityInput}
                    onChange={e => setSecurityInput(e.target.value)}
                    maxLength={2}
                    placeholder="00"
                    className="border border-kb-border px-3 py-1.5 text-[13px] w-20 outline-none text-center tracking-widest"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <button onClick={handleFinalConfirm}
                  className="px-14 py-2.5 text-[14px] font-bold text-white hover:opacity-90"
                  style={{ backgroundColor: '#5BC9A8' }}>
                  확인
                </button>
                <button onClick={() => { setStep(2); setStep2Phase('infoInput') }}
                  className="px-14 py-2.5 text-[14px] text-kb-text-body border border-kb-border hover:bg-kb-beige-light">
                  취소
                </button>
              </div>
            </>
          )}

          {/* STEP 4: 해지완료 */}
          {step === 4 && selected && (
            <>
              <div className="border border-[#5BC9A8] bg-[#EBF9F5] px-6 py-5 mb-6 flex items-center gap-5">
                <div className="text-[48px] flex-shrink-0">👩</div>
                <div>
                  <p className="text-[15px] font-bold text-[#2A8A6A] mb-1">상품 해지가 완료되었습니다.</p>
                  <p className="text-[13px] text-kb-text-muted">거래해 주셔서 진심으로 감사드립니다.</p>
                  <p className="text-[13px] text-kb-text-muted">더 나은 서비스와 상품으로 보답하겠습니다.</p>
                </div>
              </div>

              <p className="text-[14px] font-bold text-kb-text mb-3">해지 상세 정보</p>
              <table className="w-full border-collapse text-[13px] mb-6">
                <tbody>
                  {detailRows.map(row => (
                    <tr key={row.label}>
                      <td className="bg-kb-beige-light border border-kb-border px-4 py-2.5 font-semibold text-kb-text w-[160px] whitespace-nowrap">{row.label}</td>
                      <td className={`border border-kb-border px-4 py-2.5 ${row.red ? 'text-[#E05555] font-bold' : 'text-kb-text-body'}`}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center gap-2">
                <Link href="/products/deposit/inquiry/terminate-result"
                  className="px-8 py-2.5 text-[13px] text-kb-text-body border border-kb-border hover:bg-kb-beige-light">
                  해지결과/내역조회
                </Link>
                <button className="px-8 py-2.5 text-[13px] text-kb-text-body border border-kb-border hover:bg-kb-beige-light flex items-center gap-1">
                  전자확인증 <span className="text-[11px]">↗</span>
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* 예금담보대출 계산기 모달 */}
      {showCalcModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-kb-border w-[520px] max-w-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-kb-border" style={{ backgroundColor: '#5BC9A8' }}>
              <span className="text-[14px] font-bold text-kb-text">예금담보대출 계산기</span>
              <button onClick={() => setShowCalcModal(false)} className="text-kb-text text-[18px] hover:opacity-70">✕</button>
            </div>
            <div className="p-5">
              <p className="text-[13px] font-bold text-kb-text mb-3">기본 정보</p>
              <table className="w-full border-collapse text-[12px] mb-4">
                <thead>
                  <tr className="bg-kb-beige-light">
                    <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold">담보계좌번호</th>
                    <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold">만기일</th>
                    <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold">계좌잔액</th>
                    <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold">대출가능액</th>
                    <th className="border border-kb-border px-3 py-2 text-kb-text font-semibold">대출금리</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-kb-border px-3 py-2 text-kb-text-body">557315-2709289</td>
                    <td className="border border-kb-border px-3 py-2 text-kb-text-body text-center">2026.06.25</td>
                    <td className="border border-kb-border px-3 py-2 text-kb-text-body text-right">1,000,000원</td>
                    <td className="border border-kb-border px-3 py-2 font-bold text-right" style={{ color: '#5BC9A8' }}>950,000</td>
                    <td className="border border-kb-border px-3 py-2 text-kb-text-body text-center">3.7%</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-[11px] text-kb-text-muted">* 대출금액이 5억을 초과하는 경우에는 대출금리는 가까운 영업점에 문의하여주시기 바랍니다.</p>
              <p className="text-[11px] text-kb-text-muted mt-1">* 중단통장 자동대출을 받으시는 경우에는 계산된 금리에 0.5%가 가산됩니다.</p>
              <div className="flex justify-end mt-4">
                <button onClick={() => setShowCalcModal(false)}
                  className="px-6 py-2 text-[13px] text-kb-text-body border border-kb-border hover:bg-kb-beige-light flex items-center gap-1">
                  닫기 ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 금융인증서 - 전자서명 원문 */}
      {certStep === 'summary' && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-kb-border w-[600px] max-w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-kb-border bg-[#F5F5F5]">
              <span className="text-[14px] font-bold text-kb-text">금융인증서비스</span>
              <button onClick={() => setCertStep('hidden')} className="text-kb-text text-[18px] hover:opacity-70">✕</button>
            </div>
            <div className="p-5 flex gap-5">
              <div className="flex-shrink-0 flex flex-col items-center w-28">
                <div className="border-2 border-[#5BC9A8] rounded-full p-3 mb-2">
                  <span className="text-[28px]">🔐</span>
                </div>
                <p className="text-[11px] text-center text-kb-text-muted font-bold leading-tight">YESKEY<br />금융인증서</p>
                <p className="text-[9px] text-center text-kb-text-muted mt-1 border border-[#5BC9A8] px-1.5 py-0.5 rounded">TRUST Sign</p>
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-kb-text mb-3">전자서명 원문</p>
                <div className="border border-kb-border p-3 text-[12px] text-kb-text-body space-y-0.5 bg-[#FAFAFA] leading-relaxed">
                  <p>해지계좌종류 : {selected.name}</p>
                  <p>해지계좌번호 : {selected.no}</p>
                  <p>해지계좌취급회차 : 1</p>
                  <p>해지구분 : 중도해약</p>
                  <p>해지계좌원금 : {selected.amount}</p>
                  <p>해지이자 : 0</p>
                  <p>소득세 : 0</p>
                  <p>주민세 : 0</p>
                  <p>농특세 : 0</p>
                  <p>세금합계 : 0</p>
                  <p>세금정산후이자 : 0</p>
                  <p>기지급이자 : 0</p>
                  <p>카드우대보너스 : 0</p>
                  <p>기장수세금 : 0</p>
                  <p>실수령액 : {selected.amount}</p>
                  <p>입금계좌번호 : {FREE_ACCOUNTS[0].no}</p>
                </div>
                <button onClick={() => setCertStep('pin')}
                  className="w-full mt-4 py-3 text-[14px] font-bold text-white hover:opacity-90"
                  style={{ backgroundColor: '#5BC9A8' }}>
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 금융인증서 - PIN 입력 */}
      {certStep === 'pin' && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-kb-border w-[380px] max-w-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-kb-border bg-[#F5F5F5]">
              <button onClick={() => setCertStep('summary')} className="text-[20px] text-kb-text-muted hover:opacity-70">‹</button>
              <span className="text-[14px] font-bold text-kb-text">금융인증서비스</span>
              <button onClick={() => { setCertStep('hidden'); setCertPin('') }} className="text-[18px] text-kb-text hover:opacity-70">✕</button>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <p className="text-[13px] font-bold mb-1" style={{ color: '#5BC9A8' }}>홍길동님의 금융인증서</p>
                <p className="text-[15px] font-bold text-kb-text mb-4">비밀번호를 입력해주세요</p>
                <div className="flex gap-2 mb-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i}
                      className={`w-9 h-9 border-2 rounded flex items-center justify-center text-[18px] ${i < certPin.length ? 'border-[#5BC9A8] text-[#5BC9A8]' : 'border-kb-border'}`}>
                      {i < certPin.length ? '●' : ''}
                    </div>
                  ))}
                </div>
                <button className="text-[12px] text-kb-blue hover:underline">비밀번호를 잊으셨나요?</button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {PIN_LAYOUT.map((n, i) => (
                  <button key={i} onClick={() => handlePinInput(n)}
                    className="h-12 text-[17px] font-medium border border-kb-border hover:bg-kb-beige-light rounded">
                    {n === -1 ? '↺' : n === -2 ? '⌫' : n}
                  </button>
                ))}
              </div>
              {certPin.length === 6 && (
                <button onClick={handleCertPinConfirm}
                  className="w-full mt-4 py-3 text-[14px] font-bold text-white hover:opacity-90 rounded"
                  style={{ backgroundColor: '#5BC9A8' }}>
                  확인
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
