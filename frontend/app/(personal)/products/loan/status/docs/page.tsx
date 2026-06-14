import LoanSidebar from '@/components/inquiry/LoanSidebar'

export default function PostDocsPage() {
  return (
    <div className="max-w-kb-container mx-auto px-6 py-6">
      <div className="flex justify-end mb-3 text-[12px] text-kb-text-muted gap-1 items-center">
        <span>개인뱅킹</span><span>›</span>
        <span>금융상품</span><span>›</span>
        <span>대출</span><span>›</span>
        <span>대출진행현황</span><span>›</span>
        <span className="font-semibold text-kb-text">사후서류제출</span>
      </div>

      <div className="flex gap-6">
        <LoanSidebar />

        <main className="flex-1 min-w-0">
          <h1 className="text-[20px] font-bold text-kb-text mb-5">사후서류제출</h1>

          <div className="border border-kb-border bg-[#FAFAFA] px-4 py-3 mb-5 text-[12px] text-kb-text-body">
            <p className="flex gap-1.5">
              <span className="flex-shrink-0">-</span>
              <span>대출 기한 이내 사후서류 미제출 시에는 약정 미이행에 따라 기한의 이익이 상실되어 즉시 대출을 상환하여야 합니다. (제출기간 경과 후에는 영업점으로 직접 제출만 가능)</span>
            </p>
          </div>

          <table className="w-full border-collapse text-[13px] border-t-2 border-kb-text">
            <thead>
              <tr className="bg-kb-beige-light">
                <th className="border border-kb-border px-4 py-3 text-kb-text font-semibold text-center">대출실행일자</th>
                <th className="border border-kb-border px-4 py-3 text-kb-text font-semibold text-center">상품명/계좌번호</th>
                <th className="border border-kb-border px-4 py-3 text-kb-text font-semibold text-center">제출기한</th>
                <th className="border border-kb-border px-4 py-3 text-kb-text font-semibold text-center">제출여부</th>
                <th className="border border-kb-border px-4 py-3 text-kb-text font-semibold text-center">제출하기</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="border border-kb-border px-4 py-10 text-center text-[13px] text-kb-text-muted">
                  사후서류제출 대상 계좌가 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </div>
  )
}
