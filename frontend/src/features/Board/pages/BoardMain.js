import React, {useEffect,useState} from 'react';
import{ useParams} from "react-router-dom";


function BoardMain(props) {

    const {sideId} = useParams();
    const [boards, setBoards] = useState([]);

    useEffect(()=>{
        console.log(sideId)

        fetch(`http://192.168.0.36:8080/board/${sideId}?pNo=1`)
        .then(res => res.json())
        .then(data => setBoards(data))
    },[sideId]);



    return (
        <div>
            <h1>중요공지 게시판</h1>

            <ul>
                {boards.map(board=>(
                    <li key={board.boardId}>{board.title}</li>
                ))}   
            </ul>
        </div>
    );
}

export default BoardMain;