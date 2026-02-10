import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import BoardList from './BoardList';
import Boarddetail from './Boarddetail';
import BoardWrite from './BoardInsert';
import BoardModify from './BoardModify';
import MyBoardList from './MyBoardList';
// import './BoardMain.css';

function BoardMain(props) {

    const { sideId } = useParams();

    //sideId가 바뀌는지 확인 하고 Service로 바꿔준다
    useEffect(() => {
           console.log("사이드메뉴가 바꼇어",sideId)

           setService('list');

        //    if (sideId === 'MyPosts') {
        //     setService('MyPosts');
        // } else {
        //     setService('list');
        // }
       }, [sideId]);
   
    //      변수   , setter함수      변화시키는 값
    const [service, setService] = useState('list')
    const [boardId, setBoardId] = useState(2)

    useEffect(()=>{
    },[])

    return (
        <>
            {service==='list' && <BoardList goBoardId={setBoardId} goService={setService}/>}
            {service==='detail' && <Boarddetail goBoardId={setBoardId}  boardId={boardId} goService={setService}/>}
            {service==='Insert' && <BoardWrite goService={setService}/>}
            {service==='Modify' && <BoardModify boardId={boardId} goService={setService}/>}
            {/* {service === 'MyPosts' && <MyBoardList goBoardId={setBoardId} goService={setService}/>} */}
        </>
    )
}

export default BoardMain;