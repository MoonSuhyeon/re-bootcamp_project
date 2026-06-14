'use client'

import Link from 'next/link'
import { useState } from 'react'

const SUPPORT_TABS = [
  { label: '고객상담',         href: '#' },
  { label: '고객정보관리',     href: '#', active: true },
  { label: '사고신고',         href: '#' },
  { label: '소비자보호',       href: '#' },
  { label: '금융서비스',       href: '#' },
  { label: '서식/약관/설명서', href: '#' },
  { label: '상품공시실',       href: '#' },
]

const LEFT_MENU = [
  {
    label: '고객정보조회/수정', href: '#', open: true,
    sub: [
      { label: '고객정보조회(개인정보열람)', href: '/support/customer-info/inquiry', active: false },
      { label: '고객정보수정',               href: '/support/customer-info/edit',    active: true },
    ],
  },
  { label: 'ID조회/사용자암호 설정',          href: '#', sub: null },
  { label: '온라인고객관리',                  href: '#', sub: null },
  { label: '본인정보 이용·제공 조회',         href: '#', sub: null },
  { label: '해외 납세의무자\n본인확인서 등록', href: '#', sub: null },
  { label: '고객확인제도(CDD/EDD)',           href: '#', sub: null },
  { label: '그룹 내 고객정보 제공 안내',      href: '#', sub: null },
]

const TEL_OPTIONS = ['없음', '02', '031', '032', '033', '041', '042', '043', '044', '051', '052', '053', '054', '055', '061', '062', '063', '064']

