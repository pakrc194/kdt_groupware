import React, { useEffect,useState } from "react";
import { fetcher } from "../../../shared/api/fetcher";

function BoardModify(props){
    const [title, setTitle] = useState('');
    const [content,setContent] = useState('');
    const [newFiles, setNewFiles] = useState([]);


    useEffect(() => {
        console.log("수정할 게시글 ID :", props.boardId);
             fetcher(`/board/detail/${props.boardId}`)
             .then(data => {
                setTitle(data.title || '');
                setContent(data.content || '');
             })
        }, []);


    const ModifyBut = () => {
        const formData = new FormData();
        const mobifyBoard ={
            title: title,
            content: content,
            boardId: props.boardId
        }
        console.log("수정 데이터 확인",'ModifyBut')

        formData.append("board",new Blob([JSON.stringify(mobifyBoard)], { type: "application/json" }))
        newFiles.forEach(file=>formData.append("file",file));

        fetcher(`/board/detail/updateWithFile`,{
            method: 'POST',
            body:  formData
            
        })
        .then(data=>{
            if(data.success) {
                alert('수정되었습니다');
                props.goService('detail');
            }else{
                alert('수정 할 수 없습니다');
            }
        })

    }    
        return(
            <>
                <h1>게시글 수정</h1>
                <div>제목
                    <input type="text" value={title || ''} onChange={(e)=>setTitle(e.target.value)}/>
                </div>
                <div>내용
                    <textarea type="text" value={content || ''} onChange={(e)=>setContent(e.target.value)}/>
                </div>

                <div>
                    <label>파일수정</label>
                    <input type="file" multiple onChange={(e) => setNewFiles(Array.from(e.target.files))}/>
                </div>
            

                <button onClick={ModifyBut}>수정완료</button>
                <button onClick={()=>props.goService('detail')}>취소</button>
            </>
        );

}


export default BoardModify;