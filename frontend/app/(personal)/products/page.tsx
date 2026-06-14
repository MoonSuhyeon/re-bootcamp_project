'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

function HouseIcon() {
  return (
    <svg viewBox="0 0 60 52" fill="none" className="w-16 h-14 mx-auto" stroke="#BBBBBB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 28 L30 8 L52 28" />
      <path d="M14 28 L14 46 L46 46 L46 28" />
      <rect x="22" y="32" width="16" height="14" />
    </svg>
  )
}

function PiggyIcon() {
  return (
    <svg viewBox="0 0 60 52" fill="none" className="w-16 h-14 mx-auto" stroke="#BBBBBB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="28" cy="32" rx="17" ry="13" />
      <circle cx="21" cy="27" r="1.8" fill="#BBBBBB" stroke="none" />
      <path d="M45 30 C49 30 51 27 51 25 C51 23 49 23 45 24" />
      <path d="M28 19 C28 17 30 16 33 16 C35 16 36 18 34 19" />
      <path d="M20 44 L18 50" />
      <path d="M36 44 L38 50" />
      <path d="M11 33 Q13 39 16 39" />
    </svg>
  )
}

const BEST_PRODUCTS = [
  {
    badge: '예금 BEST',
    badgeColor: '#E87722',
    icon: <HouseIcon />,
    subLabel: '',
    name: '주택청약종합저축',
    valueLabel: '24개월 기준,',
    value: '연 3.1%',
    href: '/products/deposit/list',
  },
  {
    badge: '예금 BEST',
    badgeColor: '#E87722',
    icon: <PiggyIcon />,
    subLabel: '저축과 건강관리를 한 번에',
    name: 'AXful 스타 건강적금',
    valueLabel: '6개월 기준,',
    value: '연 1% ~ 6%',
    href: '/products/deposit/list',
  },
]

type ThemeProduct = {
  tag: string
  tagColor: 'orange' | 'blue'
  desc?: string
  name: string
  rightTop?: string
  rightBottom?: string
  href: string
}

const THEME_TABS: { id: string; label: string; products: ThemeProduct[] }[] = [
  {
    id: '01',
    label: '내 차 마련을 위한',
    products: [
      { tag: '자동차대출', tagColor: 'blue', desc: '신차 구매 자금도 은행방문 없이!', name: 'AXful 매직카대출(신차 구매用)', rightTop: '최고', rightBottom: '6천만원', href: '/products/loan/auto' },
      { tag: '자동차대출', tagColor: 'blue', desc: '중고차 구매 자금도 은행방문 없이!', name: 'AXful 매직카대출(중고차 구매用)', rightTop: '최고', rightBottom: '4천만원', href: '/products/loan/auto' },
      { tag: '자동차대출', tagColor: 'blue', desc: '신차 대환대출도 은행방문 없이!', name: 'AXful 매직카대출(기존 신차할부 대환用)', rightTop: '최고', rightBottom: '6천만원', href: '/products/loan/auto' },
    ],
  },
  {
    id: '02',
    label: '우리 아이를 위한',
    products: [
      { tag: '입출금자유', tagColor: 'orange', desc: '저금통 기능과 수수료면제 서비스 제공', name: 'AXful Young Youth 통장', href: '/products/deposit/list' },
      { tag: '적금', tagColor: 'orange', desc: '어린이/청소년 무료 보험가입', name: 'AXful Young Youth 적금', rightTop: '12개월 기준', rightBottom: '연 2.1%~3.4%', href: '/products/deposit/list' },
    ],
  },
  {
    id: '03',
    label: '내 집 마련 삼총사',
    products: [
      { tag: '주택청약', tagColor: 'orange', name: '주택청약종합저축', rightTop: '24개월 기준', rightBottom: '연 3.1%', href: '/products/deposit/list' },
      { tag: '전세/담보대출', tagColor: 'blue', desc: '혼합금리와 변동금리 중 선택이 가능한 주택담보대출', name: 'AXful 주택담보대출', rightTop: '최고', rightBottom: '대출가능금액 이내', href: '/products/loan/mortgage' },
      { tag: '주택도시기금', tagColor: 'blue', name: '(비대면신청)내집마련디딤돌대출', href: '/products/loan/khfc' },
    ],
  },
]

