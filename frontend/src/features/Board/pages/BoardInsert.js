import React, {useEffect,useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { fetcher } from '../../../shared/api/fetcher';
import boardst from '../../Home/css/Board.module.css';
import { getBoardMap } from '../../../shared/func/formatLabel';

function BoardInsert(props) {
    const { sideId } = useParams(); // URL에서 게시판 종류 가져오기
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isTop, setIsTop] = useState(false);

    // 로그인 정보 가져오기
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const loginUserSn = myInfo?.empSn;

    // 파일 용량, 개수 제한 설정
    const MAX_FILE_COUNT = 5; // 최대 5개
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 개별 파일 10MB 제한

    const FileUpload = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };    

    const navigate = useNavigate();

    useEffect(() => {
        setTitle('');
        setContent('');
        setSelectedFiles([]);
        setIsTop(false);

        
        
    }, [sideId]); 

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

        // ⭐ 핵심: 검증을 통과한 파일들을 상태에 저장합니다.
        setSelectedFiles(filesFromInput);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        const formData = new FormData();

        // 게시글 정보 DTO 구성
        const boardData = {
            title: title,
            content: content,
            empId: myInfo?.empId,
            creator: loginUserSn,
            boardType: sideId, 
            isTop: isTop ? "true" : "false" // 서버 DB 타입에 맞춰 문자열 혹은 boolean 전달
        };

        formData.append(
        "board", 
        new Blob([JSON.stringify(boardData)], { type: "application/json" })
    );

   
    // 2. 파일 데이터 추가 (이 부분이 누락되었습니다!)
    selectedFiles.forEach((file) => {
        formData.append("files", file); // 서버의 @RequestPart("files") 이름과 일치해야 함
    });



        // 파일 업로드를 하는데 fetcher를 사용하면 에러가 나서 기본fetch를 사용하고 있습니다
        fetch(`http://192.168.0.36:8080/board/insertWithFile`, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('글이 등록되었습니다.');
                props.goService('list'); 
            } else {
                alert('등록에 실패했습니다.');
            }
        })
        .catch(err => {
            console.error("등록 에러:", err);
            alert('서버와 통신 중 오류가 발생했습니다.');
        });
    };


   

    

    return (
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff' }}>
            <h2 style={{ fontSize: '24px', borderBottom: '2px solid #333', paddingBottom: '15px', marginBottom: '30px' }}>
                {getBoardMap(sideId)} 게시글 작성
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
                            선택된 파일: <b>{selectedFiles.length}</b> / {MAX_FILE_COUNT}
                        </span>
                    </div>
                    
                    {/* 선택된 파일 목록 미리보기 */}
                    {selectedFiles.length > 0 && (
                        <ul style={{ marginTop: '10px', padding: '10px', listStyle: 'none', fontSize: '13px', color: '#007bff', background: '#fff', borderRadius: '4px', border: '1px solid #e9ecef' }}>
                            {selectedFiles.map((file, idx) => (
                                <li key={idx} style={{marginBottom: '3px'}}>📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
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
                        style={{ margin: 0, width: '120px', height: '45px', cursor: 'pointer' }}
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