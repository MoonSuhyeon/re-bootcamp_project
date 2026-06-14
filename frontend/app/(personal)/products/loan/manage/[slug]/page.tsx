'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import LoanSidebar from '@/components/inquiry/LoanSidebar'

type PageMeta = {
  title: string
  breadcrumb: string
  description?: string
  content: React.ReactNode
}

function RateInfo() {
  const [period, setPeriod] = useState<string | null>(null)
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')

  const QUICK = ['당일', '3일', '1주일', '1개월', '3개월']

  return (
    <div>
      {/* 안내 박스 */}
      <div className="border border-kb-border bg-[#FAFAFA] px-5 py-4 mb-6 text-[13px] text-kb-text-body space-y-1.5">
        <p>· 조회기간을 선택하지 않을 경우에는 현재 적용금리가 조회되며,</p>
        <p className="pl-3">조회기간을 선택할 경우에는 선택기간의 금리변동 내역을 확인하실 수 있습니다.</p>
        <p>· 대출 잔액이 있는 가계대출에 한하여 조회 가능합니다.</p>
        <p className="pl-3">(재정자금대출, 신탁대출, 카드론 제외)</p>
      </div>

      {/* 조회 폼 */}
      <div className="border border-kb-border divide-y divide-kb-border">
        {/* 대출계좌번호 */}
        <div className="flex items-center px-5 py-3 gap-6">
          <span className="w-28 text-[13px] font-medium text-kb-text flex-shrink-0">대출계좌번호</span>
          <select className="border border-kb-border px-3 py-1.5 text-[13px] focus:outline-none min-w-[180px]">
            <option>해당계좌가 없습니다.</option>
            <option>AXful 직장인 신용대출 (****-3456)</option>
            <option>AXful 아파트담보대출 (****-7890)</option>
          </select>
        </div>

        {/* 조회기간 */}
        <div className="flex items-start px-5 py-3 gap-6">
          <span className="w-28 text-[13px] font-medium text-kb-text flex-shrink-0 pt-1">조회기간</span>
          <div className="space-y-2">
            {/* 빠른 선택 버튼 */}
            <div className="flex gap-1">
              {QUICK.map(q => (
                <button key={q} onClick={() => setPeriod(q)}
                  className={`px-3 py-1 text-[12px] border transition-colors ${
                    period === q
                      ? 'bg-kb-yellow border-kb-border font-bold text-kb-text'
                      : 'border-kb-border text-kb-text-body hover:bg-kb-beige-light'
                  }`}>
                  {q}
                </button>
              ))}
            </div>
            {/* 날짜 직접 입력 */}
            <div className="flex items-center gap-2 text-[13px]">
              <select className="border border-kb-border px-2 py-1 text-[13px] focus:outline-none">{[yyyy].map(y => <option key={y}>{y}</option>)}</select>
              <span className="text-kb-text-muted">년</span>
              <select className="border border-kb-border px-2 py-1 text-[13px] focus:outline-none">{[mm].map(m => <option key={m}>{m}</option>)}</select>
              <span className="text-kb-text-muted">월</span>
              <select className="border border-kb-border px-2 py-1 text-[13px] focus:outline-none">{[dd].map(d => <option key={d}>{d}</option>)}</select>
              <span className="text-kb-text-muted">일</span>
              <button className="border border-kb-border px-2 py-1 text-[12px] text-kb-text-muted hover:bg-kb-beige-light">📅</button>
              <span className="text-kb-text-muted">~</span>
              <select className="border border-kb-border px-2 py-1 text-[13px] focus:outline-none">{[yyyy].map(y => <option key={y}>{y}</option>)}</select>
              <span className="text-kb-text-muted">년</span>
              <select className="border border-kb-border px-2 py-1 text-[13px] focus:outline-none">{[mm].map(m => <option key={m}>{m}</option>)}</select>
              <span className="text-kb-text-muted">월</span>
              <select className="border border-kb-border px-2 py-1 text-[13px] focus:outline-none">{[dd].map(d => <option key={d}>{d}</option>)}</select>
              <span className="text-kb-text-muted">일</span>
              <button className="border border-kb-border px-2 py-1 text-[12px] text-kb-text-muted hover:bg-kb-beige-light">📅</button>
            </div>
          </div>
        </div>
      </div>

      {/* 조회 버튼 */}
      <div className="flex justify-center mt-5">
        <button className="px-14 py-2.5 text-[14px] font-bold text-kb-text bg-kb-yellow hover:bg-kb-yellow-dark transition-colors">
          조회
        </button>
      </div>
    </div>
  )
}


