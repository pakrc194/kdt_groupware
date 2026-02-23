import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import TeamSelectPopup from './TeamSelectPopup';
import NoAccess from '../../../shared/components/NoAccess';
import { chkToday } from '../../../shared/api/chkToday';

function Instruction(props) {

    const navigate = useNavigate();

    // 상태 정의
    const [workType, setWorkType] = useState('COMPANY'); // 업무 구분: 회사 / 팀 (enum 값)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [location, setLocation] = useState('0'); // 장소 id, 0 = 없음
    const [role, setRole] = useState(''); // 권한 상태
    const [teamPopupOpen, setTeamPopupOpen] = useState(false);
    const [locationList, setLocationList] = useState([]);
    const [teamSchedList, setTeamSchedList] = useState([]);
    const [resLoc, setResLoc] = useState([]);

    const hasCommon = selectedTeams.some(num => teamSchedList.includes(num.deptId.toString()))

    // 팀 리스트
    const [teamList, setTeamList] = useState([]);
    
    // 유저 정보
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
    const deptId = myInfo.deptId;
    const jbttlId = myInfo.jbttlId;

    useEffect(() => {
        // 직책 가져오기
        const storedRole = localStorage.getItem('USER_ROLE') || 'TEAM_USER';
        setRole(localStorage.getItem('USER_ROLE'));

        // 권한에 따라 기본 workType 설정
        if (storedRole != 'CP') setWorkType('DEPT');
        else setWorkType('COMPANY'); // ADMIN 등은 기본값

        // 팀 리스트 가져오기
        fetcher('/gw/schedule/instruction/teams')
        .then(data => {
            setTeamList(data);
            // DEPT_ID가 1이 아니면 선택 불가, 자동으로 본인 부서 팀 선택
            if (deptId != 1) {
                if (data.find(t => t.deptId == deptId)) {
                    setSelectedTeams([data.find(t => t.deptId == deptId)])
                };
            }
        })
        .catch(err => console.error('팀 리스트 로딩 실패', err));

        // 장소 리스트 가져오기
        fetcher('/gw/schedule/instruction/locations')
        .then(data => { setLocationList(data); })
        .catch(err => console.error('장소 리스트 로딩 실패', err))

    }, []);

    useEffect(() => {
        // startDate, endDate가 모두 있을 때만 fetch
        if (!startDate || !endDate) return;
        
        // 팀 일정 확인
        fetcher(`/gw/schedule/instruction/schedTeams/${startDate}/${endDate}`)
        .then(data => {
            // ['4,5', '2', '5,7,8'] => ['4', '5', '2', '7', '8']로 변환하여 등록
            setTeamSchedList([...new Set(
                data.flatMap(item => item?.split(','))
            )])
        })
        .catch(err => console.error('팀 일정 리스트 로딩 실패', err))

        // 장소 일정 확인
        fetcher(`/gw/schedule/instruction/schedLocs/${startDate}/${endDate}`)
        .then(data => {
            setResLoc(locationList.filter(loc => !data.filter(id => id !== null).includes(loc.locId)))
        })
        .catch(err => console.error('팀 일정 리스트 로딩 실패', err))
    }, [startDate, endDate])    // 선택 날짜 바뀔 때마다 일정 정보 가져와야함

    
    

    // 직책 id로 권한 설정
    if (jbttlId == 3) return <NoAccess />;

    // 업무 구분 선택 옵션 필터링
    const workTypeOptions = () => {
        if (role === 'CP') return [
            { value: 'COMPANY', label: '회사' },
            { value: 'DEPT', label: '팀' }
        ];
        if (role != 'CP') return [{ value: 'DEPT', label: '팀' }];
        return [];
    };

    
    // 업무 등록
    const handleSubmit = async () => {
        if (!startDate || !endDate || !title) {
            alert('시작 날짜, 종료 날짜, 제목을 모두 입력하세요');
            return;
        }
        if (workType === "BTEAM" && selectedTeams.length === 0) {
            alert('담당 팀을 선택하세요')
            return;
        }
        if (startDate > endDate) {
            alert('종료 날짜는 시작 날짜보다 같거나 이후여야 합니다');
            return;
        }
        if (!chkToday(startDate)) {
            alert('시작날짜는 오늘 이후여야 합니다.')
            return;
        }

        let id = 0;
        try {
            id = await fetcher(`/gw/schedule/instruction/upload`, {
                method: 'POST',
                body: { 
                    schedType: workType,
                    schedStartDate: startDate,
                    schedEndDate: endDate,
                    schedTitle: title,
                    schedDetail: detail,
                    schedDept: selectedTeams.map(t => t.deptName).join(','),
                    schedDeptId: selectedTeams.map(t => t.deptId).join(','),
                    schedLoc: location === '0' ? null : parseInt(location),
                    schedAuthorId: myInfo.empId,
                    schedEmpSn: myInfo.empSn
                }
            });
        } catch (err) {
            console.error('업무지시 등록 실패:', err.message);
        };

        await fetcher(`/gw/schedule/instruction/alert`, {
            method: 'POST',
            body: { 
                schedType: workType,
                schedStartDate: startDate,
                schedEndDate: endDate,
                schedTitle: title,
                schedDetail: detail,
                schedDept: selectedTeams.map(t => t.deptName).join(','),
                schedDeptId: selectedTeams.map(t => t.deptId).join(','),
                schedLoc: location === '0' ? null : parseInt(location),
                schedAuthorId: myInfo.empId,
                schedEmpSn: myInfo.empSn
            }
        });

        hasCommon && alert('업무가 중복 등록됩니다.')
        alert('업무가 등록되었습니다');
        // 페이지 이동
        navigate(`/schedule/instruction/detail/${id}`);

        // 초기화
        setWorkType('COMPANY');
        setStartDate('');
        setEndDate('');
        setTitle('');
        setDetail('');
        setSelectedTeams([]);
        setLocation('0');
    };


    return (
        <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'Noto Sans, sans-serif',
            backgroundColor: "#fff", padding: "20px", border: "1px solid #ddd", borderRadius: "8px"
         }}>
            {/* 업무 구분 선택 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <label>업무 구분 선택</label>
                <select
                    value={workType}
                    onChange={e => setWorkType(e.target.value)}
                    style={{ width: 120 }}
                >
                    {workTypeOptions().map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* 시작 날짜 선택 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <label>시작 날짜 선택</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    style={{ width: 120 }}
                />
            </div>

            {/* 종료 날짜 선택 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <label>종료 날짜 선택</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    style={{ width: 120 }}
                />
            </div>

            {/* 제목 입력 */}
            <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', marginBottom: 5 }}>제목 입력</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
                />
            </div>

            {/* 상세 내용 입력 */}
            <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', marginBottom: 5 }}>상세 내용 입력</label>
                <textarea
                    value={detail}
                    onChange={e => setDetail(e.target.value)}
                    rows={6}
                    style={{ width: '100%', padding: 8, boxSizing: 'border-box', resize: 'vertical' }}
                />
            </div>

            {/* 담당 팀 지정 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <label>담당 팀 지정</label>
                {deptId == 1 && (workType != "COMPANY") &&
                <button
                    type="button"
                    onClick={() => setTeamPopupOpen(true)}
                    style={{ padding: '6px 12px', cursor: 'pointer' }}
                >
                    담당 팀 지정 버튼
                </button>
                }
            </div>
            <div style={{ marginBottom: 15, minHeight: 24, fontSize: 14 }}>
                {(workType === "COMPANY") ? '회사' : selectedTeams.length === 0 ? '선택된 팀 없음' : selectedTeams.map(t => t.deptName).join(', ')}
                {selectedTeams.length != 0 && hasCommon && <h3>업무가 중복 등록 됩니다.</h3>}
            </div>

            {/* 장소 선택 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 25 }}>
                <label>장소 선택</label>
                <select
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    style={{ width: 150 }}
                >
                    <option value="0">없음</option>
                    {resLoc.map(loc => (
                        <option key={loc.locId} value={loc.locId}>{loc.locNm}</option>
                    ))}
                </select>
            </div>

            {/* 버튼 그룹 */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                    type="button"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        setWorkType('COMPANY');
                        setStartDate('');
                        setEndDate('');
                        setTitle('');
                        setDetail('');
                        setSelectedTeams([]);
                        setLocation('0');
                    }}
                >
                    취소하기
                </button>

                <button
                    type="button"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                    onClick={handleSubmit}
                >
                    등록하기
                </button>
            </div>

            {/* 팀 선택 팝업 */}
            {teamPopupOpen && (
                <TeamSelectPopup
                    teamList={teamList}
                    onClose={() => setTeamPopupOpen(false)}
                    onSelect={teams => {
                        setSelectedTeams(teams);
                        setTeamPopupOpen(false);
                    }}
                />
            )}
        </div>
    );
}

export default Instruction;