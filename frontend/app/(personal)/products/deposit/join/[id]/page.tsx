'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'next/navigation'
import DepositSidebar from '@/components/products/DepositSidebar'

const PRODUCT_NAMES: Record<string, string> = {
  'axful-regular': 'AXful 정기예금',
  'axful-super': 'AXful 수퍼정기예금(개인)',
  'regular': '일반정기예금',
  'axful-youth': 'AXful 청년도약계좌',
}

const MATURITY_OPTIONS = ['자동재예치(원금+이자)', '자동재예치(원금)', '자동해지']

const TERM_DOCS = [
  { key: 'term1', label: '예금거래기본약관' },
  { key: 'term2', label: '거치식예금약관' },
  { key: 'term3', label: 'AXful Star 정기예금 특약' },
  { key: 'term4', label: 'AXful Star 정기예금 상품설명서' },
]

const PRIOR_TABS = ['기본이율', '우대이율', '중도해지이율', '만기후이율']

const BASIC_RATES = [
  { period: '1개월이상 ~ 3개월미만', base: '1.80', cust: '2.45' },
  { period: '3개월이상 ~ 6개월미만', base: '2.00', cust: '2.75' },
  { period: '6개월이상 ~ 9개월미만', base: '2.10', cust: '2.85' },
  { period: '9개월이상 ~ 12개월미만', base: '2.10', cust: '2.85' },
  { period: '12개월이상 ~ 24개월미만', base: '2.15', cust: '2.9' },
  { period: '24개월이상 ~ 36개월미만', base: '2.20', cust: '2.4' },
  { period: '36개월', base: '2.20', cust: '2.4' },
]

const EARLY_RATES = [
  { period: '1개월미만', rate: '0.1' },
  { period: '1개월이상 ~ 3개월미만', rate: '기본이율 x 50% x 경과월수/계약월수(단, 최저금리 0.1)' },
  { period: '3개월이상 ~ 6개월미만', rate: '기본이율 x 50% x 경과월수/계약월수(단, 최저금리 0.1)' },
  { period: '6개월이상 ~ 8개월미만', rate: '기본이율 x 60% x 경과월수/계약월수(단, 최저금리 0.2)' },
  { period: '8개월이상 ~ 10개월미만', rate: '기본이율 x 70% x 경과월수/계약월수(단, 최저금리 0.2)' },
  { period: '10개월이상 ~ 11개월미만', rate: '기본이율 x 80% x 경과월수/계약월수(단, 최저금리 0.2)' },
  { period: '11개월이상', rate: '기본이율 x 90% x 경과월수/계약월수(단, 최저금리 0.2)' },
]

const MATURITY_RATES = [
  { period: '만기후 1개월이내', rate: '기본이율 x 50%' },
  { period: '만기후 1개월초과 ~ 3개월 이내', rate: '기본이율 x 30%' },
  { period: '만기후 3개월초과', rate: '0.1' },
]

