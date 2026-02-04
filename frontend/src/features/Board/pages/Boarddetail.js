import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './BoardDetail.css';

function BoardDetail() {
    const { sideId, boardId } = useParams();
    const navigate = useNavigate();
    
    const [board, setBoard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // 현재 사용자 정보 (실제로는 인증 컨텍스트에서 가져와야 함)
    const currentUser = 'testUser'; // 임시

    useEffect(() => {
        fetchBoardDetail();
    }, [boardId]);

    const fetchBoardDetail = () => {
        setIsLoading(true);
        fetch(`http://192.168.0.36:8080/board/detail/${boardId}`)
            .then(res => res.json())
            .then(data => {
                setBoard(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("데이터 호출 에러:", err);
                setIsLoading(false);
            });
    };

    const handleDelete = () => {
        if (window.confirm('삭제하시겠습니까?')) {
            fetch(`http://192.168.0.36:8080/board/detail/${boardId}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('삭제되었습니다.');
                    navigate(`/board/${sideId}`);
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

    const handleEdit = () => {
        navigate(`/board/${sideId}/edit/${boardId}`);
    };

    const handleList = () => {
        navigate(`/board/${sideId}`);
    };

    if (isLoading) {
        return <div className="loading">로딩 중...</div>;
    }

    if (!board) {
        return <div className="error">게시물을 찾을 수 없습니다.</div>;
    }

    // 작성자와 현재 사용자가 같은지 확인 (수정/삭제 버튼 표시용)
    const isOwner = board.creator === currentUser;
    // 중요 게시판은 지점장만 삭제 가능
    const canDelete = sideId === 'important' ? currentUser === '지점장' : isOwner;

    return (
        <div className="board-detail-container">
            <div className="detail-header">
                <div className="title-section">
                    {board.isTop && <span className="badge-top">상단공지</span>}
                    <h1>{board.title}</h1>
                </div>
                <div className="meta-info">
                    <span className="author">작성자: {board.creator}</span>
                    <span className="date">
                        등록일: {new Date(board.createdAt).toLocaleString()}
                    </span>
                    <span className="views">조회수: {board.views}</span>
                </div>
            </div>

            <div className="detail-content">
                <div dangerouslySetInnerHTML={{ __html: board.content }} />
            </div>

            {/* 첨부파일 영역 (향후 구현) */}
            {/* <div className="attachments">
                <h3>첨부파일</h3>
                <ul>
                    <li><a href="#">파일명.pdf</a></li>
                </ul>
            </div> */}

            <div className="detail-actions">
                <button className="btn-list" onClick={handleList}>
                    목록
                </button>
                
                <div className="action-buttons">
                    {(isOwner && sideId !== 'important') && (
                        <button className="btn-edit" onClick={handleEdit}>
                            수정
                        </button>
                    )}
                    {canDelete && (
                        <button className="btn-delete" onClick={handleDelete}>
                            삭제
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BoardDetail;