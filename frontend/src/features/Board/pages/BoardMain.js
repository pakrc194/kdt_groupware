import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
// import './BoardMain.css';

function BoardMain(props) {
    const { sideId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [boards, setBoards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    
    // 검색 및 설정
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pageSize, setPageSize] = useState(10);

    // 게시판 타이틀 매핑
    const boardTitles = {
        'important': '중요 게시판',
        'common': '공용 게시판',
        'team': '팀별 게시판',
        'my': '내가 쓴 게시물'
    };

    // 데이터 로드
    useEffect(() => {
        fetchBoards();
    }, [sideId, currentPage, pageSize, keyword]);

    const fetchBoards = () => {
        setIsLoading(true);

        let urlStr = `http://192.168.0.36:8080/board/${sideId}?pNo=${currentPage}&pageSize=${pageSize}`
        console.log('urlStr:',urlStr)
        
        fetch (urlStr ,
            {
             headers:{
            'content-Type':'application/json'
        
             }
        })
        .then(response =>response.json())
        .then(
           
            dd =>{

                 console.log(dd)
            let vv = (<table border="">
                <tr>
                    <td>번호</td>
                    <td>유형</td>
                    <td>제목</td>
                    <td>작성일</td>
                    <td>조회수</td>
                    <td>작성자</td>
                </tr>
                {dd.map((st,i)=>(
                    <tr>
                        <td>{st.boardId}</td>
                        <td>{st.boardType}</td>
                        <td>{st.title}</td>
                        <td>{st.createdAt}</td>
                        <td>{st.views}</td>
                        <td>{st.creator}</td>
                    </tr>
                ))}
            </table>)

            setData(vv)
        })
    };

    return(
        <>
            {data}
        </>

    )

    // 검색 처리
    const handleSearch = () => {
        setKeyword(searchInput);
        setCurrentPage(1);
    };

    // 엔터키 검색
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 페이지 변경
    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
    };

    // 페이지 크기 변경
    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    // 게시물 상세 페이지로 이동
    const handleRowClick = (boardId) => {
        navigate(`/board/${sideId}/detail/${boardId}`);
    };

    // 글쓰기 페이지로 이동
    const handleWriteClick = () => {
        navigate(`/board/${sideId}/write`);
    };

    // 페이지 번호 생성 (1~5까지 표시)
    const getPageNumbers = () => {
        const blockSize = 5;
        const startPage = Math.floor((currentPage - 1) / blockSize) * blockSize + 1;
        const endPage = Math.min(startPage + blockSize - 1, totalPages);
        
        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (isLoading) {
        return <div className="loading">로딩 중...</div>;
    }

    return (
        <div className="board-container">
            <div className="board-header">
                <h1>{boardTitles[sideId] || '게시판'}</h1>
                
                {/* 검색 영역 */}
                <div className="search-area">
                    <input 
                        type="text"
                        placeholder="제목으로 검색"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleSearch}>검색</button>
                </div>
            </div>

            {/* 게시물 테이블 */}
            <table className="board-table">
                <thead>
                    <tr>
                        <th width="10%">번호</th>
                        <th width="15%">게시판유형</th>
                        <th width="35%">제목</th>
                        <th width="15%">작성자</th>
                        <th width="15%">등록일</th>
                        <th width="10%">조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {boards.length > 0 ? (
                        boards.map((board) => (
                            <tr 
                                key={board.boardId} 
                                onClick={() => handleRowClick(board.boardId)}
                                className={board.isTop ? 'top-notice' : ''}
                            >
                                <td>{board.isTop ? '공지' : board.boardId}</td>
                                <td className="title-cell">
                                    {board.isTop && <span className="badge-top">상단</span>}
                                    {board.title}
                                </td>
                                <td>{board.creator}</td>
                                <td>{new Date(board.createdAt).toLocaleDateString()}</td>
                                <td>{board.views}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="no-data">게시글이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 하단 컨트롤 */}
            <div className="board-footer">
                {/* 목록 개수 설정 */}
                <div className="page-size-selector">
                    <label>목록 보기: </label>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                        <option value={10}>10개씩</option>
                        <option value={20}>20개씩</option>
                        <option value={30}>30개씩</option>
                    </select>
                </div>

                {/* 페이지네이션 */}
                <div className="pagination">
                    {currentPage > 1 && (
                        <button onClick={() => handlePageChange(currentPage - 1)}>
                            이전
                        </button>
                    )}
                    
                    {getPageNumbers().map(pageNum => (
                        <button
                            key={pageNum}
                            className={currentPage === pageNum ? 'active' : ''}
                            onClick={() => handlePageChange(pageNum)}
                        >
                            {pageNum}
                        </button>
                    ))}
                    
                    {currentPage < totalPages && (
                        <button onClick={() => handlePageChange(currentPage + 1)}>
                            다음
                        </button>
                    )}
                </div>

                {/* 글쓰기 버튼 (권한에 따라 조건부 렌더링) */}
                {sideId !== 'my' && (
                    <button className="write-button" onClick={handleWriteClick}>
                        글쓰기
                    </button>
                )}
            </div>
        </div>
    );
}

export default BoardMain;