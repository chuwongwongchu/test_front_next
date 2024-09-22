"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // นำเข้า Bootstrap

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState(null);
  const [editingTodoId, setEditingTodoId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3005/api/todos');
      setTodos(response.data);
    } catch (err) {
      setError('Failed to fetch todos');
    }
  };

  const addTodo = async () => {
    if (!newTodo) return;
    try {
      await axios.post('http://localhost:3005/api/todos', { text: newTodo });
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      setError('Failed to add todo');
    }
  };

const deleteTodo = async (id) => {
  try {
    await axios.delete(`http://localhost:3005/api/todos/${id}`);
    fetchTodos();
  } catch (err) {
    setError('Failed to delete todo');
  }
};

const updateTodo = async (id, text) => {
  try {
    await axios.put(`http://localhost:3005/api/todos/${id}`, { text });
    setEditingTodoId(null);
    fetchTodos();
  } catch (err) {
    setError('Failed to update todo');
  }
};

  const handleEdit = (todo) => {
    if (editingTodoId === todo._id) {
      updateTodo(todo._id, newTodo);
    } else {
      setEditingTodoId(todo._id);
      setNewTodo(todo.text);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">To-Do List</h1>
      {error && <p className="text-danger">{error}</p>}
      <div className="input-group mb-3">
        <input 
          className="form-control"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button className="btn btn-primary" onClick={addTodo}>Add</button>
      </div>
      <ul className="list-group">
        {todos.map((todo) => (
          <li key={todo._id} className="list-group-item d-flex justify-content-between align-items-center">
            {editingTodoId === todo._id ? (
              <span>
                <input 
                  className="form-control me-2"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Edit todo"
                />
                <button className="btn btn-success" onClick={() => handleEdit(todo)}>Save</button>
              </span>
            ) : (
              <span>
                {todo.text}
                <button className="btn btn-danger btn-sm ms-2" onClick={() => deleteTodo(todo._id)}>Delete</button>
                <button className="btn btn-warning btn-sm ms-2" onClick={() => handleEdit(todo)}>Edit</button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
