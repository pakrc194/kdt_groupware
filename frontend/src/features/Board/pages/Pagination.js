import React from "react";

function Pagination({pInfo, onPageChange}) {

    if(!pInfo){
        return null;
    }


    const {
        curPage, 
        totalPage, 
        startPage, 
        endPage, 
        prevBut, 
        nextBut
    }  = pInfo; 


    const pageNums =[];
        for(let i = startPage; i<= endPage; i++){
            pageNums.push(i);
        }

    return(
    <>
        {prevBut && (<span  onClick ={()=>onPageChange(startPage-1)} >이전</span>)}

        {pageNums.map((num)=>(
            <span
                key={num}
                onClick={() => onPageChange(num)}
            >

                {curPage === num ? (
                    <b>[{num}]</b>
                ) : (
                    num
            )}
            </span>
        ))}

        {nextBut && (<span  onClick = {()=>onPageChange(endPage+1)} >다음</span>)}
    </>    
    );    
        


}

export default Pagination;