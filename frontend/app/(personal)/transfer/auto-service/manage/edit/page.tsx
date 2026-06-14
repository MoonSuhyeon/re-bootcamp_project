'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TransferSidebar from '@/components/inquiry/TransferSidebar'

const FROM_ACCOUNT = '531089-04-274618'
const TO_ACCOUNT   = '012-345-678901'
const TO_BANK      = '가상은행'
const TO_HOLDER    = '홍길동'

type Phase = 'input' | 'auth' | 'done'
type AuthPhase = 'none' | 'ars1' | 'ars2' | 'fincert1' | 'fincert2'

const AMOUNT_PRESETS = [
  { label: '100만', value: 1_000_000 },
  { label: '50만',  value: 500_000 },
  { label: '10만',  value: 100_000 },
  { label: '5만',   value: 50_000 },
  { label: '1만',   value: 10_000 },
]

const YEARS  = ['2026','2027','2028','2029','2030']
const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12']

function toKorean(n: number) {
  if (!n) return ''
  const eok = Math.floor(n / 100_000_000)
  const man = Math.floor((n % 100_000_000) / 10_000)
  const rest = n % 10_000
  let r = ''
  if (eok) r += `${eok}억`
  if (man) r += `${man}만`
  if (rest) r += rest
  return r + '원'
}

