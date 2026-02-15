import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { fetcher } from "../../../shared/api/fetcher";

function FindPassword() {
  const navigate = useNavigate();

  // 1. 상태 관리
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

  // 정규식: 8~15자 영문, 숫자, 특수문자 조합
  const pwReg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

  // 2. 비밀번호 실시간 체크
  useEffect(() => {
    if (info.newPswd || info.confirmPswd) {
    setIsPasswordMatch(info.newPswd === info.confirmPswd);
    
    // 유효성 검사 실패 시 내부 상태만 변경 (사용자에게는 '입력 정보 오류'로 노출)
    if (info.newPswd && !pwReg.test(info.newPswd)) {
      setPwError("규칙에 맞지 않습니다."); 
    } else {
      setPwError("");
    }
  }
  }, [info.newPswd, info.confirmPswd]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 사번(empSn)을 포함한 모든 필드 유효성 검사 없이 그대로 반영
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 3. 인증번호 발송
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
        alert("정보가 올바르지 않습니다.");
      }
    } catch (error) {
      alert("정보가 올바르지 않습니다.");
    }
  };

  // 4. 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      const res = await fetcher("/gw/auth/verify-code", {
        method: "POST",
        body: { email: info.empEmlAddr, code: emailAuthCode },
      });

      if (res && res.success) {
        alert("인증 완료");
        setStep(3);
      } else {
        alert("인증 실패");
      }
    } catch (error) {
      alert("인증 실패");
    }
  };

  // 5. 비밀번호 최종 변경
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!pwReg.test(info.newPswd) || !isPasswordMatch) {
      return alert("입력 정보 오류");
    }

    try {
      await fetcher("/gw/login/reset", {
        method: "POST",
        body: {
          empSn: info.empSn,
          empPswd: info.newPswd,
        },
      });

      alert("변경 완료");
      navigate("/login");
    } catch (error) {
      alert("처리 중 오류 발생");
    }
  };

  return (
    <div className="find-password-container" style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>비밀번호 찾기</h2>
      
      <form onSubmit={handleResetPassword}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>사번</label>
          <input
            name="empSn"
            value={info.empSn}
            onChange={handleInputChange}
            disabled={step > 1}
            placeholder="사번 입력"
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>이메일</label>
          <div style={{ display: "flex", gap: "5px" }}>
            <input
              name="empEmlAddr"
              value={info.empEmlAddr}
              onChange={handleInputChange}
              disabled={step > 1}
              placeholder="등록된 이메일"
              style={{ flex: 1, padding: "10px" }}
            />
            {step === 1 && (
              <Button type="button" onClick={handleSendCode} style={{ whiteSpace: "nowrap" }}>
                인증번호 발송
              </Button>
            )}
          </div>
        </div>

        {step >= 2 && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>인증코드</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <input
                value={emailAuthCode}
                onChange={(e) => setEmailAuthCode(e.target.value)}
                disabled={step > 2}
                placeholder="코드 입력"
                style={{ flex: 1, padding: "10px" }}
              />
              {step === 2 && (
                <Button type="button" onClick={handleVerifyCode}>
                  확인
                </Button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>새 비밀번호</label>
              <input
                type="password"
                name="newPswd"
                value={info.newPswd}
                onChange={handleInputChange}
                placeholder="비밀번호 입력"
                style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
              />
              {/* 최소한의 가이드라인 제공 💡 */}
              <p style={{ color: "#666", fontSize: "11px", marginTop: "4px" }}>
                * 8~15자 영문, 숫자, 특수문자를 조합하여 입력해주세요.
              </p>
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>비밀번호 확인</label>
              <input
                type="password"
                name="confirmPswd"
                value={info.confirmPswd}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
              />
              {info.confirmPswd && (
                <p style={{ 
                  fontSize: "12px", 
                  marginTop: "5px", 
                  color: isPasswordMatch ? "green" : "red" 
                }}>
                  {isPasswordMatch ? "일치" : "불일치"}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isPasswordMatch || pwError !== ""}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: (isPasswordMatch && !pwError) ? "#1976d2" : "#ccc",
              }}
            >
              변경 완료
            </Button>
          </>
        )}
      </form>
    </div>
  );
}

export default FindPassword;