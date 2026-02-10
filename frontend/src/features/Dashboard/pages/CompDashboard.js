import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

function CompDashboard(props) {
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));   // 로그인 정보
    const [accessCk, setAccessCk] = useState(0);
    const [inOut, setInOut] = useState([]); // 입사, 퇴사 기록
    const [changeEmpData, setChangeEmpData] = useState([]);


    useEffect(() => {
        // 권한 확인용
        fetcher(`/gw/orgChart/access?id=${myInfo.jbttlId}&type=JBTTL&section=DASHBOARD&accessId=14`)
        .then(dd => {
          setAccessCk(dd)
          console.log(dd)
        })
        .catch(e => console.log(e))

        // 입사, 퇴사 정보
        fetcher(`/gw/dashboard/hrEmpList`)
        .then(dd => {
          setInOut(dd)
        })
        .catch(e => console.log(e))

        // 승진, 팀 이동 정보
        fetcher(`/gw/dashboard/hrHistList`)
        .then(dd => {
          setChangeEmpData(dd)
          console.log(dd)
        })
        .catch(e => console.log(e))

      }, [])


    // 회사 대시보드 열람 권한 (id = 14)
    if (accessCk != 1) {
        return (
        <div style={{
            maxWidth: '400px',
            margin: '100px auto',
            padding: '30px',
            border: '2px solid #dc3545',
            borderRadius: '8px',
            backgroundColor: '#fff0f0',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h1 style={{ color: '#dc3545', marginBottom: '10px' }}>권한이 없습니다</h1>
            <p style={{ color: '#555', fontSize: '14px' }}>
                이 페이지에 접근할 수 있는 권한이 없습니다.<br/>
            </p>
        </div>
    );
    }

    return (
        <div>
            <h1>회사 대시보드</h1>
            <br/>
            <h2>인사 변동 통계</h2>
            <h3>입사 및 입사 예정일</h3>
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

            <h2>회사 조직 통계</h2>
            회사 조직 통계 - 팀별 인원 파악
            <br/>
            <h2>권한 삭제 이력</h2>
            권한 삭제 이력
            <br/>
            <h2>일정 삭제 기록</h2>
            일정 삭제 기록
            <br/>
            <h2>결재 처리 이력</h2>
            결재 처리 이력
        </div>
    );
}

export default CompDashboard;