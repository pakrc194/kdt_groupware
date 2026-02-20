import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";

function DashDailyBoard(props) {
  const { view } = useParams();
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [sched, setSched] = useState([]);
  const [todos, setTodos] = useState([]);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [newTodo, setNewTodo] = useState({
    schedStartDate: "",
    schedTitle: "",
    schedDetail: "",
    schedState: "",
  });
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodo, setEditTodo] = useState({
    schedStartDate: "",
    schedTitle: "",
    schedDetail: "",
    schedState: "",
  });
  // 로그인 정보
  const [myInfo, setMyInfo] = useState(
    JSON.parse(localStorage.getItem("MyInfo")),
  );
  const dept_id = myInfo.deptId;
  const emp_id = myInfo.empId;

  const setDate = (date) => {
    setDefaultDate(date);
  };

  const date = defaultDate;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const formatted = `${yyyy}-${mm}-${dd}`;

  // 특정 날짜로 일정 받아와서 화면에 출력
  useEffect(() => {
    fetcher(`/gw/schedule/view/${formatted}/${formatted}/${dept_id}/${emp_id}`)
      .then((dd) => {
        setSched(Array.isArray(dd) ? dd : [dd]);
      })
      .catch((e) => console.log(e));
  }, [defaultDate, showTodoForm]);

  // TODO 가져오기
  useEffect(() => {
    fetcher(`/gw/schedule/todo/view/${formatted}/${myInfo.empId}`) // 날짜별 TODO API
      .then((dd) => {
        setTodos(Array.isArray(dd) ? dd : [dd]);
      })
      .catch((e) => console.log(e));
  }, [defaultDate, showTodoForm, editTodo]);

  // TODO 추가
  const addTodo = async () => {
    try {
      const created = await fetcher("/gw/schedule/todo/add", {
        method: "POST",
        body: {
          schedStartDate: newTodo.schedStartDate,
          schedTitle: newTodo.schedTitle,
          schedDetail: newTodo.schedDetail,
          schedState: newTodo.schedState,
          schedAuthorId: myInfo.empId,
        },
      });

      setTodos([...todos, created]);
      setNewTodo({ schedDate: "", schedTitle: "", schedDetail: "" });
      setShowTodoForm(false);
    } catch (err) {
      console.error("Todo 생성 실패:", err.message);
    }
  };

  // TODO 수정
  const modifyTodo = async (todo) => {
    try {
      const created = await fetcher(`/gw/schedule/todo/modify`, {
        method: "POST",
        body: {
          schedStartDate: editTodo.schedStartDate,
          schedTitle: editTodo.schedTitle,
          schedDetail: editTodo.schedDetail,
          schedId: editTodoId,
          schedState: editTodo.schedState,
          schedAuthorId: myInfo.empId,
        },
      });

      setTodos(
        todos.map((t) =>
          t.schedId === todo.schedId ? { ...t, ...editTodo } : t,
        ),
      );
    } catch (err) {
      console.error("Todo 수정 실패:", err.message);
    }
  };

  // 완료 표시
  const toggleTodoComplete = async (cktodo) => {
    try {
      var flag = 0;
      if (cktodo.schedState == false) {
        flag = 1;
      }
      await fetcher(`/gw/schedule/todo/toggle`, {
        method: "POST",
        body: {
          schedStartDate: cktodo.schedStartDate.split(" ")[0],
          schedTitle: cktodo.schedTitle,
          schedDetail: cktodo.schedDetail,
          schedId: cktodo.schedId,
          schedType: "TODO",
          schedState: flag,
          schedAuthorId: myInfo.empId,
        },
      });

      setTodos(todos.map(t => t.schedId === cktodo.schedId ? { ...t, shcedState: !t.shcedState } : t));
    } catch (err) {
      console.error("Todo 토글 실패:", err.message);
    }
  };

  // TODO 삭제
  const deleteTodo = async (todoId) => {
    try {
      await fetcher(`/gw/schedule/todo/delete/${todoId}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo.schedId !== todoId)); // 프론트에서 제거
    } catch (err) {
      console.error("삭제 실패:", err.message);
    }
  };

  // TODO 정렬
  const sortedTodos = [...todos].sort((a, b) => {
    return a.schedState - b.schedState;
  });

  return (
    <>
      <div className="dailyboard-box" style={style.dailyboardBox}>
        <div style={styles.container}>
          <div style={style.header}>
            <div>
              <span>
                {defaultDate.getMonth() + 1}월 {defaultDate.getDate()}일
              </span>
            </div>
          </div>
          {/* 일정 섹션 */}
          {["COMPANY", "DEPT", "PERSONAL"].map((type) => {
            const typeName =
              type === "COMPANY" ? "회사" : type === "DEPT" ? "팀" : "개인";
            return (
              <div key={type} style={styles.card}>
                <h4 style={styles.cardTitle}>{typeName}</h4>
                <div style={styles.scrollArea}>
                    {sched.filter(s => s.schedType === type).length > 0 ? (
                        sched.filter(s => s.schedType === type).map(s => (
                            <div key={s.schedId} style={styles.schedItem}>
                                <div>
                                    <strong>제목:</strong> 
                                    <Link to={`/schedule/check/calendar/detail/${s.schedId}`} style={styles.link}>{s.schedTitle}</Link>
                                </div>
                                {s.schedLoc && <div><strong>위치:</strong> {s.schedLocNm}</div>}
                                {type === 'DEPT' && <div><strong>팀:</strong> {s.schedDept}</div>}
                                {type === 'PERSONAL' && <div><strong>담당자:</strong> {s.schedEmpNm}</div>}
                                {s.schedDetail && <div><strong>상세 내용 확인 필요</strong></div>}
                                <div><strong>기간:</strong> {s.schedStartDate?.split(" ")[0]} ~ {s.schedEndDate?.split(" ")[0]}</div>
                            </div>
                        ))
                        ) : (
                            <div style={{color:'#aaa'}}>일정 없음</div>
                    )}
                </div>
              </div>
            );
          })}

          <div className="dailyboard-schedulelist">
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>TODO</h3>
              <div style={styles.scrollArea}>
                <ul style={styles.todoList}>
                  {sortedTodos
                  .filter(dd => dd.schedStartDate.split(' ')[0] == formatted)
                  .map((todo) => (
                    <li key={todo.schedId} style={styles.todoItem}>
                      <span
                            style={{
                              textDecoration:
                                todo.schedState != 0 ? "line-through" : "none",
                              flex: 1,
                              marginLeft: "8px",
                            }}
                          >
                            {todo.schedTitle}
                          </span>
                          <button
                            style={styles.todoBtn}
                            onClick={() => deleteTodo(todo.schedId)}
                          >
                            삭제
                          </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const style = {
  dailyboardBox: {
    width: "300px",
    align: "center",
    float: "left",
    padding: "10px",
  },
};

const styles = {
  container: { width: "300px", margin: "0", fontFamily: "Arial, sans-serif" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  navLink: { marginLeft: "10px", textDecoration: "none", color: "#007bff" },
  card: {
    backgroundColor: "#fff",
    padding: "5px",
    marginBottom: "1px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  cardTitle: { marginBottom: "5px", fontSize: "16px", color: "#333" },
  scrollArea: { maxHeight: "250px", overflowY: "auto" },
  schedItem: {
    marginBottom: "10px",
    padding: "5px",
    borderBottom: "1px solid #eee",
  },
  todoList: { listStyle: "none", padding: 0, margin: 0 },
  todoItem: { display: "flex", alignItems: "center", marginBottom: "6px" },
  todoBtn: {
    marginLeft: "8px",
    padding: "4px 8px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelBtn: {
    marginLeft: "8px",
    padding: "4px 8px",
    backgroundColor: "#f5f5f5",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  modifyBtn: {
    marginLeft: "8px",
    padding: "4px 8px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  todoForm: { display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" },
  addBtn: {
    marginTop: "6px",
    padding: "6px 10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  // cancelBtn: { padding: '5px 10px', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  editBox: {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#fafafa",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  input: {
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "6px",
  },
  link: {
        color: '#007bff',
        textDecoration: 'none',
  },
};

export default DashDailyBoard;
