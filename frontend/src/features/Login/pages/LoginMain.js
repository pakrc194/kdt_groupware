import React, { useState } from 'react';

function AuthPage() {
  const [view, setView] = useState('login'); // 'login', 'find', 'change'
  const [empNo, setEmpNo] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = () => {
    if (!empNo || !password) {
      alert('사번과 비밀번호를 입력해주세요.');
      return;
    }
    alert('로그인 성공!');
  };

  const sendCode = () => {
    alert(`인증번호가 ${email}로 전송되었습니다.`);
  };

  const verifyCode = () => {
    if (code === '123456') {
      alert('인증 성공! 비밀번호 변경 화면으로 이동합니다.');
      setView('change');
    } else {
      alert('인증 실패');
    }
  };

  const changePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    alert('비밀번호가 변경되었습니다.');
    setView('login');
  };

  return (
    <div style={{ width: '300px', margin: '50px auto', textAlign: 'center' }}>
      <h2>사용자 인증</h2>

      {view === 'login' && (
        <>
          <input
            type="text"
            placeholder="사번"
            value={empNo}
            onChange={(e) => setEmpNo(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={handleLogin}>로그인</button>
          <button onClick={() => setView('find')}>비밀번호 찾기</button>
        </>
      )}

      {view === 'find' && (
        <>
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <button onClick={sendCode}>인증번호 전송</button>
          <br />
          <input
            type="text"
            placeholder="인증번호 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <br />
          <button onClick={verifyCode}>인증번호 확인</button>
          <br />
          <button onClick={() => setView('login')}>← 로그인으로</button>
        </>
      )}

      {view === 'change' && (
        <>
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <br />
          <button onClick={changePassword}>완료</button>
          <br />
          <button onClick={() => setView('login')}>← 로그인으로</button>
        </>
      )}
    </div>
  );
}

export default AuthPage;