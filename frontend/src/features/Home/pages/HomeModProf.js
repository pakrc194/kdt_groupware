import React, { useState, useEffect } from "react";
// import "../css/HomeModProf.css";
import { fetcher } from "../../../shared/api/fetcher";
import dayjs from "dayjs";

const HomeModProf = () => {
  // 상태 관리
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [authCode, setAuthCode] = useState("");

  // 사용자 데이터 (기본값)
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 수정용 상태
  const [newEmail, setNewEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [keepPassword, setKeepPassword] = useState(true); // 비밀번호 유지 체크박스
  const [passwords, setPasswords] = useState({ new: "", confirm: "" }); // 비밀번호 변경 - 재확인
  const [pwMessage, setPwMessage] = useState(""); // 비밀번호 일치여부 메세지

  const fetchUserData = async () => {
    try {
      const response = await fetcher("/gw/home/modProf?empId=10");
      setUserInfo(response); // 가져온 데이터로 상태 업데이트
    } catch (error) {
      console.error(error);
      alert("데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    if (passwords.new || passwords.confirm) {
      setPwMessage(
        passwords.new === passwords.confirm
          ? "비밀번호가 일치합니다."
          : "비밀번호가 일치하지 않습니다.",
      );
    }
    fetchUserData();
  }, [passwords]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSendAuthMail = () =>
    alert(`${userInfo.email}로 인증번호를 발송했습니다.`);

  const handleVerifyIdentity = () => {
    if (authCode === "1234" && currentPassword === "1234") {
      setIsAuthSuccess(true);
      alert("본인 인증에 성공하였습니다.");
    } else {
      alert("비밀번호 또는 인증번호가 올바르지 않습니다.");
    }
  };

  const handleVerifyNewEmail = () => {
    if (authCode === "1234") {
      setIsEmailVerified(true);
      alert("이메일 인증에 성공하였습니다.");
    } else {
      alert("비밀번호 또는 인증번호가 올바르지 않습니다.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("수정하시겠습니까?")) {
      // 이메일 인증 안 했으면 기존 이메일 유지 로직 포함 가능
      alert("정보 수정이 완료되었습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!userInfo) return <div>유저 정보가 없습니다.</div>;

  return (
    <div className="mod-profile-wrapper">
      <div className="mod-profile-container">
        <header className="mod-header">
          <h2>개인정보 수정</h2>
          <p>안전한 정보 관리를 위해 본인 확인 후 수정을 진행해주세요.</p>
        </header>

        {!isAuthSuccess ? (
          /* --- 1단계: 인증 섹션 --- */
          <div className="auth-card fade-in">
            <h3 className="card-title">본인 확인</h3>
            <div className="input-with-btn">
              <input type="text" value={userInfo.empEmlAddr} readOnly />
              <button className="sub-btn" onClick={handleSendAuthMail}>
                인증번호 발송
              </button>
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="인증번호 (1234)"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="현재 비밀번호 (1234)"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <button
              className="primary-btn wide-btn"
              onClick={handleVerifyIdentity}
            >
              인증 및 수정하기
            </button>
          </div>
        ) : (
          /* --- 2단계: 수정 폼 섹션 --- */
          <form onSubmit={handleSubmit} className="mod-form fade-in">
            {/* 섹션: 기본 정보 (ReadOnly) */}
            <section className="mod-card">
              <h3 className="card-title">
                기본 정보 <span>(수정 불가)</span>
              </h3>
              <div className="grid-inputs">
                <div className="form-group">
                  <label>이름</label>
                  <input type="text" value={userInfo.empNm} readOnly />
                </div>
                <div className="form-group">
                  <label>사번</label>
                  <input type="text" value={userInfo.empSn} readOnly />
                </div>
                <div className="form-group full-width">
                  <label>생년월일</label>
                  <input
                    type="text"
                    value={dayjs(userInfo.empBirth).format("YYYY-MM-DD")}
                    readOnly
                  />
                </div>
              </div>
            </section>

            {/* 섹션: 상세 정보 (Editable) */}
            <section className="mod-card">
              <h3 className="card-title">상세 정보 수정</h3>
              <div className="flex-inputs">
                <div className="form-group">
                  <label>전화번호</label>
                  <input
                    type="text"
                    defaultValue={userInfo.empTelno}
                    placeholder="010-0000-0000"
                  />
                </div>
                <div className="form-group">
                  <label>계좌번호</label>
                  <input type="text" defaultValue={userInfo.empActno} />
                </div>
                <div className="form-group">
                  <label>주소</label>
                  <input type="text" defaultValue={userInfo.empAddr} />
                </div>
              </div>
            </section>

            {/* 섹션: 이메일 수정 */}
            <section className="mod-card accent-card">
              <h3 className="card-title">이메일 수정</h3>
              <div className="input-with-btn">
                <input
                  type="email"
                  placeholder="새로운 이메일 주소"
                  defaultValue={userInfo.empEmlAddr}
                  onChange={(e) => setNewEmail(e.target.value)}
                  readOnly={isEmailVerified}
                />
                {!isEmailVerified ? (
                  <button
                    type="button"
                    className="sub-btn"
                    onClick={() => {
                      if (!newEmail || newEmail === userInfo.empEmlAddr)
                        return alert("새로운 이메일을 입력하세요.");
                      alert(`${newEmail}fh 인증번호가 발송되었습니다`);
                    }}
                  >
                    인증번호 발송
                  </button>
                ) : (
                  <span className="verified-badge">인증완료</span>
                )}
              </div>
              <div className="input-with-btn">
                <input
                  type="text"
                  placeholder="인증번호 (1234)"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  readOnly={isEmailVerified}
                />
                {!isEmailVerified ? (
                  <button
                    type="button"
                    className="sub-btn"
                    onClick={handleVerifyNewEmail}
                  >
                    인증하기
                  </button>
                ) : (
                  <span className="verified-badge">인증완료</span>
                )}
              </div>
            </section>

            {/* 섹션: 비밀번호 변경 */}
            <section className="mod-card">
              <h3 className="card-title">비밀번호 변경</h3>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={keepPassword}
                  onChange={() => setKeepPassword(!keepPassword)}
                />
                <span>기존 비밀번호 유지</span>
              </label>

              {!keepPassword && (
                <div className="pw-sub-area fade-in">
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
                      className={`pw-hint ${passwords.new === passwords.confirm ? "success" : "error"}`}
                    >
                      {pwMessage}
                    </p>
                  )}
                </div>
              )}
            </section>

            <button type="submit" className="primary-btn submit-btn">
              최종 수정 완료
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomeModProf;
