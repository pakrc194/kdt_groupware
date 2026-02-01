import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ApprovalHome from './features/Approval/ApprovalMain'; // 예시 파일 임포트
import LoginHome from './features/Login/LoginMain';
import HomeMain from './features/Home/HomeMain';
import ScheduleHome from './features/Schedule/ScheduleMain';
import AttendanceHome from './features/Attendance/AttendanceMain';
import BoardHome from './features/Board/BoardMain';
import OrgChartHome from './features/OrgChart/OrgChartMain';
import DashboardHome from './features/Dashboard/DashboardMain';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginHome />} />
        <Route path="/" element={<Layout />}>
          {/* 첫 화면 접속 시 전자결재 draft로 이동 */}
          <Route index element={<Navigate to="/home/dashboard" replace />} />
          <Route path="home/:sideId" element={<HomeMain/>} />
          <Route path="approval/:sideId" element={<ApprovalHome />} />
          <Route path="schedule/:sideId" element={<ScheduleHome/>} />
          <Route path="attendance/:sideId" element={<AttendanceHome/>} />
          <Route path="board/:sideId" element={<BoardHome/>} />
          <Route path="orgChart/:sideId" element={<OrgChartHome/>} />
          <Route path="dashboard/:sideId" element={<DashboardHome/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

