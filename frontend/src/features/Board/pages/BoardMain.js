import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import BoardList from './BoardList';
import Boarddetail from './Boarddetail';
import BoardWrite from './BoardInsert';
import BoardModify from './BoardModify';
// import './BoardMain.css';

function BoardMain(props) {

    const [service, setService] = useState('list')
    const [boardId, setBoardId] = useState(2)

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