'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import LoanSidebar from '@/components/inquiry/LoanSidebar'
import CartModal from '@/components/products/CartModal'

type Tab       = '상품안내' | '신청안내' | '대출약정'
type DetailTab = '상품안내' | '금리 및 이율' | '이용안내' | '유의사항 및 기타' | '다운로드'

const CALC_TABS = ['원리금균등상환', '원금균등상환', '원금만기일시상환']
const DETAIL_TABS: DetailTab[] = ['상품안내', '금리 및 이율', '이용안내', '유의사항 및 기타', '다운로드']

const REQUIRED_DOCS = [
  '본인 및 배우자 신분증(주민등록증 등 본인확인인증표)',
  '주민등록등(초)본 및 전입세대열람내역((등거인 포함)(최근 1개월 이내 발급분)',
  '(구입을 도인 경우)인감증명서 및 인감도장',
  '(기 소유한 본인 주택을 담보로 하는 경우)인감도장',
  '가족관계증명원(대출신청이 미혼이거나, 배우자가 별도 세대인 경우)',
  '등기권리증(본인소유 담보인 경우)',
  '매매계약서(구입을도인 경우) 및 임대차계약서(임대차 있는 경우)',
  '경락허가서(매각결정통지서)(경매(공매)에 의한 주택 취득인 경우)',
]

const PROCESS_STEPS = [
  '공사 심사완료',
  '대출예약/필요서류 영업점제출',
  '서류점검 및 심사',
  '담보대출 전자서명 안내(SMS)',
  '담보대출 전자서명',
  '대출실행',
]

type CalcResult = { principal: number; interest: number; total: number }

const AMT_BTNS  = ['+100만', '+500만', '+1000만', '+5000만', '초기화']
const YEAR_BTNS = ['+1년', '+2년', '+5년', '+10년', '초기화']
const RATE_BTNS = ['+0.1%', '+1%', '+5%', '초기화']

