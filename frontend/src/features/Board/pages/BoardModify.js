import React, { useEffect,useState } from "react";
import { fetcher } from "../../../shared/api/fetcher";

function BoardModify(props){
    const [title, setTitle] = useState('');
    const [content,setContent] = useState('');


    useEffect(() => {
        console.log("수정할 게시글 ID :", props.boardId);
             fetcher(`/board/detail/${props.boardId}`)
             .then(data => {
                setTitle(data.title || '');
                setContent(data.content || '');
             })
        }, []);


    const ModifyBut = () => {
        const mobifyBoard ={
            title: title,
            content: content
        }
        console.log("수정 데이터 확인",'ModifyBut')

        fetcher(`/board/detail/${props.boardId}`,{
            method: 'PUT',
            body:  mobifyBoard
            
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
            

                <button onClick={ModifyBut}>수정완료</button>
                <button onClick={()=>props.goService('detail')}>취소</button>
            </>
        );

}


export default BoardModify;