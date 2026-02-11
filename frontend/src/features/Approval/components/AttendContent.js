import React from 'react';

const AttendContent = ({attendList, dutyList, schedList, drftDate}) => {
    return (
        <div>
            {attendList.map((attend,k)=>(
                    <div key={k}>
                        <h4>{attend.baseYy} 연차 개수</h4>
                        {attend.remLv}/{attend.occrrLv}
                        <hr/>
                    </div>))}

            {dutyList?.length>0 && <div>
                {drftDate.docStart}~{drftDate.docEnd}<br/>
                {dutyList.map(v=>(
                    v.map((vv,kk)=>(
                        <div key={kk}>
                            {vv.empNm}/{vv.deptName}/{vv.dutyYmd}/{vv.wrkCd}
                        </div>
                    ))
                ))}
                <hr/>
            </div>}   
                
            {schedList?.length > 0 && <div>
                <h4>일정</h4>
                {schedList.map((v,k)=>(
                    <div key={k}>
                        {v.map((vv, kk)=>(
                            <div key={kk}>{vv.empNm}/{vv.schedTitle}/{vv.schedStartDate.substring(0, 10)}/{vv.schedEndDate.substring(0, 10)}/{vv.schedType}</div>
                        ))} 
                    </div>
                ))}
            </div>}
        </div>
    );
};

export default AttendContent;