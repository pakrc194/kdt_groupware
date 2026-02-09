import React, { useEffect, useState } from "react";
import { fetcher } from "../../../shared/api/fetcher";

function HomeDashBoard(props) {
  const [myDash, setMyDash] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMyDash = async () => {
    console.log("패치함수 실행");
    try {
      setIsLoading(true);
      const data = await fetcher(`/gw/home/myDash?empId=10`);
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
    <div>
      <h1>메인 대시보드 입니다</h1>
      <h3>연차현황</h3>
      <div>
        부여: {myDash.leave.totalDays}
        <br />
        사용: {myDash.leave.usedDays}
        <br />
        잔여: {myDash.leave.leftDays}
      </div>
    </div>
  );
}

export default HomeDashBoard;
