import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';

function AttendancePage(props) {
  const [myAtdcData, setMyAtdcData]= useState([{}])



  useEffect(()=>{
    const loadFetch = () => {
    fetcher('/gw/atdc/myAtdc').then(setMyAtdcData);

    }

    loadFetch();

  },[])

  return (
    <div>
      <h1>출퇴근 기록</h1>
      <table border={1}>
        <thead>
        <tr align='center'>
          <td>번호</td>
          <td>사원id</td>
          <td>근무일</td>
          <td>실제출근시간</td>
          <td>실제퇴근시간</td>
          <td>상태</td>
        </tr>
        </thead>
        <tbody>
      {myAtdcData.map((v,i)=>(
        <tr align='center' key={i}>
          <td> {v.attendanceId}</td>
          <td> {v.empId}</td>
          <td> {v.workDate}</td>
          <td> {v.actualClockIn}</td>
          <td> {v.actualClockOut}</td>
          <td> {v.status}</td>
        </tr>
      ))}
      </tbody>
      </table>
    </div>
  );
}

export default AttendancePage;