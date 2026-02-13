import React, { useEffect, useState } from "react";
import { fetcher } from "../../../shared/api/fetcher";
import DashDailyBoard from "../component/DashDailyBoard";
import DashLeave from "../component/DashLeave";
import DashNotice from "../component/DashNotice";
import DashApproval from "../component/DashApproval";
import "../css/HomeDashBoard.css";

function HomeDashBoard(props) {
  const [myDash, setMyDash] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

  const loadMyDash = async () => {
    try {
      setIsLoading(true);
      const data = await fetcher(`/gw/home/myDash?empId=${myInfo.empId}`);
      setMyDash(data);
    } catch (error) {
      console.log("데이터 로드 실패: ", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    loadMyDash();
  }, []);

  if (isLoading) return <div className="loading">데이터 로드 중...</div>;

  return (
    <div className="dashboard-main">
      {/* 1. 데일리보드 (기존 코드 유지, 내부 float:left에 의해 좌측 배치) */}
      <DashDailyBoard />

      {/* 2. 우측 콘텐츠 영역 */}
      <div className="dashboard-content-right">
        <section className="dash-section">
          <h3>결재현황</h3>
          <DashApproval drft={myDash.drft} aprv={myDash.aprv} />
        </section>

        <section className="dash-section">
          <h3>공지사항</h3>
          <DashNotice notice={myDash.notice} />
        </section>

        <section className="dash-section">
          <h3>연차현황</h3>
          <DashLeave leave={myDash.leave} />
        </section>
      </div>
    </div>
  );
}

export default HomeDashBoard;
