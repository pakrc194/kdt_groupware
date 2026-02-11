import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Pagination from './Pagination';
import { fetcher } from '../../../shared/api/fetcher';
import boardst from '../../Home/css/Board.module.css';



function MyBoardList(props) {
    const { sideId } = useParams();
    const [boards, setBoards] = useState([]); // 데이터만 관리
    const [pInfo, setPInfo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('title');


    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const empSn = myInfo?.empSn;


    useEffect(()=>{
        if(empSn) fetchMyBoards();
    },[currentPage, empSn, keyword]);

    const fetchMyBoards = () => {
        setIsLoading(true);
        fetcher(`/board/MyPosts/${empSn}?pNo=${currentPage}&pageSize=10&keyword=${keyword}&searchType=${searchType}`)
        .then(data => {
            setBoards(data.boards || []);
            setPInfo(data.pInfo);
            setIsLoading(false);
        })
        .catch(err => {
            console.log("내가 쓴 글 없음",err);
            setIsLoading(false);
        });
    };

    const handleSearch = () => {
        setKeyword(searchInput);
        setCurrentPage(1); // 검색 시 1페이지로 이동
    };


    return (
        <div className="board-list-container">
            <h2>내가 작성한 글 목록</h2>

            {/* 검색 UI 영역 추가 */}
            <div style={{ marginBottom: '20px' }}>
                <select 
                    className={boardst['selectBox']}
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="title">제목</option>
                    <option value="boardId">문서번호</option>
                </select>
                <input 
                    className={boardst.input} 
                    type='text' 
                    placeholder="내 글에서 검색" 
                    value={searchInput} 
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button className={boardst.button} onClick={handleSearch}>검색</button>
            </div>

            <table className={boardst.boardTable}>
                <thead>
                    <tr>
                        <th>문서번호</th>
                        <th>게시판</th>
                        <th>제목</th>
                        <th>작성일</th>
                        <th>조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {boards.length > 0 ? (
                        boards.map((b) => (
                            <tr key={b.boardId}>
                                <td>{b.boardId}</td>
                                <td>{b.boardType}</td>
                                <td 
                                    style={{ cursor: 'pointer', color: 'blue' }}
                                    onClick={() => {
                                        props.goBoardId(b.boardId);
                                        props.goService('detail');
                                    }}
                                >
                                    {b.title}
                                </td>
                                <td>{b.createdAt?.split('T')[0]}</td>
                                <td>{b.views}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>검색 결과가 없거나 작성한 게시글이 없습니다.</td></tr>
                    )}
                </tbody>
            </table>

            {pInfo && (
                <div className={boardst.paginationContainer}>
                    <Pagination pInfo={pInfo} onPageChange={setCurrentPage} />
                </div>
            )}
        </div>
    );

}   


export default MyBoardList;