const TERM_CONTENT: Record<string, { title: string; body: React.ReactNode }> = {
  term1: {
    title: '예금거래기본약관',
    body: (
      <div className="text-[13px] text-kb-text-body leading-relaxed space-y-3 p-5 overflow-y-auto">
        <p className="font-bold text-center text-[15px] mb-4">예금거래기본약관</p>
        <h3 className="font-bold">제1조(적용범위)</h3>
        <p>이 약관은 입출금이 자유로운 예금, 거치식예금, 적립식예금 거래에 적용합니다.</p>
        <h3 className="font-bold">제2조(실명거래)</h3>
        <p>① 거래처는 실명으로 거래하여야 합니다.<br />② 은행은 거래처의 실명확인을 위하여 주민등록증·사업자등록증 등 실명확인증표 또는 그 밖에 필요한 서류의 제시나 제출을 요구할 수 있고, 거래처는 이에 따라야 합니다.</p>
        <h3 className="font-bold">제3조(거래장소)</h3>
        <p>거래처는 예금계좌를 개설한 영업점(이하 "개설점"이라 합니다)에서 모든 예금거래를 합니다. 다만, 은행이 정하는 바에 따라 다른 영업점이나 다른 금융기관, 또는 현금자동출금기·현금자동입출금기·컴퓨터·전화기 등(이하 "전산통신기기"라 합니다)을 통해 거래할 수 있습니다.</p>
        <h3 className="font-bold">제4조(거래방법)</h3>
        <p>거래처는 은행에서 내준 통장(증서, 전자통장을 포함합니다, 이하 같습니다.) 또는 수표·어음 용지로 거래하여야 합니다. 그러나 입금할 때와, 자동이체약정·전산통신기기·바이오인증 이용약정에 따라 거래하는 경우 및 기 등록된 생체정보(이하 "바이오정보"), 실명확인증표 등을 통해 본인확인된 경우에는 통장 없이(이하 "무통장")도 거래할 수 있습니다.</p>
      </div>
    ),
  },
  term2: {
    title: '거치식예금 약관',
    body: (
      <div className="text-[13px] text-kb-text-body leading-relaxed space-y-3 p-5 overflow-y-auto">
        <p className="font-bold text-center text-[15px] mb-4">거치식예금 약관</p>
        <h3 className="font-bold">제 1 조 적용범위</h3>
        <p>① 거치식예금(이하 '이 예금'이라 합니다)이란 예치기간을 정하고 거래를 시작할 때 맡긴 돈을 만기에 찾는 예금을 말합니다.<br />② 이 약관에서 정하지 아니한 사항은 예금거래기본약관의 규정을 적용합니다.<br />③ 양도성예금증서 및 표지어음의 거래에는 이 약관을 적용합니다.</p>
        <h3 className="font-bold">제 2 조 지급시기</h3>
        <p>이 예금은 약정한 만기일 이후 거래처가 청구할 때 지급합니다. 다만, 거래처가 부득이한 사정으로 청구할 때에는 만기일이라도 지급할 수 있습니다.</p>
        <h3 className="font-bold">제 3 조 이자</h3>
        <p>① 이 예금의 이자는 약정한 예치기간에 따라 예금일 당시 영업점에 게시한 예치기간별 이율로 셈하여 만기일 이후 원금과 함께 지급합니다. 그러나 거래처의 요청이 있으면 월별로 이자를 지급할 수 있습니다.<br />② 만기일 후 지급 청구할 때는 만기일로부터 지급일 전날까지의 기간에 대해 예금일 당시 영업점에 게시한 만기후이율로 셈한 이자를 더하여 지급합니다.</p>
        <p className="text-[11px] text-kb-text-muted mt-2">이 약관은 2017년 6월 30일 이후부터 적용합니다.</p>
        <p className="text-[11px] text-kb-text-muted">이 약관은 2020년 10월 8일 이후부터 적용합니다.</p>
        <p className="border border-kb-border px-3 py-2 text-[12px] mt-2">본 약관은 법령 및 내부통제기준에 따른 절차를 거쳐서 제공됩니다.</p>
      </div>
    ),
  },
  term3: {
    title: '「AXful Star 정기예금」특약',
    body: (
      <div className="text-[13px] text-kb-text-body leading-relaxed space-y-3 p-5 overflow-y-auto">
        <p className="font-bold text-center text-[15px] mb-4">「AXful Star 정기예금」특약</p>
        <h3 className="font-bold">제 1 조 적용범위</h3>
        <p>AXful Star 정기예금(이하 '이 예금'이라 합니다)거래는 이 특약을 적용하며, 이 특약에서 정하지 않은 사항은 예금거래기본약관 및 거치식예금약관을 적용합니다.</p>
        <h3 className="font-bold">제 2 조 거래방법</h3>
        <p>① 이 예금은 인터넷뱅킹, AX 스타뱅킹, 콜센터를 통해서만 신규 가입이 가능합니다.<br />② 이 예금은 인터넷뱅킹, AX 스타뱅킹, 영업점 창구를 통해서만 해지가 가능합니다.</p>
        <h3 className="font-bold">제 3 조 가입대상</h3>
        <p>이 예금의 가입자는 개인 및 개인사업자로 합니다.</p>
        <h3 className="font-bold">제 4 조 계정과목</h3>
        <p>이 예금의 계정과목은 정기예금으로 합니다.</p>
        <h3 className="font-bold">제 5 조 계약기간</h3>
        <p>이 예금의 계약기간은 1개월 이상 36개월 이내의 월단위로 합니다.</p>
        <h3 className="font-bold">제 6 조 저축방법</h3>
        <p>이 예금은 신규 시 1백만원 이상을 예치하여야 합니다.</p>
        <h3 className="font-bold">제 7 조 이율의 적용</h3>
        <p>① 이 예금의 이율은 신규 및 자동재예치 시 인터넷 홈페이지(www.axful.com) 및 영업점에 게시된 이율을 적용 합니다.</p>
      </div>
    ),
  },
  term4: {
    title: '「AXful Star 정기예금」상품설명서',
    body: (
      <div className="text-[13px] text-kb-text-body leading-relaxed space-y-3 p-5 overflow-y-auto">
        <p className="font-bold text-center text-[15px] mb-2">「AXful Star 정기예금」상품설명서</p>
        <p className="text-[11px] text-kb-text-muted text-center mb-4">준법감시인 심의필 제2025-2226-12호(유효기간: 2025.06.09 ~ 2027.05.31)</p>
        <div className="bg-[#FFF9E6] border border-[#C09B3A] p-3 text-[12px] space-y-1">
          <p>◈ 이 설명서는 금융소비자의 권익 보호 및 예금상품에 대한 이해 증진을 위하여 작성된 자료입니다.</p>
          <p>◈ 설명내용을 제대로 이해하지 못하였음에도 불구하고 설명을 이해했다는 서명을 하거나 녹취기록을 남기는 경우, 추후 해당 내용과 관련한 <span className="text-[#E05555]">권리구제가 어려울 수 있습니다.</span></p>
        </div>
        <h3 className="font-bold text-[14px] mt-2">1 상품 개요 및 특징</h3>
        <p>상품명: AXful Star 정기예금<br />상품특징: 인터넷뱅킹 등 비대면채널을 통해서만 가입 가능한 온라인 전용 정기예금</p>
        <h3 className="font-bold text-[14px]">2 거래 조건</h3>
        <table className="w-full border border-kb-border text-[12px]">
          <tbody className="divide-y divide-kb-border">
            {[['가입자격','개인 및 개인사업자'],['상품유형','정기예금'],['가입금액','1백만원이상(추가입금 불가)'],['가입기간','1개월 이상 36개월 이하(월 단위)']].map(([l,v]) => (
              <tr key={l}>
                <td className="bg-[#F5F5F5] px-3 py-2 font-medium w-28 border-r border-kb-border">{l}</td>
                <td className="px-3 py-2">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[11px] text-kb-text-muted">※ 이 상품은 예금자보호법에 따라 예금보험공사가 보호하되, 보호 한도는 본 은행에 있는 귀하의 모든 예금보호대상 금융상품의 원금과 소정의 이자를 합하여 1인당 "최고 5천만원"이며, 5천만원을 초과하는 나머지 금액은 보호하지 않습니다.</p>
      </div>
    ),
  },
}

function SquareCheck({ checked }: { checked: boolean }) {
  return (
    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
      checked ? 'border-[#5BC9A8] bg-[#5BC9A8]' : 'border-kb-border bg-white'
    }`}>
      {checked && (
        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
          <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  )
}


function ConfirmBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-kb-yellow px-8 py-2 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors"
    >
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
        <polyline points="3,8 6.5,11.5 13,5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {label}
    </button>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-kb-border py-4">
      <p className="text-[13px] font-semibold text-kb-text mb-2">{label}</p>
      {children}
    </div>
  )
}

export default function DepositJoinPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : 'axful-regular'
  const productName = PRODUCT_NAMES[id] ?? 'AXful 정기예금'

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  /* ─── Step 1 state ─── */
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [openModal, setOpenModal] = useState<string | null>(null)
  const [seqIdx, setSeqIdx] = useState<number | null>(null)
  const [priorTab, setPriorTab] = useState(0)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [finalCheck, setFinalCheck] = useState(false)

  /* ─── Step 2 state ─── */
  const [period, setPeriod] = useState('')
  const [periodPreset, setPeriodPreset] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [couponType, setCouponType] = useState<'coupon' | 'point' | 'none'>('none')
  const [taxExempt, setTaxExempt] = useState(false)
  const [passwordType, setPasswordType] = useState<'same' | 'new'>('same')
  const [maturity, setMaturity] = useState('자동재예치(원금+이자)')
  const [lms, setLms] = useState<'yes' | 'no' | null>(null)
  const [docMethod, setDocMethod] = useState<'email' | 'lms' | null>(null)

  /* ─── Step 3 state ─── */
  const [confirmPw, setConfirmPw] = useState('')
  const [mouseInput, setMouseInput] = useState(false)

  const STEP_LABELS = ['약관동의', '정보입력', '정보확인', '완료']

  function mark(key: string) { setChecked(prev => ({ ...prev, [key]: true })) }
  function toggleExpand(key: string) { setExpanded(prev => ({ ...prev, [key]: !prev[key] })) }

  function handleInfoGroupClick() {
    const allOn = checked.info_group && checked.illegal && checked.deposit_protect
    setChecked(prev => ({ ...prev, info_group: !allOn, illegal: !allOn, deposit_protect: !allOn }))
  }

  function addAmount(val: number) {
    const cur = parseInt(amount.replace(/,/g, '') || '0')
    setAmount((cur + val * 10000).toLocaleString())
  }

  function handleStep1Next() {
    if (!finalCheck) { alert('필수 약관에 모두 동의해 주세요.'); return }
    setStep(2)
  }
  function handleStep2Next() {
    const m = parseInt(period)
    if (!m || m < 1 || m > 36) { alert('가입기간을 올바르게 입력해주세요. (1~36개월)'); return }
    const a = parseInt(amount.replace(/,/g, ''))
    if (!a || a < 1000000) { alert('가입금액은 최소 100만원 이상이어야 합니다.'); return }
    setStep(3)
  }
  function handleFinalConfirm() {
    if (!confirmPw && !mouseInput) { alert('계좌 비밀번호를 입력해주세요.'); return }
    setStep(4)
  }

  const months = parseInt(period) || 0
  const maturityDate = months > 0
    ? new Date(2026, 5 - 1 + months, 25).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '')
    : '-'

  const allTermsChecked = TERM_DOCS.every(t => checked[t.key])

  return (
    <>
    <div className="max-w-kb-container mx-auto px-6 py-6">
      <div className="flex justify-end mb-3 text-[12px] text-kb-text-muted gap-1 items-center">
        <span>개인뱅킹</span><span>›</span>
        <span>금융상품</span><span>›</span>
        <span>예금</span><span>›</span>
        <Link href="/products/deposit" className="hover:underline">예금 상품/가입</Link>
        <span>›</span>
        <Link href="#" className="text-kb-blue hover:underline">도움말</Link>
      </div>

      <div className="flex gap-6">
        <DepositSidebar />

        <main className="flex-1 min-w-0">
          {/* 제목 + 스텝 */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-[20px] font-bold text-kb-text">{productName}</h1>
            <div className="flex gap-1">
              {STEP_LABELS.map((s, i) => (
                <button key={s}
                  className={`px-4 py-1.5 text-[12px] transition-colors ${
                    i + 1 === step ? 'font-bold text-white' : 'text-kb-text-body border border-kb-border bg-white'
                  }`}
                  style={i + 1 === step ? { backgroundColor: '#5BC9A8' } : {}}>
                  {i + 1}. {s}
                </button>
              ))}
            </div>
          </div>

          {/* ══════════ STEP 1: 약관동의 ══════════ */}
          {step === 1 && (
            <div>
              {/* 약관 및 상품설명서 */}
              <div className="border border-kb-border mb-4">
                {/* 섹션 헤더 */}
                <div className="flex items-center justify-between bg-[#F5F5F5] border-b border-kb-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const next: Record<string, boolean> = {}
                        TERM_DOCS.forEach(d => { next[d.key] = !allTermsChecked })
                        setChecked(prev => ({ ...prev, ...next }))
                      }}
                      className="p-0 leading-none"
                    >
                      <SquareCheck checked={allTermsChecked} />
                    </button>
                    <span className="text-[13px] font-bold text-kb-text">약관 및 상품설명서</span>
                  </div>
                  <button
                    onClick={() => setSeqIdx(0)}
                    className="text-[12px] text-kb-text-muted border border-kb-border px-3 py-1 hover:bg-kb-beige-light transition-colors"
                  >
                    전체약관보기
                  </button>
                </div>
                {/* 각 약관 항목 */}
                {TERM_DOCS.map(doc => (
                  <div key={doc.key} className="flex items-center justify-between px-5 py-3 border-b border-kb-border last:border-b-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setChecked(prev => ({ ...prev, [doc.key]: !prev[doc.key] }))}
                        className="p-0 leading-none"
                      >
                        <SquareCheck checked={!!checked[doc.key]} />
                      </button>
                      <span className="text-[11px] font-bold text-[#5BC9A8] border border-[#5BC9A8] px-1.5 py-0.5 rounded-sm flex-shrink-0">필수</span>
                      <span className="text-[13px] text-kb-text-body">{doc.label}</span>
                    </div>
                    <button
                      onClick={() => setOpenModal(doc.key)}
                      className="border border-kb-border px-3 py-1 text-[13px] text-kb-text-muted hover:bg-kb-beige-light transition-colors flex-shrink-0"
                    >
                      약관보기 ›
                    </button>
                  </div>
                ))}
              </div>

              {/* 확인 및 안내사항 */}
              <div className="border border-kb-border mb-4">
                {/* 섹션 헤더 — 클릭하면 하위 2개 동시 체크 */}
                <button
                  onClick={handleInfoGroupClick}
                  className="flex items-center gap-2 bg-[#F5F5F5] border-b border-kb-border px-4 py-3 w-full hover:bg-[#eeeeee] transition-colors">
                  <SquareCheck checked={!!checked.info_group} />
                  <span className="text-[13px] font-bold text-kb-text">확인 및 안내사항</span>
                </button>

                {/* 불법탈법 */}
                <div className="border-b border-kb-border">
                  <button
                    onClick={() => toggleExpand('illegal')}
                    className="flex items-center justify-between w-full px-4 py-3 hover:bg-[#fafafa] transition-colors">
                    <span className="flex items-center gap-2 text-[13px]">
                      <span onClick={e => { e.stopPropagation(); setChecked(p => ({ ...p, illegal: !p.illegal })) }}>
                        <SquareCheck checked={!!checked.illegal} />
                      </span>
                      <span className="text-[11px] font-bold text-[#5BC9A8] border border-[#5BC9A8] px-1.5 py-0.5 rounded-sm">필수</span>
                      <span className="font-semibold text-kb-text">불법·탈법 차명거래 금지 설명 확인</span>
                    </span>
                    <span className="text-kb-text-muted text-xs">{expanded.illegal ? '∧' : '›'}</span>
                  </button>
                  {expanded.illegal && (
                    <div className="px-6 py-3 bg-[#FAFAFA] text-[12px] text-kb-text-body leading-relaxed">
                      「금융실명거래및 비밀보장에 관한법률」 제 3조 제3항에 따라 누구든지 불법재산의 은닉, 자금세탁행위, 공중협박자금조달 행위 및 강제집행의 면탈, 그 밖의 탈법행위를 목적으로 타인의 실명으로 금융거래를 해서는 아니되며, 이를 위반시 5년 이하의 징역 또는 5천만원 이하의 벌금에 처해질 수 있습니다.
                    </div>
                  )}
                </div>

                {/* 예금자보호법 */}
                <div>
                  <button
                    onClick={() => toggleExpand('deposit_protect')}
                    className="flex items-center justify-between w-full px-4 py-3 hover:bg-[#fafafa] transition-colors">
                    <span className="flex items-center gap-2 text-[13px]">
                      <span onClick={e => { e.stopPropagation(); setChecked(p => ({ ...p, deposit_protect: !p.deposit_protect })) }}>
                        <SquareCheck checked={!!checked.deposit_protect} />
                      </span>
                      <span className="text-[11px] font-bold text-[#5BC9A8] border border-[#5BC9A8] px-1.5 py-0.5 rounded-sm">필수</span>
                      <span className="font-semibold text-kb-text">예금자보호법 설명확인</span>
                    </span>
                    <span className="text-kb-text-muted text-xs">{expanded.deposit_protect ? '∧' : '›'}</span>
                  </button>
                  {expanded.deposit_protect && (
                    <div className="px-6 py-3 bg-[#FAFAFA] text-[12px] text-kb-text-body leading-relaxed">
                      본인은 AX풀뱅크로부터 가입하는 금융상품의 예금자보호여부(보호 또는 비보호) 및 보호한도에 대하여 설명 받고 이해하였음을 확인합니다.
                    </div>
                  )}
                </div>
              </div>

              {/* 금융상품의 중요사항 안내 */}
              <div className="border border-kb-border mb-4">
                <div className="flex items-center gap-2 bg-[#F5F5F5] border-b border-kb-border px-4 py-3">
                  <SquareCheck checked={!!checked.prior && !!checked.burden && !!checked.linked} />
                  <span className="text-[13px] font-bold text-kb-text">금융상품의 중요사항 안내</span>
                </div>

                {/* 우선설명 사항 */}
                <div className="border-b border-kb-border">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="flex items-center gap-2 text-[13px]">
                      <SquareCheck checked={!!checked.prior} />
                      <span className="text-[11px] font-bold text-[#5BC9A8] border border-[#5BC9A8] px-1.5 py-0.5 rounded-sm">필수</span>
                      <span className="font-semibold text-kb-text">우선설명 사항</span>
                    </span>
                    <button
                      onClick={() => setOpenModal('prior')}
                      className="border border-kb-border px-3 py-1 text-[13px] text-kb-text-muted hover:bg-kb-beige-light transition-colors flex-shrink-0"
                    >
                      안내사항 보기 ›
                    </button>
                  </div>
                </div>

                {/* 부담정보 */}
                <div className="border-b border-kb-border">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="flex items-center gap-2 text-[13px]">
                      <SquareCheck checked={!!checked.burden} />
                      <span className="text-[11px] font-bold text-[#5BC9A8] border border-[#5BC9A8] px-1.5 py-0.5 rounded-sm">필수</span>
                      <span className="font-semibold text-kb-text">부담정보 및 금융소비자의 권리 사항</span>
                    </span>
                    <button
                      onClick={() => setOpenModal('burden')}
                      className="border border-kb-border px-3 py-1 text-[13px] text-kb-text-muted hover:bg-kb-beige-light transition-colors flex-shrink-0"
                    >
                      권리사항 보기 ›
                    </button>
                  </div>
                </div>

                {/* 예금성 상품 및 연계·제류 서비스 */}
                <div>
                  <button
                    onClick={() => toggleExpand('linked')}
                    className="flex items-center justify-between w-full px-4 py-3 hover:bg-[#fafafa] transition-colors">
                    <span className="flex items-center gap-2 text-[13px]">
                      <span onClick={e => { e.stopPropagation(); setChecked(p => ({ ...p, linked: !p.linked })) }}>
                        <SquareCheck checked={!!checked.linked} />
                      </span>
                      <span className="text-[11px] font-bold text-[#5BC9A8] border border-[#5BC9A8] px-1.5 py-0.5 rounded-sm">필수</span>
                      <span className="font-semibold text-kb-text">예금성 상품 및 연계·제휴 서비스</span>
                    </span>
                    <span className="text-kb-text-muted text-xs">{expanded.linked ? '∧' : '›'}</span>
                  </button>
                  {expanded.linked && (
                    <div className="px-6 py-3 bg-[#FAFAFA] text-[12px] text-kb-text-body leading-relaxed">
                      <ul className="space-y-1 mb-2">
                        {['예금상품의 내용(계약기간, 이자의 지급시기 및 지급제한 사유)','계약의 해제·해지',
                          '연계·제휴 서비스의 내용, 제공받을 수 있는 요건, 제공기간, 이행책임, 변경시 변경내용 및 그 사유 등을 사전에 알린다는 사실 및 알리는 방법'].map(item => (
                          <li key={item} className="flex gap-1.5 before:content-['·'] before:flex-shrink-0">{item}</li>
                        ))}
                      </ul>
                      <p className="text-kb-text-muted">※ 금융상품의 중요사항에 대한 일반적인 안내사항으로 세부내용은상품설명서를 통해 확인하실 수 있습니다.</p>
                      <p className="text-kb-text-muted mt-1">※ 금융소비자는 해당상품 또는 연계·제휴서비스에 대해 설명받을 권리가 있습니다. 궁금한 내용이 있으시면 챗봇/채팅상담, 고객센터 (☎1588-9999), 영업점 직원에게 문의해주시기 바랍니다.</p>
                      <p className="text-kb-text-muted mt-1">① 「금융소비자보호법」 제19조(설명의무) 항목에서 규정하고 있는 금융상품의 중요한 사항입니다.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 최종 동의 */}
              <div className="border border-kb-border p-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={finalCheck} onChange={e => setFinalCheck(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#5BC9A8]" />
                  <div>
                    <p className="text-[13px] text-kb-text">본인은 위 예금상품의 약관 및 상품설명서를 제공받고 예금상품의 중요한 사항을 충분히 이해하며 본 상품에 가입함을 확인합니다.</p>
                    <p className="text-[12px] text-[#E05555] mt-1">※ 설명내용을 제대로 이해하지 못하였음에도 설명을 이해했다는 확인을 하는 경우, 추후 권리구제가 어려울 수 있습니다.</p>
                  </div>
                </label>
              </div>

              <div className="flex justify-center gap-2">
                <Link href={`/products/deposit/${id}`}
                  className="border border-kb-border px-10 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">
                  이전
                </Link>
                <button onClick={handleStep1Next}
                  className={`px-10 py-2.5 text-[13px] font-bold transition-colors ${
                    finalCheck ? 'bg-kb-yellow text-kb-text hover:bg-kb-yellow-dark' : 'bg-kb-beige text-kb-text-muted cursor-not-allowed'
                  }`}>
                  다음
                </button>
              </div>
            </div>
          )}

          {/* ══════════ STEP 2: 정보입력 ══════════ */}
          {step === 2 && (
            <div>
              <p className="text-[14px] font-bold text-[#5BC9A8] border-b-2 border-[#5BC9A8] inline-block pb-1 mb-4">정보입력</p>
              <div className="border border-kb-border px-5 py-2 mb-6 space-y-0">
                <FormRow label="가입기간">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[12px] text-kb-text-muted mr-2">1~36개월, 월단위</p>
                    <input type="text" value={period} onChange={e => setPeriod(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="기간" className="border border-kb-border px-3 py-1.5 text-[13px] w-20 outline-none" />
                    <span className="text-[13px]">개월</span>
                    {[6, 12, 24, 36].map(m => (
                      <button key={m}
                        onClick={() => { setPeriod(String(m)); setPeriodPreset(String(m)) }}
                        className={`px-4 py-1.5 text-[12px] border transition-colors ${
                          periodPreset === String(m) ? 'border-[#5BC9A8] text-[#5BC9A8] font-bold bg-white' : 'border-kb-border text-kb-text-body hover:bg-kb-beige-light'
                        }`}>
                        {m}개월
                      </button>
                    ))}
                  </div>
                </FormRow>
                <FormRow label="가입금액">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[12px] text-kb-text-muted mr-2">최소 100만원 이상, 원단위</p>
                    <input type="text" value={amount} onChange={e => setAmount(e.target.value)}
                      placeholder="0" className="border border-kb-border px-3 py-1.5 text-[13px] w-32 outline-none text-right" />
                    <span className="text-[13px]">원</span>
                    {[1000, 500, 300, 100].map(v => (
                      <button key={v} onClick={() => addAmount(v)}
                        className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">
                        {v >= 1000 ? `${v / 100}천만` : `${v}만`}
                      </button>
                    ))}
                  </div>
                </FormRow>
                <FormRow label="AXful금융쿠폰/포인트리 사용">
                  <div className="flex gap-6">
                    {([['coupon', 'AXful금융쿠폰(0)'], ['point', '포인트리'], ['none', '사용안함']] as const).map(([val, label]) => (
                      <label key={val} className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="radio" name="coupon" checked={couponType === val} onChange={() => setCouponType(val)} className="accent-[#5BC9A8]" />
                        {label}
                      </label>
                    ))}
                  </div>
                </FormRow>
                <FormRow label="비과세종합저축으로 가입">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                      <input type="checkbox" checked={taxExempt} onChange={e => setTaxExempt(e.target.checked)} className="w-4 h-4 accent-[#5BC9A8]" />
                      비과세종합저축 적용
                    </label>
                    <button className="text-[12px] text-kb-blue hover:underline">자세히보기 ›</button>
                  </div>
                </FormRow>
                <FormRow label="출금계좌번호">
                  <div className="flex items-center gap-2 mb-1">
                    <select className="border border-kb-border px-3 py-1.5 text-[13px] outline-none bg-white"><option>AX풀뱅크</option></select>
                    <select className="border border-kb-border px-3 py-1.5 text-[13px] outline-none bg-white flex-1 max-w-[280px]">
                      <option>531089-04-274618(AX풀뱅크)</option>
                    </select>
                  </div>
                  <p className="text-[12px]">출금가능금액 <span className="text-[#E05555] font-bold">1,007,807</span>원</p>
                </FormRow>
                <FormRow label="비밀번호 입력">
                  <div className="flex gap-6">
                    {([['same', '출금계좌와 동일하게 설정'], ['new', '신규 설정']] as const).map(([val, label]) => (
                      <label key={val} className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="radio" name="pw" checked={passwordType === val} onChange={() => setPasswordType(val)} className="accent-[#5BC9A8]" />
                        {label}
                      </label>
                    ))}
                  </div>
                </FormRow>
                <FormRow label="만기 해지방법">
                  <select value={maturity} onChange={e => setMaturity(e.target.value)} className="border border-kb-border px-3 py-1.5 text-[13px] outline-none bg-white w-60">
                    {MATURITY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <p className="text-[12px] text-kb-text-muted mt-1">* 만기 해지방법은 만기일 전까지 변경할 수 있습니다.</p>
                </FormRow>
                <FormRow label="상품만기알림(LMS) 서비스 신청">
                  <div className="flex gap-6 mb-2">
                    {([['yes', '예'], ['no', '아니오']] as const).map(([val, label]) => (
                      <label key={val} className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="radio" name="lms" checked={lms === val} onChange={() => setLms(val)} className="accent-[#5BC9A8]" />
                        {label}
                      </label>
                    ))}
                  </div>
                  <p className="text-[12px] text-kb-text-muted">LMS를 통해 예·적금상품의 만기를 사전 안내해드리는 서비스</p>
                </FormRow>
                <FormRow label="권유직원선택">
                  <select className="border border-kb-border px-3 py-1.5 text-[13px] outline-none bg-white w-48"><option>권유직원없음</option></select>
                </FormRow>
                <FormRow label="예금상품 계약서, 약관(특약), 상품설명서 제공">
                  <div className="flex gap-6 mb-2">
                    {([['email', '이메일주소로 받기'], ['lms', '문자메시지(LMS) 받기']] as const).map(([val, label]) => (
                      <label key={val} className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="radio" name="doc" checked={docMethod === val} onChange={() => setDocMethod(val)} className="accent-[#5BC9A8]" />
                        {label}
                      </label>
                    ))}
                  </div>
                  <p className="text-[12px] text-kb-text-muted">※ 금융소비자보호법에 따라 이메일 및 문자메시지(LMS) 수신 거부 여부와 관계없이 발송됩니다.</p>
                </FormRow>
              </div>
              <div className="border border-kb-border bg-[#FAFAFA] px-4 py-3 mb-6 text-[12px] text-kb-text-body space-y-1">
                {['본 상품을 인터넷/AXful뱅킹으로 해지할 경우 휴대전화의 인증을 통해 해지가능합니다.','최신전화 휴대전화는 인증이 되지 않습니다.'].map((n, i) => (
                  <p key={i} className="flex gap-1.5"><span className="flex-shrink-0">·</span><span>{n}</span></p>
                ))}
              </div>
              <div className="flex justify-center gap-2">
                <button onClick={() => setStep(1)} className="border border-kb-border px-10 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">이전</button>
                <button onClick={handleStep2Next} className="bg-kb-yellow px-10 py-2.5 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark">다음</button>
                <button className="border border-kb-border px-10 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">임시저장</button>
              </div>
            </div>
          )}

          {/* ══════════ STEP 3: 정보확인 ══════════ */}
          {step === 3 && (
            <div>
              <p className="text-[14px] font-bold text-[#5BC9A8] border-b-2 border-[#5BC9A8] inline-block pb-1 mb-4">정보 확인</p>
              <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-3">
                <tbody>
                  {[
                    { label: '신규일자', value: '2026.05.25' },
                    { label: '가입기간', value: `${maturityDate} (${period}개월)` },
                    { label: '가입금액', value: `${amount}원` },
                    { label: '이자지급방법', value: '만기일시지급' },
                    { label: '적용금리', value: '2.1 + 0.75(%)' },
                    { label: '적용과세', value: taxExempt ? '비과세' : '일반' },
                    { label: '출금계좌', value: 'AX풀뱅크 531089-04-274618' },
                    { label: '상품만기알림(LMS) 서비스 신청', value: lms === 'yes' ? '신청' : '미신청' },
                    { label: '연계·제휴서비스', value: '해당사항 없음' },
                  ].map(row => (
                    <tr key={row.label}>
                      <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-[180px] whitespace-nowrap">{row.label}</td>
                      <td className="border border-kb-border px-4 py-3 text-kb-text-body">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-[12px] text-kb-text-muted mb-5 space-y-1">
                <p>※ 가입 후에는 '계약서류' 관련 약관을 통해 상품설명문서를 확인할 수 있습니다.</p>
              </div>
              <div className="border-t-2 border-kb-text pt-4">
                <p className="text-[14px] font-bold text-[#5BC9A8] border-b-2 border-[#5BC9A8] inline-block pb-1 mb-3">출금계좌 및 비밀번호 확인</p>
                <table className="w-full border-collapse text-[13px]">
                  <tbody>
                    <tr>
                      <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-[120px]">계좌번호</td>
                      <td className="border border-kb-border px-4 py-3 text-kb-text-body">531089-04-274618</td>
                    </tr>
                    <tr>
                      <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text">계좌 비밀번호</td>
                      <td className="border border-kb-border px-4 py-3">
                        <div className="flex items-center gap-3">
                          <input type={mouseInput ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                            maxLength={4} className="border border-kb-border px-3 py-1.5 text-[13px] w-28 outline-none" />
                          <label className="flex items-center gap-1.5 text-[12px] cursor-pointer">
                            <input type="checkbox" checked={mouseInput} onChange={e => setMouseInput(e.target.checked)} />
                            마우스로 입력
                          </label>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                <button onClick={() => setStep(2)} className="border border-kb-border px-10 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">이전</button>
                <button onClick={handleFinalConfirm} className="bg-kb-yellow px-10 py-2.5 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark">확인</button>
              </div>
            </div>
          )}

          {/* ══════════ STEP 4: 완료 ══════════ */}
          {step === 4 && (
            <div className="border border-kb-border py-16 text-center">
              <div className="flex justify-center mb-4">
                <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
                  <circle cx="24" cy="24" r="22" fill="#5BC9A8" />
                  <polyline points="13,24 21,32 35,16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[18px] font-bold text-kb-text mb-2">{productName} 가입이 완료되었습니다.</p>
              <p className="text-[13px] text-kb-text-muted mb-1">신규일자 2026.05.25 &nbsp;|&nbsp; 가입금액 {amount}원</p>
              <p className="text-[13px] text-kb-text-muted mb-8">신규 결과는 신규결과/내역 조회에서 확인하실 수 있습니다.</p>
              <div className="flex justify-center gap-2">
                <Link href="/products/deposit/inquiry/new"
                  className="inline-block border border-kb-border px-8 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">
                  신규결과 조회
                </Link>
                <Link href="/products/deposit"
                  className="inline-block bg-kb-yellow px-8 py-2.5 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark">
                  예금 상품 목록
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>

    {/* ══════════ 약관 문서 모달 (개별 보기) ══════════ */}
    {openModal && TERM_CONTENT[openModal] && createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setOpenModal(null)} />
        <div className="relative bg-white w-[680px] max-h-[80vh] flex flex-col shadow-lg">
          <div className="flex items-center justify-between px-5 py-3 border-b border-kb-border flex-shrink-0">
            <p className="text-[14px] font-bold text-kb-text">약관 및 상품설명서</p>
            <button onClick={() => setOpenModal(null)} className="text-[18px] leading-none text-kb-text-muted hover:text-kb-text">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {TERM_CONTENT[openModal].body}
          </div>
          <div className="flex justify-center items-center px-5 py-3 border-t border-kb-border flex-shrink-0">
            <ConfirmBtn onClick={() => { mark(openModal); setOpenModal(null) }} label="확인" />
          </div>
        </div>
      </div>,
      document.body
    )}

    {/* ══════════ 전체약관보기 순차 모달 ══════════ */}
    {seqIdx !== null && TERM_DOCS[seqIdx] && createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setSeqIdx(null)} />
        <div className="relative bg-white w-[680px] max-h-[80vh] flex flex-col shadow-lg">
          <div className="flex items-center justify-between px-5 py-3 border-b border-kb-border flex-shrink-0">
            <p className="text-[14px] font-bold text-kb-text">
              약관 및 상품설명서 ({seqIdx + 1}/{TERM_DOCS.length})
            </p>
            <button onClick={() => setSeqIdx(null)} className="text-[18px] leading-none text-kb-text-muted hover:text-kb-text">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {TERM_CONTENT[TERM_DOCS[seqIdx].key].body}
          </div>
          <div className="flex justify-center items-center px-5 py-3 border-t border-kb-border flex-shrink-0">
            <ConfirmBtn
              onClick={() => {
                if (seqIdx === null) return
                mark(TERM_DOCS[seqIdx].key)
                const next = seqIdx + 1
                setSeqIdx(next < TERM_DOCS.length ? next : null)
              }}
              label={seqIdx + 1 < TERM_DOCS.length ? '확인 (다음)' : '확인'}
            />
          </div>
        </div>
      </div>,
      document.body
    )}

    {/* ══════════ 우선설명 사항 모달 ══════════ */}
    {openModal === 'prior' && createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setOpenModal(null)} />
        <div className="relative bg-white w-[680px] max-h-[80vh] flex flex-col shadow-lg">
          <div className="flex items-center justify-between px-5 py-3 border-b border-kb-border flex-shrink-0">
            <p className="text-[14px] font-bold text-kb-text">우선설명 사항 [필수]</p>
            <button onClick={() => setOpenModal(null)} className="text-[18px] leading-none text-kb-text-muted hover:text-kb-text">✕</button>
          </div>
          {/* 탭 */}
          <div className="flex border-b border-kb-border flex-shrink-0">
            {PRIOR_TABS.map((tab, i) => (
              <button key={tab} onClick={() => setPriorTab(i)}
                className={`flex-1 py-2.5 text-[13px] transition-colors ${
                  priorTab === i ? 'font-bold text-kb-text border-b-2 border-kb-text -mb-px' : 'text-kb-text-muted hover:text-kb-text'
                }`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <p className="text-[13px] font-semibold text-kb-text mb-3">AXful 정기예금</p>
            {priorTab === 0 && (
              <>
                <p className="text-[11px] text-kb-text-muted mb-2 text-right">(세금공제전, 단위:연%)</p>
                <table className="w-full text-[12px] border border-kb-border">
                  <thead className="bg-[#F5F5F5]">
                    <tr>
                      <th className="px-3 py-2 border-b border-kb-border text-center">기간</th>
                      <th className="px-3 py-2 border-b border-kb-border text-center">기본이율</th>
                      <th className="px-3 py-2 border-b border-kb-border text-center">고객적용이율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-kb-border">
                    {BASIC_RATES.map(r => (
                      <tr key={r.period} className="hover:bg-kb-beige-light">
                        <td className="px-3 py-2 text-center">{r.period}</td>
                        <td className="px-3 py-2 text-center">{r.base}</td>
                        <td className="px-3 py-2 text-center">{r.cust}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 text-[11px] text-kb-text-muted space-y-1">
                  <p>- 금리우대쿠폰: 이 예금의 신규 시 금리우대쿠폰을 적용한 경우 쿠폰 우대금리를 기본이율에 가산</p>
                  <p>- 금리우대쿠폰 우대금리는 신규 당시 적용한 쿠폰의 우대금리를 따르며, 세부 사항(적용방법, 유의사항 등)은 금리우대쿠폰에서 확인 가능</p>
                  <p>※ 금리우대쿠폰은 신규 시에만 사용 가능하며 재예치 및 중도해지 시 미적용</p>
                </div>
              </>
            )}
            {priorTab === 1 && (
              <div className="text-[13px] text-kb-text-muted text-center py-10">해당 금리내용이 없습니다.</div>
            )}
            {priorTab === 2 && (
              <>
                <p className="text-[11px] text-kb-text-muted mb-2">(조회일 기준, 세금공제전, 단위:연%)</p>
                <table className="w-full text-[12px] border border-kb-border">
                  <thead className="bg-[#F5F5F5]">
                    <tr>
                      <th className="px-3 py-2 border-b border-kb-border text-center">예치기간</th>
                      <th className="px-3 py-2 border-b border-kb-border text-center">이 율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-kb-border">
                    {EARLY_RATES.map(r => (
                      <tr key={r.period} className="hover:bg-kb-beige-light">
                        <td className="px-3 py-2 text-center">{r.period}</td>
                        <td className="px-3 py-2 text-center text-[11px]">{r.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 text-[11px] text-kb-text-muted space-y-1">
                  <p>1. 기본이율: 신규가입일 당시 영업점에 고시된 계약기간별 이율(우대이율 제외)</p>
                  <p>2. 경과월수: 입금일 다음날부터 해지일 입금해당날까지를 필수로 하고, 1개월미만은 절상</p>
                  <p>3. 이율은 소수점 둘째자리까지 표시(소수점 셋째자리에서 절사)</p>
                </div>
              </>
            )}
            {priorTab === 3 && (
              <>
                <p className="text-[11px] text-kb-text-muted mb-2">(조회일 기준, 세금공제전, 단위:연%)</p>
                <table className="w-full text-[12px] border border-kb-border">
                  <thead className="bg-[#F5F5F5]">
                    <tr>
                      <th className="px-3 py-2 border-b border-kb-border text-center">경과기간</th>
                      <th className="px-3 py-2 border-b border-kb-border text-center">이 율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-kb-border">
                    {MATURITY_RATES.map(r => (
                      <tr key={r.period} className="hover:bg-kb-beige-light">
                        <td className="px-3 py-2 text-center">{r.period}</td>
                        <td className="px-3 py-2 text-center">{r.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
          <div className="flex justify-center items-center px-5 py-3 border-t border-kb-border flex-shrink-0">
            <ConfirmBtn onClick={() => { mark('prior'); setOpenModal(null) }} label="확인" />
          </div>
        </div>
      </div>,
      document.body
    )}

    {/* ══════════ 부담정보 모달 ══════════ */}
    {openModal === 'burden' && createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setOpenModal(null)} />
        <div className="relative bg-white w-[680px] max-h-[80vh] flex flex-col shadow-lg">
          <div className="flex items-center justify-between px-5 py-3 border-b border-kb-border flex-shrink-0">
            <p className="text-[14px] font-bold text-kb-text">부담정보 및 금융소비자의 권리 사항 [필수]</p>
            <button onClick={() => setOpenModal(null)} className="text-[18px] leading-none text-kb-text-muted hover:text-kb-text">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 text-[13px] text-kb-text-body space-y-5">
            <div>
              <h3 className="font-bold mb-1">중도 해지에 따른 불이익</h3>
              <p className="text-[12px]">신규가입일 당시 영업점 및 인터넷 홈페이지(www.axful.com)에 고시된 예치기간별 중도해지이율 적용<br />※ 긴급 자금수요 등으로 중도해지할 경우 예금성 상품 중도해지이율에 비해 회전식 예금성 상품이 유리할 수 있음</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">금리변동형 상품 안내</h3>
              <p className="text-[12px] mb-2">금리변동형 예금성 상품은 금리상승에 약정금리 인상 가능성이 큰 반면, 금리 하락기에는 약정금리 인하로 소비자에게 돌려줄 수 있습니다</p>
              <table className="w-full border border-kb-border text-[12px]">
                <thead className="bg-[#F5F5F5]">
                  <tr>
                    <th className="px-3 py-2 border-b border-r border-kb-border">구분</th>
                    <th className="px-3 py-2 border-b border-r border-kb-border">고정금리</th>
                    <th className="px-3 py-2 border-b border-kb-border">변동금리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-kb-border">
                  {[
                    ['특징','예금 가입시 결정된 금리가 예금만기까지 동일하게 유지','일정주기(3/6개월 등)마다 예금 기준금리의 변동에 따라 예금금리가 변동'],
                    ['장점','시장금리 하락기에 이자 하락이 없음','시장금리 상승기에 이자 수익이 증가'],
                    ['단점','시장금리 상승기에 이자 상승 효과가 없어 변동금리보다 불리','시장금리 하락기에는 이자 하락으로 고정금리보다 불리'],
                  ].map(([k,a,b]) => (
                    <tr key={k}>
                      <td className="px-3 py-2 border-r border-kb-border font-medium text-center">{k}</td>
                      <td className="px-3 py-2 border-r border-kb-border">{a}</td>
                      <td className="px-3 py-2">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="font-bold mb-1">자료열람요구권 행사에 관한 사항</h3>
              <p className="text-[12px]">금융소비자는 분쟁조정 또는 소송의 수행 등 권리구제를 위한 목적으로 금융회사가 기록 및 유지·관리하는 다음의 자료에 대한 열람(사본 및 청취 포함)을 요구할 수 있습니다.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">위법계약해지권 행사에 관한 사항</h3>
              <p className="text-[12px]">금융소비자는 금융소비자보호법 제47조에 따라 금융상품에 관한 계약을 체결하는 경우 법 위반사실을 안 날부터 1년 이내(해당 계약의 체결일부터 5년 이내)의 범위에서 해지를 요구할 수 있습니다.</p>
            </div>
          </div>
          <div className="flex justify-center items-center px-5 py-3 border-t border-kb-border flex-shrink-0">
            <ConfirmBtn onClick={() => { mark('burden'); setOpenModal(null) }} label="확인" />
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  )
}