export default function CustomerInfoEditPage() {
  const [email,       setEmail]       = useState('hong@axful.com')
  const [homeZip,     setHomeZip]     = useState('06236')
  const [homeAddr1,   setHomeAddr1]   = useState('서울특별시 강남구 테헤란로 123')
  const [homeAddr2,   setHomeAddr2]   = useState('')
  const [homeTelArea, setHomeTelArea] = useState('없음')
  const [homeTel1,    setHomeTel1]    = useState('')
  const [homeTel2,    setHomeTel2]    = useState('')

  const [workZip,     setWorkZip]     = useState('')
  const [workAddr1,   setWorkAddr1]   = useState('')
  const [workAddr2,   setWorkAddr2]   = useState('')
  const [workName,    setWorkName]    = useState('')
  const [dept,        setDept]        = useState('')
  const [workTelArea, setWorkTelArea] = useState('없음')
  const [workTel1,    setWorkTel1]    = useState('')
  const [workTel2,    setWorkTel2]    = useState('')

  const [sms,    setSms]    = useState<'수신' | '거부'>('수신')
  const [emailR, setEmailR] = useState<'수신' | '거부'>('수신')
  const [post,   setPost]   = useState<'자택' | '직장' | '수신거부'>('자택')
  const [tel,    setTel]    = useState({ home: true, work: true, mobile: true })

  function toggleTel(key: keyof typeof tel) {
    setTel(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 고객센터 탭 */}
      <div className="bg-[#5D3D2B]">
        <div className="max-w-kb-container mx-auto px-6">
          <div className="flex">
            {SUPPORT_TABS.map(tab => (
              <Link key={tab.label} href={tab.href}
                className={`px-6 py-3 text-[14px] font-medium transition-colors ${
                  tab.active ? 'bg-[#5BC9A8] text-kb-text font-bold' : 'text-white hover:bg-white/10'
                }`}>
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-kb-container mx-auto px-6 py-6">
        {/* 브레드크럼 */}
        <div className="flex justify-end mb-3 text-[12px] text-kb-text-muted gap-1">
          <span>고객센터</span><span>›</span>
          <span>고객정보관리</span><span>›</span>
          <span>고객정보조회/수정</span><span>›</span>
          <span className="text-kb-blue">고객정보수정</span>
        </div>

        <div className="flex gap-6">
          {/* 사이드바 */}
          <aside className="w-[200px] flex-shrink-0">
            <div className="border border-kb-border">
              <div className="bg-[#5D3D2B] px-4 py-3">
                <span className="text-white font-bold text-[14px]">고객정보관리</span>
              </div>
              {LEFT_MENU.map(item => (
                <div key={item.label}>
                  <Link href={item.href}
                    className="flex items-center justify-between px-4 py-3 text-[13px] border-t border-kb-border hover:bg-kb-beige-light text-kb-text-body whitespace-pre-line">
                    {item.label}
                    {item.sub && <span className="text-[10px] text-kb-text-muted">{item.open ? '▼' : '▶'}</span>}
                  </Link>
                  {item.open && item.sub?.map(sub => (
                    <Link key={sub.label} href={sub.href}
                      className={`block pl-6 pr-4 py-2.5 text-[12px] border-t border-kb-border transition-colors ${
                        sub.active
                          ? 'bg-[#5BC9A8] text-kb-text font-bold'
                          : 'hover:bg-kb-beige-light text-kb-text-muted'
                      }`}>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Link href="/cert"
                className="flex items-center justify-between border border-kb-border px-4 py-3 text-[13px] text-kb-text-body hover:bg-kb-beige-light">
                인증센터 <span className="text-[#5BC9A8] font-bold text-[16px]">›</span>
              </Link>
            </div>
          </aside>

          {/* 본문 */}
          <main className="flex-1 min-w-0">
            <h1 className="text-[22px] font-bold text-kb-text mb-4">고객정보수정</h1>

            {/* 상단 안내 */}
            <div className="border border-kb-border bg-[#FAFAF7] px-5 py-4 mb-6 text-[13px] text-kb-text-body space-y-1.5">
              <p>· 전화번호 변경 시 금융사고 예방을 위해 추가인증 절차가 필요합니다.</p>
              <p>· AXful카드 고객정보 변경은 해당 카드에서 변경해주시기 바랍니다.</p>
              <p>· 보험사의 고객정보 (바카쟁스 상품가입고객) 수정을 원하는 경우 가까운 영업점 방문하시거나 해당보험사로 문의하여 주시기 바랍니다.</p>
              <p>· 온라인 회원(인터넷뱅킹 미가입자) 고객정보 수정 시, 도움말을 참조하십시오.</p>
            </div>

            {/* 기본정보 */}
            <h2 className="text-[15px] font-bold text-kb-text mb-3 pb-1 border-b-2 border-kb-text">기본정보</h2>
            <table className="w-full text-[13px] border-collapse mb-6">
              <tbody>
                <tr className="border-b border-kb-border">
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36 whitespace-nowrap align-top">휴대폰번호</td>
                  <td className="border border-kb-border px-4 py-4 text-kb-text-body space-y-1.5">
                    <div className="bg-kb-beige-light border border-kb-border px-4 py-2 text-[12px] text-kb-text-muted rounded">
                      010-1234-5678
                    </div>
                    <p className="text-[11px] text-kb-text-muted leading-relaxed">
                      · 휴대폰번호 변경 시 금융사고 예방을 위해 영업점, 고객센터(1588-9999), AXful 스타뱅킹 인터넷뱅킹 화상상담(고객센터&gt;화상상담)을 통해 변경할 수 있습니다.<br />
                      ※ 화상상담 서비스 이용은 고객님의 AXful 스타클럽 등급에 따라 제한될 수 있습니다.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text whitespace-nowrap">이메일주소</td>
                  <td className="border border-kb-border px-4 py-3">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="border border-kb-border px-3 py-1.5 w-64 outline-none text-[13px]" />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 자택정보 */}
            <h2 className="text-[15px] font-bold text-kb-text mb-3 pb-1 border-b-2 border-kb-text">자택정보</h2>
            <table className="w-full text-[13px] border-collapse mb-6">
              <tbody>
                <tr className="border-b border-kb-border">
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36 whitespace-nowrap align-top">자택주소</td>
                  <td className="border border-kb-border px-4 py-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="text" value={homeZip} onChange={e => setHomeZip(e.target.value)}
                        placeholder="우편번호" maxLength={5}
                        className="border border-kb-border px-3 py-1.5 w-24 outline-none text-[13px]" />
                      <button className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">우편번호</button>
                      <button onClick={() => { setHomeZip(''); setHomeAddr1(''); setHomeAddr2('') }}
                        className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">초기화</button>
                    </div>
                    <input type="text" value={homeAddr1} onChange={e => setHomeAddr1(e.target.value)}
                      className="border border-kb-border px-3 py-1.5 w-full outline-none text-[13px]" />
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-kb-text-muted whitespace-nowrap">나머지 주소</span>
                      <input type="text" value={homeAddr2} onChange={e => setHomeAddr2(e.target.value)}
                        className="border border-kb-border px-3 py-1.5 flex-1 outline-none text-[13px]" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text whitespace-nowrap">자택전화번호</td>
                  <td className="border border-kb-border px-4 py-3">
                    <TelInput area={homeTelArea} tel1={homeTel1} tel2={homeTel2}
                      onArea={setHomeTelArea} onTel1={setHomeTel1} onTel2={setHomeTel2} />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 직장정보 */}
            <h2 className="text-[15px] font-bold text-kb-text mb-3 pb-1 border-b-2 border-kb-text">직장정보</h2>
            <table className="w-full text-[13px] border-collapse mb-6">
              <tbody>
                <tr className="border-b border-kb-border">
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36 whitespace-nowrap align-top">직장주소</td>
                  <td className="border border-kb-border px-4 py-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="text" value={workZip} onChange={e => setWorkZip(e.target.value)}
                        placeholder="우편번호" maxLength={5}
                        className="border border-kb-border px-3 py-1.5 w-24 outline-none text-[13px]" />
                      <button className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">우편번호</button>
                      <button onClick={() => { setWorkZip(''); setWorkAddr1(''); setWorkAddr2('') }}
                        className="border border-kb-border px-3 py-1.5 text-[12px] text-kb-text-body hover:bg-kb-beige-light">초기화</button>
                    </div>
                    <input type="text" value={workAddr1} onChange={e => setWorkAddr1(e.target.value)}
                      className="border border-kb-border px-3 py-1.5 w-full outline-none text-[13px]" />
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-kb-text-muted whitespace-nowrap">나머지 주소</span>
                      <input type="text" value={workAddr2} onChange={e => setWorkAddr2(e.target.value)}
                        className="border border-kb-border px-3 py-1.5 flex-1 outline-none text-[13px]" />
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-kb-border">
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text whitespace-nowrap">직장명</td>
                  <td className="border border-kb-border px-4 py-3">
                    <div className="flex items-center gap-3">
                      <input type="text" value={workName} onChange={e => setWorkName(e.target.value)}
                        className="border border-kb-border px-3 py-1.5 w-44 outline-none text-[13px]" />
                      <span className="bg-kb-beige-light border border-kb-border px-3 py-1.5 text-[13px] font-semibold text-kb-text whitespace-nowrap">부서명</span>
                      <input type="text" value={dept} onChange={e => setDept(e.target.value)}
                        className="border border-kb-border px-3 py-1.5 w-44 outline-none text-[13px]" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text whitespace-nowrap">직장전화번호</td>
                  <td className="border border-kb-border px-4 py-3">
                    <TelInput area={workTelArea} tel1={workTel1} tel2={workTel2}
                      onArea={setWorkTelArea} onTel1={setWorkTel1} onTel2={setWorkTel2} />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 고객관리 안내수단 */}
            <h2 className="text-[15px] font-bold text-kb-text mb-3 pb-1 border-b-2 border-kb-text">고객관리 안내수단</h2>
            <table className="w-full text-[13px] border-collapse mb-6">
              <tbody>
                <tr className="border-b border-kb-border">
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text w-36">SMS 수신여부</td>
                  <td className="border border-kb-border px-4 py-3">
                    <div className="flex items-center">
                      <div className="flex items-center gap-4 flex-1">
                        <RadioBtn name="sms" value="수신" checked={sms === '수신'} onChange={() => setSms('수신')} />
                        <RadioBtn name="sms" value="거부" checked={sms === '거부'} onChange={() => setSms('거부')} />
                      </div>
                      <div className="flex items-center gap-4 border-l border-kb-border pl-4">
                        <span className="bg-kb-beige-light px-3 py-1 font-semibold text-kb-text whitespace-nowrap text-[12px]">이메일 수신여부</span>
                        <RadioBtn name="emailR" value="수신" checked={emailR === '수신'} onChange={() => setEmailR('수신')} />
                        <RadioBtn name="emailR" value="거부" checked={emailR === '거부'} onChange={() => setEmailR('거부')} />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-kb-border">
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text">우편물수령처</td>
                  <td className="border border-kb-border px-4 py-3">
                    <div className="flex items-center gap-6">
                      {(['자택', '직장', '수신거부'] as const).map(v => (
                        <RadioBtn key={v} name="post" value={v} checked={post === v} onChange={() => setPost(v)} />
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="bg-kb-beige-light border border-kb-border px-4 py-3 font-semibold text-kb-text">
                    전화 수신여부<br />
                    <span className="font-normal text-[11px] text-kb-text-muted">(복수선택 가능)</span>
                  </td>
                  <td className="border border-kb-border px-4 py-3">
                    <div className="flex items-center gap-6">
                      <CheckBtn label="자택"   checked={tel.home}   onChange={() => toggleTel('home')} />
                      <CheckBtn label="직장"   checked={tel.work}   onChange={() => toggleTel('work')} />
                      <CheckBtn label="휴대폰" checked={tel.mobile} onChange={() => toggleTel('mobile')} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-center gap-3 mb-8">
              <button className="bg-[#5BC9A8] px-12 py-3 text-[14px] font-bold text-kb-text hover:opacity-90">
                확인
              </button>
              <Link href="/support/customer-info/inquiry"
                className="border border-kb-border px-12 py-3 text-[14px] text-kb-text-body hover:bg-kb-beige-light">
                취소
              </Link>
            </div>

            {/* 하단 안내 */}
            <div className="border border-kb-border px-5 py-4 text-[12px] text-kb-text-body space-y-2">
              <p className="font-bold text-kb-text mb-1">고객관리 안내수단</p>
              <p>· 당행이 필수 고지사항 들을 안내하는 수단입니다.</p>
              <div className="ml-3 text-kb-text-muted space-y-1">
                <p>- 영업점 이전, 통합, 폐쇄 등의 안내, 대출 원리금 납입 미납, 은행상품 만기 안내</p>
                <p>- 계약조건 변경 안내(금리변경, 부가서비스, 혜택변경 등), 민원 및 기타 계약의 유지관리에 관한 안내</p>
              </div>
              <p>· 혜택정보 안내(마케팅) 수신동의는 (고객정보관리 &gt; 본인정보 이용·제공 조회 &gt; <span className="text-kb-blue">[은행] 혜택정보 안내 수신동의</span>)에서 변경하실 수 있습니다.</p>
              <p>· 개별 상품(수신, 여신, 외환 등)에서 별도로 안내를 신청할 경우 위의 안내수단을 전부 거절하셔도 안내가 가능할 수 있습니다.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function TelInput({ area, tel1, tel2, onArea, onTel1, onTel2 }: {
  area: string; tel1: string; tel2: string
  onArea: (v: string) => void; onTel1: (v: string) => void; onTel2: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-1">
      <select value={area} onChange={e => onArea(e.target.value)}
        className="border border-kb-border px-2 py-1.5 text-[13px] outline-none bg-white">
        {['없음', '02', '031', '032', '033', '041', '042', '043', '044', '051', '052', '053', '054', '055', '061', '062', '063', '064'].map(v => (
          <option key={v}>{v}</option>
        ))}
      </select>
      <span className="text-kb-text-muted">-</span>
      <input type="text" value={tel1} onChange={e => onTel1(e.target.value)} maxLength={4}
        className="border border-kb-border px-2 py-1.5 w-20 outline-none text-[13px] text-center" />
      <span className="text-kb-text-muted">-</span>
      <input type="text" value={tel2} onChange={e => onTel2(e.target.value)} maxLength={4}
        className="border border-kb-border px-2 py-1.5 w-20 outline-none text-[13px] text-center" />
    </div>
  )
}

function RadioBtn({ name, value, checked, onChange }: {
  name: string; value: string; checked: boolean; onChange: () => void
}) {
  return (
    <label className="flex items-center gap-1.5 text-[13px] cursor-pointer">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="accent-[#5BC9A8]" />
      {value}
    </label>
  )
}

function CheckBtn({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-1.5 text-[13px] cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 accent-[#5BC9A8]" />
      {label}
    </label>
  )
}
