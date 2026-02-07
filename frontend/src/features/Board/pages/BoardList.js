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

    // 검색 상태
    const [searchInput , setSearchInput] = useState('');
    const [keyword , setKeyword] = useState('');
    const [searchType , setSearchType] = useState('title');

    useEffect(() => {
        fetchBoards();
    }, [sideId, currentPage, pageSize,keyword]);

    const fetchBoards = () => {
        setIsLoading(true);
        fetcher(`/board/${sideId}?pNo=${currentPage}&pageSize=${pageSize}&keyword=${keyword}&searchType=${searchType}`)
            .then(dd => {  // 데이터와 페이지 정보만 상태에 저장
                setBoards(dd.boards || dd); 
                setPInfo(dd.pInfo);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("데이터 로드 실패", err);
                setIsLoading(false);
            });
    };


    const handleSearch = () => {
        setKeyword(searchInput);
        setCurrentPage(1);
    };




    const goDetail = (id) => {
        props.goBoardId(id);
        props.goService('detail');
    };


    if (isLoading) return <div>데이터를 불러오는 중입니다...</div>;


    return (
        <div className="board-list-container">
            <div >
                <select
                    value={searchType}
                    onChange={(e)=>setSearchType(e.target.value)}
                >
                    <option value="title">제목</option>
                    <option value="creator">작성자</option>
                    <option value="boardId">문서번호</option>
                </select>

                <input type='text' placeholder="검색어를 입력하세요" value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}/>
                <button onClick={handleSearch}>검색</button>
            </div>

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