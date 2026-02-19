import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

const ModifyEmp = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const [empData, setEmpData] = useState([])
  const [formData, setFormData] = useState({
    EMP_NM: '',
    // EMP_BIRTH: '',
    DEPT_ID: '',
    JBTTL_ID: ''
  });

  const [deptList, setDeptList] = useState([]);
  const [jbttlList, setJbttlList] = useState([]);

  useEffect(() => {
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

    fetcher(`/gw/orgChart/detail/${id}`)
    .then(dd => {
      setEmpData(dd)
      setFormData({
          EMP_NM: dd.EMP_NM,
          // EMP_BIRTH: dd.EMP_BIRTH.split("T")[0],
          DEPT_ID: dd.DEPT_ID,
          JBTTL_ID: dd.JBTTL_ID
      });
    })
    .catch(e => console.log(e))
  }, [])

  // 저장 버튼 클릭 시
  const handleSubmit = async () => {
    alert(`${formData.EMP_NM} 정보 수정 완료`);
    try {
      // 사원 정보 수정
      await fetcher('/gw/orgChart/modifyInfo', {
        method: 'POST',
        body: { 
          empId: id,
          empNm: formData.EMP_NM,
          deptId: formData.DEPT_ID,
          jbttlId: formData.JBTTL_ID
        }
      });

      // 수정된 정보를 HIST 테이블에 기록
      await fetcher('/gw/orgChart/modifyHist', {
        method: 'POST',
        body: { 
          // empData
          histEmpId: id,
          histEmpSn: empData.EMP_SN,
          histEmpNm: empData.EMP_NM,
          beforeNm: empData.EMP_NM,
          beforeDeptId: empData.DEPT_ID,
          beforeJbttlId: empData.JBTTL_ID,
          afterNm: formData.EMP_NM,
          afterDeptId: formData.DEPT_ID,
          afterJbttlId: formData.JBTTL_ID
        }
      });

    } catch (err) {
        console.error('계정 정보 수정 실패:', err.message);
    }
    navigate(-1)
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>사원 정보 수정</h2>
      
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
        <button style={styles.cancelBtn} onClick={() => navigate(-1)}>취소</button>
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

export default ModifyEmp;