import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { fetcher } from "../../../shared/api/fetcher";

function FindPassword() {
  const navigate = useNavigate();

  // 1. 상태 관리
  const [info, setInfo] = useState({
    empSn: "", // 사번
    empEmlAddr: "", // 이메일
    newPswd: "", // 새 비밀번호
    confirmPswd: "", // 비밀번호 확인
  });

  const [emailAuthCode, setEmailAuthCode] = useState(""); // 입력한 인증번호
  const [step, setStep] = useState(1); // 1: 정보입력, 2: 인증번호입력, 3: 비밀번호재설정
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  // 2. 비밀번호 일치 여부 체크
  useEffect(() => {
    if (info.newPswd || info.confirmPswd) {
      setIsPasswordMatch(info.newPswd === info.confirmPswd);
    } else {
      setIsPasswordMatch(false);
    }
  }, [info.newPswd, info.confirmPswd]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 3. 인증번호 발송 (사번 & 이메일 일치 확인 포함)
  const handleSendCode = async () => {
    if (!info.empSn || !info.empEmlAddr)
      return alert("사번과 이메일을 모두 입력해주세요.");

    try {
      // 서버에서 사번/이메일 일치 여부 확인 후 인증번호 발송
      const res = await fetcher("/gw/login/send-code", {
        method: "POST",
        body: { empSn: info.empSn, empEmlAddr: info.empEmlAddr },
      });

      if (res.exists) {
        alert("인증번호가 발송되었습니다.");
        setStep(2); // 인증번호 입력 단계로 진행
      } else {
        alert("유효하지 않은 사원 정보입니다.");
      }
    } catch (error) {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 4. 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      const res = await fetcher("/gw/auth/verify-code", {
        method: "POST",
        body: { email: info.empEmlAddr, code: emailAuthCode },
      });

      if (res.success) {
        alert("인증에 성공했습니다. 새 비밀번호를 설정해주세요.");
        setStep(3); // 비밀번호 재설정 단계로 진행
      } else {
        alert("인증번호가 올바르지 않습니다.");
      }
    } catch (error) {
      alert("인증 처리 중 오류가 발생했습니다.");
    }
  };

  // 5. 비밀번호 최종 변경
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isPasswordMatch) return alert("비밀번호가 일치하지 않습니다.");

    try {
      await fetcher("/gw/login/reset", {
        method: "POST",
        body: {
          empSn: info.empSn,
          empPswd: info.newPswd,
        },
      });

      alert(
        "비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.",
      );
      navigate("/login");
    } catch (error) {
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <div className="find-password-container">
      <h2>비밀번호 찾기</h2>
      <form onSubmit={handleResetPassword}>
        <table>
          <tbody>
            {/* 1단계: 사번 및 이메일 입력 */}
            <tr>
              <td>사번</td>
              <td>
                <input
                  name="empSn"
                  value={info.empSn}
                  onChange={handleInputChange}
                  disabled={step > 1}
                  placeholder="사원 번호를 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td>이메일</td>
              <td>
                <input
                  name="empEmlAddr"
                  value={info.empEmlAddr}
                  onChange={handleInputChange}
                  disabled={step > 1}
                  placeholder="등록된 이메일을 입력하세요"
                />
                {step === 1 && (
                  <Button type="button" onClick={handleSendCode}>
                    인증번호 발송
                  </Button>
                )}
              </td>
            </tr>

            {/* 2단계: 인증번호 입력란 (발송 후 활성화) */}
            {step >= 2 && (
              <tr>
                <td>인증번호</td>
                <td>
                  <input
                    value={emailAuthCode}
                    onChange={(e) => setEmailAuthCode(e.target.value)}
                    disabled={step > 2}
                    placeholder="인증번호 4자리"
                  />
                  {step === 2 && (
                    <Button type="button" onClick={handleVerifyCode}>
                      인증하기
                    </Button>
                  )}
                </td>
              </tr>
            )}

            {/* 3단계: 새 비밀번호 입력란 (인증 성공 후 활성화) */}
            {step === 3 && (
              <>
                <tr>
                  <td>새 비밀번호</td>
                  <td>
                    <input
                      type="password"
                      name="newPswd"
                      value={info.newPswd}
                      onChange={handleInputChange}
                      placeholder="변경할 비밀번호"
                    />
                  </td>
                </tr>
                <tr>
                  <td>비밀번호 확인</td>
                  <td>
                    <input
                      type="password"
                      name="confirmPswd"
                      value={info.confirmPswd}
                      onChange={handleInputChange}
                      placeholder="비밀번호 재확인"
                    />
                    {info.confirmPswd && (
                      <span
                        style={{
                          fontSize: "12px",
                          marginLeft: "10px",
                          color: isPasswordMatch ? "green" : "red",
                        }}
                      >
                        {isPasswordMatch ? "✔ 일치" : "✘ 불일치"}
                      </span>
                    )}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        {step === 3 && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Button
              type="submit"
              disabled={!isPasswordMatch}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: isPasswordMatch ? "#1976d2" : "#ccc",
              }}
            >
              비밀번호 변경 완료
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default FindPassword;
