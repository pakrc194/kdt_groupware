import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import TeamSelectPopup from './TeamSelectPopup';

function Instruction(props) {

    const navigate = useNavigate();

    // 상태 정의
    const [workType, setWorkType] = useState('ACOMPANY'); // 업무 구분: 회사 / 팀 (enum 값)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [location, setLocation] = useState('0'); // 장소 id, 0 = 없음
    const [role, setRole] = useState(''); // 권한 상태
    const [teamPopupOpen, setTeamPopupOpen] = useState(false);
    const [locationList, setLocationList] = useState([]);

    // 팀 리스트
    const [teamList, setTeamList] = useState([]);

    // 유저 정보
    const deptId = parseInt(localStorage.getItem('DEPT_ID'));

    useEffect(() => {
        console.log(localStorage.getItem("USER_ROLE"))
        // 예시: role을 로컬스토리지에서 가져오기
        const storedRole = localStorage.getItem('USER_ROLE') || 'TEAM_USER';
        setRole(localStorage.getItem('USER_ROLE'));

        // 권한에 따라 기본 workType 설정
        if (storedRole != 'CP') setWorkType('BTEAM');
        else setWorkType('ACOMPANY'); // ADMIN 등은 기본값

        // 팀 리스트 가져오기
        fetcher('/gw/schedule/instruction/teams')
        .then(data => {
            setTeamList(data); // [{id, name}, ...] 형태

            // DEPT_ID가 1이 아니면 선택 불가, 자동으로 본인 부서 팀 선택
            if (deptId != 1) {
                if (data.find(t => t.deptId == deptId)) setSelectedTeams([data.find(t => t.deptId == deptId)]);
            }
        })
        .catch(err => console.error('팀 리스트 로딩 실패', err));

        // 장소 리스트 가져오기
        fetcher('/gw/schedule/instruction/locations')
        .then(data => { setLocationList(data) })
        .catch(err => console.error('장소 리스트 로딩 실패', err))

    }, []);

    if (props.JBTTL_ID > 1) {
        return <div style={{ color: 'red', fontWeight: 'bold' }}><h1>권한이 없습니다</h1></div>;
    }

    // 업무 구분 선택 옵션 필터링
    const workTypeOptions = () => {
        if (role === 'CP') return [
            { value: 'ACOMPANY', label: '회사' },
            { value: 'BTEAM', label: '팀' }
        ];
        if (role != 'CP') return [{ value: 'BTEAM', label: '팀' }];
        return [];
    };

    
    // 업무 등록 함수 (실제 저장은 여기에 API 호출 등 넣기)
    const handleSubmit = async () => {
        if (!startDate || !endDate || !title) {
            alert('시작일, 종료일, 제목을 모두 입력하세요');
            return;
        }
        if (workType === "BTEAM" && selectedTeams.length === 0) {
            alert('담당 팀을 선택하세요')
            return;
        }
        if (startDate > endDate) {
            alert('종료일은 시작일보다 같거나 이후여야 합니다');
            return;
        }

        const payload = {
            schedType: workType,
            schedStartDate: startDate,
            schedEndDate: endDate,
            schedTitle: title,
            schedDetail: detail,
            schedTeam: selectedTeams.map(t => t.deptName).join(','),
            schedTeamId: selectedTeams.map(t => t.deptId).join(','),
            schedLoc: location === '0' ? null : parseInt(location),
        };

        try {
            await fetcher(`/gw/schedule/instruction/upload`, {
                method: 'POST',
                body: { 
                    schedType: workType,
                    schedStartDate: startDate,
                    schedEndDate: endDate,
                    schedTitle: title,
                    schedDetail: detail,
                    schedTeam: selectedTeams.map(t => t.deptName).join(','),
                    schedTeamId: selectedTeams.map(t => t.deptId).join(','),
                    schedLoc: location === '0' ? null : parseInt(location),
                    schedAuthorId: localStorage.getItem("EMP_ID"),
                    schedEmpSn: localStorage.getItem("EMP_SN")
                }
            });
        } catch (err) {
            console.error('업무지시 등록 실패:', err.message);
        };

        console.log('등록할 업무:', payload);
        alert('업무가 등록되었습니다');
        // 페이지 이동
        
        // navigate(`/schedule/check/calendar/detail/${event.id}`);

        // 초기화
        setWorkType('ACOMPANY');
        setStartDate('');
        setEndDate('');
        setTitle('');
        setDetail('');
        setSelectedTeams([]);
        setLocation('0');
    };


    return (
        <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'Noto Sans, sans-serif' }}>
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
                {deptId == 1 && (workType != "ACOMPANY") &&
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
                {(workType === "ACOMPANY") ? '회사' : selectedTeams.length === 0 ? '선택된 팀 없음' : selectedTeams.map(t => t.deptName).join(', ')}
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
                    {locationList.map(loc => (
                        <option key={loc.locationId} value={loc.locationId}>{loc.locationName}</option>
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
                        setWorkType('ACOMPANY');
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