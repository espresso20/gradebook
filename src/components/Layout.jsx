import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Home,
  Settings,
  Users,
  Plus,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Moon,
  Sun
} from 'lucide-react'
import db from '../lib/store'
import AddStudentModal from './AddStudentModal'

export default function Layout({ children, students, onStudentsChange, darkMode, toggleDarkMode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddStudent, setShowAddStudent] = useState(false)
  const navigate = useNavigate()

  const handleAddStudent = (studentData) => {
    const newStudent = db.addStudent(studentData)
    setShowAddStudent(false)
    onStudentsChange()
    navigate(`/student/${newStudent.id}`)
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-700 dark:bg-gray-900 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-warmgray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-warmgray-100 dark:border-gray-700
        transform transition-transform duration-200 ease-out
        lg:translate-x-0 lg:static lg:z-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-warmgray-100 dark:border-gray-700 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-terracotta-500 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-display text-lg font-semibold text-warmgray-800 dark:text-gray-100 dark:text-gray-100">
                  Gradebook
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 text-warmgray-400 dark:text-gray-500 dark:text-gray-400 hover:text-warmgray-600 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 overflow-y-auto">
            {/* Main nav */}
            <div className="space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-terracotta-50 dark:bg-terracotta-900/50 text-terracotta-600 dark:text-terracotta-400'
                    : 'text-warmgray-600 dark:text-gray-300 hover:bg-warmgray-100 dark:hover:bg-gray-700'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Home className="w-5 h-5" />
                Dashboard
              </NavLink>
            </div>

            {/* Students section */}
            <div className="mt-6">
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-xs font-semibold text-warmgray-400 dark:text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                  Students
                </span>
                <button
                  onClick={() => setShowAddStudent(true)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-warmgray-400 dark:text-gray-500 dark:text-gray-400 hover:text-terracotta-500 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/30 transition-colors"
                  title="Add student"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {students.map(student => (
                  <NavLink
                    key={student.id}
                    to={`/student/${student.id}`}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-terracotta-50 dark:bg-terracotta-900/50 text-terracotta-600 dark:text-terracotta-400'
                        : 'text-warmgray-600 dark:text-gray-300 hover:bg-warmgray-100 dark:hover:bg-gray-700'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white text-xs font-semibold">
                      {student.first_name.charAt(0)}
                    </div>
                    <span className="truncate">
                      {student.first_name} {student.last_name}
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>

          {/* Bottom nav */}
          <div className="p-3 border-t border-warmgray-100 dark:border-gray-700 dark:border-gray-700 space-y-1">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-warmgray-600 dark:text-gray-300 dark:text-gray-300 hover:bg-warmgray-100 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <>
                  <Sun className="w-5 h-5" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  Dark Mode
                </>
              )}
            </button>
            <NavLink
              to="/settings"
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-terracotta-50 dark:bg-terracotta-900/50 text-terracotta-600 dark:text-terracotta-400'
                  : 'text-warmgray-600 dark:text-gray-300 hover:bg-warmgray-100 dark:hover:bg-gray-700'
                }
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <Settings className="w-5 h-5" />
              Settings
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-warmgray-100 dark:border-gray-700 dark:border-gray-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -m-2 text-warmgray-600 dark:text-gray-300 dark:text-gray-300"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-terracotta-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-warmgray-800 dark:text-gray-100 dark:text-gray-100">Gradebook</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 -m-2 text-warmgray-600 dark:text-gray-300 dark:text-gray-300"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddStudent}
        onClose={() => setShowAddStudent(false)}
        onSubmit={handleAddStudent}
      />
    </div>
  )
}
