import React, { useState, useEffect } from 'react';
import { Card, Divider } from 'antd';
import { ToDoItem } from './ToDoItem';
import { ToDoForm } from './ToDoForm';
import axios from 'axios';

const token = 'f71bc573f25319edd566ec23ef8d7021ef6fec92';
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

export const ToDo = () => {
  const [todos, setTodos] = useState([]);
  useEffect(async () => {
    const result = await axios.get(
      'https://api.todoist.com/rest/v1/tasks',
      config
    );

    setTodos(result.data);
  }, []);

  const [idCount, setIdCount] = useState(10);

  const renderTodoItems = (todos) => {
    return (
      <ul className="todo-list">
        { todos.map(todo => <ToDoItem 
            key={todo.id}
            item={todo}
            onRemove={onRemove} 
            onCheck={onCheck} 
            onChange={onChange}
          />) }
      </ul>
    )
  }

  const onRemove = (id) => {
    const index = todos.findIndex(todo => todo.id === id);

    if (index !== -1) {
      axios.delete(
        `https://api.todoist.com/rest/v1/tasks/${id}`,
        config
      );
      todos.splice(index, 1);
      setTodos([...todos]);
    }
  }

  const onCheck = (id) => {
    const index = todos.findIndex(todo => todo.id === id);
    
    if (index !== -1) {
      const todo = todos[index];

      todo.checked = !todo.checked;
      
      axios.post(
        `https://api.todoist.com/rest/v1/tasks/${id}/close`,
        todo,
        config
      );
      
      todos.splice(index, 1, todo);
      setTodos([...todos]);
    }
  }

  const onChange = async (id) => {
    const index = todos.findIndex(todo => todo.id === id);
    
    if (index !== -1) {
      const todo = todos[index];
      
      await axios.post(
        `https://api.todoist.com/rest/v1/tasks/${id}`,
        todo,
        config
      );
      
      todos.splice(index, 1, todo);
      setTodos([...todos]);
    }
  }

  const onSubmit = async (content) => {
    const todo = { content };

    const { data } = await axios.post(
      `https://api.todoist.com/rest/v1/tasks`,
      todo,
      config
    );

    setTodos([...todos, {...todo, id: data.id}]);
  }

  return (
    <Card title={'My todos'} className="todo-card">
      <ToDoForm onSubmit={onSubmit} />
      <Divider />
      { renderTodoItems(todos) }
    </Card>
  );
}
