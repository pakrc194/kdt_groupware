import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher'; // fetch wrapper

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ date: '', title: '', content: '' });

  // DB에서 todo 가져오기
  useEffect(() => {
    fetcher('/api/todo')
      .then(data => setTodos(Array.isArray(data) ? data : [data]))
      .catch(err => console.log(err));
  }, []);

  // 체크박스 토글 (완료 여부)
  const toggleComplete = (id) => {
    const todo = todos.find(t => t.id === id);
    fetch(`/api/todo/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    }).then(() => {
      setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    });
  };

  // 삭제
  const deleteTodo = (id) => {
    fetch(`/api/todo/${id}`, { method: 'DELETE' })
      .then(() => setTodos(todos.filter(t => t.id !== id)));
  };

  // 수정
  const updateTodo = (id, updated) => {
    fetch(`/api/todo/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).then(() => {
      setTodos(todos.map(t => t.id === id ? { ...t, ...updated } : t));
    });
  };

  // 새 Todo 추가
  const addTodo = () => {
    fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(newTodo => {
      setTodos([...todos, newTodo]);
      setFormData({ date: '', title: '', content: '' });
      setShowForm(false);
    });
  };

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            <span style={{ flex: 1, marginLeft: '10px', textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title} - {todo.content} ({todo.date})
            </span>
            <button onClick={() => {
              const newTitle = prompt('제목 수정', todo.title);
              const newContent = prompt('내용 수정', todo.content);
              if(newTitle != null && newContent != null) updateTodo(todo.id, { title: newTitle, content: newContent });
            }}>수정</button>
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>

      <button onClick={() => setShowForm(!showForm)}>추가하기</button>

      {showForm && (
        <div style={{ marginTop: '10px' }}>
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="제목"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="내용"
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
          />
          <button onClick={addTodo}>저장</button>
        </div>
      )}
    </div>
  );
}

export default TodoList;