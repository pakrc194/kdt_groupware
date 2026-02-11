import React from 'react';

function PersonnelChangeStats({ inOut, changeEmpData }) {
  return (
    <>
      <h2>인사 변동 통계</h2>

      <h3>입사</h3>
      <table>
        <tr>
            <td style={{width:"150px"}}>이름</td>
            <td style={{width:"150px"}}>팀</td>
            <td style={{width:"150px"}}>직책</td>
            <td style={{width:"150px"}}>입사날짜</td>
        </tr>
        {inOut.sort((a, b) => new Date(a.empJncmpYmd) - new Date(b.empJncmpYmd))
        .map(data => (
            <tr key={data.empId}>
                <td>{data.empNm}</td>
                <td>{data.deptName}</td>
                <td>{data.jbttlNm}</td>
                <td>{data.empJncmpYmd.split(" ")[0]}</td>
            </tr>
        ))}
      </table>

      <h3>퇴사</h3>
      <table>
        <tr>
          <td style={{width:"150px"}}>이름</td>
          <td style={{width:"150px"}}>팀</td>
          <td style={{width:"150px"}}>직책</td>
          <td style={{width:"150px"}}>퇴사날짜</td>
        </tr>
        {inOut.filter(dd => dd.empRsgntnYmd != null).sort((a, b) => new Date(a.empJncmpYmd) - new Date(b.empJncmpYmd))
        .map(data => (
          <tr key={data.deptId}>
            <td>{data.empNm}</td>
            <td>{data.deptName}</td>
            <td>{data.jbttlNm}</td>
            <td>{data.empRsgntnYmd.split(" ")[0]}</td>
          </tr>
        ))}
      </table>

      <h3>직책 변경</h3>
      <table>
          <tr>
              <td style={{width:"150px"}}>이름</td>
              <td style={{width:"150px"}}>팀</td>
              <td style={{width:"150px"}}>변경 전 직책</td>
              <td style={{width:"150px"}}>변경 후 직책</td>
              <td style={{width:"150px"}}>변경날짜</td>
          </tr>
          {changeEmpData.filter(dd => dd.beforeJbttlId != dd.afterJbttlId).sort((a, b) => new Date(a.changeDate) - new Date(b.changeDate))
          .map(data => (
              <tr key={data.historyId}>
                  <td>{data.histEmpNm}</td>
                  <td>{data.bDeptName}</td>
                  <td>{data.aJbttlNm}</td>
                  <td>{data.bJbttlNm}</td>
                  <td>{data.changeDate.split(" ")[0]}</td>
              </tr>
          ))}
      </table>
      <h3>팀 이동</h3>
      <table>
          <tr>
              <td style={{width:"150px"}}>이름</td>
              <td style={{width:"150px"}}>변경 전 팀</td>
              <td style={{width:"150px"}}>변경 후 팀</td>
              <td style={{width:"150px"}}>직책</td>
              <td style={{width:"150px"}}>변경날짜</td>
          </tr>
          {changeEmpData.filter(dd => dd.beforeDeptId != dd.afterDeptId).sort((a, b) => new Date(a.changeDate) - new Date(b.changeDate))
          .map(data => (
              <tr key={data.historyId}>
                  <td>{data.histEmpNm}</td>
                  <td>{data.bDeptName}</td>
                  <td>{data.aDeptName}</td>
                  <td>{data.aJbttlNm}</td>
                  <td>{data.changeDate.split(" ")[0]}</td>
              </tr>
          ))}
      </table>
      <h3>이름 변경</h3>
      <table>
          <tr>
              <td style={{width:"150px"}}>이름</td>
              <td style={{width:"150px"}}>변경 후 이름</td>
              <td style={{width:"150px"}}>팀</td>
              <td style={{width:"150px"}}>직책</td>
              <td style={{width:"150px"}}>변경날짜</td>
          </tr>
          {changeEmpData.filter(dd => dd.beforeNm != dd.afterNm).sort((a, b) => new Date(a.changeDate) - new Date(b.changeDate))
          .map(data => (
              <tr key={data.historyId}>
                  <td>{data.histEmpNm}</td>
                  <td>{data.afterNm}</td>
                  <td>{data.bDeptName}</td>
                  <td>{data.aJbttlNm}</td>
                  <td>{data.changeDate.split(" ")[0]}</td>
              </tr>
          ))}
      </table>
    </>
  );
}

export default PersonnelChangeStats;