export default function ProductsHomePage() {
  const [activeTheme, setActiveTheme] = useState(0)

  return (
    <div>
      {/* BEST 인기상품 */}
      <section style={{ backgroundColor: '#e8f0e0' }} className="pt-12 pb-12">
        <div className="max-w-kb-container mx-auto px-6">
          <div className="flex items-stretch gap-8">
            {/* 왼쪽: 타이틀 + 카드 */}
            <div className="flex-1 min-w-0 flex flex-col">
              <h2 className="text-[28px] font-bold text-kb-text mb-1">AXful 고객님이 선택한 BEST 인기상품</h2>
              <p className="text-[18px] text-kb-text-muted mb-4">가장 많이 사랑받은 인기상품입니다.</p>
              <Link href="/products/deposit/list" className="text-[14px] text-kb-text font-medium underline">예금 상품 보기</Link>

              {/* 상품 카드 */}
              <div className="relative mt-5">
                <div className="flex gap-3">
                {BEST_PRODUCTS.map((p) => (
                  <div key={p.name}
                    className="border border-[#E0E0E0] bg-white relative pt-6 px-4 pb-4 flex flex-col w-[420px] flex-shrink-0 hover:bg-[#F9F9F9] transition-colors">
                    {/* 뱃지 + 수평선 */}
                    <div className="absolute top-0 left-0 right-0 flex items-center" style={{ transform: 'translateY(-50%)' }}>
                      <div className="ml-4">
                        <span className="px-3 py-1 text-[12px] text-white font-bold rounded-full whitespace-nowrap"
                          style={{ backgroundColor: p.badgeColor }}>
                          {p.badge}
                        </span>
                      </div>
                      <div className="flex-1 h-px mx-2" style={{ backgroundColor: p.badgeColor }} />
                    </div>
                    {/* 아이콘 */}
                    <div className="flex justify-center items-center mb-2 h-9">{p.icon}</div>
                    {/* 서브 라벨 */}
                    <p className="text-[12px] text-kb-text-muted text-center mb-1 min-h-[18px]">{p.subLabel}</p>
                    {/* 상품명 */}
                    <p className="text-[17px] font-bold text-kb-text text-center mb-2 leading-snug">{p.name}</p>
                    {/* 금리 */}
                    <p className="text-[12px] text-kb-text-muted text-center">{p.valueLabel}</p>
                    <p className="text-[22px] font-bold text-kb-text text-center my-1">{p.value}</p>
                    {/* 버튼 */}
                    <Link href={p.href}
                      className="w-2/3 mx-auto mt-2 py-1.5 rounded-full text-white text-[13px] font-medium text-center block hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: p.badgeColor }}>
                      상세정보
                    </Link>
                  </div>
                ))}
                </div>
                <p className="absolute bottom-0 text-[13px] text-kb-text-muted whitespace-nowrap" style={{ left: '1000px' }}>
                  2026.05.25 기준, 세금공제전, 우대금리포함
                </p>
              </div>
            </div>

            {/* 오른쪽: 이미지 영역 */}
            <div className="w-[480px] flex-shrink-0 flex items-start justify-end -mr-[30px] -mt-4">
              <Image
                src="/images/personal-loan-hero1.png"
                alt="금융상품"
                width={390}
                height={298}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 상품검색 / 추천상품 / 상담이어가기 */}
      <section className="bg-white py-8 border-b border-kb-border">
        <div className="max-w-kb-container mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-kb-border">
            {/* 상품검색 */}
            <div className="pr-10">
              <p className="text-[18px] font-bold text-kb-text mb-3">상품검색</p>
              <div className="flex items-center border border-kb-border rounded-full px-4 py-2 gap-2">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요."
                  className="flex-1 text-[14px] outline-none bg-transparent text-kb-text-body"
                />
                <button className="text-kb-text-muted hover:text-kb-text">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* 추천상품 */}
            <div className="px-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[18px] font-bold text-kb-text mb-1">
                    추천상품 <span className="font-normal text-kb-text-muted">→</span>
                  </p>
                  <p className="text-[15px] text-kb-text-muted">나에게 맞는 추천 상품은?</p>
                  <p className="text-[14px] text-kb-text-muted mt-1">#직장인 #Youth #골든라이프</p>
                </div>
              </div>
            </div>

            {/* 상담이어가기 */}
            <div className="pl-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[18px] font-bold text-kb-text mb-1">
                    상담이어가기 <span className="font-normal text-kb-text-muted">→</span>
                  </p>
                  <p className="text-[15px] text-kb-text-muted">내가 상담받은 상품에</p>
                  <p className="text-[14px] text-kb-text-muted">바로 가입하려면?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 테마상품 */}
      <section className="bg-[#f5f5f5] py-10">
        <div className="max-w-kb-container mx-auto px-6">
          <h2 className="text-[22px] font-bold text-kb-text mb-6">AXful만의 특별한 테마상품</h2>
          <div className="flex gap-8">
            {/* 탭 */}
            <div className="w-64 flex-shrink-0 flex flex-col justify-center gap-4 py-6 px-2">
              {THEME_TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTheme(i)}
                  className={`flex items-center gap-3 px-5 py-5 text-left transition-colors rounded
                    ${activeTheme === i ? 'bg-white shadow-sm' : 'hover:bg-white/80'}`}
                >
                  <span className={`text-[18px] font-bold w-8 ${activeTheme === i ? 'text-[#c8a400]' : 'text-kb-border'}`}>
                    {tab.id}
                  </span>
                  <span className={`text-[17px] ${activeTheme === i ? 'font-bold text-kb-text' : 'text-kb-text-muted'}`}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* 상품 목록 */}
            <div className="flex-1 bg-white rounded-lg overflow-hidden">
              {THEME_TABS[activeTheme].products.map((p, i) => (
                <Link key={p.name} href={p.href}
                  className={`flex items-center justify-between px-6 py-5 hover:bg-kb-beige-light transition-colors
                    ${i < THEME_TABS[activeTheme].products.length - 1 ? 'border-b border-kb-border' : ''}`}
                >
                  <div>
                    <span className={`inline-block text-white text-[11px] px-2 py-0.5 rounded mb-1.5
                      ${p.tagColor === 'orange' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                      {p.tag}
                    </span>
                    {p.desc && <p className="text-[12px] text-kb-text-muted">{p.desc}</p>}
                    <p className="text-[17px] font-bold text-kb-text">{p.name}</p>
                  </div>
                  {(p.rightTop || p.rightBottom) && (
                    <div className="text-right flex-shrink-0 ml-4">
                      {p.rightTop && <p className="text-[12px] text-kb-text-muted">{p.rightTop}</p>}
                      {p.rightBottom && <p className="text-[22px] font-bold text-kb-text leading-tight">{p.rightBottom}</p>}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
