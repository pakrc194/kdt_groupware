import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import BoardList from './BoardList';
import Boarddetail from './Boarddetail';
import BoardWrite from './BoardInsert';
import BoardModify from './BoardModify';
import MyBoardList from './MyBoardList';
// import './BoardMain.css';

function BoardMain(props) {

    const { sideId } = useParams();
    const [searchParams] = useSearchParams();   // 쿼리스트링 받아옴

    //sideId가 바뀌는지 확인 하고 Service로 바꿔준다
    useEffect(() => {
        if(searchParams.get('id')){ // 쿼리스트링에 id가 있으면 해당 id 상세페이지로
            setBoardId(searchParams.get('id'))
            setService('detail')
        }else{
            console.log("사이드메뉴가 바꼇어",sideId)
            setService('list')
        }
    }, [sideId]);


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
            {service==='MyPosts' && <MyBoardList boardId={boardId} goService={setService}/>}
        </>
    )
}

export default BoardMain;