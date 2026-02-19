import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import NoAccess from '../../../shared/components/NoAccess';
import Modal from '../../../shared/components/Modal';
import { chkToday } from '../../../shared/api/chkToday';

const MemberRegistrationForm = () => {
  const [formData, setFormData] = useState({
    EMP_NM: '',
    EMP_BIRTH: '',
    DEPT_ID: '',
    JBTTL_ID: '',
    EMP_JNCMP_YMD: ''
  });

  const [deptList, setDeptList] = useState([]);
  const [jbttlList, setJbttlList] = useState([]);
  const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
  const [accessCk, setAccessCk] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 만나이 계산 함수
  const isOver18 = (birthDateString) => {
    if (!birthDateString) return false;

    const today = new Date();
    const birthDate = new Date(birthDateString);

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // 생일이 아직 안 지났으면 나이 -1
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age >= 18;
  };

  useEffect(() => {
    // 권한 확인용
    fetcher(`/gw/orgChart/access?id=${myInfo.deptId}&type=DEPT&section=ORGCHART&accessId=10`)
    .then(dd => {
      setAccessCk(dd)
    })
    .catch(e => console.log(e))

    fetcher(`/gw/schedule/instruction/teams`)
    .then(dd => {
        setDeptList(Array.isArray(dd) ? dd : [dd])
    })
    .catch(e => console.log(e))

    fetcher(`/gw/orgChart/register/jbttl`)
    .then(dd => {
        setJbttlList(Array.isArray(dd) ? dd : [dd])
    })
    .catch(e => console.log(e))
  }, [])

  // 저장 버튼 클릭 시
  const handleSubmit = async () => {
    if (!formData.EMP_NM || !formData.EMP_BIRTH || !formData.DEPT_ID || !formData.JBTTL_ID || !formData.EMP_JNCMP_YMD) {
      alert('정보를 모두 입력해 주세요.')
      return;
    }
    if (!chkToday(formData.EMP_JNCMP_YMD)) {
      alert('입사일을 확인하세요.')
      return;
    }
    if (!isOver18(formData.EMP_BIRTH)) {
      alert('생년월일을 확인하세요.')
      return;
    }
    try {
      await fetcher('/gw/orgChart/register', {
        method: 'POST',
        body: { 
          empNm: formData.EMP_NM,
          empBirth: formData.EMP_BIRTH.split("T")[0],
          deptId: formData.DEPT_ID,
          jbttlId: formData.JBTTL_ID,
          empJncmpYmd: formData.EMP_JNCMP_YMD 
        }
      });
      setIsOpen(false)
      alert(`${formData.EMP_NM} 계정 생성 완료`);
      
    } catch (err) {
      console.error('계정 생성 실패:', err.message);
    }
    
    setFormData ({
      EMP_NM: '',
      EMP_BIRTH: '',
      DEPT_ID: '',
      JBTTL_ID: '',
      EMP_JNCMP_YMD: ''
    })

  };

  const handleCancle = () => {
    setFormData ({
      EMP_NM: '',
      EMP_BIRTH: '',
      DEPT_ID: '',
      JBTTL_ID: '',
      EMP_JNCMP_YMD: ''
    })
  }

  // 부서번호 6(인사팀)만 접근 가능
  // accessCk
  // myInfo.deptId != 6
  if (accessCk === 0) return <NoAccess />

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>사원 정보 입력</h2>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>이름</label>
        <input 
          type="text" 
          name="EMP_NM"
          placeholder="이름을 입력하세요"
          style={styles.input}
          value={formData.EMP_NM}
          onChange={e => setFormData({...formData, EMP_NM: e.target.value})}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>생년월일</label>
        <input 
          type="date" 
          name="EMP_BIRTH"
          style={styles.input}
          value={formData.EMP_BIRTH}
          // onChange={handleChange}
          onChange={e => setFormData({...formData, EMP_BIRTH: e.target.value})}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>팀</label>
        <select name="DEPT_ID" style={styles.input}  value={formData.DEPT_ID} onChange={e => setFormData({...formData, DEPT_ID: e.target.value})}>
          <option value="">팀을 선택하세요</option>
          {deptList.map(team => <option key={team.deptId} value={team.deptId}>{team.deptName}</option>)}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>직책</label>
        <select name="JBTTL_ID" style={styles.input} value={formData.JBTTL_ID} onChange={e => setFormData({...formData, JBTTL_ID: e.target.value})}>
          <option value="">직책을 선택하세요</option>
          {jbttlList.map(pos => <option key={pos.jbttlId} value={pos.jbttlId}>{pos.jbttlNm}</option>)}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>입사날짜</label>
        <input 
          type="date" 
          name="EMP_JNCMP_YMD"
          style={styles.input}
          value={formData.EMP_JNCMP_YMD}
          // onChange={handleChange}
          onChange={e => setFormData({...formData, EMP_JNCMP_YMD: e.target.value})}
        />
      </div>

      <div style={styles.buttonGroup}>
        <button style={styles.cancelBtn} onClick={handleCancle}>취소</button>
        <button style={styles.submitBtn} onClick={() => setIsOpen(true)}>완료</button>
        {isOpen && (
          <Modal 
            title="사원 등록 확인" 
            message="사원을 등록합니다." 
            onClose={() => setIsOpen(false)} 
            onOk={handleSubmit} 
            okMsg="확인" 
          />
        )}
      </div>
    </div>
  );
};

// 간단한 인라인 스타일
const styles = {
  container: { maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' },
  formGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column' },
  label: { fontSize: '14px', marginBottom: '5px', color: '#333' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' },
  buttonGroup: { display: 'flex', gap: '10px', marginTop: '20px' },
  cancelBtn: { flex: 1, padding: '12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  submitBtn: { flex: 1, padding: '12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default MemberRegistrationForm;