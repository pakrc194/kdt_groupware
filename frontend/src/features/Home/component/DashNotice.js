import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";

function DashNotice({ notice }) {
  return (
    <table className="dash-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성일</th>
          <th>조회</th>
          <th>작성자</th>
        </tr>
      </thead>
      <tbody>
        {notice.map((st) => (
          <tr key={st.boardId}>
            <td>{st.boardId}</td>
            <td>
              <Link to={`/board/important?id=${st.boardId}`}>{st.title}</Link>
            </td>
            <td>{dayjs(st.createdAt).format("YYYY-MM-DD")}</td>
            <td>{st.views}</td>
            <td>{st.empNm}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DashNotice;
