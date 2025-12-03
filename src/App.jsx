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
import Help from './pages/Help'

function App() {
  const [students, setStudents] = useState([])
  const [schoolYears, setSchoolYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })

  useEffect(() => {
    // Load initial data
    loadData()
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

  const loadData = () => {
    setStudents(db.getStudents())
    setSchoolYears(db.getSchoolYears())
    setLoading(false)
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

  const activeYear = schoolYears.find(y => y.is_active)

  return (
    <Layout
      students={students}
      schoolYears={schoolYears}
      activeYear={activeYear}
      onUpdate={loadData}
    >
      <Routes>
        {students.length === 0 ? (
          <>
            <Route path="/" element={<Welcome />} />
            <Route path="/settings" element={<Settings onUpdate={loadData} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard students={students} />} />
            <Route
              path="/student/:studentId"
              element={<StudentProfile onUpdate={loadData} />}
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
              element={<Settings onUpdate={loadData} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
            />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Layout>
  )
}

export default App