const PAYMENT_STEPS = ['1. 계좌선택', '2. 납입금액확인', '3. 이체정보입력', '4. 내용확인', '5. 완료']

function InterestPaymentForm() {
  const today = new Date()
  const yyyymmdd = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`

  const [step, setStep] = useState(1)
  const [payDate, setPayDate] = useState(yyyymmdd)
  const [oneTime, setOneTime] = useState(false)
  const [debitAcc, setDebitAcc] = useState('')
  const [password, setPassword] = useState('')
  const [mouseInput, setMouseInput] = useState(false)
  const [smsCode, setSmsCode] = useState('')

  const payInfo = {
    loanName: 'AXful 아파트담보대출',
    loanNo: '123456-78-901234',
    payDateFormatted: `${payDate.slice(0, 4)}.${payDate.slice(4, 6)}.${payDate.slice(6, 8)}`,
    interest: '45,833',
    principal: '216,667',
    total: '262,500',
  }

  function Indicator() {
    return (
      <div className="flex items-center gap-1 mb-5">
        {PAYMENT_STEPS.map((label, i) => (
          <span key={i}
            className={`px-4 py-1.5 text-[13px] border ${i + 1 === step ? 'bg-[#3D3D3D] text-white font-bold border-[#3D3D3D]' : 'text-kb-text-body border-kb-border'}`}>
            {i + 1 === step ? label : String(i + 1)}
          </span>
        ))}
      </div>
    )
  }

  const detailRows: { label: string; value: string; bold?: boolean }[] = [
    { label: '대출계좌번호', value: payInfo.loanNo },
    { label: '상품명', value: payInfo.loanName },
    { label: '납입예정일', value: payInfo.payDateFormatted },
    { label: '이자', value: `${payInfo.interest}원` },
    { label: '원금', value: `${payInfo.principal}원` },
    { label: '납입합계', value: `${payInfo.total}원`, bold: true },
    { label: '입금계좌번호', value: debitAcc || '110-234-567890 AX풀뱅크ONE통장-보통예금' },
  ]

  function DetailTable({ rows }: { rows: typeof detailRows }) {
    return (
      <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-5">
        <tbody>
          {rows.map(row => (
            <tr key={row.label}>
              <td className="bg-kb-beige-light border border-kb-border px-4 py-2.5 font-semibold text-kb-text w-[160px] whitespace-nowrap">{row.label}</td>
              <td className={`border border-kb-border px-4 py-2.5 ${row.bold ? 'font-bold text-[#E05555] text-[15px]' : 'text-kb-text-body'}`}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  /* ── STEP 1: 계좌선택 ── */
  if (step === 1) return (
    <div>
      <Indicator />
      <div className="border border-kb-border bg-[#FAFAFA] px-5 py-4 mb-6 text-[13px] text-kb-text-body space-y-1.5">
        <p>· 일반계좌 대출저자는 입금예정일자를 선택하시고, 할부계산대출저자는 1회분에 체크해 주시기 바랍니다.</p>
        <p>· 유비무환모기지론(스월/금리상환/금리상한)의 이자납부/상환거래는 09:00 ~ 17:00 시까지 가능합니다.</p>
        <p>· AXful카드사 본사로 AXful 카드론 관련 업무는 AXful카드 사이트에서 처리하시기 바랍니다.</p>
        <p>· 통장잔고자동대출의 약정이자 등은 조회일 현재 기준으로 계산되어 있으며, 실제 납입일까지 대출잔액이 변동하는 경우 납입금액이 달라 질 수 있습니다.</p>
        <p>· 통장잔고자동대출의 약정이자를 미납할 경우 대출잔액에 가산되며, 해당금액이 한도약정금액을 초과할 경우(미이자가 발생한 경우) 연체가 됩니다.</p>
      </div>
      <div className="border border-kb-border divide-y divide-kb-border">
        <div className="flex items-center px-5 py-3 gap-6">
          <span className="w-32 text-[13px] font-medium text-kb-text flex-shrink-0">대출계좌번호</span>
          <select className="border border-kb-border px-3 py-1.5 text-[13px] focus:outline-none min-w-[220px]">
            <option>AXful 아파트담보대출 (123456-78-901234)</option>
          </select>
        </div>
        <div className="flex items-center px-5 py-3 gap-6">
          <span className="w-32 text-[13px] font-medium text-kb-text flex-shrink-0">입금예정일</span>
          <div className="flex items-center gap-2">
            <input type="text" value={payDate} onChange={e => setPayDate(e.target.value)}
              className="border border-kb-border px-3 py-1.5 text-[13px] focus:outline-none w-[130px]" />
            <button className="border border-kb-border px-2.5 py-1.5 text-[13px] text-kb-text-muted hover:bg-kb-beige-light">📅</button>
          </div>
        </div>
        <div className="flex items-center px-5 py-3 gap-6">
          <span className="w-32 text-[13px] font-medium text-kb-text flex-shrink-0">1회분</span>
          <input type="checkbox" checked={oneTime} onChange={e => setOneTime(e.target.checked)}
            className="w-4 h-4 accent-kb-text cursor-pointer" />
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <button onClick={() => setStep(2)}
          className="px-14 py-2.5 text-[14px] font-bold text-kb-text bg-kb-yellow hover:bg-kb-yellow-dark transition-colors">
          조회
        </button>
      </div>
    </div>
  )

  /* ── STEP 2: 납입금액확인 ── */
  if (step === 2) return (
    <div>
      <Indicator />
      <div className="border border-kb-border bg-[#FAFAFA] px-5 py-3 mb-5 text-[13px] text-kb-text-body space-y-1">
        <p>· 이자/월부금 납입 예상금액을 확인하시기 바랍니다.</p>
        <p>· 납입금액 확인 후 입금계좌를 선택하고 확인 버튼을 누르십시오.</p>
      </div>
      <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-5">
        <tbody>
          {[
            { label: '대출계좌번호', value: payInfo.loanNo },
            { label: '상품명', value: payInfo.loanName },
            { label: '납입예정일', value: payInfo.payDateFormatted },
            { label: '이자', value: `${payInfo.interest}원` },
            { label: '원금', value: `${payInfo.principal}원` },
            { label: '납입합계', value: `${payInfo.total}원`, bold: true },
          ].map(row => (
            <tr key={row.label}>
              <td className="bg-kb-beige-light border border-kb-border px-4 py-2.5 font-semibold text-kb-text w-[160px] whitespace-nowrap">{row.label}</td>
              <td className={`border border-kb-border px-4 py-2.5 ${row.bold ? 'font-bold text-[#E05555] text-[15px]' : 'text-kb-text-body'}`}>{row.value}</td>
            </tr>
          ))}
          <tr>
            <td className="bg-kb-beige-light border border-kb-border px-4 py-2.5 font-semibold text-kb-text whitespace-nowrap">입금계좌번호</td>
            <td className="border border-kb-border px-4 py-2.5">
              <select value={debitAcc} onChange={e => setDebitAcc(e.target.value)}
                className="border border-kb-border px-3 py-1.5 text-[13px] focus:outline-none min-w-[280px]">
                <option value="">-선택-</option>
                <option value="110-234-567890 KB국민ONE통장-보통예금">110-234-567890 KB국민ONE통장-보통예금</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => { if (!debitAcc) { alert('입금계좌를 선택해주세요.'); return }; setStep(3) }}
          className="px-14 py-2.5 text-[14px] font-bold text-kb-text bg-kb-yellow hover:bg-kb-yellow-dark">
          확인
        </button>
        <button onClick={() => setStep(1)}
          className="px-14 py-2.5 text-[14px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light">
          이전
        </button>
      </div>
    </div>
  )

  /* ── STEP 3: 이체정보입력 ── */
  if (step === 3) return (
    <div>
      <Indicator />
      <div className="border border-kb-border bg-[#FAFAFA] px-5 py-3 mb-5 text-[13px] text-kb-text-body space-y-1">
        <p>· 이체 전 정보를 확인하시기 바랍니다.</p>
        <p>· 이체비밀번호를 입력하신 후 확인 버튼을 누르십시오.</p>
      </div>
      <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-5">
        <tbody>
          {detailRows.map(row => (
            <tr key={row.label}>
              <td className="bg-kb-beige-light border border-kb-border px-4 py-2.5 font-semibold text-kb-text w-[160px] whitespace-nowrap">{row.label}</td>
              <td className={`border border-kb-border px-4 py-2.5 ${row.bold ? 'font-bold text-[#E05555] text-[15px]' : 'text-kb-text-body'}`}>{row.value}</td>
            </tr>
          ))}
          <tr>
            <td className="bg-kb-beige-light border border-kb-border px-4 py-2.5 font-semibold text-kb-text whitespace-nowrap">이체비밀번호</td>
            <td className="border border-kb-border px-4 py-2.5">
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
        </tbody>
      </table>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => { if (!password && !mouseInput) { alert('이체비밀번호를 입력해주세요.'); return }; setStep(4) }}
          className="px-14 py-2.5 text-[14px] font-bold text-white hover:opacity-90"
          style={{ backgroundColor: '#5BC9A8' }}>
          확인
        </button>
        <button onClick={() => setStep(2)}
          className="px-14 py-2.5 text-[14px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light">
          취소
        </button>
      </div>
    </div>
  )

  /* ── STEP 4: 내용확인 ── */
  if (step === 4) return (
    <div>
      <Indicator />
      <div className="border border-kb-border bg-[#FAFAFA] px-5 py-3 mb-5 text-[13px] text-kb-text-body space-y-1">
        <p>· 소지하고 계신 보안카드/OTP의 번호를 입력 후 [확인]버튼을 선택하십시오.</p>
        <p>· 입력하신 내용을 다시 한 번 확인하시기 바랍니다.</p>
      </div>
      <DetailTable rows={detailRows} />
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
        ※ 전기통신금융사기 피해 방지 및 피해금 환급에 관한 특별법에 따라 금융회사에 등록된 이용자의 휴대폰을 통하여 본인 확인을 하고 있습니다.
      </p>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => { if (!smsCode) { alert('SMS 인증번호를 입력해주세요.'); return }; setStep(5) }}
          className="px-14 py-2.5 text-[14px] font-bold text-white hover:opacity-90"
          style={{ backgroundColor: '#5BC9A8' }}>
          확인
        </button>
        <button onClick={() => setStep(3)}
          className="px-14 py-2.5 text-[14px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light">
          취소
        </button>
      </div>
    </div>
  )

  /* ── STEP 5: 완료 ── */
  return (
    <div>
      <Indicator />
      <div className="border border-[#5BC9A8] bg-[#EBF9F5] px-6 py-5 mb-6 flex items-center gap-5">
        <div className="text-[48px] flex-shrink-0">👩</div>
        <div>
          <p className="text-[15px] font-bold text-[#2A8A6A] mb-1">이자/월부금 납입이 완료되었습니다.</p>
          <p className="text-[13px] text-kb-text-muted">거래해 주셔서 진심으로 감사드립니다.</p>
          <p className="text-[13px] text-kb-text-muted">더 나은 서비스와 상품으로 보답하겠습니다.</p>
        </div>
      </div>
      <p className="text-[14px] font-bold text-kb-text mb-3">납입 상세 정보</p>
      <DetailTable rows={[
        ...detailRows,
        { label: '처리일시', value: `${payInfo.payDateFormatted} ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}` },
      ]} />
      <div className="flex justify-center gap-2">
        <button className="px-8 py-2.5 text-[13px] text-kb-text-body border border-kb-border hover:bg-kb-beige-light">
          납입내역조회
        </button>
        <button
          onClick={() => { setStep(1); setPassword(''); setSmsCode(''); setDebitAcc('') }}
          className="px-8 py-2.5 text-[13px] font-bold text-kb-text bg-kb-yellow hover:bg-kb-yellow-dark">
          대출관리 홈으로
        </button>
      </div>
    </div>
  )
}

const REPAY_STEPS = ['1. 계좌선택', '2. 상환금액확인', '3. 이체정보입력', '4. 내용확인', '5. 완료']

function RepayForm() {
  const [step,      setStep]      = useState(1)
  const [repayType, setRepayType] = useState<'partial' | 'full'>('partial')
  const [amount,    setAmount]    = useState('')
  const [debitAcc,  setDebitAcc]  = useState('')
  const [password,  setPassword]  = useState('')
  const [mouseInput, setMouseInput] = useState(false)
  const [smsCode,   setSmsCode]   = useState('')

  const AMT_BTNS = ['100만', '50만', '10만', '5만', '1만', '정정']

  function handleAmtBtn(btn: string) {
    if (btn === '정정') { setAmount(''); return }
    const map: Record<string, number> = { '100만': 1000000, '50만': 500000, '10만': 100000, '5만': 50000, '1만': 10000 }
    const current = Number(amount.replace(/,/g, '')) || 0
    setAmount((current + (map[btn] ?? 0)).toLocaleString())
  }

  const loanName = 'AXful 아파트담보대출'
  const loanNo   = '123456-78-901234'

  const repayAmt    = repayType === 'full' ? 15000000 : (Number(amount.replace(/,/g, '')) || 0)
  const prepayFee   = repayType === 'partial' ? Math.round(repayAmt * 0.012) : Math.round(repayAmt * 0.008)
  const interestAmt = Math.round(repayAmt * 0.055 / 365)
  const totalAmt    = repayAmt + prepayFee + interestAmt

  const today = new Date()
  const todayStr = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`

  const baseRows = repayType === 'partial'
    ? [
        { label: '대출계좌번호',   value: loanNo },
        { label: '상품명',         value: loanName },
        { label: '상환구분',       value: '일부상환' },
        { label: '상환원금',       value: `${repayAmt.toLocaleString()}원` },
        { label: '중도상환수수료', value: `${prepayFee.toLocaleString()}원` },
        { label: '이자(당일)',     value: `${interestAmt.toLocaleString()}원` },
        { label: '상환합계',       value: `${totalAmt.toLocaleString()}원`, bold: true },
      ]
    : [
        { label: '대출계좌번호',   value: loanNo },
        { label: '상품명',         value: loanName },
        { label: '상환구분',       value: '완제' },
        { label: '잔여원금',       value: '15,000,000원' },
        { label: '중도상환수수료', value: `${prepayFee.toLocaleString()}원` },
        { label: '미납이자',       value: `${interestAmt.toLocaleString()}원` },
        { label: '상환합계',       value: `${totalAmt.toLocaleString()}원`, bold: true },
      ]

  const detailRows = [
    ...baseRows,
    { label: '출금계좌번호', value: debitAcc || '-' },
  ]

  function Indicator() {
    return (
      <div className="flex items-center gap-1 mb-5">
        {REPAY_STEPS.map((label, i) => (
          <span key={i}
            className={`px-4 py-1.5 text-[13px] border ${i + 1 === step ? 'bg-[#3D3D3D] text-white font-bold border-[#3D3D3D]' : 'text-kb-text-body border-kb-border'}`}>
            {i + 1 === step ? label : String(i + 1)}
          </span>
        ))}
      </div>
    )
  }

  function DetailTable({ rows }: { rows: { label: string; value: string; bold?: boolean }[] }) {
    return (
      <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-5">
        <tbody>
          {rows.map(row => (
            <tr key={row.label}>
              <td className="bg-kb-beige-light border border-kb-border px-4 py-2.5 font-semibold text-kb-text w-[160px] whitespace-nowrap">{row.label}</td>
              <td className={`border border-kb-border px-4 py-2.5 ${row.bold ? 'font-bold text-[#E05555] text-[15px]' : 'text-kb-text-body'}`}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  /* ── STEP 1: 계좌선택 ── */
  if (step === 1) return (
    <div>
      <Indicator />
      <div className="border border-kb-border bg-[#FAFAFA] px-5 py-4 mb-6 text-[13px] text-kb-text-body space-y-1.5">
        <p>· 상환구분을 선택하시고 상환예상 조회하실 대출계좌번호를 선택하십시오.</p>
        <p>· 대출금상환 예상금액은 조회일자 기준으로 계산된 금액입니다.</p>
        <p>· 1일 대출금 일부상환은 20회까지만 가능합니다.</p>
        <p>· 유비무환모기지론(이자율 SWAP 금리상환/금리상한)의 이자납부/상환거래는 09:00 ~ 17:00까지 가능합니다.</p>
        <p>· AXful카드사 AXful 카드론 관련 대출금 상환 예상금액은 조회되지 않습니다.</p>
        <p className="pl-3">AXful카드사(1588-1688)로 문의하시기 바랍니다.</p>
      </div>
      <div className="border border-kb-border divide-y divide-kb-border">
        <div className="flex items-center px-5 py-3 gap-6">
          <span className="w-32 text-[13px] font-medium text-kb-text flex-shrink-0">상환구분</span>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="repayType" checked={repayType === 'partial'} onChange={() => setRepayType('partial')} className="accent-kb-text" />
              <span className="text-[13px] text-kb-text-body">일부상환</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="repayType" checked={repayType === 'full'} onChange={() => setRepayType('full')} className="accent-kb-text" />
              <span className="text-[13px] text-kb-text-body">완제</span>
            </label>
          </div>
        </div>
        <div className="flex items-center px-5 py-3 gap-6">
          <span className="w-32 text-[13px] font-medium text-kb-text flex-shrink-0">대출계좌번호</span>
          <select className="border border-kb-border px-3 py-1.5 text-[13px] focus:outline-none min-w-[220px]">
            <option>AXful 아파트담보대출 (123456-78-901234)</option>
          </select>
        </div>
        {repayType === 'partial' && (
          <div className="flex items-start px-5 py-3 gap-6">
            <span className="w-32 text-[13px] font-medium text-kb-text flex-shrink-0 pt-2">상환금액</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder=""
                  className="border border-kb-border px-3 py-1.5 text-[13px] focus:outline-none w-[200px] text-right" />
                <span className="text-[13px] text-kb-text-body">원</span>
              </div>
              <div className="flex gap-1">
                {AMT_BTNS.map(btn => (
                  <button key={btn} onMouseDown={e => e.preventDefault()} onClick={() => handleAmtBtn(btn)}
                    className="px-3 py-1 text-[12px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light transition-colors">
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-5">
        <button
          onClick={() => { if (repayType === 'partial' && !amount) { alert('상환금액을 입력하세요.'); return }; setStep(2) }}
          className="px-14 py-2.5 text-[14px] font-bold text-kb-text bg-kb-yellow hover:bg-kb-yellow-dark transition-colors">
          조회
        </button>
      </div>
    </div>
  )

  /* ── STEP 2: 상환금액확인 ── */
  if (step === 2) return (
    <div>
      <Indicator />
      <div className="border border-kb-border bg-[#FAFAFA] px-5 py-3 mb-5 text-[13px] text-kb-text-body space-y-1">
        <p>· 상환 예상금액을 확인하시기 바랍니다.</p>
        <p>· 중도상환수수료는 대출 실행일로부터 3년 이내 상환 시 부과됩니다.</p>
        <p>· 출금계좌를 선택하신 후 확인 버튼을 누르십시오.</p>
      </div>
      <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-5">
        <tbody>
          {baseRows.map(row => (
            <tr key={row.label}>
              <td className="bg-kb-beige-light border border-kb-border px-4 py-2.5 font-semibold text-kb-text w-[160px] whitespace-nowrap">{row.label}</td>
              <td className={`border border-kb-border px-4 py-2.5 ${row.bold ? 'font-bold text-[#E05555] text-[15px]' : 'text-kb-text-body'}`}>{row.value}</td>
            </tr>
          ))}
          <tr>
            <td className="bg-kb-beige-light border border-kb-border px-4 py-2.5 font-semibold text-kb-text whitespace-nowrap">출금계좌번호</td>
            <td className="border border-kb-border px-4 py-2.5">
              <select value={debitAcc} onChange={e => setDebitAcc(e.target.value)}
                className="border border-kb-border px-3 py-1.5 text-[13px] focus:outline-none min-w-[280px]">
                <option value="">-선택-</option>
                <option value="110-234-567890 AX풀뱅크ONE통장-보통예금">110-234-567890 AX풀뱅크ONE통장-보통예금</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => { if (!debitAcc) { alert('출금계좌를 선택해주세요.'); return }; setStep(3) }}
          className="px-14 py-2.5 text-[14px] font-bold text-kb-text bg-kb-yellow hover:bg-kb-yellow-dark">
          확인
        </button>
        <button onClick={() => setStep(1)}
          className="px-14 py-2.5 text-[14px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light">
          이전
        </button>
      </div>
    </div>
  )

  /* ── STEP 3: 이체정보입력 ── */
  if (step === 3) return (
    <div>
      <Indicator />
      <div className="border border-kb-border bg-[#FAFAFA] px-5 py-3 mb-5 text-[13px] text-kb-text-body space-y-1">
        <p>· 이체 전 정보를 확인하시기 바랍니다.</p>
        <p>· 이체비밀번호를 입력하신 후 확인 버튼을 누르십시오.</p>
      </div>
      <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-5">
        <tbody>
          {detailRows.map(row => (
            <tr key={row.label}>
              <td className="bg-kb-beige-light border border-kb-border px-4 py-2.5 font-semibold text-kb-text w-[160px] whitespace-nowrap">{row.label}</td>
              <td className={`border border-kb-border px-4 py-2.5 ${row.bold ? 'font-bold text-[#E05555] text-[15px]' : 'text-kb-text-body'}`}>{row.value}</td>
            </tr>
          ))}
          <tr>
            <td className="bg-kb-beige-light border border-kb-border px-4 py-2.5 font-semibold text-kb-text whitespace-nowrap">이체비밀번호</td>
            <td className="border border-kb-border px-4 py-2.5">
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
        </tbody>
      </table>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => { if (!password && !mouseInput) { alert('이체비밀번호를 입력해주세요.'); return }; setStep(4) }}
          className="px-14 py-2.5 text-[14px] font-bold text-white hover:opacity-90"
          style={{ backgroundColor: '#5BC9A8' }}>
          확인
        </button>
        <button onClick={() => setStep(2)}
          className="px-14 py-2.5 text-[14px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light">
          취소
        </button>
      </div>
    </div>
  )

  /* ── STEP 4: 내용확인 ── */
  if (step === 4) return (
    <div>
      <Indicator />
      <div className="border border-kb-border bg-[#FAFAFA] px-5 py-3 mb-5 text-[13px] text-kb-text-body space-y-1">
        <p>· 소지하고 계신 보안카드/OTP의 번호를 입력 후 [확인] 버튼을 선택하십시오.</p>
        <p>· 입력하신 내용을 다시 한 번 확인하시기 바랍니다.</p>
      </div>
      <DetailTable rows={detailRows} />
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
        ※ 전기통신금융사기 피해 방지 및 피해금 환급에 관한 특별법에 따라 금융회사에 등록된 이용자의 휴대폰을 통하여 본인 확인을 하고 있습니다.
      </p>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => { if (!smsCode) { alert('SMS 인증번호를 입력해주세요.'); return }; setStep(5) }}
          className="px-14 py-2.5 text-[14px] font-bold text-white hover:opacity-90"
          style={{ backgroundColor: '#5BC9A8' }}>
          확인
        </button>
        <button onClick={() => setStep(3)}
          className="px-14 py-2.5 text-[14px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light">
          취소
        </button>
      </div>
    </div>
  )

  /* ── STEP 5: 완료 ── */
  return (
    <div>
      <Indicator />
      <div className="border border-[#5BC9A8] bg-[#EBF9F5] px-6 py-5 mb-6 flex items-center gap-5">
        <div className="text-[48px] flex-shrink-0">👩</div>
        <div>
          <p className="text-[15px] font-bold text-[#2A8A6A] mb-1">대출금 상환이 완료되었습니다.</p>
          <p className="text-[13px] text-kb-text-muted">거래해 주셔서 진심으로 감사드립니다.</p>
          <p className="text-[13px] text-kb-text-muted">더 나은 서비스와 상품으로 보답하겠습니다.</p>
        </div>
      </div>
      <p className="text-[14px] font-bold text-kb-text mb-3">상환 상세 정보</p>
      <DetailTable rows={[
        ...detailRows,
        { label: '처리일시', value: `${todayStr} ${String(today.getHours()).padStart(2,'0')}:${String(today.getMinutes()).padStart(2,'0')}` },
      ]} />
      <div className="flex justify-center gap-2">
        <button className="px-8 py-2.5 text-[13px] text-kb-text-body border border-kb-border hover:bg-kb-beige-light">
          상환내역조회
        </button>
        <button
          onClick={() => { setStep(1); setAmount(''); setDebitAcc(''); setPassword(''); setSmsCode('') }}
          className="px-8 py-2.5 text-[13px] font-bold text-kb-text bg-kb-yellow hover:bg-kb-yellow-dark">
          대출관리 홈으로
        </button>
      </div>
    </div>
  )
}

function InfoTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="max-w-lg border border-kb-border">
      {rows.map((r, i) => (
        <div key={i} className={`flex ${i > 0 ? 'border-t border-kb-border' : ''}`}>
          <div className="w-48 px-4 py-3 bg-[#F5F5F5] text-[13px] font-medium text-kb-text flex-shrink-0">{r.label}</div>
          <div className="flex-1 px-4 py-3 text-[13px] text-kb-text-body">{r.value}</div>
        </div>
      ))}
    </div>
  )
}

function SimpleForm({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="max-w-lg">
      <div className="border border-kb-border p-5 space-y-4">
        <div className="flex items-center gap-4">
          <span className="w-28 text-[13px] font-medium text-kb-text flex-shrink-0">대출 계좌</span>
          <select className="flex-1 border border-kb-border px-3 py-2 text-[13px] focus:outline-none">
            <option>AXful 직장인 신용대출 (****-3456)</option>
            <option>AXful 아파트담보대출 (****-7890)</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-28 text-[13px] font-medium text-kb-text flex-shrink-0">{label}</span>
          <input type="text" placeholder={placeholder} className="flex-1 border border-kb-border px-3 py-2 text-[13px] focus:outline-none focus:border-kb-text" />
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <button className="px-12 py-2.5 text-[14px] font-bold text-white" style={{ backgroundColor: '#3D3D3D' }}>조회</button>
      </div>
    </div>
  )
}

const PAGE_MAP: Record<string, PageMeta> = {
  rate: {
    title: '적용금리조회', breadcrumb: '적용금리조회',
    description: '현재 대출상품에 적용되는 금리를 조회합니다.',
    content: <RateInfo />,
  },
  payment: {
    title: '이자/월부금입금', breadcrumb: '이자/월부금입금',
    content: <InterestPaymentForm />,
  },
  repay: {
    title: '대출금상환', breadcrumb: '대출금상환',
    content: <RepayForm />,
  },
  withdraw: {
    title: '대출계약철회 예상조회/완제', breadcrumb: '대출계약철회 예상조회/완제',
    description: '대출계약 철회 시 상환 예상금액을 조회하거나 완제 처리합니다.',
    content: <SimpleForm label="대출 실행일" placeholder="YYYY.MM.DD" />,
  },
  limit: {
    title: '대출한도변경/해지', breadcrumb: '대출한도변경/해지',
    description: '한도형 대출의 한도를 변경하거나 해지합니다.',
    content: <InfoTable rows={[
      { label: '현재 한도', value: '30,000,000원' },
      { label: '실행 잔액', value: '12,500,000원' },
      { label: '변경 가능 범위', value: '12,500,000원 ~ 30,000,000원' },
    ]} />,
  },
  extend: {
    title: '기한연장', breadcrumb: '기한연장',
    description: '대출 만기일을 연장합니다.',
    content: <InfoTable rows={[
      { label: '대출 만기일', value: '2027.05.25' },
      { label: '연장 가능 기간', value: '최대 1년' },
      { label: '연장 수수료', value: '없음' },
    ]} />,
  },
  'rate-cut': {
    title: '개인대출 금리인하요구권', breadcrumb: '개인대출 금리인하요구권',
    description: '신용 상태가 개선된 경우 금리 인하를 요구할 수 있습니다.',
    content: <SimpleForm label="요구 사유" placeholder="신용점수 상승, 소득 증가 등" />,
  },
  closed: {
    title: '해지계좌조회', breadcrumb: '해지계좌조회',
    description: '해지된 대출 계좌 내역을 조회합니다.',
    content: <SimpleForm label="조회 기간" placeholder="YYYY.MM.DD ~ YYYY.MM.DD" />,
  },
  'rate-detail': {
    title: '금리산정내역서 조회', breadcrumb: '금리산정내역서 조회',
    description: '대출 금리 산정 내역서를 조회합니다.',
    content: <SimpleForm label="대출 계좌" placeholder="계좌번호 입력" />,
  },
  'debt-relief': {
    title: '소멸시효완성에 따른 채무면제 결과조회', breadcrumb: '채무면제 결과조회',
    description: '소멸시효 완성에 따른 채무면제 처리 결과를 조회합니다.',
    content: <SimpleForm label="주민등록번호" placeholder="앞 6자리만 입력" />,
  },
  'auto-interest': {
    title: '통장자동대출 이자납입내역 조회', breadcrumb: '이자납입내역 조회',
    description: '통장자동대출의 이자 납입 내역을 조회합니다.',
    content: <SimpleForm label="조회 기간" placeholder="YYYY.MM ~ YYYY.MM" />,
  },
  notify: {
    title: '개인대출 통지서비스 변경', breadcrumb: '통지서비스 변경',
    description: '대출 관련 통지 방법(이메일/SMS)을 변경합니다.',
    content: <InfoTable rows={[
      { label: '현재 통지 방법', value: 'SMS' },
      { label: '이메일 수신', value: '미설정' },
      { label: '카카오알림톡', value: '수신 동의' },
    ]} />,
  },
  'payment-method': {
    title: '개인대출 할부금(이자) 납입방법 변경', breadcrumb: '납입방법 변경',
    description: '할부금 및 이자 납입 방법을 변경합니다.',
    content: <InfoTable rows={[
      { label: '현재 납입방법', value: '자동이체 (AXful 스타통장)' },
      { label: '납입일', value: '매월 25일' },
    ]} />,
  },
}

export default function ManagePage() {
  const params = useParams()
  const slug = params.slug as string
  const meta = PAGE_MAP[slug]

  if (!meta) {
    return (
      <main className="pb-16">
        <div className="max-w-kb-container mx-auto px-6 pt-6">
          <div className="flex gap-8">
            <LoanSidebar />
            <div className="flex-1 flex items-center justify-center py-20">
              <p className="text-[15px] text-kb-text-muted">페이지를 찾을 수 없습니다.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pb-16">
      <div className="max-w-kb-container mx-auto px-6 pt-6">
        <div className="flex gap-8">
          <LoanSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="text-[26px] font-bold text-kb-text mb-2">{meta.title}</h1>
            {meta.description && (
              <p className="text-[13px] text-kb-text-muted mb-6">{meta.description}</p>
            )}
            <div className="border-t border-kb-text pt-6">
              {meta.content}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
