import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import BoardWrite from './BoardInsert';
import Pagination from './Pagination';
import {fetcher} from '../../../shared/api/fetcher';

function BoardList(props) {

    const { sideId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [boards, setBoards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pInfo, setPInfo] = useState(null);
   
    
    // 검색 및 설정
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pageSize, setPageSize] = useState(3);

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

        function goDetail(i){
            props.goBoardId(i)
            props.goService('detail')
        }


        
        fetcher(`/board/${sideId}?pNo=${currentPage}&pageSize=${pageSize}`)
        .then(
            dd =>{
                setBoards(data.boards);
                setPInfo(dd.pInfo);
                console.log(dd)

                 
                 let vv = (<table border="">
                <input type='text'></input>
                <button>검색</button>
                <tr>
                    <td>문서번호</td>
                    <td>유형</td>
                    <td>제목</td>
                    <td>작성일</td>
                    <td>조회수</td>
                    <td>작성자</td>
                </tr>
                {dd.boards.map((st,i)=>{
                    let detailUrl = `/board/boarddtail/${currentPage}`

                    return <tr>
                        <td>{st.boardId}</td>
                        <td>{st.boardType}</td>
                        <td onClick={()=>goDetail(`${st.boardId}`)}>  {st.title}   </td>
                        <td>{st.createdAt}</td>
                        <td>{st.views}</td>
                        <td>{st.creator}</td>
                    </tr>
            })}

            <button onClick={()=>props.goService('Insert')}>글쓰기</button>
              


                 <Pagination pInfo={dd.pInfo} onPageChange={setCurrentPage}/>
            </table>

        )
         setData(vv)
        }
        )

       
    };



    return (
        <div>
            {data}
        </div>
    );
}

export default BoardList;