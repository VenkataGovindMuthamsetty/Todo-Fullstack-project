import './index.css'
import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import TodoItem from '../TodoItem'
import axios from 'axios';


// const api = "http://localhost:3001/tasks"
const deployedApi = "https://to-do-application-assignment.onrender.com/tasks"


class SimpleTodos extends Component {
  state = {
    todoList: [],
    inputData: '',
  }
  
  componentDidMount = () => {
    this.fetchAllTasks()
  }

  fetchAllTasks = async () => {
    try{
        const response = await axios.get(deployedApi);
        if (response.status === 200){
            this.setState({todoList: response.data})
        }   
    }
    catch(err){
        console.log(`Network Error: ${err}`)
    }
       
 };

  deleteTodo = async (todoId) => {
    try{
        const {todoList} = this.state
        const filteredUsersData = todoList.filter(each => each.id !== todoId)
        this.setState({
        todoList: filteredUsersData,
        })
        await axios.delete(`${deployedApi}/${todoId}`);  
    } 
    catch(err){
        console.log(`Network Error: ${err}`)
    }   
  }
  onChangeInput = event => {
    this.setState({inputData: event.target.value})
  }
  onAddNewTask = async () => {
    try{
        const {inputData} = this.state;
        const newArr = {id: uuidv4(), description: inputData}
        this.setState(prev => ({
            todoList: [...prev.todoList, newArr],
        }));
        await axios.post(deployedApi, { description: inputData });
    }
    catch(err){
        console.log(`Network Error: ${err}`)
    }   
  }
  onCheckTask = async (id) => {
    try{
        const {todoList} = this.state;
        const newArr = todoList.map(each => {
            if(each.id === id){
                return {...each, completed: !each.completed}
            }
            else{
                return each
            }
        })
        this.setState({todoList: newArr})

        const task = todoList.find(each => each.id === id)
        await axios.put(`${deployedApi}/${id}`, { completed: !task.completed});
    }
    catch(err){
        console.log(`Network Error: ${err}`)
    } 
  }


  onSaveExitingTask = async (id, taskTitle) => {
    try{
        const {todoList} = this.state
        const newUpdatedList = todoList.map(each => {
        if (each.id === id) {
            return {...each, description: taskTitle}
        } else {
            return each
        }
        })
        this.setState({todoList: newUpdatedList})
        await axios.put(`${deployedApi}/update/${id}`, {description: taskTitle})
    }
    catch(err){
        console.log(`Network Error: ${err}`)
    } 
  }
  render() {
    const {todoList, inputData, isEdit} = this.state
    return (
    <>
      <nav className='nav-bar'>
          <img className='log-img' src='https://shanture.com/wp-content/uploads/2024/06/cropped-2-180x131.png' />
      </nav>
      <div className='bg-container'>
        <div className='todo-card'>
          <h1 className='heading'>Simple Todos</h1>
          <div className='input-div-container'>
            <input
              type='text'
              className='input'
              placeholder='Add Task'
              value={inputData}
              onChange={this.onChangeInput}
            />
            <button onClick={this.onAddNewTask} className='add-task-btn'>
              Add
            </button>
          </div>
          <ul className='todo'>
            {todoList.map(eachTodo => (
              <TodoItem
                key={eachTodo.id}
                todoList={eachTodo}
                onEditedTask={this.onSaveExitingTask}
                deleteTodo={this.deleteTodo}
                onCheckTask={this.onCheckTask}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
    )
  }
}

export default SimpleTodos