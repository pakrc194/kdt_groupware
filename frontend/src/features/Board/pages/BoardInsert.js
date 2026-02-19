import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { fetcher } from '../../../shared/api/fetcher';
import boardst from '../../Home/css/Board.module.css';

function BoardInsert(props) {
    const { sideId } = useParams(); // URL에서 게시판 종류 가져오기
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [creator, setCreator] = useState('testUser'); // 실제론 로그인 정보 사용
    const [selectedFiles ,setSelectedFiles] = useState([]);
    const [isTop , setIsTop ] = useState(false);
  

    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const loginUserSn = myInfo?.empSn;

    //파일 용량,개수 제한
    const MAX_FILE_COUNT = 5; // 최대 5개
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 개별 파일 10MB 제한

    const FileUpload = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };    

    // 파일 선택 시 검증 로직
    const handleFileChange = (e) => {
        const filesFromInput = Array.from(e.target.files);

        // 1. 개수 제한 검사
        if (filesFromInput.length > MAX_FILE_COUNT) {
            alert(`파일은 최대 ${MAX_FILE_COUNT}개까지만 업로드 가능합니다.`);
            e.target.value = ""; // input 초기화
            setSelectedFiles([]); 
            return;
        }

        // 2. 개별 용량 제한 검사
        for (let file of filesFromInput) {
            if (file.size > MAX_FILE_SIZE) {
                alert(`파일("${file.name}")의 용량이 너무 큽니다. 10MB 이하만 가능합니다.`);
                e.target.value = "";
                setSelectedFiles([]);
                return;
            }
        }

        // formData.append("board", new Blob([JSON.stringify(boardData)], { type: "application/json" }));

        selectedFiles.forEach((file)=>{
            // formData.append("files",file);
        })
    }    

    const handleSubmit = (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        const formData = new FormData();

        const boardData = {
            title: title,
            content: content,
            empId : myInfo.empId,
            creator: loginUserSn,
            boardType: sideId, // 중요: 현재 게시판 유형 전달
            isTop: isTop  // 체크박스에 체크하면 '1' , 아니면 '0'
        };

   

        // 파일 업로드를 하는데 fetcher를 사용하면 에러가 나서 기본fetch를 사용하고 있습니다
        fetch(`http://192.168.0.36:8080/board/insertWithFile`, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('글이 등록되었습니다.');
                props.goService('list'); // 등록 후 목록으로 이동
            } else {
                alert('등록 할 수 없습니다.');
            }
        })
        .catch(err => {
            console.error("등록 에러:", err);
            alert('오류가 발생했습니다.');
        });
    };

    return (
        <div className="board-detail-container"> {/* 일관된 컨테이너 클래스 사용 */}
            <h2 style={{ fontSize: '24px', borderBottom: '2px solid #333', paddingBottom: '15px', marginBottom: '30px' }}>
                게시글 작성
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 제목 및 공지 설정 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <label style={{ width: '80px', fontWeight: 'bold' }}>제목</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        placeholder="제목을 입력해 주세요"
                        style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    {sideId === 'important' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: '#e74c3c' }}>
                            <input 
                                type='checkbox' 
                                id="topCheck"
                                checked={isTop} 
                                onChange={(e) => setIsTop(e.target.checked)} 
                            />
                            <label htmlFor="topCheck" style={{ fontWeight: 'bold', cursor: 'pointer' }}>중요 공지</label>
                        </div>
                    )}
                </div>

                {/* 파일 첨부 영역 */}
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>📂 파일 첨부</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            style={{ fontSize: '14px' }}
                        />
                        <span style={{ fontSize: '13px', color: '#666' }}>
                            선택된 파일: <b>{selectedFiles.length}</b>개
                        </span>
                    </div>
                    {selectedFiles.length > 0 && (
                        <ul style={{ marginTop: '10px', padding: '0', listStyle: 'none', fontSize: '13px', color: '#007bff' }}>
                            {selectedFiles.map((file, idx) => (
                                <li key={idx}>📎 {file.name}</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 본문 내용 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>내용</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        rows="15"
                        required 
                        placeholder="내용을 작성해 주세요"
                        style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px', resize: 'none', lineHeight: '1.6' }}
                    />
                </div>

                {/* 하단 버튼 그룹 */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                    <button 
                        type="submit"
                        className={boardst.writBtn}
                        style={{ margin: 0, width: '120px', height: '45px' }}
                    >
                        등록하기
                    </button>
                    <button 
                        type="button" 
                        onClick={() => {
                            if(window.confirm("작성 중인 글이 저장되지 않고 취소됩니다. 진행하시겠습니까?")){
                                props.goService('list');
                            }
                        }}
                        style={{ padding: '0 30px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', height: '45px' }}
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BoardInsert;