import React, { useState } from 'react';

const MemberRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    team: '',
    position: ''
  });

  // 드롭다운 메뉴 옵션 데이터
  const teamList = ["식품", "뷰티·패션잡화", "여성패션", "남성패션", "인사관리", "시설자재", "안전관리", "지점장"];
  const positionList = ["팀원", "실장", "팀장", "대표이사"];

  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 저장 버튼 클릭 시
  const handleSubmit = () => {
    console.log("저장될 데이터:", formData);
    alert(`${formData.name} 계정 생성 완료`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>사원 정보 입력</h2>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>이름</label>
        <input 
          type="text" 
          name="name"
          placeholder="이름을 입력하세요"
          style={styles.input}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>생년월일</label>
        <input 
          type="date" 
          name="birthDate"
          style={styles.input}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>팀</label>
        <select name="team" style={styles.input} onChange={handleChange}>
          <option value="">팀을 선택하세요</option>
          {teamList.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>직책</label>
        <select name="position" style={styles.input} onChange={handleChange}>
          <option value="">직책을 선택하세요</option>
          {positionList.map(pos => <option key={pos} value={pos}>{pos}</option>)}
        </select>
      </div>

      <div style={styles.buttonGroup}>
        <button style={styles.cancelBtn} onClick={() => alert('취소되었습니다.')}>취소</button>
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