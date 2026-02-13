import React, { useState, useEffect } from "react";
import styles from "../css/HomeModProf.module.css";
import { fetcher } from "../../../shared/api/fetcher";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import DaumPostcode from "react-daum-postcode"; // 주소 api

const HomeModProf = () => {
  const navigate = useNavigate();
  // --- 상태 관리 ---
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 이미지 경로
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false); // 모달 열림 상태

  // [추가] 선택된 이미지 파일 객체를 저장할 상태
  const [selectedFile, setSelectedFile] = useState(null);

  // 수정용 데이터 상태
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
      // 초기 폼 데이터 세팅
      const fullAddr = response.empAddr || "";
      const [base, detail] = fullAddr.includes("|")
        ? fullAddr.split("|")
        : [fullAddr, ""]; // 구분자 없으면 전체를 기본주소로
      setEditForm({
        empTelno: response.empTelno || "",
        empActno: response.empActno || "",
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

  // --- 실시간 검증 (비밀번호 일치 여부) ---
  useEffect(() => {
    if (passwords.new || passwords.confirm) {
      setPwMessage(
        passwords.new === passwords.confirm
          ? "비밀번호가 일치합니다."
          : "비밀번호가 일치하지 않습니다.",
      );
    }
  }, [passwords]);

  const handleAdressComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") extraAddress += data.bname;
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setEditForm((prev) => ({
      ...prev,
      empAddr: fullAddress, // 기본 주소 입력
      empAddrDetail: "", // 주소가 바뀌면 상세주소 초기화 (선택사항)
    }));
    setIsPostcodeOpen(false);

    // 상세 주소 입력창으로 포커스 이동 (선택사항)
    document.getElementsByName("empAddrDetail")[0]?.focus();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // 파일 객체 저장
      const url = URL.createObjectURL(file);
      setPreviewUrl(url); // 미리보기 URL 생성
    }
  };

  // --- 이벤트 핸들러 ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // 본인확인 메일 발송
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

  // 1단계: 본인 확인 (인증번호 + 현재 비밀번호)
  const handleVerifyIdentity = async () => {
    // try {
    //   const res = await fetcher(`/gw/auth/verify-indentity`, {
    //     method: "POST",
    //     body: {
    //       empSn: userInfo.empSn,
    //       email: userInfo.empEmlAddr,
    //       code: authCode,
    //       password: currentPassword,
    //     },
    //   });

    //   if (res.success) {
    setIsAuthSuccess(true);
    setAuthCode("");
    alert("본인 인증에 성공하였습니다.");
    //   }
    // } catch (error) {
    //   alert("비밀번호 또는 인증번호가 유효하지 않습니다.");
    // }
  };

  // 새 이메일 인증번호 발송
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

  // 새 이메일 인증번호 확인
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
      formData.append("empActno", editForm.empActno);
      const combinedAddress = editForm.empAddrDetail
        ? `${editForm.empAddr}|${editForm.empAddrDetail}`
        : editForm.empAddr;
      formData.append("empAddr", combinedAddress);
      formData.append(
        "empEmlAddr",
        isEmailVerified ? newEmail : userInfo.empEmlAddr,
      );
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
  if (!userInfo)
    return <div className={styles.error}>유저 정보가 없습니다.</div>;

  return (
    <div className={styles["mod-profile-wrapper"]}>
      <div className={styles["mod-profile-container"]}>
        <header className={styles["mod-header"]}>
          <h2>개인정보 수정</h2>
          <p>안전한 정보 관리를 위해 본인 확인 후 수정을 진행해주세요.</p>
        </header>

        {!isAuthSuccess ? (
          /* --- 1단계: 인증 섹션 --- */
          <div className={`${styles["auth-card"]} ${styles["fade-in"]}`}>
            <h3 className={styles["card-title"]}>본인 확인</h3>
            <div className={styles["input-with-btn"]}>
              <input type="text" value={userInfo.empEmlAddr} readOnly />
              <button
                className={styles["sub-btn"]}
                onClick={handleSendAuthMail}
                type="button"
              >
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
          /* --- 2단계: 수정 폼 섹션 --- */
          <form
            onSubmit={handleSubmit}
            className={`${styles["mod-form"]} ${styles["fade-in"]}`}
          >
            <section className={styles["mod-card"]}>
              <h3 className={styles["card-title"]}>
                기본 정보 <span>(수정 불가)</span>
              </h3>
              <div className={styles["grid-inputs"]}>
                <div className={styles["form-group"]}>
                  <label>이름</label>
                  <input type="text" value={userInfo.empNm} readOnly />
                </div>
                <div className={styles["form-group"]}>
                  <label>사번</label>
                  <input type="text" value={userInfo.empSn} readOnly />
                </div>
                <div
                  className={`${styles["form-group"]} ${styles["full-width"]}`}
                >
                  <label>생년월일</label>
                  <input
                    type="text"
                    value={dayjs(userInfo.empBirth).format("YYYY-MM-DD")}
                    readOnly
                  />
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
                      // 1순위: 새로 선택한 파일(previewUrl), 2순위: 기존 DB 사진, 3순위: 기본 이미지
                      src={
                        previewUrl
                          ? previewUrl
                          : userInfo.empPhoto
                            ? `http://192.168.0.49:8080/uploads/${userInfo.empPhoto}`
                            : `http://192.168.0.49:8080/uploads/default-profile.png`
                      }
                      alt="프로필 미리보기"
                      style={{
                        width: "120px",
                        height: "150px",
                        objectFit: "cover",
                        border: "1px solid #ddd",
                      }}
                      onError={(e) => {
                        e.target.src = "/images/default-profile.png";
                      }}
                    />
                  </div>
                  <input
                    type="file"
                    name="empPhoto"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>전화번호</label>
                  <input
                    type="text"
                    name="empTelno"
                    value={editForm.empTelno}
                    onChange={handleInputChange}
                    placeholder="010-0000-0000"
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>계좌번호</label>
                  <input
                    type="text"
                    name="empActno"
                    value={editForm.empActno}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>주소</label>
                  <div className={styles["input-with-btn"]}>
                    <input
                      style={{ width: "400px" }}
                      type="text"
                      name="empAddr"
                      value={editForm.empAddr}
                      placeholder="주소 검색을 이용해주세요."
                      readOnly // 직접 입력 방지
                      onClick={() => setIsPostcodeOpen(true)} // 클릭 시 팝업
                    />
                    <button
                      type="button"
                      className={styles["sub-btn"]}
                      onClick={() => setIsPostcodeOpen(true)}
                    >
                      주소 검색
                    </button>
                  </div>
                  {/* 상세 주소 입력 줄 */}
                  <input
                    style={{ width: "500px" }}
                    type="text"
                    name="empAddrDetail"
                    value={editForm.empAddrDetail}
                    onChange={handleInputChange}
                    placeholder="상세 주소를 입력하세요 (동, 호수 등)"
                  />
                </div>

                {/* --- 주소 검색 모달 --- */}
                {isPostcodeOpen && (
                  <div
                    className={styles["modal-overlay"]}
                    onClick={() => setIsPostcodeOpen(false)}
                  >
                    <div
                      className={styles["modal-content"]}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles["modal-header"]}>
                        <h4>주소 검색</h4>
                        <button onClick={() => setIsPostcodeOpen(false)}>
                          X
                        </button>
                      </div>
                      <DaumPostcode onComplete={handleAdressComplete} />
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section
              className={`${styles["mod-card"]} ${styles["accent-card"]}`}
            >
              <h3 className={styles["card-title"]}>이메일 수정</h3>
              <div className={styles["input-with-btn"]}>
                <input
                  type="email"
                  placeholder="새로운 이메일 주소"
                  value={
                    isEmailVerified ? newEmail : newEmail || userInfo.empEmlAddr
                  }
                  onChange={(e) => setNewEmail(e.target.value)}
                  readOnly={isEmailVerified}
                />
                {!isEmailVerified ? (
                  <button
                    type="button"
                    className={styles["sub-btn"]}
                    onClick={handleSendNewEmailCode}
                  >
                    인증번호 발송
                  </button>
                ) : (
                  <span className={styles["verified-badge"]}>인증완료</span>
                )}
              </div>
              <div className={styles["input-with-btn"]}>
                <input
                  type="text"
                  placeholder="인증번호 입력"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  readOnly={isEmailVerified}
                />
                {!isEmailVerified ? (
                  <button
                    type="button"
                    className={styles["sub-btn"]}
                    onClick={handleVerifyNewEmail}
                  >
                    인증하기
                  </button>
                ) : (
                  <span className={styles["verified-badge"]}>인증완료</span>
                )}
              </div>
            </section>

            <section className={styles["mod-card"]}>
              <h3 className={styles["card-title"]}>비밀번호 변경</h3>
              <label className={styles["custom-checkbox"]}>
                <input
                  type="checkbox"
                  checked={keepPassword}
                  onChange={() => setKeepPassword(!keepPassword)}
                />
                <span>기존 비밀번호 유지</span>
              </label>

              {!keepPassword && (
                <div
                  className={`${styles["pw-sub-area"]} ${styles["fade-in"]}`}
                >
                  <input
                    type="password"
                    placeholder="새 비밀번호"
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="새 비밀번호 확인"
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                  />
                  {pwMessage && (
                    <p
                      className={`${styles["pw-hint"]} ${passwords.new === passwords.confirm ? styles.success : styles.error}`}
                    >
                      {pwMessage}
                    </p>
                  )}
                </div>
              )}
            </section>

            <button
              type="submit"
              className={`${styles["primary-btn"]} ${styles["submit-btn"]}`}
            >
              최종 수정 완료
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomeModProf;
