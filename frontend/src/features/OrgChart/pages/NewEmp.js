import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';

const MemberRegistrationForm = () => {
  const [formData, setFormData] = useState({
    EMP_NM: '',
    EMP_BIRTH: '',
    DEPT_ID: '',
    JBTTL_ID: ''
  });

  const [deptList, setDeptList] = useState([]);
  const [jbttlList, setJbttlList] = useState([]);
  const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
  const [accessCk, setAccessCk] = useState(0);

  useEffect(() => {
    // 권한 확인용
    fetcher(`/gw/orgChart/access?id=${myInfo.deptId}&type=DEPT&section=ORGCHART&accessId=10`)
    .then(dd => {
      setAccessCk(dd)
      console.log(dd)
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
    alert(`${formData.EMP_NM} 계정 생성 완료`);

    try {
      await fetcher('/gw/orgChart/register', {
        method: 'POST',
        body: { 
          empNm: formData.EMP_NM,
          empBirth: formData.EMP_BIRTH.split("T")[0],
          deptId: formData.DEPT_ID,
          jbttlId: formData.JBTTL_ID
        }
      });

    } catch (err) {
        console.error('계정 생성 실패:', err.message);
    }

    setFormData ({
      EMP_NM: '',
      EMP_BIRTH: '',
      DEPT_ID: '',
      JBTTL_ID: ''
    })

  };

  const handleCancle = () => {
    setFormData ({
      EMP_NM: '',
      EMP_BIRTH: '',
      DEPT_ID: '',
      JBTTL_ID: ''
    })
  }

  // 부서번호 6(인사팀)만 접근 가능
  // accessCk
  // myInfo.deptId != 6
  if (accessCk === 0) {
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

      <div style={styles.buttonGroup}>
        <button style={styles.cancelBtn} onClick={handleCancle}>취소</button>
        <button style={styles.submitBtn} onClick={handleSubmit}>완료</button>
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