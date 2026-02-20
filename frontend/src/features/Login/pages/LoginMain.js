import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { fetcher } from "../../../shared/api/fetcher";
import "../css/LoginMain.css";
import loginImg from '../../../images/loginMain.jpg';

function LoginMain(props) {
  const [empSn, setEmpSn] = useState("");
  const [empPswd, setEmpPswd] = useState("");
  const navigate = useNavigate();

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
          <div className="logo-main-name">HYUNJIN</div><br/><br/><br/><br/><br/>
          
          <div className="login-form">
            <div className="login-input-group">
              <label>사원번호</label>
              <input
                type="text"
                className="login-input"
                placeholder="사번을 입력하세요"
                onChange={(e) => setEmpSn(e.target.value)}
              />
            </div>
            
            <div className="login-input-group">
              <label>비밀번호</label>
              <input
                type="password"
                className="login-input"
                placeholder="비밀번호를 입력하세요"
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

          <div className="test-account-info">
            <strong>테스트 계정 가이드</strong>
            <br /> 식품팀장 - FO0001/ 1234
            <br />("지점장") test계정 CP0001/ 1234<br/>
            인사 팀장 - HR0003/ Qw#9Zx12<br/>
            인사 팀원 - HR0005/ 1234<br/>
            뷰티 팀장 - BU0001/ 1111<br/>
            패션 팀원 - WF0001/ hashed_pwd_03<br/>
            여성패션 팀장 - WF0002/ Abc!1234<br/>
            남성패션 팀장 - MF0003/ Pw@2026A<br/>
            시설자재 팀장 - FM0001/ hashed_pwd_07<br/>
            안전관리 팀장 - SO0001/ hashed_pwd_09<br/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginMain;