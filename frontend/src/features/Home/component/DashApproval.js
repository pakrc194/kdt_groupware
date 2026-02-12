import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { getStatusLabel } from "../../../shared/func/formatStatus";

function DashApproval({ drft, aprv }) {
  const renderTable = (data, type) => (
    <table className="dash-table" style={{ marginBottom: "20px" }}>
      <thead>
        <tr>
          <th>문서번호</th>
          <th>문서제목</th>
          <th>기안일자</th>
          <th>진행상태</th>
        </tr>
      </thead>
      <tbody>
        {data != null &&
          data.map((v, k) => (
            <tr key={k}>
              <td>{v.aprvDocNo}</td>
              <td>
                <Link to={`/approval/${type}Box/detail/${v.aprvDocId}`}>
                  {v.aprvDocTtl}
                </Link>
              </td>
              <td>{v.aprvDocDrftDt.substring(0, 8)}</td>
              <td>{getStatusLabel(v.aprvDocStts)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  return (
    <div className="approval-container">
      <h4 style={{ fontSize: "15px", color: "#666" }}>📄 기안</h4>
      {renderTable(drft, "draft")}
      <h4 style={{ fontSize: "15px", color: "#666", marginTop: "30px" }}>
        🖋️ 결재
      </h4>
      {renderTable(aprv, "approval")}
    </div>
  );
}

export default DashApproval;
