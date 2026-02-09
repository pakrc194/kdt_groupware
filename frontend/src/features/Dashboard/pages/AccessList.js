import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';

function AccessList(props) {
    const [teamList, setTeamList] = useState([]);
    const [jbttlList, setJbttlList] = useState([]);
    
    useEffect(() => {
        // 전체 팀 리스트
        fetcher('/gw/schedule/instruction/teams')
        .then(dd => {
            setTeamList(dd)
        })
        
        .catch(err => console.error('팀 리스트 로딩 실패', err));

        fetcher('/gw/orgChart/register/jbttl')
        .then(dd => {
            setJbttlList(dd)
        })
        .catch(err => console.error('팀 리스트 로딩 실패', err));
    }, [])
    console.log(setTeamList)

    // 지점장만 접근 가능
    if (localStorage.getItem("EMP_ID") != 1) {
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
            권한 목록
            <h1>팀 목록</h1>
            {teamList.map(team => 
            <>
                <div>{team.deptCode} {team.deptName}</div>
            </>)}
            <h1>직책 목록</h1>
            {jbttlList.map(jbttl => 
            <>
                <div>{jbttl.jbttlId} {jbttl.jbttlNm}</div>
            </>
            )}
        </div>
    );
}

export default AccessList;