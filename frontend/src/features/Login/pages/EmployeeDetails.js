import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { fetcher } from "../../../shared/api/fetcher";
import DaumPostcode from "react-daum-postcode";
import "../css/EmployeeDetails.css"; // 아래 제공할 CSS 파일을 임포트하세요

function EmployeeDetails(props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const empSn = searchParams.get("empSn");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  // --- 상태 관리 (기존과 동일) ---
  const [formData, setFormData] = useState({
    empPhoto: null,
    empAddr: "",
    empAddrDetail: "",
    empTelno: "",
    empActno: "", 
    empPswd: "",
    confirmPswd: "",
    empEmlAddr: "",
  });

  const [selectedBank, setSelectedBank] = useState("");
  const [accountError, setAccountError] = useState("");
  const [telError, setTelError] = useState("");
  const [pwError, setPwError] = useState("");
  const [emailAuthCode, setEmailAuthCode] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  // --- 기존 유효성 검사/핸들러 로직 (동일하게 유지) ---
  const validatePasswordComplexity = (pw) => {
    const pwReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (pw && !pwReg.test(pw)) {
      setPwError("8자 이상, 영문, 숫자, 특수문자 조합 필수");
      return false;
    }
    setPwError("");
    return true;
  };

  const validateEmailFormat = (email) => {
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailReg.test(email);
  };

  useEffect(() => {
    setIsPasswordMatch(formData.empPswd !== "" && formData.empPswd === formData.confirmPswd);
    validatePasswordComplexity(formData.empPswd);
  }, [formData.empPswd, formData.confirmPswd]);

  const validateAccount = (bank, account) => {
    if (!bank) return false;
    const spec = BANK_SPEC[bank];
    if (account && !spec.reg.test(account)) {
      setAccountError(`${spec.msg}`);
      return false;
    }
    setAccountError("");
    return true;
  };

  const validateTel = (tel) => {
    const telReg = /^010[0-9]{8}$/;
    if (tel && !telReg.test(tel)) {
      setTelError("010 포함 11자리 숫자");
      return false;
    }
    setTelError("");
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "empActno" || name === "empTelno") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      const limitedValue = name === "empTelno" ? onlyNums.slice(0, 11) : onlyNums;
      setFormData((prev) => ({ ...prev, [name]: limitedValue }));
      if (name === "empActno") validateAccount(selectedBank, limitedValue);
      if (name === "empTelno") validateTel(limitedValue);
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
    setFormData((prev) => ({ ...prev, empAddr: fullAddress, empAddrDetail: "" }));
    setIsPostcodeOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. 파일 확장자 체크 (MIME type 활용)
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("이미지 파일(jpg, png)만 업로드 가능합니다.");
      e.target.value = ""; // input 초기화
      return;
    }

    // 2. 파일 크기 체크 (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("파일 크기는 10MB 이하만 가능합니다.");
      e.target.value = ""; // input 초기화
      return;
    }

    // 검증 통과 시 상태 업데이트
    setFormData((prev) => ({ ...prev, empPhoto: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSendAuthCode = async () => {
    if (!validateEmailFormat(formData.empEmlAddr)) return alert("이메일 형식을 확인하세요.");
    try {
      await fetcher(`/gw/auth/send-code`, { method: "POST", body: { email: formData.empEmlAddr } });
      alert("인증번호가 발송되었습니다.");
      setIsEmailSent(true);
    } catch (error) { alert("발송 실패"); }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await fetcher(`/gw/auth/verify-code`, { method: "POST", body: { email: formData.empEmlAddr, code: emailAuthCode } });
      if (res.success) { alert("인증 성공"); setIsEmailVerified(true); }
    } catch (error) { alert("인증 실패"); }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    if (!window.confirm("계정 등록을 완료하시겠습니까?")) return;
    const combinedAddr = formData.empAddrDetail ? `${formData.empAddr}|${formData.empAddrDetail}` : formData.empAddr;
    try {
      const uploadData = new FormData();
      uploadData.append("empSn", empSn);
      uploadData.append("empAddr", combinedAddr);
      uploadData.append("empTelno", formData.empTelno);
      uploadData.append("empActno", `${selectedBank} ${formData.empActno}`);
      uploadData.append("empPswd", formData.empPswd);
      uploadData.append("empEmlAddr", formData.empEmlAddr);
      if (formData.empPhoto) uploadData.append("file", formData.empPhoto);

      const res = await fetcher(`/gw/login/newEmp`, { method: "POST", body: uploadData });
      if (res) { alert("등록 완료!"); navigate("/login"); }
    } catch (error) { alert("오류 발생"); }
  };

  const isFormValid = formData.empPhoto && formData.empAddr && formData.empTelno.length === 11 && selectedBank && formData.empPswd && !pwError && isPasswordMatch && isEmailVerified;

  return (
    <div className="reg-page-bg">
      <div className="reg-card">
        <div className="reg-header">
          <h2>신규 사원 계정 등록</h2>
          <p>회원님의 소중한 정보를 안전하게 입력해주세요.</p>
        </div>

        <form onSubmit={handleCompleteRegistration} className="reg-form">
          {/* 사진 업로드 섹션 */}
          <div className="photo-section">
            <div className="photo-preview-container">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="photo-img" />
              ) : (
                <div className="photo-placeholder">
                  <span>Photo</span>
                </div>
              )}
              <label className="photo-upload-btn">
                사진 선택
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".jpg, .jpeg, .png" // 브라우저 파일 선택창에서 이미지 외 차단
                  hidden 
                />
              </label>
            </div>
            <p className="photo-hint" style={{textAlign:"center"}}>증명사진 규격(3x4) 권장<br/>* 10MB 이하의 JPG, PNG 파일만 가능합니다.</p>
          </div>

          <div className="input-grid">
            {/* 연락처 */}
            <div className="input-group">
              <label>연락처 <span className="required">*</span></label>
              <input name="empTelno" value={formData.empTelno} onChange={handleInputChange} placeholder="01012345678" className={telError ? "input-error" : ""} />
              {telError && <span className="error-text">{telError}</span>}
            </div>

            {/* 계좌번호 */}
            <div className="input-group">
              <label>급여 계좌 <span className="required">*</span></label>
              <div className="flex-row">
                <select value={selectedBank} onChange={handleBankChange} className="bank-select">
                  <option value="">은행</option>
                  {BANK_LIST.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                </select>
                <input name="empActno" value={formData.empActno} onChange={handleInputChange} placeholder="계좌번호 (-없이)" style={{flex: 1}} />
              </div>
              {accountError && <span className="error-text">{accountError}</span>}
            </div>

            {/* 주소 */}
            <div className="input-group full-width">
              <label>주소 <span className="required">*</span></label>
              <div className="flex-row mb-8">
                <input value={formData.empAddr} readOnly placeholder="주소 검색을 클릭하세요" className="readonly-input" />
                <Button type="button" onClick={() => setIsPostcodeOpen(true)} className="small-btn">검색</Button>
              </div>
              <input name="empAddrDetail" value={formData.empAddrDetail} onChange={handleInputChange} placeholder="상세 주소를 입력하세요" />
            </div>

            {/* 비밀번호 */}
            <div className="input-group">
              <label>비밀번호 <span className="required">*</span></label>
              <input type="password" name="empPswd" value={formData.empPswd} onChange={handleInputChange} placeholder="영문, 숫자, 특수문자 조합 (8자↑)" />
              {pwError && <span className="error-text">{pwError}</span>}
            </div>

            {/* 비밀번호 확인 */}
            <div className="input-group">
              <label>비밀번호 확인 <span className="required">*</span></label>
              <input type="password" name="confirmPswd" value={formData.confirmPswd} onChange={handleInputChange} />
              {formData.confirmPswd && (
                <span className={`status-text ${isPasswordMatch ? "success" : "error"}`}>
                  {isPasswordMatch ? "✔ 비밀번호가 일치합니다." : "✘ 불일치"}
                </span>
              )}
            </div>

            {/* 이메일 인증 */}
            <div className="input-group full-width">
              <label>이메일 인증 <span className="required">*</span></label>
              <div className="flex-row mb-8">
                <input type="email" name="empEmlAddr" value={formData.empEmlAddr} onChange={handleInputChange} readOnly={isEmailVerified} placeholder="company@email.com" />
                <Button type="button" onClick={handleSendAuthCode} disabled={isEmailVerified} className="small-btn">코드 발송</Button>
              </div>
              {isEmailSent && !isEmailVerified && (
                <div className="flex-row animate-fade-in">
                  <input value={emailAuthCode} onChange={(e) => setEmailAuthCode(e.target.value)} placeholder="인증코드 6자리" />
                  <Button type="button" onClick={handleVerifyCode} className="small-btn verify-btn">확인</Button>
                </div>
              )}
              {isEmailVerified && <span className="status-text success">✔ 이메일 인증이 완료되었습니다.</span>}
            </div>
          </div>

          <button type="submit" disabled={!isFormValid} className={`submit-btn ${isFormValid ? "active" : ""}`}>
            등록 완료
          </button>
        </form>
      </div>

      {/* 우편번호 모달 */}
      {isPostcodeOpen && (
        <div className="modal-overlay" onClick={() => setIsPostcodeOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>주소 검색</h3>
              <button onClick={() => setIsPostcodeOpen(false)}>&times;</button>
            </div>
            <DaumPostcode onComplete={handleAdressComplete} style={{ height: "450px" }} />
          </div>
        </div>
      )}
    </div>
  );
}

// 기존 데이터 상수 (BANK_SPEC 등)은 동일하게 유지
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

export default EmployeeDetails;