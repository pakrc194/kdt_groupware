import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';

function AccessList(props) {
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));

    const [isActive, setisActive] = useState(false);
    const [option, setOption] = useState('DEPT')
    const [teamList, setTeamList] = useState([]);
    const [jbttlList, setJbttlList] = useState([]);
    const [accessEmpowerList, setAccessEmpowerList] = useState([]);
    const [empower, setEmpower] = useState(1);
    const [section, setSection] = useState('');
    const [detail, setDetail] = useState('');
    const [accessList, setAccessList] = useState([]);

    const typeList = [{id: 1, code: 'DEPT', name: '팀'}, {id: 2, code: 'JBTTL', name: '직책'}];
    const sectionList = [
        {id: 1, code: 'APPROVAL', name: '전자결재'},
        {id: 2, code: 'SCHEDULE', name: '일정관리'},
        {id: 3, code: 'ATTENDANCE', name: '근태관리'},
        {id: 4, code: 'BOARD', name: '공지게시판'},
        {id: 5, code: 'ORGCHART', name: '조직도'},
        {id: 6, code: 'DASHBOARD', name: '회사 대시보드'},
    ];

    useEffect(() => {
        // 전체 팀 리스트
        fetcher('/gw/schedule/instruction/teams')
        .then(dd => {
            setTeamList(dd)
            // console.log(dd)
        })
        .catch(err => console.error('팀 리스트 로딩 실패', err));

        fetcher('/gw/orgChart/register/jbttl')
        .then(dd => {
            setJbttlList(Array.isArray(dd) ? dd : [dd])
            console.log(Array.isArray(dd) ? dd : [dd])
        })
        .catch(err => console.error('팀 리스트 로딩 실패', err));

        fetcher('/gw/dashboard/accessEmpowerList')
        .then(dd => {
            console.log('권한부여 리스트: '+Array.isArray(dd) ? dd : [dd])
            setAccessEmpowerList(Array.isArray(dd) ? dd : [dd])
        })
        .catch(err => console.error('권한 부여 리스트 로딩 실패', err));
    }, [])

    useEffect(() => {
        fetcher('/gw/dashboard/accessEmpowerList')
        .then(dd => {
            console.log('권한부여 리스트: '+Array.isArray(dd) ? dd : [dd])
            setAccessEmpowerList(Array.isArray(dd) ? dd : [dd])
        })
        .catch(err => console.error('권한 부여 리스트 로딩 실패', err));
    }, [isActive])

    const accessLoad = {
        ACCESS_TYPE: option,
        EMPOWER_ID: empower,
        ACCESS_SECTION: section,
        ACCESS_DETAIL: detail
    }

    const chooseSection = (e) => {
        setSection(e)
        fetcher(`/gw/dashboard/accessList?type=${e}`)
        .then(dd => {setAccessList(dd)
            console.log(dd)
        })
        .catch(err => console.error('권한 리스트 로딩 실패', err));
    }

    const addAccess = async () => {
        console.log('권한 추가', accessLoad)
        await fetcher('/gw/dashboard/addAccess', {
            method: 'POST',
            body: { 
                accessType: option,
                accessSection: section,
                empowerId: empower,
                accessDetail: detail
            }
        });
        setisActive(false)
    }

    // 지점장만 접근 가능
    if (myInfo.deptId !== 1) {
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
            <div>
                <div style={{
                        marginBottom: '20px',
                        textAlign: 'right',
                    }}>

                { !isActive &&
                    <button onClick={() => setisActive(true)}>권한 추가</button>
                }
                </div>
                { isActive &&
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 25 }}>
                    {/* <label>권한 타입 선택</label> */}
                    <select
                        // value={location}
                        onChange={e => {setOption(e.target.value)}}
                        style={{ width: 50 }}
                    >
                        {typeList.map(list => (
                            <option key={list.id} value={list.code}>{list.name}</option>
                        ))}
                    </select >
                        {/* 팀 */}
                        {option === "DEPT" && 
                            <select style={{ width: 100 }} onChange={e => {setEmpower(e.target.value)}}>
                                <option value="0">팀 선택</option>
                                {teamList.map(list => (
                                <option key={list.deptId} value={list.deptId}>{list.deptName}</option>
                                ))}
                            </select>
                        }
                        {/* 직책 */}
                        {option === "JBTTL" && 
                            <select style={{ width: 100 }} onChange={e => {setEmpower(e.target.value)}}>
                                <option value="0">직책 선택</option>
                                {jbttlList.map(list => (
                                <option key={list.jbttlId} value={list.jbttlId}>{list.jbttlNm}</option>
                                ))}
                            </select>
                        }
                        <select style={{ width: 100 }} onChange={e => {chooseSection(e.target.value)}}>
                            <option value="0">구분 선택</option>
                            {
                                sectionList.map(list => (
                                    <option key={list.id} value={list.code}>{list.name}</option>
                                ))
                            }
                        </select>
                        <select style={{ width: 100 }} onChange={e => {setDetail(e.target.value)}}>
                            <option value="0">권한 선택</option>
                            {
                                accessList.map(list => (
                                    <option key={list.accessListId} value={list.accessListId}>{list.accessDetail}</option>
                                ))
                            }
                        </select>
                        <button onClick={addAccess}>추가</button>
                        <button onClick={() => setisActive(false)}>취소</button>
                </div>
                }
            </div>
            {['DEPT', 'JBTTL'].map(type => {
                const typeName = type === 'DEPT' ? '팀' : '직책';
                return (
                    <div>
                        <h1>{typeName} 권한 목록</h1>
                        {accessEmpowerList.filter(t => t.accessType === type).map(list => (
                            <div>
                                {list.empowerName} 
                                {list.accessType == 'JBTTL' && sectionList.filter(section => (section.code == list.accessSection))
                                .map(name => <>{name.name}</>)} 
                                {list.accessSection} 
                                {list.accessName}
                                
                                <button onClick={() => console.log('권한 수정 버튼 클릭') }>수정</button>
                                <button onClick={() => console.log('권한 삭제 버튼 클릭') }>삭제</button>
                            </div>
                        ))}
                    </div>
                )
            })}
            {/* <h1>팀 목록</h1>
            {teamList.map(team => 
            <>
                <div>{team.deptCode} {team.deptName}</div>
            </>)}
            <h1>직책 목록</h1>
            {jbttlList.map(jbttl => 
            <>
                <div>{jbttl.jbttlId} {jbttl.jbttlNm}</div>
            </>
            )} */}
        </div>
    );
}

export default AccessList;