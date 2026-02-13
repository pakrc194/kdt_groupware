import React from 'react';

function ScheduleDeletionHistory({deleteSchedLog}) {
    return (
        <div>
            <h2>일정 삭제 기록</h2>
                
                <table>
                    <thead>
                        <tr>
                            <td style={{width:"100px"}}>타입</td>
                            <td style={{width:"100px"}}>이름</td>
                            <td style={{width:"100px"}}>상세</td>
                            <td style={{width:"100px"}}>시작일</td>
                            <td style={{width:"100px"}}>종료일</td>
                            <td style={{width:"100px"}}>삭제일</td>
                            <td style={{width:"100px"}}>담당자</td>
                            <td style={{width:"100px"}}>담당팀</td>
                            <td style={{width:"100px"}}>장소</td>
                        </tr>
                    </thead>
                    <tbody>
                        {deleteSchedLog.map(data => (
                            <tr>
                                <td>{data.schedType == "COMPANY" ? "회사" : data.schedType == "DEPT" ? "팀" : "개인"}</td>
                                <td>{data.schedTitle}</td>
                                <td>{data.schedDetail}</td>
                                <td>{data.schedStartDate?.split(" ")[0]}</td>
                                <td>{data.schedEndDate?.split(" ")[0]}</td>
                                <td>{data.schedDeleteDate?.split(" ")[0]}</td>
                                <td>{data.schedEmpNm}</td>
                                <td>{data.schedDeptNm}</td>
                                <td>{data.schedLocNm}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
}

export default ScheduleDeletionHistory;