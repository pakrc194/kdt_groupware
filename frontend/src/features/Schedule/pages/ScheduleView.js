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
    const [newTodo, setNewTodo] = useState({ schedStartDate: '', schedTitle: '', schedDetail: '' });
    const [editTodoId, setEditTodoId] = useState(null);
    const [editTodo, setEditTodo] = useState({ schedStartDate: '', schedTitle: '', schedDetail: '' });

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
        fetcher(`/gw/home/1/sched_search/${formatted}`)
        .then(dd => setSched(Array.isArray(dd) ? dd : [dd]))
        .catch(e => console.log(e))
    }, [defaultDate]);

    // TODO 가져오기
    useEffect(() => {
        fetcher(`/gw/home/1/todo/${formatted}`) // 날짜별 TODO API
            .then(dd => setTodos(Array.isArray(dd) ? dd : [dd]))
            .catch(e => console.log(e));
    }, [defaultDate]);

    const addTodo = async () => {
        try {
            const created = await fetcher('/gw/home/1/todo/add', {
            method: 'POST',
            body: { 
                schedStartDate: newTodo.schedStartDate,
                schedTitle: newTodo.schedTitle,
                schedDetail: newTodo.schedDetail
            }
            });

            setTodos([...todos, created]);
            setNewTodo({ schedDate: '', schedTitle: '', schedDetail: '' });
            setShowTodoForm(false);
        } catch (err) {
            console.error('Todo 생성 실패:', err.message);
        }
    };



    // const toggleTodoComplete = (id) => {
    //     const todo = todos.find(t => t.schedId === id);
    //     // 수정 필요
    //     fetch(`/gw/home/1/todo/state/${id}`, {
    //         method: 'PUT',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ shcedState: !todo.shcedState })
    //     }).then(() => {
    //         setTodos(todos.map(t => t.schedId === id ? { ...t, shcedState: !t.shcedState } : t));
    //     });
    // }

    const deleteTodo = async (todoId) => {
        try {
            await fetcher(`/gw/home/1/todo/delete/${todoId}`, {
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
                {sched.map((vv, kk) => (
                    <tbody key={kk}>
                        <tr>
                            <td>아이디</td>
                            <td>{vv.schedId}</td>
                        </tr><tr>
                            <td>담당팀</td>
                            <td>{vv.schedTeam}</td>
                        </tr><tr>
                            <td>위치</td>
                            <td>{vv.schedLoc}</td>
                        </tr><tr>
                            <td>제목</td>
                            <td>{vv.schedTitle}</td>
                        </tr><tr>    
                            <td>구분(회사, 팀, 개인, TODO)</td>
                            <td>{vv.schedType}</td>
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
                <div className='sche-comp'>
                    <h2>회사</h2>
                </div>
                <div className='sche-team'>
                    <h2>팀</h2>
                </div>
                <div className='sche-indiv'>
                    <h2>개인</h2>
                </div>
                <div className='sche-todo'>
                    <h2>TODO</h2>
                    <ul>
                        {todos.map(todo => (
                            <li key={todo.schedId} style={{ display: 'flex', 
                                flexDirection: editTodoId === todo.schedId ? 'column' : 'row',
                                alignItems: editTodoId === todo.schedId ? 'flex-start' : 'center',
                                gap: '6px' }}>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleTodoComplete(todo.schedId)}
                                    />

                                    {editTodoId === todo.schedId ? (
                                        <>
                                            <input
                                                type="date"
                                                value={todo.schedStartDate?.split('T')[0] || ''}
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
                                                fetch(`/gw/home/1/todo/state/${todo.schedId}`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(editTodo)
                                                }).then(() => {
                                                    setTodos(todos.map(t =>
                                                        t.schedId === todo.schedId
                                                            ? { ...t, ...editTodo }
                                                            : t
                                                    ));
                                                    setEditTodoId(null);
                                                });
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
                                                marginLeft: '8px',
                                                textDecoration: todo.completed ? 'line-through' : 'none'
                                            }}>
                                                {todo.schedTitle} - {todo.schedDetail}
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
    dailyboardBox: {border: "solid 1px #000", width: "300px", height: "85vh", align: "center", float: "left", marginRight: "30px"}
}

export default ScheduleView;