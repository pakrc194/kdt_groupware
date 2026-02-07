import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Pagination from './Pagination';
import { fetcher } from '../../../shared/api/fetcher';

function BoardList(props) {
    const { sideId } = useParams();
    const [boards, setBoards] = useState([]); // 데이터만 관리
    const [pInfo, setPInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);

    useEffect(() => {
        fetchBoards();
    }, [sideId, currentPage, pageSize]);

    const fetchBoards = () => {
        setIsLoading(true);
        fetcher(`/board/${sideId}?pNo=${currentPage}&pageSize=${pageSize}`)
            .then(dd => {
                // 핵심: 데이터와 페이지 정보만 상태에 저장합니다.
                setBoards(dd.boards || dd); 
                setPInfo(dd.pInfo);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("데이터 로드 실패", err);
                setIsLoading(false);
            });
    };

    const goDetail = (id) => {
        props.goBoardId(id);
        props.goService('detail');
    };

    // 로딩 중일 때 표시할 화면
    if (isLoading) return <div>데이터를 불러오는 중입니다...</div>;

    // 최종 결과물 (리액트 방식)
    return (
        <div className="board-list-container">
            {/* 1. 검색 영역 */}
            <div style={{ marginBottom: '10px' }}>
                <input type='text' placeholder="검색어를 입력하세요" />
                <button>검색</button>
            </div>

            {/* 2. 테이블 영역 (thead, tbody를 사용해 에러 원천 차단) */}
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th>문서번호</th>
                        <th>제목</th>
                        <th>작성일</th>
                        <th>조회수</th>
                        <th>작성자</th>
                    </tr>
                </thead>
                <tbody>
                    {boards && boards.length > 0 ? (
                        boards.map((st) => (
                            <tr key={st.boardId}>
                                <td>{st.boardId}</td>
                                <td 
                                    onClick={() => goDetail(st.boardId)} 
                                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                >
                                    {st.title}
                                </td>
                                <td>{st.createdAt}</td>
                                <td>{st.views}</td>
                                <td>{st.creator}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                게시글이 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 3. 하단 컨트롤 영역 */}
            <div style={{ marginTop: '10px' }}>
                <button onClick={() => props.goService('Insert')}>글쓰기</button>
            </div>

            {pInfo && (
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <Pagination pInfo={pInfo} onPageChange={setCurrentPage} />
                </div>
            )}
        </div>
    );
}

export default BoardList;