function MortgageDetailContent() {
  const searchParams  = useSearchParams()
  const initialTab    = (searchParams.get('tab') as Tab | null) ?? '상품안내'
  const [activeTab,   setActiveTab]   = useState<Tab>(initialTab)
  const [detailTab,   setDetailTab]   = useState<DetailTab>('상품안내')
  const [calcTab,     setCalcTab]     = useState(0)
  const [principal,   setPrincipal]   = useState('')
  const [years,       setYears]       = useState('')
  const [rate,        setRate]        = useState('')
  const [calcResult,  setCalcResult]  = useState<CalcResult | null>(null)
  const [focusedInput, setFocusedInput] = useState<'principal' | 'years' | 'rate' | null>(null)
  const [cartOpen,    setCartOpen]    = useState(false)
  const [consultOpen, setConsultOpen] = useState(false)

  function handleAmtBtn(b: string) {
    if (b === '초기화') { setPrincipal(''); return }
    const map: Record<string, number> = { '+100만': 100, '+500만': 500, '+1000만': 1000, '+5000만': 5000 }
    const cur = parseFloat(principal.replace(/,/g, '')) || 0
    setPrincipal((cur + (map[b] ?? 0)).toLocaleString('ko-KR'))
  }
  function handleYearBtn(b: string) {
    const map: Record<string, number> = { '+1년': 1, '+2년': 2, '+5년': 5, '+10년': 10 }
    if (b === '초기화') { setYears(''); return }
    setYears(y => String((parseInt(y) || 0) + (map[b] ?? 0)))
  }
  function handleRateBtn(b: string) {
    const map: Record<string, number> = { '+0.1%': 0.1, '+1%': 1, '+5%': 5 }
    if (b === '초기화') { setRate(''); return }
    setRate(r => String(Math.round(((parseFloat(r) || 0) + (map[b] ?? 0)) * 10) / 10))
  }

  function handleCalc() {
    const p = (parseFloat(principal.replace(/,/g, '')) || 0) * 10000
    const m = (parseInt(years) || 0) * 12
    const r = (parseFloat(rate) || 0) / 100 / 12
    if (!p || !m || !r) return
    if (calcTab === 0) {
      const total = Math.round(p * r / (1 - Math.pow(1 + r, -m)))
      const interest = Math.round(p * r)
      setCalcResult({ principal: total - interest, interest, total })
    } else if (calcTab === 1) {
      const mp = Math.round(p / m)
      const interest = Math.round(p * r)
      setCalcResult({ principal: mp, interest, total: mp + interest })
    } else {
      const interest = Math.round(p * r)
      setCalcResult({ principal: 0, interest, total: interest })
    }
  }

  function fmtN(n: number) { return n.toLocaleString('ko-KR') }

  const PRODUCT_NAME = '한국주택금융공사 아낌e보금자리론'

  return (
    <>
    <main className="pb-16">
      <div className="max-w-kb-container mx-auto px-6 pt-6">
        <div className="flex gap-8">
          <LoanSidebar />

          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] font-bold text-kb-text mb-5">{PRODUCT_NAME}</h1>

            {/* 상단 탭 */}
            <div className="flex border-b border-kb-border mb-0">
              {(['상품안내', '신청안내', '대출약정'] as Tab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-10 py-3 text-[14px] font-medium border-t border-l border-r -mb-px transition-colors ${
                    activeTab === tab
                      ? 'border-kb-border bg-white text-kb-text font-bold'
                      : 'border-transparent bg-kb-beige-light text-kb-text-muted hover:text-kb-text'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ===== 상품안내 탭 ===== */}
            {activeTab === '상품안내' && (
              <>
                {/* 상품 헤더 */}
                <div className="border border-kb-border border-t-0 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[13px] text-kb-text-muted">주택 구입에 필요한 자금은</p>
                    <div className="flex gap-1">
                      {['인터넷뱅킹', '스타뱅킹'].map(b => (
                        <span key={b} className="text-[11px] font-bold px-2 py-0.5 bg-[#4A7C59] text-white">{b}</span>
                      ))}
                    </div>
                  </div>
                  <h2 className="text-[22px] font-bold text-kb-text mb-6">{PRODUCT_NAME}</h2>

                  {/* 핵심 정보 */}
                  <div className="flex gap-10 mb-6">
                    {[
                      { icon: (
                          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="white" strokeWidth="1.8">
                            <rect x="3" y="4" width="18" height="17" rx="2"/>
                            <line x1="3" y1="9" x2="21" y2="9"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                          </svg>
                        ), color: '#4A90D9', label: '기간', value: '최장 50년' },
                      { icon: (
                          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="white" strokeWidth="1.8">
                            <path d="M12 3C9 3 6 5.5 6 9c0 3 2 5.5 6 9 4-3.5 6-6 6-9 0-3.5-3-6-6-6z"/>
                            <circle cx="12" cy="9" r="2.5" fill="white"/>
                          </svg>
                        ), color: '#4A90D9', label: '상환방법', value: '분할상환' },
                      { icon: (
                          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="white" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          </svg>
                        ), color: '#E05C5C', label: '최고', value: '3.6억원' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: item.color }}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-[11px] text-kb-text-muted">{item.label}</p>
                          <p className="text-[15px] font-bold text-kb-text">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => setActiveTab('신청안내')}
                      className="px-5 py-2.5 text-[14px] font-bold text-kb-text bg-kb-yellow hover:bg-kb-yellow-dark transition-colors whitespace-nowrap">
                      인터넷신청
                    </button>
                    <button onClick={() => setCartOpen(true)}
                      className="px-4 py-2.5 text-[13px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light transition-colors">
                      장바구니
                    </button>
                    <button onClick={() => setConsultOpen(true)}
                      className="px-4 py-2.5 text-[13px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light transition-colors">
                      상담신청
                    </button>
                    <Link href="/support/consultation/branch"
                      className="px-4 py-2.5 text-[13px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light transition-colors">
                      영업점 방문예약
                    </Link>
                  </div>
                  <p className="text-[12px] text-kb-text-muted">※ 자세한 내용은 아래 상품안내를 참조하시기 바랍니다.</p>
                </div>

                {/* 대출 계산기 */}
                <div className="border border-t-0 border-kb-border p-5 mb-3">
                  <p className="text-[13px] font-bold text-kb-text mb-3">대출 계산기</p>
                  <div className="flex border-b border-kb-border mb-4">
                    {CALC_TABS.map((tab, i) => (
                      <button key={tab}
                        onClick={() => { setCalcTab(i); setCalcResult(null) }}
                        className={`px-5 py-2 text-[13px] border-b-2 -mb-px transition-colors ${
                          calcTab === i ? 'border-kb-text text-kb-text font-bold' : 'border-transparent text-kb-text-muted hover:text-kb-text'
                        }`}>
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] text-kb-text-muted font-bold">대출금액</span>
                    <input type="text" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="금액"
                      onFocus={() => setFocusedInput('principal')} onBlur={() => setFocusedInput(null)}
                      className={`border px-3 py-1.5 w-24 outline-none text-right text-[13px] transition-colors ${focusedInput === 'principal' ? 'border-[#C09B3A] bg-[#C09B3A]/10' : 'border-kb-border'}`} />
                    <span className="text-[13px] text-kb-text">만원을</span>
                    <span className="text-[13px] text-kb-text-muted font-bold ml-2">기간</span>
                    <input type="text" value={years} onChange={e => setYears(e.target.value)} placeholder="기간"
                      onFocus={() => setFocusedInput('years')} onBlur={() => setFocusedInput(null)}
                      className={`border px-3 py-1.5 w-16 outline-none text-right text-[13px] transition-colors ${focusedInput === 'years' ? 'border-[#C09B3A] bg-[#C09B3A]/10' : 'border-kb-border'}`} />
                    <span className="text-[13px] text-kb-text">년 동안</span>
                    <span className="text-[13px] text-kb-text-muted font-bold ml-2">이자</span>
                    <input type="text" value={rate} onChange={e => setRate(e.target.value)} placeholder="금리"
                      onFocus={() => setFocusedInput('rate')} onBlur={() => setFocusedInput(null)}
                      className={`border px-3 py-1.5 w-16 outline-none text-right text-[13px] transition-colors ${focusedInput === 'rate' ? 'border-[#C09B3A] bg-[#C09B3A]/10' : 'border-kb-border'}`} />
                    <span className="text-[13px] text-kb-text">%로 대출 받으면?</span>
                    <button onClick={handleCalc}
                      className="ml-auto text-white text-[12px] font-bold px-5 py-1.5 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#5A504A' }}>
                      결과보기
                    </button>
                  </div>
                  <div className="mt-2 min-h-[26px]" onMouseDown={e => e.preventDefault()}>
                    {focusedInput === 'principal' && (
                      <div className="flex gap-1 flex-wrap">
                        {AMT_BTNS.map(b => (
                          <button key={b} onClick={() => handleAmtBtn(b)}
                            className="px-2.5 py-1 text-[11px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light transition-colors">
                            {b}
                          </button>
                        ))}
                      </div>
                    )}
                    {focusedInput === 'years' && (
                      <div className="flex gap-1 flex-wrap">
                        {YEAR_BTNS.map(b => (
                          <button key={b} onClick={() => handleYearBtn(b)}
                            className="px-2.5 py-1 text-[11px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light transition-colors">
                            {b}
                          </button>
                        ))}
                      </div>
                    )}
                    {focusedInput === 'rate' && (
                      <div className="flex gap-1 flex-wrap">
                        {RATE_BTNS.map(b => (
                          <button key={b} onClick={() => handleRateBtn(b)}
                            className="px-2.5 py-1 text-[11px] border border-kb-border text-kb-text-body hover:bg-kb-beige-light transition-colors">
                            {b}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {calcResult && (
                    <div className="mt-4">
                      <p className="text-[14px] text-kb-text mb-2">
                        {CALC_TABS[calcTab]} 기준 매월 약{' '}
                        <span className="font-bold text-[#C05050]">{fmtN(calcResult.total)}원</span>
                        {calcTab === 2 ? '씩 이자를 납부하시면 됩니다.' : '씩 상환하시면 됩니다.'}
                      </p>
                    </div>
                  )}
                  {calcResult && (
                    <div className="mt-1 border border-kb-border">
                      <table className="w-full text-[13px]">
                        <thead>
                          <tr className="bg-[#F5F0E8]">
                            {calcTab === 2
                              ? <><th className="py-2 px-4 text-left font-bold text-kb-text">월 이자</th><th className="py-2 px-4 text-left font-bold text-kb-text">만기 상환원금</th></>
                              : <><th className="py-2 px-4 text-left font-bold text-kb-text">월 상환원금</th><th className="py-2 px-4 text-left font-bold text-kb-text">월 이자</th><th className="py-2 px-4 text-left font-bold text-kb-text">월 납부금액</th></>
                            }
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {calcTab === 2
                              ? <>
                                  <td className="py-3 px-4 text-kb-text">{fmtN(calcResult.total)}원</td>
                                  <td className="py-3 px-4 font-bold text-[#C05050]">{fmtN((parseFloat(principal.replace(/,/g,''))||0)*10000)}원</td>
                                </>
                              : <>
                                  <td className="py-3 px-4 text-kb-text">{fmtN(calcResult.principal)}원</td>
                                  <td className="py-3 px-4 text-kb-text">{fmtN(calcResult.interest)}원</td>
                                  <td className="py-3 px-4 font-bold text-[#C05050]">{fmtN(calcResult.total)}원</td>
                                </>
                            }
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  <p className="text-[11px] text-kb-text-muted mt-2">※ 원하시는 정보를 입력하신 후, 예상계산결과를 확인하세요.</p>
                </div>

                {/* 공유 버튼 */}
                <div className="flex justify-end gap-1.5 mb-4">
                  {['f', 't', '▶', '☆'].map(s => (
                    <button key={s} className="w-7 h-7 rounded-full border border-kb-border text-[11px] text-kb-text-muted hover:bg-kb-beige-light">{s}</button>
                  ))}
                  <button className="text-[12px] text-kb-text-muted border border-kb-border px-2 py-0.5 hover:bg-kb-beige-light">✉ 추천메일</button>
                </div>

                {/* 상세 서브탭 */}
                <div className="border border-kb-border">
                  <div className="flex border-b border-kb-border">
                    {DETAIL_TABS.map(tab => (
                      <button key={tab} onClick={() => setDetailTab(tab)}
                        className={`flex-1 py-3 text-[13px] transition-colors ${
                          detailTab === tab
                            ? 'bg-kb-yellow font-bold text-kb-text'
                            : 'text-kb-text-muted hover:text-kb-text hover:bg-kb-beige-light'
                        }`}>
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="p-6">
                    {detailTab === '상품안내' && (
                      <table className="w-full text-[13px]">
                        <tbody className="divide-y divide-kb-border">
                          <tr>
                            <td className="py-4 pr-6 font-bold text-kb-text w-40 align-top whitespace-nowrap">상품특징</td>
                            <td className="py-4 text-kb-text-body leading-relaxed">
                              한국주택금융공사가 사전에 양수 적격여부를 심사하여 고객의 대출금리를 낮춘 장기 고정금리 상품으로 향후 금리 변동의 위험을 피하고자 하는 고객에게 적합한 상품(인터넷 비대면 적용)
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 pr-6 font-bold text-kb-text align-top whitespace-nowrap">대출신청자격</td>
                            <td className="py-4 text-kb-text-body leading-relaxed">
                              민법상 성년으로 무주택자(채무자와 배우자 기준)로서 부부합산 연소득이 7천만원 이하인 대한민국 국민, 주민등록을 한 재외국민 및 외국국적동포<br />
                              - 단, 아래의 경우 해당 소득 금액 이내로 적용하며, 전세사기 피해자는 소득제한 없음<br />
                              &nbsp;&nbsp;○ 신혼가구 : 85백만원<br />
                              &nbsp;&nbsp;○ 1자녀가구 : 90백만원<br />
                              &nbsp;&nbsp;○ 다자녀가구 : 1억원<br />
                              ※ 전세사기피해자 중 전세사기 피해주택을 채보조건부로 대출을 신청한 경우 일시적 2주택자도 취급 가능
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 pr-6 font-bold text-kb-text align-top whitespace-nowrap">대출금액</td>
                            <td className="py-4 text-kb-text-body leading-relaxed">
                              3.6억원(다자녀가구·전세사기피해자 4억원, 생애최초 주택구입자 4.2억원) 이내 (1백만원 단위)<br />
                              <span className="text-kb-text-muted text-[12px]">(주택유형과 신용등급 담보물건지역 등에 따라 담보평가 금액의 최대 70%까지 대출, 생애최초 주택구입자는 최대 80%까지 대출)</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 pr-6 font-bold text-kb-text align-top whitespace-nowrap">대출기간 및<br />상환 방법</td>
                            <td className="py-4 text-kb-text-body leading-relaxed">
                              대출기간 : 10년,15년,20년,30년,40년,50년<br />
                              거치기간(이자만 납부하는 기간) 없음<br />
                              * 매월 원금균등, 원리금균등, 체증식 분할상환<span className="align-super text-[10px]">※</span><br />
                              <span className="text-kb-text-muted text-[12px]">
                                ※ 원금상환이 시작되는 고정금리기간 종료안 적용<br />
                                ※ 대출만기 40년은 만40세이하(신혼가구인 경우 만 50세 이하)인 경우 선택 가능<br />
                                ※ 대출만기 50년은 만35세이하(신혼가구인 경우 만 40세 이하)인 경우 선택 가능, 체증식상환방식 선택불가<br />
                              </span>
                              분할상환기간 : 원금은 약정된 분할상환 납입일에 균등분할 상환하며, 이자는 원금상환방법과 동일한 달단위로 후취
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 pr-6 font-bold text-kb-text align-top whitespace-nowrap">대출신청시기</td>
                            <td className="py-4 text-kb-text-body leading-relaxed">
                              공부상 주택이고 실제 주거용으로 이용되는 6억원 이하의 아파트, 연립, 다세대, 단독주택<br />
                              <span className="text-kb-text-muted text-[12px]">※ 오피스텔, 상가 등은 제외(단, 전세사기피해자의 경우 주거용 오피스텔 담보 가능)</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    {detailTab === '금리 및 이율' && (
                      <table className="w-full text-[13px]">
                        <tbody className="divide-y divide-kb-border">
                          <tr>
                            <td className="py-4 pr-6 font-bold text-kb-text w-40 align-top whitespace-nowrap">대출금리</td>
                            <td className="py-4 text-kb-text-body leading-relaxed">
                              연 3.2% ~ 4.1% (고정금리, 2026.05.25 기준, 우대금리 포함)<br />
                              * 공사 보금자리론 기준금리에 가산금리를 반영하여 적용합니다.
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 pr-6 font-bold text-kb-text align-top whitespace-nowrap">중도상환수수료</td>
                            <td className="py-4 text-kb-text-body leading-relaxed">
                              * 중도상환수수료 = 중도상환금액 × 수수료율(1.2%) × 잔존일수 ÷ 대출기간<br />
                              * 대출 실행일로부터 3년 이후 중도상환 시 수수료 면제
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 pr-6 font-bold text-kb-text align-top whitespace-nowrap">연체이자</td>
                            <td className="py-4 text-kb-text-body leading-relaxed">
                              연체이자율: 최고 연 15%<br />
                              (차주별 대출이자율 + 연체가산이자율 연 3.0%)
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    {detailTab === '이용안내' && (
                      <table className="w-full text-[13px]">
                        <tbody className="divide-y divide-kb-border">
                          <tr>
                            <td className="py-4 pr-6 font-bold text-kb-text w-40 align-top whitespace-nowrap">담보</td>
                            <td className="py-4 text-kb-text-body">한국주택금융공사 보증서 담보</td>
                          </tr>
                          <tr>
                            <td className="py-4 pr-6 font-bold text-kb-text align-top whitespace-nowrap">부대비용</td>
                            <td className="py-4 text-kb-text-body leading-relaxed">
                              * 인지세: 대출금액에 따라 고객과 은행이 각 50% 부담<br />
                              * 근저당권 설정비용: 고객 부담 (전자등기 이용 시 일부 절감 가능)<br />
                              * 보증서 발급 수수료: 한국주택금융공사 기준 적용
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    {detailTab === '유의사항 및 기타' && (
                      <div className="text-[13px] text-kb-text-body leading-relaxed space-y-2">
                        <p>* 대출 신청 전 반드시 상품설명서 및 약관을 확인하시기 바랍니다.</p>
                        <p>* 금리·한도는 심사 결과에 따라 달라질 수 있습니다.</p>
                        <p>* 대출 취급 후 매년 유지심사가 진행되며, 기준 미충족 시 대출이 회수될 수 있습니다.</p>
                        <p>* 자세한 내용은 가까운 AX풀뱅크 영업점 또는 고객센터(1588-9999)로 문의하시기 바랍니다.</p>
                      </div>
                    )}

                    {detailTab === '다운로드' && (
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          '보금자리론 상품설명서',
                          '은행여신거래기본약관(가계용)',
                          '대출거래약정서(가계용)',
                          '근저당권설정계약서',
                          '개인(신용)정보 수집·이용·제공 동의서',
                        ].map(doc => (
                          <button key={doc}
                            className="flex items-center gap-2 border border-kb-border px-4 py-3 text-[13px] text-kb-text-body hover:bg-kb-beige-light text-left transition-colors">
                            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 flex-shrink-0 text-kb-text-muted" stroke="currentColor" strokeWidth="1.5">
                              <path d="M13 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7l-3-5z"/>
                              <polyline points="13 2 13 7 18 7"/>
                              <line x1="10" y1="11" x2="10" y2="16"/>
                              <polyline points="7 14 10 17 13 14"/>
                            </svg>
                            <span>{doc}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={() => setActiveTab('신청안내')}
                    className="px-10 py-2.5 bg-kb-yellow text-[14px] font-bold text-kb-text hover:bg-kb-yellow-dark transition-colors">
                    인터넷신청
                  </button>
                  <Link href="/products/loan/mortgage"
                    className="px-10 py-2.5 border border-kb-border text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                    목록
                  </Link>
                  <button onClick={() => window.print()}
                    className="px-10 py-2.5 border border-kb-border text-[14px] text-kb-text-body hover:bg-kb-beige-light transition-colors">
                    인쇄
                  </button>
                </div>
              </>
            )}

            {/* ===== 신청안내 탭 ===== */}
            {activeTab === '신청안내' && (
              <div className="border border-kb-border border-t-0 p-6">
                <div className="border border-red-300 bg-red-50 px-5 py-3 mb-7 text-[13px] text-red-600 leading-relaxed">
                  대출예약 영업점에 아래에 필요서류를 제출하시고 전자약정 안내문자 수신 후 전자약정 의뢰가 가능합니다.
                </div>

                <section className="mb-8">
                  <h2 className="text-[15px] font-bold text-kb-text mb-3">필요서류</h2>
                  <ul className="space-y-1.5">
                    {REQUIRED_DOCS.map((doc, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-kb-text-body">
                        <span className="mt-0.5 flex-shrink-0 text-kb-text-muted">·</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-[15px] font-bold text-kb-text mb-4">대출진행프로세스</h2>
                  <div>
                    {PROCESS_STEPS.map((step, i) => (
                      <div key={step}>
                        <div className="flex items-center gap-4 py-3.5 px-5 border border-kb-border bg-white">
                          <span className="w-9 h-9 rounded-full bg-[#1C3557] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[14px] text-kb-text font-medium">{step}</span>
                        </div>
                        {i < PROCESS_STEPS.length - 1 && (
                          <div className="flex justify-center py-0.5 bg-kb-beige-light border-x border-kb-border">
                            <svg viewBox="0 0 24 14" fill="none" className="w-6 h-3.5" stroke="#999" strokeWidth="1.5">
                              <path d="M2 2 Q12 2 12 7 Q12 12 22 12" strokeLinecap="round" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <div className="flex justify-center">
                  <Link href="/products/loan/status"
                    className="px-12 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:brightness-95 transition-all">
                    나의 진행상태 확인
                  </Link>
                </div>
              </div>
            )}

            {/* ===== 대출약정 탭 ===== */}
            {activeTab === '대출약정' && (
              <div className="border border-kb-border border-t-0 p-6">
                <div className="border border-kb-border bg-kb-beige-light px-5 py-4 mb-6 text-[13px] text-kb-text-body space-y-1.5">
                  <p>· 대출약정은 영업점 방문 또는 전자약정 방식으로 진행됩니다.</p>
                  <p>· 전자약정은 담보대출 전자서명 안내 SMS 수신 후 진행 가능합니다.</p>
                  <p>· 약정 전 대출조건(금리, 기간, 상환방법)을 반드시 확인하시기 바랍니다.</p>
                </div>
                <div className="border border-kb-border divide-y divide-kb-border mb-6">
                  {[
                    { label: '약정방법',  value: '영업점 방문 / 전자약정' },
                    { label: '필요인증',  value: '공동인증서 또는 금융인증서' },
                    { label: '약정기간',  value: '대출 실행 전까지' },
                  ].map(row => (
                    <div key={row.label} className="flex">
                      <div className="w-36 px-5 py-3 bg-kb-beige-light text-[13px] font-medium text-kb-text flex-shrink-0">{row.label}</div>
                      <div className="flex-1 px-5 py-3 text-[13px] text-kb-text-body">{row.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Link href="/products/loan/status/sign"
                    className="px-12 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:brightness-95 transition-all">
                    전자서명 진행
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>

    {/* 상담신청 모달 */}
    {consultOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setConsultOpen(false)} />
        <div className="relative bg-white w-[760px] shadow-lg">
          <div className="bg-kb-yellow px-5 py-3 flex items-center justify-between">
            <span className="text-[15px] font-bold text-kb-text">상담신청</span>
            <span className="text-[13px] font-bold text-kb-text flex items-center gap-1">
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                <path d="M10 2L3 7v6c0 4 2.5 7 7 8 4.5-1 7-4 7-8V7L10 2z" fill="#1A1A1A" stroke="none" />
              </svg>
              AX풀뱅크
            </span>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4">
            <div className="border border-kb-border p-4 bg-[#FAFAF8]">
              <p className="text-[13px] font-bold text-kb-text mb-3 flex items-center gap-1.5"><span>☎</span> 전화상담</p>
              <p className="text-[15px] font-bold text-[#1A56DB] mb-1">1588-9999</p>
              <p className="text-[11px] text-kb-text-muted mb-0.5">09:00~16:00 (은행휴무일 제외)</p>
              <p className="text-[11px] text-kb-text-muted mb-3">* 펀드/신탁 상담시간(09:00~18:00)</p>
              <p className="text-[12px] text-[#1A56DB] font-bold leading-snug mb-3">
                상품이 어렵게 느껴 지시나요?<br />전문상담직원이 상품관련<br />궁금증을 해결해드립니다.
              </p>
              <p className="text-[11px] text-kb-text-muted leading-relaxed">
                * 예금/대출/펀드/신탁 이외의 문의사항은 1588-9999로 이용해주시기 바랍니다.<br />
                * 계좌번호를 미리 준비해주시면 보다 신속하게 상담을 도와드릴 수 있습니다.
              </p>
            </div>
            <div className="border border-kb-border p-4 bg-[#FAFAF8]">
              <p className="text-[13px] font-bold text-kb-text mb-3 flex items-center gap-1.5"><span>💬</span> 채팅상담</p>
              <p className="text-[15px] font-bold text-[#1A56DB] mb-1">24시간 365일</p>
              <p className="text-[12px] text-kb-text-muted mb-4">언제든지 신청가능</p>
              <p className="text-[12px] text-kb-text-body mb-4">상담직원과 실시간 채팅상담을 하실 수 있습니다.</p>
              <button className="border border-kb-border px-4 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light transition-colors">채팅상담하기</button>
            </div>
            <div className="border border-kb-border p-4 bg-[#FAFAF8]">
              <p className="text-[13px] font-bold text-kb-text mb-3 flex items-center gap-1.5"><span>✉</span> 이메일상담</p>
              <p className="text-[15px] font-bold text-[#1A56DB] mb-1">24시간 365일</p>
              <p className="text-[12px] text-kb-text-muted mb-4">언제든지 신청가능</p>
              <p className="text-[12px] text-kb-text-body mb-4">문의하신 내용은 이메일로 답변드립니다.</p>
              <div className="flex flex-col gap-2">
                <button className="border border-kb-border px-4 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light transition-colors">고객상담 FAQ</button>
                <button className="border border-kb-border px-4 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light transition-colors">이메일상담하기</button>
              </div>
            </div>
          </div>
          <div className="flex justify-end px-6 pb-4">
            <button onClick={() => setConsultOpen(false)} className="text-[12px] text-kb-text-muted hover:text-kb-text transition-colors">닫기 ×</button>
          </div>
        </div>
      </div>
    )}

    {cartOpen && <CartModal productName={PRODUCT_NAME} onClose={() => setCartOpen(false)} />}
    </>
  )
}

export default function MortgageDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-kb-container mx-auto px-6 py-16 text-center text-kb-text-muted">로딩 중...</div>}>
      <MortgageDetailContent />
    </Suspense>
  )
}
