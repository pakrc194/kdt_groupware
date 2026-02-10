import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import BoardMain from '../../Board/pages/BoardMain copy';


function BorderDash (props){
    const [borderDash , setBorderDash ] = useState([]);
    const [boardPosts , setBoardPosts ];
    const [] = useState([]);

    useEffect(()=>{
        fetcher('/board/{sideId}')
        .then(dd=>{
            setBoardPosts (dd);
        })
    },[])




    return
    <>
        <h1>게시판 대시보드</h1>
        
        
    </>
        
}


export default BorderDash