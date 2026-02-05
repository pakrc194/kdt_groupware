import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";

function BoardDetail(props) {
    const {sideId} = useParams();
    const navigate = useNavigate();
    
    const [board, setBoard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // 현재 사용자 정보 (실제로는 인증 컨텍스트에서 가져와야 함)
    const currentUser = 'testUser'; // 임시

    useEffect(() => {

        console.log('props.boardId', props.boardId)
        fetchBoardDetail();
    }, []);

    const fetchBoardDetail = () => {
        setIsLoading(true);
        fetch(`http://192.168.0.36:8080/board/detail/${props.boardId}`)
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
            fetch(`http://192.168.0.36:8080/board/detail/${props.boardId}`, {
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
        navigate(`/board/${sideId}/edit/${props.boardId}`);
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


            <div className="detail-actions">
                <button onClick={handleList} >목록</button>
            
            </div>
        </div>
    );
}

export default BoardDetail;