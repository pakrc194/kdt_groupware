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
import DetailEmp from "../features/OrgChart/pages/DetailEmp";
import ScheduleCalendar from "../features/Schedule/pages/ScheduleCalendar";
import ScheduleList from "../features/Schedule/pages/ScheduleList";
import ScheduleDetail from "../features/Schedule/pages/ScheduleDetail";
import ScheduleView from "../features/Schedule/pages/ScheduleView";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginMain />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home/dashboard" replace />} />
        <Route path="home/:sideId" element={<HomeMain />} />
        <Route path="approval/:sideId" element={<ApprovalMain />} />
        <Route path="schedule/:sideId" element={<ScheduleMain />} />
        <Route path="schedule/:sideId/:view" element={<ScheduleView />} >
          <Route path="schedule/check/calendar" element={<ScheduleCalendar />} />
          <Route path="schedule/check/list" element={<ScheduleList />} />
        </Route>
        <Route path="schedule/:sideId/calendar/detail/:id" element={<ScheduleDetail />} />
        <Route path="attendance/:sideId" element={<AttendanceMain />} />
        <Route path="board/:sideId" element={<BoardMain />} />
        <Route path="orgChart/:sideId" element={<OrgChartMain />} />
        <Route path="orgChart/:sideId/detail/:id" element={<DetailEmp />} />
        <Route path="dashboard/:sideId" element={<DashboardMain />} />
      </Route>
    </Routes>
  );
}
