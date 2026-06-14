'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

type LoanResult = 'approved' | 'partial' | 'rejected'

const APPROVED_LIMIT  = 30_000_000
const REJECTION_LIMIT = 50_000_000

function LoanResultContent() {
  const searchParams = useSearchParams()
  const product = searchParams.get('product') ?? 'AXful 대출'
  const rate    = searchParams.get('rate')    ?? '연 5.0%'
  const amount  = parseInt(searchParams.get('amount')  ?? '0',  10)
  const period  = parseInt(searchParams.get('period')  ?? '12', 10)
  const purpose = searchParams.get('purpose') ?? '-'

  const result: LoanResult =
    amount <= APPROVED_LIMIT  ? 'approved' :
    amount <= REJECTION_LIMIT ? 'partial'  :
                                'rejected'

  const monthlyRate = 0.055 / 12
  const monthly = amount > 0
    ? Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, period)) /
        (Math.pow(1 + monthlyRate, period) - 1))
    : 0

  const RESULT_META = {
    approved: {
      bg:      'border-kb-taupe bg-kb-yellow/10',
      iconBg:  'bg-kb-yellow',
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
          <path d="M8 20l8 8 16-16" stroke="#333" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title:   '대출 승인',
      desc:    '대출 신청이 승인되었습니다. 아래 내용을 확인해 주세요.',
    },
    partial: {
      bg:      'border-orange-200 bg-orange-50',
      iconBg:  'bg-orange-400',
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
          <path d="M20 10v12" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="20" cy="28" r="2.5" fill="white" />
        </svg>
      ),
      title:   '한도 초과',
      desc:    `신청 금액이 최대 한도를 초과하였습니다. 최대 승인 가능 금액은 ${APPROVED_LIMIT.toLocaleString('ko-KR')}원입니다.`,
    },
    rejected: {
      bg:      'border-red-200 bg-red-50',
      iconBg:  'bg-red-400',
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
          <path d="M12 12l16 16M28 12L12 28" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
      title:   '대출 부결',
      desc:    '심사 결과 대출 신청이 승인되지 않았습니다.',
    },
  }

  const meta = RESULT_META[result]

  return (
    <div className="max-w-kb-container mx-auto px-6 py-4 pb-16">
      {/* 브레드크럼 */}
      <div className="flex justify-end mb-4 text-[12px] text-kb-text-muted gap-1">
        <span>개인뱅킹</span><span>&gt;</span>
        <span>대출</span><span>&gt;</span>
        <Link href="/loans/apply" className="hover:underline">대출 신청</Link>
        <span>&gt;</span>
        <span className="font-semibold text-kb-text">신청 결과</span>
      </div>

      <h1 className="text-[22px] font-bold text-kb-text mb-6 pb-2 border-b-2 border-kb-text">대출 신청 결과</h1>

      {/* 결과 배너 */}
      <div className={`p-8 mb-6 text-center border rounded-xl ${meta.bg}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${meta.iconBg}`}>
          {meta.icon}
        </div>
        <p className="text-[20px] font-bold text-kb-text mb-1">{meta.title}</p>
        <p className="text-[14px] text-kb-text-muted">{meta.desc}</p>
      </div>

      {/* ── 승인 ── */}
      {result === 'approved' && (
        <>
          <section className="mb-6">
            <h2 className="text-[16px] font-bold text-kb-text mb-4 pb-2 border-b border-kb-border">대출 상세 내용</h2>
            <table className="w-full border-collapse text-[13px]">
              <tbody>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-3 font-semibold text-kb-text w-[160px]">대출 상품명</td>
                  <td className="border border-kb-border px-4 py-3 text-kb-text-body">{product}</td>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-3 font-semibold text-kb-text w-[120px]">대출 목적</td>
                  <td className="border border-kb-border px-4 py-3 text-kb-text-body">{purpose}</td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-3 font-semibold text-kb-text">대출 금액</td>
                  <td className="border border-kb-border px-4 py-3 font-bold text-kb-text text-[15px]">
                    {amount.toLocaleString('ko-KR')}원
                  </td>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-3 font-semibold text-kb-text">대출 기간</td>
                  <td className="border border-kb-border px-4 py-3 text-kb-text-body">{period}개월</td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-3 font-semibold text-kb-text">적용 금리</td>
                  <td className="border border-kb-border px-4 py-3 text-kb-blue font-bold">{rate}</td>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-3 font-semibold text-kb-text">월 납부액(예상)</td>
                  <td className="border border-kb-border px-4 py-3 font-bold text-kb-text">
                    {monthly > 0 ? `${monthly.toLocaleString('ko-KR')}원` : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <div className="border border-[#b3cce8] bg-[#f0f6ff] p-4 mb-6 space-y-1">
            <p className="text-[13px] text-kb-text-body leading-relaxed">· 실제 대출 실행은 영업점 방문 또는 전화 확인 후 진행됩니다.</p>
            <p className="text-[13px] text-kb-text-body leading-relaxed">· 승인 결과는 7일간 유효하며, 이후에는 재신청이 필요합니다.</p>
            <p className="text-[13px] text-kb-text-body leading-relaxed">· 실제 금리는 심사 결과에 따라 달라질 수 있습니다.</p>
          </div>

          <div className="flex justify-center gap-3">
            <Link href="/loans/apply"
              className="px-10 py-3 border border-kb-border text-[14px] text-kb-text hover:bg-kb-beige-light transition-colors">
              다시 신청
            </Link>
            <Link href="/products/loan/mortgage/1?tab=대출약정"
              className="px-10 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:brightness-95 transition-all">
              대출 실행하기
            </Link>
            <Link href="/dashboard"
              className="px-10 py-3 border border-kb-border text-[14px] text-kb-text hover:bg-kb-beige-light transition-colors">
              홈으로
            </Link>
          </div>
        </>
      )}

      {/* ── 한도 초과 (부분 승인 안내) ── */}
      {result === 'partial' && (
        <>
          <div className="border border-orange-200 bg-orange-50 p-5 mb-6 space-y-2">
            <p className="text-[14px] font-bold text-orange-700">최대 승인 가능 금액 안내</p>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-kb-text-body">신청 금액</span>
              <span className="text-[15px] font-bold text-kb-text">{amount.toLocaleString('ko-KR')}원</span>
              <span className="text-kb-text-muted">→</span>
              <span className="text-[13px] text-kb-text-body">최대 승인 가능</span>
              <span className="text-[15px] font-bold text-orange-600">{APPROVED_LIMIT.toLocaleString('ko-KR')}원</span>
            </div>
            <p className="text-[13px] text-kb-text-muted">
              · 신용평가 결과에 따라 최대 한도가 제한될 수 있습니다.<br />
              · 한도 내 금액으로 재신청하시거나, 상담을 통해 다른 상품을 안내받으실 수 있습니다.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Link
              href={`/loans/apply?amount=${APPROVED_LIMIT}&product=${encodeURIComponent(product)}&period=${period}&purpose=${encodeURIComponent(purpose)}`}
              className="px-10 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:brightness-95 transition-all">
              {APPROVED_LIMIT.toLocaleString('ko-KR')}원으로 재신청
            </Link>
            <Link href="/loans/apply"
              className="px-10 py-3 border border-kb-border text-[14px] text-kb-text hover:bg-kb-beige-light transition-colors">
              금액 변경 후 재신청
            </Link>
            <Link href="/dashboard"
              className="px-10 py-3 border border-kb-border text-[14px] text-kb-text hover:bg-kb-beige-light transition-colors">
              홈으로
            </Link>
          </div>
        </>
      )}

      {/* ── 부결 ── */}
      {result === 'rejected' && (
        <>
          <section className="mb-6">
            <h2 className="text-[16px] font-bold text-kb-text mb-4 pb-2 border-b border-kb-border">부결 사유</h2>
            <table className="w-full border-collapse text-[13px]">
              <tbody>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-3 font-semibold text-kb-text w-[160px]">대출 상품명</td>
                  <td className="border border-kb-border px-4 py-3 text-kb-text-body" colSpan={3}>{product}</td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-3 font-semibold text-kb-text">신청 금액</td>
                  <td className="border border-kb-border px-4 py-3 text-kb-text-body">
                    {amount.toLocaleString('ko-KR')}원
                  </td>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-3 font-semibold text-kb-text w-[120px]">심사 결과</td>
                  <td className="border border-kb-border px-4 py-3 font-bold text-red-500">부결</td>
                </tr>
                <tr>
                  <td className="border border-kb-border bg-kb-beige-light px-4 py-3 font-semibold text-kb-text">주요 사유</td>
                  <td className="border border-kb-border px-4 py-3 text-kb-text-body" colSpan={3}>
                    신청 금액이 심사 기준 한도를 초과하였습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <div className="border border-red-200 bg-red-50 p-4 mb-6 space-y-1.5">
            <p className="text-[13px] font-bold text-red-600 mb-1">안내 사항</p>
            <p className="text-[13px] text-kb-text-body leading-relaxed">· 부결 후 30일 이후 재심사 신청이 가능합니다.</p>
            <p className="text-[13px] text-kb-text-body leading-relaxed">· 신용점수 개선 후 재신청 시 승인 가능성이 높아질 수 있습니다.</p>
            <p className="text-[13px] text-kb-text-body leading-relaxed">· 자세한 사유 및 다른 상품 안내는 고객센터(1588-9999)로 문의하시기 바랍니다.</p>
            <p className="text-[13px] text-kb-text-body leading-relaxed">· 금리인하요구권 또는 대출이동 서비스를 통해 다른 조건을 검토하실 수 있습니다.</p>
          </div>

          <div className="flex justify-center gap-3">
            <Link href="/products/loan"
              className="px-10 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:brightness-95 transition-all">
              다른 상품 보기
            </Link>
            <Link href="/loans/apply"
              className="px-10 py-3 border border-kb-border text-[14px] text-kb-text hover:bg-kb-beige-light transition-colors">
              재신청
            </Link>
            <Link href="/dashboard"
              className="px-10 py-3 border border-kb-border text-[14px] text-kb-text hover:bg-kb-beige-light transition-colors">
              홈으로
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default function LoanApplyResultPage() {
  return (
    <Suspense fallback={<div className="max-w-kb-container mx-auto px-6 py-16 text-center text-kb-text-muted">로딩 중...</div>}>
      <LoanResultContent />
    </Suspense>
  )
}
