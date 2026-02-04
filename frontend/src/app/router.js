import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../shared/layout/Layout";

import LoginMain from "../features/Login/pages/LoginMain";
import HomeMain from "../features/Home/pages/HomeMain";
import ApprovalMain from "../features/Approval/pages/ApprovalMain";
import ScheduleMain from "../features/Schedule/pages/ScheduleMain";
import AttendanceMain from "../features/Attendance/pages/AttendanceMain";
import BoardMain from "../features/Board/pages/BoardMain";
import OrgChartMain from "../features/OrgChart/pages/OrgChartMain";
import DashboardMain from "../features/Dashboard/pages/DashboardMain";
import Employee_details from "../features/Login/pages/Employee_details";
import FindPassword from "../features/Login/pages/FindPassword";

import ApprovalDetail from "../features/Approval/pages/ApprovalDetail";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginMain />} />
      <Route path="/EmpDetails" element={<Employee_details />} />
      <Route path="/FindPassword" element={<FindPassword />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home/dashboard" replace />} />
        <Route path="home/:sideId" element={<HomeMain />} />
        <Route path="approval/:sideId" element={<ApprovalMain />} />
        <Route path="approval/:sideId/detail/:docId" element={<ApprovalDetail />} />
        <Route path="schedule/:sideId" element={<ScheduleMain />} />
        <Route path="attendance/:sideId" element={<AttendanceMain />} />
        <Route path="board/:sideId" element={<BoardMain />} />
        <Route path="orgChart/:sideId" element={<OrgChartMain />} />
        <Route path="dashboard/:sideId" element={<DashboardMain />} />
      </Route>
    </Routes>
  );
}
