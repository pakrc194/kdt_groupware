import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { fetcher } from "../../../shared/api/fetcher";
import "../css/LoginMain.css";
import loginImg from '../../../images/loginMain.jpg';

function LoginMain(props) {
  const [empSn, setEmpSn] = useState("");
  const [empPswd, setEmpPswd] = useState("");
  
  // ✅ 1. 테스트 계정 정보 숨김/표시 상태 추가 (기본값: 숨김)
  const [showTestInfo, setShowTestInfo] = useState(false);
  const navigate = useNavigate();

  // ✅ 2. 테스트 계정 리스트 (배열로 관리하면 클릭 이벤트 달기 편합니다)
  const testAccounts = [
    { role: "식품팀장", id: "FO0001", pw: "1234" },
    { role: "지점장(test)", id: "CP0001", pw: "1234" },
    { role: "인사 팀장", id: "HR0003", pw: "Qw#9Zx12" },
    { role: "인사 팀원", id: "HR0005", pw: "1234" },
    { role: "뷰티 팀장", id: "BU0001", pw: "1111" },
    { role: "패션 팀원", id: "WF0001", pw: "hashed_pwd_03" },
    { role: "여성패션 팀장", id: "WF0002", pw: "Abc!1234" },
    { role: "남성패션 팀장", id: "MF0003", pw: "Pw@2026A" },
    { role: "시설자재 팀장", id: "FM0001", pw: "hashed_pwd_07" },
    { role: "안전관리 팀장", id: "SO0001", pw: "hashed_pwd_09" },
  ];

  // ✅ 3. 계정 클릭 시 인풋 자동 채우기 함수
  const handleAutoFill = (id, pw) => {
    setEmpSn(id);
    setEmpPswd(pw);
  };

  const fn_login = async () => {
    fetcher("/gw/login", {
      method: "POST",
      body: {
        empSn: empSn,
        empPswd: empPswd,
      },
    }).then((res) => {
      if (res.logChk === "Fail") {
        alert("로그인 실패");
      } else if (res.logChk === "NewEmp") {
        alert("신규계정생성 페이지로 이동합니다 ");
        navigate(`/EmpDetails?empSn=${res.empSn}`);
      } else {
        localStorage.setItem("MyInfo", JSON.stringify(res));
        navigate("/home/dashboard");
      }
    });
  };

  useEffect(() => {
    fn_check();
  }, []);

  const fn_check = () => {
    const myInfoStr = localStorage.getItem("MyInfo");
    const myInfo = JSON.parse(myInfoStr);
    const token = myInfo?.token || null;

    if (token) {
      fetcher(`/gw/login/hello`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          navigate("/home/dashboard");
        })
        .catch((error) => {
          console.log(`logChk 에러 : `, error);
        });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-image-side">
        <img src={loginImg} alt="Login Background" />
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="ogin-logo-area"></div>
          <div className="logo-top-line">
            <span className="logo-the">THE</span>
          </div>
          
          {/* ✅ 4. 더블 클릭 이벤트(onDoubleClick) 적용 & 마우스 커서 포인터 추가 */}
          <div 
            className="logo-main-name" 
            onDoubleClick={() => setShowTestInfo(!showTestInfo)}
            style={{ cursor: "pointer", userSelect: "none" }}
            title="더블클릭하여 테스트 계정 보기"
          >
            HYUNJIN
          </div>
          <br/><br/><br/><br/><br/>
          
          <div className="login-form">
            <div className="login-input-group">
              <label>사원번호</label>
              <input
                type="text"
                className="login-input"
                placeholder="사번을 입력하세요"
                value={empSn}     // ✅ value 바인딩 필수 (자동 입력을 위해)
                onChange={(e) => setEmpSn(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fn_login()}
              />
            </div>
            
            <div className="login-input-group">
              <label>비밀번호</label>
              <input
                type="password"
                className="login-input"
                placeholder="비밀번호를 입력하세요"
                value={empPswd}   // ✅ value 바인딩 필수
                onChange={(e) => setEmpPswd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fn_login()}
              />
            </div>

            <div className="login-btn-area">
              <button className="login-submit-btn" onClick={fn_login}>
                로그인
              </button>
              <button className="find-pw-btn" onClick={() => navigate("/FindPassword")}>
                비밀번호를 잊으셨나요?
              </button>
            </div>
          </div>

          {/* ✅ 5. 토글 상태에 따라 보여주기 & 클릭 시 자동 채우기 */}
          {showTestInfo && (
            <div className="test-account-info">
              <strong>테스트 계정 가이드</strong>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0' }}>
                클릭하면 사번과 비밀번호가 자동으로 입력됩니다.
              </p>
              
              {/* ✅ 스크롤이 적용되는 영역 */}
              <div className="test-account-list-scroll">
                {testAccounts.map((acc, index) => (
                  <div 
                    key={index} 
                    className="test-account-item"
                    onClick={() => handleAutoFill(acc.id, acc.pw)}
                  >
                    <span className="role-name">{acc.role}</span>
                    <span className="account-data">{acc.id} / {acc.pw}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginMain;