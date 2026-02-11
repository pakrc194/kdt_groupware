import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Pagination from './Pagination';
import { fetcher } from '../../../shared/api/fetcher';
import boardst from '../../Home/css/Board.module.css'

function BoardList(props) { //({goBoardId, goBoardId}) props.goBoardId
    const {sideId} = useParams();
    const [boards, setBoards] = useState([]); // 데이터만 관리
    const [pInfo, setPInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // 검색 상태
    const [searchInput , setSearchInput] = useState('');
    const [keyword , setKeyword] = useState('');
    const [searchType , setSearchType] = useState('title');

    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const empSn = myInfo?.empSn;


    useEffect(() => {
        
        fetchBoards();
    }, [sideId, currentPage, pageSize,keyword]);

    useEffect(()=>{
         setCurrentPage(1);
    },[sideId])


    /*** 날짜 포맷팅 함수
     * @param {string} dateString : '2026-02-09T15:00:00.000Z'
     * @returns {string} : '2026-02-09 15:00'*/
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        
        const date = new Date(dateString);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };


    const fetchBoards = () => {
        setIsLoading(true);
        fetcher(`/board/${sideId}?pNo=${currentPage}&pageSize=${pageSize}&keyword=${keyword}&searchType=${searchType}&empSn=${empSn}`)
            /// `/board/MyPosts/${empSn}?pNo=${currentPage}&pageSize=10`
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

    const pageSizeChange = (e) =>{
        setPageSize(Number(e.target.value));
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


                <select  className ={boardst['selectBox']} value={pageSize} onChange={pageSizeChange}>
                    <option value="5"> 5개</option>
                    <option value="10"> 10개</option>
                    <option value="20"> 20개</option>
                    <option value="30"> 30개</option>
                </select>

                <select className ={boardst['selectBox']}
                    value={searchType}
                    onChange={(e)=>setSearchType(e.target.value)}
                >
                    <option value="title">제목</option>
                    <option value="creator">작성자</option>
                    <option value="boardId">문서번호</option>
                </select>

                <input className ={boardst.input} type='text' placeholder="검색어를 입력하세요" value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}/>
                <button className ={boardst.button} onClick={handleSearch}>검색</button>
            </div>

            <table  className ={boardst.boardTable}>
                <thead>
                    <tr>
                        <th >문서번호</th>
                        <th>제목</th>
                        <th>작성일</th>
                        <th>조회수</th>
                        <th>작성자</th>
                    </tr>
                </thead>
                <tbody>
                    {boards && boards.length > 0 ? (
                        boards.map((st) => {
                            console.log("werew",st)
                            // 1. 조건을 아주 엄격하게 체크 (문자열 "true" 혹은 불리언 true일 때만)
                            const isTopItem = String(st.isTop) === "true";

                            // 2. 조건에 맞지 않으면 명시적으로 빈 문자열("")을 할당
                            const rowClass = isTopItem ? boardst.topNotice : "";

                            // 3. 디버깅용 로그
                            console.log(`ID: ${st.boardId}, 원본isTop: ${st.isTop}, 판별결과: ${isTopItem}, 클래스: ${rowClass}`);
                            return <tr key={st.boardId} className={rowClass}>

                                <td>{st.boardId}</td>
                                <td onClick={() => goDetail(st.boardId)} >{st.title}</td>
                                <td onClick={() => goDetail(st.boardId)}>{formatDate(st.createdAt)}</td>
                                <td>{st.views}</td>
                                <td>{st.empNm}</td>
                            </tr>
                        })
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
            <div className ={boardst.footerArea}>
                    {(sideId !== 'important' || myInfo?.deptName ==='지점장') && (
                        <button className ={boardst.button} onClick={() => props.goService('Insert')}>글쓰기</button>
                    )}
            </div>

            {pInfo && (
                <div className ={boardst.paginationContainer}>
                    <Pagination pInfo={pInfo} onPageChange={setCurrentPage} />
                </div>
            )}
        </div>
    );
}

export default BoardList;