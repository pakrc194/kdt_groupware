import React, { useState, useEffect } from "react";
import "../css/HomeModProf.css";
import { fetcher } from "../../../shared/api/fetcher";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import DaumPostcode from "react-daum-postcode";

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

const HomeModProf = () => {
  const navigate = useNavigate();
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedBank, setSelectedBank] = useState("");
  const [accountError, setAccountError] = useState("");
  const [telError, setTelError] = useState("");
  const [pwError, setPwError] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [keepPassword, setKeepPassword] = useState(true);
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [pwMessage, setPwMessage] = useState("");
  const [editForm, setEditForm] = useState({
    empTelno: "",
    empActno: "",
    empAddr: "",
    empAddrDetail: "",
  });

  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pwReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetcher(`/gw/home/modProf?empId=${myInfo.empId}`);
        setUserInfo(response);

        const fullAddr = response.empAddr || "";
        const [base, detail] = fullAddr.includes("|") ? fullAddr.split("|") : [fullAddr, ""];

        const fullActno = response.empActno || "";
        let bank = "";
        let accNum = "";
        if (fullActno.includes(" ")) {
          [bank, accNum] = fullActno.split(" ");
        } else {
          accNum = fullActno;
        }

        setSelectedBank(bank);
        setEditForm({
          empTelno: response.empTelno || "",
          empActno: accNum,
          empAddr: base,
          empAddrDetail: detail,
        });
      } catch (error) {
        alert("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [myInfo.empId]);

  useEffect(() => {
    if (keepPassword) {
      setPwMessage("");
      setPwError("");
      return;
    }
    if (passwords.new || passwords.confirm) {
      const isMatch = passwords.new === passwords.confirm;
      setPwMessage(isMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.");
      if (passwords.new && !pwReg.test(passwords.new)) {
        setPwError("8자 이상, 영문, 숫자, 특수문자를 조합해주세요.");
      } else {
        setPwError("");
      }
    }
  }, [passwords, keepPassword]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("이미지 파일(jpg, png)만 업로드 가능합니다.");
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("파일 크기는 10MB 이하만 가능합니다.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "empActno" || name === "empTelno") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      const limitedValue = name === "empTelno" ? onlyNums.slice(0, 11) : onlyNums;
      setEditForm((prev) => ({ ...prev, [name]: limitedValue }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
  };

  const handleAdressComplete = (data) => {
    setEditForm((prev) => ({ ...prev, empAddr: data.address, empAddrDetail: "" }));
    setIsPostcodeOpen(false);
  };

  const handleVerifyIdentity = async () => {
    try {
      const res = await fetcher(`/gw/auth/verify-indentity`, {
        method: "POST",
        body: {
          email: userInfo.empEmlAddr,
          password: currentPassword,
          code: authCode,
          empSn: userInfo.empSn,
        },
      });
      if (res && res.success) {
        setIsAuthSuccess(true);
        setAuthCode("");
        setCurrentPassword("");
      } else {
        alert("인증 정보가 올바르지 않습니다.");
      }
    } catch (error) {
      alert("인증 정보가 올바르지 않습니다.");
    }
  };

  const handleSendAuthMail = async () => {
    try {
      await fetcher(`/gw/auth/send-code`, {
        method: "POST",
        body: { email: userInfo.empEmlAddr },
      });
      alert(`${userInfo.empEmlAddr}로 인증번호를 발송했습니다.`);
    } catch (error) {
      alert("인증번호 발송에 실패했습니다.");
    }
  };

  const handleSendNewEmailCode = async () => {
    if (!newEmail || newEmail === userInfo.empEmlAddr) return alert("새로운 이메일 주소를 입력해주세요.");
    if (!emailReg.test(newEmail)) return alert("올바른 이메일 형식이 아닙니다.");
    try {
      await fetcher(`/gw/auth/send-code`, { method: "POST", body: { email: newEmail } });
      alert(`${newEmail}로 인증번호가 발송되었습니다.`);
    } catch (error) { alert("인증번호 발송 실패"); }
  };

  const handleVerifyNewEmail = async () => {
    try {
      const res = await fetcher(`/gw/auth/verify-code`, { 
        method: "POST", 
        body: { email: newEmail, code: authCode } 
      });
      if (res.success) {
        setIsEmailVerified(true);
        setAuthCode("");
        alert("이메일 인증에 성공하였습니다.");
      }
    } catch (error) { alert("인증번호가 올바르지 않거나 만료되었습니다."); }
  };

  const isFormValid = 
    editForm.empTelno.length === 11 &&
    selectedBank !== "" &&
    (newEmail === "" || isEmailVerified) &&
    (keepPassword || (passwords.new === passwords.confirm && pwReg.test(passwords.new)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return alert("입력하신 정보를 다시 확인해주세요.");
    if (!window.confirm("수정하시겠습니까?")) return;

    try {
      const formData = new FormData();
      formData.append("empId", myInfo.empId);
      formData.append("empSn", userInfo.empSn);
      formData.append("empTelno", editForm.empTelno);
      formData.append("empActno", `${selectedBank} ${editForm.empActno}`);
      const combinedAddress = editForm.empAddrDetail ? `${editForm.empAddr}|${editForm.empAddrDetail}` : editForm.empAddr;
      formData.append("empAddr", combinedAddress);
      formData.append("empEmlAddr", isEmailVerified ? newEmail : userInfo.empEmlAddr);
      if (!keepPassword && passwords.new) formData.append("newPassword", passwords.new);
      if (selectedFile) formData.append("file", selectedFile);

      await fetcher(`/gw/home/updateProf`, { method: "POST", body: formData });
      alert("정보 수정이 완료되었습니다. 다시 로그인 해주세요.");
      localStorage.clear();
      navigate("/login");
    } catch (error) { alert("수정 중 오류가 발생했습니다."); }
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (!userInfo) return <div className="error">유저 정보가 없습니다.</div>;

  return (
    <div className="mod-profile-wrapper">
      <div className="mod-profile-container">
        <header className="mod-header">
          <h2>개인정보 수정</h2>
          <p>안전한 정보 관리를 위해 본인 확인 후 수정을 진행해주세요.</p>
        </header>

        {!isAuthSuccess ? (
          <div className="auth-card fade-in">
            <h3 className="card-title">본인 확인</h3>
            <div className="input-with-btn">
              <input type="text" className="mod-input" value={userInfo.empEmlAddr} readOnly />
              <button className="sub-btn" onClick={handleSendAuthMail} type="button">인증번호 발송</button>
            </div>
            <div className="form-group" style={{ marginTop: '15px' }}>
              <input type="text" className="mod-input" placeholder="인증번호" value={authCode} onChange={(e) => setAuthCode(e.target.value)} />
            </div>
            <div className="form-group">
              <input type="password" className="mod-input" placeholder="현재 비밀번호" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <button className="primary-btn wide-btn" onClick={handleVerifyIdentity} type="button">인증 및 수정하기</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mod-form fade-in">
            <section className="mod-card">
              <h3 className="card-title">기본 정보 <span>(수정 불가)</span></h3>
              <div className="grid-inputs">
                <div className="form-group"><label>이름</label><input type="text" className="mod-input" value={userInfo.empNm} readOnly /></div>
                <div className="form-group"><label>사번</label><input type="text" className="mod-input" value={userInfo.empSn} readOnly /></div>
                <div className="form-group full-width">
                  <label>생년월일</label>
                  <input type="text" className="mod-input" value={dayjs(userInfo.empBirth).format("YYYY-MM-DD")} readOnly />
                </div>
              </div>
            </section>

            <section className="mod-card">
              <h3 className="card-title">상세 정보 수정</h3>
              <div className="photo-section">
                <div className="photo-preview-container">
                  {previewUrl || userInfo.empPhoto ? (
                    <img
                      src={previewUrl || `http://192.168.0.49:8080/uploads/${userInfo.empPhoto}`}
                      alt="프로필"
                      className="photo-img"
                      onError={(e) => { e.target.src = "/images/default-profile.png"; }}
                    />
                  ) : (
                    <div className="photo-placeholder">사진 없음</div>
                  )}
                  <label htmlFor="photo-upload" className="photo-upload-label">사진 변경</label>
                  <input id="photo-upload" type="file" style={{ display: 'none' }} onChange={handleFileChange} accept=".jpg, .jpeg, .png" />
                </div>
                <p className="photo-hint">* 10MB 이하의 JPG, PNG 파일</p>
              </div>

              <div className="form-group">
                <label>전화번호</label>
                <input type="text" className="mod-input" name="empTelno" value={editForm.empTelno} onChange={handleInputChange} placeholder="01012345678" />
                {telError && <p className="error-text">{telError}</p>}
              </div>

              <div className="form-group">
                <label>계좌번호</label>
                <div className="input-with-btn">
                  <select value={selectedBank} onChange={handleBankChange} className="mod-select" style={{ width: '150px' }}>
                    <option value="">은행 선택</option>
                    {BANK_LIST.map((bank) => (<option key={bank} value={bank}>{bank}</option>))}
                  </select>
                  <input type="text" className="mod-input" name="empActno" value={editForm.empActno} onChange={handleInputChange} placeholder="숫자만 입력" />
                </div>
                {accountError && <p className="error-text">{accountError}</p>}
              </div>

              <div className="form-group">
                <label>주소</label>
                <div className="input-with-btn">
                  <input type="text" className="mod-input" value={editForm.empAddr} readOnly onClick={() => setIsPostcodeOpen(true)} placeholder="주소 검색" />
                  <button type="button" className="sub-btn" onClick={() => setIsPostcodeOpen(true)}>검색</button>
                </div>
                <input type="text" className="mod-input" style={{ marginTop: '10px' }} name="empAddrDetail" value={editForm.empAddrDetail} onChange={handleInputChange} placeholder="상세 주소(선택)" />
              </div>
            </section>

            <section className="mod-card accent-card">
              <h3 className="card-title">이메일 수정</h3>
              <div className="form-group">
                <label>새 이메일 주소</label>
                <div className="input-with-btn">
                  <input 
                    type="email" 
                    className="mod-input"
                    value={newEmail || (isEmailVerified ? "" : userInfo.empEmlAddr)} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    readOnly={isEmailVerified} 
                    placeholder="새 이메일 입력" 
                  />
                  {!isEmailVerified ? (
                    <button type="button" className="sub-btn" onClick={handleSendNewEmailCode}>발송</button>
                  ) : (
                    <span className="verified-badge">인증완료</span>
                  )}
                </div>
              </div>
              {!isEmailVerified && (
                <div className="form-group" style={{ marginTop: '10px' }}>
                  <label>인증번호 확인</label>
                  <div className="input-with-btn">
                    <input type="text" className="mod-input" placeholder="6자리 입력" value={authCode} onChange={(e) => setAuthCode(e.target.value)} />
                    <button type="button" className="sub-btn" onClick={handleVerifyNewEmail}>인증</button>
                  </div>
                </div>
              )}
            </section>

            <section className="mod-card">
              <h3 className="card-title">비밀번호 변경</h3>
              <label className="custom-checkbox">
                <input type="checkbox" checked={keepPassword} onChange={() => setKeepPassword(!keepPassword)} />
                <span>기존 비밀번호 유지</span>
              </label>
              {!keepPassword && (
                <div className="pw-sub-area">
                  <input type="password" className="mod-input" placeholder="새 비밀번호" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
                  <input type="password" className="mod-input" placeholder="새 비밀번호 확인" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                  {pwMessage && <p className={`pw-hint ${passwords.new === passwords.confirm && !pwError ? 'success' : 'error'}`}>{pwMessage}</p>}
                </div>
              )}
            </section>

            <button type="submit" className="primary-btn submit-btn" disabled={!isFormValid} style={{ backgroundColor: isFormValid ? "" : "#ccc" }}>최종 수정 완료</button>
          </form>
        )}
      </div>

      {isPostcodeOpen && (
        <div className="modal-overlay" onClick={() => setIsPostcodeOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>주소 검색</h4>
              <button type="button" className="close-btn" onClick={() => setIsPostcodeOpen(false)}>X</button>
            </div>
            <DaumPostcode onComplete={handleAdressComplete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeModProf;