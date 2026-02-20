import React, { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import boardst from '../../Home/css/Board.module.css';

function BoardModify(props){
    const { sideId } = useParams();
    const [title, setTitle] = useState('');
    const [content,setContent] = useState('');
    const [newFiles, setNewFiles] = useState([]);
    const [oldFiles, setOldFiles] = useState([]);
    const [isTop , setIsTop ] = useState(false);
    const [deletedFileIds, setDeletedFileIds] = useState([]);//삭제할 ID 저장

    // 1. 사원 정보 가져오기 (에러 방지를 위해 필수)
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const empSn = myInfo?.empSn;

    //파일 용량,개수 제한
    const MAX_FILE_COUNT = 5; // 최대 5개
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 개별 파일 10MB 제한



    useEffect(() => {
        console.log("수정할 게시글 ID :", props.boardId);
             fetcher(`/board/detail/${props.boardId}?empSn=${empSn}`)
             .then(data => {
                setTitle(data.title || '');
                setContent(data.content || '');
                setIsTop(String(data.isTop) === "true");
             })

            fetcher(`/board/selectFile/${props.boardId}`)
            .then(data=>{
                setOldFiles(data || []);
            })
        }, []);

    const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);    

    // 1. 개수 제한 검사 (기존 파일 + 새 파일)
    const totalCount = oldFiles.length + selectedFiles.length;
    if (totalCount > MAX_FILE_COUNT) {
        alert(`파일은 최대 ${MAX_FILE_COUNT}개까지만 업로드 가능합니다.`);
        e.target.value = ""; // 선택 초기화
        return;
    }

    // 2. 개별 용량 제한 검사
    for (let file of selectedFiles) {
        if (file.size > MAX_FILE_SIZE) {
            alert(`파일("${file.name}")의 용량이 너무 큽니다. 10MB 이하만 가능합니다.`);
            e.target.value = "";
            return;
        }
    }

    setNewFiles(selectedFiles);
};


    const deletedFile =(fileId)=>{
        if (window.confirm("파일을 삭제 하시겠습니까?")){
            fetch(`http://192.168.0.36:8080/board/deletedFile/${fileId}`,{
                method : 'DELETE'
                })
                .then(res => res.json())
                .then(data => {
                if (data.success) {
                    alert("파일이 삭제되었습니다.");
                    setOldFiles(oldFiles.filter(f=>f.fileId !== fileId));
                }
            });

        }
    }    

    // 파일 삭제 버튼 클릭 시 (DB 통신 없이 UI와 메모리만 업데이트)
    const handleFileDeleteClick = (fileId) => {
        if (window.confirm("파일을 삭제하시겠습니까?")) {
            // 1. 화면 목록에서 제거 (사용자에게 삭제된 것처럼 보여줌)
            setOldFiles(oldFiles.filter(f => f.fileId !== fileId));
            
            // 2. 삭제할 ID를 바구니에 담기
            setDeletedFileIds(prev => [...prev, fileId]);
        }
    };


    const ModifyBut = () => {
        const formData = new FormData();
        const mobifyBoard ={
            title: title,
            content: content,
            isTop: isTop,
            boardId: props.boardId,
            deletedFileIds: deletedFileIds
        }
        console.log("수정 데이터 확인",'ModifyBut')

        formData.append("board",new Blob([JSON.stringify(mobifyBoard)], { type: "application/json" }))
        newFiles.forEach(file=>formData.append("files",file));

        fetch(`http://192.168.0.36:8080/board/updateWithFile`,{
            method: 'POST',
            body:  formData
            
        })
        .then(res => res.json())
        .then(data=>{
            if(data.success) {
                alert('수정되었습니다');
                props.goService('detail');
            }else{
                alert('수정 할 수 없습니다');
            }
        })

    }    

        return (
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff' }}>
            <h2 style={{ fontSize: '24px', borderBottom: '2px solid #333', paddingBottom: '15px', marginBottom: '30px' }}>
                📝 게시글 수정
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 제목 섹션 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <label style={{ width: '80px', fontWeight: 'bold' }}>제목</label>
                    <input 
                        type="text" 
                        value={title || ''} 
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        placeholder="제목을 입력하세요"
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

                {/* 내용 섹션 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>내용</label>
                    <textarea 
                        value={content || ''} 
                        onChange={(e) => setContent(e.target.value)}
                        style={{ height: '350px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', resize: 'none', lineHeight: '1.6' }}
                    />
                </div>

                {/* 파일 관리 섹션 */}
                <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>📂 기존 첨부파일</label>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {oldFiles.length > 0 ? oldFiles.map(file => (
                                <li key={file.fileId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#fff', border: '1px solid #eee', marginBottom: '5px', borderRadius: '4px' }}>
                                    <span style={{ fontSize: '14px' }}>{file.originName}</span>
                                    <button 
                                        onClick={() => handleFileDeleteClick(file.fileId)}
                                        style={{ padding: '2px 8px', backgroundColor: '#ffeded', color: '#e74c3c', border: '1px solid #ffcfcf', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        삭제
                                    </button>
                                </li>
                            )) : <span style={{ color: '#999', fontSize: '14px' }}>첨부된 파일이 없습니다.</span>}
                        </ul>
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>➕ 새 파일 추가</label>
                        <input 
                            type="file" 
                            multiple 
                            onChange={handleFileChange}
                            style={{ fontSize: '14px' }}
                        />
                    </div>
                </div>

                {/* 하단 버튼 그룹 */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                    <button 
                        onClick={ModifyBut}
                        style={{ padding: '12px 30px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        수정 완료
                    </button>
                    <button 
                        onClick={() => props.goService('detail')}
                        style={{ padding: '12px 30px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );

}


export default BoardModify;