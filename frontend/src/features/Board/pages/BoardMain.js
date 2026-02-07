import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import BoardList from './BoardList';
import Boarddetail from './Boarddetail';
import BoardWrite from './BoardInsert';
import BoardModify from './BoardModify';
// import './BoardMain.css';

function BoardMain(props) {

    const { sideId } = useParams();

    //sideId가 바뀌는지 확인 하고 Service로 바꿔준다
    useEffect(() => {
           console.log("사이드메뉴가 바꼇어",sideId)
           setService('list')
       }, [sideId]);
   

    const [service, setService] = useState('list')
    const [boardId, setBoardId] = useState(2)

    useEffect(()=>{
        localStorage.setItem("EMP_ID","19")
        localStorage.setItem("EMP_NM","이계훈")
        localStorage.setItem("DEPT_ID","8")
    },[])

    return (
        <>
            {service==='list' && <BoardList goBoardId={setBoardId} goService={setService}/>}
            {service==='detail' && <Boarddetail goBoardId={setBoardId}  boardId={boardId} goService={setService}/>}
            {service==='Insert' && <BoardWrite goService={setService}/>}
            {service==='Modify' && <BoardModify boardId={boardId} goService={setService}/>}
        </>
    )
}

export default BoardMain;