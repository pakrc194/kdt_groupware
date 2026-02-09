import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {fetcher} from '../../../shared/api/fetcher';
import BoardModify from  './BoardModify';

function BoardDetail(props) {
    const {sideId} = useParams();
    const navigate = useNavigate();
    
    const [board, setBoard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [files , setFiles] = useState([]);
    
    // 현재 사용자 정보 
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const loginUserSn = myInfo?.empSn;

    useEffect(() => {
        console.log('props.boardId', props.boardId)
        fetchBoardDetail();
        fetcher(`/board/selectFile/${props.boardId}`)
        .then(data => setFiles(data));
    }, []);

    const fetchBoardDetail = () => {
        setIsLoading(true);
        fetcher(`/board/detail/${props.boardId}`)
            .then(data => {
                setBoard(data);
                setIsLoading(false);
                console.log("패치 data 받아옴")
            })
            .catch(err => {
                console.error("데이터 호출 에러:", err);
                setIsLoading(false);
            });
    };



    //게시물 삭제하는 함수
    const handleDelete = () => {
        if (window.confirm('삭제하시겠습니까?')) {
            fetcher(`/board/detail/${props.boardId}`, {
                method: 'DELETE'
            })
            .then(data => {
                if (data.success) {
                    alert('삭제되었습니다.');
                    handleList();
                } else {
                    alert('삭제 실패했습니다.');
                }
            })
            .catch(err => {
                console.error("삭제 에러:", err);
                alert('삭제 중 오류가 발생했습니다.');
            });
        }
    };


    // 선택 하면 BoardMain에서 list로 상태 값을 변화 시킨다
    const handleList = () => {
        if(props.goService){
            props.goService('list');
        }
        navigate(`/board/${sideId}`);
    };

    if (isLoading) {
        return <div className="loading">로딩 중...</div>;
    }

    if (!board) {
        return <div className="error">게시물을 찾을 수 없습니다.</div>;
    }


    const isOwner = String(board.creator) === String(loginUserSn);



    return (
        <div className="board-detail-container">
            <div className="detail-header">
                <div className="title-section">
                    {board.isTop && <span className="badge-top">상단공지</span>}
                    <h1>{board.title}</h1>
                </div>
                <div className="meta-info">
                    <span className="author">작성자: {board.empNm}</span>
                    <span className="date">
                        등록일: {new Date(board.createdAt).toLocaleString()}
                    </span>
                    <span className="views">조회수: {board.views}</span>
                    <span>첨부파일
                        {files.map(file=>(
                            <div key={file.fileId}>
                                <a href={`http://192.168.0.36:8080/board/download/${file.fileId}`}>{file.originName}</a>
                            </div>
                        ))}
                    </span>

                </div>
            </div>

            <div className="detail-content">
                <div dangerouslySetInnerHTML={{ __html: board.content }} />
            </div>



            <div className="detail-actions">
                <button onClick={handleList} >목록</button>
                <button onClick= {handleDelete}>삭제</button>
                 <button onClick={() => props.goService('Modify')}>수정</button> 
            
            </div>


           



        </div>
    );
}

export default BoardDetail;