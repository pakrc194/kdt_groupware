import React from "react";
import boardst from '../../Home/css/Board.module.css';

function Pagination({pInfo, onPageChange}) {

    if(!pInfo){
        return null;
    }
    
    const {
        start,
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
        <div className={boardst.paginationContainer}>
            <nav className={boardst.paginationNav}>
                {/* 처음으로 버튼 (선택사항) */}
                <button onClick={() => onPageChange(1)} disabled={curPage === 1} className={boardst.pageBtn}>
                    «
                </button>

                {/* 이전 버튼 */}
                <button 
                    onClick={() => prevBut && onPageChange(startPage - 1)} 
                    disabled={!prevBut} 
                    className={boardst.pageBtn}
                >
                    ‹
                </button>

                {/* 페이지 번호 */}
                {pageNums.map((num) => (
                    <button
                        key={num}
                        onClick={() => onPageChange(num)}
                        className={`${boardst.pageBtn} ${curPage === num ? boardst.active : ""}`}
                    >
                        {num}
                    </button>
                ))}

                {/* 다음 버튼 */}
                <button 
                    onClick={() => nextBut && onPageChange(endPage + 1)} 
                    disabled={!nextBut} 
                    className={boardst.pageBtn}
                >
                    ›
                </button>

                {/* 마지막으로 버튼 (선택사항) */}
                <button onClick={() => onPageChange(totalPage)} disabled={curPage === totalPage} className={boardst.pageBtn}>
                    »
                </button>
            </nav>
        </div>
    );
        


}

export default Pagination;