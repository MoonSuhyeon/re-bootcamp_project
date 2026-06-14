'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import DepositSidebar from '@/components/products/DepositSidebar'

const STEP_LABELS = ['보유계좌조회', '전환가능상품조회', '약관동의', '정보입력', '입력확인', '완료']

const MOCK_ACCOUNTS = [
  { no: '531089-04-274618', name: 'AX풀뱅크ONE통장-보통예금', balance: '1,000,000' },
]

const CONVERT_PRODUCTS = [
  { id: 'kb-all', name: 'AXful종합통장-보통예금', desc: '입출금이 자유로운 종합통장' },
  { id: 'general', name: '일반보통예금', desc: '기본 입출금 보통예금' },
]

const TERM_DOCS = [
  { key: 'term1', label: '예금거래기본약관' },
  { key: 'term2', label: '입출금이자유로운예금약관' },
  { key: 'term3', label: 'AXful종합통장 특약' },
  { key: 'term4', label: 'AXful종합통장-보통예금 상품설명서' },
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
        <p>거래처는 예금계좌를 개설한 영업점(이하 "개설점"이라 합니다)에서 모든 예금거래를 합니다. 다만, 은행이 정하는 바에 따라 다른 영업점이나 다른 금융기관, 또는 전산통신기기를 통해 거래할 수 있습니다.</p>
        <h3 className="font-bold">제4조(거래방법)</h3>
        <p>거래처는 은행에서 내준 통장(증서, 전자통장을 포함합니다, 이하 같습니다.) 또는 수표·어음 용지로 거래하여야 합니다. 그러나 입금할 때와 자동이체약정·전산통신기기·바이오인증 이용약정에 따라 거래하는 경우에는 통장 없이도 거래할 수 있습니다.</p>
      </div>
    ),
  },
  term2: {
    title: '입출금이자유로운예금약관',
    body: (
      <div className="text-[13px] text-kb-text-body leading-relaxed space-y-3 p-5 overflow-y-auto">
        <p className="font-bold text-center text-[15px] mb-4">입출금이자유로운예금약관</p>
        <h3 className="font-bold">제 1 조 적용범위</h3>
        <p>입출금이 자유로운 예금(이하 &apos;이 예금&apos;이라 합니다)이란 예치기간을 정하지 않고 언제든지 입출금이 가능한 예금을 말합니다. 이 약관에서 정하지 아니한 사항은 예금거래기본약관의 규정을 적용합니다.</p>
        <h3 className="font-bold">제 2 조 이자</h3>
        <p>이 예금의 이자는 예금 잔액에 따라 영업점에 게시된 이율을 적용하며, 매월 말일에 계산하여 원금에 가산합니다.</p>
        <h3 className="font-bold">제 3 조 지급</h3>
        <p>이 예금은 거래처가 청구할 때에 지급합니다.</p>
        <p className="text-[11px] text-kb-text-muted mt-2">이 약관은 2020년 10월 8일 이후부터 적용합니다.</p>
        <p className="border border-kb-border px-3 py-2 text-[12px] mt-2">본 약관은 법령 및 내부통제기준에 따른 절차를 거쳐서 제공됩니다.</p>
      </div>
    ),
  },
  term3: {
    title: 'AXful종합통장 특약',
    body: (
      <div className="text-[13px] text-kb-text-body leading-relaxed space-y-3 p-5 overflow-y-auto">
        <p className="font-bold text-center text-[15px] mb-4">AXful종합통장 특약</p>
        <h3 className="font-bold">제 1 조 적용범위</h3>
        <p>AXful종합통장(이하 &apos;이 통장&apos;이라 합니다) 거래는 이 특약을 적용하며, 이 특약에서 정하지 않은 사항은 예금거래기본약관 및 입출금이자유로운예금약관을 적용합니다.</p>
        <h3 className="font-bold">제 2 조 거래방법</h3>
        <p>이 통장은 인터넷뱅킹 및 영업점을 통해 가입이 가능합니다.</p>
        <h3 className="font-bold">제 3 조 가입대상</h3>
        <p>이 통장의 가입자는 개인으로 합니다.</p>
        <h3 className="font-bold">제 4 조 계정과목</h3>
        <p>이 통장의 계정과목은 보통예금으로 합니다.</p>
      </div>
    ),
  },
  term4: {
    title: 'AXful종합통장-보통예금 상품설명서',
    body: (
      <div className="text-[13px] text-kb-text-body leading-relaxed space-y-3 p-5 overflow-y-auto">
        <p className="font-bold text-center text-[15px] mb-2">AXful종합통장-보통예금 상품설명서</p>
        <p className="text-[11px] text-kb-text-muted text-center mb-4">준법감시인 심의필 제2025-2226-15호(유효기간: 2025.06.09 ~ 2027.05.31)</p>
        <div className="bg-[#FFF9E6] border border-[#C09B3A] p-3 text-[12px] space-y-1">
          <p>◈ 이 설명서는 금융소비자의 권익 보호 및 예금상품에 대한 이해 증진을 위하여 작성된 자료입니다.</p>
          <p>◈ 설명내용을 제대로 이해하지 못하였음에도 불구하고 설명을 이해했다는 서명을 하거나 녹취기록을 남기는 경우, 추후 해당 내용과 관련한 <span className="text-[#E05555]">권리구제가 어려울 수 있습니다.</span></p>
        </div>
        <h3 className="font-bold text-[14px] mt-2">1 상품 개요 및 특징</h3>
        <p>상품명: AXful종합통장-보통예금<br />상품특징: 입출금이 자유로운 종합통장 상품</p>
        <h3 className="font-bold text-[14px]">2 거래 조건</h3>
        <table className="w-full border border-kb-border text-[12px]">
          <tbody className="divide-y divide-kb-border">
            {[['가입자격','개인'],['상품유형','입출금이 자유로운 예금'],['가입금액','제한없음'],['가입기간','제한없음']].map(([l,v]) => (
              <tr key={l}>
                <td className="bg-[#F5F5F5] px-3 py-2 font-medium w-28 border-r border-kb-border">{l}</td>
                <td className="px-3 py-2">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[11px] text-kb-text-muted">※ 이 상품은 예금자보호법에 따라 예금보험공사가 보호하되, 보호 한도는 본 은행에 있는 귀하의 모든 예금보호대상 금융상품의 원금과 소정의 이자를 합하여 1인당 &quot;최고 5천만원&quot;이며, 5천만원을 초과하는 나머지 금액은 보호하지 않습니다.</p>
      </div>
    ),
  },
}

const CARD_DATA = [
  { pos: '01' }, { pos: '02' }, { pos: '03' }, { pos: '04' }, { pos: '05' }, { pos: '06' }, { pos: '07' },
  { pos: '08' }, { pos: '09' }, { pos: '10' }, { pos: '11' }, { pos: '12' }, { pos: '13' }, { pos: '14' },
  { pos: '15' }, { pos: '16' }, { pos: '17' }, { pos: '18' }, { pos: '19' }, { pos: '20' }, { pos: '21' },
  { pos: '22' }, { pos: '23' }, { pos: '24' }, { pos: '25' }, { pos: '26' }, { pos: '27' }, { pos: '28' },
  { pos: '29' }, { pos: '30' }, { pos: '31' }, { pos: '32' }, { pos: '33' }, { pos: '34' }, { pos: '35' },
]

const REQUEST_POSITIONS = ['02', '14']

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

export default function DepositConvertPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1)
  const [converting, setConverting] = useState<string | null>(null)

  /* ─── Step 2 ─── */
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  /* ─── Step 3 ─── */
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [openModal, setOpenModal] = useState<string | null>(null)
  const [seqIdx, setSeqIdx] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [finalCheck, setFinalCheck] = useState(false)

  /* ─── Step 4 ─── */
  const [accountName, setAccountName] = useState('')
  const [password, setPassword] = useState('')
  const [docMethod, setDocMethod] = useState<'email' | 'lms' | null>(null)
  const [docEmail, setDocEmail] = useState('')
  const [docPhone, setDocPhone] = useState('')

  /* ─── Step 5 ─── */
  const [secInputs, setSecInputs] = useState<Record<string, string>>({ '02': '', '14': '' })

  function mark(key: string) { setChecked(prev => ({ ...prev, [key]: true })) }
  function toggleExpand(key: string) { setExpanded(prev => ({ ...prev, [key]: !prev[key] })) }

  const allTermsChecked = TERM_DOCS.every(t => checked[t.key])

  function handleInfoGroupClick() {
    const allOn = checked.info_group && checked.illegal && checked.deposit_protect
    setChecked(prev => ({ ...prev, info_group: !allOn, illegal: !allOn, deposit_protect: !allOn }))
  }

  const selectedProductName = CONVERT_PRODUCTS.find(p => p.id === selectedProduct)?.name ?? ''

  return (
    <>
    <div className="max-w-kb-container mx-auto px-6 py-6">
      <div className="flex justify-end mb-3 text-[12px] text-kb-text-muted gap-1 items-center">
        <span>개인뱅킹</span><span>›</span>
        <span>금융상품</span><span>›</span>
        <span>예금</span><span>›</span>
        <span>예금 관리</span><span>›</span>
        <Link href="/products/deposit/manage/convert" className="text-kb-blue hover:underline">예금전환</Link>
      </div>

      <div className="flex gap-6">
        <DepositSidebar />

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-[20px] font-bold text-kb-text">예금전환</h1>
            <div className="flex gap-1">
              {STEP_LABELS.map((s, i) => (
                <button key={s}
                  className={`px-4 py-1.5 text-[12px] ${
                    i + 1 === step
                      ? 'font-bold text-white'
                      : 'text-kb-text-body border border-kb-border bg-white'
                  }`}
                  style={i + 1 === step ? { backgroundColor: '#5BC9A8' } : {}}>
                  {i + 1}. {s}
                </button>
              ))}
            </div>
          </div>

          {/* ══════════ STEP 1: 보유계좌조회 ══════════ */}
          {step === 1 && (
            <>
              <div className="border border-kb-border bg-[#FAFAFA] px-4 py-3 mb-5 text-[12px] text-kb-text-body space-y-1">
                {[
                  '입출금이자유로운 예금을 제외하는 타 상품으로 전환하는 서비스입니다. (단, MMDA예금 등 상품에서 제외사항이 있는 경우 전환이 불가합니다.)',
                  '전환 후에는 계좌번호 및 각종 자동이체 등이 변경되지 않습니다.',
                  '전환할 계좌를 확인한 후 전환 버튼을 눌러주시기 바랍니다.',
                ].map((n, i) => (
                  <p key={i} className="flex gap-1.5"><span className="flex-shrink-0">-</span><span>{n}</span></p>
                ))}
              </div>
              <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text">
                <thead>
                  <tr className="bg-kb-beige-light">
                    {['계좌번호', '상품명', '잔액', '상품전환'].map(h => (
                      <th key={h} className="border border-kb-border px-4 py-3 font-semibold text-kb-text text-center">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ACCOUNTS.map(acc => (
                    <tr key={acc.no}>
                      <td className="border border-kb-border px-4 py-3 text-center text-kb-text-body">{acc.no}</td>
                      <td className="border border-kb-border px-4 py-3 text-center text-kb-text-body">{acc.name}</td>
                      <td className="border border-kb-border px-4 py-3 text-right text-kb-text-body pr-6">{acc.balance}</td>
                      <td className="border border-kb-border px-4 py-3 text-center">
                        <button
                          onClick={() => { setConverting(acc.no); setStep(2) }}
                          className="border border-[#5BC9A8] px-5 py-1.5 text-[12px] font-bold hover:bg-[#5BC9A8] hover:text-white transition-colors"
                          style={{ color: '#5BC9A8' }}>
                          전환
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* ══════════ STEP 2: 전환가능상품조회 ══════════ */}
          {step === 2 && (
            <div>
              <p className="text-[14px] font-bold text-[#5BC9A8] border-b-2 border-[#5BC9A8] inline-block pb-1 mb-4">전환가능상품조회</p>
              <div className="border border-kb-border bg-[#FAFAFA] px-4 py-3 mb-5 text-[12px] text-kb-text-body space-y-1">
                <p className="flex gap-1.5"><span className="flex-shrink-0">-</span><span>전환 가능한 상품 목록입니다. 전환할 상품을 선택해 주세요.</span></p>
                <p className="flex gap-1.5"><span className="flex-shrink-0">-</span><span>상품설명서를 확인하신 후 전환 상품을 선택하시기 바랍니다.</span></p>
              </div>
              <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-6">
                <thead>
                  <tr className="bg-kb-beige-light">
                    {['선택', '상품명', '상품설명'].map(h => (
                      <th key={h} className="border border-kb-border px-4 py-3 font-semibold text-kb-text text-center">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CONVERT_PRODUCTS.map(prod => (
                    <tr key={prod.id} className={selectedProduct === prod.id ? 'bg-[#F0FDF8]' : ''}>
                      <td className="border border-kb-border px-4 py-3 text-center w-16">
                        <label className="flex items-center justify-center cursor-pointer">
                          <input type="radio" name="product" checked={selectedProduct === prod.id}
                            onChange={() => setSelectedProduct(prod.id)} className="accent-[#5BC9A8] w-4 h-4" />
                        </label>
                      </td>
                      <td className="border border-kb-border px-4 py-3 text-center text-kb-text-body font-medium whitespace-nowrap">
                        {prod.name}
                      </td>
                      <td className="border border-kb-border px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[13px] text-kb-text-muted">{prod.desc}</span>
                          <button className="border border-kb-border px-3 py-1 text-[12px] text-kb-text-muted hover:bg-kb-beige-light flex-shrink-0">
                            상품설명서 ›
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center gap-2">
                <button onClick={() => setStep(1)} className="border border-kb-border px-10 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">취소</button>
                <button
                  onClick={() => { if (!selectedProduct) { alert('전환할 상품을 선택해 주세요.'); return } setStep(3) }}
                  className={`px-10 py-2.5 text-[13px] font-bold transition-colors ${
                    selectedProduct ? 'bg-kb-yellow text-kb-text hover:bg-kb-yellow-dark' : 'bg-kb-beige text-kb-text-muted cursor-not-allowed'
                  }`}>
                  확인
                </button>
              </div>
            </div>
          )}

          {/* ══════════ STEP 3: 약관동의 ══════════ */}
          {step === 3 && (
            <div>
              <div className="border border-kb-border mb-4">
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
                  <button onClick={() => setSeqIdx(0)}
                    className="text-[12px] text-kb-text-muted border border-kb-border px-3 py-1 hover:bg-kb-beige-light transition-colors">
                    전체약관보기
                  </button>
                </div>
                {TERM_DOCS.map(doc => (
                  <div key={doc.key} className="flex items-center justify-between px-5 py-3 border-b border-kb-border last:border-b-0">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setChecked(prev => ({ ...prev, [doc.key]: !prev[doc.key] }))} className="p-0 leading-none">
                        <SquareCheck checked={!!checked[doc.key]} />
                      </button>
                      <span className="text-[11px] font-bold text-[#5BC9A8] border border-[#5BC9A8] px-1.5 py-0.5 rounded-sm flex-shrink-0">필수</span>
                      <span className="text-[13px] text-kb-text-body">{doc.label}</span>
                    </div>
                    <button onClick={() => setOpenModal(doc.key)}
                      className="border border-kb-border px-3 py-1 text-[13px] text-kb-text-muted hover:bg-kb-beige-light transition-colors flex-shrink-0">
                      약관보기 ›
                    </button>
                  </div>
                ))}
              </div>

              <div className="border border-kb-border mb-4">
                <button onClick={handleInfoGroupClick}
                  className="flex items-center gap-2 bg-[#F5F5F5] border-b border-kb-border px-4 py-3 w-full hover:bg-[#eeeeee] transition-colors">
                  <SquareCheck checked={!!checked.info_group} />
                  <span className="text-[13px] font-bold text-kb-text">확인 및 안내사항</span>
                </button>
                <div className="border-b border-kb-border">
                  <button onClick={() => toggleExpand('illegal')}
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
                <div>
                  <button onClick={() => toggleExpand('deposit_protect')}
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

              <div className="border border-kb-border p-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={finalCheck} onChange={e => setFinalCheck(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#5BC9A8]" />
                  <div>
                    <p className="text-[13px] text-kb-text">본인은 위 예금상품의 약관 및 상품설명서를 제공받고 예금상품의 중요한 사항을 충분히 이해하며 예금전환에 동의합니다.</p>
                    <p className="text-[12px] text-[#E05555] mt-1">※ 설명내용을 제대로 이해하지 못하였음에도 설명을 이해했다는 확인을 하는 경우, 추후 권리구제가 어려울 수 있습니다.</p>
                  </div>
                </label>
              </div>

              <div className="flex justify-center gap-2">
                <button onClick={() => setStep(2)} className="border border-kb-border px-10 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">이전</button>
                <button
                  onClick={() => { if (!finalCheck) { alert('필수 약관에 모두 동의해 주세요.'); return } setStep(4) }}
                  className={`px-10 py-2.5 text-[13px] font-bold transition-colors ${
                    finalCheck ? 'bg-kb-yellow text-kb-text hover:bg-kb-yellow-dark' : 'bg-kb-beige text-kb-text-muted cursor-not-allowed'
                  }`}>
                  다음
                </button>
              </div>
            </div>
          )}

          {/* ══════════ STEP 4: 정보입력 ══════════ */}
          {step === 4 && (
            <div>
              <p className="text-[14px] font-bold text-[#5BC9A8] border-b-2 border-[#5BC9A8] inline-block pb-1 mb-4">정보입력</p>
              <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-6">
                <tbody>
                  <tr>
                    <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-[160px] whitespace-nowrap">전환후상품명</td>
                    <td className="border border-kb-border px-4 py-3 text-kb-text-body">{selectedProductName}</td>
                  </tr>
                  <tr>
                    <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text">계좌명</td>
                    <td className="border border-kb-border px-4 py-3">
                      <input type="text" value={accountName} onChange={e => setAccountName(e.target.value)}
                        placeholder="계좌 별칭 (선택)" maxLength={20}
                        className="border border-kb-border px-3 py-1.5 text-[13px] w-60 outline-none" />
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text">계좌번호</td>
                    <td className="border border-kb-border px-4 py-3 text-kb-text-body">{converting}</td>
                  </tr>
                  <tr>
                    <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text">비밀번호</td>
                    <td className="border border-kb-border px-4 py-3">
                      <input type="password" value={password} onChange={e => setPassword(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                        maxLength={4} placeholder="4자리"
                        className="border border-kb-border px-3 py-1.5 text-[13px] w-28 outline-none" />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="border border-kb-border mb-6">
                <div className="flex items-center gap-2 bg-[#F5F5F5] border-b border-kb-border px-4 py-3">
                  <span className="text-[11px] font-bold text-[#5BC9A8] border border-[#5BC9A8] px-1.5 py-0.5 rounded-sm">필수</span>
                  <span className="text-[13px] font-bold text-kb-text">약관 및 상품설명서 제공</span>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div className="flex gap-6">
                    {([['email', '이메일주소로 받기'], ['lms', '문자메시지(LMS) 받기']] as const).map(([val, label]) => (
                      <label key={val} className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="radio" name="docMethod" checked={docMethod === val} onChange={() => setDocMethod(val)} className="accent-[#5BC9A8]" />
                        {label}
                      </label>
                    ))}
                  </div>
                  {docMethod === 'email' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-kb-text-body w-16 flex-shrink-0">이메일</span>
                      <input type="email" value={docEmail} onChange={e => setDocEmail(e.target.value)}
                        placeholder="이메일 주소 입력"
                        className="border border-kb-border px-3 py-1.5 text-[13px] w-64 outline-none" />
                    </div>
                  )}
                  {docMethod === 'lms' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-kb-text-body w-16 flex-shrink-0">휴대폰</span>
                      <input type="tel" value={docPhone} onChange={e => setDocPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="휴대폰 번호 입력 (- 없이)"
                        className="border border-kb-border px-3 py-1.5 text-[13px] w-48 outline-none" />
                    </div>
                  )}
                  <p className="text-[12px] text-kb-text-muted">※ 금융소비자보호법에 따라 이메일 및 문자메시지(LMS) 수신 거부 여부와 관계없이 발송됩니다.</p>
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <button onClick={() => setStep(3)} className="border border-kb-border px-10 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">이전</button>
                <button
                  onClick={() => {
                    if (!password || password.length < 4) { alert('비밀번호 4자리를 입력해 주세요.'); return }
                    if (!docMethod) { alert('약관 및 상품설명서 제공 방법을 선택해 주세요.'); return }
                    setStep(5)
                  }}
                  className="bg-kb-yellow px-10 py-2.5 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark">
                  전환
                </button>
              </div>
            </div>
          )}

          {/* ══════════ STEP 5: 입력확인 ══════════ */}
          {step === 5 && (
            <div>
              <p className="text-[14px] font-bold text-[#5BC9A8] border-b-2 border-[#5BC9A8] inline-block pb-1 mb-4">입력확인</p>
              <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text mb-6">
                <tbody>
                  {[
                    { label: '계좌번호', value: converting ?? '' },
                    { label: '변경전 계좌명', value: MOCK_ACCOUNTS[0].name },
                    { label: '변경후 계좌명', value: selectedProductName + (accountName ? ` (${accountName})` : '') },
                  ].map(row => (
                    <tr key={row.label}>
                      <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-[160px] whitespace-nowrap">{row.label}</td>
                      <td className="border border-kb-border px-4 py-3 text-kb-text-body">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 border-kb-text pt-5 mb-6">
                <p className="text-[14px] font-bold text-[#5BC9A8] border-b-2 border-[#5BC9A8] inline-block pb-1 mb-4">보안매체 비밀번호 입력</p>
                <p className="text-[13px] text-kb-text-body mb-4">
                  보안카드 <span className="font-bold text-kb-text">{REQUEST_POSITIONS.join('번, ')}번</span> 뒤 2자리를 입력하세요.
                </p>
                <div className="inline-block border-2 border-[#3B5998] rounded p-3 mb-5 bg-[#F0F4FF]">
                  <p className="text-[11px] font-bold text-[#3B5998] text-center mb-2">AX STAR 보안카드</p>
                  <div className="grid grid-cols-7 gap-1">
                    {CARD_DATA.map(cell => {
                      const isRequested = REQUEST_POSITIONS.includes(cell.pos)
                      return (
                        <div key={cell.pos}
                          className={`flex flex-col items-center px-2 py-1 rounded text-center ${
                            isRequested ? 'bg-[#5BC9A8] text-white' : 'bg-white text-kb-text-body'
                          }`}>
                          <span className="text-[9px] font-bold">{cell.pos}</span>
                          <span className="text-[11px] font-mono">**</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-3">
                  {REQUEST_POSITIONS.map(pos => (
                    <div key={pos} className="flex items-center gap-3">
                      <span className="text-[13px] text-kb-text-body w-36 flex-shrink-0">보안카드 {pos}번 뒤 2자리</span>
                      <input
                        type="password"
                        value={secInputs[pos] ?? ''}
                        onChange={e => setSecInputs(prev => ({ ...prev, [pos]: e.target.value.replace(/[^0-9]/g, '').slice(0, 2) }))}
                        maxLength={2}
                        placeholder="**"
                        className="border border-kb-border px-3 py-1.5 text-[13px] w-20 outline-none text-center font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <button onClick={() => setStep(4)} className="border border-kb-border px-10 py-2.5 text-[13px] text-kb-text-body hover:bg-kb-beige-light">취소</button>
                <button
                  onClick={() => {
                    const allFilled = REQUEST_POSITIONS.every(p => (secInputs[p] ?? '').length === 2)
                    if (!allFilled) { alert('보안카드 번호를 모두 입력해 주세요.'); return }
                    setStep(6)
                  }}
                  className="bg-kb-yellow px-10 py-2.5 text-[13px] font-bold text-kb-text hover:bg-kb-yellow-dark">
                  확인
                </button>
              </div>
            </div>
          )}

          {/* ══════════ STEP 6: 완료 ══════════ */}
          {step === 6 && (
            <div className="border border-kb-border py-16 text-center">
              <div className="flex justify-center mb-4">
                <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
                  <circle cx="24" cy="24" r="22" fill="#5BC9A8" />
                  <polyline points="13,24 21,32 35,16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[18px] font-bold text-kb-text mb-2">예금전환이 완료되었습니다.</p>
              <p className="text-[13px] text-kb-text-muted mb-1">
                전환일자 2026.05.25 &nbsp;|&nbsp; 계좌번호 {converting}
              </p>
              <p className="text-[13px] text-kb-text-muted mb-1">
                {MOCK_ACCOUNTS[0].name} → {selectedProductName}
              </p>
              <p className="text-[13px] text-kb-text-muted mb-8">전환 결과는 신규결과/내역 조회에서 확인하실 수 있습니다.</p>
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
            <p className="text-[14px] font-bold text-kb-text">약관 및 상품설명서 ({seqIdx + 1}/{TERM_DOCS.length})</p>
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
    </>
  )
}
