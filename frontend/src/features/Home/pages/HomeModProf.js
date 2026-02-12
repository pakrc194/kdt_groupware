import React, { useState, useEffect } from "react";
import styles from "../css/HomeModProf.module.css";
import { fetcher } from "../../../shared/api/fetcher";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const HomeModProf = () => {
  const navigate = useNavigate();
  // --- 상태 관리 ---
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

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
  });

  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
  console.log(myInfo.empId);
  console.log(myInfo.empSn);

  // --- 데이터 로드 ---
  const fetchUserData = async () => {
    try {
      const response = await fetcher(`/gw/home/modProf?empId=${myInfo.empId}`);
      setUserInfo(response);
      // 초기 폼 데이터 세팅
      setEditForm({
        empTelno: response.empTelno || "",
        empActno: response.empActno || "",
        empAddr: response.empAddr || "",
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
    try {
      const res = await fetcher(`/gw/auth/verify-indentity`, {
        method: "POST",
        body: {
          empSn: userInfo.empSn,
          email: userInfo.empEmlAddr,
          code: authCode,
          password: currentPassword,
        },
      });

      if (res.success) {
        setIsAuthSuccess(true);
        setAuthCode("");
        alert("본인 인증에 성공하였습니다.");
      }
    } catch (error) {
      alert("비밀번호 또는 인증번호가 유효하지 않습니다.");
    }
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
      const updateData = {
        empId: myInfo.empId,
        ...editForm,
        empEmlAddr: isEmailVerified ? newEmail : userInfo.empEmlAddr,
        newPassword: keepPassword ? null : passwords.new,
      };

      await fetcher(`/gw/home/updateProf`, {
        method: "POST",
        body: updateData,
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
                  <input
                    type="text"
                    name="empAddr"
                    value={editForm.empAddr}
                    onChange={handleInputChange}
                  />
                </div>
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
