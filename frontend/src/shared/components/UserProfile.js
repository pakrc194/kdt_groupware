import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { fetcher } from "../api/fetcher";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myInfo, setMyInfo] = useState(
    JSON.parse(localStorage.getItem("MyInfo")),
  );

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await fetcher(`/gw/home/myProf?empId=${myInfo.empId}`);
      console.log("사이드메뉴 프로필, " + data.empNm);
      setUser(data);
    } catch (error) {
      console.error("프로필 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMyInfo(JSON.parse(localStorage.getItem("MyInfo")));
    console.log("myInfo, " + myInfo);
    loadProfile();
  }, []);

  // 로딩 중 처리
  if (loading) return <div className="profile-section">로딩 중...</div>;
  // 데이터 없을 때 처리
  if (!user) return <div className="profile-section">정보 없음</div>;

  return (
    <div className="profile-section">
      <div className="profile-img-box">
        <img
          src={`http://192.168.0.49:8080/uploads/${user.empPhoto}`}
          alt="프로필"
        />
      </div>
      <div className="profile-info">
        <div className="profile-main">
          <span className="user-name">{user.empNm}</span>
          <span className="user-rank">{user.jbttlNm}</span>
        </div>
        <p className="user-team">
          {user.deptName}
          {user.deptName === "지점장" ? "" : "팀"}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
