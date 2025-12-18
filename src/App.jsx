import { useState, useEffect } from 'react'
import './App.css'
import Addtask from './addtask'
import ThreeBackground from './components/ThreeBackground'
import Login from './components/Login'
import { supabase } from './supabaseClient'
import { useAuth } from './contexts/AuthContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')
  const { currentUser, logout } = useAuth()

  useEffect(() => {
    if (currentUser) {
      fetchTasks()
    } else {
      setTasks([])
    }
  }, [currentUser])

  async function fetchTasks() {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  function handleInputChange(e) {
    setInputValue(e.target.value)
  }

  async function addTask() {
    if (inputValue.trim() === '') return
    if (!currentUser) {
      toast.error("Please login to add tasks")
      return
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ task: inputValue, user_id: currentUser.id, is_completed: false }])
        .select()

      if (error) throw error

      setTasks([data[0], ...tasks])
      setInputValue('')
      toast.success("Task added!")
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error("Failed to add task")
    }
  }

  async function deleteTask(id) {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTasks(tasks.filter(task => task.id !== id))
      toast.info("Task deleted")
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error("Failed to delete task")
    }
  }

  async function toggleTask(id, isCompleted) {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_completed: !isCompleted })
        .eq('id', id)

      if (error) throw error

      setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !isCompleted } : t))
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error("Failed to update task")
    }
  }

  async function handleLogout() {
    try {
      await logout()
      toast.info("Logged out")
    } catch (error) {
      console.error("Failed to logout", error)
    }
  }

  return (
    <>
      <ThreeBackground />
      <ToastContainer theme="dark" position="bottom-right" />
      <div className="app-container">
        <motion.h1
          className="title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Todo Pro
        </motion.h1>

        {currentUser && (
          <motion.div
            className="user-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>{currentUser.email}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!currentUser ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Login />
            </motion.div>
          ) : (
            <motion.div
              className="glass-panel"
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Addtask add={addTask} inputvalue={inputValue} vlueofinput={handleInputChange} />
              <ul className="task-list">
                <AnimatePresence initial={false}>
                  {tasks.map((item) => (
                    <motion.li
                      key={item.id}
                      className={`task-item ${item.is_completed ? 'completed' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <span>{item.task}</span>
                      <div className="actions">
                        <button className="btn-done" onClick={() => toggleTask(item.id, item.is_completed)}>
                          {item.is_completed ? 'Undo' : 'Done'}
                        </button>
                        <button className="btn-delete" onClick={() => deleteTask(item.id)}>Delete</button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default App
