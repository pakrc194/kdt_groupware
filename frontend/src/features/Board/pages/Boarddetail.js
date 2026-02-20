import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {fetcher} from '../../../shared/api/fetcher';
import BoardModify from  './BoardModify';
import boardst from '../../Home/css/boardModify.css'

function BoardDetail(props) {
    const {sideId} = useParams();
    const navigate = useNavigate();
    
    const [board, setBoard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [files , setFiles] = useState([]);
    
    // 현재 사용자 정보 
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const loginUserSn = myInfo?.empSn;
    console.log("board 정보 확인 :",board)

    useEffect(() => {
        console.log('props.boardId', props.boardId)
        fetchBoardDetail();
        fetcher(`/board/selectFile/${props.boardId}`)
        .then(data => setFiles(data));
    }, []);

    const fetchBoardDetail = () => {
        setIsLoading(true);
        fetcher(`/board/detail/${props.boardId}?empSn=${loginUserSn}`)
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

    //작성자 본인 확인  사번으로 본인확인하여 게시글의 수정,삭제가 가능함
     const isOwner = board.creator === loginUserSn;



    return (
        <div className="board-detail-container">
            {/* 헤더 영역: 제목 및 메타정보 */}
            <div className="detail-header">
                <div className="title-section">
                    {(board.isTop === true || board.isTop === "true") && <span className="badge-top" style={{backgroundColor:'#e74c3c', color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'12px', marginRight:'10px', verticalAlign:'middle'}}>중요</span>}
                    <h1 className="ditailTitle" style={{display:'inline-block'}}>{board.title}</h1>
                </div>
                
                <div className="meta-info">
                    <div className="meta-left">
                        <span className="author">👤 작성자 <b>{myInfo.empNm}</b></span>
                        <span className="date">📅 작성일{new Date(board.createdAt).toLocaleString()}</span>
                        <span className="views">👁‍🗨 조회수 {board.views}</span>
                    </div>
                </div>

                {/* 첨부파일 영역 */}
                {files.length > 0 && (
                    <div className="file-section" style={{marginTop:'15px', padding:'10px', background:'#f1f3f5', borderRadius:'4px'}}>
                        <span style={{fontSize:'13px', fontWeight:'bold', marginRight:'10px'}}>첨부파일 ({files.length})</span>
                        {files.map(file => (
                            <a key={file.fileId} 
                               href={`http://192.168.0.36:8080/board/download/${file.fileId}`}
                               style={{marginRight:'15px', fontSize:'13px', color:'#007bff', textDecoration:'none'}}
                            >
                                📎 {file.originName}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* 본문 영역 */}
            <div className="detail-content" style={{padding:'30px 10px', minHeight:'400px'}}>
                <div dangerouslySetInnerHTML={{ __html: board.content }} />
            </div>

            {/* 하단 버튼 영역 */}
            <div className="button-group" style={{display:'flex', justifyContent:'center', gap:'10px', marginTop:'40px'}}>
                <button className="detail_button list" onClick={handleList} style={{backgroundColor:'#6c757d', color:'#fff', border:'none', padding:'10px 25px', borderRadius:'4px', cursor:'pointer'}}>
                    목록으로
                </button>
                
                {isOwner && (
                    <>
                        <button className="detail_button modify" onClick={() => props.goService('Modify')} style={{backgroundColor:'#007bff', color:'#fff', border:'none', padding:'10px 25px', borderRadius:'4px', cursor:'pointer'}}>
                            수정하기
                        </button>
                        <button className="detail_button delete" onClick={handleDelete} style={{backgroundColor:'#dc3545', color:'#fff', border:'none', padding:'10px 25px', borderRadius:'4px', cursor:'pointer'}}>
                            삭제하기
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default BoardDetail;