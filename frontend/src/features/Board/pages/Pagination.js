import React from "react";

function Pagination({currentPage, totalPages, onPageChange}) {
    const pageNum = [];
    for (let i =1; i <= totalPages; i++) {
        pageNum.push(i);
    }

    return(
    <tr key="pagination-row">
            <td colSpan="8" align="center">
                {/* 이전 버튼 */}
                {currentPage > 1 && (
                    <span onClick={() => onPageChange(currentPage - 1)} >
                        [이전]
                    </span>
                )}

                {/* 페이지 번호들 */}
                {pageNum.map((i) => (
                    <span key={i}>
                        {currentPage === i ? (
                            <b>[{i}]</b>
                        ) : (
                            <span 
                                onClick={() => onPageChange(i)} 
                            >
                                {i}
                            </span>
                        )}
                    </span>
                ))}

                {/* 다음 버튼 */}
                {currentPage < totalPages && (
                    <span onClick={() => onPageChange(currentPage + 1)} >
                        [다음]
                    </span>
                )}
            </td>
        </tr>
    );
}

export default Pagination;