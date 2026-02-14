import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { fetcher } from "../../../shared/api/fetcher";
import DaumPostcode from "react-daum-postcode";

// --- 은행별 정밀 검증 데이터 ---
const BANK_SPEC = {
  "NH농협": { reg: /^[0-9]{11,14}$/, msg: "11~14자리" },
  "KB국민": { reg: /^[0-9]{12,14}$/, msg: "12~14자리" },
  "신한": { reg: /^[0-9]{11,14}$/, msg: "11~14자리" },
  "우리": { reg: /^[0-9]{13}$/, msg: "13자리" },
  "하나": { reg: /^[0-9]{14}$/, msg: "14자리" },
  "IBK기업": { reg: /^[0-9]{10,14}$/, msg: "10~14자리" },
  "카카오뱅크": { reg: /^[0-9]{13}$/, msg: "13자리" },
  "토스뱅크": { reg: /^[0-9]{12}$/, msg: "12자리" },
};
const BANK_LIST = Object.keys(BANK_SPEC);

function Employee_details(props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const empSn = searchParams.get("empSn");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  // --- 상태 관리 ---
  const [formData, setFormData] = useState({
    empPhoto: null,
    empAddr: "",
    empAddrDetail: "",
    empTelno: "",
    empActno: "", // 순수 계좌 숫자만 관리
    empPswd: "",
    confirmPswd: "",
    empEmlAddr: "",
  });

  const [selectedBank, setSelectedBank] = useState(""); // 선택된 은행
  const [accountError, setAccountError] = useState(""); // 계좌 에러 메시지
  const [telError, setTelError] = useState(""); // 전화번호 에러 메시지
  
  const [emailAuthCode, setEmailAuthCode] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  // 비밀번호 일치 체크
  useEffect(() => {
    setIsPasswordMatch(
      formData.empPswd !== "" && formData.empPswd === formData.confirmPswd
    );
  }, [formData.empPswd, formData.confirmPswd]);

  // --- 유효성 검사 로직 ---
  const validateAccount = (bank, account) => {
    if (!bank) {
      setAccountError("먼저 은행을 선택해주세요.");
      return false;
    }
    const spec = BANK_SPEC[bank];
    if (account && !spec.reg.test(account)) {
      setAccountError(`${bank} 형식 불일치 (${spec.msg})`);
      return false;
    }
    setAccountError("");
    return true;
  };

  const validateTel = (tel) => {
    const telReg = /^010[0-9]{8}$/;
    if (tel && !telReg.test(tel)) {
      setTelError("010으로 시작하는 11자리 숫자를 입력하세요.");
      return false;
    }
    setTelError("");
    return true;
  };

  // --- 핸들러 ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "empActno") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyNums }));
      validateAccount(selectedBank, onlyNums);
    } else if (name === "empTelno") {
      const onlyNums = value.replace(/[^0-9]/g, "").slice(0, 11);
      setFormData((prev) => ({ ...prev, [name]: onlyNums }));
      validateTel(onlyNums);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBankChange = (e) => {
    const bank = e.target.value;
    setSelectedBank(bank);
    validateAccount(bank, formData.empActno);
  };

  const handleAdressComplete = (data) => {
    let fullAddress = data.address;
    if (data.addressType === "R") {
      let extraAddress = "";
      if (data.bname !== "") extraAddress += data.bname;
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    setFormData((prev) => ({ ...prev, empAddr: fullAddress, empAddrDetail: "" }));
    setIsPostcodeOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, empPhoto: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSendAuthCode = async () => {
    if (!formData.empEmlAddr) return alert("이메일을 입력해주세요.");
    try {
      await fetcher(`/gw/auth/send-code`, {
        method: "POST",
        body: { email: formData.empEmlAddr },
      });
      alert(`${formData.empEmlAddr}로 인증번호를 발송했습니다.`);
      setIsEmailSent(true);
    } catch (error) {
      alert("인증번호 발송에 실패했습니다.");
    }
  };

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

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();

    if (!validateTel(formData.empTelno)) return alert("전화번호 형식을 확인하세요.");
    if (!selectedBank) return alert("은행을 선택하세요.");
    if (!BANK_SPEC[selectedBank].reg.test(formData.empActno)) return alert("계좌번호 형식을 확인하세요.");

    if (!window.confirm("계정 등록을 완료하시겠습니까?")) return;

    const combinedAddr = formData.empAddrDetail
      ? `${formData.empAddr}|${formData.empAddrDetail}`
      : formData.empAddr;

    try {
      const uploadData = new FormData();
      uploadData.append("empSn", empSn);
      uploadData.append("empAddr", combinedAddr);
      uploadData.append("empTelno", formData.empTelno);
      // 은행명과 계좌번호 조합하여 전송
      uploadData.append("empActno", `${selectedBank} ${formData.empActno}`);
      uploadData.append("empPswd", formData.empPswd);
      uploadData.append("empEmlAddr", formData.empEmlAddr);
      if (formData.empPhoto) {
        uploadData.append("file", formData.empPhoto);
      }

      const res = await fetcher(`/gw/login/newEmp`, {
        method: "POST",
        body: uploadData,
      });

      if (res) {
        alert("등록이 완료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      }
    } catch (error) {
      alert("등록 중 오류가 발생했습니다: " + error.message);
    }
  };

  const isFormValid =
    formData.empAddr &&
    formData.empTelno.length === 11 &&
    formData.empActno &&
    selectedBank &&
    formData.empPswd &&
    isPasswordMatch &&
    isEmailVerified &&
    !accountError &&
    !telError;

  return (
    <div className="registration-container">
      <h2>신규 사원 계정 등록</h2>
      <form onSubmit={handleCompleteRegistration}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td>사진</td>
              <td>
                <div style={{ marginBottom: "10px" }}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="미리보기" style={{ width: "120px", height: "150px", objectFit: "cover", border: "1px solid #ddd" }} />
                  ) : (
                    <div style={{ width: "120px", height: "150px", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", border: "1px solid #ddd" }}>
                      사진 선택
                    </div>
                  )}
                </div>
                <input type="file" onChange={handleFileChange} accept="image/*" />
              </td>
            </tr>
            <tr>
              <td>주소</td>
              <td>
                <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                  <input value={formData.empAddr} readOnly placeholder="주소 검색을 클릭하세요" style={{ flex: 1, backgroundColor: "#f9f9f9" }} onClick={() => setIsPostcodeOpen(true)} />
                  <Button type="button" onClick={() => setIsPostcodeOpen(true)}>주소 검색</Button>
                </div>
                <input name="empAddrDetail" value={formData.empAddrDetail} onChange={handleInputChange} placeholder="상세 주소 입력" />
                {isPostcodeOpen && (
                  <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                      <div style={modalHeaderStyle}>
                        <strong>주소 검색</strong>
                        <button type="button" onClick={() => setIsPostcodeOpen(false)} style={{ border: "none", background: "none", fontSize: "20px" }}>&times;</button>
                      </div>
                      <DaumPostcode onComplete={handleAdressComplete} />
                    </div>
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <td>연락처</td>
              <td>
                <input name="empTelno" value={formData.empTelno} onChange={handleInputChange} placeholder="01012345678" />
                {telError && <p style={{ color: "red", fontSize: "12px", margin: "4px 0" }}>{telError}</p>}
              </td>
            </tr>
            <tr>
              <td>계좌번호</td>
              <td>
                <div style={{ display: "flex", gap: "10px" }}>
                  <select value={selectedBank} onChange={handleBankChange} style={{ padding: "8px" }}>
                    <option value="">은행 선택</option>
                    {BANK_LIST.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                  </select>
                  <input name="empActno" value={formData.empActno} onChange={handleInputChange} placeholder={selectedBank ? BANK_SPEC[selectedBank].msg : "은행을 먼저 선택하세요"} style={{ flex: 1 }} />
                </div>
                {accountError && <p style={{ color: "red", fontSize: "12px", margin: "4px 0" }}>{accountError}</p>}
              </td>
            </tr>
            <tr>
              <td>비밀번호</td>
              <td><input type="password" name="empPswd" value={formData.empPswd} onChange={handleInputChange} placeholder="새 비밀번호" /></td>
            </tr>
            <tr>
              <td>비밀번호 확인</td>
              <td>
                <input type="password" name="confirmPswd" value={formData.confirmPswd} onChange={handleInputChange} placeholder="비밀번호 재입력" />
                {formData.confirmPswd && (
                  <span style={{ fontSize: "12px", marginLeft: "10px", color: isPasswordMatch ? "green" : "red" }}>
                    {isPasswordMatch ? "✔ 일치함" : "✘ 불일치"}
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>이메일</td>
              <td>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input type="email" name="empEmlAddr" value={formData.empEmlAddr} onChange={handleInputChange} readOnly={isEmailVerified} placeholder="email@company.com" style={{ flex: 1 }} />
                  <Button type="button" onClick={handleSendAuthCode} disabled={isEmailVerified}>인증번호 전송</Button>
                </div>
              </td>
            </tr>
            {isEmailSent && (
              <tr>
                <td>인증번호</td>
                <td>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input value={emailAuthCode} onChange={(e) => setEmailAuthCode(e.target.value)} placeholder="인증번호 입력" readOnly={isEmailVerified} style={{ flex: 1 }} />
                    <Button type="button" onClick={handleVerifyCode} disabled={isEmailVerified}>
                      {isEmailVerified ? "인증 성공" : "인증 확인"}
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: "30px" }}>
          <Button
            type="submit"
            disabled={!isFormValid}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: isFormValid ? "#1976d2" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
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

// 스타일 객체는 기존 유지
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContentStyle = { width: "500px", height: "500px", backgroundColor: "#fff", borderRadius: "8px", display: "flex", flexDirection: "column", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" };
const modalHeaderStyle = { padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" };