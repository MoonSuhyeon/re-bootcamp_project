'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoanCompleteContent() {
  const searchParams = useSearchParams()
  const product = searchParams.get('product') ?? 'AXful 대출'
  const rate    = searchParams.get('rate')    ?? '연 5.0%'
  const amount  = parseInt(searchParams.get('amount')  ?? '0',  10)
  const period  = parseInt(searchParams.get('period')  ?? '12', 10)

  const today = new Date()
  const fmt = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`

  const firstPayDay = new Date(today)
  firstPayDay.setMonth(firstPayDay.getMonth() + 1)

  const depositTime = (() => {
    const h = today.getHours()
    if (h < 15) return '오늘 중 (영업시간 내)'
    return '익영업일 오전 중'
  })()

  const monthlyRate = 0.055 / 12
  const monthly = amount > 0
    ? Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, period)) /
        (Math.pow(1 + monthlyRate, period) - 1))
    : 0

  return (
    <div className="max-w-[640px] mx-auto px-6 py-10 pb-16">
      {/* 완료 배너 */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-kb-yellow flex items-center justify-center mb-4">
          <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11">
            <path d="M10 24l10 10 20-20" stroke="#333" strokeWidth="4"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-[24px] font-bold text-kb-text mb-1">대출 실행 완료</h1>
        <p className="text-[14px] text-kb-text-muted">
          대출금이 아래 계좌로 입금될 예정입니다.
        </p>
      </div>

      {/* 실행 내역 */}
      <div className="border border-kb-border divide-y divide-kb-border mb-6">
        <div className="flex">
          <div className="w-36 px-5 py-3.5 bg-kb-beige-light text-[13px] font-semibold text-kb-text flex-shrink-0">
            대출 상품명
          </div>
          <div className="flex-1 px-5 py-3.5 text-[13px] text-kb-text-body">{product}</div>
        </div>
        <div className="flex">
          <div className="w-36 px-5 py-3.5 bg-kb-beige-light text-[13px] font-semibold text-kb-text flex-shrink-0">
            실행 금액
          </div>
          <div className="flex-1 px-5 py-3.5 text-[15px] font-bold text-kb-text">
            {amount.toLocaleString('ko-KR')}원
          </div>
        </div>
        <div className="flex">
          <div className="w-36 px-5 py-3.5 bg-kb-beige-light text-[13px] font-semibold text-kb-text flex-shrink-0">
            입금 계좌
          </div>
          <div className="flex-1 px-5 py-3.5 text-[13px] text-kb-text-body">
            AX풀뱅크 홍길동 123-456-789012
          </div>
        </div>
        <div className="flex">
          <div className="w-36 px-5 py-3.5 bg-kb-beige-light text-[13px] font-semibold text-kb-text flex-shrink-0">
            입금 예정
          </div>
          <div className="flex-1 px-5 py-3.5 text-[13px] text-kb-text-body">{depositTime}</div>
        </div>
        <div className="flex">
          <div className="w-36 px-5 py-3.5 bg-kb-beige-light text-[13px] font-semibold text-kb-text flex-shrink-0">
            적용 금리
          </div>
          <div className="flex-1 px-5 py-3.5 text-[13px] font-bold text-kb-blue">{rate}</div>
        </div>
        <div className="flex">
          <div className="w-36 px-5 py-3.5 bg-kb-beige-light text-[13px] font-semibold text-kb-text flex-shrink-0">
            대출 기간
          </div>
          <div className="flex-1 px-5 py-3.5 text-[13px] text-kb-text-body">{period}개월</div>
        </div>
        <div className="flex">
          <div className="w-36 px-5 py-3.5 bg-kb-beige-light text-[13px] font-semibold text-kb-text flex-shrink-0">
            월 납부액(예상)
          </div>
          <div className="flex-1 px-5 py-3.5 text-[13px] font-bold text-kb-text">
            {monthly > 0 ? `${monthly.toLocaleString('ko-KR')}원` : '-'}
          </div>
        </div>
        <div className="flex">
          <div className="w-36 px-5 py-3.5 bg-kb-beige-light text-[13px] font-semibold text-kb-text flex-shrink-0">
            첫 납부일
          </div>
          <div className="flex-1 px-5 py-3.5 text-[13px] text-kb-text-body">{fmt(firstPayDay)}</div>
        </div>
        <div className="flex">
          <div className="w-36 px-5 py-3.5 bg-kb-beige-light text-[13px] font-semibold text-kb-text flex-shrink-0">
            실행일
          </div>
          <div className="flex-1 px-5 py-3.5 text-[13px] text-kb-text-body">{fmt(today)}</div>
        </div>
      </div>

      {/* 안내 박스 */}
      <div className="border border-[#b3cce8] bg-[#f0f6ff] px-5 py-4 mb-8 space-y-1.5">
        <p className="text-[13px] text-kb-text-body leading-relaxed">
          · 입금은 은행 시스템 사정에 따라 다소 지연될 수 있습니다.
        </p>
        <p className="text-[13px] text-kb-text-body leading-relaxed">
          · 첫 납부일 이전에 자동이체를 설정하시면 연체를 예방할 수 있습니다.
        </p>
        <p className="text-[13px] text-kb-text-body leading-relaxed">
          · 대출 관련 문의는 고객센터(1588-9999)로 연락하시기 바랍니다.
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex justify-center gap-3">
        <Link
          href="/products/loan/manage/payment"
          className="px-10 py-3 bg-kb-yellow text-[14px] font-bold text-kb-text hover:brightness-95 transition-all"
        >
          대출 내역 조회
        </Link>
        <Link
          href="/transfer/account"
          className="px-10 py-3 border border-kb-border text-[14px] text-kb-text hover:bg-kb-beige-light transition-colors"
        >
          이체하기
        </Link>
        <Link
          href="/dashboard"
          className="px-10 py-3 border border-kb-border text-[14px] text-kb-text hover:bg-kb-beige-light transition-colors"
        >
          홈으로
        </Link>
      </div>
    </div>
  )
}

export default function LoanCompletePage() {
  return (
    <Suspense fallback={
      <div className="max-w-[640px] mx-auto px-6 py-16 text-center text-kb-text-muted">
        로딩 중...
      </div>
    }>
      <LoanCompleteContent />
    </Suspense>
  )
}
