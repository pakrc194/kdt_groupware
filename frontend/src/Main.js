import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './shared/Layout';
import ApprovalHome from './features/Approval/ApprovalHome'; // 예시 파일 임포트
import './Main.css'
import LoginHome from './features/Login/LoginHome';
import MainHome from './features/Main/MainHome';
import ScheduleHome from './features/Schedule/ScheduleHome';
import AttendanceHome from './features/Attendance/AttendanceHome';
import BoardHome from './features/Board/BoardHome';
import OrgChartHome from './features/OrgChart/OrgChartHome';
import DashboardHome from './features/Dashboard/DashboardHome';

function Main() {
  return (
    <Routes>
      <Route path="/login" element={<LoginHome />} />
      <Route path="/" element={<Layout />}>
        {/* 첫 화면 접속 시 전자결재 draft로 이동 */}
        <Route index element={<Navigate to="/main/:sideId" replace />} />
        <Route path="main/:sideId" element={<MainHome/>} />
        <Route path="approval/:sideId" element={<ApprovalHome />} />
        <Route path="schedule/:sideId" element={<ScheduleHome/>} />
        <Route path="attendance/:sideId" element={<AttendanceHome/>} />
        <Route path="board/:sideId" element={<BoardHome/>} />
        <Route path="orgChart/:sideId" element={<OrgChartHome/>} />
        <Route path="dashboard/:sideId" element={<DashboardHome/>} />
      </Route>
    </Routes>
  );
}

export default Main