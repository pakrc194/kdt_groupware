import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Pagination from './Pagination';
import { fetcher } from '../../../shared/api/fetcher';
import boardst from '../../Home/css/Board.module.css';

/**
 * BoardList 컴포넌트
 * @param {Object} props - goBoardId: 상세 조회를 위한 ID 전달 함수, goService: 화면 전환 함수
 */
function BoardList(props) {
    const { sideId } = useParams();
    const navigate = useNavigate();

    // 상태 관리
    const [boards, setBoards] = useState([]); // 게시글 목록
    const [pInfo, setPInfo] = useState(null); // 페이지네이션 정보
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [pageSize, setPageSize] = useState(10); // 페이지당 게시글 수
    const [files , setFiles] = useState([]);
    console.log("내용확인",boards)
    
    // 검색 상태 관리
    const [searchInput, setSearchInput] = useState(''); // 검색 입력값
    const [keyword, setKeyword] = useState(''); // 실제 검색에 사용될 키워드
    const [searchType, setSearchType] = useState('title'); // 검색 타입 (제목, 작성자 등)
    
    // 로컬스토리지에서 사용자 정보 가져오기
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const empSn = myInfo?.empSn; // 사원 번호
    const myDept = myInfo?.deptName; // 사원 부서명

  
    // 1. 화면(sideId)이 변경되면 무조건 1페이지로 리셋
    useEffect(() => {
        setCurrentPage(1);
        setSearchInput('');
        setKeyword('');
    }, [sideId]);

    useEffect(() => {
        fetchBoards();
    }, [sideId, currentPage, pageSize, keyword, searchType]);

    /**
     * 서버에서 게시글 데이터를 가져오는 함수
     */
    const fetchBoards = () => {
        setIsLoading(true);
        // API 경로 예시: /board/인사관리?pNo=1&pageSize=10...
        fetcher(`/board/${sideId}?pNo=${currentPage}&pageSize=${pageSize}&keyword=${keyword}&searchType=${searchType}&empSn=${empSn}`)
            .then(dd => {
                // API 응답 구조에 따라 데이터 저장
                setBoards(dd.boards || dd); 
                setPInfo(dd.pInfo);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("데이터 로드 실패:", err);
                setIsLoading(false);
            });
    };

    /**
     * 날짜 포맷팅 함수
     * @param {string} dateString - '2026-02-09T15:00:00.000Z'
     * @returns {string} - '2026-02-09 15:00'
     */
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    // 검색 실행 함수
    const handleSearch = () => {
        setKeyword(searchInput);
        setCurrentPage(1);
    };

    // 페이지 크기(개수) 변경 함수
    const pageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    // 상세 페이지 이동 함수
    const goDetail = (id) => {
        props.goBoardId(id);
        props.goService('detail');
    };

    

    // 2. 데이터 로딩 중인 경우
    if (isLoading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>데이터를 불러오는 중입니다...</div>;
    }

    // 3. 정상 권한인 경우: 게시판 목록 출력
    return (
        <div className="board-list-container">
           <div className={boardst.topControlArea}>
    {/* 왼쪽: 검색 컨트롤 */}
    <div className={boardst.searchGroup}>
        <select className={boardst.selectBox} value={pageSize} onChange={pageSizeChange}>
            <option value="5">5개씩</option>
            <option value="10">10개씩</option>
            <option value="20">20개씩</option>
            <option value="30">30개씩</option>
        </select>
        <select className={boardst.selectBox}
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
        >
            <option value="title">제목</option>
            <option value="creator">작성자</option>
        </select>
        <input 
            className={boardst.schinput} 
            type='text' 
            placeholder="검색어를 입력하세요" 
            value={searchInput} 
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className={boardst.schBtn} onClick={handleSearch}>검색</button>
    </div>

    {/* 오른쪽: 글쓰기 버튼 */}
    <div className={boardst.actionGroup}>
        {(sideId !== 'important' || myDept === '지점장')&& sideId !== 'MyPosts' && (
            <button className={boardst.writBtn} onClick={() => props.goService('Insert')}>
                글쓰기
            </button>
        )}
    </div>
</div>


            {/* 게시판 테이블 */}
            <table className={boardst.boardTable}>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>첨부파일</th>
                        <th>작성일</th>
                        <th>조회수</th>
                        <th>작성자</th>
                    </tr>
                </thead>
                <tbody>
                    {boards && boards.length > 0 ? (
                        boards.map((st, k) => {
                            // 공지사항(상단 고정) 여부 체크
                            const isTopItem = String(st.isTop) === "true";
                            const rowClass = isTopItem ? boardst.topNotice : "";
                            
                            return (
                                <tr key={st.boardId} className={rowClass}>
                                    <td>{pInfo ? pInfo.start + k + 1 : k + 1}</td>
                                    <td 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`?id=${st.boardId}`)} 
                                    >
                                        {st.title}
                                        {/* 첨부파일 아이콘 추가 구문 */}

                                    </td>
                                    <td>
                                        {st.fileCount > 0 && (
                                            <span style={{ marginLeft: '8px', color: '#666' }} title="첨부파일 있음">
                                                📎첨부파일
                                            </span>
                                        )}
                                    </td>

                                    <td>{formatDate(st.createdAt)}</td>
                                    <td>{st.views}</td>
                                    <td>{st.empNm}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                                등록된 게시글이 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 하단 버튼 영역 (글쓰기 권한 제어) */}
                    

            <div className={boardst.footerArea} style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                {(sideId !== 'important' || myDept === '지점장')&& sideId !== 'MyPosts' && (
                    <button className={boardst.writBtn } onClick={() => props.goService('Insert')}>
                        글쓰기
                    </button>
                )}
            </div>

            {/* 페이지네이션 컴포넌트 */}
            {pInfo && (
                <div className={boardst.paginationContainer} style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <Pagination pInfo={pInfo} onPageChange={setCurrentPage} />
                </div>
            )}
        </div>
    );
}

export default BoardList;