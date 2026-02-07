import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { fetcher } from '../../../shared/api/fetcher';

function BoardInsert(props) {
    const { sideId } = useParams(); // URL에서 게시판 종류 가져오기
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [creator, setCreator] = useState('testUser'); // 실제론 로그인 정보 사용
    const [selectedFiles ,setSelectedFiles] = useState([]);



    const FileUpload = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };    

    const handleSubmit = (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        const formData = new FormData();

        const boardData = {
            title: title,
            content: content,
            creator: creator,
            boardType: sideId // 중요: 현재 게시판 유형 전달
        };

        formData.append("board", new Blob([JSON.stringify(boardData)], { type: "application/json" }));

        selectedFiles.forEach((file)=>{
            formData.append("files",file);
        })


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
        <>
            <h2>게시글 작성</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>제목</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                     {sideId ==='important' && (<input type='checkbox'/>)} 
                </div>

                <div>
                    <label>파일첨부</label>
                    <input
                        type="file"
                        multiple
                        onChange={FileUpload}
                    />
                    <div>선택된 파일 {selectedFiles.length}</div>
                </div>



                <div className="form-group">
                    <label>내용</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        rows="10"
                        required 
                    />
                </div>
                <div className="Insert-actions">
                    <button type="submit">등록</button>
                    <button type="button" onClick={() => props.goService('list')}>취소</button>
                </div>
            </form>
        </>
    );
}

export default BoardInsert;