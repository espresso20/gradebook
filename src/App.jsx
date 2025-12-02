import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import db from './lib/store'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import StudentProfile from './pages/StudentProfile'
import CourseView from './pages/CourseView'
import Attendance from './pages/Attendance'
import Settings from './pages/Settings'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })

  useEffect(() => {
    // Load initial data
    const loadedStudents = db.getStudents()
    setStudents(loadedStudents)
    setLoading(false)
  }, [])

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const refreshStudents = () => {
    setStudents(db.getStudents())
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-gray-900">
        <div className="text-warmgray-500 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  // If no students, show welcome/onboarding
  if (students.length === 0) {
    return <Welcome onStudentAdded={refreshStudents} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  }

  return (
    <Layout students={students} onStudentsChange={refreshStudents} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Routes>
        <Route path="/" element={<Dashboard students={students} />} />
        <Route
          path="/student/:studentId"
          element={<StudentProfile onUpdate={refreshStudents} />}
        />
        <Route
          path="/student/:studentId/course/:courseId"
          element={<CourseView />}
        />
        <Route
          path="/student/:studentId/attendance"
          element={<Attendance />}
        />
        <Route
          path="/settings"
          element={<Settings onUpdate={refreshStudents} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