function shuffle(arr: number[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ManageEditPage() {
  const router = useRouter()

  /* ── 폼 상태 ── */
  const [amount,          setAmount]          = useState(100_000)
  const [customInput,     setCustomInput]     = useState('')
  const [isCustom,        setIsCustom]        = useState(false)
  const [endYear,         setEndYear]         = useState('2027')
  const [endMonth,        setEndMonth]        = useState('05')
  const [myDisplay,       setMyDisplay]       = useState<'account'|'receiver'|'custom'>('account')
  const [receiverDisplay, setReceiverDisplay] = useState(TO_HOLDER)

  /* ── 흐름 상태 ── */
  const [phase,      setPhase]      = useState<Phase>('input')
  const [authPhase,  setAuthPhase]  = useState<AuthPhase>('none')
  const [pin,        setPin]        = useState('')

  const pinPad = useMemo(() => shuffle([1,2,3,4,5,6,7,8,9,0]), [phase])

  const finalAmount = isCustom ? (parseInt(customInput.replace(/,/g,'')) || 0) : amount
  const koreanAmount = toKorean(finalAmount)

  const txTime = useMemo(() => {
    const d = new Date()
    const pad = (n: number) => String(n).padStart(2,'0')
    return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }, [phase])

  function handlePinKey(k: number | 'del') {
    if (k === 'del') { setPin(p => p.slice(0,-1)); return }
    if (pin.length >= 6) return
    const next = pin + k
    setPin(next)
    if (next.length === 6) {
      setTimeout(() => {
        setAuthPhase('none')
        setPhase('done')
      }, 400)
    }
  }

  const step = phase === 'done' ? 4 : 3

  /* ════════════════ 완료 화면 ════════════════ */
  if (phase === 'done') {
    return (
      <div className="max-w-kb-container mx-auto px-6">
        <div className="flex">
          <TransferSidebar />
          <main className="flex-1 pl-8 pt-4 pb-12">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-[22px] font-bold text-kb-text">자동이체내역 조회/해지/변경</h1>
              <div className="flex items-center gap-1">
                {[1,2,3].map(n => (
                  <span key={n} className="w-8 h-8 rounded-full border border-kb-border flex items-center justify-center text-[13px] text-kb-text-muted">{n}</span>
                ))}
                <span className="px-3 py-1.5 bg-kb-yellow text-[13px] font-bold text-kb-text rounded-full">4. 등록완료</span>
              </div>
            </div>

            {/* 결과 안내 */}
            <div className="border border-kb-border px-5 py-4 mb-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-kb-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4,10 8,14 16,6"/>
                </svg>
              </div>
              <div className="text-[13px] text-kb-text-body leading-relaxed">
                <p className="font-bold text-kb-text mb-1">자동이체 변경 결과입니다.</p>
                <p>· 타행자동이체(2015년 2월 13일 신설)는 이체 지정일에 출금되어 당일 입금계좌로 입금됩니다.</p>
                <p className="text-kb-blue">（단, 지정일 영업시간 이내에 한함품목 내）</p>
                <p>· 이체일이 휴일일 경우 다음 영업일에 이체가 완료됩니다.</p>
              </div>
            </div>

            {/* 거래 요약 */}
            <table className="w-full border-collapse mb-5 text-[13px]">
              <tbody>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-2.5 font-semibold text-kb-text w-40">거래종류</td>
                  <td className="border border-kb-border px-4 py-2.5 text-kb-text-body">자동이체 등록</td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-2.5 font-semibold text-kb-text">거래일시</td>
                  <td className="border border-kb-border px-4 py-2.5 text-kb-text-body">{txTime}</td>
                </tr>
              </tbody>
            </table>

            {/* 계좌정보 */}
            <h2 className="text-[14px] font-bold text-kb-text mb-2">계좌정보</h2>
            <table className="w-full border-collapse mb-5 text-[13px]">
              <tbody>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-2.5 font-semibold text-kb-text w-40">출금계좌번호</td>
                  <td className="border border-kb-border px-4 py-2.5 text-kb-text-body">{FROM_ACCOUNT}</td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-2.5 font-semibold text-kb-text">입금계좌번호</td>
                  <td className="border border-kb-border px-4 py-2.5 text-kb-text-body">{TO_ACCOUNT} ({TO_BANK})</td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-2.5 font-semibold text-kb-text">받는분</td>
                  <td className="border border-kb-border px-4 py-2.5 text-kb-text-body">{TO_HOLDER}</td>
                </tr>
              </tbody>
            </table>

            {/* 자동이체정보 */}
            <h2 className="text-[14px] font-bold text-kb-text mb-2">자동이체정보 <span className="text-[12px] font-normal text-kb-text-muted">(타행거래)</span></h2>
            <table className="w-full border-collapse mb-6 text-[13px]">
              <tbody>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-2.5 font-semibold text-kb-text w-40">이체금액</td>
                  <td className="border border-kb-border px-4 py-2.5 text-kb-text-body">{finalAmount.toLocaleString()}원</td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-2.5 font-semibold text-kb-text">수수료(이체 건당)</td>
                  <td className="border border-kb-border px-4 py-2.5 text-kb-text-body">
                    <p>300원</p>
                    <p className="text-[12px] text-kb-text-muted">*23.1.19(목)~별도 안내시까지 개인/개인사업자/임의단체(서류미제출) 한시적 면제</p>
                  </td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-2.5 font-semibold text-kb-text">이체주기</td>
                  <td className="border border-kb-border px-4 py-2.5 text-kb-text-body">매월</td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-2.5 font-semibold text-kb-text">자동이체일</td>
                  <td className="border border-kb-border px-4 py-2.5 text-kb-text-body">30일</td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-2.5 font-semibold text-kb-text">이체기간(시작/종료)</td>
                  <td className="border border-kb-border px-4 py-2.5 text-kb-text-body">2026.05 ~ {endYear}.{endMonth}</td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-2.5 font-semibold text-kb-text">내 통장 표시</td>
                  <td className="border border-kb-border px-4 py-2.5 text-kb-text-body">
                    {myDisplay === 'account' ? TO_ACCOUNT : myDisplay === 'receiver' ? TO_HOLDER : '고객지정'}
                  </td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-2.5 font-semibold text-kb-text">받는분 통장 표시</td>
                  <td className="border border-kb-border px-4 py-2.5 text-kb-text-body">{receiverDisplay}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-center gap-3">
              <Link href="/transfer/auto-service/manage"
                className="bg-kb-yellow px-12 py-3 text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">
                등록내역조회
              </Link>
              <button className="border border-kb-border px-12 py-3 text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                전자확인증
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  /* ════════════════ 모달: ARS 1 ════════════════ */
  const ars1Modal = authPhase === 'ars1' && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] border border-gray-300 shadow-xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#e8e8e8] border-b border-gray-300">
          <span className="text-[13px] font-bold text-kb-text">ARS인증</span>
          <button onClick={() => setAuthPhase('none')} className="text-kb-text-muted hover:text-kb-text text-[16px]">✕</button>
        </div>
        <div className="px-5 py-5 text-[13px] text-kb-text-body space-y-2">
          <p>· 본인확인을 위해 전화인증을 수행할 전화번호 선택 후 〔확인〕버튼을 선택하여 주시기 바랍니다.</p>
          <p>· 정보통신망법 개정에 따라 2013.2.18부터 휴대폰 본인인증 서비스가 종료됩니다. 은행에 등록된 휴대폰번호로 인증해 주시기 바랍니다.</p>
          <p>· 고객 전화번호가 변경된 경우 &quot;고객정보보수정&quot;에서 수정해 주시기 바랍니다.</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="font-semibold text-kb-text w-16">전화번호</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" defaultChecked className="accent-kb-yellow" />
              <span>010-12**-34**</span>
            </label>
          </div>
        </div>
        <div className="flex justify-center gap-3 pb-5">
          <button onClick={() => setAuthPhase('ars2')}
            className="bg-kb-yellow px-10 py-2 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark">확인</button>
          <button onClick={() => setAuthPhase('none')}
            className="border border-kb-border px-10 py-2 text-[13px] text-kb-text-body hover:bg-kb-beige-light">취소</button>
        </div>
      </div>
    </div>
  )

  /* ════════════════ 모달: ARS 2 ════════════════ */
  const ars2Modal = authPhase === 'ars2' && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] border border-gray-300 shadow-xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#e8e8e8] border-b border-gray-300">
          <span className="text-[13px] font-bold text-kb-text">ARS인증</span>
          <button onClick={() => setAuthPhase('none')} className="text-kb-text-muted hover:text-kb-text text-[16px]">✕</button>
        </div>
        <div className="px-5 py-5 text-[13px] text-kb-text-body space-y-2">
          <p>· 전화승인 처리가 완료되고 나면 아래에 전화승인완료 버튼을 눌러주세요.</p>
          <p>· 전화가 오지 않은 경우 전화번호가 다르거나 착신이 정지되어 있는지 확인하시기 바랍니다.</p>
          <p>· 착신 전환된 전화번호는 ARS인증이 불가하오니 유의하시기 바랍니다.</p>
        </div>
        <div className="flex justify-center gap-3 pb-5">
          <button onClick={() => setAuthPhase('fincert1')}
            className="bg-kb-yellow px-8 py-2 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark">전화승인완료</button>
          <button onClick={() => setAuthPhase('none')}
            className="border border-kb-border px-8 py-2 text-[13px] text-kb-text-body hover:bg-kb-beige-light">취소</button>
        </div>
      </div>
    </div>
  )

  /* ════════════════ 모달: 금융인증서비스 1 ════════════════ */
  const fincert1Modal = authPhase === 'fincert1' && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[660px] border border-gray-300 shadow-xl flex">
        {/* 왼쪽 패널 */}
        <div className="w-[200px] bg-white flex flex-col items-center justify-center border-r border-gray-200 py-8 px-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center mb-3">
            <span className="text-[11px] text-gray-400 font-bold text-center leading-tight">YESKEY<br/>금융인증</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-[10px] text-gray-500">TRUST</span>
          </div>
        </div>
        {/* 오른쪽 패널 */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200">
            <span className="text-[13px] font-bold">금융인증서비스</span>
            <button onClick={() => setAuthPhase('none')} className="text-kb-text-muted hover:text-kb-text text-[16px]">✕</button>
          </div>
          <div className="px-5 py-5 flex-1">
            <p className="text-[12px] font-bold text-kb-text mb-3">전자서명 원문</p>
            <table className="w-full border-collapse text-[12px]">
              <tbody>
                {[
                  ['입금은행', TO_BANK],
                  ['입금계좌번호', TO_ACCOUNT],
                  ['수취인', TO_HOLDER],
                  ['이체금액', `${finalAmount.toLocaleString()}`],
                  ['출금계좌번호', FROM_ACCOUNT],
                  ['이체시작년월', '202605'],
                  ['이체종료년월', `${endYear}${endMonth}`],
                  ['자동이체일', '30'],
                  ['수수료', '300'],
                  ['입금은행코드', '034'],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td className="border-b border-gray-100 py-1.5 text-kb-text-muted w-36">{k}</td>
                    <td className="border-b border-gray-100 py-1.5 text-kb-text">: {v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 pb-5">
            <button onClick={() => { setAuthPhase('fincert2'); setPin('') }}
              className="w-full bg-kb-yellow py-2.5 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark">확인</button>
          </div>
        </div>
      </div>
    </div>
  )

  /* ════════════════ 모달: 금융인증서비스 2 (PIN) ════════════════ */
  const fincert2Modal = authPhase === 'fincert2' && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[660px] border border-gray-300 shadow-xl flex">
        <div className="w-[200px] bg-white flex flex-col items-center justify-center border-r border-gray-200 py-8 px-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center mb-3">
            <span className="text-[11px] text-gray-400 font-bold text-center leading-tight">YESKEY<br/>금융인증</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-[10px] text-gray-500">TRUST</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200">
            <button onClick={() => setAuthPhase('fincert1')} className="text-kb-text-muted hover:text-kb-text text-[16px]">‹</button>
            <span className="text-[13px] font-bold">금융인증서비스</span>
            <button onClick={() => setAuthPhase('none')} className="text-kb-text-muted hover:text-kb-text text-[16px]">✕</button>
          </div>
          <div className="px-5 py-5 flex-1 flex flex-col items-center">
            <p className="text-[13px] text-kb-blue font-semibold mb-1">{TO_HOLDER}님의 금융인증서</p>
            <p className="text-[15px] font-bold text-kb-text mb-4">비밀번호를 입력해주세요</p>
            <div className="flex gap-2 mb-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center text-[18px]">
                  {i < pin.length ? '●' : ''}
                </div>
              ))}
            </div>
            <button className="text-[12px] text-kb-blue underline mb-4">비밀번호를 잊으셨나요?</button>
            <div className="grid grid-cols-3 gap-2 w-[200px]">
              {pinPad.map((k, i) => (
                <button key={i} onClick={() => handlePinKey(k)}
                  className="h-11 border border-gray-200 rounded text-[16px] font-semibold text-kb-text hover:bg-kb-beige-light transition-colors">
                  {k}
                </button>
              ))}
              <button onClick={() => {}}
                className="h-11 border border-gray-200 rounded flex items-center justify-center hover:bg-kb-beige-light transition-colors">
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 10a6 6 0 1 0 12 0 6 6 0 0 0-12 0zm3-3l6 6m0-6l-6 6"/>
                </svg>
              </button>
              <button onClick={() => {}}
                className="h-11 border border-gray-200 rounded text-[16px] font-semibold text-kb-text hover:bg-kb-beige-light transition-colors col-start-2">
              </button>
              <button onClick={() => handlePinKey('del')}
                className="h-11 border border-gray-200 rounded flex items-center justify-center hover:bg-kb-beige-light transition-colors">
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M8 4H18V16H8L3 10Z"/><path d="M11 8l4 4m0-4l-4 4"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  /* ════════════════ Step 3 화면 ════════════════ */
  return (
    <div className="max-w-kb-container mx-auto px-6">
      {ars1Modal}
      {ars2Modal}
      {fincert1Modal}
      {fincert2Modal}

      <div className="flex">
        <TransferSidebar />
        <main className="flex-1 pl-8 pt-4 pb-12">
          {/* 타이틀 + 스텝 */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-[22px] font-bold text-kb-text">자동이체내역 조회/해지/변경</h1>
            <div className="flex items-center gap-1">
              {[1,2].map(n => (
                <span key={n} className="w-8 h-8 rounded-full border border-kb-border flex items-center justify-center text-[13px] text-kb-text-muted">{n}</span>
              ))}
              <span className="px-3 py-1.5 bg-kb-yellow text-[13px] font-bold text-kb-text rounded-full">3. 입력확인</span>
              <span className="w-8 h-8 rounded-full border border-kb-border flex items-center justify-center text-[13px] text-kb-text-muted">4</span>
            </div>
          </div>

          {/* 안내 */}
          <div className="border border-kb-border bg-kb-beige-light px-4 py-3 mb-5 text-[13px] text-kb-text-body">
            · 내역 확인 후 소지하고 있는 보안카드/OTP 번호를 입력하고 [확인] 버튼을 눌러주세요.
          </div>

          {phase === 'input' ? (
            /* ── 입력 폼 ── */
            <>
              {/* 계좌정보 */}
              <div className="border border-kb-border mb-4">
                <div className="px-4 py-2.5 bg-kb-beige-light border-b border-kb-border">
                  <span className="text-[14px] font-bold text-kb-text">계좌정보</span>
                </div>
                <table className="w-full text-[13px]">
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 text-kb-text-muted w-36 border-b border-kb-border">출금계좌번호</td>
                      <td className="px-4 py-3 text-kb-text border-b border-kb-border">{FROM_ACCOUNT}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-kb-text-muted border-b border-kb-border">계좌비밀번호</td>
                      <td className="px-4 py-3 border-b border-kb-border">
                        <div className="flex items-center gap-3">
                          <input type="password" maxLength={6}
                            className="border border-kb-border px-3 py-1.5 text-[13px] w-32 outline-none" />
                          <label className="flex items-center gap-1.5 text-[12px] text-kb-text-muted cursor-pointer">
                            <input type="checkbox" className="accent-kb-yellow" />
                            아무것도 입력
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-kb-text-muted">입금계좌번호</td>
                      <td className="px-4 py-3 text-kb-text">{TO_ACCOUNT} ({TO_BANK})</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 자동이체정보 */}
              <div className="border border-kb-border mb-5">
                <div className="px-4 py-2.5 bg-kb-beige-light border-b border-kb-border">
                  <span className="text-[14px] font-bold text-kb-text">자동이체정보</span>
                </div>
                <table className="w-full text-[13px]">
                  <tbody>
                    {/* 이체금액 */}
                    <tr className="border-b border-kb-border">
                      <td className="px-4 py-3 text-kb-text-muted w-36 align-top pt-4">이체금액</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 mb-2">
                          {AMOUNT_PRESETS.map(p => (
                            <button key={p.label}
                              onClick={() => { setAmount(p.value); setIsCustom(false) }}
                              className={`px-3 py-1 text-[12px] border transition-colors ${
                                !isCustom && amount === p.value
                                  ? 'bg-kb-text text-white border-kb-text'
                                  : 'border-kb-border text-kb-text-body hover:bg-kb-beige-light'
                              }`}>
                              {p.label}
                            </button>
                          ))}
                          <button
                            onClick={() => setIsCustom(true)}
                            className={`px-3 py-1 text-[12px] border transition-colors ${
                              isCustom ? 'bg-kb-text text-white border-kb-text' : 'border-kb-border text-kb-text-body hover:bg-kb-beige-light'
                            }`}>
                            직접
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={isCustom ? customInput : finalAmount.toLocaleString()}
                            onChange={e => { setCustomInput(e.target.value); setIsCustom(true) }}
                            className="border border-kb-border px-3 py-1.5 text-[13px] w-48 outline-none text-right"
                          />
                          <span className="text-[13px] text-kb-text">원</span>
                        </div>
                        {koreanAmount && <p className="text-[12px] text-kb-text-muted mt-1">{koreanAmount}</p>}
                      </td>
                    </tr>
                    {/* 이체주기 */}
                    <tr className="border-b border-kb-border">
                      <td className="px-4 py-3 text-kb-text-muted">이체주기</td>
                      <td className="px-4 py-3">
                        <select className="border border-kb-border px-2 py-1.5 text-[13px] w-24 outline-none">
                          <option>매월</option>
                          <option>매주</option>
                          <option>매일</option>
                        </select>
                      </td>
                    </tr>
                    {/* 자동이체일 */}
                    <tr className="border-b border-kb-border">
                      <td className="px-4 py-3 text-kb-text-muted">자동이체일</td>
                      <td className="px-4 py-3 flex items-center gap-1">
                        <select className="border border-kb-border px-2 py-1.5 text-[13px] w-16 outline-none">
                          {Array.from({length:31},(_,i)=>i+1).map(d=>(
                            <option key={d} selected={d===30}>{d}</option>
                          ))}
                        </select>
                        <span className="text-[13px] text-kb-text">일</span>
                      </td>
                    </tr>
                    {/* 이체기간 */}
                    <tr className="border-b border-kb-border">
                      <td className="px-4 py-3 text-kb-text-muted align-top pt-4">이체기간<br/><span className="text-[11px]">(시작/종료)</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 mb-2">
                          {['1년','2년','3년'].map((y,i) => {
                            const yr = String(2026 + i + 1)
                            return (
                              <button key={y} onClick={() => setEndYear(yr)}
                                className={`px-3 py-1 text-[12px] border transition-colors ${
                                  endYear === yr ? 'bg-kb-text text-white border-kb-text' : 'border-kb-border text-kb-text-body hover:bg-kb-beige-light'
                                }`}>
                                {y}
                              </button>
                            )
                          })}
                        </div>
                        <div className="flex items-center gap-1 text-[13px]">
                          <span>2026년 05월 ~</span>
                          <select value={endYear} onChange={e => setEndYear(e.target.value)}
                            className="border border-kb-border px-2 py-1.5 text-[13px] w-20 outline-none">
                            {YEARS.map(y => <option key={y}>{y}</option>)}
                          </select>
                          <span>년</span>
                          <select value={endMonth} onChange={e => setEndMonth(e.target.value)}
                            className="border border-kb-border px-2 py-1.5 text-[13px] w-16 outline-none">
                            {MONTHS.map(m => <option key={m}>{m}</option>)}
                          </select>
                          <span>월</span>
                        </div>
                        <p className="text-[12px] text-kb-text-muted mt-1">ⓘ 입력한 이체일이 없는 달은 해당월 말일에 자동이체됩니다.</p>
                      </td>
                    </tr>
                    {/* 내 통장 표시 */}
                    <tr className="border-b border-kb-border">
                      <td className="px-4 py-3 text-kb-text-muted">내 통장 표시</td>
                      <td className="px-4 py-3 flex items-center gap-4">
                        {(['account','receiver','custom'] as const).map((v, i) => (
                          <label key={v} className="flex items-center gap-1.5 cursor-pointer text-[13px]">
                            <input type="radio" name="myDisplay" checked={myDisplay === v}
                              onChange={() => setMyDisplay(v)} className="accent-kb-yellow" />
                            {['계좌번호','받는분','고객지정'][i]}
                          </label>
                        ))}
                      </td>
                    </tr>
                    {/* 받는분 통장 표시 */}
                    <tr>
                      <td className="px-4 py-3 text-kb-text-muted">받는분 통장 표시</td>
                      <td className="px-4 py-3">
                        <input type="text" value={receiverDisplay}
                          onChange={e => setReceiverDisplay(e.target.value)}
                          className="border border-kb-border px-3 py-1.5 text-[13px] w-48 outline-none" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center">
                <button onClick={() => setPhase('auth')}
                  className="bg-kb-yellow px-16 py-3 text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">
                  확인
                </button>
              </div>
            </>
          ) : (
            /* ── 요약 + 인증 ── */
            <>
              {/* 계좌정보 요약 */}
              <div className="border border-kb-border mb-4">
                <div className="px-4 py-2.5 bg-kb-beige-light border-b border-kb-border">
                  <span className="text-[14px] font-bold text-kb-text">계좌정보</span>
                </div>
                <table className="w-full text-[13px]">
                  <tbody>
                    <tr className="border-b border-kb-border">
                      <td className="px-4 py-3 text-kb-text-muted w-36">출금계좌번호</td>
                      <td className="px-4 py-3 text-kb-text">{FROM_ACCOUNT}</td>
                    </tr>
                    <tr className="border-b border-kb-border">
                      <td className="px-4 py-3 text-kb-text-muted">입금계좌번호</td>
                      <td className="px-4 py-3 text-kb-text">{TO_ACCOUNT} ({TO_BANK})</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-kb-text-muted">받는분</td>
                      <td className="px-4 py-3 text-kb-text">{TO_HOLDER}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 자동이체정보 요약 */}
              <div className="border border-kb-border mb-5">
                <div className="px-4 py-2.5 bg-kb-beige-light border-b border-kb-border">
                  <span className="text-[14px] font-bold text-kb-text">자동이체정보 <span className="text-[12px] font-normal text-kb-text-muted">(타행거래)</span></span>
                </div>
                <table className="w-full text-[13px]">
                  <tbody>
                    {[
                      ['이체금액', `${finalAmount.toLocaleString()}원`],
                      ['수수료(이체 건당)', '300원\n*23.1.19(목)~별도 안내시까지 개인/개인사업자/임의단체(서류미제출) 한시적 면제'],
                      ['이체주기', '매월'],
                      ['자동이체일', '30일'],
                      ['이체기간(시작/종료)', `2026.05 ~ ${endYear}.${endMonth}`],
                      ['내 통장 표시', myDisplay === 'account' ? TO_ACCOUNT : myDisplay === 'receiver' ? TO_HOLDER : '고객지정'],
                      ['받는분 통장 표시', receiverDisplay],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-b border-kb-border last:border-0">
                        <td className="px-4 py-2.5 text-kb-text-muted w-36 align-top">{k}</td>
                        <td className="px-4 py-2.5 text-kb-text whitespace-pre-line">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 확인 안내 */}
              <div className="border border-kb-border bg-[#fffbe6] px-4 py-3 mb-5 text-[13px] text-kb-text-body space-y-1">
                <p>· 고객님께서 입력하신 입금은행, 입금계좌번호, 이체금액 및 받는분을 다시 한번 확인하세요.</p>
                <p className="text-kb-blue">· 메신저 또는 문자로 송금을 요구받는 경우에는 반드시 사실관계 확인 후 이체하시기 바랍니다.</p>
              </div>

              {/* 추가 본인 인증 */}
              <div className="border border-kb-border mb-5">
                <div className="px-4 py-2.5 bg-kb-beige-light border-b border-kb-border">
                  <span className="text-[14px] font-bold text-kb-text">추가 본인 인증(택 1)</span>
                </div>
                <div className="px-4 py-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="authType" defaultChecked className="accent-kb-yellow" />
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] text-gray-500 font-bold text-center leading-tight">ARS</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-kb-text">ARS 인증</p>
                      <p className="text-[12px] text-kb-text-muted">등록된 고객님의 연락처 중 선택하신 전화번호로 전화연결 후 ARS 안내에 따라 인증여부를 확인합니다.</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="authType" className="accent-kb-yellow" />
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.2">
                        <circle cx="10" cy="8" r="4"/><path d="M3 18c0-4 14-4 14 0"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-kb-text">해외출국확인</p>
                      <p className="text-[12px] text-kb-text-muted">한국국적의 해외체류자 및 해외거주자의 경우 법무부 출입국관리사무소로부터 출국사실이 확인되면 별도의 추가 본인인증 절차를 생략할 수 있습니다.</p>
                    </div>
                  </label>
                </div>
                <div className="px-4 pb-4 flex justify-center">
                  <button onClick={() => setAuthPhase('ars1')}
                    className="bg-kb-yellow px-14 py-2.5 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">
                    인증받기
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
