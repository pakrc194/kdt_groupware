import React from "react";
import { useParams } from "react-router-dom";
import AttendancePage from "./AttendancePage";
import MyAttendanceRecodePage from "./MyAttendanceRecodePage";
import EmpAttendanceList from "./EmpAttendanceList";
import EmpAtdcDetail from "./EmpAtdcDetail";
import DutySkedListPage from "./DutySkedListPage";
import DutySkedCheckPage from "./DutySkedView";
import DutySkedInsertForm from "./DutySkedInsertForm";
import DutySkedDetail from "./DutySkedDetail";
import DutySkedView from "./DutySkedView";

function AttendanceMain(props) {
  const { sideId } = useParams(); // URL의 :sideId 값을 가져옴

  // 2. 스위치 문에서 '컴포넌트'를 반환합니다.
  const renderContent = () => {
    switch (sideId) {
      case "atdc":
        return <AttendancePage />; // 경로 문자열이 아니라 컴포넌트 호출!
      case "dtskdview":
        return <DutySkedView />;
      case "dtskdlst":
        return <DutySkedListPage />;
      case "dtSkdIst":
        return <DutySkedInsertForm />;
      case "dtskdDet":
        return <DutySkedDetail />;
      case "myatdc":
        return <MyAttendanceRecodePage />;
      case "empatdc":
        return <EmpAttendanceList />;
      case "empDetail":
        return <EmpAtdcDetail />;
      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };

  return (
    <div className="approval-container">
      <div className="content-area">
        {renderContent()} {/* 여기서 선택된 화면이 렌더링됨 */}
      </div>
    </div>
  );
}

export default AttendanceMain;
