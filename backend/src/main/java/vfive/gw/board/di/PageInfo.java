package vfive.gw.board.di;

import lombok.Data;

@Data
public class PageInfo {
	String keyword, sideId;
	int pNo = 1;
    
    private int curPage = 1;      // 현재 페이지
    private int pageSize = 10;    // 페이지당 게시물 수
    private int total;            // 전체 게시물 수
    private int totalPage;        // 전체 페이지 수
    private int start;            // 시작 인덱스
    private int cnt;              // 조회할 개수
    private int blockSize = 5;    // 페이지 블록 크기 (1~5까지 표시)
    private int startPage;   
    private int endPage;   
    private boolean prevBut;   
    private boolean nextBut;   
    
    
    
    public void setTotal(int total) {
        this.total = total;
        this.totalPage = (int) Math.ceil((double) total / pageSize);
        this.start = (curPage - 1) * pageSize;
        this.cnt = pageSize;
        
        this.startPage = ((curPage-1)/blockSize)*blockSize+1;
        this.endPage = Math.min(startPage+blockSize-1,totalPage);
        this.prevBut = startPage > 1;
        this.nextBut = endPage < totalPage;
    }
    
    public void setCurPage(int curPage) {
        this.curPage = curPage;
        this.start = (curPage - 1) * pageSize;
    }
    
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
        this.cnt = pageSize;
        this.start = (curPage - 1) * pageSize;
    }
    
    /**
     * 시작 페이지 번호 계산
     */
    public int getStartPage() {
        return ((curPage - 1) / blockSize) * blockSize + 1;
    }
    
    /**
     * 끝 페이지 번호 계산
     */
    public int getEndPage() {
        int endPage = getStartPage() + blockSize - 1;
        return Math.min(endPage, totalPage);
    }
    
    /**
     * 이전 블록 존재 여부
     */
    public boolean hasPrevBlock() {
        return getStartPage() > 1;
    }
    
    /**
     * 다음 블록 존재 여부
     */
    public boolean hasNextBlock() {
        return getEndPage() < totalPage;
    }

	public void setpNo(int pNo) {
		this.pNo = pNo;
		this.curPage = pNo;
	}
	
	
	public String getKeyword() { return keyword;}
	public void setKeyword(String keyword) {this.keyword = keyword; }
	
}