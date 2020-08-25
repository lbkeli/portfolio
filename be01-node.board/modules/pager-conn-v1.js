module.exports = (pager) => {
	pager.page = pager.page || 1;	// 현재 페이지
	pager.cnt = pager.cnt || 5;		// 한페이지당 리스트 수
	pager.grp = pager.grp || 3;		// 페이저 그룹 갯수 (1,2,3 / 4,5,6)
	pager.stRec = (pager.page - 1) * pager.cnt;	// 페이지 리스트의 시작 index값 (LIMIT의 여기 부분)
	pager.lastPage = Math.ceil(pager.totalRec / pager.cnt);	// 마지막 페이지 (총 페이지 수)
	pager.grpSt = Math.floor((pager.page - 1) / pager.grp) * pager.grp + 1; // 페이저 묶음의 시작 수 (< 1, 2, 3 > 이면 1 / < 7, 8, 9 > 면 7)
	pager.grpEd = pager.grpSt + pager.grp - 1; // 페이저 묶음의 마지막 수
	pager.grpEd = (pager.gapEd > pager.lastPage) ? pager.lastPage : pager.grpEd;
	pager.prev = (pager.page > 1) ? pager.page - 1 : 1 ;
	pager.next = (pager.page < pager.lastPage) ? pager.page + 1 : pager.lastPage;

	return pager;
}