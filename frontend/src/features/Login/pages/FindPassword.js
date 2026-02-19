import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import "../css/FindPassword.css"; // CSS 추가

function FindPassword() {
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    empSn: "", 
    empEmlAddr: "", 
    newPswd: "", 
    confirmPswd: "", 
  });

  const [emailAuthCode, setEmailAuthCode] = useState(""); 
  const [step, setStep] = useState(1);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [pwError, setPwError] = useState("");

  const pwReg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

  useEffect(() => {
    if (info.newPswd || info.confirmPswd) {
      setIsPasswordMatch(info.newPswd === info.confirmPswd);
      if (info.newPswd && !pwReg.test(info.newPswd)) {
        setPwError("8~15자 영문, 숫자, 특수문자 조합이 필요합니다."); 
      } else {
        setPwError("");
      }
    }
  }, [info.newPswd, info.confirmPswd]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendCode = async () => {
    if (!info.empSn || !info.empEmlAddr) return alert("정보를 모두 입력하세요.");
    try {
      const res = await fetcher("/gw/login/send-code", {
        method: "POST",
        body: { empSn: info.empSn, empEmlAddr: info.empEmlAddr },
      });
      if (res && res.exists) {
        alert("인증번호가 발송되었습니다.");
        setStep(2);
      } else {
        alert("일치하는 정보가 없습니다.");
      }
    } catch (error) {
      alert("정보 확인 중 오류가 발생했습니다.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await fetcher("/gw/auth/verify-code", {
        method: "POST",
        body: { email: info.empEmlAddr, code: emailAuthCode },
      });
      if (res && res.success) {
        alert("인증이 완료되었습니다.");
        setStep(3);
      } else {
        alert("인증번호가 올바르지 않습니다.");
      }
    } catch (error) {
      alert("인증 실패");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!pwReg.test(info.newPswd) || !isPasswordMatch) return alert("비밀번호 정보를 다시 확인해주세요.");

    try {
      await fetcher("/gw/login/reset", {
        method: "POST",
        body: { empSn: info.empSn, empPswd: info.newPswd },
      });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/login");
    } catch (error) {
      alert("처리 중 오류 발생");
    }
  };

  return (
    <div className="find-pw-wrapper">
      <div className="find-pw-card">
        <header className="find-pw-header">
          <h2>비밀번호 찾기</h2>
          <p>정보 보안을 위해 본인 인증 후 변경이 가능합니다.</p>
        </header>

        {/* 단계 표시 바 */}
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? "active" : ""}`}></div>
          <div className={`step-dot ${step >= 2 ? "active" : ""}`}></div>
          <div className={`step-dot ${step >= 3 ? "active" : ""}`}></div>
        </div>

        <form className="find-pw-form" onSubmit={handleResetPassword}>
          {/* STEP 1 & 2 공통: 사번 및 이메일 */}
          <div className="find-pw-group">
            <label>사원번호</label>
            <input
              name="empSn"
              className="find-pw-input"
              value={info.empSn}
              onChange={handleInputChange}
              disabled={step > 1}
              placeholder="사번 입력"
            />
          </div>

          <div className="find-pw-group">
            <label>등록된 이메일</label>
            <div className="find-pw-flex">
              <input
                name="empEmlAddr"
                className="find-pw-input"
                value={info.empEmlAddr}
                onChange={handleInputChange}
                disabled={step > 1}
                placeholder="example@company.com"
              />
              {step === 1 && (
                <button type="button" className="find-pw-btn-sub" onClick={handleSendCode}>
                  번호 발송
                </button>
              )}
            </div>
          </div>

          {/* STEP 2: 인증코드 입력 */}
          {step >= 2 && (
            <div className="find-pw-group">
              <label>인증코드 확인</label>
              <div className="find-pw-flex">
                <input
                  className="find-pw-input"
                  value={emailAuthCode}
                  onChange={(e) => setEmailAuthCode(e.target.value)}
                  disabled={step > 2}
                  placeholder="인증코드 6자리"
                />
                {step === 2 && (
                  <button type="button" className="find-pw-btn-sub" onClick={handleVerifyCode}>
                    확인
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: 새 비밀번호 설정 */}
          {step === 3 && (
            <>
              <div className="find-pw-group">
                <label>새 비밀번호</label>
                <input
                  type="password"
                  name="newPswd"
                  className="find-pw-input"
                  value={info.newPswd}
                  onChange={handleInputChange}
                  placeholder="새 비밀번호 입력"
                />
                <p className="find-pw-hint">* 영문, 숫자, 특수문자 조합 (8~15자)</p>
              </div>

              <div className="find-pw-group">
                <label>비밀번호 재확인</label>
                <input
                  type="password"
                  name="confirmPswd"
                  className="find-pw-input"
                  value={info.confirmPswd}
                  onChange={handleInputChange}
                  placeholder="한 번 더 입력"
                />
                {info.confirmPswd && (
                  <p className={`find-pw-hint ${isPasswordMatch ? "success" : "error"}`}>
                    {isPasswordMatch ? "● 비밀번호가 일치합니다." : "○ 비밀번호가 일치하지 않습니다."}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="find-pw-submit"
                disabled={!isPasswordMatch || pwError !== ""}
              >
                비밀번호 변경 완료
              </button>
            </>
          )}
        </form>

        <Link to="/login" className="back-to-login">로그인 화면으로 돌아가기</Link>
      </div>
    </div>
  );
}

export default FindPassword;