import { useState, useEffect, useRef } from 'react'
import { List, Trash3 } from 'react-bootstrap-icons'
import uuid from 'react-uuid'

import './App.css'

// Note: Check out Bootstrap's flex section for aligning items here: https://getbootstrap.com/docs/4.0/utilities/flex/
//       And Bootstrap's list of available icons at https://icons.getbootstrap.com to see a list of the available icons
const TODOS_STORAGE_KEY = 'todos'


export default function App() {
  const getStoredTodos = () => {
    let todos = []
    const storedTodos = localStorage.getItem(TODOS_STORAGE_KEY)
    if (storedTodos) {
      try {
        todos = JSON.parse(storedTodos)
      } catch(error) {
        console.error(error)
      }
    }
    return todos
  }
  const [todos, setTodos] = useState(getStoredTodos())
  const [todo, setTodo] = useState('')
  const [currentTodo, setCurrentTodo] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const editTodoRef = useRef() // when isEditing === true, then you can reach it with editTodoRef.current.value to get its value
  
  useEffect(() => {
    try {
      localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    } catch(error) {
      console.error(error)
    }
  }, [todos]);

  const handleInputChange = (e) => {
    setTodo(e.target.value)
    console.log('Todo:', todo)
  }

  const handleEditingInputChange = (e) => {
    setCurrentTodo({ ...currentTodo, text: e.target.value })
    console.log('Current Todo:', currentTodo)
  }

  const handleUpdateTodo = (id, updateTodo) => {
    const updatedItem = todos.map((todo) => (todo.id === id ? updateTodo : todo))
    setIsEditing(false)
    setTodos(updatedItem)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (todo !== '') {
      setTodos([ ...todos, { id: uuid(), text: todo.trim() }])
    }
    setTodo('')
  }

  const handleEditFormSubmit = (e) => {
    e.preventDefault()
    handleUpdateTodo(currentTodo.id, currentTodo)
  }

  const handleEditClick = (todo) => {
    setIsEditing(true)
    setCurrentTodo({ ...todo })
  }

  const handleDeleteClick = (id) => {
    const shouldRemove = confirm('Remove this todo?')
    if (!shouldRemove) return;

    const updatedTodos = todos.filter(todo => todo.id !== id)
    
    setTodos(updatedTodos)
  }

  return (<div className="App container">

    <header><h1>Tai Kong's Todo App</h1></header>

    <hr />

    <div className="container">
      { isEditing && (<form onSubmit={handleEditFormSubmit}>
        
        <h2>Editing Todo</h2>
        
        <label className="" htmlFor="editTodo">Edit todo:</label>
        
        <input
          ref={editTodoRef}
          className="form-control"
          type="text"
          name="editTodo"
          placeholder="Edit todo"
          value={currentTodo.text}
          onChange={handleEditingInputChange}
        />
      <div className="edit-button-group d-flex justify-content-end">
      <button className="btn btn-primary" type="submit">Update</button>
      <button className="btn btn-default text-danger" onClick={
        (e) => { e.preventDefault(); confirm('Are you sure you want to cancel editing?') && setIsEditing(false) }
  }>Cancel</button>
        </div>
      </form>)    
      }

      
      { !isEditing && <form onSubmit={handleFormSubmit}>

        <div className="input-group">

          <input
            className="form-control form-control-lg"
            type="text"
            name="todo"
            placeholder="Create a new todo"
            value={todo}
            onChange={handleInputChange}
          />

          <button className="btn btn-lg btn-primary" disabled={todo === ''}>Add</button>

        </div>

      </form>
      }
    </div>

    <hr />

    <div className="container">

      { !isEditing && <ul className="todo-list list-group">
        { todos.map((todo) => (<li className="list-group-item d-flex w-100 justify-content-between align-items-center" key={todo.id}><List />
          <div className="todo-text">{ todo.text }</div>
          {" "}
          <div className="btn-group">
            <button className="btn btn-outline-primary" aria-label="Edit" onClick={() => handleEditClick(todo)}>Edit</button>
            <button className="btn btn-danger" aria-label="Remove" onClick={() => {
              handleDeleteClick(todo.id)
            }}><Trash3 /></button>
          </div>
        </li>))
        }
      </ul>
      }
    </div>
  
  </div>)
}
