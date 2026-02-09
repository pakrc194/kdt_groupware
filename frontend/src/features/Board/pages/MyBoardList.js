import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Pagination from './Pagination';
import { fetcher } from '../../../shared/api/fetcher';



function MyBoardList(props) {
    const { sideId } = useParams();
    const [boards, setBoards] = useState([]); // 데이터만 관리
    const [pInfo, setPInfo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);


    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const empSn = myInfo?.empSn;


    useEffect(()=>{
        if(empSn) fetchMyBoards();
    },[currentPage,empSn]);

    const fetchMyBoards = () => {
        setIsLoading(true);
        fetcher(`board/MyPosts/${empSn}?pNo=${currentPage}&pageSize=10`)
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


    return(
        <>
            <h2>내가 작성한 글 목록</h2>
            <table>
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
                                <td><span>{b.boardType}</span></td>
                                <td 
                                    onClick={() => {
                                        props.goBoardId(b.boardId);
                                        props.goService('detail');
                                    }}
                                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                >
                                    {b.title}
                                </td>
                                <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                                <td>{b.views}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4">작성한 게시글이 없습니다.</td></tr>
                    )}
                </tbody>
            </table>

            {pInfo && (
                <div>
                    <Pagination pInfo={pInfo} onPageChange={setCurrentPage} />
                </div>
            )}
        </>
    );

}   


export default MyBoardList;