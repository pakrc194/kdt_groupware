import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { fetcher } from "../../../shared/api/fetcher";

function Employee_details(props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const empSn = searchParams.get("empSn");
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 이미지 경로

  // 1. 상태 관리: DB 컬럼명과 매핑되는 DTO 필드명(Camel Case) 적용
  const [formData, setFormData] = useState({
    empPhoto: null, // 사진 파일
    empAddr: "", // 주소
    empTelno: "", // 연락처
    empActno: "", // 계좌번호
    empPswd: "", // 비밀번호
    confirmPswd: "", // 비밀번호 확인 (전송 제외)
    empEmlAddr: "", // 이메일
  });

  const [emailAuthCode, setEmailAuthCode] = useState(""); // 사용자가 입력한 인증번호
  const [isEmailSent, setIsEmailSent] = useState(false); // 인증번호 전송 여부
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 완료 여부
  const [isPasswordMatch, setIsPasswordMatch] = useState(false); // 비밀번호 일치 여부

  // 2. 비밀번호 일치 여부 실시간 체크
  useEffect(() => {
    if (formData.empPswd || formData.confirmPswd) {
      setIsPasswordMatch(formData.empPswd === formData.confirmPswd);
    } else {
      setIsPasswordMatch(false);
    }
  }, [formData.empPswd, formData.confirmPswd]);

  // 3. 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, empPhoto: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // 이메일 인증번호 발송
  const handleSendAuthCode = async () => {
    if (!formData.empEmlAddr) return alert("이메일을 입력해주세요.");
    try {
      await fetcher(`/gw/auth/send-code`, {
        method: "POST",
        body: { email: formData.empEmlAddr },
      });
      alert(`${formData.empEmlAddr}로 인증번호를 발송했습니다.`);
    } catch (error) {
      alert("인증번호 발송에 실패했습니다.");
    }
    setIsEmailSent(true);
  };

  // 이메일 인증번호
  const handleVerifyCode = async () => {
    try {
      const res = await fetcher(`/gw/auth/verify-code`, {
        method: "POST",
        body: { email: formData.empEmlAddr, code: emailAuthCode },
      });

      if (res.success) {
        alert("이메일 인증에 성공했습니다.");
        setIsEmailVerified(true);
      }
    } catch (error) {
      alert("인증번호가 올바르지 않거나 만료되었습니다.");
    }
  };

  // 5. 가입 완료 제출
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();

    if (!window.confirm("계정 등록을 완료하시겠습니까?")) return;
    URL.createObjectURL(formData.empPhoto);
    try {
      const uploadData = new FormData();
      uploadData.append("empSn", empSn);
      uploadData.append("empAddr", formData.empAddr);
      uploadData.append("empTelno", formData.empTelno);
      uploadData.append("empActno", formData.empActno);
      uploadData.append("empPswd", formData.empPswd);
      uploadData.append("empEmlAddr", formData.empEmlAddr);
      if (formData.empPhoto) {
        uploadData.append("file", formData.empPhoto);
      }

      // fetcher가 JSON.stringify를 자동으로 수행하므로 객체 그대로 전달
      const res = await fetcher(`/gw/login/newEmp`, {
        method: "POST",
        body: uploadData,
      });

      if (res) {
        alert("등록이 성공적으로 완료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("등록 중 오류가 발생했습니다: " + error.message);
    }
  };

  // 6. 버튼 활성화 조건 (모든 필수값 입력 + 비번 일치 + 이메일 인증)
  const isFormValid =
    formData.empAddr &&
    formData.empTelno &&
    formData.empActno &&
    formData.empPswd &&
    isPasswordMatch &&
    isEmailVerified;

  return (
    <div className="registration-container">
      <h2>신규 사원 계정 등록</h2>
      <form onSubmit={handleCompleteRegistration}>
        <table>
          <tbody>
            <tr>
              <td>사진</td>
              <td>
                <div style={{ marginBottom: "10px" }}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="사원 사진 미리보기"
                      style={{
                        width: "120px",
                        height: "150px",
                        objectFit: "cover",
                        border: "1px solid #ddd",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "120px",
                        height: "150px",
                        backgroundColor: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                        border: "1px solid #ddd",
                      }}
                    >
                      <span style={{ fontSize: "15px" }}>
                        사진을 선택하세요
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  name="empPhoto"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </td>
            </tr>
            <tr>
              <td>주소</td>
              <td>
                <input
                  name="empAddr"
                  value={formData.empAddr}
                  onChange={handleInputChange}
                  placeholder="상세 주소를 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td>연락처</td>
              <td>
                <input
                  name="empTelno"
                  value={formData.empTelno}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000"
                />
              </td>
            </tr>
            <tr>
              <td>계좌번호</td>
              <td>
                <input
                  name="empActno"
                  value={formData.empActno}
                  onChange={handleInputChange}
                  placeholder="은행명 계좌번호"
                />
              </td>
            </tr>
            <tr>
              <td>비밀번호</td>
              <td>
                <input
                  type="password"
                  name="empPswd"
                  value={formData.empPswd}
                  onChange={handleInputChange}
                  placeholder="새 비밀번호 입력"
                />
              </td>
            </tr>
            <tr>
              <td>비밀번호 확인</td>
              <td>
                <input
                  type="password"
                  name="confirmPswd"
                  value={formData.confirmPswd}
                  onChange={handleInputChange}
                  placeholder="비밀번호 재입력"
                />
                {formData.confirmPswd && (
                  <span
                    style={{
                      fontSize: "12px",
                      marginLeft: "10px",
                      color: isPasswordMatch ? "green" : "red",
                    }}
                  >
                    {isPasswordMatch ? "✔ 일치함" : "✘ 불일치"}
                  </span>
                )}
              </td>
            </tr>

            <tr>
              <td>이메일 입력</td>
              <td>
                <input
                  type="email"
                  name="empEmlAddr"
                  value={formData.empEmlAddr}
                  onChange={handleInputChange}
                  readOnly={isEmailVerified}
                  placeholder="company@email.com"
                />
                <Button
                  type="button"
                  onClick={handleSendAuthCode}
                  disabled={isEmailVerified}
                >
                  인증번호 전송
                </Button>
              </td>
            </tr>

            {isEmailSent && (
              <tr>
                <td>이메일 인증번호</td>
                <td>
                  <input
                    value={emailAuthCode}
                    onChange={(e) => setEmailAuthCode(e.target.value)}
                    placeholder="인증번호 입력"
                    readOnly={isEmailVerified}
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isEmailVerified}
                  >
                    {isEmailVerified ? "인증 성공" : "인증확인"}
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <Button
            type="submit"
            disabled={!isFormValid}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: isFormValid ? "#1976d2" : "#ccc",
              cursor: isFormValid ? "pointer" : "not-allowed",
            }}
          >
            등록 완료
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Employee_details;
