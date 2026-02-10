import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";

function DashApproval({ drft, aprv }) {
  const renderTable = (data, type) => (
    <table className="dash-table" style={{ marginBottom: "20px" }}>
      <thead>
        <tr>
          <th>결재코드</th>
          <th>문서제목</th>
          <th>기안일</th>
          <th>결재상태</th>
        </tr>
      </thead>
      <tbody>
        {data != null && data.map((v, k) => (
          <tr key={k}>
            <td>{v.aprvDocNo}</td>
            <td>
              <Link to={`/approval/${type}Box/detail/${v.aprvDocId}`}>
                {v.aprvDocTtl}
              </Link>
            </td>
            <td>{v.aprvDocDrftDt}</td>
            <td>{v.aprvDocStts}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="approval-container">
      <h4 style={{ fontSize: "15px", color: "#666" }}>📄 기안함</h4>
      {renderTable(drft, "draft")}
      <h4 style={{ fontSize: "15px", color: "#666", marginTop: "30px" }}>
        🖋️ 결재함
      </h4>
      {renderTable(aprv, "approval")}
    </div>
  );
}

export default DashApproval;
