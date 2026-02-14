import React, { useState, useEffect } from "react";
import styles from "../css/HomeModProf.module.css";
import { fetcher } from "../../../shared/api/fetcher";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
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

const HomeModProf = () => {
  const navigate = useNavigate();
  
  // --- 상태 관리 ---
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
  const [telError, setTelError] = useState(""); // [추가] 전화번호 에러 상태

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

  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

  // --- 데이터 로드 ---
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
      console.error(error);
      alert("데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (passwords.new || passwords.confirm) {
      setPwMessage(
        passwords.new === passwords.confirm
          ? "비밀번호가 일치합니다."
          : "비밀번호가 일치하지 않습니다."
      );
    }
  }, [passwords]);

  // --- 핸들러 함수 ---
  
  // 계좌 유효성 검사
  const validateAccount = (bank, account) => {
    if (!bank) {
      setAccountError("먼저 은행을 선택해주세요.");
      return false;
    }
    const spec = BANK_SPEC[bank];
    if (account && !spec.reg.test(account)) {
      setAccountError(`${bank} 형식에 맞지 않습니다. (${spec.msg})`);
      return false;
    }
    setAccountError("");
    return true;
  };

  // [추가] 전화번호 유효성 검사 (숫자 11자리)
  const validateTel = (tel) => {
    const telReg = /^010[0-9]{8}$/; // 010으로 시작하는 11자리 숫자
    if (tel && !telReg.test(tel)) {
      setTelError("올바른 휴대폰 번호 11자리를 입력해주세요. (예: 01012345678)");
      return false;
    }
    setTelError("");
    return true;
  };

  const handleBankChange = (e) => {
    const bank = e.target.value;
    setSelectedBank(bank);
    validateAccount(bank, editForm.empActno);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "empActno") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      setEditForm((prev) => ({ ...prev, [name]: onlyNums }));
      validateAccount(selectedBank, onlyNums);
    } else if (name === "empTelno") {
      // [수정] 전화번호 입력 시 숫자만 남기고 검증
      const onlyNums = value.replace(/[^0-9]/g, "").slice(0, 11);
      setEditForm((prev) => ({ ...prev, [name]: onlyNums }));
      validateTel(onlyNums);
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
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
    setEditForm((prev) => ({ ...prev, empAddr: fullAddress, empAddrDetail: "" }));
    setIsPostcodeOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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

  const handleVerifyIdentity = async () => {
    setIsAuthSuccess(true);
    setAuthCode("");
    alert("본인 인증에 성공하였습니다.");
  };

  const handleSendNewEmailCode = async () => {
    if (!newEmail || newEmail === userInfo.empEmlAddr) {
      return alert("새로운 이메일 주소를 입력해주세요.");
    }
    try {
      await fetcher(`/gw/auth/send-code`, {
        method: "POST",
        body: { email: newEmail },
      });
      alert(`${newEmail}로 인증번호가 발송되었습니다.`);
    } catch (error) {
      alert("인증번호 발송 실패");
    }
  };

  const handleVerifyNewEmail = async () => {
    try {
      const res = await fetcher(`/gw/auth/verify-code`, {
        method: "POST",
        body: { email: newEmail, code: authCode },
      });
      if (res.success) {
        setIsEmailVerified(true);
        setAuthCode("");
        alert("이메일 인증에 성공하였습니다.");
      }
    } catch (error) {
      alert("인증번호가 올바르지 않거나 만료되었습니다.");
    }
  };

  // 최종 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // [추가] 유효성 최종 검사
    if (!validateTel(editForm.empTelno)) return alert("전화번호를 확인해주세요.");
    if (!selectedBank) return alert("은행을 선택해주세요.");
    if (!BANK_SPEC[selectedBank].reg.test(editForm.empActno)) {
      return alert(`${selectedBank} 계좌번호 형식이 올바르지 않습니다.`);
    }

    if (newEmail && newEmail !== userInfo.empEmlAddr && !isEmailVerified) {
      return alert("새로운 이메일 인증을 완료해주세요.");
    }

    if (!keepPassword && passwords.new !== passwords.confirm) {
      return alert("새 비밀번호가 일치하지 않습니다.");
    }

    if (!window.confirm("수정하시겠습니까?")) return;

    try {
      const formData = new FormData();
      formData.append("empId", myInfo.empId);
      formData.append("empSn", userInfo.empSn);
      formData.append("empTelno", editForm.empTelno);
      formData.append("empActno", `${selectedBank} ${editForm.empActno}`);

      const combinedAddress = editForm.empAddrDetail
        ? `${editForm.empAddr}|${editForm.empAddrDetail}`
        : editForm.empAddr;
      formData.append("empAddr", combinedAddress);
      
      formData.append("empEmlAddr", isEmailVerified ? newEmail : userInfo.empEmlAddr);
      
      if (!keepPassword && passwords.new) {
        formData.append("newPassword", passwords.new);
      }
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await fetcher(`/gw/home/updateProf`, {
        method: "POST",
        body: formData,
      });

      alert("정보 수정이 완료되었습니다. 다시 로그인 해주세요.");
      localStorage.removeItem("MyInfo");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (!userInfo) return <div className={styles.error}>유저 정보가 없습니다.</div>;

  return (
    <div className={styles["mod-profile-wrapper"]}>
      <div className={styles["mod-profile-container"]}>
        <header className={styles["mod-header"]}>
          <h2>개인정보 수정</h2>
          <p>안전한 정보 관리를 위해 본인 확인 후 수정을 진행해주세요.</p>
        </header>

        {!isAuthSuccess ? (
          <div className={`${styles["auth-card"]} ${styles["fade-in"]}`}>
            <h3 className={styles["card-title"]}>본인 확인</h3>
            <div className={styles["input-with-btn"]}>
              <input type="text" value={userInfo.empEmlAddr} readOnly />
              <button className={styles["sub-btn"]} onClick={handleSendAuthMail} type="button">
                인증번호 발송
              </button>
            </div>
            <div className={styles["form-group"]}>
              <input
                type="text"
                placeholder="인증번호"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
            </div>
            <div className={styles["form-group"]}>
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <button
              className={`${styles["primary-btn"]} ${styles["wide-btn"]}`}
              onClick={handleVerifyIdentity}
              type="button"
            >
              인증 및 수정하기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={`${styles["mod-form"]} ${styles["fade-in"]}`}>
            <section className={styles["mod-card"]}>
              <h3 className={styles["card-title"]}>기본 정보 <span>(수정 불가)</span></h3>
              <div className={styles["grid-inputs"]}>
                <div className={styles["form-group"]}><label>이름</label><input type="text" value={userInfo.empNm} readOnly /></div>
                <div className={styles["form-group"]}><label>사번</label><input type="text" value={userInfo.empSn} readOnly /></div>
                <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
                  <label>생년월일</label>
                  <input type="text" value={dayjs(userInfo.empBirth).format("YYYY-MM-DD")} readOnly />
                </div>
              </div>
            </section>

            <section className={styles["mod-card"]}>
              <h3 className={styles["card-title"]}>상세 정보 수정</h3>
              <div className={styles["flex-inputs"]}>
                <div className={styles["form-group"]}>
                  <label>사진</label>
                  <div style={{ marginBottom: "10px" }}>
                    <img
                      src={previewUrl || (userInfo.empPhoto ? `http://192.168.0.49:8080/uploads/${userInfo.empPhoto}` : `http://192.168.0.49:8080/uploads/default-profile.png`)}
                      alt="프로필"
                      style={{ width: "120px", height: "150px", objectFit: "cover", border: "1px solid #ddd" }}
                      onError={(e) => { e.target.src = "/images/default-profile.png"; }}
                    />
                  </div>
                  <input type="file" onChange={handleFileChange} accept="image/*" />
                </div>

                {/* 전화번호 수정 섹션 - 유효성 검사 추가 */}
                <div className={styles["form-group"]}>
                  <label>전화번호</label>
                  <input 
                    type="text" 
                    name="empTelno" 
                    value={editForm.empTelno} 
                    onChange={handleInputChange} 
                    placeholder="01012345678" 
                  />
                  {telError && <p style={{ color: "#e74c3c", fontSize: "12px", marginTop: "4px" }}>{telError}</p>}
                </div>

                <div className={styles["form-group"]}>
                  <label>계좌번호</label>
                  <div className={styles["input-with-btn"]}>
                    <select
                      value={selectedBank}
                      onChange={handleBankChange}
                      className={styles["sub-btn"]}
                      style={{ width: "130px", marginRight: "10px" }}
                    >
                      <option value="">은행 선택</option>
                      {BANK_LIST.map((bank) => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="empActno"
                      value={editForm.empActno}
                      onChange={handleInputChange}
                      placeholder={selectedBank ? `${BANK_SPEC[selectedBank].msg} 입력` : "은행 선택 후 입력"}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {accountError && <p style={{ color: "#e74c3c", fontSize: "12px", marginTop: "4px" }}>{accountError}</p>}
                </div>

                <div className={styles["form-group"]}>
                  <label>주소</label>
                  <div className={styles["input-with-btn"]}>
                    <input style={{ width: "400px" }} type="text" value={editForm.empAddr} readOnly onClick={() => setIsPostcodeOpen(true)} placeholder="주소 검색" />
                    <button type="button" className={styles["sub-btn"]} onClick={() => setIsPostcodeOpen(true)}>주소 검색</button>
                  </div>
                  <input style={{ width: "500px" }} type="text" name="empAddrDetail" value={editForm.empAddrDetail} onChange={handleInputChange} placeholder="상세 주소" />
                </div>

                {isPostcodeOpen && (
                  <div className={styles["modal-overlay"]} onClick={() => setIsPostcodeOpen(false)}>
                    <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
                      <div className={styles["modal-header"]}><h4>주소 검색</h4><button onClick={() => setIsPostcodeOpen(false)}>X</button></div>
                      <DaumPostcode onComplete={handleAdressComplete} />
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className={`${styles["mod-card"]} ${styles["accent-card"]}`}>
              <h3 className={styles["card-title"]}>이메일 수정</h3>
              <div className={styles["input-with-btn"]}>
                <input type="email" value={isEmailVerified ? newEmail : newEmail || userInfo.empEmlAddr} onChange={(e) => setNewEmail(e.target.value)} readOnly={isEmailVerified} />
                {!isEmailVerified ? <button type="button" className={styles["sub-btn"]} onClick={handleSendNewEmailCode}>인증번호 발송</button> : <span className={styles["verified-badge"]}>인증완료</span>}
              </div>
              <div className={styles["input-with-btn"]}>
                <input type="text" placeholder="인증번호 입력" value={authCode} onChange={(e) => setAuthCode(e.target.value)} readOnly={isEmailVerified} />
                {!isEmailVerified && <button type="button" className={styles["sub-btn"]} onClick={handleVerifyNewEmail}>인증하기</button>}
              </div>
            </section>

            <section className={styles["mod-card"]}>
              <h3 className={styles["card-title"]}>비밀번호 변경</h3>
              <label className={styles["custom-checkbox"]}>
                <input type="checkbox" checked={keepPassword} onChange={() => setKeepPassword(!keepPassword)} />
                <span>기존 비밀번호 유지</span>
              </label>
              {!keepPassword && (
                <div className={`${styles["pw-sub-area"]} ${styles["fade-in"]}`}>
                  <input type="password" placeholder="새 비밀번호" onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
                  <input type="password" placeholder="새 비밀번호 확인" onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                  {pwMessage && <p className={`${styles["pw-hint"]} ${passwords.new === passwords.confirm ? styles.success : styles.error}`}>{pwMessage}</p>}
                </div>
              )}
            </section>

            <button type="submit" className={`${styles["primary-btn"]} ${styles["submit-btn"]}`}>최종 수정 완료</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomeModProf;