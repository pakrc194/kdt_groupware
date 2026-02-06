import React, { useEffect, useState } from 'react';

import { Link, Outlet, useParams, Navigate } from 'react-router-dom';
import ScheduleCalendar from './ScheduleCalendar';
import ScheduleList from './ScheduleList';
import { fetcher } from '../../../shared/api/fetcher';

function ScheduleView(props) {   

    const { view } = useParams();
    const [defaultDate, setDefaultDate] = useState(new Date());
    const [sched, setSched] = useState([]);
    const [todos, setTodos] = useState([]);
    const [showTodoForm, setShowTodoForm] = useState(false);
    const [newTodo, setNewTodo] = useState({ schedStartDate: '', schedTitle: '', schedDetail: '', schedState: Boolean });
    const [editTodoId, setEditTodoId] = useState(null);
    const [editTodo, setEditTodo] = useState({ schedStartDate: '', schedTitle: '', schedDetail: '', schedState: Boolean });

    const setDate = (date) => {
        // console.log('날짜 선택됨'+date)
        setDefaultDate(date);
       
    }
    const date = defaultDate;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    
    const formatted = `${yyyy}-${mm}-${dd}`;

    const renderContent = () => {
        if (!view) {
            return <Navigate to="/schedule/check/calendar" replace />;
        }
        switch(view) {
            case 'calendar':
                return <ScheduleCalendar sDate={setDate} todo={todos} />
            case 'list':
                return <ScheduleList sDate={setDate} todo={todos} />
        }
    }
    

    // 특정 날짜로 일정 받아와서 화면에 출력
    useEffect(() => {
        fetcher(`/gw/schedule/sched_search/${formatted}`)
        // fetcher(`/gw/schedule/view/${formattedStart}/${formattedEnd}/${dept_id}/${emp_id}`)
        .then(dd => setSched(Array.isArray(dd) ? dd : [dd]))
        .catch(e => console.log(e))
    }, [defaultDate]);

    // TODO 가져오기
    useEffect(() => {
        fetcher(`/gw/schedule/todo/view/${formatted}/${localStorage.getItem("EMP_ID")}`) // 날짜별 TODO API
            .then(dd => setTodos(Array.isArray(dd) ? dd : [dd]))
            .catch(e => console.log(e));
    }, [defaultDate, todos[0]]);

    // TODO 추가
    const addTodo = async () => {
        try {
            const created = await fetcher('/gw/schedule/todo/add', {
            method: 'POST',
            body: { 
                schedStartDate: newTodo.schedStartDate,
                schedTitle: newTodo.schedTitle,
                schedDetail: newTodo.schedDetail,
                schedState: newTodo.schedState,
                schedAuthorId: localStorage.getItem("EMP_ID")
            }
            });

            setTodos([...todos, created]);
            setNewTodo({ schedDate: '', schedTitle: '', schedDetail: '' });
            setShowTodoForm(false);
        } catch (err) {
            console.error('Todo 생성 실패:', err.message);
        }
    };

    // TODO 수정
    const modifyTodo = async (todo) => {
        try {
            const created = await fetcher(`/gw/schedule/todo/modify`, {
            method: 'POST',
            body: { 
                schedStartDate: editTodo.schedStartDate,
                schedTitle: editTodo.schedTitle,
                schedDetail: editTodo.schedDetail,
                schedId: editTodoId,
                schedState: editTodo.schedState,
                schedAuthorId: localStorage.getItem("EMP_ID")
            }
            });

            setTodos(todos.map(t => t.schedId === todo.schedId ? { ...t, ...editTodo } : t ));
        } catch (err) {
            console.error('Todo 수정 실패:', err.message);
        }
    };




    // 완료 표시
    const toggleTodoComplete = async (cktodo) => {
        const todo = todos.find(t => t.schedId === cktodo.schedId);
        // cktodo.schedState = cktodo.schedState ? true : false
        // 클릭하면 상태를 바꿔서 db에 저장해버리기?

        // todos.filter(todo => todo.schedId == cktodo.todoId)
        try {
            var flag = 0;
            if (cktodo.schedState == false) {flag = 1}
            const created = await fetcher(`/gw/schedule/todo/toggle`, {
            method: 'POST',
            body: { 
                schedStartDate: cktodo.schedStartDate,
                schedTitle: cktodo.schedTitle,
                schedDetail: cktodo.schedDetail,
                schedId: cktodo.schedId,
                schedType: "TODO",
                schedState: flag,
                schedAuthorId: localStorage.getItem("EMP_ID")
            }
            });

            setTodos(todos.map(t => t.schedId === cktodo.schedId ? { ...t, shcedState: !t.shcedState } : t));
        } catch (err) {
            console.error('Todo 토글 실패:', err.message);
        };
    }

    // TODO 삭제
    const deleteTodo = async (todoId) => {
        try {
            await fetcher(`/gw/schedule/todo/delete/${todoId}`, {
            method: 'DELETE'
            });
            setTodos(todos.filter(todo => todo.schedId !== todoId)); // 프론트에서 제거
        } catch (err) {
            console.error('삭제 실패:', err.message);
        }
    };


    return (
        <div>
            <div className='dailyboard-box' style={style.dailyboardBox}>
                <div align="center" className='dailyboard-date'>
                    <h1>{defaultDate.getMonth()+1}월 {defaultDate.getDate()}일</h1>
                </div>
                <div className='button-box'>
                    <Link to={`/schedule/check/calendar`}>캘린더</Link>
                    <Link to={`/schedule/check/list`}>리스트</Link>
                </div>
            <div className='dailyboard-schedulelist'>
                <div className='sche-comp'>
                    <h2>회사</h2>
                    {sched.filter(dd => dd.schedType == "COMPANY").map((vv, kk) => (
                    <tbody key={kk}>
                        <tr>
                            {/* <td>아이디</td>
                            <td>{vv.schedId}</td> */}
                        </tr><tr>
                            <td>담당팀</td>
                            <td>{vv.schedDept}</td>
                        </tr><tr>
                            <td>위치</td>
                            <td>{vv.schedLoc}</td>
                        </tr><tr>
                            <td>제목</td>
                            <td>{vv.schedTitle}</td>
                        </tr><tr>    
                            {/* <td>회사, 팀, 개인, TODO : </td>
                            <td>{vv.schedType}</td> */}
                        </tr><tr>    
                            <td>상세내용</td>
                            <td>{vv.schedDetail}</td>
                        </tr><tr>    
                            <td>시작일</td>
                            <td>{vv.schedStartDate.split('T')[0]}</td>
                        </tr><tr>    
                            <td>종료일</td>
                            <td>{vv.schedEndDate.split('T')[0]}</td>
                        </tr>
                    </tbody>
                ))}
                </div>
                <div className='sche-team'>
                    <h2>팀</h2>
                    {sched.filter(dd => dd.schedType == "DEPT").map((vv, kk) => (
                    <tbody key={kk}>
                        <tr>
                            {/* <td>아이디</td>
                            <td>{vv.schedId}</td> */}
                        </tr><tr>
                            <td>담당팀</td>
                            <td>{vv.schedDeptId} {vv.schedDept}</td>
                        </tr><tr>
                            <td>위치</td>
                            <td>{vv.schedLoc}</td>
                        </tr><tr>
                            <td>제목</td>
                            <td>{vv.schedTitle}</td>
                        </tr><tr>    
                            {/* <td>회사, 팀, 개인, TODO : </td>
                            <td>{vv.schedType}</td> */}
                        </tr><tr>    
                            <td>상세내용</td>
                            <td>{vv.schedDetail}</td>
                        </tr><tr>    
                            <td>시작일</td>
                            <td>{vv.schedStartDate.split('T')[0]}</td>
                        </tr><tr>    
                            <td>종료일</td>
                            <td>{vv.schedEndDate.split('T')[0]}</td>
                        </tr>
                    </tbody>
                ))}
                </div>
                <div className='sche-indiv'>
                    <h2>개인</h2>
                    {sched.filter(dd => dd.schedType == "PERSONAL").map((vv, kk) => (
                    <tbody key={kk}>
                        <tr>
                            {/* <td>아이디</td>
                            <td>{vv.schedId}</td> */}
                        </tr><tr>
                            <td>담당팀</td>
                            <td>{vv.schedDept}</td>
                        </tr><tr>
                            <td>위치</td>
                            <td>{vv.schedLoc}</td>
                        </tr><tr>
                            <td>제목</td>
                            <td>{vv.schedTitle}</td>
                        </tr><tr>    
                            {/* <td>회사, 팀, 개인, TODO : </td>
                            <td>{vv.schedType}</td> */}
                        </tr><tr>    
                            <td>상세내용</td>
                            <td>{vv.schedDetail}</td>
                        </tr><tr>    
                            <td>시작일</td>
                            <td>{vv.schedStartDate.split('T')[0]}</td>
                        </tr><tr>    
                            <td>종료일</td>
                            <td>{vv.schedEndDate.split('T')[0]}</td>
                        </tr>
                    </tbody>
                ))}
                </div>
                <div className='sche-todo'>
                    <h2>TODO</h2>
                    <ul>
                        {todos.filter(dd => dd.schedStartDate < formatted).map(todo => (
                            <li key={todo.schedId} style={{ 
                                display: 'flex', 
                                flexDirection: editTodoId === todo.schedId ? 'column' : 'row',
                                alignItems: editTodoId === todo.schedId ? 'flex-start' : 'center',
                                // gap: '6px' 
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={todo.schedState == 0 ? false : true}
                                        onChange={() => {
                                            toggleTodoComplete(todo);
                                        }}
                                    />

                                    {editTodoId === todo.schedId ? (
                                        <>
                                            <input
                                                type="date"
                                                value={editTodo.schedStartDate?.split('T')[0] || ''}
                                                onChange={e =>
                                                    setEditTodo({ ...editTodo, schedStartDate: e.target.value })
                                                    
                                                }
                                            />
                                            <input
                                                type="text"
                                                value={editTodo.schedTitle}
                                                onChange={e =>
                                                    setEditTodo({ ...editTodo, schedTitle: e.target.value })
                                                }
                                            />
                                            <input
                                                type="text"
                                                value={editTodo.schedDetail}
                                                onChange={e =>
                                                    setEditTodo({ ...editTodo, schedDetail: e.target.value })
                                                }
                                            />

                                            <button onClick={() => {
                                                modifyTodo(todo);
                                                setEditTodoId(null);
                                            }}>
                                                저장
                                            </button>

                                            <button onClick={() => setEditTodoId(null)}>
                                                취소
                                            </button>
                                        </>
                                        ) : (
                                        <>
                                            <span style={{
                                                flex: 1,
                                                // marginLeft: '8px',
                                                textDecoration: todo.completed ? 'line-through' : 'none'
                                            }}>
                                                {todo.schedStartDate.split("T")[0]} {todo.schedTitle}
                                            </span>

                                            <button onClick={() => {
                                                setEditTodoId(todo.schedId);
                                                setEditTodo({
                                                    schedStartDate: todo.schedStartDate,
                                                    schedTitle: todo.schedTitle,
                                                    schedDetail: todo.schedDetail
                                                });
                                            }}>
                                                수정
                                            </button>

                                            <button onClick={() => deleteTodo(todo.schedId)}>삭제</button>
                                        </>
                                    )}
                                </li>
                            ))}
                            </ul>

                            {showTodoForm ? (
                                <div>
                                    <input 
                                        type="date"
                                        value={newTodo.schedStartDate}
                                        onChange={e => setNewTodo({ ...newTodo, schedStartDate: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="제목"
                                        value={newTodo.schedTitle}
                                        onChange={e => setNewTodo({ ...newTodo, schedTitle: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="내용"
                                        value={newTodo.schedDetail}
                                        onChange={e => setNewTodo({ ...newTodo, schedDetail: e.target.value })}
                                    />
                                    <button onClick={addTodo}>저장</button>
                                    <button onClick={() => setShowTodoForm(false)}>취소</button>
                                </div>
                            ) : (
                                <button onClick={() => setShowTodoForm(true)}>추가하기</button>
                            )}
                    </div>
                </div>
            </div>
            <Outlet />
            {renderContent()}
        </div>
    );
}

const style = {
    dailyboardBox: {border: "solid 1px #000", width: "300px", align: "center", float: "left", marginRight: "30px", padding: "10px"}
}

export default ScheduleView;