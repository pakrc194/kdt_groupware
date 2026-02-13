import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import BoardMain from '../../Board/pages/BoardList';
import BoardList from '../../Board/pages/BoardList';


function BoardDash (props){
    
    
    const [borderDash , setBorderDash ] = useState([]);
    const [borders , setBorders ] = useState([]);
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
    const [boardPosts, setBoardPosts] = useState([]);
    const empSn = myInfo?.empSn;

    //날짜 포맷팅
    const date = new Date;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const formatted = `${yyyy}-${mm}-${dd}`;



    useEffect(()=>{
        fetcher(`/board/public?pNo=1&pageSize=5&empSn=${empSn}`)
        .then(dd=>{
            setBoardPosts(dd.borders);
        })
    },[])


    return(
        <>
            <h1>게시판 대시보드</h1>
            <BoardList  props= {props} />

        
        </>
    );      
}


export default BoardDash